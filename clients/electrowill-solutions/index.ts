import type { ClientManifest } from '@/types/config'
import config from './config'
import theme from './theme'

// ---------------------------------------------------------------------------
// ElectroWill — client entry/manifest. Config + theme only; uses the shared
// default layout, homepage, and markdown page renderer. Add `layout`,
// `homepage`, or `pages` here when this client gets custom UI.
// ---------------------------------------------------------------------------

export const manifest: ClientManifest = {
  config,
  theme,
}

export default manifest
