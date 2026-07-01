'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// ---------------------------------------------------------------------------
// useLeadCaptureTrigger — decides WHEN the lead card appears (ElectroWill #3).
// ---------------------------------------------------------------------------
// Composition over inheritance: this hook owns the trigger policy; the card and
// overlay are separate presentational pieces. Policy (from the brief):
//   - once per session (sessionStorage flag; survives reloads, not new tabs)
//   - opens on the FIRST of ~60% scroll depth OR ~35s on the page
//   - desktop only: exit-intent (pointer leaves the viewport toward the top)
//   - NOT on the hero — both signals require the visitor to engage first
// Dismissing (button, overlay click, Esc) sets the flag so it never returns.
// `openNow()` is the imperative re-open (I1): it forces the card open regardless
// of the once/session flag, so inline CTAs can bring it back after auto-dismiss.
// All browser access is inside useEffect → SSR-safe.
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'ew_lead_dismissed'
const SCROLL_FRACTION = 0.6
const TIME_DELAY_MS = 35_000
const DESKTOP_QUERY = '(min-width: 1024px)'

function alreadyDismissed(): boolean {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function useLeadCaptureTrigger(): {
  open: boolean
  dismiss: () => void
  openNow: () => void
} {
  const [open, setOpen] = useState(false)
  const firedRef = useRef(false)

  const reveal = useCallback(() => {
    if (firedRef.current) return
    if (alreadyDismissed()) return
    firedRef.current = true
    setOpen(true)
  }, [])

  // Imperative re-open (I1): bypasses the once/session guard so an inline CTA
  // can reopen the card after it was auto-shown and dismissed.
  const openNow = useCallback(() => {
    firedRef.current = true
    setOpen(true)
  }, [])

  const dismiss = useCallback(() => {
    setOpen(false)
    firedRef.current = true
    try {
      window.sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // sessionStorage unavailable (private mode): in-memory firedRef still guards.
    }
  }, [])

  useEffect(() => {
    if (alreadyDismissed()) {
      firedRef.current = true
      return
    }

    // 1) Time on page (~35s).
    const timer = window.setTimeout(reveal, TIME_DELAY_MS)

    // 2) Scroll depth (~60%).
    const onScroll = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight
      if (scrollable <= 0) return
      if (window.scrollY / scrollable >= SCROLL_FRACTION) reveal()
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // 3) Desktop exit-intent (pointer leaves toward the top of the window).
    const isDesktop = window.matchMedia(DESKTOP_QUERY).matches
    const onMouseOut = (event: MouseEvent) => {
      if (event.clientY <= 0 && event.relatedTarget === null) reveal()
    }
    if (isDesktop) {
      document.addEventListener('mouseout', onMouseOut)
    }

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
      if (isDesktop) document.removeEventListener('mouseout', onMouseOut)
    }
  }, [reveal])

  return { open, dismiss, openNow }
}
