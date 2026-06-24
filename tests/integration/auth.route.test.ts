import { describe, it, expect, vi, beforeEach } from 'vitest'

// ---------------------------------------------------------------------------
// POST /api/auth — login route handler
// ---------------------------------------------------------------------------
// We mock @/lib/auth (so no jose/next-headers runtime) and next/server (so the
// handler's NextResponse.json returns a real web Response we can assert on).
// This exercises the handler's real control flow: validation, password check,
// token issue + cookie wiring.
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
  verifyPassword: vi.fn(),
  createSessionToken: vi.fn(),
  setSessionCookie: vi.fn(),
}))

import { POST } from '@/app/api/auth/route'
import {
  verifyPassword,
  createSessionToken,
  setSessionCookie,
} from '@/lib/auth'

const mockVerify = vi.mocked(verifyPassword)
const mockCreate = vi.mocked(createSessionToken)
const mockSetCookie = vi.mocked(setSessionCookie)

function jsonRequest(body: unknown): Request {
  return new Request('http://localhost/api/auth', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  mockCreate.mockResolvedValue('mock-token')
  mockSetCookie.mockResolvedValue(undefined)
})

describe('POST /api/auth — input validation', () => {
  it('rejects a missing password with 400', async () => {
    const res = await POST(jsonRequest({}))
    expect(res.status).toBe(400)
    expect(mockVerify).not.toHaveBeenCalled()
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it('rejects an empty password with 400', async () => {
    const res = await POST(jsonRequest({ password: '' }))
    expect(res.status).toBe(400)
    expect(mockVerify).not.toHaveBeenCalled()
  })

  it('rejects a non-string password with 400', async () => {
    const res = await POST(jsonRequest({ password: 12345 }))
    expect(res.status).toBe(400)
    expect(mockVerify).not.toHaveBeenCalled()
  })

  it('returns 500 on an invalid JSON body', async () => {
    const req = new Request('http://localhost/api/auth', {
      method: 'POST',
      body: '{ not valid json',
    })
    const res = await POST(req)
    expect(res.status).toBe(500)
  })
})

describe('POST /api/auth — authentication', () => {
  it('returns 401 and issues no session for a wrong password', async () => {
    mockVerify.mockReturnValue(false)
    const res = await POST(jsonRequest({ password: 'nope' }))
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.success).toBe(false)
    expect(mockCreate).not.toHaveBeenCalled()
    expect(mockSetCookie).not.toHaveBeenCalled()
  })

  it('returns 200, creates a token and sets the cookie for the right password', async () => {
    mockVerify.mockReturnValue(true)
    const res = await POST(jsonRequest({ password: 'correct' }))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(mockCreate).toHaveBeenCalledOnce()
    expect(mockSetCookie).toHaveBeenCalledWith('mock-token')
  })
})
