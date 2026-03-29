# Portfolio Homepage Revamp — Implementation Plan

## Overview

Revamp the portfolio homepage by centering navigation, removing the rocket GIF and CTA buttons from the hero, adding a chat-style input for Smartsupp/WhatsApp integration, inserting an animation placeholder section, populating mock projects, embedding the contact form with i18n support at the bottom, and removing the CtaBanner.

**Total files to modify: 5 existing + 3 new = 8 files (plus 1 barrel export update)**

---

## Step 1: ChatInput Component (New — No Dependencies)

**File:** `src/components/portfolio/ChatInput.tsx`

**Purpose:** Client component with chat-style textarea and send button that POSTs to `/api/chat`.

**Implementation details:**
- `'use client'` directive
- Props: `{ language?: 'ro' | 'en'; className?: string }`
- State: `message` (string), `status` ('idle' | 'loading' | 'success' | 'error')
- Layout: rounded container (`rounded-2xl`) with subtle border, containing:
  - `<textarea>` with `rows={3}`, full width, no inner border, transparent bg
  - Send `<button>` at bottom-right, min 44x44px touch target
- i18n: `ro` = "Scrie mesajul tău..." / `en` = "Type your message..."
- On submit: POST `/api/chat` with `{ message }`
- Outer container: `mx-auto max-w-2xl w-full`
- Dark mode: `dark:bg-muted/30`, `dark:border-border/30`
- Success state: brief "Mesaj trimis!" / "Message sent!" that resets after 3s
- No autofocus on textarea

---

## Step 2: AnimationPlaceholder Component (New — No Dependencies)

**File:** `src/components/portfolio/AnimationPlaceholder.tsx`

**Purpose:** ~400px tall placeholder section with gradient and "Coming soon" text.

- Server component (no `'use client'`)
- Props: `{ language?: 'ro' | 'en'; className?: string }`
- `<section>` with `min-h-[400px]`, gradient bg, radial gradient overlay
- Centered text: heading + subtitle
- i18n: `en` = "Animation coming soon" / `ro` = "Animație în curând"

---

## Step 3: Populate Mock Projects Data (No Dependencies)

**File:** `clients/portfolio/data/projects.ts`

Replace empty array with 4 mock entries (all `featured: true`): SiteForge, Task Dashboard, E-Commerce Platform, Health Tracker. ProjectShowcase already renders featured projects — no changes needed to that component.

---

## Step 4: Add i18n to ContactForm (No Dependencies)

**File:** `src/components/contact/ContactForm.tsx`

- Add `language?: 'ro' | 'en'` prop (default `'ro'` for backward compat)
- Create `labels` object with `ro` and `en` keys for all strings
- Replace all hardcoded Romanian strings with `t.fieldName`
- Localize validation error messages too

---

## Step 5: Center PortfolioHeader Navigation (No Dependencies)

**File:** `src/components/portfolio/PortfolioHeader.tsx`

- Change container from `justify-between` to `justify-center`
- Remove the empty spacer `<div />`
- Reposition mobile hamburger group with `absolute right-4` (add `relative` to container)

---

## Step 6: Modify AnimatedHero (Depends on Step 1)

**File:** `src/components/portfolio/AnimatedHero.tsx`

- Import `ChatInput`
- Remove `rocketImage`, `cta`, `ctaSecondary` from props; add `language`
- Remove `HeroCta` interface (dead code)
- Remove rocket GIF JSX block
- Remove CTA buttons JSX block
- Add `<ChatInput language={language} />` after subtitle, before TechMarquee

---

## Step 7: Modify HomePage — New Section Order (Depends on Steps 2, 4, 6)

**File:** `src/components/portfolio/HomePage.tsx`

- Remove `CtaBanner` import; add `AnimationPlaceholder` and `ContactForm` imports
- Remove `rocketImage`, `cta`, `ctaSecondary` props from AnimatedHero call; add `language`
- Insert `<AnimationPlaceholder>` wrapped in ScrollReveal after AnimatedHero
- ProjectShowcase and BlogPreview unchanged
- Replace CtaBanner with a Contact section: heading "Contact" + subtitle + `<ContactForm language={language} />` wrapped in ScrollReveal

**Final section order:**
1. AnimatedHero (ChatInput inside, no rocket, no CTAs)
2. TechMarquee (inside hero)
3. AnimationPlaceholder (new)
4. ProjectShowcase (now with mock data)
5. BlogPreview (unchanged)
6. Contact form section (new, replaces CtaBanner)

---

## Step 8: Update Barrel Export (Depends on Steps 1, 2)

**File:** `src/components/portfolio/index.ts`

Add: `export { ChatInput } from './ChatInput'` and `export { AnimationPlaceholder } from './AnimationPlaceholder'`

---

## Step 9: Chat API Stub (No Dependencies)

**File:** `src/app/api/chat/route.ts`

Stub POST endpoint: validates message string, logs it, returns `{ success: true }`. TODO comment for Smartsupp/WhatsApp integration. Follows same pattern as `src/app/api/contact/route.ts`.

---

## Dependency Graph

```
Parallel: Steps 1, 2, 3, 4, 5, 9
Then:     Step 6 (needs Step 1)
Then:     Steps 7, 8 (need Steps 2, 4, 6)
```

---

## Potential Challenges

1. **PortfolioHeader mobile layout** — `justify-center` breaks mobile hamburger positioning. Fix: absolute positioning on mobile group.
2. **AnimatedHero breaking change** — `cta` prop is required. Must update AnimatedHero and HomePage.tsx together.
3. **ContactForm backward compat** — standalone `/contact` page uses `<ContactForm />` without language prop. Default `'ro'` preserves behavior.
4. **Dead code** — Remove `HeroCta` interface after removing CTA props from AnimatedHero.
