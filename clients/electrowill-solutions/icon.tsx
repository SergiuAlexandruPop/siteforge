import type { ClientIcon } from '@/types/config'

// ---------------------------------------------------------------------------
// ElectroWill Solutions — favicon / app-icon mark.
// ---------------------------------------------------------------------------
// A lightning bolt in the brand green (#1C6B47), matching the electrical trade
// and the theme. Size-parametric so the single definition drives both the 32px
// browser-tab favicon (app/icon.tsx) and the 180px home-screen apple-icon
// (app/apple-icon.tsx). Rendered via next/og ImageResponse — only this client's
// manifest is bundled, so no other client's mark ships.
// ---------------------------------------------------------------------------

const BRAND_GREEN = '#1C6B47'

export const icon: ClientIcon = {
  mark: (px) => (
    <svg width={px} height={px} viewBox="0 0 32 32" fill="none">
      {/* Lightning bolt — single solid brand-green glyph. */}
      <path
        d="M18.5 3 L8 18 H15 L13.5 29 L24 13 H16.5 Z"
        fill={BRAND_GREEN}
      />
    </svg>
  ),
  // Light mint tile keeps the green bolt high-contrast at apple-icon size.
  appleBackground: 'linear-gradient(135deg, #E8F3EE 0%, #ffffff 100%)',
}
