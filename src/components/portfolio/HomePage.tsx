import { getClientConfig } from '@/lib/client-config'
import { AnimatedHero } from './AnimatedHero'
import { TabbedServices } from './TabbedServices'
import { ProjectShowcase } from './ProjectShowcase'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { BlogPreview } from '@/components/sections/BlogPreview'
import { CtaBanner } from '@/components/sections/CtaBanner'

// ---------------------------------------------------------------------------
// PortfolioHomePage — Homepage composition for the portfolio client.
// ---------------------------------------------------------------------------
// Server component (async) — can fetch blog posts for BlogPreview.
//
// Section order per DESIGN.md Section 7:
//   1. AnimatedHero — no ScrollReveal (always visible, above fold)
//   2. TabbedServices — wrapped in ScrollReveal
//   3. ProjectShowcase — wrapped in ScrollReveal (staggered delay)
//   4. BlogPreview — wrapped in ScrollReveal (gated by features.blog)
//   5. CtaBanner — wrapped in ScrollReveal
//
// DESIGN.md Section 6 data flow:
//   ScrollReveal wraps each section from outside (SRP — sections don't
//   know they're being animated). AnimatedHero is NOT wrapped because
//   it's above the fold and should be visible immediately.
//
// Decision #56: rotatingWords passed as prop to AnimatedHero.
// ---------------------------------------------------------------------------

export async function PortfolioHomePage() {
  const config = getClientConfig()

  return (
    <>
      <AnimatedHero
        headline="Construiesc"
        rotatingWords={[
          'site-uri moderne',
          'aplicații web',
          'experiențe digitale',
          'soluții performante',
        ]}
        subtitle="Full-stack developer cu pasiune pentru design, performanță și cod curat. Transform ideile în produse web rapide, optimizate SEO, cu focus pe experiența utilizatorului."
        cta={{ label: 'Vezi proiecte', href: '/projects' }}
        ctaSecondary={{ label: 'Contactează-mă', href: '/contact' }}
      />

      <ScrollReveal direction="up" delay={0}>
        <TabbedServices className="bg-muted/30 dark:bg-transparent" />
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.1}>
        <ProjectShowcase />
      </ScrollReveal>

      {config.features.blog && (
        <ScrollReveal direction="up" delay={0.1}>
          <BlogPreview
            title="Ultimele articole"
            subtitle="Scriu despre tech, dezvoltare web și lecții din tranziția profesională."
            count={3}
            language={config.defaultLanguage}
            className="bg-muted/30 dark:bg-transparent"
          />
        </ScrollReveal>
      )}

      <ScrollReveal direction="up" delay={0}>
        <CtaBanner
          headline="Ai nevoie de un site profesional?"
          description="Contactează-mă pentru o discuție gratuită despre proiectul tău."
          cta={{ label: 'Contactează-mă', href: '/contact' }}
          variant="primary"
        />
      </ScrollReveal>
    </>
  )
}
