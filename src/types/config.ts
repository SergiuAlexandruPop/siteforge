// ---------------------------------------------------------------------------
// Client Configuration — Every client folder has a config.ts exporting this.
// ---------------------------------------------------------------------------

export interface NavigationItem {
  /** Romanian label shown in nav */
  label: string
  /** Route path (e.g. '/about') */
  href: string
  /** English label — required when i18n is enabled */
  labelEn?: string
}

export interface ClientFeatures {
  /** English language support under /en/ prefix */
  i18n: boolean
  /** Blog section + CMS admin */
  blog: boolean
  /** Dark / light mode toggle */
  darkMode: boolean
  /** Contact form + Resend integration */
  contactForm: boolean
  /** Smartsupp live chat widget */
  smartsupp: boolean
  /** Supabase database (per-client, optional) */
  supabase: boolean
}

export interface ClientSEO {
  siteName: string
  siteDescription: string
  /** Path to OG image relative to client's public/ folder */
  ogImage: string
}

export interface ClientContact {
  email: string
  phone: string
  address?: string
}

export interface ClientBlogSettings {
  postsPerPage: number
  showReadingTime: boolean
  showAuthor: boolean
  authorName: string
  /** Path to author avatar relative to client's public/ folder */
  authorAvatar: string
}

export interface ClientConfig {
  /** Folder name in clients/ — no spaces, lowercase, kebab-case */
  name: string
  /** Human-readable name shown in UI */
  displayName: string
  /** Production domain (e.g. 'alexdev.ro') */
  domain: string
  /** Default language for content */
  defaultLanguage: 'ro' | 'en'
  /** Feature flags controlling which modules are active */
  features: ClientFeatures
  /** SEO metadata */
  seo: ClientSEO
  /** Contact information */
  contact: ClientContact
  /** Navigation items — renders in header and mobile menu */
  navigation: NavigationItem[]
  /** Blog configuration — only used when features.blog is true */
  blog?: ClientBlogSettings
}

// ---------------------------------------------------------------------------
// Client Theme — Every client folder has a theme.ts exporting this.
// ---------------------------------------------------------------------------

export interface ThemeColors {
  primary: string
  primaryForeground: string
  secondary: string
  background: string
  foreground: string
  muted: string
  mutedForeground: string
  border: string
  /** Dark mode overrides */
  dark: {
    background: string
    foreground: string
    muted: string
    mutedForeground: string
    border: string
  }
}

export interface ThemeFonts {
  /** Google Font name for headings */
  heading: string
  /** Google Font name for body text */
  body: string
  /** Font for blog post content (serif recommended) */
  blog: string
}

export interface ClientTheme {
  colors: ThemeColors
  fonts: ThemeFonts
  /** CSS border-radius value (e.g. '0.5rem') */
  borderRadius: string
}
