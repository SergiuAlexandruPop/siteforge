import { defineCloudflareConfig } from '@opennextjs/cloudflare'

// ---------------------------------------------------------------------------
// OpenNext — Cloudflare adapter config.
// ---------------------------------------------------------------------------
// Transforms the standard `next build` output into a Cloudflare Worker (run via
// `opennextjs-cloudflare build`). The Worker uses the Node.js runtime under the
// `nodejs_compat` flag (see wrangler.jsonc), so our Node route handlers
// (/api/lead, /api/track) run unchanged — no Edge-runtime rewrite.
//
// Empty config = OpenNext defaults: no persistent ISR/data cache (this site is
// effectively static + two fire-and-forget POST routes, so no cache backend is
// needed yet). If we later want ISR or a KV/R2-backed incremental cache, add an
// `incrementalCache` here and bind the store in wrangler.jsonc.
// ---------------------------------------------------------------------------

export default defineCloudflareConfig({})
