import { getClientConfig } from '@/lib/client-config'
import { getClientPage } from '@/lib/client-pages'
import { getPageBySlug, getPageSlugs } from '@/lib/content'
import { ContactForm } from '@/components/contact/ContactForm'
import { NotAvailable } from '@/components/i18n/NotAvailable'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  // Generate params for all Romanian slugs — English pages that don't exist
  // will show the NotAvailable placeholder instead of 404
  const config = getClientConfig()
  const roSlugs = getPageSlugs('ro')
  const enSlugs = getPageSlugs('en')

  // Union of both so we cover all possible slugs
  const allSlugs = [...new Set([...roSlugs, ...enSlugs])]
  return allSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug(slug, 'en')

  if (!page) return {}

  return {
    title: page.frontmatter.title,
    description: page.frontmatter.description,
    openGraph: {
      title: page.frontmatter.title,
      description: page.frontmatter.description,
    },
    alternates: {
      languages: { ro: `/${slug}` },
    },
  }
}

export default async function EnglishDynamicPage({ params }: PageProps) {
  const { slug } = await params
  const config = getClientConfig()

  const CustomPage = getClientPage(config.name, slug)
  if (CustomPage) return <CustomPage language="en" />

  const page = await getPageBySlug(slug, 'en')

  if (!page) {
    return <NotAvailable romanianHref={`/${slug}`} />
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

        {slug === 'contact' && config.features.contactForm && (
          <div className="mt-8 max-w-lg">
            <ContactForm />
          </div>
        )}
      </div>
    </div>
  )
}
