import { CountUp } from '@/components/animations/CountUp'
import { CheckIcon } from './icons'

// ---------------------------------------------------------------------------
// WhyUs — "De ce noi" dark band with trust pills (DESIGN.md §4.4, §4.5, §5.5).
// ---------------------------------------------------------------------------
// A light-mode dark *surface* (ew-dark). The "100+" and "3+" stats animate via
// the shared CountUp primitive (reduced-motion shows the final value instantly).
// Server component; CountUp is the only client island inside the pills.
// ---------------------------------------------------------------------------

const PILL =
  'inline-flex h-[42px] items-center gap-[9px] rounded-full border border-ew-dark-pill-border bg-ew-dark-pill px-5 font-body text-[14px] font-bold text-ew-dark-pill-text lg:h-[46px] lg:text-[16px]'

export function WhyUs() {
  return (
    <section className="bg-ew-dark">
      <div className="mx-auto max-w-[1280px] px-[18px] py-8 lg:px-10 lg:py-[54px]">
        <h2 className="m-0 mb-[26px] text-center font-display text-[22px] font-extrabold text-white lg:text-[28px]">
          De ce noi
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          <span className={PILL}>
            <CheckIcon className="h-[13px] w-[13px] text-ew-success" /> Autorizați ANRE
          </span>
          <span className={PILL}>
            <CheckIcon className="h-[13px] w-[13px] text-ew-success" />
            <CountUp target={100} suffix="+" /> branșamente
          </span>
          <span className={PILL}>
            <CheckIcon className="h-[13px] w-[13px] text-ew-success" />
            <CountUp target={3} suffix="+" /> primării
          </span>
          <span className={PILL}>
            <CheckIcon className="h-[13px] w-[13px] text-ew-success" /> Ne ocupăm de acte
          </span>
          <span className={PILL}>
            <CheckIcon className="h-[13px] w-[13px] text-ew-success" /> Priză de pământ + buletin
          </span>
          <span className={PILL}>
            <CheckIcon className="h-[13px] w-[13px] text-ew-success" /> Garanție
          </span>
        </div>
      </div>
    </section>
  )
}
