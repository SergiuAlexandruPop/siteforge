import type { ClientIcon } from '@/types/config'

// ---------------------------------------------------------------------------
// Portfolio — favicon / app-icon mark.
// ---------------------------------------------------------------------------
// The rocket, preserved from the previous SHARED app/icon.svg + app/apple-icon
// (which were portfolio-correct but wrong for other clients). Now owned by the
// portfolio client so per-client icons can diverge. Size-parametric: one mark
// for both the 32px favicon and the 180px apple-icon.
// ---------------------------------------------------------------------------

export const icon: ClientIcon = {
  mark: (px) => (
    <svg width={px} height={px} viewBox="0 0 32 32">
      {/* Rocket body */}
      <path d="M16 2 L11 14 L11 22 Q11 24 13 25 L19 25 Q21 24 21 22 L21 14 Z" fill="#2563eb" />
      {/* Nosecone */}
      <path d="M16 2 L11 12 L21 12 Z" fill="#e84a2e" />
      {/* Left fin */}
      <path d="M11 19 L7 24 L7 26 L11 23 Z" fill="#1d4ed8" />
      {/* Right fin */}
      <path d="M21 19 L25 24 L25 26 L21 23 Z" fill="#1d4ed8" />
      {/* Window */}
      <circle cx="16" cy="16" r="3" fill="#93c5fd" />
      <circle cx="16" cy="16" r="1.8" fill="#dbeafe" />
      {/* Exhaust */}
      <path d="M13 25 Q14.5 29 16 31 Q17.5 29 19 25" fill="#f97316" opacity="0.9" />
      <path d="M14.2 25 Q15.2 28 16 30 Q16.8 28 17.8 25" fill="#fbbf24" />
    </svg>
  ),
  // Dark slate gradient tile — the original apple-icon background.
  appleBackground: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
}
