'use client'

import { useEffect } from 'react'

// ---------------------------------------------------------------------------
// TapTracker — cookieless tap counting via one delegated listener (#3).
// ---------------------------------------------------------------------------
// Mounted once in ElectroWillLayout (site-wide, so it also catches the mobile
// sticky-bar taps). Instead of turning every CallButton/WhatsAppButton into a
// client component, those primitives carry a `data-track` attribute and stay
// server-rendered anchors; this single capture-phase listener beacons the tap
// to /api/track. Renders nothing.
// ---------------------------------------------------------------------------

const TRACKABLE = new Set(['call', 'whatsapp'])

export function TapTracker() {
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('sendBeacon' in navigator)) return

    const onClick = (event: MouseEvent) => {
      const node = event.target
      if (!(node instanceof Element)) return
      const el = node.closest('[data-track]')
      if (!el) return
      const value = el.getAttribute('data-track')
      if (!value || !TRACKABLE.has(value)) return
      navigator.sendBeacon('/api/track', JSON.stringify({ event: value }))
    }

    document.addEventListener('click', onClick, { capture: true })
    return () =>
      document.removeEventListener('click', onClick, { capture: true })
  }, [])

  return null
}
