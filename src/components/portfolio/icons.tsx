// ---------------------------------------------------------------------------
// Tech Logo Icons — Inline SVGs for the portfolio tech marquee.
// ---------------------------------------------------------------------------
// Decision #50: Inline SVGs over icon library. Zero network requests,
// full color control, dark mode compatible.
//
// Each icon is a simple function component returning an SVG element.
// Sized via the parent container — SVGs use viewBox for scaling.
// Colors use currentColor where appropriate so dark mode works via
// text color inheritance, except brand-colored icons which keep their
// official brand colors.
// ---------------------------------------------------------------------------

interface IconProps {
  className?: string
}

export function ReactIcon({ className = '' }: IconProps) {
  return (
    <svg
      viewBox="-11.5 -10.232 23 20.463"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle r="2.05" fill="#61dafb" />
      <g stroke="#61dafb" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  )
}

export function NextjsIcon({ className = '' }: IconProps) {
  return (
    <svg
      viewBox="0 0 180 180"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <mask id="nextjs-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
        <circle cx="90" cy="90" r="90" fill="white" />
      </mask>
      <g mask="url(#nextjs-mask)">
        <circle cx="90" cy="90" r="90" fill="black" className="dark:fill-white" />
        <path
          d="M149.508 157.52L69.142 54H54v71.97h12.114V69.384l73.885 95.461A90.304 90.304 0 00149.508 157.52z"
          fill="url(#nextjs-grad-a)"
        />
        <path d="M115 54h12v72h-12z" fill="url(#nextjs-grad-b)" />
      </g>
      <defs>
        <linearGradient id="nextjs-grad-a" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="nextjs-grad-b" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function TypeScriptIcon({ className = '' }: IconProps) {
  return (
    <svg
      viewBox="0 0 128 128"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="128" height="128" rx="8" fill="#3178c6" />
      <path
        d="M82.672 97.436c2.104 3.652 5.427 6.406 11.268 6.406 4.736 0 7.776-2.368 7.776-5.632 0-3.904-3.12-5.296-8.352-7.568l-2.864-1.232c-8.288-3.52-13.792-7.936-13.792-17.264 0-8.592 6.544-15.136 16.768-15.136 7.28 0 12.512 2.528 16.288 9.152l-8.928 5.728c-1.968-3.52-4.08-4.912-7.36-4.912-3.344 0-5.472 2.128-5.472 4.912 0 3.44 2.128 4.832 7.04 6.96l2.864 1.232c9.76 4.192 15.264 8.464 15.264 18.064 0 10.352-8.128 16.016-19.04 16.016-10.672 0-17.568-5.088-20.944-11.76l9.472-5.968zM49.632 59.528h-12.96v-8.8h37.12v8.8h-12.96v44.048h-11.2V59.528z"
        fill="white"
      />
    </svg>
  )
}

export function TailwindIcon({ className = '' }: IconProps) {
  return (
    <svg
      viewBox="0 0 54 33"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"
        fill="#06b6d4"
      />
    </svg>
  )
}

export function NodejsIcon({ className = '' }: IconProps) {
  return (
    <svg
      viewBox="0 0 256 289"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M128 288.464c-3.975 0-7.685-1.06-11.13-2.915l-35.247-20.936c-5.3-2.915-2.65-3.975-1.06-4.505 7.155-2.385 8.48-2.915 15.9-7.155.795-.53 1.855-.265 2.65.265l27.032 16.166c1.06.53 2.385.53 3.18 0l105.74-61.217c1.06-.53 1.59-1.59 1.59-2.915V83.086c0-1.325-.53-2.385-1.59-2.915L129.325 19.172c-1.06-.53-2.385-.53-3.18 0L20.405 80.17c-1.06.53-1.59 1.855-1.59 2.915v122.17c0 1.06.53 2.385 1.59 2.915l28.887 16.695c15.635 7.95 25.44-1.325 25.44-10.6V93.42c0-1.59 1.325-3.18 3.18-3.18h13.25c1.59 0 3.18 1.325 3.18 3.18v120.58c0 20.936-11.395 33.126-31.27 33.126-6.095 0-10.865 0-24.38-6.625l-27.827-15.9C4.24 220.595 0 213.175 0 205.225V83.086c0-7.95 4.24-15.37 11.13-19.345L116.87 2.524c6.625-3.71 15.635-3.71 22.26 0L244.87 63.74c6.89 3.975 11.13 11.395 11.13 19.345v122.17c0 7.95-4.24 15.37-11.13 19.345L139.13 285.814c-3.445 1.855-7.42 2.65-11.13 2.65z"
        fill="#539e43"
      />
    </svg>
  )
}

export function SupabaseIcon({ className = '' }: IconProps) {
  return (
    <svg
      viewBox="0 0 109 113"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M63.708 110.284c-2.86 3.601-8.658 1.628-8.727-2.97l-1.007-67.251h45.22c8.19 0 12.758 9.46 7.665 15.874L63.708 110.284z"
        fill="url(#supabase-grad-a)"
      />
      <path
        d="M63.708 110.284c-2.86 3.601-8.658 1.628-8.727-2.97l-1.007-67.251h45.22c8.19 0 12.758 9.46 7.665 15.874L63.708 110.284z"
        fill="url(#supabase-grad-b)"
        fillOpacity="0.2"
      />
      <path
        d="M45.317 2.071c2.86-3.601 8.657-1.628 8.726 2.97l.442 67.251H9.83c-8.19 0-12.759-9.46-7.665-15.875L45.317 2.071z"
        fill="#3ecf8e"
      />
      <defs>
        <linearGradient id="supabase-grad-a" x1="53.974" y1="54.974" x2="94.163" y2="71.829" gradientUnits="userSpaceOnUse">
          <stop stopColor="#249361" />
          <stop offset="1" stopColor="#3ecf8e" />
        </linearGradient>
        <linearGradient id="supabase-grad-b" x1="36.156" y1="30.578" x2="54.484" y2="65.081" gradientUnits="userSpaceOnUse">
          <stop />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function PostgresIcon({ className = '' }: IconProps) {
  return (
    <svg
      viewBox="0 0 128 128"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M93.809 65.22c-.029-3.224.304-6.494-.102-9.666-1.156-9.027-8.089-12.862-13.53-6.373-2.396 2.855-3.483 6.507-4.212 10.15-.554 2.766-.785 5.59-.927 8.4l-.075 1.476c-1.505-.241-2.961-.746-4.168-1.687-2.67-2.082-3.27-5.402-3.027-8.6.325-4.293 1.814-8.308 3.473-12.205 1.428-3.355 3.134-6.532 5.333-9.402 2.87-3.747 6.467-6.458 11.213-7.14 4.073-.585 7.478.602 10.082 3.74 2.093 2.525 3.263 5.526 4.056 8.683 1.194 4.758 1.576 9.62 1.606 14.5.022 3.528-.358 7.035-1.039 10.498-.282 1.435-.684 2.844-1.182 4.217-.292.804-.74 1.543-1.366 2.14-1.404 1.337-3.048 1.065-3.905-.648-.596-1.19-.946-2.483-1.18-3.798-.666-3.743-.87-7.534-1.05-11.285z"
        fill="#336791"
      />
      <path
        d="M113.815 78.418c-1.682-7.6-5.271-14.02-12.043-18.202-1.026-.634-1.564-.375-1.894.702-.597 1.95-1.238 3.893-2.14 5.721-3.002 6.09-7.64 10.207-14.642 11.268-3.477.527-6.584-.392-9.154-2.88-1.2-1.16-2.089-2.56-2.774-4.076-.42-.927-.69-.934-1.348-.134-2.082 2.527-3.425 5.432-4.384 8.533-.966 3.124-1.397 6.332-1.48 9.592-.03 1.176.058 2.36.192 3.53.257 2.233 1.353 3.725 3.543 4.36 3.27.95 6.574 1.087 9.912 1.023 5.163-.099 10.238-.906 15.05-3.07 5.56-2.502 9.586-6.57 12.218-12.012 1.435-2.968 2.08-6.168 2.434-9.459.023-.209.057-.417.087-.626z"
        fill="#336791"
        opacity="0.5"
      />
    </svg>
  )
}

export function GitIcon({ className = '' }: IconProps) {
  return (
    <svg
      viewBox="0 0 128 128"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M124.737 58.378L69.621 3.264c-3.172-3.174-8.32-3.174-11.497 0L46.68 14.71l14.518 14.518c3.375-1.139 7.243-.375 9.932 2.314 2.703 2.706 3.461 6.607 2.294 9.993l13.992 13.993c3.385-1.167 7.292-.413 9.994 2.295 3.78 3.777 3.78 9.9 0 13.679-3.78 3.78-9.901 3.78-13.683 0-2.842-2.844-3.545-7.019-2.105-10.521L68.574 47.933l-.002 34.341c.922.455 1.791 1.063 2.559 1.828 3.778 3.777 3.778 9.898 0 13.683-3.779 3.777-9.904 3.777-13.679 0-3.778-3.784-3.778-9.905 0-13.683a9.637 9.637 0 013.818-2.581V47.333a9.635 9.635 0 01-3.818-2.581c-2.864-2.868-3.553-7.082-2.07-10.609L41.056 19.812 3.264 57.604c-3.176 3.177-3.176 8.327 0 11.5l55.117 55.114c3.174 3.174 8.32 3.174 11.499 0l54.858-54.858c3.174-3.176 3.174-8.327-.001-11.501z"
        fill="#f34f29"
      />
    </svg>
  )
}
