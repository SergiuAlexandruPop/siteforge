'use client'

import { useState, useEffect } from 'react'
import type { NavigationItem } from '@/types/config'
import { MobileMenu } from '@/components/layout/MobileMenu'

// ---------------------------------------------------------------------------
// PortfolioHeader — Premium transparent-to-blur header.
// ---------------------------------------------------------------------------
// Starts fully transparent (no background, no border). On scroll past 50px,
// transitions to a frosted glass effect with background and border.
//
// Dark mode scrolled state gets a subtle bottom border glow.
//
// Reuses MobileMenu from layout/ for mobile nav (composition over inheritance).
// Same slot pattern as the default Header (languageToggle, themeToggle).
//
// See DESIGN.md Section 5 — Header Scroll Effect for timing spec.
// See DESIGN.md Section 8 — Dark Mode Special Treatments.
// ---------------------------------------------------------------------------

interface PortfolioHeaderProps {
  displayName: string
  navigation: NavigationItem[]
  currentLanguage: 'ro' | 'en'
  languageToggle?: React.ReactNode
  themeToggle?: React.ReactNode
}

export function PortfolioHeader({
  displayName,
  navigation,
  currentLanguage,
  languageToggle,
  themeToggle,
}: PortfolioHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 50)
    }

    // Check initial scroll position (e.g. page refresh mid-scroll)
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border dark:border-border/50'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Logo / site name */}
        <a
          href="/"
          className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
        >
          {displayName}
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navigation.map((item) => {
            const label =
              currentLanguage === 'en' && item.labelEn ? item.labelEn : item.label
            const href =
              currentLanguage === 'en'
                ? `/en${item.href === '/' ? '' : item.href}`
                : item.href

            return (
              <a
                key={item.href}
                href={href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                {label}
              </a>
            )
          })}

          {/* Toggle slots */}
          {languageToggle}
          {themeToggle}
        </nav>

        {/* Mobile: toggles + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
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

      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        items={navigation}
        currentLanguage={currentLanguage}
      />
    </header>
  )
}
