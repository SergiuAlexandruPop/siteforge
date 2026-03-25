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
**Status: COMPLETE**
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
- [x] Verify dev workflow: `yarn dev:portfolio` starts correctly

### 1C: Layout Shell
- [x] Create `src/app/layout.tsx` — root layout loading client config
- [x] Create `src/components/layout/LayoutShell.tsx` — header + main + footer
- [x] Create `src/components/layout/Header.tsx` — responsive nav, mobile menu, language toggle slot, dark mode slot
- [x] Create `src/components/layout/Footer.tsx` — contact info, copyright
- [x] Create `src/components/layout/MobileMenu.tsx` — hamburger menu
- [x] Verify: homepage renders with layout, navigation works, mobile responsive

**Milestone: Running dev server showing a skeleton site with navigation. ✅**

---

## Phase 2: Core Modules
**Status: COMPLETE**
**Chats estimated: 3-4 | Chats used: 1**

### 2A: Content Rendering & Pages
- [x] Create `src/lib/content.ts` — reads .md files from active client's content/
- [x] Install and configure markdown processing (gray-matter + remark + remark-html)
- [x] Create `src/app/page.tsx` — homepage rendering client's index.md
- [x] Create `src/app/[slug]/page.tsx` — dynamic pages (about, services, etc.)
- [x] Create placeholder pages in `clients/portfolio/content/pages/` (index.md, about.md, contact.md)
- [x] Verify: all pages render correctly from markdown

### 2B: SEO
- [x] Used Next.js Metadata API instead of custom SEOHead.tsx (cleaner, recommended approach)
- [x] Create `src/components/seo/JsonLd.tsx` — structured data (Organization, WebSite)
- [x] Create `src/app/sitemap.ts` — auto-generates sitemap from pages + blog posts
- [x] Create `src/app/robots.ts` — auto-generates robots.txt
- [x] Add canonical URLs, hreflang tags (if i18n enabled)
- [x] Layout metadata with OG tags and title template

### 2C: Contact Form
- [x] Create `src/components/contact/ContactForm.tsx` — name, email, phone, message fields
- [x] Create `src/app/api/contact/route.ts` — validates input, sends via Resend
- [x] Create `src/lib/resend.ts` — Resend API utility
- [x] Add form validation (client-side + server-side)
- [x] Add loading, success, error states
- [x] Form renders only on contact page when features.contactForm is true

### 2D: i18n
- [x] Create `/en/` route mirrors (page.tsx, [slug]/page.tsx)
- [x] Create `src/components/i18n/LanguageToggle.tsx` — shows only if i18n enabled
- [x] Create `src/components/i18n/NotAvailable.tsx` — "Page not available in English" placeholder
- [x] Content resolves from pages-en/ when language is English
- [x] Add hreflang link tags via Next.js alternates metadata
- [x] Verify: language toggle switches between /about and /en/about, missing pages show placeholder

**Milestone: Fully functional multi-page site with SEO, contact form, and i18n. ✅**

---

## Phase 3: Blog System
**Status: COMPLETE**
**Chats estimated: 2-3 | Chats used: 3**

### 3A: Blog Frontend (Public)
- [x] Create `src/app/blog/page.tsx` — blog listing
- [x] Create `src/app/blog/[slug]/page.tsx` — individual post (Medium-style)
- [x] Create `src/components/blog/BlogList.tsx` — responsive card grid (1/2/3 cols)
- [x] Create `src/components/blog/BlogCard.tsx` — card with image, title, excerpt, date, tags
- [x] Create `src/components/blog/BlogPost.tsx` — Medium-style renderer (680px, serif, author bar)
- [x] Style blog with @tailwindcss/typography + custom prose classes
- [x] Add blog posts to sitemap generation
- [x] Add BlogPosting structured data (JSON-LD) on individual posts
- [x] Create sample blog post in `clients/portfolio/content/blog/`
- [x] Add English blog routes `/en/blog/` and `/en/blog/[slug]/`
- [x] Verify: blog list, individual posts, SEO, reading time all work

