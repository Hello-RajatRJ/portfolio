import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Search, Grid3X3, Sparkles, CheckCircle2, Eye, X, Check } from 'lucide-react';
import { ALL_TEMPLATES, CATEGORY_LABELS, getTemplateConfig } from '../data/templateConfigs';
import type { CategoryTag, TemplateMetadata } from '../data/templateConfigs';
import type { ResumeData, TemplateId } from '../types/resume';
import { sampleResumeData } from '../data/sampleResume';
import { RazorpayUtil } from '../utils/razorpay';

// Template imports for live preview
import { ATSClassicTemplate } from '../components/resume/templates/ATSClassicTemplate';
import { ModernTechTemplate } from '../components/resume/templates/ModernTechTemplate';
import { CreativeStudioTemplate } from '../components/resume/templates/CreativeStudioTemplate';
import { MinimalistTemplate } from '../components/resume/templates/MinimalistTemplate';
import { ExecutiveSuiteTemplate } from '../components/resume/templates/ExecutiveSuiteTemplate';
import { SiliconValleyTemplate } from '../components/resume/templates/SiliconValleyTemplate';
import { CompactOnePageTemplate } from '../components/resume/templates/CompactOnePageTemplate';
import { AcademicCVTemplate } from '../components/resume/templates/AcademicCVTemplate';
import { TwoPageExecutiveTemplate } from '../components/resume/templates/TwoPageExecutiveTemplate';
import { TwoPageTechLeadTemplate } from '../components/resume/templates/TwoPageTechLeadTemplate';
import { ConfigurableTemplate } from '../components/resume/templates/ConfigurableTemplate';

import { ConfirmTemplateChangeModal } from '../components/resume/ConfirmTemplateChangeModal';

interface Props {
  onSelectTemplate: (templateId: TemplateId) => void;
  onBack: () => void;
  currentTemplateId: TemplateId;
  data?: ResumeData;
}

