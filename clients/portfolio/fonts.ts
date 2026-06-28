import { Inter, Newsreader } from 'next/font/google'
import type { ClientFonts } from '@/types/config'

// ---------------------------------------------------------------------------
// Portfolio — fonts
// ---------------------------------------------------------------------------
// heading = Inter · body = Inter (per theme.ts); blog = Georgia (system serif,
// no load needed). Newsreader is kept as the editorial family (--font-editorial,
// used by the Tailwind `editorial` family) to preserve prior behaviour.
// Self-hosted via next/font and bundled ONLY for this client.
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
