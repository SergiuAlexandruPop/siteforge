# Rocket Blueprint Scroll Animation — Implementation Plan

## Overview

Replace `AnimationPlaceholder.tsx` with a scroll-driven rocket blueprint animation. The rocket "draws itself" as the user scrolls through a sticky 2.5vh-tall section, transitioning from blueprint wireframe to colored illustration to launch.

**New dependency**: `motion` (formerly Framer Motion v11+, MIT, ~11KB tree-shaken) for `useScroll` and `useTransform` hooks. This is a deliberate pivot from Decision #46 in DESIGN.md ("Lenis as only animation dep") — the rationale being that scroll-linked SVG stroke animation with 7 interpolated stages is impractical with raw IntersectionObserver + rAF, and `motion` provides the declarative `useScroll`/`useTransform` primitives that make this feasible without writing a scroll-to-progress engine from scratch.

---

## 1. Component Architecture

### File Structure

```
src/
  components/
    portfolio/
      RocketBlueprint.tsx       # NEW — Main orchestrator (sticky container, scroll hooks, reduced-motion gate)
      rocket-svg.tsx             # NEW — Pure SVG artwork as JSX, accepts MotionValues as props
      AnimationPlaceholder.tsx   # KEEP — Preserved in barrel for potential fallback
      HomePage.tsx               # MODIFY — Swap AnimationPlaceholder for RocketBlueprint
      index.ts                   # MODIFY — Add RocketBlueprint export

  hooks/
    useScrollVideo.ts            # REPLACE internals — Repurpose as useScrollProgress wrapping motion's useScroll
```

### Component Hierarchy

```
HomePage.tsx (server component)
  └── RocketBlueprint (client component, 'use client')
        ├── Outer div: h-[250vh] relative          ← tall scroll container
        │     └── Inner div: sticky top-0 h-screen ← pinned viewport
        │           ├── Blueprint background (grid/crosshairs)
        │           └── RocketSVG                    ← the SVG artwork
        │                 ├── <g id="grid">          ← stage 1: crosshairs/grid
        │                 ├── <g id="body">          ← stage 2: rocket body outline
        │                 ├── <g id="fins">          ← stage 3: fins
        │                 ├── <g id="nosecone">      ← stage 3: nosecone detail
        │                 ├── <g id="window">        ← stage 4: porthole
        │                 ├── <g id="fills">         ← stage 5: color fills
        │                 └── <g id="exhaust">       ← stage 7: flames
        └── (no ScrollReveal wrapper — RocketBlueprint manages its own scroll)
```

### Props

**RocketBlueprint.tsx**
```ts
interface RocketBlueprintProps {
  language?: 'ro' | 'en'
  className?: string
}
```

**rocket-svg.tsx (RocketSVG)**
```ts
interface RocketSVGProps {
  // Each is a MotionValue<number> from useTransform, range 0-1
  gridOpacity: MotionValue<number>
  bodyDraw: MotionValue<number>        // maps to pathLength
  finsDraw: MotionValue<number>
  windowDraw: MotionValue<number>
  fillOpacity: MotionValue<number>
  constructionFade: MotionValue<number> // 1 to 0, fades out grid
  rocketY: MotionValue<number>         // translateY for launch
  exhaustOpacity: MotionValue<number>
  exhaustScale: MotionValue<number>
  prefersReduced: boolean
  language?: 'ro' | 'en'
}
```

When `prefersReduced` is true, `RocketSVG` ignores all MotionValues and renders the fully assembled, colored rocket statically.

---

## 2. Motion Hooks Usage Pattern

### In RocketBlueprint.tsx

```ts
'use client'

import { useRef } from 'react'
import { useScroll, useTransform } from 'motion/react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { RocketSVG } from './rocket-svg'

export function RocketBlueprint({ language, className }: RocketBlueprintProps) {
  const prefersReduced = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)

  // Track scroll progress through the tall container (0 at top, 1 at bottom)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Map scroll ranges to individual animation properties
  const gridOpacity       = useTransform(scrollYProgress, [0.0, 0.15], [0, 1])
  const bodyDraw          = useTransform(scrollYProgress, [0.15, 0.35], [0, 1])
  const finsDraw          = useTransform(scrollYProgress, [0.35, 0.50], [0, 1])
  const windowDraw        = useTransform(scrollYProgress, [0.50, 0.65], [0, 1])
  const fillOpacity       = useTransform(scrollYProgress, [0.65, 0.80], [0, 1])
  const constructionFade  = useTransform(scrollYProgress, [0.80, 0.90], [1, 0])
  const rocketY           = useTransform(scrollYProgress, [0.90, 1.0], [0, -120])
  const exhaustOpacity    = useTransform(scrollYProgress, [0.90, 0.95], [0, 1])
  const exhaustScale      = useTransform(scrollYProgress, [0.90, 1.0], [0.5, 1.2])

  // ...render
}
```

