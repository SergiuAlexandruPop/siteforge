import type { ClientConfig } from '@/types/config'

interface JsonLdProps {
  config: ClientConfig
}

/**
 * Renders Organization + WebSite structured data as JSON-LD.
 * Placed in the root layout so every page gets it.
 * Google uses this for rich results and knowledge panels.
 */
export function JsonLd({ config }: JsonLdProps) {
  const baseUrl = config.domain === 'localhost'
    ? 'http://localhost:3000'
    : `https://${config.domain}`

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.displayName,
    url: baseUrl,
    ...(config.contact.email && { email: config.contact.email }),
    ...(config.contact.phone && { telephone: config.contact.phone }),
    ...(config.contact.address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: config.contact.address,
      },
    }),
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.seo.siteName,
    description: config.seo.siteDescription,
    url: baseUrl,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  )
}
