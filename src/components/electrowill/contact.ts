// ---------------------------------------------------------------------------
// ElectroWill — canonical UI contact formats.
// ---------------------------------------------------------------------------
// The lead number lives in clients/electrowill-solutions/config.ts
// (contact.phone = '+40 750 447 426'). These are the presentation-format
// derivatives the UI needs. Keep them in sync with config.ts. Phone-first:
// "Sună acum" is always primary, WhatsApp always the secondary action.
// ---------------------------------------------------------------------------

/** href for native dialer. */
export const PHONE_TEL = 'tel:0750447426'

/** Human-readable number shown on buttons. */
export const PHONE_DISPLAY = '0750 447 426'

/** WhatsApp deep link (international format, no '+'). */
export const WHATSAPP_URL = 'https://wa.me/40750447426'
