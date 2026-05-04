#!/usr/bin/env node
import { createHash } from 'node:crypto'
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, relative, resolve, basename, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import mammoth from 'mammoth'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')
const SRC_ROOT = join(ROOT, 'contents')
const APPS_DIR = join(ROOT, 'src', 'apps')
const MAX_WIDTH = 3840
const JPG_QUALITY = 82
const THUMB_WIDTH = 640
const THUMB_QUALITY = 70

// Per-app, per-topic config: maps source folder names → content.js ids.
// Add new app/topic entries here when new contents arrive.
const APP_TOPICS = {
  tavolo: {
    referendum: {
      sections: {
        '1. LA CAMPAGNA': 'campagna',
        '2. IL VOTO': 'voto',
        '3. I RISULTATI': 'risultati',
      },
    },
    // donne: { sections: { ... } },
    // consulta: { sections: { ... } },
    // costituente: { sections: { ... } },
  },
  // 'totem-costituzione': { ... },
  // 'totem-b': { ... },
}

// Subtype folder name → content.js sub.type (shared across topics)
const SUBTYPE_MAP = {
  STAMPA: 'giornale',
  'FOTO-VIDEO': 'foto',
  DOCUMENTI: 'documenti',
}

const IMG_EXT = new Set(['.jpg', '.jpeg', '.png'])
const TIFF_EXT = new Set(['.tif', '.tiff'])
const SKIP_FILES = new Set(['.DS_Store', 'Thumbs.db'])

function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'item'
}

function stripPrefix(name) {
  return name.replace(/^\s*\d+\s*\.?\s*/, '').trim()
}

async function listDir(dir) {
  try {
    return await readdir(dir, { withFileTypes: true })
  } catch (err) {
    if (err.code === 'ENOENT') return []
    throw err
  }
}

async function isLeafFolder(dir) {
  const entries = await listDir(dir)
  const hasSubdir = entries.some((e) => e.isDirectory())
  const hasContentFile = entries.some(
    (e) => e.isFile() && !SKIP_FILES.has(e.name) && !e.name.endsWith('.~tmp'),
  )
  return !hasSubdir && hasContentFile
}

async function collectLeaves(dir) {
  const out = []
  const entries = await listDir(dir)
  if (await isLeafFolder(dir)) {
    out.push(dir)
    return out
  }
  for (const e of entries) {
    if (!e.isDirectory()) continue
    out.push(...(await collectLeaves(join(dir, e.name))))
  }
  return out
}

async function hashFile(path) {
  const buf = await readFile(path)
  return createHash('sha1').update(buf).digest('hex')
}

async function readCache(dir) {
  const file = join(dir, '.cache.json')
  if (!existsSync(file)) return null
  try {
    return JSON.parse(await readFile(file, 'utf8'))
  } catch {
    return null
  }
}

async function writeCache(dir, data) {
  await writeFile(join(dir, '.cache.json'), JSON.stringify(data, null, 2))
}

async function extractDocxText(path) {
  try {
    const { value } = await mammoth.extractRawText({ path })
    return value.replace(/\s+/g, ' ').trim()
  } catch (err) {
    console.warn(`[ingest] docx read failed: ${relative(ROOT, path)} (${err.message})`)
    return ''
  }
}

async function processImage(srcPath, outFullPath, outThumbPath) {
  await mkdir(dirname(outFullPath), { recursive: true })
  const pipeline = sharp(srcPath, { unlimited: true })
  await pipeline
    .clone()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: JPG_QUALITY, mozjpeg: true })
    .toFile(outFullPath)
  await pipeline
    .clone()
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: THUMB_QUALITY, mozjpeg: true })
    .toFile(outThumbPath)
}

function jsIdent(s) {
  return s.replace(/[^a-zA-Z0-9_$]/g, '_')
}

