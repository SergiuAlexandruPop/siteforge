import { getClientConfig } from '@/lib/client-config'
import { getBlogBySlug, getBlogSlugs } from '@/lib/content'
import { BlogPost } from '@/components/blog/BlogPost'
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
  const defaultSlugs = getBlogSlugs(getDefaultLanguage())
  const enSlugs = getBlogSlugs(THIS_LANG)
  const allSlugs = [...new Set([...defaultSlugs, ...enSlugs])]
  return allSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (!isLanguageSupported(THIS_LANG)) return {}
  const { slug } = await params
  const post = await getBlogBySlug(slug, THIS_LANG)

  if (!post) return {}

  return {
    title: post.meta.title,
    description: post.meta.excerpt,
    openGraph: {
      title: post.meta.title,
      description: post.meta.excerpt,
      type: 'article',
      publishedTime: post.meta.date,
    },
    alternates: {
      languages: { [getDefaultLanguage()]: `/blog/${slug}` },
    },
  }
}

export default async function EnglishBlogPostPage({ params }: PageProps) {
  if (!isLanguageSupported(THIS_LANG)) notFound()
  const { slug } = await params
  const config = getClientConfig()
  const post = await getBlogBySlug(slug, THIS_LANG)

  if (!post) {
    return <NotAvailable romanianHref={`/blog/${slug}`} />
  }

  const baseUrl = config.domain === 'localhost'
    ? 'http://localhost:3000'
    : `https://${config.domain}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.meta.title,
    description: post.meta.excerpt,
    datePublished: post.meta.date,
    author: {
      '@type': 'Person',
      name: post.meta.author,
    },
    ...(post.meta.featuredImage && { image: post.meta.featuredImage }),
    url: `${baseUrl}/en/blog/${slug}`,
  }

  return (
    <div className="px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPost post={post} />
    </div>
  )
}
