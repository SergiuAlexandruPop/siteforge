# ElectroWill Solutions — Agent Context

> Read this before any work on ElectroWill. **Single source of truth** for `electrowill-solutions`.
> **Auto-update the "Living state" section as the final step of any change here.**
> Do not duplicate this client's state into `docs/CONTEXT.md`.
> Scoping locked 2026-06-26 (see "Scoping brief"). Next phase: Design Direction (Claude Design).

## Identity
- **What it is:** Electrical contractor in județul **Bistrița-Năsăud**. Two services:
  (1) **Branșamente electrice** — "Îți aducem curentul în casă" (PRIMARY, lead-gen focus);
  (2) **Proiecte instalații electrice** for businesses, institutions, and individuals (SECONDARY,
  shown with EQUAL weight — must not be buried; higher-value commercial leads matter).
- **Primary goal:** capture leads from local search (incl. colloquial intent: "să-mi bag curent în
  casă", "vreau curent la casă"). The site is the closer; Google Business Profile is the main
  acquisition channel (Phase H).
- **Key selling point:** handle ALL paperwork "la cheie" (ATR, dosar, relația cu operatorul) — the
  client does nothing. Plus: autorizați ANRE, răspuns în 12 ore, priză de pământ corectă + buletin.
- **Audience:** ~90% rural BN, mostly cheap/old Android (some iPhone), little desktop. ~10-second
  attention span. Plain language, low reading level — "branșament" always explained in plain terms.
- **Tone:** local, de încredere, fără fițe. Professional, NOT heavy dialect. Use colloquial search
  phrases as headings/FAQ/keywords for relatability + SEO.
- **Language(s):** Romanian only (`i18n: false`). No Hungarian.
- **How visitors arrive:** local Google search + Google Business Profile + direct. Phone-first,
  **WhatsApp is the primary channel.**
- **Service area:** marketed across the WHOLE county (Beclean/Braniștea base). Self-perform across BN
  **except** Bistrița & Năsăud cities (+ Cluj overflow), which are passed to partners for a margin.
  ⚠️ **NEVER mention subcontracting on the public site** — present as full county coverage.

## Coordinates
- **Folder:** `clients/electrowill-solutions/`
- **Domain:** `electrowill.ro` — to be PURCHASED at ROTLD (available), DNS via Cloudflare, gray cloud.
- **Env file:** `env/.env.electrowill-solutions` — keys EMPTY except `ACTIVE_CLIENT` + `ADMIN_SESSION_SECRET`.
- **Dev:** `yarn dev:electrowill-solutions`  ·  **Build:** `yarn build:electrowill-solutions`
- **Layout (planned):** CUSTOM `ElectroWillLayout` (hosts sticky call/WhatsApp bar) — to build in Phase B.
- **Homepage (planned):** CUSTOM `ElectroWillHomePage` (lean, photo-led, single scroll) — Phase B.
- **Components live in:** `src/components/electrowill/` (co-location by domain, like portfolio).

## Features — current config.ts vs target
- **Current:** i18n ✗ · blog ✓ · darkMode ✓ · contactForm ✓ · smartsupp ✗ · supabase ✗
- **TARGET (flip in Phase B):** i18n ✗ · **blog ✗** · **darkMode ✗ (light only)** · contactForm ✓ ·
  smartsupp ✗ · supabase ✗

---

## Scoping brief (LOCKED 2026-06-26)

### Business facts
- Firmă: ElectroWill Solutions (exact denumire TBD), **CUI 50544190**, Nr. Reg. Com. **J… TBD**, sediu social TBD.
- Atestat ANRE: branșamente + rețele electrice (exact type/nr TBD). Electricieni: **1× grad II, 1× grad III**.
- Stats (usable, no named refs — anonymity): **100+ branșamente**, **3+ primării**, multiple businesses.
- Contact: phone/WhatsApp **0750447426**, lead email **electrowillsolutions@gmail.com**.

### Offer / copy
- **H1:** "Îți aducem curentul în casă."
- **Subline:** "Branșamente electrice în Bistrița-Năsăud. Autorizați ANRE · Răspundem în 12 ore · Ne ocupăm de toate actele."
- **No prices** (per-situation, "evaluare gratuită").
- **Promises:** "Te ajutăm cu actele" · "Răspundem în 12 ore".
- **Warranty line:** "Lucrări garantate — primești certificat de garanție și declarația de conformitate, conform legii."
  (Labor warranty is contractual under Cod civil + Legea 10/1995 / I7/2011; products 2 ani OUG 140/2021. NOT legal advice.)
- **Trust badges:** Autorizați ANRE · 100+ branșamente · 3+ primării · acoperim tot județul BN ·
  priză de pământ + buletin · garanție · "ne ocupăm de acte".
- **Regional phrases** (headings/FAQ/keywords, validated): "vreau curent la casă", "să-mi bag curent",
  "mă legați la curent", "să-mi pună contor/ceas", "să-mi pună stâlp", "branșament la casă nouă/teren",
  "n-am curent pe teren", "faceți și la sat?". Keep professional, don't overdo dialect.

### Priză de pământ — feature it (safety = trust)
- Main protection vs indirect electrocution; mandatory (I7/2011, PE 107/2013); measured (rezistența de
  dispersie) → buletin/proces-verbal often required by operator. Cheap unauthorized "meșteri" skip it.
- **Photograph during install, before backfill** (electrode + platbandă + connection) — proves it was done.
- Surface in: a homepage trust point, a plain FAQ entry ("De ce e importantă priza de pământ?" → te
  protejează de electrocutare), gallery captions. Keep explanation plain, no ohm values on the site.

### Build approach
- Custom homepage + custom layout (sticky bar) + custom `/contact`. Components in `src/components/electrowill/`.
- **LEAN: NO Lenis/Motion.** Light native motion only: `ScrollReveal` (IntersectionObserver) + `CountUp`,
  respecting `prefers-reduced-motion`. Reuse generic sections where they fit (Hero, Features, Showcase, CtaBanner).
- Mobile-first (375px), tap targets ≥44px (larger here), light mode, hard performance budget for old Android.

### Homepage (single scroll, light, photo-led)
Sticky bar (Sună · WhatsApp, always) → **Hero** (real photo + H1 + subline + 2 CTAs) →
**Cele 2 servicii** (equal: Branșamente / Proiecte) → **Cum funcționează** (3 pași, "noi facem actele") →
**De ce noi** (badges + CountUp: 100+ branșamente, 3+ primării, Autorizați ANRE) →
**Lucrările noastre** (photo gallery) → **Recenzii** (later, Phase H) →
**Întrebări** (plain RO, scary questions — do NOT label "FAQ") → **Zona acoperită** (BN towns) →
**CTA final** → **Footer**.
Sitemap: `/` , `/contact` , `/confidentialitate` , `/termeni`. No blog, no `/en`, no `/projects`.

### Lead capture (#3 — free: Resend + wa.me; no Smartsupp)
- Sticky bar from start: **Sună acum** primary + WhatsApp secondary.
- Capture card: ONE phone field + **Sună-mă** + **Scrie pe WhatsApp**. Copy: "Lasă numărul, te sunăm noi /
  Gratuit, fără obligații." Gentle consent microcopy + small "Detalii" link to privacy.
- **Trigger:** once/session, first of **~60% scroll OR ~35s**; dismissible; exit-intent on desktop.
  NOT on hero — let them read the pitch first.
- **Abandoned-number rescue:** valid complete number not submitted → email after **~3 min idle or on
  tab-close** (`navigator.sendBeacon`), flagged "număr lăsat, neconfirmat — sună cu blândețe."
- **Tracking:** cookieless first-party counter (taps on phone / WhatsApp / form). NO GA4, NO cookie banner.
- Resend free tier (3,000/mo, 100/day) is ample. Add a phone-first route (existing /api/contact requires email).

### Work photos (fixed set in `clients/electrowill-solutions/public/`)
- Orientation: **landscape 4:3 or 3:2** (gallery crops 16:10). 1–2 vertical only for mobile hero.
- ≥1600px wide, full phone quality, no digital zoom. Daytime, light behind the shooter. Fill frame, one subject.
- Shoot: firida/contor montat curat; stâlp + coborâre cablu; racord ordonat; tablou finit; șanț branșament
  subteran; echipa la lucru; **priza de pământ during install**. A few "în timpul" + "rezultat" pairs.
- Privacy: no client faces w/o consent; avoid house numbers, plăcuțe auto, nume pe cutia poștală. GPS stripped via Sharp.
- 8–15 strong photos + 1 hero. Use branded labeled placeholders until photos arrive.

### Legal / footer
- Footer (NAP, NO public address — service-area): denumire · CUI 50544190 · Nr. Reg. Com. J… · atestat ANRE nr ·
  "Acoperim județul Bistrița-Năsăud" · 0750447426 · email. Plus **ANPC + SOL** links.
- Pages: **Politică de confidențialitate** (collects phone/email) + light **Termeni**.
- ⚠️ Sediu social (legal) may still need listing in Termeni even though no visits are invited — verify in Phase F.
- ⚠️ GDPR: verify lawful basis for abandoned-number capture in Phase F (parked, gentle microcopy only for now).

---

## Phase plan to launch
- **A) Design Direction (Claude Design)** — 3-option brief → user picks → distill `DESIGN.md` + seed `theme.ts`. ← NEXT
- **B) Build core (Claude Code)** — flip flags (blog/darkMode off), theme, custom layout+homepage+contact, light motion, placeholders.
- **C) Lead capture** — phone card #3, wa.me handoff, abandoned-number rescue, cookieless counter, phone-first Resend route.
- **D) Content & SEO** — copy, FAQ (plain RO), zona BN, LocalBusiness/Electrician JSON-LD (areaServed BN, no address).
- **E) Photos** — optimize fixed set (Sharp: resize/WebP/strip GPS), feature priza-de-pământ, swap placeholders.
- **F) Legal** — footer identifiers + Politică confidențialitate + Termeni + ANPC/SOL (user provides certificat de înregistrare).
- **G) Infra/launch** — buy electrowill.ro (ROTLD) → Cloudflare DNS → Vercel; Resend keys; set up WhatsApp Business on 0750447426; deploy.
- **H) Google Business Profile** — full setup as service-area business (hide address) + reviews engine (one-tap review link via WhatsApp/SMS). Dedicated final phase.

