import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

// ---------------------------------------------------------------------------
// Admin Authentication
// ---------------------------------------------------------------------------
// Simple password auth with JWT session cookies.
// No database needed — password is in ADMIN_PASSWORD env var.
// ---------------------------------------------------------------------------

const COOKIE_NAME = 'siteforge-admin-session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET environment variable is not set.')
  }
  return new TextEncoder().encode(secret)
}

/**
 * Verify password against env var. Returns true if match.
 */
export function verifyPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) {
    throw new Error('ADMIN_PASSWORD environment variable is not set.')
  }
  return password === expected
}

/**
 * Create a signed JWT session token.
 */
export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret())
}

/**
 * Verify a session token. Returns true if valid.
 */
export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret())
    return true
  } catch {
    return false
  }
}

/**
 * Set the session cookie after successful login.
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
}

/**
 * Get the session cookie value. Returns null if not set.
 */
export async function getSessionCookie(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value ?? null
}

/**
 * Check if the current request has a valid admin session.
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getSessionCookie()
  if (!token) return false
  return verifySessionToken(token)
}
