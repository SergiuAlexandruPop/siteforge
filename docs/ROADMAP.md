# SiteForge — Implementation Roadmap

> **This file lives at `docs/ROADMAP.md` in the repo.**
> Claude updates checkboxes and status after each implementation chat.
> Each phase is designed to fit within 1-3 Claude chat sessions.

---

## Phase 0: Planning & Architecture
**Status: COMPLETE**
**Chats estimated: 1-2 | Chats used: Done in planning project**

- [x] Define business model and value proposition
- [x] Choose tech stack (Next.js, Tailwind, shadcn, R2, Resend, Novel)
- [x] Design mono-repo architecture with client config folders
- [x] Define feature flag system
- [x] Define i18n strategy (Romanian default, /en/ prefix)
- [x] Design CMS approach (custom micro-CMS, GitHub API, markdown)
- [x] Design image pipeline (Sharp optimization → R2)
- [x] Create ARCHITECTURE.md
- [x] Create CONTEXT.md
- [x] Create ROADMAP.md (this file)
- [x] Create DEV_NOTES.md
- [x] Create NEW_CLIENT_GUIDE.md
- [x] Create CLAUDE_PROJECT_INSTRUCTIONS.md

---

## Phase 1: Project Skeleton
**Status: IN PROGRESS (1A + 1B complete, 1C pending)**
**Chats estimated: 2-3 | Chats used: 1**

### 1A: Initialize Project & Config System
- [x] Create Next.js project with TypeScript strict mode
- [x] Configure Tailwind CSS
- [x] Install shadcn/ui (only base components: Button, Input, Card)
- [x] Create `clients/_template/` with config.ts, theme.ts, content/ structure
- [x] Create `clients/portfolio/` with your config and theme
- [x] Create `src/types/config.ts` — ClientConfig and ClientTheme interfaces
- [x] Create `src/lib/client-config.ts` — loads active client config from ACTIVE_CLIENT env var
- [x] Create `env/.env.example` — documented template
- [x] Create `env/.env.portfolio` — your env vars (with placeholder values)
- [x] Add env/ to .gitignore
- [x] Create `tailwind.config.ts` that reads active client's theme.ts

### 1B: Dev Tooling
- [x] Create `scripts/dev.ts` — CLI that copies env file + starts dev server
- [x] Add yarn scripts: `dev:portfolio`, `dev:doctor-maria`, etc.
- [x] Create `src/components/dev/DevBanner.tsx` — floating dev overlay
- [ ] Verify dev workflow: `yarn dev:portfolio` starts correctly

### 1C: Layout Shell
- [x] Create `src/app/layout.tsx` — root layout loading client config
- [ ] Create `src/components/layout/LayoutShell.tsx` — header + main + footer
- [ ] Create `src/components/layout/Header.tsx` — responsive nav, mobile menu, language toggle slot, dark mode slot
- [ ] Create `src/components/layout/Footer.tsx` — contact info, copyright
- [ ] Create `src/components/layout/MobileMenu.tsx` — hamburger menu
- [ ] Verify: homepage renders with layout, navigation works, mobile responsive

**Milestone: Running dev server showing a skeleton site with navigation.**

---

## Phase 2: Core Modules
**Status: NOT STARTED**
**Chats estimated: 3-4**

### 2A: Content Rendering & Pages
- [ ] Create `src/lib/content.ts` — reads .md files from active client's content/
- [ ] Install and configure markdown processing (gray-matter + remark/rehype or next-mdx-remote)
- [ ] Create `src/app/page.tsx` — homepage rendering client's index.md
- [ ] Create `src/app/[slug]/page.tsx` — dynamic pages (about, services, etc.)
- [ ] Create placeholder pages in `clients/portfolio/content/pages/` (index.md, about.md, contact.md)
- [ ] Verify: all pages render correctly from markdown

### 2B: SEO
- [ ] Create `src/components/seo/SEOHead.tsx` — dynamic meta tags, OG tags
- [ ] Create `src/components/seo/JsonLd.tsx` — structured data (Organization, WebSite, BlogPosting)
- [ ] Create `src/app/sitemap.ts` — auto-generates sitemap from pages + blog posts
- [ ] Create `src/app/robots.ts` — auto-generates robots.txt
- [ ] Add canonical URLs, hreflang tags (if i18n enabled)
- [ ] Verify: Lighthouse SEO score > 95

