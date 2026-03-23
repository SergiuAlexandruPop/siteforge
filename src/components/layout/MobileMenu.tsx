'use client'

import { useEffect } from 'react'
import type { NavigationItem } from '@/types/config'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  items: NavigationItem[]
  currentLanguage: 'ro' | 'en'
}

export function MobileMenu({ open, onClose, items, currentLanguage }: MobileMenuProps) {
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
            const href = currentLanguage === 'en'
              ? `/en${item.href === '/' ? '' : item.href}`
              : item.href

            return (
              <li key={item.href}>
                <a
                  href={href}
                  onClick={onClose}
                  className="flex h-11 items-center rounded-md px-3 text-base font-medium text-foreground hover:bg-muted transition-colors"
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
