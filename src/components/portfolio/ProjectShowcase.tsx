'use client'

import Link from 'next/link'
import { projects } from '../../../clients/portfolio/data/projects'
import { BrowserMockup } from './BrowserMockup'

// ---------------------------------------------------------------------------
// ProjectShowcase — Compact project cards for the portfolio homepage.
// ---------------------------------------------------------------------------
// Phase 8E: Added BrowserMockup around image placeholders, outcome line.
//
// Layout:
//   Desktop: 3-column grid (one card per project)
//   Mobile: single-column stack
//
// Dark mode: card hover glow (--glow-primary)
// ---------------------------------------------------------------------------

interface ProjectShowcaseProps {
  className?: string
  language?: 'ro' | 'en'
}

export function ProjectShowcase({ className = '', language = 'ro' }: ProjectShowcaseProps) {
  const isEn = language === 'en'
  const featured = projects.filter((p) => p.featured)

  return (
    <section className={`py-16 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Section heading */}
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            {isEn ? 'Projects' : 'Proiecte'}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {isEn
              ? 'A selection of recent work — from internal tools to web platforms.'
              : 'O selecție din lucrările recente — de la unelte interne la platforme web.'}
          </p>
        </div>

        {/* 3-column project grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => {
            const badge = isEn ? project.typeBadgeEn : project.typeBadge
            const description = isEn ? project.descriptionEn : project.description
            const outcome = isEn ? project.outcomeEn : project.outcome

            return (
              <Link
                key={project.slug}
                href={project.href}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg dark:border-border/50 dark:bg-card dark:hover:border-primary/40 dark:hover:shadow-[var(--glow-primary)]"
              >
                {/* Browser mockup image placeholder */}
                <div className="m-3 mb-0">
                  <BrowserMockup url={project.liveUrl || `${project.title.toLowerCase()}.app`}>
                    {/* TODO: Replace with real screenshot <img src={project.image} /> */}
                    <div className="flex aspect-video w-full items-center justify-center bg-muted">
                      <span className="text-sm font-medium text-muted-foreground/50">
                        {project.title}
                      </span>
                    </div>
                  </BrowserMockup>
                </div>

                {/* Card body */}
                <div className="flex flex-1 flex-col p-5">
                  {/* Badge */}
                  <span className="mb-2 inline-flex w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {badge}
                  </span>

                  <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary sm:text-xl">
                    {project.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {description}
                  </p>

                  {/* Outcome line */}
                  <p className="mt-3 text-xs font-medium text-primary/80 italic">
                    → {outcome}
                  </p>

                  {/* Tech stack tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground dark:bg-muted/50"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* View all link */}
        <div className="mt-8 text-center">
          <Link
            href={isEn ? '/en/projects' : '/projects'}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            {isEn ? 'View all projects' : 'Vezi toate proiectele'}
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
        </div>
      </div>
    </section>
  )
}
