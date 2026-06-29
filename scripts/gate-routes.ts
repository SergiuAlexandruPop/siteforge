import {
  existsSync,
  mkdirSync,
  renameSync,
  rmSync,
  cpSync,
} from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

// ---------------------------------------------------------------------------
// scripts/gate-routes.ts
// ---------------------------------------------------------------------------
// Build-time route gating for NON-blog clients. When the active client has
// `features.blog === false`, this moves the blog/CMS route files out of the
// compiled tree (into a git-ignored `.gated-routes/` stash) BEFORE the build,
// so Next never compiles them. That removes the dead routes entirely → shrinks
// the Worker bundle (drops novel / @aws-sdk / sharp / github / jose) AND cuts
// the /admin attack surface. `restore` moves them back after the build.
//
// Why move files instead of a runtime flag: Next App Router compiles every
// route file that physically exists, and the bundler pulls in everything those
// files import — regardless of any runtime `features.blog` check. The only way
// to actually drop the code (and the surface) is to make the files absent at
// build time.
//
// Fully reversible per-client: this is driven entirely by `features.blog`.
// Flip a client's flag to `true` and nothing is gated — the routes return
// exactly where they live now, no restructure required.
//
// Two tiers (see arrays below) so a future "case-study" blog (static markdown +
// photos, no CMS) can bring back ONLY the light read routes later while the
// heavy CMS write stack stays gated — a one-line change here, no new flag.
//
// Usage (always via scripts/build.ts, never standalone in a build):
//   ACTIVE_CLIENT=<name> tsx scripts/gate-routes.ts apply
//   ACTIVE_CLIENT=<name> tsx scripts/gate-routes.ts restore
// ---------------------------------------------------------------------------

const root = resolve(__dirname, '..')
const SRC_DIR = join(root, 'src')
const STASH_DIR = join(root, '.gated-routes')
const DEFAULT_CLIENT = '_template'

// --- Tier 1: CMS write stack -------------------------------------------------
// The heavy half of the win + the entire admin attack surface. A static
// case-study blog needs NONE of this, so it stays gated even if read routes
// return. Paths are relative to `src/`.
//   - app/admin            → admin login + dashboard + Novel editor (→ `novel`)
//   - app/api/auth         → admin login endpoint (→ `jose` via lib/auth)
//   - app/api/blog         → CMS CRUD over GitHub (→ lib/github)
//   - app/api/upload       → image upload (→ lib/r2 = @aws-sdk, lib/image-optimize = sharp)
//   - middleware.ts        → JWT guard for /admin (imports `jose` directly);
//                            dead weight with no /admin to protect.
const CMS_ROUTES: readonly string[] = [
  join('app', 'admin'),
  join('app', 'api', 'auth'),
  join('app', 'api', 'blog'),
  join('app', 'api', 'upload'),
  'middleware.ts',
]

// --- Tier 2: blog READ routes ------------------------------------------------
// Light (no heavy deps), but with blog:false they have no content. Gated now;
// flipping `features.blog` → true brings just these back (CMS tier stays gated
// if you later split the condition). Paths are relative to `src/`.
const BLOG_READ_ROUTES: readonly string[] = [
  join('app', 'blog'),
  join('app', 'en', 'blog'),
]

const GATED: readonly string[] = [...CMS_ROUTES, ...BLOG_READ_ROUTES]

/** Move a file OR directory, preferring a fast rename, falling back to copy+rm. */
function move(from: string, to: string): void {
  mkdirSync(dirname(to), { recursive: true })
  try {
    renameSync(from, to)
  } catch {
    // Cross-device move or a locked directory: copy then remove.
    cpSync(from, to, { recursive: true })
    rmSync(from, { recursive: true, force: true })
  }
}

/**
 * Move every stashed entry back into `src/`. Safe to call repeatedly and when
 * nothing is stashed. Returns the list of restored paths.
 */
function restore(): string[] {
  if (!existsSync(STASH_DIR)) return []
  const restored: string[] = []
  for (const rel of GATED) {
    const stashed = join(STASH_DIR, rel)
    if (existsSync(stashed)) {
      move(stashed, join(SRC_DIR, rel))
      restored.push(rel)
    }
  }
  rmSync(STASH_DIR, { recursive: true, force: true })
  return restored
}

/** Read the active client's `features.blog` from its config.ts (no side effects). */
async function readBlogFlag(clientName: string): Promise<boolean> {
  const configPath = join(root, 'clients', clientName, 'config.ts')
  if (!existsSync(configPath)) {
    throw new Error(`Client config not found: clients/${clientName}/config.ts`)
  }
  // Dynamic import is a real runtime boundary, so narrow the shape explicitly.
  const mod = (await import(pathToFileURL(configPath).href)) as {
    default?: { features?: { blog?: boolean } }
  }
  return mod.default?.features?.blog === true
}

async function apply(clientName: string): Promise<void> {
  // Self-heal: recover any leftover stash from a crashed/interrupted prior run
  // before deciding what to gate this time.
  const recovered = restore()
  if (recovered.length > 0) {
    console.log(`↩️  gate-routes: recovered ${recovered.length} stashed route(s) from a prior run`)
  }

  const blogEnabled = await readBlogFlag(clientName)
  if (blogEnabled) {
    console.log(`✅ gate-routes: ${clientName} has blog ON — nothing gated.`)
    return
  }

  const gated: string[] = []
  for (const rel of GATED) {
    const src = join(SRC_DIR, rel)
    if (existsSync(src)) {
      move(src, join(STASH_DIR, rel))
      gated.push(rel)
    }
  }
  console.log(
    `🔒 gate-routes: ${clientName} blog OFF — gated ${gated.length} path(s): ${gated.join(', ') || '(none present)'}`,
  )
}

async function main(): Promise<void> {
  const mode = process.argv[2]
  const clientName = process.env.ACTIVE_CLIENT ?? DEFAULT_CLIENT

  if (mode === 'apply') {
    await apply(clientName)
    return
  }

  if (mode === 'restore') {
    const restored = restore()
    console.log(
      restored.length > 0
        ? `🔓 gate-routes: restored ${restored.length} path(s): ${restored.join(', ')}`
        : `🔓 gate-routes: nothing to restore.`,
    )
    return
  }

  console.error('Usage: tsx scripts/gate-routes.ts <apply|restore>')
  process.exit(1)
}

main().catch((err) => {
  console.error('❌ gate-routes failed:', err)
  process.exit(1)
})
