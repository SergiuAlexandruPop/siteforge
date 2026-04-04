'use client'

import { resumeData } from '../../../clients/portfolio/data/resume'
import type { ExperienceEntry, SkillGroup, EducationEntry } from '../../../clients/portfolio/data/resume'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import {
  ReactIcon,
  NextjsIcon,
  TypeScriptIcon,
  TailwindIcon,
  NodejsIcon,
  SupabaseIcon,
  GitIcon,
} from './icons'

// ---------------------------------------------------------------------------
// ResumePage — Interactive resume with timeline, skills, and education.
// ---------------------------------------------------------------------------
// Renders at /resume (RO) and /en/resume (EN).
// Data from clients/portfolio/data/resume.ts (single source of truth).
//
// Layout:
//   1. Header — name, title, location, download PDF button
//   2. Experience — left-aligned vertical timeline with dot markers
//   3. Skills — 4-column grouped grid with pills
//   4. Education — compact cards
//   5. Languages + Public Speaking — small footer section
//
// Dark mode: timeline glow, skill pill hover, section card borders.
// Mobile: single column, timeline stays left-aligned.
// ---------------------------------------------------------------------------

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  react: ReactIcon,
  nextjs: NextjsIcon,
  typescript: TypeScriptIcon,
  tailwind: TailwindIcon,
  nodejs: NodejsIcon,
  supabase: SupabaseIcon,
  git: GitIcon,
}

interface ResumePageProps {
  language?: 'ro' | 'en'
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ResumeHeader({ isEn }: { isEn: boolean }) {
  const d = resumeData
  return (
    <header className="mb-12 sm:mb-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {d.name}
          </h1>
          <p className="mt-1 text-lg font-medium text-primary sm:text-xl">
            {isEn ? d.titleEn : d.title}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {d.location}
          </p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {isEn ? d.objectiveEn : d.objective}
          </p>
        </div>

        {/* Download PDF */}
        <a
          href="/resume-sergiu-pop.pdf"
          download
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
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
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {isEn ? 'Download PDF' : 'Descarcă PDF'}
        </a>
      </div>

      {/* Contact links row */}
      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <a
          href={`mailto:${d.email}`}
          className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          {d.email}
        </a>
        <a
          href={d.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect width="4" height="12" x="2" y="9" />
            <circle cx="4" cy="4" r="2" />
          </svg>
          LinkedIn
        </a>
        <a
          href={d.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
          GitHub
        </a>
      </div>
    </header>
  )
}

function TimelineEntry({
  entry,
  isEn,
  isLast,
}: {
  entry: ExperienceEntry
  isEn: boolean
  isLast: boolean
}) {
  const title = isEn ? entry.titleEn : entry.title
  const description = isEn ? entry.descriptionEn : entry.description
  const highlights = isEn ? entry.highlightsEn : entry.highlights
  const companyNote = isEn ? entry.companyNoteEn : entry.companyNote
  const endLabel = entry.endDate === null ? (isEn ? 'Present' : 'Prezent') : entry.endDate
  const startLabel = isEn
    ? entry.startDate
        .replace('Ian', 'Jan')
        .replace('Iun', 'Jun')
        .replace('Feb', 'Feb')
        .replace('Oct', 'Oct')
    : entry.startDate

  return (
    <div className="relative pl-8 pb-10">
      {/* Timeline line */}
      {!isLast && (
        <div
          className="absolute left-[7px] top-3 bottom-0 w-px bg-border dark:bg-border/50 dark:shadow-[0_0_8px_rgba(37,99,235,0.1)]"
          aria-hidden="true"
        />
      )}

      {/* Timeline dot */}
      <div
        className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-primary bg-background dark:shadow-[0_0_8px_rgba(37,99,235,0.3)]"
        aria-hidden="true"
      />

      {/* Content */}
      <div>
        {/* Date range */}
        <span className="text-xs font-medium text-muted-foreground">
          {startLabel} — {endLabel}
        </span>

        {/* Title + Company */}
        <h3 className="mt-1 text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm font-medium text-primary/80">
          {entry.company}
          {companyNote && (
            <span className="text-muted-foreground"> ({companyNote})</span>
          )}
          <span className="text-muted-foreground"> · {entry.location}</span>
        </p>

        {/* Description */}
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        {/* Highlights */}
        {highlights.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 shrink-0 text-primary/60"
                  aria-hidden="true"
                >
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
                {h}
              </li>
            ))}
          </ul>
        )}

