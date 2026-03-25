# SiteForge — Living Context

> **This file lives at `docs/CONTEXT.md` in the repo.**
> Claude MUST read this file at the start of every new chat.
> Claude MUST update this file at the end of every implementation chat (with user permission).

---

## Last Updated
**Date:** 2026-03-25
**Updated By:** Claude — Full checkpoint after Phase 6

---

## Current Phase
**Phases 1-6 Complete. Ready for Phase 5C (deploy) or Phase 7 (second client).**

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
- Novel 0.5 WYSIWYG editor with full toolbar:
  - Headings (H2/H3/H4), Bold, Italic, Underline, Strikethrough, Inline code
  - Bullet list, Ordered list, Blockquote, Code block, Horizontal rule
  - Link (URL prompt), Image upload (file picker)
  - Bubble menu on text selection
  - Toggle between visual editor and raw markdown mode
- Image upload pipeline:
  - `src/lib/r2.ts` — Cloudflare R2 via AWS S3 SDK
  - `src/lib/image-optimize.ts` — Sharp resize (max 1200px), WebP, EXIF strip
  - `src/app/api/upload/route.ts` — authenticated endpoint
  - Upload via: toolbar button, drag-and-drop, paste
  - Custom Tiptap image extension with `data-size` (small/medium/full) and `data-align` (left/center/right)
  - Floating image toolbar on click with size + alignment controls
  - CSS works in both editor and public blog

**Phase 4: Optional Modules (COMPLETE)**
- Dark mode: ThemeProvider, ThemeToggle, anti-FOUC inline script, feature-flag gated
- Smartsupp: dynamic script loader, feature-flag + env gated
- Google Analytics: GA4 via next/script afterInteractive, env gated
- DevBanner: smart env filtering by active feature flags, color-coded status

**Phase 5A: Homepage Sections (COMPLETE)**
- 6 modular section components in `src/components/sections/`:
  - `Hero.tsx` — headline, subtitle, CTAs, background image, children slot
  - `Features.tsx` — card grid (2/3/4 cols)
  - `AboutSnippet.tsx` — text + image side-by-side, reversible
  - `Showcase.tsx` — image cards with tags and links
  - `BlogPreview.tsx` — async server component, latest N posts
  - `CtaBanner.tsx` — full-width banner, muted/primary variants
- All sections: responsive, dark mode, className override, zero animations (future-ready)
- Portfolio homepage composed from sections in page.tsx

**Phase 6: Client Setup Automation (COMPLETE)**
- `scripts/new-client.ts` — interactive CLI (Romanian prompts):
  - Asks: name, domain, email, phone, features, brand color
  - Creates: client folder, config.ts, theme.ts, content, env file
  - Registers: client-config.ts imports + package.json scripts
- `scripts/toggle-feature.ts` — enable/disable features for existing clients:
  - Shows current feature status per client
  - Checks which env vars are needed and if they're set
  - Step-by-step instructions for obtaining missing values
  - Auto-creates directories, adds blog config/nav when enabling blog
- `docs/CLIENT_SETUP_CHECKLIST.md` — operational quick-reference per feature

**Theme System**
- `src/lib/theme-css.ts` — hex → HSL CSS variable generator
- Layout injects client theme colors as `<style>` tag (overrides shadcn defaults)
- Font CSS variables (--font-heading, --font-body, --font-blog) from theme.ts
- BlogPost uses --font-blog variable

### What Is In Progress
- Nothing. At a clean checkpoint.

### Known Issues
- CMS saves to GitHub; in dev mode you must `git pull` to see new posts locally
- `blog-en/` directory may not exist on GitHub until first English post is created
- Complex markdown (tables, footnotes) may not round-trip perfectly through Novel editor
- Google Fonts not loaded via `<link>` tag — only CSS variables set. Non-Inter fonts need a `<link>` added to head.

### Tech Debt
- Google Fonts loading should dynamically add `<link>` for non-Inter fonts
- Novel editor image upload shows no loading indicator during upload
- Homepage sections have zero animations (intentional — user will add later)
- Phase 5B (portfolio content polish, more pages) not done
- Phase 5C (Vercel deployment) not done

---

## Decision Log

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

---

## Client Registry

| Client | Folder Name | Domain | Status | Features Enabled |
|--------|-------------|--------|--------|-----------------|
| Portfolio (you) | `portfolio` | localhost (TBD) | Phases 1-6 complete | blog, i18n, darkMode, contactForm |
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
| tailwindcss + postcss + autoprefixer | ^3.4.17 | CSS |
| tailwindcss-animate | ^1.0.7 | Animations (shadcn) |
| @tailwindcss/typography | ^0.5.15 | Prose styling |
| tsx | ^4.19.0 | Script runner |
| cross-env | ^7.0.3 | Cross-platform env |

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

---

## Next Steps

Choose from:
1. **Phase 5C** — Deploy portfolio to Vercel with custom domain
2. **Phase 7** — Create second client to validate architecture
3. **Modern design exploration** — Add animations (GSAP/Framer Motion), scroll effects, page transitions
4. **Google Fonts loading fix** — Dynamic `<link>` tag for non-Inter fonts

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
- The user wants to explore modern web design later (GSAP, scroll animations, etc.) — current sections are intentionally animation-free and modular for easy replacement.
