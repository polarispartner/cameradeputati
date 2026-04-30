#!/usr/bin/env node
import { createHash } from 'node:crypto'
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pdf } from 'pdf-to-img'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')
const SRC_DIR = join(ROOT, 'pdfs')
const OUT_DIR = join(ROOT, 'src', 'assets', 'pdfs')
const MANIFEST = join(OUT_DIR, 'manifest.js')
const SCALE = 2

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

async function main() {
  if (!existsSync(SRC_DIR)) {
    console.log(`[render-pdfs] no source folder at ${relative(ROOT, SRC_DIR)} — skipping (using committed output)`)
    return
  }
  const pdfPaths = await walk(SRC_DIR)
  if (pdfPaths.length === 0) {
    console.log(`[render-pdfs] no PDFs in ${relative(ROOT, SRC_DIR)} — skipping (using committed output)`)
    return
  }
  pdfPaths.sort()

  await mkdir(OUT_DIR, { recursive: true })

  const entries = []
  for (const srcPath of pdfPaths) {
    const rel = relative(SRC_DIR, srcPath).replace(/\\/g, '/')
    const id = rel.replace(/\.pdf$/i, '')
    const outDir = join(OUT_DIR, id)
    const hash = await hashFile(srcPath)

    let pageFiles
    const cache = await readCache(outDir)
    if (cache && cache.hash === hash && Array.isArray(cache.pages)) {
      const allExist = cache.pages.every((p) => existsSync(join(outDir, p)))
      if (allExist) {
        pageFiles = cache.pages
        console.log(`[render-pdfs] cache hit: ${id} (${pageFiles.length} pages)`)
      }
    }
    if (!pageFiles) {
      console.log(`[render-pdfs] rendering: ${id}`)
      pageFiles = await renderPdf(srcPath, outDir)
      await writeCache(outDir, { hash, pages: pageFiles })
    }
    entries.push({ id, outDir, pages: pageFiles })
  }

  // Generate manifest.js
  const lines = ['// auto-generato da scripts/render-pdfs.mjs — non modificare', '']
  const mapEntries = []
  for (const { id, outDir, pages } of entries) {
    const baseIdent = jsIdent(id)
    const importNames = pages.map((_, idx) => `${baseIdent}_p${idx + 1}`)
    pages.forEach((file, idx) => {
      const rel = './' + relative(OUT_DIR, join(outDir, file)).replace(/\\/g, '/')
      lines.push(`import ${importNames[idx]} from '${rel}'`)
    })
    mapEntries.push(`  ${JSON.stringify(id)}: [${importNames.join(', ')}],`)
  }
  lines.push('')
  lines.push('export const PDF_PAGES = {')
  lines.push(...mapEntries)
  lines.push('}')
  lines.push('')
  await writeFile(MANIFEST, lines.join('\n'))
  console.log(`[render-pdfs] wrote ${relative(ROOT, MANIFEST)} (${entries.length} pdf${entries.length === 1 ? '' : 's'})`)
}

main().catch((err) => {
  console.error('[render-pdfs] failed:', err)
  process.exit(1)
})
