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

export const projects: Project[] = [
  {
    slug: 'siteforge',
    title: 'SiteForge',
    description: 'Multi-client website platform built with Next.js. Supports i18n, dark mode, blog, contact forms, and per-client theming.',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    image: '',
    href: '#',
    featured: true,
  },
  {
    slug: 'task-dashboard',
    title: 'Task Dashboard',
    description: 'Real-time task management dashboard with drag-and-drop, filters, and team collaboration features.',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Supabase'],
    image: '',
    href: '#',
    featured: true,
  },
  {
    slug: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    description: 'Full-stack online store with product catalog, shopping cart, Stripe payments, and order management.',
    techStack: ['Next.js', 'TypeScript', 'Stripe', 'Supabase'],
    image: '',
    href: '#',
    featured: true,
  },
  {
    slug: 'health-tracker',
    title: 'Health Tracker',
    description: 'Personal health tracking app with daily logging, charts, and goal setting for fitness and nutrition.',
    techStack: ['React', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
    image: '',
    href: '#',
    featured: true,
  },
]