### 2C: Contact Form
- [ ] Create `src/components/contact/ContactForm.tsx` — name, email, phone, message fields
- [ ] Create `src/app/api/contact/route.ts` — validates input, sends via Resend
- [ ] Create `src/lib/resend.ts` — Resend API utility
- [ ] Add form validation (client-side + server-side)
- [ ] Add loading, success, error states
- [ ] Add basic rate limiting (IP-based, using headers)
- [ ] Verify: form sends email, handles errors gracefully

### 2D: i18n
- [ ] Create `/en/` route mirrors (page.tsx, [slug]/page.tsx)
- [ ] Create `src/components/i18n/LanguageToggle.tsx` — shows only if i18n enabled
- [ ] Create `src/components/i18n/NotAvailable.tsx` — "Page not available in English" placeholder
- [ ] Update `src/lib/content.ts` to resolve content from pages-en/ when language is English
- [ ] Add hreflang link tags to SEO component
- [ ] Verify: language toggle switches between /about and /en/about, missing pages show placeholder

**Milestone: Fully functional multi-page site with SEO, contact form, and i18n.**

---

## Phase 3: Blog System
**Status: NOT STARTED**
**Chats estimated: 2-3**

### 3A: Blog Frontend (Public)
- [ ] Create `src/app/blog/page.tsx` — blog listing with pagination
- [ ] Create `src/app/blog/[slug]/page.tsx` — individual post (Medium-style)
- [ ] Create `src/components/blog/BlogList.tsx` — card grid with featured image, title, excerpt, date, reading time
- [ ] Create `src/components/blog/BlogCard.tsx` — individual card component
- [ ] Create `src/components/blog/BlogPost.tsx` — full post renderer (narrow column, serif font, generous spacing)
- [ ] Style blog to match Medium aesthetics (typography plugin + custom CSS)
- [ ] Add blog posts to sitemap generation
- [ ] Add BlogPosting structured data (JSON-LD)
- [ ] Create sample blog posts in `clients/portfolio/content/blog/`
- [ ] Add English blog routes `/en/blog/` and `/en/blog/[slug]/`
- [ ] Verify: blog list, individual posts, SEO, reading time all work

### 3B: Blog Admin CMS
- [ ] Create `src/app/admin/page.tsx` — login page (password form)
- [ ] Create `src/lib/auth.ts` — password verification + httpOnly cookie session
- [ ] Create `src/app/api/auth/route.ts` — login endpoint
- [ ] Create admin middleware — checks session cookie, redirects to login if missing
- [ ] Create `src/app/admin/dashboard/page.tsx` — post list (title, date, status, edit/delete buttons)
- [ ] Create `src/app/admin/editor/[slug]/page.tsx` — Novel editor page
- [ ] Install and configure Novel editor
- [ ] Create `src/lib/github.ts` — GitHub API utilities (read file, create file, update file, delete file)
- [ ] Create `src/app/api/blog/route.ts` — CRUD endpoints that call GitHub API
- [ ] Wire Novel editor to save → API → GitHub commit
- [ ] Add draft/published toggle
- [ ] Add language selector in CMS dashboard (if i18n enabled)
- [ ] Verify: full CRUD flow — create, edit, delete posts via CMS

### 3C: Image Upload Pipeline
- [ ] Create `src/lib/r2.ts` — R2 upload/delete utilities (S3-compatible SDK)
- [ ] Create `src/lib/image-optimize.ts` — Sharp resize + WebP conversion + EXIF strip
- [ ] Create `src/app/api/upload/route.ts` — authenticated upload endpoint
- [ ] Wire Novel editor image upload to → optimize → R2 → return URL
- [ ] Add file type validation (jpg, jpeg, png, gif, webp only)
- [ ] Add file size limit (5MB max)
- [ ] Verify: drag image into editor → appears in post → persists after save

**Milestone: Complete blog with CMS. Client can log in and manage posts with images.**

---

## Phase 4: Optional Modules & Polish
**Status: NOT STARTED**
**Chats estimated: 2-3**

### 4A: Dark Mode
- [ ] Create `src/components/theme/ThemeProvider.tsx` — system detection + localStorage persistence
- [ ] Create `src/components/theme/ThemeToggle.tsx` — sun/moon toggle
- [ ] Integrate with client theme.ts dark color overrides
- [ ] Only render toggle if `features.darkMode === true`
- [ ] Verify: toggle works, persists, respects system preference, smooth transition

