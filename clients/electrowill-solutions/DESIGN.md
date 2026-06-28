# ElectroWill Solutions — Design & Layout Architecture

> **Read this before any UI/visual work on ElectroWill.** Single source of truth for the visual
> design, token system, component patterns, section rhythm, and the mobile↔desktop reflow.
> Pairs with `theme.ts` (the machine-readable token seed) and the `_design/` references.
>
> Direction: **C — "Verde, sigur & local"** (green, safe & local).
> Source of truth on disk: `_design/mobile/ElectroWill - Directia C.dc.html` (≤430px) and
> `_design/desktop/ElectroWill - Directia C Desktop.dc.html` (≥1024px), plus
> `_design/mobile/README.md` (the Claude Design handoff, both breakpoints).
> Last updated: 2026-06-27 (Phase A — tokens + design distilled; no build yet).

---

## 1. Design Philosophy

A calm, high-trust, **flat** landing for a rural ANRE-licensed electrician. The visitor is often on
a cheap/old Android in daylight with ~10 seconds of patience, so the design optimizes for: instant
legibility, one obvious action (**call**, then **WhatsApp**), and trust signals that read at a glance.

### Core principles
- **Light mode only.** No theme toggle. High contrast; all text passes WCAG AA on its surface.
- **Flat & fast.** No gradients (except the 45° hatch used only as a photo *placeholder*), no heavy
  shadows (only the mobile bottom bar has one), no decorative motion. Old-Android performance is a budget.
- **Mobile-first, photo-led.** Real work photos carry the credibility; everything frames them.
- **Phone-first.** "Sună acum" is always the primary action; WhatsApp is the always-visible secondary.
- **Plain Romanian, professional tone.** Local and trustworthy, never jokey or heavy-dialect.
- **Lean dependencies.** No Lenis, no Motion. Native `IntersectionObserver` reveals + a `CountUp`
  counter only, both gated by `prefers-reduced-motion`.

### Two design references, two roles
| File | Breakpoint | Role |
|---|---|---|
| `_design/mobile/…C.dc.html` | ≤430px | The condensed mobile landing (Header → Hero → Servicii → closing → fixed bar). Source of truth for the phone experience. |
| `_design/desktop/…Desktop.dc.html` | ≥1024px | The full desktop page (9 sections). Source of truth for the wide layout and for sections the mobile mock omits. |

> ⚠️ The two mocks are **not the same section set** — see §8. The desktop mock is the fuller
> expression of the brief; the mobile mock is a deliberately stripped 10-second landing.

---

## 2. Token Reference

All tokens are seeded in `theme.ts` and identical across breakpoints. `src/lib/theme-css.ts`
converts the hex values to HSL CSS variables at build time.

### Light palette (the only mode)
```
primary           #1C6B47   brand green — buttons, links, icons, "Solutions", number chips
primaryForeground #FFFFFF   text/icons on primary
secondary         #0E8F49   WhatsApp green (secondary action) — see "Color wiring" note below
background        #F7F4EC   warm off-white page background
foreground        #16241C   near-black green ink (headings + strong body ink)
muted            #E8EEE6   light-green chip/badge fill (also shadcn --secondary/--muted/--accent)
mutedForeground  #5C6B60   sage-grey secondary text
border           #DCE2D6   default hairline (also shadcn --input)
```

### Supporting surface tokens (used in components, not in shadcn's slot set)
```
field-bg         #DDE2D6   field behind the 430px column on mobile ("card on a field" effect)
band-bg          #EFF3E9   "Servicii" / "Întrebări+Zona" section bands
band-border      #E0E6D6   top/bottom border of those bands
eyebrow-gold     #B8842E   warm accent bar in section eyebrows
badge-ink        #2C3A30   trust-badge text on light pills
hatch-a / hatch-b #EDF1EA / #E5ECE2   45° diagonal photo-placeholder fill (replace with real photo)
```

