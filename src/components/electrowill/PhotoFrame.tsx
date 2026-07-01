import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// PhotoFrame — shared rounded + bordered photo surface (DESIGN.md §4.11).
// ---------------------------------------------------------------------------
// Every image in the design sits in this frame: rounded corners + 1px border,
// object-cover, and a bottom-left caption pill.
//
// Two modes:
//  • `src` present → a plain lazy <img> fills the frame (object-cover). We use a
//    plain <img>, NOT next/image, because the Cloudflare Workers runtime has no
//    Next image optimizer. The frame keeps its fixed size (height OR aspect via
//    `className`), so the image reserves its box and causes NO layout shift.
//    Above-the-fold uses `eager` (hero LCP); gallery tiles stay lazy.
//  • no `src` → the 45° hatch placeholder (.ew-hatch / .ew-hatch-sm), unchanged.
//
// Sizing (height OR aspect-ratio), corner radius and inner padding are passed
// via `className` so one primitive serves the hero (h-[440px], r22, p18), the
// service strips, the gallery tiles (aspect-[16/10], r16, p12) and the map.
// ---------------------------------------------------------------------------

interface PhotoFrameProps {
  /** Caption pill text (e.g. "Foto lucrare · branșament"). */
  caption: string
  /** Sizing/radius/padding/border overrides for the frame. */
  className?: string
  /** Hatch stripe density: 'lg' for big surfaces, 'sm' for gallery tiles. */
  hatch?: 'lg' | 'sm'
  /** Caption text size override (defaults to 14px). */
  captionClassName?: string
  /** Optimized WebP path (e.g. "/lucrari/priza-de-pamant.webp"). When set, renders an <img>. */
  src?: string
  /** Alt text for the image (defaults to `caption`). Only used when `src` is set. */
  alt?: string
  /** Load eagerly (above the fold, e.g. hero) instead of lazily. Only used when `src` is set. */
  eager?: boolean
}

export function PhotoFrame({
  caption,
  className,
  hatch = 'lg',
  captionClassName,
  src,
  alt,
  eager = false,
}: PhotoFrameProps) {
  const hasImage = typeof src === 'string' && src.length > 0

  return (
    <div
      className={cn(
        'flex items-end overflow-hidden border border-border p-[14px]',
        hasImage ? 'relative' : hatch === 'sm' ? 'ew-hatch-sm' : 'ew-hatch',
        className,
      )}
    >
      {hasImage && (
        <img
          src={src}
          alt={alt ?? caption}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={eager ? 'high' : 'auto'}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <span
        className={cn(
          'rounded-[11px] border border-border bg-white px-[15px] py-[9px]',
          'font-body text-[14px] font-bold text-muted-foreground',
          hasImage && 'relative z-10',
          captionClassName,
        )}
      >
        {caption}
      </span>
    </div>
  )
}
