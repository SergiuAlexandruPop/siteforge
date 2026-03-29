'use client'

import { useRef } from 'react'
import { useScroll, useTransform } from 'motion/react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { RocketSVG } from './RocketSVG'

// ---------------------------------------------------------------------------
// RocketBlueprint — Scroll-driven rocket blueprint animation.
// ---------------------------------------------------------------------------
// Replaces AnimationPlaceholder. As the user scrolls through ~250vh of
// runway, a blueprint-style rocket draws itself layer by layer, fills with
// color, and "launches" upward.
//
// Architecture:
//   - Outer container: h-[250vh] — provides scroll distance
//   - Inner sticky: position sticky, 100vh — stays pinned on screen
//   - useScroll tracks scrollYProgress through the outer container
//   - useTransform maps progress ranges to individual layer properties
//   - RocketSVG receives MotionValues and renders motion.* SVG elements
//
// Accessibility:
//   - useReducedMotion() → renders static fully-assembled rocket
//   - SVG has role="img" and aria-label
//
// Theme:
//   - Uses --blueprint-stroke, --blueprint-grid, --blueprint-bg CSS vars
//   - Defined in globals.css with light/dark variants
// ---------------------------------------------------------------------------

interface RocketBlueprintProps {
  language?: 'ro' | 'en'
}

export function RocketBlueprint({ language = 'ro' }: RocketBlueprintProps) {
  const reducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // --- Map scroll progress to animation properties ---

  // Stage 1: Grid fades in (0% → 15%)
  const gridOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1])

  // Stage 2: Body outline draws (15% → 35%)
  const bodyPathLength = useTransform(scrollYProgress, [0.15, 0.35], [0, 1])

  // Stage 3: Fins + nosecone draw (35% → 50%)
  const finsPathLength = useTransform(scrollYProgress, [0.35, 0.50], [0, 1])
  const noseconePathLength = useTransform(scrollYProgress, [0.35, 0.50], [0, 1])

  // Stage 4: Window draws (50% → 65%)
  const windowPathLength = useTransform(scrollYProgress, [0.50, 0.65], [0, 1])

  // Stage 5: Color fills fade in (65% → 80%)
  const fillOpacity = useTransform(scrollYProgress, [0.65, 0.80], [0, 1])

  // Stage 6: Grid fades out (80% → 90%)
  const gridFadeOut = useTransform(scrollYProgress, [0.80, 0.90], [1, 0])

  // Stage 7: Launch — rocket moves up, exhaust appears (90% → 100%)
  const rocketY = useTransform(scrollYProgress, [0.90, 1.0], [0, -100])
  const exhaustOpacity = useTransform(scrollYProgress, [0.90, 1.0], [0, 1])

  const isEn = language === 'en'

  // --- Reduced motion: static rocket, no scroll runway ---
  if (reducedMotion) {
    return (
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex items-center justify-center" style={{ height: '500px' }}>
            <RocketSVG mode="static" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: '250vh' }}
      aria-label={isEn ? 'Rocket build animation' : 'Animație construire rachetă'}
    >
      {/* Sticky viewport — stays pinned while user scrolls through the runway */}
      <div
        className="sticky top-0 flex h-screen items-center justify-center overflow-hidden"
        style={{
          backgroundColor: 'var(--blueprint-bg)',
          willChange: 'transform',
        }}
      >
        {/* Blueprint paper texture — subtle background pattern */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            backgroundImage:
              'radial-gradient(circle, var(--blueprint-grid) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
            opacity: 0.15,
          }}
        />

        {/* Rocket SVG */}
        <div className="relative z-10 h-[60vh] w-full max-w-md px-4 sm:h-[70vh] sm:max-w-lg">
          <RocketSVG
            mode="animated"
            gridOpacity={gridOpacity}
            gridFadeOut={gridFadeOut}
            bodyPathLength={bodyPathLength}
            finsPathLength={finsPathLength}
            noseconePathLength={noseconePathLength}
            windowPathLength={windowPathLength}
            fillOpacity={fillOpacity}
            exhaustOpacity={exhaustOpacity}
            rocketY={rocketY}
          />
        </div>
      </div>
    </section>
  )
}
