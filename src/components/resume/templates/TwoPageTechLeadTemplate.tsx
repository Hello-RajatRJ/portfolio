import React from 'react';
import type { ResumeData } from '../../../types/resume';

interface Props {
  data: ResumeData;
}

export const TwoPageTechLeadTemplate: React.FC<Props> = ({ data }) => {
  const { personalInfo, workExperiences, educations, skillCategories, projects, certifications, settings } = data;
  const accent = settings.accentColor || '#059669';

  return (
    <div
      className="w-full bg-white text-slate-900 font-sans p-8 sm:p-12 shadow-2xl rounded-xl max-w-[850px] mx-auto overflow-hidden leading-relaxed space-y-8"
      id="printable-resume"
    >
      {/* PAGE 1 TOP BANNER */}
      <header className="border-b-2 pb-6 border-slate-200 flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <div className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-widest mb-1">// SENIOR TECH LEAD & ARCHITECT</div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{personalInfo.fullName || 'YOUR NAME'}</h1>
          <p className="text-sm font-semibold text-slate-700 mt-1">{personalInfo.jobTitle}</p>
        </div>
        <div className="text-xs font-mono text-slate-600 space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
          {personalInfo.email && <div>email: {personalInfo.email}</div>}
          {personalInfo.phone && <div>phone: {personalInfo.phone}</div>}
          {personalInfo.github && <div className="text-emerald-700 font-bold">github: {personalInfo.github}</div>}
          {personalInfo.location && <div>loc: {personalInfo.location}</div>}
        </div>
      </header>

      {/* SUMMARY ARCHITECTURE VISION */}
      {personalInfo.summary && (
        <section className="bg-slate-900 text-white p-6 rounded-xl space-y-2">
          <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">// ENGINEERING PHILOSOPHY & SUMMARY</div>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-200 font-normal">{personalInfo.summary}</p>
        </section>
      )}

      {/* TECH STACK & SYSTEM DOMAINS MATRIX */}
      {skillCategories.length > 0 && (
        <section>
          <h2 className="text-xs font-black font-mono uppercase tracking-wider mb-3 text-slate-500">// TECHNICAL DOMAINS & TOOLKIT</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {skillCategories.map((cat) => (
              <div key={cat.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <div className="text-xs font-bold text-slate-900 font-mono border-b pb-1" style={{ borderColor: accent }}>
                  {cat.categoryName}
                </div>
                <div className="flex flex-wrap gap-1">
                  {cat.skills.map((s, i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EXPERIENCE - RECENT LEADS */}
      {workExperiences.length > 0 && (
        <section>
          <h2 className="text-xs font-black font-mono uppercase tracking-wider mb-4 text-slate-500">// WORK EXPERIENCE (PAGE 1)</h2>
          <div className="space-y-6">
            {workExperiences.slice(0, 2).map((exp) => (
              <div key={exp.id} className="relative pl-4 border-l-2 border-slate-300 space-y-2">
                <div className="flex flex-col sm:flex-row justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{exp.jobTitle}</h3>
                    <div className="text-xs font-semibold text-emerald-700">{exp.company} {exp.location && `(${exp.location})`}</div>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700">
                  {exp.highlights.map((h, i) => (
                    <li key={i} className="leading-relaxed">{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PAGE BREAK INDICATOR */}
      <div className="border-t-2 border-dashed border-slate-300 pt-6 mt-8 text-center text-[10px] font-mono text-slate-400 print:break-after-page">
        --- PAGE 1 END • CONTINUED ON PAGE 2 ---
      </div>

      {/* PAGE 2 HEADER */}
      <div className="flex justify-between items-center text-xs font-mono text-slate-500 border-b pb-2 pt-4">
        <span>{personalInfo.fullName} — Tech Lead & System Architect (Page 2)</span>
        <span>{personalInfo.github}</span>
      </div>

      {/* EXPERIENCE - CONTINUED */}
      {workExperiences.length > 2 && (
        <section>
          <h2 className="text-xs font-black font-mono uppercase tracking-wider mb-4 text-slate-500">// WORK EXPERIENCE (PAGE 2 CONTINUED)</h2>
          <div className="space-y-6">
            {workExperiences.slice(2).map((exp) => (
              <div key={exp.id} className="relative pl-4 border-l-2 border-slate-300 space-y-2">
                <div className="flex flex-col sm:flex-row justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{exp.jobTitle}</h3>
                    <div className="text-xs font-semibold text-emerald-700">{exp.company}</div>
                  </div>
                  <span className="text-xs font-mono text-slate-500">{exp.startDate} – {exp.endDate}</span>
                </div>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* DETAILED SYSTEM CASE STUDIES & PROJECTS */}
      {projects.length > 0 && (
        <section>
          <h2 className="text-xs font-black font-mono uppercase tracking-wider mb-3 text-slate-500">// SYSTEM ARCHITECTURE CASE STUDIES</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((p) => (
              <div key={p.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-xs text-slate-900">{p.title}</div>
                  {p.link && <span className="text-[10px] text-emerald-600 font-mono">{p.link}</span>}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
                {p.highlights && p.highlights.length > 0 && (
                  <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 pt-1">
                    {p.highlights.map((h, hIdx) => (
                      <li key={hIdx}>{h}</li>
                    ))}
                  </ul>
                )}
                {p.techStack && p.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {p.techStack.map((tech, i) => (
                      <span key={i} className="text-[9px] font-mono px-1.5 py-0.2 bg-white border border-slate-200 rounded text-slate-700">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EDUCATION & CERTIFICATIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
        {educations.length > 0 && (
          <section>
            <h2 className="text-xs font-black font-mono uppercase tracking-wider mb-2 text-slate-500">// DEGREES & EDUCATION</h2>
            {educations.map((edu) => (
              <div key={edu.id} className="text-xs space-y-0.5">
                <div className="font-bold text-slate-900">{edu.degree}</div>
                <div className="text-slate-600">{edu.institution} ({edu.startDate} – {edu.endDate})</div>
              </div>
            ))}
          </section>
        )}

        {certifications.length > 0 && (
          <section>
            <h2 className="text-xs font-black font-mono uppercase tracking-wider mb-2 text-slate-500">// CLOUD & TECH CERTIFICATIONS</h2>
            {certifications.map((c) => (
              <div key={c.id} className="text-xs space-y-0.5">
                <div className="font-bold text-slate-900">{c.name}</div>
                <div className="text-slate-600">{c.issuer} • {c.date}</div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};
