import {existsSync, copyFileSync, readdirSync} from 'node:fs'
import { resolve, join } from 'node:path'
import { execSync } from 'node:child_process'

// ---------------------------------------------------------------------------
// scripts/dev.ts
// Usage: yarn dev:portfolio  (which runs: tsx scripts/dev.ts portfolio)
// ---------------------------------------------------------------------------
// 1. Reads the client name from CLI args
// 2. Copies env/.env.{client} → .env.local
// 3. Starts Next.js dev server with Turbopack
// ---------------------------------------------------------------------------

const clientName = process.argv[2]

if (!clientName) {
  console.error('❌ No client name provided.')
  console.error('Usage: tsx scripts/dev.ts <client-name>')
  console.error('Example: tsx scripts/dev.ts portfolio')
  process.exit(1)
}

const root = resolve(__dirname, '..')
const envSource = join(root, 'env', `.env.${clientName}`)
const envTarget = join(root, '.env.local')
const clientDir = join(root, 'clients', clientName)

// Validate client exists
if (!existsSync(clientDir)) {
  console.error(`❌ Client folder not found: clients/${clientName}/`)
  console.error(`Available clients:`)

    const clients = readdirSync(join(root, 'clients'))
    .filter((name) => name !== '_template' && !name.startsWith('.'))
  clients.forEach((c) => console.error(`  - ${c}`))

  process.exit(1)
}

// Validate env file exists
if (!existsSync(envSource)) {
  console.error(`❌ Environment file not found: env/.env.${clientName}`)
  console.error(`Create it by copying env/.env.example:`)
  console.error(`  cp env/.env.example env/.env.${clientName}`)
  process.exit(1)
}

// Copy env file
copyFileSync(envSource, envTarget)
console.log(`✅ Copied env/.env.${clientName} → .env.local`)
console.log(`🚀 Starting dev server for: ${clientName}`)
console.log('')

// Start Next.js dev with Turbopack
try {
  execSync('yarn dev', {
    cwd: root,
    stdio: 'inherit',
    env: {
      ...process.env,
      ACTIVE_CLIENT: clientName,
    },
  })
} catch {
  // execSync throws on SIGINT (Ctrl+C) — this is expected when stopping dev server
  process.exit(0)
}
