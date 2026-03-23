import { getClientConfig } from '@/lib/client-config'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  const config = getClientConfig()

  const enabledFeatures = Object.entries(config.features)
    .filter(([, enabled]) => enabled)
    .map(([name]) => name)

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">SiteForge is running</CardTitle>
          <CardDescription>Phase 1A scaffold is working correctly.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Active Client</p>
            <p className="text-lg font-semibold">{config.displayName}</p>
            <p className="text-sm text-muted-foreground">{config.domain}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Enabled Features</p>
            <div className="mt-1 flex flex-wrap gap-2">
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

          <div>
            <p className="text-sm font-medium text-muted-foreground">Navigation</p>
            <ul className="mt-1 space-y-1">
              {config.navigation.map((item) => (
                <li key={item.href} className="text-sm">
                  <span className="text-foreground">{item.label}</span>
                  <span className="text-muted-foreground"> &mdash; {item.href}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-muted-foreground">
            Next step: Phase 1C &mdash; Layout Shell (Header, Footer, MobileMenu)
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
