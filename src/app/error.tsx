'use client'

import { useEffect } from 'react'
import { useBrand } from '@/components/brand/BrandProvider'
import { ErrorState } from '@/components/errors/ErrorState'

// ---------------------------------------------------------------------------
// Shared runtime error boundary (platform-level). MUST be a Client Component
// (Next requirement) and receives { error, reset }. It cannot import the client
// config (that would drag the manifest's server components into the client
// bundle), so it reads brand contact from BrandProvider (wired in the root layout)
// via useBrand(). Renders the same themed ErrorState with a retry that calls reset().
// ---------------------------------------------------------------------------

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Surface to the runtime logs (Worker tail / server logs); details stay off-screen.
    console.error(error)
  }, [error])

  const brand = useBrand()

  return (
    <ErrorState
      language={brand?.language ?? 'ro'}
      variant="error"
      telHref={brand?.telHref || undefined}
      whatsappUrl={brand?.whatsappUrl || undefined}
      onRetry={reset}
    />
  )
}
