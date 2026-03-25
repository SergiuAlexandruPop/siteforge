import {
  existsSync,
  mkdirSync,
  copyFileSync,
  writeFileSync,
  readFileSync,
  readdirSync,
} from 'node:fs'
import { resolve, join } from 'node:path'
import * as readline from 'node:readline'

// ---------------------------------------------------------------------------
// scripts/new-client.ts
// Usage: yarn new-client
// ---------------------------------------------------------------------------
// Interactive CLI that scaffolds a new client folder with all required files.
// ---------------------------------------------------------------------------

const root = resolve(__dirname, '..')

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

function askYesNo(question: string, defaultValue: boolean = false): Promise<boolean> {
  const hint = defaultValue ? '(D/n)' : '(d/N)'
  return new Promise((resolve) => {
    rl.question(`${question} ${hint}: `, (answer) => {
      const a = answer.trim().toLowerCase()
      if (a === '') resolve(defaultValue)
      else resolve(a === 'd' || a === 'da' || a === 'y' || a === 'yes')
    })
  })
}

function toKebab(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function generateSessionSecret(): string {
  const chars = 'abcdef0123456789'
  let result = ''
  for (let i = 0; i < 32; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

// ---------------------------------------------------------------------------
// File generators
// ---------------------------------------------------------------------------

function generateConfigTs(data: {
  name: string
  displayName: string
  domain: string
  features: Record<string, boolean>
  email: string
  phone: string
  blogAuthor: string
}): string {
  const navItems = [
    `    { label: 'Acasă', href: '/', labelEn: 'Home' },`,
    `    { label: 'Despre', href: '/about', labelEn: 'About' },`,
  ]

  if (data.features.blog) {
    navItems.push(`    { label: 'Blog', href: '/blog' },`)
  }

  navItems.push(`    { label: 'Contact', href: '/contact' },`)

  const blogConfig = data.features.blog
    ? `
  blog: {
    postsPerPage: 10,
    showReadingTime: true,
    showAuthor: true,
    authorName: '${data.blogAuthor}',
    authorAvatar: '/avatar.jpg',
  },`
    : ''

  return `import type { ClientConfig } from '../../src/types/config'

const config: ClientConfig = {
  name: '${data.name}',
  displayName: '${data.displayName}',
  domain: '${data.domain}',
  defaultLanguage: 'ro',

  features: {
    i18n: ${data.features.i18n},
    blog: ${data.features.blog},
    darkMode: ${data.features.darkMode},
    contactForm: ${data.features.contactForm},
    smartsupp: ${data.features.smartsupp},
    supabase: false,
  },

  seo: {
    siteName: '${data.displayName}',
    siteDescription: 'Site-ul oficial ${data.displayName}.',
    ogImage: '/og-image.jpg',
  },

  contact: {
    email: '${data.email}',
    phone: '${data.phone}',
  },

  navigation: [
${navItems.join('\n')}
  ],
${blogConfig}
}

export default config
`
}

function generateThemeTs(primaryColor: string): string {
  return `import type { ClientTheme } from '../../src/types/config'

const theme: ClientTheme = {
  colors: {
    primary: '${primaryColor}',
    primaryForeground: '#ffffff',
    secondary: '#64748b',
    background: '#ffffff',
    foreground: '#0f172a',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    border: '#e2e8f0',
    dark: {
      background: '#0f172a',
      foreground: '#f8fafc',
      muted: '#1e293b',
      mutedForeground: '#94a3b8',
      border: '#334155',
    },
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
    blog: 'Georgia',
  },
  borderRadius: '0.5rem',
}

export default theme
`
}

function generateEnvFile(data: { name: string; email: string }): string {
  return `# ============================================
# SiteForge — ${data.name} Environment
# ============================================

ACTIVE_CLIENT=${data.name}

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=siteforge-${data.name}-images
R2_PUBLIC_URL=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@example.ro
RESEND_TO_EMAIL=${data.email}

# GitHub API
GITHUB_TOKEN=
GITHUB_REPO=
GITHUB_BRANCH=main

# Admin CMS
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=${generateSessionSecret()}

# Smartsupp (leave empty to disable)
NEXT_PUBLIC_SMARTSUPP_ID=

# Google Analytics (leave empty to disable)
NEXT_PUBLIC_GA4_ID=

# Supabase (leave empty if not used)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
`
}

function generateIndexMd(displayName: string): string {
  return `---
title: "${displayName}"
description: "Site-ul oficial ${displayName}"
---

Bine ați venit pe site-ul ${displayName}.
`
}

// ---------------------------------------------------------------------------
// Register client in client-config.ts
// ---------------------------------------------------------------------------

function registerClient(name: string): void {
  const configPath = join(root, 'src', 'lib', 'client-config.ts')
  let content = readFileSync(configPath, 'utf-8')

  // Add import lines after the last existing import
  const importLine = `import ${camelCase(name)}Config from '../../clients/${name}/config'\nimport ${camelCase(name)}Theme from '../../clients/${name}/theme'`

  // Find the last import line
  const importLines = content.split('\n').filter((l) => l.startsWith('import '))
  const lastImport = importLines[importLines.length - 1]

  content = content.replace(lastImport, `${lastImport}\n${importLine}`)

  // Add to configs map
  content = content.replace(
    /const configs: Record<string, ClientConfig> = \{/,
    `const configs: Record<string, ClientConfig> = {\n  '${name}': ${camelCase(name)}Config,`
  )

  // Add to themes map
  content = content.replace(
    /const themes: Record<string, ClientTheme> = \{/,
    `const themes: Record<string, ClientTheme> = {\n  '${name}': ${camelCase(name)}Theme,`
  )

  writeFileSync(configPath, content, 'utf-8')
}

function camelCase(kebab: string): string {
  return kebab.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

// ---------------------------------------------------------------------------
// Add scripts to package.json
// ---------------------------------------------------------------------------

function addPackageScripts(name: string): void {
  const pkgPath = join(root, 'package.json')
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))

  pkg.scripts[`dev:${name}`] = `tsx scripts/dev.ts ${name}`
  pkg.scripts[`build:${name}`] = `cross-env ACTIVE_CLIENT=${name} next build`

  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8')
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('')
  console.log('╔══════════════════════════════════════╗')
  console.log('║   SiteForge — Client nou             ║')
  console.log('╚══════════════════════════════════════╝')
  console.log('')

  // --- Gather info ---

  const displayName = await ask('Numele afacerii (ex: Dr. Maria Popescu)')
  if (!displayName) {
    console.error('❌ Numele este obligatoriu.')
    process.exit(1)
  }

  const suggestedName = toKebab(displayName)
  const name = await ask('Numele folderului (kebab-case)', suggestedName)

  // Validate name
  if (!/^[a-z0-9-]+$/.test(name)) {
    console.error('❌ Numele folderului poate conține doar litere mici, cifre și cratime.')
    process.exit(1)
  }

  // Check if already exists
  const clientDir = join(root, 'clients', name)
  if (existsSync(clientDir)) {
    console.error(`❌ Folderul clients/${name}/ există deja.`)
    process.exit(1)
  }

  const domain = await ask('Domeniul (ex: doctormaria.ro)', 'localhost')
  const email = await ask('Email contact', `contact@${domain === 'localhost' ? 'example.ro' : domain}`)
  const phone = await ask('Telefon', '+40 700 000 000')

  console.log('')
  console.log('--- Funcționalități ---')

  const features: Record<string, boolean> = {
    i18n: await askYesNo('Suport limbă engleză (/en/)?'),
    blog: await askYesNo('Blog + CMS admin?', true),
    darkMode: await askYesNo('Dark mode?', true),
    contactForm: await askYesNo('Formular contact?', true),
    smartsupp: await askYesNo('Smartsupp chat?'),
  }

  let blogAuthor = displayName
  if (features.blog) {
    blogAuthor = await ask('Numele autorului pentru blog', displayName)
  }

  const primaryColor = await ask('Culoare primară (hex)', '#2563eb')

  // --- Summary ---

  console.log('')
  console.log('═══════════════════════════════════════')
  console.log(`  Client:    ${displayName}`)
  console.log(`  Folder:    clients/${name}/`)
  console.log(`  Domeniu:   ${domain}`)
  console.log(`  Email:     ${email}`)
  console.log(`  Telefon:   ${phone}`)
  console.log(`  Culoare:   ${primaryColor}`)
  console.log(`  i18n:      ${features.i18n ? 'Da' : 'Nu'}`)
  console.log(`  Blog:      ${features.blog ? 'Da' : 'Nu'}`)
  console.log(`  Dark mode: ${features.darkMode ? 'Da' : 'Nu'}`)
  console.log(`  Contact:   ${features.contactForm ? 'Da' : 'Nu'}`)
  console.log(`  Smartsupp: ${features.smartsupp ? 'Da' : 'Nu'}`)
  console.log('═══════════════════════════════════════')
  console.log('')

  const confirm = await askYesNo('Creez clientul?', true)
  if (!confirm) {
    console.log('❌ Anulat.')
    process.exit(0)
  }

  // --- Create files ---

  console.log('')

  // 1. Create directory structure
  mkdirSync(clientDir, { recursive: true })
  mkdirSync(join(clientDir, 'content', 'pages'), { recursive: true })
  mkdirSync(join(clientDir, 'content', 'pages-en'), { recursive: true })
  mkdirSync(join(clientDir, 'content', 'blog'), { recursive: true })
  mkdirSync(join(clientDir, 'content', 'blog-en'), { recursive: true })
  mkdirSync(join(clientDir, 'public'), { recursive: true })
  console.log(`✅ Creat clients/${name}/`)

  // 2. Generate config.ts
  writeFileSync(
    join(clientDir, 'config.ts'),
    generateConfigTs({ name, displayName, domain, features, email, phone, blogAuthor }),
    'utf-8'
  )
  console.log(`✅ Creat clients/${name}/config.ts`)

  // 3. Generate theme.ts
  writeFileSync(
    join(clientDir, 'theme.ts'),
    generateThemeTs(primaryColor),
    'utf-8'
  )
  console.log(`✅ Creat clients/${name}/theme.ts`)

  // 4. Generate placeholder content
  writeFileSync(
    join(clientDir, 'content', 'pages', 'index.md'),
    generateIndexMd(displayName),
    'utf-8'
  )
  writeFileSync(join(clientDir, 'content', 'pages-en', '.gitkeep'), '', 'utf-8')
  writeFileSync(join(clientDir, 'content', 'blog', '.gitkeep'), '', 'utf-8')
  writeFileSync(join(clientDir, 'content', 'blog-en', '.gitkeep'), '', 'utf-8')
  writeFileSync(join(clientDir, 'public', '.gitkeep'), '', 'utf-8')
  console.log(`✅ Creat conținut placeholder`)

  // 5. Generate env file
  const envPath = join(root, 'env', `.env.${name}`)
  writeFileSync(envPath, generateEnvFile({ name, email }), 'utf-8')
  console.log(`✅ Creat env/.env.${name}`)

  // 6. Add scripts to package.json
  addPackageScripts(name)
  console.log(`✅ Adăugat yarn dev:${name} și yarn build:${name}`)

  // 7. Register in client-config.ts
  registerClient(name)
  console.log(`✅ Înregistrat în src/lib/client-config.ts`)

  console.log('')
  console.log('══════════════════════════════════════════')
  console.log(`  ✅ Clientul "${displayName}" a fost creat!`)
  console.log('')
  console.log('  Pași următori:')
  console.log(`  1. Editează clients/${name}/config.ts și theme.ts`)
  console.log(`  2. Completează env/.env.${name} cu cheile API`)
  console.log(`  3. Adaugă logo și imagini în clients/${name}/public/`)
  console.log(`  4. Pornește serverul: yarn dev:${name}`)
  console.log('══════════════════════════════════════════')
  console.log('')

  rl.close()
}

main().catch((err) => {
  console.error('Eroare:', err)
  rl.close()
  process.exit(1)
})
