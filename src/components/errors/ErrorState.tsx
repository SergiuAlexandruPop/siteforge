import Link from 'next/link'

// ---------------------------------------------------------------------------
// ErrorState — shared, theme-driven fallback UI for 404 + runtime error pages.
// ---------------------------------------------------------------------------
// Presentational only (no 'use client', no hooks) so it renders from BOTH the
// Server not-found.tsx and the Client error.tsx. Styled purely with theme tokens
// (primary / whatsapp / foreground / muted / border) and the display/body font
// families, so it adopts each active client's brand with NO per-client copies.
// Copy is chosen by `language` (fallback English); the Sună / WhatsApp CTAs render
// only when their hrefs are provided (carry data-track so TapTracker counts them).
// It renders inside the client's normal chrome (header + sticky bar) via the root
// layout, so it stays a simple centered block.
// ---------------------------------------------------------------------------

interface ErrorStateProps {
  /** config.defaultLanguage — selects the copy set. */
  language: string
  variant: 'not-found' | 'error'
  /** tel: href; omit to hide the call CTA. */
  telHref?: string
  /** wa.me URL; omit to hide the WhatsApp CTA. */
  whatsappUrl?: string
  /** Error boundary reset; when provided, renders the "Reîncearcă" button. */
  onRetry?: () => void
}

const COPY = {
  ro: {
    badge: 'Eroare',
    home: 'Înapoi acasă',
    retry: 'Reîncearcă',
    call: 'Sună acum',
    whatsapp: 'Scrie pe WhatsApp',
    'not-found': {
      title: 'N-am găsit pagina',
      message:
        'Poate linkul e greșit sau pagina a fost mutată. Hai înapoi acasă sau sună-ne — te ajutăm imediat.',
    },
    error: {
      title: 'Ceva n-a mers bine',
      message:
        'A apărut o eroare neașteptată. Încearcă din nou sau sună-ne și rezolvăm.',
    },
  },
  en: {
    badge: 'Error',
    home: 'Back home',
    retry: 'Try again',
    call: 'Call now',
    whatsapp: 'Message on WhatsApp',
    'not-found': {
      title: 'Page not found',
      message:
        'The link may be wrong or the page has moved. Head back home or give us a call — we’ll help right away.',
    },
    error: {
      title: 'Something went wrong',
      message:
        'An unexpected error occurred. Try again or give us a call and we’ll sort it out.',
    },
  },
} as const

const BTN_BASE =
  'inline-flex h-[54px] items-center justify-center gap-[9px] rounded-[14px] px-7 font-body text-[16px] font-extrabold no-underline transition-[background-color] duration-150'
const BTN_PRIMARY = `${BTN_BASE} bg-primary text-primary-foreground hover:brightness-[.94]`
const BTN_OUTLINE = `${BTN_BASE} border border-border bg-background text-foreground hover:bg-muted`
const BTN_WHATSAPP = `${BTN_BASE} bg-whatsapp text-whatsapp-foreground hover:brightness-[.94]`

export function ErrorState({
  language,
  variant,
  telHref,
  whatsappUrl,
  onRetry,
}: ErrorStateProps) {
  const dict = COPY[language as keyof typeof COPY] ?? COPY.en
  const v = dict[variant]
  const badge = variant === 'not-found' ? '404' : dict.badge
  // Phone-first: on the 404 the call CTA is the primary; on the error page the
  // retry is primary, so the call CTA steps down to the outline treatment.
  const callClass = variant === 'not-found' ? BTN_PRIMARY : BTN_OUTLINE

  return (
    <section className="mx-auto flex max-w-[720px] flex-col items-center px-[18px] py-16 text-center lg:py-24">
      <p className="mb-3 font-body text-[13px] font-extrabold uppercase tracking-[1px] text-primary">
        {badge}
      </p>
      <h1 className="m-0 mb-4 text-balance font-display text-[30px] font-extrabold leading-[1.1] tracking-[-0.5px] text-foreground lg:text-[46px]">
        {v.title}
      </h1>
      <p className="m-0 mb-9 max-w-[520px] font-body text-[16.5px] leading-[1.5] text-muted-foreground lg:text-[19px]">
        {v.message}
      </p>

      <div className="flex w-full flex-col items-center justify-center gap-[11px] sm:w-auto sm:flex-row sm:flex-wrap sm:gap-[14px]">
        {onRetry && (
          <button type="button" onClick={onRetry} className={`${BTN_PRIMARY} w-full sm:w-auto`}>
            {dict.retry}
          </button>
        )}

        {telHref && (
          <a href={telHref} data-track="call" className={`${callClass} w-full sm:w-auto`}>
            {dict.call}
          </a>
        )}

        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-track="whatsapp"
            className={`${BTN_WHATSAPP} w-full sm:w-auto`}
          >
            {dict.whatsapp}
          </a>
        )}

        <Link href="/" className={`${BTN_OUTLINE} w-full sm:w-auto`}>
          {dict.home}
        </Link>
      </div>
    </section>
  )
}
