import { getClientConfig, getClientHomePage } from '@/lib/client-config'
import { getDefaultLanguage, getSupportedLanguages, localizeHref } from '@/lib/i18n'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const config = getClientConfig()
  if (!config.features.i18n) return {}

  const defaultLang = getDefaultLanguage()
  return {
    alternates: {
      languages: Object.fromEntries(
        getSupportedLanguages()
          .filter((lang) => lang !== defaultLang)
          .map((lang) => [lang, localizeHref('/', lang)])
      ),
    },
  }
}

export default async function HomePage() {
  const ClientHomePage = getClientHomePage()

  return <ClientHomePage language={getDefaultLanguage()} />
}
