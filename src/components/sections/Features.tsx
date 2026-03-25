interface FeatureItem {
  icon: string
  title: string
  description: string
}

interface FeaturesProps {
  title?: string
  subtitle?: string
  items: FeatureItem[]
  /** Grid columns: 2, 3, or 4 */
  columns?: 2 | 3 | 4
  className?: string
}

const colsClass = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
}

export function Features({
  title,
  subtitle,
  items,
  columns = 3,
  className = '',
}: FeaturesProps) {
  return (
    <section className={`py-16 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {(title || subtitle) && (
          <div className="mb-10 max-w-2xl">
            {title && (
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-2 text-base text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className={`grid gap-6 ${colsClass[columns]}`}>
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/30"
            >
              <div className="mb-3 text-2xl">{item.icon}</div>
              <h3 className="text-base font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
