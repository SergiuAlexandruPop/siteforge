import { PhotoFrame } from './PhotoFrame'
import { BoltIcon, FileTextIcon } from './icons'

// ---------------------------------------------------------------------------
// ServicesPair — the two EQUAL services (DESIGN.md §4.2, §5.3).
// Band section. Branșamente (zap) and Proiecte (file-text) get identical
// treatment — never bury Proiecte (higher-value commercial leads).
// ---------------------------------------------------------------------------

interface ServiceCard {
  icon: React.ReactNode
  title: string
  body: string
  photoCaption: string
}

const SERVICES: ServiceCard[] = [
  {
    icon: <BoltIcon className="h-[18px] w-[18px]" />,
    title: 'Branșamente electrice',
    body:
      'Îți aducem curentul în casă — de la cerere la contor funcțional. Priză de pământ + buletin, totul cu acte.',
    photoCaption: 'Foto lucrare · contor',
  },
  {
    icon: <FileTextIcon className="h-[18px] w-[18px]" />,
    title: 'Proiecte instalații electrice',
    body:
      'Pentru firme, instituții și persoane fizice. Proiectare completă și documentație conformă.',
    photoCaption: 'Foto lucrare · tablou & proiect',
  },
]

export function ServicesPair() {
  return (
    <section id="servicii" className="scroll-mt-[90px] border-y border-ew-band-border bg-ew-band">
      <div className="mx-auto max-w-[1280px] px-[18px] py-7 lg:px-10 lg:py-[72px]">
        <div className="mb-2 inline-flex items-center gap-2 font-body text-[13px] font-extrabold uppercase tracking-[1px] text-primary">
          <span className="h-[3px] w-5 rounded-sm bg-ew-eyebrow" /> Serviciile noastre
        </div>
        <h2 className="m-0 mb-[6px] font-display text-[25px] font-extrabold tracking-[-0.5px] text-foreground lg:text-[40px]">
          Două servicii, la cheie
        </h2>
        <p className="m-0 mb-9 font-body text-[16px] text-muted-foreground lg:text-[18px]">
          Ne ocupăm de toate actele — tu doar suni.
        </p>

        <div className="grid grid-cols-1 gap-[14px] lg:grid-cols-2 lg:gap-7">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="overflow-hidden rounded-[20px] border border-border bg-white"
            >
              <PhotoFrame
                caption={s.photoCaption}
                className="h-[150px] rounded-none border-0 p-[14px] lg:h-[240px]"
                captionClassName="text-[13px] rounded-[9px] px-3 py-[7px]"
              />
              <div className="px-7 pb-[30px] pt-[26px]">
                <div className="mb-[10px] flex items-center gap-[11px]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-muted text-primary">
                    {s.icon}
                  </span>
                  <span className="font-display text-[20px] font-extrabold text-foreground lg:text-[24px]">
                    {s.title}
                  </span>
                </div>
                <p className="m-0 font-body text-[15px] leading-[1.5] text-muted-foreground lg:text-[16.5px]">
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
