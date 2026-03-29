# Portfolio — Design & Animation Architecture

> **Claude MUST read this file before making any changes to portfolio-specific components.**
> This is the single source of truth for the portfolio site's visual design, animation system,
> component architecture, and implementation decisions.
>
> Last updated: 2026-03-25 (planning session)

---

## 1. Design Philosophy

The portfolio is a premium, modern developer site inspired by:
- **rocket.new** — dark gradient aesthetics, rotating hero text, tabbed content, marquee strips, generous whitespace, smooth scroll reveals
- **Jack Roberts video (AnyVan rebuild)** — scroll-linked video playback bound to scroll position (future feature)
- **Awwwards-level portfolios** — subtle animations that enhance UX without overwhelming

### Core Principles
- **Light-first, premium dark** — default is light mode; dark mode gets special treatment (deeper palette, glow effects, radial gradients)
- **Mobile-first** — all CSS starts from 375px and scales up via Tailwind `sm:`, `md:`, `lg:` breakpoints
- **Accessible animations** — every animation respects `prefers-reduced-motion`, degrades to static content
- **Minimal dependencies** — no GSAP. Motion (MIT, ~11KB) for scroll-linked SVG animation. Lenis (MIT, 5KB) for smooth scroll
- **Performance targets** — Lighthouse 90+ all categories, LCP < 2.5s, CLS < 0.1 even with animations

---

## 2. Animation Technology Stack

### What We Use
| Technology | Purpose | License | Size |
|-----------|---------|---------|------|
| `IntersectionObserver` | Scroll-triggered reveals | Browser native | 0KB |
| `requestAnimationFrame` | Smooth scroll-linked effects, CountUp | Browser native | 0KB |
| CSS transitions + keyframes | All visual animations (fade, slide, rotate, marquee) | Browser native | 0KB |
| `lenis` | Smooth scrolling wrapper | MIT | ~5KB |
| `useState` + `setInterval` | Rotating text cycling | React built-in | 0KB |
| `motion` (v12+) | Scroll-linked SVG animation (useScroll, useTransform) | MIT | ~11KB |

### What We Don't Use (and Why)
| Technology | Reason Rejected |
|-----------|----------------|
| GSAP | Free tier prohibits commercial use. Portfolio sells freelance services = commercial. Business license $250/yr. |
| Framer Motion (legacy) | Superseded by `motion` v12+ which tree-shakes to ~11KB. Now used for RocketBlueprint. |
| AOS (Animate on Scroll) | jQuery-era thinking. IntersectionObserver does the same thing natively. |
| Three.js / WebGL | Massive dependency for effects we don't need. Future consideration only. |

### Accessibility: prefers-reduced-motion
Every animation component checks `prefers-reduced-motion: reduce`. When active:
- `ScrollReveal` — elements appear immediately, no transition
- `RotatingText` — shows first word only, no cycling
- `Marquee` — stops scrolling, items display statically with flex-wrap
- `CountUp` — shows final number immediately
- `SmoothScroll` — Lenis disables itself (built-in behavior)
- `RocketBlueprint` — shows fully assembled colored rocket, no scroll animation, no sticky
- Parallax effects — disabled, elements at default position

---

## 3. Color System

### Light Mode (default)
```
background:      #ffffff
foreground:      #0f172a  (slate-900)
muted:           #f1f5f9  (slate-100)
mutedForeground: #64748b  (slate-500)
border:          #e2e8f0  (slate-200)
primary:         #2563eb  (blue-600)
primaryFg:       #ffffff
```

### Dark Mode (premium treatment)
```
background:      #030712  (gray-950 — deeper than current, more dramatic)
foreground:      #f8fafc  (slate-50)
muted:           #111827  (gray-900 — subtle contrast with background)
mutedForeground: #94a3b8  (slate-400)
border:          #1f2937  (gray-800 — less visible, more premium)
primary:         #2563eb  (blue-600 — pops against deep background)
primaryFg:       #ffffff
```

