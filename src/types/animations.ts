// ---------------------------------------------------------------------------
// Animation Types — Shared prop interfaces for animation components.
// Used by src/components/animations/ primitives and any client composition.
// ---------------------------------------------------------------------------

import type { ReactNode } from 'react'

// ---------------------------------------------------------------------------
// ScrollReveal
// ---------------------------------------------------------------------------

/** Direction from which the element enters the viewport. */
export type RevealDirection = 'up' | 'down' | 'left' | 'right'

export interface ScrollRevealProps {
  children: ReactNode
  /** Direction the element slides in from. Default: 'up' */
  direction?: RevealDirection
  /** Animation duration in seconds. Default: 0.7 */
  duration?: number
  /** Delay before animation starts in seconds. Default: 0 */
  delay?: number
  /** How much of the element must be visible to trigger (0–1). Default: 0.15 */
  threshold?: number
  /** If true, animates only on first appearance. Default: true */
  once?: boolean
  /** Additional CSS classes on the wrapper div. */
  className?: string
}

// ---------------------------------------------------------------------------
// RotatingText
// ---------------------------------------------------------------------------

export interface RotatingTextProps {
  /** Array of words/phrases to cycle through. Minimum 2. */
  words: string[]
  /** Time each word is displayed in ms. Default: 3000 */
  interval?: number
  /** Transition duration in seconds. Default: 0.5 */
  transitionDuration?: number
  /** Additional CSS classes on the wrapper span. */
  className?: string
}

// ---------------------------------------------------------------------------
// Marquee
// ---------------------------------------------------------------------------

export interface MarqueeProps {
  children: ReactNode
  /** Full cycle duration in seconds. Higher = slower. Default: 35 */
  speed?: number
  /** Pause scrolling on hover. Default: true */
  pauseOnHover?: boolean
  /** Scroll direction. Default: 'left' */
  direction?: 'left' | 'right'
  /** Gap between items. Default: '2rem' */
  gap?: string
  /** Additional CSS classes on the outer container. */
  className?: string
}

// ---------------------------------------------------------------------------
// CountUp
// ---------------------------------------------------------------------------

export interface CountUpProps {
  /** Target number to count up to. */
  target: number
  /** Animation duration in seconds. Default: 2 */
  duration?: number
  /** Prefix shown before the number (e.g. '$'). Default: '' */
  prefix?: string
  /** Suffix shown after the number (e.g. '+'). Default: '' */
  suffix?: string
  /** Number of decimal places. Default: 0 */
  decimals?: number
  /** Additional CSS classes on the wrapper span. */
  className?: string
}

// ---------------------------------------------------------------------------
// SmoothScroll
// ---------------------------------------------------------------------------

export interface SmoothScrollProps {
  children: ReactNode
}
