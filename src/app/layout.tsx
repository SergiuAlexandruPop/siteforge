import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { getClientConfig } from '@/lib/client-config'
import { LayoutShell } from '@/components/layout/LayoutShell'
import { JsonLd } from '@/components/seo/JsonLd'
import { DevBanner } from '@/components/dev/DevBanner'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
})

export function generateMetadata(): Metadata {
  const config = getClientConfig()
  const baseUrl = config.domain === 'localhost'
    ? 'http://localhost:3000'
    : `https://${config.domain}`

  return {
    title: {
      default: config.seo.siteName,
      template: `%s — ${config.seo.siteName}`,
    },
    description: config.seo.siteDescription,
    metadataBase: new URL(baseUrl),
    openGraph: {
      type: 'website',
      siteName: config.seo.siteName,
      locale: config.defaultLanguage === 'ro' ? 'ro_RO' : 'en_US',
      images: [{ url: config.seo.ogImage, width: 1200, height: 630 }],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

// ---------------------------------------------------------------------------
// Environment variable checks for DevBanner
// ---------------------------------------------------------------------------
function getEnvStatus() {
  const check = (name: string, required: boolean) => ({
    name,
    set: !!process.env[name],
    required,
  })

  return [
    check('ACTIVE_CLIENT', true),
    check('R2_ACCOUNT_ID', false),
    check('R2_ACCESS_KEY_ID', false),
    check('R2_SECRET_ACCESS_KEY', false),
    check('R2_BUCKET_NAME', false),
    check('R2_PUBLIC_URL', false),
    check('RESEND_API_KEY', false),
    check('RESEND_FROM_EMAIL', false),
    check('RESEND_TO_EMAIL', false),
    check('GITHUB_TOKEN', false),
    check('GITHUB_REPO', false),
    check('ADMIN_PASSWORD', false),
    check('ADMIN_SESSION_SECRET', false),
    check('NEXT_PUBLIC_SMARTSUPP_ID', false),
    check('NEXT_PUBLIC_GA4_ID', false),
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const config = getClientConfig()
  const isDev = process.env.NODE_ENV === 'development'

  return (
    <html lang={config.defaultLanguage} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <JsonLd config={config} />
        <LayoutShell config={config}>
          {children}
        </LayoutShell>
        {isDev && (
          <DevBanner
            clientName={config.name}
            displayName={config.displayName}
            features={config.features}
            envVars={getEnvStatus()}
          />
        )}
      </body>
    </html>
  )
}
