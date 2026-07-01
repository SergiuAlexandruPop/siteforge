import type { ClientConfig } from '@/types/config'
import { ElectroWillHeader } from './ElectroWillHeader'
import { ElectroWillFooter } from './ElectroWillFooter'
import { StickyContactBar } from './StickyContactBar'
import { TapTracker } from './TapTracker'

// ---------------------------------------------------------------------------
// ElectroWillLayout — custom layout shell for the electrowill-solutions client.
// ---------------------------------------------------------------------------
// Composition: sticky header → main → footer, plus the mobile fixed bottom bar.
// Registered via clients/electrowill-solutions/index.ts (the manifest), resolved
// by getClientLayout(). Differences from the default LayoutShell:
//   - Custom ElectroWillHeader (sticky desktop nav / simple mobile row)
//   - StickyContactBar pinned to the bottom on mobile (persistent call/WhatsApp)
//   - <main> reserves pb on mobile so content clears the bottom bar
//   - No theme/language toggles (light-only, Romanian-only client)
// ---------------------------------------------------------------------------

interface ElectroWillLayoutProps {
  config: ClientConfig
  children: React.ReactNode
}

export function ElectroWillLayout({ config, children }: ElectroWillLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col font-body text-foreground">
      <ElectroWillHeader navigation={config.navigation} />

      {/* Reserve space for the fixed mobile bottom bar (bar height 84px + iOS
          home-indicator safe area) so the last section clears it; cleared at lg. (I3) */}
      <main className="flex-1 pb-[calc(84px+env(safe-area-inset-bottom))] lg:pb-0">{children}</main>

      <ElectroWillFooter />

      <StickyContactBar />

      {/* Cookieless tap counter (#3): one delegated listener, site-wide. */}
      <TapTracker />
    </div>
  )
}