### Dark Mode Glow Effects (CSS variables in globals.css)
```css
.dark {
  --glow-primary: 0 0 80px rgba(37, 99, 235, 0.15);
  --glow-muted: 0 0 120px rgba(37, 99, 235, 0.05);
}
```
Used via: `dark:shadow-[var(--glow-primary)]` on hero elements, CTA buttons, cards.

### Dark Mode Gradients
- **Hero background**: `radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.08) 0%, transparent 60%)` — subtle blue glow at top center
- **CTA banner**: `linear-gradient(to right, rgba(37,99,235,0.1), rgba(37,99,235,0.05))` overlay
- **Section separators**: faint gradient border instead of solid `border-border`

---

## 4. Typography

### Font Stack
- **Headings**: Inter (already loaded via `next/font/google`)
- **Body**: Inter
- **Blog**: Georgia (serif, Medium-style reading experience)

### Heading Scale
```
Hero headline:     text-4xl sm:text-5xl lg:text-6xl xl:text-7xl  (bold, tracking-tight)
Section title:     text-2xl sm:text-3xl lg:text-4xl              (bold, tracking-tight)
Card title:        text-lg sm:text-xl                             (semibold)
Body:              text-base sm:text-lg                           (normal, leading-relaxed)
Small/meta:        text-sm                                        (medium, text-muted-foreground)
```

### Rotating Text in Hero
The RotatingText component cycles through words with the same font-size as the headline. The cycling word is wrapped in a `<span>` with `text-primary` to differentiate it from static text.

---

## 5. Animation Timing Spec

All timings are in seconds. Easing uses CSS defaults unless specified.

### Scroll Reveals
```
duration:    0.7s
easing:      cubic-bezier(0.16, 1, 0.3, 1)  (ease-out-expo feel)
distance:    30px  (how far element travels from start to end)
threshold:   0.15  (15% of element must be visible to trigger)
stagger:     0.1s  (delay between sequential items in a group)
once:        true  (default — animate only on first appearance)
```

### Rotating Text
```
interval:     3000ms  (time each word is displayed)
transition:   0.5s    (fade/slide duration between words)
easing:       ease-in-out
```

### Marquee
```
speed:          35s   (full cycle duration — slower = more premium)
pauseOnHover:   true
direction:      left  (default)
gap:            2rem  (space between items)
```

### CountUp
```
duration:    2s
easing:      ease-out (fast start, slow finish)
```

### Header Scroll Effect
```
trigger:     scrollY > 50px
transition:  background-color 0.3s, border-color 0.3s, backdrop-filter 0.3s
```

---

## 6. Component Architecture

### Registry System

Two new registries follow the same explicit-import pattern as `client-config.ts`:

**`src/lib/client-layout.ts`**
```
getClientLayout(ACTIVE_CLIENT) → React component
  'portfolio' → PortfolioLayout
  default    → LayoutShell (existing, unchanged)
```

**`src/lib/client-homepage.ts`**
```
getClientHomePage(ACTIVE_CLIENT) → React component
  'portfolio' → PortfolioHomePage
  default    → DefaultHomePage (current page.tsx logic, extracted)
```

### File Map

```
src/
  hooks/
    useReducedMotion.ts          ← prefers-reduced-motion hook
    useScrollReveal.ts           ← IntersectionObserver hook
    useScrollVideo.ts            ← scroll-linked video (stub for future)

  components/
    animations/                  ← SHARED — any client can use
      SmoothScroll.tsx             Lenis wrapper (client component)
      ScrollReveal.tsx             Scroll-triggered reveal (client component)
      RotatingText.tsx             Cycling text (client component)
      Marquee.tsx                  Infinite scroll strip (server or client)
      CountUp.tsx                  Animated counter (client component)
      index.ts

    portfolio/                   ← PORTFOLIO-SPECIFIC compositions
      PortfolioLayout.tsx          SmoothScroll + PortfolioHeader + PortfolioFooter
      PortfolioHeader.tsx          Transparent → blur-on-scroll header
      PortfolioFooter.tsx          Enhanced footer with gradient
      HomePage.tsx                 Homepage section composition (server component)
      AnimatedHero.tsx             Full hero: gradient bg, rotating text, parallax, CTAs
      TechMarquee.tsx              Tech stack logo marquee
      TabbedServices.tsx           Tabbed panel with numbered steps
      ProjectShowcase.tsx          Project cards with hover + scroll reveal
      icons.tsx                    Inline SVG tech logos (~8 icons)
      index.ts

    sections/                    ← SHARED GENERIC — unchanged
      Hero.tsx                     Basic hero (stays as fallback for simple clients)
      Features.tsx
      Showcase.tsx
      AboutSnippet.tsx
      BlogPreview.tsx
      CtaBanner.tsx
      index.ts

    layout/                      ← SHARED GENERIC — unchanged
      LayoutShell.tsx              Default layout (becomes the fallback)
      Header.tsx                   Default header
      Footer.tsx                   Default footer
      MobileMenu.tsx

  lib/
    client-layout.ts             ← NEW registry
    client-homepage.ts           ← NEW registry
    client-config.ts             ← Existing, unchanged
    ...
```

