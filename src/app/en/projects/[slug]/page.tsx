import { activeClient } from '@/lib/active-client.generated'
import { getClientConfig } from '@/lib/client-config'
import { getDefaultLanguage, isLanguageSupported } from '@/lib/i18n'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const THIS_LANG = 'en'

// ---------------------------------------------------------------------------
// /en/projects/[slug] — Project detail route (English).
// ---------------------------------------------------------------------------
// Same as the Romanian route but passes language="en". Client-agnostic:
// delegates to the active client's projectDetail capability.
// ---------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  if (!isLanguageSupported(THIS_LANG)) return []
  return (activeClient.projectDetail?.slugs ?? []).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (!isLanguageSupported(THIS_LANG)) return {}
  const { slug } = await params
  const meta = activeClient.projectDetail?.getMetadata(slug, THIS_LANG)

  if (!meta) return {}

  const config = getClientConfig()
  const fullTitle = `${meta.title} — ${config.seo.siteName}`

  return {
    title: fullTitle,
    description: meta.description,
    openGraph: {
      title: fullTitle,
      description: meta.description,
    },
    alternates: {
      languages: { [getDefaultLanguage()]: `/projects/${slug}` },
    },
  }
}

export default async function EnglishProjectPage({ params }: PageProps) {
  if (!isLanguageSupported(THIS_LANG)) notFound()
  const { slug } = await params
  const pd = activeClient.projectDetail

  if (!pd) notFound()

  const { Component } = pd
  return <Component slug={slug} language={THIS_LANG} />
}