Key details:
- `useScroll({ target: containerRef, offset: ['start start', 'end end'] })` tracks progress as the container scrolls through the viewport. Tracking starts when container top hits viewport top, ends when container bottom hits viewport bottom.
- Each `useTransform` maps a sub-range of `scrollYProgress` (0-1) to an output range. Values clamp automatically outside the input range.
- All transforms derive from one `scrollYProgress` source, so they stay perfectly synchronized.

### Lenis Compatibility

Lenis works with Motion's `useScroll` out of the box. Lenis smooths the scroll position, `useScroll` reads it via scroll events. No integration code needed.

---

## 3. SVG Structure (rocket-svg.tsx)

The SVG uses `viewBox="0 0 400 600"`. All strokes use Motion's `pathLength` style property for draw-on effect.

### Key SVG Technique: pathLength

Motion's `motion.path` supports a `pathLength` style property that auto-handles stroke-dasharray/dashoffset. When `pathLength` goes 0 to 1, the path draws itself from start to end. No manual dasharray calculation needed.

### Stroke Colors by Theme

CSS custom properties in globals.css:
```css
:root {
  --blueprint-stroke: hsl(210, 30%, 35%);
  --blueprint-grid: hsl(210, 20%, 80%);
  --blueprint-bg: hsl(210, 30%, 96%);
}
.dark {
  --blueprint-stroke: hsl(210, 100%, 70%);
  --blueprint-grid: hsl(210, 60%, 25%);
  --blueprint-bg: hsl(222, 84%, 6%);
}
```

Referenced in SVG via `stroke="var(--blueprint-stroke)"`.

### SVG Groups

1. **Grid group** (`motion.g`, opacity bound to `gridOpacity` then multiplied by `constructionFade`): horizontal lines, vertical lines, center crosshair, dimension annotation arrows
2. **Body group** (`motion.path`, pathLength bound to `bodyDraw`): main fuselage outline — rounded top (nosecone) tapering to base
3. **Fins group** (`motion.path` x2, pathLength bound to `finsDraw`): left and right triangular fins
4. **Nosecone details** (`motion.path`, pathLength bound to `finsDraw`): horizontal accent lines on nosecone
5. **Window group** (`motion.circle` + `motion.line` x2, pathLength bound to `windowDraw`): porthole circle + internal horizontal detail lines
6. **Fills group** (`motion.g`, opacity bound to `fillOpacity`): duplicate shapes with solid fills (body blue, fins darker blue, window light blue, nosecone red accent)
7. **Exhaust group** (`motion.g`, opacity/scale bound to `exhaustOpacity`/`exhaustScale`): three nested ellipses (orange outer, yellow middle, white-hot inner)

The body/fins/window/fills are wrapped in an additional `motion.g` with `y` bound to `rocketY` for the launch translation.

---

## 4. Animation Timeline Mapping

| Scroll Progress | Stage | Visual Effect | Properties |
|----------------|-------|---------------|------------|
| 0.00 - 0.15 | 1. Grid appears | Crosshair lines, grid dots, dimension marks fade in | `gridOpacity`: 0 to 1 |
| 0.15 - 0.35 | 2. Body draws | Main fuselage outline draws stroke-by-stroke | `bodyDraw`: 0 to 1 (pathLength) |
| 0.35 - 0.50 | 3. Details draw | Fins + nosecone details draw in | `finsDraw`: 0 to 1 |
| 0.50 - 0.65 | 4. Window draws | Porthole circle + internal lines draw | `windowDraw`: 0 to 1 |
| 0.65 - 0.80 | 5. Colors fill | Transparent fills transition to solid | `fillOpacity`: 0 to 1 |
| 0.80 - 0.90 | 6. Grid fades | Construction lines disappear | `constructionFade`: 1 to 0 |
| 0.90 - 1.00 | 7. Launch | Rocket translates up, exhaust flames appear | `rocketY`: 0 to -120, `exhaustOpacity`: 0 to 1, `exhaustScale`: 0.5 to 1.2 |

