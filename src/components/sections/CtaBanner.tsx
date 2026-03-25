interface CtaBannerProps {
  headline: string
  description?: string
  cta: { label: string; href: string }
  /** Use the primary color as background (default: muted) */
  variant?: 'muted' | 'primary'
  className?: string
}

export function CtaBanner({
  headline,
  description,
  cta,
  variant = 'muted',
  className = '',
}: CtaBannerProps) {
  const isPrimary = variant === 'primary'

  return (
    <section className={`py-16 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div
          className={`rounded-xl px-6 py-10 text-center sm:px-12 sm:py-14 ${
            isPrimary
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted'
          }`}
        >
          <h2
            className={`text-2xl font-bold tracking-tight sm:text-3xl ${
              isPrimary ? '' : 'text-foreground'
            }`}
          >
            {headline}
          </h2>

          {description && (
            <p
              className={`mx-auto mt-3 max-w-xl text-base ${
                isPrimary
                  ? 'text-primary-foreground/80'
                  : 'text-muted-foreground'
              }`}
            >
              {description}
            </p>
          )}

          <div className="mt-8">
            <a
              href={cta.href}
              className={`inline-flex h-11 items-center justify-center rounded-md px-6 text-sm font-medium shadow-sm transition-colors ${
                isPrimary
                  ? 'bg-background text-foreground hover:bg-background/90'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {cta.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
