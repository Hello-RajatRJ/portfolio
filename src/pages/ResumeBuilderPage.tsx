import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import type { ResumeData, TemplateId } from '../types/resume';
import { sampleResumeData } from '../data/sampleResume';
import { getTemplateConfig } from '../data/templateConfigs';
import { AIResumeService } from '../services/aiResumeService';
import { ResumeHeader } from '../components/resume/ResumeHeader';
import { ResumeFormEditor } from '../components/resume/ResumeFormEditor';
import { ATSCheckerPanel } from '../components/resume/ATSCheckerPanel';
import { AISuggestionModal } from '../components/resume/AISuggestionModal';
import { UploadCVModal } from '../components/resume/UploadCVModal';
import { AIOptimizerModal } from '../components/resume/AIOptimizerModal';
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
import { TemplateGalleryPage } from './TemplateGalleryPage';
import html2pdf from 'html2pdf.js';

export const ResumeBuilderPage: React.FC = () => {
  const returnToLanding = useStore((s) => s.returnToLanding);
  const openChatbotPage = useStore((s) => s.openChatbotPage);
  const [resumeData, setResumeData] = useState<ResumeData>(sampleResumeData);
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [showATS, setShowATS] = useState(true);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAIOptimizerModal, setShowAIOptimizerModal] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  // Compute live ATS score analysis
  const atsAnalysis = useMemo(() => {
    return AIResumeService.analyzeATS(resumeData, jobDescriptionText);
  }, [resumeData, jobDescriptionText]);

  const handleLoadSample = () => {
    setResumeData(sampleResumeData);
  };

  const handleApplySummary = (newSummary: string) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, summary: newSummary },
    }));
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('printable-resume');
    if (!element) return;
    setIsDownloadingPDF(true);
    try {
      const fileName = `${(resumeData.personalInfo.fullName || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`;
      const opt = {
        margin: [0.3, 0.3, 0.3, 0.3] as [number, number, number, number],
        filename: fileName,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const },
        pagebreak: { mode: ['css', 'legacy'] },
      };
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('PDF Generation failed, falling back to window.print()', err);
      window.print();
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const handleSelectGalleryTemplate = (templateId: TemplateId) => {
    setResumeData((prev) => ({
      ...prev,
      settings: { ...prev.settings, templateId },
    }));
    setShowGallery(false);
  };

  const renderTemplate = () => {
    // Try hand-crafted templates first
    switch (resumeData.settings.templateId) {
      case 'ats-classic':
        return <ATSClassicTemplate data={resumeData} />;
      case 'modern-tech':
        return <ModernTechTemplate data={resumeData} />;
      case 'creative-studio':
        return <CreativeStudioTemplate data={resumeData} />;
      case 'minimalist':
        return <MinimalistTemplate data={resumeData} />;
      case 'executive-suite':
        return <ExecutiveSuiteTemplate data={resumeData} />;
      case 'silicon-valley':
        return <SiliconValleyTemplate data={resumeData} />;
      case 'compact-one-page':
        return <CompactOnePageTemplate data={resumeData} />;
      case 'academic-cv':
        return <AcademicCVTemplate data={resumeData} />;
      case 'two-page-executive':
        return <TwoPageExecutiveTemplate data={resumeData} />;
      case 'two-page-tech-lead':
        return <TwoPageTechLeadTemplate data={resumeData} />;
      default: {
        // Fall back to configurable template engine
        const config = getTemplateConfig(resumeData.settings.templateId);
        if (config) {
          return <ConfigurableTemplate data={resumeData} config={config} />;
        }
        return <ATSClassicTemplate data={resumeData} />;
      }
    }
  };

  // If gallery is open, show the gallery full-screen
  if (showGallery) {
    return (
      <TemplateGalleryPage
        onSelectTemplate={handleSelectGalleryTemplate}
        onBack={() => setShowGallery(false)}
        currentTemplateId={resumeData.settings.templateId}
        data={resumeData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col font-sans pb-16">
      {/* Top Navigation Header */}
      <ResumeHeader
        data={resumeData}
        onChangeData={setResumeData}
        onLoadSample={handleLoadSample}
        onBack={returnToLanding}
        onToggleATS={() => setShowATS(!showATS)}
        showATS={showATS}
        onOpenAIModal={() => setShowAIModal(true)}
        onOpenUploadModal={() => setShowUploadModal(true)}
        onOpenAIOptimizer={() => setShowAIOptimizerModal(true)}
        onOpenChatbot={openChatbotPage}
        onDownloadPDF={handleDownloadPDF}
        isDownloadingPDF={isDownloadingPDF}
        onOpenGallery={() => setShowGallery(true)}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Controls & ATS Panel */}
        <div className="lg:col-span-5 space-y-6">
          <ResumeFormEditor
            data={resumeData}
            onChangeData={setResumeData}
            onTriggerAISuggest={() => setShowAIModal(true)}
            onOpenUploadModal={() => setShowUploadModal(true)}
            onOpenAIOptimizer={() => setShowAIOptimizerModal(true)}
          />

          {showATS && (
            <ATSCheckerPanel
              analysis={atsAnalysis}
              jobDescriptionText={jobDescriptionText}
              onChangeJD={setJobDescriptionText}
              onClose={() => setShowATS(false)}
            />
          )}
        </div>

        {/* Right Column: Live Resume Preview */}
        <div className="lg:col-span-7 sticky top-20">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 backdrop-blur-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                LIVE PREVIEW · {resumeData.settings.templateId.toUpperCase()}
              </span>
              <span>100% ATS Parser Safe</span>
            </div>

            {/* Rendered Template Document */}
            <div className="overflow-x-auto max-h-[82vh] overflow-y-auto rounded-lg border border-slate-700/50 p-2 sm:p-4 bg-slate-950/40 scrollbar-thin">
              {renderTemplate()}
            </div>
          </div>
        </div>
      </main>

      {/* Upload CV Modal */}
      {showUploadModal && (
        <UploadCVModal
          onImportResume={(importedData) => setResumeData(importedData)}
          onClose={() => setShowUploadModal(false)}
        />
      )}

      {/* AI Resume Optimization Modal */}
      {showAIOptimizerModal && (
        <AIOptimizerModal
          data={resumeData}
          onApplyOptimization={(optimizedData) => setResumeData(optimizedData)}
          onClose={() => setShowAIOptimizerModal(false)}
        />
      )}

      {/* Standard AI Suggestion Modal */}
      {showAIModal && (
        <AISuggestionModal
          data={resumeData}
          onApplySummary={handleApplySummary}
          onClose={() => setShowAIModal(false)}
        />
      )}

      {/* FIXED BOTTOM HEADER BAR */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 px-3 sm:px-6 py-2 shadow-2xl flex items-center justify-between flex-wrap gap-2 text-xs font-semibold text-white">
        <div className="flex items-center gap-3 overflow-x-auto">
          {/* Live ATS Score Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900 border border-slate-700/80">
            <span className="text-slate-400 font-mono text-[10px] uppercase font-bold tracking-wider">ATS SCORE:</span>
            <span className={`font-orbitron font-bold text-sm ${atsAnalysis.score >= 80 ? 'text-emerald-400' : atsAnalysis.score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
              {atsAnalysis.score}/100
            </span>
          </div>

          <button
            onClick={() => setShowGallery(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 transition-all cursor-pointer"
          >
            🎨 <span>Templates</span>
          </button>

          <button
            onClick={() => setShowAIOptimizerModal(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/40 text-purple-300 transition-all cursor-pointer"
          >
            🚀 <span>AI Matcher</span>
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all cursor-pointer"
          >
            📥 <span>Import CV</span>
          </button>

          <button
            onClick={openChatbotPage}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-950/60 hover:bg-blue-900/60 border border-blue-500/40 text-blue-300 transition-all cursor-pointer"
          >
            🤖 <span>AI Coach</span>
          </button>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => {
              const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(resumeData, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute('href', dataStr);
              downloadAnchor.setAttribute('download', `${(resumeData.personalInfo.fullName || 'Resume').replace(/\s+/g, '_')}_Backup.json`);
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all cursor-pointer text-[11px]"
          >
            Export JSON
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isDownloadingPDF}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-600/30 cursor-pointer"
          >
            🖨️ <span>{isDownloadingPDF ? 'Exporting PDF...' : 'DOWNLOAD PDF'}</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ResumeBuilderPage;