### Dark-band & footer palette (dark *surfaces*, not dark *mode*)
The desktop "De ce noi" band and the footer are intentionally dark on the light page. These are
painted with explicit section colors — they are **not** driven by the (disabled) `dark{}` theme block.
```
dark-surface      #16241C   "De ce noi" band bg + footer bg (= foreground ink color)
dark-pill-bg      #22382C   pills inside the dark band
dark-pill-border  #355042
dark-pill-text    #EAF1E6
success-on-dark   #6FD39E   check icons / accent icons on dark surfaces
footer-text       #C7D3C5   footer base text
footer-body       #9DB29B   footer paragraph/link text
footer-muted      #7E927C   footer fine print
footer-divider    #2A3F33   footer hairline
```

### Color wiring (important for @eng)
`theme-css.ts` hardcodes `--secondary: <muted>` and never reads `colors.secondary`. So the WhatsApp
green (`#0E8F49`) cannot ride shadcn's `--secondary` slot. **Phase B wires it as its own token** —
a `--whatsapp` CSS variable (and a matching `whatsapp` color in `tailwind.config.ts`) — used by the
WhatsApp button only. The dark-band/footer colors above similarly become explicit
component/CSS-var values, not theme slots.

### Typography
- **Headings / display:** **Bitter** (serif), weights 700 / 800. Wordmark, H1–H3, number chips.
- **Body / UI:** **Mulish** (sans), weights 400–800.
- **Blog:** disabled for this client (`fonts.blog` is unused).
- Load via `next/font/google` (self-hosted, no layout shift). Subset `latin` + `latin-ext`
  (Romanian diacritics: ă â î ș ț).

#### Type scale (mobile → desktop)
| Role | Mobile | Desktop | Font / weight |
|---|---|---|---|
| H1 (hero) | 34px / lh 1.1 / -0.3px | 60px / lh 1.05 / -1px | Bitter 800, `text-wrap: balance` |
| Section H2 | 25px | 40px (CTA final 46px) | Bitter 800, ~-0.5px |
| Sub-band H2 (Întrebări) | — | 34px | Bitter 800 |
| Card / step title | 19px | 22–24px | Bitter 800 |
| Q&A question | — | 18px | Bitter 700 |
| Lead paragraph | 16.5px | 20px | Mulish 400, lh 1.5 |
| Body / card copy | 15px | 16–16.5px | Mulish 400, lh 1.45–1.5 |
| Eyebrow (uppercase) | 12px / +1px | 13px / +1px | Mulish 800 |
| Badge / nav / meta | 13–15px | 15–16px | Mulish 700 |
| Footer fine print | — | 13.5px | Mulish |

### Radius scale
`theme.ts borderRadius = 0.875rem (14px)` is the base for shadcn primitives (buttons/inputs).
Custom surfaces use explicit utilities:
```
buttons / controls    14px   (rounded-[14px])
photos / cards        18–22px  (hero photo 18 mobile / 22 desktop; cards 18–20)
gallery tiles         16px
map placeholder       14px
icon chips            9–14px
number chips (steps)  14px
pills / badges        999px (rounded-full)
```

### Spacing & rhythm
- **Horizontal padding:** mobile `18px`; desktop `40px` inside a **max-width 1280px** centered column.
- **Section vertical padding:** mobile `24–30px`; desktop `54–78px` (bands `72px`, dark band `54px`,
  CTA final `78px`).
- **Gaps:** mobile button stack `11px`, badges `8px`, cards `14px`. Desktop hero/band gap `56px`,
  service cards `28px`, steps `26px`, gallery `20px`.
- **Touch targets ≥ 48px** (the brief asks for larger here). Primary buttons are 58px (mobile) /
  62–64px (desktop hero/CTA); header CTAs 52px; mobile header phone button 46px (bump to 48).

### Shadows
Flat by default — **no card shadows**. Only two exceptions:
- Mobile fixed bottom bar: `0 -10px 24px rgba(22,36,28,.08)`.
- Desktop sticky header: `0 2px 14px rgba(22,36,28,.05)`.

---

## 3. Motion System (lean)

No animation library. Two native, accessibility-gated behaviors only:

| Behavior | Tech | Use |
|---|---|---|
| `ScrollReveal` | `IntersectionObserver` + CSS transition | Sections/cards fade+rise on first view |
| `CountUp` | `requestAnimationFrame` | "100+" branșamente, "3+" primării in "De ce noi" |

