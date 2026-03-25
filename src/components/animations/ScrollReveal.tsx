'use client'

import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { ScrollRevealProps, RevealDirection } from '@/types/animations'

// ---------------------------------------------------------------------------
// ScrollReveal — Scroll-triggered reveal animation.
//
// Wraps children in a div that fades/slides into view when it enters the
// viewport. Uses IntersectionObserver (via useScrollReveal hook).
//
// Accessibility:
//   - When prefers-reduced-motion is active, content is visible immediately
//     with no transition or transform.
//
// Usage:
//   <ScrollReveal direction="up" delay={0.1}>
//     <Card>...</Card>
//   </ScrollReveal>
// ---------------------------------------------------------------------------

/** Maps direction to the initial CSS translate value. */
function getTranslateStart(direction: RevealDirection): string {
  switch (direction) {
    case 'up':    return 'translateY(30px)'
    case 'down':  return 'translateY(-30px)'
    case 'left':  return 'translateX(30px)'
    case 'right': return 'translateX(-30px)'
  }
}

export function ScrollReveal({
  children,
  direction = 'up',
  duration = 0.7,
  delay = 0,
  threshold = 0.15,
  once = true,
  className = '',
}: ScrollRevealProps) {
  const prefersReduced = useReducedMotion()
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold, once })

  // Reduced motion: render children immediately, no animation wrapper styles.
  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

  const hiddenStyle: React.CSSProperties = {
    opacity: 0,
    transform: getTranslateStart(direction),
    transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
    willChange: 'opacity, transform',
  }

  const visibleStyle: React.CSSProperties = {
    opacity: 1,
    transform: 'translate(0)',
    transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
    willChange: 'auto',
  }

  return (
    <div
      ref={ref}
      className={className}
      style={isVisible ? visibleStyle : hiddenStyle}
    >
      {children}
    </div>
  )
}
