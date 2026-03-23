import type { ClientContact } from '@/types/config'

interface FooterProps {
  displayName: string
  contact: ClientContact
}

export function Footer({ displayName, contact }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Contact info */}
          <div className="space-y-1 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{displayName}</p>
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