async function ingestTopic(app, topicId, topicConfig, allImports, counterRef) {
  const outRoot = join(APPS_DIR, app, 'assets', 'images', 'contents')
  const topicSrcDir = join(SRC_ROOT, app, topicId)
  if (!existsSync(topicSrcDir)) {
    console.log(`[ingest] ${app}/${topicId}: no source — skipping`)
    return null
  }
  const topicResult = {}

  const sectionDirs = await listDir(topicSrcDir)
  for (const sec of sectionDirs) {
    if (!sec.isDirectory()) continue
    const secId = topicConfig.sections[sec.name]
    if (!secId) {
      console.warn(`[ingest] ${app}/${topicId}: skipping unknown section folder: ${sec.name}`)
      continue
    }
    topicResult[secId] = topicResult[secId] || {}
    const secDir = join(topicSrcDir, sec.name)

    const subDirs = await listDir(secDir)
    for (const sub of subDirs) {
      if (!sub.isDirectory()) continue
      const subType = SUBTYPE_MAP[sub.name]
      if (!subType) {
        console.warn(`[ingest] ${app}/${topicId}: skipping unknown subtype folder: ${sec.name}/${sub.name}`)
        continue
      }
      const subDir = join(secDir, sub.name)
      const leaves = await collectLeaves(subDir)
      leaves.sort((a, b) => a.localeCompare(b, 'it', { numeric: true }))

      const items = []
      for (const leafDir of leaves) {
        const folderName = basename(leafDir)
        const title = stripPrefix(folderName)
        const slug = slugify(folderName)
        const id = `${topicId}-${secId}-${subType}-${slug}`

        const entries = await listDir(leafDir)
        const files = entries
          .filter(
            (e) =>
              e.isFile() &&
              !SKIP_FILES.has(e.name) &&
              !e.name.endsWith('.~tmp') &&
              !e.name.startsWith('~$') &&
              !e.name.startsWith('~') &&
              e.name.charCodeAt(0) !== 0xfffd,
          )
          .map((e) => e.name)
          .sort((a, b) => a.localeCompare(b, 'it', { numeric: true }))

        const imageFiles = files.filter((f) => {
          const ext = extname(f).toLowerCase()
          return IMG_EXT.has(ext) || TIFF_EXT.has(ext)
        })
        const docxFile = files.find((f) => extname(f).toLowerCase() === '.docx')

        if (imageFiles.length === 0) {
          console.warn(`[ingest] no image in: ${relative(ROOT, leafDir)} — skipping`)
          continue
        }

        const itemOutDir = join(outRoot, topicId, secId, subType, slug)
        await mkdir(itemOutDir, { recursive: true })

        const inputHashes = {}
        for (const f of [...imageFiles, ...(docxFile ? [docxFile] : [])]) {
          inputHashes[f] = await hashFile(join(leafDir, f))
        }
        const cache = await readCache(itemOutDir)
        const cacheValid =
          cache &&
          cache.version === 2 &&
          JSON.stringify(cache.inputs) === JSON.stringify(inputHashes) &&
          Array.isArray(cache.pages) &&
          cache.pages.length === imageFiles.length &&
          Array.isArray(cache.thumbs) &&
          cache.thumbs.length === imageFiles.length &&
          cache.pages.every((p) => existsSync(join(itemOutDir, p))) &&
          cache.thumbs.every((p) => existsSync(join(itemOutDir, p)))

        let pageFiles
        let thumbFiles
        if (cacheValid) {
          pageFiles = cache.pages
          thumbFiles = cache.thumbs
        } else {
          pageFiles = []
          thumbFiles = []
          for (let i = 0; i < imageFiles.length; i++) {
            const src = join(leafDir, imageFiles[i])
            const stem = `page-${String(i + 1).padStart(2, '0')}`
            const fullName = `${stem}.jpg`
            const thumbName = `${stem}-thumb.jpg`
            await processImage(src, join(itemOutDir, fullName), join(itemOutDir, thumbName))
            pageFiles.push(fullName)
            thumbFiles.push(thumbName)
          }
          console.log(`[ingest] ${app}/${topicId}/${secId}/${subType}/${slug} (${pageFiles.length}p)`)
        }

        let description = ''
        if (docxFile) {
          description = await extractDocxText(join(leafDir, docxFile))
        }

        await writeCache(itemOutDir, { version: 2, inputs: inputHashes, pages: pageFiles, thumbs: thumbFiles, description })

        const baseIdent = `c${counterRef.n++}_${jsIdent(slug).slice(0, 20)}`
        const pageIdents = pageFiles.map((_, idx) => `${baseIdent}_p${idx + 1}`)
        const thumbIdent = `${baseIdent}_t`
        pageFiles.forEach((file, idx) => {
          const rel = './' + relative(outRoot, join(itemOutDir, file)).replace(/\\/g, '/')
          allImports.push({ ident: pageIdents[idx], relPath: rel })
        })
        const thumbRel = './' + relative(outRoot, join(itemOutDir, thumbFiles[0])).replace(/\\/g, '/')
        allImports.push({ ident: thumbIdent, relPath: thumbRel })

        items.push({ id, title, description, pageIdents, thumbIdent })
      }
      if (items.length > 0) {
        topicResult[secId][subType] = items
      }
    }
  }
  return topicResult
}

