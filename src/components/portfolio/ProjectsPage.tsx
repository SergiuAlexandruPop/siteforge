'use client'

import Link from 'next/link'
import { projects } from '../../../clients/portfolio/data/projects'
import type { Project } from '../../../clients/portfolio/data/projects'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import {
  NextjsIcon,
  TypeScriptIcon,
  TailwindIcon,
  ReactIcon,
  SupabaseIcon,
  NodejsIcon,
} from './icons'

// ---------------------------------------------------------------------------
// ProjectsPage — Full projects page with vertical stack layout.
// ---------------------------------------------------------------------------
// Three wide horizontal cards stacked vertically, alternating image/content
// sides (left-right-left). Each card leads with a value-first impact headline,
// has a type badge, description, stat pills, tech icons, and a CTA button
// linking to the detail sub-route.
//
// Supports i18n via `language` prop.
// Dark mode: card hover glow, gradient image placeholder.
// Mobile: stacks to single column naturally.
// ---------------------------------------------------------------------------

// Maps tech names to icon components. Returns null for techs without an icon.
const techIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'Next.js': NextjsIcon,
  TypeScript: TypeScriptIcon,
  'Tailwind CSS': TailwindIcon,
  React: ReactIcon,
  Supabase: SupabaseIcon,
  'Node.js': NodejsIcon,
}

interface ProjectsPageProps {
  language?: 'ro' | 'en'
}

function ProjectCard({
  project,
  isEn,
  reversed,
}: {
  project: Project
  isEn: boolean
  reversed: boolean
}) {
  const headline = isEn ? project.impactHeadlineEn : project.impactHeadline
  const description = isEn ? project.descriptionEn : project.description
  const badge = isEn ? project.typeBadgeEn : project.typeBadge
  const stats = project.stats.map((s) => (isEn ? s.labelEn : s.label))
  const isPrivate = !project.liveUrl

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg dark:border-border/50 dark:hover:border-primary/40 dark:hover:shadow-[var(--glow-primary)] ${
        reversed ? 'md:flex-row-reverse' : ''
      } flex flex-col md:flex-row`}
    >
      {/* Image / Video placeholder */}
      <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-muted md:aspect-auto md:w-5/12">
        {project.videoUrl ? (
          <video
            src={project.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full min-h-[240px] w-full flex-col items-center justify-center gap-3 p-6">
            <div className="flex gap-2">
              {project.techStack.slice(0, 3).map((tech) => {
                const Icon = techIconMap[tech]
                return Icon ? (
                  <Icon key={tech} className="h-8 w-8 opacity-40" />
                ) : null
              })}
            </div>
            <span className="text-sm font-medium text-muted-foreground/50">
              {project.title}
            </span>
          </div>
        )}
        {/* Dark mode overlay gradient */}
        <div
          className="pointer-events-none absolute inset-0 hidden dark:block"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-center p-6 sm:p-8 md:w-7/12">
        {/* Type badge + private indicator */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {badge}
          </span>
          {isPrivate && (
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {isEn ? 'Private project' : 'Proiect privat'}
            </span>
          )}
        </div>

        {/* Impact headline */}
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
          {headline}
        </h2>

        {/* Project name */}
        <p className="mt-1 text-sm font-medium text-primary">{project.title}</p>

        {/* Description */}
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>

        {/* Stats pills */}
        <div className="mt-4 flex flex-wrap gap-2">
          {stats.map((stat) => (
            <span
              key={stat}
              className="rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground dark:border-border/50 dark:bg-muted/30"
            >
              {stat}
            </span>
          ))}
        </div>

        {/* Tech stack icons */}
        <div className="mt-4 flex items-center gap-3">
          {project.techStack.map((tech) => {
            const Icon = techIconMap[tech]
            return Icon ? (
              <span key={tech} title={tech} className="inline-flex">
                <Icon className="h-5 w-5 opacity-60 transition-opacity group-hover:opacity-100" />
              </span>
            ) : (
              <span
                key={tech}
                className="text-xs font-medium text-muted-foreground/60"
              >
                {tech}
              </span>
            )
          })}
        </div>

        {/* CTA */}
        <div className="mt-6 flex items-center gap-3">
          <Link
            href={project.href}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {isEn ? 'View project' : 'Vezi proiectul'}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {isEn ? 'Live site' : 'Site live'}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export function ProjectsPage({ language = 'ro' }: ProjectsPageProps) {
  const isEn = language === 'en'
  const featured = projects.filter((p) => p.featured)

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Page heading */}
        <div className="mb-12 text-center sm:mb-16">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {isEn ? 'Projects' : 'Proiecte'}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {isEn
              ? 'From internal business tools to multi-client web platforms — a selection of what I build.'
              : 'De la unelte interne pentru business la platforme web multi-client — o selecție din ce construiesc.'}
          </p>
        </div>

        {/* Vertical stack of project cards */}
        <div className="flex flex-col gap-8 sm:gap-10">
          {featured.map((project, index) => (
            <ScrollReveal key={project.slug} direction="up" delay={index * 0.1}>
              <ProjectCard
                project={project}
                isEn={isEn}
                reversed={index % 2 !== 0}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
