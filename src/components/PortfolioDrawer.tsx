import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Download, Mail, Globe, Share2, Briefcase, Award, Code, User, ArrowRight } from 'lucide-react';
import { personal, skills, experience } from '../data/personalInfo';
import type { Project } from '../types';
import { useStore } from '../store/useStore';

interface PortfolioDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onSelectProject: (p: Project) => void;
}

export const PortfolioDrawer: React.FC<PortfolioDrawerProps> = ({
  isOpen,
  onClose,
  projects,
  onSelectProject,
}) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'about' | 'skills' | 'experience'>('projects');
  const returnToLanding = useStore((s) => s.returnToLanding);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.code === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-[400] pointer-events-auto"
          />

          {/* Slide-over Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-xl bg-gradient-to-b from-[#0a0f1a] via-[#0d1322] to-[#070a12] border-l border-slate-800 text-white z-[410] flex flex-col shadow-2xl pointer-events-auto overflow-hidden font-sans"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/60 backdrop-blur-md">
              <div>
                <h2 className="text-lg font-black tracking-wider text-white font-orbitron">
                  {personal.name.toUpperCase()}
                </h2>
                <p className="text-xs text-cyan-400 font-mono mt-0.5">
                  {personal.title} · Technical Portfolio
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-slate-900 border border-slate-700/60 text-slate-400 hover:text-white hover:border-cyan-400 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Links & Classic View Button */}
            <div className="px-5 py-3 bg-slate-900/40 border-b border-slate-800/60 flex items-center justify-between text-xs">
              <div className="flex gap-4">
                <a
                  href={personal.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-slate-400 hover:text-white transition"
                >
                  <Globe size={14} /> GitHub
                </a>
                <a
                  href={personal.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-slate-400 hover:text-white transition"
                >
                  <Share2 size={14} /> LinkedIn
                </a>
                <a
                  href={`mailto:${personal.email}`}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-white transition"
                >
                  <Mail size={14} /> Email
                </a>
              </div>
              <button
                onClick={() => {
                  onClose();
                  returnToLanding();
                }}
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-mono text-[11px] underline"
              >
                Classic 2D View <ArrowRight size={12} />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/40 text-[10px] sm:text-xs font-orbitron overflow-x-auto">
              {(
                [
                  { id: 'projects', label: 'Projects (8)', icon: Briefcase },
                  { id: 'about', label: 'About', icon: User },
                  { id: 'skills', label: 'Skills', icon: Code },
                  { id: 'experience', label: 'Experience', icon: Award },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-fit py-2.5 sm:py-3 px-2 sm:px-3 flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap transition border-b-2 ${
                      active
                        ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20 font-bold'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {activeTab === 'projects' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">
                    Select any project to inspect technical architecture or launch the live deployment:
                  </p>
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => {
                        onSelectProject(proj);
                        onClose();
                      }}
                      className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/60 hover:bg-slate-900/90 transition cursor-pointer group shadow-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: proj.color || '#38bdf8' }} />
                            <h3 className="font-bold text-white group-hover:text-cyan-400 transition font-orbitron text-sm">
                              {proj.name}
                            </h3>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{proj.tagline}</p>
                        </div>
                        {proj.liveDemo && (
                          <a
                            href={proj.liveDemo}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mt-2 line-clamp-2">{proj.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {proj.tech.slice(0, 4).map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded text-[10px] bg-slate-800/80 border border-slate-700/60 text-slate-300 font-mono"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'about' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <h3 className="text-sm font-bold text-cyan-400 font-orbitron mb-2">DEVELOPER PROFILE</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{personal.bio}</p>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
                      <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">TOTAL EXPERIENCE</span>
                        <span className="font-bold text-white text-sm">4+ Years</span>
                      </div>
                      <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">STATUS</span>
                        <span className="font-bold text-emerald-400 text-sm">Available For Hire</span>
                      </div>
                    </div>
                  </div>

                  {/* Resume Download CTA */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-black border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                    <div>
                      <h4 className="text-sm font-bold text-white font-orbitron">OFFICIAL RESUME</h4>
                      <p className="text-xs text-slate-400">Download formatted engineering CV</p>
                    </div>
                    <a
                      href={personal.resume}
                      download
                      className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-black text-xs flex items-center gap-1.5 transition font-orbitron"
                    >
                      <Download size={14} /> DOWNLOAD
                    </a>
                  </div>
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">Technical competencies & proficiency levels:</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {skills.slice(0, 16).map((sk) => (
                      <div
                        key={sk.name}
                        className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-200">{sk.name}</span>
                        </div>
                        <span className="text-[11px] font-mono text-cyan-400 font-bold">{sk.level}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'experience' && (
                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-white font-orbitron">{exp.role}</h4>
                          <p className="text-xs text-cyan-400 font-medium">{exp.company}</p>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 bg-black/50 px-2 py-0.5 rounded border border-slate-800">
                          {exp.period}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{exp.description}</p>
                      <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                        {exp.highlights.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {exp.tech.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded text-[10px] bg-slate-800 border border-slate-700/60 text-slate-300 font-mono"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
