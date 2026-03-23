import type { ClientTheme } from '../../src/types/config'

// ---------------------------------------------------------------------------
// Client Theme Template
// ---------------------------------------------------------------------------
// Update colors to match the client's brand. Use https://coolors.co to
// generate a palette from their primary brand color.
// Fonts: pick from https://fonts.google.com
// ---------------------------------------------------------------------------

const theme: ClientTheme = {
  colors: {
    primary: '#2563eb',
    primaryForeground: '#ffffff',
    secondary: '#64748b',
    background: '#ffffff',
    foreground: '#0f172a',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    border: '#e2e8f0',
    dark: {
      background: '#0f172a',
      foreground: '#f8fafc',
      muted: '#1e293b',
      mutedForeground: '#94a3b8',
      border: '#334155',
    },
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
    blog: 'Georgia',
  },
  borderRadius: '0.5rem',
}

export default theme
