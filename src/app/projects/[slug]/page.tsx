import { projects } from '../../../../clients/portfolio/data/projects'
import { ProjectDetail } from '@/components/portfolio/ProjectDetail'
import { getClientConfig } from '@/lib/client-config'
import { getDefaultLanguage, getSupportedLanguages, localizeHref } from '@/lib/i18n'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

// ---------------------------------------------------------------------------
// /projects/[slug] — Project detail route (Romanian).
// ---------------------------------------------------------------------------
// Statically generates a page for each project in projects.ts.
// Renders the ProjectDetail case study component.
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
    description: project.description,
    openGraph: {
      title: `${project.title} — ${config.seo.siteName}`,
      description: project.description,
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
  const project = projects.find((p) => p.slug === slug)

  if (!project) notFound()

  return <ProjectDetail project={project} language={getDefaultLanguage()} />
}
