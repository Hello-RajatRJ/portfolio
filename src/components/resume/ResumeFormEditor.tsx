import React, { useState } from 'react';
import { Plus, Trash2, User, Briefcase, GraduationCap, Code, FolderPlus, Award, Sparkles, Upload, Globe, Link, ExternalLink } from 'lucide-react';
import type { ResumeData, WorkExperience, Education, SkillCategory, ProjectItem, Certification } from '../../types/resume';

interface Props {
  data: ResumeData;
  onChangeData: (data: ResumeData) => void;
  onTriggerAISuggest: () => void;
  onOpenUploadModal?: () => void;
  onOpenAIOptimizer?: () => void;
}

interface CommaSeparatedInputProps {
  value: string[];
  onChange: (newArray: string[]) => void;
  placeholder?: string;
  className?: string;
}

const CommaSeparatedInput: React.FC<CommaSeparatedInputProps> = ({ value, onChange, placeholder, className }) => {
  const [text, setText] = React.useState<string | null>(null);

  const displayValue = text !== null ? text : (value || []).join(', ');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawText = e.target.value;
    setText(rawText);
    const parsed = rawText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    onChange(parsed);
  };

  const handleBlur = () => {
    setText(null);
  };

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={className}
    />
  );
};

type TabType = 'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'certs';

