import type { ClientConfig } from '@/types/config'
import { Header } from './Header'
import { Footer } from './Footer'
import { LanguageToggle } from '@/components/i18n/LanguageToggle'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

interface LayoutShellProps {
  config: ClientConfig
  children: React.ReactNode
}

export function LayoutShell({ config, children }: LayoutShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header
        displayName={config.displayName}
        navigation={config.navigation}
        currentLanguage={config.defaultLanguage}
        languageToggle={config.features.i18n ? <LanguageToggle /> : undefined}
        themeToggle={config.features.darkMode ? <ThemeToggle /> : undefined}
      />

      <main className="flex-1">
        {children}
      </main>

      <Footer
        displayName={config.displayName}
        contact={config.contact}
      />
    </div>
  )
}
