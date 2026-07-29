import type { ResumeData, ATSAnalysisResult, JDSuggestion } from '../types/resume';

const ACTION_VERBS = [
  'spearheaded', 'engineered', 'developed', 'architected', 'implemented', 'optimized',
  'streamlined', 'lead', 'managed', 'created', 'designed', 'established', 'accelerated',
  'boosted', 'orchestrated', 'built', 'reduced', 'increased', 'transformed', 'delivered',
  'launched', 'automated', 'integrated', 'scaled', 'crafted', 'formulated', 'executed'
];

const COMMON_TECH_KEYWORDS = [
  'react', 'typescript', 'javascript', 'node.js', 'express', 'python', 'java', 'c++', 'c#',
  'aws', 'docker', 'kubernetes', 'postgresql', 'mongodb', 'graphql', 'rest api', 'ci/cd',
  'git', 'html5', 'css3', 'tailwind', 'redux', 'zustand', 'three.js', 'next.js', 'vue', 'angular',
  'agile', 'scrum', 'microservices', 'cloud', 'security', 'system design', 'testing', 'jest',
  'vite', 'webpack', 'ui/ux', 'responsive design', 'web vitals', 'performance', 'accessibility'
];

export class AIResumeService {
  /**
   * Analyze resume content and generate real-time ATS score & suggestions
   */
  static analyzeATS(data: ResumeData, jobDescriptionText: string = ''): ATSAnalysisResult {
    let score = 0;
    const feedback: ATSAnalysisResult['feedback'] = [];
    const extractedKeywords: string[] = [];
    const missingKeywords: string[] = [];

    // 1. Personal Info Completeness (20 points max)
    let personalScore = 0;
    if (data.personalInfo.fullName.trim()) personalScore += 4;
    if (data.personalInfo.email.includes('@')) personalScore += 4;
    if (data.personalInfo.phone.trim()) personalScore += 4;
    if (data.personalInfo.location.trim()) personalScore += 4;
    if (data.personalInfo.summary.trim().length > 30) personalScore += 4;
    score += personalScore;

    if (personalScore < 16) {
      feedback.push({
        type: 'warning',
        category: 'Contact Info',
        message: 'Ensure Email, Phone, Location, and Professional Summary are fully filled out.',
      });
    } else {
      feedback.push({
        type: 'success',
        category: 'Contact Info',
        message: 'Contact details and summary are complete and ATS accessible.',
      });
    }

    // 2. Work Experience & Impact Bullets (30 points max)
    let expScore = 0;
    let actionVerbsFound = 0;
    const allExpText = data.workExperiences
      .map((w) => `${w.jobTitle} ${w.company} ${w.highlights.join(' ')}`)
      .join(' ')
      .toLowerCase();

    if (data.workExperiences.length >= 1) expScore += 10;
    if (data.workExperiences.length >= 2) expScore += 5;

    // Check action verbs
    ACTION_VERBS.forEach((verb) => {
      if (allExpText.includes(verb)) {
        actionVerbsFound++;
      }
    });

    const actionVerbBonus = Math.min(15, actionVerbsFound * 3);
    expScore += actionVerbBonus;
    score += expScore;

    if (actionVerbsFound < 3) {
      feedback.push({
        type: 'warning',
        category: 'Experience Bullets',
        message: `Use high-impact action verbs (e.g., "Engineered", "Spearheaded", "Optimized"). Found: ${actionVerbsFound}.`,
      });
    } else {
      feedback.push({
        type: 'success',
        category: 'Experience Bullets',
        message: `Great action verb usage (${actionVerbsFound} found) showing high-impact achievements.`,
      });
    }

    // 3. Education & Skills Structure (25 points max)
    let eduSkillScore = 0;
    if (data.educations.length >= 1) eduSkillScore += 10;
    const totalSkillsCount = data.skillCategories.reduce((acc, cat) => acc + cat.skills.length, 0);

    if (totalSkillsCount >= 5) eduSkillScore += 8;
    if (totalSkillsCount >= 10) eduSkillScore += 7;
    score += eduSkillScore;

    if (totalSkillsCount < 6) {
      feedback.push({
        type: 'warning',
        category: 'Skills Section',
        message: 'Add at least 6-10 technical skills categorized logically for scanner indexing.',
      });
    }

    // 4. Job Description Keyword Match (25 points max)
    if (jobDescriptionText.trim().length > 20) {
      const jdLower = jobDescriptionText.toLowerCase();
      const resumeLower = (
        JSON.stringify(data.personalInfo) +
        JSON.stringify(data.workExperiences) +
        JSON.stringify(data.skillCategories) +
        JSON.stringify(data.projects)
      ).toLowerCase();

      let jdMatches = 0;
      COMMON_TECH_KEYWORDS.forEach((kw) => {
        if (jdLower.includes(kw)) {
          extractedKeywords.push(kw);
          if (resumeLower.includes(kw)) {
            jdMatches++;
          } else {
            missingKeywords.push(kw);
          }
        }
      });

      const keywordRatio = extractedKeywords.length > 0 ? jdMatches / extractedKeywords.length : 1;
      const jdScore = Math.round(keywordRatio * 25);
      score += jdScore;

      if (missingKeywords.length > 0) {
        feedback.push({
          type: 'error',
          category: 'JD Match',
          message: `Missing ${missingKeywords.length} target keywords from Job Description: ${missingKeywords.slice(0, 5).join(', ')}.`,
        });
      } else {
        feedback.push({
          type: 'success',
          category: 'JD Match',
          message: 'Excellent keyword alignment with the targeted Job Description.',
        });
      }
    } else {
      // Default bonus for complete layout
      score += 20;
      feedback.push({
        type: 'warning',
        category: 'Job Description',
        message: 'Paste a target Job Description to benchmark your ATS match percentage.',
      });
    }

    const finalScore = Math.min(100, Math.max(0, score));
    let rating: ATSAnalysisResult['rating'] = 'Needs Work';
    if (finalScore >= 85) rating = 'Excellent';
    else if (finalScore >= 70) rating = 'Great';
    else if (finalScore >= 50) rating = 'Good';

    return {
      score: finalScore,
      rating,
      feedback,
      extractedKeywords,
      missingKeywords,
      actionVerbsCount: actionVerbsFound,
    };
  }

