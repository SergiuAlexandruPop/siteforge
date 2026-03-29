import { getClientConfig } from '@/lib/client-config'
import { AnimatedHero } from './AnimatedHero'
import { ProjectShowcase } from './ProjectShowcase'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { BlogPreview } from '@/components/sections/BlogPreview'
import { CtaBanner } from '@/components/sections/CtaBanner'

// ---------------------------------------------------------------------------
// PortfolioHomePage — Homepage composition for the portfolio client.
// ---------------------------------------------------------------------------
// Inspired by rocket.new — clean hero with name + typewriter effect.
//
// Section order:
//   1. AnimatedHero — rocket GIF, name, "Build production ready [typewriter]"
//   2. ProjectShowcase — wrapped in ScrollReveal
//   3. BlogPreview — wrapped in ScrollReveal (gated by features.blog)
//   4. CtaBanner — wrapped in ScrollReveal
//
// Supports i18n via `language` prop — all hardcoded strings are translated.
// ---------------------------------------------------------------------------

interface PortfolioHomePageProps {
  language?: 'ro' | 'en'
}

export async function PortfolioHomePage({ language = 'ro' }: PortfolioHomePageProps) {
  const config = getClientConfig()
  const isEn = language === 'en'
  const prefix = isEn ? '/en' : ''

  return (
    <>
      <AnimatedHero
        headline="Sergiu Pop"
        staticPrefix={isEn ? 'Build production ready' : 'Construiesc'}
        typewriterWords={
          isEn
            ? ['web app.', 'internal tool.', 'dashboard.', 'website.', 'landing page.']
            : ['aplicații web.', 'unelte interne.', 'tablouri de bord.', 'site-uri.', 'pagini de prezentare.']
        }
        rocketImage="/rocket.gif"
        cta={{ label: isEn ? 'View projects' : 'Vezi proiecte', href: `${prefix}/projects` }}
        ctaSecondary={{ label: isEn ? 'Contact me' : 'Contactează-mă', href: `${prefix}/contact` }}
      />

      <ScrollReveal direction="up" delay={0.1}>
        <ProjectShowcase language={language} />
      </ScrollReveal>

      {config.features.blog && (
        <ScrollReveal direction="up" delay={0.1}>
          <BlogPreview
            title={isEn ? 'Latest articles' : 'Ultimele articole'}
            subtitle={
              isEn
                ? 'Writing about tech, web development and lessons from career transition.'
                : 'Scriu despre tech, dezvoltare web și lecții din tranziția profesională.'
            }
            count={3}
            language={language}
            className="bg-muted/30 dark:bg-transparent"
          />
        </ScrollReveal>
      )}

      <ScrollReveal direction="up" delay={0}>
        <CtaBanner
          headline={isEn ? 'Need a professional website?' : 'Ai nevoie de un site profesional?'}
          description={
            isEn
              ? 'Contact me for a free discussion about your project.'
              : 'Contactează-mă pentru o discuție gratuită despre proiectul tău.'
          }
          cta={{ label: isEn ? 'Contact me' : 'Contactează-mă', href: `${prefix}/contact` }}
          variant="primary"
        />
      </ScrollReveal>
    </>
  )
}
