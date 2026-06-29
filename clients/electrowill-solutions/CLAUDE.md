# ElectroWill Solutions — Agent Context

> Read this before any work on ElectroWill. **Single source of truth** for `electrowill-solutions`.
> **Auto-update the "Living state" section as the final step of any change here.**
> Do not duplicate this client's state into `docs/CONTEXT.md`.
> Scoping locked 2026-06-26. Phase A (design) + Phase B (core build) done. Next phase: C (lead capture).

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
- **Domain:** `electrowill.ro` — PURCHASED at ROTLD. Hosting on **Cloudflare Workers (OpenNext)**; DNS
  end-to-end on Cloudflare, **proxied (orange cloud)** so the free WAF/DDoS applies. (Decision #81.)
- **Env file:** `env/.env.electrowill-solutions` — keys EMPTY except `ACTIVE_CLIENT` + `ADMIN_SESSION_SECRET`.
- **Dev:** `yarn dev:electrowill-solutions`  ·  **Build:** `yarn build:electrowill-solutions`
- **Layout (planned):** CUSTOM `ElectroWillLayout` (hosts sticky call/WhatsApp bar) — to build in Phase B.
- **Homepage (planned):** CUSTOM `ElectroWillHomePage` (lean, photo-led, single scroll) — Phase B.
- **Components live in:** `src/components/electrowill/` (co-location by domain, like portfolio).

## Features — config.ts (Phase B: flipped to target ✅)
- **Current = target:** i18n ✗ · blog ✗ · darkMode ✗ (light only) · contactForm ✓ · smartsupp ✗ · supabase ✗

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
- **G) Infra/launch** — electrowill.ro (ROTLD, bought) → Cloudflare DNS (proxied) → **Cloudflare Workers (OpenNext)**;
  Resend keys; single CF rate-limit rule on /api/lead + Bot Fight Mode; WhatsApp Business on 0750447426; deploy.
  **G0 done (2026-06-28):** `@opennextjs/cloudflare` adapter wired — `open-next.config.ts`, `wrangler.jsonc`
  (nodejs_compat), `build:cf:`/`preview:cf:electrowill-solutions` scripts. Install deps + run the CF build to verify.
  **G1 DONE (2026-06-29) — first deploy LIVE:** `https://electrowill-solutions.sergiualexandrupop.workers.dev`.
  Earlier failure was a Yarn-version mismatch (Corepack defaulted to Yarn 4 → tried to migrate the v1
  `yarn.lock` under an immutable CI install, `YN0087`→`YN0028`); fixed by pinning `"packageManager":
  "yarn@1.22.22"` (see `docs/DEV_NOTES.md`). Redeploy ran on Yarn 1, build + deploy green. The streamlined
  Workers Builds import flow only set Worker name + build cmd upfront; branch/deploy-cmd/env vars live under
  the Worker's **Settings** after creation. Deploy cmd `npx wrangler deploy` auto-delegates to
  `opennextjs-cloudflare deploy` and does NOT rebuild (reuses `.open-next`) — fine as-is.
  **G1 env vars DONE (2026-06-29):** the 4 plain-text vars (ACTIVE_CLIENT, EW_RESCUE_ENABLED=false,
  RESEND_FROM_EMAIL placeholder, RESEND_TO_EMAIL) live in `wrangler.jsonc` → `vars` (committed, re-applied
  every deploy); ADMIN_SESSION_SECRET added as an encrypted **Secret** in the dashboard (persists across
  deploys). WHY the split: dashboard-only plain vars are wiped by `wrangler deploy`; secrets are not — see
  `docs/DEV_NOTES.md`. Note ADMIN_PASSWORD is NOT set (blog/admin OFF for this client) so admin login is
  inert anyway — the secret just keeps shared `/admin` routes from 500-ing.
  **G1 STILL TO DO:** push (so the new `vars` deploy) + smoke test the live URL (homepage, sticky bar,
  favicon, POST /api/lead).
  **G1 findings to fix (from the build log):**
  - ⚠️ **Duplicate favicon:** the Task-A `git rm src/app/icon.svg` was NEVER done — `src/app/icon.svg`
    (old shared rocket) still coexists with the dynamic `src/app/icon.tsx` (green bolt). Build emits BOTH
    `/icon` and `/icon.svg`; the live tab icon may be the old rocket. Fix: `git rm src/app/icon.svg` + redeploy.
  - **ESLint broken in build (non-blocking tech debt):** `Converting circular structure to JSON … .eslintrc.json`
    — eslint@9 + `.eslintrc.json` + `eslint-config-next@16.2.9` (ahead of Next 15.5.19) crash the lint step,
    so CI lint isn't actually running. Own task: align versions / migrate to flat config.
  - **Worker ~2.81 MB gzip vs 3 MB free cap (~94%):** unused blog/admin/api-upload/novel/aws-sdk bundled into
    a non-blog client. Thin headroom. (Static photos are separate assets, do NOT count toward the 3 MB script limit.)
    **ROUTE-GATING TASK — accepted into backlog (2026-06-29):** gate blog/admin/`api/upload`/`api/blog` out of
    non-blog client builds. Removes the dead routes entirely → shrinks the bundle AND cuts the `/admin` attack
    surface. **Slot:** after G2 (DNS) + G3 (Resend live) as a hardening pass; **pull forward** if any change
    pushes the bundle toward 3 MB. Platform-level change (touches shared `src/app/`), so it benefits every
    non-blog client, not just ElectroWill.
