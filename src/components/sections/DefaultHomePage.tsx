import { getClientConfig } from '@/lib/client-config'
import { Hero, Features, AboutSnippet, BlogPreview, CtaBanner } from '@/components/sections'

// ---------------------------------------------------------------------------
// DefaultHomePage — The generic homepage composition.
// ---------------------------------------------------------------------------
// Extracted from src/app/page.tsx so it can be used as the fallback in the
// client homepage registry. Any client without a custom homepage gets this.
//
// This is a Server Component (no 'use client') — it can do async data
// fetching for blog previews.
//
// Content is currently hardcoded in Romanian for the portfolio. When more
// clients use this default, content should come from markdown or config.
// For now, this preserves exact parity with the pre-registry page.tsx.
// ---------------------------------------------------------------------------

export async function DefaultHomePage() {
  const config = getClientConfig()

  return (
    <>
      <Hero
        headline="Dezvolt aplicații web moderne"
        subtitle="Full-stack developer din Cluj-Napoca. Construiesc site-uri rapide, optimizate SEO, cu design responsive și blog integrat — pentru afaceri locale care vor prezență online profesională."
        cta={{ label: 'Vezi proiecte', href: '/projects' }}
        ctaSecondary={{ label: 'Contactează-mă', href: '/contact' }}
      />

      <Features
        className="bg-muted/40"
        title="Ce ofer"
        items={[
          {
            icon: '🌐',
            title: 'Site-uri de Prezentare',
            description:
              'Site-uri rapide, mobile-first, cu SEO optimizat. Perfecte pentru cabinete, firme locale, freelanceri.',
          },
          {
            icon: '✍️',
            title: 'Blog & CMS',
            description:
              'Editor vizual integrat pentru articole. Clientul publică singur, fără cunoștințe tehnice.',
          },
          {
            icon: '🚀',
            title: 'Performanță',
            description:
              'Lighthouse 95+, încărcare sub 2 secunde, hosting modern pe Vercel cu deploy automat.',
          },
          {
            icon: '🎨',
            title: 'Design Personalizat',
            description:
              'Fiecare site are propriul brand: culori, fonturi, logo. Dark mode opțional.',
          },
          {
            icon: '📧',
            title: 'Formular Contact',
            description:
              'Mesajele ajung direct pe email. Integrare Smartsupp pentru chat live, opțional.',
          },
          {
            icon: '📊',
            title: 'Analytics',
            description:
              'Google Analytics și Search Console configurate. Știi exact câți vizitatori ai.',
          },
        ]}
        columns={3}
      />

      <AboutSnippet
        title="Despre mine"
        text="Sunt un dezvoltator full-stack în reconversie profesională, pasionat de tehnologie, AI și soluții web moderne. Construiesc SiteForge — un sistem care permite oricărei afaceri locale să aibă un site profesional, rapid și ușor de administrat. Fiecare proiect este o oportunitate de a rezolva o problemă reală."
        cta={{ label: 'Mai multe despre mine', href: '/about' }}
      />

      {config.features.blog && (
        <BlogPreview
          title="Ultimele articole"
          subtitle="Scriu despre tech, dezvoltare web și lecții din tranziția profesională."
          count={3}
          language={config.defaultLanguage}
        />
      )}

      <CtaBanner
        headline="Ai nevoie de un site profesional?"
        description="Contactează-mă pentru o discuție gratuită despre proiectul tău."
        cta={{ label: 'Contactează-mă', href: '/contact' }}
        variant="primary"
      />
    </>
  )
}
