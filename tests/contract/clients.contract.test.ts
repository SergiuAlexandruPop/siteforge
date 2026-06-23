/// <reference types="vite/client" />
import { describe, it, expect } from 'vitest'
import { generateThemeCss } from '@/lib/theme-css'
import type { ClientConfig, ClientTheme } from '@/types/config'

// ---------------------------------------------------------------------------
// Client config/theme CONTRACT TEST  (review §8 — the multi-tenant guardrail)
// ---------------------------------------------------------------------------
// Auto-discovers every clients/<name>/ folder and asserts its config.ts and
// theme.ts are internally coherent. This is the single most valuable test for a
// shared codebase serving many independent sites: one malformed client config
// currently breaks every client's build with no early warning. This fails
// loudly and names the offending client instead.
//
// New clients are picked up automatically — no edits to this file needed.
// ---------------------------------------------------------------------------

const HEX = /^#[0-9a-fA-F]{6}$/

const configModules = import.meta.glob('../../clients/*/config.ts', {
  eager: true,
  import: 'default',
}) as Record<string, ClientConfig>

const themeModules = import.meta.glob('../../clients/*/theme.ts', {
  eager: true,
  import: 'default',
}) as Record<string, ClientTheme>

/** Extract the folder name from a glob path like '../../clients/portfolio/config.ts'. */
function folderName(globPath: string): string {
  const match = globPath.match(/clients\/([^/]+)\//)
  if (!match) throw new Error(`Could not parse client name from: ${globPath}`)
  return match[1]
}

const clients = Object.entries(configModules).map(([path, config]) => {
  const name = folderName(path)
  const themeEntry = Object.entries(themeModules).find(
    ([tPath]) => folderName(tPath) === name,
  )
  return { name, config, theme: themeEntry?.[1] }
})

describe('client discovery', () => {
  it('finds at least one client folder', () => {
    expect(clients.length).toBeGreaterThan(0)
  })

  it('every client has both a config and a theme', () => {
    for (const { name, config, theme } of clients) {
      expect(config, `${name} is missing config.ts`).toBeDefined()
      expect(theme, `${name} is missing theme.ts`).toBeDefined()
    }
  })
})

describe.each(clients)('client contract: $name', ({ name, config, theme }) => {
  it('config.name matches the folder name', () => {
    // Catches a client copied from _template where `name` was never updated.
    expect(config.name).toBe(name)
  })

  it('has the required top-level string fields', () => {
    expect(config.displayName?.length).toBeGreaterThan(0)
    expect(config.domain?.length).toBeGreaterThan(0)
    expect(config.defaultLanguage?.length).toBeGreaterThan(0)
  })

  it('has complete SEO metadata', () => {
    expect(config.seo?.siteName?.length).toBeGreaterThan(0)
    expect(config.seo?.siteDescription?.length).toBeGreaterThan(0)
    expect(config.seo?.ogImage?.length).toBeGreaterThan(0)
  })

  it('has a valid contact email', () => {
    expect(config.contact?.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  })

  it('declares all six feature flags as booleans', () => {
    const f = config.features
    for (const key of [
      'i18n',
      'blog',
      'darkMode',
      'contactForm',
      'smartsupp',
      'supabase',
    ] as const) {
      expect(typeof f?.[key], `features.${key}`).toBe('boolean')
    }
  })

  it('provides theme config when darkMode is enabled', () => {
    if (config.features.darkMode) {
      expect(['light', 'dark']).toContain(config.theme?.defaultTheme)
    }
  })

  it('has a coherent i18n config when i18n is enabled', () => {
    if (!config.features.i18n) return
    expect(config.i18n, 'i18n enabled but config.i18n missing').toBeDefined()
    const i18n = config.i18n!
    expect(i18n.supportedLanguages.length).toBeGreaterThan(0)
    expect(i18n.supportedLanguages).toContain(i18n.defaultLanguage)
    // The i18n default must agree with the top-level default language.
    expect(i18n.defaultLanguage).toBe(config.defaultLanguage)
  })

  it('has labelEn on every nav item when i18n is enabled', () => {
    if (!config.features.i18n) return
    for (const item of config.navigation) {
      expect(
        item.labelEn?.length,
        `nav "${item.label}" (${item.href}) is missing labelEn`,
      ).toBeGreaterThan(0)
    }
  })

  it('provides blog settings when blog is enabled', () => {
    if (!config.features.blog) return
    expect(config.blog, 'blog enabled but config.blog missing').toBeDefined()
    expect(config.blog!.postsPerPage).toBeGreaterThan(0)
    expect(config.blog!.authorName?.length).toBeGreaterThan(0)
  })

  it('has non-empty navigation', () => {
    expect(config.navigation?.length).toBeGreaterThan(0)
  })

  // --- Theme -----------------------------------------------------------------

  it('uses valid #rrggbb hex for every light-mode colour', () => {
    if (!theme) throw new Error(`${name} missing theme`)
    const c = theme.colors
    for (const [key, value] of Object.entries({
      primary: c.primary,
      primaryForeground: c.primaryForeground,
      secondary: c.secondary,
      background: c.background,
      foreground: c.foreground,
      muted: c.muted,
      mutedForeground: c.mutedForeground,
      border: c.border,
    })) {
      expect(value, `colors.${key}`).toMatch(HEX)
    }
  })

  it('uses valid #rrggbb hex for every dark-mode colour', () => {
    if (!theme) throw new Error(`${name} missing theme`)
    const d = theme.colors.dark
    for (const [key, value] of Object.entries({
      background: d.background,
      foreground: d.foreground,
      muted: d.muted,
      mutedForeground: d.mutedForeground,
      border: d.border,
    })) {
      expect(value, `colors.dark.${key}`).toMatch(HEX)
    }
    // Optional dark overrides — validate only if present.
    if (d.primary !== undefined) expect(d.primary).toMatch(HEX)
    if (d.primaryForeground !== undefined) expect(d.primaryForeground).toMatch(HEX)
  })

  it('declares fonts and a border radius', () => {
    if (!theme) throw new Error(`${name} missing theme`)
    expect(theme.fonts?.heading?.length).toBeGreaterThan(0)
    expect(theme.fonts?.body?.length).toBeGreaterThan(0)
    expect(theme.fonts?.blog?.length).toBeGreaterThan(0)
    expect(theme.borderRadius?.length).toBeGreaterThan(0)
  })

  it('generates theme CSS with no NaN (every hex is convertible)', () => {
    if (!theme) throw new Error(`${name} missing theme`)
    const css = generateThemeCss(theme)
    expect(css).not.toContain('NaN')
  })
})
