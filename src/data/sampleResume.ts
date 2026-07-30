import type { ResumeData } from '../types/resume';

export const emptyResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    summary: '',
  },
  workExperiences: [
    {
      id: 'exp-init-1',
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: true,
      highlights: [''],
    },
  ],
  educations: [
    {
      id: 'edu-init-1',
      institution: '',
      degree: '',
      fieldOfStudy: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      highlights: [],
    },
  ],
  skillCategories: [
    {
      id: 'cat-init-1',
      categoryName: '',
      skills: [],
    },
  ],
  projects: [
    {
      id: 'proj-init-1',
      title: '',
      role: '',
      duration: '',
      techStack: [],
      description: '',
      highlights: [''],
      link: '',
    },
  ],
  certifications: [],
  settings: {
    templateId: 'ats-classic',
    accentColor: '#4f46e5',
    fontSize: 'md',
    fontFamily: 'inter',
  },
};

export const sampleResumeData: ResumeData = {
  personalInfo: {
    fullName: 'Rajat Ambedkar',
    jobTitle: 'Senior Full Stack Engineer & UI Architect',
    email: 'rajat.ambedkar@example.com',
    phone: '+1 (555) 349-8201',
    location: 'San Francisco, CA',
    website: 'https://rajatportfolio.dev',
    linkedin: 'linkedin.com/in/rajat-ambedkar',
    github: 'github.com/Hello-RajatRJ',
    summary:
      'Passionate and result-driven Senior Full Stack Engineer with 6+ years of experience crafting high-performance web applications, interactive 3D web experiences, and microservices architecture. Expert in React, TypeScript, Node.js, and modern UI performance optimization.',
  },
  workExperiences: [
    {
      id: 'exp-1',
      jobTitle: 'Senior Frontend Architect',
      company: 'Apex Digital Systems',
      location: 'San Francisco, CA',
      startDate: 'Jan 2023',
      endDate: 'Present',
      current: true,
      highlights: [
        'Spearheaded the redesign of enterprise web portals using React, TypeScript, and Tailwind CSS, increasing user engagement by 42%.',
        'Engineered responsive 3D visualization modules using Three.js and WebGL, reducing load times by 35% through custom asset compression.',
        'Mentored a team of 8 engineers on clean component architecture, automated testing with Vitest, and accessibility standards.',
      ],
    },
    {
      id: 'exp-2',
      jobTitle: 'Full Stack Software Engineer',
      company: 'Nexus Tech Solutions',
      location: 'Austin, TX',
      startDate: 'Mar 2021',
      endDate: 'Dec 2022',
      current: false,
      highlights: [
        'Developed scalable REST and GraphQL APIs using Node.js, Express, and PostgreSQL handling over 2M daily API queries.',
        'Implemented real-time data streaming features with WebSockets and Zustand, cutting latency down to under 50ms.',
        'Established automated CI/CD pipelines with GitHub Actions and Docker, accelerating release cycles from bi-weekly to daily.',
      ],
    },
    {
      id: 'exp-3',
      jobTitle: 'Frontend Web Developer',
      company: 'Innovate Labs',
      location: 'Remote',
      startDate: 'Jun 2019',
      endDate: 'Feb 2021',
      current: false,
      highlights: [
        'Created interactive UI components and dashboard widgets using React, Redux Toolkit, and Chart.js.',
        'Optimized Web Vitals and Lighthouse scores, achieving 98+ scores across performance, accessibility, and SEO.',
      ],
    },
  ],
  educations: [
    {
      id: 'edu-1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science & Software Engineering',
      location: 'Berkeley, CA',
      startDate: '2015',
      endDate: '2019',
      gpa: '',
      highlights: ['Dean’s Honor List for 6 semesters', 'ACM Student Chapter Vice President'],
    },
  ],
  skillCategories: [
    {
      id: 'cat-1',
      categoryName: 'Frontend & UI',
      skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Zustand', 'HTML5/CSS3'],
    },
    {
      id: 'cat-2',
      categoryName: 'Backend & Cloud',
      skills: ['Node.js', 'Express', 'Python', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS (S3, Lambda)', 'Redis'],
    },
    {
      id: 'cat-3',
      categoryName: 'Tools & Testing',
      skills: ['Git', 'Vite', 'Webpack', 'Jest', 'Cypress', 'CI/CD Pipelines', 'Figma', 'Postman'],
    },
    {
      id: 'cat-4',
      categoryName: 'Beginner Skills',
      skills: ['Java', 'Golang (Go)', 'Spring Boot', 'Three.js', 'Python'],
    },
  ],
  projects: [
    {
      id: 'proj-ceretax',
      title: 'CereTax - Cloud-Native Tax Compliance Platform',
      role: 'Full-Stack Developer',
      duration: '2023 – Present',
      techStack: ['React', 'TypeScript', 'Java (Beginner)', 'Golang (Beginner)', 'Spring Boot (Beginner)', 'Node.js', 'PostgreSQL'],
      description:
        'An enterprise-grade, cloud-native tax compliance and automation platform. Integrates sales & use tax calculation engines, ERP connectors, and analytics reporting.',
      highlights: [
        'Built interactive analytics dashboard and ERP integration layer for multi-jurisdiction tax calculation.',
        'Contributed to backend services and microservices using Java, Spring Boot, and Golang.',
        'Designed performant tax rule configuration interface managing thousands of jurisdiction rules.',
      ],
      link: 'https://ceretax.com',
    },
    {
      id: 'proj-1',
      title: '3D Interactive Portfolio World',
      role: 'Lead Creator & WebGL Developer',
      duration: '4 Months (Jan 2024 – Apr 2024)',
      techStack: ['React', 'Three.js', 'React Three Fiber', 'GSAP', 'Tailwind CSS'],
      description:
        'Immersive gamified portfolio web application featuring real-time 3D physics driving mechanics, spatial audio engine, day/night lighting cycle, and interactive 3D showrooms.',
      highlights: [
        'Engineered WebGL 3D driving mechanics with React Three Fiber achieving consistent 60 FPS performance across desktop and mobile browsers.',
        'Implemented spatial audio controls, procedural lighting shaders, and custom glTF asset optimization reducing bundle payload by 45%.',
        'Designed responsive HUD overlay and gamified mini-challenge checkpoints to maximize visitor interaction time.',
      ],
      link: 'https://rajatportfolio.dev',
    },
    {
      id: 'proj-2',
      title: 'AI Resume Architect & ATS Optimizer',
      role: 'Full Stack Architect & UI Lead',
      duration: '3 Months (May 2024 – Jul 2024)',
      techStack: ['TypeScript', 'React', 'Zustand', 'Gemini AI API', 'html2pdf.js', 'Tailwind CSS'],
      description:
        'Enterprise-grade ATS resume creation platform enabling job seekers to build recruiter-optimized resumes with live keyword matching and AI description suggestions.',
      highlights: [
        'Architected real-time ATS scoring engine benchmarking action verbs, contact completeness, readability density, and job description keyword match.',
        'Created 10+ ATS-compliant templates supporting 1-click vector PDF generation, multi-page breaks, and live customizable color accents.',
        'Integrated Gemini AI API with client-side NLP fallback engine for instant summary and bullet point generation.',
      ],
      link: 'https://github.com/Hello-RajatRJ/portfolio',
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      date: '2023',
    },
    {
      id: 'cert-2',
      name: 'Meta Front-End Developer Professional Certificate',
      issuer: 'Coursera / Meta',
      date: '2022',
    },
  ],
  settings: {
    templateId: 'ats-classic',
    accentColor: '#4f46e5',
    fontSize: 'md',
    fontFamily: 'inter',
  },
};