### 3B: Blog Admin CMS
- [x] Create `src/app/admin/page.tsx` — login page (Romanian labels)
- [x] Create `src/lib/auth.ts` — JWT session with jose, password from env
- [x] Create `src/app/api/auth/route.ts` — login endpoint
- [x] Create `src/middleware.ts` — protects /admin/* routes
- [x] Create `src/app/admin/dashboard/page.tsx` — post list with RO/EN toggle, edit/delete (Romanian labels)
- [x] Create `src/app/admin/editor/[slug]/page.tsx` — metadata fields + markdown textarea (Romanian labels)
- [x] Novel package installed but using plain textarea for now (upgrade planned)
- [x] Create `src/lib/github.ts` — GitHub API utilities (read, create, update, delete)
- [x] Create `src/app/api/blog/route.ts` — CRUD endpoints via GitHub API
- [x] Create `src/app/api/blog/file/route.ts` — read single file for editing
- [x] Draft/published toggle in editor
- [x] Language selector (RO/EN) in dashboard
- [x] Verify: full CRUD flow — create, edit, delete posts via CMS

### 3C: Image Upload Pipeline
- [x] Create `src/lib/r2.ts` — R2 upload/delete utilities (S3-compatible SDK)
- [x] Create `src/lib/image-optimize.ts` — Sharp resize + WebP conversion + EXIF strip
- [x] Create `src/app/api/upload/route.ts` — authenticated upload endpoint
- [x] Wire editor image upload to → optimize → R2 → return URL (toolbar button, drag-drop, paste)
- [x] Add file type validation (jpg, jpeg, png, gif, webp only)
- [x] Add file size limit (5MB max)
- [x] Custom image extension with data-size (small/medium/full) and data-align (left/center/right)
- [x] Floating image toolbar — appears on image click with size + alignment controls
- [x] Image CSS works in both editor and public blog
- [x] Verify: upload image → resize/align → save → displays correctly on public blog

**Milestone: Complete blog with CMS + image pipeline. ✅**

---

## Phase 4: Optional Modules & Polish
**Status: COMPLETE**
**Chats estimated: 2-3 | Chats used: 1**

### 4A: Dark Mode
- [x] Create `src/components/theme/ThemeProvider.tsx` — system detection + localStorage persistence
- [x] Create `src/components/theme/ThemeToggle.tsx` — sun/moon toggle
- [x] Integrate with client theme.ts dark color overrides (via globals.css .dark class)
- [x] Only render toggle if `features.darkMode === true`
- [x] Anti-FOUC inline script in layout.tsx head
- [x] Verify: toggle works, persists, respects system preference, smooth transition

### 4B: Smartsupp Integration
- [x] Create `src/components/integrations/Smartsupp.tsx` — script loader
- [x] Only load if `features.smartsupp === true` and NEXT_PUBLIC_SMARTSUPP_ID is set
- [x] Verify: widget appears on page, doesn't load when disabled

### 4C: Analytics
- [x] Create `src/components/analytics/GoogleAnalytics.tsx` — GA4 script loader
- [x] Only load if NEXT_PUBLIC_GA4_ID is set
- [x] Add to root layout
- [x] Verify: events show in GA4 real-time dashboard

### 4D: Dev Banner Polish
- [x] Comprehensive config checks (all env vars, all services)
- [x] Color-coded status (red/yellow/green)
- [x] Only renders in development mode
- [x] Click to dismiss (persists for session)
- [x] Smart env var filtering — only warns about missing vars for enabled features

**Milestone: All optional modules working. Feature flags control everything. ✅**

---

## Phase 5: Portfolio Site — Your First Client
**Status: IN PROGRESS (5A complete, 5B/5C pending)**
**Chats estimated: 3-5 | Chats used: 1**

### 5A: Design & Content
- [x] Build modular homepage section system (6 components)
- [x] Compose portfolio homepage from sections (Hero, Features, About, BlogPreview, CTA)
- [x] Wire client theme.ts colors into CSS variables (dynamic per client)
- [x] Font CSS variables (--font-heading, --font-body, --font-blog)
- [ ] Design projects page (showcase cards with screenshots, tech stack, links)
- [ ] Design about page (professional story, skills, reconversion narrative)
- [ ] Design contact page layout
- [ ] Write final homepage content (Romanian)
- [ ] Write about page content
- [ ] Write first 2-3 blog posts

### 5B: Implementation
- [ ] Finalize theme.ts with actual brand colors and fonts
- [ ] Add all page content as markdown files
- [ ] Add project screenshots and images
- [ ] Test all pages on mobile (375px), tablet (768px), desktop (1280px)

### 5C: Deployment
- [x] GitHub repository created and configured
- [x] Cloudflare R2 bucket created and configured
- [ ] Create Vercel project (siteforge-portfolio)
- [ ] Configure environment variables in Vercel
- [ ] Create Resend account + verify domain
- [ ] Set up Google Analytics + Search Console
- [ ] Connect custom domain
- [ ] Test full flow: CMS login → create post → image upload → publish → verify live
- [ ] Run Lighthouse audit (target: 95+ all categories)

**Milestone: Your portfolio is live. This is your sales tool for future clients.**

---

## Phase 6: Client Setup Automation
**Status: COMPLETE**
**Chats estimated: 1-2 | Chats used: 1**

- [x] Create `scripts/new-client.ts` — interactive CLI (Romanian prompts)
- [x] CLI asks: name, display name, domain, email, phone, features, brand color
- [x] CLI creates: config.ts, theme.ts, content/ with placeholder pages, env file
- [x] CLI adds yarn dev + build scripts to package.json
- [x] CLI registers client in src/lib/client-config.ts (imports + maps)
- [x] Create `scripts/toggle-feature.ts` — enable/disable features for existing clients
- [x] toggle-feature checks env var requirements and shows how to get missing values
- [x] toggle-feature auto-creates directories and adds blog config when enabling
- [x] Create `docs/CLIENT_SETUP_CHECKLIST.md` — operational quick-reference
- [x] Update NEW_CLIENT_GUIDE.md references to use CLI

**Milestone: Adding a new client takes < 5 minutes of scaffolding. ✅**

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
