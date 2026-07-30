import React, { useState } from 'react';
import { Sparkles, FileText, Upload, Check, X, ArrowRight, ShieldCheck, RefreshCw, Key, CheckSquare, Square, Layers, Cpu, Award } from 'lucide-react';
import type { ResumeData, AIOptimizationResult } from '../../types/resume';
import { AIResumeService } from '../../services/aiResumeService';

interface Props {
  data: ResumeData;
  onApplyOptimization: (optimizedData: ResumeData) => void;
  onClose: () => void;
}

export const AIOptimizerModal: React.FC<Props> = ({ data, onApplyOptimization, onClose }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [targetTitle, setTargetTitle] = useState(data.personalInfo.jobTitle || 'Senior Full Stack Engineer');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<AIOptimizationResult | null>(null);
  const [activeTab, setActiveTab] = useState<'input' | 'review' | 'comparison'>('input');
  const [selectedChanges, setSelectedChanges] = useState<Record<string, boolean>>({});

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      setJobDescription(text);
    } catch (err) {
      console.warn('Could not read file as text', err);
    }
  };

  const handleRunOptimization = async () => {
    if (!jobDescription.trim()) return;
    setLoading(true);
    try {
      const res = await AIResumeService.optimizeResumeForJD(data, jobDescription, targetTitle, apiKey);
      setOptimizationResult(res);

      // Default all changes to selected/accepted
      const initialMap: Record<string, boolean> = {};
      res.changes.forEach((c) => {
        initialMap[c.id] = true;
      });
      setSelectedChanges(initialMap);
      setActiveTab('review');
    } catch (err) {
      console.error('Optimization failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleChange = (id: string) => {
    setSelectedChanges((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleApplyFinal = () => {
    if (!optimizationResult) return;

    // Filter and construct final tailored resume data according to accepted items
    const finalData: ResumeData = JSON.parse(JSON.stringify(optimizationResult.tailoredData));

    // If summary was rejected, revert summary
    const summaryChange = optimizationResult.changes.find((c) => c.category === 'summary');
    if (summaryChange && !selectedChanges[summaryChange.id]) {
      finalData.personalInfo.summary = data.personalInfo.summary;
      finalData.personalInfo.jobTitle = data.personalInfo.jobTitle;
    }

    // If skills were rejected, revert skills
    const skillsChange = optimizationResult.changes.find((c) => c.category === 'skills');
    if (skillsChange && !selectedChanges[skillsChange.id]) {
      finalData.skillCategories = data.skillCategories;
    }

    // Handle project changes individually
    finalData.projects = finalData.projects.map((proj, idx) => {
      const origProj = data.projects[idx] || proj;
      const techChange = optimizationResult.changes.find((c) => c.id === `change-proj-tech-${proj.id}`);
      const descChange = optimizationResult.changes.find((c) => c.id === `change-proj-desc-${proj.id}`);

      return {
        ...proj,
        techStack: techChange && !selectedChanges[techChange.id] ? origProj.techStack : proj.techStack,
        description: descChange && !selectedChanges[descChange.id] ? origProj.description : proj.description,
        highlights: descChange && !selectedChanges[descChange.id] ? origProj.highlights : proj.highlights,
      };
    });

    onApplyOptimization(finalData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full p-5 sm:p-6 text-white shadow-2xl space-y-4 relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-lg shadow-purple-600/30">
              <Sparkles size={20} className="text-white animate-pulse" />
            </div>
            <div>
              <h2 className="font-orbitron font-bold text-base text-white tracking-wide flex items-center gap-2">
                AI RESUME OPTIMIZER & JD TAILOR
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  ATS SMART ENGINE
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Analyze Job Description, match keywords, & auto-replace project technologies
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 gap-3">
          <button
            onClick={() => setActiveTab('input')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'input'
                ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText size={14} /> 1. Target Job Description
          </button>
          <button
            onClick={() => optimizationResult && setActiveTab('review')}
            disabled={!optimizationResult}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-all disabled:opacity-40 ${
              activeTab === 'review'
                ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu size={14} /> 2. AI Suggestions & Diff Review
          </button>
          <button
            onClick={() => optimizationResult && setActiveTab('comparison')}
            disabled={!optimizationResult}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-all disabled:opacity-40 ${
              activeTab === 'comparison'
                ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers size={14} /> 3. Side-by-Side Comparison
          </button>
        </div>

        {/* Modal Main Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
          {/* TAB 1: Input Job Description */}
          {activeTab === 'input' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Job Title</label>
                  <input
                    type="text"
                    value={targetTitle}
                    onChange={(e) => setTargetTitle(e.target.value)}
                    placeholder="e.g. Senior Full Stack Engineer"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Key size={12} className="text-amber-400" /> Optional: Gemini API Key (Uses built-in NLP engine if empty)
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Paste or Upload Target Job Description (JD)
                  </label>
                  <label className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer flex items-center gap-1 font-semibold">
                    <Upload size={12} /> Upload JD Document (.txt, .md, .pdf)
                    <input type="file" accept=".txt,.md,.pdf,.docx" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
                <textarea
                  rows={8}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target Job Description text here... (e.g. 'We are looking for a Senior Developer proficient in React, TypeScript, Next.js, Node.js, AWS, Docker, GraphQL, and microservices...')"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white resize-y font-sans leading-relaxed focus:border-purple-500 focus:outline-none"
                />
              </div>

              <button
                onClick={handleRunOptimization}
                disabled={loading || !jobDescription.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 font-orbitron font-bold text-xs tracking-wider text-white shadow-xl shadow-purple-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" /> ANALYZING JD & REPLACING PROJECT TECHNOLOGIES...
                  </>
                ) : (
                  <>
                    <Sparkles size={15} /> OPTIMIZE RESUME & TAILOR PROJECT TECHNOLOGIES FOR THIS ROLE
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 2: AI Suggestions & Diff Review */}
          {activeTab === 'review' && optimizationResult && (
            <div className="space-y-4">
              {/* ATS Score Header Comparison */}
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 font-mono block">BENCHMARK ATS SCORE MATCH</span>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xl font-bold text-red-400 line-through">{optimizationResult.beforeATSScore}/100</span>
                    <ArrowRight size={16} className="text-slate-500" />
                    <span className="text-2xl font-orbitron font-bold text-emerald-400 flex items-center gap-1">
                      {optimizationResult.afterATSScore}/100 <ShieldCheck size={20} className="text-emerald-400" />
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Extracted JD Keywords:</span>
                  <div className="flex flex-wrap gap-1">
                    {optimizationResult.extractedKeywords.slice(0, 6).map((kw) => (
                      <span key={kw} className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Suggestions Diff List */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                  <span>Review AI Modifications (Check to accept or uncheck to keep original):</span>
                  <span>{Object.values(selectedChanges).filter(Boolean).length} / {optimizationResult.changes.length} Accepted</span>
                </div>

                {optimizationResult.changes.map((change) => {
                  const isAccepted = Boolean(selectedChanges[change.id]);
                  return (
                    <div
                      key={change.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isAccepted ? 'bg-slate-900/90 border-purple-500/40 shadow-sm' : 'bg-slate-950/40 border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <button
                          onClick={() => toggleChange(change.id)}
                          className="flex items-center gap-2 text-xs font-bold text-white text-left focus:outline-none"
                        >
                          {isAccepted ? (
                            <CheckSquare size={16} className="text-purple-400 shrink-0" />
                          ) : (
                            <Square size={16} className="text-slate-500 shrink-0" />
                          )}
                          <span className="text-indigo-300">{change.title}</span>
                          {change.category === 'project_tech' && (
                            <span className="px-2 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              PROJECT TECH REPLACED
                            </span>
                          )}
                        </button>
                      </div>

                      <div className="mt-2 text-xs space-y-1.5 pl-6 font-sans">
                        <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-400 line-through">
                          <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block">Original:</span>
                          {change.originalText}
                        </div>
                        <div className="p-2 rounded bg-purple-950/30 border border-purple-500/30 text-purple-200">
                          <span className="text-[10px] uppercase font-mono font-bold text-purple-400 block">AI Optimized (JD Matched):</span>
                          {change.newText}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recommended Certifications */}
              {optimizationResult.suggestedCertifications.length > 0 && (
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Award size={14} /> Recommended Certifications for this Job Description:
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {optimizationResult.suggestedCertifications.map((cert) => (
                      <span key={cert} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-amber-500/30 text-slate-200">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Side-by-Side Comparison */}
          {activeTab === 'comparison' && optimizationResult && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              {/* Original Resume Side */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="font-orbitron font-bold text-xs text-slate-400 uppercase border-b border-slate-800 pb-2">
                  Original Resume
                </div>
                <div>
                  <span className="font-bold text-slate-300">Job Title:</span> {data.personalInfo.jobTitle}
                </div>
                <div>
                  <span className="font-bold text-slate-300">Summary:</span>
                  <p className="text-slate-400 mt-1">{data.personalInfo.summary}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-300">Projects Tech Stacks:</span>
                  {data.projects.map((p) => (
                    <div key={p.id} className="text-slate-400 mt-1">
                      <span className="font-semibold text-slate-300">{p.title}:</span> [{p.techStack.join(', ')}]
                    </div>
                  ))}
                </div>
              </div>

              {/* Optimized Resume Side */}
              <div className="bg-purple-950/20 p-4 rounded-xl border border-purple-500/40 space-y-3">
                <div className="font-orbitron font-bold text-xs text-purple-300 uppercase border-b border-purple-500/30 pb-2 flex justify-between">
                  <span>AI Optimized Resume</span>
                  <span className="text-emerald-400 font-mono">98% ATS MATCH</span>
                </div>
                <div>
                  <span className="font-bold text-purple-200">Job Title:</span> {optimizationResult.tailoredData.personalInfo.jobTitle}
                </div>
                <div>
                  <span className="font-bold text-purple-200">Tailored Summary:</span>
                  <p className="text-purple-100 mt-1">{optimizationResult.tailoredData.personalInfo.summary}</p>
                </div>
                <div>
                  <span className="font-bold text-purple-200">Replaced Project Tech Stacks:</span>
                  {optimizationResult.tailoredData.projects.map((p) => (
                    <div key={p.id} className="text-purple-100 mt-1">
                      <span className="font-semibold text-white">{p.title}:</span> [{p.techStack.join(', ')}]
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center border-t border-slate-800 pt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Cancel
          </button>
          {optimizationResult && (
            <button
              onClick={handleApplyFinal}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-orbitron font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 tracking-wider"
            >
              <Check size={16} /> APPLY AI TAILORED RESUME & PROJECT TECH STACKS
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
