#!/usr/bin/env node
import { createHash } from 'node:crypto'
import { readdir, readFile, writeFile, rename, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')
const APPS_DIR = join(ROOT, 'src', 'apps')
const SHARED_DIR = join(ROOT, 'src', 'shared', 'assets')

const MAX_WIDTH = 3840
const QUALITY = 72

async function hashFile(path) {
  return createHash('sha1').update(await readFile(path)).digest('hex')
}

async function readCache(file) {
  if (!existsSync(file)) return {}
  try { return JSON.parse(await readFile(file, 'utf8')) } catch { return {} }
}

async function compress(src) {
  const tmp = src + '.tmp'
  await sharp(src, { unlimited: true })
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(tmp)
  await rename(tmp, src)
}

function fmtKB(bytes) {
  return `${Math.round(bytes / 1024)} KB`
}

async function findBgs(dir) {
  // Find all *-bg.jpg / *-bg-*.jpg under dir (one level deep into known image roots)
  const out = []
  if (!existsSync(dir)) return out
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) continue
    if (/-bg(-\d+x?)?\.jpg$/i.test(entry.name) || entry.name === 'homepage-bg.jpg') {
      out.push(join(dir, entry.name))
    }
  }
  return out
}

async function processDir(label, dir, cacheFile) {
  const files = await findBgs(dir)
  if (files.length === 0) return 0
  const cache = await readCache(cacheFile)
  const next = {}
  let saved = 0
  for (const path of files) {
    const name = path.replace(dir + '/', '')
    const before = (await stat(path)).size
    const beforeHash = await hashFile(path)
    if (cache[name]?.outHash === beforeHash) {
      console.log(`[compress-bgs] ${label} skip (already): ${name} (${fmtKB(before)})`)
      next[name] = cache[name]
      continue
    }
    await compress(path)
    const after = (await stat(path)).size
    next[name] = { outHash: await hashFile(path) }
    saved += before - after
    console.log(`[compress-bgs] ${label} ${name}: ${fmtKB(before)} → ${fmtKB(after)} (-${fmtKB(before - after)})`)
  }
  await writeFile(cacheFile, JSON.stringify(next, null, 2))
  return saved
}

async function main() {
  let total = 0
  // Shared bgs
  total += await processDir('shared', SHARED_DIR, join(SHARED_DIR, '.bgs.cache.json'))
  // Per-app bgs in src/apps/<app>/assets/images/
  if (existsSync(APPS_DIR)) {
    for (const e of await readdir(APPS_DIR, { withFileTypes: true })) {
      if (!e.isDirectory()) continue
      const imgDir = join(APPS_DIR, e.name, 'assets', 'images')
      total += await processDir(e.name, imgDir, join(imgDir, '.bgs.cache.json'))
    }
  }
  if (total > 0) console.log(`[compress-bgs] total saved: ${fmtKB(total)}`)
}

main().catch((err) => {
  console.error('[compress-bgs] failed:', err)
  process.exit(1)
})
