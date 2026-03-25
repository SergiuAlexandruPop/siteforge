interface ShowcaseItem {
  title: string
  description?: string
  image?: string
  href?: string
  /** Optional tags shown below the title */
  tags?: string[]
}

interface ShowcaseProps {
  title?: string
  subtitle?: string
  items: ShowcaseItem[]
  /** Grid columns: 2 or 3 */
  columns?: 2 | 3
  className?: string
}

const colsClass = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
}

export function Showcase({
  title,
  subtitle,
  items,
  columns = 2,
  className = '',
}: ShowcaseProps) {
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
          {items.map((item) => {
            const content = (
              <div className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/30">
                {/* Image */}
                {item.image && (
                  <div className="aspect-[16/10] overflow-hidden bg-muted">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  )}

                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )

            if (item.href) {
              return (
                <a key={item.title} href={item.href} className="block">
                  {content}
                </a>
              )
            }

            return <div key={item.title}>{content}</div>
          })}
        </div>
      </div>
    </section>
  )
}
