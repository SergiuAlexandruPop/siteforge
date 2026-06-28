# Handoff: ElectroWill Solutions — Landing mobil (Direcția C „Verde, sigur & local")

## Overview
One-page, mobile-first marketing site for **ElectroWill Solutions** — a licensed (ANRE) electrician operating in Bistrița-Năsăud county, Romania. The single goal of the page is: a low-literacy rural visitor on a cheap/old Android phone understands the offer in ~10 seconds and **calls** (primary) or messages on **WhatsApp** (secondary). This handoff documents **both breakpoints** — the mobile layout (≤430px) and the full desktop layout (~1440px / 1280px content) — as two clean `.dc.html` reference files.

Two services of **equal importance**:
1. **Branșamente electrice** ("Îți aducem curentul în casă") — getting power connected to the house.
2. **Proiecte instalații electrice** — electrical-installation projects for companies, institutions and individuals.

The business handles **all the paperwork ("la cheie" / turn-key)**.

## About the Design Files
The file in this bundle (`ElectroWill - Directia C.dc.html`) is a **design reference created in HTML** — a prototype showing the intended look and behavior, **not production code to copy directly**. Re-create this design in your target codebase using its existing environment and patterns (React/Next, Vue, Astro, plain HTML+Tailwind, etc.). If no environment exists yet, plain **HTML + Tailwind CSS** is the recommended choice — the design was deliberately built flat and Tailwind-friendly. The original `.dc.html` uses a small in-house template runtime (`support.js`, `<x-dc>`, `<helmet>`); **ignore that wrapper** — only the markup inside it matters. A clean static export is also provided (see Files).

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, radii and copy are all specified below — implement pixel-faithfully. The only placeholders are the work photos (see Assets).

## Hard constraints (do not break these)
- **Light mode only.** High contrast — must be readable outdoors on old screens. All text meets WCAG AA on its background.
- **No heavy effects** — no complex animation, no fancy gradients. Flat, fast, simple. The only "gradient" used is a 45° diagonal hatch as the photo-placeholder fill; replace it with a real photo.
- **Touch targets ≥ 48px.** All buttons here are 58px tall; the round phone icon is 46px (bump to 48px if your lint requires).
- **Phone is the primary channel; WhatsApp must stay highly visible.**
- **No logo** — text wordmark only: "ElectroWill Solutions".
- Simple Romanian language, local trustworthy tone, professional (not jokey).

## Screens / Views
Single scrolling screen, max content width **430px**, centered. Page background behind the 430px column is `#DDE2D6`; the column itself is `#F7F4EC`. Order top→bottom: Header → Hero → Servicii → closing line → (fixed) bottom bar.

### 1. Header
- Layout: fl\ex row, space-between, padding `14px 18px`.
- Left: 36×36 rounded-11px square, bg `#1C6B47`, white bolt icon, font-size 16; then wordmark "ElectroWill **Solutions**" in **Bitter 800, 17px**, color `#16241C`, with the word "Solutions" colored `#1C6B47`.
- Right: 46×46 button, radius 14, bg `#fff`, border `1.5px #DCE2D6`, phone icon color `#1C6B47`, 17px. Links to `tel:0750447426`.

### 2. Hero
- Padding `8px 18px 26px`.
- **H1**: "Îți aducem curentul în casă." — Bitter 800, 34px, line-height 1.1, letter-spacing -0.3px, color `#16241C`, `text-wrap: balance`, margin-bottom 14px.
- **Subtitle (p)**: "Branșamente electrice în Bistrița-Năsăud. **Autorizați ANRE** · Răspundem în 12 ore · Ne ocupăm de toate actele." — Mulish 16.5px, line-height 1.5, color `#5C6B60`; "Autorizați ANRE" bolded in `#16241C`. margin-bottom 20px.
- **Buttons** (column, gap 11px, margin-bottom 18px), each 58px tall, radius 14, weight 800, 18px, white text, centered icon+label:
  - "Sună acum" (phone icon) → `tel:0750447426`, bg `#1C6B47`.
  - "Scrie pe WhatsApp" (whatsapp icon 22px) → `https://wa.me/40750447426`, bg `#0E8F49`.
