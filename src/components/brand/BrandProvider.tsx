'use client'

import { createContext, useContext } from 'react'
import type { Brand } from '@/lib/brand'

// ---------------------------------------------------------------------------
// BrandProvider — client-safe brand contact for Client Components.
// ---------------------------------------------------------------------------
// RootLayout (a Server Component) holds the full client config, but app/error.tsx
// is a Client Component and must NOT import getClientConfig() — that pulls the
// client manifest (layout / homepage server components) into the client bundle.
// So the server layout derives a small, serializable Brand (see @/lib/brand) and
// passes it through this context; client surfaces read it via useBrand(). Reusable
// by any client-side component that needs brand contact without the manifest.
// ---------------------------------------------------------------------------

const BrandContext = createContext<Brand | null>(null)

export function BrandProvider({
  brand,
  children,
}: {
  brand: Brand
  children: React.ReactNode
}) {
  return <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>
}

/** The active client's brand contact, or null when rendered outside the provider. */
export function useBrand(): Brand | null {
  return useContext(BrandContext)
}
