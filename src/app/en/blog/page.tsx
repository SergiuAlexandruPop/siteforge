import { getAllBlogPosts } from '@/lib/content'
import { BlogList } from '@/components/blog/BlogList'
import { getDefaultLanguage, isLanguageSupported } from '@/lib/i18n'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const THIS_LANG = 'en'

export async function generateMetadata(): Promise<Metadata> {
  if (!isLanguageSupported(THIS_LANG)) return {}
  return {
    title: 'Blog',
    alternates: {
      languages: { [getDefaultLanguage()]: '/blog' },
    },
  }
}

export default async function EnglishBlogPage() {
  if (!isLanguageSupported(THIS_LANG)) notFound()
  const posts = await getAllBlogPosts(THIS_LANG)

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10 sm:mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Blog
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Writing about tech, AI, business, health, stoicism, and life lessons.
        </p>
      </div>

      <BlogList posts={posts.map((p) => p.meta)} basePath="/en" language="en" />
    </div>
  )
}
