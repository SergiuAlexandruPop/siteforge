'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useLeadCaptureTrigger } from '@/hooks/useLeadCaptureTrigger'
import { LeadCaptureCard } from './LeadCaptureCard'

// ---------------------------------------------------------------------------
// LeadCaptureManager — client island that orchestrates the lead card (#3).
// ---------------------------------------------------------------------------
// Mounted once on the homepage only (never on /contact or /confidentialitate).
// Owns: the trigger hook (when to show), the modal overlay, accessibility
// (role=dialog, aria-modal, focus move + trap, Esc/overlay/✕ to dismiss), one
// 'lead_open' tap beacon, and the reduced-motion-gated entrance. The card body
// (LeadCaptureCard) handles the form + WhatsApp + rescue.
// ---------------------------------------------------------------------------

const TITLE_ID = 'ew-lead-title'
const FOCUSABLE =
  'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'

export function LeadCaptureManager() {
  const { open, dismiss } = useLeadCaptureTrigger()
  const prefersReduced = useReducedMotion()
  const cardRef = useRef<HTMLDivElement>(null)
  const beaconedRef = useRef(false)

  useEffect(() => {
    if (!open) return

    // Count one open (cookieless, fire-and-forget).
    if (
      !beaconedRef.current &&
      typeof navigator !== 'undefined' &&
      'sendBeacon' in navigator
    ) {
      beaconedRef.current = true
      navigator.sendBeacon('/api/c', JSON.stringify({ event: 'lead_open' }))
    }

    // Move focus into the dialog.
    cardRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dismiss()
        return
      }
      if (event.key !== 'Tab') return

      const root = cardRef.current
      if (!root) return
      const focusable = Array.from(
        root.querySelectorAll<HTMLElement>(FOCUSABLE)
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, dismiss])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground/40 p-4 sm:items-center"
      onClick={(event) => {
        if (event.target === event.currentTarget) dismiss()
      }}
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={TITLE_ID}
        tabIndex={-1}
        className={cn(
          'relative w-full max-w-[420px] rounded-[18px] border border-border bg-background p-6 shadow-ew-bar outline-none',
          !prefersReduced &&
            'animate-in fade-in slide-in-from-bottom-4 duration-300'
        )}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Închide"
          className="absolute right-2 top-2 flex h-12 w-12 items-center justify-center rounded-full text-[24px] leading-none text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          ×
        </button>
        <LeadCaptureCard titleId={TITLE_ID} onDismiss={dismiss} />
      </div>
    </div>
  )
}
