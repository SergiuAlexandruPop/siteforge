'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { MarqueeProps } from '@/types/animations'

// ---------------------------------------------------------------------------
// Marquee — Infinite horizontal scrolling strip.
//
// Renders children twice side-by-side and uses a CSS keyframe animation to
// scroll them infinitely. The duplication creates the seamless loop effect.
//
// Accessibility:
//   - prefers-reduced-motion: disables scrolling, shows items in a static
//     flex-wrap layout so all content is still visible.
//   - Pause on hover for users who need time to read moving content.
//
// Usage:
//   <Marquee speed={35} pauseOnHover>
//     <span>React</span>
//     <span>Next.js</span>
//     <span>TypeScript</span>
//   </Marquee>
// ---------------------------------------------------------------------------

export function Marquee({
  children,
  speed = 35,
  pauseOnHover = true,
  direction = 'left',
  gap = '2rem',
  className = '',
}: MarqueeProps) {
  const prefersReduced = useReducedMotion()

  // Reduced motion: static flex-wrap layout showing all items.
  if (prefersReduced) {
    return (
      <div
        className={className}
        style={{ display: 'flex', flexWrap: 'wrap', gap }}
      >
        {children}
      </div>
    )
  }

  const animationDirection = direction === 'left' ? 'normal' : 'reverse'

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{ ['--marquee-gap' as string]: gap }}
    >
      <div
        className="marquee-track"
        style={{
          display: 'flex',
          gap,
          width: 'max-content',
          animation: `marquee ${speed}s linear infinite`,
          animationDirection,
        }}
        onMouseEnter={(e) => {
          if (pauseOnHover) {
            e.currentTarget.style.animationPlayState = 'paused'
          }
        }}
        onMouseLeave={(e) => {
          if (pauseOnHover) {
            e.currentTarget.style.animationPlayState = 'running'
          }
        }}
      >
        {/* First copy */}
        {children}
        {/* Second copy for seamless loop */}
        {children}
      </div>
    </div>
  )
}
