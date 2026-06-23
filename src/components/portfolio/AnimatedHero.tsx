'use client'

import Link from 'next/link'
import { TypewriterText } from '@/components/animations'
import { TechMarquee } from './TechMarquee'

// ---------------------------------------------------------------------------
// AnimatedHero — Rocket.new-inspired hero for the portfolio homepage.
// ---------------------------------------------------------------------------
// Layout:
//   - Static name as main headline
//   - "Build production ready..." with typewriter cycling words
//   - Two CTA buttons: primary (scroll to projects) + secondary (link to contact)
//   - Dark mode: radial gradient glow behind headline
//   - TechMarquee at the bottom of the hero
//
// Phase 8B: ChatInput replaced with CTA buttons. Visitors arrive via
// LinkedIn/email links — they need clear next actions, not a text box.
// ---------------------------------------------------------------------------

interface CTAButton {
  label: string
  href: string
  variant: 'primary' | 'secondary'
}

interface AnimatedHeroProps {
  /** Main headline — the developer's name. */
  headline: string
  /** Static text before the typewriter. e.g. "Build production ready" */
  staticPrefix: string
  /** Words that cycle with typewriter effect. */
  typewriterWords: string[]
  /** Optional subtitle paragraph below the headline. */
  subtitle?: string
  /** CTA buttons rendered below the typewriter. */
  ctas?: CTAButton[]
  /** Language for i18n. */
  language?: string
  className?: string
}

export function AnimatedHero({
  headline,
  staticPrefix,
  typewriterWords,
  subtitle,
  ctas = [],
  language = 'ro',
  className = '',
}: AnimatedHeroProps) {
  return (
    <section
      className={`relative overflow-hidden ${className}`}
    >
      {/* --- Dark mode radial gradient glow (DESIGN.md Section 3) --- */}
      <div
        className="pointer-events-none absolute inset-0 hidden dark:block"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(178,64,39,0.08) 0%, transparent 60%)',
        }}
      />

      {/* --- Hero content --- */}
      <div className="relative mx-auto max-w-5xl px-4 pb-0 pt-20 sm:px-6 sm:pt-28 lg:pt-36">
        <div className="flex flex-col items-center text-center">
          {/* Name — big, bold, static */}
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl xl:text-8xl">
            {headline}
          </h1>

          {/* Typing line: "Build production ready [typewriter]" */}
          <div className="mt-6 sm:mt-8">
            <p className="text-xl text-muted-foreground sm:text-2xl lg:text-3xl">
              {staticPrefix}{' '}
              <TypewriterText
                words={typewriterWords}
                typingSpeed={70}
                deletingSpeed={40}
                pauseDuration={2200}
                className="font-semibold text-primary"
                cursorClassName="text-primary"
              />
            </p>
          </div>

          {/* Optional subtitle */}
          {subtitle && (
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {subtitle}
            </p>
          )}

          {/* CTA buttons */}
          {ctas.length > 0 && (
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
              {ctas.map((cta) =>
                cta.variant === 'primary' ? (
                  <a
                    key={cta.href}
                    href={cta.href}
                    className="inline-flex h-12 min-w-[180px] items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 dark:shadow-[var(--glow-primary)] sm:text-base"
                  >
                    {cta.label}
                  </a>
                ) : (
                  <Link
                    key={cta.href}
                    href={cta.href}
                    className="inline-flex h-12 min-w-[180px] items-center justify-center rounded-xl border border-border bg-transparent px-6 text-sm font-semibold text-foreground transition-colors hover:bg-muted/50 sm:text-base"
                  >
                    {cta.label}
                  </Link>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- Tech marquee at the bottom of hero --- */}
      <div className="mt-16 sm:mt-20 lg:mt-24">
        <TechMarquee />
      </div>
    </section>
  )
}
