import Link from 'next/link'
import type { NavigationItem } from '@/types/config'
import { BoltIcon, PhoneIcon } from './icons'
import { WhatsAppButton } from './WhatsAppButton'
import { PHONE_TEL, PHONE_DISPLAY } from './contact'

// ---------------------------------------------------------------------------
// ElectroWillHeader — sticky site header (DESIGN.md §4.9).
// ---------------------------------------------------------------------------
// Desktop (lg+): 78px sticky white bar, 1280 inner — wordmark · center anchor
// nav · right CTAs (WhatsApp 52px + two-line phone CTA 52px).
// Mobile (<lg): simple row — wordmark + a 48px white phone button. The center
// nav and right CTAs are hidden; the persistent primary action moves to the
// fixed bottom bar (StickyContactBar). Server component — plain anchors, no JS.
// ---------------------------------------------------------------------------

interface ElectroWillHeaderProps {
  navigation: NavigationItem[]
}

export function ElectroWillHeader({ navigation }: ElectroWillHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background shadow-ew-header">
      <div className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between px-[18px] lg:h-[78px] lg:px-10">
        {/* Wordmark — no logo image, text only (logo is a later phase) */}
        <Link href="/" className="flex items-center gap-3 no-underline">
          <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-primary text-primary-foreground lg:h-[42px] lg:w-[42px]">
            <BoltIcon className="h-[18px] w-[18px] lg:h-5 lg:w-5" />
          </span>
          <span className="font-display text-[17px] font-extrabold text-foreground lg:text-[21px]">
            ElectroWill <span className="text-primary">Solutions</span>
          </span>
        </Link>

        {/* Center anchor nav — desktop only */}
        <nav className="hidden items-center gap-[30px] lg:flex">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-body text-[15px] font-bold text-foreground no-underline transition-opacity hover:opacity-70"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right CTAs — desktop only */}
        <div className="hidden items-center gap-[11px] lg:flex">
          <WhatsAppButton className="h-[52px] px-5 text-[16px]" iconClassName="h-5 w-5">
            WhatsApp
          </WhatsAppButton>
          <a
            href={PHONE_TEL}
            className="flex h-[52px] flex-col items-start justify-center rounded-[14px] bg-primary px-[22px] leading-[1.05] text-primary-foreground no-underline transition-[background-color] duration-150 hover:brightness-[.94]"
          >
            <span className="font-body text-[11px] font-semibold opacity-85">Sună acum</span>
            <span className="flex items-center gap-2 whitespace-nowrap font-body text-[18px] font-extrabold">
              <PhoneIcon className="h-[14px] w-[14px]" /> {PHONE_DISPLAY}
            </span>
          </a>
        </div>

        {/* Mobile phone button — 48px, white with border */}
        <a
          href={PHONE_TEL}
          aria-label={`Sună acum la ${PHONE_DISPLAY}`}
          className="flex h-12 w-12 items-center justify-center rounded-[14px] border border-border bg-white text-primary no-underline lg:hidden"
        >
          <PhoneIcon className="h-[22px] w-[22px]" />
        </a>
      </div>
    </header>
  )
}
