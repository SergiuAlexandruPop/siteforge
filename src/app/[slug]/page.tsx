import { getClientConfig } from '@/lib/client-config'
import { getPageBySlug, getPageSlugs } from '@/lib/content'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const config = getClientConfig()
  const slugs = getPageSlugs(config.defaultLanguage)

  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const config = getClientConfig()
  const page = await getPageBySlug(slug, config.defaultLanguage)

  if (!page) return {}

  return {
    title: `${page.frontmatter.title} — ${config.seo.siteName}`,
    description: page.frontmatter.description,
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  const config = getClientConfig()
  const page = await getPageBySlug(slug, config.defaultLanguage)

  if (!page) notFound()

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {page.frontmatter.title}
          </h1>
          {page.frontmatter.description && (
            <p className="mt-2 text-lg text-muted-foreground">
              {page.frontmatter.description}
            </p>
          )}
        </div>

        <div
          className="prose prose-slate max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: page.contentHtml }}
        />
      </div>
    </div>
  )
}
