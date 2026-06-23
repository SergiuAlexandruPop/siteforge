# <Client Name> — Agent Context

> Read this before any work on this client. This is the **single source of truth** for `<folder>`.
> **Auto-update the "Living state" section as the final step of any change here** (see the
> auto-update protocol in root `CLAUDE.md`). Do not duplicate this client's state into `docs/CONTEXT.md`.
>
> When scaffolding a new client: copy this file to `clients/<name>/CLAUDE.md`, fill every field,
> add a row to the Client Router in root `CLAUDE.md` and the registry in `docs/CONTEXT.md`.

## Identity
- **What it is:** <one-line description of the business>
- **Audience:** <who the site is for>
- **Tone:** <formal / friendly / technical / ...>
- **Language(s):** <Romanian only | Romanian + English>
- **How visitors arrive:** <SEO / direct links / ads / ...>  ← drives CTA and homepage design

## Coordinates
- **Folder:** `clients/<folder>/`
- **Domain:** `<domain or "TBD">`
- **Env file:** `env/.env.<folder>`
- **Dev:** `yarn dev:<folder>`  ·  **Build:** `yarn build:<folder>`
- **Layout:** `<LayoutShell (default) | custom, registered in src/lib/client-layout.ts>`
- **Homepage:** `<DefaultHomePage (generic) | custom, registered in src/lib/client-homepage.ts>`

## Features (from config.ts — keep in sync)
- i18n: <✓/✗>  ·  blog: <✓/✗>  ·  darkMode: <✓/✗>  ·  contactForm: <✓/✗>  ·  smartsupp: <✓/✗>  ·  supabase: <✓/✗>

## File map
- `config.ts` — feature flags, SEO, contact, navigation
- `theme.ts` — brand colors, fonts, radius
- `content/pages/` — Romanian page content (`index.md`, `about.md`, `contact.md`, ...)
- `content/pages-en/` — English pages (if i18n)
- `content/blog/` · `content/blog-en/` — blog posts (if blog)
- `public/` — client assets (logo, favicon, og-image, project screenshots)
- `DESIGN.md` — design/animation spec (if the client has a custom design)

## Living state   ← AUTO-UPDATED
- **Last updated:** <date>
- **Status:** <e.g. bare scaffold | content in progress | deployed>
- **What's built:** <bullet summary>
- **Known issues / TODO:** <bullets>
- **Next step:** <the one thing to do next>

## Client gotchas
<Anything specific to this client an agent must not break. Empty if none.>
