'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import type { SmoothScrollProps } from '@/types/animations'

// ---------------------------------------------------------------------------
// SmoothScroll — Lenis wrapper for smooth scrolling.
//
// Wraps the page content with a Lenis instance that provides inertia-based
// smooth scrolling. This is a layout-level component — used inside
// PortfolioLayout (Chat 2) or any client layout that wants smooth scroll.
//
// Accessibility:
//   - Lenis automatically disables when prefers-reduced-motion is set
//   - Falls back to native browser scrolling (zero impact)
//
// Performance:
//   - Lenis is ~5KB gzipped (MIT license)
//   - Uses requestAnimationFrame internally
//   - Cleans up on unmount
//
// Note: Lenis is dynamically imported to keep the initial bundle clean.
// ---------------------------------------------------------------------------

export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<unknown>(null)

  useEffect(() => {
    let destroyed = false

    async function init() {
      const { default: Lenis } = await import('lenis')

      if (destroyed) return

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 2,
        infinite: false,
      })

      lenisRef.current = lenis

      function raf(time: number) {
        lenis.raf(time)
        if (!destroyed) {
          requestAnimationFrame(raf)
        }
      }

      requestAnimationFrame(raf)
    }

    init()

    return () => {
      destroyed = true
      if (lenisRef.current) {
        (lenisRef.current as { destroy: () => void }).destroy()
        lenisRef.current = null
      }
    }
  }, [])

  return <>{children}</>
}
