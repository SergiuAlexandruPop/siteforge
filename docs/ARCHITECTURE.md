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
│   └── NEW_CLIENT_GUIDE.md      # Step-by-step client setup
│
├── clients/
│   ├── portfolio/               # Your portfolio (first client)
│   │   ├── config.ts            # Feature flags, metadata, SEO
│   │   ├── theme.ts             # Tailwind theme tokens (colors, fonts)
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
│   ├── doctor-maria/            # Future client
│   │   ├── config.ts
│   │   ├── theme.ts
│   │   ├── content/
│   │   └── public/
│   │
│   └── _template/               # Empty template for new clients
│       ├── config.ts            # Pre-filled with defaults + comments
│       ├── theme.ts
│       ├── content/
│       │   ├── pages/
│       │   │   └── index.md     # Placeholder homepage
│       │   └── blog/
│       │       └── .gitkeep
│       └── public/
│           └── .gitkeep
│
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx           # Root layout — loads client config
│   │   ├── page.tsx             # Homepage — renders client's index.md
│   │   ├── [slug]/
│   │   │   └── page.tsx         # Dynamic pages (about, services, etc.)
│   │   ├── blog/
│   │   │   ├── page.tsx         # Blog listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx     # Individual blog post
│   │   ├── en/                  # English routes (mirrors root structure)
│   │   │   ├── page.tsx
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx
│   │   │   └── blog/
│   │   │       ├── page.tsx
│   │   │       └── [slug]/
│   │   │           └── page.tsx
│   │   ├── admin/               # CMS admin (server-side rendered)
│   │   │   ├── page.tsx         # Login page
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx     # Post list
│   │   │   └── editor/
│   │   │       └── [slug]/
│   │   │           └── page.tsx # Novel editor for a post
│   │   ├── api/
│   │   │   ├── contact/
│   │   │   │   └── route.ts     # Contact form → Resend
│   │   │   ├── upload/
│   │   │   │   └── route.ts     # Image upload → R2
│   │   │   ├── blog/
│   │   │   │   └── route.ts     # CMS CRUD → GitHub API (markdown files)
│   │   │   └── auth/
│   │   │       └── route.ts     # Admin login (password check → cookie)
│   │   ├── sitemap.ts           # Auto-generated sitemap
│   │   └── robots.ts            # Auto-generated robots.txt
│   │
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components (only what we use)
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   └── LayoutShell.tsx
│   │   ├── blog/
│   │   │   ├── BlogCard.tsx
│   │   │   ├── BlogList.tsx
│   │   │   └── BlogPost.tsx     # Medium-style post renderer
│   │   ├── contact/
│   │   │   └── ContactForm.tsx
│   │   ├── seo/
│   │   │   ├── SEOHead.tsx      # Meta tags, OG, structured data
│   │   │   └── JsonLd.tsx       # Structured data schemas
│   │   ├── i18n/
│   │   │   ├── LanguageToggle.tsx
│   │   │   └── NotAvailable.tsx # "Page not available in English" placeholder
│   │   ├── theme/
│   │   │   ├── ThemeProvider.tsx
│   │   │   └── ThemeToggle.tsx  # Dark/light mode
│   │   ├── integrations/
│   │   │   └── Smartsupp.tsx    # Chat widget loader
│   │   ├── analytics/
│   │   │   └── GoogleAnalytics.tsx
│   │   └── dev/
│   │       └── DevBanner.tsx    # Dev-mode warning overlay
│   │
│   ├── lib/
│   │   ├── client-config.ts     # Loads active client's config.ts
│   │   ├── content.ts           # Reads markdown files from client's content/
│   │   ├── r2.ts                # Cloudflare R2 upload/delete utilities
│   │   ├── resend.ts            # Email sending utility
│   │   ├── github.ts            # GitHub API for CMS file operations
│   │   ├── image-optimize.ts    # Sharp-based image optimization before R2 upload
│   │   ├── auth.ts              # Admin password verification + cookie session
│   │   └── supabase.ts          # Supabase client factory (optional, per-client)
│   │
│   ├── hooks/
│   │   ├── useTheme.ts
│   │   └── useLanguage.ts
│   │
│   └── types/
│       ├── config.ts            # ClientConfig interface
│       ├── blog.ts              # BlogPost, BlogMeta interfaces
│       └── content.ts           # Page content interfaces
│
├── scripts/
│   ├── dev.ts                   # CLI: switches active client + starts dev server
│   ├── new-client.ts            # CLI: copies _template, scaffolds new client
│   └── build-client.ts          # CLI: builds specific client for Vercel
│
├── env/
│   ├── .env.portfolio           # Portfolio env vars
│   ├── .env.doctor-maria        # Doctor env vars
│   ├── .env.electrician-ion     # Electrician env vars
│   └── .env.example             # Template with all vars documented
│
├── .env.local                   # Active client env (gitignored, swapped by CLI)
├── next.config.ts
├── tailwind.config.ts           # Loads active client's theme.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 3. Data Flow Diagrams

