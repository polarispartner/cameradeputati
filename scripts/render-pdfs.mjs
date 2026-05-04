#!/usr/bin/env node
import { createHash } from 'node:crypto'
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pdf } from 'pdf-to-img'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')
const SRC_ROOT = join(ROOT, 'pdfs')
const APPS_DIR = join(ROOT, 'src', 'apps')
const SCALE = 2

async function listApps() {
  if (!existsSync(SRC_ROOT)) return []
  const entries = await readdir(SRC_ROOT, { withFileTypes: true })
  return entries.filter((e) => e.isDirectory()).map((e) => e.name)
}

async function walk(dir) {
  const out = []
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch (err) {
    if (err.code === 'ENOENT') return out
    throw err
  }
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(full)))
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.pdf')) out.push(full)
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

async function renderPdf(srcPath, outDir) {
  await mkdir(outDir, { recursive: true })
  const document = await pdf(srcPath, { scale: SCALE })
  const pages = []
  let i = 0
  for await (const page of document) {
    i += 1
    const filename = `page-${String(i).padStart(2, '0')}.png`
    await writeFile(join(outDir, filename), page)
    pages.push(filename)
  }
  return pages
}

function jsIdent(s) {
  return s.replace(/[^a-zA-Z0-9_$]/g, '_')
}

async function renderApp(appName) {
  const srcDir = join(SRC_ROOT, appName)
  const outDir = join(APPS_DIR, appName, 'assets', 'pdfs')
  const manifestPath = join(outDir, 'manifest.js')
  const pdfPaths = await walk(srcDir)
  if (pdfPaths.length === 0) {
    console.log(`[render-pdfs] ${appName}: no PDFs — skipping`)
    return
  }
  pdfPaths.sort()
  await mkdir(outDir, { recursive: true })

  const entries = []
  for (const srcPath of pdfPaths) {
    const rel = relative(srcDir, srcPath).replace(/\\/g, '/')
    const id = rel.replace(/\.pdf$/i, '')
    const itemDir = join(outDir, id)
    const hash = await hashFile(srcPath)

    let pageFiles
    const cache = await readCache(itemDir)
    if (cache && cache.hash === hash && Array.isArray(cache.pages)) {
      const allExist = cache.pages.every((p) => existsSync(join(itemDir, p)))
      if (allExist) {
        pageFiles = cache.pages
        console.log(`[render-pdfs] ${appName} cache hit: ${id} (${pageFiles.length}p)`)
      }
    }
    if (!pageFiles) {
      console.log(`[render-pdfs] ${appName} rendering: ${id}`)
      pageFiles = await renderPdf(srcPath, itemDir)
      await writeCache(itemDir, { hash, pages: pageFiles })
    }
    entries.push({ id, itemDir, pages: pageFiles })
  }

  const lines = ['// auto-generato da scripts/render-pdfs.mjs — non modificare', '']
  const mapEntries = []
  for (const { id, itemDir, pages } of entries) {
    const baseIdent = jsIdent(id)
    const importNames = pages.map((_, idx) => `${baseIdent}_p${idx + 1}`)
    pages.forEach((file, idx) => {
      const rel = './' + relative(outDir, join(itemDir, file)).replace(/\\/g, '/')
      lines.push(`import ${importNames[idx]} from '${rel}'`)
    })
    mapEntries.push(`  ${JSON.stringify(id)}: [${importNames.join(', ')}],`)
  }
  lines.push('')
  lines.push('export const PDF_PAGES = {')
  lines.push(...mapEntries)
  lines.push('}')
  lines.push('')
  await writeFile(manifestPath, lines.join('\n'))
  console.log(
    `[render-pdfs] ${appName}: wrote ${relative(ROOT, manifestPath)} (${entries.length} pdf${entries.length === 1 ? '' : 's'})`,
  )
}

async function main() {
  const apps = await listApps()
  if (apps.length === 0) {
    console.log(`[render-pdfs] no source folders under ${relative(ROOT, SRC_ROOT)}/ — skipping`)
    return
  }
  for (const app of apps) {
    await renderApp(app)
  }
}

main().catch((err) => {
  console.error('[render-pdfs] failed:', err)
  process.exit(1)
})