  /**
   * Match Job Description & return tailored recommendations
   */
  static matchJobDescription(jobTitle: string, jobDescriptionText: string): JDSuggestion {
    const jdLower = jobDescriptionText.toLowerCase();
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    COMMON_TECH_KEYWORDS.forEach((kw) => {
      if (jdLower.includes(kw)) {
        matchedSkills.push(kw.toUpperCase());
      } else if (Math.random() > 0.6) {
        missingSkills.push(kw.toUpperCase());
      }
    });

    const topSkills = matchedSkills.length > 0 ? matchedSkills.slice(0, 5).join(', ') : 'modern tech stacks and frontend architecture';
    const roleTitle = jobTitle.trim() || 'Software Engineer';

    const recommendedSummary = `Results-oriented ${roleTitle} with proven expertise in ${topSkills}. Track record of architecting scalable applications, improving system efficiency, and collaborating in agile engineering teams.`;

    const suggestedBullets = [
      `Engineered high-throughput features for ${roleTitle} platform utilizing ${matchedSkills[0] || 'React'} and ${matchedSkills[1] || 'TypeScript'}, improving page load speed by 35%.`,
      `Collaborated with cross-functional teams to design RESTful and GraphQL APIs using ${matchedSkills[2] || 'Node.js'}, reducing system latency.`,
      `Optimized deployment pipelines with CI/CD tools and automated testing suites to guarantee 99.9% uptime.`,
      `Led performance benchmarking and code reviews to enforce strict UI standards and accessibility compliance across all modules.`,
    ];

    return {
      matchedSkills: matchedSkills.slice(0, 10),
      missingSkills: missingSkills.slice(0, 6),
      recommendedSummary,
      suggestedBullets,
    };
  }

  /**
   * Generate AI Summary using Gemini API or smart fallback
   */
  static async generateAISummary(
    jobTitle: string,
    skills: string[],
    apiKey: string = ''
  ): Promise<string> {
    if (apiKey.trim()) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `Write a compelling, professional 3-sentence resume summary for a ${jobTitle} possessing skills in ${skills.join(', ')}. Keep it ATS friendly, action-oriented, and impactful.`,
                    },
                  ],
                },
              ],
            }),
          }
        );
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text.trim();
      } catch (err) {
        console.warn('Gemini API call failed, using client AI engine fallback', err);
      }
    }

    // Client-side AI Fallback
    const skillsList = skills.length > 0 ? skills.slice(0, 4).join(', ') : 'Full Stack Web Development & System Design';
    return `Dynamic ${jobTitle || 'Software Engineer'} with strong expertise in ${skillsList}. Experienced in delivering scalable web solutions, optimizing frontend user interfaces, and collaborating in fast-paced software development environments. Committed to continuous learning and technical excellence.`;
  }
}
