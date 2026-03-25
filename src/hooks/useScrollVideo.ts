'use client'

import { useRef, type RefObject } from 'react'

// ---------------------------------------------------------------------------
// useScrollVideo — Stub for future scroll-linked video playback.
//
// When a video asset is ready, this hook will bind video.currentTime to
// the scroll position using requestAnimationFrame + scroll events.
//
// For now it returns the correct shape so components can be written against
// the interface without the implementation existing yet.
//
// Future implementation will:
//   1. Accept a ref to a <video> element
//   2. Listen to scroll events within a container
//   3. Map scroll % → video.currentTime using rAF
//   4. Respect prefers-reduced-motion (show poster frame, no scrub)
//
// See DESIGN.md Section 7 — "Future: ScrollVideoHero"
// ---------------------------------------------------------------------------

interface UseScrollVideoOptions {
  /** When true, the scroll-video binding is active. Default: false (stub). */
  enabled?: boolean
}

interface UseScrollVideoReturn<T extends HTMLElement> {
  /** Ref to attach to the scroll container element. */
  containerRef: RefObject<T | null>
  /** Current scroll progress (0–1). Always 0 in this stub. */
  progress: number
}

export function useScrollVideo<T extends HTMLElement = HTMLDivElement>(
  _options: UseScrollVideoOptions = {}
): UseScrollVideoReturn<T> {
  const containerRef = useRef<T | null>(null)

  // Stub — returns static values. Real implementation in a future phase.
  return {
    containerRef,
    progress: 0,
  }
}
