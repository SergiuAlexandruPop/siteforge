import type { MetadataRoute } from 'next'
import { getClientConfig } from '@/lib/client-config'

export default function robots(): MetadataRoute.Robots {
  const config = getClientConfig()
  const baseUrl = config.domain === 'localhost'
    ? 'http://localhost:3000'
    : `https://${config.domain}`

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
