export type TemplateId =
  // Original hand-crafted templates
  | 'ats-classic'
  | 'modern-tech'
  | 'creative-studio'
  | 'minimalist'
  | 'executive-suite'
  | 'silicon-valley'
  | 'compact-one-page'
  | 'academic-cv'
  | 'two-page-executive'
  | 'two-page-tech-lead'
  // Configurable templates
  | 'corporate-clean'
  | 'federal-standard'
  | 'timeline-modern'
  | 'bold-header'
  | 'professional-mono'
  | 'startup-pitch'
  | 'devops-pipeline'
  | 'data-science'
  | 'gradient-accent'
  | 'colorful-blocks'
  | 'swiss-design'
  | 'zen-minimal'
  | 'nordic-light'
  | 'elegant-serif'
  | 'clevel-executive'
  | 'board-director'
  | 'vp-leadership'
  | 'director-ops'
  | 'healthcare-pro'
  | 'finance-analyst'
  | 'legal-counsel'
  | 'marketing-creative'
  | 'educator-academic'
  | 'terminal-dark'
  | 'github-readme'
  | 'code-block'
  | 'stack-dev'
  | 'api-docs'
  | 'two-page-academic'
  | 'two-page-project'
  | 'two-page-comprehensive'
  | 'ultra-compact'
  | 'dense-grid'
  | 'summary-first'
  | 'skills-heavy'
  | 'infographic-bars'
  | 'metro-tiles'
  | 'ribbon-accent'
  | 'split-screen'
  | 'magazine-layout'
  | 'blueprint-engineer';

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  highlights: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  highlights?: string[];
}

export interface SkillCategory {
  id: string;
  categoryName: string;
  skills: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  role: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  techStack: string[];
  description: string;
  link?: string;
  repoLink?: string;
  highlights: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  workExperiences: WorkExperience[];
  educations: Education[];
  skillCategories: SkillCategory[];
  projects: ProjectItem[];
  certifications: Certification[];
  settings: {
    templateId: TemplateId;
    accentColor: string;
    fontSize: 'sm' | 'md' | 'lg';
    fontFamily: 'inter' | 'roboto' | 'outfit' | 'serif';
  };
}

export interface ATSAnalysisResult {
  score: number; // 0 to 100
  rating: 'Needs Work' | 'Good' | 'Great' | 'Excellent';
  feedback: {
    type: 'success' | 'warning' | 'error';
    category: string;
    message: string;
  }[];
  extractedKeywords: string[];
  missingKeywords: string[];
  actionVerbsCount: number;
}

export interface JDSuggestion {
  matchedSkills: string[];
  missingSkills: string[];
  recommendedSummary: string;
  suggestedBullets: string[];
}

export interface AIOptimizationChange {
  id: string;
  category: 'summary' | 'skills' | 'project_tech' | 'project_description' | 'experience_highlight';
  title: string;
  originalText: string;
  newText: string;
  accepted: boolean;
}

export interface AIOptimizationResult {
  tailoredData: ResumeData;
  beforeATSScore: number;
  afterATSScore: number;
  extractedKeywords: string[];
  missingKeywords: string[];
  suggestedCertifications: string[];
  changes: AIOptimizationChange[];
}

