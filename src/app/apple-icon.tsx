import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
          borderRadius: '36px',
        }}
      >
        <svg
          viewBox="0 0 32 32"
          width="120"
          height="120"
        >
          {/* Rocket body */}
          <path d="M16 2 L11 14 L11 22 Q11 24 13 25 L19 25 Q21 24 21 22 L21 14 Z" fill="#3b82f6" />
          {/* Nosecone */}
          <path d="M16 2 L11 12 L21 12 Z" fill="#ef4444" />
          {/* Left fin */}
          <path d="M11 19 L7 24 L7 26 L11 23 Z" fill="#2563eb" />
          {/* Right fin */}
          <path d="M21 19 L25 24 L25 26 L21 23 Z" fill="#2563eb" />
          {/* Window */}
          <circle cx="16" cy="16" r="3" fill="#93c5fd" />
          <circle cx="16" cy="16" r="1.8" fill="#dbeafe" />
          {/* Exhaust */}
          <path d="M13 25 Q14.5 29 16 31 Q17.5 29 19 25" fill="#f97316" opacity="0.9" />
          <path d="M14.2 25 Q15.2 28 16 30 Q16.8 28 17.8 25" fill="#fbbf24" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
