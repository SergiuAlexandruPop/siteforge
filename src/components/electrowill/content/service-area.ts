// ---------------------------------------------------------------------------
// ElectroWill — service-area content (single source of truth). Phase D.
// ---------------------------------------------------------------------------
// Reused by the "Zona acoperită" card (visible chips) and by `areaServed` in
// the Electrician JSON-LD. Service-area framing ONLY: present full-county
// coverage; never expose the partner carve-out (Bistrița/Năsăud cities + Cluj
// overflow) and never publish a street address.
// ---------------------------------------------------------------------------

/** The administrative area we market across. */
export const SERVICE_AREA_COUNTY = 'Județul Bistrița-Năsăud'

/**
 * Localities listed publicly. Whole-county coverage — the cities are listed too
 * so coverage reads as complete; the subcontracting arrangement stays invisible.
 */
export const SERVICE_AREA_LOCALITIES: string[] = [
  'Beclean',
  'Bistrița',
  'Năsăud',
  'Sângeorz-Băi',
  'Rodna',
  'Maieru',
  'Telciu',
  'Nimigea',
  'Prundu Bârgăului',
  'Livezile',
  'Feldru',
  'Rebrișoara',
]
