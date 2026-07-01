import { getClientConfig } from '@/lib/client-config'
import { getBrand } from '@/lib/brand'
import { ErrorState } from '@/components/errors/ErrorState'

// ---------------------------------------------------------------------------
// Shared 404 (platform-level). Server Component, so it reads the active client's
// config directly and renders the themed ErrorState with brand contact CTAs. It
// renders inside the client's root layout (header + footer + sticky bar), so a
// bad/expired link degrades gracefully with full navigation instead of a raw break.
// ---------------------------------------------------------------------------

export default function NotFound() {
  const brand = getBrand(getClientConfig())

  return (
    <ErrorState
      language={brand.language}
      variant="not-found"
      telHref={brand.telHref || undefined}
      whatsappUrl={brand.whatsappUrl || undefined}
    />
  )
}
