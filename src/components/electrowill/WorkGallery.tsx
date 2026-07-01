import { PhotoFrame } from './PhotoFrame'
import { Lightbox } from './Lightbox'
import { GALLERY_ITEMS, GALLERY_PHOTOS_WITH_SRC } from './content/gallery'

// ---------------------------------------------------------------------------
// WorkGallery — "Lucrările noastre" photo grid (DESIGN.md §4.11, §5.6).
// ---------------------------------------------------------------------------
// Aspect ratio: LANDSCAPE 16:10 (G5 decision, Phase B) — matches the photo
// shoot brief (landscape 4:3/3:2 source) so no reshoot/recrop is needed. Grid:
// 2-col on mobile → 4-col on desktop.
//
// Content comes from `content/gallery.ts` (single source of truth, priză-de-
// pământ featured first). Tiles with a real `src` render a lazy <img> and are
// tappable (open the Lightbox); tiles without one show the hatch placeholder and
// stay inert — so this ships now and lights up when the photos land (Phase E).
// The stays-server-rendered grid + delegated Lightbox island mirror TapTracker.
// ---------------------------------------------------------------------------

export function WorkGallery() {
  // Index into GALLERY_PHOTOS_WITH_SRC (what the Lightbox pages through).
  let srcIndex = -1

  return (
    <section id="lucrari" className="mx-auto max-w-[1280px] scroll-mt-[90px] px-[18px] py-7 lg:px-10 lg:py-[72px]">
      <div className="mb-2 inline-flex items-center gap-2 font-body text-[13px] font-extrabold uppercase tracking-[1px] text-primary">
        <span className="h-[3px] w-5 rounded-sm bg-ew-eyebrow" /> Din teren
      </div>
      <h2 className="m-0 mb-9 font-display text-[25px] font-extrabold tracking-[-0.5px] text-foreground lg:text-[40px]">
        Lucrările noastre
      </h2>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
        {GALLERY_ITEMS.map((photo) => {
          const hasImage = typeof photo.src === 'string' && photo.src.length > 0
          if (hasImage) srcIndex++

          const frame = (
            <PhotoFrame
              caption={photo.caption}
              src={photo.src}
              alt={photo.alt}
              hatch="sm"
              className="aspect-[16/10] rounded-[16px] p-3"
              captionClassName="text-[12px] rounded-[8px] px-[10px] py-[6px]"
            />
          )

          if (!hasImage) return <div key={photo.id}>{frame}</div>

          return (
            <button
              key={photo.id}
              type="button"
              data-lightbox-index={srcIndex}
              aria-label={`Mărește fotografia: ${photo.caption}`}
              className="block w-full cursor-zoom-in rounded-[16px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {frame}
            </button>
          )
        })}
      </div>

      <Lightbox photos={GALLERY_PHOTOS_WITH_SRC} />
    </section>
  )
}
