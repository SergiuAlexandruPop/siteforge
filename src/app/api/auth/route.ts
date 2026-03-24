import { NextResponse } from 'next/server'
import { verifyPassword, createSessionToken, setSessionCookie } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const password = body.password

    if (typeof password !== 'string' || !password) {
      return NextResponse.json(
        { success: false, error: 'Password is required.' },
        { status: 400 }
      )
    }

    if (!verifyPassword(password)) {
      return NextResponse.json(
        { success: false, error: 'Invalid password.' },
        { status: 401 }
      )
    }

    const token = await createSessionToken()
    await setSessionCookie(token)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication failed.' },
      { status: 500 }
    )
  }
}
