import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Eye, Layers } from 'lucide-react';
import {
  projectUniverseItems,
  type ProjectUniverseItem,
} from '../../data/projectUniverseData';
import { CinematicProjectModal } from '../../components/projects/CinematicProjectModal';

export const Projects: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectUniverseItem | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Scroll Progress across 320vh for smooth horizontal scrub
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Calculate track travel distance
  // 8 projects * ~420px + gap -> translates from 0% to approximately -72%
  const trackX = useTransform(scrollYProgress, [0, 1], ['2%', '-75%']);

  // Parallax inner image moves in opposite direction of horizontal travel
  const innerImageX = useTransform(scrollYProgress, [0, 1], ['12%', '-12%']);

  const totalCount = projectUniverseItems.length;

  return (
    <div id="projects" ref={containerRef} className="relative h-[340vh] w-full bg-[#000000]">
      {/* Sticky 100vh Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-8 sm:py-12 z-10">
        {/* Background Ambient Red Fog */}
        <div className="dp-halftone absolute inset-0 opacity-15 pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[#E62429]/10 blur-[120px] pointer-events-none" />

        {/* Section Header Bar */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 mb-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF2D2D] animate-ping" />
                <span className="font-orbitron text-xs sm:text-sm font-bold tracking-[0.28em] text-[#E62429] uppercase">
                  04 // THE SHOWPIECE
                </span>
              </div>
              <h2 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                FEATURED <span className="text-[#E62429] drop-shadow-[0_0_18px_rgba(230,36,41,0.6)]">WORK</span>
              </h2>
            </div>

            {/* Horizontal Scroll Progress Prompt */}
            <div className="hidden sm:flex items-center gap-3">
              <span className="font-bangers text-sm tracking-wider text-neutral-400">
                SCROLL DOWN TO TRAVEL HORIZONTALLY
              </span>
              <div className="h-1.5 w-24 rounded-full bg-neutral-900 border border-white/10 overflow-hidden">
                <motion.div
                  style={{ scaleX: scrollYProgress }}
                  className="h-full bg-gradient-to-r from-[#8B0000] via-[#E62429] to-[#FF2D2D] origin-left"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Project Track */}
        <div className="relative w-full my-auto overflow-visible">
          <motion.div
            style={{ x: trackX }}
            className="flex items-center gap-6 sm:gap-8 pl-4 sm:pl-12 pr-32 select-none"
          >
            {projectUniverseItems.map((project, idx) => {
              const isHovered = hoveredCardId === project.id;
              const hasHoveredCard = Boolean(hoveredCardId);
              const isDimmed = hasHoveredCard && !isHovered;
              const isPriorityBuild = project.id === 'knowledger' || project.id === 'ceretax';

              return (
                <div
                  key={project.id}
                  data-project-card="true"
                  onMouseEnter={() => setHoveredCardId(project.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  onClick={() => setSelectedProject(project)}
                  className={`group relative shrink-0 w-[86vw] sm:w-[480px] md:w-[540px] rounded-2xl bg-[#0c0c0e]/95 border transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-xl ${
                    isHovered
                      ? 'scale-[1.03] border-[#FF2D2D] shadow-[0_0_40px_rgba(230,36,41,0.7)] z-30'
                      : isDimmed
                      ? 'scale-[0.97] opacity-45 border-white/10 blur-[1px]'
                      : isPriorityBuild
                      ? 'border-[#FF2D2D]/70 shadow-[0_0_30px_rgba(230,36,41,0.35)] ring-1 ring-[#FF2D2D]/40'
                      : 'border-white/10 shadow-2xl'
                  }`}
                >
                  {/* Top Glowing Red Accent for Priority Builds */}
                  {isPriorityBuild && (
                    <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#FF2D2D] to-transparent shadow-[0_0_15px_#FF2D2D] z-30" />
                  )}

                  {/* Top Screenshot Window with Parallax Inner Image */}
                  <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-neutral-950">
                    <motion.img
                      style={{ x: innerImageX }}
                      src={project.backdropImage}
                      alt={project.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-[125%] -left-[12.5%] object-cover object-center brightness-[0.6] contrast-125 transition-transform duration-700 ease-out group-hover:scale-108 group-hover:brightness-[0.75]"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-black/40 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 gap-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-black/85 border border-[#E62429]/50 px-2.5 py-1 font-orbitron text-xs font-bold text-[#FF2D2D] shadow-sm">
                          {String(idx + 1).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
                        </span>
                        {isPriorityBuild && (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-black/90 border border-[#FF2D2D] px-2.5 py-1 font-orbitron text-[10px] sm:text-xs font-black text-[#FF2D2D] shadow-[0_0_12px_rgba(255,45,45,0.7)]">
                            <span className="animate-bounce">🔥</span>
                            <span>PRIORITY BUILD</span>
                          </span>
                        )}
                      </div>
                      <span className="rounded-lg bg-black/80 border border-white/10 px-2 py-0.5 font-mono text-[10px] text-neutral-300 uppercase shrink-0">
                        {project.category}
                      </span>
                    </div>

                    {/* Floating Center View Prompt */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="rounded-full bg-[#E62429] px-4 py-2 font-bangers text-sm tracking-widest text-white shadow-[0_0_20px_#FF2D2D] flex items-center gap-1.5 transform group-hover:scale-105 transition-transform">
                        <Eye className="h-4 w-4" />
                        EXPLORE CASE STUDY
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 text-left">
                    {/* Standout Metric Badge */}
                    {project.metrics && (
                      <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-md border border-[#E62429]/40 bg-[#E62429]/15 px-2.5 py-1 text-[11px] font-orbitron font-bold text-white shadow-sm">
                        <span className="text-[#FF2D2D]">⚡</span>
                        <span>{project.metrics.badge}:</span>
                        <span className="text-[#FF2D2D] font-mono">{project.metrics.stat}</span>
                      </div>
                    )}

                    <h3 className="font-orbitron text-xl sm:text-2xl font-black text-white group-hover:text-[#FF2D2D] transition-colors">
                      {project.name}
                    </h3>
                    <p className="mt-1 font-inter text-xs sm:text-sm text-neutral-400 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Tech Badges */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.tech.slice(0, 5).map((t) => (
                        <span
                          key={t}
                          className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-neutral-300 group-hover:border-[#E62429]/40 group-hover:text-white"
                        >
                          {t}
                        </span>
                      ))}
                      {project.tech.length > 5 && (
                        <span className="rounded-md border border-white/10 bg-white/[0.02] px-2 py-0.5 font-mono text-[10px] text-neutral-400">
                          +{project.tech.length - 5}
                        </span>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(project);
                        }}
                        className="inline-flex items-center gap-1.5 font-orbitron text-xs font-bold text-white hover:text-[#FF2D2D] transition-colors cursor-pointer"
                      >
                        <Layers className="h-3.5 w-3.5 text-[#E62429]" />
                        CASE STUDY & TRADE-OFFS
                      </button>

                      <div className="flex items-center gap-2">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-lg border border-white/15 bg-white/[0.04] text-neutral-300 hover:text-white hover:border-[#E62429] transition-all"
                            aria-label={`GitHub repo for ${project.name}`}
                          >
                            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                            </svg>
                          </a>
                        )}
                        {project.liveDemo && (
                          <a
                            href={project.liveDemo}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 rounded-lg border border-[#E62429]/60 bg-[#E62429]/20 px-3 py-1 font-mono text-xs font-bold text-white hover:bg-[#E62429] hover:shadow-[0_0_12px_#FF2D2D] transition-all"
                            aria-label={`Live demo for ${project.name}`}
                          >
                            LIVE
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
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
            <span className="h-2 w-2 rounded-full bg-[#E62429]" />
            HOVER CARDS TO INSPECT · CLICK TO READ ARCHITECTURAL CASE STUDY
          </span>
          <span className="hidden sm:inline text-[#FF2D2D] font-bangers text-sm">
            Total Projects: {totalCount} Shipped Systems
          </span>
        </div>
      </div>

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
