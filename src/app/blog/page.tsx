import { getClientConfig } from '@/lib/client-config'
import { getAllBlogPosts } from '@/lib/content'
import { BlogList } from '@/components/blog/BlogList'
import { getDefaultLanguage, getSupportedLanguages, localizeHref } from '@/lib/i18n'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const config = getClientConfig()

  return {
    title: 'Blog',
    description: `Blog ${config.displayName}`,
    ...(config.features.i18n && {
      alternates: {
        languages: Object.fromEntries(
          getSupportedLanguages()
            .filter((lang) => lang !== getDefaultLanguage())
            .map((lang) => [lang, localizeHref('/blog', lang)])
        ),
      },
    }),
  }
}

export default async function BlogPage() {
  const posts = await getAllBlogPosts(getDefaultLanguage())

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10 sm:mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Blog
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Scriu despre tech, AI, business, sănătate, stoicism și lecții din viață.
        </p>
      </div>

      <BlogList posts={posts.map((p) => p.meta)} basePath="" language="ro" />
    </div>
  )
}
