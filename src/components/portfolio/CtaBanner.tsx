import Link from 'next/link'

// ---------------------------------------------------------------------------
// CtaBanner — Homepage closing CTA that links to the contact page.
// ---------------------------------------------------------------------------
// Replaces the full inline contact form on the homepage (Phase 8B).
// Paul Boag principle: don't duplicate conversion points — the homepage
// invites, the /contact page converts.
//
// Dark mode: warm terracotta gradient background.
// Light mode: subtle muted background.
// ---------------------------------------------------------------------------

interface CtaBannerProps {
  language?: string
  className?: string
}

export function CtaBanner({ language = 'ro', className = '' }: CtaBannerProps) {
  const isEn = language === 'en'

  return (
    <section className={`py-16 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-muted/40 px-6 py-12 text-center dark:border-border/50 dark:bg-muted/20 sm:px-12 sm:py-16">
          {/* Dark mode gradient overlay */}
          <div
            className="pointer-events-none absolute inset-0 hidden dark:block"
            aria-hidden="true"
            style={{
              background:
                'linear-gradient(135deg, rgba(178,64,39,0.06) 0%, rgba(178,64,39,0.02) 50%, transparent 100%)',
            }}
          />

          <div className="relative z-10">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {isEn ? 'Building something?' : 'Construiești ceva?'}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
              {isEn
                ? 'I help independent clients ship products and join teams on large-scale builds.'
                : 'Ajut clienți independenți să livreze produse și mă alătur echipelor pe proiecte mari.'}
            </p>
            <div className="mt-8">
              <Link
                href={isEn ? '/en/contact' : '/contact'}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 dark:shadow-[var(--glow-primary)] sm:text-base"
              >
                {isEn ? 'Get in touch' : 'Contactează-mă'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
