import React from 'react';
import type { ResumeData } from '../../../types/resume';

interface Props {
  data: ResumeData;
}

export const SiliconValleyTemplate: React.FC<Props> = ({ data }) => {
  const { personalInfo, workExperiences, educations, skillCategories, projects, certifications, settings } = data;
  const accent = settings.accentColor || '#0284c7';

  return (
    <div
      className="w-full bg-white text-slate-900 font-sans p-8 sm:p-12 shadow-2xl rounded-xl max-w-[850px] mx-auto overflow-hidden leading-relaxed"
      id="printable-resume"
    >
      {/* Code-Inspired Tech Header */}
      <header className="mb-6 bg-slate-900 text-white p-6 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-slate-500">// SILICON VALLEY FORMAT</div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-1">{personalInfo.fullName || 'YOUR NAME'}</h1>
        <div className="text-xs font-mono text-cyan-400 font-semibold mb-3">{`<${personalInfo.jobTitle || 'SOFTWARE_ENGINEER'} />`}</div>
        <div className="flex flex-wrap gap-3 text-xs text-slate-300 font-mono">
          {personalInfo.email && <span className="bg-slate-800 px-2 py-0.5 rounded">e: {personalInfo.email}</span>}
          {personalInfo.phone && <span className="bg-slate-800 px-2 py-0.5 rounded">p: {personalInfo.phone}</span>}
          {personalInfo.github && <span className="bg-slate-800 px-2 py-0.5 rounded text-cyan-300">{personalInfo.github}</span>}
          {personalInfo.location && <span className="bg-slate-800 px-2 py-0.5 rounded">loc: {personalInfo.location}</span>}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-6">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">{personalInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      {workExperiences.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-black uppercase tracking-wider font-mono mb-4 text-slate-400">
            // EXPERIENCE_TIMELINE
          </h2>
          <div className="space-y-5">
            {workExperiences.map((exp) => (
              <div key={exp.id} className="border-l-2 border-slate-200 pl-4 space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {exp.jobTitle} <span className="font-semibold text-sky-700">@ {exp.company}</span>
                  </h3>
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    {exp.startDate} → {exp.current ? 'PRESENT' : exp.endDate}
                  </span>
                </div>
                <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tech Stack Grid */}
      {skillCategories.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-black uppercase tracking-wider font-mono mb-3 text-slate-400">
            // TECH_STACK_MATRIX
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {skillCategories.map((cat) => (
              <div key={cat.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <div className="text-xs font-bold text-slate-900 font-mono">{cat.categoryName}</div>
                <div className="flex flex-wrap gap-1">
                  {cat.skills.map((s, i) => (
                    <span key={i} className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-100 text-sky-900 font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects & Education */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {projects.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider font-mono mb-2 text-slate-400">// PROJECTS</h2>
            {projects.map((p) => (
              <div key={p.id} className="text-xs mb-2">
                <div className="font-bold text-slate-900">{p.title}</div>
                <div className="text-slate-600 leading-snug">{p.description}</div>
              </div>
            ))}
          </section>
        )}

        {educations.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider font-mono mb-2 text-slate-400">// EDUCATION</h2>
            {educations.map((edu) => (
              <div key={edu.id} className="text-xs mb-2">
                <div className="font-bold text-slate-900">{edu.degree}</div>
                <div className="text-slate-600">{edu.institution} ({edu.startDate}-{edu.endDate})</div>
              </div>
            ))}
          </section>
        )}

        {certifications.length > 0 && (
          <section className="col-span-1 sm:col-span-2 pt-2 border-t border-slate-100">
            <h2 className="text-xs font-black uppercase tracking-wider font-mono mb-2" style={{ color: accent }}>// CERTIFICATIONS</h2>
            <div className="flex flex-wrap gap-4 text-xs font-mono">
              {certifications.map((c) => (
                <div key={c.id}>
                  <span className="font-bold text-slate-900">{c.name}</span> <span className="text-slate-500">({c.issuer})</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
