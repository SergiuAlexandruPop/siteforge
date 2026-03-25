import type { ComponentType } from 'react'
import { DefaultHomePage } from '@/components/sections/DefaultHomePage'

// ---------------------------------------------------------------------------
// Client Homepage Registry
// ---------------------------------------------------------------------------
// Maps ACTIVE_CLIENT → homepage component. Each homepage is a full-page
// composition of sections. Follows the same explicit-import pattern as
// client-config.ts for Turbopack reliability (Decision #24, #43).
//
// When adding a new custom homepage:
//   1. Import the homepage component at the top of this file
//   2. Add an entry to the `homepages` map
//
// Clients without a custom homepage get DefaultHomePage (the current generic).
// ---------------------------------------------------------------------------

// Async server components return Promise<JSX.Element>
type HomePageComponent = ComponentType

// --- Custom homepage imports go here ---
// import { PortfolioHomePage } from '@/components/portfolio/HomePage'

const homepages: Record<string, HomePageComponent> = {
  // 'portfolio': PortfolioHomePage,  // Chat 3 will uncomment this
}

/**
 * Returns the homepage component for the active client.
 * Falls back to DefaultHomePage if no custom homepage is registered.
 */
export function getClientHomePage(clientName: string): HomePageComponent {
  return homepages[clientName] ?? DefaultHomePage
}
