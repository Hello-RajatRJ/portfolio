import React, { useState } from 'react';
import { Upload, FileText, Check, X, AlertCircle, User, Briefcase, Code, FolderPlus, Globe, Link, ExternalLink } from 'lucide-react';
import type { ResumeData } from '../../types/resume';
import { CVParserService } from '../../services/cvParserService';

interface Props {
  onImportResume: (data: ResumeData) => void;
  onClose: () => void;
}

export const UploadCVModal: React.FC<Props> = ({ onImportResume, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState<ResumeData | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [activePreviewTab, setActivePreviewTab] = useState<'personal' | 'experience' | 'skills' | 'projects'>('personal');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setLoading(true);
    setErrorMsg('');

    try {
      const data = await CVParserService.parseFile(file);
      setParsedData(data);
    } catch (err: any) {
      console.error('Failed to parse file:', err);
      setErrorMsg('Failed to parse CV file. Please ensure it is a valid JSON, PDF, DOCX, or TXT file.');
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setLoading(true);
    setErrorMsg('');

    try {
      const data = await CVParserService.parseFile(file);
      setParsedData(data);
    } catch (err: any) {
      console.error('Failed to parse file:', err);
      setErrorMsg('Failed to parse CV file. Please ensure it is a valid JSON, PDF, DOCX, or TXT file.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmImport = () => {
    if (parsedData) {
      onImportResume(parsedData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full p-6 text-white shadow-2xl space-y-5 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600/20 border border-indigo-500/30 rounded-lg text-indigo-400">
              <Upload size={18} />
            </div>
            <div>
              <h2 className="font-orbitron font-bold text-base text-white">Upload Existing CV</h2>
              <p className="text-xs text-slate-400">Extract, preview, & edit resume details from your uploaded CV</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Dropzone area */}
          {!parsedData && (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-8 text-center bg-slate-950/40 hover:bg-indigo-950/20 transition-all cursor-pointer relative"
            >
              <input
                type="file"
                accept=".json,.pdf,.docx,.txt,.md"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="p-3 bg-slate-800 rounded-full text-indigo-400">
                  <FileText size={32} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Click or drag & drop your CV file here</p>
                  <p className="text-xs text-slate-400 mt-1">Supports .JSON, .PDF, .DOCX, .TXT, and .MD files</p>
                </div>
                {fileName && <p className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full">Selected: {fileName}</p>}
                {loading && <p className="text-xs font-semibold text-indigo-400 animate-pulse">Extracting resume fields...</p>}
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Extracted Data Preview & Editable Section */}
          {parsedData && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-emerald-400" />
                  <span className="text-xs font-bold text-slate-200">Extracted from: {fileName || 'Uploaded CV'}</span>
                </div>
                <button
                  onClick={() => setParsedData(null)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  Upload different file
                </button>
              </div>

              {/* Sub Navigation */}
              <div className="flex border-b border-slate-800 gap-2">
                <button
                  onClick={() => setActivePreviewTab('personal')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-all ${
                    activePreviewTab === 'personal'
                      ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <User size={13} /> Personal Details
                </button>
                <button
                  onClick={() => setActivePreviewTab('experience')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-all ${
                    activePreviewTab === 'experience'
                      ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Briefcase size={13} /> Experience ({parsedData.workExperiences.length})
                </button>
                <button
                  onClick={() => setActivePreviewTab('skills')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-all ${
                    activePreviewTab === 'skills'
                      ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Code size={13} /> Skills
                </button>
                <button
                  onClick={() => setActivePreviewTab('projects')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-all ${
                    activePreviewTab === 'projects'
                      ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FolderPlus size={13} /> Projects ({parsedData.projects.length})
                </button>
              </div>

              {/* Editable Fields */}
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
                {activePreviewTab === 'personal' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={parsedData.personalInfo.fullName}
                        onChange={(e) =>
                          setParsedData({
                            ...parsedData,
                            personalInfo: { ...parsedData.personalInfo, fullName: e.target.value },
                          })
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Job Title</label>
                      <input
                        type="text"
                        value={parsedData.personalInfo.jobTitle}
                        onChange={(e) =>
                          setParsedData({
                            ...parsedData,
                            personalInfo: { ...parsedData.personalInfo, jobTitle: e.target.value },
                          })
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Email</label>
                      <input
                        type="text"
                        value={parsedData.personalInfo.email}
                        onChange={(e) =>
                          setParsedData({
                            ...parsedData,
                            personalInfo: { ...parsedData.personalInfo, email: e.target.value },
                          })
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 flex items-center gap-1">
                        <Globe size={12} className="text-indigo-400" /> Portfolio Website
                      </label>
                      <input
                        type="text"
                        value={parsedData.personalInfo.website}
                        onChange={(e) =>
                          setParsedData({
                            ...parsedData,
                            personalInfo: { ...parsedData.personalInfo, website: e.target.value },
                          })
                        }
                        placeholder="https://portfolio.dev"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 flex items-center gap-1">
                        <Link size={12} className="text-purple-400" /> GitHub Profile
                      </label>
                      <input
                        type="text"
                        value={parsedData.personalInfo.github}
                        onChange={(e) =>
                          setParsedData({
                            ...parsedData,
                            personalInfo: { ...parsedData.personalInfo, github: e.target.value },
                          })
                        }
                        placeholder="https://github.com/username"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 flex items-center gap-1">
                        <ExternalLink size={12} className="text-blue-400" /> LinkedIn Profile
                      </label>
                      <input
                        type="text"
                        value={parsedData.personalInfo.linkedin}
                        onChange={(e) =>
                          setParsedData({
                            ...parsedData,
                            personalInfo: { ...parsedData.personalInfo, linkedin: e.target.value },
                          })
                        }
                        placeholder="https://linkedin.com/in/username"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-slate-400 mb-1">Professional Summary</label>
                      <textarea
                        rows={3}
                        value={parsedData.personalInfo.summary}
                        onChange={(e) =>
                          setParsedData({
                            ...parsedData,
                            personalInfo: { ...parsedData.personalInfo, summary: e.target.value },
                          })
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white resize-y"
                      />
                    </div>
                  </div>
                )}

                {activePreviewTab === 'experience' && (
                  <div className="space-y-3">
                    {parsedData.workExperiences.map((exp, idx) => (
                      <div key={exp.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2 text-xs">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Job Title"
                            value={exp.jobTitle}
                            onChange={(e) => {
                              const updated = [...parsedData.workExperiences];
                              updated[idx].jobTitle = e.target.value;
                              setParsedData({ ...parsedData, workExperiences: updated });
                            }}
                            className="flex-1 bg-slate-800 border border-slate-700 rounded p-1.5 text-white"
                          />
                          <input
                            type="text"
                            placeholder="Company"
                            value={exp.company}
                            onChange={(e) => {
                              const updated = [...parsedData.workExperiences];
                              updated[idx].company = e.target.value;
                              setParsedData({ ...parsedData, workExperiences: updated });
                            }}
                            className="flex-1 bg-slate-800 border border-slate-700 rounded p-1.5 text-white"
                          />
                        </div>
                        <div className="text-slate-400">Highlights:</div>
                        {exp.highlights.map((h, hIdx) => (
                          <input
                            key={hIdx}
                            type="text"
                            value={h}
                            onChange={(e) => {
                              const updated = [...parsedData.workExperiences];
                              updated[idx].highlights[hIdx] = e.target.value;
                              setParsedData({ ...parsedData, workExperiences: updated });
                            }}
                            className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-white mb-1"
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {activePreviewTab === 'skills' && (
                  <div className="space-y-3 text-xs">
                    {parsedData.skillCategories.map((cat, catIdx) => (
                      <div key={cat.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1.5">
                        <input
                          type="text"
                          value={cat.categoryName}
                          onChange={(e) => {
                            const updated = [...parsedData.skillCategories];
                            updated[catIdx].categoryName = e.target.value;
                            setParsedData({ ...parsedData, skillCategories: updated });
                          }}
                          className="w-full bg-slate-800 font-bold border border-slate-700 rounded p-1.5 text-indigo-300"
                        />
                        <input
                          type="text"
                          value={cat.skills.join(', ')}
                          onChange={(e) => {
                            const updated = [...parsedData.skillCategories];
                            updated[catIdx].skills = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                            setParsedData({ ...parsedData, skillCategories: updated });
                          }}
                          className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-white"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {activePreviewTab === 'projects' && (
                  <div className="space-y-3 text-xs">
                    {parsedData.projects.map((proj, projIdx) => (
                      <div key={proj.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => {
                              const updated = [...parsedData.projects];
                              updated[projIdx].title = e.target.value;
                              setParsedData({ ...parsedData, projects: updated });
                            }}
                            className="flex-1 bg-slate-800 font-bold border border-slate-700 rounded p-1.5 text-white"
                          />
                          <input
                            type="text"
                            value={proj.role}
                            onChange={(e) => {
                              const updated = [...parsedData.projects];
                              updated[projIdx].role = e.target.value;
                              setParsedData({ ...parsedData, projects: updated });
                            }}
                            className="w-full sm:w-1/3 bg-slate-800 border border-slate-700 rounded p-1.5 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Tech Stack (comma separated)</label>
                          <input
                            type="text"
                            value={proj.techStack.join(', ')}
                            onChange={(e) => {
                              const updated = [...parsedData.projects];
                              updated[projIdx].techStack = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                              setParsedData({ ...parsedData, projects: updated });
                            }}
                            className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-emerald-300 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Description</label>
                          <input
                            type="text"
                            value={proj.description}
                            onChange={(e) => {
                              const updated = [...parsedData.projects];
                              updated[projIdx].description = e.target.value;
                              setParsedData({ ...parsedData, projects: updated });
                            }}
                            className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-2 border-t border-slate-800 pt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Cancel
          </button>
          {parsedData && (
            <button
              onClick={handleConfirmImport}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30"
            >
              <Check size={14} /> IMPORT CV TO BUILDER
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
