import { describe, it, expect } from 'vitest'
import sharp from 'sharp'
import {
  optimizeImage,
  validateImageFile,
  ALLOWED_TYPES,
  MAX_FILE_SIZE,
} from '@/lib/image-optimize'

// ---------------------------------------------------------------------------
// Image optimization pipeline (tests/unit/image-optimize.test.ts)
// ---------------------------------------------------------------------------
// optimizeImage is exercised against REAL sharp — mocking sharp would test
// nothing, since resize / WebP conversion / EXIF strip ARE the unit. Fixtures
// are generated in-memory with sharp itself, so there are no binary files to
// commit and the inputs are deterministic. validateImageFile is pure logic.
// ---------------------------------------------------------------------------

/** Build a solid-colour PNG of the given dimensions as a Buffer. */
async function makePng(width: number, height: number): Promise<Buffer> {
  return sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 120, g: 80, b: 40 },
    },
  })
    .png()
    .toBuffer()
}

describe('validateImageFile', () => {
  it('accepts every allowed MIME type', () => {
    for (const type of ALLOWED_TYPES) {
      expect(() => validateImageFile(type, 1024, 'photo')).not.toThrow()
    }
  })

  it('rejects a disallowed MIME type with a Romanian message', () => {
    expect(() => validateImageFile('application/pdf', 1024, 'doc.pdf')).toThrow(
      /Tip de fișier nepermis/,
    )
  })

  it('rejects a file larger than the max size and names the file', () => {
    expect(() =>
      validateImageFile('image/png', MAX_FILE_SIZE + 1, 'huge.png'),
    ).toThrow(/huge\.png.*prea mare/s)
  })

  it('accepts a file exactly at the max size (boundary)', () => {
    expect(() =>
      validateImageFile('image/png', MAX_FILE_SIZE, 'edge.png'),
    ).not.toThrow()
  })
})

describe('optimizeImage', () => {
  it('always outputs WebP regardless of input format', async () => {
    const result = await optimizeImage(await makePng(400, 300))
    expect(result.contentType).toBe('image/webp')
    expect(result.extension).toBe('.webp')

    const meta = await sharp(result.buffer).metadata()
    expect(meta.format).toBe('webp')
  })

  it('caps width at 1200px and preserves aspect ratio for oversize images', async () => {
    // 2400x1200 (2:1) → expected 1200x600
    const result = await optimizeImage(await makePng(2400, 1200))
    expect(result.width).toBe(1200)
    expect(result.height).toBe(600)
  })

  it('does not enlarge images already narrower than the max width', async () => {
    const result = await optimizeImage(await makePng(800, 500))
    expect(result.width).toBe(800)
    expect(result.height).toBe(500)
  })

  it('strips EXIF metadata from the output', async () => {
    // Embed EXIF (incl. an orientation tag) on the input, then confirm it is gone.
    const withExif = await sharp(await makePng(600, 400))
      .withMetadata({ exif: { IFD0: { Copyright: 'SiteForge Test' } } })
      .jpeg()
      .toBuffer()

    const inputMeta = await sharp(withExif).metadata()
    expect(inputMeta.exif).toBeDefined()

    const result = await optimizeImage(withExif)
    const outMeta = await sharp(result.buffer).metadata()
    expect(outMeta.exif).toBeUndefined()
  })

  it('reports output dimensions and byte size consistent with the buffer', async () => {
    const result = await optimizeImage(await makePng(500, 500))
    expect(result.size).toBe(result.buffer.byteLength)
    expect(result.width).toBe(500)
    expect(result.height).toBe(500)
  })
})
