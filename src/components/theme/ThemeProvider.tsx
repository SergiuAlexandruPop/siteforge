'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = 'siteforge-theme'

function getInitialTheme(): Theme {
  // Server render — default to dark (portfolio preference).
  // The inline script in layout.tsx applies .dark before React hydrates.
  if (typeof window === 'undefined') return 'dark'

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') return stored

  // No stored preference — default to dark
  return 'dark'
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  // Apply theme to <html> on mount and on change
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // Listen for system preference changes (only when no stored preference)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')

    function handleChange(e: MediaQueryListEvent) {
      const stored = localStorage.getItem(STORAGE_KEY)
      // Only follow system if user hasn't explicitly chosen
      if (!stored) {
        const next = e.matches ? 'dark' : 'light'
        setTheme(next)
      }
    }

    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [])

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return ctx
}