async function ingestApp(app, topics) {
  const outRoot = join(APPS_DIR, app, 'assets', 'images', 'contents')
  const appSrcDir = join(SRC_ROOT, app)
  if (!existsSync(appSrcDir)) {
    console.log(`[ingest] ${app}: no source folder — skipping`)
    return
  }
  await mkdir(outRoot, { recursive: true })

  const allImports = []
  const counterRef = { n: 0 }
  const topicResults = {}

  for (const [topicId, topicConfig] of Object.entries(topics)) {
    const result = await ingestTopic(app, topicId, topicConfig, allImports, counterRef)
    if (result) topicResults[topicId] = result
  }

  const lines = ['// auto-generato da scripts/ingest-contents.mjs — non modificare', '']
  for (const { ident, relPath } of allImports) {
    lines.push(`import ${ident} from '${relPath}'`)
  }
  lines.push('')
  lines.push('export const TOPIC_ITEMS = {')
  for (const topicId of Object.keys(topicResults)) {
    lines.push(`  ${topicId}: {`)
    const topic = topicResults[topicId]
    for (const secId of Object.keys(topic)) {
      lines.push(`    ${secId}: {`)
      for (const subType of Object.keys(topic[secId])) {
        lines.push(`      ${subType}: [`)
        for (const it of topic[secId][subType]) {
          const pagesArr = `[${it.pageIdents.join(', ')}]`
          lines.push(
            `        { id: ${JSON.stringify(it.id)}, title: ${JSON.stringify(it.title)}, description: ${JSON.stringify(it.description)}, thumb: ${it.thumbIdent}, pages: ${pagesArr} },`,
          )
        }
        lines.push('      ],')
      }
      lines.push('    },')
    }
    lines.push('  },')
  }
  lines.push('}')
  lines.push('')
  const manifestPath = join(outRoot, 'manifest.js')
  await writeFile(manifestPath, lines.join('\n'))

  let total = 0
  for (const topicId of Object.keys(topicResults)) {
    for (const secId of Object.keys(topicResults[topicId])) {
      for (const subType of Object.keys(topicResults[topicId][secId])) {
        const n = topicResults[topicId][secId][subType].length
        total += n
        console.log(`  ${app}/${topicId}/${secId}/${subType}: ${n}`)
      }
    }
  }
  console.log(`[ingest] ${app}: wrote ${relative(ROOT, manifestPath)} (${total} items)`)
}

async function main() {
  if (!existsSync(SRC_ROOT)) {
    console.log(`[ingest] no source folder at ${relative(ROOT, SRC_ROOT)} — skipping`)
    return
  }
  for (const [app, topics] of Object.entries(APP_TOPICS)) {
    await ingestApp(app, topics)
  }
}

main().catch((err) => {
  console.error('[ingest] failed:', err)
  process.exit(1)
})
