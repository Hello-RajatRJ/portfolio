import type { ResumeData } from '../../../types/resume';

interface Props {
  data: ResumeData;
}

export const MinimalistTemplate: React.FC<Props> = ({ data }) => {
  const { personalInfo, workExperiences, educations, skillCategories, projects, certifications, settings } = data;
  const accent = settings.accentColor || '#0f172a';

  return (
    <div
      className="w-full bg-white text-slate-800 font-sans p-8 sm:p-12 shadow-lg rounded-lg max-w-[850px] mx-auto overflow-hidden leading-relaxed"
      id="printable-resume"
    >
      {/* Minimal Header */}
      <header className="text-center mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-light tracking-widest uppercase text-slate-900 mb-1">{personalInfo.fullName || 'YOUR NAME'}</h1>
        <p className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-4">{personalInfo.jobTitle}</p>
        <div className="flex justify-center flex-wrap gap-4 text-[11px] text-slate-500 font-mono">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>· {personalInfo.phone}</span>}
          {personalInfo.location && <span>· {personalInfo.location}</span>}
          {personalInfo.website && <span>· {personalInfo.website}</span>}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-6 border-l-2 pl-4 py-1 border-slate-200">
          <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      {workExperiences.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-1" style={{ color: accent }}>
            Experience
          </h2>
          <div className="space-y-4">
            {workExperiences.map((exp) => (
              <div key={exp.id} className="space-y-1 break-inside-avoid" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-bold text-slate-900">{exp.jobTitle} — <span className="font-normal text-slate-600">{exp.company}</span></span>
                  <span className="text-slate-400 font-mono">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 pl-2">
                  {exp.highlights.map((h, idx) => (
                    <li key={idx}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skillCategories.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 border-b border-slate-100 pb-1" style={{ color: accent }}>
            Skills
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {skillCategories.map((cat) => (
              <div key={cat.id}>
                <span className="font-semibold text-slate-800">{cat.categoryName}: </span>
                <span className="text-slate-600">{cat.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 border-b border-slate-100 pb-1" style={{ color: accent }}>
            Projects
          </h2>
          <div className="space-y-3 text-xs">
            {projects.map((proj) => (
              <div key={proj.id} className="space-y-1">
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span>
                    {proj.title} {proj.role && <span className="font-normal text-slate-600">({proj.role})</span>}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{proj.duration}</span>
                </div>
                {proj.techStack && proj.techStack.length > 0 && (
                  <div className="text-[11px] font-semibold text-slate-700">Tech: {proj.techStack.join(', ')}</div>
                )}
                {proj.description && <p className="text-slate-600">{proj.description}</p>}
                {proj.highlights && proj.highlights.length > 0 && (
                  <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-700">
                    {proj.highlights.map((h, hIdx) => (
                      <li key={hIdx}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Certs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {educations.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 border-b border-slate-100 pb-1" style={{ color: accent }}>
              Education
            </h2>
            {educations.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="font-bold text-slate-900">{edu.degree}</div>
                <div className="text-slate-500">{edu.institution} ({edu.startDate}-{edu.endDate})</div>
              </div>
            ))}
          </section>
        )}

        {certifications.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 border-b border-slate-100 pb-1" style={{ color: accent }}>
              Certifications
            </h2>
            {certifications.map((c) => (
              <div key={c.id} className="text-xs">
                <div className="font-bold text-slate-900">{c.name}</div>
                <div className="text-slate-500">{c.issuer}</div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};
