import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Download, RefreshCw, Palette, FileText, CheckCircle, ChevronDown, Layers, Upload, Bot } from 'lucide-react';
import type { ResumeData, TemplateId } from '../../types/resume';
import { ConfirmTemplateChangeModal } from './ConfirmTemplateChangeModal';

interface Props {
  data: ResumeData;
  onChangeData: (data: ResumeData) => void;
  onLoadSample: () => void;
  onBack: () => void;
  onToggleATS: () => void;
  showATS: boolean;
  onOpenAIModal: () => void;
  onOpenUploadModal?: () => void;
  onOpenAIOptimizer?: () => void;
  onOpenChatbot?: () => void;
  onDownloadPDF: () => void;
  isDownloadingPDF?: boolean;
  onOpenGallery?: () => void;
}

const TEMPLATE_GROUPS: { groupName: string; templates: { id: TemplateId; name: string; badge: string }[] }[] = [
  {
    groupName: '📄 Standard 1-Page Templates',
    templates: [
      { id: 'ats-classic', name: 'ATS Classic Executive', badge: 'ATS SAFE' },
      { id: 'modern-tech', name: 'Modern Tech Stack', badge: 'TECH' },
      { id: 'creative-studio', name: 'Creative Studio Sidebar', badge: 'DESIGN' },
      { id: 'minimalist', name: 'Minimalist Clean', badge: 'CLEAN' },
      { id: 'bold-header', name: 'Bold Header', badge: 'ATS SAFE' },
      { id: 'corporate-clean', name: 'Corporate Clean', badge: 'ATS SAFE' },
      { id: 'timeline-modern', name: 'Timeline Modern', badge: 'MODERN' },
    ],
  },
  {
    groupName: '💻 Tech & Developer',
    templates: [
      { id: 'professional-mono', name: 'Professional Mono', badge: 'DEV' },
      { id: 'startup-pitch', name: 'Startup Pitch', badge: 'STARTUP' },
      { id: 'devops-pipeline', name: 'DevOps Pipeline', badge: 'DEVOPS' },
      { id: 'data-science', name: 'Data Science', badge: 'DATA' },
      { id: 'stack-dev', name: 'Full Stack Developer', badge: 'STACK' },
      { id: 'api-docs', name: 'API Documentation', badge: 'API' },
      { id: 'terminal-dark', name: 'Terminal Dark', badge: 'TERMINAL' },
      { id: 'github-readme', name: 'GitHub README', badge: 'GITHUB' },
      { id: 'code-block', name: 'Code Block', badge: 'CODE' },
      { id: 'blueprint-engineer', name: 'Blueprint Engineer', badge: 'ENGINEER' },
    ],
  },
  {
    groupName: '🎨 Creative & Design',
    templates: [
      { id: 'gradient-accent', name: 'Gradient Accent', badge: 'CREATIVE' },
      { id: 'colorful-blocks', name: 'Colorful Blocks', badge: 'DESIGN' },
      { id: 'magazine-layout', name: 'Magazine Layout', badge: 'EDITORIAL' },
      { id: 'ribbon-accent', name: 'Ribbon Accent', badge: 'STYLISH' },
      { id: 'split-screen', name: 'Split Screen', badge: 'MODERN' },
    ],
  },
  {
    groupName: '✨ Minimal & Elegant',
    templates: [
      { id: 'swiss-design', name: 'Swiss Design', badge: 'SWISS' },
      { id: 'zen-minimal', name: 'Zen Minimal', badge: 'ZEN' },
      { id: 'nordic-light', name: 'Nordic Light', badge: 'NORDIC' },
      { id: 'elegant-serif', name: 'Elegant Serif', badge: 'ELEGANT' },
      { id: 'metro-tiles', name: 'Metro Tiles', badge: 'METRO' },
    ],
  },
  {
    groupName: '🏛 Executive & Leadership',
    templates: [
      { id: 'executive-suite', name: 'Executive Leadership Suite', badge: 'EXEC' },
      { id: 'clevel-executive', name: 'C-Level Executive', badge: 'C-SUITE' },
      { id: 'board-director', name: 'Board Director', badge: 'BOARD' },
      { id: 'vp-leadership', name: 'VP Leadership', badge: 'VP' },
      { id: 'director-ops', name: 'Director Operations', badge: 'DIRECTOR' },
      { id: 'infographic-bars', name: 'Infographic Bars', badge: 'VISUAL' },
    ],
  },
  {
    groupName: '🏥 Industry-Specific',
    templates: [
      { id: 'healthcare-pro', name: 'Healthcare Professional', badge: 'HEALTH' },
      { id: 'finance-analyst', name: 'Finance Analyst', badge: 'FINANCE' },
      { id: 'legal-counsel', name: 'Legal Counsel', badge: 'LEGAL' },
      { id: 'marketing-creative', name: 'Marketing Creative', badge: 'MARKETING' },
      { id: 'educator-academic', name: 'Educator Academic', badge: 'EDUCATION' },
    ],
  },
  {
    groupName: '📑 2-Page & Extended',
    templates: [
      { id: 'two-page-executive', name: '2-Page Detailed Executive', badge: '2-PAGE' },
      { id: 'two-page-tech-lead', name: '2-Page Tech Lead & Architect', badge: '2-PAGE' },
      { id: 'two-page-academic', name: '2-Page Academic CV', badge: '2-PAGE' },
      { id: 'two-page-project', name: '2-Page Project Portfolio', badge: '2-PAGE' },
      { id: 'two-page-comprehensive', name: '2-Page Comprehensive', badge: '2-PAGE' },
    ],
  },
  {
    groupName: '📦 Compact & Dense',
    templates: [
      { id: 'silicon-valley', name: 'Silicon Valley Engineering', badge: 'CODE' },
      { id: 'compact-one-page', name: '1-Page High Density Compact', badge: 'COMPACT' },
      { id: 'academic-cv', name: 'Academic & Research CV', badge: 'RESEARCH' },
      { id: 'ultra-compact', name: 'Ultra Compact', badge: 'COMPACT' },
      { id: 'dense-grid', name: 'Dense Grid', badge: 'DENSE' },
      { id: 'summary-first', name: 'Summary First', badge: 'SUMMARY' },
      { id: 'skills-heavy', name: 'Skills Heavy', badge: 'SKILLS' },
    ],
  },
];

