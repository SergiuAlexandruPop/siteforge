interface AnimationPlaceholderProps {
  language?: 'ro' | 'en'
  className?: string
}

export function AnimationPlaceholder({
  language = 'ro',
  className = '',
}: AnimationPlaceholderProps) {
  const isEn = language === 'en'

  return (
    <section
      className={`relative min-h-[400px] overflow-hidden ${className}`}
    >
      {/* Gradient background */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-muted/40 via-muted/20 to-transparent dark:from-muted/20 dark:via-muted/10 dark:to-transparent"
        aria-hidden="true"
      />

      {/* Radial glow overlay */}
      <div
        className="pointer-events-none absolute inset-0 hidden dark:block"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(37,99,235,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative flex min-h-[400px] flex-col items-center justify-center px-4 text-center">
        {/* Decorative dots/grid */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          aria-hidden="true"
          style={{
            backgroundImage:
              'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative">
          <p className="text-lg font-medium text-muted-foreground sm:text-xl">
            {isEn ? 'Scroll animation coming soon' : 'Animație scroll în curând'}
          </p>
          <p className="mt-2 text-sm text-muted-foreground/60">
            {isEn
              ? 'An interactive experience is being built for this section'
              : 'O experiență interactivă este în construcție pentru această secțiune'}
          </p>
        </div>
      </div>
    </section>
  )
}
