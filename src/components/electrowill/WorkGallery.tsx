import { PhotoFrame } from './PhotoFrame'

// ---------------------------------------------------------------------------
// WorkGallery — "Lucrările noastre" photo grid (DESIGN.md §4.11, §5.6).
// ---------------------------------------------------------------------------
// Aspect ratio: LANDSCAPE 16:10 (G5 decision, Phase B) — matches the photo
// shoot brief (landscape 4:3/3:2 source) so no reshoot/recrop is needed, instead
// of the mock's 4:5 portrait. Grid: 2-col on mobile → 4-col on desktop. Hatch
// placeholders until real photos land (Phase E); feature the priză-de-pământ shot.
// ---------------------------------------------------------------------------

const TILES = [
  'Foto lucrare · branșament',
  'Foto lucrare · contor',
  'Foto lucrare · priză de pământ',
  'Foto lucrare · tablou',
  'Foto lucrare · stâlp',
  'Foto lucrare · cablare',
  'Foto lucrare · firidă',
  'Foto lucrare · racord',
]

export function WorkGallery() {
  return (
    <section id="lucrari" className="mx-auto max-w-[1280px] scroll-mt-[90px] px-[18px] py-7 lg:px-10 lg:py-[72px]">
      <div className="mb-2 inline-flex items-center gap-2 font-body text-[13px] font-extrabold uppercase tracking-[1px] text-primary">
        <span className="h-[3px] w-5 rounded-sm bg-ew-eyebrow" /> Din teren
      </div>
      <h2 className="m-0 mb-9 font-display text-[25px] font-extrabold tracking-[-0.5px] text-foreground lg:text-[40px]">
        Lucrările noastre
      </h2>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
        {TILES.map((caption) => (
          <PhotoFrame
            key={caption}
            caption={caption}
            hatch="sm"
            className="aspect-[16/10] rounded-[16px] p-3"
            captionClassName="text-[12px] rounded-[8px] px-[10px] py-[6px]"
          />
        ))}
      </div>
    </section>
  )
}
