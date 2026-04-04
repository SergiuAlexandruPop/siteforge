import { projects } from '../../../../../clients/portfolio/data/projects'
import { ProjectDetail } from '@/components/portfolio/ProjectDetail'
import { getClientConfig } from '@/lib/client-config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

// ---------------------------------------------------------------------------
// /en/projects/[slug] — Project detail route (English).
// ---------------------------------------------------------------------------
// Same as the Romanian route but passes language="en" to ProjectDetail.
// ---------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)

  if (!project) return {}

  const config = getClientConfig()

  return {
    title: `${project.title} — ${config.seo.siteName}`,
    description: project.descriptionEn,
    openGraph: {
      title: `${project.title} — ${config.seo.siteName}`,
      description: project.descriptionEn,
    },
    alternates: {
      languages: { ro: `/projects/${slug}` },
    },
  }
}

export default async function EnglishProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)

  if (!project) notFound()

  return <ProjectDetail project={project} language="en" />
}
