import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Key, Sparkles, CheckCircle2, Copy, Check, Code } from 'lucide-react';
import { AIChatbotService, PRESET_TOPICS, type ChatMessage } from '../../services/aiChatbotService';
import type { ResumeData } from '../../types/resume';
import './AICareerChatbot.css';

interface Props {
  activeResume?: ResumeData | null;
  onApplySummary?: (summary: string) => void;
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
}

export const AICareerChatbot: React.FC<Props> = ({
  activeResume,
  onApplySummary,
  isOpenExternal,
  onCloseExternal,
}) => {
  const [isOpenInternal, setIsOpenInternal] = useState(false);
  const isOpen = isOpenExternal !== undefined ? isOpenExternal : isOpenInternal;

  const toggleOpen = () => {
    if (onCloseExternal && isOpenExternal) {
      onCloseExternal();
    } else {
      setIsOpenInternal((prev) => !prev);
    }
  };

  const [activeTab, setActiveTab] = useState<'all' | 'cv_suggestion' | 'job_purpose' | 'mentoring' | 'interview_prep'>('all');
  const [showApiInput, setShowApiInput] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [appliedMsgId, setAppliedMsgId] = useState<string | null>(null);
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `### 👋 Hi! I'm CareerAI Mentor & Technical Interviewer

I am your personal **Career Coach, Technical Interviewer & CV Strategist**.

How can I assist you today?
- 💻 **Practice React, TypeScript & Node.js Coding Interview Questions**
- ⚙️ **Backend System Design Q&A & Architecture**
- 🎙️ **Start a Mock Technical Interview Simulator**
- 🎯 **Clarify Job Purpose & Career Vision**
- ⚡ **Enhance CV Bullets & ATS Score**

Choose a quick prompt below or type your question!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'general',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const handleSaveApiKey = () => {
    setApiKey(tempApiKey);
    localStorage.setItem('gemini_api_key', tempApiKey);
    setShowApiInput(false);
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
      const assistantMsg = await AIChatbotService.sendMessage(query, messages, activeResume, apiKey);
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleApplyAction = (msg: ChatMessage) => {
    if (msg.suggestedAction?.type === 'apply_summary' && onApplySummary) {
      onApplySummary(msg.suggestedAction.payload);
      setAppliedMsgId(msg.id);
      setTimeout(() => setAppliedMsgId(null), 3000);
    }
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
            <div key={codeId} className="my-2.5 rounded-lg border border-slate-700 bg-slate-950 overflow-hidden shadow-lg">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1 text-indigo-400 font-bold uppercase">
                  <Code size={12} /> {lang}
                </span>
                <button
                  onClick={() => handleCopyCode(codeContent, codeId)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
                >
                  {copiedCodeIdx === codeId ? (
                    <>
                      <Check size={10} className="text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={10} /> Copy Code
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 text-[11px] font-mono text-emerald-300 leading-relaxed overflow-x-auto whitespace-pre">
                <code>{codeContent}</code>
              </pre>
            </div>
          );
        }

        // Standard markdown line parsing
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
        return <h4 key={lineKey} className="font-bold text-indigo-300 text-sm mt-2 mb-1">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('#### ')) {
        return <h5 key={lineKey} className="font-semibold text-purple-300 text-xs mt-2 mb-1">{line.replace('#### ', '')}</h5>;
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote key={lineKey} className="border-l-2 border-indigo-400 bg-indigo-950/40 px-3 py-1.5 rounded-r my-1 text-xs text-indigo-200 italic">
            {line.replace('> ', '').replace(/\*\*(.*?)\*\*/g, '$1')}
          </blockquote>
        );
      }
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return (
          <li key={lineKey} className="ml-3 list-disc text-xs text-slate-300 my-0.5">
            {line.substring(2)}
          </li>
        );
      }
      if (line.trim() === '') return <div key={lineKey} className="h-1.5" />;

      return (
        <p key={lineKey} className="text-xs text-slate-200 my-1 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  const filteredTopics = activeTab === 'all' 
    ? PRESET_TOPICS 
    : PRESET_TOPICS.filter((t) => t.category === activeTab);

  return (
    <div className="ai-chatbot-container">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          id="open-ai-chatbot-btn"
          onClick={toggleOpen}
          className="ai-chatbot-trigger-btn"
          title="Open AI Career & Interview Chatbot"
        >
          <div className="ai-chatbot-badge-dot" />
          <Bot size={20} className="text-indigo-200" />
          <span>AI Career & Code Mentor</span>
          <Sparkles size={14} className="text-yellow-400 animate-spin-slow" />
        </button>
      )}

      {/* Chat Window Drawer */}
      {isOpen && (
        <div className="ai-chatbot-window" id="ai-chatbot-window-drawer">
          {/* Header */}
          <div className="ai-chatbot-header">
            <div className="ai-chatbot-header-info">
              <div className="ai-chatbot-avatar">
                <Bot size={22} />
              </div>
              <div>
                <h3 className="ai-chatbot-title">
                  CareerAI Assistant <Sparkles size={14} className="text-yellow-400" />
                </h3>
                <p className="ai-chatbot-subtitle">
                  {apiKey ? '⚡ Live Gemini LLM Active' : '🤖 Contextual Mentoring & Code Engine'}
                </p>
              </div>
            </div>

            <div className="ai-chatbot-header-actions">
              <button
                onClick={() => setShowApiInput(!showApiInput)}
                className="ai-chatbot-icon-btn"
                title="Configure Gemini API Key"
              >
                <Key size={16} />
              </button>
              <button onClick={toggleOpen} className="ai-chatbot-icon-btn" title="Close Chatbot">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Optional Gemini API Key Drawer */}
          {showApiInput && (
            <div className="ai-chatbot-api-bar">
              <input
                type="password"
                placeholder="Enter Gemini API Key (Optional)..."
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                className="ai-chatbot-api-input"
              />
              <button onClick={handleSaveApiKey} className="ai-chatbot-api-save-btn">
                Save
              </button>
            </div>
          )}

          {/* Topic Switcher Pills */}
          <div className="ai-chatbot-topics-bar">
            <button
              onClick={() => setActiveTab('all')}
              className={`ai-chatbot-topic-tab ${activeTab === 'all' ? 'active' : ''}`}
            >
              💬 All Topics
            </button>
            <button
              onClick={() => setActiveTab('interview_prep')}
              className={`ai-chatbot-topic-tab ${activeTab === 'interview_prep' ? 'active' : ''}`}
            >
              🎙️ Interview Prep & Code
            </button>
            <button
              onClick={() => setActiveTab('job_purpose')}
              className={`ai-chatbot-topic-tab ${activeTab === 'job_purpose' ? 'active' : ''}`}
            >
              🎯 Job Purpose
            </button>
            <button
              onClick={() => setActiveTab('cv_suggestion')}
              className={`ai-chatbot-topic-tab ${activeTab === 'cv_suggestion' ? 'active' : ''}`}
            >
              📄 CV Suggestions
            </button>
            <button
              onClick={() => setActiveTab('mentoring')}
              className={`ai-chatbot-topic-tab ${activeTab === 'mentoring' ? 'active' : ''}`}
            >
              🚀 Profile Mentoring
            </button>
          </div>

          {/* Chat Body */}
          <div className="ai-chatbot-body">
            {/* Active Resume Context Banner */}
            {activeResume && (
              <div className="ai-chatbot-context-banner">
                <Sparkles size={16} className="text-indigo-400 shrink-0" />
                <span>
                  Linked to CV: <strong>{activeResume.personalInfo.fullName || 'User'}</strong> (
                  {activeResume.personalInfo.jobTitle || 'Developer'})
                </span>
              </div>
            )}

            {/* Message List */}
            {messages.map((msg) => (
              <div key={msg.id} className={`ai-chatbot-message ${msg.sender}`}>
                <div className="ai-chatbot-message-avatar">
                  {msg.sender === 'user' ? 'You' : <Bot size={16} />}
                </div>

                <div>
                  <div className="ai-chatbot-message-bubble">
                    {renderFormattedMarkdown(msg.text, msg.id)}

                    {/* Suggested Action Button (Apply to Resume) */}
                    {msg.suggestedAction && onApplySummary && (
                      <button
                        onClick={() => handleApplyAction(msg)}
                        className="ai-chatbot-apply-btn"
                      >
                        {appliedMsgId === msg.id ? (
                          <>
                            <CheckCircle2 size={14} /> Summary Applied to Resume!
                          </>
                        ) : (
                          <>
                            <Sparkles size={14} /> {msg.suggestedAction.label}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  <div className="ai-chatbot-message-time">{msg.timestamp}</div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="ai-chatbot-message assistant">
                <div className="ai-chatbot-message-avatar">
                  <Bot size={16} />
                </div>
                <div className="ai-chatbot-message-bubble ai-chatbot-typing">
                  <div className="ai-chatbot-typing-dot" />
                  <div className="ai-chatbot-typing-dot" />
                  <div className="ai-chatbot-typing-dot" />
                </div>
              </div>
            )}

            {/* Preset Action Prompt Chips */}
            {messages.length < 5 && !isTyping && (
              <div className="mt-2">
                <p className="text-[10px] text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">
                  Suggested Prompts:
                </p>
                <div className="ai-chatbot-presets-grid">
                  {filteredTopics.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleSendMessage(preset.prompt)}
                      className="ai-chatbot-preset-card"
                    >
                      <span className="ai-chatbot-preset-icon">{preset.icon}</span>
                      <span className="ai-chatbot-preset-title">{preset.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <div className="ai-chatbot-footer">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="ai-chatbot-input-wrapper"
            >
              <input
                type="text"
                placeholder="Ask an interview question, request code, or start mock interview..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="ai-chatbot-input"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="ai-chatbot-send-btn"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
