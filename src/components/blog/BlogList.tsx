import type { BlogMeta } from '@/types/blog'
import { BlogCard } from './BlogCard'

// ---------------------------------------------------------------------------
// BlogList — Blog post listing with pinned post support.
// ---------------------------------------------------------------------------
// Phase 8C: If a post has `pinned: true`, it renders as a full-width hero
// card above the grid. The remaining posts render in the standard 3-column
// grid below.
//
// Only the first pinned post is shown as hero (in case multiple are flagged).
// ---------------------------------------------------------------------------

interface BlogListProps {
  posts: BlogMeta[]
  /** URL prefix: '' for Romanian, '/en' for English */
  basePath: string
  /** Language for i18n. */
  language?: 'ro' | 'en'
}

export function BlogList({ posts, basePath, language = 'ro' }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-muted/40 p-8 text-center">
        <p className="text-muted-foreground">
          {language === 'en'
            ? 'No blog posts available in English yet.'
            : 'Nu există postări pe blog momentan.'}
        </p>
      </div>
    )
  }

  // Separate pinned post from the rest
  const pinnedPost = posts.find((p) => p.pinned)
  const regularPosts = pinnedPost
    ? posts.filter((p) => p.slug !== pinnedPost.slug)
    : posts

  return (
    <div className="space-y-8">
      {/* Pinned hero card */}
      {pinnedPost && (
        <BlogCard
          post={pinnedPost}
          basePath={basePath}
          variant="hero"
          language={language}
        />
      )}

      {/* Regular grid */}
      {regularPosts.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {regularPosts.map((post) => (
            <BlogCard
              key={post.slug}
              post={post}
              basePath={basePath}
              language={language}
            />
          ))}
        </div>
      )}
    </div>
  )
}
