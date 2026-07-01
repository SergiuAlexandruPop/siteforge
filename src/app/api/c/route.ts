import { NextResponse } from 'next/server'

// ---------------------------------------------------------------------------
// POST /api/c  —  cookieless first-party tap counter (ElectroWill Phase C).
// ---------------------------------------------------------------------------
// Endpoint named /api/c (NOT /api/track) on purpose: ad blockers / privacy
// shields block any path containing "track" (ERR_BLOCKED_BY_CLIENT), which would
// silently drop the counter. A neutral name slips past them.
//
// The brief mandates tap counting (phone / WhatsApp / lead) with NO GA4 and NO
// cookie banner. Phase C persistence (decision B1-A) = structured server logs:
// emit one JSON line per event to the Vercel runtime logs. No cookies, no
// datastore, no PII — just an event name and a timestamp. Swap in a real
// aggregate store (e.g. Upstash) later if live totals are needed.
//
// Called via navigator.sendBeacon (text/plain), so read request.text().
// Always 204 — fire-and-forget; the client never waits on this.
// ---------------------------------------------------------------------------

const ALLOWED_EVENTS = new Set([
  'call',
  'whatsapp',
  'lead_open',
  'lead_submit',
  // I2: a complete number typed then abandoned (✕ / idle / tab-close). Anonymous
  // count only — the payload carries NO phone number, we contact no one.
  'lead_abandoned',
])

export async function POST(request: Request) {
  let event = 'unknown'
  try {
    const raw = await request.text()
    const parsed = JSON.parse(raw) as { event?: unknown }
    if (typeof parsed.event === 'string' && ALLOWED_EVENTS.has(parsed.event)) {
      event = parsed.event
    }
  } catch {
    // Malformed beacon — record as 'unknown', never throw.
  }

  console.log(JSON.stringify({ type: 'ew_tap', event, ts: Date.now() }))
  return new NextResponse(null, { status: 204 })
}
