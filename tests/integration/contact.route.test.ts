import { describe, it, expect, vi, beforeEach } from 'vitest'

// ---------------------------------------------------------------------------
// POST /api/contact — contact form route handler
// ---------------------------------------------------------------------------
// Mocks @/lib/resend (no real email) and next/server. Exercises the handler's
// real validation rules and confirms email is only sent for valid input.
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

vi.mock('@/lib/resend', () => ({
  sendContactEmail: vi.fn(),
}))

import { POST } from '@/app/api/contact/route'
import { sendContactEmail } from '@/lib/resend'

const mockSend = vi.mocked(sendContactEmail)

function jsonRequest(body: unknown): Request {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const validPayload = {
  name: 'Ion Pop',
  email: 'ion@example.com',
  message: 'Hello, this is a valid message of sufficient length.',
}

beforeEach(() => {
  vi.clearAllMocks()
  mockSend.mockResolvedValue({ id: 'email-id' } as never)
})

describe('POST /api/contact — happy path', () => {
  it('accepts valid input and sends the email', async () => {
    const res = await POST(jsonRequest({ ...validPayload, phone: '+40 712 345 678' }))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(mockSend).toHaveBeenCalledOnce()
    expect(mockSend).toHaveBeenCalledWith({
      name: 'Ion Pop',
      email: 'ion@example.com',
      phone: '+40 712 345 678',
      message: validPayload.message,
    })
  })

  it('treats phone as optional (undefined when omitted)', async () => {
    const res = await POST(jsonRequest(validPayload))
    expect(res.status).toBe(200)
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({ phone: undefined }),
    )
  })

  it('trims whitespace from name and message', async () => {
    await POST(jsonRequest({ ...validPayload, name: '  Ion Pop  ' }))
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Ion Pop' }),
    )
  })
})

describe('POST /api/contact — validation rejects bad input (no email sent)', () => {
  it('rejects a too-short name', async () => {
    const res = await POST(jsonRequest({ ...validPayload, name: 'A' }))
    expect(res.status).toBe(400)
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('rejects an invalid email', async () => {
    const res = await POST(jsonRequest({ ...validPayload, email: 'not-an-email' }))
    expect(res.status).toBe(400)
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('rejects a too-short message', async () => {
    const res = await POST(jsonRequest({ ...validPayload, message: 'short' }))
    expect(res.status).toBe(400)
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('rejects a phone with too few digits', async () => {
    const res = await POST(jsonRequest({ ...validPayload, phone: '123' }))
    expect(res.status).toBe(400)
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('returns 500 on an invalid JSON body', async () => {
    const req = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: '{ broken',
    })
    const res = await POST(req)
    expect(res.status).toBe(500)
    expect(mockSend).not.toHaveBeenCalled()
  })
})

describe('POST /api/contact — downstream failure', () => {
  it('returns 500 when the email provider throws', async () => {
    mockSend.mockRejectedValue(new Error('resend is down'))
    const res = await POST(jsonRequest(validPayload))
    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.success).toBe(false)
  })
})
