import React from 'react';
import type { ResumeData } from '../../../types/resume';

interface Props {
  data: ResumeData;
}

export const AcademicCVTemplate: React.FC<Props> = ({ data }) => {
  const { personalInfo, workExperiences, educations, skillCategories, projects, certifications, settings } = data;
  const accent = settings.accentColor || '#1e293b';

  return (
    <div
      className="w-full bg-white text-slate-900 font-serif p-8 sm:p-12 shadow-xl rounded-lg max-w-[850px] mx-auto overflow-hidden leading-relaxed"
      id="printable-resume"
    >
      {/* Formal Header */}
      <header className="border-b-2 pb-4 mb-6" style={{ borderColor: accent }}>
        <h1 className="text-3xl font-normal tracking-tight text-slate-900 uppercase mb-1">{personalInfo.fullName || 'YOUR NAME'}</h1>
        <div className="text-sm italic text-slate-700 mb-3">{personalInfo.jobTitle || 'Curriculum Vitae'}</div>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-600 font-sans">
          {personalInfo.email && <span>Email: {personalInfo.email}</span>}
          {personalInfo.phone && <span>Tel: {personalInfo.phone}</span>}
          {personalInfo.location && <span>Location: {personalInfo.location}</span>}
          {personalInfo.website && <span>Web: {personalInfo.website}</span>}
        </div>
      </header>

      {/* Summary / Research Focus */}
      {personalInfo.summary && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 font-sans border-b border-slate-300 pb-1 mb-2">
            1. Research & Professional Focus
          </h2>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">{personalInfo.summary}</p>
        </section>
      )}

      {/* Education First for Academic CV */}
      {educations.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 font-sans border-b border-slate-300 pb-1 mb-3">
            2. Education & Academic Background
          </h2>
          <div className="space-y-3 font-sans">
            {educations.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start text-xs">
                <div>
                  <div className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</div>
                  <div className="text-slate-700">{edu.institution} {edu.gpa && `— GPA: ${edu.gpa}`}</div>
                </div>
                <div className="text-slate-500 font-mono">{edu.startDate} – {edu.endDate}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {workExperiences.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 font-sans border-b border-slate-300 pb-1 mb-3">
            3. Professional Appointments & Experience
          </h2>
          <div className="space-y-4 font-sans">
            {workExperiences.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-start text-xs">
                  <span className="font-bold text-slate-900">
                    {exp.jobTitle}, <span className="font-normal italic">{exp.company}</span>
                  </span>
                  <span className="text-slate-500 font-mono">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-slate-700">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Publications / Projects */}
      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 font-sans border-b border-slate-300 pb-1 mb-3">
            4. Research Projects & Publications
          </h2>
          <div className="space-y-3 font-sans text-xs">
            {projects.map((p) => (
              <div key={p.id}>
                <div className="font-bold text-slate-900">"{p.title}"</div>
                <div className="text-slate-700">{p.description}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Technical Skills & Certifications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans">
        {skillCategories.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">
              5. Technical Competencies
            </h2>
            {skillCategories.map((cat) => (
              <div key={cat.id} className="text-xs mb-1">
                <span className="font-bold text-slate-900">{cat.categoryName}: </span>
                <span className="text-slate-700">{cat.skills.join(', ')}</span>
              </div>
            ))}
          </section>
        )}

        {certifications.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">
              6. Awards & Certifications
            </h2>
            {certifications.map((c) => (
              <div key={c.id} className="text-xs mb-1">
                <span className="font-bold text-slate-900">{c.name}</span> — {c.issuer} ({c.date})
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};
