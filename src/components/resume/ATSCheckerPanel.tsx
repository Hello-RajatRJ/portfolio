import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Search, Target } from 'lucide-react';
import type { ATSAnalysisResult } from '../../types/resume';

interface Props {
  analysis: ATSAnalysisResult;
  jobDescriptionText: string;
  onChangeJD: (text: string) => void;
  onClose: () => void;
}

export const ATSCheckerPanel: React.FC<Props> = ({
  analysis,
  jobDescriptionText,
  onChangeJD,
  onClose,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500';
    if (score >= 60) return 'text-amber-400 border-amber-500';
    return 'text-rose-400 border-rose-500';
  };

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-5 text-white shadow-2xl space-y-5">
      {/* Panel Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-emerald-400" />
          <h3 className="font-orbitron font-bold text-sm text-slate-100">ATS Optimizer & Scanner</h3>
        </div>
        <button onClick={onClose} className="text-xs text-slate-400 hover:text-white font-mono">
          ✕ CLOSE
        </button>
      </div>

      {/* Score Gauge & Rating */}
      <div className="flex items-center justify-between bg-slate-800/80 p-4 rounded-xl border border-slate-700">
        <div>
          <div className="text-xs text-slate-400 uppercase font-semibold">ATS Compatibility Rating</div>
          <div className="text-xl font-black text-white mt-0.5">{analysis.rating}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Action Verbs Found: <span className="text-emerald-300 font-bold">{analysis.actionVerbsCount}</span>
          </div>
        </div>

        <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-black text-xl ${getScoreColor(analysis.score)}`}>
          {analysis.score}%
        </div>
      </div>

      {/* Target Job Description Box */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1">
          <Search size={13} className="text-indigo-400" /> Match Against Job Description (JD)
        </label>
        <textarea
          rows={3}
          value={jobDescriptionText}
          onChange={(e) => onChangeJD(e.target.value)}
          placeholder="Paste target Job Description text here to benchmark keyword density and calculate exact role match percentage..."
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Extracted & Missing Keywords */}
      {analysis.missingKeywords.length > 0 && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs space-y-1">
          <div className="font-bold text-rose-300 flex items-center gap-1">
            <AlertTriangle size={13} /> Missing Role Keywords ({analysis.missingKeywords.length})
          </div>
          <div className="flex flex-wrap gap-1 pt-1">
            {analysis.missingKeywords.map((kw, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-rose-950 text-rose-200 text-[10px] font-mono border border-rose-800">
                + {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Feedback checklist items */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">ATS Optimization Checklist</div>
        <div className="space-y-1.5">
          {analysis.feedback.map((item, index) => (
            <div key={index} className="flex items-start gap-2 text-xs bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/60">
              {item.type === 'success' && <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />}
              {item.type === 'warning' && <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />}
              {item.type === 'error' && <XCircle size={15} className="text-rose-400 shrink-0 mt-0.5" />}
              <div>
                <span className="font-bold text-slate-200">{item.category}: </span>
                <span className="text-slate-400">{item.message}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
