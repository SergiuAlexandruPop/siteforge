'use client'

import { useEffect } from 'react'
import type { NavigationItem } from '@/types/config'

function localizeHref(href: string, lang: string, defaultLang: string): string {
  if (lang === defaultLang) return href
  if (href === '/' || href === '') return `/${lang}`
  return `/${lang}${href.startsWith('/') ? href : `/${href}`}`
}

// ---------------------------------------------------------------------------
// MobileMenu — Slide-in mobile navigation panel.
// ---------------------------------------------------------------------------
// Phase 8F: Added active link styling via currentPathname prop.
// The prop is optional for backward compatibility with the default header.
// ---------------------------------------------------------------------------

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  items: NavigationItem[]
  currentLanguage: string
  defaultLanguage: string
  /** Current pathname for active link detection. Optional for backward compat. */
  currentPathname?: string
}

function isActivePath(pathname: string, href: string): boolean {
  const normalizedPathname = pathname.replace(/^\/en/, '') || '/'
  const normalizedHref = href.replace(/^\/en/, '') || '/'

  if (normalizedHref === '/') return normalizedPathname === '/'
  return normalizedPathname.startsWith(normalizedHref)
}

export function MobileMenu({
  open,
  onClose,
  items,
  currentLanguage,
  defaultLanguage,
  currentPathname,
}: MobileMenuProps) {
  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <nav
        className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-background shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Close button */}
        <div className="flex items-center justify-end p-4">
          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-md hover:bg-muted transition-colors"
            aria-label="Close menu"
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
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <ul className="flex flex-col gap-1 px-4">
          {items.map((item) => {
            const label = currentLanguage === 'en' && item.labelEn
              ? item.labelEn
              : item.label
            const href = localizeHref(item.href, currentLanguage, defaultLanguage)

            const active = currentPathname
              ? isActivePath(currentPathname, href)
              : false

            return (
              <li key={item.href}>
                <a
                  href={href}
                  onClick={onClose}
                  className={`flex h-11 items-center rounded-md px-3 text-base transition-colors ${
                    active
                      ? 'font-semibold text-primary bg-primary/5'
                      : 'font-medium text-foreground hover:bg-muted'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
