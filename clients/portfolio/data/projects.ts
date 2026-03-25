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
    description:
      'Starter kit mono-repo care alimentează multiple site-uri de business dintr-un singur codebase. CMS integrat, blog, dark mode, i18n.',
    techStack: ['Next.js', 'TypeScript', 'Tailwind', 'Cloudflare R2'],
    image: '/projects/siteforge.jpg',
    href: '#',
    featured: true,
  },
  {
    slug: 'blog-cms',
    title: 'Blog CMS',
    description:
      'Editor WYSIWYG în stil Medium cu upload de imagini, optimizare automată și publicare directă pe GitHub.',
    techStack: ['Novel', 'Tiptap', 'Sharp', 'GitHub API'],
    image: '/projects/blog-cms.jpg',
    href: '#',
    featured: true,
  },
  {
    slug: 'portfolio-site',
    title: 'Portfolio Personal',
    description:
      'Site-ul pe care îl vizitezi acum. Animații premium, dark mode cu glow effects, performanță Lighthouse 95+.',
    techStack: ['Next.js', 'Lenis', 'Tailwind', 'Vercel'],
    image: '/projects/portfolio.jpg',
    href: '#',
    featured: true,
  },
  {
    slug: 'electrowill',
    title: 'ElectroWill Solutions',
    description:
      'Site de prezentare pentru o firmă de instalații electrice. Formular de contact, SEO local, design responsive.',
    techStack: ['Next.js', 'Resend', 'Tailwind'],
    image: '/projects/electrowill.jpg',
    href: '#',
    featured: true,
  },
]
