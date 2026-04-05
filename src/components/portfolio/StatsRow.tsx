'use client'

import { CountUp } from '@/components/animations/CountUp'
import { ScrollReveal } from '@/components/animations/ScrollReveal'

// ---------------------------------------------------------------------------
// StatsRow — Trust/credibility stats strip for the portfolio homepage.
// ---------------------------------------------------------------------------
// Displays 3-4 key metrics in a horizontal row. Each stat uses CountUp
// for the number and a label below.
//
// Placed between the RocketBlueprint and ProjectShowcase sections.
// Tighter vertical padding (py-12) to feel like an accent strip, not a
// full section.
//
// Mobile: 2-column grid. Desktop: single row.
// ---------------------------------------------------------------------------

interface Stat {
  value: number
  suffix?: string
  label: string
}

interface StatsRowProps {
  language?: 'ro' | 'en'
  className?: string
}

const stats: Record<'ro' | 'en', Stat[]> = {
  ro: [
    { value: 3, suffix: '+', label: 'Ani de experiență' },
    { value: 10, suffix: '+', label: 'Proiecte livrate' },
    { value: 8, suffix: '+', label: 'Tehnologii stăpânite' },
    { value: 100, suffix: '%', label: 'Cod TypeScript strict' },
  ],
  en: [
    { value: 3, suffix: '+', label: 'Years of experience' },
    { value: 10, suffix: '+', label: 'Projects delivered' },
    { value: 8, suffix: '+', label: 'Technologies mastered' },
    { value: 100, suffix: '%', label: 'Strict TypeScript code' },
  ],
}

export function StatsRow({ language = 'ro', className = '' }: StatsRowProps) {
  const items = stats[language]

  return (
    <section className={`py-12 sm:py-16 ${className}`}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <ScrollReveal direction="up" delay={0}>
          <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
            {items.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  <CountUp target={stat.value} duration={2} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-sm font-medium text-muted-foreground sm:text-base">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
