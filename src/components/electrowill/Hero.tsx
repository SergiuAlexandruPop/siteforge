import { CallButton } from './CallButton'
import { WhatsAppButton } from './WhatsAppButton'
import { PhotoFrame } from './PhotoFrame'
import { ShieldIcon, ClockIcon, FileCheckIcon } from './icons'

// ---------------------------------------------------------------------------
// Hero — eyebrow + H1 + subline + 2 CTAs + inline trust row | work photo.
// Desktop: 2-col grid (1.05fr 1fr). Mobile: stacked (text then photo),
// buttons full-width. DESIGN.md §5.2.
// ---------------------------------------------------------------------------

export function Hero() {
  return (
    <section className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-10 px-[18px] py-7 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:px-10 lg:py-16">
      <div>
        <div className="mb-[22px] inline-flex h-[34px] items-center gap-2 rounded-full border border-border bg-muted px-[14px] font-body text-[13px] font-extrabold text-primary">
          <ShieldIcon className="h-[15px] w-[15px]" /> Autorizați ANRE · Bistrița-Năsăud
        </div>

        <h1 className="m-0 mb-5 text-balance font-display text-[34px] font-extrabold leading-[1.1] tracking-[-0.3px] text-foreground lg:text-[60px] lg:leading-[1.05] lg:tracking-[-1px]">
          Îți aducem curentul în casă.
        </h1>

        <p className="m-0 mb-[26px] max-w-[560px] font-body text-[16.5px] leading-[1.5] text-muted-foreground lg:mb-[30px] lg:text-[20px]">
          Branșamente electrice în Bistrița-Năsăud. <b className="text-foreground">Autorizați ANRE</b>{' '}
          · Răspundem în 12 ore · Ne ocupăm de toate actele.
        </p>

        <div className="mb-[26px] flex flex-col gap-[11px] sm:flex-row sm:gap-[14px]">
          <CallButton className="h-[58px] w-full px-[30px] text-[18px] sm:w-auto lg:h-[62px] lg:text-[19px]">
            Sună acum
          </CallButton>
          <WhatsAppButton
            className="h-[58px] w-full px-[30px] text-[18px] sm:w-auto lg:h-[62px] lg:text-[19px]"
            iconClassName="h-[23px] w-[23px]"
          >
            Scrie pe WhatsApp
          </WhatsAppButton>
        </div>

        <div className="flex flex-wrap items-center gap-x-[22px] gap-y-2 font-body text-[15px] font-bold text-muted-foreground">
          <span className="flex items-center gap-2">
            <ClockIcon className="h-[17px] w-[17px] text-primary" /> Răspundem în 12 ore
          </span>
          <span className="hidden h-[5px] w-[5px] rounded-full bg-[#C3CDBB] sm:block" />
          <span className="flex items-center gap-2">
            <FileCheckIcon className="h-[17px] w-[17px] text-primary" /> Ne ocupăm de acte
          </span>
        </div>
      </div>

      <PhotoFrame
        caption="Foto lucrare · branșament la casă"
        className="h-[210px] rounded-[18px] p-[18px] lg:h-[440px] lg:rounded-[22px]"
      />
    </section>
  )
}
