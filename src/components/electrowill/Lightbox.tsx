'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { GalleryPhoto } from './content/gallery'

// ---------------------------------------------------------------------------
// Lightbox — full-size gallery overlay (Phase E).
// ---------------------------------------------------------------------------
// Gallery thumbnails are tiny on mobile; tapping one opens the photo full-size.
// Lean (no dep), and accessible like LeadCaptureManager: role=dialog + aria-modal,
// focus move + Tab trap, Esc / overlay / ✕ (≥44px) to close, ← → to page,
// reduced-motion-gated entrance.
//
// Wiring mirrors TapTracker / the I1 [data-lead-open] pattern: WorkGallery stays
// server-rendered and marks each real photo tile with `data-lightbox-index`;
// this client island holds the ordered photo list and opens on a delegated
// capture-phase click. Placeholder tiles (no `src`) aren't marked, so nothing
// opens until real photos land.
// ---------------------------------------------------------------------------

const CAPTION_ID = 'ew-lightbox-caption'

interface LightboxProps {
  /** Only photos with an optimized file (GALLERY_PHOTOS_WITH_SRC). */
  photos: (GalleryPhoto & { src: string })[]
}

export function Lightbox({ photos }: LightboxProps) {
  const [index, setIndex] = useState<number | null>(null)
  const prefersReduced = useReducedMotion()
  const dialogRef = useRef<HTMLDivElement>(null)

  const count = photos.length
  const open = index !== null

  const close = useCallback(() => setIndex(null), [])
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % count)),
    [count],
  )
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + count) % count)),
    [count],
  )

  // Delegated open: any [data-lightbox-index] control opens at that index.
  useEffect(() => {
    if (count === 0) return
    const onClick = (event: MouseEvent) => {
      const node = event.target
      if (!(node instanceof Element)) return
      const trigger = node.closest('[data-lightbox-index]')
      if (!trigger) return
      const raw = trigger.getAttribute('data-lightbox-index')
      const i = raw === null ? Number.NaN : Number.parseInt(raw, 10)
      if (Number.isNaN(i) || i < 0 || i >= count) return
      event.preventDefault()
      setIndex(i)
    }
    document.addEventListener('click', onClick, { capture: true })
    return () =>
      document.removeEventListener('click', onClick, { capture: true })
  }, [count])

  // Keyboard + focus while open.
  useEffect(() => {
    if (!open) return
    dialogRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') return close()
      if (event.key === 'ArrowRight') return next()
      if (event.key === 'ArrowLeft') return prev()
      if (event.key !== 'Tab') return

      const root = dialogRef.current
      if (!root) return
      const focusable = Array.from(root.querySelectorAll<HTMLElement>('button'))
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
  }, [open, close, next, prev])

  if (!open || index === null) return null
  const photo = photos[index]
  if (!photo) return null

  const btn =
    'flex h-12 w-12 items-center justify-center rounded-full bg-white/95 ' +
    'text-[26px] leading-none text-foreground shadow-ew-bar hover:bg-white'

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-foreground/80 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={CAPTION_ID}
        tabIndex={-1}
        className={cn(
          'relative flex max-h-full max-w-[1100px] flex-col items-center outline-none',
          !prefersReduced && 'animate-in fade-in zoom-in-95 duration-200',
        )}
      >
        <img
          src={photo.src}
          alt={photo.alt}
          className="max-h-[80vh] w-auto max-w-full rounded-[12px] object-contain"
        />
        <p
          id={CAPTION_ID}
          className="mt-3 text-center font-body text-[14px] font-semibold text-white"
        >
          {photo.caption}
        </p>

        <button
          type="button"
          onClick={close}
          aria-label="Închide"
          className={cn(btn, 'absolute -right-1 -top-1')}
        >
          ×
        </button>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Foto anterioară"
              className={cn(btn, 'absolute left-1 top-1/2 -translate-y-1/2')}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Foto următoare"
              className={cn(btn, 'absolute right-1 top-1/2 -translate-y-1/2')}
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  )
}
