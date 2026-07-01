// ---------------------------------------------------------------------------
// ElectroWill — service-area content (single source of truth). Phase D + M.
// ---------------------------------------------------------------------------
// Consumed by:
//  • ServiceArea card (homepage) — shows SERVICE_AREA_HIGHLIGHTS as chips + a
//    link to the full /zona-acoperita hub (62 chips would bloat the homepage).
//  • ElectroWillJsonLd `areaServed` — uses SERVICE_AREA_LOCALITIES (all 62 UAT).
//  • The /zona-acoperita markdown hub duplicates the grouped list in prose
//    (markdown can't import TS) — keep the two in sync when localities change.
//
// Service-area framing ONLY: present full-county coverage; never expose the
// partner carve-out (Bistrița/Năsăud cities + Cluj overflow), never a street
// address. Electricity DSO for the whole county = Distribuție Energie Electrică
// România (DEER), zona Transilvania Nord (NOT Delgaz — Delgaz is gas here).
// ---------------------------------------------------------------------------

/** The administrative area we market across. */
export const SERVICE_AREA_COUNTY = 'Județul Bistrița-Năsăud'

/** The 4 urban centres (municipiu + 3 orașe). */
export const SERVICE_AREA_ORASE: string[] = [
  'Bistrița',
  'Beclean',
  'Năsăud',
  'Sângeorz-Băi',
]

/**
 * All 58 comune of Bistrița-Năsăud (the 235 sate roll up under these).
 * Alphabetical; standard administrative spellings.
 */
export const SERVICE_AREA_COMUNE: string[] = [
  'Bistrița Bârgăului',
  'Braniștea',
  'Budacu de Jos',
  'Budești',
  'Căianu Mic',
  'Cetate',
  'Chiochiș',
  'Chiuza',
  'Ciceu-Giurgești',
  'Ciceu-Mihăiești',
  'Coșbuc',
  'Dumitra',
  'Dumitrița',
  'Feldru',
  'Galații Bistriței',
  'Ilva Mare',
  'Ilva Mică',
  'Josenii Bârgăului',
  'Lechința',
  'Leșu',
  'Livezile',
  'Lunca Ilvei',
  'Măgura Ilvei',
  'Maieru',
  'Mărișelu',
  'Matei',
  'Miceștii de Câmpie',
  'Milaș',
  'Monor',
  'Negrilești',
  'Nimigea',
  'Nușeni',
  'Parva',
  'Petru Rareș',
  'Poiana Ilvei',
  'Prundu Bârgăului',
  'Rebra',
  'Rebrișoara',
  'Rodna',
  'Romuli',
  'Runcu Salvei',
  'Salva',
  'Sânmihaiu de Câmpie',
  'Silivașu de Câmpie',
  'Spermezeu',
  'Șanț',
  'Șieu',
  'Șieu-Măgheruș',
  'Șieu-Odorhei',
  'Șieuț',
  'Șintereag',
  'Târlișua',
  'Teaca',
  'Telciu',
  'Tiha Bârgăului',
  'Uriu',
  'Urmeniș',
  'Zagra',
]

/**
 * Every UAT in the county (4 urban + 58 comune = 62) — the authoritative set
 * for `areaServed`. We genuinely cover them all (whole-county framing).
 */
export const SERVICE_AREA_LOCALITIES: string[] = [
  ...SERVICE_AREA_ORASE,
  ...SERVICE_AREA_COMUNE,
]

/**
 * Localities shown as chips on the homepage ServiceArea card. A representative
 * dozen (biggest + spread across zones); the full list lives on /zona-acoperita.
 */
export const SERVICE_AREA_HIGHLIGHTS: string[] = [
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