Reuse the **shared** primitives already in `src/components/animations/` (`ScrollReveal`, `CountUp`)
— do **not** import `SmoothScroll`/Lenis or `RotatingText`/`Marquee` here.

### `prefers-reduced-motion: reduce`
- `ScrollReveal` → render immediately, no transform/transition.
- `CountUp` → show the final value instantly.
Reveal spec (when motion allowed): duration ~0.6s, ease-out, distance ~24px, threshold ~0.15,
`once: true`, optional ~0.08s stagger within a group. Hover only darkens button bg ~6–8% (desktop,
non-essential — the design is touch-first).

---

## 4. Component Patterns

> Build these in `src/components/electrowill/` (co-location by domain). Re-create the *design* in our
> Next/Tailwind/shadcn system — never copy the mock's raw inline-style HTML.

### 4.1 Buttons / CTA
- **Primary "Sună acum"** — bg `primary`, white, Bitter-free (Mulish 800), icon + label, radius 14.
  Heights: 58 (mobile) / 62 (desktop hero) / 64 (CTA final) / 52 (header). Always `tel:0750447426`.
- **WhatsApp** — identical shape, bg `#0E8F49` (the `--whatsapp` token), WhatsApp glyph (SVG brand
  mark, not a generic icon). Always `https://wa.me/40750447426`.
- The **header phone CTA** is a two-line variant: tiny "Sună acum" (11px, 85% opacity) over the
  number (18px, 800), number `white-space: nowrap`.
- Icons: lucide equivalents (`zap`, `phone`, `file-text`, `check`, `clock`, `shield`, `map-pin`,
  `file-signature`, `plug-zap`) + a dedicated inline **WhatsApp SVG** (lucide has no brand mark).

### 4.2 Service cards (the two equal services)
White card, `border` hairline, radius 18–20, `overflow:hidden`, **no shadow**. Photo strip on top
(150px mobile / 240px desktop) with a bottom-left caption pill. Body: a 30–40px rounded icon chip
(bg `muted`, green glyph — `zap` for Branșamente, `file-text` for Proiecte) beside a Bitter-800
title, then Mulish body. **Equal visual weight** — never bury "Proiecte" (higher-value commercial leads).

### 4.3 Sticky call/WhatsApp bar (the always-on conversion anchor)
- **Mobile:** `position: fixed; bottom:0`, centered, ≤430px wide, white, top hairline + the bottom-bar
  shadow. Two CTAs: "Sună acum + number" (`flex:1.5`) and "WhatsApp" (`flex:1`), both 58px. The page
  reserves `padding-bottom: ~84px` so content never hides under it.
- **Desktop:** there is **no** bottom bar — its job moves to the **sticky header** (§4.9), which keeps
  WhatsApp + the phone-number CTA pinned top-right.
- This bar/header is the persistent home of the primary action across the whole scroll.

### 4.4 Trust badges (two treatments)
- **On light (mobile hero):** pills 34px, bg `muted`, `border`, Mulish 700 13px, ink `#2C3A30`, green
  `check` 11px. Order: Autorizați ANRE · 100+ branșamente · 3+ primării · Ne ocupăm de acte · Priză de
  pământ + buletin · Garanție.
