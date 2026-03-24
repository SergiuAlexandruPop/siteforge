import type { MetadataRoute } from 'next'
import { getClientConfig } from '@/lib/client-config'
import { getPageSlugs, getBlogSlugs } from '@/lib/content'

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

  // Blog posts (Romanian)
  if (config.features.blog) {
    const blogSlugs = getBlogSlugs('ro')
    for (const slug of blogSlugs) {
      entries.push({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }

    // Blog listing page
    entries.push({
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    })

    // English blog posts (if i18n enabled)
    if (config.features.i18n) {
      const enBlogSlugs = getBlogSlugs('en')
      for (const slug of enBlogSlugs) {
        entries.push({
          url: `${baseUrl}/en/blog/${slug}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.6,
        })
      }

      entries.push({
        url: `${baseUrl}/en/blog`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  }

  return entries
}
