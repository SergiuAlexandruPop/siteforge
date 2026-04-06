'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import type { NavigationItem } from '@/types/config'
import { MobileMenu } from '@/components/layout/MobileMenu'

// ---------------------------------------------------------------------------
// PortfolioHeader — Premium transparent-to-blur header.
// ---------------------------------------------------------------------------
// Phase 8F: Added active link styling based on pathname.
//
// Starts fully transparent (no background, no border). On scroll past 50px,
// transitions to a frosted glass effect with background and border.
//
// Active link detection:
//   - '/' matches exactly (not as prefix)
//   - Other paths match if pathname starts with the nav href
//   - Active: text-foreground font-semibold + underline accent
//   - Inactive: text-muted-foreground
// ---------------------------------------------------------------------------

interface PortfolioHeaderProps {
  displayName: string
  navigation: NavigationItem[]
  currentLanguage: 'ro' | 'en'
  languageToggle?: React.ReactNode
  themeToggle?: React.ReactNode
}

function isActivePath(pathname: string, href: string): boolean {
  // Strip /en prefix for comparison if present
  const normalizedPathname = pathname.replace(/^\/en/, '') || '/'
  const normalizedHref = href.replace(/^\/en/, '') || '/'

  // Home: exact match only
  if (normalizedHref === '/') return normalizedPathname === '/'

  // Other pages: starts with (e.g. /projects matches /projects/voltdoc)
  return normalizedPathname.startsWith(normalizedHref)
}

export function PortfolioHeader({
  displayName,
  navigation,
  currentLanguage,
  languageToggle,
  themeToggle,
}: PortfolioHeaderProps) {
  const pathname = usePathname()
  const detectedLanguage = pathname.startsWith('/en') ? 'en' : 'ro'
  const lang = detectedLanguage as 'ro' | 'en'

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 50)
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-30 transition-[background-color,border-color,backdrop-filter] duration-300 ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-md border-b border-border dark:border-border/50'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="relative mx-auto flex h-16 max-w-5xl items-center justify-center px-4 sm:px-6">
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navigation.map((item) => {
              const label =
                lang === 'en' && item.labelEn ? item.labelEn : item.label
              const href =
                lang === 'en'
                  ? `/en${item.href === '/' ? '' : item.href}`
                  : item.href

              const active = isActivePath(pathname, href)

              return (
                <a
                  key={item.href}
                  href={href}
                  className={`relative rounded-md px-3 py-2 text-sm transition-colors ${
                    active
                      ? 'font-semibold text-foreground'
                      : 'font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {label}
                  {/* Active underline indicator */}
                  {active && (
                    <span
                      className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                  )}
                </a>
              )
            })}

            {/* Toggle slots */}
            {languageToggle}
            {themeToggle}
          </nav>

          {/* Mobile: toggles + hamburger */}
          <div className="absolute right-4 flex items-center gap-2 md:hidden">
            {languageToggle}
            {themeToggle}

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-md hover:bg-muted/50 transition-colors"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        items={navigation}
        currentLanguage={lang}
        currentPathname={pathname}
      />
    </>
  )
}
