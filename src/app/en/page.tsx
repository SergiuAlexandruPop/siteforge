import { getClientConfig } from '@/lib/client-config'
import { getClientHomePage } from '@/lib/client-homepage'
import { getDefaultLanguage, isLanguageSupported } from '@/lib/i18n'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const THIS_LANG = 'en'

export async function generateMetadata(): Promise<Metadata> {
  if (!isLanguageSupported(THIS_LANG)) return {}
  const config = getClientConfig()

  return {
    title: config.seo.siteName,
    description: config.seo.siteDescription,
    alternates: {
      languages: { [getDefaultLanguage()]: '/' },
    },
  }
}

export default async function EnglishHomePage() {
  if (!isLanguageSupported(THIS_LANG)) notFound()
  const config = getClientConfig()
  const ClientHomePage = getClientHomePage(config.name)

  return <ClientHomePage language={THIS_LANG} />
}
