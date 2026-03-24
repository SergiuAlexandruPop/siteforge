import { getClientConfig } from '@/lib/client-config'
import { getBlogBySlug, getBlogSlugs } from '@/lib/content'
import { BlogPost } from '@/components/blog/BlogPost'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = getBlogSlugs('ro')
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const config = getClientConfig()
  const post = await getBlogBySlug(slug, 'ro')

  if (!post) return {}

  const baseUrl = config.domain === 'localhost'
    ? 'http://localhost:3000'
    : `https://${config.domain}`

  return {
    title: post.meta.title,
    description: post.meta.excerpt,
    openGraph: {
      title: post.meta.title,
      description: post.meta.excerpt,
      type: 'article',
      publishedTime: post.meta.date,
      authors: [post.meta.author],
      ...(post.meta.featuredImage && {
        images: [{ url: post.meta.featuredImage }],
      }),
    },
    ...(config.features.i18n && {
      alternates: {
        languages: { en: `/en/blog/${slug}` },
      },
    }),
    other: {
      'article:published_time': post.meta.date,
      'article:author': post.meta.author,
      'article:tag': post.meta.tags.join(', '),
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const config = getClientConfig()
  const post = await getBlogBySlug(slug, 'ro')

  if (!post) notFound()

  const baseUrl = config.domain === 'localhost'
    ? 'http://localhost:3000'
    : `https://${config.domain}`

  // BlogPosting JSON-LD structured data
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
    url: `${baseUrl}/blog/${slug}`,
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
