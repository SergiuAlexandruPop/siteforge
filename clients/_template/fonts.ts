import { Inter, Newsreader } from 'next/font/google'
import type { ClientFonts } from '@/types/config'

// ---------------------------------------------------------------------------
// _template — fonts (scaffold default for new clients)
// ---------------------------------------------------------------------------
// Matches the template theme (heading/body = Inter, blog = Georgia). Newsreader
// is wired as the editorial family. Copy this file when creating a new client
// and swap the Google Fonts to match the client's theme.ts. `latin-ext` keeps
// Romanian diacritics correct by default. Self-hosted via next/font.
// ---------------------------------------------------------------------------

const heading = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-heading',
  display: 'swap',
})

const body = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-body',
  display: 'swap',
})

const editorial = Newsreader({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-editorial',
  display: 'swap',
})

export const fonts: ClientFonts = {
  className: `${heading.variable} ${body.variable} ${editorial.variable}`,
}
