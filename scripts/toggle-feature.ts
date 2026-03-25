import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, join } from 'node:path'
import * as readline from 'node:readline'

// ---------------------------------------------------------------------------
// scripts/toggle-feature.ts
// Usage: yarn toggle-feature
// ---------------------------------------------------------------------------
// Interactive CLI to enable/disable features for an existing client.
// When enabling, shows which env vars are needed and checks if they're set.
// ---------------------------------------------------------------------------

const root = resolve(__dirname, '..')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function ask(question: string, defaultValue?: string): Promise<string> {
  const suffix = defaultValue ? ` (${defaultValue})` : ''
  return new Promise((resolve) => {
    rl.question(`${question}${suffix}: `, (answer) => {
      resolve(answer.trim() || defaultValue || '')
    })
  })
}

function askYesNo(question: string, defaultValue: boolean = true): Promise<boolean> {
  const hint = defaultValue ? '(D/n)' : '(d/N)'
  return new Promise((resolve) => {
    rl.question(`${question} ${hint}: `, (answer) => {
      const a = answer.trim().toLowerCase()
      if (a === '') resolve(defaultValue)
      else resolve(a === 'd' || a === 'da' || a === 'y' || a === 'yes')
    })
  })
}

// ---------------------------------------------------------------------------
// Feature definitions — what each feature needs
// ---------------------------------------------------------------------------

interface FeatureDef {
  label: string
  description: string
  /** Env vars required for this feature to work */
  requiredEnvVars: { name: string; description: string; howToGet: string }[]
  /** Directories that should exist when this feature is enabled */
  directories?: string[]
  /** Config fields to add (like blog settings) */
  configExtra?: string
}

const FEATURES: Record<string, FeatureDef> = {
  i18n: {
    label: 'Suport Engleză (/en/)',
    description: 'Adaugă rute /en/ pentru conținut în engleză. Toggle de limbă apare în header.',
    requiredEnvVars: [],
    directories: ['content/pages-en', 'content/blog-en'],
  },
  blog: {
    label: 'Blog + CMS Admin',
    description: 'Blog public cu articole și panel admin pentru publicare. Editor vizual Novel.',
    requiredEnvVars: [
      {
        name: 'GITHUB_TOKEN',
        description: 'Token GitHub pentru operații CMS (creare/editare articole)',
        howToGet: 'GitHub → Settings → Developer settings → Personal access tokens → Generate new token → Scope: repo',
      },
      {
        name: 'GITHUB_REPO',
        description: 'Repository-ul GitHub (format: user/repo)',
        howToGet: 'Numele repo-ului tău, ex: SergiuAlexandruPop/siteforge',
      },
      {
        name: 'ADMIN_PASSWORD',
        description: 'Parola pentru login la /admin',
        howToGet: 'Alege o parolă puternică (12+ caractere)',
      },
      {
        name: 'ADMIN_SESSION_SECRET',
        description: 'Secret pentru semnarea cookie-urilor de sesiune',
        howToGet: 'Generează cu: openssl rand -hex 16',
      },
      {
        name: 'R2_ACCOUNT_ID',
        description: 'Cloudflare Account ID (pentru upload imagini)',
        howToGet: 'Cloudflare Dashboard → R2 → Account ID din URL',
      },
      {
        name: 'R2_ACCESS_KEY_ID',
        description: 'R2 API Access Key',
        howToGet: 'Cloudflare → R2 → Manage R2 API Tokens → Create API Token',
      },
      {
        name: 'R2_SECRET_ACCESS_KEY',
        description: 'R2 API Secret Key',
        howToGet: 'Apare o singură dată la crearea token-ului R2',
      },
      {
        name: 'R2_BUCKET_NAME',
        description: 'Numele bucket-ului R2',
        howToGet: 'Cloudflare → R2 → Create Bucket → Numele ales (ex: siteforge-client-images)',
      },
      {
        name: 'R2_PUBLIC_URL',
        description: 'URL-ul public al bucket-ului R2',
        howToGet: 'Cloudflare → R2 → Bucket → Settings → Public Access → Allow Access → Copiază URL-ul',
      },
    ],
    directories: ['content/blog', 'content/blog-en'],
  },
  darkMode: {
    label: 'Dark Mode',
    description: 'Toggle dark/light mode în header. Respectă preferința de sistem.',
    requiredEnvVars: [],
  },
  contactForm: {
    label: 'Formular Contact',
    description: 'Formular pe pagina /contact care trimite email prin Resend.',
    requiredEnvVars: [
      {
        name: 'RESEND_API_KEY',
        description: 'Cheia API Resend pentru trimitere email',
        howToGet: 'resend.com → API Keys → Create API Key',
      },
      {
        name: 'RESEND_FROM_EMAIL',
        description: 'Adresa de email expeditor (ex: noreply@domeniu.ro)',
        howToGet: 'Folosește onboarding@resend.dev (gratuit) sau verifică un domeniu propriu în Resend',
      },
      {
        name: 'RESEND_TO_EMAIL',
        description: 'Adresa unde ajung mesajele (email-ul clientului)',
        howToGet: 'Email-ul pe care clientul vrea să primească mesajele',
      },
    ],
  },
  smartsupp: {
    label: 'Smartsupp Chat',
    description: 'Widget de live chat Smartsupp pe site.',
    requiredEnvVars: [
      {
        name: 'NEXT_PUBLIC_SMARTSUPP_ID',
        description: 'ID-ul Smartsupp',
        howToGet: 'smartsupp.com → Sign up → Dashboard → Settings → Chat box → Copiază ID-ul din script',
      },
    ],
  },
}

