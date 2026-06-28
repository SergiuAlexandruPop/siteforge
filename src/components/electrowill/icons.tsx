import type { SVGProps } from 'react'

// ---------------------------------------------------------------------------
// ElectroWill — inline SVG icon set.
// ---------------------------------------------------------------------------
// The design references lucide glyphs, but `lucide-react` is NOT a project
// dependency and the client has a hard old-Android performance budget + a
// "lean dependencies" mandate (DESIGN.md §1). So the handful of glyphs the
// homepage needs are inlined here as tiny stroke SVGs (currentColor), plus the
// WhatsApp brand mark as a filled path (lucide has no brand icons anyway —
// DESIGN.md §4.1). Each accepts standard SVG props (className, etc.).
//
// Stroke icons are drawn lucide-style: 24×24 viewBox, fill none, stroke
// currentColor, round caps/joins, width 2.
// ---------------------------------------------------------------------------

type IconProps = SVGProps<SVGSVGElement>

function Stroke({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

/** Lightning bolt — Branșamente / wordmark chip. */
export function BoltIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
    </Stroke>
  )
}

/** Phone handset — primary call action. */
export function PhoneIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
    </Stroke>
  )
}

/** Document lines — Proiecte instalații electrice. */
export function FileTextIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8M8 17h8M8 9h2" />
    </Stroke>
  )
}

/** Document with a signature swoosh — "Ne ocupăm de acte" step. */
export function FileSignatureIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h5" />
      <path d="M14 2v6h6" />
      <path d="M8 11h3" />
      <path d="M15.5 13.5a2.12 2.12 0 0 1 3 3L15 20l-3 1 1-3Z" />
    </Stroke>
  )
}

/** Plug with a bolt — "Ai curent" step. */
export function PlugZapIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z" />
      <path d="m2 22 3-3" />
      <path d="M7.5 13.5 10 11M10.5 16.5 13 14" />
      <path d="M18 3l-4 4h6l-4 4" />
    </Stroke>
  )
}

/** Check mark — trust badges. */
export function CheckIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M20 6 9 17l-5-5" />
    </Stroke>
  )
}

/** Clock — "Răspundem în 12 ore". */
export function ClockIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </Stroke>
  )
}

/** Shield (halved) — "Autorizați ANRE" eyebrow. */
export function ShieldIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="M12 2v20" />
    </Stroke>
  )
}

/** Document with a check — "Ne ocupăm de acte" inline trust. */
export function FileCheckIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="m9 15 2 2 4-4" />
    </Stroke>
  )
}

/** Map pin — Zona acoperită. */
export function MapPinIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </Stroke>
  )
}

/**
 * WhatsApp brand mark — filled glyph (uses currentColor as fill).
 * Brand icon, intentionally not a lucide stroke icon (DESIGN.md §4.1).
 */
export function WhatsAppIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.87 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35ZM12.02 21.5h-.01a9.46 9.46 0 0 1-4.82-1.32l-.35-.2-3.58.94.96-3.49-.23-.36a9.45 9.45 0 0 1-1.45-5.04c0-5.23 4.26-9.49 9.5-9.49 2.54 0 4.92.99 6.71 2.79a9.42 9.42 0 0 1 2.78 6.71c0 5.23-4.26 9.49-9.49 9.49Zm8.08-17.57A11.36 11.36 0 0 0 12.02.6C5.74.6.63 5.71.63 11.99c0 2.01.53 3.97 1.53 5.7L.53 23.4l5.85-1.54a11.36 11.36 0 0 0 5.64 1.44h.01c6.28 0 11.39-5.11 11.39-11.39 0-3.04-1.19-5.9-3.32-8.05Z" />
    </svg>
  )
}
