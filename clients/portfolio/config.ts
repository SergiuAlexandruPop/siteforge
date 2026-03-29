import type { ClientConfig } from '../../src/types/config'

const config: ClientConfig = {
  name: 'portfolio',
  displayName: 'Sergiu Pop',
  domain: 'localhost',
  defaultLanguage: 'en',

  features: {
    i18n: true,
    blog: true,
    darkMode: true,
    contactForm: true,
    smartsupp: false,
    supabase: false,
  },

  seo: {
    siteName: 'Sergiu Pop — Software Developer',
    siteDescription: 'Portfolio și blog despre tech, sănătate și dezvoltare profesională.',
    ogImage: '/og-image.jpg',
  },

  contact: {
    email: 'sergiualexandrupop@gmail.com',
    phone: '',
    socials: {
      linkedin: 'https://www.linkedin.com/in/sergiualexandrupop/',
      github: 'https://github.com/SergiuAlexandruPop',
    },
  },

  navigation: [
    { label: 'Acasă', href: '/', labelEn: 'Home' },
    { label: 'Despre', href: '/about', labelEn: 'About' },
    { label: 'Proiecte', href: '/projects', labelEn: 'Projects' },
    { label: 'Blog', href: '/blog', labelEn: 'Blog' },
    { label: 'CV', href: '/resume', labelEn: 'Resume' },
    { label: 'Contact', href: '/contact', labelEn: 'Contact' },
  ],

  blog: {
    postsPerPage: 10,
    showReadingTime: true,
    showAuthor: true,
    authorName: 'Sergiu',
    authorAvatar: '/avatar.jpg',
  },
}

export default config
