'use client'

import { usePathname } from 'next/navigation'

interface LanguageToggleProps {
  /** All supported language codes, e.g. ['ro','en']. */
  supportedLanguages: string[]
  /** Default language (served at root, no prefix). */
  defaultLanguage: string
}

/**
 * Language toggle. Hidden when there is only one supported language.
 * For exactly two languages, renders a binary switch.
 * Uses the convention: default language at root, others prefixed with /<lang>.
 */
export function LanguageToggle({
  supportedLanguages,
  defaultLanguage,
}: LanguageToggleProps) {
  const pathname = usePathname()

  if (!supportedLanguages || supportedLanguages.length <= 1) return null

  // Detect current language from pathname
  const nonDefault = supportedLanguages.filter((l) => l !== defaultLanguage)
  const currentLang =
    nonDefault.find(
      (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
    ) ?? defaultLanguage

  // Pick the "other" language to toggle to (first non-current)
  const targetLang =
    supportedLanguages.find((l) => l !== currentLang) ?? defaultLanguage

  // Strip any existing language prefix
  const bareHref =
    currentLang === defaultLanguage
      ? pathname
      : pathname.replace(new RegExp(`^/${currentLang}`), '') || '/'

  const targetHref =
    targetLang === defaultLanguage
      ? bareHref || '/'
      : `/${targetLang}${bareHref === '/' ? '' : bareHref}`

  const currentLabel = currentLang.toUpperCase()
  const targetLabel = targetLang.toUpperCase()

  return (
    <a
      href={targetHref}
      className="flex h-9 items-center rounded-md px-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      title={`Switch to ${targetLabel}`}
    >
      <span className="text-foreground">{currentLabel}</span>
      <span className="mx-1 text-border">/</span>
      <span>{targetLabel}</span>
    </a>
  )
}
