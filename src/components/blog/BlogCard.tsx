import type { BlogMeta } from '@/types/blog'

// ---------------------------------------------------------------------------
// BlogCard — Blog post preview card.
// ---------------------------------------------------------------------------
// Phase 8C improvements:
//   - Bigger padding (p-5 sm:p-6)
//   - Larger title (text-xl)
//   - Hover scale + shadow lift
//   - Bigger tag pills (text-xs instead of text-[11px])
//   - i18n for reading time label
//   - Supports `variant` for pinned hero card rendering
// ---------------------------------------------------------------------------

interface BlogCardProps {
  post: BlogMeta
  /** URL prefix: '' for Romanian, '/en' for English */
  basePath: string
  /** Display variant. Default 'card' for grid, 'hero' for pinned post. */
  variant?: 'card' | 'hero'
  /** Language for i18n strings. */
  language?: 'ro' | 'en'
}

export function BlogCard({
  post,
  basePath,
  variant = 'card',
  language = 'ro',
}: BlogCardProps) {
  const href = `${basePath}/blog/${post.slug}`
  const isEn = language === 'en'

  const formattedDate = new Date(post.date).toLocaleDateString(
    isEn ? 'en-US' : 'ro-RO',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )

  const readingLabel = isEn ? 'min read' : 'min citire'

  if (variant === 'hero') {
    return (
      <a href={href} className="group block">
        <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg dark:border-border/50 dark:hover:shadow-[var(--glow-primary)] md:flex-row">
          {/* Image — left side on desktop */}
          {post.featuredImage && (
            <div className="aspect-[16/9] overflow-hidden bg-muted md:aspect-auto md:w-5/12">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}

          <div className="flex flex-1 flex-col justify-center p-6 sm:p-8">
            {/* Pinned badge */}
            <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
              </svg>
              {isEn ? 'Pinned' : 'Fixat'}
            </span>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground dark:bg-muted/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h2 className="text-xl font-bold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-2xl">
              {post.title}
            </h2>

            {post.excerpt && (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base line-clamp-3">
                {post.excerpt}
              </p>
            )}

            <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
              <span>{formattedDate}</span>
              <span className="text-border">·</span>
              <span>{post.readingTime} {readingLabel}</span>
            </div>
          </div>
        </article>
      </a>
    )
  }

  // Default card variant
  return (
    <a href={href} className="group block">
      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:scale-[1.02] dark:border-border/50 dark:hover:shadow-[var(--glow-primary)]">
        {/* Featured image */}
        {post.featuredImage && (
          <div className="aspect-[16/9] overflow-hidden bg-muted">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mb-2.5 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h2 className="text-xl font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
              {post.excerpt}
            </p>
          )}

          {/* Meta row */}
          <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
            <span>{formattedDate}</span>
            <span className="text-border">·</span>
            <span>{post.readingTime} {readingLabel}</span>
          </div>
        </div>
      </article>
    </a>
  )
}