export const TemplateGalleryPage: React.FC<Props> = ({
  onSelectTemplate,
  onBack,
  currentTemplateId,
  data = sampleResumeData,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryTag | 'all'>('all');
  const [previewModalTemplate, setPreviewModalTemplate] = useState<TemplateMetadata | null>(null);
  const [confirmTemplateModal, setConfirmTemplateModal] = useState<TemplateMetadata | null>(null);

  // Handle return from backend payment gateway URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const unlockedId = searchParams.get('unlockedTemplate');
      const paymentStatus = searchParams.get('payment');
      if (unlockedId && paymentStatus === 'success') {
        onSelectTemplate(unlockedId as TemplateId);
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [onSelectTemplate]);

  const handleUnlockTemplate = (template: TemplateMetadata) => {
    RazorpayUtil.initiatePayment({
      amountInINR: 50,
      itemName: `Resume Template: ${template.name}`,
      itemDescription: 'Lifetime template access & export',
      itemId: template.id,
      type: 'template',
      onSuccess: () => {
        onSelectTemplate(template.id as TemplateId);
      },
    });
  };

  const categories: (CategoryTag | 'all')[] = ['all', ...Object.keys(CATEGORY_LABELS) as CategoryTag[]];

  const filteredTemplates = useMemo(() => {
    return ALL_TEMPLATES.filter((t) => {
      const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
      const matchesSearch =
        searchQuery === '' ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.badge.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const renderLiveTemplate = (templateId: TemplateId, customData?: ResumeData) => {
    const renderData = customData || data;
    switch (templateId) {
      case 'ats-classic':
        return <ATSClassicTemplate data={renderData} />;
      case 'modern-tech':
        return <ModernTechTemplate data={renderData} />;
      case 'creative-studio':
        return <CreativeStudioTemplate data={renderData} />;
      case 'minimalist':
        return <MinimalistTemplate data={renderData} />;
      case 'executive-suite':
        return <ExecutiveSuiteTemplate data={renderData} />;
      case 'silicon-valley':
        return <SiliconValleyTemplate data={renderData} />;
      case 'compact-one-page':
        return <CompactOnePageTemplate data={renderData} />;
      case 'academic-cv':
        return <AcademicCVTemplate data={renderData} />;
      case 'two-page-executive':
        return <TwoPageExecutiveTemplate data={renderData} />;
      case 'two-page-tech-lead':
        return <TwoPageTechLeadTemplate data={renderData} />;
      default: {
        const config = getTemplateConfig(templateId);
        if (config) {
          return <ConfigurableTemplate data={renderData} config={config} />;
        }
        return <ATSClassicTemplate data={renderData} />;
      }
    }
  };

  const getCategoryColor = (cat: CategoryTag): string => {
    const map: Record<CategoryTag, string> = {
      '1-page': '#3b82f6',
      '2-page': '#8b5cf6',
      'ats-safe': '#10b981',
      'corporate': '#475569',
      'tech': '#06b6d4',
      'creative': '#ec4899',
      'minimal': '#6b7280',
      'executive': '#f59e0b',
      'academic': '#7c2d12',
      'industry': '#0d9488',
      'developer': '#22c55e',
      'compact': '#f97316',
    };
    return map[cat] || '#6b7280';
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white font-sans flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-orbitron transition-all"
            >
              <ArrowLeft size={14} />
              BACK TO BUILDER
            </button>
            <div className="flex items-center gap-2">
              <Grid3X3 size={20} className="text-indigo-400" />
              <span className="font-orbitron font-bold text-base tracking-wider bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                TEMPLATE GALLERY
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                50 ATS TEMPLATES
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 50+ templates..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </header>

      {/* Category Filter Tabs */}
      <div className="sticky top-[73px] z-30 bg-slate-900/90 backdrop-blur-sm border-b border-slate-800 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {cat === 'all' ? '🎯 All Templates' : CATEGORY_LABELS[cat]}
              <span className="ml-1.5 text-[9px] opacity-60 font-mono">
                ({cat === 'all' ? ALL_TEMPLATES.length : ALL_TEMPLATES.filter((t) => t.category === cat).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-8 py-8 flex-1 w-full">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-base font-semibold">No templates match your search query.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="mt-3 text-xs text-indigo-400 hover:underline font-semibold"
            >
              Reset Filters & Show All Templates
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => {
              const isSelected = currentTemplateId === template.id;
              const catColor = getCategoryColor(template.category);

              return (
                <div
                  key={template.id}
                  className={`group relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-300 hover:shadow-2xl ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-indigo-500/20 ring-2 ring-indigo-500/50'
                      : 'bg-slate-900/80 border-slate-700/80 hover:border-indigo-500/70 hover:bg-slate-900'
                  }`}
                >
                  {/* Active Selected Badge */}
                  {isSelected && (
                    <div className="absolute -top-3 left-6 z-10 px-3 py-1 bg-indigo-600 rounded-full flex items-center gap-1.5 shadow-xl text-xs font-bold text-white tracking-wide">
                      <CheckCircle2 size={13} /> CURRENTLY ACTIVE
                    </div>
                  )}

                  <div>
                    {/* Real Live Scaled Resume Preview Window (High Contrast & Visible) */}
                    <div className="relative h-72 sm:h-80 w-full rounded-xl mb-4 overflow-hidden border border-slate-700/80 bg-slate-950 shadow-inner group-hover:border-indigo-500/60 transition-colors">
                      {/* Scaled Mini Document */}
                      <div className="absolute top-0 left-0 w-[780px] h-[1100px] transform scale-[0.42] sm:scale-[0.45] origin-top-left pointer-events-none select-none p-1 bg-white shadow-2xl">
                        {renderLiveTemplate(template.id)}
                      </div>

                      {/* Quick Hover Controls Overlay */}
                      <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs flex flex-col items-center justify-center gap-3 p-6">
                        <button
                          onClick={() => setPreviewModalTemplate(template)}
                          className="w-full max-w-[230px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-600 shadow-lg transition-all transform hover:scale-105"
                        >
                          <Eye size={15} className="text-indigo-400" />
                          <span>FULL SCREEN PREVIEW</span>
                        </button>
                        
                        {template.isHandCrafted ? (
                          <button
                            onClick={() => handleUnlockTemplate(template)}
                            className="w-full max-w-[230px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-xs font-bold shadow-xl shadow-amber-500/25 transition-all transform hover:scale-105"
                          >
                            <span>💳 UNLOCK FOR ₹50 (RAZORPAY)</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setConfirmTemplateModal(template)}
                            className="w-full max-w-[230px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xl transition-all transform hover:scale-105"
                          >
                            <Check size={15} />
                            <span>APPLY THIS TEMPLATE</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Template Card Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-bold font-mono"
                            style={{ backgroundColor: `${catColor}20`, color: catColor, border: `1px solid ${catColor}50` }}
                          >
                            {template.badge}
                          </span>
                          {template.isHandCrafted && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              <Sparkles size={10} className="inline mr-1" />₹50 PAID
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 font-semibold">
                          {CATEGORY_LABELS[template.category]}
                        </span>
                      </div>

                      <h3 className={`text-base font-bold ${isSelected ? 'text-indigo-300' : 'text-white'}`}>
                        {template.name}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                        {template.description}
                      </p>
                    </div>
                  </div>

                  {/* Explicit Bottom Action Buttons */}
                  <div className="mt-5 pt-3.5 border-t border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => setPreviewModalTemplate(template)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all"
                    >
                      <Eye size={13} className="text-indigo-400" />
                      Preview
                    </button>

                    {template.isHandCrafted ? (
                      <button
                        onClick={() => handleUnlockTemplate(template)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-md shadow-amber-500/20 transition-all"
                      >
                        💳 UNLOCK ₹50
                      </button>
                    ) : (
                      <button
                        onClick={() => setConfirmTemplateModal(template)}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-md ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                        }`}
                      >
                        <Check size={13} />
                        {isSelected ? 'ACTIVE' : 'SELECT'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Full Screen Live Preview Modal */}
      {previewModalTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-bold text-white font-orbitron">
                  {previewModalTemplate.name}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {previewModalTemplate.badge}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setConfirmTemplateModal(previewModalTemplate);
                    setPreviewModalTemplate(null);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg transition-all"
                >
                  <Check size={14} />
                  USE THIS TEMPLATE
                </button>
                <button
                  onClick={() => setPreviewModalTemplate(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Live Resume View Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-950/70 flex justify-center">
              <div className="w-full max-w-[850px] shadow-2xl rounded-lg overflow-hidden border border-slate-800">
                {renderLiveTemplate(previewModalTemplate.id)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmTemplateModal && (
        <ConfirmTemplateChangeModal
          templateId={confirmTemplateModal.id}
          templateName={confirmTemplateModal.name}
          onConfirm={() => {
            onSelectTemplate(confirmTemplateModal.id);
            setConfirmTemplateModal(null);
          }}
          onCancel={() => setConfirmTemplateModal(null)}
        />
      )}
    </div>
  );
};
