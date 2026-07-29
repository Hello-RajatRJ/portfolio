import React from 'react';
import type { ResumeData } from '../../../types/resume';

interface Props {
  data: ResumeData;
}

export const TwoPageExecutiveTemplate: React.FC<Props> = ({ data }) => {
  const { personalInfo, workExperiences, educations, skillCategories, projects, certifications, settings } = data;
  const accent = settings.accentColor || '#1e3a8a';

  return (
    <div
      className="w-full bg-white text-slate-900 font-serif shadow-2xl rounded-xl max-w-[850px] mx-auto overflow-hidden leading-relaxed space-y-8 p-8 sm:p-12 print:p-8"
      id="printable-resume"
    >
      {/* PAGE 1 HEADER */}
      <header className="border-b-4 pb-6 text-center" style={{ borderColor: accent }}>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 uppercase mb-2" style={{ color: accent }}>
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        <p className="text-sm font-sans font-bold tracking-widest uppercase text-amber-700 mb-4">
          {personalInfo.jobTitle || 'CHIEF TECHNOLOGY OFFICER & EXECUTIVE LEAD'}
        </p>
        <div className="flex justify-center flex-wrap gap-x-6 gap-y-1 text-xs text-slate-600 font-sans font-medium">
          {personalInfo.email && <span>📧 {personalInfo.email}</span>}
          {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
          {personalInfo.location && <span>📍 {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>🔗 {personalInfo.linkedin}</span>}
          {personalInfo.website && <span>🌐 {personalInfo.website}</span>}
        </div>
      </header>

      {/* EXECUTIVE SUMMARY */}
      {personalInfo.summary && (
        <section className="bg-slate-50 p-6 rounded-xl border-l-8 font-sans shadow-sm" style={{ borderColor: accent }}>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 font-mono">Executive Summary & Vibe</h2>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-serif">{personalInfo.summary}</p>
        </section>
      )}

      {/* CORE STRATEGIC COMPETENCIES */}
      {skillCategories.length > 0 && (
        <section>
          <h2
            className="text-xs font-bold uppercase tracking-widest border-b-2 pb-1 mb-4 font-sans"
            style={{ color: accent, borderColor: accent }}
          >
            I. Strategic Core Competencies & Architecture
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs">
            {skillCategories.map((cat) => (
              <div key={cat.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="font-bold text-slate-900 mb-1 font-mono text-[11px] uppercase tracking-wider">{cat.categoryName}</div>
                <div className="text-slate-700 leading-normal">{cat.skills.join(' • ')}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* WORK EXPERIENCE - PART 1 */}
      {workExperiences.length > 0 && (
        <section>
          <h2
            className="text-xs font-bold uppercase tracking-widest border-b-2 pb-1 mb-4 font-sans"
            style={{ color: accent, borderColor: accent }}
          >
            II. Senior Executive Career Track
          </h2>
          <div className="space-y-6">
            {workExperiences.slice(0, 2).map((exp) => (
              <div key={exp.id} className="space-y-2">
                <div className="flex flex-col sm:flex-row justify-between items-start font-sans">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{exp.jobTitle}</h3>
                    <div className="text-xs font-semibold text-amber-800">{exp.company} {exp.location && `• ${exp.location}`}</div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <ul className="list-disc list-outside pl-4 space-y-1.5 text-xs text-slate-700 font-sans leading-relaxed">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Explicit Page break for print / 2-page demarcation */}
      <div className="border-t-2 border-dashed border-slate-300 pt-6 mt-8 text-center text-[10px] font-mono text-slate-400 print:break-after-page">
        --- PAGE 1 END • CONTINUED ON PAGE 2 ---
      </div>

      {/* PAGE 2 HEADER BADGE */}
      <div className="flex justify-between items-center text-xs font-mono text-slate-500 border-b pb-2 pt-4">
        <span>{personalInfo.fullName} — Executive Resume (Page 2)</span>
        <span>{personalInfo.email}</span>
      </div>

      {/* WORK EXPERIENCE - PART 2 */}
      {workExperiences.length > 2 && (
        <section>
          <h2
            className="text-xs font-bold uppercase tracking-widest border-b-2 pb-1 mb-4 font-sans"
            style={{ color: accent, borderColor: accent }}
          >
            II. Senior Executive Career Track (Continued)
          </h2>
          <div className="space-y-6">
            {workExperiences.slice(2).map((exp) => (
              <div key={exp.id} className="space-y-2">
                <div className="flex flex-col sm:flex-row justify-between items-start font-sans">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{exp.jobTitle}</h3>
                    <div className="text-xs font-semibold text-amber-800">{exp.company}</div>
                  </div>
                  <span className="text-xs font-mono text-slate-500">{exp.startDate} – {exp.endDate}</span>
                </div>
                <ul className="list-disc list-outside pl-4 space-y-1.5 text-xs text-slate-700 font-sans">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* STRATEGIC PROJECTS & CASE STUDIES */}
      {projects.length > 0 && (
        <section>
          <h2
            className="text-xs font-bold uppercase tracking-widest border-b-2 pb-1 mb-4 font-sans"
            style={{ color: accent, borderColor: accent }}
          >
            III. Key Strategic Projects & Transformations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs">
            {projects.map((p) => (
              <div key={p.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <div className="font-bold text-slate-900 text-xs">{p.title}</div>
                {p.role && <div className="text-[11px] text-amber-700 font-semibold">{p.role}</div>}
                <p className="text-[11px] text-slate-600 leading-relaxed">{p.description}</p>
                {p.highlights && p.highlights.length > 0 && (
                  <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-1 pt-1">
                    {p.highlights.map((h, hIdx) => (
                      <li key={hIdx}>{h}</li>
                    ))}
                  </ul>
                )}
                {p.techStack && p.techStack.length > 0 && (
                  <div className="text-[10px] text-slate-500 font-mono pt-1">Tech: {p.techStack.join(', ')}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EDUCATION & CERTIFICATIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans border-t pt-6 border-slate-200">
        {educations.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-widest border-b-2 pb-1 mb-3"
              style={{ color: accent, borderColor: accent }}
            >
              IV. Education & Academic Background
            </h2>
            {educations.map((edu) => (
              <div key={edu.id} className="text-xs mb-3">
                <div className="font-bold text-slate-900">{edu.degree}</div>
                <div className="text-slate-700">{edu.fieldOfStudy} • {edu.institution}</div>
                <div className="text-slate-500 text-[11px]">{edu.startDate} – {edu.endDate} {edu.gpa && `(GPA: ${edu.gpa})`}</div>
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
              V. Professional Credentials & Advisory
            </h2>
            {certifications.map((c) => (
              <div key={c.id} className="text-xs mb-2">
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