## Open inputs needed (collect at the relevant phase)
1. Exact ANRE atestat type + number; confirm electrician grades. (Phase B/D — trust block)
2. Exact denumire + Nr. Reg. Com. (J…) + sediu social — from certificat de înregistrare. (Phase F)
3. Work photos (Phase E). 4. Logo — created at the very end, a later phase (none now; use text wordmark).

## File map
- `config.ts` — ⚠️ still template-ish: `domain: 'localhost'`, generic SEO, placeholder phone `+40 700 000 000`.
  Phase B: real domain/phone/email, flip blog/darkMode off, register custom layout/homepage.
- `theme.ts` — ⚠️ UNTOUCHED template: primary `#2563eb` (blue), Inter. Phase A seeds real palette from Claude Design.
- `index.ts` — manifest. Phase B: register `layout`, `homepage`, custom `pages` (contact, confidentialitate, termeni).
- `content/pages/index.md` — stub. `content/blog*`, `pages-en/` — empty (blog/i18n off; can be removed).
- `public/` — empty. No logo/favicon/og-image yet.

## Living state   ← AUTO-UPDATED
- **Last updated:** 2026-06-26
- **Status:** **Scoped & locked.** Full requirements, copy direction, structure, lead-capture spec,
  photo brief, and phase plan defined above. No client-specific code built yet. Ready for Phase A (Claude Design).