- **H) Google Business Profile** — full setup as service-area business (hide address) + reviews engine (one-tap review link via WhatsApp/SMS). Dedicated final phase.

## Open inputs needed (collect at the relevant phase)
1. ⚠️ **STILL NEEDED:** Exact ANRE atestat type + number (not on the certificat); confirm electrician grades.
   Set `src/components/electrowill/content/legal.ts → anreAtestat` + `termeni.md` before launch (Phase G).
2. ✅ **DONE (Phase F):** denumire (ELECTROWILL SOLUTIONS S.R.L.), Nr. Reg. Com. (J2024022229009), CUI 50544190,
   sediu social (Sat Măluț, Com. Braniștea, nr. 113) — from certificat de înregistrare 13.09.2024.
3. Work photos (Phase E). 4. Logo — created at the very end, a later phase (none now; use text wordmark).

## File map
- `config.ts` — ⚠️ still template-ish: `domain: 'localhost'`, generic SEO, placeholder phone `+40 700 000 000`.
  Phase B: real domain/phone/email, flip blog/darkMode off, register custom layout/homepage.
- `theme.ts` — ⚠️ UNTOUCHED template: primary `#2563eb` (blue), Inter. Phase A seeds real palette from Claude Design.
- `index.ts` — manifest. Phase B: register `layout`, `homepage`, custom `pages` (contact, confidentialitate, termeni).
- `content/pages/` — `confidentialitate.md` + `termeni.md` only. (Removed 2026-06-28: the dead
  `pages/index.md` stub + the empty `blog/`, `blog-en/`, `pages-en/` dirs — blog/i18n off. `getPageSlugs`
  already excludes `index.md`, so no route/sitemap impact.)
- `public/` — empty. No logo/favicon/og-image yet.

## Living state   ← AUTO-UPDATED
- **Last updated:** 2026-06-28
- **Status:** **Phases C + D + F built + per-client favicon done — awaiting `yarn typecheck` on the dev machine.**
  Phase C: phone-capture popup, phone-first Resend route, abandoned-number rescue (GDPR-gated OFF),
  cookieless tap counter. Phase D: real FAQ, Zona town list, Electrician + FAQPage JSON-LD.
  Phase F: legal identifiers in footer, `/confidentialitate` + `/termeni` pages, ANPC+SOL, JSON-LD
  legal identity. Phase B (core build) remains done/green per below.
