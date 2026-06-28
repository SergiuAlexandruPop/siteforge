import { NextResponse } from 'next/server'
import { sendLeadEmail } from '@/lib/resend'
import { normalizeRoPhone } from '@/lib/phone-ro'

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
}

function parseKind(value: unknown): 'submit' | 'abandoned' {
  return value === 'abandoned' ? 'abandoned' : 'submit'
}

function parseSource(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed === '' ? undefined : trimmed.slice(0, 80)
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