- **On dark ("De ce noi" band, desktop):** same labels as pills 46px on `dark-surface`, bg
  `dark-pill-bg`, border `dark-pill-border`, text `dark-pill-text`, check `success-on-dark` (#6FD39E).
- Phase B: "100+" and "3+" become `CountUp` targets.

### 4.5 "De ce noi" dark band
Full-bleed `dark-surface` (#16241C) band, white centered H2 (28px), a centered wrapping row of dark
trust pills (§4.4). High-contrast trust moment; the only large dark area above the footer.

### 4.6 Step cards ("Cum funcționează", 3 steps)
White cards, border, radius 20, padding ~32px. Each: a 52px green **number chip** (Bitter 800, "1/2/3")
next to a green lucide icon, then Bitter-800 title + Mulish body. Steps: **1 Ne suni** (`phone`) ·
**2 Ne ocupăm de acte** (`file-signature`) · **3 Ai curent** (`plug-zap`). Reinforces "noi facem actele".

### 4.7 "Întrebări" — accordion
The brief calls for an **accordion** ("acordeon întrebări"); the desktop mock renders the Q&A cards
*open* for layout. Phase B builds an **accessible accordion**: a `<button>` per question with
`aria-expanded` + `aria-controls` (or semantic `<details>/<summary>`), full keyboard support, height
animation gated by reduced-motion. Card styling: white, border, radius 16, question Bitter 700 18px,
answer Mulish 16px `mutedForeground`.
- Heading is Romanian — "Întrebări" / "Întrebări frecvente". **Never label it "FAQ".**
- ⚠️ Content gap: mock questions are generic. Phase D must fold in the brief's colloquial
  search-intent questions ("vreau curent la casă", "n-am curent pe teren", "faceți și la sat?",
  "să-mi pună contor/ceas", "să-mi pună stâlp") for relatability + SEO, and a plain "De ce e
  importantă priza de pământ?" (→ te protejează de electrocutare).

### 4.8 "Zona acoperită" card
White card beside the accordion (desktop) / stacked (mobile): location eyebrow, Bitter-800 24px
"Județul Bistrița-Năsăud", a plain reassurance paragraph, a 200px **map placeholder** ("Hartă ·
județul BN"), and a full-width green CTA "Întreabă-ne de zona ta" → `tel:`.
- ⚠️ **Service-area framing only.** Present full county coverage; never reference subcontracting or
  the Bistrița/Năsăud-city carve-out. No public street address anywhere.

### 4.9 Header
- **Mobile:** simple row — wordmark left (36px green bolt chip + "ElectroWill **Solutions**", Bitter
  800 17px, "Solutions" in green) and a 46px white phone button right.
- **Desktop:** sticky, 78px, white, bottom hairline + soft shadow, 1280px inner. Three groups:
  wordmark (42px chip + 21px wordmark) · center anchor nav (Servicii / Cum funcționează / Lucrări /
  Zona acoperită, Mulish 700 15px, smooth-scroll to `#id`) · right CTAs (WhatsApp 52px + two-line
  phone CTA 52px). No logo image — text wordmark only (logo is a later phase).

### 4.10 Footer
`dark-surface` bg. Desktop: 3-column grid (`1.4fr 1fr 1fr`) — (a) wordmark + one-line description;
(b) "Servicii" list; (c) "Contact" with phone (white 17px 800), WhatsApp, location; accent icons
`success-on-dark`. Bottom strip: `footer-divider` top border, "© 2026 ElectroWill Solutions…" +
"Autorizați ANRE", text `footer-muted`. Mobile: stack columns.
- ⚠️ Phase F adds the legal identifiers (CUI 50544190, Nr. Reg. Com. J…, atestat ANRE nr., ANPC + SOL
  links) and the `/confidentialitate` + `/termeni` links. The mock footer is the visual shell only.

### 4.11 Photo framing (applies everywhere a photo appears)
Every image: rounded corners (16–22 per surface) + 1px `border`, `object-fit: cover`, and a
bottom-left **caption pill** (white, border, radius ~9, Mulish 700 ~12–14px, `mutedForeground`).
Placeholders use the 45° hatch fill until real photos land (Phase E). Feature the **priză de pământ**
shot (trust = safety).
- ⚠️ **Aspect-ratio conflict to resolve:** the desktop gallery tiles are **4:5 portrait**, but the
  brief specifies **landscape** source photos (4:3 / 3:2) with a 16:10 gallery crop. Decide in Phase B/E
  — either re-crop the gallery to landscape (matches the shoot brief) or keep 4:5 and reshoot/crop to
  portrait. Hero is 210px (mobile) / 440px (desktop) tall; service strips 150/240px.

---

## 5. Section Order & Rhythm

### Desktop (full page — the fuller brief)
1. **Sticky header** (wordmark · nav · WhatsApp + phone CTAs)
2. **Hero** — 2-col grid `1.05fr 1fr`, eyebrow pill + H1 60px + sub + 2 buttons + inline trust row | 440px photo
3. **Servicii** — band, 2 equal cards side by side
4. **Cum funcționează** — 3 step cards in a row
5. **De ce noi** — dark band, trust pills (CountUp on 100+/3+)
6. **Lucrările noastre** — 4-col gallery (8 tiles)
7. **Întrebări + Zona acoperită** — band, 2-col (accordion `1.15fr` | zona card `1fr`)
8. **CTA final** — centered, H2 46px + 2 buttons
9. **Footer** — dark, 3-col + bottom strip

### Mobile (condensed 10-second landing — what the mock actually shows)
Header → Hero (H1 + sub + stacked buttons + wrapped light badges + hero photo) → Servicii (2 stacked
cards) → closing line ("Un singur telefon și ne ocupăm de tot.") → **fixed bottom bar**.

> Phase B target = the **desktop section set** as the canonical homepage, reflowed to one column on
> mobile (not the stripped mobile mock). The stripped mobile mock proves the minimum that must read in
> 10 seconds; the desktop mock proves the full content architecture.

---

## 6. Mobile ↔ Desktop Reflow Rules

- **Breakpoint:** collapse multi-column grids to **1 column below ~900px** (`lg:` up = desktop layout).
  Tailwind-first: author at 375px, add `md:`/`lg:` for the grid + sizing jumps.
- **Header:** desktop center nav is **hidden** on mobile; pinned header CTAs are **replaced by the
  fixed bottom bar**. (Optional: a small hamburger is unnecessary — anchors aren't critical on mobile.)
- **Grids:** hero `1.05fr 1fr` → stacked (text then photo); servicii `1fr 1fr` → stacked; steps
  `repeat(3,1fr)` → stacked; gallery `repeat(4,1fr)` → 2-col then 1-col; Întrebări+Zona `1.15fr 1fr`
  → stacked (accordion first, then zona card); footer 3-col → stacked.
- **Type/space:** drop to the mobile end of every scale in §2; section padding `72px → ~28px`,
  horizontal `40px → 18px`.
- **Tokens are identical** across breakpoints — only layout, sizing, and the sticky-bar swap change.

---

## 7. Proposed File Map (Phase B — for planning only, not built yet)

```
src/components/electrowill/
  ElectroWillLayout.tsx     header (sticky desktop / simple mobile) + fixed bottom bar + footer
  ElectroWillHeader.tsx     wordmark, anchor nav, header CTAs
  StickyContactBar.tsx      mobile fixed Sună/WhatsApp bar (+ body padding spacer)
  ElectroWillFooter.tsx     dark 3-col footer (legal identifiers added Phase F)
  HomePage.tsx              section composition (server component)
  Hero.tsx                  2-col hero / stacked
  ServicesPair.tsx          the two equal service cards
  HowItWorks.tsx            3 step cards
  WhyUs.tsx                 dark band + trust pills (CountUp)
  WorkGallery.tsx           photo grid (aspect-ratio TBD per §4.11)
  FaqAccordion.tsx          accessible accordion (Întrebări)
  ServiceArea.tsx           Zona acoperită card + map placeholder
  CtaFinal.tsx              closing CTA band
  PhotoFrame.tsx            shared rounded+bordered photo w/ caption pill + hatch placeholder
  CallButton.tsx / WhatsAppButton.tsx   the two CTA primitives (+ WhatsApp SVG)
  icons.tsx                 inline WhatsApp mark (+ any custom glyphs)
clients/electrowill-solutions/
  theme.ts                  ✅ seeded (Phase A)
  DESIGN.md                 ✅ this file (Phase A)
  config.ts                 Phase B: real domain/phone/email, flip blog+darkMode OFF, register layout/homepage
  index.ts                  Phase B: register layout, homepage, custom pages
```
Registries to touch in Phase B (explicit imports, no dynamic): `src/lib/client-layout.ts`,
`src/lib/client-homepage.ts` (same pattern as portfolio).

---

## 8. Gaps Between the Mocks and the Locked Brief

Surface these now so Phase B/D/F don't get surprised. The mocks are a **design language**, not a
complete content/feature spec.

| # | Gap | Where it's resolved |
|---|---|---|
| G1 | **Lead-capture phone card** (one phone field → "Sună-mă" + WhatsApp, consent microcopy, scroll/idle trigger, abandoned-number rescue) is in the brief but **in neither mock**. | Phase C — design it in this language (white card, border, radius 18, primary CTA). |
| G2 | **Recenzii** section is in the brief, not in the mocks. | Phase H (reviews engine). Reserve a slot after the gallery / before Întrebări. |
| G3 | **CountUp** on "100+ / 3+" — mocks show static pills. | Phase B wiring (this file §3, §4.4). |
| G4 | **FAQ = accordion**, mock shows open cards; mock questions are generic vs the brief's colloquial search-intent questions + priză-de-pământ explainer. | Phase B (accordion), Phase D (copy/SEO). |
| G5 | **Gallery aspect ratio** 4:5 (mock) vs landscape 4:3/3:2 + 16:10 crop (brief). | Phase B/E decision (§4.11). |
| G6 | **Footer legal block** (CUI, Nr. Reg. Com., atestat nr., ANPC + SOL) and `/confidentialitate` + `/termeni`. | Phase F. |
| G7 | **WhatsApp / dark-band / footer colors** need their own tokens (not shadcn slots). | Phase B (`--whatsapp`, section color vars / Tailwind colors). |
| G8 | Mobile homepage = stripped mock vs full desktop section set. Decision: ship the **full section set**, reflowed to 1 column on mobile. | Phase B (this file §5). |

---

## 9. Decision Log (ElectroWill design)

| # | Decision | Rationale |
|---|---|---|
| D1 | Direction **C "Verde, sigur & local"** | Picked by user; green = safe/trust/local, fits an ANRE electrician in rural BN. |
| D2 | **Light mode only**, no toggle | Outdoor legibility on cheap Android; darkMode flag goes OFF in config. |
| D3 | **Flat, no gradients/shadows** (2 exceptions) | Performance budget + calm trust tone; hatch is placeholder-only. |
| D4 | Fonts **Bitter (display) + Mulish (body)** | Serif headline = solid/established; humanist sans = friendly + readable. |
| D5 | Base `borderRadius` 14px; explicit scale for larger surfaces | Single shadcn base can't express 9→999px; document the scale instead. |
| D6 | WhatsApp green is its **own token** `--whatsapp`, not `--secondary` | `theme-css.ts` maps `--secondary`→`muted`; can't carry the brand green. |
| D7 | Dark band + footer are **section colors**, not the `dark{}` theme block | darkMode is OFF; these are light-mode dark *surfaces*. |
| D8 | **Lean motion** — IO reveal + CountUp only, reduced-motion gated | Brief mandate (no Lenis/Motion); old-Android perf. |
| D9 | Sticky **bottom bar (mobile)** ↔ sticky **header CTAs (desktop)** | Same persistent primary action, breakpoint-appropriate. |
| D10 | Ship the **full desktop section set** as the canonical homepage, reflowed to mobile | The stripped mobile mock is a minimum, not the content ceiling. |
| D11 | "Întrebări" rendered as an **accessible accordion**, never labeled "FAQ" | Brief mandate; a11y + plain-Romanian tone. |
| D12 | Components live in `src/components/electrowill/`; client folder stays config/content | Matches portfolio co-location convention. |

---

## 10. Hard Constraints Checklist (do not break)

- Light mode only · flat · no gradients beyond the hatch placeholder.
- Touch targets ≥ 48px; primary buttons 58–64px.
- Phone primary, WhatsApp always visible (bottom bar mobile / header desktop).
- Romanian everywhere (content + any UI); diacritics subset loaded.
- No logo image — text wordmark "ElectroWill **Solutions**".
- Service-area framing only — no public address, never expose subcontracting.
- No Lenis/Motion; reveals + CountUp only, reduced-motion gated.
- Tokens come from `theme.ts`; section/brand colors that don't fit shadcn slots are explicit vars.
- Re-create the design in our stack — never paste the mock's inline-style HTML.