- **What's built (#3 lead-form hardening — 2026-06-28):**
  - **Honeypot** (no deps, always on): hidden `companie` field in `LeadCaptureCard.tsx`; the lead route
    silent-drops a `submit` whose `trap` is filled (fake `{success:true}`, sends nothing).
  - **Cloudflare Turnstile** (zero-dep, modal-lazy, env-gated): `src/components/electrowill/Turnstile.tsx`
    loads the CF script only on card mount (so it stays off the homepage first paint), `appearance:
    interaction-only`. Server verify in `src/lib/turnstile.ts`. Enforced on `submit` ONLY when
    `TURNSTILE_SECRET_KEY` is set; the card renders the widget only when `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
    is set — so with no keys (dev/pre-launch) the form works unchanged. Keys are empty in the env file.
  - **Abandoned-beacon path untouched:** honeypot/Turnstile are scoped to `kind:'submit'`; the rescue
    beacon carries neither and stays GDPR-gated by `EW_RESCUE_ENABLED`.
  - **Header-injection: verified safe** (phone is digit-normalized, `source` is now CR/LF-stripped +
    capped, to/from are env constants, Resend is a JSON API). Documented in `resend.ts`.
  - Turnstile keys surfaced in the DevBanner env checks (`app/layout.tsx`).
- **#3 still-to-do (Phase G):** create a Turnstile site for electrowill.ro → set both keys; add Cloudflare
  edge **rate-limit rules** (≈ 5/min/IP on `/api/lead`, ≈ 30/min/IP on `/api/track`) + Bot Fight Mode.
  (Per the platform decision, rate-limiting is Cloudflare-native, not Upstash.)
- **WhatsApp — wiring verified OK:** `WhatsAppButton` → `WHATSAPP_URL = https://wa.me/40750447426`
  (= 0750447426, correct intl format), `data-track="whatsapp"`. Code is done. ONLY remaining: register a
  **WhatsApp Business account on the 0750447426 SIM** (Orange Yoxo — standard mobile number, verifies fine)
  so messages actually land (Phase G). Optional nicety: add a prefilled `?text=` to the wa.me link.
- **Favicon/browser-tab icon — DONE (2026-06-28, per-client like fonts):** added `ClientIcon`
  (`mark: (px)=>ReactElement` + `appleBackground`) to the manifest with a `getClientIcon()` accessor
  (neutral built-in fallback). Each client now owns `clients/<name>/icon.tsx`: ElectroWill = a **bolt**
  in brand green `#1C6B47` on a light-mint apple tile; portfolio keeps the **rocket** (moved off the old
  shared SVG); `_template` ships a neutral placeholder. The shared `app/icon.tsx` (new) + `app/apple-icon.tsx`
  (rewritten) render the ACTIVE client's mark via next/og `ImageResponse` (32px favicon / 180px apple-icon),
  so only the active client's mark is bundled — zero cross-client bleed.
  ⚠️ **One manual step:** delete the old shared `src/app/icon.svg` (`git rm src/app/icon.svg`) — a dynamic
  `app/icon.tsx` cannot coexist with a static `app/icon.svg` (Next errors on duplicate `icon` names).
  The MCP filesystem has no delete; do this before `yarn build:electrowill-solutions`.
- **What's built (Phase F — legal):**
  - `src/components/electrowill/content/legal.ts` — identifiers from the certificat de înregistrare
    (ELECTROWILL SOLUTIONS S.R.L., CUI 50544190, Nr. Reg. Com. J2024022229009, EUID ROONRC.J2024022229009,
    CAEN 4321). Shared by footer + JSON-LD. `anreAtestat` left **empty** — not on the certificate.
  - `clients/electrowill-solutions/content/pages/confidentialitate.md` — RO privacy policy, accurate to the
    real data flow: phone via lead card, Resend as processor, **cookieless** (no GA4, no cookie banner),
    consent / pre-contract basis, **12-luni** retention, GDPR rights + ANSPDCP. Auto-routed via `[slug]`.
  - `clients/electrowill-solutions/content/pages/termeni.md` — RO light terms: informational site, no online
    prices, firm identifiers **+ sediu social** (Sat Măluț, Com. Braniștea, nr. 113), ANPC + SOL, RO law.
  - `ElectroWillFooter.tsx` — real legal block: identifiers line + Confidențialitate / Termeni / ANPC / SOL
    links. Still **no street address** in the footer (service-area framing). ANRE line auto-omitted while empty.
  - `ElectroWillJsonLd.tsx` — Electrician schema gained `legalName`, `taxID` (CUI), `identifier` (reg com).
  - Resolves the Phase C TODO: the lead card's "Detalii" → `/confidentialitate` now lands (no more 404).
