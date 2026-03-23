import type { ClientConfig, ClientTheme } from '@/types/config'

import portfolioConfig from '../../clients/portfolio/config'
import portfolioTheme from '../../clients/portfolio/theme'
import templateConfig from '../../clients/_template/config'
import templateTheme from '../../clients/_template/theme'

// ---------------------------------------------------------------------------
// Client Registry
// ---------------------------------------------------------------------------
// When adding a new client, import their config/theme above and add entries
// to both maps below. The Phase 6 CLI script automates this.
// ---------------------------------------------------------------------------

const configs: Record<string, ClientConfig> = {
  portfolio: portfolioConfig,
  _template: templateConfig,
}

const themes: Record<string, ClientTheme> = {
  portfolio: portfolioTheme,
  _template: templateTheme,
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

function getActiveClientName(): string {
  const client = process.env.ACTIVE_CLIENT
  if (!client) {
    throw new Error(
      'ACTIVE_CLIENT environment variable is not set.\n' +
      'Start the dev server with: yarn dev:portfolio'
    )
  }
  return client
}

export function getClientConfig(): ClientConfig {
  const name = getActiveClientName()
  const config = configs[name]
  if (!config) {
    throw new Error(
      `Unknown client: "${name}".\n` +
      `Available clients: ${Object.keys(configs).join(', ')}\n` +
      `Did you forget to register it in src/lib/client-config.ts?`
    )
  }
  return config
}

export function getClientTheme(): ClientTheme {
  const name = getActiveClientName()
  const theme = themes[name]
  if (!theme) {
    throw new Error(
      `No theme found for client: "${name}".\n` +
      `Register it in src/lib/client-config.ts`
    )
  }
  return theme
}
