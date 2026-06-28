import { Bitter, Mulish } from 'next/font/google'
import type { ClientFonts } from '@/types/config'

// ---------------------------------------------------------------------------
// ElectroWill Solutions — fonts (Phase B closeout)
// ---------------------------------------------------------------------------
// heading = Bitter (serif display, 700/800) · body = Mulish (sans, 400–800),
// per theme.ts + DESIGN.md. Loaded via next/font so they're self-hosted (no
// external request, no layout shift) and bundled ONLY for this client.
//
// `latin-ext` is REQUIRED — it carries the Romanian diacritics ă â î ș ț.
// The `variable` names map directly onto --font-heading / --font-body, which
// Tailwind's `font-display` / `font-body` families resolve from. No bare-string
// CSS var indirection (that was the Phase B bug — strings never matched a loaded
// family, so headings fell back to Georgia).
// ---------------------------------------------------------------------------

const heading = Bitter({
  subsets: ['latin', 'latin-ext'],
  weight: ['700', '800'],
  variable: '--font-heading',
  display: 'swap',
})

const body = Mulish({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
})

export const fonts: ClientFonts = {
  className: `${heading.variable} ${body.variable}`,
}
