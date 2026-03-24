import { getClientConfig } from '@/lib/client-config'
import { getAllBlogPosts } from '@/lib/content'
import { BlogList } from '@/components/blog/BlogList'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const config = getClientConfig()

  return {
    title: 'Blog',
    description: `Blog ${config.displayName}`,
    ...(config.features.i18n && {
      alternates: {
        languages: { en: '/en/blog' },
      },
    }),
  }
}

export default async function BlogPage() {
  const posts = await getAllBlogPosts('ro')

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Blog
        </h1>
      </div>

      <BlogList posts={posts.map((p) => p.meta)} basePath="" />
    </div>
  )
}
