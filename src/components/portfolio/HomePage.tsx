import { getClientConfig } from '@/lib/client-config'
import { AnimatedHero } from './AnimatedHero'
import { RocketBlueprint } from './RocketBlueprint'
import { ProjectShowcase } from './ProjectShowcase'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { BlogPreview } from '@/components/sections/BlogPreview'
import { ContactForm } from '@/components/contact/ContactForm'

// ---------------------------------------------------------------------------
// PortfolioHomePage — Homepage composition for the portfolio client.
// ---------------------------------------------------------------------------
// Inspired by rocket.new — clean hero with name + typewriter + chat input.
//
// Section order:
//   1. AnimatedHero — name, typewriter, chat input, tech marquee
//   2. AnimationPlaceholder — gradient placeholder for future scroll animation
//   3. ProjectShowcase — wrapped in ScrollReveal
//   4. BlogPreview — wrapped in ScrollReveal (gated by features.blog)
//   5. Contact section — heading + ContactForm with i18n
//
// Supports i18n via `language` prop — all hardcoded strings are translated.
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
        language={language}
      />

      <RocketBlueprint language={language} />

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
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Contact
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
                {isEn
                  ? 'Have a project in mind? Send me a message and I\'ll get back to you.'
                  : 'Ai un proiect în minte? Trimite-mi un mesaj și revin cu un răspuns.'}
              </p>
            </div>
            <div className="mx-auto mt-10 max-w-xl">
              <ContactForm language={language} />
            </div>
          </div>
        </section>
      </ScrollReveal>
    </>
  )
}
