import { existsSync } from 'node:fs'
import { mkdir, readdir, stat } from 'node:fs/promises'
import { basename, extname, join, resolve } from 'node:path'
import sharp from 'sharp'

// ---------------------------------------------------------------------------
// scripts/optimize-photos.ts  (Phase E)
// ---------------------------------------------------------------------------
// Turns raw field photos into web-ready WebP for the ElectroWill gallery.
//
//   INPUT   photos-raw/hero/*      (gitignored — never committed)
//           photos-raw/gallery/*
//   OUTPUT  clients/electrowill-solutions/public/lucrari/*.webp
//
// Per file: auto-rotate from EXIF → resize (hero 1600px / gallery 900px wide,
// never upscaled) → WebP q80. Sharp does NOT copy metadata unless you call
// `.withMetadata()` — we never do, so EXIF **and GPS coordinates are stripped**.
//
// Output names are slugified (lowercase, ASCII, hyphens) so they are safe URLs;
// the slug is what you reference as `src` in `content/gallery.ts`
// (e.g. photos-raw/gallery/Priză de Pământ.JPG → /lucrari/priza-de-pamant.webp).
//
// Usage (no ACTIVE_CLIENT needed — paths are hardcoded to this client):
//   yarn tsx scripts/optimize-photos.ts
// Re-running is safe: it overwrites existing outputs.
// ---------------------------------------------------------------------------

const ROOT = resolve(__dirname, '..')
const RAW_DIR = join(ROOT, 'photos-raw')
const OUT_DIR = join(
  ROOT,
  'clients',
  'electrowill-solutions',
  'public',
  'lucrari',
)

// Source subfolder → max width. Landscape-first shoot; height scales to keep ratio.
const BUCKETS: Record<string, number> = {
  hero: 1600,
  gallery: 900,
}

const WEBP_QUALITY = 80
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff'])

// Romanian diacritics → ASCII, then non-alphanumerics → single hyphens.
function slugify(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip combining marks (ă â î ș ț → a a i s t)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function fmtKB(bytes: number): string {
  return `${(bytes / 1024).toFixed(0)} KB`
}

async function processBucket(bucket: string, maxWidth: number): Promise<number> {
  const srcDir = join(RAW_DIR, bucket)
  if (!existsSync(srcDir)) {
    console.log(`  (skip) no ${join('photos-raw', bucket)}/ folder`)
    return 0
  }

  const entries = await readdir(srcDir)
  const images = entries.filter((f) => IMAGE_EXT.has(extname(f).toLowerCase()))
  if (images.length === 0) {
    console.log(`  (skip) ${join('photos-raw', bucket)}/ has no images`)
    return 0
  }

  let count = 0
  for (const file of images) {
    const srcPath = join(srcDir, file)
    const outName = `${slugify(basename(file, extname(file)))}.webp`
    const outPath = join(OUT_DIR, outName)

    const [{ size: srcBytes }, info] = await Promise.all([
      stat(srcPath),
      // No `.withMetadata()` → EXIF/GPS are dropped. `.rotate()` bakes in the
      // EXIF orientation and clears the tag. `.toFile` returns the output info.
      sharp(srcPath)
        .rotate()
        .resize({ width: maxWidth, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toFile(outPath),
    ])

    console.log(
      `  ${file}  →  lucrari/${outName}  ` +
        `(${info.width}px, ${fmtKB(srcBytes)} → ${fmtKB(info.size)})`,
    )
    count++
  }
  return count
}

async function main(): Promise<void> {
  console.log('Optimizing ElectroWill work photos…')

  if (!existsSync(RAW_DIR)) {
    console.log(
      `\nNothing to do: create photos-raw/hero/ and photos-raw/gallery/ ` +
        `and drop the field photos in first.`,
    )
    return
  }

  await mkdir(OUT_DIR, { recursive: true })

  let total = 0
  for (const [bucket, maxWidth] of Object.entries(BUCKETS)) {
    console.log(`\n[${bucket}] max ${maxWidth}px`)
    total += await processBucket(bucket, maxWidth)
  }

  console.log(
    total > 0
      ? `\nDone — ${total} photo(s) → clients/electrowill-solutions/public/lucrari/. ` +
          `EXIF/GPS stripped. Now set each file's src in content/gallery.ts.`
      : `\nNo images found under photos-raw/{hero,gallery}/.`,
  )
}

main().catch((err) => {
  console.error('optimize-photos failed:', err)
  process.exit(1)
})
