'use client'

import { TypewriterText } from '@/components/animations'
import { TechMarquee } from './TechMarquee'
import { ChatInput } from './ChatInput'

// ---------------------------------------------------------------------------
// AnimatedHero — Rocket.new-inspired hero for the portfolio homepage.
// ---------------------------------------------------------------------------
// Layout:
//   - Static name as main headline
//   - "Build production ready..." with typewriter cycling words
//   - Chat input (Smartsupp/WhatsApp integration)
//   - Dark mode: radial gradient glow behind headline
//   - TechMarquee at the bottom of the hero
//
// Inspired by https://www.rocket.new/
// ---------------------------------------------------------------------------

interface AnimatedHeroProps {
  /** Main headline — the developer's name. */
  headline: string
  /** Static text before the typewriter. e.g. "Build production ready" */
  staticPrefix: string
  /** Words that cycle with typewriter effect. */
  typewriterWords: string[]
  /** Optional subtitle paragraph below the headline. */
  subtitle?: string
  /** Language for i18n. */
  language?: 'ro' | 'en'
  className?: string
}

export function AnimatedHero({
  headline,
  staticPrefix,
  typewriterWords,
  subtitle,
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
            'radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.08) 0%, transparent 60%)',
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

          {/* Chat input */}
          <div className="mt-10 w-full">
            <ChatInput language={language} />
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
