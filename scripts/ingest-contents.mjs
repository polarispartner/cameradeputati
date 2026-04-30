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
const OUT_ROOT = join(ROOT, 'src', 'assets', 'images', 'contents')
const MANIFEST = join(OUT_ROOT, 'manifest.js')
const MAX_WIDTH = 3840 // 4K landscape — beyond this is wasted on the target display
const JPG_QUALITY = 82

// Per-topic config: maps source folder names → content.js ids.
// Add a new entry here when a new topic's contents arrive.
const TOPICS = {
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

async function processImage(srcPath, outPath) {
  await mkdir(dirname(outPath), { recursive: true })
  await sharp(srcPath, { unlimited: true })
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: JPG_QUALITY, mozjpeg: true })
    .toFile(outPath)
}

function jsIdent(s) {
  return s.replace(/[^a-zA-Z0-9_$]/g, '_')
}

async function ingestTopic(topicId, topicConfig, allImports, counterRef) {
  const topicSrcDir = join(SRC_ROOT, topicId)
  if (!existsSync(topicSrcDir)) {
    console.log(`[ingest] no source for topic "${topicId}" (${relative(ROOT, topicSrcDir)}) — skipping`)
    return null
  }
  const topicResult = {} // { sectionId: { subType: [items] } }

  const sectionDirs = await listDir(topicSrcDir)
  for (const sec of sectionDirs) {
    if (!sec.isDirectory()) continue
    const secId = topicConfig.sections[sec.name]
    if (!secId) {
      console.warn(`[ingest] ${topicId}: skipping unknown section folder: ${sec.name}`)
      continue
    }
    topicResult[secId] = topicResult[secId] || {}
    const secDir = join(topicSrcDir, sec.name)

    const subDirs = await listDir(secDir)
    for (const sub of subDirs) {
      if (!sub.isDirectory()) continue
      const subType = SUBTYPE_MAP[sub.name]
      if (!subType) {
        console.warn(`[ingest] ${topicId}: skipping unknown subtype folder: ${sec.name}/${sub.name}`)
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

        const outDir = join(OUT_ROOT, topicId, secId, subType, slug)
        await mkdir(outDir, { recursive: true })

        const inputHashes = {}
        for (const f of [...imageFiles, ...(docxFile ? [docxFile] : [])]) {
          inputHashes[f] = await hashFile(join(leafDir, f))
        }
        const cache = await readCache(outDir)
        const cacheValid =
          cache &&
          JSON.stringify(cache.inputs) === JSON.stringify(inputHashes) &&
          Array.isArray(cache.pages) &&
          cache.pages.length === imageFiles.length &&
          cache.pages.every((p) => existsSync(join(outDir, p)))

        let pageFiles
        if (cacheValid) {
          pageFiles = cache.pages
        } else {
          pageFiles = []
          for (let i = 0; i < imageFiles.length; i++) {
            const src = join(leafDir, imageFiles[i])
            const outName = `page-${String(i + 1).padStart(2, '0')}.jpg`
            await processImage(src, join(outDir, outName))
            pageFiles.push(outName)
          }
          console.log(`[ingest] ${topicId}/${secId}/${subType}/${slug} (${pageFiles.length}p)`)
        }

        let description = ''
        if (docxFile) {
          description = await extractDocxText(join(leafDir, docxFile))
        }

        await writeCache(outDir, { inputs: inputHashes, pages: pageFiles, description })

        const baseIdent = `c${counterRef.n++}_${jsIdent(slug).slice(0, 20)}`
        const importNames = pageFiles.map((_, idx) => `${baseIdent}_p${idx + 1}`)
        pageFiles.forEach((file, idx) => {
          const rel = './' + relative(OUT_ROOT, join(outDir, file)).replace(/\\/g, '/')
          allImports.push({ ident: importNames[idx], relPath: rel })
        })

        items.push({ id, title, description, importNames })
      }
      if (items.length > 0) {
        topicResult[secId][subType] = items
      }
    }
  }
  return topicResult
}

async function main() {
  if (!existsSync(SRC_ROOT)) {
    console.log(`[ingest] no source folder at ${relative(ROOT, SRC_ROOT)} — skipping`)
    return
  }
  await mkdir(OUT_ROOT, { recursive: true })

  const allImports = []
  const counterRef = { n: 0 }
  const topicResults = {} // { topicId: { sectionId: { subType: [items] } } }

  for (const [topicId, topicConfig] of Object.entries(TOPICS)) {
    const result = await ingestTopic(topicId, topicConfig, allImports, counterRef)
    if (result) topicResults[topicId] = result
  }

  // Write manifest.js
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
          const pagesArr = `[${it.importNames.join(', ')}]`
          lines.push(
            `        { id: ${JSON.stringify(it.id)}, title: ${JSON.stringify(it.title)}, description: ${JSON.stringify(it.description)}, image: ${it.importNames[0]}, pages: ${pagesArr} },`,
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
  await writeFile(MANIFEST, lines.join('\n'))

  let total = 0
  for (const topicId of Object.keys(topicResults)) {
    for (const secId of Object.keys(topicResults[topicId])) {
      for (const subType of Object.keys(topicResults[topicId][secId])) {
        const n = topicResults[topicId][secId][subType].length
        total += n
        console.log(`  ${topicId}/${secId}/${subType}: ${n}`)
      }
    }
  }
  console.log(`[ingest] wrote ${relative(ROOT, MANIFEST)} (${total} items)`)
}

main().catch((err) => {
  console.error('[ingest] failed:', err)
  process.exit(1)
})
