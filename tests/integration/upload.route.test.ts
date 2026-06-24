import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// ---------------------------------------------------------------------------
// POST /api/upload — image upload route handler
// ---------------------------------------------------------------------------
// A wiring test: mocks every I/O boundary (auth, sharp optimization, R2) so it
// asserts the handler's control flow — auth gating, multipart parse, the
// validation→400 mapping, filename sanitization, the R2 call, and the success
// payload. Real sharp behaviour is covered in tests/unit/image-optimize.test.ts.
// ---------------------------------------------------------------------------

vi.mock('next/server', () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) =>
      new Response(JSON.stringify(body), {
        status: init?.status ?? 200,
        headers: { 'content-type': 'application/json' },
      }),
  },
}))

vi.mock('@/lib/auth', () => ({
  isAuthenticated: vi.fn(),
}))

vi.mock('@/lib/r2', () => ({
  uploadToR2: vi.fn(),
}))

// validateImageFile keeps its REAL behaviour (it is pure and central to the
// 400 path we are asserting); only optimizeImage is stubbed to avoid sharp.
vi.mock('@/lib/image-optimize', async () => {
  const actual = await vi.importActual<typeof import('@/lib/image-optimize')>(
    '@/lib/image-optimize',
  )
  return {
    ...actual,
    optimizeImage: vi.fn(),
  }
})

import { POST } from '@/app/api/upload/route'
import { isAuthenticated } from '@/lib/auth'
import { uploadToR2 } from '@/lib/r2'
import { optimizeImage } from '@/lib/image-optimize'

const mockAuth = vi.mocked(isAuthenticated)
const mockUpload = vi.mocked(uploadToR2)
const mockOptimize = vi.mocked(optimizeImage)

const optimized = {
  buffer: Buffer.from('optimized-bytes'),
  contentType: 'image/webp',
  extension: '.webp',
  width: 1200,
  height: 800,
  size: 15,
}

function uploadRequest(file?: File): Request {
  const form = new FormData()
  if (file) form.set('file', file)
  return new Request('http://localhost/api/upload', { method: 'POST', body: form })
}

function pngFile(name: string, type = 'image/png', sizeBytes = 1024): File {
  // Build a File of an explicit byte length so size checks are meaningful.
  return new File([new Uint8Array(sizeBytes)], name, { type })
}

beforeEach(() => {
  vi.clearAllMocks()
  mockAuth.mockResolvedValue(true)
  mockUpload.mockResolvedValue('https://pub-xxx.r2.dev/blog/img.webp')
  mockOptimize.mockResolvedValue(optimized)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('POST /api/upload — auth gating', () => {
  it('returns 401 and touches nothing downstream when not authenticated', async () => {
    mockAuth.mockResolvedValue(false)
    const res = await POST(uploadRequest(pngFile('photo.png')))
    expect(res.status).toBe(401)
    expect(mockOptimize).not.toHaveBeenCalled()
    expect(mockUpload).not.toHaveBeenCalled()
  })
})

describe('POST /api/upload — client errors (400)', () => {
  it('returns 400 when no file field is present', async () => {
    const res = await POST(uploadRequest())
    expect(res.status).toBe(400)
    expect(mockUpload).not.toHaveBeenCalled()
  })

  it('returns 400 (not 500) for a disallowed file type', async () => {
    const res = await POST(uploadRequest(pngFile('doc.pdf', 'application/pdf')))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/Tip de fișier nepermis/)
    expect(mockOptimize).not.toHaveBeenCalled()
    expect(mockUpload).not.toHaveBeenCalled()
  })

  it('returns 400 (not 500) for an oversize file', async () => {
    const big = pngFile('huge.png', 'image/png', 5 * 1024 * 1024 + 1)
    const res = await POST(uploadRequest(big))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/prea mare/)
    expect(mockUpload).not.toHaveBeenCalled()
  })
})

describe('POST /api/upload — happy path', () => {
  it('optimizes, uploads under a sanitized timestamped key, and returns the URL', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-24T00:00:00.000Z'))
    const ts = Date.now()

    const res = await POST(uploadRequest(pngFile('MĂ Working FILE!.PNG')))
    expect(res.status).toBe(200)

    expect(mockOptimize).toHaveBeenCalledOnce()
    expect(mockUpload).toHaveBeenCalledOnce()

    const [key, body, contentType] = mockUpload.mock.calls[0]
    expect(key).toBe(`blog/${ts}-m-working-file-.webp`)
    expect(body).toBe(optimized.buffer)
    expect(contentType).toBe('image/webp')

    const data = await res.json()
    expect(data).toEqual({
      url: 'https://pub-xxx.r2.dev/blog/img.webp',
      width: optimized.width,
      height: optimized.height,
      size: optimized.size,
    })
  })

  it('caps the sanitized name segment at 50 characters', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-24T00:00:00.000Z'))
    const ts = Date.now()

    const longName = 'a'.repeat(80) + '.png'
    await POST(uploadRequest(pngFile(longName)))

    const [key] = mockUpload.mock.calls[0]
    expect(key).toBe(`blog/${ts}-${'a'.repeat(50)}.webp`)
  })
})

describe('POST /api/upload — server failures (500)', () => {
  it('returns 500 when R2 upload throws', async () => {
    mockUpload.mockRejectedValue(new Error('R2 is down'))
    const res = await POST(uploadRequest(pngFile('photo.png')))
    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.error).toBe('R2 is down')
  })

  it('returns 500 when optimization throws', async () => {
    mockOptimize.mockRejectedValue(new Error('sharp failed'))
    const res = await POST(uploadRequest(pngFile('photo.png')))
    expect(res.status).toBe(500)
    expect(mockUpload).not.toHaveBeenCalled()
  })
})
