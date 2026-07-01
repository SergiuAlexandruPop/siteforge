import { getCloudflareContext } from '@opennextjs/cloudflare'

// ---------------------------------------------------------------------------
// Workers Rate Limiting helper (Cloudflare `ratelimit` binding, GA Sep 2025).
// ---------------------------------------------------------------------------
// One shared check for the per-endpoint limiters declared in wrangler.jsonc:
//   LEAD_RATELIMIT    — 5 / 60s  on /api/lead  (submit path)
//   COUNTER_RATELIMIT — 60 / 60s on /api/c     (cookieless tap counter)
// We reach the bindings through OpenNext's getCloudflareContext() and call
// limit({ key }). Chosen over a Free-plan WAF rate-limiting rule because Free is
// capped at ONE rule, Block-only — this covers both endpoints, returns a friendly
// 429, and lives in the repo. Counters are per-Cloudflare-location and eventually
// consistent: good enough for abuse mitigation, not exact accounting.
//
// Fails OPEN: outside the Cloudflare runtime (local `next dev`, plain `next
// build`) the binding is absent, so the endpoints keep working unthrottled. The
// bindings are typed OPTIONAL to reflect that runtime boundary — the `!limiter`
// check is a real narrowing, not defensive noise.
//
// Keyed by CF-Connecting-IP. Cloudflare warns IP keys over-match on mobile/CGNAT
// networks (exactly this client's audience), so the thresholds are deliberately
// generous and the action is a soft 429 (lead) / silent drop (counter), never a
// hard block that could catch legitimate users sharing a carrier IP.
// ---------------------------------------------------------------------------

/** The subset of the Workers RateLimit binding we use. */
export interface RateLimitBinding {
  limit(options: { key: string }): Promise<{ success: boolean }>
}

declare global {
  interface CloudflareEnv {
    LEAD_RATELIMIT?: RateLimitBinding
    COUNTER_RATELIMIT?: RateLimitBinding
  }
}

type LimiterName = 'LEAD_RATELIMIT' | 'COUNTER_RATELIMIT'

/**
 * Check a Workers rate-limit binding for `key`.
 * @returns `true` when the request is allowed (or the binding is unavailable).
 */
export async function checkRateLimit(name: LimiterName, key: string): Promise<boolean> {
  try {
    const limiter = getCloudflareContext().env[name]
    if (!limiter) return true
    const { success } = await limiter.limit({ key })
    return success
  } catch {
    // No Cloudflare context (dev / non-CF build) — never block on infra absence.
    return true
  }
}