### 3.1 Public Page Request (Static)
```
Browser → Vercel CDN → Pre-built HTML (generated at build time)
                        ↓
                  Markdown file from clients/{name}/content/pages/
                  + Client config (theme, SEO, features)
                  = Static HTML with full SEO
```
No server, no database, no API calls. Pure static delivery.

### 3.2 Blog Post with Images
```
Browser → Vercel CDN → Pre-built HTML
                        ↓
                  Markdown from clients/{name}/content/blog/
                  Images referenced as R2 URLs (or proxied via next/image)
```

### 3.3 Contact Form Submission
```
User fills form → Client-side validation
  → POST /api/contact
    → Server validates input
    → Calls Resend API with client's API key + recipient email
    → Returns success/error
  → UI shows confirmation
```

### 3.4 Blog CMS — Creating a Post
```
Client goes to /admin → Enters password → Cookie session created
  → /admin/dashboard → Fetches blog post list from GitHub API
  → Clicks "New Post" → /admin/editor/new
    → Writes in Novel editor
    → Drags image in → Image sent to POST /api/upload
      → Server optimizes with Sharp (resize, WebP, strip EXIF)
      → Uploads to Cloudflare R2
      → Returns R2 URL → Embedded in editor content
    → Clicks "Publish"
      → POST /api/blog → Server converts editor content to markdown
      → Commits .md file to GitHub via API
      → GitHub webhook triggers Vercel rebuild
      → Post live in ~60 seconds
```

### 3.5 i18n Routing
```
Request: /about         → Romanian content (default)
Request: /en/about      → English content (if exists) OR placeholder page
Request: /blog/my-post  → Romanian blog post
Request: /en/blog/post  → English blog post (if exists) OR placeholder
```

No middleware locale detection. No automatic redirects. Simple file-based routing. The language toggle in the header links between `/path` and `/en/path`.

### 3.6 Dev Mode Flow
```
Developer runs: yarn dev:portfolio
  → Script copies env/.env.portfolio → .env.local
  → Starts Next.js dev server
  → DevBanner component reads ACTIVE_CLIENT from env
  → Shows floating dev overlay with:
     - Active client name
     - Enabled features
     - Missing config warnings (red/yellow/green)
     - R2 connection status
     - Resend key status
```

---

## 4. Client Configuration Schema

### 4.1 config.ts
```typescript
// clients/{name}/config.ts

import { ClientConfig } from '@/types/config'

const config: ClientConfig = {
  // Identity
  name: 'portfolio',
  displayName: 'Alex Dev',
  domain: 'alexdev.ro',
  defaultLanguage: 'ro',

  // Feature Flags
  features: {
    i18n: true,
    blog: true,
    darkMode: true,
    contactForm: true,
    smartsupp: false,
    supabase: false,
  },

  // SEO
  seo: {
    siteName: 'Alex Dev — Full-Stack Developer',
    siteDescription: 'Portfolio and blog about tech, AI, health, and professional growth.',
    ogImage: '/og-image.jpg',
  },

  // Contact Information
  contact: {
    email: 'hello@alexdev.ro',
    phone: '+40 7XX XXX XXX',
  },

  // Navigation (Romanian labels, English auto-mapped if i18n on)
  navigation: [
    { label: 'Acasă', href: '/', labelEn: 'Home' },
    { label: 'Despre', href: '/about', labelEn: 'About' },
    { label: 'Proiecte', href: '/projects', labelEn: 'Projects' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],

  // Blog Settings
  blog: {
    postsPerPage: 10,
    showReadingTime: true,
    showAuthor: true,
    authorName: 'Alex',
    authorAvatar: '/avatar.jpg',
  },
}

export default config
```