export const ResumeFormEditor: React.FC<Props> = ({
  data,
  onChangeData,
  onTriggerAISuggest,
  onOpenUploadModal,
  onOpenAIOptimizer,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('personal');

  // Personal Info handlers
  const handlePersonalChange = (field: keyof ResumeData['personalInfo'], value: string) => {
    onChangeData({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: value,
      },
    });
  };

  // Experience handlers
  const addExperience = () => {
    const newExp: WorkExperience = {
      id: `exp-${Date.now()}`,
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      highlights: ['Developed core platform features using modern web stack.', 'Collaborated with cross-functional engineering teams.'],
    };
    onChangeData({ ...data, workExperiences: [...data.workExperiences, newExp] });
  };

  const updateExperience = (id: string, field: keyof WorkExperience, value: any) => {
    const updated = data.workExperiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp));
    onChangeData({ ...data, workExperiences: updated });
  };

  const deleteExperience = (id: string) => {
    onChangeData({ ...data, workExperiences: data.workExperiences.filter((e) => e.id !== id) });
  };

  const handleBulletChange = (expId: string, index: number, value: string) => {
    const exp = data.workExperiences.find((e) => e.id === expId);
    if (!exp) return;
    const newBullets = [...exp.highlights];
    newBullets[index] = value;
    updateExperience(expId, 'highlights', newBullets);
  };

  const addBullet = (expId: string) => {
    const exp = data.workExperiences.find((e) => e.id === expId);
    if (!exp) return;
    updateExperience(expId, 'highlights', [...exp.highlights, '']);
  };

  const deleteBullet = (expId: string, index: number) => {
    const exp = data.workExperiences.find((e) => e.id === expId);
    if (!exp) return;
    const newBullets = exp.highlights.filter((_, i) => i !== index);
    updateExperience(expId, 'highlights', newBullets);
  };

  // Education handlers
  const addEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      fieldOfStudy: '',
      location: '',
      startDate: '',
      endDate: '',
    };
    onChangeData({ ...data, educations: [...data.educations, newEdu] });
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    const updated = data.educations.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu));
    onChangeData({ ...data, educations: updated });
  };

  const deleteEducation = (id: string) => {
    onChangeData({ ...data, educations: data.educations.filter((e) => e.id !== id) });
  };

  // Skills handlers
  const addSkillCategory = () => {
    const newCat: SkillCategory = {
      id: `cat-${Date.now()}`,
      categoryName: 'New Category',
      skills: ['Skill 1', 'Skill 2'],
    };
    onChangeData({ ...data, skillCategories: [...data.skillCategories, newCat] });
  };

  const updateSkillCategory = (id: string, name: string, skillsCsv: string) => {
    const skillsArray = skillsCsv.split(',').map((s) => s.trim()).filter(Boolean);
    const updated = data.skillCategories.map((c) => (c.id === id ? { ...c, categoryName: name, skills: skillsArray } : c));
    onChangeData({ ...data, skillCategories: updated });
  };

  const deleteSkillCategory = (id: string) => {
    onChangeData({ ...data, skillCategories: data.skillCategories.filter((c) => c.id !== id) });
  };

  // Projects handlers
  const addProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: '',
      role: '',
      techStack: [],
      description: '',
      highlights: ['Key feature or technical achievement point...'],
    };
    onChangeData({ ...data, projects: [...data.projects, newProj] });
  };

  const updateProject = (id: string, field: keyof ProjectItem, value: any) => {
    const updated = data.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p));
    onChangeData({ ...data, projects: updated });
  };

  const deleteProject = (id: string) => {
    onChangeData({ ...data, projects: data.projects.filter((p) => p.id !== id) });
  };

  const handleProjectBulletChange = (projId: string, index: number, value: string) => {
    const proj = data.projects.find((p) => p.id === projId);
    if (!proj) return;
    const newBullets = [...(proj.highlights || [])];
    newBullets[index] = value;
    updateProject(projId, 'highlights', newBullets);
  };

  const addProjectBullet = (projId: string) => {
    const proj = data.projects.find((p) => p.id === projId);
    if (!proj) return;
    updateProject(projId, 'highlights', [...(proj.highlights || []), '']);
  };

  const deleteProjectBullet = (projId: string, index: number) => {
    const proj = data.projects.find((p) => p.id === projId);
    if (!proj) return;
    const newBullets = (proj.highlights || []).filter((_, i) => i !== index);
    updateProject(projId, 'highlights', newBullets);
  };

  // Certifications handlers
  const addCertification = () => {
    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      name: '',
      issuer: '',
      date: '',
    };
    onChangeData({ ...data, certifications: [...data.certifications, newCert] });
  };

  const updateCertification = (id: string, field: keyof Certification, value: any) => {
    const updated = data.certifications.map((c) => (c.id === id ? { ...c, [field]: value } : c));
    onChangeData({ ...data, certifications: updated });
  };

  const deleteCertification = (id: string) => {
    onChangeData({ ...data, certifications: data.certifications.filter((c) => c.id !== id) });
  };

  const tabs: { id: TabType; label: string; icon: React.FC<{ size?: number }> }[] = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'projects', label: 'Projects', icon: FolderPlus },
    { id: 'certs', label: 'Certs', icon: Award },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 text-white shadow-xl space-y-4">
      {/* Quick Actions Header Banner */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2.5">
        <div className="text-xs">
          <span className="font-bold text-slate-200 block">Resume Editor Tools</span>
          <span className="text-[11px] text-slate-400">Import existing CV or tailor project technologies to Job Description</span>
        </div>
        <div className="flex items-center gap-2">
          {onOpenUploadModal && (
            <button
              onClick={onOpenUploadModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-500/40 hover:bg-indigo-900/80 text-indigo-300 text-xs font-semibold transition-all"
            >
              <Upload size={13} />
              <span>Upload CV</span>
            </button>
          )}
          {onOpenAIOptimizer && (
            <button
              onClick={onOpenAIOptimizer}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md transition-all"
            >
              <Sparkles size={13} />
              <span>AI Tailor for JD</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 overflow-x-auto gap-1 mb-6 pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Personal Info */}
      {activeTab === 'personal' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-300 font-orbitron">Personal & Contact Info</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={data.personalInfo.fullName}
                onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                placeholder="Rajat Ambedkar"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Job Title</label>
              <input
                type="text"
                value={data.personalInfo.jobTitle}
                onChange={(e) => handlePersonalChange('jobTitle', e.target.value)}
                placeholder="Senior Full Stack Engineer"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Email</label>
              <input
                type="email"
                value={data.personalInfo.email}
                onChange={(e) => handlePersonalChange('email', e.target.value)}
                placeholder="rajat@example.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Phone</label>
              <input
                type="text"
                value={data.personalInfo.phone}
                onChange={(e) => handlePersonalChange('phone', e.target.value)}
                placeholder="+1 555-0192"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Location</label>
              <input
                type="text"
                value={data.personalInfo.location}
                onChange={(e) => handlePersonalChange('location', e.target.value)}
                placeholder="San Francisco, CA"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <Globe size={13} className="text-indigo-400" /> Portfolio Website
              </label>
              <input
                type="text"
                value={data.personalInfo.website}
                onChange={(e) => handlePersonalChange('website', e.target.value)}
                placeholder="https://rajatportfolio.dev"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <Link size={13} className="text-purple-400" /> GitHub Profile
              </label>
              <input
                type="text"
                value={data.personalInfo.github}
                onChange={(e) => handlePersonalChange('github', e.target.value)}
                placeholder="https://github.com/Hello-RajatRJ"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <ExternalLink size={13} className="text-blue-400" /> LinkedIn Profile
              </label>
              <input
                type="text"
                value={data.personalInfo.linkedin}
                onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/rajat-ambedkar"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-400">Professional Summary</label>
              <button
                type="button"
                onClick={onTriggerAISuggest}
                className="flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300 font-semibold"
              >
                <Sparkles size={12} /> Auto-Generate with AI
              </button>
            </div>
            <textarea
              rows={4}
              value={data.personalInfo.summary}
              onChange={(e) => handlePersonalChange('summary', e.target.value)}
              placeholder="Brief professional background highlighting core experience, key skills, and engineering impact..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Work Experience */}
      {activeTab === 'experience' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-300 font-orbitron">Work Experience</h3>
            <button
              onClick={addExperience}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              <Plus size={14} /> Add Experience
            </button>
          </div>

          {data.workExperiences.map((exp, idx) => (
            <div key={exp.id} className="p-4 bg-slate-800/80 border border-slate-700 rounded-lg space-y-3">
              <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                <span className="text-xs font-bold text-indigo-400"># {idx + 1} {exp.jobTitle || 'New Position'}</span>
                <button onClick={() => deleteExperience(exp.id)} className="text-red-400 hover:text-red-300 p-1">
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400">Job Title</label>
                  <input
                    type="text"
                    value={exp.jobTitle}
                    onChange={(e) => updateExperience(exp.id, 'jobTitle', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400">Company</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400">Start Date</label>
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                    placeholder="Jan 2022"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400">End Date</label>
                  <input
                    type="text"
                    disabled={exp.current}
                    value={exp.current ? 'Present' : exp.endDate}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                    placeholder="Dec 2024"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Bullet points */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-slate-300">Key Responsibilities & Achievements</label>
                  <button onClick={() => addBullet(exp.id)} className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold">
                    + Add Bullet
                  </button>
                </div>
                {exp.highlights.map((bullet, bIdx) => (
                  <div key={bIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={bullet}
                      onChange={(e) => handleBulletChange(exp.id, bIdx, e.target.value)}
                      placeholder="Achieved X by implementing Y resulting in Z..."
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white"
                    />
                    <button onClick={() => deleteBullet(exp.id, bIdx)} className="text-slate-500 hover:text-red-400">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Skills */}
      {activeTab === 'skills' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-300 font-orbitron">Skills & Categories</h3>
            <button
              onClick={addSkillCategory}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              <Plus size={14} /> Add Skill Category
            </button>
          </div>

          {data.skillCategories.map((cat) => (
            <div key={cat.id} className="p-4 bg-slate-800/80 border border-slate-700 rounded-lg space-y-3">
              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  value={cat.categoryName}
                  onChange={(e) => updateSkillCategory(cat.id, e.target.value, cat.skills.join(', '))}
                  placeholder="Category (e.g. Frontend)"
                  className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-indigo-300 font-bold"
                />
                <button onClick={() => deleteSkillCategory(cat.id)} className="text-red-400 hover:text-red-300">
                  <Trash2 size={14} />
                </button>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Skills (comma separated)</label>
                <CommaSeparatedInput
                  value={cat.skills}
                  onChange={(newSkills) =>
                    updateSkillCategory(cat.id, cat.categoryName, newSkills.join(', '))
                  }
                  placeholder="React, TypeScript, Node.js, GraphQL"
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Education */}
      {activeTab === 'education' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-300 font-orbitron">Education</h3>
            <button
              onClick={addEducation}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              <Plus size={14} /> Add Education
            </button>
          </div>

          {data.educations.map((edu) => (
            <div key={edu.id} className="p-4 bg-slate-800/80 border border-slate-700 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-indigo-400">{edu.degree || 'Degree'}</span>
                <button onClick={() => deleteEducation(edu.id)} className="text-red-400 hover:text-red-300">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Degree</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    placeholder="Degree (e.g. Bachelor of Science)"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Field of Study</label>
                  <input
                    type="text"
                    value={edu.fieldOfStudy}
                    onChange={(e) => updateEducation(edu.id, 'fieldOfStudy', e.target.value)}
                    placeholder="Field of Study (Computer Science)"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Institution / University</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                    placeholder="University Name"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">GPA / Score (Optional)</label>
                  <input
                    type="text"
                    value={edu.gpa || ''}
                    onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                    placeholder="GPA (e.g. 3.8 / 4.0)"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Start Date</label>
                  <input
                    type="text"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                    placeholder="Start Year/Date (e.g. 2015)"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">End Date / Graduation</label>
                  <input
                    type="text"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                    placeholder="End Year/Date (e.g. 2019)"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Projects */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-300 font-orbitron">Projects</h3>
            <button
              onClick={addProject}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              <Plus size={14} /> Add Project
            </button>
          </div>

          {data.projects.map((proj) => (
            <div key={proj.id} className="p-4 bg-slate-800/80 border border-slate-700 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-indigo-400">{proj.title || 'Project Title'}</span>
                <button onClick={() => deleteProject(proj.id)} className="text-red-400 hover:text-red-300">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Project Name</label>
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) => updateProject(proj.id, 'title', e.target.value)}
                    placeholder="e.g. AI Resume Architect"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Demo / Repository Link</label>
                  <input
                    type="text"
                    value={proj.link || ''}
                    onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Your Role in Project</label>
                  <input
                    type="text"
                    value={proj.role || ''}
                    onChange={(e) => updateProject(proj.id, 'role', e.target.value)}
                    placeholder="e.g. Lead Full Stack Architect"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Project Duration / Timeline</label>
                  <input
                    type="text"
                    value={proj.duration || ''}
                    onChange={(e) => updateProject(proj.id, 'duration', e.target.value)}
                    placeholder="e.g. 3 Months (Jan 2024 - Mar 2024)"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-slate-400 mb-1">Tech Stack Used (comma separated)</label>
                  <CommaSeparatedInput
                    value={proj.techStack || []}
                    onChange={(newTech) => updateProject(proj.id, 'techStack', newTech)}
                    placeholder="React, TypeScript, Node.js, Tailwind"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Overview Description</label>
                <textarea
                  rows={2}
                  value={proj.description}
                  onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                  placeholder="Brief overview of the project objectives..."
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white leading-relaxed"
                />
              </div>

              {/* Project Bullet Points */}
              <div className="space-y-2 pt-2 border-t border-slate-700/60">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-slate-300">Project Highlights & Key Features (Bullet Points)</label>
                  <button
                    onClick={() => addProjectBullet(proj.id)}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    + Add Project Bullet
                  </button>
                </div>
                {(proj.highlights || []).map((bullet, bIdx) => (
                  <div key={bIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={bullet}
                      onChange={(e) => handleProjectBulletChange(proj.id, bIdx, e.target.value)}
                      placeholder="Achieved X feature, optimized Y query, integrated Z API..."
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white"
                    />
                    <button onClick={() => deleteProjectBullet(proj.id, bIdx)} className="text-slate-500 hover:text-red-400">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 6: Certifications */}
      {activeTab === 'certs' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-300 font-orbitron">Certifications & Awards</h3>
            <button
              onClick={addCertification}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              <Plus size={14} /> Add Certification
            </button>
          </div>

          {data.certifications.map((cert) => (
            <div key={cert.id} className="p-4 bg-slate-800/80 border border-slate-700 rounded-lg flex items-center justify-between gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                  placeholder="AWS Solutions Architect"
                  className="bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white"
                />
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                  placeholder="Amazon Web Services"
                  className="bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white"
                />
                <input
                  type="text"
                  value={cert.date}
                  onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                  placeholder="Year (2023)"
                  className="bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white"
                />
              </div>
              <button onClick={() => deleteCertification(cert.id)} className="text-red-400 hover:text-red-300">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
