import React from 'react';
import { Palette, Check, X, AlertCircle, Layers } from 'lucide-react';
import type { TemplateId } from '../../types/resume';

interface Props {
  templateId: TemplateId;
  templateName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmTemplateChangeModal: React.FC<Props> = ({
  templateId,
  templateName,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl space-y-5 relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400">
              <Palette size={20} />
            </div>
            <div>
              <h2 className="font-orbitron font-bold text-base text-white">Change Resume Template</h2>
              <p className="text-xs text-slate-400">Confirm layout switch</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-indigo-500/30 space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold">
              <Layers size={15} />
              <span>Target Template:</span>
            </div>
            <div className="text-sm font-orbitron font-bold text-white tracking-wide">
              {templateName}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              ID: {templateId}
            </div>
          </div>

          <p className="leading-relaxed">
            Are you sure you want to apply the <strong className="text-white">{templateName}</strong> template? All your resume details, work experiences, skills, and projects will automatically format to match this design.
          </p>

          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>Your resume data will be safely preserved.</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 border-t border-slate-800 pt-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Check size={16} /> ACCEPT & APPLY TEMPLATE
          </button>
        </div>
      </div>
    </div>
  );
};
