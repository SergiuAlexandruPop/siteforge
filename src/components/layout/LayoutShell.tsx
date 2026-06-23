import type { ClientConfig } from '@/types/config'
import { Header } from './Header'
import { Footer } from './Footer'
import { LanguageToggle } from '@/components/i18n/LanguageToggle'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { getDefaultLanguage, getSupportedLanguages } from '@/lib/i18n'

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
        currentLanguage={getDefaultLanguage()}
        defaultLanguage={getDefaultLanguage()}
        languageToggle={
          config.features.i18n ? (
            <LanguageToggle
              supportedLanguages={getSupportedLanguages()}
              defaultLanguage={getDefaultLanguage()}
            />
          ) : undefined
        }
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