- **Phase F decisions:**
  - Legal pages = **markdown** (`content/pages/*.md`), auto-routed + auto-metadata + in sitemap — no manifest
    changes. They render in the generic `prose` wrapper (acceptable for legal text; optional brand pass later).
  - **Abandoned-number rescue kept OFF** (`EW_RESCUE_ENABLED=false`): emailing an unsubmitted number has no
    clean lawful basis (no consent given; legitimate interest weak under RO ePrivacy/ANSPDCP). Only submitted
    numbers — which carry the card's consent microcopy — are acted on. *(Not legal advice; have a lawyer review.)*
  - Sediu social appears ONLY in /termeni + /confidentialitate (controller identity), never in the footer/homepage.
- **Phase F known issues / TODO:**
  - ⚠️ **Atestat ANRE number still missing** — set `LEGAL.anreAtestat` and remove the TODO in `termeni.md` before launch (Phase G).
  - Legal copy is a solid standard draft — **have a lawyer review** the privacy policy + terms before go-live.
- **What's built (Phase D — content & SEO):**
  - `src/components/electrowill/content/faq.ts` — single source of truth for the 7 FAQ Q&A (colloquial
    search phrases + priză-de-pământ explainer). Drives BOTH the accordion and the FAQPage JSON-LD.
  - `src/components/electrowill/content/service-area.ts` — county + 12 localities; drives the Zona chips
    and `areaServed`. Whole-county framing; partner carve-out never exposed.
  - `src/components/electrowill/ElectroWillJsonLd.tsx` — client-local structured data (kept out of the
    shared `seo/JsonLd.tsx`): **`Electrician`** LocalBusiness (areaServed BN + localities, telephone,
    email, services, **NO address**, NO openingHours, NO rating) + **`FAQPage`**. Mounted in HomePage.
  - `FaqAccordion.tsx` — now reads `FAQ_ITEMS` (3 generic → 7 real); a11y unchanged.
  - `ServiceArea.tsx` — locality chips + whole-county copy (map placeholder still Phase E).
  - `HomePage.tsx` — mounts `<ElectroWillJsonLd />`.
- **Phase D decisions:**
  - Electrician (LocalBusiness subtype) over plain LocalBusiness; service-area (areaServed, no address).
  - `openingHours` omitted (hours unknown); `aggregateRating` deferred to Phase H (no reviews yet).
  - FAQ + Zona each have ONE data module shared by the visible UI and the JSON-LD — no drift.
  - Homepage copy from Phase B left as-is (already on-brief) — avoided a needless rewrite.
- **Phase D known issues / TODO:**
  - Footer legal block (CUI/Nr. Reg. Com./atestat nr., ANPC+SOL) + `/confidentialitate` + `/termeni` still Phase F.
  - Gallery + hero photos still placeholders (Phase E). (Bitter/Mulish fonts — DONE 2026-06-28.)
  - If business hours become available, add `openingHours` to the Electrician schema.
