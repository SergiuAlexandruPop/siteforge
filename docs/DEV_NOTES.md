# SiteForge — Developer Notes & Gotchas

> **This file lives at `docs/DEV_NOTES.md` in the repo.**
> Claude updates this file when discovering new issues or tips during development.
> Read this before starting any implementation session.

---

## Gotcha: `active-client.generated.ts` is generated, not committed

`src/lib/active-client.generated.ts` is written by `scripts/gen-active-client.ts`
and is **gitignored**. It's a single static import of the active client's
`clients/<name>/index.ts` manifest — the mechanism that keeps each build
single-client (no cross-client bundle leak).

- It's regenerated automatically before every `yarn dev:<client>` / `yarn
  build:<client>`, and on `postinstall` and `pretypecheck` (defaulting to
  `_template`). A fresh checkout has no generated file until `yarn install`
  runs `postinstall` — if you see "Cannot find module './active-client.generated'",
  run `yarn gen:client` (or any `dev:`/`build:` script).
- Never edit it by hand. Adding a client requires NO edit to `src/lib/` — only a
  new `clients/<name>/index.ts`. The old four registries (`client-layout`/
  `-homepage`/`-pages`) are gone; `client-config.ts` is now just accessors.
- To verify the leak stays fixed after a build: `grep` the `.next` output for
  another client's identifiers — they must be absent. (Build must run on the
  dev machine; the toolchain's native binaries are platform-specific.)

---

## Gotcha: Cloudflare Workers Builds picks Yarn 4 unless you pin `packageManager`

The repo uses a **Yarn 1 (classic)** `yarn.lock` (`yarn lockfile v1`). Cloudflare
Workers Builds runs installs through Corepack, and with **no `packageManager` field**
in `package.json` it defaults to the newest Yarn (4.x). Yarn 4 then tries to migrate
the v1 lockfile and the CI install is immutable, so it fails:
`YN0087 Migrated your project to the latest Yarn version` → `YN0028 The lockfile
would have been modified by this install, which is explicitly forbidden`.

- **Fix:** pin `"packageManager": "yarn@1.22.22"` in `package.json` (added 2026-06-28,
  ElectroWill G1). Corepack/Cloudflare then use Yarn 1, which reads the v1 lockfile
  natively — no migration, no immutable conflict. The react19-vs-novel peer warnings
  (`YN0060`) are non-fatal under Yarn 1. Local dev is unaffected (already on Yarn 1).
- **Prerequisite:** the committed `yarn.lock` must already include any newly added
  deps (e.g. `@opennextjs/cloudflare`, `wrangler`), or even Yarn 1's frozen install
  fails as out-of-sync. Commit `yarn.lock` whenever deps change.
- During CF install, `postinstall` (`gen-active-client`) runs **before** the build
  command sets `ACTIVE_CLIENT`, so it generates for `_template` — harmless; the
  `build:cf:<client>` script regenerates for the real client moments later.

---

## Gotcha: dashboard plain-text vars are WIPED by `wrangler deploy` — secrets are not

With Workers Builds, every git push runs `wrangler deploy`, which treats the Wrangler
config as the source of truth for **plain-text `vars`** and overwrites any plain vars set
only in the dashboard. **Secrets are never deleted by a deploy** (only `wrangler secret
delete` removes them). So the rule for any client deployed via Workers Builds:

- **Non-secret config** (e.g. `ACTIVE_CLIENT`, `EW_RESCUE_ENABLED`, `RESEND_FROM_EMAIL`,
  `RESEND_TO_EMAIL`) → put in `wrangler.jsonc` → `vars` (committed, re-applied every deploy).
- **Secrets** (e.g. `ADMIN_SESSION_SECRET`, `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`,
  `ADMIN_PASSWORD`) → add as encrypted **Secrets** in the dashboard (or `wrangler secret put`).
- **`NEXT_PUBLIC_*`** (e.g. `NEXT_PUBLIC_TURNSTILE_SITE_KEY`) is inlined at BUILD time → set as
  a **Build variable** (Settings → Build), not a runtime var/secret.
- Alternative (not used here): `keep_vars = true` in the config tells wrangler to leave
  dashboard vars alone — rejected because vars-in-config is version-controlled + reproducible.

---

## Gotcha: ESLint crashes in `next build` (circular JSON) — lint gate is a no-op

Seen in the ElectroWill G1 Cloudflare build:
`⨯ ESLint: Converting circular structure to JSON … Referenced from: .eslintrc.json`.
The lint step **crashes** (it doesn't report lint errors), so `next build` continues and
CI lint is effectively not running. Cause: `eslint@9` (flat-config era) + the legacy
`.eslintrc.json` + `eslint-config-next@16.2.9` (which is *ahead* of Next 15.5.19) are
incompatible. Build still goes green because a crash isn't counted as a lint failure.

- **Not a launch blocker**, but the lint guardrail is off until fixed.
- **Fix (own task):** align `eslint-config-next` to the Next 15 line and/or migrate to flat
  config (`eslint.config.mjs`) for ESLint 9. Verify `yarn lint` runs clean locally first.

---

## Environment Setup (Windows 11 + WebStorm)

### Prerequisites
- Node.js v18+ (LTS recommended)
- Yarn (install via: npm install -g yarn)
- Git for Windows
- WebStorm IDE
- Claude Desktop with MCP configured for WebStorm

### Initial Setup Commands
```bash
# Clone the repo
git clone https://github.com/SergiuAlexandruPop/siteforge.git
cd siteforge

