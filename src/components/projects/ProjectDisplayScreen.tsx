import React from 'react';
import { Eye, Sparkles } from 'lucide-react';
import type { ProjectUniverseItem } from '../../data/projectUniverseData';

interface ProjectDisplayScreenProps {
  project: ProjectUniverseItem;
  isActive?: boolean;
  compact?: boolean;
  onExplore?: () => void;
}

const STYLE_WIREFRAME_LABEL: Record<string, string> = {
  restaurant: 'BROKERAGE & LISTING ENGINE',
  medical: 'MEDICAL RESEARCH PORTAL',
  library: 'AI RAG VECTOR PIPELINE',
  school: 'EDTECH LMS PLATFORM',
  social: 'REALTIME SOCIAL MESH',
  tech: 'COMMERCE & TELECOM API',
  finance: 'TAX COMPLIANCE ENGINE',
  hospital: 'CLINICAL CARE & BOOKING',
};

export const ProjectDisplayScreen: React.FC<ProjectDisplayScreenProps> = ({
  project,
  isActive = false,
  compact = false,
  onExplore,
}) => {
  const schematicLabel =
    STYLE_WIREFRAME_LABEL[project.buildingStyle] ?? project.category.toUpperCase();

  return (
    <div
      className={`group/screen relative w-full overflow-hidden rounded-xl border border-red-500/25 bg-[#09090b] transition-all duration-500 ${
        compact ? 'h-44 sm:h-48' : 'h-48 sm:h-52'
      }`}
      style={{
        boxShadow: isActive
          ? '0 14px 36px -14px rgba(255, 48, 56, 0.35), 0 0 0 1px rgba(255, 48, 56, 0.25) inset'
          : '0 10px 28px -16px rgba(0, 0, 0, 0.9)',
      }}
    >
      {/* Underlying Category Photography + 3D Hover Zoom */}
      <img
        src={project.backdropImage}
        alt={`${project.name} architectural domain backdrop`}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover brightness-[0.38] contrast-125 saturate-50 transition-transform duration-700 ease-out group-hover:scale-108 group-hover/screen:scale-110"
      />

      {/* Crimson Depth Vignette & Grid Scan Matrix */}
      <div
        aria-hidden="true"
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background:
            'linear-gradient(180deg, rgba(8,8,8,0.35) 0%, rgba(16,8,10,0.68) 65%, rgba(8,8,8,0.94) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,48,56,0.28) 1px, transparent 1px), linear-gradient(90deg, rgba(255,48,56,0.28) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />

      {/* Specular Diagonal Glass Reflection */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-10 -top-12 h-28 -rotate-12 bg-gradient-to-b from-white/[0.12] via-white/[0.02] to-transparent opacity-60 transition-transform duration-700 group-hover:translate-y-4"
      />

      {/* Scanning Crimson Laser (activates cleanly on hover) */}
      <div
        aria-hidden="true"
        className="pu-display-laser pointer-events-none absolute inset-x-0 top-0 h-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: 'linear-gradient(90deg, transparent 5%, #FF3038 50%, transparent 95%)',
          boxShadow: '0 0 14px 2px rgba(255, 48, 56, 0.85)',
        }}
      />

      {/* Top HUD Telemetry Row */}
      <div className="relative z-10 flex items-center justify-between px-3.5 pt-3 text-[10px] font-mono tracking-wider">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/35 bg-black/75 px-2.5 py-0.5 text-[#FF3038] backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FF3038] shadow-[0_0_8px_#FF3038]" />
          NODE {project.indexLabel}
        </span>

        {project.isFlagship ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-red-600/25 px-2.5 py-0.5 text-[9px] font-semibold text-white backdrop-blur-md">
            <Sparkles className="h-2.5 w-2.5 text-[#FF3038]" />
            FLAGSHIP
          </span>
        ) : (
          <span className="rounded border border-white/10 bg-black/65 px-2 py-0.5 text-[9px] uppercase text-[#A0A0A0]">
            {project.category}
          </span>
        )}
      </div>

      {/* Central Architectural Node Schematic Overlay */}
      <div className="relative z-10 flex h-[calc(100%-36px)] flex-col items-center justify-center px-4 text-center">
        <div className="mb-2 flex items-center gap-2 opacity-80 transition-transform duration-500 group-hover:scale-105">
          <span className="h-px w-7 bg-gradient-to-r from-transparent to-[#FF3038]" />
          <div className="relative flex h-11 w-11 items-center justify-center rounded-lg border border-[#FF3038]/40 bg-black/70 shadow-[0_0_18px_rgba(255,48,56,0.22)]">
            <span className="font-orbitron text-xs font-bold text-white">
              {project.indexLabel}
            </span>
            <span className="absolute -left-1 -top-1 h-2 w-2 border-l border-t border-[#FF3038]" />
            <span className="absolute -right-1 -bottom-1 h-2 w-2 border-b border-r border-[#FF3038]" />
          </div>
          <span className="h-px w-7 bg-gradient-to-l from-transparent to-[#FF3038]" />
        </div>

        <p className="font-mono text-[10px] tracking-[0.22em] text-red-300/90 uppercase">
          {schematicLabel}
        </p>

        {/* Clickable Explore Action Button */}
        <button
          type="button"
          data-no-cursor-hud="true"
          onClick={(e) => {
            e.stopPropagation();
            onExplore?.();
          }}
          aria-label={`Explore ${project.name} case study`}
          className="relative z-20 mt-2.5 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#FF3038]/65 bg-[#080808]/90 px-3.5 py-1.5 font-orbitron text-[10px] font-bold tracking-[0.16em] text-white opacity-90 shadow-[0_0_14px_rgba(255,48,56,0.2)] transition-all duration-300 hover:scale-105 hover:border-[#FF3038] hover:bg-[#FF3038] hover:opacity-100 hover:shadow-[0_0_20px_rgba(255,48,56,0.55)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3038]"
        >
          <Eye className="h-3 w-3 text-[#FF3038] transition-colors group-hover/screen:text-white" />
          EXPLORE
        </button>
      </div>

      {/* Crisp Corner Reticles */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-2 left-2.5 h-2.5 w-2.5 border-b border-l border-red-500/45"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-2 right-2.5 h-2.5 w-2.5 border-b border-r border-red-500/45"
      />
    </div>
  );
};
