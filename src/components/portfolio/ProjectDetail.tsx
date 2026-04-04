'use client'

import Link from 'next/link'
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
// ProjectDetail — Case study layout for individual project pages.
// ---------------------------------------------------------------------------
// Renders at /projects/[slug]. Receives the full Project object.
//
// Layout (top to bottom):
//   1. Hero — project name, impact headline, type badge, video/image placeholder
//   2. Problem section — what pain this solves
//   3. Solution section — what was built + feature list
//   4. Tech stack — visual grid with icons
//   5. Gallery — screenshot grid (hidden when empty)
//   6. CTA — contact link
//
// Dark mode: glow effects on hero, section borders.
// Mobile: single column, stacked layout.
// ---------------------------------------------------------------------------

const techIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'Next.js': NextjsIcon,
  TypeScript: TypeScriptIcon,
  'Tailwind CSS': TailwindIcon,
  React: ReactIcon,
  Supabase: SupabaseIcon,
  'Node.js': NodejsIcon,
}

interface ProjectDetailProps {
  project: Project
  language?: 'ro' | 'en'
}

export function ProjectDetail({ project, language = 'ro' }: ProjectDetailProps) {
  const isEn = language === 'en'

  const headline = isEn ? project.impactHeadlineEn : project.impactHeadline
  const description = isEn ? project.descriptionEn : project.description
  const badge = isEn ? project.typeBadgeEn : project.typeBadge
  const problem = isEn ? project.problemEn : project.problem
  const solution = isEn ? project.solutionEn : project.solution
  const features = isEn ? project.featuresEn : project.features
  const isPrivate = !project.liveUrl

  return (
    <article className="py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Back link */}
        <Link
          href={isEn ? '/en/projects' : '/projects'}
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
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
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          {isEn ? 'All projects' : 'Toate proiectele'}
        </Link>

        {/* ---- HERO ---- */}
        <ScrollReveal direction="up">
          <header className="mb-12 sm:mb-16">
            {/* Badges */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {badge}
              </span>
              {isPrivate && (
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  {isEn ? 'Private project' : 'Proiect privat'}
                </span>
              )}
            </div>

            {/* Title + headline */}
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {project.title}
            </h1>
            <p className="mt-2 text-lg text-primary/80 sm:text-xl">{headline}</p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </p>

            {/* Links */}
            <div className="mt-6 flex items-center gap-4">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {isEn ? 'Visit live site' : 'Vizitează site-ul'}
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

            {/* Hero media placeholder */}
            <div className="mt-8 overflow-hidden rounded-xl border border-border bg-muted dark:border-border/50">
              {project.videoUrl ? (
                <video
                  src={project.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="aspect-video w-full object-cover"
                />
              ) : (
                <div className="flex aspect-video items-center justify-center">
                  <div className="flex flex-col items-center gap-3 text-muted-foreground/40">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <path d="M8 21h8" />
                      <path d="M12 17v4" />
                    </svg>
                    <span className="text-sm">
                      {isEn ? 'Demo video coming soon' : 'Video demonstrativ în curând'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </header>
        </ScrollReveal>

        {/* ---- PROBLEM ---- */}
        <ScrollReveal direction="up" delay={0.1}>
          <section className="mb-12 sm:mb-16">
            <h2 className="mb-4 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {isEn ? 'The Problem' : 'Problema'}
            </h2>
            <div className="rounded-xl border border-border bg-muted/30 p-6 dark:border-border/50 dark:bg-muted/10">
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                {problem}
              </p>
            </div>
          </section>
        </ScrollReveal>

        {/* ---- SOLUTION ---- */}
        <ScrollReveal direction="up" delay={0.1}>
          <section className="mb-12 sm:mb-16">
            <h2 className="mb-4 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {isEn ? 'The Solution' : 'Soluția'}
            </h2>
            <p className="mb-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {solution}
            </p>

            {/* Feature list */}
            <div className="grid gap-3 sm:grid-cols-2">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 dark:border-border/50"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5 shrink-0 text-primary"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* ---- TECH STACK ---- */}
        <ScrollReveal direction="up" delay={0.1}>
          <section className="mb-12 sm:mb-16">
            <h2 className="mb-4 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {isEn ? 'Tech Stack' : 'Tehnologii'}
            </h2>
            <div className="flex flex-wrap gap-4">
              {project.techStack.map((tech) => {
                const Icon = techIconMap[tech]
                return (
                  <div
                    key={tech}
                    className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-4 py-2.5 dark:border-border/50"
                  >
                    {Icon && <Icon className="h-5 w-5" />}
                    <span className="text-sm font-medium text-foreground">
                      {tech}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>
        </ScrollReveal>

        {/* ---- GALLERY (hidden when empty) ---- */}
        {project.galleryImages.length > 0 && (
          <ScrollReveal direction="up" delay={0.1}>
            <section className="mb-12 sm:mb-16">
              <h2 className="mb-4 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {isEn ? 'Screenshots' : 'Capturi de ecran'}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {project.galleryImages.map((src, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-xl border border-border dark:border-border/50"
                  >
                    <img
                      src={src}
                      alt={`${project.title} screenshot ${i + 1}`}
                      className="aspect-video w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* ---- CTA ---- */}
        <ScrollReveal direction="up" delay={0.1}>
          <section className="rounded-2xl border border-border bg-muted/30 p-8 text-center dark:border-border/50 dark:bg-muted/10 dark:shadow-[var(--glow-muted)]">
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {isEn ? 'Have a similar project?' : 'Ai un proiect similar?'}
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-base text-muted-foreground">
              {isEn
                ? "Let's talk about how I can help you build it."
                : 'Hai să discutăm cum te pot ajuta să-l construiești.'}
            </p>
            <Link
              href={isEn ? '/en/contact' : '/contact'}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {isEn ? 'Get in touch' : 'Contactează-mă'}
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
          </section>
        </ScrollReveal>
      </div>
    </article>
  )
}
