import { getAllBlogPosts } from '@/lib/content'
import { BlogCard } from '@/components/blog/BlogCard'

interface BlogPreviewProps {
  title?: string
  subtitle?: string
  /** Number of posts to show (default: 3) */
  count?: number
  language?: 'ro' | 'en'
  className?: string
}

export async function BlogPreview({
  title = 'Blog',
  subtitle,
  count = 3,
  language = 'ro',
  className = '',
}: BlogPreviewProps) {
  const posts = await getAllBlogPosts(language)
  const latestPosts = posts.slice(0, count)

  if (latestPosts.length === 0) return null

  const basePath = language === 'en' ? '/en' : ''

  return (
    <section className={`py-16 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
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

          <a
            href={`${basePath}/blog`}
            className="hidden text-sm font-medium text-primary hover:text-primary/80 transition-colors sm:block"
          >
            Toate articolele →
          </a>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latestPosts.map((post) => (
            <BlogCard key={post.meta.slug} post={post.meta} basePath={basePath} />
          ))}
        </div>

        {/* Mobile "see all" link */}
        <div className="mt-6 text-center sm:hidden">
          <a
            href={`${basePath}/blog`}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Toate articolele →
          </a>
        </div>
      </div>
    </section>
  )
}
