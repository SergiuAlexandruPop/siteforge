import type { ClientConfig } from '../../src/types/config'

// ---------------------------------------------------------------------------
// Client Configuration Template
// ---------------------------------------------------------------------------
// Copy this folder to clients/{your-client-name}/ and update all values.
// Every field is documented below. Do not leave template defaults.
// ---------------------------------------------------------------------------

const config: ClientConfig = {
  // Folder name — must match the directory name in clients/
  name: '_template',

  // Human-readable name shown in the site header, footer, and meta tags
  displayName: 'Client Name',

  // Production domain without protocol (e.g. 'example.ro')
  domain: 'localhost',

  // Default language: 'ro' for Romanian (pages in content/pages/)
  //                   'en' for English (pages in content/pages-en/)
  defaultLanguage: 'ro',

  // Feature flags — set each to true/false based on client needs
  features: {
    i18n: false,          // English language support under /en/
    blog: false,          // Blog section + CMS admin panel
    darkMode: false,      // Dark/light theme toggle
    contactForm: false,   // Contact form + Resend email
    smartsupp: false,     // Smartsupp live chat widget
    supabase: false,      // Supabase database features
  },

  // SEO metadata — critical for Google ranking
  seo: {
    siteName: 'Client Name — Business Description',
    siteDescription: 'A brief description of the business for search engines.',
    ogImage: '/og-image.jpg',   // 1200x630px image in client's public/ folder
  },

  // Contact information — shown in footer and contact page
  contact: {
    email: 'contact@example.ro',
    phone: '+40 700 000 000',
    // address: 'Str. Exemplu Nr. 1, Cluj-Napoca',  // Uncomment if needed
  },

  // Navigation items — shown in header and mobile menu
  // labelEn is required when features.i18n is true
  navigation: [
    { label: 'Acasă', href: '/', labelEn: 'Home' },
    { label: 'Despre', href: '/about', labelEn: 'About' },
    { label: 'Contact', href: '/contact' },
  ],

  // Blog settings — only used when features.blog is true
  // blog: {
  //   postsPerPage: 10,
  //   showReadingTime: true,
  //   showAuthor: true,
  //   authorName: 'Author Name',
  //   authorAvatar: '/avatar.jpg',
  // },
}

export default config
