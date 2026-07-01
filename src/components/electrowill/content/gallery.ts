// ---------------------------------------------------------------------------
// ElectroWill — work-photo manifest (single source of truth). Phase E.
// ---------------------------------------------------------------------------
// Drives BOTH the "Lucrările noastre" grid (WorkGallery) and the Lightbox —
// one array, no drift. Order here is render order; the priză-de-pământ shot is
// featured first (safety = trust, per the shoot brief).
//
// `src` is the public path to an OPTIMIZED WebP produced by
// `scripts/optimize-photos.ts` (writes to public/lucrari/). It is intentionally
// LEFT UNDEFINED until the real photos land: PhotoFrame renders the hatch
// placeholder whenever `src` is absent, so the live gallery is unaffected. When
// you shoot, run the optimizer, then paste each output filename here as
// `src: '/lucrari/<name>.webp'`.
//
// `alt` is real alt text (accessibility + SEO); keep it plain Romanian and
// descriptive. `caption` is the small pill shown on the tile.
// ---------------------------------------------------------------------------

export interface GalleryPhoto {
  /** Stable key + Lightbox index anchor. */
  id: string
  /** Pill text on the tile (e.g. "Foto lucrare · branșament"). */
  caption: string
  /** Descriptive alt text (used once `src` is set). */
  alt: string
  /** Public path to the optimized WebP, e.g. '/lucrari/priza-de-pamant.webp'. Undefined → hatch placeholder. */
  src?: string
  /** Featured shot (priză de pământ) — rendered first. */
  featured?: boolean
}

export const GALLERY_ITEMS: GalleryPhoto[] = [
  {
    id: 'priza-de-pamant',
    caption: 'Foto lucrare · priză de pământ',
    alt: 'Priză de pământ montată corect — electrod și platbandă, înainte de acoperire.',
    featured: true,
    // src: '/lucrari/priza-de-pamant.webp',
  },
  {
    id: 'bransament',
    caption: 'Foto lucrare · branșament',
    alt: 'Branșament electric finalizat la o casă din Bistrița-Năsăud.',
  },
  {
    id: 'contor',
    caption: 'Foto lucrare · contor',
    alt: 'Contor electric montat curat în firidă.',
  },
  {
    id: 'tablou',
    caption: 'Foto lucrare · tablou',
    alt: 'Tablou electric finit, cu circuitele ordonate și etichetate.',
  },
  {
    id: 'stalp',
    caption: 'Foto lucrare · stâlp',
    alt: 'Stâlp de branșament cu coborârea cablului către firidă.',
  },
  {
    id: 'cablare',
    caption: 'Foto lucrare · cablare',
    alt: 'Cablare electrică executată ordonat.',
  },
  {
    id: 'firida',
    caption: 'Foto lucrare · firidă',
    alt: 'Firidă de branșament montată și echipată.',
  },
  {
    id: 'racord',
    caption: 'Foto lucrare · racord',
    alt: 'Racord electric ordonat la punctul de branșare.',
  },
]

/** Only photos that actually have an optimized file — what the Lightbox pages through. */
export const GALLERY_PHOTOS_WITH_SRC = GALLERY_ITEMS.filter(
  (p): p is GalleryPhoto & { src: string } => typeof p.src === 'string',
)
