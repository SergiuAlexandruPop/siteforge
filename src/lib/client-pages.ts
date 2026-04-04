import type { ComponentType } from 'react'
import { AboutPage } from '@/components/portfolio/AboutPage'
import { ProjectsPage } from '@/components/portfolio/ProjectsPage'
import { ResumePage } from '@/components/portfolio/ResumePage'

// ---------------------------------------------------------------------------
// Client Page Registry
// ---------------------------------------------------------------------------
// Maps ACTIVE_CLIENT + slug → custom page component. Follows the same
// explicit-import pattern as client-homepage.ts and client-layout.ts.
//
// When adding a new custom page:
//   1. Import the page component at the top of this file
//   2. Add an entry to the `pages` map under the client name and slug
//
// Slugs without an entry fall through to the generic markdown renderer
// in [slug]/page.tsx.
// ---------------------------------------------------------------------------

type PageComponent = ComponentType<{ language?: 'ro' | 'en' }>

const pages: Record<string, Record<string, PageComponent>> = {
  'portfolio': {
    'about': AboutPage,
    'projects': ProjectsPage,
    'resume': ResumePage,
  },
}

/**
 * Returns a custom page component for the given client and slug,
 * or null if no custom page is registered (falls back to markdown).
 */
export function getClientPage(
  clientName: string,
  slug: string,
): PageComponent | null {
  return pages[clientName]?.[slug] ?? null
}
