# SiteForge — Living Context

> **This file lives at `docs/CONTEXT.md` in the repo.**
> Claude MUST read this file at the start of every new chat.
> Claude MUST update this file at the end of every implementation chat (with user permission).

---

## Last Updated
**Date:** 2026-03-23
**Updated By:** Claude — Phase 1A scaffold generation

---

## Current Phase
**Phase 1A — Project Skeleton (Complete)**
**Phase 1B — Dev Tooling (Complete)**

See `docs/ROADMAP.md` for full phase details.

---

## Project Status

### What Has Been Built
- Next.js 15 project with TypeScript strict mode
- Tailwind CSS v3 configured with shadcn/ui CSS variable pattern
- shadcn/ui initialized: Button, Input, Card components
- `clients/_template/` with config.ts, theme.ts, content/ structure
- `clients/portfolio/` with full config (blog, i18n, darkMode, contactForm enabled)
- `src/types/config.ts` — ClientConfig and ClientTheme interfaces
- `src/lib/client-config.ts` — loads active client from ACTIVE_CLIENT env var
- `src/lib/utils.ts` — cn() helper for class merging
- `tailwind.config.ts` with shadcn/ui theme tokens
- `env/.env.example` with all variables documented
- `env/.env.portfolio` with placeholder values
- `scripts/dev.ts` — CLI that copies env file + starts dev server with Turbopack
- `src/app/layout.tsx` — root layout loading client config
- `src/app/page.tsx` — placeholder homepage showing active client info
- `src/components/dev/DevBanner.tsx` — floating dev overlay with feature flags and env var status
- Package.json with yarn scripts: dev:portfolio, build:portfolio
- All docs updated for yarn (was npm)

### What Is In Progress
- Nothing. Awaiting Phase 1C kickoff (Layout Shell).

### Known Issues
- None yet. Project has not been run — user needs to yarn install and verify.

### Tech Debt
- Client config loader uses explicit imports per client (see src/lib/client-config.ts). When adding a new client, you must add import + registry entry manually. Phase 6 CLI will automate this.
- Theme tokens from client theme.ts are not yet wired into CSS variables dynamically. Currently using shadcn/ui default CSS variables in globals.css. Phase 1C or Phase 2 should bridge client theme.ts → CSS custom properties.

---

## Decision Log

All architecture and business decisions made during planning. Claude should reference this before suggesting alternatives to decided topics.

| # | Decision | Rationale | Date |
|---|----------|-----------|------|
| 1 | Next.js App Router (not Pages Router) | Modern standard, RSC support, better file-based routing | Planning |
| 2 | Mono-repo with client config folders (not separate repos) | 5-7 clients makes this maintainable; one fix applies to all | Planning |
| 3 | Tailwind CSS + shadcn/ui (not other component libraries) | Tailwind is AI-friendly; shadcn is copy-paste, no dependency | Planning |
| 4 | Cloudflare R2 for images (not Supabase Storage) | 10GB free, 500 buckets, no per-project limit | Planning |
| 5 | Resend for email (not EmailJS/Formspree) | 100 emails/day free, server-side, React Email templates | Planning |
| 6 | Novel editor for CMS (not Tiptap raw/custom) | Medium-style UX out of box, built on Tiptap + Tailwind | Planning |
| 7 | Markdown files in repo for blog (not database) | Zero cost, version-controlled, works without Supabase | Planning |
| 8 | Custom micro-CMS (not third-party headless CMS) | Fewer dependencies, full control, simpler architecture | Planning |
| 9 | GitHub API for CMS file operations | No database needed for blog CRUD; files commit to repo | Planning |
| 10 | Supabase optional per client (not required) | Most clients won't need a database; add only when needed | Planning |
| 11 | Romanian default language, English under /en/ | Simple routing, no middleware locale detection | Planning |
| 12 | Separate blog posts per language (Medium model) | Simpler than translation linking, cleaner for SEO | Planning |
| 13 | Password auth via env var for admin (not OAuth) | Simplest possible auth for blog CMS; no database needed | Planning |
| 14 | Single main branch for all content | Content branch adds complexity without enough benefit for 5-7 clients | Planning |
| 15 | GA4 + Google Search Console for analytics | Both free, industry standard, sufficient for all clients | Planning |
| 16 | Dev mode floating banner for config warnings | Prevents config mistakes, shows active client and status | Planning |
| 17 | CLI scripts for client switching in dev | yarn dev:{client-name} swaps env and starts server | Planning |
| 18 | Sharp for image optimization before R2 upload | Resize, WebP conversion, EXIF stripping on server | Planning |
| 19 | Two-tier architecture (starter kit + separate repos for full apps) | Health SaaS and complex apps don't belong in this repo | Planning |
| 20 | Turso as backup DB if Supabase free tier exhausted | 500 free databases, SQLite, generous limits | Planning |
| 21 | Yarn as package manager (not npm) | User preference | Phase 1A |
| 22 | Next.js 15 with Turbopack for dev (not Vite) | Keeps SSG, API routes, SEO; Turbopack gives near-Vite dev speed | Phase 1A |
| 23 | Tailwind v3 (not v4) | shadcn/ui compatibility, tailwind.config.ts pattern | Phase 1A |
| 24 | Explicit client imports in client-config.ts (not dynamic) | Turbopack/webpack reliability; dynamic imports of config files are fragile | Phase 1A |