# Install dependencies
yarn install

# Start dev server for your portfolio (auto-copies env file)
yarn dev:portfolio
```

### CLI Tools
```bash
yarn new-client           # Scaffold a new client (interactive, Romanian)
yarn toggle-feature       # Enable/disable features for existing client
yarn dev:{client-name}    # Start dev server for a specific client
yarn build:{client-name}  # Build a specific client for production
```

---

## Multi-Client Development Gotchas

### 1. Always Use Incognito for Multi-Client Testing
When testing different client sites simultaneously, use incognito/private browser windows. Cookies (admin session), localStorage (dark mode preference), and Smartsupp sessions will bleed between clients if tested in the same browser session. This is a dev-only issue — in production each client is on a separate domain.

### 2. One Client Active at a Time
Your `.env.local` points to one client. The CLI script `yarn dev:{client-name}` handles switching. Do NOT manually edit `.env.local` — always use the CLI script to avoid partial changes.

### 3. After Switching Clients, Restart Dev Server
The CLI script handles this automatically, but if you manually change `.env.local`, you MUST restart the Next.js dev server. Environment variables are read at startup, not hot-reloaded.

### 4. Git Commit Convention for CMS Content
When the CMS creates or updates a blog post, it commits with this message format:
```
[content][{client-name}] {action}: {post-title}
```
Examples:
```
[content][portfolio] Created: My First Blog Post
[content][doctor-maria] Updated: 5 Tips for Back Pain
[content][portfolio] Deleted: Draft Post That Was Removed
```
This makes the git log scannable and filterable.

---

## Animation System Notes (Phase 7.5)

### prefers-reduced-motion
Every animation component checks `useReducedMotion()` and degrades:
- `RotatingText` → static first word, no cycling
- `Marquee` → static flex-wrap layout, no scrolling
- `ScrollReveal` → content immediately visible, no fade/slide
- `CountUp` → final number shown immediately
- `SmoothScroll` → Lenis auto-disables (built-in behavior)

If you add a new animation component, it MUST check `useReducedMotion()` and provide a static fallback.

### Lenis Smooth Scrolling
- Lenis is dynamically imported in `SmoothScroll.tsx` to keep the initial bundle small
- It uses `requestAnimationFrame` internally — cleanup is important on unmount
- On iOS, Lenis uses native touch momentum (no fighting with rubber-band scroll)
- If you see "jerky scrolling" in dev, it's likely Turbopack's hot reload — try a fresh page load

### CSS Glow Variables
Dark mode glow effects are defined in `globals.css`:
```css
.dark {
  --glow-primary: 0 0 80px rgba(178, 64, 39, 0.15);
  --glow-muted: 0 0 120px rgba(178, 64, 39, 0.05);
}
```
Used via Tailwind: `dark:shadow-[var(--glow-primary)]`. These are portfolio-specific but defined globally because CSS variables need to be in scope. Other clients can override or ignore them. Authoritative palette: `clients/portfolio/DESIGN.md` §3.

### Inline SVG Icons (icons.tsx)
- 8 tech logos are inline SVGs in `src/components/portfolio/icons.tsx`
- All use `aria-hidden="true"` (decorative, not informational)
- The Next.js icon uses `className="dark:fill-white"` on its circle — this may not work perfectly inside inline SVGs depending on how Tailwind processes them. If the icon looks wrong in dark mode, replace the circle fill with `currentColor` and control via parent text color.

### Import Path for Portfolio Data
`ProjectShowcase.tsx` imports from `../../../clients/portfolio/data/projects`. This relative path works but is fragile. The `@/` alias only maps to `src/` so it can't reach `clients/`. This is intentional — client data folders are outside `src/` by architecture. If this becomes annoying, add a `@clients/` path alias in `tsconfig.json`.

### ScrollReveal Wrapping Pattern
ScrollReveal wraps sections from **outside** in `HomePage.tsx`, not inside each section component. This follows SRP — section components don't know they're being animated. AnimatedHero is NOT wrapped because it's above the fold and should be visible immediately.

### Dual-Render Tabs/Accordion (Decision #57)
`TabbedServices.tsx` renders BOTH the desktop tab layout and the mobile accordion layout in the DOM simultaneously. Tailwind `hidden md:block` / `md:hidden` toggles visibility. This avoids resize listeners, hydration mismatches, and SSR issues. The tradeoff is slightly more DOM nodes, which is negligible for this content volume.

---

## Vercel-Specific Notes

### Build Commands Per Client
Each Vercel project uses a custom build command:
```
yarn build:{client-name}
```
This internally sets `ACTIVE_CLIENT={client-name}` before running `next build`.

### Environment Variables in Vercel
Each Vercel project has its OWN environment variables. When setting up a new client:
1. Go to Vercel → Project → Settings → Environment Variables
2. Add ALL variables from `.env.example`
3. Set values specific to this client
4. Do NOT copy variables from another client's Vercel project (API keys, bucket names, etc. are unique per client)

### Auto-Deploy Behavior
ALL Vercel projects rebuild on every push to `main`. This means:
- A blog post committed for doctor-maria also triggers a rebuild of the portfolio site
- This is harmless (the portfolio rebuild produces the same output since its content didn't change)
- At 5-7 clients, this is fine. Builds are fast (~60s each)
- If this becomes an issue, implement the "Ignored Build Step" (see ROADMAP future phases)

### Preview Deployments
Vercel creates preview deployments for pull requests. All client projects get a preview. Use the preview URL to test changes before merging to main.

---

## Cloudflare R2 Notes

### Bucket Naming Convention
Use `siteforge-{client-name}-images` for bucket names:
- `siteforge-portfolio-images`
- `siteforge-doctor-maria-images`
- `siteforge-electrician-ion-images`

### R2 Public Access
Each bucket needs "Public Access" enabled to serve images via URL. This is configured in:
Cloudflare Dashboard → R2 → Bucket → Settings → Public Access → Enable

The public URL looks like: `https://pub-{hash}.r2.dev/{filename}`

