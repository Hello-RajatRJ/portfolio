import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Plus, ArrowLeft, Key, Code, Copy, Check, Send, Trash2, FileText, BookmarkPlus, BookOpen, Download, X, Edit3, Bot } from 'lucide-react';
import { useStore } from '../store/useStore';
import { GeminiAIService, AI_MODELS, AI_PERSONAS, type GeminiMessage, type ChatThread } from '../services/geminiAIService';
import { sampleResumeData } from '../data/sampleResume';
import './GeminiAIStudioPage.css';

export interface NotePage {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

const DEFAULT_NOTE_PAGES: NotePage[] = [
  {
    id: 'note-1',
    title: 'React 19 & Frontend Notes',
    content: `# ⚛️ React 19 & Frontend Technical Notes\n\n- **Virtual DOM Reconciliation**: Heuristic O(n) diffing using element keys.\n- **Custom Hooks Pattern**: Encapsulating reactive logic (e.g. \`useDebounce\`).\n- **Server Components**: Zero-bundle-size server rendering.`,
    updatedAt: new Date().toLocaleDateString(),
  },
  {
    id: 'note-2',
    title: 'Python & Async Research',
    content: `# 🐍 Python & System Performance Notes\n\n- **AsyncIO Event Loop**: Cooperative multitasking using \`async\` / \`await\` and \`asyncio.gather()\`.\n- **GIL (Global Interpreter Lock)**: CPython thread safety mutex.\n- **Decorators**: Higher-order wrapper functions using \`functools.wraps\`.`,
    updatedAt: new Date().toLocaleDateString(),
  },
];

const INTERVIEW_PROMPT_PRESETS = [
  {
    icon: '⚛️',
    title: 'What is React? (5-Step Blueprint)',
    prompt: 'What is React? Explain using the 5-step blueprint: 1. Definition, 2. Business Use Cases, 3. Production Code Example, 4. Cloud (AWS/Azure) & RAG Integration, 5. Interview Cracking Strategy.',
    category: 'interview',
  },
  {
    icon: '🤖',
    title: 'What is RAG (Retrieval-Augmented Gen)?',
    prompt: 'What is RAG (Retrieval-Augmented Generation)? Explain using the 5-step blueprint: 1. Definition, 2. Vector DB Use Cases, 3. Python LangChain Code, 4. AWS Bedrock / Azure OpenAI Cloud Deployment, 5. Vector Search Interview Strategy.',
    category: 'interview',
  },
  {
    icon: '☁️',
    title: 'AWS vs Azure Cloud Architecture',
    prompt: 'Explain AWS vs Azure Cloud Infrastructure using the 5-step blueprint: 1. Definition, 2. Cloud Use Cases, 3. Python Boto3 Code, 4. RAG & Serverless Architecture, 5. Cloud System Design Interview Trade-offs.',
    category: 'system_design',
  },
  {
    icon: '🐍',
    title: 'What is Python? (AsyncIO & GIL)',
    prompt: 'What is Python? Explain using the 5-step blueprint: 1. Definition, 2. AI & Backend Use Cases, 3. AsyncIO & Decorator Code, 4. AWS Lambda & Azure Functions, 5. GIL & Multiprocessing Interview Takeaways.',
    category: 'interview',
  },
  {
    icon: '⚙️',
    title: 'Node.js & System Rate Limiting',
    prompt: 'Design an API Rate Limiter in Node.js using the 5-step blueprint: 1. Definition, 2. Microservices Use Cases, 3. Express & Redis Code, 4. AWS ECS & Azure App Service Deployment, 5. Rate Limiting Interview Trade-offs.',
    category: 'system_design',
  },
  {
    icon: '🎙️',
    title: 'Mock Technical Interview Simulator',
    prompt: 'Act as a Senior Technical Interviewer conducting a mock interview for my role. Ask me 1 challenging engineering question at a time and evaluate my answers using the 5-step analysis framework!',
    category: 'interview',
  },
];

export const GeminiAIStudioPage: React.FC = () => {
  const returnToLanding = useStore((s) => s.returnToLanding);
  const openResumeBuilder = useStore((s) => s.openResumeBuilder);

  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
  const [selectedPersona, setSelectedPersona] = useState('interview_coach');
  const [showApiDrawer, setShowApiDrawer] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // NOTEPAD WORKSPACE STATE
  const [isNotepadOpen, setIsNotepadOpen] = useState(false);
  const [notePages, setNotePages] = useState<NotePage[]>(() => {
    const saved = localStorage.getItem('gemini_developer_notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_NOTE_PAGES;
  });
  const [activeNoteId, setActiveNoteId] = useState<string>(() => notePages[0]?.id || 'note-1');
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const activeNote = notePages.find((n) => n.id === activeNoteId) || notePages[0];
  const hasApiKey = Boolean(GeminiAIService.getEffectiveApiKey(apiKey));

  // Sync Note Pages to localStorage
  useEffect(() => {
    localStorage.setItem('gemini_developer_notes', JSON.stringify(notePages));
  }, [notePages]);

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 2500);
  };

