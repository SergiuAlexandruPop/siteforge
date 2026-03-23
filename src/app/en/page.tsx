import { getClientConfig } from '@/lib/client-config'
import { getHomePage } from '@/lib/content'
import { NotAvailable } from '@/components/i18n/NotAvailable'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const config = getClientConfig()
  const page = await getHomePage('en')

  return {
    title: page?.frontmatter.title ?? config.seo.siteName,
    description: page?.frontmatter.description ?? config.seo.siteDescription,
    alternates: {
      languages: { ro: '/' },
    },
  }
}

export default async function EnglishHomePage() {
  const page = await getHomePage('en')

  if (!page) {
    return <NotAvailable romanianHref="/" />
  }

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