### Image Optimization Pipeline
Images are processed BEFORE upload to R2:
1. Client drops image into Novel editor
2. Image sent to `/api/upload` as FormData
3. Server receives file, validates type and size
4. Sharp processes: resize to max 1200px width, convert to WebP, quality 80%, strip EXIF
5. Optimized image uploaded to R2
6. R2 public URL returned to editor
7. Editor embeds URL in content

### R2 Free Tier Limits (very generous)
- Storage: 10 GB/month
- Class A operations (writes): 1 million/month
- Class B operations (reads): 10 million/month
- Egress: free (no bandwidth charges ever)

---

## Resend Notes

### Free Tier Limits
- 100 emails/day
- 3,000 emails/month
- 1 custom domain

### Domain Verification
To send from `noreply@<your-domain>` instead of Resend's default, you need to verify the domain in Resend:
1. Go to Resend Dashboard → Domains → Add Domain
2. Add DNS records (MX, TXT, DKIM) to your domain registrar
3. Wait for verification (~5 minutes)
4. Note: free tier only allows 1 custom domain. Other clients send from `onboarding@resend.dev` until you upgrade.

**Workaround for multiple domains on free tier:** Create separate Resend accounts per client (separate email addresses). Each gets 100 emails/day and 1 custom domain. For 7 clients with low email volume this works fine.

---

## GitHub API (CMS) Notes

### Token Permissions
The GitHub Personal Access Token needs MINIMAL permissions:
- `repo` scope (to read/write files in the repo)
- Nothing else

### Token Security
- Stored in Vercel environment variables (never in code)
- Different token per Vercel project is ideal but not required
- If using one token, it has access to all client content (acceptable since you own the repo)

### Rate Limits
- 5,000 requests/hour per token (authenticated)
- A typical CMS session uses ~25 requests — nowhere near the limit

---

## TypeScript Strict Mode Notes

### Common Patterns to Enforce
```typescript
// NEVER do this
//const data: any = fetchSomething()

// DO this
//const data: unknown = fetchSomething()
if (isValidBlogPost(data)) {
  // TypeScript now knows data is BlogPost
}
```

