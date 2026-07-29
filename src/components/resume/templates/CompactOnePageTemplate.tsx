import React from 'react';
import type { ResumeData } from '../../../types/resume';

interface Props {
  data: ResumeData;
}

export const CompactOnePageTemplate: React.FC<Props> = ({ data }) => {
  const { personalInfo, workExperiences, educations, skillCategories, projects, certifications, settings } = data;
  const accent = settings.accentColor || '#334155';

  return (
    <div
      className="w-full bg-white text-slate-900 font-sans p-6 sm:p-8 shadow-xl rounded-lg max-w-[850px] mx-auto overflow-hidden leading-tight text-xs"
      id="printable-resume"
    >
      {/* Compact Header */}
      <header className="flex justify-between items-center border-b pb-3 mb-4" style={{ borderColor: accent }}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{personalInfo.fullName || 'YOUR NAME'}</h1>
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{personalInfo.jobTitle}</p>
        </div>
        <div className="text-right text-[11px] text-slate-600 space-y-0.5 font-mono">
          <div>{personalInfo.email} • {personalInfo.phone}</div>
          <div>{personalInfo.location} • {personalInfo.github}</div>
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-3">
          <p className="text-[11px] text-slate-700 leading-snug">{personalInfo.summary}</p>
        </section>
      )}

      {/* Skills 3-column matrix */}
      {skillCategories.length > 0 && (
        <section className="mb-3 border-y py-2 border-slate-200">
          <div className="grid grid-cols-3 gap-2">
            {skillCategories.map((cat) => (
              <div key={cat.id} className="text-[10px]">
                <span className="font-bold text-slate-900">{cat.categoryName}: </span>
                <span className="text-slate-700">{cat.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Work Experience */}
      {workExperiences.length > 0 && (
        <section className="mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 border-b pb-0.5 mb-2" style={{ color: accent }}>
            Work Experience
          </h2>
          <div className="space-y-3">
            {workExperiences.map((exp) => (
              <div key={exp.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span>{exp.jobTitle} <span className="font-normal text-slate-600">| {exp.company}</span></span>
                  <span className="text-[10px] font-mono text-slate-500">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-700">
                  {exp.highlights.map((h, i) => (
                    <li key={i} className="leading-snug">{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Grid for Projects & Education & Certs */}
      <div className="grid grid-cols-2 gap-4 border-t pt-2 border-slate-200">
        {projects.length > 0 && (
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 mb-1" style={{ color: accent }}>
              Projects
            </h2>
            {projects.map((p) => (
              <div key={p.id} className="mb-1 text-[11px]">
                <span className="font-bold text-slate-900">{p.title}: </span>
                <span className="text-slate-600">{p.description}</span>
              </div>
            ))}
          </section>
        )}

        <div>
          {educations.length > 0 && (
            <section className="mb-2">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 mb-1" style={{ color: accent }}>
                Education
              </h2>
              {educations.map((edu) => (
                <div key={edu.id} className="text-[11px]">
                  <span className="font-bold text-slate-900">{edu.degree}</span> - {edu.institution} ({edu.endDate})
                </div>
              ))}
            </section>
          )}

          {certifications.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 mb-1" style={{ color: accent }}>
                Certifications
              </h2>
              {certifications.map((c) => (
                <div key={c.id} className="text-[11px]">
                  <span className="font-bold text-slate-900">{c.name}</span> ({c.issuer})
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
