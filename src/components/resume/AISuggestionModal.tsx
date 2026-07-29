import React, { useState } from 'react';
import { Sparkles, Key, Check, Copy, X } from 'lucide-react';
import type { ResumeData } from '../../types/resume';
import { AIResumeService } from '../../services/aiResumeService';

interface Props {
  data: ResumeData;
  onApplySummary: (summary: string) => void;
  onClose: () => void;
}

export const AISuggestionModal: React.FC<Props> = ({ data, onApplySummary, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [jobTitle, setJobTitle] = useState(data.personalInfo.jobTitle || 'Full Stack Engineer');
  const [skillsInput, setSkillsInput] = useState(
    data.skillCategories.flatMap((c) => c.skills).slice(0, 8).join(', ') || 'React, TypeScript, Node.js, WebGL'
  );
  const [loading, setLoading] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const skills = skillsInput.split(',').map((s) => s.trim());
    const res = await AIResumeService.generateAISummary(jobTitle, skills, apiKey);
    setGeneratedSummary(res);
    setLoading(false);
  };

  const handleApply = () => {
    if (generatedSummary) {
      onApplySummary(generatedSummary);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 text-white shadow-2xl space-y-5 relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-purple-400" />
            <h2 className="font-orbitron font-bold text-base text-white">AI Description & Summary Generator</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Architect"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Skills & Core Stack</label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="React, TypeScript, System Architecture, Node.js"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <Key size={12} className="text-amber-400" /> Optional: Free Gemini API Key (Uses built-in AI NLP engine if left blank)
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono"
            />
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-orbitron font-bold text-xs tracking-wider text-white shadow-lg disabled:opacity-50"
        >
          {loading ? 'GENERATING AI SUMMARY...' : '✨ GENERATE AI SUMMARY & BULLETS'}
        </button>

        {/* Result area */}
        {generatedSummary && (
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold text-slate-300">Generated Summary Proposal:</div>
            <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700 text-xs text-slate-200 leading-relaxed font-sans">
              {generatedSummary}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleApply}
                className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Check size={14} /> APPLY TO RESUME
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedSummary);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1"
              >
                <Copy size={13} /> {copied ? 'Copied!' : 'Copy Text'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
