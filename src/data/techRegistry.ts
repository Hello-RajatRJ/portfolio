import projectsData from './projects.json';

export type TechMaterialStyle = 'metallic' | 'glass' | 'anodized';

export interface TechLayerDef {
  d: string;
  color: string;
  depth?: number;
  zOffset?: number;
  metalness?: number;
  roughness?: number;
  emissiveIntensity?: number;
}

export type TechSpecial3DType =
  | 'react-atom'
  | 'redux-zustand'
  | 'docker-whale'
  | 'java-cup'
  | 'threejs-pyramid'
  | 'ai-core'
  | 'git-tree'
  | 'socketio-bolt'
  | 'agile-orbit'
  | 'cicd-gears'
  | 'extruded-layers';

export interface TechMotionProfile {
  speedX: number;
  speedY: number;
  speedZ: number;
  phase: number;
  floatAmp: number;
  floatSpeed: number;
  depthAmp: number;
}

export interface TechMetadata {
  id: string;
  name: string;
  aliases: string[];
  category: string;
  brandColor: string;
  secondaryColor: string;
  materialStyle: TechMaterialStyle;
  special3D: TechSpecial3DType;
  layers: TechLayerDef[];
  description: string;
  practicalExperience: string;
  relatedProjectIds: string[];
  relatedTechnologies: string[];
  motion: TechMotionProfile;
}

/** Deterministic pseudo-random motion profile seeded by index so every icon floats asynchronously. */
function makeMotion(idx: number): TechMotionProfile {
  const s1 = Math.sin(idx * 12.9898 + 1.3) * 0.5 + 0.5;
  const s2 = Math.cos(idx * 78.233 + 2.7) * 0.5 + 0.5;
  const s3 = Math.sin(idx * 43.171 + 0.9) * 0.5 + 0.5;
  return {
    speedX: (s1 > 0.5 ? 1 : -1) * (0.14 + s1 * 0.14),
    speedY: (s2 > 0.5 ? 1 : -1) * (0.28 + s2 * 0.24),
    speedZ: (s3 > 0.5 ? 1 : -1) * (0.08 + s3 * 0.08),
    phase: idx * 1.17 + s1 * Math.PI,
    floatAmp: 0.045 + s2 * 0.028,
    floatSpeed: 1.25 + s3 * 0.65,
    depthAmp: 0.05 + s1 * 0.04,
  };
}

