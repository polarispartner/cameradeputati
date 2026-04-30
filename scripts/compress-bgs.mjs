#!/usr/bin/env node
import { createHash } from 'node:crypto'
import { readFile, writeFile, rename, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')
const IMG_DIR = join(ROOT, 'src', 'assets', 'images')
const CACHE = join(IMG_DIR, '.bgs.cache.json')

const MAX_WIDTH = 3840
const QUALITY = 72

const FILES = [
  'homepage-bg.jpg',
  'menu-bg.jpg',
  'ruolo-donne-bg.jpg',
  'consulta-bg.jpg',
  'referendum-bg.jpg',
  'costituente-bg.jpg',
]

async function hashFile(path) {
  return createHash('sha1').update(await readFile(path)).digest('hex')
}

async function readCache() {
  if (!existsSync(CACHE)) return {}
  try { return JSON.parse(await readFile(CACHE, 'utf8')) } catch { return {} }
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

async function main() {
  const cache = await readCache()
  const next = {}
  let savedTotal = 0

  for (const name of FILES) {
    const path = join(IMG_DIR, name)
    if (!existsSync(path)) {
      console.warn(`[compress-bgs] missing: ${name}`)
      continue
    }
    const before = (await stat(path)).size
    const beforeHash = await hashFile(path)

    if (cache[name]?.outHash === beforeHash) {
      console.log(`[compress-bgs] skip (already compressed): ${name} (${fmtKB(before)})`)
      next[name] = cache[name]
      continue
    }

    await compress(path)
    const after = (await stat(path)).size
    const afterHash = await hashFile(path)
    next[name] = { outHash: afterHash }
    savedTotal += before - after
    console.log(
      `[compress-bgs] ${name}: ${fmtKB(before)} → ${fmtKB(after)} (-${fmtKB(before - after)})`,
    )
  }

  await writeFile(CACHE, JSON.stringify(next, null, 2))
  if (savedTotal > 0) {
    console.log(`[compress-bgs] total saved: ${fmtKB(savedTotal)}`)
  }
}

main().catch((err) => {
  console.error('[compress-bgs] failed:', err)
  process.exit(1)
})
