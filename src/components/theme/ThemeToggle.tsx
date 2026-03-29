'use client'

import { useState, useEffect } from 'react'
import { useTheme } from './ThemeProvider'

// ---------------------------------------------------------------------------
// ThemeToggle — Dark/light mode toggle button.
// ---------------------------------------------------------------------------
// Uses a `mounted` guard to prevent hydration mismatch. On the server and
// during the first client render we show a static placeholder (moon icon).
// After hydration completes we swap to the real theme-aware icon.
//
// The anti-FOUC inline script in layout.tsx ensures the page is visually
// correct even before React hydrates — so the brief placeholder is invisible.
// ---------------------------------------------------------------------------

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Before hydration: render a static placeholder to match server HTML.
  // Always render the sun icon (matches server default of 'dark' theme).
  const isDark = mounted ? theme === 'dark' : true

  return (
    <button
      onClick={toggle}
      className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      aria-label={isDark ? 'Comută la modul luminos' : 'Comută la modul întunecat'}
      title={isDark ? 'Mod luminos' : 'Mod întunecat'}
    >
      {isDark ? (
        /* Sun icon — shown in dark mode */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      ) : (
        /* Moon icon — shown in light mode (and as server default) */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </button>
  )
}
