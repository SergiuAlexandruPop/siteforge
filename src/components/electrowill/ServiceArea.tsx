import { CallButton } from './CallButton'
import { MapPinIcon } from './icons'
import { SERVICE_AREA_LOCALITIES } from './content/service-area'

// ---------------------------------------------------------------------------
// ServiceArea — "Zona acoperită" card (DESIGN.md §4.8, §5.7).
// ---------------------------------------------------------------------------
// White card beside the accordion (desktop) / stacked (mobile). Map is a hatch
// placeholder with a centered caption until a real map lands.
// ⚠️ Service-area framing only — present full county coverage; never reference
// subcontracting or the Bistrița/Năsăud-city carve-out. No public address.
// ---------------------------------------------------------------------------

export function ServiceArea() {
  return (
    <div className="rounded-[20px] border border-border bg-white px-[30px] pb-8 pt-[30px]">
      <div className="mb-3 inline-flex items-center gap-2 font-body text-[13px] font-extrabold uppercase tracking-[1px] text-primary">
        <MapPinIcon className="h-4 w-4" /> Zona acoperită
      </div>
      <h3 className="m-0 mb-2 font-display text-[22px] font-extrabold text-foreground lg:text-[24px]">
        Județul Bistrița-Năsăud
      </h3>
      <p className="m-0 mb-[18px] font-body text-[16px] leading-[1.5] text-muted-foreground">
        Acoperim tot județul Bistrița-Năsăud — orașe și comune deopotrivă. Nu ești sigur dacă ajungem
        la tine? Sună-ne și îți spunem pe loc.
      </p>

      <div className="mb-[18px] flex flex-wrap gap-2">
        {SERVICE_AREA_LOCALITIES.map((loc) => (
          <span
            key={loc}
            className="rounded-full border border-border bg-muted px-3 py-1.5 font-body text-[13px] font-bold text-ew-badge-ink"
          >
            {loc}
          </span>
        ))}
        <span className="rounded-full px-3 py-1.5 font-body text-[13px] font-semibold text-muted-foreground">
          …și toate comunele din jur
        </span>
      </div>

      <div className="ew-hatch-sm mb-[18px] flex h-[200px] items-center justify-center rounded-[14px] border border-border">
        <span className="rounded-[9px] border border-border bg-white px-3 py-[7px] font-body text-[13px] font-bold text-muted-foreground">
          Hartă · județul BN
        </span>
      </div>

      <CallButton className="h-[54px] w-full text-[17px]">Întreabă-ne de zona ta</CallButton>
    </div>
  )
}
