import React from 'react';
import type { ResumeData } from '../../../types/resume';
import type { TemplateConfig } from '../../../data/templateConfigs';

interface Props {
  data: ResumeData;
  config: TemplateConfig;
}

export const ConfigurableTemplate: React.FC<Props> = ({ data, config }) => {
  const { personalInfo, workExperiences, educations, skillCategories, projects, certifications, settings } = data;
  const accent = settings.accentColor || config.defaultAccent;

  const fontClass =
    config.fontProfile === 'serif'
      ? 'font-serif'
      : config.fontProfile === 'mono'
        ? 'font-mono'
        : 'font-sans';

  const spacingClass =
    config.spacing === 'compact' ? 'text-[11px] leading-snug' : config.spacing === 'relaxed' ? 'text-xs leading-relaxed' : 'text-xs leading-normal';

  const titleCase =
    config.sectionTitleCase === 'uppercase' ? 'uppercase' : config.sectionTitleCase === 'capitalize' ? 'capitalize' : 'normal-case';

  const isDark = config.bodyBg === '#0f172a';
  const textPrimary = isDark ? 'text-slate-100' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-300' : 'text-slate-700';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';
  const borderColor = isDark ? 'border-slate-700' : 'border-slate-200';

  // ── Section Title Renderer ──
  const SectionTitle: React.FC<{ title: string }> = ({ title }) => {
    const base = `text-xs font-bold tracking-widest mb-3 pb-1 ${titleCase}`;
    switch (config.sectionDivider) {
      case 'line':
        return <h2 className={`${base} border-b ${borderColor}`} style={{ color: accent }}>{title}</h2>;
      case 'double-line':
        return <h2 className={`${base} border-b-2 ${borderColor}`} style={{ color: accent, borderColor: accent }}>{title}</h2>;
      case 'thick-underline':
        return <h2 className={`${base} border-b-4 pb-2`} style={{ color: accent, borderColor: `${accent}40` }}>{title}</h2>;
      case 'accent-bar':
        return (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 rounded-full" style={{ backgroundColor: accent }} />
            <h2 className={`text-xs font-bold tracking-widest ${titleCase}`} style={{ color: accent }}>{title}</h2>
          </div>
        );
      case 'dot':
        return (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
            <h2 className={`text-xs font-bold tracking-widest ${titleCase}`} style={{ color: accent }}>{title}</h2>
            <div className={`flex-1 border-b ${borderColor}`} />
          </div>
        );
      default:
        return <h2 className={`${base}`} style={{ color: accent }}>{title}</h2>;
    }
  };

  // ── Header Renderer ──
  const renderHeader = () => {
    const contactItems = [
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
      personalInfo.website,
      personalInfo.linkedin,
      personalInfo.github,
    ].filter(Boolean);

    switch (config.headerStyle) {
      case 'centered':
        return (
          <header className="text-center mb-6 pb-4 border-b" style={{ borderColor: `${accent}30` }}>
            <h1 className={`text-2xl font-bold tracking-wider ${textPrimary} mb-1`}>{personalInfo.fullName || 'YOUR NAME'}</h1>
            <p className={`text-xs font-semibold tracking-widest uppercase ${textMuted} mb-3`}>{personalInfo.jobTitle}</p>
            <div className={`flex justify-center flex-wrap gap-3 text-[11px] ${textMuted}`}>
              {contactItems.map((item, i) => <span key={i}>{i > 0 ? '· ' : ''}{item}</span>)}
            </div>
          </header>
        );

      case 'bold-stripe':
        return (
          <header className="mb-6 rounded-lg overflow-hidden">
            <div className="px-6 py-4" style={{ backgroundColor: config.headerBg || accent, color: config.headerTextColor || '#fff' }}>
              <h1 className="text-2xl font-black tracking-wide mb-0.5">{personalInfo.fullName || 'YOUR NAME'}</h1>
              <p className="text-xs font-semibold tracking-widest uppercase opacity-80">{personalInfo.jobTitle}</p>
            </div>
            <div className={`flex flex-wrap gap-3 text-[11px] ${textMuted} px-2 pt-2`}>
              {contactItems.map((item, i) => <span key={i}>{item}</span>)}
            </div>
          </header>
        );

      case 'banner':
        return (
          <header className="mb-6 rounded-lg overflow-hidden">
            <div className="px-6 py-5 text-center" style={{ background: config.headerBg || accent, color: config.headerTextColor || '#fff' }}>
              <h1 className="text-3xl font-black tracking-wider mb-1">{personalInfo.fullName || 'YOUR NAME'}</h1>
              <p className="text-xs font-semibold tracking-widest uppercase opacity-80 mb-3">{personalInfo.jobTitle}</p>
              <div className="flex justify-center flex-wrap gap-3 text-[11px] opacity-70">
                {contactItems.map((item, i) => <span key={i}>{item}</span>)}
              </div>
            </div>
          </header>
        );

      case 'minimal':
        return (
          <header className={`mb-5 pb-3 border-b ${borderColor}`}>
            <h1 className={`text-lg font-bold ${textPrimary} mb-0.5`} style={{ color: isDark ? config.headerTextColor || '#e2e8f0' : undefined }}>{personalInfo.fullName || 'YOUR NAME'}</h1>
            <p className={`text-[11px] ${textMuted} mb-1`}>{personalInfo.jobTitle}</p>
            <div className={`flex flex-wrap gap-3 text-[10px] ${textMuted} font-mono`}>
              {contactItems.map((item, i) => <span key={i}>{item}</span>)}
            </div>
          </header>
        );

      case 'split':
        return (
          <header className={`mb-5 pb-3 border-b ${borderColor}`}>
            <div className="flex justify-between items-baseline">
              <h1 className={`text-xl font-bold ${textPrimary}`}>{personalInfo.fullName || 'YOUR NAME'}</h1>
              <p className={`text-[11px] ${textMuted}`}>{personalInfo.jobTitle}</p>
            </div>
            <div className={`flex flex-wrap gap-3 text-[10px] ${textMuted} mt-1`}>
              {contactItems.map((item, i) => <span key={i}>{item}</span>)}
            </div>
          </header>
        );

      default: // left-aligned
        return (
          <header className={`mb-5 pb-3 border-b ${borderColor}`}>
            <h1 className={`text-xl font-bold ${textPrimary} mb-0.5`}>{personalInfo.fullName || 'YOUR NAME'}</h1>
            <p className={`text-xs font-semibold ${textMuted} mb-2`}>{personalInfo.jobTitle}</p>
            <div className={`flex flex-wrap gap-3 text-[11px] ${textMuted}`}>
              {contactItems.map((item, i) => <span key={i}>{item}</span>)}
            </div>
          </header>
        );
    }
  };

  // ── Skills Renderer ──
  const renderSkills = () => {
    if (skillCategories.length === 0) return null;
    return (
      <section className="mb-5">
        <SectionTitle title="Skills" />
        {config.skillsDisplay === 'badges' || config.skillsDisplay === 'tags' ? (
          <div className="space-y-2">
            {skillCategories.map((cat) => (
              <div key={cat.id}>
                <span className={`text-[11px] font-bold ${textPrimary}`}>{cat.categoryName}: </span>
                <span className="inline-flex flex-wrap gap-1 mt-0.5">
                  {cat.skills.map((skill, si) => (
                    <span key={si} className={`text-[10px] px-1.5 py-0.5 rounded ${config.skillsDisplay === 'tags' ? 'font-mono border' : ''}`}
                      style={{
                        backgroundColor: `${accent}15`,
                        color: accent,
                        borderColor: config.skillsDisplay === 'tags' ? `${accent}40` : 'transparent',
                      }}
                    >{skill}</span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        ) : config.skillsDisplay === 'bars' ? (
          <div className="space-y-2">
            {skillCategories.map((cat) => (
              <div key={cat.id}>
                <div className={`text-[11px] font-bold ${textPrimary} mb-1`}>{cat.categoryName}</div>
                {cat.skills.map((skill, si) => (
                  <div key={si} className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] w-24 ${textSecondary}`}>{skill}</span>
                    <div className={`flex-1 h-1.5 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                      <div className="h-full rounded-full" style={{ backgroundColor: accent, width: `${70 + Math.random() * 30}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : config.skillsDisplay === 'columns' ? (
          <div className="grid grid-cols-2 gap-2">
            {skillCategories.map((cat) => (
              <div key={cat.id} className="text-[11px]">
                <span className={`font-bold ${textPrimary}`}>{cat.categoryName}: </span>
                <span className={textSecondary}>{cat.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {skillCategories.map((cat) => (
              <div key={cat.id} className="text-[11px]">
                <span className={`font-bold ${textPrimary}`}>{cat.categoryName}: </span>
                <span className={textSecondary}>{cat.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  };

  // ── Experience Renderer ──
  const renderExperience = () => {
    if (workExperiences.length === 0) return null;
    return (
      <section className="mb-5">
        <SectionTitle title="Professional Experience" />
        <div className="space-y-4">
          {workExperiences.map((exp) => (
            <div key={exp.id} className="space-y-1">
              <div className="flex flex-col sm:flex-row justify-between items-start">
                <span className={`font-bold text-xs ${textPrimary}`}>
                  {exp.jobTitle} <span className={`font-normal ${textSecondary}`}>| {exp.company}</span>
                </span>
                <span className={`text-[11px] ${textMuted} font-mono`}>
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate} {exp.location && `(${exp.location})`}
                </span>
              </div>
              <ul className={`list-disc list-outside pl-4 space-y-1 ${textSecondary}`}>
                {exp.highlights.map((h, i) => <li key={i} className="text-[11px]">{h}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // ── Projects Renderer ──
  const renderProjects = () => {
    if (projects.length === 0) return null;
    return (
      <section className="mb-5">
        <SectionTitle title="Key Projects" />
        {config.projectStyle === 'card' ? (
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className={`p-3 rounded-lg border ${borderColor} ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'} space-y-1.5`}>
                <div className="flex flex-col sm:flex-row justify-between items-start">
                  <span className={`font-bold text-xs ${textPrimary}`}>
                    {proj.title} {config.showRole && proj.role && <span className={`font-semibold ${textMuted}`}>({proj.role})</span>}
                  </span>
                  <div className={`text-[10px] ${textMuted} font-mono`}>
                    {config.showDuration && proj.duration && <span>{proj.duration}</span>}
                  </div>
                </div>
                {config.showTechBadges && proj.techStack && proj.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    <span className={`text-[10px] font-bold ${textSecondary}`}>Tech: </span>
                    {proj.techStack.map((tech, i) => (
                      <span key={i} className="text-[9px] font-mono px-1.5 py-0.5 rounded border" style={{ backgroundColor: `${accent}10`, borderColor: `${accent}30`, color: accent }}>{tech}</span>
                    ))}
                  </div>
                )}
                {proj.description && <p className={`text-[11px] ${textSecondary}`}>{proj.description}</p>}
                {config.showProjectBullets && proj.highlights && proj.highlights.length > 0 && (
                  <ul className={`list-disc list-outside pl-4 space-y-0.5 ${textSecondary}`}>
                    {proj.highlights.map((h, i) => <li key={i} className="text-[11px]">{h}</li>)}
                  </ul>
                )}
                {config.showLinks && proj.link && <div className={`text-[10px] ${textMuted} underline`}>{proj.link}</div>}
              </div>
            ))}
          </div>
        ) : config.projectStyle === 'timeline' ? (
          <div className={`border-l-2 pl-4 space-y-4`} style={{ borderColor: `${accent}60` }}>
            {projects.map((proj) => (
              <div key={proj.id} className="relative space-y-1">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2" style={{ backgroundColor: accent, borderColor: accent }} />
                <div className="flex flex-col sm:flex-row justify-between items-start">
                  <span className={`font-bold text-xs ${textPrimary}`}>
                    {proj.title} {config.showRole && proj.role && <span className={`font-normal ${textMuted}`}>({proj.role})</span>}
                  </span>
                  <span className={`text-[10px] ${textMuted} font-mono`}>{config.showDuration && proj.duration}</span>
                </div>
                {config.showTechBadges && proj.techStack && proj.techStack.length > 0 && (
                  <div className={`text-[10px] font-semibold`} style={{ color: accent }}>Tech: {proj.techStack.join(', ')}</div>
                )}
                {proj.description && <p className={`text-[11px] ${textSecondary}`}>{proj.description}</p>}
                {config.showProjectBullets && proj.highlights && proj.highlights.length > 0 && (
                  <ul className={`list-disc list-outside pl-4 space-y-0.5 ${textSecondary}`}>
                    {proj.highlights.map((h, i) => <li key={i} className="text-[11px]">{h}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : config.projectStyle === 'inline' ? (
          <div className="space-y-2">
            {projects.map((proj) => (
              <div key={proj.id} className="text-[11px]">
                <span className={`font-bold ${textPrimary}`}>{proj.title}</span>
                {config.showRole && proj.role && <span className={textMuted}> ({proj.role})</span>}
                {config.showDuration && proj.duration && <span className={`${textMuted} font-mono`}> — {proj.duration}</span>}
                <span className={textSecondary}>: {proj.description}</span>
                {config.showTechBadges && proj.techStack && proj.techStack.length > 0 && (
                  <span className={`${textMuted} italic`}> [Tech: {proj.techStack.join(', ')}]</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Default list style
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="space-y-1">
                <div className="flex flex-col sm:flex-row justify-between items-start">
                  <span className={`font-bold text-xs ${textPrimary}`}>
                    {proj.title} {config.showRole && proj.role && <span className={`font-normal ${textMuted}`}>| Role: {proj.role}</span>}
                  </span>
                  <div className={`text-[10px] ${textMuted} font-mono`}>
                    {config.showDuration && proj.duration && <span>{proj.duration}</span>}
                    {config.showLinks && proj.link && <span className="ml-2 underline">{proj.link}</span>}
                  </div>
                </div>
                {config.showTechBadges && proj.techStack && proj.techStack.length > 0 ? (
                  <div className={`text-[11px] font-semibold ${textSecondary}`}>
                    <span className={`font-bold ${textPrimary}`}>Technologies: </span>
                    {proj.techStack.join(', ')}
                  </div>
                ) : !config.showTechBadges && proj.techStack && proj.techStack.length > 0 ? (
                  <div className={`text-[11px] ${textMuted} italic`}>Tech: {proj.techStack.join(', ')}</div>
                ) : null}
                {proj.description && <p className={`text-[11px] ${textSecondary}`}>{proj.description}</p>}
                {config.showProjectBullets && proj.highlights && proj.highlights.length > 0 && (
                  <ul className={`list-disc list-outside pl-4 space-y-0.5 ${textSecondary}`}>
                    {proj.highlights.map((h, i) => <li key={i} className="text-[11px]">{h}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    );
  };

  // ── Education Renderer ──
  const renderEducation = () => {
    if (educations.length === 0) return null;
    return (
      <section className="mb-5">
        <SectionTitle title="Education" />
        <div className="space-y-2">
          {educations.map((edu) => (
            <div key={edu.id} className="text-[11px] space-y-0.5">
              <div className={`font-bold ${textPrimary}`}>{edu.degree} — {edu.fieldOfStudy}</div>
              <div className={textMuted}>
                {edu.institution}
                {(edu.startDate || edu.endDate) && ` (${edu.startDate}${edu.startDate && edu.endDate ? ' – ' : ''}${edu.endDate})`}
                {edu.gpa && ` | GPA: ${edu.gpa}`}
              </div>
              {edu.highlights && edu.highlights.length > 0 && (
                <ul className={`list-disc list-inside ${textSecondary} pl-2`}>
                  {edu.highlights.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  // ── Certifications Renderer ──
  const renderCertifications = () => {
    if (certifications.length === 0) return null;
    return (
      <section className="mb-5">
        <SectionTitle title="Certifications" />
        <div className="space-y-1">
          {certifications.map((c) => (
            <div key={c.id} className="text-[11px]">
              <span className={`font-bold ${textPrimary}`}>{c.name}</span>
              <span className={textMuted}> — {c.issuer} {c.date && `(${c.date})`}</span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // ── Summary Renderer ──
  const renderSummary = () => {
    if (!personalInfo.summary) return null;
    return (
      <section className="mb-5">
        <SectionTitle title="Professional Summary" />
        <p className={`text-[11px] ${textSecondary} leading-relaxed`}>{personalInfo.summary}</p>
      </section>
    );
  };

  // ── Sidebar Layout ──
  if (config.layout === 'sidebar-left' || config.layout === 'sidebar-right') {
    const sidebarSections = config.sidebarSections || ['contact', 'skills', 'education', 'certifications'];
    const sidebarContent = (
      <div className="space-y-4">
        {sidebarSections.includes('contact') && (
          <div>
            <SectionTitle title="Contact" />
            <div className="space-y-1 text-[10px]">
              {personalInfo.email && <div className={textSecondary}>{personalInfo.email}</div>}
              {personalInfo.phone && <div className={textSecondary}>{personalInfo.phone}</div>}
              {personalInfo.location && <div className={textSecondary}>{personalInfo.location}</div>}
              {personalInfo.website && <div className={textSecondary}>{personalInfo.website}</div>}
              {personalInfo.linkedin && <div className={textSecondary}>{personalInfo.linkedin}</div>}
              {personalInfo.github && <div className={textSecondary}>{personalInfo.github}</div>}
            </div>
          </div>
        )}
        {sidebarSections.includes('skills') && renderSkills()}
        {sidebarSections.includes('education') && renderEducation()}
        {sidebarSections.includes('certifications') && renderCertifications()}
      </div>
    );

    const mainContent = (
      <div>
        {renderSummary()}
        {renderExperience()}
        {renderProjects()}
        {!sidebarSections.includes('education') && renderEducation()}
        {!sidebarSections.includes('certifications') && renderCertifications()}
      </div>
    );

    return (
      <div
        className={`w-full bg-white ${fontClass} ${spacingClass} shadow-lg rounded-lg max-w-[850px] mx-auto overflow-hidden`}
        style={{ backgroundColor: config.bodyBg || '#ffffff' }}
        id="printable-resume"
      >
        <div className="px-6 py-5">
          <header className="mb-4 pb-3 border-b" style={{ borderColor: `${accent}30` }}>
            <h1 className={`text-xl font-bold ${textPrimary}`}>{personalInfo.fullName || 'YOUR NAME'}</h1>
            <p className={`text-xs ${textMuted}`}>{personalInfo.jobTitle}</p>
          </header>
        </div>
        <div className="flex">
          {config.layout === 'sidebar-left' && (
            <div className="w-[35%] px-5 py-4 border-r" style={{ borderColor: `${accent}20`, backgroundColor: `${accent}08` }}>
              {sidebarContent}
            </div>
          )}
          <div className={config.layout === 'sidebar-left' ? 'w-[65%] px-5 py-4' : 'w-[65%] px-5 py-4'}>
            {mainContent}
          </div>
          {config.layout === 'sidebar-right' && (
            <div className="w-[35%] px-5 py-4 border-l" style={{ borderColor: `${accent}20`, backgroundColor: `${accent}08` }}>
              {sidebarContent}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Single-Column Layout ──
  return (
    <div
      className={`w-full ${fontClass} ${spacingClass} p-8 sm:p-10 shadow-lg rounded-lg max-w-[850px] mx-auto overflow-hidden`}
      style={{ backgroundColor: config.bodyBg || '#ffffff', color: isDark ? '#e2e8f0' : '#1e293b' }}
      id="printable-resume"
    >
      {renderHeader()}
      {renderSummary()}
      {renderExperience()}
      {renderSkills()}
      {renderProjects()}
      {renderEducation()}
      {renderCertifications()}
    </div>
  );
};
