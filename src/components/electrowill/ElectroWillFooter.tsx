import { BoltIcon, PhoneIcon, WhatsAppIcon, MapPinIcon } from './icons'
import { PHONE_TEL, PHONE_DISPLAY, WHATSAPP_URL } from './contact'
import { LEGAL } from './content/legal'

// ---------------------------------------------------------------------------
// ElectroWillFooter — dark footer (DESIGN.md §4.10).
// ---------------------------------------------------------------------------
// A light-mode dark *surface* (ew-dark = #16241C), NOT dark mode. Desktop:
// 3-col grid (1.4fr 1fr 1fr) — wordmark+blurb · Servicii · Contact. Mobile:
// stacked. Bottom strip: divider + copyright + "Autorizați ANRE".
//
// Service-area framing only — NO public street address (sediu social lives only
// in /termeni + /confidentialitate). Legal identifiers come from ./content/legal.ts;
// the atestat ANRE line is omitted until the number is supplied (Phase G).
// ---------------------------------------------------------------------------

export function ElectroWillFooter() {
  return (
    <footer className="bg-ew-dark text-ew-footer-text">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-[18px] py-12 md:grid-cols-[1.4fr_1fr_1fr] md:px-10">
        {/* Wordmark + blurb */}
        <div>
          <div className="mb-[14px] flex items-center gap-[11px]">
            <span className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-primary text-primary-foreground">
              <BoltIcon className="h-[17px] w-[17px]" />
            </span>
            <span className="font-display text-[19px] font-extrabold text-white">
              ElectroWill Solutions
            </span>
          </div>
          <p className="m-0 max-w-[340px] font-body text-[15px] leading-[1.55] text-ew-footer-body">
            Electrician autorizat ANRE în județul Bistrița-Năsăud. Branșamente și proiecte
            instalații electrice — la cheie.
          </p>
        </div>

        {/* Servicii */}
        <div>
          <div className="mb-[14px] font-display text-[16px] font-bold text-white">Servicii</div>
          <div className="flex flex-col gap-[10px] font-body text-[15px] text-ew-footer-body">
            <span>Branșamente electrice</span>
            <span>Proiecte instalații electrice</span>
            <span>Priză de pământ + buletin</span>
            <span>Acte la cheie</span>
          </div>
        </div>

        {/* Contact */}
        <div>
          <div className="mb-[14px] font-display text-[16px] font-bold text-white">Contact</div>
          <div className="flex flex-col gap-3">
            <a
              href={PHONE_TEL}
              className="flex items-center gap-[10px] font-body text-[17px] font-extrabold text-white no-underline"
            >
              <PhoneIcon className="h-[18px] w-[18px] text-ew-success" /> {PHONE_DISPLAY}
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-[10px] font-body text-[16px] font-bold text-white no-underline"
            >
              <WhatsAppIcon className="h-[18px] w-[18px] text-ew-success" /> Scrie pe WhatsApp
            </a>
            <span className="flex items-center gap-[10px] font-body text-[15px] text-ew-footer-body">
              <MapPinIcon className="h-[18px] w-[18px] text-ew-success" /> Județul Bistrița-Năsăud
            </span>
          </div>
        </div>
      </div>

      {/* Bottom strip — legal identifiers + links (Phase F) */}
      <div className="border-t border-ew-footer-divider">
        <div className="mx-auto max-w-[1280px] px-[18px] py-5 font-body text-[13px] leading-[1.6] text-ew-footer-muted md:px-10">
          <p className="m-0 mb-2">
            {LEGAL.legalName} · CUI {LEGAL.cui} · Nr. Reg. Com. {LEGAL.regCom}
            {LEGAL.anreAtestat ? ` · Atestat ANRE ${LEGAL.anreAtestat}` : ''} · Autorizați ANRE
          </p>
          <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1">
            <a href="/confidentialitate" className="text-ew-footer-body no-underline hover:text-white hover:underline">
              Confidențialitate
            </a>
            <a href="/termeni" className="text-ew-footer-body no-underline hover:text-white hover:underline">
              Termeni
            </a>
            <a
              href="https://anpc.ro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ew-footer-body no-underline hover:text-white hover:underline"
            >
              ANPC
            </a>
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ew-footer-body no-underline hover:text-white hover:underline"
            >
              SOL
            </a>
          </div>
          <p className="m-0">© 2026 ElectroWill Solutions. Toate drepturile rezervate.</p>
        </div>
      </div>
    </footer>
  )
}
