import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { Hero } from './Hero'
import { ServicesPair } from './ServicesPair'
import { HowItWorks } from './HowItWorks'
import { WhyUs } from './WhyUs'
import { WorkGallery } from './WorkGallery'
import { FaqAccordion } from './FaqAccordion'
import { ServiceArea } from './ServiceArea'
import { CtaFinal } from './CtaFinal'
import { LeadCaptureManager } from './LeadCaptureManager'
import { ElectroWillJsonLd } from './ElectroWillJsonLd'

// ---------------------------------------------------------------------------
// ElectroWillHomePage — single-scroll homepage composition (DESIGN.md §5).
// ---------------------------------------------------------------------------
// Full desktop section set (canonical), reflowed to one column on mobile (D10):
//   Hero → Servicii → Cum funcționează → De ce noi (dark) → Lucrările noastre
//   → Întrebări + Zona acoperită (band) → CTA final.
// Sticky header + mobile bottom bar come from ElectroWillLayout. Lean motion:
// shared ScrollReveal (IO) on each below-the-fold block; CountUp lives in WhyUs.
// Both gate on prefers-reduced-motion. Romanian only (language prop unused).
// ---------------------------------------------------------------------------

interface ElectroWillHomePageProps {
  language?: string
}

export function ElectroWillHomePage(_props: ElectroWillHomePageProps) {
  return (
    <>
      {/* Electrician (LocalBusiness) + FAQPage structured data (Phase D). */}
      <ElectroWillJsonLd />

      <Hero />

      <ScrollReveal direction="up">
        <ServicesPair />
      </ScrollReveal>

      <ScrollReveal direction="up">
        <HowItWorks />
      </ScrollReveal>

      <ScrollReveal direction="up">
        <WhyUs />
      </ScrollReveal>

      <ScrollReveal direction="up">
        <WorkGallery />
      </ScrollReveal>

      <ScrollReveal direction="up">
        <section
          id="zona"
          className="scroll-mt-[90px] border-y border-ew-band-border bg-ew-band"
        >
          <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-start gap-10 px-[18px] py-7 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:px-10 lg:py-[72px]">
            <FaqAccordion />
            <ServiceArea />
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal direction="up">
        <CtaFinal />
      </ScrollReveal>

      {/* Lead-capture popup (#3): homepage-only, scroll/idle/exit-intent triggered. */}
      <LeadCaptureManager />
    </>
  )
}