### 4.2 theme.ts
```typescript
// clients/{name}/theme.ts

import { ClientTheme } from '@/types/config'

const theme: ClientTheme = {
  colors: {
    primary: '#2563eb',       // Brand primary
    primaryForeground: '#ffffff',
    secondary: '#64748b',
    background: '#ffffff',
    foreground: '#0f172a',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    border: '#e2e8f0',
    // Dark mode overrides
    dark: {
      background: '#0f172a',
      foreground: '#f8fafc',
      muted: '#1e293b',
      mutedForeground: '#94a3b8',
      border: '#334155',
    },
  },
  fonts: {
    heading: 'Inter',         // Google Font name
    body: 'Inter',
    blog: 'Georgia',          // Serif for Medium-style blog
  },
  borderRadius: '0.5rem',
}

export default theme
```

### 4.3 Environment Variables (.env.{client-name})
```bash
# ============================================
# CLIENT IDENTITY
# ============================================
ACTIVE_CLIENT=portfolio

# ============================================
# CLOUDFLARE R2 (Image Storage)
# ============================================
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=portfolio-images
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev

# ============================================
# RESEND (Contact Form Emails)
# ============================================
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@alexdev.ro
RESEND_TO_EMAIL=hello@alexdev.ro

# ============================================
# GITHUB API (CMS - Blog File Operations)
# ============================================
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
GITHUB_REPO=yourusername/siteforge
GITHUB_BRANCH=main

# ============================================
# ADMIN CMS
# ============================================
ADMIN_PASSWORD=a_strong_password_here
ADMIN_SESSION_SECRET=random_32_char_string_for_cookie_signing

# ============================================
# SMARTSUPP (Optional — leave empty to disable)
# ============================================
NEXT_PUBLIC_SMARTSUPP_ID=

# ============================================
# GOOGLE ANALYTICS (Optional — leave empty to disable)
# ============================================
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX

# ============================================
# SUPABASE (Optional — leave empty if not used)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

## 5. Deployment Architecture

### 5.1 One Repo → Multiple Vercel Projects

Each client has a Vercel project connected to the same GitHub repo. The differentiator is the **build command** and **environment variables**.

| Vercel Project | Domain | Build Command | Root Directory |
|---|---|---|---|
| siteforge-portfolio | alexdev.ro | `yarn build:portfolio` | `.` |
| siteforge-doctor | doctormaria.ro | `yarn build:doctor-maria` | `.` |
| siteforge-electric | electricianion.ro | `yarn build:electrician-ion` | `.` |

Each build command sets `ACTIVE_CLIENT` which tells Next.js which client config to load.

### 5.2 Build Process
```
yarn build:{client-name}
  → Sets ACTIVE_CLIENT={client-name}
  → Next.js reads clients/{client-name}/config.ts
  → Resolves theme from clients/{client-name}/theme.ts
  → Generates static pages from clients/{client-name}/content/
  → Outputs to .next/ (deployed by Vercel)
```

### 5.3 Auto-Deploy Flow
```
Push to main → GitHub webhook → ALL Vercel projects rebuild
  → Each builds with its own env vars
  → Each deploys to its own domain
  → ~60-90 seconds per site
```

### 5.4 CMS-Triggered Rebuild
```
Client publishes blog post via /admin
  → API route commits .md to GitHub
  → GitHub push triggers Vercel rebuild
  → Only the committing client's content changed
  → BUT all projects rebuild (Vercel limitation)
  → Unaffected sites rebuild with same content (no visible change)
