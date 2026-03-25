# SiteForge — Developer Notes & Gotchas

> **This file lives at `docs/DEV_NOTES.md` in the repo.**
> Claude updates this file when discovering new issues or tips during development.
> Read this before starting any implementation session.

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
  --glow-primary: 0 0 80px rgba(37, 99, 235, 0.15);
  --glow-muted: 0 0 120px rgba(37, 99, 235, 0.05);
}
```
Used via Tailwind: `dark:shadow-[var(--glow-primary)]`. These are portfolio-specific but defined globally because CSS variables need to be in scope. Other clients can override or ignore them.

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
To send from `noreply@alexdev.ro` instead of Resend's default, you need to verify the domain in Resend:
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
