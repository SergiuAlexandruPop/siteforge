import type { BlogMeta } from '@/types/blog'
import { BlogCard } from './BlogCard'

interface BlogListProps {
  posts: BlogMeta[]
  /** URL prefix: '' for Romanian, '/en' for English */
  basePath: string
}

export function BlogList({ posts, basePath }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-muted/40 p-8 text-center">
        <p className="text-muted-foreground">
          {basePath === '/en'
            ? 'No blog posts available in English yet.'
            : 'Nu există postări pe blog momentan.'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} basePath={basePath} />
      ))}
    </div>
  )
}
