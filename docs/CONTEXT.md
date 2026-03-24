# SiteForge — Living Context

> **This file lives at `docs/CONTEXT.md` in the repo.**
> Claude MUST read this file at the start of every new chat.
> Claude MUST update this file at the end of every implementation chat (with user permission).

---

## Last Updated
**Date:** 2026-03-24
**Updated By:** Claude — Phase 3B complete

---

## Current Phase
**Phase 3B — Blog Admin CMS (Complete)**

See `docs/ROADMAP.md` for full phase details.

---

## Project Status

### What Has Been Built

**Phase 1A+1B: Project Skeleton & Dev Tooling**
- Next.js 15 with TypeScript strict mode, Turbopack for dev
- Tailwind CSS v3 + shadcn/ui (Button, Input, Card)
- `clients/_template/` and `clients/portfolio/` with full config
- `src/types/config.ts` — ClientConfig and ClientTheme interfaces
- `src/lib/client-config.ts` — loads active client from env (explicit import registry)
- `scripts/dev.ts` — CLI copies env + starts Turbopack dev server
- `src/components/dev/DevBanner.tsx` — floating dev overlay

**Phase 1C: Layout Shell**
- `src/components/layout/Header.tsx` — sticky responsive nav, mobile hamburger, slots for toggles
- `src/components/layout/MobileMenu.tsx` — slide-in mobile menu with backdrop, ESC close, body scroll lock
- `src/components/layout/Footer.tsx` — contact info, copyright, "Built with SiteForge"
- `src/components/layout/LayoutShell.tsx` — composes Header + main + Footer

**Phase 2A: Content Rendering**
- `src/lib/content.ts` — reads .md files, parses frontmatter (gray-matter), converts to HTML (remark)
- `src/app/page.tsx` — homepage from index.md
- `src/app/[slug]/page.tsx` — dynamic pages from markdown with generateStaticParams

**Phase 2B: SEO**
- Layout metadata with OG tags, title template (`%s — Site Name`)
- `src/components/seo/JsonLd.tsx` — Organization + WebSite structured data
- `src/app/sitemap.ts` — auto-generated from pages + blog posts (both languages)
- `src/app/robots.ts` — allows all, disallows /admin/ and /api/

**Phase 2C: Contact Form**
- `src/components/contact/ContactForm.tsx` — client-side validation, loading/success/error states
- `src/app/api/contact/route.ts` — server validation + Resend integration
- `src/lib/resend.ts` — Resend API utility
- Form renders on `/contact` page when `features.contactForm` is true

**Phase 2D: i18n**
- `src/app/en/page.tsx` and `src/app/en/[slug]/page.tsx` — English routes
- `src/components/i18n/LanguageToggle.tsx` — RO/EN toggle in header (only when features.i18n true)
- `src/components/i18n/NotAvailable.tsx` — placeholder when English content missing
- hreflang alternate tags on all pages

**Phase 3A: Blog Frontend**
- `src/types/blog.ts` — BlogMeta, BlogPost interfaces
- `src/lib/content.ts` — added getAllBlogPosts, getBlogBySlug, getBlogSlugs, parseBlogMeta
- `src/components/blog/BlogCard.tsx` — card with image, title, excerpt, date, tags, reading time
- `src/components/blog/BlogList.tsx` — responsive grid (1/2/3 cols)
- `src/components/blog/BlogPost.tsx` — Medium-style renderer (680px max, serif font, author bar)
- `src/app/blog/page.tsx` and `src/app/blog/[slug]/page.tsx` — Romanian blog routes
- `src/app/en/blog/page.tsx` and `src/app/en/blog/[slug]/page.tsx` — English blog routes
- BlogPosting JSON-LD on individual posts
- Blog posts added to sitemap

