import type { ClientContact } from '@/types/config'

// ---------------------------------------------------------------------------
// PortfolioFooter — Enhanced footer with dark mode gradient treatment.
// ---------------------------------------------------------------------------
// Same content as the default Footer (contact info, copyright, SiteForge
// credit) but with a premium dark mode top edge gradient.
//
// The gradient overlay is implemented with a hidden dark:block div — zero
// runtime JS branching for dark mode (Decision #54).
//
// See DESIGN.md Section 8 — Dark Mode Special Treatments.
// ---------------------------------------------------------------------------

interface PortfolioFooterProps {
  displayName: string
  contact: ClientContact
}

export function PortfolioFooter({ displayName, contact }: PortfolioFooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-border bg-muted/40">
      {/* Dark mode: gradient fade at top edge */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px hidden dark:block"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(37, 99, 235, 0.3) 50%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Contact info */}
          <div className="space-y-1 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">{displayName}</p>
            <p>
              <a
                href={`mailto:${contact.email}`}
                className="hover:text-primary transition-colors"
              >
                {contact.email}
              </a>
            </p>
            <p>
              <a
                href={`tel:${contact.phone.replace(/\s/g, '')}`}
                className="hover:text-primary transition-colors"
              >
                {contact.phone}
              </a>
            </p>
            {contact.address && <p>{contact.address}</p>}
          </div>

          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            <p>&copy; {year} {displayName}</p>
            <p className="mt-1 text-xs">
              Built with{' '}
              <span className="font-medium text-foreground">SiteForge</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
