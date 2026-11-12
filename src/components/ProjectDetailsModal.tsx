import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Play,
  Cpu,
  Layers,
  ExternalLink,
  Code2,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import type { Project } from '../types';
import { ProjectPreview3D } from './ProjectPreview3D';

interface ProjectDetailsModalProps {
  project: Project;
  projects?: Project[];
  onSelectProject?: (project: Project) => void;
  onClose: () => void;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  project,
  projects = [],
  onSelectProject,
  onClose,
}) => {
  const [simProjectId, setSimProjectId] = useState<string | null>(null);
  const [selectionState, setSelectionState] = useState({
    projectId: project.id,
    featureIdx: 0,
    archIdx: 0,
  });

  const simulating = simProjectId === project.id;
  const activeFeatureIdx = selectionState.projectId === project.id ? selectionState.featureIdx : 0;
  const activeArchNodeIdx = selectionState.projectId === project.id ? selectionState.archIdx : 0;

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Allow Escape key (capture phase) to close inspector modal reliably
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.code === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onCloseRef.current();
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, []);

  const projectIdx = useMemo(
    () => Math.max(0, projects.findIndex((p) => p.id === project.id)),
    [projects, project.id]
  );
  const hasCatalog = projects.length > 0 && Boolean(onSelectProject);
  const prevProject = hasCatalog && projectIdx > 0 ? projects[projectIdx - 1] : null;
  const nextProject =
    hasCatalog && projectIdx < projects.length - 1 ? projects[projectIdx + 1] : null;
  const bayCode = `P${String(projectIdx + 1).padStart(2, '0')}`;
  const totalCount = Math.max(projects.length, 8);

  const architecturePipeline = useMemo(() => {
    const clientTech = project.tech.slice(0, 2).join(' · ') || 'Interactive Client UI';
    const coreTech = project.tech.slice(2, 4).join(' · ') || project.category;
    const dataTech = project.tech.slice(4).join(' · ') || 'Cloud Persistence & Telemetry';
    return [
      {
        title: '01 · CLIENT EXPERIENCE LAYER',
        detail: `${clientTech} — entry workflow & responsive views`,
      },
      {
        title: '02 · DOMAIN ENGINE & API CORE',
        detail: `${coreTech} — ${project.role}`,
      },
      {
        title: '03 · INFRASTRUCTURE & DATA SYNC',
        detail: `${dataTech} — production runtime & persistence`,
      },
    ];
  }, [project]);

  const handleSimulateFlow = () => {
    const targetId = project.id;
    setSimProjectId(targetId);
    setSelectionState((prev) => ({
      projectId: targetId,
      featureIdx: prev.projectId === targetId ? prev.featureIdx : 0,
      archIdx: ((prev.projectId === targetId ? prev.archIdx : 0) + 1) % architecturePipeline.length,
    }));
    setTimeout(() => {
      setSimProjectId((curr) => (curr === targetId ? null : curr));
    }, 1800);
  };

  const handleStepNextFeature = () => {
    if (project.features.length === 0) return;
    setSelectionState((prev) => ({
      projectId: project.id,
      archIdx: prev.projectId === project.id ? prev.archIdx : 0,
      featureIdx: ((prev.projectId === project.id ? prev.featureIdx : 0) + 1) % project.features.length,
    }));
  };

  const setActiveArchNodeIdx = (idx: number) => {
    setSelectionState((prev) => ({
      projectId: project.id,
      featureIdx: prev.projectId === project.id ? prev.featureIdx : 0,
      archIdx: idx,
    }));
  };

  const setActiveFeatureIdx = (idx: number) => {
    setSelectionState((prev) => ({
      projectId: project.id,
      archIdx: prev.projectId === project.id ? prev.archIdx : 0,
      featureIdx: idx,
    }));
  };

  const hasLiveDemo = Boolean(project.liveDemo && project.liveDemo !== '#');
  const hasGithub = Boolean(project.github && project.github !== '#');

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/80 backdrop-blur-md p-3 md:p-6 pointer-events-auto"
      style={{ pointerEvents: 'auto' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden rounded-2xl border border-red-500/45 bg-gradient-to-br from-[#0e0f14]/95 via-[#130a0c]/95 to-[#090a0d]/95 shadow-[0_0_70px_rgba(220,38,38,0.35)] text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP HEADER BAR (Matches AI Factory Command Modal) */}
        <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-red-500/35 bg-gradient-to-r from-red-950/60 via-[#150c10] to-black/80">
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-2.5 py-1 rounded-md bg-red-600/25 border border-red-500/60 text-xs font-mono font-bold text-orange-300 tracking-widest shrink-0">
              PROJECT {bayCode} / {String(totalCount).padStart(2, '0')}
            </span>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded bg-orange-500/15 border border-orange-500/35 text-[10px] font-mono uppercase tracking-wider text-orange-300 shrink-0">
              {project.category}
            </span>
            <div className="min-w-0">
              <h2 className="text-lg md:text-2xl font-['Orbitron'] font-black tracking-wide text-white truncate">
                {project.name}
              </h2>
              <p className="text-xs text-orange-200/80 font-mono truncate">{project.tagline}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close project details"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-600/30 border border-white/15 hover:border-red-400/60 text-xs font-mono text-zinc-300 hover:text-white transition cursor-pointer shrink-0"
          >
            <X size={15} />
            <span>CLOSE [ESC]</span>
          </button>
        </div>

        {/* MAIN 12-COLUMN HOLOGRAPHIC ENGINEERING LAB */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* LEFT PANEL: Live 3D Hologram Core, Telemetry Cards, Architecture Flow & Launchers */}
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-red-500/25 p-4 md:p-5 space-y-4 overflow-y-auto bg-black/25">
            <div className="relative">
              <ProjectPreview3D buildingStyle={project.buildingStyle} simulating={simulating} />
              <button
                onClick={handleSimulateFlow}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-xs font-['Orbitron'] font-bold text-white shadow-lg shadow-red-900/50 cursor-pointer transition"
              >
                <Play size={13} />
                {simulating ? 'SIMULATING FLOW...' : 'SIMULATE SYSTEM'}
              </button>
            </div>

            {/* 3 Telemetry Metric Cards */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-lg border border-red-500/25 bg-red-950/20">
                <div className="text-[9px] font-mono text-orange-300/80 tracking-wider">TECH MODULES</div>
                <div className="text-xs font-bold font-mono text-white mt-0.5">
                  {String(project.tech.length).padStart(2, '0')} CORE
                </div>
              </div>
              <div className="p-2.5 rounded-lg border border-red-500/25 bg-red-950/20">
                <div className="text-[9px] font-mono text-orange-300/80 tracking-wider">CAPABILITIES</div>
                <div className="text-xs font-bold font-mono text-white mt-0.5">
                  {String(project.features.length).padStart(2, '0')} LIVE
                </div>
              </div>
              <div className="p-2.5 rounded-lg border border-red-500/25 bg-red-950/20">
                <div className="text-[9px] font-mono text-orange-300/80 tracking-wider">STATUS</div>
                <div className="text-xs font-bold font-mono text-emerald-400 mt-0.5">PRODUCTION</div>
              </div>
            </div>

            {/* Interactive System Architecture Pipeline */}
            <div className="p-3 rounded-xl border border-red-500/25 bg-black/40">
              <div className="flex items-center gap-1.5 text-[11px] font-['Orbitron'] font-bold text-orange-400 mb-2">
                <Layers size={13} />
                SYSTEM ARCHITECTURE FLOW
              </div>
              <div className="space-y-1.5">
                {architecturePipeline.map((node, ni) => {
                  const isHighlighted = activeArchNodeIdx === ni;
                  return (
                    <button
                      key={node.title}
                      type="button"
                      onClick={() => setActiveArchNodeIdx(ni)}
                      className={`w-full text-left flex items-center gap-2 rounded border px-2 py-1.5 cursor-pointer transition ${
                        isHighlighted
                          ? 'border-orange-400/70 bg-red-950/45 shadow-[0_0_16px_rgba(249,115,22,0.2)]'
                          : 'border-white/10 bg-white/5 hover:border-red-500/40'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full text-[10px] font-mono flex items-center justify-center shrink-0 ${
                          isHighlighted
                            ? 'bg-orange-500 text-black font-bold'
                            : 'bg-red-600/80 text-white'
                        }`}
                      >
                        {ni + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-white truncate">{node.title}</div>
                        <div className="text-[10px] font-mono text-zinc-300 truncate">{node.detail}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Deployment & Repository Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {hasLiveDemo && (
                <a
                  href={project.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-xs font-['Orbitron'] font-bold text-white shadow-md shadow-red-950/60 transition"
                >
                  <ExternalLink size={13} />
                  <span>LAUNCH LIVE DEMO</span>
                </a>
              )}
              {hasGithub && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-red-500/40 bg-red-950/35 hover:bg-red-900/45 text-xs font-mono font-bold text-orange-200 transition"
                >
                  <Code2 size={13} />
                  <span>SOURCE REPO</span>
                </a>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Full Engineering Breakdown, Interactive Features & Challenges */}
          <div className="lg:col-span-7 overflow-y-auto p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-red-500/25 bg-white/[0.03]">
                <div className="flex items-center gap-1.5 text-[11px] font-['Orbitron'] font-bold text-red-400 mb-1">
                  <Sparkles size={12} />
                  SYSTEM OVERVIEW
                </div>
                <p className="text-xs leading-relaxed text-zinc-200">{project.description}</p>
              </div>
              <div className="p-3.5 rounded-xl border border-orange-500/25 bg-white/[0.03]">
                <div className="text-[11px] font-['Orbitron'] font-bold text-orange-400 mb-1">
                  OWNERSHIP & ROLE
                </div>
                <p className="text-xs leading-relaxed text-zinc-200 font-medium">{project.role}</p>
                <div className="mt-2 pt-2 border-t border-white/10 text-[10px] font-mono text-orange-300/90">
                  SECTOR: {project.category.toUpperCase()} · STYLE: {project.buildingStyle.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Interactive Production Features Inspection List */}
            <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-950/15">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-[11px] font-['Orbitron'] font-bold text-orange-300">
                  <Cpu size={13} />
                  PRODUCTION FEATURES & MODULES
                </span>
                <button
                  onClick={handleStepNextFeature}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 border border-orange-400/40 text-orange-300 hover:bg-orange-500/35 cursor-pointer"
                >
                  STEP NEXT →
                </button>
              </div>
              <ol className="space-y-1.5">
                {project.features.map((feat, idx) => (
                  <li
                    key={feat}
                    onClick={() => setActiveFeatureIdx(idx)}
                    className={`flex items-start gap-2 text-xs p-2 rounded-lg border cursor-pointer transition ${
                      activeFeatureIdx === idx
                        ? 'border-orange-400/60 bg-orange-500/15 text-white font-medium'
                        : 'border-white/5 bg-black/25 text-zinc-300 hover:border-red-500/30'
                    }`}
                  >
                    <CheckCircle2
                      size={14}
                      className={`mt-0.5 shrink-0 ${
                        activeFeatureIdx === idx ? 'text-orange-400' : 'text-red-500/70'
                      }`}
                    />
                    <span>
                      <span className="font-mono text-orange-400 mr-1.5">
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      {feat}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Engineering Challenges Solved */}
            <div className="p-3.5 rounded-xl border border-red-500/35 bg-black/45">
              <div className="flex items-center gap-1.5 text-[11px] font-['Orbitron'] font-bold text-red-400 mb-1.5">
                <ShieldAlert size={13} />
                KEY ENGINEERING CHALLENGE & RESOLUTION
              </div>
              <p className="text-xs leading-relaxed text-zinc-200">{project.challenges}</p>
            </div>

            {/* Technology Stack Matrix */}
            <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.03]">
              <div className="text-[11px] font-['Orbitron'] font-bold text-orange-300 mb-2">
                VERIFIED TECH STACK MATRIX
              </div>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded bg-red-950/60 border border-red-500/35 text-[11px] font-mono text-orange-100"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM NAVIGATION STRIP: Previous / Quick P01..P08 Switcher / Next */}
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-red-500/30 bg-black/65">
          <button
            onClick={() => prevProject && onSelectProject?.(prevProject)}
            disabled={!prevProject}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/35 bg-white/5 hover:bg-red-600/25 disabled:opacity-35 text-xs font-mono text-orange-200 cursor-pointer transition"
          >
            <ArrowLeft size={14} />
            {prevProject ? `PREV: ${prevProject.name}` : 'CAMPUS START'}
          </button>

          {hasCatalog && (
            <div className="hidden md:flex items-center gap-1">
              {projects.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => onSelectProject?.(p)}
                  title={`P${String(idx + 1).padStart(2, '0')} · ${p.name}`}
                  className={`px-2 h-6 rounded text-[10px] font-mono font-bold cursor-pointer transition ${
                    p.id === project.id
                      ? 'bg-red-600 text-white shadow-[0_0_10px_#ef4444]'
                      : 'bg-white/10 text-zinc-400 hover:bg-orange-500/30 hover:text-white'
                  }`}
                >
                  P{String(idx + 1).padStart(2, '0')}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => nextProject && onSelectProject?.(nextProject)}
            disabled={!nextProject}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 disabled:opacity-35 text-xs font-['Orbitron'] font-bold text-white cursor-pointer transition"
          >
            {nextProject ? `NEXT: ${nextProject.name}` : 'END OF CAMPUS'}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