- **Trust badges** (flex-wrap, gap 8px, margin-bottom 20px): pills, 34px tall, padding `0 13px`, radius 999px, bg `#E8EEE6`, border `1px #DCE2D6`, Mulish 700 13px, text `#2c3a30`, each with a green check (`#1C6B47`, 11px). Exact labels in order: "Autorizați ANRE", "100+ branșamente", "3+ primării", "Ne ocupăm de acte", "Priză de pământ + buletin", "Garanție".
- **Hero photo**: 210px tall, radius 18, border `1px #DCE2D6`, diagonal-hatch placeholder. Caption pill (bottom-left, inside 12px padding): "Foto lucrare · priză de pământ". Replace with a real photo, `object-fit: cover`.

### 3. Servicii
- Band bg `#EFF3E9`, border-top `1px #E0E6D6`, padding `26px 18px 30px`.
- Eyebrow: 18×3px gold bar (`#B8842E`) + "Serviciile noastre" — uppercase, 12px, weight 800, letter-spacing 1px, color `#1C6B47`.
- H2: "Două servicii, la cheie" — Bitter 800, 25px, color `#16241C`.
- Sub: "Ne ocupăm de toate actele." — Mulish 15px, `#5C6B60`.
- **Two equal cards** (stacked on mobile, gap 14px): white, border `1px #DCE2D6`, radius 18, overflow hidden.
  - Photo strip on top: 150px tall, hatch placeholder, caption pill bottom-left ("Foto lucrare · contor" / "Foto lucrare · tablou & proiect").
  - Body padding `16px 17px 18px`. Title row: 30×30 rounded-9px chip bg `#E8EEE6` with green icon (bolt for card 1, file-lines for card 2), then title in **Bitter 800, 19px** `#16241C`.
  - Card 1 title "Branșamente electrice", body "Îți aducem curentul în casă — de la cerere la contor funcțional."
  - Card 2 title "Proiecte instalații electrice", body "Pentru firme, instituții și persoane fizice."
  - Body text: Mulish 15px, `#5C6B60`, line-height 1.45.

### 4. Closing line
- Padding `24px 18px 30px`, centered. Bitter 700 19px `#16241C`: "Un singur telefon și ne ocupăm de tot." + Mulish 14.5px `#5C6B60`: "Acte, branșament, priză de pământ + buletin."

### 5. Fixed bottom bar (always visible)
- `position: fixed; bottom: 0`, centered, width 100% capped at 430px. bg `#fff`, border-top `1px #DCE2D6`, shadow `0 -10px 24px rgba(22,36,28,.08)`, padding `10px 13px 15px`, flex gap 10px. The page reserves space with `padding-bottom: 84px` so the bar never covers content.
  - **Sună acum** (flex 1.5): 58px, radius 14, bg `#1C6B47`, two stacked lines — small "Sună acum" (11px, opacity .85) over "📞 0750 447 426" (18px, 800). → `tel:0750447426`.
  - **WhatsApp** (flex 1): 58px, radius 14, bg `#0E8F49`, whatsapp icon 22px + "WhatsApp" (16px, 800). → `https://wa.me/40750447426`.

## Interactions & Behavior
- No JS required for the core experience. All CTAs are plain anchors (`tel:` / `wa.me`).
- Hover/active (desktop only, optional): darken button bg ~6–8% on hover; the design is touch-first so don't rely on hover.
- Bottom bar is permanently fixed; content scrolls beneath it.
- No loading/error/form states — there are no forms.

## State Management
None. Static content.

## Responsive behavior
- Mobile (default, ~360–430px): single column exactly as specified. This is the priority target (cheap Android).
- ≥640px (desktop, optional enhancement noted in the original direction): center the 430px column on the `#DDE2D6` field as a "card", OR expand to a 2-column hero (text left, photo right) with the two service cards side-by-side and the bottom bar replaced by the phone number pinned in the header. Keep the same tokens. Desktop is secondary — get mobile right first.

