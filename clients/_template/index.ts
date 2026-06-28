import type { ClientManifest } from '@/types/config'
import config from './config'
import theme from './theme'
import { fonts } from './fonts'

// ---------------------------------------------------------------------------
// _template — client entry/manifest. Copied by `yarn new-client` as the
// starting point for every client, and used as the default codegen target so
// the project type-checks on a fresh checkout (postinstall / pretypecheck).
//
// Config + theme only by default. Add `layout`, `homepage`, or `pages` when
// the client needs custom UI.
// ---------------------------------------------------------------------------

export const manifest: ClientManifest = {
  config,
  theme,
  fonts,
}

export default manifest
