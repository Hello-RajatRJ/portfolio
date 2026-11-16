// ============================================================
// PERSONAL INFO — Restrained Deadpool Noir Specification
// ============================================================

export const personal = {
  name: 'Rajat Ambedkar',
  firstName: 'Rajat',
  title: 'Full-Stack Developer', // Strictly Full-Stack Developer everywhere
  tagline: 'Building React/Node products for healthcare, EdTech and FinTech teams.',
  valueProposition: 'Building React/Node products for healthcare, EdTech and FinTech teams.',
  bio: 'Full-Stack Developer with 4 years of experience building high-performance web applications, enterprise portals, and scalable APIs for healthcare, EdTech, and FinTech teams across the globe.',
  location: 'Mohali, India (IST)',
  email: 'rajatgautam179@gmail.com',
  linkedin: 'https://www.linkedin.com/in/rajat-ambedker-961974231',
  github: 'https://github.com/Hello-RajatRJ',
  resume: '/CV_Rajat_Ambedkar.pdf',
  yearsOfExperience: 4,
  availableForWork: true,
  openToRelocation: true,
  statusBadge: 'Open to relocation · Freelance · IST · 4 yrs',
  timezone: 'IST (UTC+5:30)',
  status: 'Open to relocation and freelance',
  coreStack: ['React', 'Next.js', 'Node.js', 'TypeScript', 'React-Admin', 'MUI', 'Tailwind CSS'],
  verticals: ['Healthcare', 'EdTech', 'FinTech', 'AI'],
};

export const PERSONAL_INFO = personal;

export const skills = [
  // 01. Frontend
  { name: 'React', category: 'Frontend', icon: '⚛️', level: 95 },
  { name: 'Next.js', category: 'Frontend', icon: '▲', level: 90 },
  { name: 'TypeScript', category: 'Frontend', icon: '🔷', level: 92 },
  { name: 'Tailwind CSS', category: 'Frontend', icon: '🎨', level: 95 },
  { name: 'React-Admin', category: 'Frontend', icon: '⚡', level: 90 },
  { name: 'MUI', category: 'Frontend', icon: '📐', level: 88 },

  // 02. Backend
  { name: 'Node.js', category: 'Backend', icon: '🟢', level: 90 },
  { name: 'Express / REST APIs', category: 'Backend', icon: '🔌', level: 92 },
  { name: 'NestJS', category: 'Backend', icon: '🦁', level: 85 },
  { name: 'JWT Auth', category: 'Backend', icon: '🔐', level: 90 },

  // 03. Database
  { name: 'PostgreSQL', category: 'Database', icon: '🐘', level: 88 },
  { name: 'MongoDB', category: 'Database', icon: '🍃', level: 88 },
  { name: 'MySQL', category: 'Database', icon: '🐬', level: 85 },

  // 04. DevOps & Tools
  { name: 'Docker', category: 'DevOps & Tools', icon: '🐳', level: 85 },
  { name: 'AWS / Azure', category: 'DevOps & Tools', icon: '☁️', level: 82 },
  { name: 'Git / GitHub', category: 'DevOps & Tools', icon: '🐙', level: 95 },
  { name: 'CI/CD Pipelines', category: 'DevOps & Tools', icon: '🔄', level: 85 },

  // 05. 3D & Animation
  { name: 'Three.js', category: '3D & Animation', icon: '🎮', level: 88 },
  { name: 'React Three Fiber', category: '3D & Animation', icon: '🧊', level: 88 },
  { name: 'GSAP Motion', category: '3D & Animation', icon: '⚡', level: 90 },
];

export const experience = [
  {
    id: 'exp-seasia',
    role: 'Consultant Developer',
    company: 'Seasiainfotech',
    period: 'May 2022 – June 2026',
    status: 'Now Freelance',
    color: '#E62429',
    description: 'Delivered enterprise full-stack web applications, international compliance portals, and high-availability CRM architectures for global clients.',
    highlights: [
      'Architected cloud-native tax compliance portal (CereTax) and multi-jurisdiction calculation dashboards with React, TypeScript, and React-Admin, reducing report load time by [METRIC].',
      'Engineered scalable Node.js microservices and normalized PostgreSQL schemas handling [METRIC] daily records with zero downtime.',
      'Led frontend delivery across international client projects (US, Taiwan, Australia), improving Core Web Vitals to [METRIC] on Lighthouse.',
    ],
    tech: ['React', 'Next.js', 'Node.js', 'TypeScript', 'React-Admin', 'MUI', 'PostgreSQL', 'Tailwind CSS'],
  },
];
