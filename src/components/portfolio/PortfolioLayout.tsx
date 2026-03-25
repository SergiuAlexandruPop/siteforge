import type { ClientConfig } from '@/types/config'
import { SmoothScroll } from '@/components/animations/SmoothScroll'
import { PortfolioHeader } from './PortfolioHeader'
import { PortfolioFooter } from './PortfolioFooter'
import { LanguageToggle } from '@/components/i18n/LanguageToggle'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

// ---------------------------------------------------------------------------
// PortfolioLayout — Premium layout shell for the portfolio client.
// ---------------------------------------------------------------------------
// Composes: SmoothScroll → PortfolioHeader → main → PortfolioFooter.
//
// Differences from the default LayoutShell:
//   - SmoothScroll wraps everything (Lenis-powered smooth scrolling)
//   - PortfolioHeader is transparent, gains frosted glass on scroll
//   - PortfolioFooter has dark mode gradient treatment
//   - Main content has pt-16 to offset the fixed (not sticky) header
//
// Registered in src/lib/client-layout.ts for the 'portfolio' client.
// See DESIGN.md Section 6 — Data Flow.
// ---------------------------------------------------------------------------

interface PortfolioLayoutProps {
  config: ClientConfig
  children: React.ReactNode
}

export function PortfolioLayout({ config, children }: PortfolioLayoutProps) {
  return (
    <SmoothScroll>
      <div className="flex min-h-screen flex-col">
        <PortfolioHeader
          displayName={config.displayName}
          navigation={config.navigation}
          currentLanguage={config.defaultLanguage}
          languageToggle={config.features.i18n ? <LanguageToggle /> : undefined}
          themeToggle={config.features.darkMode ? <ThemeToggle /> : undefined}
        />

        {/* pt-16 offsets the fixed header height (h-16 = 4rem) */}
        <main className="flex-1 pt-16">
          {children}
        </main>

        <PortfolioFooter
          displayName={config.displayName}
          contact={config.contact}
        />
      </div>
    </SmoothScroll>
  )
}