- **What's built (Phase C):**
  - `src/lib/phone-ro.ts` — pure RO phone helpers (`normalizeRoPhone`/`isCompleteRoPhone`); shared by
    card, rescue hook and the API route so "complete number" means one thing. 10-digit national, 07/02/03.
  - `src/lib/resend.ts` — **added** `sendLeadEmail({ phone, source, kind })` (no email field; abandoned
    kind carries the "sună cu blândețe" flag). Existing `sendContactEmail` untouched.
  - `src/app/api/lead/route.ts` — phone-first route. Reads `request.text()` so it accepts both the card's
    JSON `fetch` and the rescue `sendBeacon` (text/plain). Validates via phone-ro (400 on bad number).
    Abandoned beacons are accepted but **not emailed unless `EW_RESCUE_ENABLED==='true'`**. Send errors
    are logged but still return `success:true` (RESEND keys land in Phase G — a lead must not fail on infra).
  - `src/app/api/track/route.ts` — cookieless counter (decision **B1-A**): one JSON line per event to Vercel
    runtime logs (`call`/`whatsapp`/`lead_open`/`lead_submit`). No GA4, no cookie, no PII, always 204.
  - `src/hooks/useLeadCaptureTrigger.ts` — once/session (`sessionStorage` key `ew_lead_dismissed`), opens on
    first of ~60% scroll OR ~35s, desktop exit-intent; SSR-safe; NOT on the hero.
  - `src/hooks/useAbandonedNumber.ts` — beacons a valid-but-unsubmitted number on ~3-min idle or tab-close.
  - `src/components/electrowill/LeadCaptureCard.tsx` — the card (design language: white, border, radius 18,
    primary CTA). One `tel` input → "Sună-mă" (submit POST, not a dialer) + "Scrie pe WhatsApp" (reuses
    `WhatsAppButton`) + consent microcopy + "Detalii" → `/confidentialitate`. Idle/submitting/success/error states.
  - `src/components/electrowill/LeadCaptureManager.tsx` — modal orchestrator: trigger + `role=dialog`/`aria-modal`,
    focus move + Tab trap, Esc/overlay/✕ (48px) dismiss, one `lead_open` beacon, reduced-motion-gated entrance.
    Mounted in `HomePage` only (not /contact or /confidentialitate).
  - `src/components/electrowill/TapTracker.tsx` — one capture-phase delegated click listener on `[data-track]`;
    mounted in `ElectroWillLayout` (site-wide, catches sticky-bar taps). Keeps `CallButton`/`WhatsAppButton`
    as server components — they just gained `data-track="call"|"whatsapp"`.
  - `env/.env.electrowill-solutions` — added `EW_RESCUE_ENABLED=false`.
- **Phase C decisions:**
  - **B1 = A (server logs)** for the cookieless counter — zero infra/deps now; upgrade to Upstash later if live totals are wanted.
  - **B2 = abandoned-number rescue gated OFF** behind `EW_RESCUE_ENABLED` until Phase F GDPR lawful-basis sign-off.
    Mechanism ships and is testable; no unconsented number is emailed.
  - Tap tracking via a single `data-track` listener island (not per-button client components) — leaner, keeps primitives server-rendered.
  - Composition (hooks), not OOP: `useLeadCaptureTrigger` (when) + `useAbandonedNumber` (rescue) + presentational card + manager island.
- **Phase C known issues / TODO:**
  - `/confidentialitate` doesn't exist until Phase F → the card's "Detalii" link 404s until then (correct final target).
  - RESEND keys empty + `noreply@example.ro` placeholder → no real sends until Phase G; route is correct but a no-op in dev.
  - Phase F: flip `EW_RESCUE_ENABLED=true` only after confirming GDPR lawful basis; build `/confidentialitate`.
