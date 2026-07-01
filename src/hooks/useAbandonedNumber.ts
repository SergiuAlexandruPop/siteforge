'use client'

import { useEffect, useRef } from 'react'
import { normalizeRoPhone } from '@/lib/phone-ro'

// ---------------------------------------------------------------------------
// useAbandonedNumber — rescue a valid-but-unsubmitted phone number (#3).
// ---------------------------------------------------------------------------
// If the visitor types a COMPLETE RO number but never presses "Sună-mă", fire a
// one-shot beacon to /api/lead (kind 'abandoned') when they go idle (~3 min) or
// leave the tab. navigator.sendBeacon survives page unload; fetch usually does
// not. We send at most once per mount.
//
// Privacy: this only builds the MECHANISM. The server route refuses to email
// abandoned numbers unless EW_RESCUE_ENABLED is set (GDPR lawful basis verified
// in Phase F), so until then the /api/lead beacon is accepted and dropped.
//
// I2: in parallel we emit ONE anonymous count to /api/c ('lead_abandoned') with
// NO number in the payload — legally clean analytics (contact no one, store no
// PII). We also flush on unmount so a ✕/Esc/overlay dismiss with a complete but
// unsubmitted number is counted, not just idle/tab-close.
// ---------------------------------------------------------------------------

const IDLE_MS = 3 * 60_000

interface UseAbandonedNumberOptions {
  /** The current raw input value. */
  value: string
  /** True once the visitor has successfully submitted (suppresses rescue). */
  submitted: boolean
  /** Optional source tag for the email (e.g. 'card'). */
  source?: string
}

export function useAbandonedNumber({
  value,
  submitted,
  source,
}: UseAbandonedNumberOptions): void {
  // Keep the latest props in a ref so the stable flush closure always reads fresh values.
  const latest = useRef<UseAbandonedNumberOptions>({ value, submitted, source })
  latest.current = { value, submitted, source }

  const sentRef = useRef(false)

  const flushRef = useRef(() => {
    if (sentRef.current) return
    const current = latest.current
    if (current.submitted) return
    const phone = normalizeRoPhone(current.value)
    if (!phone) return
    if (typeof navigator === 'undefined' || !('sendBeacon' in navigator)) return

    sentRef.current = true
    const payload = JSON.stringify({
      phone,
      source: current.source ?? 'rescue',
      kind: 'abandoned',
    })
    navigator.sendBeacon('/api/lead', payload)
    // I2: anonymous count only — no phone in this payload, no outreach.
    navigator.sendBeacon('/api/c', JSON.stringify({ event: 'lead_abandoned' }))
  })

  useEffect(() => {
    const flush = flushRef.current

    // (Re)arm the idle timer whenever the value changes — debounced "stopped typing".
    const idle = window.setTimeout(flush, IDLE_MS)

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flush()
    }
    window.addEventListener('pagehide', flush)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      window.clearTimeout(idle)
      window.removeEventListener('pagehide', flush)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [value])

  // Flush on true unmount only (empty deps): covers dismissing the card (✕ / Esc /
  // overlay) with a complete, unsubmitted number. sentRef keeps it one-shot; the
  // `submitted` check inside flush suppresses it after a successful submit.
  useEffect(() => {
    const flush = flushRef.current
    return () => flush()
  }, [])
}
