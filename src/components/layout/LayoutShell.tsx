import type { ClientConfig } from '@/types/config'
import { Header } from './Header'
import { Footer } from './Footer'

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
