# ElectroWill Solutions — Agent Context

> Read this before any work on ElectroWill. **Single source of truth** for `electrowill-solutions`.
> **Auto-update the "Living state" section as the final step of any change here.**
> Do not duplicate this client's state into `docs/CONTEXT.md`.

## Identity
- **What it is:** ⚠️ NOT YET DEFINED. Config says "Electrowill Solutions" with a gmail contact.
  Likely an electrical contractor or electrical-services business, but unconfirmed. **Ask the user
  before writing any content** — the business type drives content, tone, theme, and whether
  blog/i18n stay on.
- **Audience:** TBD
- **Tone:** TBD
- **Language(s):** Romanian only (`i18n: false`)
- **How visitors arrive:** TBD (likely local search / direct — confirm before designing CTAs)

## Coordinates
- **Folder:** `clients/electrowill-solutions/`
- **Domain:** `electrowill.ro` (planned, not yet connected)
- **Env file:** `env/.env.electrowill-solutions` — all keys EMPTY except `ACTIVE_CLIENT` and a
  pre-generated `ADMIN_SESSION_SECRET`.
- **Dev:** `yarn dev:electrowill-solutions`  ·  **Build:** `yarn build:electrowill-solutions`
- **Layout:** `LayoutShell` (default — no custom layout registered)
- **Homepage:** `DefaultHomePage` (generic sections — no custom homepage registered)

## Features (from config.ts)
- i18n: ✗  ·  blog: ✓  ·  darkMode: ✓  ·  contactForm: ✓  ·  smartsupp: ✗  ·  supabase: ✗

## File map
- `config.ts` — ⚠️ still template-ish: `domain: 'localhost'`, generic SEO text, placeholder phone
  `+40 700 000 000`, contact `electrowillsolutions@gmail.com`.
- `theme.ts` — ⚠️ UNTOUCHED template: primary `#2563eb` (blue), Inter font. Needs real brand colors.
- `content/pages/index.md` — single stub ("Bine ați venit pe site-ul Electrowill Solutions.")
- `content/pages-en/`, `content/blog/`, `content/blog-en/` — empty (`.gitkeep` only)
- `public/` — empty (`.gitkeep`). No logo, favicon, or og-image yet.

## Living state   ← AUTO-UPDATED
- **Last updated:** 2026-06-23
- **Status:** Bare scaffold. Registered in `client-config.ts`; `build:` script exists. Would render
  a generic blue site with one welcome line.
- **What's built:** Nothing client-specific beyond the scaffold from `yarn new-client`.
- **Known issues / TODO:**
  - Business identity undefined (see Identity).
  - `theme.ts` is default blue — needs brand palette.
  - `config.ts` has placeholder domain/phone/SEO.
  - No real content (about, contact, blog), no English (i18n off), no assets.
  - All `env/.env.electrowill-solutions` keys empty (R2 bucket, Resend, GitHub token, ADMIN_PASSWORD).
  - Decision pending: custom animated homepage/layout vs generic `DefaultHomePage`.
- **Next step:** Scoping conversation — define the business, confirm feature set, decide
  custom-vs-generic homepage, then theme + config + content. This is roadmap Phase 7 (first real
  second client).

## Client gotchas
- i18n is OFF — do not add `pages-en/` content or pass `language='en'` for this client unless the
  feature flag is flipped via `yarn toggle-feature` first.
- Before deploy, follow `docs/CLIENT_SETUP_CHECKLIST.md`: create R2 bucket
  `siteforge-electrowill-solutions-images`, Resend key, GitHub token, strong `ADMIN_PASSWORD`.
- Domain `electrowill.ro` is `.ro` → registrar ROTLD, DNS via Cloudflare, proxy gray (DNS only).
