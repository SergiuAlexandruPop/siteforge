import type { ClientManifest } from '@/types/config'
import config from './config'
import theme from './theme'
import { fonts } from './fonts'
import { icon } from './icon'
import { ElectroWillLayout } from '@/components/electrowill/ElectroWillLayout'
import { ElectroWillHomePage } from '@/components/electrowill/HomePage'

// ---------------------------------------------------------------------------
// ElectroWill — client entry/manifest (single source of per-client wiring).
// Phase B: registers the custom layout (sticky header + mobile bottom bar +
// footer) and the custom single-scroll homepage. Custom pages (/contact,
// /confidentialitate, /termeni) are added in later phases (C/F). No projects,
// no blog, no i18n. Only the active client's manifest is imported at build time.
// ---------------------------------------------------------------------------

export const manifest: ClientManifest = {
  config,
  theme,
  fonts,
  icon,
  layout: ElectroWillLayout,
  homepage: ElectroWillHomePage,
}

export default manifest
