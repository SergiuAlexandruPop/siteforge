import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { ClientConfig } from '@/types/config'

// ---------------------------------------------------------------------------
// i18n.ts — language routing helpers
// ---------------------------------------------------------------------------
// These helpers read the active client's config via getClientConfig(). We mock
// that module so the tests are deterministic and independent of ACTIVE_CLIENT.
// i18n.ts imports `./client-config`, which resolves to the same module id as
// `@/lib/client-config`, so this mock intercepts it.
// ---------------------------------------------------------------------------

vi.mock('@/lib/client-config', () => ({
  getClientConfig: vi.fn(),
  getClientTheme: vi.fn(),
}))

import { getClientConfig } from '@/lib/client-config'
import {
  isI18nEnabled,
  getSupportedLanguages,
  getDefaultLanguage,
  isLanguageSupported,
  getLanguagePrefix,
  contentFolderSuffix,
  detectLanguageFromPath,
  localizeHref,
} from '@/lib/i18n'

const mockGetConfig = vi.mocked(getClientConfig)

/** Minimal config covering only the fields i18n.ts reads. */
function setConfig(partial: Partial<ClientConfig>): void {
  mockGetConfig.mockReturnValue(partial as ClientConfig)
}

/** A bilingual client: default `ro`, also supports `en`. */
function setBilingual(): void {
  setConfig({
    defaultLanguage: 'ro',
    features: { i18n: true } as ClientConfig['features'],
    i18n: { supportedLanguages: ['ro', 'en'], defaultLanguage: 'ro' },
  })
}

/** A single-language client: `ro` only, no i18n config object. */
function setMonolingual(): void {
  setConfig({
    defaultLanguage: 'ro',
    features: { i18n: false } as ClientConfig['features'],
  })
}

beforeEach(() => {
  mockGetConfig.mockReset()
})

describe('isI18nEnabled', () => {
  it('is true when the feature flag is on', () => {
    setBilingual()
    expect(isI18nEnabled()).toBe(true)
  })

  it('is false when the feature flag is off', () => {
    setMonolingual()
    expect(isI18nEnabled()).toBe(false)
  })
})

describe('getSupportedLanguages', () => {
  it('returns the configured list when i18n is set', () => {
    setBilingual()
    expect(getSupportedLanguages()).toEqual(['ro', 'en'])
  })

  it('falls back to [defaultLanguage] for a single-language client', () => {
    setMonolingual()
    expect(getSupportedLanguages()).toEqual(['ro'])
  })
})

describe('getDefaultLanguage', () => {
  it('prefers the i18n.defaultLanguage', () => {
    setBilingual()
    expect(getDefaultLanguage()).toBe('ro')
  })

  it('falls back to config.defaultLanguage when i18n is absent', () => {
    setMonolingual()
    expect(getDefaultLanguage()).toBe('ro')
  })
})

describe('isLanguageSupported', () => {
  it('recognises supported and rejects unsupported languages', () => {
    setBilingual()
    expect(isLanguageSupported('ro')).toBe(true)
    expect(isLanguageSupported('en')).toBe(true)
    expect(isLanguageSupported('de')).toBe(false)
  })
})

describe('getLanguagePrefix', () => {
  it('is empty for the default language and /<lang> otherwise', () => {
    setBilingual()
    expect(getLanguagePrefix('ro')).toBe('')
    expect(getLanguagePrefix('en')).toBe('/en')
  })
})

describe('contentFolderSuffix', () => {
  it('is empty for the default language and -<lang> otherwise', () => {
    setBilingual()
    expect(contentFolderSuffix('ro')).toBe('')
    expect(contentFolderSuffix('en')).toBe('-en')
  })
})

describe('detectLanguageFromPath', () => {
  beforeEach(setBilingual)

  it('detects a non-default language from its prefix', () => {
    expect(detectLanguageFromPath('/en')).toBe('en')
    expect(detectLanguageFromPath('/en/about')).toBe('en')
  })

  it('returns the default language for unprefixed paths', () => {
    expect(detectLanguageFromPath('/')).toBe('ro')
    expect(detectLanguageFromPath('/about')).toBe('ro')
  })

  it('does not false-match a prefix that is only a substring', () => {
    // '/english' must NOT be detected as 'en'
    expect(detectLanguageFromPath('/english')).toBe('ro')
  })
})

describe('localizeHref', () => {
  beforeEach(setBilingual)

  it('returns the href unchanged for the default language', () => {
    expect(localizeHref('/about', 'ro')).toBe('/about')
    expect(localizeHref('/', 'ro')).toBe('/')
  })

  it('prefixes the href for a non-default language', () => {
    expect(localizeHref('/about', 'en')).toBe('/en/about')
    expect(localizeHref('/blog', 'en')).toBe('/en/blog')
  })

  it('maps root and empty href to the bare prefix', () => {
    expect(localizeHref('/', 'en')).toBe('/en')
    expect(localizeHref('', 'en')).toBe('/en')
  })

  it('tolerates a href without a leading slash', () => {
    expect(localizeHref('about', 'en')).toBe('/en/about')
  })
})
