import type { ClientIcon } from '@/types/config'

// ---------------------------------------------------------------------------
// _template — favicon / app-icon mark (neutral placeholder).
// ---------------------------------------------------------------------------
// Copied by `yarn new-client` as the starting icon for every client. Replace
// the mark with the client's brand glyph (see clients/electrowill-solutions/
// icon.tsx for a single-glyph example, or clients/portfolio/icon.tsx for a
// multi-path one). Size-parametric: one mark serves favicon + apple-icon.
// ---------------------------------------------------------------------------

export const icon: ClientIcon = {
  mark: (px) => (
    <svg width={px} height={px} viewBox="0 0 32 32">
      <rect x="5" y="5" width="22" height="22" rx="6" fill="#2563eb" />
    </svg>
  ),
  appleBackground: '#ffffff',
}
