import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cpu,
  ExternalLink,
  Gamepad2,
  GitBranch,
  Layers,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import type { ProjectUniverseItem } from '../../data/projectUniverseData';
import { ProjectPreview3D } from '../ProjectPreview3D';

interface CinematicProjectModalProps {
  project: ProjectUniverseItem | null;
  projects: ProjectUniverseItem[];
  onClose: () => void;
  onSelectProject: (project: ProjectUniverseItem) => void;
  onLaunch3DWorld: () => void;
  reducedMotion: boolean;
}

const sectionStagger = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.06 * i,
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export const CinematicProjectModal: React.FC<CinematicProjectModalProps> = ({
  project,
  projects,
  onClose,
  onSelectProject,
  onLaunch3DWorld,
  reducedMotion,
}) => {
  const [simulating, setSimulating] = useState(false);

  const currentIdx = project ? projects.findIndex((p) => p.id === project.id) : -1;
  const totalCount = projects.length;

  const goAdjacent = (delta: number) => {
    if (currentIdx < 0 || totalCount === 0) return;
    const nextIdx = (currentIdx + delta + totalCount) % totalCount;
    setSimulating(false);
    onSelectProject(projects[nextIdx]);
  };

  // Lock page vertical scroll + keyboard Esc / Left / Right handling while modal is active
  useEffect(() => {
    if (!project) return;

    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && currentIdx >= 0) {
        const nextIdx = (currentIdx + 1) % totalCount;
        setSimulating(false);
        onSelectProject(projects[nextIdx]);
      } else if (e.key === 'ArrowLeft' && currentIdx >= 0) {
        const prevIdx = (currentIdx - 1 + totalCount) % totalCount;
        setSimulating(false);
        onSelectProject(projects[prevIdx]);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [project, currentIdx, totalCount, onClose, onSelectProject, projects]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="project-case-study-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.1 : 0.32 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050507]/90 p-3 sm:p-6 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label={`${project.name} case study modal`}
        >
          <motion.div
            key="project-case-study-shell"
            initial={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.9, y: 28, rotateX: 4 }
            }
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.94, y: 18 }
            }
            transition={{
              type: 'spring',
              stiffness: 290,
              damping: 26,
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-[#FF3038]/40 bg-[#080808] shadow-[0_32px_100px_-18px_rgba(255,48,56,0.32)]"
          >
            {/* Top Crimson Telemetry Header Bar */}
            <div className="flex items-center justify-between border-b border-white/10 bg-[#0c0c0f]/95 px-5 py-3.5 sm:px-7">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FF3038]/45 bg-[#FF3038]/12 px-2.5 py-0.5 font-orbitron text-[11px] font-bold tracking-wider text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF3038]" />
                  {project.indexLabel} / {String(totalCount).padStart(2, '0')}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#FF3038]">
                  {project.category}
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close case study modal"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.04] px-3 py-1.5 font-mono text-[11px] text-neutral-300 transition-all hover:border-[#FF3038] hover:bg-[#FF3038]/20 hover:text-white"
              >
                <span className="hidden sm:inline">ESC</span>
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Case Study Content with Mask Transition on Project Switch */}
            <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={project.id}
                  initial={reducedMotion ? { opacity: 0 } : { opacity: 0.2 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={!reducedMotion ? 'pu-modal-mask-in space-y-7' : 'space-y-7'}
                >
                  {/* Hero Intro Grid: Left Details + Right Interactive 3D Hologram Preview */}
                  <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
                    <div className="lg:col-span-7 space-y-3">
                      {project.flagshipLabel && (
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FF3038]/40 bg-[#FF3038]/15 px-3 py-1 font-mono text-[10px] tracking-wider text-red-200">
                          <Sparkles className="h-3 w-3 text-[#FF3038]" />
                          {project.flagshipLabel}
                        </div>
                      )}
                      <h2 className="font-orbitron text-2xl font-black text-white sm:text-3xl lg:text-4xl">
                        {project.name}
                      </h2>
                      <p className="font-orbitron text-xs tracking-wider text-[#FF3038] sm:text-sm">
                        {project.tagline}
                      </p>

                      {/* Quick Action Buttons */}
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        {project.liveDemo && (
                          <a
                            href={project.liveDemo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF3038] to-[#C91520] px-4 py-2.5 font-orbitron text-xs font-bold tracking-wider text-white shadow-lg shadow-red-600/25 transition-transform hover:scale-[1.02]"
                          >
                            LIVE DEPLOYMENT
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => setSimulating((s) => !s)}
                          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 font-orbitron text-xs font-bold tracking-wider transition-all ${
                            simulating
                              ? 'border-[#FF3038] bg-[#FF3038]/20 text-white shadow-[0_0_16px_rgba(255,48,56,0.3)]'
                              : 'border-white/15 bg-white/[0.03] text-neutral-300 hover:border-[#FF3038]/55 hover:text-white'
                          }`}
                        >
                          <Cpu className="h-3.5 w-3.5 text-[#FF3038]" />
                          {simulating ? 'OVERDRIVE ACTIVE' : 'SIMULATE CORE'}
                        </button>
                      </div>
                    </div>

                    <div className="lg:col-span-5">
                      <ProjectPreview3D
                        buildingStyle={project.buildingStyle}
                        simulating={simulating}
                      />
                    </div>
                  </div>

                  {/* 01 PROJECT OVERVIEW & 02 MY CONTRIBUTION */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <motion.section
                      custom={1}
                      initial="hidden"
                      animate="visible"
                      variants={sectionStagger}
                      className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
                    >
                      <p className="font-mono text-[11px] font-semibold tracking-[0.2em] text-[#FF3038]">
                        01 // PROJECT OVERVIEW
                      </p>
                      <p className="mt-2.5 text-sm leading-relaxed text-neutral-200">
                        {project.caseStudy.overview}
                      </p>
                    </motion.section>

                    <motion.section
                      custom={2}
                      initial="hidden"
                      animate="visible"
                      variants={sectionStagger}
                      className="rounded-2xl border border-red-500/20 bg-red-950/15 p-5"
                    >
                      <p className="font-mono text-[11px] font-semibold tracking-[0.2em] text-[#FF3038]">
                        02 // MY CONTRIBUTION
                      </p>
                      <div className="mt-2.5 flex items-center gap-2 text-xs font-bold text-white font-orbitron">
                        <ShieldCheck className="h-4 w-4 shrink-0 text-[#FF3038]" />
                        {project.caseStudy.contributionRole}
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                        {project.caseStudy.challengeSolved}
                      </p>
                    </motion.section>
                  </div>

                  {/* 03 TECHNOLOGY STACK & 04 KEY FEATURES */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <motion.section
                      custom={3}
                      initial="hidden"
                      animate="visible"
                      variants={sectionStagger}
                      className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
                    >
                      <p className="font-mono text-[11px] font-semibold tracking-[0.2em] text-[#FF3038]">
                        03 // TECHNOLOGY STACK
                      </p>
                      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {project.caseStudy.stack.map((item) => (
                          <div
                            key={item.name}
                            className="flex items-center justify-between rounded-lg border border-white/10 bg-black/45 px-3 py-2"
                          >
                            <span className="font-mono text-xs font-semibold text-white">
                              {item.name}
                            </span>
                            <span className="font-mono text-[9px] text-[#A0A0A0]">
                              {item.layer}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.section>

                    <motion.section
                      custom={4}
                      initial="hidden"
                      animate="visible"
                      variants={sectionStagger}
                      className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
                    >
                      <p className="font-mono text-[11px] font-semibold tracking-[0.2em] text-[#FF3038]">
                        04 // KEY FEATURES
                      </p>
                      <ul className="mt-3 space-y-2.5">
                        {project.caseStudy.features.map((feat) => (
                          <li
                            key={feat}
                            className="flex items-start gap-2.5 text-sm text-neutral-200"
                          >
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FF3038]" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.section>
                  </div>

                  {/* 05 SYSTEM ARCHITECTURE PIPELINE */}
                  <motion.section
                    custom={5}
                    initial="hidden"
                    animate="visible"
                    variants={sectionStagger}
                    className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-mono text-[11px] font-semibold tracking-[0.2em] text-[#FF3038]">
                        05 // ARCHITECTURE PIPELINE
                      </p>
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#A0A0A0]">
                        <Layers className="h-3 w-3 text-[#FF3038]" />4 LAYER FLOW
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {project.caseStudy.architecture.map((node, i) => (
                        <div
                          key={node.stage}
                          className="relative rounded-xl border border-red-500/20 bg-black/55 p-3.5"
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono text-[#FF3038]">
                            <span>STAGE {node.stage}</span>
                            {i < project.caseStudy.architecture.length - 1 && (
                              <ArrowRight className="hidden lg:inline h-3.5 w-3.5 text-red-500/70" />
                            )}
                          </div>
                          <h4 className="mt-1 font-orbitron text-xs font-bold text-white">
                            {node.label}
                          </h4>
                          <p className="mt-1 inline-block rounded border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-red-200">
                            {node.techFocus}
                          </p>
                          <p className="mt-2 text-xs leading-relaxed text-[#A0A0A0]">
                            {node.summary}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.section>

                  {/* 06 PROJECT LINKS & 3D WORLD ACTION */}
                  <motion.section
                    custom={6}
                    initial="hidden"
                    animate="visible"
                    variants={sectionStagger}
                    className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
                  >
                    <p className="font-mono text-[11px] font-semibold tracking-[0.2em] text-[#FF3038]">
                      06 // PROJECT LINKS & SIMULATION
                    </p>
                    <div className="mt-3.5 flex flex-wrap items-center gap-3">
                      {project.liveDemo && (
                        <a
                          href={project.liveDemo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-[#FF3038]/50 bg-[#FF3038]/15 px-4 py-2.5 font-orbitron text-xs font-bold text-white transition-all hover:bg-[#FF3038]/30"
                        >
                          <ExternalLink className="h-3.5 w-3.5 text-[#FF3038]" />
                          OPEN LIVE PLATFORM
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 font-orbitron text-xs font-bold text-neutral-200 transition-all hover:border-[#FF3038]/50 hover:text-white"
                        >
                          <GitBranch className="h-3.5 w-3.5 text-[#FF3038]" />
                          SOURCE REPOSITORY
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onLaunch3DWorld();
                        }}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/65 px-4 py-2.5 font-orbitron text-xs font-bold text-white transition-all hover:border-[#FF3038] hover:text-[#FF3038]"
                      >
                        <Gamepad2 className="h-3.5 w-3.5 text-[#FF3038]" />
                        DRIVE TO BUILDING IN 3D WORLD
                      </button>
                    </div>
                  </motion.section>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Prev / Next Switching HUD Bar (Effect Six) */}
            <div className="relative flex items-center justify-between border-t border-white/10 bg-[#0b0b0e]/95 px-5 py-3.5 sm:px-7">
              <button
                type="button"
                onClick={() => goAdjacent(-1)}
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] px-3.5 py-2 font-orbitron text-[11px] font-bold tracking-wider text-neutral-200 transition-all hover:border-[#FF3038] hover:bg-[#FF3038]/15 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4 text-[#FF3038]" />
                PREV PROJECT
              </button>

              <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-[#A0A0A0]">
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#FF3038]" />
                USE ARROW KEYS OR CLICK TO SWITCH
                <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#FF3038]" />
              </div>

              <button
                type="button"
                onClick={() => goAdjacent(1)}
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] px-3.5 py-2 font-orbitron text-[11px] font-bold tracking-wider text-neutral-200 transition-all hover:border-[#FF3038] hover:bg-[#FF3038]/15 hover:text-white"
              >
                NEXT PROJECT
                <ChevronRight className="h-4 w-4 text-[#FF3038]" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
