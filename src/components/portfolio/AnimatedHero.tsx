'use client'

import { RotatingText } from '@/components/animations'
import { TechMarquee } from './TechMarquee'

// ---------------------------------------------------------------------------
// AnimatedHero — Premium hero section for the portfolio homepage.
// ---------------------------------------------------------------------------
// Full-viewport hero with:
//   - Static headline prefix + RotatingText cycling word (Decision #56: prop)
//   - Subtitle paragraph
//   - Two CTAs: primary (solid) + secondary (ghost/outline)
//   - Dark mode: radial gradient glow behind headline, CTA button glow
//   - TechMarquee at the bottom of the hero
//   - Mobile-first: stacked layout, responsive font sizes
//
// Design spec: DESIGN.md Section 4 (typography), Section 5 (timing),
// Section 3 (dark mode glow), Section 8 (dark mode special treatments).
//
// This is a client component because RotatingText uses useState/useEffect.
// TechMarquee is imported directly (also client via Marquee).
// ---------------------------------------------------------------------------

interface HeroCta {
  label: string
  href: string
}

interface AnimatedHeroProps {
  /** Static headline text displayed before the rotating word. */
  headline: string
  /** Words that cycle in the RotatingText. Minimum 2 for animation. */
  rotatingWords: string[]
  /** Subtitle paragraph below the headline. */
  subtitle: string
  /** Primary CTA button (solid). */
  cta: HeroCta
  /** Secondary CTA button (ghost/outline). Optional. */
  ctaSecondary?: HeroCta
  className?: string
}

export function AnimatedHero({
  headline,
  rotatingWords,
  subtitle,
  cta,
  ctaSecondary,
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
        <div className="text-center">
          {/* Headline + rotating word */}
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
            {headline}{' '}
            <RotatingText
              words={rotatingWords}
              interval={3000}
              transitionDuration={0.5}
              className="text-primary"
            />
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {subtitle}
          </p>

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
