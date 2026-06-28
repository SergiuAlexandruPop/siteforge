import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        editorial: ['var(--font-editorial)', 'Georgia', 'serif'],
        // Per-client display/body families resolve from --font-heading/--font-body
        // (set in app/layout.tsx from the active client's theme.ts fonts).
        // ElectroWill: heading = Bitter (serif), body = Mulish (sans).
        display: ['var(--font-heading)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        // ---------------------------------------------------------------------
        // ElectroWill section / brand colors (DESIGN.md §2, G7).
        // These do NOT fit shadcn's theme slots (theme-css.ts maps --secondary
        // → muted), so they're explicit literal tokens. Only ElectroWill
        // components reference them; harmless for other clients' bundles.
        // ---------------------------------------------------------------------
        whatsapp: {
          DEFAULT: '#0E8F49', // WhatsApp green — secondary action only
          foreground: '#FFFFFF',
        },
        ew: {
          field: '#DDE2D6', // field behind the mobile column ("card on a field")
          band: '#EFF3E9', // Servicii / Întrebări+Zona section bands
          'band-border': '#E0E6D6', // top/bottom border of those bands
          eyebrow: '#B8842E', // warm accent bar in section eyebrows
          'badge-ink': '#2C3A30', // trust-badge text on light pills
          dark: '#16241C', // "De ce noi" band + footer bg (light-mode dark surface)
          'dark-pill': '#22382C', // pills inside the dark band
          'dark-pill-border': '#355042',
          'dark-pill-text': '#EAF1E6',
          success: '#6FD39E', // check / accent icons on dark surfaces
          'footer-text': '#C7D3C5',
          'footer-body': '#9DB29B',
          'footer-muted': '#7E927C',
          'footer-divider': '#2A3F33',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        // The only two shadows allowed in the ElectroWill design (DESIGN.md §2).
        'ew-bar': '0 -10px 24px rgba(22,36,28,.08)', // mobile fixed bottom bar
        'ew-header': '0 2px 14px rgba(22,36,28,.05)', // desktop sticky header
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
}

export default config
