'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

interface ThemeProviderProps {
  children: React.ReactNode
  /** Per-client localStorage key (e.g. 'portfolio-theme'). */
  storageKey: string
  /** Default theme when no stored preference exists. */
  defaultTheme: Theme
}

export function ThemeProvider({ children, storageKey, defaultTheme }: ThemeProviderProps) {
  const getInitialTheme = useCallback((): Theme => {
    if (typeof window === 'undefined') return defaultTheme
    const stored = localStorage.getItem(storageKey)
    if (stored === 'dark' || stored === 'light') return stored
    return defaultTheme
  }, [storageKey, defaultTheme])

  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  // Apply theme to <html> on mount and on change
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem(storageKey, next)
      return next
    })
  }, [storageKey])

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
