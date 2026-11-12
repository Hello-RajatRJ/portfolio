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

export interface ProjectCaseStudy {
  overview: string;
  contributionRole: string;
  challengeSolved: string;
  stack: StackEntry[];
  features: string[];
  architecture: ArchitectureNode[];
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
      stack: project.tech.map((t) => ({
        name: t,
        layer: inferTechLayer(t),
      })),
      features: project.features,
      architecture: buildArchitecture(project),
    },
  };
});

export function getProjectUniverseById(id: string | null): ProjectUniverseItem | null {
  if (!id) return null;
  return projectUniverseItems.find((p) => p.id === id) ?? null;
}

