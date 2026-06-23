# Development — Quick Reference

> The 20-second refresher for running SiteForge locally. Deep docs: `docs/WORKFLOW.md`
> (deploy/DNS), `docs/DEV_NOTES.md` (gotchas), root `CLAUDE.md` (agent rules).

## Start

```bash
yarn install            # first time only
yarn dev:portfolio      # start a client (replace 'portfolio' with any client)
```

Open http://localhost:3000.

## How dev mode works

`yarn dev:<client>` runs `scripts/dev.ts`, which copies `env/.env.<client>` → `.env.local`,
sets `ACTIVE_CLIENT=<client>`, then starts the Turbopack dev server. Next.js reads that env at
startup and loads the matching `clients/<client>/` config, theme, and content.

## The 3 things you'll forget

1. **One client at a time.** `.env.local` points to a single client. Switch with `yarn dev:<client>` — never hand-edit `.env.local`.
2. **Restart after switching.** Env vars are read at startup, not hot-reloaded. New client = restart the dev server.
3. **Use incognito for multi-client testing.** Admin cookies, dark-mode localStorage, and Smartsupp sessions bleed between clients in the same browser. (Dev-only — prod clients are separate domains.)

## Commands

```bash
yarn dev:<client>        # dev server for a client
yarn build:<client>      # production build for a client
yarn new-client          # scaffold a new client (interactive)
yarn toggle-feature      # enable/disable features for an existing client
```

## Where things live

- `clients/<name>/` — per-client config, theme, content, and `CLAUDE.md` (that client's source of truth)
- `src/` — shared code; adapts to the active client at build time via `ACTIVE_CLIENT`
- `env/.env.<client>` — per-client env vars (gitignored)

## Blog/CMS gotcha

The CMS commits posts to GitHub, not your disk. After creating a post via `/admin`, run
`git pull` to see it locally.

## Shipping (one-liner)

Each client is its own Vercel project on the same repo: build command `yarn build:<client>`,
its own env vars; push to `main` auto-deploys. Full steps + DNS: `docs/WORKFLOW.md`.
