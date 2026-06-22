// ============================================================
// PERSONAL INFO — Update with your real details!
// ============================================================

export const personal = {
  name: 'Rajat Ambedkar',
  firstName: 'Rajat',
  title: 'Full-Stack Developer',
  tagline: 'Building immersive web experiences that push boundaries',
  bio: "I'm a passionate full-stack developer with expertise in modern web technologies, 3D graphics, and interactive user experiences. I love turning complex problems into elegant, performant solutions — from real-time data dashboards to immersive 3D worlds.",
  location: 'India',
  email: 'rajat@example.com',           // TODO: Replace with real email
  linkedin: 'https://linkedin.com/in/rajat',  // TODO: Replace
  github: 'https://github.com/rajat',         // TODO: Replace
  twitter: 'https://twitter.com/rajat',       // TODO: Replace (optional)
  resume: '/resume.txt',
  yearsOfExperience: 4,
  availableForWork: true,
};

export const skills = [
  // Frontend
  { name: 'React.js', level: 95, category: 'Frontend', icon: '⚛️' },
  { name: 'TypeScript', level: 92, category: 'Frontend', icon: '🔷' },
  { name: 'Next.js', level: 88, category: 'Frontend', icon: '▲' },
  { name: 'Three.js / R3F', level: 85, category: '3D / WebGL', icon: '🎮' },
  { name: 'Tailwind CSS', level: 90, category: 'Frontend', icon: '🎨' },
  { name: 'Framer Motion', level: 80, category: 'Frontend', icon: '✨' },
  // Backend
  { name: 'Node.js', level: 88, category: 'Backend', icon: '🟢' },
  { name: 'Python', level: 78, category: 'Backend', icon: '🐍' },
  { name: 'PostgreSQL', level: 80, category: 'Backend', icon: '🐘' },
  { name: 'MongoDB', level: 78, category: 'Backend', icon: '🍃' },
  { name: 'REST APIs', level: 92, category: 'Backend', icon: '🔗' },
  { name: 'GraphQL', level: 75, category: 'Backend', icon: '◉' },
  // DevOps & Tools
  { name: 'Git / GitHub', level: 90, category: 'Tools', icon: '🐙' },
  { name: 'Docker', level: 72, category: 'Tools', icon: '🐳' },
  { name: 'AWS', level: 68, category: 'Tools', icon: '☁️' },
  { name: 'Vite', level: 88, category: 'Tools', icon: '⚡' },
];

export const experience = [
  {
    id: 'exp-1',
    role: 'Full-Stack Developer',
    company: 'Freelance / Contract',       // TODO: Replace with real company
    period: '2023 – Present',
    description: 'Delivering full-stack web solutions for international clients across healthcare, EdTech, fintech, and social platforms. Specializing in React, Node.js, and 3D web experiences.',
    highlights: [
      'Built 8+ production web applications across diverse industries',
      'Architected scalable REST APIs serving thousands of daily users',
      'Implemented 3D interactive experiences using Three.js and React Three Fiber',
      'Collaborated with remote teams across Australia, Taiwan, India, and the US',
    ],
    tech: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
    color: '#6366f1',
  },
  {
    id: 'exp-2',
    role: 'Frontend Developer',
    company: 'Previous Company',           // TODO: Replace
    period: '2021 – 2023',
    description: 'Led frontend development for SaaS products, focusing on performance optimization, accessibility, and modern UI architecture.',
    highlights: [
      'Migrated legacy jQuery codebase to React, reducing bundle size by 60%',
      'Implemented design systems and reusable component libraries',
      'Improved page load times from 4.2s to under 1.5s through code splitting',
    ],
    tech: ['React', 'JavaScript', 'SCSS', 'REST APIs'],
    color: '#8b5cf6',
  },
];
