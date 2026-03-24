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

  try {
    // 2. Parse the multipart form data
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'Niciun fișier trimis. Adaugă un câmp "file" în formular.' },
        { status: 400 }
      )
    }

    // 3. Validate file type and size
    validateImageFile(file.type, file.size, file.name)

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
