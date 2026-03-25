'use client'

import { projects } from '../../../clients/portfolio/data/projects'

// ---------------------------------------------------------------------------
// ProjectShowcase — Project cards for the portfolio homepage.
// ---------------------------------------------------------------------------
// Displays featured projects from clients/portfolio/data/projects.ts.
//
// Layout:
//   Desktop: 2-column grid
//   Mobile: single-column stack
//
// Dark mode (DESIGN.md Section 8):
//   - Card hover glow (--glow-primary)
//   - Image placeholder overlay gradient
//
// Each card shows: title, description, tech stack tags, link.
// Images are placeholders for now (colored div) until real screenshots exist.
//
// ScrollReveal is applied from outside in HomePage.tsx — this component
// does not wrap itself in ScrollReveal (SRP).
// ---------------------------------------------------------------------------

interface ProjectShowcaseProps {
  className?: string
}

export function ProjectShowcase({ className = '' }: ProjectShowcaseProps) {
  const featured = projects.filter((p) => p.featured)

  return (
    <section className={`py-16 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Section heading */}
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Proiecte
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
            O selecție din lucrările recente — de la site-uri de prezentare la aplicații web complexe.
          </p>
        </div>

        {/* Project grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {featured.map((project) => (
            <a
              key={project.slug}
              href={project.href}
              className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg dark:border-border/50 dark:bg-card dark:hover:border-primary/40 dark:hover:shadow-[var(--glow-primary)]"
            >
              {/* Image placeholder */}
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  {/* Placeholder until real screenshots exist */}
                  <span className="opacity-60">{project.title}</span>
                </div>
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

              {/* Card body */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors sm:text-xl">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                  {project.description}
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
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
