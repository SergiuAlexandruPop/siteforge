import { getClientConfig } from '@/lib/client-config'
import { AnimatedHero } from './AnimatedHero'
import { RocketBlueprint } from './RocketBlueprint'
import { StatsRow } from './StatsRow'
import { ProjectShowcase } from './ProjectShowcase'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { BlogPreview } from '@/components/sections/BlogPreview'
import { CtaBanner } from './CtaBanner'

// ---------------------------------------------------------------------------
// PortfolioHomePage — Homepage composition for the portfolio client.
// ---------------------------------------------------------------------------
// Section order (Phase 8B):
//   1. AnimatedHero — name, typewriter, 2 CTA buttons, tech marquee
//   2. RocketBlueprint — scroll-driven rocket animation (~120vh)
//   3. StatsRow — trust/credibility metrics (tight spacing)
//   4. ProjectShowcase — wrapped in ScrollReveal (generous spacing)
//   5. BlogPreview — wrapped in ScrollReveal (tighter spacing)
//   6. CtaBanner — closing CTA linking to /contact
//
// Spacing rhythm varies per section — not uniform py-16 on everything.
// Supports i18n via `language` prop.
// ---------------------------------------------------------------------------

interface PortfolioHomePageProps {
  language?: 'ro' | 'en'
}

export async function PortfolioHomePage({ language = 'ro' }: PortfolioHomePageProps) {
  const config = getClientConfig()
  const isEn = language === 'en'

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
        ctas={[
          {
            label: isEn ? 'See my work' : 'Vezi proiectele',
            href: '#projects',
            variant: 'primary',
          },
          {
            label: isEn ? 'Get in touch' : 'Contactează-mă',
            href: isEn ? '/en/contact' : '/contact',
            variant: 'secondary',
          },
        ]}
        language={language}
      />

      <RocketBlueprint language={language} />

      <StatsRow language={language} />

      <ScrollReveal direction="up" delay={0.1}>
        <div id="projects">
          <ProjectShowcase language={language} />
        </div>
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
        <CtaBanner language={language} />
      </ScrollReveal>
    </>
  )
}
