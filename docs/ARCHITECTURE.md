# SiteForge — Technical Architecture

> **This file lives at `docs/ARCHITECTURE.md` in the repo.**
> Claude reads this file to understand the system design. Update it when architecture changes.

---

## 1. System Overview

SiteForge is a mono-repo Next.js starter kit that produces independent business websites from shared source code. Each client is a configuration folder. Each gets its own Vercel deployment with its own domain.

```
┌─────────────────────────────────────────────────────┐
│                   GitHub Repository                  │
│                                                      │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Shared   │  │   clients/   │  │    docs/      │  │
│  │  Source   │  │  portfolio/  │  │ ARCHITECTURE  │  │
│  │  Code     │  │  doctor/     │  │ CONTEXT       │  │
│  │  (src/)   │  │  electric/   │  │ ROADMAP       │  │
│  └──────────┘  └──────────────┘  └───────────────┘  │
└──────────┬──────────┬──────────────┬─────────────────┘
           │          │              │
     Vercel Build     │        Vercel Build
     (portfolio)      │        (electric)
           │     Vercel Build        │
           │     (doctor)            │
           ▼          ▼              ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │ alexdev  │ │ doctor   │ │ electric │
    │ .ro      │ │ maria.ro │ │ ion.ro   │
    └──────────┘ └──────────┘ └──────────┘
```

Each deployed site is fully independent: own domain, own R2 bucket, own Resend config, own analytics, optionally own Supabase project.

---

## 2. Project File Structure

