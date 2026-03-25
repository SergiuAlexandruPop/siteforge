interface AboutSnippetProps {
  title?: string
  text: string
  /** Image URL — displayed alongside the text */
  image?: string
  imageAlt?: string
  /** Flip image to the right side (default: image on left) */
  reversed?: boolean
  cta?: { label: string; href: string }
  className?: string
}

export function AboutSnippet({
  title,
  text,
  image,
  imageAlt = '',
  reversed = false,
  cta,
  className = '',
}: AboutSnippetProps) {
  return (
    <section className={`py-16 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div
          className={`flex flex-col gap-8 sm:gap-12 ${
            image ? 'lg:flex-row lg:items-center' : ''
          } ${reversed ? 'lg:flex-row-reverse' : ''}`}
        >
          {/* Image */}
          {image && (
            <div className="flex-shrink-0 lg:w-2/5">
              <img
                src={image}
                alt={imageAlt}
                className="w-full rounded-lg object-cover"
              />
            </div>
          )}

          {/* Text */}
          <div className={image ? 'lg:w-3/5' : 'max-w-3xl'}>
            {title && (
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {title}
              </h2>
            )}
            <p
              className={`text-base leading-relaxed text-muted-foreground ${
                title ? 'mt-4' : ''
              }`}
            >
              {text}
            </p>
            {cta && (
              <div className="mt-6">
                <a
                  href={cta.href}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                >
                  {cta.label}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
