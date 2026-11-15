import projectsData from './projects.json';
import type { Project } from '../types';

export interface StackEntry {
  name: string;
  layer: string;
}

export interface ArchitectureNode {
  stage: string;
  label: string;
  techFocus: string;
  summary: string;
}

export interface IdleMotionProfile {
  floatY: number;
  floatDuration: number;
  floatDelay: number;
  tiltAmp: number;
}

export interface KeyDecision {
  title: string;
  decision: string;
  tradeOff: string;
}

export interface ProjectCaseStudy {
  overview: string;
  contributionRole: string;
  challengeSolved: string;
  problem: string;
  owned: string;
  proofMetric: string;
  stack: StackEntry[];
  features: string[];
  architecture: ArchitectureNode[];
  keyDecisions: KeyDecision[];
}

export interface ProjectUniverseItem extends Project {
  orderIndex: number;
  indexLabel: string;
  backdropImage: string;
  isFlagship: boolean;
  flagshipLabel?: string;
  idleMotion: IdleMotionProfile;
  caseStudy: ProjectCaseStudy;
}

const CATEGORY_IMAGE_MAP: Record<string, string> = {
  'wesell-restaurants': '/images/categories/real-estate.jpg',
  'ebmci-taiwan': '/images/categories/nature.jpg',
  knowledger: '/images/categories/ai-product.jpg',
  teachercool: '/images/categories/saas.jpg',
  'hye-connect': '/images/categories/premium-product.jpg',
  iallo: '/images/categories/real-estate.jpg',
  ceretax: '/images/categories/saas.jpg',
  'sarina-clinic': '/images/categories/premium-product.jpg',
};

const FLAGSHIP_LABELS: Record<string, string> = {
  ceretax: 'ENTERPRISE FINTECH ARCHITECTURE',
  knowledger: 'GENERATIVE AI PIPELINE',
};

function inferTechLayer(tech: string): string {
  const normalized = tech.toLowerCase();
  if (
    normalized.includes('react') ||
    normalized.includes('next') ||
    normalized.includes('vue') ||
    normalized.includes('nuxt') ||
    normalized.includes('html') ||
    normalized.includes('css') ||
    normalized.includes('tailwind') ||
    normalized.includes('bootstrap') ||
    normalized.includes('razor') ||
    normalized.includes('redux')
  ) {
    return 'Frontend Interface';
  }
  if (
    normalized.includes('node') ||
    normalized.includes('express') ||
    normalized.includes('.net') ||
    normalized.includes('wordpress') ||
    normalized.includes('api') ||
    normalized.includes('jwt') ||
    normalized.includes('oauth')
  ) {
    return 'Application & API';
  }
  if (
    normalized.includes('sql') ||
    normalized.includes('mongo') ||
    normalized.includes('mysql') ||
    normalized.includes('postgres') ||
    normalized.includes('typeorm')
  ) {
    return 'Data & Persistence';
  }
  if (
    normalized.includes('openai') ||
    normalized.includes('ai') ||
    normalized.includes('d3') ||
    normalized.includes('recharts') ||
    normalized.includes('chart') ||
    normalized.includes('webaudio') ||
    normalized.includes('webrtc') ||
    normalized.includes('socket')
  ) {
    return 'Intelligence & Realtime';
  }
  if (normalized.includes('aws') || normalized.includes('stripe')) {
    return 'Cloud & Integrations';
  }
  return 'Core Engineering';
}

function buildArchitecture(project: Project): ArchitectureNode[] {
  const frontendTech = project.tech[0] || 'Web UI';
  const logicTech = project.tech[1] || 'Application API';
  const engineTech = project.tech[2] || project.tech[0] || 'Core Services';
  const storageTech = project.tech[3] || project.tech[project.tech.length - 1] || 'Cloud Storage';

  return [
    {
      stage: '01',
      label: 'Client Presentation',
      techFocus: frontendTech,
      summary: `Responsive ${project.category.toLowerCase()} interface crafted for fast navigation and clear state feedback.`,
    },
    {
      stage: '02',
      label: 'Service Orchestration',
      techFocus: logicTech,
      summary: `Structured workflows powering ${project.tagline.toLowerCase()} with validation and access control.`,
    },
    {
      stage: '03',
      label: 'Domain Engine',
      techFocus: engineTech,
      summary: project.features[0]
        ? `Primary capability handling ${project.features[0].toLowerCase()}.`
        : 'Specialized processing modules aligned to platform business rules.',
    },
    {
      stage: '04',
      label: 'Data & Delivery',
      techFocus: storageTech,
      summary: `Persistent storage, security boundaries, and reliable delivery for ${project.name}.`,
    },
  ];
}

