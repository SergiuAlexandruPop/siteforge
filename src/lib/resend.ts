import { Resend } from 'resend'

// ---------------------------------------------------------------------------
// Resend Email Utility
// ---------------------------------------------------------------------------
// Sends contact form submissions to the client's configured email.
// Requires RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_TO_EMAIL in env.
// ---------------------------------------------------------------------------

interface ContactEmailPayload {
  name: string
  email: string
  phone?: string
  message: string
}

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL
  const toEmail = process.env.RESEND_TO_EMAIL

  if (!apiKey || !fromEmail || !toEmail) {
    throw new Error(
      'Missing Resend configuration. Set RESEND_API_KEY, RESEND_FROM_EMAIL, and RESEND_TO_EMAIL in your environment.'
    )
  }

  return { apiKey, fromEmail, toEmail }
}

export async function sendContactEmail(payload: ContactEmailPayload) {
  const { apiKey, fromEmail, toEmail } = getResendConfig()
  const resend = new Resend(apiKey)

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    replyTo: payload.email,
    subject: `Contact form: ${payload.name}`,
    text: [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      payload.phone ? `Phone: ${payload.phone}` : null,
      '',
      'Message:',
      payload.message,
    ]
      .filter(Boolean)
      .join('\n'),
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}
