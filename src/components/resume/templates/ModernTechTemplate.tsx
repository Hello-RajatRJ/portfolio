import React from 'react';
import type { ResumeData } from '../../../types/resume';

interface Props {
  data: ResumeData;
}

export const ModernTechTemplate: React.FC<Props> = ({ data }) => {
  const { personalInfo, workExperiences, educations, skillCategories, projects, certifications, settings } = data;
  const accent = settings.accentColor || '#4f46e5';

  return (
    <div
      className="w-full bg-white text-slate-900 font-sans p-8 sm:p-12 shadow-xl rounded-xl max-w-[850px] mx-auto overflow-hidden leading-relaxed border-t-8"
      style={{ borderColor: accent }}
      id="printable-resume"
    >
      {/* Top Banner */}
      <header className="mb-6 flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-150">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">{personalInfo.fullName || 'YOUR NAME'}</h1>
          <p className="text-base font-bold tracking-wide mt-1" style={{ color: accent }}>
            {personalInfo.jobTitle || 'TECH TITLE'}
          </p>
        </div>
        <div className="flex flex-col text-xs text-slate-600 space-y-1 sm:text-right font-medium">
          {personalInfo.email && <div>{personalInfo.email}</div>}
          {personalInfo.phone && <div>{personalInfo.phone}</div>}
          {personalInfo.location && <div>{personalInfo.location}</div>}
          {personalInfo.github && <div className="text-indigo-600 font-mono">{personalInfo.github}</div>}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-6 bg-slate-50 p-4 rounded-lg border-l-4" style={{ borderColor: accent }}>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">{personalInfo.summary}</p>
        </section>
      )}

      {/* Skills Grid */}
      {skillCategories.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">Skills & Technologies</h2>
          <div className="space-y-2">
            {skillCategories.map((cat) => (
              <div key={cat.id} className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-xs font-bold text-slate-800 w-36 shrink-0">{cat.categoryName}:</span>
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {workExperiences.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-4">Professional Experience</h2>
          <div className="space-y-5">
            {workExperiences.map((exp) => (
              <div key={exp.id} className="relative pl-4 border-l-2 border-slate-200 space-y-1">
                <div className="flex flex-col sm:flex-row justify-between items-start">
                  <h3 className="font-bold text-sm text-slate-900">
                    {exp.jobTitle} <span className="font-semibold text-slate-600">@ {exp.company}</span>
                  </h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pt-1">
                  {exp.highlights.map((bullet, idx) => (
                    <li key={idx} className="leading-normal">{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">Featured Projects</h2>
          <div className="space-y-4">
            {projects.map((proj) => (
              <div key={proj.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div className="flex flex-col sm:flex-row justify-between items-start font-bold text-xs text-slate-900">
                  <span>
                    {proj.title} {proj.role && <span className="font-semibold text-indigo-600">({proj.role})</span>}
                  </span>
                  <div className="text-right text-[11px] text-slate-500 font-mono">
                    {proj.duration && <span className="mr-2">{proj.duration}</span>}
                    {proj.link && <span className="text-indigo-600 underline font-mono">{proj.link}</span>}
                  </div>
                </div>

                {proj.techStack && proj.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1 py-0.5">
                    <span className="text-[10px] font-bold text-slate-600 self-center mr-1">Tech:</span>
                    {proj.techStack.map((tech, idx) => (
                      <span key={idx} className="text-[9px] font-mono px-1.5 py-0.2 bg-white border border-slate-200 rounded text-slate-700 font-semibold">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {proj.description && <p className="text-[11px] text-slate-700 leading-snug">{proj.description}</p>}

                {proj.highlights && proj.highlights.length > 0 && (
                  <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-slate-700 pt-1">
                    {proj.highlights.map((h, idx) => (
                      <li key={idx} className="leading-snug">{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Certifications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {educations.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Education</h2>
            {educations.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="font-bold text-slate-900">{edu.degree}</div>
                <div className="text-slate-600">{edu.institution} ({edu.startDate} - {edu.endDate})</div>
              </div>
            ))}
          </section>
        )}

        {certifications.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Certifications</h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="text-xs">
                <div className="font-bold text-slate-900">{cert.name}</div>
                <div className="text-slate-600">{cert.issuer} · {cert.date}</div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};
