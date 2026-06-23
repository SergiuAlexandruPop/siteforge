import type { Language } from '@/types/config'
import { getClientConfig } from './client-config'

// ---------------------------------------------------------------------------
// I18n helpers — single source of truth for language routing/content logic.
// ---------------------------------------------------------------------------
// Convention: default language is served at root (no prefix / no folder
// suffix). Every other language uses `/<lang>` URL prefix and `-<lang>`
// content folder suffix (e.g. pages-en, blog-en).
// ---------------------------------------------------------------------------

export function isI18nEnabled(): boolean {
  const config = getClientConfig()
  return Boolean(config.features.i18n)
}

export function getSupportedLanguages(): Language[] {
  const config = getClientConfig()
  if (config.i18n?.supportedLanguages?.length) {
    return config.i18n.supportedLanguages
  }
  // Fallback: single-language client = just defaultLanguage
  return [config.defaultLanguage]
}

export function getDefaultLanguage(): Language {
  const config = getClientConfig()
  return config.i18n?.defaultLanguage ?? config.defaultLanguage
}

export function isLanguageSupported(lang: Language): boolean {
  return getSupportedLanguages().includes(lang)
}

/** '' for default language, '/<lang>' for everything else. */
export function getLanguagePrefix(lang: Language): string {
  return lang === getDefaultLanguage() ? '' : `/${lang}`
}

/** '' for default language, '-<lang>' for everything else. */
export function contentFolderSuffix(lang: Language): string {
  return lang === getDefaultLanguage() ? '' : `-${lang}`
}

/**
 * Detect language from a pathname like '/en/about' or '/about'.
 * Returns the default language if no known prefix matches.
 */
export function detectLanguageFromPath(pathname: string): Language {
  const languages = getSupportedLanguages()
  const defaultLang = getDefaultLanguage()
  for (const lang of languages) {
    if (lang === defaultLang) continue
    if (pathname === `/${lang}` || pathname.startsWith(`/${lang}/`)) {
      return lang
    }
  }
  return defaultLang
}

/**
 * Build a localized href for a given target language.
 * - localizeHref('/about', 'en') => '/en/about' (if en is non-default)
 * - localizeHref('/about', 'ro') => '/about'    (if ro is default)
 * - localizeHref('/',      'en') => '/en'
 */
export function localizeHref(href: string, lang: Language): string {
  const prefix = getLanguagePrefix(lang)
  if (!prefix) return href
  if (href === '/' || href === '') return prefix
  return `${prefix}${href.startsWith('/') ? href : `/${href}`}`
}
