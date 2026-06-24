import type { ClientManifest } from '@/types/config'
import config from './config'
import theme from './theme'
import { PortfolioLayout } from '@/components/portfolio/PortfolioLayout'
import { PortfolioHomePage } from '@/components/portfolio/HomePage'
import { AboutPage } from '@/components/portfolio/AboutPage'
import { ProjectsPage } from '@/components/portfolio/ProjectsPage'
import { ResumePage } from '@/components/portfolio/ResumePage'
import { ContactPage } from '@/components/portfolio/ContactPage'
import ProjectDetailRoute from './components/ProjectDetailRoute'
import { projects } from './data/projects'

// ---------------------------------------------------------------------------
// Portfolio — client entry/manifest (single source of per-client wiring).
// Everything that varies for this client lives here. The build only ever
// imports the active client's manifest, so nothing here leaks into other
// clients' bundles.
// ---------------------------------------------------------------------------

export const manifest: ClientManifest = {
  config,
  theme,
  layout: PortfolioLayout,
  homepage: PortfolioHomePage,
  pages: {
    about: AboutPage,
    projects: ProjectsPage,
    resume: ResumePage,
    contact: ContactPage,
  },
  projectDetail: {
    slugs: projects.map((p) => p.slug),
    getMetadata: (slug, language) => {
      const project = projects.find((p) => p.slug === slug)
      if (!project) return null
      return {
        title: project.title,
        description: language === 'en' ? project.descriptionEn : project.description,
      }
    },
    Component: ProjectDetailRoute,
  },
}

export default manifest
