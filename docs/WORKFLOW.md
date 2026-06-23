# Workflow

Development, deployment, and operations guide for SiteForge.

## Working philosophy

- **Plan before execute.** Every phase/feature starts with a planning conversation. Code only on explicit "go."
- **Repo on disk is the single source of truth.** Docs live in `docs/` and per-client `CLAUDE.md`
  files, read via filesystem MCP — never copy-pasted into Claude Project knowledge (which goes stale).
- **Docs auto-update.** Agents update the relevant doc as the final step of any change, without being
  asked (see the auto-update protocol in root `CLAUDE.md`). The user reviews the `git diff` at commit.
- **One chat per phase.** New phase = new chat. Fresh context, clear history, lower token cost.
- **Zero commercial-license dependencies.** MIT/Apache/BSD only; justify every new dependency.
- **Mobile-first.** Design and code start at 375px; desktop is the bonus surface.

## When to use which Claude surface

| You are doing... | Use... |
|---|---|
| Planning, deciding, debating, "what should I build?" | **Claude Desktop chat + filesystem MCP** |
| Reading docs to answer a single question | Claude Desktop chat + MCP |
| Learning a new concept (RLS, R2 bucket policy, DNS, edge function) | Claude Desktop chat (the teaching is the deliverable) |
| Executing a locked plan into code; refactors; mechanical multi-file edits | **Claude Code** (Desktop) |
| Longer autonomous multi-file/agentic runs | **Cowork** (Desktop) |

**One-line rule:** plan in chat, execute in Claude Code, run longer agentic work in Cowork, deliver to the repo.

**Session-end handoff (guardian rule).** Every working session ends by (1) naming which surface the
next step belongs on and why, and (2) supplying a ready-to-paste, self-contained handoff prompt. A
handoff into Claude Code or Cowork must carry full context — files to read, the decision/leaning, the
plan-first gate — because chat memory and the Project Instructions do NOT reach those surfaces; only
the root `CLAUDE.md`, the relevant `clients/<name>/CLAUDE.md`, and the repo do.

Behavioral rules (plan first, push back, teach as you go, auto-update docs, session-end handoff) are
encoded in **the claude.ai Project Instructions** (`docs/CLAUDE-PROJECT-INSTRUCTIONS.md`, for Desktop
chat) and **the root `CLAUDE.md`** (for Claude Code and Cowork). Both mirror each other — edit both
when the rules change.

## Local dev commands

```bash
yarn dev:<client>          # Turbopack dev server for a client (sets ACTIVE_CLIENT, copies env)
yarn build:<client>        # production build for a client
yarn new-client            # scaffold a new client (interactive)
yarn toggle-feature        # enable/disable features for an existing client
```

`yarn dev:<client>` runs `scripts/dev.ts`, which copies `env/.env.<client>` into place and starts the
Turbopack server. Build checks (`yarn build:<client>`) run at phase boundaries.

## Deploy flow (per client)

Each client is its own Vercel project pointing at the same GitHub repo, differing only by build
command and env vars. Full step-by-step is in `docs/CLIENT_SETUP_CHECKLIST.md` §4. Summary:

1. Vercel → Add New Project → import the `siteforge` repo.
2. Project name `siteforge-<client>`, Build Command `yarn build:<client>`, root directory `.`.
3. Add every non-empty var from `env/.env.<client>` in Settings → Environment Variables.
4. Deploy. Verify at the preview URL.
5. Rollback if needed: Vercel → Deployments → Promote a previous good deploy to production.

## DNS setup (Cloudflare as unified control plane)

**Architecture rule:** the registrar registers the domain; **Cloudflare handles all DNS** regardless
of registrar (ROTLD for `.ro`, Porkbun for other TLDs). 1:1:1 mapping of Cloudflare zone → Vercel
project → SiteForge client folder. Never split DNS records between the registrar panel and Cloudflare
after nameserver delegation.

1. Register the domain at the registrar (ROTLD for `.ro`).
2. Create a free Cloudflare account, add the domain as a site, copy Cloudflare's nameservers.
3. At the registrar, switch nameservers to the Cloudflare ones.
4. In Cloudflare DNS: add `A @ → 76.76.21.21` and `CNAME www → cname.vercel-dns.com`.
   Proxy status: **DNS only (gray cloud)** — Vercel manages SSL; the orange proxy causes SSL conflicts.
5. In Vercel → Project → Settings → Domains: add the root domain and `www`. Vercel auto-issues SSL.
6. If using Resend with a custom domain: add the DKIM/SPF/DMARC TXT records in Cloudflare.
7. Wait 5–30 min for propagation (check dnschecker.org). Visit `https://<domain>` — should load with padlock.
8. Submit `https://<domain>/sitemap.xml` in Google Search Console.

## Prompt templates

Edit the bracketed parts. Paste into the right surface.

### Bootstrap a phase (Desktop chat)
> Read root `CLAUDE.md`, then `docs/ROADMAP.md` and `clients/[client]/CLAUDE.md`. We are starting
> Phase `[N]`: `[name]`. Plan only — no code yet. Propose scope, open questions with pros/cons, and
> subtask order. Wait for my confirmation.

### Execute a planned phase (Claude Code / Cowork)
> Read root `CLAUDE.md` and `clients/[client]/CLAUDE.md`. We locked the plan: `[paste plan]`. Execute
> it. Write whole files via MCP. Auto-update the relevant docs as the final step and tell me which.
> Propose a commit message per logical chunk.

### Diagnose a bug (Desktop chat)
> Read root `CLAUDE.md` and `[file]`. The app `[behavior]` on `[platform]`. Give your three most
> likely hypotheses, ranked. Do not change code.

### Onboard a new client (Desktop chat → Claude Code)
> Read root `CLAUDE.md`, `docs/NEW_CLIENT_GUIDE.md`, `docs/CLIENT_SETUP_CHECKLIST.md`. Plan the
> onboarding for `[client]` (`[what the business is]`). Ask every blocking question first.

## Token preservation

- One chat per phase. Reference docs by path; let the agent read on demand via MCP.
- Don't paste full files into chat. Don't keep docs in Project knowledge — the repo is the source of truth.
- When a chat feels slow or exceeds ~50 messages, ask the agent for a handoff prompt and start fresh.