## Design Tokens
Colors (hex):
- primary `#1C6B47` (green) / primaryForeground `#FFFFFF`
- whatsapp `#0E8F49`
- background `#F7F4EC` (page column) / page-field behind it `#DDE2D6`
- foreground `#16241C`
- muted `#E8EEE6` / mutedForeground `#5C6B60`
- border `#DCE2D6` (also `#E0E6D6` for the services band top border)
- services-band bg `#EFF3E9`
- warm accent (eyebrow bar) `#B8842E`
- badge text `#2c3a30`

Typography:
- Headings: **Bitter** (Google Fonts), weights 700/800.
- Body/UI: **Mulish** (Google Fonts), weights 400–800.

Radius scale: buttons & photos `14–18px`, pills `999px`, icon chips `9–11px`. Border width `1px` (header phone button `1.5px`).

Spacing: section padding `18px` horizontal; vertical rhythm `18–30px`. Gaps: button stack `11px`, badges `8px`, cards `14px`.

Shadows: only the bottom bar — `0 -10px 24px rgba(22,36,28,.08)`. No card shadows (flat).

## Assets
- **Icons**: Font Awesome 6.5.1 (bolt, phone, file-lines, check) + Font Awesome Brands (whatsapp). Swap for your app's icon set if you have one (e.g. lucide: `zap`, `phone`, `file-text`, `check`; use an SVG WhatsApp mark for the brand icon).
- **Fonts**: Bitter + Mulish via Google Fonts.
- **Photos**: all images are **labeled placeholders** ("Foto lucrare · …"). Replace with real work photos — branșament la casă/stâlp, contor, priză de pământ, tablou. Use `object-fit: cover`, keep the rounded corners + 1px border. Get the real photos from the client.
- **Phone number**: `0750 447 426` (tel `0750447426`, WhatsApp international `40750447426`). Confirm with client.

---

# Desktop (~1440px) — full page

Same brand system as mobile (identical tokens, fonts, radii). Content is centered in a **max-width 1280px** column with **40px** horizontal padding; page background `#F7F4EC`. Read exact markup from `ElectroWill - Directia C Desktop.dc.html`. Section order top→bottom:

### 1. Top bar (sticky)
`position: sticky; top:0; z-index:50`, bg `#fff`, border-bottom `1px #DCE2D6`, shadow `0 2px 14px rgba(22,36,28,.05)`, height **78px**. Three groups: left wordmark (42×42 green bolt chip + "ElectroWill **Solutions**" Bitter 800 21px); center nav links (Servicii / Cum funcționează / Lucrări / Zona acoperită — weight 700, 15px, `#16241C`); right CTAs — WhatsApp button (52px, bg `#0E8F49`) + Sună button (52px, bg `#1C6B47`, two stacked lines, number `white-space:nowrap`). This is the desktop adaptation of the mobile fixed bottom bar.

### 2. Hero — 2 columns
`display:grid; grid-template-columns:1.05fr 1fr; gap:56px; align-items:center`, padding `64px 40px 56px`. Left: green pill eyebrow ("Autorizați ANRE · Bistrița-Năsăud"), **H1 Bitter 800, 60px**, line-height 1.05, letter-spacing -1px; subtitle Mulish 20px `#5C6B60`; two buttons (Sună `#1C6B47` / WhatsApp `#0E8F49`, 62px tall, 19px); a small inline trust row (clock "Răspundem în 12 ore" · "Ne ocupăm de acte"). Right: 440px-tall photo placeholder, radius 22, hatch fill, caption "Foto lucrare · branșament la casă".

### 3. Servicii — 2 cards side by side
Band bg `#EFF3E9`, top/bottom border `1px #E0E6D6`, padding `72px 40px`. Gold eyebrow bar + "Serviciile noastre"; H2 Bitter 800 40px "Două servicii, la cheie". `grid-template-columns:1fr 1fr; gap:28px`. Each card: white, border `1px #DCE2D6`, radius 20; 240px photo strip on top with caption; body padding `26px 28px 30px`, 40×40 icon chip (bolt / file-lines) + Bitter 800 24px title + Mulish 16.5px body. Same two services/copy as mobile.

### 4. Cum funcționează — 3 steps horizontal
`max-width:1280px`, padding `72px 40px`. Centered H2 + sub. `grid-template-columns:repeat(3,1fr); gap:26px`. Each step card: white, border, radius 20, padding `32px 30px`; a 52×52 green number chip (Bitter 800, "1/2/3") next to a green icon, then Bitter 800 22px title + Mulish 16px body. Steps: **1 Ne suni** (phone) · **2 Ne ocupăm de acte** (file-signature) · **3 Ai curent** (plug-circle-bolt).