### Environment Variable Typing
```typescript
function getRequiredEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}
```

---

## Common Debug Scenarios

### "Page not found" after adding new content
- Check correct folder: `clients/{active-client}/content/pages/` or `content/blog/`
- Check frontmatter `slug` matches URL
- Check `published: true` in frontmatter
- Restart dev server (Next.js caches file reads)

### "Image not showing" in blog post
- Check browser console for R2 URL errors
- Verify R2 bucket has public access
- Try opening image URL directly in browser

### "Contact form not sending"
- Check Network tab for `/api/contact` response
- Verify RESEND_API_KEY in `.env.local`
- Check Resend dashboard for delivery logs

### "CMS can't save posts"
- Check console for GitHub API errors
- Verify GITHUB_TOKEN has `repo` scope
- Check token expiration

### "Animations not working"
- Check browser console for JavaScript errors
- Verify the component has `'use client'` directive (animation components need client-side JS)
- Check if `prefers-reduced-motion` is enabled in OS settings (animations will be disabled)
- For Marquee: ensure `@keyframes marquee` exists in `globals.css`
- For ScrollReveal: element must be below the viewport fold to trigger (threshold: 0.15)

### "Dark mode glow not showing"
- Verify `--glow-primary` and `--glow-muted` are defined in `globals.css` under `.dark`
- Check that the Tailwind class uses `dark:shadow-[var(--glow-primary)]` (arbitrary value syntax)
- Glow is intentionally subtle — check in a dark room or increase the opacity in the CSS variable temporarily

---

## Testing Notes (Phase 9)

### Vitest
- Run: `yarn test` (CI) / `yarn test:watch`. Config: `vitest.config.ts` (node env, `@`→`src`, globals off, `include: tests/**/*.test.ts`).
- `esbuild.jsx: 'automatic'` is required — tsconfig uses `jsx: "preserve"` (Next's automatic runtime). Without it, any test that imports a component fails with **"React is not defined"** (e.g. the manifest contract imports each client's full manifest, components included). See Decision #79.
- **image-optimize tests use real sharp** (not a mock) — mocking it would test nothing. Fixtures are generated in-memory with sharp, so there are no binary files to commit.
- The **upload route** test mocks `@/lib/auth`, `@/lib/r2`, and `optimizeImage` (via `vi.importActual` so the real `validateImageFile` is kept), and fakes `Date.now()` to assert the timestamped key.

### Playwright E2E
- Run: `yarn test:e2e`. Config: `playwright.config.ts` (testDir `e2e/`, chromium-only). It builds + starts the **portfolio** production build on **:3100** via `webServer`, so a cold first run includes a full `next build`.
- One-time local setup after pulling this phase: `yarn install` (picks up `@playwright/test`, refreshes `yarn.lock`) then `yarn playwright install chromium`.
- Selectors lean on stable accessibility hooks: header `nav[aria-label="Main navigation"]`, theme toggle `button` with aria-label `/Comută la modul/`. Dark mode is asserted via the `dark` class on `<html>` (server default is dark).
- Vitest and Playwright never collide: Vitest is scoped to `tests/**/*.test.ts`, Playwright to `e2e/**`.

## Performance Targets

| Metric | Target | Tool |
|--------|--------|------|
| Lighthouse Performance | > 90 | Chrome DevTools |
| Lighthouse SEO | > 95 | Chrome DevTools |
| Lighthouse Accessibility | > 90 | Chrome DevTools |
| Lighthouse Best Practices | > 95 | Chrome DevTools |
| Largest Contentful Paint | < 2.5s | WebPageTest |
| Cumulative Layout Shift | < 0.1 | WebPageTest |
| Total page weight | < 500KB | Network tab |

---

## Security Checklist (Per Client Deployment)

- [ ] All API keys are in Vercel environment variables (not in code)
- [ ] `.env.local` is in `.gitignore`
- [ ] `env/.env.{client}` files are in `.gitignore`
- [ ] Admin password is strong (12+ characters, mixed case, numbers, symbols)
- [ ] Admin session cookie is httpOnly, secure, sameSite: strict
- [ ] Image upload validates file type and size
- [ ] Contact form has server-side validation
- [ ] GitHub token has minimal scopes
- [ ] R2 access keys are per-bucket if possible
- [ ] No secrets in client-side code (check with `grep -r "RESEND_API_KEY" src/`)
- [ ] HTTPS enabled (automatic on Vercel)