const COLORS = ['#4f46e5', '#7c3aed', '#2563eb', '#059669', '#d97706', '#dc2626', '#1e293b'];

export const ResumeHeader: React.FC<Props> = ({
  data,
  onChangeData,
  onLoadSample,
  onBack,
  onToggleATS,
  showATS,
  onOpenAIModal,
  onOpenUploadModal,
  onOpenAIOptimizer,
  onOpenChatbot,
  onDownloadPDF,
  isDownloadingPDF,
  onOpenGallery,
}) => {
  const [pendingTemplate, setPendingTemplate] = useState<{ id: TemplateId; name: string } | null>(null);

  const handleSelectTemplateChange = (templateId: TemplateId) => {
    if (templateId === data.settings.templateId) return;
    const templateName = TEMPLATE_GROUPS.flatMap((g) => g.templates).find((t) => t.id === templateId)?.name || templateId;
    setPendingTemplate({ id: templateId, name: templateName });
  };

  const confirmTemplateChange = () => {
    if (pendingTemplate) {
      onChangeData({
        ...data,
        settings: { ...data.settings, templateId: pendingTemplate.id },
      });
      setPendingTemplate(null);
    }
  };

  const setColor = (accentColor: string) => {
    onChangeData({
      ...data,
      settings: { ...data.settings, accentColor },
    });
  };

  const currentTemplateBadge =
    TEMPLATE_GROUPS.flatMap((g) => g.templates).find((t) => t.id === data.settings.templateId)?.badge || 'ATS SAFE';

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800 text-white px-3 sm:px-6 py-2.5 shadow-xl">
      <div className="max-w-[1700px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Left: Brand & Navigation */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start border-b lg:border-b-0 border-slate-800 pb-2 lg:pb-0">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-orbitron transition-all"
          >
            <ArrowLeft size={13} />
            <span className="hidden sm:inline">PORTFOLIO</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30">
              <FileText size={18} className="text-indigo-400" />
            </div>
            <span className="font-orbitron font-bold text-xs sm:text-sm tracking-wider bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
              RESUME ARCHITECT
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              FREE ATS
            </span>
          </div>
        </div>

        {/* Center: Template Picker & Gallery & Color Accents */}
        <div className="flex items-center flex-wrap justify-center gap-2.5 w-full lg:w-auto">
          {/* Visual Gallery Launcher Button */}
          {onOpenGallery && (
            <button
              onClick={onOpenGallery}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all"
            >
              <Layers size={14} />
              <span>TEMPLATES GALLERY</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[9px] font-mono">50+</span>
            </button>
          )}

          {/* Quick Select Dropdown */}
          <div className="relative flex items-center bg-slate-800/90 border border-slate-700 rounded-lg px-2.5 py-1.5 shadow-sm">
            <select
              value={data.settings.templateId}
              onChange={(e) => handleSelectTemplateChange(e.target.value as TemplateId)}
              className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer pr-6 appearance-none max-w-[160px] sm:max-w-[200px] truncate"
            >
              {TEMPLATE_GROUPS.map((group) => (
                <optgroup key={group.groupName} label={group.groupName} className="bg-slate-900 text-slate-300 font-sans font-semibold">
                  {group.templates.map((t) => (
                    <option key={t.id} value={t.id} className="bg-slate-900 text-white font-sans py-1">
                      {t.name} ({t.badge})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <ChevronDown size={13} className="text-slate-400 pointer-events-none absolute right-2" />
            <span className="ml-2 px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hidden sm:inline-block">
              {currentTemplateBadge}
            </span>
          </div>

          {/* Color Palette Selector */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
            <Palette size={13} className="text-slate-400 mx-1" />
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-4 h-4 rounded-full transition-all ${
                  data.settings.accentColor === c ? 'scale-125 ring-2 ring-white shadow-md' : 'opacity-70 hover:opacity-100 hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
                title={`Accent Color: ${c}`}
              />
            ))}
          </div>
        </div>

        {/* Right: Quick PDF Action */}
        <div className="flex items-center flex-wrap justify-center lg:justify-end gap-2 w-full lg:w-auto">
          <button
            onClick={onDownloadPDF}
            disabled={isDownloadingPDF}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 hover:scale-[1.02] transition-all cursor-pointer"
            title="Download PDF directly to your device"
          >
            <Download size={13} />
            <span>{isDownloadingPDF ? 'GENERATING PDF...' : 'DOWNLOAD PDF'}</span>
          </button>
        </div>
      </div>

      {/* SECONDARY SUB-NAVBAR BAR */}
      <div className="bg-slate-950/90 border-t border-slate-800/80 px-3 sm:px-6 py-1.5 mt-2 max-w-[1700px] mx-auto rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs font-semibold">
        <div className="flex items-center gap-2 overflow-x-auto py-0.5">
          <span className="text-slate-400 font-mono text-[10px] uppercase font-bold tracking-wider mr-1">QUICK TOOLBAR:</span>

          {onOpenGallery && (
            <button
              onClick={onOpenGallery}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 transition-all cursor-pointer"
            >
              <Layers size={12} />
              <span>Templates Gallery</span>
            </button>
          )}

          <button
            onClick={onLoadSample}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all cursor-pointer"
          >
            <RefreshCw size={12} />
            <span>Load Demo Resume</span>
          </button>

          {onOpenAIOptimizer && (
            <button
              onClick={onOpenAIOptimizer}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/40 text-purple-300 transition-all cursor-pointer"
            >
              <Sparkles size={12} />
              <span>AI ATS Matcher</span>
            </button>
          )}

          <button
            onClick={onOpenAIModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-500/40 text-indigo-300 transition-all cursor-pointer"
          >
            <Sparkles size={12} />
            <span>AI Suggest</span>
          </button>

          {onOpenUploadModal && (
            <button
              onClick={onOpenUploadModal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all cursor-pointer"
            >
              <Upload size={12} />
              <span>Import Existing CV</span>
            </button>
          )}

          {onOpenChatbot && (
            <button
              onClick={onOpenChatbot}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-950/50 hover:bg-blue-900/60 border border-blue-500/40 text-blue-300 transition-all cursor-pointer"
            >
              <Bot size={12} />
              <span>AI Career Assistant</span>
            </button>
          )}

          <button
            onClick={onToggleATS}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
              showATS ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <CheckCircle size={12} />
            <span>ATS Score Gauge ({showATS ? 'ON' : 'OFF'})</span>
          </button>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={onDownloadPDF}
            disabled={isDownloadingPDF}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-sm cursor-pointer"
          >
            <Download size={12} />
            <span>{isDownloadingPDF ? 'Exporting...' : 'Export PDF'}</span>
          </button>

          <button
            onClick={() => {
              const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute('href', dataStr);
              downloadAnchor.setAttribute('download', `${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume_Backup.json`);
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all cursor-pointer"
            title="Download JSON backup"
          >
            <FileText size={12} />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {pendingTemplate && (
        <ConfirmTemplateChangeModal
          templateId={pendingTemplate.id}
          templateName={pendingTemplate.name}
          onConfirm={confirmTemplateChange}
          onCancel={() => setPendingTemplate(null)}
        />
      )}
    </header>
  );
};
