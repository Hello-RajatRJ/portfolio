import type { ResumeData, WorkExperience, ProjectItem } from '../types/resume';
import { sampleResumeData } from '../data/sampleResume';

export class CVParserService {
  /**
   * Main entry point to parse a File (JSON, TXT, MD, DOCX, PDF)
   */
  static async parseFile(file: File): Promise<ResumeData> {
    const fileName = file.name.toLowerCase();

    // 1. JSON file handling
    if (fileName.endsWith('.json')) {
      const jsonText = await file.text();
      try {
        const parsed = JSON.parse(jsonText);
        return this.normalizeResumeData(parsed);
      } catch (e) {
        console.warn('Failed to parse JSON file directly, treating as text', e);
      }
    }

    // 2. Extract text depending on file type
    let extractedText = '';

    if (fileName.endsWith('.pdf')) {
      const binaryStr = await file.text();
      extractedText = this.extractTextFromPDFBinary(binaryStr);
    } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      const binaryStr = await file.text();
      extractedText = this.extractTextFromDOCXBinary(binaryStr);
    } else {
      // Plain text, markdown, rtf
      extractedText = await file.text();
    }

    // If binary extraction resulted in very short text, try fallback text reading
    if (!extractedText || extractedText.length < 30) {
      extractedText = await file.text();
    }

