import React from 'react';
import type { ResumeData } from '../../../types/resume';

interface Props {
  data: ResumeData;
}

export const ExecutiveSuiteTemplate: React.FC<Props> = ({ data }) => {
  const { personalInfo, workExperiences, educations, skillCategories, projects, certifications, settings } = data;
  const accent = settings.accentColor || '#1e3a8a';

  return (
    <div
      className="w-full bg-white text-slate-900 font-serif p-8 sm:p-12 shadow-2xl rounded-xl max-w-[850px] mx-auto overflow-hidden leading-relaxed"
      id="printable-resume"
    >
      {/* Header Banner */}
      <header className="border-b-4 pb-6 mb-6 text-center" style={{ borderColor: accent }}>
        <h1 className="text-4xl font-bold tracking-tight uppercase text-slate-900 mb-1" style={{ color: accent }}>
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        <div className="text-sm font-semibold tracking-widest uppercase text-amber-700 mb-3 font-sans">
          {personalInfo.jobTitle || 'EXECUTIVE LEADERSHIP'}
        </div>
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 font-sans font-medium">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-6 bg-slate-50 p-4 border-l-4 border-amber-600 rounded-r-md">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1 font-sans">Executive Profile</h2>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">{personalInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      {workExperiences.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-xs font-bold uppercase tracking-widest border-b-2 pb-1 mb-4 font-sans"
            style={{ color: accent, borderColor: accent }}
          >
            Professional Leadership & Experience
          </h2>
          <div className="space-y-5">
            {workExperiences.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex flex-col sm:flex-row justify-between items-start font-sans">
                  <div>
                    <span className="font-bold text-sm text-slate-900">{exp.jobTitle}</span>
                    <span className="text-xs font-semibold text-slate-600"> — {exp.company}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-slate-700 font-sans">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Core Competencies */}
      {skillCategories.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-xs font-bold uppercase tracking-widest border-b-2 pb-1 mb-3 font-sans"
            style={{ color: accent, borderColor: accent }}
          >
            Executive Competencies & Tech Stack
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans text-xs">
            {skillCategories.map((cat) => (
              <div key={cat.id} className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <div className="font-bold text-slate-900 mb-1">{cat.categoryName}</div>
                <div className="text-slate-700">{cat.skills.join(' • ')}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Initiatives / Projects */}
      {projects.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-xs font-bold uppercase tracking-widest border-b-2 pb-1 mb-3 font-sans"
            style={{ color: accent, borderColor: accent }}
          >
            Key Strategic Projects
          </h2>
          <div className="space-y-2 font-sans text-xs">
            {projects.map((p) => (
              <div key={p.id} className="p-2 bg-slate-50 border border-slate-200 rounded">
                <div className="font-bold text-slate-900">{p.title}</div>
                <div className="text-slate-700">{p.description}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Certifications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans">
        {educations.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-widest border-b-2 pb-1 mb-3"
              style={{ color: accent, borderColor: accent }}
            >
              Education
            </h2>
            {educations.map((edu) => (
              <div key={edu.id} className="text-xs mb-2">
                <div className="font-bold text-slate-900">{edu.degree}</div>
                <div className="text-slate-600">{edu.institution} ({edu.startDate} – {edu.endDate})</div>
              </div>
            ))}
          </section>
        )}

        {certifications.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-widest border-b-2 pb-1 mb-3"
              style={{ color: accent, borderColor: accent }}
            >
              Credentials & Honors
            </h2>
            {certifications.map((c) => (
              <div key={c.id} className="text-xs mb-2">
                <div className="font-bold text-slate-900">{c.name}</div>
                <div className="text-slate-600">{c.issuer} · {c.date}</div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};
