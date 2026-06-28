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

// ---------------------------------------------------------------------------
// Phone-first lead email (ElectroWill Phase C).
// ---------------------------------------------------------------------------
// The lead-capture card collects ONLY a phone number (no email field), so this
// cannot reuse sendContactEmail (which requires an email for `replyTo`). Same
// Resend config and the same fail-if-unconfigured contract.
//   kind: 'submit'    → visitor pressed "Sună-mă" and confirmed the number.
//   kind: 'abandoned' → a valid number was typed but never submitted (rescue);
//                       flagged so the business calls gently.
// ---------------------------------------------------------------------------

interface LeadEmailPayload {
  phone: string
  source?: string
  kind: 'submit' | 'abandoned'
}

export async function sendLeadEmail(payload: LeadEmailPayload) {
  const { apiKey, fromEmail, toEmail } = getResendConfig()
  const resend = new Resend(apiKey)

  // Header-injection note: `payload.phone` is normalizeRoPhone()-ed to digits
  // upstream and `source` is CR/LF-stripped + length-capped, so neither can
  // smuggle headers; `to`/`from` are env constants. Resend is a JSON API (not
  // raw SMTP), so it sets headers itself — no user input reaches a header.
  const abandoned = payload.kind === 'abandoned'
  const subject = abandoned
    ? `Lead nou (neconfirmat): ${payload.phone}`
    : `Lead nou — Sună-mă: ${payload.phone}`

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    subject,
    text: [
      `Telefon: ${payload.phone}`,
      payload.source ? `Sursă: ${payload.source}` : null,
      abandoned
        ? 'Tip: număr lăsat, neconfirmat — sună cu blândețe.'
        : 'Tip: cerere „Sună-mă” confirmată.',
    ]
      .filter(Boolean)
      .join('\n'),
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}