```
siteforge/
├── docs/
│   ├── ARCHITECTURE.md          # This file — system design reference
│   ├── CONTEXT.md               # Living state — updated every chat
│   ├── ROADMAP.md               # Phased plan with status tracking
│   ├── DEV_NOTES.md             # Gotchas, tips, debugging guides
│   ├── NEW_CLIENT_GUIDE.md      # Step-by-step client setup
│   └── CLIENT_SETUP_CHECKLIST.md # Quick-reference operational checklist
│
├── clients/
│   ├── portfolio/               # Your portfolio (first client)
│   │   ├── config.ts            # Feature flags, metadata, SEO
│   │   ├── theme.ts             # Tailwind theme tokens (colors, fonts)
│   │   ├── DESIGN.md            # Portfolio-specific design & animation spec
│   │   ├── data/
│   │   │   └── projects.ts      # Typed project data for ProjectShowcase
│   │   ├── content/
│   │   │   ├── pages/           # Romanian page content (.md)
│   │   │   ├── pages-en/        # English page content (.md, if i18n on)
│   │   │   ├── blog/            # Romanian blog posts (.md)
│   │   │   └── blog-en/         # English blog posts (.md, if i18n on)
│   │   └── public/              # Client-specific static assets
│   │       ├── logo.svg
│   │       ├── favicon.ico
│   │       └── og-image.jpg
│   │
│   ├── _template/               # Empty template for new clients
│   └── electrowill-solutions/   # Scaffolded client (not built yet)
│
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx           # Root layout — uses getClientLayout()
│   │   ├── page.tsx             # Homepage — uses getClientHomePage()
│   │   ├── [slug]/page.tsx      # Dynamic pages
│   │   ├── blog/                # Blog routes
│   │   ├── en/                  # English routes (mirrors root)
│   │   ├── admin/               # CMS admin (protected)
│   │   ├── api/                 # API routes (contact, upload, blog, auth)
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── globals.css          # CSS variables, keyframes, glow effects
│   │
│   ├── components/
│   │   ├── ui/                  # shadcn/ui (Button, Input, Card)
│   │   ├── layout/              # SHARED — default layout for all clients
│   │   │   ├── LayoutShell.tsx    # Default layout (fallback)
│   │   │   ├── Header.tsx         # Default header (sticky)
│   │   │   ├── Footer.tsx
│   │   │   └── MobileMenu.tsx     # Reused by portfolio header too
│   │   ├── sections/            # SHARED — generic homepage sections
│   │   │   ├── DefaultHomePage.tsx # Generic homepage (fallback)
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── AboutSnippet.tsx
│   │   │   ├── Showcase.tsx
│   │   │   ├── BlogPreview.tsx    # Async — fetches blog posts
│   │   │   ├── CtaBanner.tsx
│   │   │   └── index.ts
│   │   ├── animations/          # SHARED — animation primitives
│   │   │   ├── SmoothScroll.tsx   # Lenis wrapper (client component)
│   │   │   ├── ScrollReveal.tsx   # IntersectionObserver reveal
│   │   │   ├── RotatingText.tsx   # Cycling text with fade
│   │   │   ├── Marquee.tsx        # Infinite scroll strip
│   │   │   ├── CountUp.tsx        # Animated number counter
│   │   │   └── index.ts
│   │   ├── portfolio/           # PORTFOLIO-SPECIFIC compositions
│   │   │   ├── PortfolioLayout.tsx  # SmoothScroll + header + footer
│   │   │   ├── PortfolioHeader.tsx  # Transparent → blur on scroll
│   │   │   ├── PortfolioFooter.tsx  # Enhanced footer with gradient
│   │   │   ├── AnimatedHero.tsx     # Rotating text, dark glow, CTAs
│   │   │   ├── TechMarquee.tsx      # Tech stack logo marquee
│   │   │   ├── TabbedServices.tsx   # Tabs (desktop) / accordion (mobile)
│   │   │   ├── ProjectShowcase.tsx  # Project cards with hover glow
│   │   │   ├── HomePage.tsx         # Full homepage composition
│   │   │   ├── icons.tsx            # 8 inline SVG tech logos
│   │   │   └── index.ts
│   │   ├── blog/                # Blog components
│   │   ├── contact/             # Contact form
│   │   ├── seo/                 # SEO + JSON-LD
│   │   ├── i18n/                # Language toggle + NotAvailable
│   │   ├── theme/               # ThemeProvider + ThemeToggle
│   │   ├── integrations/        # Smartsupp
│   │   ├── analytics/           # Google Analytics
│   │   └── dev/                 # DevBanner
│   │
│   ├── lib/
│   │   ├── client-config.ts     # Explicit import registry for clients
│   │   ├── client-layout.ts     # Per-client layout registry
│   │   ├── client-homepage.ts   # Per-client homepage registry
│   │   ├── content.ts           # Markdown reading
│   │   ├── r2.ts                # Cloudflare R2 utilities
│   │   ├── resend.ts            # Email sending
│   │   ├── github.ts            # GitHub API for CMS
│   │   ├── image-optimize.ts    # Sharp optimization
│   │   └── auth.ts              # Admin auth
│   │
│   ├── hooks/
│   │   ├── useReducedMotion.ts  # prefers-reduced-motion
│   │   ├── useScrollReveal.ts   # IntersectionObserver
│   │   ├── useScrollVideo.ts    # Scroll-linked video (stub)
│   │   ├── useTheme.ts
│   │   └── useLanguage.ts
│   │
│   └── types/
│       ├── config.ts            # ClientConfig, ClientTheme interfaces
│       ├── animations.ts        # Animation prop interfaces
│       ├── blog.ts
│       └── content.ts
│
├── scripts/
│   ├── dev.ts                   # CLI: switches client + starts dev
│   ├── new-client.ts            # CLI: scaffolds new client
│   ├── toggle-feature.ts        # CLI: enable/disable features
│   └── build-client.ts          # CLI: builds specific client
│
├── env/                         # Per-client env files (gitignored)
├── next.config.ts
├── tailwind.config.ts           # Loads active client's theme.ts
├── tsconfig.json
└── package.json
```

---

## 3. Per-Client Layout & Homepage Architecture

### 3.1 Registry Pattern (Decision #24, #42, #43)

Two registries use explicit imports (no dynamic `import()`) for Turbopack reliability:

**`src/lib/client-layout.ts`** — maps `ACTIVE_CLIENT` → layout component
```
'portfolio' → PortfolioLayout (SmoothScroll + custom header/footer)
default    → LayoutShell (standard sticky header + footer)
```

**`src/lib/client-homepage.ts`** — maps `ACTIVE_CLIENT` → homepage component
```
'portfolio' → PortfolioHomePage (animated hero + services + projects + blog + CTA)
default    → DefaultHomePage (generic sections)
```

### 3.2 Portfolio Data Flow
```
layout.tsx
  → getClientLayout('portfolio') → PortfolioLayout
    → SmoothScroll (Lenis wrapper)
    → PortfolioHeader (transparent → blur on scroll, fixed position)
    → main (pt-16 offset for fixed header)
    → PortfolioFooter (dark mode gradient top edge)

page.tsx
  → getClientHomePage('portfolio') → PortfolioHomePage
    → AnimatedHero (RotatingText, radial glow, CTAs, TechMarquee)
    → ScrollReveal > TabbedServices (tabs desktop / accordion mobile)
    → ScrollReveal > ProjectShowcase (2-col grid, hover glow)
    → ScrollReveal > BlogPreview (latest 3 posts, blog flag gated)
    → ScrollReveal > CtaBanner (gradient bg, glow in dark mode)
```

