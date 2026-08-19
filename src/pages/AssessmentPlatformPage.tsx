import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowLeft, Play, Clock, CheckCircle2, Award, BarChart3, RotateCcw, Building, FileText, ChevronRight, ChevronLeft, Bookmark, Zap, BookOpen } from 'lucide-react';
import { useStore } from '../store/useStore';
import { TECHNOLOGY_PACKS, AssessmentService } from '../services/assessmentService';
import type { TestConfig, TestSession, EvaluationResult, DifficultyLevel, ExamMode, CompanyPreset } from '../types/assessment';
import './AssessmentPlatformPage.css';

export const AssessmentPlatformPage: React.FC = () => {
  const returnToLanding = useStore((s) => s.returnToLanding);
  const openResumeBuilder = useStore((s) => s.openResumeBuilder);

  // View state: 'dashboard' | 'exam' | 'results'
  const [viewState, setViewState] = useState<'dashboard' | 'exam' | 'results'>('dashboard');

  // Config State
  const [selectedTechs, setSelectedTechs] = useState<string[]>(['javascript', 'react', 'python']);
  const [difficulty, setDifficulty] = useState<DifficultyLevel | 'mixed'>('mixed');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [examMode, setExamMode] = useState<ExamMode>('exam');
  const [companyPreset, setCompanyPreset] = useState<CompanyPreset>('general');
  const [jobDescription, setJobDescription] = useState('');
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);

  // Session & Evaluation State
  const [activeSession, setActiveSession] = useState<TestSession | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Countdown Timer
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (viewState === 'exam' && activeSession && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleForceSubmit();
            return 0;
          }
          return prev - 1;
        });

        setActiveSession((prev) => prev ? { ...prev, elapsedSeconds: prev.elapsedSeconds + 1 } : null);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [viewState, activeSession, remainingSeconds]);

  const toggleTechSelection = (techId: string) => {
    setSelectedTechs((prev) =>
      prev.includes(techId)
        ? prev.length > 1 ? prev.filter((id) => id !== techId) : prev
        : [...prev, techId]
    );
  };

  const handleStartExam = async () => {
    const config: TestConfig = {
      selectedTechs,
      difficulty,
      questionCount,
      mode: examMode,
      timeLimitMinutes: Math.ceil(questionCount * 1.5),
      companyPreset,
    };

    const session = AssessmentService.createTestSession(config);
    setActiveSession(session);
    setCurrentQuestionIdx(0);
    setRemainingSeconds(config.timeLimitMinutes * 60);
    setViewState('exam');
  };

  const handleGenerateJDTest = async () => {
    if (!jobDescription.trim()) return;
    setIsGeneratingCustom(true);
    try {
      const customQuestions = await AssessmentService.generateCustomAITest(jobDescription, companyPreset);
      const config: TestConfig = {
        selectedTechs: ['custom'],
        difficulty: 'advanced',
        questionCount: customQuestions.length,
        mode: examMode,
        timeLimitMinutes: Math.ceil(customQuestions.length * 2),
        companyPreset,
        jobDescription,
      };

      const session: TestSession = {
        id: `custom-session-${Date.now()}`,
        config,
        questions: customQuestions,
        userAnswers: {},
        markedForReview: [],
        startTime: Date.now(),
        elapsedSeconds: 0,
        status: 'in_progress',
      };

      setActiveSession(session);
      setCurrentQuestionIdx(0);
      setRemainingSeconds(config.timeLimitMinutes * 60);
      setViewState('exam');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingCustom(false);
    }
  };

  const handleSelectOption = (questionId: string, option: string) => {
    if (!activeSession) return;
    setActiveSession((prev) =>
      prev ? { ...prev, userAnswers: { ...prev.userAnswers, [questionId]: option } } : null
    );
  };

  const handleToggleMarkForReview = (questionId: string) => {
    if (!activeSession) return;
    setActiveSession((prev) => {
      if (!prev) return null;
      const isMarked = prev.markedForReview.includes(questionId);
      return {
        ...prev,
        markedForReview: isMarked
          ? prev.markedForReview.filter((id) => id !== questionId)
          : [...prev.markedForReview, questionId],
      };
    });
  };

  const handleForceSubmit = async () => {
    if (!activeSession || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const results = await AssessmentService.evaluateTestSession(activeSession);
      setEvaluationResult(results);
      setViewState('results');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQuestion = activeSession?.questions[currentQuestionIdx];

  const user = useStore((s) => s.user);

  return (
    <div className="assessment-container">
      {/* Top Navbar */}
      <header className="assessment-navbar">
        <div className="assessment-nav-brand">
          <Award size={20} className="text-yellow-400" />
          <span className="font-orbitron font-bold">AI TECHNICAL ASSESSMENT PLATFORM</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={returnToLanding}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-orbitron transition-all"
          >
            <ArrowLeft size={14} /> PORTFOLIO
          </button>
          <button
            onClick={openResumeBuilder}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold font-orbitron transition-all"
          >
            <FileText size={14} /> RESUME BUILDER
          </button>
        </div>
      </header>

      {/* DASHBOARD & TECH SETUP VIEW */}
      {viewState === 'dashboard' && (
        <div className="assessment-dashboard">
          {/* Hero Header */}
          <div className="assessment-hero-card">
            <div>
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold font-mono uppercase tracking-wider">
                Exam & Skills Simulator
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 font-orbitron">
                Master Technical Interviews & Certifications
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-xl">
                Test your skills across 70+ curated question packs in React, Python, AWS, Azure, Node.js, and System Design with live AI evaluation.
              </p>
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <div className="text-center p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-xl font-bold text-emerald-400">14+</div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">Tech Packs</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-xl font-bold text-yellow-400">70+</div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">Questions</div>
              </div>
            </div>
          </div>

          {/* Technology Pack Grid */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <BookOpen size={16} className="text-indigo-400" /> Select Technologies for Exam:
            </h2>
            <div className="assessment-tech-grid">
              {TECHNOLOGY_PACKS.map((tech) => {
                const isSelected = selectedTechs.includes(tech.id);
                return (
                  <div
                    key={tech.id}
                    onClick={() => toggleTechSelection(tech.id)}
                    className={`assessment-tech-card ${isSelected ? 'selected' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{tech.icon}</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${isSelected ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                        {isSelected ? 'SELECTED' : tech.category}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-sm">{tech.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{tech.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Config Setup Panel */}
          <div className="assessment-config-panel">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Zap size={16} className="text-yellow-400" /> Exam Configuration Settings:
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Question Count */}
              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-semibold">Question Count:</label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none"
                >
                  {[10, 20, 30, 50, 70].map((n) => (
                    <option key={n} value={n}>{n} Questions</option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-semibold">Difficulty Level:</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as DifficultyLevel | 'mixed')}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none capitalize"
                >
                  {['mixed', 'beginner', 'intermediate', 'advanced', 'expert'].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Exam Mode */}
              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-semibold">Mode:</label>
                <select
                  value={examMode}
                  onChange={(e) => setExamMode(e.target.value as ExamMode)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none"
                >
                  <option value="exam">Exam Mode (Strict Timer)</option>
                  <option value="practice">Practice Mode (Untimed & Hints)</option>
                </select>
              </div>

              {/* Company Preset */}
              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-semibold">Company Preset:</label>
                <select
                  value={companyPreset}
                  onChange={(e) => setCompanyPreset(e.target.value as CompanyPreset)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none capitalize"
                >
                  {['general', 'google', 'amazon', 'microsoft', 'tcs', 'infosys', 'capgemini'].map((c) => (
                    <option key={c} value={c}>{c === 'general' ? 'General Tech' : `${c.toUpperCase()} Exam`}</option>
                  ))}
                </select>
              </div>
            </div>

            <button onClick={handleStartExam} className="assessment-start-btn">
              <Play size={18} /> START MOCK TEST NOW ({questionCount} Questions)
            </button>
          </div>

          {/* AI Custom Job Description Test Generator */}
          <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
              <Sparkles size={16} className="text-yellow-400" />
              <span>AI Job Description & Company Test Generator</span>
            </div>
            <p className="text-xs text-slate-300">
              Paste a Job Description below to generate a tailored interview exam suite using Google Gemini AI!
            </p>
            <textarea
              rows={3}
              placeholder="Paste Job Description here (e.g. Seeking Senior React & Python Engineer with AWS experience)..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleGenerateJDTest}
              disabled={!jobDescription.trim() || isGeneratingCustom}
              className="self-end px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {isGeneratingCustom ? <Sparkles size={14} className="animate-spin" /> : <Building size={14} />}
              Generate AI Exam Suite
            </button>
          </div>
        </div>
      )}

      {/* ONLINE EXAM ARENA */}
      {viewState === 'exam' && activeSession && currentQuestion && (
        <div className="assessment-exam-arena">
          {/* Header */}
          <div className="assessment-exam-header">
            <div className="flex items-center gap-3">
              <span className="font-bold text-xs text-indigo-400 font-mono">
                QUESTION {currentQuestionIdx + 1} OF {activeSession.questions.length}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 capitalize font-mono">
                {currentQuestion.difficulty}
              </span>
            </div>

            {activeSession.config.mode === 'exam' && (
              <div className="assessment-timer-badge">
                <Clock size={14} />
                <span>{formatTimer(remainingSeconds)}</span>
              </div>
            )}
          </div>

          <div className="assessment-exam-body">
            {/* Question Palette Sidebar */}
            <aside className="assessment-palette-sidebar">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Question Palette:
              </div>
              <div className="assessment-palette-grid">
                {activeSession.questions.map((q, idx) => {
                  const isCurrent = idx === currentQuestionIdx;
                  const isAnswered = Boolean(activeSession.userAnswers[q.id]);
                  const isMarked = activeSession.markedForReview.includes(q.id);

                  let statusClass = '';
                  if (isCurrent) statusClass = 'current';
                  else if (isMarked) statusClass = 'marked';
                  else if (isAnswered) statusClass = 'answered';

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIdx(idx)}
                      className={`assessment-palette-btn ${statusClass}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="mt-auto p-3 bg-slate-900 border border-slate-800 rounded-xl text-[11px] text-slate-400 flex flex-col gap-1.5 font-mono">
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Answered</div>
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Marked for Review</div>
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-slate-600" /> Unanswered</div>
              </div>
            </aside>

            {/* Question Workspace */}
            <main className="assessment-question-workspace">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4">
                <div className="text-xs font-mono text-slate-400 font-semibold uppercase">
                  {currentQuestion.techName} • {currentQuestion.topic}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  {currentQuestion.questionText}
                </h3>

                {/* Code Snippet Box */}
                {currentQuestion.codeSnippet && (
                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto">
                    <code>{currentQuestion.codeSnippet}</code>
                  </pre>
                )}

                {/* Options List */}
                {currentQuestion.options && (
                  <div className="flex flex-col gap-3 mt-2">
                    {currentQuestion.options.map((opt, oIdx) => {
                      const isSelected = activeSession.userAnswers[currentQuestion.id] === opt;
                      return (
                        <div
                          key={oIdx}
                          onClick={() => handleSelectOption(currentQuestion.id, opt)}
                          className={`assessment-option-card ${isSelected ? 'selected' : ''}`}
                        >
                          <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-mono font-bold ${isSelected ? 'bg-indigo-600 border-indigo-400 text-white' : 'border-slate-700 text-slate-500'}`}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </main>
          </div>

          {/* Exam Navigation Footer */}
          <footer className="assessment-exam-footer">
            <button
              onClick={() => setCurrentQuestionIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIdx === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-bold text-white transition-all cursor-pointer"
            >
              <ChevronLeft size={16} /> Previous
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleToggleMarkForReview(currentQuestion.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  activeSession.markedForReview.includes(currentQuestion.id)
                    ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                    : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Bookmark size={14} /> Mark for Review
              </button>

              <button
                onClick={handleForceSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <CheckCircle2 size={16} /> {isSubmitting ? 'Evaluating Answers...' : 'Submit Exam'}
              </button>
            </div>

            <button
              onClick={() => setCurrentQuestionIdx((prev) => Math.min(activeSession.questions.length - 1, prev + 1))}
              disabled={currentQuestionIdx === activeSession.questions.length - 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-xs font-bold text-white transition-all cursor-pointer"
            >
              Save & Next <ChevronRight size={16} />
            </button>
          </footer>
        </div>
      )}

      {/* RESULTS & ANALYTICS DASHBOARD VIEW */}
      {viewState === 'results' && evaluationResult && (
        <div className="assessment-results-view">
          {/* Score Card */}
          <div className="assessment-score-card">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold border ${evaluationResult.status === 'PASS' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-red-500/20 text-red-300 border-red-500/40'}`}>
                  STATUS: {evaluationResult.status}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-semibold">
                  👤 Candidate: {user?.name || 'Software Engineer'} ({user?.rankTitle || 'Engineer'})
                </span>
              </div>
              <h2 className="text-3xl font-extrabold text-white mt-1 font-orbitron">
                Official Exam Assessment Certificate
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Completed {evaluationResult.correctAnswers} of {evaluationResult.totalQuestions} questions correctly in {Math.ceil(evaluationResult.timeSpentSeconds / 60)} minutes.
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl font-black text-indigo-400 font-orbitron">
                {evaluationResult.percentage}%
              </div>
              <div className="text-xs font-mono text-slate-400 uppercase mt-1">Overall Percentage</div>
            </div>

            <button
              onClick={() => setViewState('dashboard')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all cursor-pointer shadow-lg"
            >
              <RotateCcw size={16} /> Take Another Test
            </button>
          </div>

          {/* AI Feedback Card */}
          {evaluationResult.aiFeedback && (
            <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-yellow-400" /> AI Evaluation Feedback & Guidance:
              </h3>
              <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                {evaluationResult.aiFeedback}
              </div>
            </div>
          )}

          {/* Topic Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 size={16} className="text-indigo-400" /> Topic Accuracy Breakdown:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {evaluationResult.topicBreakdown.map((t, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">{t.topic} ({t.techName})</span>
                    <span className={`font-mono font-bold ${t.accuracy >= 60 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {t.accuracy}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${t.accuracy >= 60 ? 'bg-emerald-500' : 'bg-red-500'}`}
                      style={{ width: `${t.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
