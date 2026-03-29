// ---------------------------------------------------------------------------
// Portfolio Projects — Structured project data.
// ---------------------------------------------------------------------------
// Decision #51: TypeScript > markdown for structured data.
// Each project is typed and imported directly by ProjectShowcase.
//
// Fields:
//   slug        — URL-friendly identifier (used as key)
//   title       — Project display name
//   description — 1-2 sentence summary
//   techStack   — Array of technology names (shown as tags)
//   image       — Path to screenshot (relative to /public or R2 URL)
//   href        — External link to the project (live site or GitHub)
//   featured    — If true, shown in the homepage showcase
// ---------------------------------------------------------------------------

export interface Project {
  slug: string
  title: string
  description: string
  techStack: string[]
  image: string
  href: string
  featured: boolean
}

export const projects: Project[] = []
