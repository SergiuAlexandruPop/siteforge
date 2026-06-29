import { execSync } from 'node:child_process'
import { resolve } from 'node:path'

// ---------------------------------------------------------------------------
// scripts/build.ts
// ---------------------------------------------------------------------------
// Single build entry that wraps the route-gating pass around the real build:
//
//   1. gen-active-client  → write the single-client manifest
//   2. gate-routes apply  → stash blog/CMS routes for non-blog clients (no-op
//                           for blog clients)
//   3. <builder> build    → `next build` (target=next) or
//                           `opennextjs-cloudflare build` (target=cf)
//   4. gate-routes restore → ALWAYS, even on build failure or Ctrl-C, so the
//                            working tree is never left with routes stashed.
//
// The restore in `finally` + the SIGINT/SIGTERM handlers + gate-routes' own
// self-heal on the next `apply` make stranded routes effectively impossible.
//
// Usage (from package.json, with ACTIVE_CLIENT set):
//   tsx scripts/build.ts next
//   tsx scripts/build.ts cf
// ---------------------------------------------------------------------------

const root = resolve(__dirname, '..')

function run(cmd: string): void {
  // Inherits PATH (incl. node_modules/.bin) and ACTIVE_CLIENT from this process.
  execSync(cmd, { stdio: 'inherit', cwd: root, env: process.env })
}

function builderCommand(target: 'next' | 'cf'): string {
  return target === 'cf' ? 'opennextjs-cloudflare build' : 'next build'
}

function main(): void {
  const target = process.argv[2]
  if (target !== 'next' && target !== 'cf') {
    console.error('Usage: tsx scripts/build.ts <next|cf>')
    process.exit(1)
  }

  const client = process.env.ACTIVE_CLIENT ?? '_template'
  console.log(`🏗️  build.ts: target=${target} client=${client}`)

  // 1. Regenerate the single-client manifest.
  run('tsx scripts/gen-active-client.ts')

  // 2. Gate blog/CMS routes out (no-op for blog clients).
  run('tsx scripts/gate-routes.ts apply')

  // Restore exactly once, whether we exit normally, throw, or get signalled.
  let restored = false
  const restoreOnce = (): void => {
    if (restored) return
    restored = true
    try {
      run('tsx scripts/gate-routes.ts restore')
    } catch (err) {
      console.error(
        '⚠️  gate-routes restore failed — run `tsx scripts/gate-routes.ts restore` manually to recover.',
        err,
      )
    }
  }

  const onSignal = (sig: NodeJS.Signals): void => {
    restoreOnce()
    process.exit(sig === 'SIGINT' ? 130 : 143)
  }
  process.on('SIGINT', onSignal)
  process.on('SIGTERM', onSignal)

  // 3 + 4. Build, then ALWAYS restore.
  try {
    run(builderCommand(target))
  } finally {
    restoreOnce()
  }
}

main()
