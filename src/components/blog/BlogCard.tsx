import type { BlogMeta } from '@/types/blog'

interface BlogCardProps {
  post: BlogMeta
  /** URL prefix: '' for Romanian, '/en' for English */
  basePath: string
}

export function BlogCard({ post, basePath }: BlogCardProps) {
  const href = `${basePath}/blog/${post.slug}`
  const formattedDate = new Date(post.date).toLocaleDateString('ro-RO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <a href={href} className="group block">
      <article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/30">
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

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h2 className="text-lg font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
              {post.excerpt}
            </p>
          )}

          {/* Meta row */}
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span>{formattedDate}</span>
            <span className="text-border">·</span>
            <span>{post.readingTime} min citire</span>
          </div>
        </div>
      </article>
    </a>
  )
}
