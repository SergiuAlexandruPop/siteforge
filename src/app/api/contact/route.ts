import { NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/resend'

// ---------------------------------------------------------------------------
// POST /api/contact
// ---------------------------------------------------------------------------
// Validates form input, sends email via Resend, returns result.
// Rate limiting: basic check using headers (expand later if needed).
// ---------------------------------------------------------------------------

interface ContactFormData {
  name: unknown
  email: unknown
  phone: unknown
  message: unknown
}

function validateString(
  value: unknown,
  field: string,
  min: number,
  max: number
): string {
  if (typeof value !== 'string' || value.trim().length < min) {
    throw new ValidationError(`${field} must be at least ${min} characters.`)
  }
  if (value.trim().length > max) {
    throw new ValidationError(`${field} must be at most ${max} characters.`)
  }
  return value.trim()
}

function validateEmail(value: unknown): string {
  if (typeof value !== 'string') {
    throw new ValidationError('Email is required.')
  }
  const trimmed = value.trim()
  // Simple but effective email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmed)) {
    throw new ValidationError('Please enter a valid email address.')
  }
  return trimmed
}

function validatePhone(value: unknown): string | undefined {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return undefined
  }
  if (typeof value !== 'string') {
    throw new ValidationError('Invalid phone number.')
  }
  const digits = value.replace(/\D/g, '')
  if (digits.length < 6) {
    throw new ValidationError('Phone number must have at least 6 digits.')
  }
  return value.trim()
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactFormData

    // Validate
    const name = validateString(body.name, 'Name', 2, 100)
    const email = validateEmail(body.email)
    const phone = validatePhone(body.phone)
    const message = validateString(body.message, 'Message', 10, 5000)

    // Send
    await sendContactEmail({ name, email, phone, message })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }

    console.error('Contact form error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}
