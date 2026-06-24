import { getClientConfig, getClientPage } from '@/lib/client-config'
import { getPageBySlug, getPageSlugs } from '@/lib/content'
import { ContactForm } from '@/components/contact/ContactForm'
import { getDefaultLanguage, getSupportedLanguages, localizeHref } from '@/lib/i18n'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

// ---------------------------------------------------------------------------
// Root-level [slug] routes serve the client's default language.
// Non-default languages are served by /<lang>/[slug]/page.tsx (currently /en).
// ---------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = getPageSlugs(getDefaultLanguage())
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const config = getClientConfig()
  const page = await getPageBySlug(slug, getDefaultLanguage())

  if (!page) return {}

  return {
    title: page.frontmatter.title,
    description: page.frontmatter.description,
    openGraph: {
      title: page.frontmatter.title,
      description: page.frontmatter.description,
    },
    ...(config.features.i18n && {
      alternates: {
        languages: Object.fromEntries(
          getSupportedLanguages()
            .filter((lang) => lang !== getDefaultLanguage())
            .map((lang) => [lang, localizeHref(`/${slug}`, lang)])
        ),
      },
    }),
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  const config = getClientConfig()

  const CustomPage = getClientPage(slug)
  if (CustomPage) return <CustomPage language={getDefaultLanguage()} />

  const page = await getPageBySlug(slug, getDefaultLanguage())

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

        {slug === 'contact' && config.features.contactForm && (
          <div className="mt-8 max-w-lg">
            <ContactForm language={getDefaultLanguage()} />
          </div>
        )}
      </div>
    </div>
  )
}
