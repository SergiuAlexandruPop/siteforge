'use client'

import { useState, useCallback } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// ---------------------------------------------------------------------------
// AboutPage — ped.ro-inspired interactive bio page.
//
// Design:
//   - One continuous text block rendered at large size
//   - "Summary" phrases are always visible (the TL;DR)
//   - Keywords are UPPERCASE with pill borders, always visible or chain-revealed
//   - Hidden text is blurred — clicking a keyword toggles reveal on/off
//   - Click again to collapse (blur) the text back
//   - Revealed text is WHITE by default — turns #B24027 only on HOVER
//   - Hovering anywhere on a revealed sentence highlights both the sentence
//     AND its parent keyword pill in #B24027
//   - Cascade collapse: keywords revealed by a parent collapse when parent
//     is toggled off (same-idea chains)
//   - Everything flows inline as one continuous paragraph
//   - Natural word-wrap at large font creates the artistic typographic layout
//
// Segment types:
//   summary  — always visible text (e.g. "Hey! I'm ", "I build ")
//   keyword  — pill-shaped, uppercase, clickable (toggle)
//   hidden   — blurred until parent keyword is clicked
// ---------------------------------------------------------------------------

const ACCENT = '#B24027'

interface AboutPageProps {
  language?: 'ro' | 'en'
}

// ---------------------------------------------------------------------------
// Segment types
// ---------------------------------------------------------------------------

interface SummarySegment {
  type: 'summary'
  text: string
}

interface KeywordSegment {
  type: 'keyword'
  id: string
  text: string
  alwaysVisible: boolean
  revealedBy?: string
  href?: string
}

interface HiddenSegment {
  type: 'hidden'
  text: string
  revealedBy: string
}

type Segment = SummarySegment | KeywordSegment | HiddenSegment

// ---------------------------------------------------------------------------
// Content — mirrors ped.ro's structure adapted for Sergiu
// ---------------------------------------------------------------------------

function getSegments(lang: 'ro' | 'en'): Segment[] {
  if (lang === 'ro') {
    return [
      { type: 'summary', text: "Yo! Sunt " },
      { type: 'keyword', id: 'sergiu', text: 'SERGIU', alwaysVisible: true },
      { type: 'hidden', text: " Pop. Nu prea stiu cum sa ma prezint ", revealedBy: 'sergiu' },
      { type: 'keyword', id: 'anymore', text: 'ANYMORE', alwaysVisible: false, revealedBy: 'sergiu' },
      { type: 'hidden', text: ". Background-ul meu este in dezvoltarea de aplicatii web, dar imi place tot ce tine de produs. Ma concentrez pe a ajuta startup-urile tech sa infloreasca. ", revealedBy: 'anymore' },
      { type: 'summary', text: "Construiesc " },
      { type: 'keyword', id: 'siteforge', text: 'SITEFORGE', alwaysVisible: true },
      { type: 'hidden', text: ". E o platforma moderna pentru crearea de site-uri web — ceva de care nu credeai ca ai ", revealedBy: 'siteforge' },
      { type: 'keyword', id: 'needed', text: 'NEVOIE', alwaysVisible: true },
      { type: 'hidden', text: ", dar odata ce o incerci, nu te mai intorci. ", revealedBy: 'needed' },
      { type: 'summary', text: "Port multe " },
      { type: 'keyword', id: 'hats', text: 'PALARII', alwaysVisible: true },
      { type: 'hidden', text: ". Cod curat, interfete gandite cu grija si automatizari cu AI — asta e zona mea. Imi place sa lucrez cu React, Next.js, TypeScript si Tailwind. Inainte de asta, am construit dashboard-uri, platforme de e-commerce si aplicatii de tracking. ", revealedBy: 'hats' },
      { type: 'summary', text: "Locuiesc in " },
      { type: 'keyword', id: 'romania', text: 'ROMANIA', alwaysVisible: true },
      { type: 'hidden', text: ". Cand nu scriu cod, probabil explorez tehnologii noi sau lucrez la proiecte personale. ", revealedBy: 'romania' },
      { type: 'summary', text: "Ma gasesti pe " },
      { type: 'keyword', id: 'linkedin', text: 'LINKEDIN', alwaysVisible: true, href: 'https://www.linkedin.com/in/sergiualexandrupop/' },
      { type: 'hidden', text: ", ", revealedBy: 'linkedin' },
      { type: 'keyword', id: 'github', text: 'GITHUB', alwaysVisible: false, revealedBy: 'linkedin', href: 'https://github.com/SergiuAlexandruPop' },
      { type: 'hidden', text: ", sau imi poti scrie un email.", revealedBy: 'linkedin' },
    ]
  }

  return [
    { type: 'summary', text: "Yo! I'm " },
    { type: 'keyword', id: 'sergiu', text: 'SERGIU', alwaysVisible: true },
    { type: 'hidden', text: " Pop. I'm not sure how to intro myself ", revealedBy: 'sergiu' },
    { type: 'keyword', id: 'anymore', text: 'ANYMORE', alwaysVisible: false, revealedBy: 'sergiu' },
    { type: 'hidden', text: ". My background is in web development, but I love everything related to product. I'm focused on helping early-stage tech startups flourish. ", revealedBy: 'anymore' },
    { type: 'summary', text: "I build " },
    { type: 'keyword', id: 'siteforge', text: 'SITEFORGE', alwaysVisible: true },
    { type: 'hidden', text: ". It's a platform for creating modern websites that you didn't think you ", revealedBy: 'siteforge' },
    { type: 'keyword', id: 'needed', text: 'NEEDED', alwaysVisible: true },
    { type: 'hidden', text: ", but once you try it, you can't go back. ", revealedBy: 'needed' },
    { type: 'summary', text: "I wear many different " },
    { type: 'keyword', id: 'hats', text: 'HATS', alwaysVisible: true },
    { type: 'hidden', text: ". Clean code, thoughtful interfaces, and AI-powered automation — that's my sweet spot. I love working with React, Next.js, TypeScript, and Tailwind. Before this, I built dashboards, e-commerce platforms, and tracking apps. ", revealedBy: 'hats' },
    { type: 'summary', text: "I live in " },
    { type: 'keyword', id: 'romania', text: 'ROMANIA', alwaysVisible: true },
    { type: 'hidden', text: ". When I'm not writing code, I'm probably exploring new tech or working on side projects. ", revealedBy: 'romania' },
    { type: 'summary', text: "You can find me on " },
    { type: 'keyword', id: 'linkedin', text: 'LINKEDIN', alwaysVisible: true, href: 'https://www.linkedin.com/in/sergiualexandrupop/' },
    { type: 'hidden', text: ", ", revealedBy: 'linkedin' },
    { type: 'keyword', id: 'github', text: 'GITHUB', alwaysVisible: false, revealedBy: 'linkedin', href: 'https://github.com/SergiuAlexandruPop' },
    { type: 'hidden', text: ", or shoot me an email.", revealedBy: 'linkedin' },
  ]
}