### 3.3 Animation Component Architecture
```
SHARED (src/components/animations/) — any client can use:
  SmoothScroll    → Lenis wrapper, auto-disables on reduced-motion
  ScrollReveal    → IntersectionObserver, fade/slide on viewport entry
  RotatingText    → useState/setInterval word cycling with fade
  Marquee         → CSS keyframe infinite scroll, duplicated children
  CountUp         → requestAnimationFrame number animation

PORTFOLIO-SPECIFIC (src/components/portfolio/) — compositions:
  AnimatedHero    → RotatingText + TechMarquee + dark glow + CTAs
  TechMarquee     → Marquee + 8 inline SVG tech icons in pills
  TabbedServices  → useState tabs (desktop) / accordion (mobile)
  ProjectShowcase → projects.ts data → card grid with hover effects
  HomePage        → All above composed with ScrollReveal wrapping
```

All animation components check `useReducedMotion()` and degrade gracefully.

---

## 4. Data Flow Diagrams

### 4.1 Public Page Request (Static)
```
Browser → Vercel CDN → Pre-built HTML (generated at build time)
                        ↓
                  Markdown file from clients/{name}/content/pages/
                  + Client config (theme, SEO, features)
                  = Static HTML with full SEO
```

### 4.2 Blog Post with Images
```
Browser → Vercel CDN → Pre-built HTML
                        ↓
                  Markdown from clients/{name}/content/blog/
                  Images referenced as R2 URLs
```

### 4.3 Contact Form Submission
```
User fills form → Client-side validation
  → POST /api/contact → Server validates → Resend API → success/error
```

### 4.4 Blog CMS — Creating a Post
```
Admin → /admin login → cookie session
  → Dashboard → GitHub API (fetch post list)
  → Editor → Novel WYSIWYG
    → Image drag/drop → /api/upload → Sharp optimize → R2 → URL returned
  → Publish → /api/blog → markdown → GitHub commit → Vercel rebuild → live
```

### 4.5 i18n Routing
```
/about         → Romanian content (default)
/en/about      → English content (or NotAvailable placeholder)
```

### 4.6 Dev Mode Flow
```
yarn dev:portfolio → copy env → start Turbopack → DevBanner overlay
```

---

## 5. Client Configuration Schema

(See `clients/_template/config.ts` and `clients/_template/theme.ts` for full schema with comments.)

Key interfaces: `ClientConfig`, `ClientTheme`, `ClientFeatures` in `src/types/config.ts`.

---

## 6. Deployment Architecture

### 6.1 One Repo → Multiple Vercel Projects

| Vercel Project | Domain | Build Command |
|---|---|---|
| siteforge-portfolio | alexdev.ro | `yarn build:portfolio` |
| siteforge-doctor | doctormaria.ro | `yarn build:doctor-maria` |

Each build sets `ACTIVE_CLIENT` → Next.js loads that client's config/theme/content.

### 6.2 Auto-Deploy: push to main → all Vercel projects rebuild (~60s each).

### 6.3 CMS-Triggered: admin publishes post → GitHub commit → Vercel rebuild.

---

## 7. Security Model

- Public pages: static HTML, no server attack surface
- `/api/contact`: rate-limited, input-validated
- `/api/upload`: admin session required, file type/size validated, EXIF stripped
- `/api/blog`: admin session required, writes to GitHub
- `/admin`: password auth, httpOnly secure sameSite:strict cookie
- All secrets in Vercel env vars (encrypted at rest)

---

## 8. Module System

| Module | Can Be Disabled | Feature Flag |
|---|---|---|
| Blog + CMS | Yes | `features.blog` |
| i18n | Yes | `features.i18n` |
| Dark Mode | Yes | `features.darkMode` |
| Contact Form | Yes | `features.contactForm` |
| Smartsupp | Yes | `features.smartsupp` |
| Supabase | Yes | `features.supabase` |
| Analytics | Yes | env var gated |

Disabled modules render nothing. No dead code ships.

---

## 9. i18n Architecture

- Romanian: no prefix (`/about`)
- English: `/en/` prefix (`/en/about`)
- Missing English page → `NotAvailable` placeholder
- No middleware locale detection, no redirects
- SEO: hreflang alternates on all pages

---

## 10. Future Extensibility

The architecture supports: Supabase per client, PWA, OAuth, Next.js Image proxy for R2, appointment booking, Ignored Build Step for selective rebuilds. E-commerce would be a Tier 2 app (own repo).
