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

## Phase 2–4: (COMPLETE — see previous sections, unchanged)

---

## Phase 5: Portfolio Site — Your First Client
**Status: IN PROGRESS (5A complete, 5B/5C pending)**

---

## Phase 6: Client Setup Automation
**Status: COMPLETE**

---

## Phase 7.5: Portfolio Animation Redesign
**Status: COMPLETE**
**Chats estimated: 5 | Chats used: 5**
**Design spec: `clients/portfolio/DESIGN.md`**

### Chat 1: Foundation Layer (COMPLETE)
- [x] Install `lenis` (MIT, ~5KB smooth scrolling)
- [x] Create `src/types/animations.ts` — shared animation prop interfaces
- [x] Create `src/hooks/useReducedMotion.ts` — prefers-reduced-motion hook
- [x] Create `src/hooks/useScrollReveal.ts` — IntersectionObserver hook
- [x] Create `src/hooks/useScrollVideo.ts` — stub for future scroll-linked video
- [x] Create `src/components/animations/SmoothScroll.tsx` — Lenis wrapper
- [x] Create `src/components/animations/ScrollReveal.tsx` — scroll-triggered reveal
- [x] Create `src/components/animations/RotatingText.tsx` — cycling text
- [x] Create `src/components/animations/Marquee.tsx` — infinite scroll strip
- [x] Create `src/components/animations/CountUp.tsx` — animated counter
- [x] Create `src/components/animations/index.ts` — barrel export
- [x] Create `src/lib/client-layout.ts` — per-client layout registry
- [x] Create `src/lib/client-homepage.ts` — per-client homepage registry
- [x] Extract `src/components/sections/DefaultHomePage.tsx` from page.tsx
- [x] Modify `layout.tsx` to use getClientLayout()
- [x] Modify `page.tsx` to use getClientHomePage()
- [x] Add `@keyframes marquee` to globals.css
- [x] Verify: zero visual regression — site looks identical

### Chat 2: Portfolio Layout + Header (COMPLETE)
- [x] Create `src/components/portfolio/PortfolioHeader.tsx` — transparent → blur-on-scroll
- [x] Create `src/components/portfolio/PortfolioFooter.tsx` — enhanced footer with gradient
- [x] Create `src/components/portfolio/PortfolioLayout.tsx` — SmoothScroll + header + footer
- [x] Create `src/components/portfolio/index.ts` — barrel export
- [x] Register portfolio layout in `src/lib/client-layout.ts`
- [x] Add glow CSS variables to globals.css (--glow-primary, --glow-muted)
- [x] Dark palette: kept original slate-blue (user preference over gray-950)
- [x] Verify: smooth scrolling, transparent header, dark mode footer glow

### Chat 3: Animated Hero + Marquee (COMPLETE)
- [x] Create `src/components/portfolio/icons.tsx` — inline SVG tech logos (8 icons)
- [x] Create `src/components/portfolio/TechMarquee.tsx`
- [x] Create `src/components/portfolio/AnimatedHero.tsx` — rotatingWords as prop (Decision #56)
- [x] Create `src/components/portfolio/HomePage.tsx`
- [x] Register portfolio homepage in `src/lib/client-homepage.ts`
- [x] Verify: animated hero with rotating text, marquee, dark mode glow, responsive

### Chat 4: Tabbed Services + Project Showcase (COMPLETE)
- [x] Create `src/components/portfolio/TabbedServices.tsx` — desktop tabs + mobile accordion
- [x] Create `src/components/portfolio/ProjectShowcase.tsx` — 2-col grid, hover glow, tech tags
- [x] Populate `clients/portfolio/data/projects.ts` — 4 featured projects, typed interface
- [x] Complete HomePage.tsx composition with all 5 sections
- [x] Add ScrollReveal wrapping to all below-hero sections
- [x] Verify: full homepage, all sections, animations, responsive, dark mode

### Chat 5: Polish + Documentation (COMPLETE)
- [x] prefers-reduced-motion audit across all components — all PASS
- [x] Dark mode glow refinement — all treatments verified per DESIGN.md Section 8
- [x] Mobile responsiveness review — touch targets OK, accordion layout OK, responsive typography OK
- [x] Update ARCHITECTURE.md — added portfolio component tree, registry pattern, animation architecture
- [x] Update DEV_NOTES.md — added animation system section, new debug scenarios
- [x] Update CONTEXT.md, ROADMAP.md

**Milestone: Portfolio homepage with premium animations, per-client architecture proven. ✅**

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