export const TECH_REGISTRY: TechMetadata[] = [
  {
    id: 'react',
    name: 'React.js',
    aliases: ['React', 'React Native'],
    category: 'Frontend & UI Architecture',
    brandColor: '#61DAFB',
    secondaryColor: '#0EA5E9',
    materialStyle: 'glass',
    special3D: 'react-atom',
    layers: [],
    description:
      'Component-driven UI library powered by declarative state, fiber reconciliation, and concurrent rendering for responsive web applications.',
    practicalExperience:
      'Primary frontend engine across 4+ years building enterprise portals (CereTax, WeSellRestaurants, EBMCI Taiwan), real-time dashboards, and custom 3D R3F worlds.',
    relatedProjectIds: ['ceretax', 'wesell-restaurants', 'knowledger', 'iallo', 'sarina-clinic'],
    relatedTechnologies: ['TypeScript', 'Next.js', 'Tailwind CSS', 'Redux / Zustand', 'Three.js'],
    motion: makeMotion(0),
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    aliases: ['Next'],
    category: 'Frontend & UI Architecture',
    brandColor: '#F8FAFC',
    secondaryColor: '#18181B',
    materialStyle: 'metallic',
    special3D: 'extruded-layers',
    layers: [
      // Beveled dark obsidian circular slug
      {
        d: 'M50 8 A42 42 0 0 1 92 50 A42 42 0 0 1 50 92 A42 42 0 0 1 8 50 A42 42 0 0 1 50 8 Z',
        color: '#111827',
        depth: 0.16,
        zOffset: -0.02,
        metalness: 0.85,
        roughness: 0.22,
      },
      // Raised white metallic Next.js "N" monogram
      {
        d: 'M33 68 V31 H40.5 L68.5 72 H61 L40.5 42 V68 Z M60.5 31 H68 V54.5 L60.5 44 Z',
        color: '#FFFFFF',
        depth: 0.08,
        zOffset: 0.08,
        metalness: 0.65,
        roughness: 0.18,
        emissiveIntensity: 0.14,
      },
    ],
    description:
      'Production React framework offering hybrid SSR/SSG, App Router streaming, API routes, and automatic code splitting.',
    practicalExperience:
      'Used for SEO-critical SaaS storefronts, fast initial-paint landing architectures, and server-assisted full-stack web apps.',
    relatedProjectIds: ['wesell-restaurants', 'sarina-clinic'],
    relatedTechnologies: ['React.js', 'TypeScript', 'Tailwind CSS', 'Node.js'],
    motion: makeMotion(1),
  },
  {
    id: 'vue-nuxt',
    name: 'Vue.js / Nuxt.js',
    aliases: ['Vue.js', 'Vue', 'Nuxt.js', 'Nuxt'],
    category: 'Frontend & UI Architecture',
    brandColor: '#41B883',
    secondaryColor: '#35495E',
    materialStyle: 'metallic',
    special3D: 'extruded-layers',
    layers: [
      // Rear Nuxt mint geometric peak halo
      {
        d: 'M50 18 L86 78 H68 L50 47 L32 78 H14 Z',
        color: '#00DC82',
        depth: 0.09,
        zOffset: -0.05,
        metalness: 0.55,
        roughness: 0.25,
      },
      // Vue outer emerald chevron V
      {
        d: 'M14 20 H38 L50 41 L62 20 H86 L50 82 Z',
        color: '#41B883',
        depth: 0.14,
        zOffset: 0.03,
        metalness: 0.5,
        roughness: 0.24,
      },
      // Protruding inner navy-slate chevron V
      {
        d: 'M35.5 20 H44 L50 31 L56 20 H64.5 L50 45 Z',
        color: '#35495E',
        depth: 0.1,
        zOffset: 0.09,
        metalness: 0.65,
        roughness: 0.28,
      },
    ],
    description:
      'Progressive reactive UI framework paired with Nuxt universal rendering, composable state primitives, and lightweight single-file components.',
    practicalExperience:
      'Built modular frontend dashboards and SEO-ready multi-page web portals leveraging Vue Composition API and Nuxt conventions.',
    relatedProjectIds: ['ebmci-taiwan'],
    relatedTechnologies: ['JavaScript', 'TypeScript', 'Tailwind CSS', 'Vite / Webpack'],
    motion: makeMotion(2),
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    aliases: ['JS', 'ES6', 'ESNext'],
    category: 'Frontend & UI Architecture',
    brandColor: '#F7DF1E',
    secondaryColor: '#111827',
    materialStyle: 'anodized',
    special3D: 'extruded-layers',
    layers: [
      // Extruded JS gold square block
      {
        d: 'M14 10 H86 A4 4 0 0 1 90 14 V86 A4 4 0 0 1 86 90 H14 A4 4 0 0 1 10 86 V14 A4 4 0 0 1 14 10 Z',
        color: '#F7DF1E',
        depth: 0.18,
        zOffset: -0.02,
        metalness: 0.35,
        roughness: 0.26,
      },
      // Raised dark obsidian "J" and "S" glyphs
      {
        d: 'M48 44 H55 V70 C55 78 50 83 42 83 C36 83 32 80 30 76 L36 71 C37.5 73.5 39.5 75.5 42 75.5 C45.5 75.5 48 73.5 48 69 Z M77 51 C74 49 71 48 67.5 48 C64.5 48 63 49.5 63 51.5 C63 53.5 64.5 54.5 69.5 56.5 C76 59 80 62 80 69.5 C80 78 73.5 83 64.5 83 C58 83 52 80 49 76 L55.5 71 C58 74 61 75.5 64.5 75.5 C68.5 75.5 71.5 73.5 71.5 70.5 C71.5 67.5 69 66 64 64 C57.5 61.5 54.5 58 54.5 51.5 C54.5 44.5 60 40.5 67.5 40.5 C72.5 40.5 77 42 80.5 45 Z',
        color: '#111827',
        depth: 0.08,
        zOffset: 0.1,
        metalness: 0.75,
        roughness: 0.25,
      },
    ],
    description:
      'Core web programming language driving asynchronous event loops, browser APIs, WebGL shaders, and full-stack TypeScript foundations.',
    practicalExperience:
      'Daily core language for complex UI engineering, custom animation timelines, audio synthesis, browser extensions, and Node runtimes.',
    relatedProjectIds: ['wesell-restaurants', 'iallo', 'teachercool', 'ceretax'],
    relatedTechnologies: ['TypeScript', 'React.js', 'Node.js', 'Three.js'],
    motion: makeMotion(3),
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    aliases: ['TS'],
    category: 'Frontend & UI Architecture',
    brandColor: '#3178C6',
    secondaryColor: '#FFFFFF',
    materialStyle: 'anodized',
    special3D: 'extruded-layers',
    layers: [
      // Cobalt TS rounded block
      {
        d: 'M14 10 H86 A4 4 0 0 1 90 14 V86 A4 4 0 0 1 86 90 H14 A4 4 0 0 1 10 86 V14 A4 4 0 0 1 14 10 Z',
        color: '#3178C6',
        depth: 0.18,
        zOffset: -0.02,
        metalness: 0.48,
        roughness: 0.22,
      },
      // Raised white metallic "T" and "S"
      {
        d: 'M29 44 H55 V51 H45.5 V82 H38.5 V51 H29 Z M80 51 C77 49 74 48 70.5 48 C67.5 48 66 49.5 66 51.5 C66 53.5 67.5 54.5 72.5 56.5 C79 59 83 62 83 69.5 C83 78 76.5 83 67.5 83 C61 83 55 80 52 76 L58.5 71 C61 74 64 75.5 67.5 75.5 C71.5 75.5 74.5 73.5 74.5 70.5 C74.5 67.5 72 66 67 64 C60.5 61.5 57.5 58 57.5 51.5 C57.5 44.5 63 40.5 70.5 40.5 C75.5 40.5 80 42 83.5 45 Z',
        color: '#F8FAFC',
        depth: 0.08,
        zOffset: 0.1,
        metalness: 0.65,
        roughness: 0.2,
      },
    ],
    description:
      'Statically typed JavaScript superset ensuring strict compile-time contracts, fearless refactoring, and scalable enterprise architectures.',
    practicalExperience:
      'Enforces strict end-to-end typing across CereTax calculation dashboards, 3D R3F scene modules, Zustand stores, and API integration layers.',
    relatedProjectIds: ['ceretax', 'wesell-restaurants', 'ebmci-taiwan', 'knowledger', 'sarina-clinic'],
    relatedTechnologies: ['React.js', 'JavaScript', 'Next.js', 'Node.js', 'NestJS'],
    motion: makeMotion(4),
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    aliases: ['Tailwind'],
    category: 'Frontend & UI Architecture',
    brandColor: '#38BDF8',
    secondaryColor: '#0284C7',
    materialStyle: 'glass',
    special3D: 'extruded-layers',
    layers: [
      // Upper twin-wave glyph centered in [12..88, 27..73]
      {
        d: 'M50 27.1 C39.9 27.1 33.6 32.1 31.1 42.2 C34.9 37.2 39.3 35.3 44.3 36.6 C47.2 37.3 49.3 39.4 51.6 41.7 C55.4 45.6 59.8 50.0 68.9 50.0 C79.0 50.0 85.3 45.0 87.8 34.9 C84.0 39.9 79.6 41.8 74.6 40.5 C71.7 39.8 69.6 37.7 67.3 35.4 C63.5 31.5 59.1 27.1 50 27.1 Z',
        color: '#38BDF8',
        depth: 0.14,
        zOffset: 0.04,
        metalness: 0.35,
        roughness: 0.16,
      },
      // Lower twin-wave glyph offset cleanly in Z
      {
        d: 'M31.1 50.0 C21.0 50.0 14.7 55.0 12.2 65.1 C16.0 60.1 20.4 58.2 25.4 59.5 C28.3 60.2 30.4 62.3 32.7 64.6 C36.5 68.5 40.9 72.9 50.0 72.9 C60.1 72.9 66.4 67.9 68.9 57.8 C65.1 62.8 60.7 64.7 55.7 63.4 C52.8 62.7 50.7 60.6 48.4 58.3 C44.6 54.4 40.2 50.0 31.1 50.0 Z',
        color: '#0EA5E9',
        depth: 0.14,
        zOffset: -0.03,
        metalness: 0.4,
        roughness: 0.18,
      },
    ],
    description:
      'Utility-first design system engine enabling rapid responsive styling, custom racing-red design tokens, and micro-interaction precision.',
    practicalExperience:
      'Standard styling layer across Sarina Clinic, portfolio landing sections, custom ATS resume templates, and HUD overlays.',
    relatedProjectIds: ['sarina-clinic', 'ceretax', 'iallo'],
    relatedTechnologies: ['React.js', 'Next.js', 'Bootstrap / MUI', 'TypeScript'],
    motion: makeMotion(5),
  },
  {
    id: 'bootstrap-mui',
    name: 'Bootstrap / MUI',
    aliases: ['Bootstrap', 'Material UI', 'MUI'],
    category: 'Frontend & UI Architecture',
    brandColor: '#7952B3',
    secondaryColor: '#007FFF',
    materialStyle: 'metallic',
    special3D: 'extruded-layers',
    layers: [
      // Bootstrap rounded shield behind
      {
        d: 'M14 14 H66 A8 8 0 0 1 74 22 V70 A8 8 0 0 1 66 78 H14 A8 8 0 0 1 6 70 V22 A8 8 0 0 1 14 14 Z',
        color: '#7952B3',
        depth: 0.15,
        zOffset: -0.04,
        metalness: 0.55,
        roughness: 0.25,
      },
      // Protruding crisp white "B" crest
      {
        d: 'M27 28 H43 C50 28 54 31.5 54 37.5 C54 41.5 51.5 44.5 48 45.5 C52.5 46.5 55.5 50 55.5 55 C55.5 62 50 66 42.5 66 H27 Z M35 34.5 V42.5 H41.5 C44.5 42.5 46.5 41 46.5 38.5 C46.5 36 44.5 34.5 41.5 34.5 Z M35 49 V59.5 H42.5 C46 59.5 48 57.8 48 54.2 C48 50.8 46 49 42.5 49 Z',
        color: '#FFFFFF',
        depth: 0.08,
        zOffset: 0.06,
        metalness: 0.45,
        roughness: 0.22,
      },
      // Material UI vibrant blue geometric M ribbon foreground
      {
        d: 'M46 54 V84 L55 89 V69 L70 78 L85 69 V89 L94 84 V54 L70 68 Z',
        color: '#007FFF',
        depth: 0.14,
        zOffset: 0.11,
        metalness: 0.45,
        roughness: 0.18,
      },
    ],
    description:
      'Battle-tested UI component ecosystems combining Bootstrap grid speed with Material UI accessible enterprise design patterns.',
    practicalExperience:
      'Delivered accessible healthcare portals, WCAG-compliant forms, and complex enterprise admin consoles using MUI and Bootstrap component systems.',
    relatedProjectIds: ['ebmci-taiwan', 'ceretax', 'teachercool'],
    relatedTechnologies: ['React.js', 'Tailwind CSS', 'TypeScript'],
    motion: makeMotion(6),
  },
  {
    id: 'redux-zustand',
    name: 'Redux / Zustand',
    aliases: ['Redux', 'Zustand'],
    category: 'Frontend & UI Architecture',
    brandColor: '#764ABC',
    secondaryColor: '#F59E0B',
    materialStyle: 'glass',
    special3D: 'redux-zustand',
    layers: [],
    description:
      'Predictable global state stores ranging from Redux Toolkit time-travel workflows to ultra-lightweight Zustand subscriptions for 90fps UIs.',
    practicalExperience:
      'Powers the entire real-time 3D game HUD, telemetry, multi-view routing, AI Factory state, and enterprise React data caches.',
    relatedProjectIds: ['ceretax', 'knowledger', 'iallo'],
    relatedTechnologies: ['React.js', 'TypeScript', 'Three.js', 'Next.js'],
    motion: makeMotion(7),
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    aliases: ['Node', 'Express.js', 'Express'],
    category: 'Backend, APIs & AI Systems',
    brandColor: '#5FA04E',
    secondaryColor: '#83CD29',
    materialStyle: 'metallic',
    special3D: 'extruded-layers',
    layers: [
      // Beveled Node green hexagonal slug
      {
        d: 'M50 8 L88 29 V71 L50 92 L12 71 V29 Z',
        color: '#43853D',
        depth: 0.2,
        zOffset: -0.02,
        metalness: 0.62,
        roughness: 0.24,
      },
      // Inner protruding dark carbon hexagon core
      {
        d: 'M50 17 L80 34 V66 L50 83 L20 66 V34 Z',
        color: '#1F2937',
        depth: 0.08,
        zOffset: 0.07,
        metalness: 0.78,
        roughness: 0.26,
      },
      // Raised bright lime "N" crest
      {
        d: 'M34 65 V35 H41.5 L61 60 V35 H68.5 V65 H61 L41.5 40 V65 Z',
        color: '#83CD29',
        depth: 0.09,
        zOffset: 0.13,
        metalness: 0.5,
        roughness: 0.2,
        emissiveIntensity: 0.16,
      },
    ],
    description:
      'Event-driven V8 JavaScript runtime powering REST APIs, Express middleware pipelines, real-time WebSocket servers, and backend orchestration.',
    practicalExperience:
      'Engineered backend APIs, payment hooks, broker search endpoints, and Express microservices for TeacherCool, WeSellRestaurants, and CereTax.',
    relatedProjectIds: ['wesell-restaurants', 'knowledger', 'teachercool', 'hye-connect', 'ceretax'],
    relatedTechnologies: ['Express.js', 'NestJS', 'TypeScript', 'PostgreSQL / SQL', 'MongoDB'],
    motion: makeMotion(8),
  },
  {
    id: 'nestjs',
    name: 'NestJS',
    aliases: ['Nest'],
    category: 'Backend, APIs & AI Systems',
    brandColor: '#E0234E',
    secondaryColor: '#F43F5E',
    materialStyle: 'metallic',
    special3D: 'extruded-layers',
    layers: [
      // Crimson hexagonal shield backdrop
      {
        d: 'M50 10 L86 30 V70 L50 90 L14 70 V30 Z',
        color: '#18181B',
        depth: 0.14,
        zOffset: -0.04,
        metalness: 0.85,
        roughness: 0.22,
      },
      // Iconic sweeping lion mane arcs
      {
        d: 'M24 62 C26 42 40 24 64 22 C76 21 82 28 79 38 C76 48 64 52 54 50 C48 48 44 42 46 36 C38 40 34 50 38 62 C42 74 58 80 74 74 C66 84 44 86 30 76 C25 72 23 67 24 62 Z',
        color: '#E0234E',
        depth: 0.15,
        zOffset: 0.06,
        metalness: 0.6,
        roughness: 0.2,
        emissiveIntensity: 0.18,
      },
      // Inner ruby crown sweep
      {
        d: 'M48 34 C54 30 66 32 68 40 C69 45 62 48 56 46 C51 44 46 39 48 34 Z',
        color: '#FF4D6D',
        depth: 0.1,
        zOffset: 0.13,
        metalness: 0.45,
        roughness: 0.18,
      },
    ],
    description:
      'Progressive TypeScript server framework featuring modular dependency injection, guards, decorators, and microservice adapters.',
    practicalExperience:
      'Used to architect maintainable typed REST endpoints, DTO validation layers, and enterprise service integrations.',
    relatedProjectIds: ['ceretax', 'knowledger'],
    relatedTechnologies: ['Node.js', 'TypeScript', 'PostgreSQL / SQL', 'Docker'],
    motion: makeMotion(9),
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL / SQL',
    aliases: ['PostgreSQL', 'Postgres', 'SQL'],
    category: 'Databases & Data Storage',
    brandColor: '#336791',
    secondaryColor: '#60A5FA',
    materialStyle: 'metallic',
    special3D: 'extruded-layers',
    layers: [
      // Dark cobalt medallion backing
      {
        d: 'M50 10 A40 40 0 0 1 90 50 A40 40 0 0 1 50 90 A40 40 0 0 1 10 50 A40 40 0 0 1 50 10 Z',
        color: '#1E293B',
        depth: 0.12,
        zOffset: -0.04,
        metalness: 0.8,
        roughness: 0.24,
      },
      // Iconic Elephant silhouette & curved trunk
      {
        d: 'M52 20 C67 20 80 30 80 46 C80 58 74 66 67 68 L64 82 C62 86 56 85 57 80 L59 68 C55 69 49 68 45 66 L41 80 C39 84 34 83 35 78 L38 64 C28 60 21 51 21 39 C21 26 35 20 52 20 Z',
        color: '#336791',
        depth: 0.16,
        zOffset: 0.05,
        metalness: 0.55,
        roughness: 0.24,
      },
      // Raised white tusk & ear highlight
      {
        d: 'M50 28 C61 28 68 35 67 45 C66 53 60 58 53 58 C46 58 41 53 41 44 C41 35 44 28 50 28 Z M35 45 C32 51 35 58 41 60 C37 56 36 51 35 45 Z',
        color: '#E2E8F0',
        depth: 0.09,
        zOffset: 0.12,
        metalness: 0.4,
        roughness: 0.2,
      },
    ],
    description:
      'Advanced open-source relational database delivering ACID transactions, geospatial/JSONB indexing, and complex analytical queries.',
    practicalExperience:
      'Backed sub-200ms geo-filtered property search (WeSellRestaurants), multi-jurisdiction tax engines (CereTax), and social feeds (HyeConnect).',
    relatedProjectIds: ['wesell-restaurants', 'hye-connect', 'ceretax'],
    relatedTechnologies: ['Node.js', 'NestJS', 'MySQL', 'Docker'],
    motion: makeMotion(10),
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    aliases: ['Mongo', 'NoSQL'],
    category: 'Databases & Data Storage',
    brandColor: '#47A248',
    secondaryColor: '#13AA52',
    materialStyle: 'glass',
    special3D: 'extruded-layers',
    layers: [
      // Dark obsidian leaf housing bezel
      {
        d: 'M50 8 C66 24 76 42 74 62 C72 76 62 84 50 88 C38 84 28 76 26 62 C24 42 34 24 50 8 Z',
        color: '#064E3B',
        depth: 0.14,
        zOffset: -0.03,
        metalness: 0.75,
        roughness: 0.22,
      },
      // Left vibrant emerald leaf half
      {
        d: 'M50 12 V85 C39 81 30 73 29 60 C27 42 36 26 50 12 Z',
        color: '#47A248',
        depth: 0.14,
        zOffset: 0.04,
        metalness: 0.38,
        roughness: 0.2,
      },
      // Right brighter green leaf half protruding slightly
      {
        d: 'M50 12 C64 26 73 42 71 60 C70 73 61 81 50 85 Z',
        color: '#69D15C',
        depth: 0.15,
        zOffset: 0.06,
        metalness: 0.32,
        roughness: 0.18,
      },
      // Raised silver central spine & stem
      {
        d: 'M48 26 H52 V93 H48 Z',
        color: '#D1FAE5',
        depth: 0.09,
        zOffset: 0.12,
        metalness: 0.7,
        roughness: 0.18,
      },
    ],
    description:
      'Document-oriented NoSQL database tailored for flexible JSON schemas, nested taxonomies, and high-throughput SaaS workloads.',
    practicalExperience:
      'Designed dynamic knowledge taxonomies for Knowledger and scalable course/student schemas for TeacherCool.',
    relatedProjectIds: ['knowledger', 'teachercool'],
    relatedTechnologies: ['Node.js', 'Express.js', 'PostgreSQL / SQL', 'AI Tools / Chatbots'],
    motion: makeMotion(11),
  },
  {
    id: 'mysql',
    name: 'MySQL',
    aliases: ['SQL'],
    category: 'Databases & Data Storage',
    brandColor: '#00758F',
    secondaryColor: '#F29111',
    materialStyle: 'metallic',
    special3D: 'extruded-layers',
    layers: [
      // Leaping dolphin silhouette in oceanic teal
      {
        d: 'M22 68 C28 42 46 22 68 20 C78 19 86 24 88 30 C82 32 76 36 74 42 C80 46 82 54 78 60 C70 55 62 50 56 46 C48 52 38 62 28 74 Z',
        color: '#00758F',
        depth: 0.16,
        zOffset: 0.03,
        metalness: 0.62,
        roughness: 0.22,
      },
      // Warm orange wave accent below
      {
        d: 'M18 76 C36 68 58 70 84 80 C62 84 36 84 18 76 Z',
        color: '#F29111',
        depth: 0.12,
        zOffset: 0.09,
        metalness: 0.5,
        roughness: 0.2,
      },
    ],
    description:
      'Widely deployed relational SQL engine focused on structured schema integrity, normalized joins, and reliable transactional workloads.',
    practicalExperience:
      'Used in full-stack relational database modeling, schema optimization, and enterprise API data persistence.',
    relatedProjectIds: ['teachercool', 'ceretax'],
    relatedTechnologies: ['PostgreSQL / SQL', 'Node.js', 'Java', 'Spring Boot'],
    motion: makeMotion(12),
  },
  {
    id: 'git-github',
    name: 'Git / GitHub',
    aliases: ['Git', 'GitHub'],
    category: 'Cloud, DevOps & Engineering Tools',
    brandColor: '#F05032',
    secondaryColor: '#F8FAFC',
    materialStyle: 'anodized',
    special3D: 'git-tree',
    layers: [
      // Rotated vermilion diamond base
      {
        d: 'M50 8 L92 50 L50 92 L8 50 Z',
        color: '#F05032',
        depth: 0.17,
        zOffset: -0.02,
        metalness: 0.48,
        roughness: 0.24,
      },
    ],
    description:
      'Distributed version control and collaborative pull-request workflows enabling clean branching, code reviews, and CI automation.',
    practicalExperience:
      'Core daily workflow across every production repository, team PR pipeline, and open-source showcase codebase.',
    relatedProjectIds: ['ceretax', 'wesell-restaurants', 'knowledger'],
    relatedTechnologies: ['CI/CD', 'Docker', 'AWS / Azure', 'Agile / Scrum'],
    motion: makeMotion(13),
  },
  {
    id: 'vite-webpack',
    name: 'Vite / Webpack',
    aliases: ['Vite', 'Webpack'],
    category: 'Cloud, DevOps & Engineering Tools',
    brandColor: '#646CFF',
    secondaryColor: '#FFD600',
    materialStyle: 'glass',
    special3D: 'extruded-layers',
    layers: [
      // Vibrant violet V shield
      {
        d: 'M14 20 L50 86 L86 20 L50 32 Z',
        color: '#646CFF',
        depth: 0.15,
        zOffset: -0.02,
        metalness: 0.45,
        roughness: 0.2,
      },
      // Protruding gold lightning bolt
      {
        d: 'M58 14 L38 50 H52 L44 82 L72 42 H56 Z',
        color: '#FFD600',
        depth: 0.12,
        zOffset: 0.09,
        metalness: 0.55,
        roughness: 0.16,
        emissiveIntensity: 0.18,
      },
    ],
    description:
      'Modern frontend module bundlers providing instant ES module HMR dev servers and tree-shaken multi-chunk production builds.',
    practicalExperience:
      'Powers this entire portfolio build pipeline with lazy-loaded 3D R3F chunks, PWA precaching, and micro-second hot reloads.',
    relatedProjectIds: ['ceretax', 'iallo', 'sarina-clinic'],
    relatedTechnologies: ['React.js', 'TypeScript', 'Tailwind CSS', 'Three.js'],
    motion: makeMotion(14),
  },
  {
    id: 'docker',
    name: 'Docker',
    aliases: ['Containers'],
    category: 'Cloud, DevOps & Engineering Tools',
    brandColor: '#2496ED',
    secondaryColor: '#0EA5E9',
    materialStyle: 'metallic',
    special3D: 'docker-whale',
    layers: [
      // Extruded Docker whale hull
      {
        d: 'M12 54 H72 C76 47 84 44 90 48 C88 55 83 59 77 61 C71 76 54 84 36 84 C19 84 10 73 12 54 Z',
        color: '#2496ED',
        depth: 0.18,
        zOffset: 0.0,
        metalness: 0.45,
        roughness: 0.22,
      },
    ],
    description:
      'Containerization platform packaging microservices, databases, and builds into deterministic portable runtime images.',
    practicalExperience:
      'Containerizes Node/Spring/PostgreSQL stacks for consistent local parity and zero-drift cloud deployments.',
    relatedProjectIds: ['ceretax', 'knowledger'],
    relatedTechnologies: ['AWS / Azure', 'CI/CD', 'Node.js', 'NestJS'],
    motion: makeMotion(15),
  },
  {
    id: 'aws-azure',
    name: 'AWS / Azure',
    aliases: ['AWS', 'Azure', 'AWS S3', 'Cloud'],
    category: 'Cloud, DevOps & Engineering Tools',
    brandColor: '#FF9900',
    secondaryColor: '#0078D4',
    materialStyle: 'metallic',
    special3D: 'extruded-layers',
    layers: [
      // Dark gunmetal cloud base
      {
        d: 'M24 58 A16 16 0 0 1 30 28 A22 22 0 0 1 70 30 A15 15 0 0 1 78 58 Z',
        color: '#1E293B',
        depth: 0.16,
        zOffset: -0.03,
        metalness: 0.78,
        roughness: 0.24,
      },
      // Azure cobalt wing shard
      {
        d: 'M56 20 L80 56 H62 L52 38 Z',
        color: '#0078D4',
        depth: 0.1,
        zOffset: 0.05,
        metalness: 0.55,
        roughness: 0.2,
      },
      // Signature AWS curved amber smile arrow
      {
        d: 'M20 66 C38 78 60 79 78 68 L74 62 L88 65 L82 78 L79 72 C59 85 36 84 17 70 Z',
        color: '#FF9900',
        depth: 0.13,
        zOffset: 0.1,
        metalness: 0.5,
        roughness: 0.18,
        emissiveIntensity: 0.15,
      },
    ],
    description:
      'Cloud infrastructure suite covering S3 object storage, compute scaling, serverless functions, and managed enterprise hosting.',
    practicalExperience:
      'Integrated AWS S3 storage for TeacherCool Courses and cloud hosting environments for WeSellRestaurants.',
    relatedProjectIds: ['wesell-restaurants', 'teachercool'],
    relatedTechnologies: ['Docker', 'CI/CD', 'Node.js', 'PostgreSQL / SQL'],
    motion: makeMotion(16),
  },
  {
    id: 'cicd',
    name: 'CI/CD',
    aliases: ['GitHub Actions', 'Pipelines'],
    category: 'Cloud, DevOps & Engineering Tools',
    brandColor: '#EF4444',
    secondaryColor: '#F59E0B',
    materialStyle: 'metallic',
    special3D: 'cicd-gears',
    layers: [],
    description:
      'Automated build, lint, test, and deployment pipelines verifying quality gates before shipping production artifacts.',
    practicalExperience:
      'Maintained automated frontend/backend release workflows with TypeScript checks, automated tests, and zero-downtime staging.',
    relatedProjectIds: ['ceretax', 'wesell-restaurants'],
    relatedTechnologies: ['Git / GitHub', 'Docker', 'AWS / Azure'],
    motion: makeMotion(17),
  },
  {
    id: 'jwt',
    name: 'JWT Auth',
    aliases: ['JWT', 'OAuth', 'Auth'],
    category: 'Backend, APIs & AI Systems',
    brandColor: '#D63AFF',
    secondaryColor: '#00F2E6',
    materialStyle: 'glass',
    special3D: 'extruded-layers',
    layers: [
      {
        d: 'M46 12 H54 V88 H46 Z',
        color: '#FFFFFF',
        depth: 0.12,
        zOffset: 0.0,
        metalness: 0.7,
        roughness: 0.18,
      },
      {
        d: 'M18 31 L82 69 L78 76 L14 38 Z',
        color: '#D63AFF',
        depth: 0.14,
        zOffset: 0.05,
        metalness: 0.45,
        roughness: 0.2,
      },
      {
        d: 'M78 24 L82 31 L18 69 L14 62 Z',
        color: '#00F2E6',
        depth: 0.14,
        zOffset: 0.09,
        metalness: 0.45,
        roughness: 0.2,
      },
      {
        d: 'M50 38 A12 12 0 0 1 62 50 A12 12 0 0 1 50 62 A12 12 0 0 1 38 50 A12 12 0 0 1 50 38 Z',
        color: '#FB015B',
        depth: 0.16,
        zOffset: 0.13,
        metalness: 0.55,
        roughness: 0.18,
      },
    ],
    description:
      'Stateless cryptographic token authentication powering role-based authorization, refresh rotation, and microservice security.',
    practicalExperience:
      'Implemented secure client portals, authenticated API gateways, and session persistence across user-facing apps.',
    relatedProjectIds: ['ebmci-taiwan', 'knowledger', 'teachercool'],
    relatedTechnologies: ['Node.js', 'NestJS', 'AWS / Azure'],
    motion: makeMotion(18),
  },
  {
    id: 'socketio',
    name: 'Socket.io',
    aliases: ['WebSockets', 'WebRTC'],
    category: 'Backend, APIs & AI Systems',
    brandColor: '#F8FAFC',
    secondaryColor: '#EF4444',
    materialStyle: 'metallic',
    special3D: 'socketio-bolt',
    layers: [],
    description:
      'Bidirectional low-latency WebSocket event engine delivering real-time feeds, presence indicators, and live notifications.',
    practicalExperience:
      'Built live community activity updates in HyeConnect, real-time call transcription notifications in iAllo, and collaborative workspaces.',
    relatedProjectIds: ['hye-connect', 'iallo', 'knowledger'],
    relatedTechnologies: ['Node.js', 'React.js', 'Redux / Zustand'],
    motion: makeMotion(19),
  },
  {
    id: 'agile',
    name: 'Agile / Scrum',
    aliases: ['Agile', 'Scrum'],
    category: 'Cloud, DevOps & Engineering Tools',
    brandColor: '#EF4444',
    secondaryColor: '#F97316',
    materialStyle: 'metallic',
    special3D: 'agile-orbit',
    layers: [],
    description:
      'Iterative engineering delivery cadence driven by sprint planning, rapid prototyping, cross-functional reviews, and continuous improvement.',
    practicalExperience:
      'Collaborated across distributed engineering teams at Seasia Infotech shipping iterative milestones on predictable schedules.',
    relatedProjectIds: ['ceretax', 'wesell-restaurants', 'hye-connect'],
    relatedTechnologies: ['Git / GitHub', 'CI/CD'],
    motion: makeMotion(20),
  },
  {
    id: 'ai-tools',
    name: 'AI Tools / Chatbots',
    aliases: ['OpenAI API', 'RAG', 'LLMs'],
    category: 'Backend, APIs & AI Systems',
    brandColor: '#DC2626',
    secondaryColor: '#F97316',
    materialStyle: 'glass',
    special3D: 'ai-core',
    layers: [],
    description:
      'LLM integrations, semantic RAG retrieval pipelines, vector similarity search, and interactive conversational assistant workflows.',
    practicalExperience:
      'Architected AI-powered call workflows (iAllo), knowledge asset discovery (Knowledger), CV optimizer tools, and this portfolio AI Career Chatbot.',
    relatedProjectIds: ['iallo', 'knowledger', 'ceretax'],
    relatedTechnologies: ['React.js', 'TypeScript', 'Node.js', 'Python'],
    motion: makeMotion(21),
  },
  {
    id: 'java',
    name: 'Java',
    aliases: ['JVM'],
    category: 'Core & Emerging Stack',
    brandColor: '#ED8B00',
    secondaryColor: '#5382A1',
    materialStyle: 'metallic',
    special3D: 'java-cup',
    layers: [],
    description:
      'Strongly typed object-oriented backend ecosystem prized for predictable JVM concurrency and enterprise service architectures.',
    practicalExperience:
      'Explored backend API integration modules alongside Spring Boot during enterprise microservice collaboration on CereTax.',
    relatedProjectIds: ['ceretax'],
    relatedTechnologies: ['Spring Boot', 'PostgreSQL / SQL', 'Docker'],
    motion: makeMotion(22),
  },
  {
    id: 'golang',
    name: 'Golang (Go)',
    aliases: ['Go', 'Golang'],
    category: 'Core & Emerging Stack',
    brandColor: '#00ADD8',
    secondaryColor: '#38BDF8',
    materialStyle: 'anodized',
    special3D: 'extruded-layers',
    layers: [
      // Beveled aerodynamic Go badge
      {
        d: 'M24 28 H78 A18 22 0 0 1 78 72 H24 A18 22 0 0 1 24 28 Z',
        color: '#00ADD8',
        depth: 0.17,
        zOffset: 0.0,
        metalness: 0.45,
        roughness: 0.22,
      },
      // Raised white "GO" emblem with crisp ring hole + speed strokes
      {
        d: 'M12 41 H23 V44.5 H12 Z M9 48.5 H21 V52 H9 Z M14 56 H24 V59.5 H14 Z M37 39 C30 39 25 43.8 25 50 C25 56.2 30 61 37 61 C43.5 61 47.5 56.8 47.5 50.5 H37.5 V54.5 H42 C41.2 56.6 39.3 57.5 37 57.5 C32.6 57.5 29.8 54.6 29.8 50 C29.8 45.4 32.6 42.5 37 42.5 C39.8 42.5 41.8 43.8 43 45.8 L47 43.5 C44.8 40.5 41.4 39 37 39 Z M64 39 A11.5 11 0 0 1 75.5 50 A11.5 11 0 0 1 64 61 A11.5 11 0 0 1 52.5 50 A11.5 11 0 0 1 64 39 Z M64 43.5 A6.8 6.5 0 0 0 57.2 50 A6.8 6.5 0 0 0 64 56.5 A6.8 6.5 0 0 0 70.8 50 A6.8 6.5 0 0 0 64 43.5 Z',
        color: '#FFFFFF',
        depth: 0.08,
        zOffset: 0.1,
        metalness: 0.4,
        roughness: 0.18,
      },
    ],
    description:
      'Compiled cloud-native systems language designed for lightweight goroutines, fast HTTP services, and minimal container footprints.',
    practicalExperience:
      'Foundational knowledge exploring high-concurrency calculation microservices and tooling.',
    relatedProjectIds: ['ceretax'],
    relatedTechnologies: ['Docker', 'PostgreSQL / SQL', 'Java'],
    motion: makeMotion(23),
  },
  {
    id: 'spring-boot',
    name: 'Spring Boot',
    aliases: ['Spring'],
    category: 'Core & Emerging Stack',
    brandColor: '#6DB33F',
    secondaryColor: '#4ADE80',
    materialStyle: 'metallic',
    special3D: 'extruded-layers',
    layers: [
      // Green hexagonal badge
      {
        d: 'M50 10 L86 30 V70 L50 90 L14 70 V30 Z',
        color: '#6DB33F',
        depth: 0.16,
        zOffset: -0.02,
        metalness: 0.48,
        roughness: 0.22,
      },
      // Protruding white Spring leaf
      {
        d: 'M54 28 C67 30 74 42 70 57 C66 68 55 74 42 72 C36 71 32 67 30 62 C38 62 48 56 54 44 C46 50 38 52 31 50 C34 38 43 26 54 28 Z',
        color: '#FFFFFF',
        depth: 0.1,
        zOffset: 0.09,
        metalness: 0.35,
        roughness: 0.18,
      },
    ],
    description:
      'Opinionated Java application framework accelerating REST microservices, JPA persistence, and production actuator observability.',
    practicalExperience:
      'Studied and integrated alongside Java microservice layers for tax workflow interoperability.',
    relatedProjectIds: ['ceretax'],
    relatedTechnologies: ['Java', 'PostgreSQL / SQL', 'MySQL', 'Docker'],
    motion: makeMotion(24),
  },
  {
    id: 'threejs',
    name: 'Three.js',
    aliases: ['R3F', 'WebGL', 'React Three Fiber'],
    category: 'Core & Emerging Stack',
    brandColor: '#F8FAFC',
    secondaryColor: '#DC2626',
    materialStyle: 'glass',
    special3D: 'threejs-pyramid',
    layers: [],
    description:
      'WebGL / GLSL 3D graphics engine powering interactive scenes, custom shaders, physics worlds, and hardware-accelerated portfolio experiences.',
    practicalExperience:
      'Built this interactive 3D driving portfolio world, AI Intelligence Factory, sculpted hero bust shader, and these 3D floating skill artifacts.',
    relatedProjectIds: ['iallo', 'ceretax'],
    relatedTechnologies: ['React.js', 'TypeScript', 'Redux / Zustand'],
    motion: makeMotion(25),
  },
  {
    id: 'python',
    name: 'Python',
    aliases: ['FastAPI', 'Scripting'],
    category: 'Core & Emerging Stack',
    brandColor: '#3776AB',
    secondaryColor: '#FFD43B',
    materialStyle: 'anodized',
    special3D: 'extruded-layers',
    layers: [
      // Upper blue python serpent
      {
        d: 'M49 12 C34 12 32 19 32 27 V34 H50 V37 H25 C17 37 13 43 13 50 C13 57 17 63 25 63 H31 V53 C31 45 37 39 45 39 H61 C67 39 71 34 71 28 V19 C71 14 64 12 49 12 Z',
        color: '#3776AB',
        depth: 0.16,
        zOffset: 0.03,
        metalness: 0.42,
        roughness: 0.22,
      },
      // Lower gold python serpent stepped cleanly forward
      {
        d: 'M51 88 C66 88 68 81 68 73 V66 H50 V63 H75 C83 63 87 57 87 50 C87 43 83 37 75 37 H69 V47 C69 55 63 61 55 61 H39 C33 61 29 66 29 72 V81 C29 86 36 88 51 88 Z',
        color: '#FFD43B',
        depth: 0.16,
        zOffset: 0.06,
        metalness: 0.42,
        roughness: 0.22,
      },
      // White metallic eye nodes
      {
        d: 'M40 17 A3.5 3.5 0 0 1 43.5 20.5 A3.5 3.5 0 0 1 40 24 A3.5 3.5 0 0 1 36.5 20.5 A3.5 3.5 0 0 1 40 17 Z M60 76 A3.5 3.5 0 0 1 63.5 79.5 A3.5 3.5 0 0 1 60 83 A3.5 3.5 0 0 1 56.5 79.5 A3.5 3.5 0 0 1 60 76 Z',
        color: '#FFFFFF',
        depth: 0.06,
        zOffset: 0.12,
        metalness: 0.6,
        roughness: 0.18,
      },
    ],
    description:
      'Versatile high-level language leading AI/ML prototyping, backend automation scripts, data parsing, and FastAPI services.',
    practicalExperience:
      'Beginner-level experience with scripting utilities and foundational backend / AI tooling concepts.',
    relatedProjectIds: ['iallo', 'knowledger'],
    relatedTechnologies: ['AI Tools / Chatbots', 'PostgreSQL / SQL', 'Docker'],
    motion: makeMotion(26),
  },
];

