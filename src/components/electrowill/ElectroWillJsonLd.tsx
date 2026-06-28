import { getClientConfig } from '@/lib/client-config'
import { FAQ_ITEMS } from './content/faq'
import { SERVICE_AREA_COUNTY, SERVICE_AREA_LOCALITIES } from './content/service-area'
import { LEGAL } from './content/legal'

// ---------------------------------------------------------------------------
// ElectroWillJsonLd — client-local structured data (Phase D).
// ---------------------------------------------------------------------------
// Kept OUT of the shared components/seo/JsonLd.tsx (which only emits generic
// Organization + WebSite) so ElectroWill specifics never leak into other
// clients' bundles — co-location convention (DESIGN.md D12). Mounted by HomePage.
//
// Emits two schemas:
//   1. Electrician (a LocalBusiness subtype) — service-area business: areaServed
//      = Bistrița-Năsăud + localities, telephone, email, services. NO address
//      (service-area framing), NO openingHours (unknown — omitted), NO rating
//      (reviews arrive in Phase H).
//   2. FAQPage — built from the same FAQ_ITEMS the visible accordion renders.
// ---------------------------------------------------------------------------

/** International, punctuation-free form for schema `telephone`. */
const TELEPHONE = '+40750447426'

export function ElectroWillJsonLd() {
  const config = getClientConfig()
  const baseUrl =
    config.domain === 'localhost'
      ? 'http://localhost:3000'
      : `https://${config.domain}`

  const electricianSchema = {
    '@context': 'https://schema.org',
    '@type': 'Electrician',
    name: config.displayName,
    legalName: LEGAL.legalName,
    description: config.seo.siteDescription,
    url: baseUrl,
    telephone: TELEPHONE,
    email: config.contact.email,
    taxID: LEGAL.cui,
    identifier: LEGAL.regCom,
    knowsLanguage: 'ro',
    areaServed: [
      { '@type': 'AdministrativeArea', name: SERVICE_AREA_COUNTY },
      ...SERVICE_AREA_LOCALITIES.map((name) => ({ '@type': 'City', name })),
    ],
    makesOffer: [
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Branșamente electrice' },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Proiecte instalații electrice',
        },
      },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(electricianSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}
