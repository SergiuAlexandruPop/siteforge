# Portfolio (Sergiu Pop) — Agent Context

> Read this before any work on this client. **Single source of truth** for `portfolio`.
> **Read `clients/portfolio/DESIGN.md` too before any UI/visual work.**
> **Auto-update the "Living state" section as the final step of any change here.**
> Do not duplicate this client's state into `docs/CONTEXT.md`.

## Identity
- **What it is:** Sergiu Pop's personal portfolio + blog (freelance software developer).
- **Audience:** Potential freelance clients, recruiters, peers.
- **Tone:** Premium, modern, technical-but-approachable.
- **Language(s):** Romanian (default) + English (`/en/`).
- **How visitors arrive:** Direct links (LinkedIn, email) — not SEO. → drives clear CTAs over
  freeform/search-oriented entry points.

## Coordinates
- **Folder:** `clients/portfolio/`
- **Domain:** `localhost` (TBD — not yet deployed)
- **Env file:** `env/.env.portfolio`
- **Dev:** `yarn dev:portfolio`  ·  **Build:** `yarn build:portfolio`
- **Layout:** Custom — `PortfolioLayout` (registered in `src/lib/client-layout.ts`)
- **Homepage:** Custom — `PortfolioHomePage` / `HomePage.tsx` (registered in `src/lib/client-homepage.ts`)

## Features (from config.ts — keep in sync)
- i18n: ✓  ·  blog: ✓  ·  darkMode: ✓  ·  contactForm: ✓  ·  smartsupp: ✗  ·  supabase: ✗
- `defaultLanguage: 'ro'`  ·  `theme.defaultTheme: 'dark'`
- Contact: `sergiualexandrupop@gmail.com`; socials: LinkedIn, GitHub
- Nav: Acasă / Despre / Proiecte / Blog / CV / Contact
- Blog: 10/page, reading time on, author "Sergiu"

## File map
- `config.ts` — feature flags, SEO, contact, navigation
- `theme.ts` — terracotta primary (`#B24027` light / `#D4613E` dark), dark default
- `DESIGN.md` — **design & animation spec (read before any UI work)**
- `content/pages/` · `content/pages-en/` — page content (RO / EN)
- `content/blog/` · `content/blog-en/` — blog posts (RO / EN)
- `data/projects.ts` · `data/resume.ts` — structured project & resume data
- `public/` — assets (logo, favicon, og-image, project screenshots)
- Components live in `src/components/portfolio/` (co-located by domain, not in client folder)

## Living state   ← AUTO-UPDATED
- **Last updated:** 2026-06-23
- **Status:** Phase 8 (UI/UX Redesign) complete. Not yet deployed.
- **What's built:**
  - Custom `PortfolioLayout` (SmoothScroll + PortfolioHeader transparent→blur + compact two-row
    PortfolioFooter) and `PortfolioHomePage`.
  - Homepage: AnimatedHero (typewriter + 2 CTAs + TechMarquee) → RocketBlueprint (~120vh, Motion
    scroll-linked) → StatsRow (CountUp) → ProjectShowcase (BrowserMockup frames) → BlogPreview →
    CtaBanner (→ /contact).
  - Terracotta color system (Phase 8A) with dark-mode glow/gradient treatments.
  - Custom ContactPage (split layout), AboutPage, ResumePage, ProjectsPage, ProjectDetail.
  - Blog redesign: bigger cards, pinned-post via `pinned: true` frontmatter.
- **Known issues / TODO:**
  - Project images are placeholders (BrowserMockup frames) — need real screenshots in
    `public/projects/` (search `TODO: Replace with real screenshot`).
  - Google Fonts only set as CSS vars — no `<link>` tag for non-Inter fonts.
  - `config.defaultLanguage` is `'ro'`; root `[slug]` routes hardcode `'ro'` regardless (i18n
    convention). Conceptually coupled to routing pattern.
  - `ChatInput` exists but is unused on homepage — remove or repurpose.
  - Novel editor image upload shows no loading indicator during upload.
- **Next step:** Phase 5B/5C — write real content (about/projects/contact, screenshots), then set up
  Vercel + Resend + GA4 + Search Console and deploy. (Recommended over starting a second client.)

## Client gotchas
- **Always read `DESIGN.md` first** for any visual/animation change.
- **Primary is terracotta**, not blue. Dark uses lightened `#D4613E` for WCAG AA.
- **Keep the slate-blue dark palette** (`#0f172a`) — user prefers it over gray-950.
- **Blueprint rocket keeps blue artwork** — it's an illustration; blueprint CSS vars stay neutral.
- **i18n:** `/` = RO, `/en/` = EN; root `[slug]` routes hardcode `'ro'` (independent of config).
- **Zero commercial-license deps** (no GSAP). Animation deps: Lenis + Motion (both MIT).