### 4B: Smartsupp Integration
- [ ] Create `src/components/integrations/Smartsupp.tsx` — script loader
- [ ] Only load if `features.smartsupp === true` and NEXT_PUBLIC_SMARTSUPP_ID is set
- [ ] Verify: widget appears on page, doesn't load when disabled

### 4C: Analytics
- [ ] Create `src/components/analytics/GoogleAnalytics.tsx` — GA4 script loader
- [ ] Only load if NEXT_PUBLIC_GA4_ID is set
- [ ] Add to root layout
- [ ] Verify: events show in GA4 real-time dashboard

### 4D: Dev Banner Polish
- [ ] Comprehensive config checks (all env vars, all services)
- [ ] Color-coded status (red/yellow/green)
- [ ] Only renders in development mode
- [ ] Click to dismiss (persists for session)

**Milestone: All optional modules working. Feature flags control everything.**

---

## Phase 5: Portfolio Site — Your First Client
**Status: NOT STARTED**
**Chats estimated: 3-5**

### 5A: Design & Content
- [ ] Design portfolio homepage layout (hero, projects grid, about snippet, blog preview)
- [ ] Design projects page (showcase cards with screenshots, tech stack, links)
- [ ] Design about page (professional story, skills, reconversion narrative)
- [ ] Design contact page
- [ ] Write homepage content (Romanian)
- [ ] Write about page content
- [ ] Write first 2-3 blog posts

### 5B: Implementation
- [ ] Implement portfolio-specific components (project cards, hero section)
- [ ] Finalize theme.ts with your brand colors and fonts
- [ ] Add all page content as markdown files
- [ ] Add project screenshots and images
- [ ] Test all pages on mobile (375px), tablet (768px), desktop (1280px)

### 5C: Deployment
- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Create Vercel project (siteforge-portfolio)
- [ ] Configure environment variables in Vercel
- [ ] Create Cloudflare R2 bucket (portfolio-images)
- [ ] Create Resend account + verify domain
- [ ] Set up Google Analytics + Search Console
- [ ] Connect custom domain
- [ ] Test full flow: CMS login → create post → image upload → publish → verify live
- [ ] Run Lighthouse audit (target: 95+ all categories)

**Milestone: Your portfolio is live. This is your sales tool for future clients.**

---

## Phase 6: Client Setup Automation
**Status: NOT STARTED**
**Chats estimated: 1-2**

- [ ] Create `scripts/new-client.ts` — interactive CLI that scaffolds a new client folder
- [ ] CLI asks: client name, domain, which features to enable
- [ ] CLI creates: config.ts, theme.ts, content/ with placeholder pages, env template
- [ ] CLI adds yarn scripts for the new client
- [ ] Update NEW_CLIENT_GUIDE.md with final verified steps
- [ ] Test: run CLI, verify all files created correctly

**Milestone: Adding a new client takes < 5 minutes of scaffolding.**

---

## Phase 7: Second Client (Template Validation)
**Status: NOT STARTED**
**Chats estimated: 2-3**

- [ ] Use NEW_CLIENT_GUIDE.md to set up a second client (doctor or electrician)
- [ ] Customize theme, content, features for this client
- [ ] Deploy to Vercel as separate project
- [ ] Verify full independence: own domain, own CMS, own R2 bucket, own analytics
- [ ] Document any issues or improvements needed in DEV_NOTES.md
- [ ] Update starter kit if any changes needed

**Milestone: Two independent sites running from one codebase. Architecture validated.**

---

## Future Phases (Not Scheduled)

- [ ] Next.js Image proxy for branded R2 URLs per client domain
- [ ] Vercel "Ignored Build Step" script to skip unchanged client rebuilds
- [ ] Supabase integration module (for clients needing database features)
- [ ] PWA module (for clients needing installable app)
- [ ] Email templates (beautiful Resend email templates per client)
- [ ] Blog RSS feed generation
- [ ] Blog search functionality
- [ ] Social sharing buttons on blog posts
- [ ] Related posts recommendation
- [ ] CMS: scheduled publishing (draft with future publish date)
- [ ] CMS: image gallery management (browse/delete uploaded images)
- [ ] Performance monitoring (Web Vitals tracking)
