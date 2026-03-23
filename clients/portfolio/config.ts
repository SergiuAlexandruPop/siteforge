import type { ClientConfig } from '../../src/types/config'

const config: ClientConfig = {
  name: 'portfolio',
  displayName: 'Alex Dev',
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
    siteName: 'Alex Dev — Full-Stack Developer',
    siteDescription: 'Portfolio and blog about tech, AI, health, and professional growth.',
    ogImage: '/og-image.jpg',
  },

  contact: {
    email: 'hello@alexdev.ro',
    phone: '+40 700 000 000',
  },

  navigation: [
    { label: 'Acasă', href: '/', labelEn: 'Home' },
    { label: 'Despre', href: '/about', labelEn: 'About' },
    { label: 'Proiecte', href: '/projects', labelEn: 'Projects' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],

  blog: {
    postsPerPage: 10,
    showReadingTime: true,
    showAuthor: true,
    authorName: 'Alex',
    authorAvatar: '/avatar.jpg',
  },
}

export default config
