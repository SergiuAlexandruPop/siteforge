import type { ClientConfig } from '../../src/types/config'

// ---------------------------------------------------------------------------
// ElectroWill Solutions — client config (Phase B).
// Light-mode-only, Romanian-only service-area business in Bistrița-Năsăud.
// Flags flipped per DESIGN.md / CLAUDE.md target: blog OFF, darkMode OFF.
// ---------------------------------------------------------------------------

const config: ClientConfig = {
  name: 'electrowill-solutions',
  displayName: 'ElectroWill Solutions',
  domain: 'electrowill.ro',
  defaultLanguage: 'ro',

  i18n: {
    supportedLanguages: ['ro'],
    defaultLanguage: 'ro',
  },

  theme: {
    defaultTheme: 'light',
  },

  features: {
    i18n: false,
    blog: false,
    darkMode: false,
    contactForm: true,
    smartsupp: false,
    supabase: false,
  },

  seo: {
    siteName: 'ElectroWill Solutions',
    // Keyword-first homepage <title> (only the homepage uses title.default);
    // subpages keep the '%s — ElectroWill Solutions' brand suffix.
    titleDefault: 'Branșamente electrice în Bistrița-Năsăud — Autorizați ANRE',
    siteDescription:
      'Branșamente electrice în Bistrița-Năsăud, în tot județul. Autorizați ANRE, răspundem în 12 ore, ne ocupăm de toate actele — la cheie.',
    ogImage: '/og-image.jpg',
  },

  contact: {
    // Canonical lead phone/email. UI formats (tel:, wa.me, display) are derived
    // in src/components/electrowill/contact.ts — keep them in sync with this.
    email: 'electrowillsolutions@gmail.com',
    phone: '+40 750 447 426',
  },

  // Desktop header anchor nav (smooth-scroll to homepage section ids).
  // Romanian only; no /blog, no /en, no /projects.
  navigation: [
    { label: 'Servicii', href: '#servicii' },
    { label: 'Cum funcționează', href: '#pasi' },
    { label: 'Lucrări', href: '#lucrari' },
    { label: 'Zona acoperită', href: '#zona' },
  ],
}

export default config