### Data Flow
```
layout.tsx
  → getClientLayout('portfolio') → PortfolioLayout
    → SmoothScroll wraps children
    → PortfolioHeader (transparent, blur on scroll)
    → {children} = page content
    → PortfolioFooter

page.tsx
  → getClientHomePage('portfolio') → PortfolioHomePage
    → AnimatedHero (RotatingText, gradient, parallax image, TechMarquee)
    → ScrollReveal > TabbedServices
    → ScrollReveal > ProjectShowcase
    → ScrollReveal > BlogPreview (if blog enabled)
    → ScrollReveal > CtaBanner
```

---

## 7. Homepage Section Order

### Portfolio Homepage Sections (top to bottom)
1. **AnimatedHero** — full viewport, gradient bg, rotating headline, subtitle, CTAs, hero image, tech marquee
2. **TabbedServices** — "Ce ofer" — 4 tabs with numbered feature lists
3. **ProjectShowcase** — project cards from `clients/portfolio/data/projects.ts`
4. **BlogPreview** — latest 3 posts (gated by `features.blog`)
5. **CtaBanner** — "Ai nevoie de un site profesional?" — gradient background, glow in dark mode

### Future: ScrollVideoHero
When a video asset is ready, `ScrollVideoHero` is a separate component that replaces `AnimatedHero` in the homepage composition. It binds `video.currentTime` to scroll position via `useScrollVideo` hook. This is a one-line swap in `HomePage.tsx` — import ScrollVideoHero instead of AnimatedHero. The AnimatedHero stays available as a fallback.

---

## 8. Dark Mode Special Treatments

These effects ONLY appear in dark mode (via CSS `dark:` prefix). In light mode, sections are clean/minimal.

| Section | Dark Mode Treatment |
|---------|-------------------|
| AnimatedHero | Radial gradient glow behind headline area; CTA button glow shadow |
| TabbedServices | Active tab indicator glow; card borders subtly brighter |
| ProjectShowcase | Card hover glow (--glow-primary); image overlay gradient |
| CtaBanner | Full-width gradient background with blue glow |
| PortfolioHeader | Stronger backdrop-blur; faint bottom border glow |
| PortfolioFooter | Gradient fade at top edge |

Implementation: extra `<div>` elements with `hidden dark:block` where needed for gradient overlays. No runtime JS branching.

---

## 9. Mobile Considerations

### Breakpoints (Tailwind defaults)
- `375px` — base (all CSS starts here)
- `sm: 640px` — small tablets
- `md: 768px` — tablets / small laptops
- `lg: 1024px` — desktops
- `xl: 1280px` — large desktops

### Section-Specific Mobile Behavior
- **AnimatedHero**: hero image stacks below text on mobile; reduced font sizes; marquee stays but narrower
- **PortfolioHeader**: hamburger menu on mobile (reuses MobileMenu component); toggles slot preserved
- **TabbedServices**: tabs become vertical accordion on mobile (< md breakpoint)
- **ProjectShowcase**: single-column card stack on mobile
- **Marquee**: slightly faster speed on mobile (smaller container = longer perceived wait)