**Phase 3B: Blog Admin CMS**
- `src/lib/auth.ts` — JWT session with jose, password verification from env
- `src/middleware.ts` — protects /admin/* routes (except login page)
- `src/app/admin/page.tsx` — login page (Romanian labels)
- `src/app/admin/dashboard/page.tsx` — post list with RO/EN toggle, edit/delete (Romanian labels)
- `src/app/admin/editor/[slug]/page.tsx` — metadata fields + markdown textarea editor (Romanian labels)
- `src/lib/github.ts` — GitHub API utilities (read, create, update, delete files)
- `src/app/api/auth/route.ts` — login endpoint
- `src/app/api/blog/route.ts` — CRUD (list, create/update, delete) via GitHub API
- `src/app/api/blog/file/route.ts` — read single file for editing
- All admin UI labels are in Romanian

### What Is In Progress
- Nothing. Awaiting next phase.

### Known Issues
- CMS saves to GitHub, but in dev mode you must `git pull` to see new posts locally (expected — in production, Vercel rebuilds automatically)
- Novel WYSIWYG editor not yet integrated — currently using plain markdown textarea. Non-technical clients will need the visual editor.
- `blog-en/` directory may not exist on GitHub until first English post is created — the API handles this gracefully (returns empty list)

### Tech Debt
- Client config loader uses explicit imports per client (src/lib/client-config.ts). Phase 6 CLI will automate registration.
- Theme tokens from client theme.ts not yet wired into CSS variables dynamically. Uses shadcn defaults in globals.css.
- Admin editor uses plain textarea instead of Novel WYSIWYG editor — planned upgrade.
- No image upload pipeline yet (Phase 3C).

---

## Decision Log

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
| 25 | Simple /en/ nested routes (not [lang] route group) | Quick implementation, works now, minor lang attribute compromise | Phase 2D |
| 26 | Plain textarea for CMS editor initially (not Novel) | Pragmatic — full CRUD works, Novel upgrade is a separate step | Phase 3B |
| 27 | Admin UI labels always in Romanian (not internationalized) | Admin is internal tool for Romanian clients | Phase 3B |
| 28 | jose for JWT sessions (not next-auth) | Lightweight, no database, simple password auth | Phase 3B |

---

## Client Registry

| Client | Folder Name | Domain | Status | Features Enabled |
|--------|-------------|--------|--------|-----------------|
| Portfolio (you) | `portfolio` | localhost (TBD) | Phase 3B complete | blog, i18n, darkMode, contactForm |
| Doctor | `doctor-maria` | TBD | Not started | TBD |
| Electrician | `electrician-ion` | TBD | Not started | TBD |

---

## Dependencies Installed

| Package | Version | Purpose |
|---------|---------|---------|
| next | ^15.1.0 | Framework |
| react | ^19.0.0 | UI library |
| react-dom | ^19.0.0 | React DOM renderer |
| class-variance-authority | ^0.7.1 | Component variant utility (shadcn) |
| @radix-ui/react-slot | ^1.1.1 | Slot primitive (shadcn Button) |
| clsx | ^2.1.1 | Class name utility |
| tailwind-merge | ^2.6.0 | Tailwind class deduplication |
| gray-matter | ^4.0.3 | Markdown frontmatter parser |
| remark | ^15.0.1 | Markdown processor |
| remark-html | ^16.0.1 | Markdown to HTML |
| resend | ^4.1.0 | Email API |
| novel | ^0.5.0 | WYSIWYG editor (installed, not yet integrated) |
| jose | ^5.9.0 | JWT signing/verification |
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
| GitHub | Yes | Yes | Repo created, token configured for CMS |
| Vercel | TBD | No | Need account + project per client |
| Cloudflare R2 | TBD | No | Need account + bucket per client |
| Resend | TBD | No | Need account + API key |
| Google Analytics | TBD | No | Need GA4 property per client |
| Google Search Console | TBD | No | Need verification per domain |
| Smartsupp | TBD | No | Optional, per client |

---

## Next Steps

**Next chat should:** Choose between:
1. **Phase 3C: Image Upload Pipeline** — Sharp optimization → R2 upload for blog images
2. **Phase 4: Optional Modules** — Dark mode, Smartsupp, Analytics, DevBanner polish
3. **Novel editor integration** — Replace markdown textarea with WYSIWYG editor for non-technical users

Phase 3C requires a Cloudflare R2 account + bucket. Phase 4 has no external dependencies. Novel integration is a focused upgrade.

**Recommended order:** Phase 4 first (no external deps, quick wins), then Novel editor, then Phase 3C (when R2 is set up).

---

## Notes for Claude

- The user has NO backend/database/DevOps experience. Explain everything step by step.
- The user develops on Windows 11 with WebStorm.
- The user uses Claude Desktop with MCP for development (filesystem tools available).
- The user prefers Yarn over npm.
- Admin UI labels should always be in Romanian.
- Always plan before coding. Always work in small phases.
- Always suggest better alternatives. Never implement blindly.
- Check this file first for current state before doing anything.
- Use `__dirname` not `import.meta.dirname` in scripts (tsx runs as CJS on Windows).