---

## Client Registry

Track which clients exist and their status.

| Client | Folder Name | Domain | Status | Features Enabled |
|--------|-------------|--------|--------|-----------------|
| Portfolio (you) | `portfolio` | localhost (TBD) | Scaffolded | blog, i18n, darkMode, contactForm |
| Doctor | `doctor-maria` | TBD | Not started | TBD |
| Electrician | `electrician-ion` | TBD | Not started | TBD |

---

## Dependencies Installed

Track what's in package.json so Claude doesn't suggest already-installed or conflicting packages.

| Package | Version | Purpose |
|---------|---------|---------|
| next | ^15.1.0 | Framework |
| react | ^19.0.0 | UI library |
| react-dom | ^19.0.0 | React DOM renderer |
| class-variance-authority | ^0.7.1 | Component variant utility (shadcn) |
| @radix-ui/react-slot | ^1.1.1 | Slot primitive (shadcn Button) |
| clsx | ^2.1.1 | Class name utility |
| tailwind-merge | ^2.6.0 | Tailwind class deduplication |
| typescript | ^5.7.0 | Type checker |
| tailwindcss | ^3.4.17 | CSS framework |
| postcss | ^8.4.49 | CSS processing |
| autoprefixer | ^10.4.20 | CSS vendor prefixes |
| tailwindcss-animate | ^1.0.7 | Animation utilities (shadcn) |
| @tailwindcss/typography | ^0.5.15 | Prose styling for blog |
| tsx | ^4.19.0 | TypeScript script runner (CLI) |
| cross-env | ^7.0.3 | Cross-platform env var setting |

---

## Environment Setup Status

| Service | Account Created | Configured | Notes |
|---------|----------------|------------|-------|
| GitHub | TBD | No | Need repo created |
| Vercel | TBD | No | Need account + project per client |
| Cloudflare R2 | TBD | No | Need account + bucket per client |
| Resend | TBD | No | Need account + API key |
| Google Analytics | TBD | No | Need GA4 property per client |
| Google Search Console | TBD | No | Need verification per domain |
| Smartsupp | TBD | No | Optional, per client |

---

## Next Steps

**Next chat should:** Begin Phase 1C — Layout Shell. See ROADMAP.md Phase 1C for details.

Phase 1C includes:
1. `src/components/layout/LayoutShell.tsx` — header + main + footer wrapper
2. `src/components/layout/Header.tsx` — responsive nav from client config, mobile menu, language toggle slot, dark mode slot
3. `src/components/layout/Footer.tsx` — contact info, copyright
4. `src/components/layout/MobileMenu.tsx` — hamburger menu
5. Update `src/app/layout.tsx` to use LayoutShell
6. Verify: homepage renders with layout, navigation works, mobile responsive

**Before starting Phase 1C, verify Phase 1A works:**
1. Extract zip
2. Run `yarn install`
3. Run `yarn dev:portfolio`
4. Verify http://localhost:3000 shows the placeholder page with client info
5. Verify DevBanner appears in bottom-right corner

---

## Notes for Claude

- The user has NO backend/database/DevOps experience. Explain everything step by step.
- The user develops on Windows 11 with WebStorm.
- The user uses Claude Desktop with MCP for development.
- The user prefers Yarn over npm.
- Always plan before coding. Always work in small phases.
- Always suggest better alternatives. Never implement blindly.
- Check this file first for current state before doing anything.
