import { NextResponse } from 'next/server'

// TODO: Integrate with Smartsupp API to forward messages to WhatsApp

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message } = body

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message is required.' },
        { status: 400 }
      )
    }

    // Log the message for now — Smartsupp integration will replace this
    console.log('[chat]', message.trim())

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request.' },
      { status: 400 }
    )
  }
}
