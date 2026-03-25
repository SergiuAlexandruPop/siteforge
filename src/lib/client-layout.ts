import type { ComponentType, ReactNode } from 'react'
import type { ClientConfig } from '@/types/config'
import { LayoutShell } from '@/components/layout/LayoutShell'
import { PortfolioLayout } from '@/components/portfolio/PortfolioLayout'

// ---------------------------------------------------------------------------
// Client Layout Registry
// ---------------------------------------------------------------------------
// Maps ACTIVE_CLIENT → layout component. Each layout wraps the entire page
// (header + children + footer). Follows the same explicit-import pattern as
// client-config.ts for Turbopack reliability (Decision #24, #42).
//
// When adding a new custom layout:
//   1. Import the layout component at the top of this file
//   2. Add an entry to the `layouts` map
//
// Clients without a custom layout get LayoutShell (the default).
// ---------------------------------------------------------------------------

interface LayoutComponentProps {
  config: ClientConfig
  children: ReactNode
}

type LayoutComponent = ComponentType<LayoutComponentProps>

const layouts: Record<string, LayoutComponent> = {
  portfolio: PortfolioLayout,
}

/**
 * Returns the layout component for the active client.
 * Falls back to LayoutShell if no custom layout is registered.
 */
export function getClientLayout(clientName: string): LayoutComponent {
  return layouts[clientName] ?? LayoutShell
}
