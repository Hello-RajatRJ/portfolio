import type { ResumeData, WorkExperience, ProjectItem, SkillCategory, Education, Certification } from '../types/resume';
import { CVSemanticParser, sanitizeLines } from '../utils/cvSemanticParser';

export class CVParserService {
  /**
   * Main entry point to parse a File (JSON, CSV, TXT, MD, DOCX, PDF)
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

    // 2. All files via backend API (http://localhost:3000/api/parse-file)
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('http://localhost:3000/api/parse-file', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return this.normalizeResumeData(json.data);
        }
      }
    } catch (err) {
      console.warn('Backend parse-file endpoint unreachable, using in-browser extraction', err);
    }

    // 3. In-Browser Client-Side Extraction Fallback
    let extractedText = '';

    if (fileName.endsWith('.pdf')) {
      extractedText = await this.extractTextFromPDFInBrowser(file);
    } else {
      extractedText = await file.text();
    }

    const cleanLines = sanitizeLines(extractedText);
    const cleanText = cleanLines.join('\n');

    if (!cleanText || cleanText.trim().length < 5) {
      throw new Error('Could not extract readable text from this file.');
    }

    const canonical = CVSemanticParser.parse(cleanText);
    return this.normalizeResumeData(canonical);
  }

  /**
   * Extract text from PDF in browser using PDF.js via CDN dynamic loader
   */
  private static async extractTextFromPDFInBrowser(file: File): Promise<string> {
    try {
      // Ensure PDF.js is loaded in browser window
      if (!(window as any).pdfjsLib) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          script.onload = () => {
            (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
              'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            resolve();
          };
          script.onerror = () => reject(new Error('Failed to load PDF.js library'));
          document.head.appendChild(script);
        });
      }

      const pdfjsLib = (window as any).pdfjsLib;
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer), verbosity: 0 });
      const pdf = await loadingTask.promise;

      let fullDocText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        let lastY: number | null = null;
        let pageText = '';

        for (const item of textContent.items as any[]) {
          if (!item.str) continue;
          const currentY = item.transform ? item.transform[5] : null;
          if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 4) {
            pageText += '\n';
          } else if (lastY !== null && !pageText.endsWith(' ') && !pageText.endsWith('\n') && !item.str.startsWith(' ')) {
            pageText += ' ';
          }
          pageText += item.str;
          if (currentY !== null) {
            lastY = currentY;
          }
        }
        fullDocText += pageText + '\n\n';
      }

      return fullDocText;
    } catch (e) {
      console.warn('In-browser PDF.js failed, falling back to text stream', e);
      return '';
    }
  }

  /**
   * Normalize any input into standard Portfolio ResumeData schema
   */
  static normalizeResumeData(raw: any): ResumeData {
    if (!raw) return this.emptyResumeData();

    const contactRaw = raw.contact || raw.personalInfo || raw.personalDetails || {};
    const personalInfo = {
      fullName: contactRaw.fullName || contactRaw.name || '',
      jobTitle: contactRaw.jobTitle || contactRaw.title || contactRaw.position || '',
      email: contactRaw.email || '',
      phone: contactRaw.phone || contactRaw.mobile || '',
      location: contactRaw.location || contactRaw.city || '',
      website: contactRaw.website || contactRaw.portfolio || '',
      linkedin: contactRaw.linkedin || contactRaw.linkedInUrl || '',
      github: contactRaw.github || contactRaw.gitHubUrl || '',
      summary: contactRaw.summary || contactRaw.profile || contactRaw.about || '',
    };

    // Work Experiences
    const rawExp = raw.experience || raw.workExperiences || raw.workExperience || [];
    const workExperiences: WorkExperience[] = Array.isArray(rawExp)
      ? rawExp.map((e: any, idx: number) => ({
          id: e.id || `exp-${Date.now()}-${idx + 1}`,
          jobTitle: e.position || e.jobTitle || e.role || '',
          company: e.company || e.companyName || '',
          location: e.location || '',
          startDate: e.startDate || e.start || '',
          endDate: e.endDate || e.end || (e.current ? 'Present' : ''),
          current: Boolean(e.current || (e.endDate && /present|current/i.test(e.endDate))),
          highlights: Array.isArray(e.highlights) && e.highlights.length > 0
            ? e.highlights
            : Array.isArray(e.responsibilities) && e.responsibilities.length > 0
            ? e.responsibilities
            : e.description ? [e.description] : [],
        }))
      : [];

    // Educations
    const rawEdu = raw.education || raw.educations || [];
    const educations: Education[] = Array.isArray(rawEdu)
      ? rawEdu.map((e: any, idx: number) => ({
          id: e.id || `edu-${Date.now()}-${idx + 1}`,
          institution: e.institution || e.school || e.university || '',
          degree: e.degree || e.qualification || '',
          fieldOfStudy: e.fieldOfStudy || e.field || e.major || '',
          location: e.location || '',
          startDate: e.startDate || '',
          endDate: e.endDate || '',
          gpa: e.gpa || e.grade || '',
          highlights: Array.isArray(e.highlights) ? e.highlights : [],
        }))
      : [];

    // Skill Categories
    const rawSkills = raw.skills || raw.skillCategories || [];
    const skillCategories: SkillCategory[] = Array.isArray(rawSkills)
      ? rawSkills.map((s: any, idx: number) => ({
          id: s.id || `skills-${idx + 1}`,
          categoryName: s.category || s.categoryName || s.name || 'Skills',
          skills: Array.isArray(s.skills) ? s.skills : Array.isArray(s.items) ? s.items : [],
        }))
      : [];

    // Projects
    const rawProj = raw.projects || raw.projectItems || [];
    const projects: ProjectItem[] = Array.isArray(rawProj)
      ? rawProj.map((p: any, idx: number) => ({
          id: p.id || `proj-${Date.now()}-${idx + 1}`,
          title: p.name || p.title || p.projectName || '',
          role: p.role || '',
          duration: p.duration || (p.startDate && p.endDate ? `${p.startDate} - ${p.endDate}` : ''),
          techStack: Array.isArray(p.technologies) ? p.technologies : Array.isArray(p.techStack) ? p.techStack : [],
          description: p.description || '',
          highlights: Array.isArray(p.highlights) ? p.highlights : [],
          link: p.link || p.url || '',
          repoLink: p.repoLink || p.github || '',
        }))
      : [];

    // Certifications
    const rawCerts = raw.certifications || raw.certificates || [];
    const certifications: Certification[] = Array.isArray(rawCerts)
      ? rawCerts.map((c: any, idx: number) => ({
          id: c.id || `cert-${Date.now()}-${idx + 1}`,
          name: c.name || c.title || '',
          issuer: c.issuer || c.organization || '',
          date: c.date || c.issueDate || '',
          expiryDate: c.expiryDate || '',
          credentialId: c.credentialId || '',
          link: c.link || '',
        }))
      : [];

    return {
      personalInfo,
      workExperiences,
      educations,
      skillCategories,
      projects,
      certifications,
      customSections: [],
    };
  }

  private static emptyResumeData(): ResumeData {
    return {
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
      workExperiences: [],
      educations: [],
      skillCategories: [],
      projects: [],
      certifications: [],
      customSections: [],
    };
  }
}