- **What's built:** Bare scaffold from `yarn new-client` only.
- **Known issues / TODO:** see "Open inputs needed" + "Legal" warnings. config.ts/theme.ts still template.
- **Next step:** Write the Claude Design 3-option brief → user generates options in Claude Design → pick →
  distill `DESIGN.md` + seed `theme.ts` → then Phase B build.

## Client gotchas
- i18n OFF, blog OFF (target), darkMode OFF (target) — light mode only. Don't add `pages-en/` or dark styling.
- **Lean client: NO Lenis/Motion.** Only IntersectionObserver reveals + CountUp. Old-Android perf is paramount.
- **Service-area business: no public address.** LocalBusiness JSON-LD uses `areaServed` (BN), no street address.
- **Never expose subcontracting** (Bistrița/Năsăud cities + Cluj passed to partners) on the public site.
- Phone-first: lead capture is phone-only (no email field) — the existing /api/contact requires email, so add a phone-first route.
- Before deploy, follow `docs/CLIENT_SETUP_CHECKLIST.md`: R2 bucket only if managed gallery (NOT needed — photos are static in public/),
  Resend key, strong `ADMIN_PASSWORD`. GitHub token not needed (blog off).
- Domain `electrowill.ro` is `.ro` → registrar ROTLD, DNS via Cloudflare, proxy gray (DNS only, no double-CDN).
