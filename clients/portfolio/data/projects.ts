// ---------------------------------------------------------------------------
// Portfolio Projects — Structured project data.
// ---------------------------------------------------------------------------
// Decision #51: TypeScript > markdown for structured data.
// Each project is typed and imported directly by ProjectShowcase / ProjectDetail.
//
// Extended for the projects page revamp:
//   - impactHeadline / impactHeadlineEn — value-first headline (not the project name)
//   - typeBadge / typeBadgeEn — short category label
//   - descriptionEn — English description
//   - stats — compact feature/metric pills
//   - videoUrl — placeholder for future GIF/video embed
//   - liveUrl — public URL (empty = private project)
//   - problem / problemEn — case study: what pain does this solve
//   - solution / solutionEn — case study: what was built
//   - features / featuresEn — case study: key feature list
//   - galleryImages — screenshot paths (empty until assets are ready)
// ---------------------------------------------------------------------------

export interface ProjectStat {
  label: string
  labelEn: string
}

export interface Project {
  slug: string
  title: string
  description: string
  descriptionEn: string
  impactHeadline: string
  impactHeadlineEn: string
  typeBadge: string
  typeBadgeEn: string
  techStack: string[]
  image: string
  videoUrl: string
  href: string
  liveUrl: string
  featured: boolean
  stats: ProjectStat[]
  problem: string
  problemEn: string
  solution: string
  solutionEn: string
  features: string[]
  featuresEn: string[]
  galleryImages: string[]
}

