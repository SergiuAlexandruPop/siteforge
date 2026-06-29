# SiteForge — Living Context (Platform)

> **This file lives at `docs/CONTEXT.md` in the repo.**
> Scope: **platform-level** state, the Decision Log, and the client registry.
> **Per-client living state does NOT live here** — it lives in `clients/<name>/CLAUDE.md`
> (single source of truth, one fact one home). Do not duplicate client status into this file.
>
> **Auto-update:** agents update the matching doc as the final step of any change, without being
> asked, then report which docs changed so the user can review the `git diff` at commit. There is
> no ask-permission step. Full protocol: root `CLAUDE.md` -> "Documentation auto-update protocol".
> Update THIS file only for: a new client (registry row), a platform-wide change, or a new Decision.
>
> **Entry point for agents is root `CLAUDE.md`** (context + client router + auto-update protocol).

---

## Last Updated
**Date:** 2026-06-29
**Updated By:** Claude — Two platform mechanisms from ElectroWill Phase G hardening: **build-time route gating** for non-blog clients (Decision #83 — `gate-routes.ts`/`build.ts`; ElectroWill Worker **2.81 → 2.02 MB** gzip, `/admin` surface removed) and the **static-assets incremental cache** as the OpenNext serving default (Decision #84 — fixes SSG `[slug]` 404s on Workers). Earlier (2026-06-28): hosting **Vercel → Cloudflare Workers** via `@opennextjs/cloudflare` (Decision #81); per-client favicon (manifest `icon` capability).

---

## Current Phase
**Phases 1-8 Complete. Phase 9 (testing) COMPLETE (9A+9B+9C). Next: Phase 5B/5C (content + deployment) or Phase 7 (second client).**

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

**Phase 6: Client Setup Automation (COMPLETE)**
- `scripts/new-client.ts`, `scripts/toggle-feature.ts`, docs

> **Phase 7.5 (Portfolio Animation Redesign)** and **Phase 8 (UI/UX Redesign)** are
> portfolio-specific — see `clients/portfolio/CLAUDE.md` for their detail and living state.
> The Decision Log below retains the platform-level decisions made during those phases.

### What Is In Progress

**Nothing actively in progress at the platform level.**

### Platform-level Known Issues / Tech Debt
- CMS saves to GitHub; in dev mode you must `git pull` to see new posts locally (affects any blog client)
- `blog-en/` directory may not exist on GitHub until first English post is created (any i18n+blog client)
- Complex markdown (tables, footnotes) may not round-trip perfectly through Novel editor
- Next.js icon SVG `dark:fill-white` may not work inside inline SVGs — replace with currentColor if needed
- ROADMAP.md Phases 2-4 detail was compressed — restore if full history needed
- Test coverage: lib units (theme-css, i18n, content, auth, **image-optimize via real sharp**) + client config/theme + manifest (incl. **projectDetail**) contracts + route-handler integration (api/auth, api/contact, api/blog, **api/upload**) = 160 Vitest tests. **Playwright E2E** smoke-tests a production **portfolio** build (chromium) for home/blog/contact + dark-mode. E2E is portfolio-only/chromium-only by design — widen the matrix/engines later if needed
- E2E gotcha: `yarn install` must be re-run after this phase to pick up `@playwright/test` and refresh `yarn.lock` (CI uses `--frozen-lockfile`); then `yarn playwright install chromium` once locally before `yarn test:e2e`
- Removed stale `dev:/build:doctor-maria` and `dev:/build:electrician-ion` scripts (no such client folders). `new-client` adds scripts per real client

> Per-client known issues / tech debt live in each `clients/<name>/CLAUDE.md`.

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
| 58 | Motion (MIT, ~11KB) for scroll animation | useScroll/useTransform needed for continuous scroll→SVG mapping; too complex for pure rAF. Tree-shaken import from "motion/react" | Rocket Anim |
| 59 | Primary color: terracotta #B24027 | Default blue-600 looks AI-generated. Terracotta is warm, distinctive, already used on About page | Phase 8A |
| 60 | Dark mode primary: #D4613E (lighter) | #B24027 fails WCAG AA on dark backgrounds. Added optional `dark.primary` to ThemeColors type | Phase 8A |
| 61 | About page pill hover via React state | Imperative DOM style manipulation was fragile, didn't respond to theme changes | Phase 8A |
| 62 | ChatInput → CTA buttons on homepage | Visitors arrive via LinkedIn/email, not SEO. Clear CTAs > freeform text box | Phase 8B |
| 63 | RocketBlueprint 180vh → 120vh | 180vh was too much decorative scroll with zero informational content | Phase 8B |
| 64 | Homepage form → CtaBanner to /contact | Paul Boag: don't duplicate conversion points. Homepage invites, /contact converts | Phase 8B |
| 65 | Blog pinned post via frontmatter | `pinned: true` in markdown frontmatter. Scalable, content-controlled, no config dependency | Phase 8C |
| 66 | ContactPage custom component | Split layout replaces generic markdown renderer. Per-client contact pages supported | Phase 8D |
| 67 | Root [slug] routes hardcode language='ro' | i18n convention: / = Romanian, /en/ = English. Was using config.defaultLanguage ('en') which broke i18n | Phase 8D |
| 68 | BrowserMockup for project placeholders | macOS-style chrome frame makes empty placeholders look designed, not broken | Phase 8E |
| 69 | Footer: compact two-row with mini-CTA | Old footer was large, showed lots of space for little info. New: CTA row + copyright row | Phase 8F |
| 70 | Header active links via pathname | isActivePath() with prefix matching. Home = exact, others = startsWith. aria-current for a11y | Phase 8F |
| 71 | Agent-driven docs: root CLAUDE.md + client router + per-client CLAUDE.md | Multi-client repo needs a routing layer so any agent on any surface knows what a client is and where it lives. Per-client living state = single source of truth per client | Agent Docs |
| 72 | Docs auto-update (no ask-permission) | Agents update the matching doc as the final task step; user reviews git diff at commit. Replaces the old "ask before updating" rule. Enables hands-off temporal parallelism | Agent Docs |
| 73 | Build-time per-client code-splitting via single manifest + codegen | The 4 registries (`client-config`/`-layout`/`-homepage`/`-pages`) statically imported every client, leaking all clients' code into every bundle and growing O(N). Replaced with one `clients/<name>/index.ts` manifest; `scripts/gen-active-client.ts` resolves `ACTIVE_CLIENT` → `active-client.generated.ts` (single static import). Codegen chosen over a Turbopack/webpack alias because it keeps dev and build on the identical fully-static mechanism (no dual-resolver risk). Supersedes Decisions #24/#42/#43 | P0 Split |
| 73 | Per-client living state moves to clients/<name>/CLAUDE.md | CONTEXT.md slimmed to platform state + Decision Log + registry. One fact, one home; avoids drift across docs | Agent Docs |
| 74 | Vitest for unit + contract tests | Native ESM/TS, fast, zero-config (no Jest). Node env, `@` alias mirrors tsconfig, globals off (explicit imports). First suites: theme-css, i18n, content, auth | Phase 9 |
| 75 | Client config/theme **contract test** as multi-tenant guardrail | Auto-discovers every `clients/*` via `import.meta.glob` and asserts schema coherence (valid hex, feature-flag↔required-fields, no `NaN` from theme CSS). One broken client config now fails fast and names the client instead of breaking everyone's build | Phase 9 |
| 76 | CI gate: typecheck + lint + test, then per-client build matrix | A broken client config/theme should fail CI, not production. GitHub Actions on PR + push to main | Phase 9 |
| 78 | Playwright (Apache-2.0) for E2E; portfolio-only, chromium-only, production build | License clears the MIT/Apache/BSD rule. `webServer` runs `build:portfolio` + `next start` so the smoke suite hits the same artifact Vercel ships (not the dev server). One client + one engine keeps CI minutes low — the multi-tenant guardrail is already the Vitest config/manifest contracts; widen later if needed | Phase 9C |
| 79 | Vitest esbuild `jsx: 'automatic'` | tsconfig uses `jsx: "preserve"` (Next's automatic runtime). Without telling esbuild, Vitest falls back to the classic transform and any test importing a component fails with "React is not defined" (the manifest contract imports each client's full manifest, components included) | Phase 9C |
| 80 | Upload route: validation failures return 400, not 500 | `validateImageFile` (bad type / oversize) threw inside the optimize/upload try block, surfacing client errors as server errors. Parse+validate moved into their own try → 400; the second try stays for genuine sharp/R2 failures → 500 | Phase 9C |
| 81 | Host on **Cloudflare Workers via `@opennextjs/cloudflare`** (NOT Vercel, NOT next-on-pages) | Vercel Hobby/free is non-commercial only, but the client sites are commercial. Cloudflare's free tier allows commercial use, has unlimited bandwidth, and absorbs DDoS without billing. `@cloudflare/next-on-pages` is Edge-runtime-only and effectively deprecated — it would force an Edge rewrite of the Node `/api/lead` + `/api/track` routes and choke on the repo's `sharp` routes; OpenNext runs the **Node** runtime on Workers (`nodejs_compat`), so those routes work unchanged. DNS end-to-end on Cloudflare, **proxied (orange cloud)** for the free WAF/DDoS. Rate-limiting is Cloudflare-native; the free tier allows **1 rule, 10s period, IP characteristic**, so a single rule guards `/api/lead` (Bot Fight Mode + app-layer honeypot/Turnstile cover the rest). Supersedes the Vercel hosting assumption in Decisions #5/#19 wording. | Phase G |
| 82 | Per-client favicon via `ClientManifest.icon` | The shared `app/icon.svg` + `app/apple-icon.tsx` were a portfolio rocket, wrong for other clients. Added an `icon` manifest capability (`mark: (px)=>ReactElement` + `appleBackground`) rendered by dynamic `app/icon.tsx` + `app/apple-icon.tsx` via next/og; only the active client's mark is bundled (same pattern as fonts). | Phase G |
| 77 | Project-detail routes resolve via `ClientManifest.projectDetail` | Closing the residual leak from #73: shared `src/app/projects/[slug]` + `/en/...` routes hardcoded `import { projects }` and `ProjectDetail` from `clients/portfolio`, bundling portfolio data **and** component code into every client. Added optional `projectDetail` capability (`slugs` + `getMetadata` + server-component `Component`) to the manifest; routes read `activeClient.projectDetail`. Portfolio supplies it via a server wrapper that owns the lookup + `notFound()`. `resume` needs no equivalent — it's imported only by the portfolio-only `ResumePage`, never from shared `src/app/`. `Project` type stays in portfolio (manifest references only platform types) | P0 Split |
| 83 | Build-time route gating for non-blog clients | Next compiles every route file present + its imports, so a `blog:false` client still bundled the blog/CMS stack and shipped a live `/admin`. `scripts/gate-routes.ts` (run by `scripts/build.ts`) MOVES `app/admin`, `app/api/{auth,blog,upload}`, `middleware.ts`, `app/blog`, `app/en/blog` out of the tree before build + restores after. Shrinks the Worker (ElectroWill 2.81 → 2.02 MB gzip) AND removes the `/admin` attack surface. Reversible via `features.blog`; two tiers so a static case-study blog can later return read-only routes only | Phase G |
| 84 | Static-assets incremental cache = OpenNext serving default | `defineCloudflareConfig({})` routed SSG (`generateStaticParams`) `[slug]` pages through an absent incremental cache → on-demand Worker render → markdown `fs` read fails on Workers (no project FS) → 404 (sitemap too). `incrementalCache: staticAssetsIncrementalCache` serves prerendered pages read-only from the ASSETS binding. Zero infra (no R2/KV); entries are edge assets so they don't count against the 3 MB script cap. Switch to the R2/KV cache only if a client needs ISR | Phase G |

---

## Client Registry

> Per-client living state lives in each client's `clients/<folder>/CLAUDE.md` (linked below).

| Client | Folder Name | Domain | Status | Features Enabled | Agent brief |
|--------|-------------|--------|--------|-----------------|-------------|
| Portfolio (you) | `portfolio` | localhost (TBD) | Phase 8 COMPLETE | blog, i18n, darkMode, contactForm | `clients/portfolio/CLAUDE.md` |
| ElectroWill | `electrowill-solutions` | electrowill.ro (LIVE) | Launching (Phase G) | contactForm (blog/darkMode/i18n OFF) | `clients/electrowill-solutions/CLAUDE.md` |
| Doctor | `doctor-maria` | TBD | Not started | TBD | (none yet) |
| Electrician | `electrician-ion` | TBD | Not started | TBD | (none yet) |

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
| motion | ^12.38.0 | Scroll-linked SVG animation (MIT, ~11KB tree-shaken) |
| vitest | ^3.2.0 | Test runner (dev only) — unit + contract + route-integration tests |
| @playwright/test | ^1.61.1 | E2E test runner (dev only, Apache-2.0) — chromium smoke suite |

---

## Environment Setup Status

| Service | Account Created | Configured | Notes |
|---------|----------------|------------|-------|
| GitHub | Yes | Yes | Repo + token for CMS |
| Cloudflare R2 | Yes | Yes | Bucket + keys configured |
| Cloudflare Workers (OpenNext) | TBD | No | Hosting (Decision #81). `@opennextjs/cloudflare` + wrangler.jsonc; one Worker per client. Replaces Vercel. |
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
| `CLAUDE.md` (root) | Agent entry point: context + client router + auto-update protocol |
| `docs/CLAUDE-PROJECT-INSTRUCTIONS.md` | claude.ai Project seed (mirrors root CLAUDE.md) |
| `docs/WORKFLOW.md` | Surfaces, deploy, DNS, prompt templates |
| `clients/<name>/CLAUDE.md` | Per-client agent brief + living state (source of truth per client) |
| `docs/ROADMAP.md` | Phased plan with completion status |
| `docs/DEV_NOTES.md` | Gotchas, debugging, environment tips |
| `docs/NEW_CLIENT_GUIDE.md` | Detailed step-by-step client setup |
| `docs/CLIENT_SETUP_CHECKLIST.md` | Quick-reference operational checklist |
| `clients/portfolio/DESIGN.md` | **Portfolio design & animation architecture** |

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
- **Zero commercial-license dependencies.** Only MIT/Apache/BSD. No GSAP, no paid plugins.
- **Explicit import registries** (not dynamic imports) for Turbopack reliability.
- **i18n routing convention:** `/` = Romanian, `/en/` = English. Root `[slug]` routes hardcode `'ro'`. This is independent of `config.defaultLanguage`.

> Per-client gotchas (e.g. portfolio's terracotta palette, slate-blue dark mode, blueprint rocket,
> DESIGN.md-first rule) live in each `clients/<name>/CLAUDE.md` — not here.

---

## Next Steps

Per-client next steps live in each `clients/<name>/CLAUDE.md` ("Living state → Next step").

Platform-level direction: either polish + deploy the **portfolio** (Phase 5B/5C) or scope the
second client **ElectroWill** (Phase 7) to validate the multi-client architecture end-to-end.
