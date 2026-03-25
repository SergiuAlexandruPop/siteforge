'use client'

import { useState } from 'react'

// ---------------------------------------------------------------------------
// TabbedServices — "Ce ofer" section with tabbed content panels.
// ---------------------------------------------------------------------------
// Desktop (md+): horizontal tab bar with content panel below.
// Mobile (< md): vertical accordion — each tab header is clickable,
//   expands/collapses its content.
//
// Dark mode (DESIGN.md Section 8):
//   - Active tab indicator glow
//   - Card borders subtly brighter
//
// Both layouts are rendered in the DOM; Tailwind `hidden md:block` /
// `md:hidden` toggles visibility. No resize listener needed.
//
// Content is hardcoded in Romanian (Decision #27: admin/internal content
// stays Romanian). If i18n is needed for services in the future, extract
// to a data file like projects.ts.
// ---------------------------------------------------------------------------

interface ServiceTab {
  title: string
  description: string
  features: string[]
}

const services: ServiceTab[] = [
  {
    title: 'Site-uri de Prezentare',
    description:
      'Site-uri rapide, mobile-first, cu SEO optimizat. Perfecte pentru cabinete, firme locale, freelanceri.',
    features: [
      'Design responsive — arată perfect pe orice ecran',
      'SEO on-page — meta tags, sitemap, structured data',
      'Performanță Lighthouse 95+ — încărcare sub 2 secunde',
      'Dark mode opțional cu tratament premium',
    ],
  },
  {
    title: 'Blog & CMS',
    description:
      'Editor vizual integrat pentru articole. Clientul publică singur, fără cunoștințe tehnice.',
    features: [
      'Editor WYSIWYG în stil Medium — bold, italic, imagini, headings',
      'Upload de imagini cu optimizare automată (WebP, resize)',
      'Dashboard de administrare protejat cu autentificare',
      'Suport pentru articole în română și engleză',
    ],
  },
  {
    title: 'Aplicații Web',
    description:
      'Aplicații custom cu funcționalități avansate: autentificare, bază de date, API-uri, dashboard-uri.',
    features: [
      'Autentificare securizată (JWT, OAuth)',
      'Bază de date Supabase / PostgreSQL',
      'API-uri REST sau Server Actions',
      'Dashboard-uri interactive cu grafice și filtre',
    ],
  },
  {
    title: 'Mentenanță & Support',
    description:
      'Suport tehnic continuu, actualizări de securitate, monitorizare și optimizare.',
    features: [
      'Actualizări lunare de dependințe și securitate',
      'Monitorizare uptime și performanță',
      'Backup automat al conținutului',
      'Suport prioritar prin email sau chat',
    ],
  },
]

interface TabbedServicesProps {
  className?: string
}

export function TabbedServices({ className = '' }: TabbedServicesProps) {
  const [activeTab, setActiveTab] = useState(0)
  // For mobile accordion: -1 means none expanded
  const [expandedMobile, setExpandedMobile] = useState(-1)

  const toggleMobile = (index: number) => {
    setExpandedMobile((prev) => (prev === index ? -1 : index))
  }

  return (
    <section className={`py-16 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Section heading */}
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Ce ofer
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Servicii complete de dezvoltare web, de la design la deployment.
          </p>
        </div>

        {/* ============================================================
            DESKTOP: Horizontal tabs (md+)
            ============================================================ */}
        <div className="hidden md:block">
          {/* Tab bar */}
          <div className="flex border-b border-border">
            {services.map((service, index) => (
              <button
                key={service.title}
                type="button"
                onClick={() => setActiveTab(index)}
                className={`relative flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === index
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {service.title}
                {/* Active indicator line + dark glow */}
                {activeTab === index && (
                  <span
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-primary dark:shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                    aria-hidden="true"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Content panel */}
          <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6 dark:border-border/50 dark:bg-muted/20 sm:p-8">
            <p className="mb-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {services[activeTab].description}
            </p>
            <ol className="space-y-3">
              {services[activeTab].features.map((feature, i) => (
                <li key={i} className="flex gap-3 text-sm text-foreground sm:text-base">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  {feature}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* ============================================================
            MOBILE: Accordion (< md)
            ============================================================ */}
        <div className="space-y-3 md:hidden">
          {services.map((service, index) => {
            const isExpanded = expandedMobile === index

            return (
              <div
                key={service.title}
                className="rounded-xl border border-border dark:border-border/50"
              >
                <button
                  type="button"
                  onClick={() => toggleMobile(index)}
                  className="flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium text-foreground"
                >
                  {service.title}
                  <svg
                    className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isExpanded && (
                  <div className="border-t border-border/50 px-4 pb-4 pt-3">
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                    <ol className="space-y-2">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex gap-3 text-sm text-foreground">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {i + 1}
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
