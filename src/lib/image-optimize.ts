import sharp from 'sharp'

// ---------------------------------------------------------------------------
// Image Optimization Pipeline
// ---------------------------------------------------------------------------
// Processes uploaded images before storing in R2:
// 1. Resize to max width (preserves aspect ratio)
// 2. Convert to WebP format (best quality/size ratio)
// 3. Strip EXIF data (privacy + smaller file size)
// ---------------------------------------------------------------------------

/** Max width in pixels — images wider than this get resized proportionally */
const MAX_WIDTH = 1200

/** WebP quality — 80 is a good balance of quality and size */
const WEBP_QUALITY = 80

/** Allowed MIME types for upload */
export const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
])

/** Max file size in bytes (5MB) */
export const MAX_FILE_SIZE = 5 * 1024 * 1024

interface OptimizeResult {
  /** Optimized image as Buffer */
  buffer: Buffer
  /** Output MIME type (always image/webp) */
  contentType: string
  /** Output file extension (always .webp) */
  extension: string
  /** Width of the output image */
  width: number
  /** Height of the output image */
  height: number
  /** Size in bytes of the output */
  size: number
}

/**
 * Optimize an image: resize, convert to WebP, strip metadata.
 *
 * @param input - Raw image file as Buffer
 * @returns Optimized image data and metadata
 */
export async function optimizeImage(input: Buffer): Promise<OptimizeResult> {
  const image = sharp(input)

  // Get original dimensions
  const metadata = await image.metadata()
  const originalWidth = metadata.width ?? MAX_WIDTH

  // Resize only if wider than MAX_WIDTH (preserves aspect ratio)
  const pipeline = originalWidth > MAX_WIDTH
    ? image.resize({ width: MAX_WIDTH, withoutEnlargement: true })
    : image

  // Convert to WebP, strip all metadata (EXIF, GPS, etc.)
  const buffer = await pipeline
    .webp({ quality: WEBP_QUALITY })
    .rotate() // Auto-rotate based on EXIF orientation before stripping
    .toBuffer({ resolveWithObject: true })

  return {
    buffer: buffer.data,
    contentType: 'image/webp',
    extension: '.webp',
    width: buffer.info.width,
    height: buffer.info.height,
    size: buffer.info.size,
  }
}

/**
 * Validate an uploaded file's type and size.
 * Throws an error with a user-friendly message if invalid.
 */
export function validateImageFile(
  contentType: string,
  size: number,
  filename: string
): void {
  if (!ALLOWED_TYPES.has(contentType)) {
    throw new Error(
      `Tip de fișier nepermis: ${contentType}. Tipuri acceptate: JPG, PNG, GIF, WebP.`
    )
  }

  if (size > MAX_FILE_SIZE) {
    const sizeMB = (size / (1024 * 1024)).toFixed(1)
    throw new Error(
      `Fișierul "${filename}" este prea mare (${sizeMB}MB). Limita maximă este 5MB.`
    )
  }
}
