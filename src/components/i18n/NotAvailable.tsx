interface NotAvailableProps {
  /** The Romanian URL to link back to */
  romanianHref: string
}

/**
 * Shown when an English page doesn't exist.
 * Links back to the Romanian version.
 */
export function NotAvailable({ romanianHref }: NotAvailableProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="rounded-lg border border-border bg-muted/40 p-8 text-center">
        <p className="text-lg font-medium text-foreground">
          This page is not yet available in English.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          You can view the Romanian version instead.
        </p>
        <a
          href={romanianHref}
          className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          View in Romanian
        </a>
      </div>
    </div>
  )
}
