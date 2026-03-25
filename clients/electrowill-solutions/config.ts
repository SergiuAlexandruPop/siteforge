import type { ClientConfig } from '../../src/types/config'

const config: ClientConfig = {
  name: 'electrowill-solutions',
  displayName: 'Electrowill Solutions',
  domain: 'localhost',
  defaultLanguage: 'ro',

  features: {
    i18n: true,
    blog: true,
    darkMode: true,
    contactForm: true,
    smartsupp: false,
    supabase: false,
  },

  seo: {
    siteName: 'Electrowill Solutions',
    siteDescription: 'Site-ul oficial Electrowill Solutions.',
    ogImage: '/og-image.jpg',
  },

  contact: {
    email: 'electrowillsolutions@gmail.com',
    phone: '+40 700 000 000',
  },

  navigation: [
    { label: 'Acasă', href: '/', labelEn: 'Home' },
    { label: 'Despre', href: '/about', labelEn: 'About' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],

  blog: {
    postsPerPage: 10,
    showReadingTime: true,
    showAuthor: true,
    authorName: 'Electrowill Solutions',
    authorAvatar: '/avatar.jpg',
  },
}

export default config
