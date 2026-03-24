import Script from 'next/script'

interface GoogleAnalyticsProps {
  gaId: string
}

/**
 * Loads Google Analytics 4 via next/script.
 * Only renders when NEXT_PUBLIC_GA4_ID is set.
 * Uses next/script with strategy="afterInteractive" for optimal loading.
 */
export function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  if (!gaId) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  )
}
