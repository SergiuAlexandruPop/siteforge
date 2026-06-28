// ---------------------------------------------------------------------------
// Cloudflare Turnstile — server-side token verification (ElectroWill #3).
// ---------------------------------------------------------------------------
// Used by /api/lead to confirm a submit came from the real widget, not a bot.
// Zero dependencies — a plain POST to Cloudflare's siteverify endpoint.
// Docs: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
//
// The caller only invokes this when TURNSTILE_SECRET_KEY is configured (Phase G);
// with no secret, verification is skipped entirely so dev/pre-launch stays open.
// ---------------------------------------------------------------------------

const SITEVERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify'

interface SiteVerifyResponse {
  success: boolean
  'error-codes'?: string[]
}

/**
 * Verify a Turnstile token against Cloudflare. Returns true only on a confirmed
 * success. Any network/parse failure returns false (fail closed) — the lead
 * route surfaces a gentle retry message rather than letting a bot through.
 */
export async function verifyTurnstile(
  token: string,
  secret: string,
  ip?: string
): Promise<boolean> {
  const body = new URLSearchParams()
  body.set('secret', secret)
  body.set('response', token)
  if (ip) body.set('remoteip', ip)

  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
    const data = (await res.json()) as SiteVerifyResponse
    return data.success === true
  } catch {
    return false
  }
}
