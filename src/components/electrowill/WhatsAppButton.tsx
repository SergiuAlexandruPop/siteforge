import { cn } from '@/lib/utils'
import { WhatsAppIcon } from './icons'
import { WHATSAPP_URL } from './contact'

// ---------------------------------------------------------------------------
// WhatsAppButton — the always-visible secondary action (DESIGN.md §4.1).
// ---------------------------------------------------------------------------
// Same shape as CallButton, painted in WhatsApp green (the `whatsapp` token,
// NOT shadcn's --secondary). Always opens wa.me/40750447426 in a new tab.
// Sizing is passed via `className`. Uses the WhatsApp brand mark, never a
// generic chat icon.
// ---------------------------------------------------------------------------

interface WhatsAppButtonProps {
  /** Button label (e.g. "WhatsApp" or "Scrie pe WhatsApp"). */
  children: React.ReactNode
  /** Sizing / layout overrides (height, padding, font-size, width). */
  className?: string
  iconClassName?: string
}

export function WhatsAppButton({
  children,
  className,
  iconClassName,
}: WhatsAppButtonProps) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-track="whatsapp"
      className={cn(
        'inline-flex items-center justify-center gap-[9px] rounded-[14px]',
        'bg-whatsapp text-whatsapp-foreground font-body font-extrabold',
        'no-underline transition-[background-color] duration-150 hover:brightness-[.94]',
        className,
      )}
    >
      <WhatsAppIcon className={cn('h-[1.25em] w-[1.25em] shrink-0', iconClassName)} />
      {children}
    </a>
  )
}
