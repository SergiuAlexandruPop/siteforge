// ---------------------------------------------------------------------------
// Portfolio Resume — Structured resume data.
// ---------------------------------------------------------------------------
// Same pattern as projects.ts — typed data imported by ResumePage.
// Single source of truth for both the web component and PDF generation.
//
// Career timeline: Pharmacy → Self-taught → Angular → React/Vue → Frontend
// Current role: Montran, Front-end Developer (Jan 2025 – Present)
// ---------------------------------------------------------------------------

export interface ExperienceEntry {
  title: string
  titleEn: string
  company: string
  companyNote?: string
  companyNoteEn?: string
  location: string
  startDate: string
  endDate: string | null // null = Present
  description: string
  descriptionEn: string
  highlights: string[]
  highlightsEn: string[]
  tools: string[]
}

export interface SkillGroup {
  category: string
  categoryEn: string
  skills: { name: string; icon?: string }[]
}

export interface EducationEntry {
  institution: string
  degree: string
  degreeEn: string
  field?: string
  fieldEn?: string
  startYear?: number
  endYear: number
  description?: string
  descriptionEn?: string
}

export interface LanguageEntry {
  name: string
  nameEn: string
  level: string
  levelEn: string
}

export interface ResumeData {
  name: string
  title: string
  titleEn: string
  location: string
  email: string
  phone: string
  linkedin: string
  github: string
  objective: string
  objectiveEn: string
  experience: ExperienceEntry[]
  skills: SkillGroup[]
  education: EducationEntry[]
  languages: LanguageEntry[]
  publicSpeaking: string
  publicSpeakingEn: string
}

