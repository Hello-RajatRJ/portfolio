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
  email: 'rajatgautam179@gmail.com',
  linkedin: 'https://www.linkedin.com/in/rajat-ambedker-961974231',
  github: 'https://github.com/Hello-RajatRJ/portfolio',
  resume: '/cv/RajatAmbedkar_CV.docx',
  yearsOfExperience: 4,
  availableForWork: true,
};

export const skills = [
  // Frontend & Languages
  { name: 'React.js', level: 95, category: 'Frontend', icon: '⚛️' },
  { name: 'Next.js', level: 88, category: 'Frontend', icon: '▲' },
  { name: 'Vue.js / Nuxt.js', level: 80, category: 'Frontend', icon: '🟩' },
  { name: 'JavaScript', level: 75, category: 'Languages', icon: '🟨' },
  { name: 'TypeScript', level: 75, category: 'Languages', icon: '🔷' },
  { name: 'Three.js / R3F', level: 85, category: '3D / WebGL', icon: '🎮' },
  
  // Styling & State Management
  { name: 'Tailwind CSS', level: 90, category: 'Styling', icon: '🎨' },
  { name: 'Bootstrap / MUI', level: 85, category: 'Styling', icon: '📐' },
  { name: 'Redux / Zustand', level: 88, category: 'State Management', icon: '📦' },
  
  // Backend & Databases
  { name: 'Node.js', level: 70, category: 'Backend', icon: '🟢' },
  { name: 'NestJS', level: 70, category: 'Backend', icon: '🦁' },
  { name: 'PostgreSQL / SQL', level: 70, category: 'Databases', icon: '🐘' },
  { name: 'MongoDB', level: 70, category: 'Databases', icon: '🍃' },
  { name: 'MySQL', level: 70, category: 'Databases', icon: '🐬' },
  
  // DevOps, Cloud & Tools
  { name: 'Git / GitHub', level: 80, category: 'Tools', icon: '🐙' },
  { name: 'Vite / Webpack', level: 70, category: 'Tools', icon: '⚡' },
  { name: 'Docker', level: 70, category: 'DevOps', icon: '🐳' },
  { name: 'AWS / Azure', level: 70, category: 'Cloud', icon: '☁️' },
  { name: 'CI/CD', level: 70, category: 'DevOps', icon: '🔄' },
  
  // Integrations & Additional
  { name: 'JWT Auth', level: 70, category: 'Auth', icon: '🔐' },
  { name: 'Socket.io', level: 70, category: 'Integrations', icon: '🔌' },
  { name: 'Agile / Scrum', level: 70, category: 'Additional', icon: '🏃' },
  { name: 'AI Tools / Chatbots', level: 85, category: 'Additional', icon: '🤖' },
];

export const experience = [
  {
    id: 'exp-1',
    role: 'Full-Stack Developer',
    company: 'Freelance / Contract',       // TODO: Replace with real company
    period: '2023 – Present',
    description: 'Delivering full-stack web solutions for international clients across healthcare, EdTech, fintech, and social platforms. Specializing in React, Node.js, and 3D web experiences.',
    highlights: [
      'Delivered and deployed 8+ production web applications, and contributed to more than 20 projects overall',
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
