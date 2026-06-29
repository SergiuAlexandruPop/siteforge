import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache'

// ---------------------------------------------------------------------------
// OpenNext — Cloudflare adapter config.
// ---------------------------------------------------------------------------
// Transforms the standard `next build` output into a Cloudflare Worker (run via
// `opennextjs-cloudflare build`). The Worker uses the Node.js runtime under the
// `nodejs_compat` flag (see wrangler.jsonc), so our Node route handlers
// (/api/lead, /api/c) run unchanged — no Edge-runtime rewrite.
//
// incrementalCache = static-assets cache (read-only): serves prerendered
// content — the SSG markdown `[slug]` pages (/confidentialitate, /termeni) and
// the static sitemap.xml — directly from the ASSETS binding at runtime.
//
// WHY THIS IS REQUIRED (not optional): without an incremental cache, OpenNext
// routes `●` SSG pages through the cache, misses, and falls back to rendering
// them on demand IN THE WORKER. Those pages read their markdown via `fs`
// (lib/content.ts) — and Workers has no project filesystem — so every `[slug]`
// page 404s and the runtime sitemap comes back empty. Pure-static `○` pages
// (the homepage) survive only because their component never touches `fs`.
//
// Read-only is the correct choice here: the site is fully static with no ISR /
// `revalidate`, so there's nothing to write back. Cache entries live as static
// assets (edge-served), NOT in the Worker script — so this does not count
// against the 3 MB script budget. If a client later needs ISR / on-demand
// revalidation, switch to the R2 (or KV) incremental cache and bind the store
// in wrangler.jsonc. See https://opennext.js.org/cloudflare/caching
// ---------------------------------------------------------------------------

export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
})
