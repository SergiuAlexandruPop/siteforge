import { ImageResponse } from 'next/og'

import { getClientIcon } from '@/lib/client-config'

// ---------------------------------------------------------------------------
// app/icon.tsx — per-client browser-tab favicon (32×32 PNG).
// ---------------------------------------------------------------------------
// Replaces the old SHARED static app/icon.svg (a rocket, correct only for
// portfolio). Renders the ACTIVE client's mark from its manifest via next/og,
// so each client ships its own favicon and only that client's mark is bundled
// (same per-client pattern as fonts). A client with no `icon` falls back to a
// neutral mark (see getClientIcon).
// ---------------------------------------------------------------------------

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  const icon = getClientIcon()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon.mark(32)}
      </div>
    ),
    { ...size }
  )
}
