import React, { useRef } from 'react';
import { ArrowUpRight, Layers } from 'lucide-react';
import type { ProjectUniverseItem } from '../../data/projectUniverseData';
import { ProjectDisplayScreen } from './ProjectDisplayScreen';

interface ProjectHoloCardProps {
  project: ProjectUniverseItem;
  onSelect: (project: ProjectUniverseItem) => void;
  reducedMotion: boolean;
  variant?: 'gallery' | 'grid';
  isActiveInGallery?: boolean;
}

export const ProjectHoloCard: React.FC<ProjectHoloCardProps> = ({
  project,
  onSelect,
  reducedMotion,
  variant = 'grid',
  isActiveInGallery = false,
}) => {
  const tiltRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const rafPendingRef = useRef(0);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || e.pointerType === 'touch') return;
    const card = tiltRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafPendingRef.current) {
      window.cancelAnimationFrame(rafPendingRef.current);
    }

    rafPendingRef.current = window.requestAnimationFrame(() => {
      const nx = (clientX - rect.left) / rect.width - 0.5;
      const ny = (clientY - rect.top) / rect.height - 0.5;
      const rotateY = nx * 9.5;
      const rotateX = -ny * 8.5;

      card.style.transform = `perspective(1100px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;

      if (sheenRef.current) {
        const px = ((clientX - rect.left) / rect.width) * 100;
        const py = ((clientY - rect.top) / rect.height) * 100;
        sheenRef.current.style.background = `radial-gradient(circle 220px at ${px.toFixed(1)}% ${py.toFixed(1)}%, rgba(255, 48, 56, 0.16), transparent 72%)`;
        sheenRef.current.style.opacity = '1';
      }
      rafPendingRef.current = 0;
    });
  };

  const handlePointerLeave = () => {
    if (rafPendingRef.current) {
      window.cancelAnimationFrame(rafPendingRef.current);
      rafPendingRef.current = 0;
    }
    if (tiltRef.current) {
      tiltRef.current.style.transform = '';
    }
    if (sheenRef.current) {
      sheenRef.current.style.opacity = '0';
    }
  };

  const idleVars = reducedMotion
    ? undefined
    : ({
        '--pu-float-y': `${project.idleMotion.floatY}px`,
        '--pu-float-dur': `${project.idleMotion.floatDuration}s`,
        '--pu-float-delay': `${project.idleMotion.floatDelay}s`,
        '--pu-tilt-amp': `${project.idleMotion.tiltAmp}deg`,
      } as React.CSSProperties);

  return (
    <div
      className={!reducedMotion && variant === 'grid' ? 'pu-card-idle h-full' : 'h-full'}
      style={idleVars}
    >
      <article
        ref={tiltRef}
        data-project-cursor="true"
        onClick={() => onSelect(project)}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={`group pu-card-surface relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl p-4 sm:p-5 text-left transition-transform duration-300 ease-out ${
          isActiveInGallery
            ? 'border-[#FF3038]/65 shadow-[0_24px_65px_-20px_rgba(255,48,56,0.34)]'
            : ''
        }`}
      >
        {/* Subtle Traveling Border Beam on Hover / Active Gallery Focus */}
        <div
          aria-hidden="true"
          className={`pu-border-beam pointer-events-none absolute -inset-[1px] rounded-2xl transition-opacity duration-500 ${
            isActiveInGallery ? 'opacity-45' : 'opacity-0 group-hover:opacity-55'
          }`}
          style={{
            WebkitMask:
              'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            padding: '1px',
          }}
        />

        {/* Cursor-Tracking Radial Crimson Sheen */}
        <div
          ref={sheenRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        />

        {/* Top Holographic Display Screen */}
        <ProjectDisplayScreen
          project={project}
          isActive={isActiveInGallery}
          compact={variant === 'grid'}
          onExplore={() => onSelect(project)}
        />

        {/* Metadata & Title */}
        <div className="relative z-10 mt-4 flex flex-1 flex-col">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-[#FF3038] uppercase">
              {project.category}
            </span>
            {project.flagshipLabel && (
              <span className="truncate rounded border border-[#FF3038]/30 bg-[#FF3038]/10 px-2 py-0.5 font-mono text-[9px] text-red-200">
                PRIORITY BUILD
              </span>
            )}
          </div>

          <h3 className="mt-1.5 font-orbitron text-lg font-bold tracking-tight text-white transition-colors group-hover:text-[#FF3038] sm:text-xl">
            {project.name}
          </h3>

          <p className="mt-1 text-xs font-medium text-red-200/80">{project.tagline}</p>

          <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-[#A0A0A0] sm:text-[13px]">
            {project.description}
          </p>

          {/* Tech Badges — Illuminate Crimson on Card Hover */}
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {project.tech.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-neutral-300 transition-all duration-300 group-hover:border-[#FF3038]/40 group-hover:bg-[#FF3038]/10 group-hover:text-white"
              >
                {tech}
              </span>
            ))}
            {project.tech.length > 5 && (
              <span className="rounded-md border border-white/10 bg-white/[0.02] px-2 py-0.5 font-mono text-[10px] text-[#A0A0A0]">
                +{project.tech.length - 5}
              </span>
            )}
          </div>

          {/* Card Footer Action Bar */}
          <div className="relative z-20 mt-4 flex items-center justify-between gap-2 border-t border-white/10 pt-3.5 text-xs">
            <button
              type="button"
              data-no-cursor-hud="true"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(project);
              }}
              aria-label={`Open case study for ${project.name}`}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#FF3038]/40 bg-[#FF3038]/12 px-3 py-1.5 font-orbitron text-[11px] font-bold tracking-wider text-white transition-all duration-200 hover:border-[#FF3038] hover:bg-[#FF3038] hover:shadow-[0_0_16px_rgba(255,48,56,0.45)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3038]"
            >
              <Layers className="h-3.5 w-3.5 text-[#FF3038] transition-colors group-hover:text-white" />
              CASE STUDY
            </button>

            {project.liveDemo ? (
              <a
                href={project.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                data-no-cursor-hud="true"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/25 bg-white/[0.06] px-3 py-1.5 font-mono text-[11px] font-semibold text-white transition-all duration-200 hover:border-[#FF3038] hover:bg-[#FF3038]/25 hover:shadow-[0_0_14px_rgba(255,48,56,0.35)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3038]"
                aria-label={`Open live site for ${project.name}`}
              >
                LIVE
                <ArrowUpRight className="h-3.5 w-3.5 text-[#FF3038]" />
              </a>
            ) : (
              <button
                type="button"
                data-no-cursor-hud="true"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(project);
                }}
                className="cursor-pointer rounded-lg border border-white/15 bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] text-neutral-300 transition-all hover:border-[#FF3038]/50 hover:text-white active:scale-95"
              >
                ARCHITECTURE
              </button>
            )}
          </div>
        </div>
      </article>
    </div>
  );
};
