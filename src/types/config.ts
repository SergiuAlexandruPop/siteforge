// ---------------------------------------------------------------------------
// Client Configuration — Every client folder has a config.ts exporting this.
// ---------------------------------------------------------------------------

/** Language code (e.g. 'ro', 'en', 'de'). Widened from 'ro' | 'en' union. */
export type Language = string

export interface NavigationItem {
  /** Default-language label shown in nav */
  label: string
  /** Route path (e.g. '/about') */
  href: string
  /** English label — used when current language is 'en' and i18n is enabled */
  labelEn?: string
}

/** Per-client i18n configuration. Required when features.i18n is true. */
export interface ClientI18nConfig {
  /** All supported language codes, e.g. ['ro', 'en'] or ['en'] */
  supportedLanguages: Language[]
  /** Default language — must be in supportedLanguages. Served at root (no prefix). */
  defaultLanguage: Language
}

/** Per-client theme configuration. Required when features.darkMode is true. */
export interface ClientThemeConfig {
  /** Default theme when user has no stored preference */
  defaultTheme: 'light' | 'dark'
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
  socials?: {
    linkedin?: string
    github?: string
    twitter?: string
  }
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
  /** Default language for content (widened from 'ro' | 'en'). Kept for back-compat; prefer i18n.defaultLanguage. */
  defaultLanguage: Language
  /** I18n configuration — required when features.i18n is true */
  i18n?: ClientI18nConfig
  /** Theme configuration — required when features.darkMode is true */
  theme?: ClientThemeConfig
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
    /** Dark mode primary — optional, uses light primary if omitted */
    primary?: string
    /** Dark mode primary foreground — optional, uses light primaryForeground if omitted */
    primaryForeground?: string
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

// ---------------------------------------------------------------------------
// Client Manifest — the single entry point per client.
// ---------------------------------------------------------------------------
// Each clients/<name>/index.ts exports one `manifest: ClientManifest`. At build
// time, scripts/gen-active-client.ts resolves ACTIVE_CLIENT to exactly one of
// these and re-exports it as `activeClient`. This is what makes the bundle
// single-client: no other client's code is ever imported into the graph.
//
// `layout`, `homepage`, and `pages` are optional — omit them to fall through to
// the shared defaults (LayoutShell / DefaultHomePage / markdown renderer).
// ---------------------------------------------------------------------------

import type { ComponentType, ReactElement, ReactNode } from 'react'

/** Wraps the whole page (header + children + footer). */
export type ClientLayoutComponent = ComponentType<{
  config: ClientConfig
  children: ReactNode
}>

/** Full-page composition rendered at the client's home route. */
export type ClientHomePageComponent = ComponentType<{ language?: Language }>

/** Custom page for a given slug; falls back to the markdown renderer if absent. */
export type ClientPageComponent = ComponentType<{ language?: Language }>

/** Metadata for a single project-detail page, language-resolved. */
export interface ProjectDetailMetadata {
  title: string
  description: string
}

/**
 * Optional dynamic project-detail route capability. When present, the shared
 * /projects/[slug] (and /en/...) routes delegate entirely to it — they import
 * no client-specific data or components, so nothing leaks into other clients'
 * bundles. `Component` does its own data lookup and calls notFound() internally.
 */
export interface ProjectDetailCapability {
  /** Slugs to statically generate (drives generateStaticParams). */
  slugs: string[]
  /** Per-slug metadata for generateMetadata; null when the slug is unknown. */
  getMetadata: (slug: string, language: Language) => ProjectDetailMetadata | null
  /** Renders the detail page for a slug; handles its own lookup + notFound. */
  Component: ComponentType<{ slug: string; language: Language }>
}

// ---------------------------------------------------------------------------
// Client Fonts — optional per-client font bundle (clients/<name>/fonts.ts).
// ---------------------------------------------------------------------------
// Each client may load its own Google Fonts via next/font and expose the
// combined `.variable` classNames here. Applied to <body> in app/layout.tsx,
// these define --font-heading / --font-body (and optionally --font-editorial)
// with the real self-hosted font families that Tailwind's display/body/editorial
// families resolve from. Because only the active client's manifest is bundled,
// only that client's fonts are ever loaded — no cross-client interference.
export interface ClientFonts {
  /** Combined next/font `.variable` classNames to apply on <body>. */
  className: string
}

// ---------------------------------------------------------------------------
// Client Icon — optional per-client favicon / app-icon mark (clients/<name>/icon.tsx).
// ---------------------------------------------------------------------------
// The app/icon.tsx and app/apple-icon.tsx metadata routes render the ACTIVE
// client's mark via next/og ImageResponse, so each client ships its own browser
// tab + home-screen icon (only the active client's manifest is bundled — no
// cross-client bleed, same pattern as fonts). `mark` is a size-parametric SVG so
// the one definition serves both the 32px favicon and the 180px apple-icon.
export interface ClientIcon {
  /** The icon mark as an inline <svg>, sized to `px`. Rendered centered. */
  mark: (px: number) => ReactElement
  /** CSS `background` for the rounded apple-icon tile (e.g. a solid or gradient). */
  appleBackground: string
}

export interface ClientManifest {
  config: ClientConfig
  theme: ClientTheme
  /** Per-client fonts (next/font). Falls back to system fonts when omitted. */
  fonts?: ClientFonts
  /** Per-client favicon / app-icon mark. Falls back to a default mark when omitted. */
  icon?: ClientIcon
  /** Custom layout. Defaults to LayoutShell when omitted. */
  layout?: ClientLayoutComponent
  /** Custom homepage. Defaults to DefaultHomePage when omitted. */
  homepage?: ClientHomePageComponent
  /** Custom pages keyed by slug. Slugs without an entry use the markdown renderer. */
  pages?: Record<string, ClientPageComponent>
  /** Dynamic project-detail route capability. Omit for clients without projects. */
  projectDetail?: ProjectDetailCapability
}
