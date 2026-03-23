import type { MetadataRoute } from 'next'
import { getClientConfig } from '@/lib/client-config'
import { getPageSlugs } from '@/lib/content'

export default function sitemap(): MetadataRoute.Sitemap {
  const config = getClientConfig()
  const baseUrl = config.domain === 'localhost'
    ? 'http://localhost:3000'
    : `https://${config.domain}`

  const now = new Date()

  // Homepage
  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]

  // Static pages (about, contact, etc.)
  const pageSlugs = getPageSlugs('ro')
  for (const slug of pageSlugs) {
    entries.push({
      url: `${baseUrl}/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    })
  }

  // English pages (if i18n enabled)
  if (config.features.i18n) {
    const enSlugs = getPageSlugs('en')

    // English homepage
    entries.push({
      url: `${baseUrl}/en`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    })

    for (const slug of enSlugs) {
      entries.push({
        url: `${baseUrl}/en/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  }

  // Future: Blog posts will be added here in Phase 3

  return entries
}
