import { getClientConfig } from '@/lib/client-config'

export default function HomePage() {
  const config = getClientConfig()

  const enabledFeatures = Object.entries(config.features)
    .filter(([, enabled]) => enabled)
    .map(([name]) => name)

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {config.displayName}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {config.seo.siteDescription}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm font-medium text-muted-foreground">SiteForge Status</p>
          <p className="mt-1 text-sm text-green-600">Phase 1C scaffold is working correctly.</p>

          <div className="mt-4">
            <p className="text-sm font-medium text-muted-foreground">Enabled Features</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {enabledFeatures.map((feature) => (
                <span
                  key={feature}
                  className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Next step: Phase 2A — Content rendering from markdown files
          </p>
        </div>
      </div>
    </div>
  )
}
