'use client'

import { useRef, useState, useEffect, type RefObject } from 'react'

// ---------------------------------------------------------------------------
// useScrollReveal — IntersectionObserver-based visibility detection.
//
// Returns a ref to attach to the target element and a boolean indicating
// whether the element has entered the viewport.
//
// Options:
//   threshold  — fraction of element visible to trigger (0–1). Default: 0.15
//   once       — if true, unobserves after first trigger. Default: true
//   rootMargin — CSS margin around the root (viewport). Default: '0px'
//
// Usage:
//   const { ref, isVisible } = useScrollReveal({ threshold: 0.2 })
//   <div ref={ref} className={isVisible ? 'animate-in' : 'animate-out'}>
// ---------------------------------------------------------------------------

interface UseScrollRevealOptions {
  threshold?: number
  once?: boolean
  rootMargin?: string
}

interface UseScrollRevealReturn<T extends HTMLElement> {
  ref: RefObject<T | null>
  isVisible: boolean
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {}
): UseScrollRevealReturn<T> {
  const { threshold = 0.15, once = true, rootMargin = '0px' } = options
  const ref = useRef<T | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) {
            observer.unobserve(element)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, once, rootMargin])

  return { ref, isVisible }
}
