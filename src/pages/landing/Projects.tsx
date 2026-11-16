import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Eye, Layers } from 'lucide-react';
import {
  projectUniverseItems,
  type ProjectUniverseItem,
} from '../../data/projectUniverseData';
import { CinematicProjectModal } from '../../components/projects/CinematicProjectModal';

const SHOWCASE_IDS = [
  'ceretax',
  'ebmci-taiwan',
  'sarina-clinic',
  'teachercool',
  'wesell-restaurants',
  'iallo',
];

const CURATED_PROJECTS: ProjectUniverseItem[] = SHOWCASE_IDS.map((id) =>
  projectUniverseItems.find((p) => p.id === id)
).filter((p): p is ProjectUniverseItem => Boolean(p));

export const Projects: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectUniverseItem | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Desktop horizontal scroll progress across 320vh
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const trackX = useTransform(scrollYProgress, [0, 1], ['2%', '-65%']);
  const totalCount = CURATED_PROJECTS.length;

  return (
    <div id="projects" ref={containerRef} className="relative w-full bg-[#050505] border-t border-white/[0.04]">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[400px] rounded-full bg-[#E62429]/05 blur-[120px] pointer-events-none" />

      {/* DESKTOP PINNED HORIZONTAL GALLERY (md and up) */}
      {!isMobile ? (
        <div className="relative h-[340vh]">
          <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-8 sm:py-10 z-10">
            {/* Header Bar */}
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 shrink-0">
              <div className="flex items-end justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="inline-flex items-center gap-2 mb-1.5">
                    <span className="h-[1px] w-6 bg-[#E62429]" />
                    <span className="font-mono text-xs font-semibold tracking-[0.25em] text-[#E62429] uppercase">
                      04 // SELECTED PRODUCTION SYSTEMS
                    </span>
                  </div>
                  <h2 className="font-orbitron text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase">
                    FEATURED <span className="text-[#E62429]">PROJECTS</span>
                  </h2>
                </div>

                {/* Counter & Scroll Track */}
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs tracking-wider text-neutral-400">
                    SCROLL DOWN TO INSPECT (01 / 0{totalCount})
                  </span>
                  <div className="h-1.5 w-28 rounded-full bg-neutral-900 border border-white/10 overflow-hidden">
                    <motion.div
                      style={{ scaleX: scrollYProgress }}
                      className="h-full bg-gradient-to-r from-[#8B0000] via-[#E62429] to-[#FF2D2D] origin-left"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pinned Horizontal Track */}
            <div className="relative w-full my-auto overflow-visible">
              <motion.div
                style={{ x: trackX }}
                className="flex items-center gap-6 pl-8 pr-28 select-none"
              >
                {CURATED_PROJECTS.map((project, idx) => {
                  const isHovered = hoveredCardId === project.id;
                  const isLead = idx === 0;

                  return (
                    <div
                      key={project.id}
                      data-project-card="true"
                      onMouseEnter={() => setHoveredCardId(project.id)}
                      onMouseLeave={() => setHoveredCardId(null)}
                      onClick={() => setSelectedProject(project)}
                      className={`group relative shrink-0 w-[490px] lg:w-[530px] rounded-xl bg-[#0D0D0D] border transition-all duration-300 cursor-pointer overflow-hidden shadow-2xl ${
                        isHovered
                          ? 'border-[#FF2D2D] shadow-[0_0_30px_rgba(230,36,41,0.5)] scale-[1.02] z-30'
                          : isLead
                          ? 'border-[#FF2D2D]/60 shadow-[0_0_20px_rgba(230,36,41,0.2)]'
                          : 'border-white/10'
                      }`}
                    >
                      {/* Top Red Hairline for Lead Project */}
                      {isLead && (
                        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF2D2D] to-transparent shadow-[0_0_12px_#FF2D2D] z-30" />
                      )}

                      {/* Top Preview Image */}
                      <div className="relative h-44 w-full overflow-hidden bg-[#050505]">
                        <img
                          src={project.backdropImage}
                          alt={project.name}
                          loading="lazy"
                          className="h-full w-full object-cover brightness-[0.55] contrast-125 transition-transform duration-500 ease-out group-hover:scale-105 group-hover:brightness-[0.7]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/40 to-transparent" />

                        {/* Counter & Vertical Badge */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                          <span className="rounded-md bg-black/90 border border-white/20 px-2 py-0.5 font-mono text-xs font-bold text-white shadow-md">
                            <span className="text-[#FF2D2D]">0{idx + 1}</span> / 0{totalCount}
                          </span>
                          <span className="rounded-md bg-black/85 border border-[#FF2D2D]/40 px-2.5 py-0.5 font-mono text-[10px] text-[#FF2D2D] uppercase font-semibold">
                            {project.category}
                          </span>
                        </div>

                        {/* Floating Center View Prompt */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="rounded-full bg-[#E62429] px-4 py-1.5 font-orbitron text-xs font-bold tracking-wider text-white shadow-[0_0_20px_#FF2D2D] flex items-center gap-1.5">
                            <Eye className="h-3.5 w-3.5" />
                            VIEW CASE STUDY
                          </div>
                        </div>
                      </div>

                      {/* 4-Line Content Block: Problem / What I Owned / Stack / Result */}
                      <div className="p-5 text-left">
                        {/* Result / Metric Badge */}
                        {project.metrics && (
                          <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-[#FF2D2D]/40 bg-[#E62429]/10 px-2.5 py-1 text-xs font-mono font-bold text-white">
                            <span className="text-[#FF2D2D]">⚡ RESULT:</span>
                            <span className="text-neutral-200">{project.metrics.headline}</span>
                          </div>
                        )}

                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className="font-orbitron text-xl font-black text-white group-hover:text-[#FF2D2D] transition-colors">
                            {project.name}
                          </h3>
                          {isLead && (
                            <span className="font-mono text-[10px] font-bold text-[#FF2D2D] tracking-wider uppercase">
                              ★ LEAD SYSTEM
                            </span>
                          )}
                        </div>

                        {/* Problem */}
                        <div className="mt-2.5">
                          <span className="font-mono text-[10px] uppercase font-bold text-[#FF2D2D] block">
                            THE PROBLEM:
                          </span>
                          <p className="font-inter text-xs text-neutral-300 line-clamp-2 leading-relaxed mt-0.5">
                            {project.problem || project.challenges}
                          </p>
                        </div>

                        {/* What I Owned */}
                        <div className="mt-2.5">
                          <span className="font-mono text-[10px] uppercase font-bold text-neutral-400 block">
                            WHAT I OWNED:
                          </span>
                          <p className="font-inter text-xs text-neutral-300 line-clamp-2 leading-relaxed mt-0.5">
                            {project.owned || project.role}
                          </p>
                        </div>

                        {/* The Stack */}
                        <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-1">
                          {project.tech.slice(0, 5).map((t) => (
                            <span
                              key={t}
                              className="rounded border border-white/10 bg-[#050505] px-2 py-0.5 font-mono text-[10px] text-neutral-300"
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/10">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProject(project);
                            }}
                            className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-white hover:text-[#FF2D2D] transition-colors cursor-pointer"
                          >
                            <Layers className="h-3.5 w-3.5 text-[#E62429]" />
                            <span>Architecture &amp; Trade-offs</span>
                          </button>

                          {project.liveDemo && (
                            <a
                              href={project.liveDemo}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 font-mono text-xs text-[#FF2D2D] hover:text-white transition-colors"
                            >
                              <span>Live</span>
                              <ArrowUpRight className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* Bottom Status Ticker */}
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 shrink-0 flex items-center justify-between text-xs font-mono text-neutral-400 border-t border-white/10 pt-3">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E62429]" />
                HOVER TO PREVIEW · CLICK TO INSPECT ARCHITECTURAL CASE STUDY
              </span>
              <span className="text-[#FF2D2D]">
                0{totalCount} Verified Commercial Systems
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* MOBILE VERTICAL STACK (< 768px) */
        <div className="py-16 px-4">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 mb-1.5">
              <span className="h-[1px] w-6 bg-[#E62429]" />
              <span className="font-mono text-xs font-semibold tracking-[0.25em] text-[#E62429] uppercase">
                04 // PRODUCTION SYSTEMS
              </span>
            </div>
            <h2 className="font-orbitron text-2xl font-black text-white tracking-tight uppercase">
              FEATURED <span className="text-[#E62429]">PROJECTS</span>
            </h2>
          </div>

          <div className="space-y-6">
            {CURATED_PROJECTS.map((project, idx) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="rounded-xl bg-[#0D0D0D] border border-white/10 p-5 shadow-xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="rounded bg-black border border-white/20 px-2 py-0.5 font-mono text-xs font-bold text-white">
                    0{idx + 1} / 0{totalCount}
                  </span>
                  <span className="font-mono text-[11px] text-[#FF2D2D] uppercase font-semibold">
                    {project.category}
                  </span>
                </div>

                <h3 className="font-orbitron text-lg font-black text-white mb-2">
                  {project.name}
                </h3>

                {project.metrics && (
                  <div className="mb-3 rounded bg-[#E62429]/10 border border-[#FF2D2D]/30 p-2 font-mono text-xs text-neutral-200">
                    <span className="text-[#FF2D2D] font-bold">RESULT: </span>
                    {project.metrics.headline}
                  </div>
                )}

                <div className="space-y-2 text-xs font-inter text-neutral-300 mb-4">
                  <div>
                    <strong className="font-mono text-[#FF2D2D] block text-[10px]">THE PROBLEM:</strong>
                    {project.problem || project.challenges}
                  </div>
                  <div>
                    <strong className="font-mono text-neutral-400 block text-[10px]">WHAT I OWNED:</strong>
                    {project.owned || project.role}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {project.tech.slice(0, 4).map((t) => (
                    <span key={t} className="rounded bg-[#050505] border border-white/10 px-2 py-0.5 font-mono text-[10px] text-neutral-300">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(project);
                    }}
                    className="font-mono text-xs text-white hover:text-[#FF2D2D] flex items-center gap-1"
                  >
                    <Layers className="h-3 w-3 text-[#E62429]" />
                    <span>Case Study &amp; Architecture</span>
                  </button>

                  {project.liveDemo && (
                    <a
                      href={project.liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="font-mono text-xs text-[#FF2D2D] flex items-center gap-1"
                    >
                      <span>Live</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cinematic Case Study Modal */}
      <CinematicProjectModal
        project={selectedProject}
        projects={projectUniverseItems}
        onClose={() => setSelectedProject(null)}
        onSelectProject={setSelectedProject}
        onLaunch3DWorld={() => {
          setSelectedProject(null);
          document.getElementById('nav-play-game-btn')?.click();
        }}
        reducedMotion={false}
      />
    </div>
  );
};
