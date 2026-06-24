import { activeClient } from '@/lib/active-client.generated'
import { getClientConfig } from '@/lib/client-config'
import { getDefaultLanguage, getSupportedLanguages, localizeHref } from '@/lib/i18n'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

// ---------------------------------------------------------------------------
// /projects/[slug] — Project detail route (Romanian).
// ---------------------------------------------------------------------------
// Client-agnostic: delegates entirely to the active client's projectDetail
// capability (clients/<name>/index.ts). Clients without projects omit the
// capability, so this route generates no pages and imports no client code.
// ---------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return (activeClient.projectDetail?.slugs ?? []).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const meta = activeClient.projectDetail?.getMetadata(slug, getDefaultLanguage())

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
    ...(config.features.i18n && {
      alternates: {
        languages: Object.fromEntries(
          getSupportedLanguages()
            .filter((lang) => lang !== getDefaultLanguage())
            .map((lang) => [lang, localizeHref(`/projects/${slug}`, lang)])
        ),
      },
    }),
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const pd = activeClient.projectDetail

  if (!pd) notFound()

  const { Component } = pd
  return <Component slug={slug} language={getDefaultLanguage()} />
}
