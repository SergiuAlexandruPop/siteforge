// ---------------------------------------------------------------------------
// Romanian phone helpers — pure, dependency-free, safe on server AND client.
// ---------------------------------------------------------------------------
// Shared by the lead-capture card, the abandoned-number rescue hook, and the
// phone-first /api/lead route, so the definition of a "complete" number is
// identical everywhere. No PII handling, no I/O — just normalization.
//
// "Complete" = a Romanian national number of 10 digits (0XXXXXXXXX) whose
// second digit is 2/3 (landline) or 7 (mobile). Accepts the common input
// shapes: 07xx xxx xxx · +407… · 0040 7… · 40 7… with spaces, dots or dashes.
// ---------------------------------------------------------------------------

/** Keep only digits and a possible leading '+'. */
function stripFormatting(value: string): string {
  return value.replace(/[^\d+]/g, '')
}

/**
 * Normalize a raw RO phone string to national 10-digit form (0XXXXXXXXX),
 * or `null` if it cannot be read as a complete Romanian number.
 */
export function normalizeRoPhone(raw: string): string | null {
  const cleaned = stripFormatting(raw)

  let national = cleaned
  if (national.startsWith('+40')) {
    national = '0' + national.slice(3)
  } else if (national.startsWith('0040')) {
    national = '0' + national.slice(4)
  } else if (national.startsWith('40') && national.length === 11) {
    national = '0' + national.slice(2)
  }

  // 10 digits, leading 0, then 2/3 (landline) or 7 (mobile), then 8 digits.
  if (!/^0[237]\d{8}$/.test(national)) {
    return null
  }
  return national
}

/** True when `raw` parses to a complete RO national number. */
export function isCompleteRoPhone(raw: string): boolean {
  return normalizeRoPhone(raw) !== null
}
