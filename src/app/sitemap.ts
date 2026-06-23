import type { MetadataRoute } from 'next'
import { getClientConfig } from '@/lib/client-config'
import { getPageSlugs, getBlogSlugs } from '@/lib/content'
import {
  getDefaultLanguage,
  getSupportedLanguages,
  getLanguagePrefix,
} from '@/lib/i18n'

export default function sitemap(): MetadataRoute.Sitemap {
  const config = getClientConfig()
  const baseUrl = config.domain === 'localhost'
    ? 'http://localhost:3000'
    : `https://${config.domain}`

  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  const defaultLang = getDefaultLanguage()
  const languages = config.features.i18n ? getSupportedLanguages() : [defaultLang]

  for (const lang of languages) {
    const prefix = getLanguagePrefix(lang)
    const isDefault = lang === defaultLang

    // Homepage (for this language)
    entries.push({
      url: `${baseUrl}${prefix || ''}` || baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: isDefault ? 1 : 0.9,
    })

    // Static pages
    const pageSlugs = getPageSlugs(lang)
    for (const slug of pageSlugs) {
      entries.push({
        url: `${baseUrl}${prefix}/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: isDefault ? 0.8 : 0.7,
      })
    }

    // Blog
    if (config.features.blog) {
      entries.push({
        url: `${baseUrl}${prefix}/blog`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: isDefault ? 0.8 : 0.7,
      })

      const blogSlugs = getBlogSlugs(lang)
      for (const slug of blogSlugs) {
        entries.push({
          url: `${baseUrl}${prefix}/blog/${slug}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: isDefault ? 0.7 : 0.6,
        })
      }
    }
  }

  return entries
}
