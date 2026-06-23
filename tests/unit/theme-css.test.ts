import { describe, it, expect } from 'vitest'
import { generateThemeCss } from '@/lib/theme-css'
import type { ClientTheme } from '@/types/config'

// ---------------------------------------------------------------------------
// theme-css.ts — hex → HSL conversion + CSS variable generation
// ---------------------------------------------------------------------------
// `hexToHsl` is module-private, so it is exercised through the public
// `generateThemeCss` API (test behaviour, not internals). Inputs are chosen
// so their HSL conversions are exact and easy to verify by hand:
//   #ffffff -> 0 0% 100%   #000000 -> 0 0% 0%     #808080 -> 0 0% 50%
//   #ff0000 -> 0 100% 50%  #00ff00 -> 120 100% 50% #0000ff -> 240 100% 50%
// ---------------------------------------------------------------------------

function makeTheme(overrides: Partial<ClientTheme['colors']> = {}): ClientTheme {
  return {
    colors: {
      primary: '#ff0000',          // 0 100% 50%
      primaryForeground: '#ffffff', // 0 0% 100%
      secondary: '#808080',         // not read by the generator
      background: '#ffffff',        // 0 0% 100%
      foreground: '#000000',        // 0 0% 0%
      muted: '#808080',             // 0 0% 50%
      mutedForeground: '#0000ff',   // 240 100% 50%
      border: '#00ff00',            // 120 100% 50%
      dark: {
        background: '#000000',
        foreground: '#ffffff',
        muted: '#1e293b',
        mutedForeground: '#94a3b8',
        border: '#334155',
        // no `primary` -> should fall back to the light primary
      },
      ...overrides,
    },
    fonts: { heading: 'Inter', body: 'Inter', blog: 'Georgia' },
    borderRadius: '0.5rem',
  }
}

/** Return only the `.dark { ... }` portion of the generated CSS. */
function darkBlock(css: string): string {
  return css.slice(css.indexOf('.dark'))
}

describe('generateThemeCss — structure', () => {
  it('emits a :root block and a .dark block', () => {
    const css = generateThemeCss(makeTheme())
    expect(css).toContain(':root {')
    expect(css).toContain('.dark {')
  })

  it('includes the border-radius from the theme', () => {
    const css = generateThemeCss(makeTheme())
    expect(css).toContain('--radius: 0.5rem;')
  })
})

describe('generateThemeCss — hex → HSL conversion', () => {
  it('converts white, black and a primary brand hex correctly', () => {
    const css = generateThemeCss(makeTheme())
    expect(css).toContain('--background: 0 0% 100%;') // #ffffff
    expect(css).toContain('--foreground: 0 0% 0%;')   // #000000
    expect(css).toContain('--primary: 0 100% 50%;')   // #ff0000
    expect(css).toContain('--primary-foreground: 0 0% 100%;')
  })

  it('converts a mid grey to an achromatic HSL triple', () => {
    const css = generateThemeCss(makeTheme())
    expect(css).toContain('--muted: 0 0% 50%;') // #808080
  })

  it('converts saturated green and blue to the right hue', () => {
    const css = generateThemeCss(makeTheme())
    expect(css).toContain('--border: 120 100% 50%;')          // #00ff00
    expect(css).toContain('--muted-foreground: 240 100% 50%;') // #0000ff
  })
})

describe('generateThemeCss — variable mapping', () => {
  it('maps --secondary and --accent to the muted colour', () => {
    const css = generateThemeCss(makeTheme())
    // Generator deliberately derives secondary/accent from `muted` (#808080).
    expect(css).toContain('--secondary: 0 0% 50%;')
    expect(css).toContain('--accent: 0 0% 50%;')
  })

  it('maps --ring to the primary colour', () => {
    const css = generateThemeCss(makeTheme())
    expect(css).toContain('--ring: 0 100% 50%;')
  })
})

describe('generateThemeCss — dark mode', () => {
  it('uses the dark background/foreground in the .dark block', () => {
    const dark = darkBlock(generateThemeCss(makeTheme()))
    expect(dark).toContain('--background: 0 0% 0%;')   // dark #000000
    expect(dark).toContain('--foreground: 0 0% 100%;') // dark #ffffff
  })

  it('falls back to the light primary when dark.primary is omitted', () => {
    const dark = darkBlock(generateThemeCss(makeTheme()))
    expect(dark).toContain('--primary: 0 100% 50%;') // inherited #ff0000
  })

  it('uses an explicit dark.primary override when provided', () => {
    const theme = makeTheme()
    theme.colors.dark.primary = '#00ff00' // 120 100% 50%
    const dark = darkBlock(generateThemeCss(theme))
    expect(dark).toContain('--primary: 120 100% 50%;')
  })
})

describe('generateThemeCss — known limitation (review §2 P1)', () => {
  // Documents current behaviour: a malformed hex produces `NaN` in the CSS
  // rather than throwing. The contract test (clients.contract.test.ts) is what
  // guarantees real client themes never hit this. If input validation is added
  // to hexToHsl later, update this test to assert the new behaviour.
  it('does not throw on a malformed hex, but emits NaN', () => {
    const theme = makeTheme({ primary: 'not-a-hex' })
    let css = ''
    expect(() => {
      css = generateThemeCss(theme)
    }).not.toThrow()
    expect(css).toContain('NaN')
  })
})
