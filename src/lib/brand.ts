import type { ClientConfig } from '@/types/config'

// ---------------------------------------------------------------------------
// Brand helpers — pure, client-safe (no components, no server-only APIs).
// ---------------------------------------------------------------------------
// A tiny, serializable view of the active client's contact identity. The Server
// RootLayout derives it from the full config and passes it through BrandProvider
// so Client Components (e.g. app/error.tsx) can show brand contact WITHOUT
// importing getClientConfig() — that would pull the client manifest (layout /
// homepage server components) into the client bundle. Strings only.
// ---------------------------------------------------------------------------

export interface Brand {
  /** Human-readable brand name (config.displayName). */
  displayName: string
  /** Language code from config.defaultLanguage (e.g. 'ro'). Drives fallback copy. */
  language: string
  /** Human-readable phone, or '' when the client declares none. */
  phone: string
  /** `tel:` href, or '' when no phone. */
  telHref: string
  /** `https://wa.me/<intl-digits>`, or '' when no phone. */
  whatsappUrl: string
}

/** Build a wa.me URL from a display phone (intl digits, no '+'). '' when empty. */
export function toWhatsAppUrl(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return digits ? `https://wa.me/${digits}` : ''
}

/** Derive the serializable Brand that the client-side context carries. */
export function getBrand(config: ClientConfig): Brand {
  const phone = config.contact.phone ?? ''
  const telDigits = phone.replace(/[^\d+]/g, '')
  return {
    displayName: config.displayName,
    language: config.defaultLanguage,
    phone,
    telHref: telDigits ? `tel:${telDigits}` : '',
    whatsappUrl: toWhatsAppUrl(phone),
  }
}
