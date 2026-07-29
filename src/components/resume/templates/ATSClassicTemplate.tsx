import React from 'react';
import type { ResumeData } from '../../../types/resume';

interface Props {
  data: ResumeData;
}

export const ATSClassicTemplate: React.FC<Props> = ({ data }) => {
  const { personalInfo, workExperiences, educations, skillCategories, projects, certifications, settings } = data;
  const accent = settings.accentColor || '#1e293b';

  return (
    <div
      className="w-full bg-white text-slate-900 font-sans p-8 sm:p-12 print:p-6 print:text-black shadow-md rounded-lg max-w-[850px] mx-auto overflow-hidden leading-relaxed"
      id="printable-resume"
      style={{ fontFamily: settings.fontFamily === 'serif' ? 'Georgia, serif' : 'Inter, system-ui, sans-serif' }}
    >
      {/* Header */}
      <header className="border-b-2 pb-4 mb-6" style={{ borderColor: accent }}>
        <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-slate-900 mb-1">
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        <p className="text-lg font-semibold tracking-wide uppercase text-slate-700 mb-3">
          {personalInfo.jobTitle || 'PROFESSIONAL TITLE'}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 font-medium">
          {personalInfo.email && <span>📧 {personalInfo.email}</span>}
          {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
          {personalInfo.location && <span>📍 {personalInfo.location}</span>}
          {personalInfo.website && <span>🌐 {personalInfo.website}</span>}
          {personalInfo.linkedin && <span>🔗 {personalInfo.linkedin}</span>}
          {personalInfo.github && <span>💻 {personalInfo.github}</span>}
        </div>
      </header>

      {/* Professional Summary */}
      {personalInfo.summary && (
        <section className="mb-6">
          <h2
            className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-2 font-mono"
            style={{ color: accent, borderColor: `${accent}40` }}
          >
            Professional Summary
          </h2>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {workExperiences.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-3 font-mono"
            style={{ color: accent, borderColor: `${accent}40` }}
          >
            Work Experience
          </h2>
          <div className="space-y-4">
            {workExperiences.map((exp) => (
              <div key={exp.id} className="space-y-1 break-inside-avoid" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <span className="font-bold text-sm text-slate-900">
                    {exp.jobTitle} <span className="font-normal text-slate-600">| {exp.company}</span>
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate} {exp.location && `(${exp.location})`}
                  </span>
                </div>
                <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-slate-700">
                  {exp.highlights.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Competencies */}
      {skillCategories.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-2 font-mono"
            style={{ color: accent, borderColor: `${accent}40` }}
          >
            Skills & Competencies
          </h2>
          <div className="space-y-2">
            {skillCategories.map((cat) => (
              <div key={cat.id} className="text-xs">
                <span className="font-bold text-slate-900">{cat.categoryName}: </span>
                <span className="text-slate-700">{cat.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Projects */}
      {projects.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-3 font-mono"
            style={{ color: accent, borderColor: `${accent}40` }}
          >
            Key Projects
          </h2>
          <div className="space-y-4">
            {projects.map((proj) => (
              <div key={proj.id} className="text-xs space-y-1 break-inside-avoid" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                {/* 2. Role & Title & Duration Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start font-bold text-slate-900">
                  <span>
                    {proj.title}{' '}
                    {proj.role && <span className="font-normal text-slate-600">| Role: {proj.role}</span>}
                  </span>
                  <div className="text-right text-slate-500 text-[11px] font-semibold">
                    {proj.duration && <span className="mr-2 font-mono">{proj.duration}</span>}
                    {proj.link && <span className="font-normal underline text-indigo-700">{proj.link}</span>}
                  </div>
                </div>

                {/* 1. Technologies Used */}
                {proj.techStack && proj.techStack.length > 0 && (
                  <div className="text-[11px] font-semibold text-slate-700">
                    <span className="font-bold text-slate-900">Technologies Used: </span>
                    <span>{proj.techStack.join(', ')}</span>
                  </div>
                )}

                {/* 3. Description & ATS Bullet Points */}
                {proj.description && <p className="text-slate-700 leading-relaxed">{proj.description}</p>}
                {proj.highlights && proj.highlights.length > 0 && (
                  <ul className="list-disc list-outside pl-4 space-y-1 text-slate-700 pt-0.5">
                    {proj.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="leading-relaxed">{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {educations.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-3 font-mono"
            style={{ color: accent, borderColor: `${accent}40` }}
          >
            Education
          </h2>
          <div className="space-y-2">
            {educations.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start text-xs">
                <div>
                  <div className="font-bold text-slate-900">{edu.degree} - {edu.fieldOfStudy}</div>
                  <div className="text-slate-600">{edu.institution} {edu.gpa && `(GPA: ${edu.gpa})`}</div>
                </div>
                <div className="text-slate-500 text-right">{edu.startDate} – {edu.endDate}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mb-4">
          <h2
            className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-2 font-mono"
            style={{ color: accent, borderColor: `${accent}40` }}
          >
            Certifications & Honors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between">
                <span className="font-semibold text-slate-900">{cert.name}</span>
                <span className="text-slate-500">{cert.issuer} ({cert.date})</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
