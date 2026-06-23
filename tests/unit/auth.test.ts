import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest'
import { SignJWT } from 'jose'

// ---------------------------------------------------------------------------
// auth.ts — password check + JWT session create/verify
// ---------------------------------------------------------------------------
// auth.ts imports `cookies` from 'next/headers' at module scope. We mock it so
// the module loads without a Next.js request context. The cookie helpers
// (setSessionCookie / getSessionCookie / isAuthenticated) need a real request
// context and are covered later by route integration tests (review §8 P2);
// here we test the pure crypto + password logic.
// ---------------------------------------------------------------------------

vi.mock('next/headers', () => ({ cookies: vi.fn() }))

import {
  verifyPassword,
  createSessionToken,
  verifySessionToken,
} from '@/lib/auth'

// 32 ASCII chars = 256 bits, satisfies HS256 key-length requirements.
const SECRET = 'abcdefghijklmnopqrstuvwxyz123456'
const PASSWORD = 'correct-horse-battery-staple'
const enc = new TextEncoder()

const PREV = {
  secret: process.env.ADMIN_SESSION_SECRET,
  password: process.env.ADMIN_PASSWORD,
}

beforeEach(() => {
  process.env.ADMIN_SESSION_SECRET = SECRET
  process.env.ADMIN_PASSWORD = PASSWORD
})

afterAll(() => {
  process.env.ADMIN_SESSION_SECRET = PREV.secret
  process.env.ADMIN_PASSWORD = PREV.password
})

// ---------------------------------------------------------------------------
// verifyPassword
// ---------------------------------------------------------------------------

describe('verifyPassword', () => {
  it('returns true for the correct password', () => {
    expect(verifyPassword(PASSWORD)).toBe(true)
  })

  it('returns false for a wrong password', () => {
    expect(verifyPassword('wrong')).toBe(false)
  })

  it('throws when ADMIN_PASSWORD is not set', () => {
    delete process.env.ADMIN_PASSWORD
    expect(() => verifyPassword(PASSWORD)).toThrow(/ADMIN_PASSWORD/)
  })
})

// ---------------------------------------------------------------------------
// Session token: create / verify
// ---------------------------------------------------------------------------

describe('createSessionToken + verifySessionToken', () => {
  it('round-trips a freshly issued token', async () => {
    const token = await createSessionToken()
    expect(typeof token).toBe('string')
    expect(await verifySessionToken(token)).toBe(true)
  })

  it('rejects a tampered token', async () => {
    const token = await createSessionToken()
    const tampered = token.slice(0, -1) + (token.endsWith('A') ? 'B' : 'A')
    expect(await verifySessionToken(tampered)).toBe(false)
  })

  it('rejects a token signed with a different secret', async () => {
    const foreign = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(enc.encode('a-completely-different-secret-key!'))
    expect(await verifySessionToken(foreign)).toBe(false)
  })

  it('rejects an expired token', async () => {
    const past = Math.floor(Date.now() / 1000) - 60
    const expired = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(past - 60)
      .setExpirationTime(past) // already in the past
      .sign(enc.encode(SECRET))
    expect(await verifySessionToken(expired)).toBe(false)
  })

  it('rejects a malformed token string', async () => {
    expect(await verifySessionToken('not.a.valid.jwt')).toBe(false)
    expect(await verifySessionToken('')).toBe(false)
  })
})
