# SiteForge — Agent Context (Root)

> **Entry point for every agent, on every surface (Claude Desktop + MCP, Claude Code, Cowork).**
> Read this file first. Then route to the client you're working on (see "Client Router").
> This file and `docs/CLAUDE-PROJECT-INSTRUCTIONS.md` mirror each other — edit both when rules change.

SiteForge is a Next.js 15 mono-repo starter kit that powers multiple independent business
websites from one codebase. Each client is a **configuration folder** in `clients/<name>/`
with its own theme, content, feature flags, env file, and Vercel deployment. Shared code in
`src/` adapts to the active client at build time via the `ACTIVE_CLIENT` env var.

---

## Client Router (read this to find your client)

When a request names a client ("change electrowill's contact form", "add a blog post to
portfolio"), do this **before any work**:

1. Find the client in the registry table below → get its folder name.
2. Read `clients/<folder>/CLAUDE.md` — that file is the **single source of truth** for that
   client (identity, coordinates, features, file map, living state, gotchas).
3. If the client has a `DESIGN.md`, read it too before any UI/visual work.
4. If the request is ambiguous about which client, **ask** — never guess.

| Client | Folder | Domain | Agent brief | Status |
|---|---|---|---|---|
| Portfolio (Sergiu) | `portfolio` | TBD | `clients/portfolio/CLAUDE.md` | Phase 8 complete |
| ElectroWill | `electrowill-solutions` | electrowill.ro (planned) | `clients/electrowill-solutions/CLAUDE.md` | Bare scaffold |

> Adding a client: copy `clients/_template/CLAUDE.md`, fill it, add a row here, register the
> client in `src/lib/client-config.ts`. The `yarn new-client` CLI handles config/theme/env/scripts.

---

## Stack (locked)

Next.js 15 App Router · TypeScript `strict` · Tailwind v3 · shadcn/ui · Yarn · Turbopack.
Novel 0.5 (blog editor) · gray-matter + remark (markdown) · jose (JWT CMS auth) ·
Cloudflare R2 + Sharp (images) · Resend (email) · GA4 · Smartsupp (optional) ·
Lenis + Motion (animation, both MIT). Hosting: Cloudflare Workers via `@opennextjs/cloudflare`
(one Worker per client; DNS end-to-end on Cloudflare, proxied). See Decision #81.
Dev: Windows 11, WebStorm.

## Hard rules

- **Plan first, execute on explicit "go."** Every task starts with a plan; never write or
  modify code until the user says "execute" / "go." Surface plans, options, and questions first.
- **TypeScript strict, no `any`.** Use `unknown` and narrow. Type guards only for real runtime
  boundaries (API responses, `JSON.parse`, user input). End-of-feature pass removes redundant guards.
- **Zero commercial-license dependencies.** MIT/Apache/BSD only. No GSAP, no paid plugins.
  Justify every new dependency before adding it.
- **Explicit import registries**, never dynamic imports — Turbopack reliability
  (`client-config.ts`, `client-layout.ts`, `client-homepage.ts`).
- **i18n convention:** `/` = Romanian, `/en/` = English. Root `[slug]` routes hardcode `'ro'`.
  This is independent of `config.defaultLanguage`.
- **Romanian** for all user-facing content and the admin UI. **English** for code/comments/identifiers.
- **Mobile-first.** Every layout starts at 375px; scale up with `sm:` `md:` `lg:`. Touch targets ≥ 44px.
- **Security by default.** No secrets client-side. Validate/sanitize all user input. Image uploads:
  validate type, enforce size, strip EXIF before R2.
- **Complete code only.** When writing code, write whole files via MCP — no fragments, no
  "...rest unchanged." No hallucinated imports: only import what you've confirmed exists in the repo.
- **Be a guardian.** If a better approach exists than what was asked, present it with tradeoffs
  and let the user decide. Never implement a worse option silently. Push back on scope creep.
- **Teach as you go.** When introducing a backend/infra/DB concept, add a brief junior-level
  explanation with a frontend analogy. The user has no backend/DevOps background.

## Behavior

- **Lead with blockers and prerequisites — NEVER reveal them after the steps.** State any
  prerequisite, conditional, or "don't do this yet" at the very TOP, before walking the user
  through anything. If a later step is gated on a condition, say so before they start — not at
  the end. **Never** number something as a step and then tell the user not to do it. Making the
  user read/act through steps only to hit a blocker at the bottom is a serious time-wasting
  failure. If a check is time-sensitive, surface it first or defer it explicitly.
- **Exact dashboard navigation, always.** When referencing any dashboard location or state
  ("zone Active", "DNSSEC enabled", "Settings → Variables", "Domains & Routes"), give the precise
  click-path to reach it: which dashboard → which item → which tab → which section. Never say
  "check that X is active" without saying exactly where to look. The user has no DevOps background
  and must never have to hunt for a setting.
- **Minimize manual checks; defer verification.** The user wants to build fast, not babysit
  dashboards. Prefer flows that self-complete automatically. When verification is genuinely needed,
  batch it into a deferred "verification" item/phase (with exact click-paths) instead of
  interrupting the build with a check.
- **Suggest commit messages.** Propose a clean one-line message per logical chunk. The user commits.
- **Session-end handoff (guardian rule).** When pausing or completing work, always (a) name which
  surface the next step belongs on and why, and (b) supply a ready-to-paste, self-contained handoff
  prompt. A Claude Code handoff must carry full context (files to read, the decision/leaning, the
  plan-first gate) — chat memory and Project Instructions do NOT reach Claude Code; only this
  `CLAUDE.md` plus the repo do.
- **One chat per phase.** New phase or bloated context = tell the user to start a new chat, supply the seed prompt.

---

## Documentation auto-update protocol (do this without being asked)

Updating docs is the **final step of any task that changed code or made a decision.** Do it
automatically — the user should never have to ask. Then **state in chat which docs you touched**
so the user can review the `git diff` before committing. The diff-at-commit is the safety net;
there is no ask-permission step.

Touch **only** the doc(s) the change maps to. Never rewrite a whole doc for a small change.

| Change you made | Auto-update | What to write |
|---|---|---|
| Code/decision for one client | `clients/<name>/CLAUDE.md` → Living state | Last-updated date, what was built, new known issues, next step |
| New client added | `docs/CONTEXT.md` (registry row) + root `CLAUDE.md` (router row) | One row each |
| Platform-wide change or new architecture decision | `docs/CONTEXT.md` (Decision Log + platform state) | One Decision Log entry |
| A roadmap phase/subtask completed | `docs/ROADMAP.md` | Check the box, set status |
| New gotcha discovered | `docs/DEV_NOTES.md` | Append one entry |
| Structural/system change | `docs/ARCHITECTURE.md` | Update the affected section only |

**Single source of truth:** per-client living state lives in `clients/<name>/CLAUDE.md`, NOT in
`docs/CONTEXT.md`. CONTEXT.md holds platform-level state, the Decision Log, and the client registry.
One fact, one home — never duplicate a fact across docs.

---

## Surfaces (which Claude to use for what)

| You are doing... | Use... |
|---|---|
| Planning, deciding, debating, reading docs to answer a question, learning a concept | **Claude Desktop chat + filesystem MCP** |
| Executing a locked plan, refactors, mechanical multi-file edits | **Claude Code** (Desktop) |
| Multi-step agentic runs across many files / longer autonomous work | **Cowork** (Desktop) |

One-line rule: **plan in chat, execute in Claude Code, run longer agentic work in Cowork — deliver to the repo.**

## Platform docs (read on disk via MCP, do not assume)

- `docs/CONTEXT.md` — platform state, Decision Log, client registry
- `docs/ARCHITECTURE.md` — system design, file structure, data flows
- `docs/ROADMAP.md` — phased plan with status
- `docs/DEV_NOTES.md` — gotchas, debugging, environment tips
- `docs/WORKFLOW.md` — surfaces, deploy, DNS, prompt templates
- `docs/NEW_CLIENT_GUIDE.md` / `docs/CLIENT_SETUP_CHECKLIST.md` — client onboarding
- `clients/<name>/CLAUDE.md` — per-client source of truth
- `clients/portfolio/DESIGN.md` — portfolio design & animation spec
