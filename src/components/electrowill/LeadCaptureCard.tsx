'use client'

import { useId, useState } from 'react'
import { cn } from '@/lib/utils'
import { WhatsAppButton } from './WhatsAppButton'
import { Turnstile } from './Turnstile'
import { PhoneIcon } from './icons'
import { isCompleteRoPhone } from '@/lib/phone-ro'
import { useAbandonedNumber } from '@/hooks/useAbandonedNumber'

// ---------------------------------------------------------------------------
// LeadCaptureCard — the phone-capture card body (ElectroWill #3, DESIGN.md G1).
// ---------------------------------------------------------------------------
// Built in the ElectroWill design language (white surface, hairline border,
// radius 18, primary CTA) — it lives in neither mock, so it's designed here.
// ONE phone field → primary "Sună-mă" (POSTs the number; the business calls
// back) + secondary "Scrie pe WhatsApp" (the always-secondary channel). Gentle
// consent microcopy + a small "Detalii" link to /confidentialitate.
//
// "Sună-mă" is a form SUBMIT (not a tel: anchor) — the point is to leave the
// number, not to dial. We reuse the primary CTA *styling*, not CallButton.
// The abandoned-number rescue hook watches the field for a valid-but-unsent
// number. Phone-first: WhatsApp is always the secondary action.
// ---------------------------------------------------------------------------

type Status = 'idle' | 'submitting' | 'success' | 'error'

interface LeadCaptureCardProps {
  /** Title id so the dialog can label itself (aria-labelledby). */
  titleId: string
  /** Close the card (also marks the session as dismissed). */
  onDismiss: () => void
}

export function LeadCaptureCard({ titleId, onDismiss }: LeadCaptureCardProps) {
  const inputId = useId()
  const errorId = `${inputId}-error`
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  // Honeypot: bots fill this hidden field; humans never see it.
  const [trap, setTrap] = useState('')
  // Cloudflare Turnstile token. Only required once a site key is configured.
  const [token, setToken] = useState<string | null>(null)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  useAbandonedNumber({
    value: phone,
    submitted: status === 'success',
    source: 'card',
  })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!isCompleteRoPhone(phone)) {
      setError('Introdu un număr de telefon valid (ex. 07xx xxx xxx).')
      return
    }

    // When Turnstile is active, wait for its token before sending.
    if (siteKey && !token) {
      setError('Verificare de securitate în curs… mai încearcă în câteva secunde.')
      return
    }

    setStatus('submitting')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, source: 'card', kind: 'submit', trap, token }),
      })
      if (!res.ok) throw new Error('request failed')
      setStatus('success')
      if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
        navigator.sendBeacon(
          '/api/track',
          JSON.stringify({ event: 'lead_submit' })
        )
      }
    } catch {
      setStatus('error')
      setError('Nu am putut trimite. Sună-ne direct sau încearcă din nou.')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <h2
          id={titleId}
          className="font-display text-[22px] font-extrabold text-foreground"
        >
          Mulțumim!
        </h2>
        <p className="mt-2 font-body text-[15px] leading-[1.45] text-muted-foreground">
          Te sunăm în cel mai scurt timp. Dacă vrei mai repede, scrie-ne pe
          WhatsApp.
        </p>
        <WhatsAppButton className="mt-5 h-[54px] w-full text-[16px]">
          Scrie pe WhatsApp
        </WhatsAppButton>
        <button
          type="button"
          onClick={onDismiss}
          className="mt-3 font-body text-[14px] font-semibold text-muted-foreground underline underline-offset-2"
        >
          Închide
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Honeypot — off-screen, aria-hidden, untabbable. Only bots fill it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor={`${inputId}-companie`}>Nu completa acest câmp</label>
        <input
          id={`${inputId}-companie`}
          type="text"
          name="companie"
          tabIndex={-1}
          autoComplete="off"
          value={trap}
          onChange={(e) => setTrap(e.target.value)}
        />
      </div>

      <h2
        id={titleId}
        className="pr-10 font-display text-[22px] font-extrabold leading-[1.15] text-foreground"
      >
        Lasă numărul, te sunăm noi
      </h2>
      <p className="mt-1.5 font-body text-[15px] leading-[1.45] text-muted-foreground">
        Gratuit, fără obligații.
      </p>

      <label htmlFor={inputId} className="sr-only">
        Numărul tău de telefon
      </label>
      <input
        id={inputId}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="07xx xxx xxx"
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value)
          if (error) setError(null)
        }}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="mt-4 h-[56px] w-full rounded-[14px] border border-border bg-background px-4 font-body text-[16px] text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
      />
      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-2 font-body text-[13.5px] text-destructive"
        >
          {error}
        </p>
      )}

      {siteKey && (
        <Turnstile
          siteKey={siteKey}
          onToken={setToken}
          onExpire={() => setToken(null)}
        />
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className={cn(
          'mt-3 inline-flex h-[58px] w-full items-center justify-center gap-[11px] rounded-[14px]',
          'bg-primary text-primary-foreground font-body text-[16px] font-extrabold',
          'transition-[background-color] duration-150 hover:brightness-[.94]',
          'disabled:cursor-not-allowed disabled:opacity-70'
        )}
      >
        <PhoneIcon className="h-[1.1em] w-[1.1em] shrink-0" />
        {status === 'submitting' ? 'Se trimite…' : 'Sună-mă'}
      </button>

      <WhatsAppButton className="mt-[11px] h-[58px] w-full text-[16px]">
        Scrie pe WhatsApp
      </WhatsAppButton>

      <p className="mt-3 font-body text-[12.5px] leading-[1.4] text-muted-foreground">
        Lăsând numărul, ești de acord să te contactăm despre solicitarea ta.{' '}
        <a
          href="/confidentialitate"
          className="underline underline-offset-2 hover:text-foreground"
        >
          Detalii
        </a>
      </p>
    </form>
  )
}
