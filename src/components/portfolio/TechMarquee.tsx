import { Marquee } from '@/components/animations'
import {
  ReactIcon,
  NextjsIcon,
  TypeScriptIcon,
  TailwindIcon,
  NodejsIcon,
  SupabaseIcon,
  PostgresIcon,
  GitIcon,
} from './icons'

// ---------------------------------------------------------------------------
// TechMarquee — Infinite scrolling strip of tech stack logos.
// ---------------------------------------------------------------------------
// Wraps the shared Marquee primitive with portfolio-specific tech icons.
// Each icon sits inside a labeled pill for clarity.
//
// Design spec: DESIGN.md Section 5 — Marquee timing (35s, pauseOnHover).
// Accessibility: Marquee respects prefers-reduced-motion (static flex-wrap).
//
// This is a client component because Marquee uses useReducedMotion.
// ---------------------------------------------------------------------------

interface TechItem {
  name: string
  icon: React.ReactNode
}

const techStack: TechItem[] = [
  { name: 'React', icon: <ReactIcon className="h-5 w-5" /> },
  { name: 'Next.js', icon: <NextjsIcon className="h-5 w-5" /> },
  { name: 'TypeScript', icon: <TypeScriptIcon className="h-5 w-5 rounded-sm" /> },
  { name: 'Tailwind CSS', icon: <TailwindIcon className="h-5 w-5" /> },
  { name: 'Node.js', icon: <NodejsIcon className="h-5 w-5" /> },
  { name: 'Supabase', icon: <SupabaseIcon className="h-5 w-5" /> },
  { name: 'PostgreSQL', icon: <PostgresIcon className="h-5 w-5" /> },
  { name: 'Git', icon: <GitIcon className="h-5 w-5" /> },
]

interface TechMarqueeProps {
  className?: string
}

export function TechMarquee({ className = '' }: TechMarqueeProps) {
  return (
    <div className={`border-y border-border/50 py-4 ${className}`}>
      <Marquee speed={35} pauseOnHover gap="2rem">
        {techStack.map((tech) => (
          <div
            key={tech.name}
            className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground dark:border-border/30 dark:bg-muted/30"
          >
            {tech.icon}
            <span>{tech.name}</span>
          </div>
        ))}
      </Marquee>
    </div>
  )
}
