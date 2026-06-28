import { createElement } from 'react'
import type {
  ClientConfig,
  ClientFonts,
  ClientHomePageComponent,
  ClientIcon,
  ClientLayoutComponent,
  ClientPageComponent,
  ClientTheme,
} from '@/types/config'
import { activeClient } from '@/lib/active-client.generated'
import { LayoutShell } from '@/components/layout/LayoutShell'
import { DefaultHomePage } from '@/components/sections/DefaultHomePage'

// Built-in fallback mark for clients that declare no icon (e.g. a freshly
// scaffolded client before branding). Defined with createElement so this stays a
// plain .ts module (no JSX). A neutral rounded square in the template blue.
const FALLBACK_ICON: ClientIcon = {
  mark: (px) =>
    createElement(
      'svg',
      { width: px, height: px, viewBox: '0 0 32 32' },
      createElement('rect', { x: 5, y: 5, width: 22, height: 22, rx: 6, fill: '#2563eb' })
    ),
  appleBackground: '#ffffff',
}

// ---------------------------------------------------------------------------
// Active-client accessors
// ---------------------------------------------------------------------------
// All per-client wiring now flows through a single manifest resolved at build
// time by scripts/gen-active-client.ts (re-exported as `activeClient`). Only the
// active client's code is ever imported, so no other client leaks into the
// bundle. Adding a client requires NO change here — only a new
// clients/<name>/index.ts.
//
// Shared fallbacks (LayoutShell / DefaultHomePage) are imported here because
// they're common to every build; the markdown renderer is the page fallback.
// ---------------------------------------------------------------------------

export function getClientConfig(): ClientConfig {
  return activeClient.config
}

export function getClientTheme(): ClientTheme {
  return activeClient.theme
}

/**
 * Fonts for the active client, or null when the client declares none (the body
 * then falls back to the system font stack). Only the active client's manifest
 * is bundled, so only its fonts are ever loaded.
 */
export function getClientFonts(): ClientFonts | null {
  return activeClient.fonts ?? null
}

/**
 * Icon mark for the active client, or a neutral built-in fallback. Only the
 * active client's manifest is bundled, so only its mark is ever rendered. Used
 * by the app/icon.tsx + app/apple-icon.tsx metadata routes.
 */
export function getClientIcon(): ClientIcon {
  return activeClient.icon ?? FALLBACK_ICON
}

/** Layout for the active client, or the shared default. */
export function getClientLayout(): ClientLayoutComponent {
  return activeClient.layout ?? LayoutShell
}

/** Homepage for the active client, or the shared default. */
export function getClientHomePage(): ClientHomePageComponent {
  return activeClient.homepage ?? DefaultHomePage
}

/**
 * Custom page for the given slug on the active client, or null if none is
 * registered (the route then falls back to the markdown renderer).
 */
export function getClientPage(slug: string): ClientPageComponent | null {
  return activeClient.pages?.[slug] ?? null
}