// Standalone entries reachable via related technologies or direct lookup
export const EXTRA_TECH_METADATA: TechMetadata[] = [
  {
    id: 'express',
    name: 'Express.js',
    aliases: ['Express', 'ExpressJS'],
    category: 'Backend, APIs & AI Systems',
    brandColor: '#E5E7EB',
    secondaryColor: '#DC2626',
    materialStyle: 'metallic',
    special3D: 'extruded-layers',
    layers: [
      {
        d: 'M12 18 H88 A6 6 0 0 1 94 24 V76 A6 6 0 0 1 88 82 H12 A6 6 0 0 1 6 76 V24 A6 6 0 0 1 12 18 Z',
        color: '#18181B',
        depth: 0.16,
        zOffset: -0.02,
        metalness: 0.85,
        roughness: 0.22,
      },
      // Clean brushed chrome "ex" emblem
      {
        d: 'M20 52 C20 39 29 31 39 31 C49 31 55 39 55 49 V53 H28 C29 59 33.5 63 40 63 C44.5 63 48 61.5 51 59 L54.5 64 C50.5 67.5 45 69.5 39 69.5 C27.5 69.5 20 61.8 20 52 Z M28.5 47 H47 C46.5 41.5 43.2 37.5 38.5 37.5 C33.2 37.5 29.5 41.5 28.5 47 Z M57 32 H65.5 L72.5 44 L79.5 32 H88 L77 50 L89 69 H80 L72.5 56 L65 69 H56.5 L68 50 Z',
        color: '#F8FAFC',
        depth: 0.09,
        zOffset: 0.09,
        metalness: 0.72,
        roughness: 0.18,
        emissiveIntensity: 0.15,
      },
    ],
    description:
      'Minimalist, unopinionated Node.js web framework powering fast REST API routing, middleware chains, and authentication gateways.',
    practicalExperience:
      'Used alongside Node.js to build high-throughput API gateways, JWT middleware, and microservice connectors across full-stack applications.',
    relatedProjectIds: ['wesell-restaurants', 'knowledger', 'teachercool'],
    relatedTechnologies: ['Node.js', 'TypeScript', 'MongoDB', 'PostgreSQL / SQL'],
    motion: makeMotion(27),
  },
];

