'use client'

import { useEffect } from 'react'

interface SmartsuppProps {
  smartsuppId: string
}

/**
 * Loads the Smartsupp live chat widget.
 * Only renders when features.smartsupp is true AND NEXT_PUBLIC_SMARTSUPP_ID is set.
 */
export function Smartsupp({ smartsuppId }: SmartsuppProps) {
  useEffect(() => {
    if (!smartsuppId) return

    // Smartsupp global setup
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    w._smartsupp = w._smartsupp || {}
    w._smartsupp.key = smartsuppId

    // Load script
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.charset = 'utf-8'
    script.async = true
    script.src = 'https://www.smartsuppchat.com/loader.js?'
    document.head.appendChild(script)

    return () => {
      // Cleanup on unmount (unlikely in practice, but good hygiene)
      document.head.removeChild(script)
    }
  }, [smartsuppId])

  return null
}
