# SiteForge

A Next.js mono-repo starter kit that powers multiple independent business websites from a single codebase. Each client gets a unique, SEO-optimized, mobile-first site with a built-in blog CMS.

---

## Quick Start

```bash
# Install dependencies
yarn install

# Start dev server for a specific client
yarn dev:portfolio
yarn dev:doctor-maria
yarn dev:electrician-ion
```

## Documentation

| Document | Purpose |
|----------|---------|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design, file structure, data flows |
| [docs/CONTEXT.md](docs/CONTEXT.md) | Living project state — what's built, what's pending |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Phased implementation plan with status |
| [docs/DEV_NOTES.md](docs/DEV_NOTES.md) | Gotchas, debugging, environment tips |
| [docs/NEW_CLIENT_GUIDE.md](docs/NEW_CLIENT_GUIDE.md) | Step-by-step guide for adding a new client |

## Tech Stack

- **Framework:** Next.js 15 (App Router, Turbopack, TypeScript strict)
- **Styling:** Tailwind CSS + shadcn/ui
- **Blog Editor:** Novel (Medium-style, Tiptap-based)
- **Images:** Cloudflare R2 (optimized with Sharp)
- **Email:** Resend
- **Analytics:** GA4 + Google Search Console
- **Deployment:** Vercel (one project per client)
- **Database:** Supabase (optional, per-client)
- **Package Manager:** Yarn

## Architecture

One repo → multiple clients → multiple Vercel deployments.

Each client is a configuration folder in `clients/` with its own theme, content, feature flags, and environment variables. Shared source code in `src/` adapts to the active client at build time.

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full system design.

## AI Development

This project is developed using Claude Desktop with MCP in WebStorm. The `CLAUDE_PROJECT_INSTRUCTIONS.md` file contains the system prompt for the Claude Project. All docs in `docs/` serve as persistent context that Claude reads and updates across chat sessions.

## License

Private. All rights reserved.
