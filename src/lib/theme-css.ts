import type { ClientTheme } from '@/types/config'

// ---------------------------------------------------------------------------
// Theme → CSS Variables
// ---------------------------------------------------------------------------
// Converts a client's theme.ts hex colors into the HSL CSS variables that
// shadcn/ui and our components use. This runs at build time in the layout.
// ---------------------------------------------------------------------------

/**
 * Convert a hex color (#rrggbb) to HSL components string "h s% l%"
 * (no commas, no hsl() wrapper — matches shadcn's CSS variable format)
 */
function hexToHsl(hex: string): string {
  // Remove # prefix
  const h = hex.replace('#', '')

  const r = parseInt(h.substring(0, 2), 16) / 255
  const g = parseInt(h.substring(2, 4), 16) / 255
  const b = parseInt(h.substring(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2

  if (max === min) {
    // Achromatic (gray)
    return `0 0% ${Math.round(l * 100)}%`
  }

  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

  let hue = 0
  if (max === r) {
    hue = ((g - b) / d + (g < b ? 6 : 0)) / 6
  } else if (max === g) {
    hue = ((b - r) / d + 2) / 6
  } else {
    hue = ((r - g) / d + 4) / 6
  }

  return `${Math.round(hue * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

/**
 * Generate a CSS string with :root and .dark CSS variable overrides
 * from a client's theme configuration.
 */
export function generateThemeCss(theme: ClientTheme): string {
  const { colors } = theme

  // Light mode variables
  const lightVars = [
    `--background: ${hexToHsl(colors.background)};`,
    `--foreground: ${hexToHsl(colors.foreground)};`,
    `--card: ${hexToHsl(colors.background)};`,
    `--card-foreground: ${hexToHsl(colors.foreground)};`,
    `--popover: ${hexToHsl(colors.background)};`,
    `--popover-foreground: ${hexToHsl(colors.foreground)};`,
    `--primary: ${hexToHsl(colors.primary)};`,
    `--primary-foreground: ${hexToHsl(colors.primaryForeground)};`,
    `--secondary: ${hexToHsl(colors.muted)};`,
    `--secondary-foreground: ${hexToHsl(colors.foreground)};`,
    `--muted: ${hexToHsl(colors.muted)};`,
    `--muted-foreground: ${hexToHsl(colors.mutedForeground)};`,
    `--accent: ${hexToHsl(colors.muted)};`,
    `--accent-foreground: ${hexToHsl(colors.foreground)};`,
    `--border: ${hexToHsl(colors.border)};`,
    `--input: ${hexToHsl(colors.border)};`,
    `--ring: ${hexToHsl(colors.primary)};`,
    `--radius: ${theme.borderRadius};`,
  ]

  // Dark mode variables
  const darkVars = [
    `--background: ${hexToHsl(colors.dark.background)};`,
    `--foreground: ${hexToHsl(colors.dark.foreground)};`,
    `--card: ${hexToHsl(colors.dark.background)};`,
    `--card-foreground: ${hexToHsl(colors.dark.foreground)};`,
    `--popover: ${hexToHsl(colors.dark.background)};`,
    `--popover-foreground: ${hexToHsl(colors.dark.foreground)};`,
    `--primary: ${hexToHsl(colors.primary)};`,
    `--primary-foreground: ${hexToHsl(colors.primaryForeground)};`,
    `--secondary: ${hexToHsl(colors.dark.muted)};`,
    `--secondary-foreground: ${hexToHsl(colors.dark.foreground)};`,
    `--muted: ${hexToHsl(colors.dark.muted)};`,
    `--muted-foreground: ${hexToHsl(colors.dark.mutedForeground)};`,
    `--accent: ${hexToHsl(colors.dark.muted)};`,
    `--accent-foreground: ${hexToHsl(colors.dark.foreground)};`,
    `--border: ${hexToHsl(colors.dark.border)};`,
    `--input: ${hexToHsl(colors.dark.border)};`,
    `--ring: ${hexToHsl(colors.primary)};`,
  ]

  return `:root { ${lightVars.join(' ')} } .dark { ${darkVars.join(' ')} }`
}
