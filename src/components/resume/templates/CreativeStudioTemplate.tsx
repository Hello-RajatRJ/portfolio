import React from 'react';
import type { ResumeData } from '../../../types/resume';

interface Props {
  data: ResumeData;
}

export const CreativeStudioTemplate: React.FC<Props> = ({ data }) => {
  const { personalInfo, workExperiences, educations, skillCategories, projects, certifications, settings } = data;
  const accent = settings.accentColor || '#7c3aed';

  return (
    <div
      className="w-full bg-white text-slate-900 font-sans shadow-2xl rounded-xl max-w-[850px] mx-auto overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[800px]"
      id="printable-resume"
    >
      {/* Left Sidebar */}
      <aside className="md:col-span-4 bg-slate-900 text-white p-6 sm:p-8 flex flex-col justify-between space-y-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight mb-1 text-white">{personalInfo.fullName || 'YOUR NAME'}</h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-6">{personalInfo.jobTitle}</p>

          {/* Contact Details */}
          <div className="space-y-3 border-t border-slate-800 pt-4 text-xs text-slate-300">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Contact</h3>
            {personalInfo.email && <div className="break-all">📧 {personalInfo.email}</div>}
            {personalInfo.phone && <div>📞 {personalInfo.phone}</div>}
            {personalInfo.location && <div>📍 {personalInfo.location}</div>}
            {personalInfo.website && <div className="break-all">🌐 {personalInfo.website}</div>}
            {personalInfo.github && <div className="break-all">💻 {personalInfo.github}</div>}
          </div>

          {/* Skills */}
          {skillCategories.length > 0 && (
            <div className="space-y-4 border-t border-slate-800 pt-4 mt-6">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Core Expertise</h3>
              {skillCategories.map((cat) => (
                <div key={cat.id} className="space-y-1">
                  <div className="text-xs font-semibold text-indigo-300">{cat.categoryName}</div>
                  <div className="flex flex-wrap gap-1">
                    {cat.skills.map((s, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="space-y-2 border-t border-slate-800 pt-4 mt-6 text-xs text-slate-300">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Certifications</h3>
              {certifications.map((c) => (
                <div key={c.id}>
                  <div className="font-semibold text-white">{c.name}</div>
                  <div className="text-[10px] text-slate-400">{c.issuer}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:col-span-8 p-6 sm:p-8 space-y-6">
        {/* Summary */}
        {personalInfo.summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">About Me</h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{personalInfo.summary}</p>
          </section>
        )}

        {/* Experience */}
        {workExperiences.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-4"
              style={{ color: accent, borderColor: `${accent}40` }}
            >
              Experience
            </h2>
            <div className="space-y-4">
              {workExperiences.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-sm text-slate-900">{exp.jobTitle}</h3>
                    <span className="text-xs text-slate-500 font-semibold">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-600 mb-1">{exp.company}</div>
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

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-3"
              style={{ color: accent, borderColor: `${accent}40` }}
            >
              Featured Projects
            </h2>
            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id} className="text-xs space-y-1.5">
                  <div className="flex justify-between items-baseline font-bold text-slate-900">
                    <span>
                      {proj.title} {proj.role && <span className="font-normal text-slate-600">({proj.role})</span>}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">{proj.duration}</span>
                  </div>

                  {proj.techStack && proj.techStack.length > 0 && (
                    <div className="text-[11px] font-semibold text-purple-700">
                      Technologies Used: {proj.techStack.join(', ')}
                    </div>
                  )}

                  {proj.description && <p className="text-slate-600 leading-relaxed">{proj.description}</p>}

                  {proj.highlights && proj.highlights.length > 0 && (
                    <ul className="list-disc list-outside pl-4 space-y-1 text-slate-700">
                      {proj.highlights.map((h, i) => (
                        <li key={i} className="leading-snug">{h}</li>
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
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-2"
              style={{ color: accent, borderColor: `${accent}40` }}
            >
              Education
            </h2>
            {educations.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="font-bold text-slate-900">{edu.degree} - {edu.fieldOfStudy}</div>
                <div className="text-slate-600">{edu.institution} ({edu.startDate} - {edu.endDate})</div>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};
