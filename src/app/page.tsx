import { getClientConfig } from '@/lib/client-config'
import { getClientHomePage } from '@/lib/client-homepage'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const config = getClientConfig()
  if (!config.features.i18n) return {}

  return {
    alternates: {
      languages: { en: '/en' },
    },
  }
}

export default async function HomePage() {
  const config = getClientConfig()
  const ClientHomePage = getClientHomePage(config.name)

  return <ClientHomePage />
}
