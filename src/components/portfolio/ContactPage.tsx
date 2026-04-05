import { getClientConfig } from '@/lib/client-config'
import { ContactForm } from '@/components/contact/ContactForm'

// ---------------------------------------------------------------------------
// ContactPage — Split-layout contact page for the portfolio client.
// ---------------------------------------------------------------------------
// Phase 8D: Replaces the generic markdown contact page.
//
// Layout:
//   Desktop (md+): Two columns — left (info + socials), right (form)
//   Mobile: Stacked — info on top, form below
//
// Left panel:
//   - Heading + subtitle
//   - Response time note
//   - Social links as icon cards
//
// Right panel:
//   - ContactForm (reused, no modifications)
//
// Visual treatment:
//   - Subtle gradient on the top section (dark mode)
//   - Grain overlay for consistency with About page
// ---------------------------------------------------------------------------

interface ContactPageProps {
  language?: 'ro' | 'en'
}

const i18n = {
  ro: {
    heading: 'Contactează-mă',
    subtitle: 'Ai un proiect în minte? Trimite-mi un mesaj și discutăm cum te pot ajuta.',
    responseTime: 'De obicei răspund în 24 de ore.',
    directContact: 'Contact direct',
    email: 'Email',
    socials: 'Social',
  },
  en: {
    heading: 'Get in touch',
    subtitle: 'Have a project in mind? Send me a message and let\u2019s discuss how I can help.',
    responseTime: 'I typically respond within 24 hours.',
    directContact: 'Direct contact',
    email: 'Email',
    socials: 'Social',
  },
}

export function ContactPage({ language = 'ro' }: ContactPageProps) {
  const config = getClientConfig()
  const t = i18n[language]

  return (
    <section className="relative overflow-hidden">
      {/* Dark mode gradient background on top area */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-80 hidden dark:block"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(178,64,39,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        {/* Page header */}
        <div className="mb-12 sm:mb-16">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {t.heading}
          </h1>
          <p className="mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
            {t.subtitle}
          </p>
        </div>

        {/* Split layout */}
        <div className="grid gap-12 md:grid-cols-5 md:gap-16">
          {/* Left column — contact info */}
          <div className="md:col-span-2">
            {/* Response time */}
            <div className="mb-8 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {t.responseTime}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t.directContact}
              </h2>

              <a
                href={`mailto:${config.contact.email}`}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-sm dark:border-border/50 dark:hover:shadow-[var(--glow-primary)]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                    aria-hidden="true"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{t.email}</p>
                  <p className="text-sm font-medium text-foreground">{config.contact.email}</p>
                </div>
              </a>
            </div>

            {/* Social links */}
            {config.contact.socials && (
              <div className="mt-6 space-y-4">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t.socials}
                </h2>

                <div className="space-y-3">
                  {config.contact.socials.linkedin && (
                    <a
                      href={config.contact.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-sm dark:border-border/50 dark:hover:shadow-[var(--glow-primary)]"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="text-primary"
                          aria-hidden="true"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">LinkedIn</p>
                        <p className="text-sm font-medium text-foreground">Sergiu Pop</p>
                      </div>
                    </a>
                  )}

                  {config.contact.socials.github && (
                    <a
                      href={config.contact.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-sm dark:border-border/50 dark:hover:shadow-[var(--glow-primary)]"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="text-primary"
                          aria-hidden="true"
                        >
                          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">GitHub</p>
                        <p className="text-sm font-medium text-foreground">SergiuAlexandruPop</p>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right column — form */}
          <div className="md:col-span-3">
            <div className="rounded-2xl border border-border bg-card p-6 dark:border-border/50 sm:p-8">
              <ContactForm language={language} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
