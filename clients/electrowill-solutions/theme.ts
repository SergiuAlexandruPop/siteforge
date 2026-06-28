import type { ClientTheme } from '../../src/types/config'

// ---------------------------------------------------------------------------
// ElectroWill Solutions — Theme (Direction C "Verde, sigur & local")
// ---------------------------------------------------------------------------
// Tokens extracted verbatim from the Claude Design references in `_design/`
// (`*.dc.html` mobile + desktop) and their handoff README. Identical tokens
// across breakpoints. See DESIGN.md for the full token reference, the radius
// scale, the dark-band/footer palette, and component patterns.
//
// darkMode is OFF for this client (light only). The `dark` block below is kept
// type-valid but UNUSED — it mirrors the light values on purpose. Do not wire a
// theme toggle. The site's only dark *surfaces* ("De ce noi" band + footer) are
// painted with explicit section colors in components, not via this dark block.
//
// NOTE on `secondary`: `src/lib/theme-css.ts` maps shadcn's `--secondary` to
// `colors.muted` (NOT to this field). The value here documents ElectroWill's
// secondary brand/action color — the WhatsApp green — which Phase B wires up as
// its own token (e.g. a `--whatsapp` CSS var / Tailwind color), separate from
// shadcn's `--secondary`.
// ---------------------------------------------------------------------------

const theme: ClientTheme = {
  colors: {
    primary: '#1C6B47', // brand green — buttons, links, icons, number chips
    primaryForeground: '#FFFFFF', // text/icons on primary
    secondary: '#0E8F49', // WhatsApp green (see NOTE above — not emitted as --secondary)
    background: '#F7F4EC', // warm off-white page background
    foreground: '#16241C', // near-black green ink (headings + body ink)
    muted: '#E8EEE6', // light green chip/badge fill; also shadcn --secondary/--muted/--accent
    mutedForeground: '#5C6B60', // sage-grey secondary text
    border: '#DCE2D6', // default hairline border (also shadcn --input)
    dark: {
      // UNUSED — darkMode OFF. Mirrors light values to stay type-valid + harmless.
      background: '#F7F4EC',
      foreground: '#16241C',
      muted: '#E8EEE6',
      mutedForeground: '#5C6B60',
      border: '#DCE2D6',
      primary: '#1C6B47',
      primaryForeground: '#FFFFFF',
    },
  },
  fonts: {
    heading: 'Bitter', // serif display — H1/H2/H3, wordmark, number chips (700/800)
    body: 'Mulish', // sans body/UI text (400–800)
    blog: 'Bitter', // UNUSED — blog feature is OFF for this client
  },
  // Base radius for shadcn primitives = 14px (the button/control radius).
  // Larger surfaces use explicit utilities per DESIGN.md radius scale:
  // cards 18–22px, gallery tiles 16px, icon chips 9–14px, pills 999px.
  borderRadius: '0.875rem',
}

export default theme
