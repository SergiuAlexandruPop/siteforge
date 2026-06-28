'use client'

import { useEffect, useRef } from 'react'

// ---------------------------------------------------------------------------
// Turnstile — zero-dependency Cloudflare Turnstile wrapper (ElectroWill #3).
// ---------------------------------------------------------------------------
// Loads the Cloudflare script ON MOUNT. Because the lead card only mounts when
// the modal opens, no third-party JS touches the perf-critical first paint of
// the homepage — it loads lazily, only if/when a visitor sees the popup.
//
// `appearance: 'interaction-only'` keeps the widget invisible unless Cloudflare
// decides a challenge is actually needed. Reports the solved token via onToken;
// onExpire fires when the token lapses (~5 min) or errors, so the card can clear
// it. Renders nothing meaningful until the script resolves; the parent only
// mounts this when a site key is configured (dev/pre-Phase-G renders no widget).
// ---------------------------------------------------------------------------

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
const SCRIPT_ID = 'cf-turnstile-script'

interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string
  remove: (id: string) => void
  reset: (id?: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

interface TurnstileProps {
  siteKey: string
  onToken: (token: string) => void
  onExpire?: () => void
}

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('No document'))
      return
    }
    const existing = document.getElementById(
      SCRIPT_ID
    ) as HTMLScriptElement | null
    if (existing) {
      if (window.turnstile) resolve()
      else existing.addEventListener('load', () => resolve())
      return
    }
    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = SCRIPT_SRC
    script.async = true
    script.defer = true
    script.addEventListener('load', () => resolve())
    script.addEventListener('error', () =>
      reject(new Error('Turnstile script failed to load'))
    )
    document.head.appendChild(script)
  })
}

export function Turnstile({ siteKey, onToken, onExpire }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  // Keep the latest callbacks without re-rendering the widget.
  const cbRef = useRef({ onToken, onExpire })
  cbRef.current = { onToken, onExpire }

  useEffect(() => {
    let cancelled = false

    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          appearance: 'interaction-only',
          callback: (token: string) => cbRef.current.onToken(token),
          'expired-callback': () => cbRef.current.onExpire?.(),
          'error-callback': () => cbRef.current.onExpire?.(),
        })
      })
      .catch(() => {
        // Script/network failure — leave the token unset; the card's submit
        // gate shows a gentle retry rather than blocking the lead outright.
      })

    return () => {
      cancelled = true
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch {
          // widget already gone — ignore
        }
        widgetIdRef.current = null
      }
    }
  }, [siteKey])

  return <div ref={containerRef} className="mt-3 empty:mt-0" />
}