const KEY_DECISIONS_MAP: Record<string, KeyDecision[]> = {
  ceretax: [
    {
      title: 'Client-Side Normalized Tax Rule Cache vs Round-Trip HTTP per Field',
      decision: 'Implemented normalized in-memory jurisdiction rate tables with indexed lookup instead of firing validation requests on every user field stroke.',
      tradeOff: 'Increases initial portal load by ~35KB, but cut interactive tax rule configuration latency from 280ms to <12ms, eliminating table stutter for high-volume accounting teams.',
    },
    {
      title: 'Web Worker Isolation for Multi-Jurisdiction Rate Calculations',
      decision: 'Offloaded heavy calculation matrices spanning 10,000+ local tax rules into background Web Workers using typed transferables.',
      tradeOff: 'Requires message serialization, but guarantees the UI main thread stays locked at 60 FPS without dropping input events during bulk 500-line invoice tests.',
    },
    {
      title: 'Decoupled ERP Ingestion Gateway with Normalized Schema Validation',
      decision: 'Engineered an intermediate JSON transformation layer between ERP webhooks (NetSuite / SAP) and the core PostgreSQL calculation pipeline.',
      tradeOff: 'Adds one serialization step in ingestion, but insulated core services from breaking third-party ERP schema shifts and cut enterprise onboarding time by 70%.',
    },
  ],
  'ebmci-taiwan': [
    {
      title: 'Dynamic CJK Font Subsetting vs Monolithic Asian Fonts',
      decision: 'Loaded baseline UI strings with pre-subsetted Traditional Chinese glyphs and lazy-loaded technical regulatory terminology on route activation.',
      tradeOff: 'Requires a specialized build pipeline, but slashed initial font and asset weight from 8.2MB to 410KB, dramatically improving initial paint in APAC mobile networks.',
    },
    {
      title: 'Client-Side Cryptographic SHA-256 Document Verification',
      decision: 'Computed document hashes in browser before upload to cross-verify against regulatory submission receipts.',
      tradeOff: 'Uses client CPU cycles during upload, but eliminated document tampering and guaranteed zero corrupted regulatory filing submissions.',
    },
  ],
  knowledger: [
    {
      title: 'Hybrid Vector Search + Exact BM25 Full-Text Match',
      decision: 'Blended pgvector cosine similarity rankings with PostgreSQL GIN indexed full-text search using reciprocal rank fusion.',
      tradeOff: 'Dual query overhead, but improved discovery recall by 38% for exact acronyms and patent codes where semantic embeddings often hallucinated.',
    },
    {
      title: 'Optimistic State Reconciliation for Real-Time Taxonomy Edits',
      decision: 'Updated interactive knowledge nodes immediately in client state before awaiting WebSocket server confirmation, rolling back on error.',
      tradeOff: 'Requires local rollback snapshots, but transformed graph reorganization into an instant, fluid interaction with zero perceived lag.',
    },
  ],
  'sarina-clinic': [
    {
      title: 'HotDoc API Webhook Web-Queue vs Direct Polling',
      decision: 'Bridged HotDoc appointment schedules through a resilient webhook queue with optimistic slot reservations.',
      tradeOff: 'Requires server-side session lockouts, but prevented duplicate double-bookings during peak morning clinic triage surges.',
    },
  ],
};

const rawProjects = projectsData as Project[];

export const projectUniverseItems: ProjectUniverseItem[] = rawProjects.map((project, idx) => {
  const orderIndex = idx + 1;
  const phaseOffset = (idx * 0.68) % 3.1;

  return {
    ...project,
    orderIndex,
    indexLabel: String(orderIndex).padStart(2, '0'),
    backdropImage: CATEGORY_IMAGE_MAP[project.id] ?? '/images/categories/saas.jpg',
    isFlagship: Boolean(FLAGSHIP_LABELS[project.id]),
    flagshipLabel: FLAGSHIP_LABELS[project.id],
    idleMotion: {
      floatY: 5 + (idx % 3) * 1.6,
      floatDuration: 4.8 + (idx % 4) * 0.75,
      floatDelay: Number(phaseOffset.toFixed(2)),
      tiltAmp: 1.2 + (idx % 3) * 0.45,
    },
    caseStudy: {
      overview: project.description,
      contributionRole: project.role,
      challengeSolved: project.challenges,
      problem: project.problem || project.challenges,
      owned: project.owned || project.role,
      proofMetric: project.metrics?.headline || 'Engineered for high performance and scalability.',
      stack: project.tech.map((t) => ({
        name: t,
        layer: inferTechLayer(t),
      })),
      features: project.features,
      architecture: buildArchitecture(project),
      keyDecisions: KEY_DECISIONS_MAP[project.id] || [
        {
          title: 'Modular Component Architecture & State Boundary Isolation',
          decision: 'Structured state stores to minimize re-renders and isolate heavy computing steps away from interactive form inputs.',
          tradeOff: 'Required structured state modeling, but delivered consistent sub-50ms response times.',
        },
        {
          title: 'Defensive Data Ingestion & Sanitization',
          decision: 'Enforced strict runtime schema validation with resilient fallback behaviors for all external API payloads.',
          tradeOff: 'Small runtime validation cost in exchange for zero uncaught runtime exceptions in production.',
        },
      ],
    },
  };
});

export function getProjectUniverseById(id: string | null): ProjectUniverseItem | null {
  if (!id) return null;
  return projectUniverseItems.find((p) => p.id === id) ?? null;
}

