'use client'

import { useState, useEffect, useCallback } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { RotatingTextProps } from '@/types/animations'

// ---------------------------------------------------------------------------
// RotatingText — Cycles through an array of words with a fade transition.
//
// Each word is displayed for `interval` ms, then transitions to the next.
// The cycling word is rendered inside a <span> so the parent can style it
// (e.g. text-primary for brand color).
//
// Accessibility:
//   - prefers-reduced-motion: shows the first word statically, no cycling.
//   - aria-live="polite" announces word changes to screen readers.
//
// Usage:
//   <h1>
//     Construiesc{' '}
//     <RotatingText
//       words={['site-uri', 'aplicații', 'magazine online']}
//       className="text-primary"
//     />
//   </h1>
// ---------------------------------------------------------------------------

export function RotatingText({
  words,
  interval = 3000,
  transitionDuration = 0.5,
  className = '',
}: RotatingTextProps) {
  const prefersReduced = useReducedMotion()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const advance = useCallback(() => {
    setIsTransitioning(true)

    // After the fade-out completes, switch the word and fade back in.
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length)
      setIsTransitioning(false)
    }, transitionDuration * 1000)
  }, [words.length, transitionDuration])

  useEffect(() => {
    if (prefersReduced) return
    if (words.length < 2) return

    const timer = setInterval(advance, interval)
    return () => clearInterval(timer)
  }, [prefersReduced, words.length, interval, advance])

  // Reduced motion: static first word, no transitions.
  if (prefersReduced) {
    return <span className={className}>{words[0]}</span>
  }

  return (
    <span
      className={className}
      aria-live="polite"
      style={{
        display: 'inline-block',
        opacity: isTransitioning ? 0 : 1,
        transform: isTransitioning ? 'translateY(8px)' : 'translateY(0)',
        transition: `opacity ${transitionDuration}s ease-in-out, transform ${transitionDuration}s ease-in-out`,
      }}
    >
      {words[currentIndex]}
    </span>
  )
}