- **Status (Phase B):** **done.** Custom layout + single-scroll homepage built per DESIGN.md,
  light-mode only, lean motion. Flags flipped to target. Awaiting `yarn typecheck` / `yarn build:electrowill-solutions`
  on the dev machine (the build env couldn't run tsc).
- **What's built:**
  - `config.ts` — real domain (`electrowill.ro`), phone (`+40 750 447 426`), email, RO-only anchor nav;
    flags flipped (blog ✗, darkMode ✗, i18n ✗, contactForm ✓).
  - `index.ts` — manifest now registers `layout: ElectroWillLayout` + `homepage: ElectroWillHomePage`.
  - `tailwind.config.ts` — added `whatsapp` token + namespaced `ew-*` section colors (dark band/footer,
    bands, eyebrow, etc.), `font-display`/`font-body` families, and the two allowed shadows
    (`shadow-ew-bar`, `shadow-ew-header`).
  - `globals.css` — `.ew-hatch` / `.ew-hatch-sm` 45° hatch photo-placeholder utilities.
  - `src/components/electrowill/` — `ElectroWillLayout` (sticky header + mobile `StickyContactBar` +
    `ElectroWillFooter`), `ElectroWillHeader`, primitives (`icons.tsx` inline SVGs, `CallButton`,
    `WhatsAppButton`, `PhotoFrame`, `contact.ts`), and homepage sections (`Hero`, `ServicesPair`,
    `HowItWorks`, `WhyUs` w/ CountUp, `WorkGallery`, `FaqAccordion`, `ServiceArea`, `CtaFinal`, `HomePage`).
- **Phase B decisions:**
  - **G5 gallery aspect = LANDSCAPE 16:10** (`aspect-[16/10]`), matching the shoot brief (no reshoot) over the mock's 4:5.
  - **Icons = inline SVG** (`icons.tsx`), NOT lucide-react (not a dependency; lean/perf mandate). WhatsApp = filled brand mark.
  - **Section/brand colors = literal hex in `tailwind.config.ts`** (`ew-*`, `whatsapp`) rather than CSS vars — functionally equal, less error-prone.
  - FAQ built as an accessible accordion (aria-expanded/controls, grid-rows height anim, reduced-motion gated).
- **Known issues / TODO:**
  - ✅ **Fonts wired (2026-06-28):** Bitter (heading) + Mulish (body) now self-hosted via next/font in
    `clients/electrowill-solutions/fonts.ts` (subsets `latin`+`latin-ext` for RO diacritics; weights 700/800
    + 400/600/700/800). Registered on the manifest as `fonts` and applied to `<body>` in `app/layout.tsx`,
    so `--font-heading`/`--font-body` now resolve to the real self-hosted families (no more Georgia fallback).
    The old bare-string `<style>` var block was the bug and is removed. Per-client + zero cross-client bleed
    (only the active client's manifest is bundled). portfolio + _template migrated to the same pattern.
  - Run `yarn typecheck` + `yarn build:electrowill-solutions` to confirm (couldn't run in build env).
  - D/F content + legal gaps still open (see "Open inputs needed", "Legal", DESIGN.md §8 G2/G4/G6).
- **Next step:** run `yarn typecheck` to confirm Phases C+D+F are green; spot-check `/confidentialitate`
  + `/termeni` render and the footer links work; validate the JSON-LD in Google's Rich Results Test.
  Then Phase E (photos) and G (infra/launch — incl. setting the ANRE atestat number + lawyer review of the legal pages).

## Client gotchas
- i18n OFF, blog OFF (target), darkMode OFF (target) — light mode only. Don't add `pages-en/` or dark styling.
- **Lean client: NO Lenis/Motion.** Only IntersectionObserver reveals + CountUp. Old-Android perf is paramount.
- **Service-area business: no public address.** LocalBusiness JSON-LD uses `areaServed` (BN), no street address.
- **Never expose subcontracting** (Bistrița/Năsăud cities + Cluj passed to partners) on the public site.
- Phone-first: lead capture is phone-only (no email field) — the existing /api/contact requires email, so add a phone-first route.
- Before deploy, follow `docs/CLIENT_SETUP_CHECKLIST.md`: R2 bucket only if managed gallery (NOT needed — photos are static in public/),
  Resend key, strong `ADMIN_PASSWORD`. GitHub token not needed (blog off).
- Domain `electrowill.ro` is `.ro` → registrar ROTLD, DNS via Cloudflare, **proxied (orange cloud)**. (Orange is
  correct now that hosting is Cloudflare Workers — Cloudflare manages the cert and there's no double-CDN; the old
  "gray cloud" note was Vercel-specific.)