        {/* Tools */}
        {entry.tools.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {entry.tools.map((tool) => (
              <span
                key={tool}
                className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground dark:bg-muted/50"
              >
                {tool}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SkillsSection({ isEn }: { isEn: boolean }) {
  return (
    <section className="mb-12 sm:mb-16">
      <h2 className="mb-6 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        {isEn ? 'Skills' : 'Competențe'}
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {resumeData.skills.map((group) => (
          <SkillGroupCard key={group.category} group={group} isEn={isEn} />
        ))}
      </div>
    </section>
  )
}

function SkillGroupCard({ group, isEn }: { group: SkillGroup; isEn: boolean }) {
  const label = isEn ? group.categoryEn : group.category
  return (
    <div className="rounded-xl border border-border bg-card p-4 dark:border-border/50">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
        {label}
      </h3>
      <div className="flex flex-wrap gap-2">
        {group.skills.map((skill) => {
          const Icon = skill.icon ? iconMap[skill.icon] : null
          return (
            <span
              key={skill.name}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/30 dark:border-border/50 dark:bg-muted/30 dark:hover:shadow-[0_0_8px_rgba(37,99,235,0.1)]"
            >
              {Icon && <Icon className="h-3.5 w-3.5" />}
              {skill.name}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function EducationSection({ isEn }: { isEn: boolean }) {
  return (
    <section className="mb-12 sm:mb-16">
      <h2 className="mb-6 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        {isEn ? 'Education' : 'Educație'}
      </h2>
      <div className="space-y-4">
        {resumeData.education.map((entry, i) => (
          <EducationCard key={i} entry={entry} isEn={isEn} />
        ))}
      </div>
    </section>
  )
}

function EducationCard({ entry, isEn }: { entry: EducationEntry; isEn: boolean }) {
  const degree = isEn ? entry.degreeEn : entry.degree
  const field = isEn ? entry.fieldEn : entry.field
  const description = isEn ? entry.descriptionEn : entry.description

  return (
    <div className="rounded-xl border border-border bg-card p-5 dark:border-border/50">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            {degree}
            {field && <span className="text-muted-foreground"> — {field}</span>}
          </h3>
          <p className="mt-0.5 text-sm text-primary/80">{entry.institution}</p>
          {description && (
            <p className="mt-2 text-sm italic text-muted-foreground">{description}</p>
          )}
        </div>
        <span className="shrink-0 text-sm font-medium text-muted-foreground">
          {entry.endYear}
        </span>
      </div>
    </div>
  )
}

function FooterSection({ isEn }: { isEn: boolean }) {
  const d = resumeData
  return (
    <section>
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Languages */}
        <div className="rounded-xl border border-border bg-card p-5 dark:border-border/50">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
            {isEn ? 'Languages' : 'Limbi'}
          </h3>
          <div className="space-y-2">
            {d.languages.map((lang) => (
              <div key={lang.name} className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">
                  {isEn ? lang.nameEn : lang.name}
                </span>
                <span className="text-muted-foreground">
                  {isEn ? lang.levelEn : lang.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Public speaking */}
        <div className="rounded-xl border border-border bg-card p-5 dark:border-border/50">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
            {isEn ? 'Public Speaking' : 'Prezentări Publice'}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {isEn ? d.publicSpeakingEn : d.publicSpeaking}
          </p>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ResumePage({ language = 'ro' }: ResumePageProps) {
  const isEn = language === 'en'

  return (
    <article className="py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <ScrollReveal direction="up">
          <ResumeHeader isEn={isEn} />
        </ScrollReveal>

        {/* Experience Timeline */}
        <ScrollReveal direction="up" delay={0.1}>
          <section className="mb-12 sm:mb-16">
            <h2 className="mb-8 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {isEn ? 'Experience' : 'Experiență'}
            </h2>
            <div>
              {resumeData.experience.map((entry, i) => (
                <TimelineEntry
                  key={`${entry.company}-${entry.startDate}`}
                  entry={entry}
                  isEn={isEn}
                  isLast={i === resumeData.experience.length - 1}
                />
              ))}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1}>
          <SkillsSection isEn={isEn} />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1}>
          <EducationSection isEn={isEn} />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1}>
          <FooterSection isEn={isEn} />
        </ScrollReveal>
      </div>
    </article>
  )
}
