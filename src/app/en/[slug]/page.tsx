import { getClientConfig, getClientPage } from '@/lib/client-config'
import { getPageBySlug, getPageSlugs } from '@/lib/content'
import { ContactForm } from '@/components/contact/ContactForm'
import { NotAvailable } from '@/components/i18n/NotAvailable'
import { getDefaultLanguage, isLanguageSupported } from '@/lib/i18n'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const THIS_LANG = 'en'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  if (!isLanguageSupported(THIS_LANG)) return []
  const defaultSlugs = getPageSlugs(getDefaultLanguage())
  const enSlugs = getPageSlugs(THIS_LANG)
  const allSlugs = [...new Set([...defaultSlugs, ...enSlugs])]
  return allSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (!isLanguageSupported(THIS_LANG)) return {}
  const { slug } = await params
  const page = await getPageBySlug(slug, THIS_LANG)

  if (!page) return {}

  return {
    title: page.frontmatter.title,
    description: page.frontmatter.description,
    openGraph: {
      title: page.frontmatter.title,
      description: page.frontmatter.description,
    },
    alternates: {
      languages: { [getDefaultLanguage()]: `/${slug}` },
    },
  }
}

export default async function EnglishDynamicPage({ params }: PageProps) {
  if (!isLanguageSupported(THIS_LANG)) notFound()
  const { slug } = await params
  const config = getClientConfig()

  const CustomPage = getClientPage(slug)
  if (CustomPage) return <CustomPage language={THIS_LANG} />

  const page = await getPageBySlug(slug, THIS_LANG)

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
