// ---------------------------------------------------------------------------
// BrowserMockup — Browser chrome frame around project screenshots.
// ---------------------------------------------------------------------------
// Wraps children in a macOS-style browser window frame with three dots
// and a URL bar. Used in ProjectShowcase, ProjectsPage, and ProjectDetail
// to make image placeholders look professional even without real screenshots.
//
// Server component — no interactivity needed.
// ---------------------------------------------------------------------------

interface BrowserMockupProps {
  /** URL shown in the address bar. Empty string hides the bar text. */
  url?: string
  children: React.ReactNode
  className?: string
}

export function BrowserMockup({ url = '', children, className = '' }: BrowserMockupProps) {
  return (
    <div className={`overflow-hidden rounded-xl border border-border bg-card dark:border-border/50 ${className}`}>
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-border/50 bg-muted/50 px-3 py-2 dark:bg-muted/30">
        {/* Traffic lights */}
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400/60" />
        </div>

        {/* URL bar */}
        {url && (
          <div className="ml-2 flex-1 truncate rounded-md bg-background/50 px-2.5 py-0.5 text-[10px] text-muted-foreground/50 dark:bg-background/30">
            {url}
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="relative">
        {children}
      </div>
    </div>
  )
}