// ---------------------------------------------------------------------------
// Collect all keyword IDs that are children of a given parent (via revealedBy)
// Used for cascade collapse.
// ---------------------------------------------------------------------------
function getChildKeywordIds(segments: Segment[], parentId: string): string[] {
  const children: string[] = []
  for (const seg of segments) {
    if (seg.type === 'keyword' && seg.revealedBy === parentId) {
      children.push(seg.id)
      // Recurse: if ANYMORE is a child of SERGIU, and something is a child of ANYMORE
      children.push(...getChildKeywordIds(segments, seg.id))
    }
  }
  return children
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Pill({
  children,
  active,
  visible,
  highlighted,
  href,
  reducedMotion,
  onClick,
  onHoverChange,
}: {
  children: React.ReactNode
  active: boolean
  visible: boolean
  highlighted: boolean
  href?: string
  reducedMotion: boolean
  onClick: () => void
  onHoverChange: (hovered: boolean) => void
}) {
  const isHidden = !visible && !reducedMotion

  const handleClick = () => {
    // If already active and has href, open link. Otherwise toggle.
    if (active && href) {
      window.open(href, '_blank', 'noopener,noreferrer')
    }
    onClick()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  // Color logic for clickable pills:
  // - default (no hover): white bg, black text
  // - hover / clicked+hover: orange bg, black text
  // - after click (not hovering): white bg, black text
  // - highlighted (sentence hovered): orange border, black text, white bg
  const borderColor = highlighted ? ACCENT : 'rgba(255, 255, 255, 0.4)'
  const textColor = '#000'
  const bgColorDefault = '#fff'

  return (
    <span
      role="button"
      tabIndex={visible ? 0 : -1}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-hidden={!visible}
      style={{
        display: 'inline',
        cursor: 'pointer',
        borderWidth: '1.5px',
        borderStyle: 'solid',
        borderColor,
        backgroundColor: bgColorDefault,
        color: textColor,
        borderRadius: '0.75em',
        padding: '0.02em 0.3em',
        fontSize: '0.75em',
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase' as const,
        fontFamily: 'var(--font-inter), system-ui, sans-serif',
        lineHeight: 'inherit',
        verticalAlign: 'baseline',
        filter: isHidden ? 'blur(4px)' : 'blur(0px)',
        opacity: isHidden ? 0.3 : 1,
        transition: 'all 0.5s ease-out',
      }}
      onMouseEnter={(e) => {
        onHoverChange(true)
        e.currentTarget.style.backgroundColor = ACCENT
        e.currentTarget.style.borderColor = ACCENT
        e.currentTarget.style.color = '#000'
      }}
      onMouseLeave={(e) => {
        onHoverChange(false)
        e.currentTarget.style.backgroundColor = bgColorDefault
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'
        e.currentTarget.style.color = '#000'
      }}
    >
      {children}
    </span>
  )
}

function HiddenText({
  children,
  revealed,
  highlighted,
  reducedMotion,
  onHoverChange,
}: {
  children: React.ReactNode
  revealed: boolean
  highlighted: boolean
  reducedMotion: boolean
  onHoverChange: (hovered: boolean) => void
}) {
  const shouldBlur = !reducedMotion && !revealed

  return (
    <span
      style={{
        color: highlighted && revealed ? ACCENT : 'inherit',
        filter: shouldBlur ? 'blur(4px)' : 'blur(0px)',
        opacity: shouldBlur ? 0.3 : 1,
        transition: 'all 0.5s ease-out',
        cursor: revealed ? 'default' : undefined,
      }}
      onMouseEnter={() => {
        if (revealed) onHoverChange(true)
      }}
      onMouseLeave={() => {
        if (revealed) onHoverChange(false)
      }}
    >
      {children}
    </span>
  )
}

function GrainOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-30 opacity-[0.03] dark:opacity-[0.04]"
      aria-hidden="true"
    >
      <svg width="100%" height="100%">
        <filter id="about-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#about-grain)" />
      </svg>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function AboutPage({ language = 'en' }: AboutPageProps) {
  const lang = language === 'ro' ? 'ro' : 'en'
  const reducedMotion = useReducedMotion()
  const segments = getSegments(lang)

  const [clickedKeywords, setClickedKeywords] = useState<Set<string>>(
    () => new Set<string>(),
  )
  const [hoveredKeyword, setHoveredKeyword] = useState<string | null>(null)

  // Toggle click: add if missing, remove + cascade-collapse if present
  const handleClick = useCallback((id: string) => {
    setClickedKeywords((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        // Collapse: remove this keyword and all its children
        next.delete(id)
        for (const childId of getChildKeywordIds(segments, id)) {
          next.delete(childId)
        }
      } else {
        next.add(id)
      }
      return next
    })
  }, [segments])

  const isRevealed = (revealedBy?: string) => {
    if (!revealedBy) return true
    return clickedKeywords.has(revealedBy)
  }

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* Layer 1: Background video — subtle atmosphere */}
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-20"
        style={{ filter: 'blur(8px)' }}
        src="/videos/about-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        onError={(e) => {
          ;(e.target as HTMLVideoElement).style.display = 'none'
        }}
      />

      {/* Layer 2: Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div
          className="mx-auto max-w-5xl px-6 py-16 sm:px-10 sm:py-24 lg:px-16"
          aria-live="polite"
        >
          <p className="font-editorial text-2xl font-light leading-relaxed text-white sm:text-3xl sm:leading-relaxed lg:text-4xl lg:leading-relaxed">
            {segments.map((seg, i) => {
              switch (seg.type) {
                case 'summary':
                  return (
                    <span key={i} className="text-white">
                      {seg.text}
                    </span>
                  )

                case 'keyword': {
                  const visible =
                    seg.alwaysVisible || isRevealed(seg.revealedBy)
                  // Is this pill's linked sentence currently hovered?
                  const highlighted = hoveredKeyword === seg.id

                  return (
                    <Pill
                      key={i}
                      active={clickedKeywords.has(seg.id)}
                      visible={visible}
                      highlighted={highlighted}
                      href={seg.href}
                      reducedMotion={reducedMotion}
                      onClick={() => handleClick(seg.id)}
                      onHoverChange={(hovered) =>
                        setHoveredKeyword(hovered ? seg.id : null)
                      }
                    >
                      {seg.text}
                    </Pill>
                  )
                }

                case 'hidden': {
                  const revealed = isRevealed(seg.revealedBy)
                  // Highlight when hoveredKeyword matches this segment's parent
                  const highlighted = hoveredKeyword === seg.revealedBy

                  return (
                    <HiddenText
                      key={i}
                      revealed={revealed}
                      highlighted={highlighted}
                      reducedMotion={reducedMotion}
                      onHoverChange={(hovered) =>
                        setHoveredKeyword(hovered ? seg.revealedBy : null)
                      }
                    >
                      {seg.text}
                    </HiddenText>
                  )
                }

                default:
                  return null
              }
            })}
          </p>
        </div>
      </div>

      {/* Layer 3: Grain overlay */}
      <GrainOverlay />
    </section>
  )
}
