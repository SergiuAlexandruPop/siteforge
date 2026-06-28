// ---------------------------------------------------------------------------
// ElectroWill — legal identifiers (single source of truth). Phase F.
// ---------------------------------------------------------------------------
// From the certificat de înregistrare (ONRC, Tribunalul Bistrița-Năsăud).
// Consumed by ElectroWillFooter (visible identifiers) and ElectroWillJsonLd
// (legalName / taxID / identifier). The markdown legal pages duplicate the
// human-readable values — unavoidable, since markdown can't import TS.
//
// ⚠️ Service-area framing: `sediuSocial` is intentionally NOT here — the public
// footer must never show a street address. The registered address appears only
// in the /termeni and /confidentialitate pages (controller identification).
// ---------------------------------------------------------------------------

interface LegalIdentifiers {
  legalName: string
  cui: string
  regCom: string
  euid: string
  caen: string
  /**
   * Atestat ANRE number — NOT on the certificat de înregistrare. Insert the real
   * value before launch (Phase G); while empty, the footer omits the line rather
   * than showing a placeholder, and the "Autorizați ANRE" claim stands alone.
   */
  anreAtestat: string
}

export const LEGAL: LegalIdentifiers = {
  legalName: 'ELECTROWILL SOLUTIONS S.R.L.',
  cui: '50544190',
  regCom: 'J2024022229009',
  euid: 'ROONRC.J2024022229009',
  caen: '4321 — Lucrări de instalații electrice',
  anreAtestat: '',
}