```

This is fine for 5-7 clients. Each rebuild is fast (~60s). If this ever becomes an issue, Vercel supports "Ignored Build Step" scripts that check if the client's content actually changed.

---

## 6. Security Model

### 6.1 Attack Surface (Minimal)
- Public pages: static HTML. No server. Nothing to attack.
- `/api/contact`: rate-limited, input-validated. Sends email. No data storage.
- `/api/upload`: authenticated (admin session required), validates file type/size.
- `/api/blog`: authenticated, writes to GitHub (requires token).
- `/admin`: password-protected, session cookie (httpOnly, secure, sameSite: strict).

### 6.2 Secrets Management
- All secrets in Vercel environment variables (encrypted at rest)
- `.env.local` is gitignored
- `env/.env.{client}` files are gitignored (developer-only)
- `.env.example` documents all vars without real values
- GitHub token has minimal scopes (repo content write only)
- R2 keys have per-bucket access only

### 6.3 Image Upload Security
- File type validation (allowlist: jpg, jpeg, png, gif, webp)
- Max file size: 5MB
- EXIF data stripped before upload
- Images re-encoded via Sharp (prevents polyglot file attacks)
- Only accessible from authenticated admin routes

---

## 7. Module System

Each feature is a self-contained module that can be toggled on/off per client via `config.features`.

| Module | Files Involved | Can Be Disabled |
|---|---|---|
| Blog + CMS | `blog/`, `admin/`, `api/blog/`, `api/upload/`, Novel editor | Yes |
| i18n | `en/` routes, `LanguageToggle`, `NotAvailable` | Yes |
| Dark Mode | `ThemeProvider`, `ThemeToggle` | Yes |
| Contact Form | `ContactForm`, `api/contact/` | Yes |
| Smartsupp | `Smartsupp` script loader | Yes |
| Supabase | `lib/supabase.ts`, any client-specific features | Yes |
| Analytics | `GoogleAnalytics` script loader | Yes |

When a module is disabled, its routes return 404 and its components render nothing. No dead code ships to the client.

---

## 8. i18n Architecture

### Routing Model
- Default language (Romanian): no prefix → `/`, `/about`, `/blog/my-post`
- English: under `/en/` prefix → `/en/`, `/en/about`, `/en/blog/my-post`
- If English page doesn't exist → renders `NotAvailable` placeholder with link to Romanian version
- Language toggle only appears if `features.i18n === true`

### Content Model
- Romanian: `clients/{name}/content/pages/*.md` and `content/blog/*.md`
- English: `clients/{name}/content/pages-en/*.md` and `content/blog-en/*.md`
- Separate files, separate blog feeds. No translation linking (Medium model).
- CMS shows one language at a time with a language selector at the top.

### SEO
- `<link rel="alternate" hreflang="ro" href="..." />` on all pages
- `<link rel="alternate" hreflang="en" href="..." />` only if English version exists
- Separate sitemaps per language or combined with hreflang annotations

---

## 9. Blog Post Format (Markdown Frontmatter)

```markdown
---
title: "5 Tips for Back Pain Relief"
slug: "5-tips-back-pain"
date: "2025-06-15"
author: "Dr. Maria Popescu"
excerpt: "Simple exercises you can do at home to reduce back pain."
featuredImage: "https://pub-xxxxx.r2.dev/blog/back-pain-tips.webp"
published: true
readingTime: 5
tags: ["health", "exercise", "back-pain"]
---

Blog post content in markdown here...

![Exercise demonstration](https://pub-xxxxx.r2.dev/blog/exercise-demo.webp)

More content...
```

The Novel editor produces rich text that gets serialized to this markdown format on save. Images are R2 URLs embedded inline.

---

## 10. Future Extensibility

Things we chose NOT to build now but the architecture supports adding later:

- **Supabase per client**: Drop-in. Add env vars, import `lib/supabase.ts`, build client-specific features.
- **PWA**: Add `next-pwa` package + manifest.json per client. Toggle via feature flag.
- **OAuth / user accounts**: Add via Supabase Auth when a client needs it.
- **Next.js Image proxy for R2**: Configure `next.config.ts` `images.remotePatterns` to proxy R2 URLs through the client's domain.
- **Appointment booking**: Build as a Supabase-backed module, toggled per client.
- **E-commerce**: Would be a Tier 2 app (own repo), not suitable for this starter kit.
- **Ignored Build Step**: Vercel script that skips rebuild if the triggering commit didn't affect the current client's content folder.