// ---------------------------------------------------------------------------
// Parse and update config.ts feature flags
// ---------------------------------------------------------------------------

function readConfigFeatures(configPath: string): Record<string, boolean> {
  const content = readFileSync(configPath, 'utf-8')
  const features: Record<string, boolean> = {}

  const featuresMatch = content.match(/features:\s*\{([^}]+)\}/)
  if (!featuresMatch) return features

  const block = featuresMatch[1]
  for (const line of block.split('\n')) {
    const match = line.match(/(\w+):\s*(true|false)/)
    if (match) {
      features[match[1]] = match[2] === 'true'
    }
  }

  return features
}

function updateConfigFeature(configPath: string, feature: string, value: boolean): void {
  let content = readFileSync(configPath, 'utf-8')

  // Replace the specific feature line
  const regex = new RegExp(`(${feature}:\\s*)(true|false)`)
  content = content.replace(regex, `$1${value}`)

  writeFileSync(configPath, content, 'utf-8')
}

function addBlogConfig(configPath: string, authorName: string): void {
  let content = readFileSync(configPath, 'utf-8')

  // Check if blog config already exists
  if (content.includes('blog:') && content.includes('postsPerPage')) return

  // Add blog config before the closing of the config object
  const blogBlock = `
  blog: {
    postsPerPage: 10,
    showReadingTime: true,
    showAuthor: true,
    authorName: '${authorName}',
    authorAvatar: '/avatar.jpg',
  },`

  // Insert before the last closing brace of the config object
  // Find "}\n\nexport default config"
  content = content.replace(
    /\n}\n\nexport default config/,
    `${blogBlock}\n}\n\nexport default config`
  )

  writeFileSync(configPath, content, 'utf-8')
}

// ---------------------------------------------------------------------------
// Check env vars
// ---------------------------------------------------------------------------

function checkEnvVars(envPath: string, varNames: string[]): { name: string; set: boolean }[] {
  if (!existsSync(envPath)) return varNames.map((name) => ({ name, set: false }))

  const content = readFileSync(envPath, 'utf-8')
  return varNames.map((name) => {
    const match = content.match(new RegExp(`^${name}=(.+)$`, 'm'))
    return { name, set: !!match && match[1].trim().length > 0 }
  })
}

// ---------------------------------------------------------------------------
// List available clients
// ---------------------------------------------------------------------------

