import type { Metadata } from 'next'
import { Inter, Newsreader } from 'next/font/google'

import { getClientConfig, getClientTheme } from '@/lib/client-config'
import { getClientLayout } from '@/lib/client-layout'
import { JsonLd } from '@/components/seo/JsonLd'
import { DevBanner } from '@/components/dev/DevBanner'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'
import { Smartsupp } from '@/components/integrations/Smartsupp'
import { generateThemeCss } from '@/lib/theme-css'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
})

const newsreader = Newsreader({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-editorial',
  display: 'swap',
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

// ---------------------------------------------------------------------------
// Inline script to prevent FOUC (Flash of Unstyled Content) for dark mode.
// Runs before React hydrates — reads localStorage and applies .dark class
// immediately so the user never sees a white flash.
// ---------------------------------------------------------------------------
const themeInitScript = `
(function(){
  try {
    var stored = localStorage.getItem('siteforge-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored !== 'light') {
      document.documentElement.classList.add('dark');
    }
  } catch(e) {}
})();
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const config = getClientConfig()
  const theme = getClientTheme()
  const themeCss = generateThemeCss(theme)
  const isDev = process.env.NODE_ENV === 'development'
  const darkModeEnabled = config.features.darkMode
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID ?? ''
  const smartsuppId = process.env.NEXT_PUBLIC_SMARTSUPP_ID ?? ''

  // --- Registry: resolve layout for this client ---
  const ClientLayout = getClientLayout(config.name)

  const appContent = (
    <>
      <JsonLd config={config} />
      <ClientLayout config={config}>
        {children}
      </ClientLayout>

      {/* Analytics — only loads when GA4 ID is set */}
      {ga4Id && <GoogleAnalytics gaId={ga4Id} />}

      {/* Smartsupp — only loads when feature is on AND ID is set */}
      {config.features.smartsupp && smartsuppId && (
        <Smartsupp smartsuppId={smartsuppId} />
      )}

      {/* Dev overlay — only in development */}
      {isDev && (
        <DevBanner
          clientName={config.name}
          displayName={config.displayName}
          features={config.features}
          envVars={getEnvStatus()}
        />
      )}
    </>
  )

  return (
    <html lang={config.defaultLanguage} suppressHydrationWarning>
      <head>
        {/* Client theme colors — overrides shadcn defaults with client's brand */}
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
        {/* Client fonts — loaded from Google Fonts */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --font-heading: '${theme.fonts.heading}', sans-serif;
            --font-body: '${theme.fonts.body}', sans-serif;
            --font-blog: '${theme.fonts.blog}', serif;
          }
        `}} />
        {darkModeEnabled && (
          <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        )}
      </head>
      <body className={`${inter.variable} ${newsreader.variable} font-sans antialiased transition-colors duration-200`}>
        {darkModeEnabled ? (
          <ThemeProvider>{appContent}</ThemeProvider>
        ) : (
          appContent
        )}
      </body>
    </html>
  )
}
