# SiteForge — Living Context

> **This file lives at `docs/CONTEXT.md` in the repo.**
> Claude MUST read this file at the start of every new chat.
> Claude MUST update this file at the end of every implementation chat (with user permission).

---

## Last Updated
**Date:** 2026-03-25
**Updated By:** Claude — Phase 7.5 Chat 4: TabbedServices + ProjectShowcase (implementation)

---

## Current Phase
**Phases 1-6 Complete. Phase 7.5 Chat 4 — TabbedServices + ProjectShowcase (COMPLETE). Chat 5 next.**

---

## Project Status

### What Has Been Built

**Phase 1: Project Skeleton (COMPLETE)**
- Next.js 15, TypeScript strict, Turbopack dev server
- Tailwind CSS v3 + shadcn/ui (Button, Input, Card)
- Client config system: `_template/` and `portfolio/` with config.ts, theme.ts
- `src/types/config.ts` — ClientConfig, ClientTheme, ClientFeatures interfaces
- `src/lib/client-config.ts` — explicit import registry for clients
- `scripts/dev.ts` — CLI copies env file + starts Turbopack dev server
- `src/components/dev/DevBanner.tsx` — floating dev overlay with smart env filtering
- Layout shell: Header (sticky, responsive), Footer, MobileMenu, LayoutShell

**Phase 2: Core Modules (COMPLETE)**
- `src/lib/content.ts` — markdown reading (gray-matter + remark-html with allowDangerousHtml)
- `src/app/page.tsx` — homepage with section-based composition
- `src/app/[slug]/page.tsx` — dynamic pages from markdown
- SEO: Next.js Metadata API, JSON-LD (Organization + WebSite), sitemap.ts, robots.ts
- Contact form: client-side validation + Resend server-side (`src/lib/resend.ts`)
- i18n: /en/ routes, LanguageToggle, NotAvailable placeholder, hreflang tags

**Phase 3: Blog System (COMPLETE)**
- Blog frontend: BlogCard, BlogList, BlogPost (Medium-style, 680px, serif font)
- Romanian + English blog routes with BlogPosting JSON-LD
- Blog admin CMS: JWT auth (jose), middleware-protected /admin routes
- Dashboard with RO/EN toggle, CRUD via GitHub API (`src/lib/github.ts`)
- Novel 0.5 WYSIWYG editor with full toolbar
- Image upload pipeline: Sharp optimization → Cloudflare R2
- Custom Tiptap image extension with data-size/data-align + floating toolbar

**Phase 4: Optional Modules (COMPLETE)**
- Dark mode: ThemeProvider, ThemeToggle, anti-FOUC inline script, feature-flag gated
- Smartsupp: dynamic script loader, feature-flag + env gated
- Google Analytics: GA4 via next/script afterInteractive, env gated
- DevBanner: smart env filtering by active feature flags, color-coded status

**Phase 5A: Homepage Sections (COMPLETE)**
- 6 modular section components in `src/components/sections/`
- Hero, Features, AboutSnippet, Showcase, BlogPreview, CtaBanner
- All sections: responsive, dark mode, className override, zero animations

**Phase 6: Client Setup Automation (COMPLETE)**
- `scripts/new-client.ts` — interactive CLI
- `scripts/toggle-feature.ts` — enable/disable features per client
- `docs/CLIENT_SETUP_CHECKLIST.md` — operational quick-reference

**Phase 7.5 Chat 1: Foundation Layer (COMPLETE)**
- `lenis` installed — smooth scrolling library (MIT, ~5KB)
- `src/types/animations.ts` — shared prop interfaces
- `src/hooks/` — useReducedMotion, useScrollReveal, useScrollVideo (stub)
- `src/components/animations/` — SmoothScroll, ScrollReveal, RotatingText, Marquee, CountUp + barrel
- `src/lib/client-layout.ts` + `src/lib/client-homepage.ts` — per-client registries
- `src/components/sections/DefaultHomePage.tsx` — extracted fallback homepage
- layout.tsx + page.tsx modified to use registries
- `@keyframes marquee` added to globals.css