function getClients(): string[] {
  const clientsDir = join(root, 'clients')
  const { readdirSync, statSync } = require('node:fs')
  return readdirSync(clientsDir)
    .filter((name: string) => {
      if (name === '_template' || name.startsWith('.')) return false
      return statSync(join(clientsDir, name)).isDirectory()
    })
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('')
  console.log('╔══════════════════════════════════════╗')
  console.log('║   SiteForge — Toggle funcționalitate ║')
  console.log('╚══════════════════════════════════════╝')
  console.log('')

  // 1. Pick client
  const clients = getClients()
  if (clients.length === 0) {
    console.error('❌ Nu există clienți. Creează unul cu: yarn new-client')
    process.exit(1)
  }

  console.log('Clienți disponibili:')
  clients.forEach((c, i) => console.log(`  ${i + 1}. ${c}`))
  console.log('')

  const clientInput = await ask('Alege clientul (număr sau nume)')
  const clientName = /^\d+$/.test(clientInput)
    ? clients[parseInt(clientInput) - 1]
    : clientInput

  if (!clientName || !clients.includes(clientName)) {
    console.error(`❌ Client invalid: ${clientInput}`)
    process.exit(1)
  }

  const configPath = join(root, 'clients', clientName, 'config.ts')
  const envPath = join(root, 'env', `.env.${clientName}`)

  if (!existsSync(configPath)) {
    console.error(`❌ Nu s-a găsit clients/${clientName}/config.ts`)
    process.exit(1)
  }

  // 2. Show current features
  const currentFeatures = readConfigFeatures(configPath)

  console.log('')
  console.log(`Funcționalități pentru "${clientName}":`)
  console.log('')

  const featureKeys = Object.keys(FEATURES)
  featureKeys.forEach((key, i) => {
    const def = FEATURES[key]
    const enabled = currentFeatures[key] ?? false
    const status = enabled ? '✅ ACTIV' : '❌ INACTIV'
    console.log(`  ${i + 1}. ${def.label} — ${status}`)
  })
  console.log('')

  // 3. Pick feature
  const featureInput = await ask('Ce funcționalitate vrei să modifici? (număr)')
  const featureIndex = parseInt(featureInput) - 1
  const featureKey = featureKeys[featureIndex]

  if (!featureKey || !FEATURES[featureKey]) {
    console.error('❌ Selecție invalidă.')
    process.exit(1)
  }

  const featureDef = FEATURES[featureKey]
  const isCurrentlyEnabled = currentFeatures[featureKey] ?? false
  const action = isCurrentlyEnabled ? 'dezactiva' : 'activa'

  console.log('')
  console.log(`${featureDef.label}: ${featureDef.description}`)
  console.log('')

  // 4. If enabling — check requirements
  if (!isCurrentlyEnabled && featureDef.requiredEnvVars.length > 0) {
    console.log('⚠️  Această funcționalitate necesită configurare:')
    console.log('')

    const envStatus = checkEnvVars(
      envPath,
      featureDef.requiredEnvVars.map((v) => v.name)
    )

    let allSet = true
    featureDef.requiredEnvVars.forEach((v, i) => {
      const status = envStatus[i]
      const icon = status.set ? '✅' : '❌'
      console.log(`  ${icon} ${v.name}`)
      console.log(`     ${v.description}`)
      if (!status.set) {
        console.log(`     📋 Cum obții: ${v.howToGet}`)
        allSet = false
      }
      console.log('')
    })

    if (!allSet) {
      console.log(`Setează variabilele lipsă în: env/.env.${clientName}`)
      console.log('Funcționalitatea va fi activată în config, dar nu va funcționa complet până nu completezi env vars.')
      console.log('')
    }
  }

  // 5. Confirm and toggle
  const confirm = await askYesNo(`Vrei să ${action} "${featureDef.label}"?`)
  if (!confirm) {
    console.log('Anulat.')
    rl.close()
    return
  }

  const newValue = !isCurrentlyEnabled

  // 6. Update config.ts
  updateConfigFeature(configPath, featureKey, newValue)
  console.log(`✅ ${featureKey}: ${newValue} în clients/${clientName}/config.ts`)

  // 7. Create directories if enabling and they're needed
  if (newValue && featureDef.directories) {
    const clientDir = join(root, 'clients', clientName)
    for (const dir of featureDef.directories) {
      const fullPath = join(clientDir, dir)
      if (!existsSync(fullPath)) {
        mkdirSync(fullPath, { recursive: true })
        writeFileSync(join(fullPath, '.gitkeep'), '', 'utf-8')
        console.log(`✅ Creat ${dir}/`)
      }
    }
  }

  // 8. If enabling blog, add blog config block if missing
  if (featureKey === 'blog' && newValue) {
    const authorName = await ask('Numele autorului pentru blog', clientName)
    addBlogConfig(configPath, authorName)
    console.log(`✅ Adăugat configurare blog în config.ts`)

    // Also add blog nav item if missing
    const content = readFileSync(configPath, 'utf-8')
    if (!content.includes("href: '/blog'")) {
      const updated = content.replace(
        /(\{ label: 'Contact')/,
        `{ label: 'Blog', href: '/blog' },\n    $1`
      )
      writeFileSync(configPath, updated, 'utf-8')
      console.log(`✅ Adăugat "Blog" în navigare`)
    }
  }

  console.log('')
  console.log('══════════════════════════════════════════')
  if (newValue) {
    console.log(`  ✅ "${featureDef.label}" activat pentru ${clientName}`)
    if (featureDef.requiredEnvVars.length > 0) {
      console.log(`  ⚠️  Nu uita să completezi env/.env.${clientName}`)
    }
  } else {
    console.log(`  ✅ "${featureDef.label}" dezactivat pentru ${clientName}`)
  }
  console.log(`  🔄 Repornește serverul: yarn dev:${clientName}`)
  console.log('══════════════════════════════════════════')
  console.log('')

  rl.close()
}

main().catch((err) => {
  console.error('Eroare:', err)
  rl.close()
  process.exit(1)
})