export const projects: Project[] = [
  {
    slug: 'voltdoc',
    title: 'VoltDoc',
    description:
      'Aplicație internă pentru generarea automată a documentelor necesare firmelor de instalații electrice. Completează datele clientului o singură dată și generează toate documentele necesare instant.',
    descriptionEn:
      'Internal tool for auto-generating documents required by electrical installation companies. Enter client data once and generate all necessary documents instantly.',
    impactHeadline: 'Documente generate automat pentru firmele de instalații electrice',
    impactHeadlineEn: 'Auto-generated documents for electrical installation companies',
    typeBadge: 'Aplicație Internă',
    typeBadgeEn: 'Internal Tool',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'React'],
    image: '',
    videoUrl: '',
    href: '/projects/voltdoc',
    liveUrl: '',
    featured: true,
    stats: [
      { label: '7+ tipuri de documente', labelEn: '7+ document types' },
      { label: 'Completare automată date', labelEn: 'Auto-fill client data' },
      { label: 'Export instant', labelEn: 'Instant export' },
    ],
    problem:
      'Firmele de instalații electrice completează manual zeci de documente pentru fiecare client — contracte, notificări, procese verbale. Este un proces repetitiv, consumator de timp și predispus la erori. Fiecare document cere aceleași date introduse din nou.',
    problemEn:
      'Electrical installation companies manually fill out dozens of documents for each client — contracts, notifications, acceptance reports. It is a repetitive, time-consuming, and error-prone process. Each document requires the same data entered again.',
    solution:
      'VoltDoc centralizează datele clientului într-un singur formular. Odată completate, aplicația generează automat toate documentele necesare — de la notificări de încheiere contract până la procese verbale de recepție. Selectezi documentele dorite, apeși un buton, și sunt gata.',
    solutionEn:
      'VoltDoc centralizes client data into a single form. Once filled in, the app auto-generates all required documents — from contract completion notifications to acceptance reports. Select the documents you need, press a button, and they are ready.',
    features: [
      'Formular unic pentru datele clientului',
      'Generare automată documente multiple',
      'Presetări pentru tipuri de documente',
      'Selectare individuală sau în masă',
      'Istoric clienți pentru acces rapid',
      'Validare câmpuri cu limită de caractere',
    ],
    featuresEn: [
      'Single form for all client data',
      'Auto-generate multiple documents',
      'Presets for document types',
      'Individual or bulk selection',
      'Client history for quick access',
      'Field validation with character limits',
    ],
    galleryImages: [],
  },
  {
    slug: 'voltstock',
    title: 'VoltStock',
    description:
      'Sistem de gestiune a materialelor și echipamentelor pentru companii de instalații electrice. Urmărire stoc în timp real, rapoarte de consum și alertă la stoc minim.',
    descriptionEn:
      'Inventory management system for electrical installation companies. Real-time stock tracking, consumption reports, and low stock alerts.',
    impactHeadline: 'Gestiune materiale și echipamente pentru electricieni',
    impactHeadlineEn: 'Material and equipment management for electricians',
    typeBadge: 'Aplicație Web',
    typeBadgeEn: 'Web Application',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    image: '',
    videoUrl: '',
    href: '/projects/voltstock',
    liveUrl: 'https://voltstock.example.com',
    featured: true,
    stats: [
      { label: 'Urmărire stoc în timp real', labelEn: 'Real-time stock tracking' },
      { label: 'Rapoarte consum', labelEn: 'Consumption reports' },
      { label: 'Alertă stoc minim', labelEn: 'Low stock alerts' },
    ],
    problem:
      'Firmele de instalații electrice pierd timp și bani din cauza gestionării manuale a stocurilor de materiale. Nu știu exact ce au în depozit, cât s-a consumat pe fiecare șantier și când trebuie să reaprovizioneze.',
    problemEn:
      'Electrical installation companies lose time and money due to manual stock management. They don\'t know exactly what\'s in the warehouse, how much was used on each site, and when they need to reorder.',
    solution:
      'VoltStock oferă o interfață simplă pentru gestionarea materialelor — de la intrări și ieșiri din stoc până la rapoarte detaliate pe proiect. Sistem de alerte automate când un material scade sub pragul minim.',
    solutionEn:
      'VoltStock provides a simple interface for managing materials — from stock entries and exits to detailed per-project reports. Automatic alert system when a material drops below minimum threshold.',
    features: [
      'Dashboard cu starea curentă a stocului',
      'Intrări și ieșiri cu istoric complet',
      'Alocare materiale pe proiecte/șantiere',
      'Alerte automate la stoc minim',
      'Rapoarte de consum per perioadă',
      'Export date pentru contabilitate',
    ],
    featuresEn: [
      'Dashboard with current stock status',
      'Entries and exits with full history',
      'Material allocation per project/site',
      'Automatic low stock alerts',
      'Consumption reports per period',
      'Data export for accounting',
    ],
    galleryImages: [],
  },
  {
    slug: 'siteforge',
    title: 'SiteForge',
    description:
      'Platformă multi-client pentru site-uri profesionale, construită cu Next.js. O singură bază de cod alimentează mai multe site-uri independente — fiecare cu propriul design, conținut și domeniu.',
    descriptionEn:
      'Multi-client platform for professional websites, built with Next.js. A single codebase powers multiple independent sites — each with its own design, content, and domain.',
    impactHeadline: 'O singură bază de cod. Mai multe site-uri profesionale.',
    impactHeadlineEn: 'One codebase. Multiple professional websites.',
    typeBadge: 'Platformă Web',
    typeBadgeEn: 'Web Platform',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    image: '',
    videoUrl: '',
    href: '/projects/siteforge',
    liveUrl: 'https://sergiupop.dev',
    featured: true,
    stats: [
      { label: 'Arhitectură multi-client', labelEn: 'Multi-client architecture' },
      { label: 'Dark mode + i18n', labelEn: 'Dark mode + i18n' },
      { label: 'Blog CMS integrat', labelEn: 'Built-in blog CMS' },
    ],
    problem:
      'Crearea unui site de prezentare pentru fiecare client de la zero înseamnă cod duplicat, mentenanță multiplicată și timp pierdut. Fiecare proiect nou necesită aceeași infrastructură — rutare, blog, formular de contact, SEO, teme.',
    problemEn:
      'Building a presentation website for each client from scratch means duplicated code, multiplied maintenance, and wasted time. Every new project requires the same infrastructure — routing, blog, contact form, SEO, theming.',
    solution:
      'SiteForge este un mono-repo Next.js care alimentează mai multe site-uri dintr-o singură bază de cod. Fiecare client este un folder de configurare — propriul design, conținut, domeniu. Feature flags controlează ce funcționalități primește fiecare client.',
    solutionEn:
      'SiteForge is a Next.js mono-repo that powers multiple websites from a single codebase. Each client is a configuration folder — its own design, content, domain. Feature flags control what functionality each client gets.',
    features: [
      'Configurare per-client (temă, conținut, feature flags)',
      'Blog CMS cu editor WYSIWYG',
      'Suport i18n (RO/EN)',
      'Dark mode cu tratament premium',
      'Formular de contact cu Resend',
      'Animații accesibile (prefers-reduced-motion)',
      'Deploy automat pe Vercel',
    ],
    featuresEn: [
      'Per-client config (theme, content, feature flags)',
      'Blog CMS with WYSIWYG editor',
      'i18n support (RO/EN)',
      'Dark mode with premium treatment',
      'Contact form with Resend',
      'Accessible animations (prefers-reduced-motion)',
      'Auto-deploy on Vercel',
    ],
    galleryImages: [],
  },
]
