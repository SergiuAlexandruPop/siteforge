import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { uploadToR2 } from '@/lib/r2'
import { optimizeImage, validateImageFile } from '@/lib/image-optimize'

// ---------------------------------------------------------------------------
// Image Upload API
// ---------------------------------------------------------------------------
// POST /api/upload — Receives an image, optimizes it, uploads to R2.
// Requires admin authentication (session cookie).
//
// Request: multipart/form-data with a "file" field
// Response: { url: "https://pub-xxx.r2.dev/blog/filename.webp" }
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  // 1. Check authentication
  const authed = await isAuthenticated()
  if (!authed) {
    return NextResponse.json({ error: 'Neautorizat.' }, { status: 401 })
  }

  // 2. Parse + validate the upload. Anything wrong here is a CLIENT error → 400
  //    (bad multipart body, missing file, disallowed type, oversize). The
  //    optimize/upload try block further down is reserved for genuine
  //    server-side failures (sharp/R2) → 500.
  let file: File
  try {
    const formData = await request.formData()
    const candidate = formData.get('file')

    if (!candidate || !(candidate instanceof File)) {
      return NextResponse.json(
        { error: 'Niciun fișier trimis. Adaugă un câmp "file" în formular.' },
        { status: 400 }
      )
    }

    // 3. Validate file type and size (throws on disallowed type / oversize).
    validateImageFile(candidate.type, candidate.size, candidate.name)
    file = candidate
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : 'Fișier nevalid.'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  try {
    // 4. Read file into buffer
    const arrayBuffer = await file.arrayBuffer()
    const inputBuffer = Buffer.from(arrayBuffer)

    // 5. Optimize: resize, convert to WebP, strip EXIF
    const optimized = await optimizeImage(inputBuffer)

    // 6. Generate a unique filename
    //    Format: blog/{timestamp}-{sanitized-name}.webp
    const timestamp = Date.now()
    const safeName = file.name
      .replace(/\.[^.]+$/, '') // remove original extension
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-') // sanitize
      .replace(/-+/g, '-') // collapse dashes
      .slice(0, 50) // limit length

    const key = `blog/${timestamp}-${safeName}${optimized.extension}`

    // 7. Upload to R2
    const url = await uploadToR2(key, optimized.buffer, optimized.contentType)

    // 8. Return the public URL
    return NextResponse.json({
      url,
      width: optimized.width,
      height: optimized.height,
      size: optimized.size,
    })
  } catch (error) {
    console.error('Upload error:', error)

    const message = error instanceof Error
      ? error.message
      : 'Eroare la încărcarea imaginii.'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
