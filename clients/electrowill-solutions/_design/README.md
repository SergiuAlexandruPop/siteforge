# _design — temporary design source (reference only, DO NOT import into the app)

This folder holds the Claude Design export(s) for ElectroWill, used ONLY to extract design tokens
and layout patterns into `../DESIGN.md` and `../theme.ts`. It is NOT application code.

## Put here
- `mobile/` — Direction C static HTML export (mobile view). Full page.
- `desktop/` — Direction C static HTML export (desktop view). Full page.
  (Extract the zip(s) from Claude Design into these subfolders.)

## Rules
- This is REFERENCE, not code. Do not copy the mock's raw HTML/CSS/JS into `src/`.
- Ignore inlined base64 images and `support.js` (Claude Design runtime) — we use our own photos.
- The chosen direction is **C**. Palette/fonts/radius → `theme.ts`; section patterns → `DESIGN.md`.
- Once `DESIGN.md` + `theme.ts` are finalized and approved, this folder can be deleted.

## Git
Add `_design/` to `.gitignore` — these files are large (base64) and temporary; don't commit them.