### Touch Considerations
- All interactive elements: minimum 44x44px touch targets
- Smooth scrolling: Lenis uses native touch momentum (no fighting with iOS rubber-band)
- Hover effects: combined with `:focus-visible` for keyboard nav; on touch devices, hover triggers on tap (browser default)

---

## 10. Implementation Phases

### Chat 1: Foundation Layer (no visual changes)
- Install `lenis`
- Create hooks: `useReducedMotion`, `useScrollReveal`, `useScrollVideo` (stub)
- Create `src/types/animations.ts`
- Create all `src/components/animations/` files (SmoothScroll, ScrollReveal, RotatingText, Marquee, CountUp)
- Create registries: `client-layout.ts`, `client-homepage.ts`
- Extract current page.tsx into DefaultHomePage
- Modify `layout.tsx` and `page.tsx` to use registries
- **Verify: zero visual regression — site looks identical**

### Chat 2: Portfolio Layout + Header
- Create `PortfolioHeader.tsx`, `PortfolioFooter.tsx`, `PortfolioLayout.tsx`
- Register portfolio layout
- Update portfolio `theme.ts` with deeper dark palette
- Add glow CSS variables to `globals.css`
- **Verify: smooth scrolling, transparent header, premium dark mode**

### Chat 3: Animated Hero + Marquee
- Create `icons.tsx` (inline SVG tech logos)
- Create `TechMarquee.tsx`
- Create `AnimatedHero.tsx`
- Create portfolio `HomePage.tsx`
- Register portfolio homepage
- **Verify: animated hero with rotating text, parallax, marquee, dark mode glow**

### Chat 4: Tabbed Services + Project Showcase
- Create `TabbedServices.tsx`
- Create `ProjectShowcase.tsx`
- Populate `clients/portfolio/data/projects.ts`
- Complete `HomePage.tsx` composition
- Add `ScrollReveal` wrapping to all sections
- **Verify: full homepage, all sections, animations, responsive, dark mode**

### Chat 5: Polish + Documentation
- prefers-reduced-motion audit
- Dark mode glow refinement
- Mobile responsiveness sweep
- Lighthouse performance audit
- Update all docs (CONTEXT.md, ROADMAP.md, ARCHITECTURE.md, DEV_NOTES.md, this file)

---

## 11. Decision Log (Portfolio-Specific)

| # | Decision | Rationale |
|---|----------|-----------|
| 42 | Per-client layout via registry | Clients can have fundamentally different shells |
| 43 | Per-client homepage via registry | Each client controls their section composition |
| 44 | DefaultHomePage extracted from page.tsx | Current homepage becomes fallback, not hardcoded |
| 45 | Custom animations over GSAP | GSAP prohibits commercial use on free tier |
| 46 | Lenis (MIT) as only animation dep | Smooth scrolling too complex to DIY; 5KB, MIT |
| 47 | IntersectionObserver for scroll reveals | Native API, zero deps, 97%+ support |
| 48 | prefers-reduced-motion from day one | Accessibility is not a bolt-on |
| 49 | Portfolio components in src/components/portfolio/ | Co-location by domain; client folder = config/content only |
| 50 | Inline SVGs for tech logos | Zero requests, full control, no icon library |
| 51 | projects.ts in clients/portfolio/data/ | TypeScript > markdown for structured data |
| 52 | DESIGN.md in client folder | Client-specific design spec, self-contained |
| 53 | ScrollVideoHero as separate future component | SRP — does not bloat AnimatedHero |
| 54 | CSS-only dark mode premium effects | dark: prefix + CSS vars, no runtime branching |
| 55 | Deeper dark palette (gray-950 base) | More contrast, more dramatic, rocket.new feel |

---

## 12. Reference Links

- **Inspiration**: https://www.rocket.new/ (layout, animations, dark mode)
- **Video reference**: https://www.youtube.com/watch?v=TZUTe7s11-I (Jack Roberts — scroll-linked video)
- **Lenis docs**: https://lenis.darkroom.engineering/
- **IntersectionObserver API**: https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver
- **prefers-reduced-motion**: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
