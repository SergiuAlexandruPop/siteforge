'use client'

import { useState } from 'react'
import type { ClientFeatures } from '@/types/config'

interface EnvVarStatus {
  name: string
  set: boolean
  required: boolean
}

interface DevBannerProps {
  clientName: string
  displayName: string
  features: ClientFeatures
  envVars: EnvVarStatus[]
}

/**
 * Maps env vars to their controlling feature flag.
 * If the feature is off, the env var is irrelevant (not a real "missing").
 */
const ENV_FEATURE_MAP: Record<string, keyof ClientFeatures | null> = {
  ACTIVE_CLIENT: null, // always required
  R2_ACCOUNT_ID: 'blog',
  R2_ACCESS_KEY_ID: 'blog',
  R2_SECRET_ACCESS_KEY: 'blog',
  R2_BUCKET_NAME: 'blog',
  R2_PUBLIC_URL: 'blog',
  RESEND_API_KEY: 'contactForm',
  RESEND_FROM_EMAIL: 'contactForm',
  RESEND_TO_EMAIL: 'contactForm',
  GITHUB_TOKEN: 'blog',
  GITHUB_REPO: 'blog',
  ADMIN_PASSWORD: 'blog',
  ADMIN_SESSION_SECRET: 'blog',
  NEXT_PUBLIC_SMARTSUPP_ID: 'smartsupp',
  NEXT_PUBLIC_GA4_ID: null, // always optional, no feature flag gate
}

function isRelevant(envName: string, features: ClientFeatures): boolean {
  const feature = ENV_FEATURE_MAP[envName]
  if (feature === null || feature === undefined) return true
  return features[feature]
}

export function DevBanner({ clientName, displayName, features, envVars }: DevBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  const [expanded, setExpanded] = useState(false)

  if (dismissed) return null

  // Filter to only relevant env vars based on active features
  const relevantVars = envVars.filter((v) => isRelevant(v.name, features))

  const missingRequired = relevantVars.filter((v) => v.required && !v.set)
  const missingOptional = relevantVars.filter((v) => !v.required && !v.set)
  const allSet = relevantVars.filter((v) => v.set)

  const statusColor =
    missingRequired.length > 0
      ? 'bg-red-500'
      : missingOptional.length > 0
        ? 'bg-yellow-500'
        : 'bg-green-500'

  const featureEntries = Object.entries(features) as [keyof ClientFeatures, boolean][]

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm font-mono text-xs">
      {/* Collapsed pill */}
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1.5 text-white shadow-lg hover:bg-slate-800 transition-colors"
        >
          <span className={`inline-block h-2 w-2 rounded-full ${statusColor}`} />
          <span>DEV: {clientName}</span>
        </button>
      )}

      {/* Expanded panel */}
      {expanded && (
        <div className="rounded-lg border border-slate-700 bg-slate-900 text-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-700 px-3 py-2">
            <div className="flex items-center gap-2">
              <span className={`inline-block h-2 w-2 rounded-full ${statusColor}`} />
              <span className="font-semibold">SiteForge Dev</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setExpanded(false)}
                className="rounded px-1.5 py-0.5 hover:bg-slate-700 transition-colors"
                title="Minimize"
              >
                _
              </button>
              <button
                onClick={() => setDismissed(true)}
                className="rounded px-1.5 py-0.5 hover:bg-slate-700 transition-colors"
                title="Dismiss for session"
              >
                x
              </button>
            </div>
          </div>

          {/* Client info */}
          <div className="border-b border-slate-700 px-3 py-2">
            <div className="text-slate-400">Active Client</div>
            <div className="font-semibold text-blue-400">{displayName}</div>
            <div className="text-slate-500">({clientName})</div>
          </div>

          {/* Features */}
          <div className="border-b border-slate-700 px-3 py-2">
            <div className="mb-1 text-slate-400">Features</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
              {featureEntries.map(([key, enabled]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span className={enabled ? 'text-green-400' : 'text-slate-600'}>
                    {enabled ? '●' : '○'}
                  </span>
                  <span className={enabled ? 'text-slate-200' : 'text-slate-500'}>
                    {key}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Environment */}
          <div className="px-3 py-2">
            <div className="mb-1 text-slate-400">
              Environment ({relevantVars.length} relevant)
            </div>

            {missingRequired.length > 0 && (
              <div className="mb-1">
                <span className="text-red-400">Missing (required):</span>
                {missingRequired.map((v) => (
                  <div key={v.name} className="ml-2 text-red-300">{v.name}</div>
                ))}
              </div>
            )}

            {missingOptional.length > 0 && (
              <div className="mb-1">
                <span className="text-yellow-400">Missing (optional):</span>
                {missingOptional.map((v) => (
                  <div key={v.name} className="ml-2 text-yellow-300">{v.name}</div>
                ))}
              </div>
            )}

            <div className="text-green-400">
              {allSet.length}/{relevantVars.length} vars configured
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
