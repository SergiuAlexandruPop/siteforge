'use client'

import { useId, useState } from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { FAQ_ITEMS } from './content/faq'

// ---------------------------------------------------------------------------
// FaqAccordion — accessible "Întrebări" accordion (DESIGN.md §4.7, D11).
// ---------------------------------------------------------------------------
// Each question is a <button aria-expanded aria-controls> toggling a region
// (aria-labelledby) — full keyboard support, no library. Height animates via
// the grid-rows 0fr↔1fr trick, gated by prefers-reduced-motion. Items toggle
// independently. NEVER labelled "FAQ" — heading is "Întrebări frecvente".
//
// Content lives in ./content/faq.ts (FAQ_ITEMS) — the same array drives the
// FAQPage JSON-LD (ElectroWillJsonLd), so the visible Q&A and the structured
// data can never drift apart.
// ---------------------------------------------------------------------------

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn('h-5 w-5 shrink-0 text-primary transition-transform duration-200', open && 'rotate-180')}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function FaqAccordion() {
  const prefersReduced = useReducedMotion()
  const baseId = useId()
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div>
      <h2 className="m-0 mb-6 font-display text-[25px] font-extrabold tracking-[-0.4px] text-foreground lg:text-[34px]">
        Întrebări frecvente
      </h2>

      <div className="flex flex-col gap-[14px]">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = open === i
          const btnId = `${baseId}-q-${i}`
          const panelId = `${baseId}-a-${i}`
          return (
            <div key={item.q} className="rounded-[16px] border border-border bg-white">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-[22px] text-left"
              >
                <span className="font-display text-[17px] font-bold text-foreground lg:text-[18px]">
                  {item.q}
                </span>
                <ChevronIcon open={isOpen} />
              </button>

              <div
                id={panelId}
                role="region"
                aria-labelledby={btnId}
                hidden={!isOpen && prefersReduced}
                className={cn(
                  'grid px-6',
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  !prefersReduced && 'transition-[grid-template-rows] duration-300 ease-out',
                )}
              >
                <div className="overflow-hidden">
                  <p className="m-0 pb-[22px] font-body text-[16px] leading-[1.5] text-muted-foreground">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
