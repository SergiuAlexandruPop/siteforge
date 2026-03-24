import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const COOKIE_NAME = 'siteforge-admin-session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /admin/* routes (except the login page itself)
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Allow the login page
  if (pathname === '/admin') {
    return NextResponse.next()
  }

  // Check for session cookie
  const token = request.cookies.get(COOKIE_NAME)?.value

  if (!token) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Verify JWT
  try {
    const secret = process.env.ADMIN_SESSION_SECRET
    if (!secret) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    await jwtVerify(token, new TextEncoder().encode(secret))
    return NextResponse.next()
  } catch {
    // Invalid or expired token — redirect to login
    return NextResponse.redirect(new URL('/admin', request.url))
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}
