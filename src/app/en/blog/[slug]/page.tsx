import { getClientConfig } from '@/lib/client-config'
import { getBlogBySlug, getBlogSlugs } from '@/lib/content'
import { BlogPost } from '@/components/blog/BlogPost'
import { NotAvailable } from '@/components/i18n/NotAvailable'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  // Generate for both RO and EN slugs so we can show NotAvailable for RO-only posts
  const roSlugs = getBlogSlugs('ro')
  const enSlugs = getBlogSlugs('en')
  const allSlugs = [...new Set([...roSlugs, ...enSlugs])]
  return allSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogBySlug(slug, 'en')

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
      languages: { ro: `/blog/${slug}` },
    },
  }
}

export default async function EnglishBlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const config = getClientConfig()
  const post = await getBlogBySlug(slug, 'en')

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
