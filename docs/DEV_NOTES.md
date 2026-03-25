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

At 100 visitors/day across 7 sites, each loading 5 images per page:
- Reads: ~105,000/month (1% of limit)
- Storage: depends on content, but 10GB is hundreds of optimized blog images

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
- A typical CMS session (open dashboard, read 20 posts, edit one, save) uses ~25 requests
- Nowhere near the limit

### File Size Limits
- GitHub API can create/update files up to 100MB
- For markdown blog posts, this is irrelevant (a long post is maybe 50KB)
- Images go to R2, not GitHub

---

## TypeScript Strict Mode Notes

### Common Patterns to Enforce
```typescript
// NEVER do this
const data: any = fetchSomething()

// DO this
const data: unknown = fetchSomething()
if (isValidBlogPost(data)) {
  // TypeScript now knows data is BlogPost
}

// Type guard function
function isValidBlogPost(value: unknown): value is BlogPost {
  return (
    typeof value === 'object' &&
    value !== null &&
    'title' in value &&
    'slug' in value
  )
}
```

### Environment Variable Typing
```typescript
// Create a validated env reader, not raw process.env access
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
- Check that the markdown file is in the correct folder: `clients/{active-client}/content/pages/` or `content/blog/`
- Check that the frontmatter `slug` matches the URL you're trying to access
- Check that `published: true` is set in the frontmatter
- Restart the dev server (Next.js caches file reads in dev)

### "Image not showing" in blog post
- Check browser console for R2 URL errors
- Verify the R2 bucket has public access enabled
- Check that the image URL in the markdown matches the R2 public URL format
- Try opening the image URL directly in a new tab

### "Contact form not sending"
- Check browser Network tab for the `/api/contact` response
- Verify RESEND_API_KEY is set in `.env.local`
- Verify RESEND_TO_EMAIL is a valid email
- Check Resend dashboard for delivery logs

### "CMS can't save posts"
- Check browser console for GitHub API errors
- Verify GITHUB_TOKEN is set and has `repo` scope
- Verify GITHUB_REPO format is `username/repo-name`
- Check GitHub token expiration (tokens can expire)

### "Styles look wrong / Tailwind not applying"
- Check that `tailwind.config.ts` is reading the active client's theme.ts
- Run `yarn dev:{client-name}` to ensure correct env is loaded
- Check browser dev tools for CSS class presence
- Verify the component has the correct Tailwind classes

---

## Performance Targets

| Metric | Target | Tool |
|--------|--------|------|
| Lighthouse Performance | > 95 | Chrome DevTools |
| Lighthouse SEO | > 95 | Chrome DevTools |
| Lighthouse Accessibility | > 90 | Chrome DevTools |
| Lighthouse Best Practices | > 95 | Chrome DevTools |
| First Contentful Paint | < 1.5s | WebPageTest |
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
