import { NextResponse } from 'next/server'
import { sendLeadEmail } from '@/lib/resend'
import { normalizeRoPhone } from '@/lib/phone-ro'
import { verifyTurnstile } from '@/lib/turnstile'
import { checkRateLimit } from '@/lib/rate-limit'

// ---------------------------------------------------------------------------
// POST /api/lead  —  phone-first lead route (ElectroWill Phase C).
// ---------------------------------------------------------------------------
// Separate from /api/contact, which requires an email. This one accepts ONLY a
// phone number plus a small source/kind. Two callers:
//   - the lead card  → fetch() with application/json, kind 'submit'
//   - rescue beacon  → navigator.sendBeacon() with text/plain, kind 'abandoned'
// Both send a raw string body, so we read request.text() and JSON.parse it.
//
// GDPR gate: abandoned-number rescue is parked until the lawful basis is
// verified in Phase F. The beacon is accepted (no error) but NO email is sent
// unless EW_RESCUE_ENABLED === 'true'.
//
// Graceful degrade: RESEND keys aren't wired until Phase G. A send failure is
// logged server-side but the visitor still sees success — a lead must never
// fail because email infra isn't configured yet.
// ---------------------------------------------------------------------------

interface LeadBody {
  phone: unknown
  source: unknown
  kind: unknown
  /** Honeypot field — only bots fill it. */
  trap: unknown
  /** Cloudflare Turnstile token (submit path only). */
  token: unknown
}

function parseKind(value: unknown): 'submit' | 'abandoned' {
  return value === 'abandoned' ? 'abandoned' : 'submit'
}

function parseSource(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  // Strip CR/LF defensively (it only ever lands in the email body, not headers,
  // but keep it clean) and cap length.
  const trimmed = value.trim().replace(/[\r\n]+/g, ' ')
  return trimmed === '' ? undefined : trimmed.slice(0, 80)
}

function getClientIp(request: Request): string | undefined {
  return (
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    undefined
  )
}

export async function POST(request: Request) {
  let body: LeadBody
  try {
    const raw = await request.text()
    body = JSON.parse(raw) as LeadBody
  } catch {
    return NextResponse.json(
      { success: false, error: 'Cerere invalidă.' },
      { status: 400 }
    )
  }

  const phone = typeof body.phone === 'string' ? normalizeRoPhone(body.phone) : null
  if (!phone) {
    return NextResponse.json(
      { success: false, error: 'Număr de telefon invalid.' },
      { status: 400 }
    )
  }

  const kind = parseKind(body.kind)
  const source = parseSource(body.source)

  // -------------------------------------------------------------------------
  // Anti-abuse — SUBMIT path only.
  // The abandoned rescue beacon carries no honeypot and no Turnstile token (it
  // can't solve a challenge), and is GDPR-gated just below, so these checks are
  // scoped to genuine 'submit' requests from the card.
  // -------------------------------------------------------------------------
  if (kind === 'submit') {
    // Rate limit (Workers binding) BEFORE the Turnstile verify + email work, so a
    // flood is shed cheaply. Keyed per client IP; fails open when the binding is
    // absent (local dev / non-CF build). See src/lib/rate-limit.ts.
    const ip = getClientIp(request) ?? 'unknown'
    if (!(await checkRateLimit('LEAD_RATELIMIT', `lead:${ip}`))) {
      return NextResponse.json(
        { success: false, error: 'Prea multe încercări. Mai încearcă peste un minut.' },
        { status: 429 }
      )
    }

    // Honeypot: a hidden field only bots fill — fake success, send nothing, so
    // the bot never learns it was dropped.
    if (typeof body.trap === 'string' && body.trap.trim() !== '') {
      return NextResponse.json({ success: true })
    }

    // Cloudflare Turnstile — enforced ONLY once a secret is configured (Phase G).
    // No secret (dev / pre-launch) = skip, so the form keeps working.
    const secret = process.env.TURNSTILE_SECRET_KEY
    if (secret) {
      const token = typeof body.token === 'string' ? body.token : ''
      const ok = token !== '' && (await verifyTurnstile(token, secret, getClientIp(request)))
      if (!ok) {
        return NextResponse.json(
          { success: false, error: 'Verificare eșuată. Reîncearcă.' },
          { status: 403 }
        )
      }
    }
  }

  // Abandoned-number rescue stays dark until Phase F sign-off.
  if (kind === 'abandoned' && process.env.EW_RESCUE_ENABLED !== 'true') {
    return new NextResponse(null, { status: 204 })
  }

  try {
    await sendLeadEmail({ phone, source, kind })
  } catch (error) {
    console.error('Lead email failed:', error)
  }

  return NextResponse.json({ success: true })
}