### 5. De ce noi — badges on one row (dark band)
bg `#16241C`, padding `54px 40px`. White centered H2 28px. `display:flex; flex-wrap:wrap; justify-content:center; gap:12px`. 6 pills, 46px tall, bg `#22382C`, border `1px #355042`, text `#EAF1E6` 16px/700, check icon `#6FD39E`. Labels: "Autorizați ANRE", "100+ branșamente", "3+ primării", "Ne ocupăm de acte", "Priză de pământ + buletin", "Garanție".

### 6. Lucrările noastre — gallery grid
padding `72px 40px`. Gold eyebrow "Din teren" + H2 40px. `grid-template-columns:repeat(4,1fr); gap:20px`, 8 tiles. Each tile `aspect-ratio:4/5`, radius 16, border, hatch placeholder, caption pill bottom-left ("Foto lucrare · branșament / contor / priză de pământ / tablou / stâlp / cablare / firidă / racord"). Replace with real photos, `object-fit:cover`.

### 7. Întrebări + Zona acoperită — 2 columns
Band bg `#EFF3E9`, top/bottom border `1px #E0E6D6`, padding `72px 40px`. `grid-template-columns:1.15fr 1fr; gap:56px; align-items:start`.
- Left **Întrebări frecvente**: H2 Bitter 800 34px, then 3 white Q&A cards (border, radius 16, padding `22px 24px`; question Bitter 700 18px, answer Mulish 16px `#5C6B60`). Questions: "Cât durează un branșament?", "Trebuie să mă ocup eu de hârtii?", "Faceți și priză de pământ cu buletin?".
- Right **Zona acoperită**: white card, border, radius 20, padding `30px`; location eyebrow, Bitter 800 24px "Județul Bistrița-Năsăud", paragraph, 200px map placeholder ("Hartă · județul BN"), then full-width green button "Întreabă-ne de zona ta" → `tel:`.

### 8. CTA final
`max-width:1280px`, padding `78px 40px`, centered. H2 Bitter 800 46px "Un singur telefon și ne ocupăm de tot.", sub Mulish 19px, two buttons (Sună 64px `#1C6B47` with full number / WhatsApp 64px `#0E8F49`).

### 9. Footer
bg `#16241C`, text `#C7D3C5`. Top: `grid-template-columns:1.4fr 1fr 1fr; gap:40px; padding:48px 40px 40px` — (a) wordmark + descriptive paragraph; (b) "Servicii" link list; (c) "Contact" with phone (white 17px 800), WhatsApp, location. Accent icons `#6FD39E`. Bottom strip: border-top `1px #2A3F33`, padding `18px 40px`, flex space-between, "© 2026 ElectroWill Solutions…" + "Autorizați ANRE", text `#7E927C` 13.5px.

### Desktop-only tokens (extend the shared palette)
- dark section / footer bg `#16241C`
- dark-pill bg `#22382C`, dark-pill border `#355042`, dark-pill text `#EAF1E6`
- success-on-dark icon `#6FD39E`
- footer body text `#9DB29B`, footer muted `#7E927C`, footer divider `#2A3F33`

### Responsive note (mobile ↔ desktop)
Below ~900px, collapse every 2/3/4-column grid to 1 column, hide the center nav, and swap the sticky top CTAs for the mobile **fixed bottom bar** (see mobile spec). The mobile file is the ≤430px source of truth; this desktop file is the ≥1024px source of truth.

## Files
- `ElectroWill - Directia C.dc.html` — **mobile** design reference (clean plain HTML, inline styles, no embedded images; ignore the `<x-dc>`/`<helmet>`/`support.js` wrapper).
- `ElectroWill - Directia C Desktop.dc.html` — **desktop** design reference, same clean format. Read every measurement directly from here.
- `ElectroWill - Directia C (static).html` — mobile design as a plain self-contained HTML file for visual reference (images are base64-welded — use it to *look*, use the `.dc.html` to *read*).
