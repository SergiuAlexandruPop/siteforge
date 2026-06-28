import { CallButton } from './CallButton'
import { WhatsAppButton } from './WhatsAppButton'
import { PHONE_DISPLAY } from './contact'

// ---------------------------------------------------------------------------
// StickyContactBar — mobile fixed Sună/WhatsApp bar (DESIGN.md §4.3).
// ---------------------------------------------------------------------------
// Mobile only (lg:hidden). Fixed to the bottom, centered, ≤430px, white, top
// hairline + the one allowed bottom-bar shadow. Two CTAs: "Sună acum" (flex
// 1.5) + "WhatsApp" (flex 1), both 58px. The layout reserves pb on <main> so
// content never hides behind it. This is the persistent primary action on phones
// (the desktop equivalent is the sticky header CTAs).
// ---------------------------------------------------------------------------

export function StickyContactBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
      <div className="mx-auto flex max-w-[430px] items-stretch gap-[11px] border-t border-border bg-background px-[18px] py-3 shadow-ew-bar">
        <CallButton
          className="h-[58px] flex-[1.5] flex-col gap-0 leading-[1.05] text-[16px]"
          hideIcon
        >
          <span className="text-[12px] font-semibold opacity-85">Sună acum</span>
          <span className="text-[17px] font-extrabold">{PHONE_DISPLAY}</span>
        </CallButton>
        <WhatsAppButton className="h-[58px] flex-1 text-[16px]" iconClassName="h-[22px] w-[22px]">
          WhatsApp
        </WhatsAppButton>
      </div>
    </div>
  )
}
