import type { BlogPost as BlogPostType } from '@/types/blog'

interface BlogPostProps {
  post: BlogPostType
}

export function BlogPost({ post }: BlogPostProps) {
  const { meta, contentHtml } = post
  const formattedDate = new Date(meta.date).toLocaleDateString('ro-RO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className="mx-auto max-w-[680px]">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
          {meta.title}
        </h1>

        {meta.excerpt && (
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
            {meta.excerpt}
          </p>
        )}

        {/* Author + meta bar */}
        <div className="mt-6 flex items-center gap-3 border-b border-border pb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {meta.author.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{meta.author}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{formattedDate}</span>
              <span>·</span>
              <span>{meta.readingTime} min citire</span>
            </div>
          </div>
        </div>
      </header>

      {/* Featured image */}
      {meta.featuredImage && (
        <div className="mb-8 overflow-hidden rounded-lg">
          <img
            src={meta.featuredImage}
            alt={meta.title}
            className="w-full"
          />
        </div>
      )}

      {/* Content — Medium-style typography */}
      <div
        className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-[1.8] prose-p:text-foreground/90 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-blockquote:border-primary/50 prose-blockquote:text-muted-foreground"
        style={{ fontFamily: 'Georgia, serif' }}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      {/* Tags */}
      {meta.tags.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-6">
          {meta.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
