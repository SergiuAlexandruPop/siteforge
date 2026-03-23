'use client'

import { usePathname } from 'next/navigation'

/**
 * RO/EN toggle that swaps between /path and /en/path.
 * Only rendered when features.i18n is true (controlled by parent).
 */
export function LanguageToggle() {
  const pathname = usePathname()

  const isEnglish = pathname.startsWith('/en')

  // Compute the opposite-language URL
  const targetHref = isEnglish
    ? pathname.replace(/^\/en/, '') || '/'
    : `/en${pathname === '/' ? '' : pathname}`

  const currentLabel = isEnglish ? 'EN' : 'RO'
  const targetLabel = isEnglish ? 'RO' : 'EN'

  return (
    <a
      href={targetHref}
      className="flex h-9 items-center rounded-md px-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      title={isEnglish ? 'Schimbă în Română' : 'Switch to English'}
    >
      <span className="text-foreground">{currentLabel}</span>
      <span className="mx-1 text-border">/</span>
      <span>{targetLabel}</span>
    </a>
  )
}
