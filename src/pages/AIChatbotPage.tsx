import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, ArrowLeft, Key, Sparkles, CheckCircle2, Copy, Check, Code, Trash2, FileText, Menu, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { AIChatbotService, PRESET_TOPICS, type ChatMessage } from '../services/aiChatbotService';
import { sampleResumeData } from '../data/sampleResume';
import './AIChatbotPage.css';

const TECH_PILLS = [
  { name: 'React', icon: '⚛️', prompt: 'Explain advanced React 19 performance patterns (use, Actions, Server Components) with TypeScript code examples.' },
  { name: 'TypeScript', icon: '🔷', prompt: 'Give me top TypeScript interview coding questions covering Generics, Conditional Types, and Utility Types with code.' },
  { name: 'Node.js', icon: '🟢', prompt: 'Give me a Node.js microservices interview question with Express middleware code and Redis Caching architecture.' },
  { name: 'Python', icon: '🐍', prompt: 'Explain Python AsyncIO, Decorators, and Fast API architecture with complete code examples.' },
  { name: 'Java', icon: '☕', prompt: 'Explain Java Spring Boot Dependency Injection and Multithreading concurrency patterns with code.' },
  { name: 'Docker', icon: '🐳', prompt: 'Write a multi-stage Dockerfile and docker-compose configuration for a Node.js + PostgreSQL app.' },
  { name: 'AWS', icon: '☁️', prompt: 'How do you architect a serverless backend on AWS using API Gateway, Lambda, S3, and DynamoDB?' },
  { name: 'System Design', icon: '🧠', prompt: 'Give me a complete System Design architectural interview question (e.g. Rate Limiter or URL Shortener) with DB schema and code.' },
  { name: 'SQL & Databases', icon: '🗄️', prompt: 'Explain SQL indexing, B-Trees, transaction isolation levels, and query optimization with SQL examples.' },
  { name: 'Go (Golang)', icon: '🐹', prompt: 'Explain Go Goroutines, Channels, and Worker Pool concurrency patterns with runnable Go code.' },
];

