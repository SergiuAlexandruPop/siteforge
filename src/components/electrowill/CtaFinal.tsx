import { CallButton } from './CallButton'
import { WhatsAppButton } from './WhatsAppButton'
import { PHONE_DISPLAY } from './contact'

// ---------------------------------------------------------------------------
// CtaFinal — closing CTA band (DESIGN.md §5.8). Centered H2 + 2 buttons.
// ---------------------------------------------------------------------------

export function CtaFinal() {
  return (
    <section className="mx-auto max-w-[1280px] px-[18px] py-12 text-center lg:px-10 lg:py-[78px]">
      <h2 className="m-0 mb-[14px] text-balance font-display text-[28px] font-extrabold leading-[1.1] tracking-[-0.6px] text-foreground lg:text-[46px]">
        Un singur telefon și ne ocupăm de tot.
      </h2>
      <p className="m-0 mb-8 font-body text-[16.5px] text-muted-foreground lg:text-[19px]">
        Acte, branșament, contor, priză de pământ + buletin. Cu garanție.
      </p>
      <div className="flex flex-col justify-center gap-[11px] sm:flex-row sm:gap-[14px]">
        <CallButton className="h-[58px] w-full px-[34px] text-[18px] sm:w-auto lg:h-16 lg:text-[20px]">
          Sună acum · {PHONE_DISPLAY}
        </CallButton>
        <WhatsAppButton
          className="h-[58px] w-full px-[30px] text-[18px] sm:w-auto lg:h-16 lg:text-[20px]"
          iconClassName="h-6 w-6"
        >
          WhatsApp
        </WhatsAppButton>
      </div>

      {/* Inline re-open trigger (I1): reopens the lead card after auto-dismiss. */}
      <button
        type="button"
        data-lead-open
        className="mt-6 font-body text-[15.5px] font-semibold text-primary underline underline-offset-2 hover:text-foreground"
      >
        Sau lasă-ne numărul — te sunăm noi.
      </button>
    </section>
  )
}