---

## 5. Sticky Scroll Container

```tsx
<div ref={containerRef} className="relative h-[250vh]">
  <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
    {/* Blueprint background */}
    <div className="absolute inset-0" style={{ backgroundColor: 'var(--blueprint-bg)' }} aria-hidden="true">
      {/* Subtle dot grid via CSS background-image */}
    </div>
    <RocketSVG {...motionValues} prefersReduced={prefersReduced} language={language} />
  </div>
</div>
```

**Why 250vh?** The user scrolls through 150vh of distance (250vh - 100vh viewport) while the sticky container stays pinned. This gives roughly 3-5 seconds of scroll animation at normal scroll pace for 7 stages.

**Position in HomePage**: RocketBlueprint is NOT wrapped in ScrollReveal. It manages its own scroll behavior. ScrollReveal would interfere with sticky positioning.

---

## 6. Reduced Motion Handling

When `useReducedMotion()` returns true:

```tsx
if (prefersReduced) {
  return (
    <section className={`relative flex min-h-[400px] items-center justify-center ${className}`}>
      <RocketSVG prefersReduced={true} language={language} /* no MotionValues needed */ />
    </section>
  )
}
```

In RocketSVG when `prefersReduced` is true:
- All strokes fully drawn (plain `<path>`, no `motion.*` elements)
- All fills at full opacity
- Grid/construction lines hidden
- Rocket in colored, assembled state (no launch offset)
- Follows the same pattern as ScrollReveal.tsx lines 46-48

---

## 7. File-by-File Changes

### Install: `yarn add motion`

### NEW: `src/components/portfolio/RocketBlueprint.tsx`
- `'use client'` directive
- Imports from `motion/react`, local hooks, RocketSVG
- Reduced motion early return with static rocket
- Full path: containerRef, useScroll, 9x useTransform, sticky container, RocketSVG
- Blueprint paper background via CSS custom properties

### NEW: `src/components/portfolio/rocket-svg.tsx`
- Pure presentational, no hooks
- Two render paths: static (prefersReduced) vs animated (motion.* elements)
- viewBox 400x600, responsive via className width constraints
- CSS custom properties for colors
- `role="img"` and `aria-label` with i18n

### MODIFY: `src/components/portfolio/HomePage.tsx`
- Remove AnimationPlaceholder import, add RocketBlueprint import
- Replace lines 45-47 (ScrollReveal + AnimationPlaceholder) with `<RocketBlueprint language={language} />`

### MODIFY: `src/components/portfolio/index.ts`
- Add `export { RocketBlueprint } from './RocketBlueprint'`
- Keep AnimationPlaceholder export

### REPLACE: `src/hooks/useScrollVideo.ts`
Repurpose as `useScrollProgress`. Wraps Motion's useScroll, returns `{ containerRef, scrollYProgress }`. Reusable for future ScrollVideoHero.

```ts
'use client'
import { useRef } from 'react'
import { useScroll, type MotionValue } from 'motion/react'

interface UseScrollProgressOptions {
  offset?: [string, string]
}

interface UseScrollProgressReturn<T extends HTMLElement> {
  containerRef: React.RefObject<T | null>
  scrollYProgress: MotionValue<number>
}

export function useScrollProgress<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollProgressOptions = {}
): UseScrollProgressReturn<T> {
  const { offset = ['start start', 'end end'] } = options
  const containerRef = useRef<T | null>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset })
  return { containerRef, scrollYProgress }
}
```

### MODIFY: `src/app/globals.css`
Add blueprint CSS custom properties under `:root` and `.dark` blocks:
```css
:root {
  --blueprint-stroke: hsl(210, 30%, 35%);
  --blueprint-grid: hsl(210, 20%, 80%);
  --blueprint-bg: hsl(210, 30%, 96%);
}
.dark {
  --blueprint-stroke: hsl(210, 100%, 70%);
  --blueprint-grid: hsl(210, 60%, 25%);
  --blueprint-bg: hsl(222, 84%, 6%);
}
```

### MODIFY: `docs/CONTEXT.md`
- Add decision #58 to log
- Update project status

### MODIFY: `clients/portfolio/DESIGN.md`
- Update Section 2 animation stack table (add motion)
- Update "What We Don't Use" (remove/revise Framer Motion entry)
- Add RocketBlueprint to Section 7 section order
- Add decision #58 to portfolio decision log
- Add timing spec for RocketBlueprint stages

