'use client'

import { useState, useEffect, useRef } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { CountUpProps } from '@/types/animations'

// ---------------------------------------------------------------------------
// CountUp — Animates a number from 0 to a target value.
//
// Uses requestAnimationFrame for smooth 60fps animation with an ease-out
// curve (fast start, slow finish). Animation triggers when the element
// enters the viewport (via useScrollReveal).
//
// Accessibility:
//   - prefers-reduced-motion: shows the final number immediately.
//
// Usage:
//   <CountUp target={150} suffix="+" />   →  "150+"
//   <CountUp target={99.9} decimals={1} suffix="%" />  →  "99.9%"
// ---------------------------------------------------------------------------

/** Ease-out curve: fast start, slow finish. */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export function CountUp({
  target,
  duration = 2,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}: CountUpProps) {
  const prefersReduced = useReducedMotion()
  const { ref, isVisible } = useScrollReveal<HTMLSpanElement>({ threshold: 0.5 })
  const [displayValue, setDisplayValue] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isVisible || hasAnimated.current || prefersReduced) return

    hasAnimated.current = true
    const durationMs = duration * 1000
    let startTime: number | null = null

    function animate(timestamp: number) {
      if (startTime === null) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / durationMs, 1)
      const easedProgress = easeOut(progress)

      setDisplayValue(easedProgress * target)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, target, duration, prefersReduced])

  // Reduced motion: show final value immediately.
  const value = prefersReduced ? target : displayValue
  const formatted = value.toFixed(decimals)

  return (
    <span ref={ref} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  )
}
