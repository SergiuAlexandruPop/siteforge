import { getClientConfig } from '@/lib/client-config'
import { getClientHomePage } from '@/lib/client-homepage'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const config = getClientConfig()

  return {
    title: config.seo.siteName,
    description: config.seo.siteDescription,
    alternates: {
      languages: { ro: '/' },
    },
  }
}

export default async function EnglishHomePage() {
  const config = getClientConfig()
  const ClientHomePage = getClientHomePage(config.name)

  return <ClientHomePage language="en" />
}