export const ALL_TECH_METADATA: TechMetadata[] = [...TECH_REGISTRY, ...EXTRA_TECH_METADATA];

export const EXTRA_TECH_ALIAS_MAP: Record<string, string> = {
  bootstrap: 'bootstrap-mui',
  'material ui': 'bootstrap-mui',
  mui: 'bootstrap-mui',
  redux: 'redux-zustand',
  zustand: 'redux-zustand',
};

export function findTechMeta(name: string): TechMetadata {
  const lower = name.trim().toLowerCase();
  const exact = ALL_TECH_METADATA.find(
    (t) => t.name.toLowerCase() === lower || t.aliases.some((a) => a.toLowerCase() === lower)
  );
  if (exact) return exact;

  const aliasId = EXTRA_TECH_ALIAS_MAP[lower];
  if (aliasId) {
    const aliased = ALL_TECH_METADATA.find((t) => t.id === aliasId);
    if (aliased) return aliased;
  }

  const partial = ALL_TECH_METADATA.find(
    (t) =>
      t.name.toLowerCase().includes(lower) ||
      lower.includes(t.id) ||
      t.aliases.some((a) => lower.includes(a.toLowerCase()))
  );
  return partial ?? TECH_REGISTRY[0];
}

export function getRelatedProjects(tech: TechMetadata) {
  return projectsData.filter((p) => tech.relatedProjectIds.includes(p.id));
}