**Phase 7.5 Chat 2: Portfolio Layout + Header (COMPLETE)**
- `src/components/portfolio/PortfolioHeader.tsx` — transparent → frosted glass on scroll (fixed position, scroll listener, 50px threshold, 0.3s transition)
- `src/components/portfolio/PortfolioFooter.tsx` — enhanced footer with dark mode gradient top edge (hidden dark:block blue gradient line)
- `src/components/portfolio/PortfolioLayout.tsx` — SmoothScroll + PortfolioHeader + main (pt-16 offset) + PortfolioFooter
- `src/components/portfolio/index.ts` — barrel export
- Portfolio layout registered in `src/lib/client-layout.ts`
- Glow CSS variables added to globals.css: `--glow-primary`, `--glow-muted`
- **Dark palette kept as original slate-blue** (user preferred #0f172a over gray-950 #030712, Decision #55 overridden)
- Smooth scrolling via Lenis active for portfolio
- MobileMenu reused via composition from layout/

**Phase 7.5 Chat 3: Animated Hero + Marquee (COMPLETE)**
- `src/components/portfolio/icons.tsx` — 8 inline SVG tech logos (React, Next.js, TypeScript, Tailwind, Node.js, Supabase, PostgreSQL, Git). Brand colors, aria-hidden, viewBox scaling.
- `src/components/portfolio/TechMarquee.tsx` — Wraps shared Marquee with tech icons in labeled pills. 35s cycle, pauseOnHover, border-y separator, dark mode styling.
- `src/components/portfolio/AnimatedHero.tsx` — Client component. Static headline + RotatingText (3s interval, 0.5s transition, text-primary). Two CTAs — primary gets dark glow via `--glow-primary`, intensifies on hover. Dark mode radial gradient overlay (`hidden dark:block`). TechMarquee at bottom.
- `src/components/portfolio/index.ts` — Updated barrel with AnimatedHero, TechMarquee, PortfolioHomePage.
- `src/lib/client-homepage.ts` — Portfolio homepage registered. `getClientHomePage('portfolio')` → `PortfolioHomePage`.
- **AnimatedHero accepts `rotatingWords` as prop (Decision #56) — content is per-client, not hardcoded.**

**Phase 7.5 Chat 4: TabbedServices + ProjectShowcase (COMPLETE)**
- `clients/portfolio/data/projects.ts` — 4 featured projects with typed `Project` interface (slug, title, description, techStack, image, href, featured). Decision #51.
- `src/components/portfolio/TabbedServices.tsx` — Client component. Desktop (md+): horizontal tab bar with active indicator glow in dark mode, numbered feature list content panel. Mobile (< md): accordion with expand/collapse, chevron animation. 4 service categories in Romanian. Both layouts rendered in DOM, toggled via Tailwind `hidden md:block` / `md:hidden`.
- `src/components/portfolio/ProjectShowcase.tsx` — Client component. Filters featured projects, 2-column grid (desktop) / single-column (mobile). Cards: image placeholder, title with hover color, description (line-clamp-2), tech stack tags. Dark mode: hover glow `--glow-primary`, image overlay gradient.
- `src/components/portfolio/HomePage.tsx` — Complete composition: AnimatedHero (no ScrollReveal) → ScrollReveal > TabbedServices → ScrollReveal > ProjectShowcase → ScrollReveal > BlogPreview (blog gated) → ScrollReveal > CtaBanner. Alternating bg treatment.
- `src/components/portfolio/index.ts` — Updated barrel with TabbedServices, ProjectShowcase.

### What Is In Progress

**Phase 7.5: Portfolio Animation Redesign (Chats 1-4 COMPLETE, Chat 5 next)**

**⚠️ Before working on ANY portfolio animation/layout task, Claude MUST read: `clients/portfolio/DESIGN.md`**

**Remaining chats:**
- Chat 5: Polish + documentation (a11y audit, performance, docs update)

### Known Issues
- CMS saves to GitHub; in dev mode you must `git pull` to see new posts locally
- `blog-en/` directory may not exist on GitHub until first English post is created
- Complex markdown (tables, footnotes) may not round-trip perfectly through Novel editor
- Google Fonts not loaded via `<link>` tag — only CSS variables set
- Next.js dark mode class on SVGs: `className="dark:fill-white"` on Next.js logo circle may not work inside inline SVG (CSS selectors depend on how the SVG is rendered). If Next.js icon looks wrong in dark mode, replace with a simpler monochrome version.
- Project images are placeholders (colored divs) — need real screenshots before deployment

### Tech Debt
- Google Fonts loading should dynamically add `<link>` for non-Inter fonts
- Novel editor image upload shows no loading indicator during upload
- Phase 5B (portfolio content polish, more pages) not done
- Phase 5C (Vercel deployment) not done
- Project screenshots needed in `clients/portfolio/public/projects/`

---

## Decision Log

All architecture and business decisions. Claude should reference this before suggesting alternatives.

| # | Decision | Rationale | Date |
|---|----------|-----------|------|
| 1 | Next.js App Router | Modern standard, RSC, file-based routing | Planning |
| 2 | Mono-repo with client folders | 5-7 clients, one fix applies to all | Planning |
| 3 | Tailwind CSS + shadcn/ui | AI-friendly, copy-paste components | Planning |
| 4 | Cloudflare R2 for images | 10GB free, no egress charges | Planning |
| 5 | Resend for email | 100 emails/day free, server-side | Planning |
| 6 | Novel editor for CMS | Medium-style UX, built on Tiptap | Planning |
| 7 | Markdown files for blog | Zero cost, version-controlled | Planning |
| 8 | Custom micro-CMS | Fewer deps, full control | Planning |
| 9 | GitHub API for CMS ops | No database needed for CRUD | Planning |
| 10 | Supabase optional per client | Most clients don't need a database | Planning |
| 11 | Romanian default, /en/ prefix | Simple routing, no middleware | Planning |
| 12 | Separate posts per language | Simpler than translation linking | Planning |
| 13 | Password auth via env var | Simplest auth for blog CMS | Planning |
| 14 | Single main branch | Content branch adds complexity | Planning |
| 15 | GA4 + Search Console | Free, industry standard | Planning |
| 16 | Dev mode floating banner | Prevents config mistakes | Planning |
| 17 | CLI scripts for client switching | yarn dev:{name} swaps env | Planning |
| 18 | Sharp for image optimization | Resize, WebP, EXIF strip | Planning |
| 19 | Two-tier architecture | Complex apps get own repos | Planning |
| 20 | Turso as backup DB | 500 free DBs if Supabase exhausted | Planning |
| 21 | Yarn as package manager | User preference | Phase 1 |
| 22 | Next.js 15 with Turbopack | Near-Vite dev speed | Phase 1 |
| 23 | Tailwind v3 (not v4) | shadcn/ui compatibility | Phase 1 |
| 24 | Explicit client imports | Turbopack reliability | Phase 1 |
| 25 | Simple /en/ nested routes | Quick, works now | Phase 2 |
| 26 | Plain textarea initially | Pragmatic, Novel upgrade separate | Phase 3 |
| 27 | Admin UI always Romanian | Internal tool for Romanian clients | Phase 3 |
| 28 | jose for JWT sessions | Lightweight, no database | Phase 3 |
| 29 | Anti-FOUC inline script | Zero dependency dark mode init | Phase 4 |
| 30 | next/script for GA4 | Better loading performance | Phase 4 |
| 31 | Smart DevBanner filtering | Reduces noise | Phase 4 |
| 32 | Novel + markdown fallback toggle | Power users get raw markdown | Novel |
| 33 | Lazy-load Novel editor | Avoids SSR issues | Novel |
| 34 | MarkdownExtension for round-trip | Native markdown conversion | Novel |
| 35 | Custom uploadAndInsert | Novel's plugin requires UploadImagesPlugin | Phase 3C |
| 36 | Predefined image sizes | Simpler than free-form resize | Phase 3C |
| 37 | data-size/data-align on images | Survives markdown round-trip as HTML | Phase 3C |
| 38 | Theme CSS vars from theme.ts | Each client gets brand colors automatically | Theme |
| 39 | Section-based homepage | Modular, replaceable, no heavy config schema | Phase 5A |
| 40 | No animation libraries yet | User will explore modern designs later | Phase 5A |
| 41 | toggle-feature CLI | Easy feature management for existing clients | Phase 6 |
| 42 | Per-client layout via registry | Clients can have fundamentally different shells | Phase 7.5 |
| 43 | Per-client homepage via registry | Each client controls their section composition | Phase 7.5 |
| 44 | DefaultHomePage extracted from page.tsx | Current homepage becomes fallback, not hardcoded | Phase 7.5 |
| 45 | Custom animations over GSAP | GSAP prohibits commercial use on free tier | Phase 7.5 |
| 46 | Lenis (MIT) as only animation dep | Smooth scrolling too complex to DIY; 5KB, MIT | Phase 7.5 |
| 47 | IntersectionObserver for scroll reveals | Native API, zero deps, 97%+ support | Phase 7.5 |
| 48 | prefers-reduced-motion from day one | Accessibility is not a bolt-on | Phase 7.5 |
| 49 | Portfolio components in src/components/portfolio/ | Co-location by domain; client folder = config/content only | Phase 7.5 |
| 50 | Inline SVGs for tech logos | Zero requests, full control, no icon library | Phase 7.5 |
| 51 | projects.ts in clients/portfolio/data/ | TypeScript > markdown for structured data | Phase 7.5 |
| 52 | DESIGN.md in client folder | Client-specific design spec, self-contained | Phase 7.5 |
| 53 | ScrollVideoHero as separate future component | SRP — does not bloat AnimatedHero | Phase 7.5 |
| 54 | CSS-only dark mode premium effects | dark: prefix + CSS vars, no runtime branching | Phase 7.5 |
| 55 | Keep original slate-blue dark palette | User prefers warm slate-blue (#0f172a) over cold gray-950 (#030712) | Phase 7.5 C2 |
| 56 | AnimatedHero accepts rotatingWords as prop | Content is per-client, not hardcoded in component | Phase 7.5 C3 |
| 57 | Dual-render tabs/accordion for mobile | Both layouts in DOM, toggled via Tailwind. No resize listener, no hydration mismatch | Phase 7.5 C4 |

---

## Client Registry

| Client | Folder Name | Domain | Status | Features Enabled |
|--------|-------------|--------|--------|-----------------|
| Portfolio (you) | `portfolio` | localhost (TBD) | Phase 7.5 Chat 4 complete | blog, i18n, darkMode, contactForm |
| ElectroWill | `electrowill-solutions` | TBD | Scaffolded | TBD |
| Doctor | `doctor-maria` | TBD | Not started | TBD |
| Electrician | `electrician-ion` | TBD | Not started | TBD |

---

## Dependencies Installed

| Package | Version | Purpose |
|---------|---------|---------|
| next | ^15.1.0 | Framework |
| react / react-dom | ^19.0.0 | UI library |
| class-variance-authority | ^0.7.1 | Component variants (shadcn) |
| @radix-ui/react-slot | ^1.1.1 | Slot primitive (shadcn) |
| clsx + tailwind-merge | ^2.1.1 / ^2.6.0 | Class utilities |
| gray-matter | ^4.0.3 | Markdown frontmatter |
| remark + remark-html | ^15.0.1 / ^16.0.1 | Markdown to HTML |
| resend | ^4.1.0 | Email API |
| novel | ^0.5.0 | WYSIWYG editor |
| jose | ^5.9.0 | JWT sessions |
| @aws-sdk/client-s3 | ^3.1015.0 | R2 upload (S3-compatible) |
| sharp | ^0.34.5 | Image optimization |
| tailwind-merge | ^2.6.0 | Class merging |
| tailwindcss + postcss + autoprefixer | ^3.4.17 | CSS |
| tailwindcss-animate | ^1.0.7 | Animations (shadcn) |
| @tailwindcss/typography | ^0.5.15 | Prose styling |
| tsx | ^4.19.0 | Script runner |
| cross-env | ^7.0.3 | Cross-platform env |
| lenis | latest | Smooth scrolling (MIT, ~5KB) |

---

## Environment Setup Status

| Service | Account Created | Configured | Notes |
|---------|----------------|------------|-------|
| GitHub | Yes | Yes | Repo + token for CMS |
| Cloudflare R2 | Yes | Yes | Bucket + keys configured |
| Vercel | TBD | No | Need account + project per client |
| Resend | TBD | No | Need account + API key |
| Google Analytics | TBD | No | Need GA4 property per client |
| Google Search Console | TBD | No | Need verification per domain |
| Smartsupp | TBD | No | Optional, per client |

---

## CLI Tools

| Command | Purpose |
|---------|---------|
| `yarn dev:{name}` | Start dev server for a client |
| `yarn build:{name}` | Build a client for production |
| `yarn new-client` | Scaffold a new client (interactive) |
| `yarn toggle-feature` | Enable/disable features for existing client |

---

## Documentation Index

| File | Purpose |
|------|---------|
| `docs/ARCHITECTURE.md` | System design, file structure, data flows |
| `docs/CONTEXT.md` | Living state — this file |
| `docs/ROADMAP.md` | Phased plan with completion status |
| `docs/DEV_NOTES.md` | Gotchas, debugging, environment tips |
| `docs/NEW_CLIENT_GUIDE.md` | Detailed step-by-step client setup |
| `docs/CLIENT_SETUP_CHECKLIST.md` | Quick-reference operational checklist |
| `clients/portfolio/DESIGN.md` | **Portfolio design & animation architecture** |

---

## Next Steps

**Immediate next chat:** Phase 7.5 Chat 5 — Polish + Documentation.

**Before starting, Claude must:**
1. Read this file (CONTEXT.md) for project state
2. Read `clients/portfolio/DESIGN.md` for the full animation architecture spec
3. Focus on Chat 5 scope in DESIGN.md Section 10

**What Chat 5 produces:**
- prefers-reduced-motion audit across all animation components
- Dark mode glow refinement (visual QA pass)
- Mobile responsiveness sweep (375px, 768px, 1024px, 1280px)
- Lighthouse performance audit and fixes
- Update CONTEXT.md, ARCHITECTURE.md, DEV_NOTES.md, DESIGN.md

---

## Notes for Claude

- The user has NO backend/database/DevOps experience. Explain everything step by step.
- The user develops on Windows 11 with WebStorm.
- The user uses Claude Desktop with MCP for development.
- The user prefers Yarn over npm.
- Admin UI labels should always be in Romanian.
- Always plan before coding. Always work in small phases.
- Always suggest better alternatives. Never implement blindly.
- Check this file first for current state before doing anything.
- Use `__dirname` not `import.meta.dirname` in scripts (tsx runs as CJS on Windows).
- **For portfolio work: always read `clients/portfolio/DESIGN.md` first.**
- **Zero commercial-license dependencies.** Only MIT/Apache/BSD. No GSAP, no paid plugins.
- **Explicit import registries** (not dynamic imports) for Turbopack reliability.
- **User prefers original slate-blue dark palette** over deeper gray-950. Do not change dark colors.
