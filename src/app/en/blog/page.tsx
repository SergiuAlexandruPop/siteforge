import { getAllBlogPosts } from '@/lib/content'
import { BlogList } from '@/components/blog/BlogList'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Blog',
    alternates: {
      languages: { ro: '/blog' },
    },
  }
}

export default async function EnglishBlogPage() {
  const posts = await getAllBlogPosts('en')

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Blog
        </h1>
      </div>

      <BlogList posts={posts.map((p) => p.meta)} basePath="/en" />
    </div>
  )
}
