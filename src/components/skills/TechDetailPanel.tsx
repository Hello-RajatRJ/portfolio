import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Briefcase,
  FolderGit2,
  Cpu,
  Layers,
  ExternalLink,
  Move3d,
  Sparkles,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import {
  findTechMeta,
  getRelatedProjects,
  type TechMetadata,
} from '../../data/techRegistry';
import { getEnrichedTechDetail } from '../../data/techDetailsEnrichment';
import { skills } from '../../data/personalInfo';
import { TechFallbackIcon } from './TechFallbackIcon';
import { TechConnectionGraph } from './TechConnectionGraph';
import type { PointerScreenState } from './hoverMath';

interface TechDetailModalProps {
  tech: TechMetadata | null;
  pointerRef: React.MutableRefObject<PointerScreenState>;
  webglEnabled: boolean;
  onSelectTech: (nextTech: TechMetadata) => void;
  onClose: () => void;
}

const sectionItem = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 + i * 0.055, duration: 0.42, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

export const TechDetailModal: React.FC<TechDetailModalProps> = ({
  tech,
  pointerRef,
  webglEnabled,
  onSelectTech,
  onClose,
}) => {
  const dragStartRef = useRef<{ x: number; y: number; rotX: number; rotY: number; moved: boolean } | null>(null);

  // Escape key dismissal
  useEffect(() => {
    if (!tech) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.code === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [tech, onClose]);

  // Prevent background page scrolling while modal is open
  useEffect(() => {
    if (!tech) return;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [tech]);

  // Reset interactive drag spin whenever switching tech or closing
  useEffect(() => {
    const p = pointerRef.current;
    p.dragRotX = 0;
    p.dragRotY = 0;
    p.isDragging = false;
  }, [tech, pointerRef]);

  const handleBackdropPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const p = pointerRef.current;
    p.isDragging = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rotX: p.dragRotX,
      rotY: p.dragRotY,
      moved: false,
    };
  };

  const handleBackdropPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    if (Math.hypot(dx, dy) > 5) {
      dragStartRef.current.moved = true;
    }
    const p = pointerRef.current;
    p.dragRotY = dragStartRef.current.rotY + dx * 0.011;
    p.dragRotX = Math.max(-1.1, Math.min(1.1, dragStartRef.current.rotX + dy * 0.011));
  };

  const handleBackdropPointerUp = () => {
    const moved = dragStartRef.current?.moved ?? false;
    pointerRef.current.isDragging = false;
    dragStartRef.current = null;
    if (!moved) {
      onClose();
    }
  };

  const matchedSkill = tech ? skills.find((s) => findTechMeta(s.name).id === tech.id) : null;
  const skillLevel = matchedSkill?.level;
  const relatedProjects = tech ? getRelatedProjects(tech) : [];
  const enriched = tech ? getEnrichedTechDetail(tech) : null;

  return (
    <AnimatePresence>
      {tech && enriched && (
        <>
          {/* Holographic Inspection Backdrop & Interactive 3D Orbit Drag Surface */}
          <motion.div
            key="tech-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onPointerDown={handleBackdropPointerDown}
            onPointerMove={handleBackdropPointerMove}
            onPointerUp={handleBackdropPointerUp}
            onPointerCancel={() => {
              pointerRef.current.isDragging = false;
              dragStartRef.current = null;
            }}
            className="fixed inset-0 z-[105] bg-black/82 backdrop-blur-md flex items-end md:items-center justify-center md:justify-end p-3 sm:p-6 lg:p-10 cursor-grab active:cursor-grabbing overscroll-contain"
          >
            {/* Subtle crimson radial studio spotlight behind zoomed 3D artifact */}
            <div
              className="pointer-events-none fixed left-1/2 -translate-x-1/2 top-[12%] md:top-1/2 md:-translate-y-1/2 md:left-[26%] w-[240px] h-[240px] sm:w-[360px] sm:h-[360px] rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(255,48,56,0.22) 0%, rgba(201,21,32,0.06) 45%, transparent 72%)',
                filter: 'blur(34px)',
              }}
            />

            {/* Graceful SVG fallback in spotlight if WebGL is unavailable */}
            {!webglEnabled && (
              <div className="pointer-events-none fixed left-1/2 -translate-x-1/2 top-[14%] md:top-1/2 md:-translate-y-1/2 md:left-[26%] w-32 h-32 sm:w-44 sm:h-44 flex items-center justify-center">
                <TechFallbackIcon tech={tech} />
              </div>
            )}

            {/* Interactive 3D artifact hint beneath spotlight */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.16 }}
              className="pointer-events-none fixed left-1/2 -translate-x-1/2 top-[38%] md:top-auto md:bottom-10 md:left-[26%] hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#080808]/90 border border-[#FF3038]/35 text-[11px] font-orbitron tracking-wider text-white"
            >
              <Move3d size={14} className="text-[#FF3038]" />
              <span>DRAG TO ROTATE 3D ARTIFACT</span>
            </motion.div>
          </motion.div>

          {/* Holographic Technology Detail Panel */}
          <motion.aside
            key={tech.id}
            role="dialog"
            aria-modal="true"
            aria-label={`${tech.name} technical overview`}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 36, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed z-[110] bottom-3 left-3 right-3 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:left-auto md:right-6 lg:right-12 md:w-[500px] lg:w-[550px] max-h-[58vh] md:max-h-[84vh] flex flex-col rounded-2xl bg-[#0B0B0B]/95 backdrop-blur-xl border border-[#FF3038]/40 shadow-[0_0_70px_rgba(255,48,56,0.18)] overflow-hidden overscroll-contain"
          >
            {/* Top red accent bar */}
            <div
              className="h-1 w-full shrink-0"
              style={{ background: 'linear-gradient(90deg, #C91520 0%, #FF3038 65%, #FF6B70 100%)' }}
            />

            {/* Header */}
            <div className="relative p-5 sm:p-6 border-b border-white/[0.12] flex items-start justify-between gap-4 shrink-0 bg-white/[0.02]">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#080808] border border-[#FF3038]/35 p-2 flex items-center justify-center shrink-0 shadow-[0_0_18px_rgba(255,48,56,0.18)]">
                  <TechFallbackIcon tech={tech} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-orbitron text-[10px] tracking-[0.22em] px-2 py-0.5 rounded-full bg-[#FF3038]/15 border border-[#FF3038]/40 text-[#FF3038] uppercase">
                      {tech.category}
                    </span>
                    {skillLevel !== undefined && (
                      <span className="font-inter text-[11px] text-[#A0A0A0]">
                        Self-Assessed: <strong className="font-orbitron text-white">{skillLevel}%</strong>
                      </span>
                    )}
                  </div>
                  <h3 className="font-orbitron text-xl sm:text-2xl font-black text-white tracking-wide">
                    {tech.name}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close technology details"
                className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.12] hover:border-[#FF3038] text-[#A0A0A0] hover:text-white transition-colors shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Body with Staggered Holographic Sections */}
            <div className="relative p-5 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar">
              {/* Self-assessed indicator meter */}
              {skillLevel !== undefined && (
                <motion.div
                  custom={0}
                  variants={sectionItem}
                  initial="hidden"
                  animate="visible"
                  className="p-3.5 rounded-xl bg-white/[0.025] border border-white/[0.12] space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px] font-orbitron tracking-wider">
                    <span className="flex items-center gap-1.5 text-[#A0A0A0]">
                      <Sparkles size={12} className="text-[#FF3038]" /> SELF-ASSESSED PROFICIENCY
                    </span>
                    <span className="text-[#FF3038] font-bold">{skillLevel}%</span>
                  </div>
                  <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden border border-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skillLevel}%` }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, #C91520 0%, #FF3038 80%)',
                      }}
                    />
                  </div>
                </motion.div>
              )}

              {/* What This Technology Does */}
              <motion.div
                custom={1}
                variants={sectionItem}
                initial="hidden"
                animate="visible"
                className="p-3.5 rounded-xl bg-white/[0.025] border border-white/[0.12]"
              >
                <div className="flex items-center gap-2 font-orbitron text-[11px] tracking-[0.18em] text-[#FF3038] mb-1.5 uppercase font-bold">
                  <Cpu size={14} /> What This Technology Does
                </div>
                <p className="font-inter text-sm text-white/90 leading-relaxed">
                  {tech.description}
                </p>
              </motion.div>

              {/* How I Use It & Practical Experience */}
              <motion.div
                custom={2}
                variants={sectionItem}
                initial="hidden"
                animate="visible"
                className="p-3.5 rounded-xl bg-white/[0.025] border border-white/[0.12] space-y-3"
              >
                <div>
                  <div className="flex items-center gap-2 font-orbitron text-[11px] tracking-[0.18em] text-[#FF3038] mb-1.5 uppercase font-bold">
                    <Briefcase size={14} /> How I Use It &amp; Practical Experience
                  </div>
                  <p className="font-inter text-sm text-white/90 leading-relaxed mb-2">
                    {enriched.howIUseIt}
                  </p>
                  <p className="font-inter text-xs text-[#A0A0A0] leading-relaxed">
                    {tech.practicalExperience}
                  </p>
                </div>

                {/* Practical Applications */}
                <div className="pt-2 border-t border-white/[0.08]">
                  <p className="font-orbitron text-[10px] tracking-[0.18em] text-[#A0A0A0] uppercase mb-2">
                    Practical Applications
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {enriched.practicalApplications.map((app) => (
                      <div key={app} className="flex items-center gap-2 text-xs font-inter text-white/85">
                        <CheckCircle2 size={13} className="text-[#FF3038] shrink-0" />
                        <span>{app}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Real Implementation Examples */}
              {enriched.implementationExamples.length > 0 && (
                <motion.div
                  custom={3}
                  variants={sectionItem}
                  initial="hidden"
                  animate="visible"
                  className="p-3.5 rounded-xl bg-white/[0.025] border border-white/[0.12]"
                >
                  <div className="flex items-center gap-2 font-orbitron text-[11px] tracking-[0.18em] text-[#FF3038] mb-2 uppercase font-bold">
                    <Terminal size={14} /> Real Implementation Examples
                  </div>
                  <ul className="space-y-1.5">
                    {enriched.implementationExamples.map((example) => (
                      <li
                        key={example}
                        className="flex items-start gap-2 font-inter text-xs text-white/85 leading-relaxed"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF3038] shrink-0" />
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Related Projects */}
              <motion.div custom={4} variants={sectionItem} initial="hidden" animate="visible">
                <div className="flex items-center gap-2 font-orbitron text-[11px] tracking-[0.18em] text-[#FF3038] mb-2.5 uppercase font-bold">
                  <FolderGit2 size={14} /> Related Projects ({relatedProjects.length})
                </div>
                {relatedProjects.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {relatedProjects.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-3 rounded-xl bg-white/[0.025] border border-white/[0.12] hover:border-[#FF3038]/60 transition-colors flex flex-col justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-orbitron text-xs font-bold text-white truncate">
                              {proj.name}
                            </span>
                            {proj.liveDemo && (
                              <a
                                href={proj.liveDemo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#FF3038] hover:text-white transition-colors shrink-0"
                                title={`Visit ${proj.name}`}
                              >
                                <ExternalLink size={13} />
                              </a>
                            )}
                          </div>
                          <p className="font-inter text-[11px] text-[#A0A0A0] mt-0.5 line-clamp-1">
                            {proj.tagline}
                          </p>
                        </div>
                        <span className="font-orbitron text-[10px] tracking-wider text-[#FF3038] uppercase">
                          {proj.category}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-inter text-xs text-[#A0A0A0]">
                    Applied across portfolio builds &amp; client full-stack systems.
                  </p>
                )}
              </motion.div>

              {/* Animated Technology Connection Graph */}
              <motion.div custom={5} variants={sectionItem} initial="hidden" animate="visible">
                <TechConnectionGraph
                  chain={enriched.connectionChain}
                  activeTechId={tech.id}
                  onSelectTech={onSelectTech}
                />
              </motion.div>

              {/* Related Technologies */}
              <motion.div custom={6} variants={sectionItem} initial="hidden" animate="visible">
                <div className="flex items-center gap-2 font-orbitron text-[11px] tracking-[0.18em] text-[#FF3038] mb-2.5 uppercase font-bold">
                  <Layers size={14} /> Related Technologies
                </div>
                <div className="flex flex-wrap gap-2">
                  {tech.relatedTechnologies.map((relName) => {
                    const targetMeta = findTechMeta(relName);
                    return (
                      <button
                        key={relName}
                        type="button"
                        onClick={() => onSelectTech(targetMeta)}
                        className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.025] border border-white/[0.12] hover:border-[#FF3038] hover:bg-[#FF3038]/10 text-xs font-inter text-white/85 hover:text-white transition-all"
                      >
                        <span className="w-4 h-4 shrink-0">
                          <TechFallbackIcon tech={targetMeta} />
                        </span>
                        <span>{relName}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Footer */}
            <div className="relative px-5 py-3 bg-[#080808]/90 border-t border-white/[0.12] flex items-center justify-between text-[11px] font-orbitron text-[#A0A0A0] shrink-0">
              <span>PRESS ESC OR CLICK OUTSIDE</span>
              <button
                type="button"
                onClick={onClose}
                className="text-[#FF3038] hover:text-white tracking-wider font-bold transition-colors"
              >
                RETURN TO ARSENAL
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export { TechDetailModal as TechDetailPanel };
