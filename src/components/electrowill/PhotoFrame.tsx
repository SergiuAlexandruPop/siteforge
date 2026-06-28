import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// PhotoFrame — shared rounded + bordered photo surface (DESIGN.md §4.11).
// ---------------------------------------------------------------------------
// Every image in the design sits in this frame: rounded corners + 1px border,
// object-cover, and a bottom-left caption pill. Until real work photos land
// (Phase E) it renders the 45° hatch placeholder (.ew-hatch / .ew-hatch-sm).
//
// Sizing (height OR aspect-ratio), corner radius and inner padding are passed
// via `className` so one primitive serves the hero (h-[440px], r22, p18), the
// service strips (h-[240px], r-top), the gallery tiles (aspect-[16/10], r16,
// p12) and the map placeholder.
//
// When photos arrive, swap the hatch for a next/image <Image fill> here — the
// border/radius/caption contract stays identical.
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
}

export function PhotoFrame({
  caption,
  className,
  hatch = 'lg',
  captionClassName,
}: PhotoFrameProps) {
  return (
    <div
      className={cn(
        'flex items-end overflow-hidden border border-border p-[14px]',
        hatch === 'sm' ? 'ew-hatch-sm' : 'ew-hatch',
        className,
      )}
    >
      <span
        className={cn(
          'rounded-[11px] border border-border bg-white px-[15px] py-[9px]',
          'font-body text-[14px] font-bold text-muted-foreground',
          captionClassName,
        )}
      >
        {caption}
      </span>
    </div>
  )
}