export const AIChatbotPage: React.FC = () => {
  const returnToLanding = useStore((s) => s.returnToLanding);
  const openResumeBuilder = useStore((s) => s.openResumeBuilder);

  const [activeTab, setActiveTab] = useState<'all' | 'interview_prep' | 'job_purpose' | 'cv_suggestion' | 'mentoring'>('all');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [showApiInput, setShowApiInput] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [appliedMsgId, setAppliedMsgId] = useState<string | null>(null);
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-page-1',
      sender: 'assistant',
      text: `### 🤖 Welcome to the AI Career & Technical Knowledge Hub!

I am your **AI Career Coach, Code Assistant & Technical Interviewer**.

You can **manually ask me any questions** around any technology stack, software architecture, career goals, or CV suggestions!

#### 🛠️ What would you like to explore?
- ⚛️ **React, TypeScript & Web Architecture**
- 🟢 **Node.js, Express & Microservices**
- 🐍 **Python, Fast API & Async Workflows**
- 🧠 **System Design, Database Indexing & Cloud (AWS / Docker)**
- 🎯 **Job Purpose Context & Resume Optimization**

Select a technology tag on the left or type your custom question below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'general',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSaveApiKey = () => {
    setApiKey(tempApiKey);
    localStorage.setItem('gemini_api_key', tempApiKey);
    setShowApiInput(false);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: '### 🧹 Chat History Cleared!\n\nAsk me any question about React, Node.js, Python, Java, Docker, AWS, System Design, or CV guidance!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    try {
      const assistantMsg = await AIChatbotService.sendMessage(query, messages, sampleResumeData, apiKey);
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSelectTech = (tech: typeof TECH_PILLS[0]) => {
    setSelectedTech(tech.name);
    handleSendMessage(tech.prompt);
    setMobileSidebarOpen(false);
  };

  const handleCopyCode = (codeText: string, codeId: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeIdx(codeId);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  const renderFormattedMarkdown = (text: string, msgId: string) => {
    // Check for fenced code blocks ```lang ... ```
    if (text.includes('```')) {
      const parts = text.split(/(```[\s\S]*?```)/g);
      return parts.map((part, pIdx) => {
        if (part.startsWith('```')) {
          const firstLineEnd = part.indexOf('\n');
          const lang = part.substring(3, firstLineEnd).trim() || 'code';
          const codeContent = part.substring(firstLineEnd + 1, part.length - 3).trim();
          const codeId = `${msgId}-code-${pIdx}`;

          return (
            <div key={codeId} className="my-3 rounded-xl border border-slate-700 bg-slate-950 overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5 text-indigo-400 font-bold uppercase tracking-wider">
                  <Code size={14} /> {lang}
                </span>
                <button
                  onClick={() => handleCopyCode(codeContent, codeId)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer font-sans text-xs"
                >
                  {copiedCodeIdx === codeId ? (
                    <>
                      <Check size={12} className="text-emerald-400" /> Copied Code!
                    </>
                  ) : (
                    <>
                      <Copy size={12} /> Copy Code
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto whitespace-pre">
                <code>{codeContent}</code>
              </pre>
            </div>
          );
        }

        return renderFormattedLines(part, `${msgId}-${pIdx}`);
      });
    }

    return renderFormattedLines(text, msgId);
  };

  const renderFormattedLines = (text: string, keyPrefix: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const lineKey = `${keyPrefix}-${idx}`;
      if (line.startsWith('### ')) {
        return <h3 key={lineKey} className="font-bold text-indigo-300 text-base mt-3 mb-1.5">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('#### ')) {
        return <h4 key={lineKey} className="font-semibold text-purple-300 text-sm mt-2.5 mb-1">{line.replace('#### ', '')}</h4>;
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote key={lineKey} className="border-l-3 border-indigo-400 bg-indigo-950/50 px-4 py-2 rounded-r my-2 text-sm text-indigo-200 italic">
            {line.replace('> ', '').replace(/\*\*(.*?)\*\*/g, '$1')}
          </blockquote>
        );
      }
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return (
          <li key={lineKey} className="ml-4 list-disc text-sm text-slate-300 my-1">
            {line.substring(2)}
          </li>
        );
      }
      if (line.trim() === '') return <div key={lineKey} className="h-2" />;

      return (
        <p key={lineKey} className="text-sm text-slate-200 my-1 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  const filteredTopics = activeTab === 'all'
    ? PRESET_TOPICS
    : PRESET_TOPICS.filter((t) => t.category === activeTab);

  return (
    <div className="ai-page-container">
      {/* Top Navigation Header */}
      <header className="ai-page-header">
        <div className="ai-page-brand">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
          >
            {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <button
            onClick={returnToLanding}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-orbitron transition-all"
          >
            <ArrowLeft size={14} />
            <span>PORTFOLIO</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="ai-page-avatar">
              <Bot size={22} />
            </div>
            <div className="ai-page-title-group">
              <h1>
                CAREER & TECH AI MENTOR <Sparkles size={16} className="text-yellow-400" />
              </h1>
              <p>{apiKey ? '⚡ Live Gemini AI LLM Connected' : '🤖 Smart Contextual Knowledge Engine'}</p>
            </div>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={openResumeBuilder}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold font-orbitron transition-all"
          >
            <FileText size={14} />
            <span>RESUME BUILDER</span>
          </button>

          <button
            onClick={() => setShowApiInput(!showApiInput)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all"
            title="Set Gemini API Key"
          >
            <Key size={14} className="text-yellow-400" />
            <span className="hidden sm:inline">API Key</span>
          </button>

          <button
            onClick={handleClearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-red-400 text-xs font-medium transition-all"
            title="Clear Chat History"
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </header>

      {/* Optional Gemini API Key Drawer */}
      {showApiInput && (
        <div className="bg-slate-900 border-b border-slate-800 p-3 px-6 flex items-center justify-center gap-3">
          <input
            type="password"
            placeholder="Paste your Google Gemini API Key (VITE_GEMINI_API_KEY)..."
            value={tempApiKey}
            onChange={(e) => setTempApiKey(e.target.value)}
            className="max-w-md w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleSaveApiKey}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all"
          >
            Save Key
          </button>
        </div>
      )}

      {/* Main Body Grid */}
      <div className="ai-page-body">
        {/* Left Sidebar: Technologies & Categories */}
        <aside className={`ai-page-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
          {/* Technology Selector */}
          <div>
            <div className="ai-sidebar-section-title">
              💻 Ask Technology Stack Q&A
            </div>
            <div className="ai-tech-pills-grid">
              {TECH_PILLS.map((tech) => (
                <button
                  key={tech.name}
                  onClick={() => handleSelectTech(tech)}
                  className={`ai-tech-pill ${selectedTech === tech.name ? 'active' : ''}`}
                >
                  <span>{tech.icon}</span>
                  <span>{tech.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <div className="ai-sidebar-section-title">
              🎯 Career & Interview Modules
            </div>
            <button
              onClick={() => { setActiveTab('all'); setMobileSidebarOpen(false); }}
              className={`ai-sidebar-category-btn ${activeTab === 'all' ? 'active' : ''}`}
            >
              <span>💬</span> All Topics & Prompts
            </button>
            <button
              onClick={() => { setActiveTab('interview_prep'); setMobileSidebarOpen(false); }}
              className={`ai-sidebar-category-btn ${activeTab === 'interview_prep' ? 'active' : ''}`}
            >
              <span>🎙️</span> Interview Q&A & Code
            </button>
            <button
              onClick={() => { setActiveTab('job_purpose'); setMobileSidebarOpen(false); }}
              className={`ai-sidebar-category-btn ${activeTab === 'job_purpose' ? 'active' : ''}`}
            >
              <span>🎯</span> Job Purpose Context
            </button>
            <button
              onClick={() => { setActiveTab('cv_suggestion'); setMobileSidebarOpen(false); }}
              className={`ai-sidebar-category-btn ${activeTab === 'cv_suggestion' ? 'active' : ''}`}
            >
              <span>📄</span> CV & ATS Suggestions
            </button>
            <button
              onClick={() => { setActiveTab('mentoring'); setMobileSidebarOpen(false); }}
              className={`ai-sidebar-category-btn ${activeTab === 'mentoring' ? 'active' : ''}`}
            >
              <span>🚀</span> Profile Gap Analysis
            </button>
          </div>

          {/* Connected Resume Banner */}
          <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200 mt-auto space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-indigo-300">
              <Sparkles size={14} /> Active Resume Profile
            </div>
            <p className="text-[11px] text-slate-300">
              Linked to <strong>{sampleResumeData.personalInfo.fullName}</strong> ({sampleResumeData.personalInfo.jobTitle}).
            </p>
          </div>
        </aside>

        {/* Main Chat Arena */}
        <main className="ai-page-chat-arena">
          {/* Messages Stream */}
          <div className="ai-chat-messages-stream">
            {messages.map((msg) => (
              <div key={msg.id} className={`ai-page-message ${msg.sender}`}>
                <div className="ai-message-avatar">
                  {msg.sender === 'user' ? 'YOU' : <Bot size={18} />}
                </div>

                <div className="max-w-3xl">
                  <div className="ai-message-card">
                    {renderFormattedMarkdown(msg.text, msg.id)}

                    {msg.suggestedAction && (
                      <button
                        onClick={() => {
                          setAppliedMsgId(msg.id);
                          setTimeout(() => setAppliedMsgId(null), 3000);
                        }}
                        className="mt-3 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                      >
                        {appliedMsgId === msg.id ? (
                          <>
                            <CheckCircle2 size={14} /> {msg.suggestedAction.label} Applied!
                          </>
                        ) : (
                          <>
                            <Sparkles size={14} /> {msg.suggestedAction.label}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 px-1 text-right">
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="ai-page-message assistant">
                <div className="ai-message-avatar">
                  <Bot size={18} />
                </div>
                <div className="ai-message-card flex items-center gap-1.5 py-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                  <span className="text-xs text-indigo-300 font-medium">Generating solution & code...</span>
                </div>
              </div>
            )}

            {/* Preset Prompt Cards Grid */}
            {messages.length < 5 && !isTyping && (
              <div className="max-w-3xl mx-auto w-full my-4">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
                  Popular Practice Prompts:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {filteredTopics.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleSendMessage(preset.prompt)}
                      className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800 text-left transition-all group flex items-start gap-2.5"
                    >
                      <span className="text-lg">{preset.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">
                          {preset.title}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {preset.prompt}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <div className="ai-page-input-bar">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="ai-page-input-container"
            >
              <input
                type="text"
                placeholder="Ask any question about React, Node.js, Python, Java, Docker, AWS, System Design, or CV..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="ai-page-input-field"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="ai-page-submit-btn"
              >
                <span>Ask AI</span>
                <Send size={14} />
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};
