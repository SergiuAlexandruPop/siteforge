'use client'

import { useState } from 'react'
import type { NavigationItem } from '@/types/config'
import { MobileMenu } from './MobileMenu'

interface HeaderProps {
  displayName: string
  navigation: NavigationItem[]
  currentLanguage: 'ro' | 'en'
  /** Slot for LanguageToggle component (Phase 2D) */
  languageToggle?: React.ReactNode
  /** Slot for ThemeToggle component (Phase 4A) */
  themeToggle?: React.ReactNode
}

export function Header({
  displayName,
  navigation,
  currentLanguage,
  languageToggle,
  themeToggle,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Logo / site name */}
        <a href="/" className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
          {displayName}
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navigation.map((item) => {
            const label = currentLanguage === 'en' && item.labelEn
              ? item.labelEn
              : item.label
            const href = currentLanguage === 'en'
              ? `/en${item.href === '/' ? '' : item.href}`
              : item.href

            return (
              <a
                key={item.href}
                href={href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
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
            className="flex h-11 w-11 items-center justify-center rounded-md hover:bg-muted transition-colors"
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