### NO CHANGES needed:
- `src/hooks/useReducedMotion.ts` — used as-is
- `src/hooks/useScrollReveal.ts` — unrelated
- `src/components/animations/*` — shared, untouched
- `src/components/portfolio/AnimationPlaceholder.tsx` — kept as fallback

---

## 8. Implementation Order

### Phase 1: Foundation (parallelizable)
1a. Install motion: `yarn add motion`
1b. Add CSS custom properties to globals.css
1c. Create `rocket-svg.tsx` as static SVG first (no animation, hardcoded visible strokes/fills)

### Phase 2: Hook + Animation Wiring (sequential)
2a. Replace `useScrollVideo.ts` with `useScrollProgress`
2b. Create `RocketBlueprint.tsx` with sticky container, useScrollProgress, useTransform, wire to RocketSVG
2c. Update `rocket-svg.tsx` — replace static elements with `motion.*` elements, bind MotionValues

### Phase 3: Integration (sequential)
3a. Update `HomePage.tsx` — swap AnimationPlaceholder for RocketBlueprint
3b. Update `index.ts` — add barrel export

### Phase 4: Polish (parallelizable)
4a. Dark/light mode verification
4b. Reduced motion verification
4c. Responsive testing at 375px, 768px, 1280px
4d. Lighthouse performance audit

### Phase 5: Documentation (parallelizable)
5a. Update `docs/CONTEXT.md`
5b. Update `clients/portfolio/DESIGN.md`

---

## 9. Verification Steps

### Functional
1. All 7 stages play in sequence during scroll
2. Sticky behavior — rocket stays pinned, no jumping
3. 60fps smooth — no jank
4. Lenis compatibility — smooth scroll still works
5. No scroll hijacking — normal page scrolling preserved

### Reduced Motion
6. Toggle prefers-reduced-motion in OS/DevTools
7. Rocket appears fully assembled immediately, no sticky container

### Theme
8. Light mode: dark strokes on light background
9. Dark mode: bright blue strokes on dark background with subtle glow

### Responsive
10. 375px mobile: SVG scales, centered, no overflow
11. 768px tablet: comfortable size
12. 1280px desktop: centered with whitespace

### Performance
13. Lighthouse Performance > 90
14. CLS < 0.1 (fixed-height container)
15. No memory leaks on unmount

### Integration
16. Section order: AnimatedHero -> RocketBlueprint -> ProjectShowcase
17. Other sections still animate correctly
18. `yarn build:portfolio` succeeds
19. `tsc --noEmit` passes

---

## 10. Potential Challenges and Mitigations

### SVG path coordinates
Getting the rocket to look good requires careful path authoring.
**Mitigation**: Build rocket-svg.tsx as static SVG first, iterate on visual design, then add motion wrappers.

### pathLength browser support
SVG `getTotalLength()` has quirks with certain path commands.
**Mitigation**: Use simple path commands (M, L, C, Z). Test Chrome, Firefox, Safari.

### Lenis + sticky positioning
Lenis can interfere with `position: sticky` if it uses transform-based scrolling.
**Mitigation**: The current SmoothScroll component uses default Lenis (window.scrollTo), which is compatible with sticky. If issues arise, use Lenis `prevent` option.

### Bundle size
Adding motion adds ~11-15KB gzipped.
**Mitigation**: Acceptable given visual payoff. Total animation deps remain under 20KB (Lenis 5KB + motion 15KB).

### Server component boundary
HomePage.tsx is async (server component), RocketBlueprint is client component.
**Mitigation**: Standard Next.js App Router pattern — server components render client components via import. No special handling needed.

---

## 11. Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Separate rocket-svg.tsx from RocketBlueprint.tsx | SRP: artwork vs scroll/animation logic |
| Use motion.path with pathLength style | Eliminates manual stroke-dasharray math |
| CSS custom properties for blueprint colors | Follows existing --glow-primary pattern. Works with dark mode class strategy. |
| No ScrollReveal wrapper on RocketBlueprint | Self-manages scroll. ScrollReveal would fight sticky positioning. |
| Keep AnimationPlaceholder.tsx | Zero-cost fallback, one-line swap if needed |
| Repurpose useScrollVideo as useScrollProgress | Fulfills stub's intended purpose. Reusable for future ScrollVideoHero. |
| Static fallback for reduced motion | Matches existing ScrollReveal/RotatingText/Marquee pattern. Slow animation still causes discomfort. |
