import { cn } from '@/lib/utils'
import { PhoneIcon } from './icons'
import { PHONE_TEL } from './contact'

// ---------------------------------------------------------------------------
// CallButton — the primary "Sună acum" action (DESIGN.md §4.1).
// ---------------------------------------------------------------------------
// Always points at the dialer (tel:0750447426). A plain anchor — no client JS.
// Sizing (height/padding/font) is passed via `className` so the same primitive
// serves hero (62px), CTA final (64px), header (52px) and the area card (54px).
// Base style: bg-primary, white, radius 14, Mulish 800, phone glyph.
// ---------------------------------------------------------------------------

interface CallButtonProps {
  /** Button label (e.g. "Sună acum" or "Sună acum · 0750 447 426"). */
  children: React.ReactNode
  /** Sizing / layout overrides (height, padding, font-size, width). */
  className?: string
  /** Hide the leading phone icon (rare). */
  hideIcon?: boolean
  iconClassName?: string
}

export function CallButton({
  children,
  className,
  hideIcon = false,
  iconClassName,
}: CallButtonProps) {
  return (
    <a
      href={PHONE_TEL}
      data-track="call"
      className={cn(
        'inline-flex items-center justify-center gap-[11px] rounded-[14px]',
        'bg-primary text-primary-foreground font-body font-extrabold',
        'no-underline transition-[background-color] duration-150 hover:brightness-[.94]',
        className,
      )}
    >
      {!hideIcon && <PhoneIcon className={cn('h-[1.1em] w-[1.1em] shrink-0', iconClassName)} />}
      {children}
    </a>
  )
}