  const user = useStore((s) => s.user);

  // Conversation Threads State
  const [threads, setThreads] = useState<ChatThread[]>([
    {
      id: 'thread-1',
      title: 'Interview Practice & Coding',
      createdAt: new Date().toLocaleDateString(),
      model: 'gemini-1.5-flash',
      persona: 'interview_coach',
      messages: [
        {
          id: 'welcome-studio-1',
          role: 'model',
          text: `### 🤖 Welcome back, ${user?.name || 'Candidate'}! (${user?.jobTitle || 'Software Engineer'})

I am your **Live Gemini AI Technical Coach**. I have loaded your profile and am ready to guide you to crack technical interviews, solve coding challenges, and write production-grade code.

#### 📝 Built-in Developer Notepad:
- Click 📝 **NOTEPAD** in the top header to open your multi-page Notebook.
- Click 📌 **Add to Notepad** on any message or code block to save key research points directly into your notebook!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    },
  ]);

  const [activeThreadId, setActiveThreadId] = useState('thread-1');
  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages, isGenerating]);

  // Notepad Actions
  const handleCreateNotePage = () => {
    const newPage: NotePage = {
      id: `note-${Date.now()}`,
      title: `Page #${notePages.length + 1} - Developer Research`,
      content: `# 📝 New Research Page\n\nAdd your code snippets, interview points, and notes here!`,
      updatedAt: new Date().toLocaleDateString(),
    };
    setNotePages((prev) => [...prev, newPage]);
    setActiveNoteId(newPage.id);
    setIsNotepadOpen(true);
    showToast(`Created new note page!`);
  };

  const handleUpdateNoteContent = (content: string) => {
    setNotePages((prev) =>
      prev.map((n) => (n.id === activeNoteId ? { ...n, content, updatedAt: new Date().toLocaleDateString() } : n))
    );
  };

  const handleUpdateNoteTitle = (title: string) => {
    setNotePages((prev) =>
      prev.map((n) => (n.id === activeNoteId ? { ...n, title, updatedAt: new Date().toLocaleDateString() } : n))
    );
  };

  const handleDeleteNotePage = (pageId: string) => {
    if (notePages.length <= 1) {
      showToast(`Cannot delete the last remaining note page!`);
      return;
    }
    setNotePages((prev) => prev.filter((n) => n.id !== pageId));
    setActiveNoteId(notePages.find((n) => n.id !== pageId)?.id || '');
    showToast(`Note page deleted`);
  };

  const handleAppendToNotepad = (textSnippet: string, label: string = 'Snippet') => {
    if (!activeNote) return;

    const formattedAppend = `\n\n---\n### 📌 Appended ${label} (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}):\n${textSnippet}`;
    const updatedContent = activeNote.content + formattedAppend;

    handleUpdateNoteContent(updatedContent);
    setIsNotepadOpen(true);
    showToast(`Appended to "${activeNote.title.substring(0, 18)}..."`);
  };

  const handleDownloadNote = () => {
    if (!activeNote) return;
    const blob = new Blob([activeNote.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeNote.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${activeNote.title}`);
  };

  const handleCreateNewChat = () => {
    const newThread: ChatThread = {
      id: `thread-${Date.now()}`,
      title: 'New Session',
      createdAt: new Date().toLocaleDateString(),
      model: selectedModel,
      persona: selectedPersona,
      messages: [
        {
          id: `msg-${Date.now()}`,
          role: 'model',
          text: `### ✨ New Gemini AI Session Initialized\n\nAsk me any technical question or start a mock interview! Use 📌 **Add to Notepad** to save notes.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };

    setThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(newThread.id);
  };

  const handleSaveApiKey = () => {
    setApiKey(tempApiKey);
    localStorage.setItem('gemini_api_key', tempApiKey);
    setShowApiDrawer(false);
  };

  const handleSendPrompt = async (customPrompt?: string) => {
    const promptToSend = customPrompt || inputPrompt;
    if (!promptToSend.trim() || isGenerating) return;

    const userMsg: GeminiMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: promptToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const currentMessages = activeThread.messages;
    const isFirstPrompt = currentMessages.length <= 1;
    const updatedTitle = isFirstPrompt
      ? promptToSend.length > 28 ? promptToSend.substring(0, 28) + '...' : promptToSend
      : activeThread.title;

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThreadId
          ? { ...t, title: updatedTitle, messages: [...t.messages, userMsg] }
          : t
      )
    );

    if (!customPrompt) setInputPrompt('');
    setIsGenerating(true);

    try {
      const modelResponse = await GeminiAIService.generateAIResponse(
        [...currentMessages, userMsg],
        promptToSend,
        selectedModel,
        selectedPersona,
        sampleResumeData,
        apiKey
      );

      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeThreadId
            ? { ...t, messages: [...t.messages, modelResponse] }
            : t
        )
      );
    } catch (err) {
      console.error('Gemini AI Studio Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = (codeContent: string, codeId: string) => {
    navigator.clipboard.writeText(codeContent);
    setCopiedCodeId(codeId);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const renderFormattedMarkdown = (text: string, msgId: string) => {
    if (text.includes('```')) {
      const parts = text.split(/(```[\s\S]*?```)/g);
      return parts.map((part, pIdx) => {
        if (part.startsWith('```')) {
          const firstLineEnd = part.indexOf('\n');
          const lang = part.substring(3, firstLineEnd).trim() || 'code';
          const codeContent = part.substring(firstLineEnd + 1, part.length - 3).trim();
          const codeId = `${msgId}-code-${pIdx}`;

          return (
            <div key={codeId} className="gemini-code-container">
              <div className="gemini-code-header">
                <span className="flex items-center gap-1.5 font-bold uppercase text-indigo-400">
                  <Code size={13} /> {lang}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAppendToNotepad(`\`\`\`${lang}\n${codeContent}\n\`\`\``, `${lang} Code`)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-950/80 border border-indigo-500/30 hover:bg-indigo-900 text-indigo-300 transition-all cursor-pointer text-xs font-sans"
                    title="Append code to your Notepad page"
                  >
                    <BookmarkPlus size={12} /> Add to Notepad
                  </button>

                  <button
                    onClick={() => handleCopyCode(codeContent, codeId)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer text-xs font-sans"
                  >
                    {copiedCodeId === codeId ? (
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
              </div>
              <pre className="gemini-code-pre">
                <code>{codeContent}</code>
              </pre>
            </div>
          );
        }

        return renderLines(part, `${msgId}-${pIdx}`);
      });
    }

    return renderLines(text, msgId);
  };

  const renderLines = (text: string, keyPrefix: string) => {
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

  return (
    <div className="gemini-studio-container">
      {/* Toast Notification Banner */}
      {toastNotice && (
        <div className="fixed top-16 right-6 z-50 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 border border-indigo-400 animate-bounce">
          <BookmarkPlus size={16} />
          <span>{toastNotice}</span>
        </div>
      )}

      {/* Left Sidebar */}
      <aside className="gemini-sidebar">
        <div className="gemini-sidebar-header">
          <button onClick={handleCreateNewChat} className="gemini-new-chat-btn">
            <Plus size={16} />
            <span>New Session</span>
          </button>
        </div>

        {/* Conversation History List */}
        <div className="gemini-sidebar-threads">
          <div className="gemini-section-title">Interview Conversations</div>
          {threads.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveThreadId(t.id)}
              className={`gemini-thread-item ${activeThreadId === t.id ? 'active' : ''}`}
            >
              <span className="gemini-thread-title">{t.title}</span>
              {threads.length > 1 && (
                <Trash2
                  size={12}
                  className="hover:text-red-400 opacity-60 hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    setThreads((prev) => prev.filter((item) => item.id !== t.id));
                    if (activeThreadId === t.id) {
                      setActiveThreadId(threads[0]?.id || '');
                    }
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Workspace Arena */}
      <main className="gemini-main-arena">
        {/* Header Navbar */}
        {/* Primary Header Navbar */}
        <header className="gemini-arena-header">
          <div className="gemini-header-title-group">
            <button
              onClick={returnToLanding}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-orbitron transition-all"
            >
              <ArrowLeft size={14} />
              <span>PORTFOLIO</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30">
                <Sparkles size={16} className="text-yellow-400" />
              </div>
              <span className="font-orbitron font-bold text-xs sm:text-sm tracking-wider bg-gradient-to-r from-white via-indigo-200 to-violet-400 bg-clip-text text-transparent">
                GEMINI AI STUDIO
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LIVE LLM
              </span>
            </div>
          </div>

          <div className="gemini-header-actions">
            {/* NOTEPAD TOGGLE BUTTON */}
            <button
              onClick={() => setIsNotepadOpen(!isNotepadOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold font-orbitron transition-all ${
                isNotepadOpen
                  ? 'border-indigo-500 bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300'
              }`}
            >
              <BookOpen size={14} />
              <span>NOTEPAD ({notePages.length})</span>
            </button>

            <button
              onClick={openResumeBuilder}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold font-orbitron transition-all"
            >
              <FileText size={14} />
              <span>RESUME BUILDER</span>
            </button>
          </div>
        </header>

        {/* DEDICATED SECONDARY SUB-NAVBAR TOOLBAR */}
        <div className="gemini-subnav-toolbar">
          <div className="flex items-center gap-3 flex-wrap">
            {/* AI Model Engine Selector */}
            <div className="gemini-model-select-wrapper">
              <Sparkles size={14} className="text-yellow-400 shrink-0" />
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                {AI_MODELS.map((m) => (
                  <option key={m.id} value={m.id} className="bg-slate-900 text-white font-sans py-1">
                    ⚡ {m.name} ({m.badge})
                  </option>
                ))}
              </select>
            </div>

            {/* Coach Persona Selector */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Bot size={13} className="text-indigo-400" />
              <select
                value={selectedPersona}
                onChange={(e) => setSelectedPersona(e.target.value)}
                className="bg-transparent text-xs font-semibold text-indigo-200 outline-none cursor-pointer"
              >
                {AI_PERSONAS.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white font-sans py-1">
                    Persona: {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setShowApiDrawer(!showApiDrawer)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-medium transition-all ${
                hasApiKey
                  ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                  : 'border-amber-500/40 bg-amber-950/40 text-amber-300'
              }`}
            >
              <Key size={13} className="text-yellow-400" />
              <span>{hasApiKey ? 'Key Connected' : 'Set Gemini Key'}</span>
            </button>

            <button
              onClick={handleCreateNewChat}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
              title="Clear current session and start fresh chat"
            >
              <Trash2 size={13} />
              <span>Clear Session</span>
            </button>
          </div>
        </div>

        {/* Optional Key Configuration Bar */}
        {showApiDrawer && (
          <div className="bg-slate-900 border-b border-slate-800 p-3 px-6 flex items-center justify-center gap-3">
            <input
              type="password"
              placeholder="Paste Google Gemini API Key (VITE_GEMINI_API_KEY)..."
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

        {/* Message Stream */}
        <div className="gemini-chat-scroll-arena">
          <div className="gemini-chat-content-max">
            {activeThread?.messages.map((msg) => (
              <div key={msg.id} className={`gemini-message-row ${msg.role}`}>
                <div className={`gemini-avatar ${msg.role}`}>
                  {msg.role === 'user' ? 'YOU' : <Sparkles size={18} />}
                </div>

                <div className="gemini-message-content">
                  <div>
                    {renderFormattedMarkdown(msg.text, msg.id)}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60">
                    {msg.role === 'model' ? (
                      <button
                        onClick={() => handleAppendToNotepad(msg.text, 'Answer')}
                        className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium cursor-pointer"
                      >
                        <BookmarkPlus size={14} /> Add to Notepad
                      </button>
                    ) : <span />}
                    <div className="text-[10px] text-slate-500 font-mono">
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Generating Indicator */}
            {isGenerating && (
              <div className="gemini-message-row model">
                <div className="gemini-avatar model">
                  <Sparkles size={18} />
                </div>
                <div className="gemini-message-content flex items-center gap-3 py-3">
                  <div className="w-3 h-3 rounded-full bg-indigo-400 animate-ping" />
                  <span className="text-xs text-indigo-300 font-semibold font-mono">Gemini AI is crafting your solution...</span>
                </div>
              </div>
            )}

            {/* Practice Prompt Presets */}
            {activeThread?.messages.length <= 2 && !isGenerating && (
              <div className="my-4">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2.5">
                  Technical Practice Prompts:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {INTERVIEW_PROMPT_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendPrompt(preset.prompt)}
                      className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/90 text-left transition-all group flex items-start gap-3 shadow-sm cursor-pointer"
                    >
                      <span className="text-xl">{preset.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">
                          {preset.title}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
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
        </div>

        {/* Full-Width Outer Sticky Input Footer Bar */}
        <div className="gemini-input-bar-area">
          <div className="gemini-input-inner-wrapper">
            {/* Prompt Suggestion Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-500 font-mono text-[10px] uppercase font-bold tracking-wider shrink-0">SUGGESTIONS:</span>
              {[
                'Explain React 19 Server Components vs Client Components',
                'Write Python Async Queue Worker snippet',
                'AWS S3 vs Azure Blob Storage Cloud Architecture',
                'System Design: Scalable Rate Limiter',
              ].map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => setInputPrompt(sug)}
                  className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white text-[11px] font-mono whitespace-nowrap transition-all cursor-pointer shrink-0"
                >
                  💡 {sug}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendPrompt();
              }}
              className="gemini-input-wrapper"
            >
              <textarea
                rows={1}
                placeholder="Ask Gemini AI anything (Python, React, TypeScript, System Design, Mock Interview)..."
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendPrompt();
                  }
                }}
                className="gemini-prompt-input"
              />
              <button
                type="submit"
                disabled={!inputPrompt.trim() || isGenerating}
                className="gemini-send-btn"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* DEVELOPER NOTEPAD SIDE DRAWER */}
      {isNotepadOpen && (
        <aside className="gemini-notepad-drawer">
          <div className="gemini-notepad-header">
            <div className="gemini-notepad-title">
              <BookOpen size={16} />
              <span>Developer Notepad</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCreateNotePage}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer"
              >
                <Plus size={14} /> New Page
              </button>
              <button
                onClick={() => setIsNotepadOpen(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Notebook Page Tabs Bar */}
          <div className="gemini-notepad-pages-bar">
            {notePages.map((page) => (
              <button
                key={page.id}
                onClick={() => setActiveNoteId(page.id)}
                className={`gemini-note-tab ${activeNoteId === page.id ? 'active' : ''}`}
              >
                <Edit3 size={11} />
                <span className="truncate max-w-[120px]">{page.title}</span>
              </button>
            ))}
          </div>

          {/* Active Note Page Body */}
          {activeNote && (
            <div className="gemini-note-body">
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => handleUpdateNoteTitle(e.target.value)}
                placeholder="Note Page Title..."
                className="gemini-note-title-input"
              />

              {/* RICH TEXT FORMATTING TOOLBAR */}
              <div className="flex items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-lg flex-wrap text-xs text-slate-300">
                <button
                  onClick={() => handleUpdateNoteContent(activeNote.content + '\n**Bold Text**')}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 font-bold"
                  title="Add Bold Text"
                >
                  B
                </button>
                <button
                  onClick={() => handleUpdateNoteContent(activeNote.content + '\n*Italic Text*')}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 italic"
                  title="Add Italic Text"
                >
                  I
                </button>
                <button
                  onClick={() => handleUpdateNoteContent(activeNote.content + '\n# Heading 1\n')}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 font-bold"
                  title="Add Heading 1"
                >
                  H1
                </button>
                <button
                  onClick={() => handleUpdateNoteContent(activeNote.content + '\n## Heading 2\n')}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 font-semibold text-[11px]"
                  title="Add Heading 2"
                >
                  H2
                </button>
                <button
                  onClick={() => handleUpdateNoteContent(activeNote.content + '\n```typescript\n// Write code snippet here\nconst result = true;\n```\n')}
                  className="px-2 py-1 rounded bg-indigo-950 border border-indigo-500/30 text-indigo-300 font-mono text-[11px]"
                  title="Insert Code Block"
                >
                  {`</>`} Code
                </button>
                <button
                  onClick={() => handleUpdateNoteContent(activeNote.content + '\n- Bullet point 1\n- Bullet point 2\n')}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700"
                  title="Insert Bullet List"
                >
                  • List
                </button>
                <button
                  onClick={() => handleUpdateNoteContent(activeNote.content + '\n1. First item\n2. Second item\n')}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700"
                  title="Insert Numbered List"
                >
                  1. List
                </button>
                <button
                  onClick={() => handleUpdateNoteContent(activeNote.content + '\n> "Engineering quote or note"\n')}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 italic text-[11px]"
                  title="Insert Blockquote"
                >
                  " Quote
                </button>
                <button
                  onClick={() => handleUpdateNoteContent(activeNote.content + '\n| Feature | Status |\n| --- | --- |\n| API Setup | ✅ Done |\n')}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px]"
                  title="Insert Table"
                >
                  ⊞ Table
                </button>
              </div>

              <textarea
                value={activeNote.content}
                onChange={(e) => handleUpdateNoteContent(e.target.value)}
                placeholder="Write or append code snippets and research notes here..."
                className="gemini-note-editor"
              />

              {/* STATS & AUTO-SAVE FOOTER */}
              <div className="gemini-notepad-footer-stats">
                <span className="text-emerald-400 font-bold">● Auto-Saved</span>
                <span>{activeNote.content.length} chars | {activeNote.content.trim().split(/\s+/).filter(Boolean).length} words</span>
              </div>
            </div>
          )}

          {/* Notepad Footer Actions */}
          {activeNote && (
            <div className="gemini-note-actions">
              <button
                onClick={() => handleDeleteNotePage(activeNote.id)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/60 text-xs font-medium transition-all"
              >
                <Trash2 size={13} /> Delete Page
              </button>

              <button
                onClick={handleDownloadNote}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md"
              >
                <Download size={13} /> Export (.md)
              </button>
            </div>
          )}
        </aside>
      )}
    </div>
  );
};
