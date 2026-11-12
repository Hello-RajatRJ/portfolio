import { getRelatedProjects, type TechMetadata } from './techRegistry';

export interface EnrichedTechDetail {
  howIUseIt: string;
  practicalApplications: string[];
  implementationExamples: string[];
  connectionChain: string[];
}

const ENRICHMENT_MAP: Record<string, EnrichedTechDetail> = {
  react: {
    howIUseIt:
      'Used as my primary UI architecture across enterprise analytics portals, multi-step tax & clinical forms, real-time dashboards, and React Three Fiber 3D experiences.',
    practicalApplications: [
      'Reusable component systems',
      'Custom React Hooks',
      'State synchronization',
      'REST API & real-time integration',
      'Complex form validation',
      'Code splitting & render optimization',
    ],
    implementationExamples: [
      'Multi-jurisdiction analytics and rule configuration UI on CereTax',
      'Bilingual client regulatory documentation portal for EBMCI Taiwan',
      'Geo-filtered restaurant search and broker portal workflows for WeSellRestaurants',
    ],
    connectionChain: ['React.js', 'Next.js', 'JavaScript', 'Redux / Zustand', 'Node.js'],
  },
  nextjs: {
    howIUseIt:
      'Used to architect fast initial-paint web storefronts, hybrid SSR/SSG portals, and clean structured routing backed by Node.js services.',
    practicalApplications: [
      'Server-side & static rendering',
      'Route-level code splitting',
      'SEO metadata & performance tuning',
      'API route composition',
    ],
    implementationExamples: [
      'SEO-oriented healthcare & marketplace landing views',
      'Production modular page routing paired with TypeScript & Tailwind CSS',
    ],
    connectionChain: ['Next.js', 'React.js', 'TypeScript', 'Tailwind CSS', 'Node.js'],
  },
  'vue-nuxt': {
    howIUseIt:
      'Used for component-driven frontend interfaces and server-rendered Nuxt applications requiring reactive bindings and lightweight SFC modules.',
    practicalApplications: [
      'Composition API state modules',
      'Universal SSR / SEO views',
      'Reusable form & filter views',
    ],
    implementationExamples: [
      'Structured web interface modules and responsive portal screens',
    ],
    connectionChain: ['Vue.js / Nuxt.js', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Vite / Webpack'],
  },
  javascript: {
    howIUseIt:
      'Core daily language powering interactive browser interfaces, asynchronous API workflows, client state machines, and Node.js services.',
    practicalApplications: [
      'Asynchronous data fetching & caching',
      'DOM & browser extension scripting',
      'Event-driven WebSocket updates',
      'Modular UI logic & utilities',
    ],
    implementationExamples: [
      'Chrome call-handling browser extension & IVR dashboard for iAllo',
      'Real-time notification & feed updates across web platforms',
    ],
    connectionChain: ['JavaScript', 'TypeScript', 'React.js', 'Node.js', 'Vite / Webpack'],
  },
  typescript: {
    howIUseIt:
      'Enforces compile-time contracts across React frontends, state stores, REST API payloads, and 3D scene components.',
    practicalApplications: [
      'Strict typed domain models & DTOs',
      'Type-safe Zustand stores',
      'API request/response typing',
      'Maintainable large-scale refactoring',
    ],
    implementationExamples: [
      'Strongly typed tax configuration workflows on CereTax',
      'Full TypeScript architecture across this interactive 3D portfolio',
    ],
    connectionChain: ['TypeScript', 'React.js', 'Next.js', 'NestJS', 'Three.js'],
  },
  tailwind: {
    howIUseIt:
      'Utility-first CSS workflow for rapid responsive design, custom dark/racing-red UI tokens, and accessible component styling.',
    practicalApplications: [
      'Responsive grid & mobile breakpoints',
      'Custom dark-mode glass UI systems',
      'Consistent typography & spacing scales',
    ],
    implementationExamples: [
      'Patient-centric responsive interfaces for Sarina Clinic',
      'Portfolio HUD overlays and ATS resume templates',
    ],
    connectionChain: ['Tailwind CSS', 'React.js', 'Next.js', 'Bootstrap / MUI', 'TypeScript'],
  },
  'bootstrap-mui': {
    howIUseIt:
      'Combines Bootstrap utility grids with Material UI accessible components for dense enterprise dashboards and patient forms.',
    practicalApplications: [
      'Enterprise data tables & dialogs',
      'WCAG-friendly form accessibility',
      'Responsive administrative layouts',
    ],
    implementationExamples: [
      'Accessible multi-step registration flows & compliance documentation portals',
    ],
    connectionChain: ['Bootstrap / MUI', 'React.js', 'Tailwind CSS', 'TypeScript', 'JavaScript'],
  },
  'redux-zustand': {
    howIUseIt:
      'Manages predictable shared client state—using Redux Toolkit for large structured SaaS modules and Zustand for low-overhead real-time UI updates.',
    practicalApplications: [
      'Centralized app & view state',
      'Selector-based zero-re-render reads',
      'Real-time HUD & telemetry sync',
    ],
    implementationExamples: [
      'Portfolio 3D driving telemetry, view switching & AI Factory state in Zustand',
      'Enterprise dashboard state synchronization across React portals',
    ],
    connectionChain: ['Redux / Zustand', 'React.js', 'TypeScript', 'Socket.io', 'Three.js'],
  },
  nodejs: {
    howIUseIt:
      'Powers RESTful backend APIs, Express route handlers, third-party payment/booking integrations, and server-side business logic.',
    practicalApplications: [
      'REST API & Express routing',
      'Database query integration',
      'Webhook & payment integration',
      'Real-time event emitting',
    ],
    implementationExamples: [
      'Broker operations backend & search APIs for WeSellRestaurants',
      'Razorpay payment & course progression endpoints on TeacherCool',
    ],
    connectionChain: ['Node.js', 'Express.js', 'TypeScript', 'PostgreSQL / SQL', 'MongoDB'],
  },
  express: {
    howIUseIt:
      'Clean lightweight HTTP routing, middleware validation, JWT verification, and modular REST endpoints inside Node.js backends.',
    practicalApplications: [
      'Composable route & auth middleware',
      'Request validation & error guards',
      'CORS & API gateway integration',
    ],
    implementationExamples: [
      'Backend service layers supporting marketplace, EdTech & CRM APIs',
    ],
    connectionChain: ['Express.js', 'Node.js', 'JWT Auth', 'MongoDB', 'PostgreSQL / SQL'],
  },
  nestjs: {
    howIUseIt:
      'Structured TypeScript server modules with dependency injection, typed DTO pipes, and maintainable service layers.',
    practicalApplications: [
      'Modular controllers & providers',
      'DTO schema validation',
      'Structured microservice boundaries',
    ],
    implementationExamples: [
      'Typed API integration modules built on enterprise backend stacks',
    ],
    connectionChain: ['NestJS', 'TypeScript', 'Node.js', 'PostgreSQL / SQL', 'Docker'],
  },
  postgresql: {
    howIUseIt:
      'Designs relational schemas, indexed multi-dimension filters, and transactional queries for high-volume applications.',
    practicalApplications: [
      'Relational schema & foreign keys',
      'Composite query indexing',
      'Multi-dimension search filtering',
    ],
    implementationExamples: [
      'Sub-200ms geo-based listing search across WeSellRestaurants',
      'Relational persistence layer on CereTax and HyeConnect',
    ],
    connectionChain: ['PostgreSQL / SQL', 'Node.js', 'NestJS', 'MySQL', 'Docker'],
  },
  mongodb: {
    howIUseIt:
      'Models flexible nested document collections, cross-entity queries, and scalable SaaS course/knowledge records.',
    practicalApplications: [
      'Document schema flexibility',
      'Aggregation & lookup queries',
      'SaaS content & workspace storage',
    ],
    implementationExamples: [
      'Flexible taxonomy modeling on Knowledger',
      'Course & learner catalog persistence on TeacherCool Courses',
    ],
    connectionChain: ['MongoDB', 'Node.js', 'Express.js', 'AI Tools / Chatbots', 'AWS / Azure'],
  },
  mysql: {
    howIUseIt:
      'Structured SQL table modeling, relational joins, and transactional persistence across backend web applications.',
    practicalApplications: [
      'Normalized SQL schemas',
      'Indexed join queries',
      'CRUD backend data layers',
    ],
    implementationExamples: [
      'Structured relational database modules across full-stack applications',
    ],
    connectionChain: ['MySQL', 'PostgreSQL / SQL', 'Node.js', 'Java', 'Spring Boot'],
  },
  'git-github': {
    howIUseIt:
      'Maintains branching conventions, clean commit history, pull-request reviews, and automated repository checks across team projects.',
    practicalApplications: [
      'Feature branching & conflict resolution',
      'Pull request code reviews',
      'Release tagging & repo maintenance',
    ],
    implementationExamples: [
      'Daily team version control workflow at Seasia Infotech & personal GitHub repo',
    ],
    connectionChain: ['Git / GitHub', 'CI/CD', 'Docker', 'Agile / Scrum', 'Vite / Webpack'],
  },
  'vite-webpack': {
    howIUseIt:
      'Configures fast ES module dev tooling, lazy chunk splitting, PWA precaching, and optimized production asset bundles.',
    practicalApplications: [
      'Code splitting & dynamic imports',
      'Production bundle size optimization',
      'Instant HMR development loop',
    ],
    implementationExamples: [
      'Code-split Three.js / AI Factory / R3F bundle orchestration in this portfolio',
    ],
    connectionChain: ['Vite / Webpack', 'React.js', 'TypeScript', 'Tailwind CSS', 'Three.js'],
  },
  docker: {
    howIUseIt:
      'Packages frontend builds, Node services, and databases into repeatable containers for local testing and deployment.',
    practicalApplications: [
      'Multi-stage container builds',
      'Local compose stack orchestration',
      'Consistent runtime environments',
    ],
    implementationExamples: [
      'Containerized service environments paired with Node.js and PostgreSQL',
    ],
    connectionChain: ['Docker', 'AWS / Azure', 'CI/CD', 'Node.js', 'PostgreSQL / SQL'],
  },
  'aws-azure': {
    howIUseIt:
      'Integrates cloud object storage, static media delivery, and scalable web hosting into full-stack production apps.',
    practicalApplications: [
      'S3 media & document storage',
      'Cloud deployment & static CDN',
      'Managed backend hosting',
    ],
    implementationExamples: [
      'Course video & asset delivery via AWS S3 on TeacherCool Courses',
      'Cloud production hosting infrastructure for marketplace platforms',
    ],
    connectionChain: ['AWS / Azure', 'Docker', 'CI/CD', 'Node.js', 'PostgreSQL / SQL'],
  },
  cicd: {
    howIUseIt:
      'Automates type checking, linting, production builds, and continuous deployment verification on every commit.',
    practicalApplications: [
      'Automated lint & TypeScript gates',
      'Continuous preview & production builds',
      'Agile engineering release workflows',
    ],
    implementationExamples: [
      'Automated build & deployment checks across Seasia Infotech agile teams',
    ],
    connectionChain: ['CI/CD', 'Git / GitHub', 'Docker', 'AWS / Azure', 'Agile / Scrum'],
  },
  jwt: {
    howIUseIt:
      'Implements stateless token authentication, protected client routes, and secure session validation across APIs.',
    practicalApplications: [
      'Bearer token API guards',
      'Protected portal session flows',
      'Role-based access handling',
    ],
    implementationExamples: [
      'Secure client submission & learner portals across web platforms',
    ],
    connectionChain: ['JWT Auth', 'Node.js', 'Express.js', 'React.js', 'AWS / Azure'],
  },
  socketio: {
    howIUseIt:
      'Streams instant bi-directional updates for community notifications, live call status events, and collaborative workspace activity.',
    practicalApplications: [
      'Low-latency live notifications',
      'Real-time feed updates',
      'Event room subscriptions',
    ],
    implementationExamples: [
      'Real-time social notifications & updates for HyeConnect',
      'Live transcription & workspace events alongside WebRTC workflows on iAllo',
    ],
    connectionChain: ['Socket.io', 'Node.js', 'React.js', 'Redux / Zustand', 'JavaScript'],
  },
  agile: {
    howIUseIt:
      'Delivers production features iteratively in sprint cycles with engineering code reviews, standups, and QA coordination.',
    practicalApplications: [
      'Sprint execution & estimation',
      'Cross-functional QA alignment',
      'Iterative incremental shipping',
    ],
    implementationExamples: [
      'Enterprise agile engineering cadence at Seasia Infotech (May 2022 – June 2026)',
    ],
    connectionChain: ['Agile / Scrum', 'Git / GitHub', 'CI/CD', 'React.js'],
  },
  'ai-tools': {
    howIUseIt:
      'Integrates LLM workflows, prompt pipelines, AI-assisted content scoring, and interactive chatbots inside React apps.',
    practicalApplications: [
      'LLM API integration & parsing',
      'AI summarization & knowledge search',
      'Interactive assistant UI & scoring',
    ],
    implementationExamples: [
      'AI call summary & IVR automation workflows in iAllo & knowledge discovery in Knowledger',
      'ATS resume analyzer & AI career chatbot inside this portfolio',
    ],
    connectionChain: ['AI Tools / Chatbots', 'React.js', 'TypeScript', 'Node.js', 'Python'],
  },
  java: {
    howIUseIt:
      'Foundational beginner proficiency reading and contributing to enterprise backend integration endpoints alongside Spring Boot.',
    practicalApplications: [
      'Basic backend service integration',
      'OOP & typed service models',
      'Interoperability with React clients',
    ],
    implementationExamples: [
      'Beginner-level backend & REST API exposure on CereTax microservice integrations',
    ],
    connectionChain: ['Java', 'Spring Boot', 'PostgreSQL / SQL', 'React.js', 'Docker'],
  },
  golang: {
    howIUseIt:
      'Foundational beginner experience exploring Go services alongside cloud-native backend integration workflows.',
    practicalApplications: [
      'Foundational service endpoints',
      'Typed Go backend structures',
    ],
    implementationExamples: [
      'Beginner-level backend integration familiarity on CereTax',
    ],
    connectionChain: ['Golang (Go)', 'Docker', 'PostgreSQL / SQL', 'Java'],
  },
  'spring-boot': {
    howIUseIt:
      'Foundational beginner proficiency integrating REST API modules backed by relational SQL databases.',
    practicalApplications: [
      'REST endpoint integration',
      'Service-to-frontend JSON contracts',
    ],
    implementationExamples: [
      'Beginner-level backend REST API collaboration alongside React on CereTax',
    ],
    connectionChain: ['Spring Boot', 'Java', 'PostgreSQL / SQL', 'MySQL', 'Docker'],
  },
  threejs: {
    howIUseIt:
      'Beginner-to-intermediate creative 3D WebGL engineering via Three.js & React Three Fiber for interactive scenes and custom GLSL shaders.',
    practicalApplications: [
      'Extruded 3D SVG & mesh geometry',
      'Custom vertex/fragment shaders',
      'Third-person 3D portfolio simulation',
    ],
    implementationExamples: [
      'Velocity 3D driving portfolio world, AI Factory visualization, and these 3D skill artifacts',
    ],
    connectionChain: ['Three.js', 'React.js', 'TypeScript', 'Redux / Zustand', 'Vite / Webpack'],
  },
  python: {
    howIUseIt:
      'Foundational beginner scripting for lightweight automation utilities and AI tooling workflows.',
    practicalApplications: [
      'Automation scripts & tooling',
      'AI prototyping fundamentals',
    ],
    implementationExamples: [
      'Supporting utility scripts and foundational API experimentation',
    ],
    connectionChain: ['Python', 'AI Tools / Chatbots', 'PostgreSQL / SQL', 'Docker'],
  },
};

export function getEnrichedTechDetail(tech: TechMetadata): EnrichedTechDetail {
  const found = ENRICHMENT_MAP[tech.id];
  if (found) return found;

  const projects = getRelatedProjects(tech);
  return {
    howIUseIt: tech.practicalExperience,
    practicalApplications: [
      'Component & module architecture',
      'Production integration',
      'Performance & reliability tuning',
    ],
    implementationExamples: projects.map((p) => `${p.name} — ${p.tagline}`),
    connectionChain: [tech.name, ...tech.relatedTechnologies.slice(0, 4)],
  };
}

