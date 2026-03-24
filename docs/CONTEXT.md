# SiteForge — Living Context

> **This file lives at `docs/CONTEXT.md` in the repo.**
> Claude MUST read this file at the start of every new chat.
> Claude MUST update this file at the end of every implementation chat (with user permission).

---

## Last Updated
**Date:** 2026-03-24
**Updated By:** Claude — Phase 3C + Theme wiring complete

---

## Current Phase
**Phases 1-4 Complete + Phase 3C Complete + Theme wiring done**

Ready for Phase 5: Portfolio Design & Content.

---

## Project Status

### What Has Been Built

**Phase 1A+1B: Project Skeleton & Dev Tooling**
- Next.js 15 with TypeScript strict mode, Turbopack for dev
- Tailwind CSS v3 + shadcn/ui (Button, Input, Card)
- Client config system with template and portfolio
- CLI dev scripts, DevBanner overlay

**Phase 1C: Layout Shell**
- Sticky header, mobile menu, footer, LayoutShell composition

**Phase 2A-2D: Core Modules**
- Markdown content rendering (gray-matter + remark-html with allowDangerousHtml)
- SEO (metadata API, JSON-LD, sitemap, robots.txt)
- Contact form (client validation + Resend server-side)
- i18n (Romanian default, /en/ prefix, language toggle, NotAvailable placeholder)

**Phase 3A: Blog Frontend**
- Blog listing, individual posts (Medium-style), BlogPosting JSON-LD
- Romanian + English blog routes

**Phase 3B: Blog Admin CMS + Novel Editor**
- JWT auth (jose), middleware-protected /admin routes
- Dashboard with RO/EN toggle, CRUD via GitHub API
- Novel 0.5 WYSIWYG editor with full toolbar (H2/H3/H4, B/I/U/S, code, lists, blockquote, code block, HR, link, image)
- Toggle between visual editor and raw markdown
- Bubble menu on text selection

**Phase 3C: Image Upload Pipeline**
- `src/lib/r2.ts` — Cloudflare R2 upload/delete via AWS S3 SDK
- `src/lib/image-optimize.ts` — Sharp resize (max 1200px), WebP conversion, EXIF stripping
- `src/app/api/upload/route.ts` — authenticated upload endpoint
- Three upload methods: toolbar button (file picker), drag-and-drop, paste
- Custom Tiptap image extension with `data-size` (small/medium/full) and `data-align` (left/center/right)
- Floating image toolbar appears on image click with size + alignment controls
- Image CSS works in both editor and public blog (uses data attributes)
- `allowDangerousHtml: true` in remark-html to preserve img data attributes in public blog

**Phase 4A-4D: Optional Modules**
- Dark mode (ThemeProvider, ThemeToggle, anti-FOUC script, feature-flag gated)
- Smartsupp chat widget (feature-flag + env gated)
- Google Analytics GA4 (env gated, next/script afterInteractive)
- DevBanner with smart env filtering by feature flags

**Theme System**
- `src/lib/theme-css.ts` — converts client theme.ts hex colors → HSL CSS variables
- Layout injects `<style>` tag overriding shadcn defaults with client's brand colors
- Font CSS variables (--font-heading, --font-body, --font-blog) from theme.ts
- BlogPost uses --font-blog variable instead of hardcoded Georgia

### What Is In Progress
- Nothing. Ready for Phase 5.

### Known Issues
- CMS saves to GitHub; in dev mode you must `git pull` to see new posts locally
- `blog-en/` directory may not exist until first English post is created
- Complex markdown (tables, footnotes) may not round-trip perfectly through Novel editor
- Google Fonts not loaded via `<link>` tag yet — currently only CSS variables set. Works when fonts match system/Inter (loaded via next/font). Other fonts need a Google Fonts `<link>` in head.

### Tech Debt
- Client config loader uses explicit imports per client. Phase 6 CLI will automate.
- Google Fonts loading should dynamically add `<link>` for non-Inter fonts.
- Novel editor image drag-drop shows no loading indicator during upload.

---

## Decision Log

| # | Decision | Rationale | Date |
|---|----------|-----------|------|
| 1-28 | (See previous entries) | | Planning-Phase 3B |
| 29 | Anti-FOUC inline script for dark mode | Zero dependency, works with feature flags | Phase 4A |
| 30 | next/script afterInteractive for GA4 | Next.js recommended, better loading | Phase 4C |
| 31 | Smart DevBanner env filtering by feature flags | Reduces noise, only relevant warnings | Phase 4D |
| 32 | Novel editor with markdown fallback toggle | Power users get raw markdown, clients get WYSIWYG | Novel |
| 33 | Lazy-load Novel editor (React.lazy + Suspense) | Avoids SSR issues, reduces initial bundle | Novel |
| 34 | Novel MarkdownExtension for markdown↔editor | Native markdown round-trip, saves as .md | Novel |
| 35 | Custom uploadAndInsert instead of Novel's createImageUpload | Novel's version requires UploadImagesPlugin; ours is simpler | Phase 3C |
| 36 | Predefined image sizes + alignment (not free-form resize) | Simpler, works with markdown, clients understand small/medium/full | Phase 3C |
| 37 | data-size/data-align attributes on images | Survives markdown round-trip as HTML, CSS handles display | Phase 3C |
| 38 | Theme CSS variables generated from theme.ts at build time | Each client gets their brand colors without touching globals.css | Theme |

---

## Client Registry

| Client | Folder Name | Domain | Status | Features Enabled |
|--------|-------------|--------|--------|-----------------|
| Portfolio (you) | `portfolio` | localhost (TBD) | Phases 1-4 complete | blog, i18n, darkMode, contactForm |
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
| @aws-sdk/client-s3 | latest | R2 upload (S3-compatible) |
| sharp | latest | Image optimization |
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
| Cloudflare R2 | Yes | Yes | Bucket created, keys in env |
| Vercel | TBD | No | Need account + project per client |
| Resend | TBD | No | Need account + API key |
| Google Analytics | TBD | No | Need GA4 property per client |
| Google Search Console | TBD | No | Need verification per domain |
| Smartsupp | TBD | No | Optional, per client |

---

## Next Steps

**Next chat should:** Begin Phase 5 — Portfolio Design & Content.

Phase 5 involves:
1. Design portfolio homepage layout (hero, projects, about snippet, blog preview)
2. Design projects page, about page, contact page
3. Write content in Romanian
4. Implement portfolio-specific components
5. Finalize theme with actual brand colors/fonts
6. Deploy to Vercel with custom domain

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
