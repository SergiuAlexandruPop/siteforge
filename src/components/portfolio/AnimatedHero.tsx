'use client'

import { TypewriterText } from '@/components/animations'
import { TechMarquee } from './TechMarquee'

// ---------------------------------------------------------------------------
// AnimatedHero — Rocket.new-inspired hero for the portfolio homepage.
// ---------------------------------------------------------------------------
// Layout:
//   - Rocket GIF on the left (or stacked on top for mobile)
//   - Static name as main headline
//   - "Build production ready..." with typewriter cycling words
//   - Two CTAs: primary (solid) + secondary (ghost/outline)
//   - Dark mode: radial gradient glow behind headline, CTA button glow
//   - TechMarquee at the bottom of the hero
//
// Inspired by https://www.rocket.new/
// ---------------------------------------------------------------------------

interface HeroCta {
  label: string
  href: string
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
  /** Primary CTA button (solid). */
  cta: HeroCta
  /** Secondary CTA button (ghost/outline). Optional. */
  ctaSecondary?: HeroCta
  /** Path to the rocket GIF or image. */
  rocketImage?: string
  className?: string
}

export function AnimatedHero({
  headline,
  staticPrefix,
  typewriterWords,
  subtitle,
  cta,
  ctaSecondary,
  rocketImage,
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
            'radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.08) 0%, transparent 60%)',
        }}
      />

      {/* --- Hero content --- */}
      <div className="relative mx-auto max-w-5xl px-4 pb-0 pt-20 sm:px-6 sm:pt-28 lg:pt-36">
        <div className="flex flex-col items-center text-center">
          {/* Rocket GIF */}
          {rocketImage && (
            <div className="mb-6 sm:mb-8">
              <img
                src={rocketImage}
                alt=""
                className="h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40 object-contain"
                aria-hidden="true"
              />
            </div>
          )}

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

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={cta.href}
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 dark:shadow-[var(--glow-primary)] dark:hover:shadow-[0_0_100px_rgba(37,99,235,0.25)]"
            >
              {cta.label}
            </a>

            {ctaSecondary && (
              <a
                href={ctaSecondary.href}
                className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-transparent px-8 text-sm font-semibold text-foreground transition-colors hover:bg-muted dark:border-border/50 dark:hover:bg-muted/50"
              >
                {ctaSecondary.label}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* --- Tech marquee at the bottom of hero --- */}
      <div className="mt-16 sm:mt-20 lg:mt-24">
        <TechMarquee />
      </div>
    </section>
  )
}
