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
// Mobile: single column (stacked). Desktop (sm+): 3-column row.
// ---------------------------------------------------------------------------

interface Stat {
  value: number
  suffix?: string
  label: string
}

interface StatsRowProps {
  language?: string
  className?: string
}

const stats: Record<string, Stat[]> = {
  ro: [
    { value: 5, suffix: '+', label: 'Ani de experiență' },
    { value: 4, suffix: '+', label: 'Industrii livrate' },
    { value: 100, suffix: '%', label: 'Cod type-safe' },
  ],
  en: [
    { value: 5, suffix: '+', label: 'Years of experience' },
    { value: 4, suffix: '+', label: 'Industries delivered in' },
    { value: 100, suffix: '%', label: 'Type-safe code' },
  ],
}

export function StatsRow({ language = 'ro', className = '' }: StatsRowProps) {
  const items = stats[language] ?? stats.ro

  return (
    <section className={`py-12 sm:py-16 ${className}`}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <ScrollReveal direction="up" delay={0}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
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
