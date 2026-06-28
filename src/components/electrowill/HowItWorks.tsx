import { PhoneIcon, FileSignatureIcon, PlugZapIcon } from './icons'

// ---------------------------------------------------------------------------
// HowItWorks — 3 step cards (DESIGN.md §4.6, §5.4). Reinforces "noi facem
// actele". Centered heading; cards in a row on desktop, stacked on mobile.
// ---------------------------------------------------------------------------

interface Step {
  n: string
  icon: React.ReactNode
  title: string
  body: string
}

const STEPS: Step[] = [
  {
    n: '1',
    icon: <PhoneIcon className="h-[22px] w-[22px] text-primary" />,
    title: 'Ne suni',
    body: 'Un telefon sau un mesaj pe WhatsApp. Îți răspundem în 12 ore.',
  },
  {
    n: '2',
    icon: <FileSignatureIcon className="h-[22px] w-[22px] text-primary" />,
    title: 'Ne ocupăm de acte',
    body: 'Toate hârtiile, avizele și relația cu primăria — la cheie.',
  },
  {
    n: '3',
    icon: <PlugZapIcon className="h-[22px] w-[22px] text-primary" />,
    title: 'Ai curent',
    body: 'Branșament gata, contor montat, priză de pământ + buletin. Cu garanție.',
  },
]

export function HowItWorks() {
  return (
    <section id="pasi" className="mx-auto max-w-[1280px] scroll-mt-[90px] px-[18px] py-7 lg:px-10 lg:py-[72px]">
      <h2 className="m-0 mb-[6px] text-center font-display text-[25px] font-extrabold tracking-[-0.5px] text-foreground lg:text-[40px]">
        Cum funcționează
      </h2>
      <p className="m-0 mb-9 text-center font-body text-[16px] text-muted-foreground lg:mb-11 lg:text-[18px]">
        Trei pași simpli. Restul facem noi.
      </p>

      <div className="grid grid-cols-1 gap-[14px] lg:grid-cols-3 lg:gap-[26px]">
        {STEPS.map((step) => (
          <div key={step.n} className="rounded-[20px] border border-border bg-white p-8 lg:px-[30px] lg:py-8">
            <div className="mb-4 flex items-center gap-[14px]">
              <span className="flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-primary font-display text-[24px] font-extrabold text-primary-foreground">
                {step.n}
              </span>
              {step.icon}
            </div>
            <h3 className="m-0 mb-2 font-display text-[19px] font-extrabold text-foreground lg:text-[22px]">
              {step.title}
            </h3>
            <p className="m-0 font-body text-[15px] leading-[1.5] text-muted-foreground lg:text-[16px]">
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