    return this.parseTextToResumeData(extractedText, file.name);
  }

  /**
   * Extract text strings from PDF stream binaries
   */
  private static extractTextFromPDFBinary(binaryStr: string): string {
    const textParts: string[] = [];

    // Extract text in PDF BT...ET blocks
    const btBlocks = binaryStr.match(/BT[\s\S]*?ET/g) || [];
    for (const block of btBlocks) {
      // Extract text in parentheses e.g. (John Doe) Tj
      const matches = block.match(/\(([^()\\]|\\[\s\S])*\)/g) || [];
      for (const m of matches) {
        const cleaned = m
          .slice(1, -1)
          .replace(/\\([()])/g, '$1')
          .replace(/\\n/g, ' ')
          .replace(/\\r/g, ' ')
          .trim();
        if (cleaned.length > 0 && !/^[\d\s\/\.()-]+$/.test(cleaned) && cleaned.length < 300) {
          textParts.push(cleaned);
        }
      }
    }

    // Fallback: search all parenthesized strings in stream
    if (textParts.length < 5) {
      const rawMatches = binaryStr.match(/\([A-Za-z0-9\s.,@:;\/\-+_#%&'"]{3,100}\)/g) || [];
      for (const rm of rawMatches) {
        const text = rm.slice(1, -1).trim();
        if (text.length > 2 && !text.includes('Font') && !text.includes('ProcSet')) {
          textParts.push(text);
        }
      }
    }

    return textParts.join('\n');
  }

  /**
   * Extract text from DOCX XML (<w:t> tags)
   */
  private static extractTextFromDOCXBinary(binaryStr: string): string {
    const wtMatches = binaryStr.match(/<w:t[^>]*>([^<]+)<\/w:t>/g) || [];
    if (wtMatches.length > 0) {
      return wtMatches
        .map((tag) => tag.replace(/<[^>]+>/g, '').trim())
        .filter(Boolean)
        .join('\n');
    }

    // Fallback XML cleanup
    const cleanStr = binaryStr.replace(/<[^>]+>/g, ' ');
    return cleanStr.replace(/[\x00-\x1F\x7F-\x9F]/g, ' ').replace(/\s+/g, ' ');
  }

  /**
   * Safely normalize JSON or partial objects into a valid ResumeData structure
   */
  public static normalizeResumeData(raw: any): ResumeData {
    const base = sampleResumeData;

    return {
      personalInfo: {
        fullName: raw?.personalInfo?.fullName || raw?.fullName || raw?.name || base.personalInfo.fullName,
        jobTitle: raw?.personalInfo?.jobTitle || raw?.jobTitle || raw?.title || base.personalInfo.jobTitle,
        email: raw?.personalInfo?.email || raw?.email || base.personalInfo.email,
        phone: raw?.personalInfo?.phone || raw?.phone || base.personalInfo.phone,
        location: raw?.personalInfo?.location || raw?.location || base.personalInfo.location,
        website: raw?.personalInfo?.website || raw?.website || base.personalInfo.website,
        linkedin: raw?.personalInfo?.linkedin || raw?.linkedin || base.personalInfo.linkedin,
        github: raw?.personalInfo?.github || raw?.github || base.personalInfo.github,
        summary: raw?.personalInfo?.summary || raw?.summary || base.personalInfo.summary,
      },
      workExperiences: Array.isArray(raw?.workExperiences) && raw.workExperiences.length > 0
        ? raw.workExperiences.map((w: any, idx: number) => ({
            id: w.id || `exp-${Date.now()}-${idx}`,
            jobTitle: w.jobTitle || w.title || 'Software Engineer',
            company: w.company || 'Tech Company',
            location: w.location || '',
            startDate: w.startDate || '',
            endDate: w.endDate || '',
            current: Boolean(w.current),
            highlights: Array.isArray(w.highlights) ? w.highlights : [w.description || 'Delivered engineering solutions.'],
          }))
        : base.workExperiences,
      educations: Array.isArray(raw?.educations) && raw.educations.length > 0
        ? raw.educations.map((e: any, idx: number) => ({
            id: e.id || `edu-${Date.now()}-${idx}`,
            institution: e.institution || e.school || 'University',
            degree: e.degree || 'Bachelor of Science',
            fieldOfStudy: e.fieldOfStudy || e.field || 'Computer Science',
            location: e.location || '',
            startDate: e.startDate || '',
            endDate: e.endDate || '',
            gpa: e.gpa || '',
            highlights: Array.isArray(e.highlights) ? e.highlights : [],
          }))
        : base.educations,
      skillCategories: Array.isArray(raw?.skillCategories) && raw.skillCategories.length > 0
        ? raw.skillCategories.map((s: any, idx: number) => ({
            id: s.id || `cat-${Date.now()}-${idx}`,
            categoryName: s.categoryName || s.name || 'Technical Skills',
            skills: Array.isArray(s.skills) ? s.skills : [],
          }))
        : base.skillCategories,
      projects: Array.isArray(raw?.projects) && raw.projects.length > 0
        ? raw.projects.map((p: any, idx: number) => ({
            id: p.id || `proj-${Date.now()}-${idx}`,
            title: p.title || p.name || 'Web Platform Project',
            role: p.role || 'Lead Developer',
            duration: p.duration || '',
            techStack: Array.isArray(p.techStack) ? p.techStack : ['React', 'TypeScript', 'Node.js'],
            description: p.description || 'Full-stack application built for high scale.',
            highlights: Array.isArray(p.highlights) ? p.highlights : ['Architected modular UI components.'],
            link: p.link || '',
          }))
        : base.projects,
      certifications: Array.isArray(raw?.certifications) ? raw.certifications : base.certifications,
      settings: {
        templateId: raw?.settings?.templateId || base.settings.templateId,
        accentColor: raw?.settings?.accentColor || base.settings.accentColor,
        fontSize: raw?.settings?.fontSize || base.settings.fontSize,
        fontFamily: raw?.settings?.fontFamily || base.settings.fontFamily,
      },
    };
  }

  /**
   * Deep Text Parsing into structured ResumeData
   */
  private static parseTextToResumeData(text: string, originalFileName: string): ResumeData {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

    // 1. Contact Details Heuristics
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = text.match(/(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/);
    const linkedinMatch = text.match(/(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
    const githubMatch = text.match(/(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
    const websiteMatch = text.match(/(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.(com|dev|io|org|net|me)\b/i);

    // 2. Full Name Extraction
    let fullName = 'Developer Profile';
    for (const l of lines.slice(0, 5)) {
      if (
        !l.includes('@') &&
        !l.toLowerCase().includes('resume') &&
        !l.toLowerCase().includes('curriculum') &&
        !l.toLowerCase().includes('page') &&
        l.length >= 3 &&
        l.length <= 35 &&
        /^[a-zA-Z\s.'-]+$/.test(l)
      ) {
        fullName = l;
        break;
      }
    }

    // 3. Job Title Extraction
    let jobTitle = 'Senior Software Engineer';
    const titleRegex = /(software engineer|full stack|frontend|backend|web developer|architect|lead engineer|data scientist|devops|ui\/ux designer|mobile developer)/i;
    for (const l of lines.slice(0, 10)) {
      const match = l.match(titleRegex);
      if (match) {
        jobTitle = l.length < 45 ? l : match[0].toUpperCase();
        break;
      }
    }

    // 4. Section Splitter
    let currentSection: 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'other' = 'summary';
    const summaryLines: string[] = [];
    const experienceLines: string[] = [];
    const educationLines: string[] = [];
    const skillLines: string[] = [];
    const projectLines: string[] = [];

    for (const line of lines) {
      const lower = line.toLowerCase();

      if (lower.match(/^(summary|profile|about me|professional summary|objective)\b/)) {
        currentSection = 'summary';
        continue;
      }
      if (lower.match(/^(work experience|experience|employment history|work history|professional experience)\b/)) {
        currentSection = 'experience';
        continue;
      }
      if (lower.match(/^(education|academic background|qualifications)\b/)) {
        currentSection = 'education';
        continue;
      }
      if (lower.match(/^(skills|technical skills|technologies|core competencies|skills & tools)\b/)) {
        currentSection = 'skills';
        continue;
      }
      if (lower.match(/^(projects|key projects|portfolio|selected work)\b/)) {
        currentSection = 'projects';
        continue;
      }

      if (currentSection === 'summary') summaryLines.push(line);
      else if (currentSection === 'experience') experienceLines.push(line);
      else if (currentSection === 'education') educationLines.push(line);
      else if (currentSection === 'skills') skillLines.push(line);
      else if (currentSection === 'projects') projectLines.push(line);
    }

    // 5. Extract Skills
    const extractedSkillsSet = new Set<string>();
    const techKeywords = [
      'React', 'TypeScript', 'JavaScript', 'Node.js', 'Express', 'Python', 'Java', 'C++', 'C#',
      'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'GraphQL', 'REST APIs', 'CI/CD',
      'Git', 'HTML5', 'CSS3', 'Tailwind CSS', 'Redux', 'Zustand', 'Three.js', 'Next.js', 'Vue.js',
      'Angular', 'Agile', 'Scrum', 'Microservices', 'Cloud', 'System Design', 'Testing', 'Jest',
    ];

    // Find keywords in text
    const allTextLower = text.toLowerCase();
    techKeywords.forEach((kw) => {
      if (allTextLower.includes(kw.toLowerCase())) {
        extractedSkillsSet.add(kw);
      }
    });

    if (skillLines.length > 0) {
      skillLines.join(' ').split(/[,•|/;\n]/).forEach((s) => {
        const cleaned = s.trim();
        if (cleaned.length > 1 && cleaned.length < 30) {
          extractedSkillsSet.add(cleaned);
        }
      });
    }

    const skillsList = Array.from(extractedSkillsSet);
    const primarySkills = skillsList.length > 0 ? skillsList : ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Git', 'AWS'];

    // 6. Work Experience Breakdown
    const parsedExperiences: WorkExperience[] = [];
    if (experienceLines.length > 0) {
      let currentCompany = 'Engineering Firm';
      let currentTitle = jobTitle;
      let currentHighlights: string[] = [];

      for (const el of experienceLines) {
        if (el.match(/(19|20)\d{2}|present|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i) && el.length < 60) {
          if (currentHighlights.length > 0) {
            parsedExperiences.push({
              id: `exp-${Date.now()}-${parsedExperiences.length}`,
              jobTitle: currentTitle,
              company: currentCompany,
              location: 'Remote / On-site',
              startDate: '2021',
              endDate: 'Present',
              current: true,
              highlights: currentHighlights,
            });
            currentHighlights = [];
          }
          currentTitle = el.length < 40 ? el : 'Software Engineer';
        } else if (el.length > 10) {
          currentHighlights.push(el.replace(/^[•\-\*]\s*/, ''));
        }
      }

      if (currentHighlights.length > 0) {
        parsedExperiences.push({
          id: `exp-${Date.now()}-${parsedExperiences.length}`,
          jobTitle: currentTitle,
          company: currentCompany,
          location: 'San Francisco, CA',
          startDate: '2022',
          endDate: 'Present',
          current: true,
          highlights: currentHighlights.slice(0, 5),
        });
      }
    }

    const finalExperiences = parsedExperiences.length > 0 ? parsedExperiences : [
      {
        id: `exp-${Date.now()}-1`,
        jobTitle: jobTitle,
        company: 'Tech Solutions Inc.',
        location: 'San Francisco, CA',
        startDate: '2022',
        endDate: 'Present',
        current: true,
        highlights: experienceLines.length > 0
          ? experienceLines.slice(0, 4).map((l) => l.replace(/^[•\-\*]\s*/, ''))
          : [
              'Architected high-throughput web applications with modern frontend & backend frameworks.',
              'Engineered RESTful & GraphQL microservices handling real-time data sync.',
              'Collaborated in cross-functional agile teams to optimize performance and deployment cycles.',
            ],
      },
    ];

    // 7. Projects Breakdown
    const parsedProjects: ProjectItem[] = [
      {
        id: `proj-${Date.now()}-1`,
        title: projectLines[0] || 'Enterprise Web Application',
        role: 'Lead Architect',
        techStack: primarySkills.slice(0, 4),
        description: projectLines.length > 1 ? projectLines.slice(0, 2).join(' ') : 'High performance web application designed for enterprise scale and low latency.',
        highlights: projectLines.length > 2
          ? projectLines.slice(2, 5).map((l) => l.replace(/^[•\-\*]\s*/, ''))
          : ['Designed component library and state management architecture.'],
      },
    ];

    const base = sampleResumeData;

    return {
      personalInfo: {
        fullName,
        jobTitle,
        email: emailMatch ? emailMatch[0] : 'developer@example.com',
        phone: phoneMatch ? phoneMatch[0] : '+1 (555) 019-2834',
        location: 'San Francisco, CA',
        website: websiteMatch ? (websiteMatch[0].startsWith('http') ? websiteMatch[0] : `https://${websiteMatch[0]}`) : 'https://portfolio.dev',
        linkedin: linkedinMatch ? linkedinMatch[0] : 'https://linkedin.com/in/developer',
        github: githubMatch ? githubMatch[0] : 'https://github.com/developer',
        summary: summaryLines.length > 0
          ? summaryLines.join(' ').slice(0, 450)
          : `Extracted profile from ${originalFileName}. Results-oriented ${jobTitle} with proven expertise in ${primarySkills.slice(0, 4).join(', ')}. Experienced in delivering scalable web solutions and high-performance applications.`,
      },
      workExperiences: finalExperiences,
      educations: [
        {
          id: `edu-${Date.now()}-1`,
          institution: educationLines[0] || 'State University',
          degree: educationLines[1] || 'Bachelor of Science',
          fieldOfStudy: 'Computer Science & Software Engineering',
          location: 'California',
          startDate: '2018',
          endDate: '2022',
          highlights: educationLines.slice(2, 4),
        },
      ],
      skillCategories: [
        {
          id: `cat-${Date.now()}-1`,
          categoryName: 'Core Technical Stack',
          skills: primarySkills.slice(0, 8),
        },
        {
          id: `cat-${Date.now()}-2`,
          categoryName: 'Frameworks & Tools',
          skills: primarySkills.length > 8 ? primarySkills.slice(8, 16) : ['Git', 'Docker', 'AWS', 'Jest', 'CI/CD'],
        },
      ],
      projects: parsedProjects,
      certifications: base.certifications,
      settings: base.settings,
    };
  }
}
