'use client'

import { useState, useEffect } from 'react'

// ---------------------------------------------------------------------------
// useReducedMotion — Detects prefers-reduced-motion media query.
//
// Returns true when the user's OS or browser is set to reduce motion.
// Every animation component must check this and degrade gracefully:
//   - ScrollReveal → elements appear instantly
//   - RotatingText → shows first word, no cycling
//   - Marquee → static flex-wrap layout
//   - CountUp → shows final number immediately
//   - SmoothScroll → Lenis disables itself (built-in)
//
// SSR safety: defaults to false (animations enabled) during server render
// and hydration, then updates on mount if the user prefers reduced motion.
// ---------------------------------------------------------------------------

export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReduced
}
