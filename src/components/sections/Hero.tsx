interface HeroButton {
  label: string
  href: string
}

interface HeroProps {
  headline: string
  subtitle?: string
  cta?: HeroButton
  ctaSecondary?: HeroButton
  /** Optional background image URL */
  backgroundImage?: string
  /** Reduce vertical padding — useful when stacking many sections */
  compact?: boolean
  /** Extra CSS classes on the outer wrapper */
  className?: string
  /** Slot for custom content below the buttons (animations, images, etc.) */
  children?: React.ReactNode
}

export function Hero({
  headline,
  subtitle,
  cta,
  ctaSecondary,
  backgroundImage,
  compact = false,
  className = '',
  children,
}: HeroProps) {
  const padding = compact ? 'py-16 sm:py-20' : 'py-20 sm:py-28 lg:py-36'

  return (
    <section
      className={`relative overflow-hidden ${padding} ${className}`}
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      {/* Overlay for background images */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-background/80 dark:bg-background/90" />
      )}

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {headline}
          </h1>

          {subtitle && (
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground sm:text-xl sm:leading-relaxed">
              {subtitle}
            </p>
          )}

          {(cta || ctaSecondary) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {cta && (
                <a
                  href={cta.href}
                  className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                >
                  {cta.label}
                </a>
              )}
              {ctaSecondary && (
                <a
                  href={ctaSecondary.href}
                  className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-background px-6 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
                >
                  {ctaSecondary.label}
                </a>
              )}
            </div>
          )}
        </div>

        {/* Custom content slot */}
        {children && <div className="mt-12">{children}</div>}
      </div>
    </section>
  )
}
