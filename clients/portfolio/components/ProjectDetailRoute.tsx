import { notFound } from 'next/navigation'
import { ProjectDetail } from '@/components/portfolio/ProjectDetail'
import type { Language } from '@/types/config'
import { projects } from '../data/projects'

// ---------------------------------------------------------------------------
// Portfolio — project-detail route wrapper.
// ---------------------------------------------------------------------------
// This is the single place portfolio's project data + ProjectDetail component
// enter the route graph. The shared /projects/[slug] routes reach it only via
// activeClient.projectDetail, so neither the data nor the component leak into
// other clients' bundles.
//
// Server component (no 'use client'): owns the lookup + notFound(), then renders
// the client ProjectDetail. notFound() is server-only, so this must stay server.
// ---------------------------------------------------------------------------

export default function ProjectDetailRoute({
  slug,
  language,
}: {
  slug: string
  language: Language
}) {
  const project = projects.find((p) => p.slug === slug)

  if (!project) notFound()

  return <ProjectDetail project={project} language={language} />
}
