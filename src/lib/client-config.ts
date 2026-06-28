import type {
  ClientConfig,
  ClientFonts,
  ClientHomePageComponent,
  ClientLayoutComponent,
  ClientPageComponent,
  ClientTheme,
} from '@/types/config'
import { activeClient } from '@/lib/active-client.generated'
import { LayoutShell } from '@/components/layout/LayoutShell'
import { DefaultHomePage } from '@/components/sections/DefaultHomePage'

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