export const resumeData: ResumeData = {
  name: 'Pop Sergiu-Alexandru',
  title: 'Front-end Developer',
  titleEn: 'Front-end Developer',
  location: 'Cluj-Napoca, România',
  email: 'sergiualexandrupop@gmail.com',
  phone: '+40 (747) 016 558',
  linkedin: 'https://www.linkedin.com/in/sergiualexandrupop/',
  github: 'https://github.com/SergiuAlexandruPop',
  objective:
    'Software Developer cu peste 5 ani de experiență în dezvoltare web cu JavaScript, specializat în React / Next.js și Vue.js. Construiesc interfețe scalabile, curate și performante.',
  objectiveEn:
    'Software Developer with 5+ years in web development with JavaScript, specializing in React / Next.js and Vue.js. I build scalable, clean, and performant interfaces.',

  experience: [
    {
      title: 'Front-end Developer',
      titleEn: 'Front-end Developer',
      company: 'Montran',
      location: 'Cluj-Napoca',
      startDate: 'Ian 2025',
      endDate: null,
      description:
        'Dezvoltare front-end pentru aplicații fintech, contribuind la produsele de plăți și procesare tranzacții ale companiei.',
      descriptionEn:
        'Front-end development for fintech applications, contributing to the company\'s payment and transaction processing products.',
      highlights: [
        'Dezvoltare și mentenanță interfețe pentru produse fintech',
        'Colaborare cu echipe cross-funcționale pentru livrarea de funcționalități noi',
      ],
      highlightsEn: [
        'Developing and maintaining interfaces for fintech products',
        'Collaborating with cross-functional teams to deliver new features',
      ],
      tools: ['React', 'TypeScript', 'REST'],
    },
    {
      title: 'Mid React Developer',
      titleEn: 'Mid React Developer',
      company: 'GlobalLogic',
      companyNote: 'pentru Corsearch',
      companyNoteEn: 'for Corsearch',
      location: 'Cluj-Napoca',
      startDate: 'Iun 2024',
      endDate: 'Ian 2025',
      description:
        'Dezvoltare și mentenanță a unui codebase front-end scalabil în React 18 pentru o aplicație de mărci comerciale cu 15 ani vechime, folosită de profesioniști din domeniul juridic.',
      descriptionEn:
        'Developing and maintaining a scalable front-end codebase in React 18 for a 15-year-old trademark application serving legal professionals.',
      highlights: [
        'Colaborare cu o echipă multiculturală de 20+ developeri mid și senior pentru rescrierea și consolidarea a 6 aplicații legacy într-o platformă unificată',
        'Dedicare de 30% din timp pentru refactorizare și optimizare cod conform ghidurilor de produs',
        'Conducerea integrării front-end a unui produs legacy, de la cerințe la implementare',
        'Funcționalități complexe de căutare juridică pentru profesioniștii în mărci comerciale',
      ],
      highlightsEn: [
        'Collaborating with a multicultural team of 20+ mid and senior developers to rewrite 6 legacy apps into a unified platform',
        'Dedicating 30% of time to refactoring and optimizing code per product guidelines',
        'Leading the front-end integration of one legacy product, from requirements to implementation',
        'Building complex legal search functionality for trademark professionals',
      ],
      tools: ['React 18', 'JavaScript', 'REST', 'SASS', 'Jest', 'React Testing Library', 'Vite'],
    },
    {
      title: 'Mid Vue Developer',
      titleEn: 'Mid Vue Developer',
      company: 'Evozon',
      location: 'Cluj-Napoca',
      startDate: 'Ian 2024',
      endDate: 'Iun 2024',
      description:
        'Colaborare cu 8 developeri front-end mid și senior pentru livrarea unei interfețe noi pentru o companie germană din domeniul auditului cu aproape 100 de clienți, inclusiv UniCredit, Deloitte și Schwarz Group.',
      descriptionEn:
        'Collaborated with 8 mid and senior front-end developers to deliver a new interface for a German audit company with nearly 100 clients, including UniCredit, Deloitte, and Schwarz Group.',
      highlights: [
        'Validare token-uri de autentificare expirate',
        'Reordonare elemente în grid-uri complexe cu recursivitate',
        'Pagină avansată de filtrare pentru toate elementele din aplicație',
        'Elemente UI nested grid pentru afișarea datelor',
      ],
      highlightsEn: [
        'Validation for expired authentication tokens',
        'Reordering items in complex grids with recursion',
        'Advanced filtering page for all application items',
        'UI nested grid elements for data display',
      ],
      tools: ['Vue 3', 'JavaScript', 'Pinia', 'Vuetify', 'GraphQL', 'REST', 'SCSS'],
    },
    {
      title: 'Mid ReactJS/NextJS Developer',
      titleEn: 'Mid ReactJS/NextJS Developer',
      company: 'Evozon',
      location: 'Cluj-Napoca',
      startDate: 'Iun 2023',
      endDate: 'Ian 2024',
      description:
        'Refactorizare completă a unei aplicații de management business care nu era scalabilă și dezvoltarea de funcționalități noi pentru MVP, într-o echipă de 2 developeri front-end.',
      descriptionEn:
        'Complete refactoring of a non-scalable business management app and development of new MVP features, in a team of 2 front-end developers.',
      highlights: [
        'Creare componente reutilizabile UI: tabele, dialoguri, butoane',
        'Custom hooks pentru fetch de date și gestionare erori REST',
        'Construirea MVP-ului rapid folosind componentele custom',
      ],
      highlightsEn: [
        'Created reusable UI components: tables, dialogs, buttons',
        'Custom hooks for data fetching and REST error handling',
        'Built the MVP rapidly using the custom component library',
      ],
      tools: ['React', 'Redux', 'Material-UI', 'TypeScript', 'styled-components'],
    },
    {
      title: 'Mid React Developer',
      titleEn: 'Mid React Developer',
      company: 'Evozon',
      location: 'Cluj-Napoca',
      startDate: 'Feb 2021',
      endDate: 'Iun 2023',
      description:
        'Dezvoltator front-end pentru o aplicație inginerească în domeniul construcției de poduri — gestionarea întregului ciclu de dezvoltare al podurilor.',
      descriptionEn:
        'Front-end developer for an engineering application in bridge construction — managing the entire bridge development lifecycle.',
      highlights: [
        'Aplicație completă: prețuri, etape dezvoltare, reprezentări grafice și tabulare, import/export fișiere, geolocalizare',
        'Integrare API-uri terțe pentru date senzori în timp real de la poduri și Google Maps',
        'Responsabilitate completă front-end timp de 1 an: estimări, task-uri, organizare echipă',
        'Mentorat și ghidare pentru 2 developeri juniori prin pair programming și prezentări tehnice',
        'Îmbunătățire performanță prin actualizarea tuturor librăriilor și creare custom hooks',
      ],
      highlightsEn: [
        'Full application: pricing, development stages, graphical/tabular representations, file import/export, geolocation',
        'Integrated third-party APIs for real-time bridge sensor data and Google Maps',
        'Full front-end responsibility for 1 year: estimation, tasks, team organization',
        'Mentored 2 junior developers through pair programming and technical presentations',
        'Improved performance by updating all libraries and creating custom hooks',
      ],
      tools: ['React', 'Next.js', 'Material-UI', 'CSS', 'Jira', 'GitLab'],
    },
    {
      title: 'Junior Angular Developer',
      titleEn: 'Junior Angular Developer',
      company: 'P4B',
      location: 'Cluj-Napoca',
      startDate: 'Oct 2019',
      endDate: 'Feb 2021',
      description:
        'Două proiecte în industria medicală germană, focalizate pe prescripții digitale și asigurări medicale.',
      descriptionEn:
        'Two projects within the German health industry, focused on digital prescriptions and medical insurance.',
      highlights: [
        'Dezvoltare aplicații pentru eficientizarea prescrierii medicamentelor și dispozitivelor medicale',
        'Automatizarea procesului de acoperire a asigurărilor pentru facturi medicale',
      ],
      highlightsEn: [
        'Developed apps to enhance efficiency of prescribing medication and medical devices',
        'Automated the insurance coverage process for medical bills',
      ],
      tools: ['Angular 9+', 'TypeScript', 'HTML', 'CSS', 'Bootstrap'],
    },
  ],

  skills: [
    {
      category: 'Frontend',
      categoryEn: 'Frontend',
      skills: [
        { name: 'React', icon: 'react' },
        { name: 'Next.js', icon: 'nextjs' },
        { name: 'Vue.js' },
        { name: 'Angular' },
        { name: 'TypeScript', icon: 'typescript' },
        { name: 'JavaScript' },
        { name: 'Redux' },
        { name: 'Pinia' },
      ],
    },
    {
      category: 'Stilizare',
      categoryEn: 'Styling',
      skills: [
        { name: 'Tailwind CSS', icon: 'tailwind' },
        { name: 'Material-UI' },
        { name: 'styled-components' },
        { name: 'SASS/SCSS' },
        { name: 'Bootstrap' },
        { name: 'CSS' },
      ],
    },
    {
      category: 'Backend & API-uri',
      categoryEn: 'Backend & APIs',
      skills: [
        { name: 'REST' },
        { name: 'GraphQL' },
        { name: 'Node.js', icon: 'nodejs' },
        { name: 'Supabase', icon: 'supabase' },
      ],
    },
    {
      category: 'Unelte & Infra',
      categoryEn: 'Tools & Infra',
      skills: [
        { name: 'Git', icon: 'git' },
        { name: 'Jira' },
        { name: 'Vite' },
        { name: 'Jest' },
        { name: 'React Testing Library' },
        { name: 'Figma' },
        { name: 'Vercel' },
        { name: 'Azure' },
      ],
    },
  ],

  education: [
    {
      institution: 'Universitatea de Medicină și Farmacie Cluj-Napoca',
      degree: 'Licență în Farmacie',
      degreeEn: 'Bachelor of Pharmacy',
      endYear: 2019,
      description: 'Tranziție de carieră spre dezvoltare web după absolvire.',
      descriptionEn: 'Career transition to web development after graduation.',
    },
    {
      institution: 'Liceul de Informatică',
      degree: 'Bacalaureat',
      degreeEn: 'Baccalaureate',
      field: 'Informatică',
      fieldEn: 'Computer Science',
      endYear: 2014,
    },
  ],

  languages: [
    {
      name: 'Română',
      nameEn: 'Romanian',
      level: 'Nativ',
      levelEn: 'Native',
    },
    {
      name: 'Engleză',
      nameEn: 'English',
      level: 'Avansat (vorbire și scriere)',
      levelEn: 'Highly proficient (speaking and writing)',
    },
  ],

  publicSpeaking:
    'Prezentări despre sănătate pentru comunități de programatori precum JSHeroes și Evozon — combinând 5 ani de facultate de medicină cu pasiunea pentru tech.',
  publicSpeakingEn:
    'Health talks for programming communities like JSHeroes and Evozon — combining 5 years of medical school with a passion for tech.',
}
