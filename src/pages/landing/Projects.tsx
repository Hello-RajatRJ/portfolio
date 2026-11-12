import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Gamepad2, Layers } from 'lucide-react';
import { useStore } from '../../store/useStore';
import {
  projectUniverseItems,
  type ProjectUniverseItem,
} from '../../data/projectUniverseData';
import type { ParallaxSignalState } from '../../components/projects/projectTypes';
import { ProjectParallaxBackdrop } from '../../components/projects/ProjectParallaxBackdrop';
import { ProjectUniverseCanvas } from '../../components/projects/ProjectUniverseCanvas';
import { PinnedProjectGallery } from '../../components/projects/PinnedProjectGallery';
import { ProjectHoloCard } from '../../components/projects/ProjectHoloCard';
import { ProjectCursorHUD } from '../../components/projects/ProjectCursorHUD';
import { CinematicProjectModal } from '../../components/projects/CinematicProjectModal';
import '../../components/projects/projectUniverse.css';

const HEADING_EYEBROW = '04. PROJECTS';

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export const Projects: React.FC = () => {
  const launchGame = useStore((s) => s.launchGame);

  const sectionRef = useRef<HTMLElement | null>(null);
  const introInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const signalRef = useRef<ParallaxSignalState>({
    pointerX: 0,
    pointerY: 0,
    scrollProgress: 0,
    scrollVelocity: 0,
    active: false,
  });

  const [selectedProject, setSelectedProject] = useState<ProjectUniverseItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [shouldMountCanvas, setShouldMountCanvas] = useState(false);
  const [sectionActive, setSectionActive] = useState(false);
  const [webglSupported] = useState(() => checkWebGLSupport());
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  const uniqueCategories = useMemo(
    () => ['ALL', ...Array.from(new Set(projectUniverseItems.map((p) => p.category)))],
    []
  );

  const filteredGridProjects = useMemo(() => {
    if (selectedCategory === 'ALL') return projectUniverseItems;
    return projectUniverseItems.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  // Listen live to OS reduced-motion setting
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Pause WebGL render loop and parallax RAF cleanly when section is offscreen or tab hidden
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let tabVisible = !document.hidden;
    let inRange = false;

    const syncActive = () => {
      const active = tabVisible && inRange;
      signalRef.current.active = active;
      setSectionActive(active);
    };

    const mountObs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldMountCanvas(true);
          mountObs.disconnect();
        }
      },
      { rootMargin: '260px 0px' }
    );
    mountObs.observe(el);

    const activeObs = new IntersectionObserver(
      (entries) => {
        inRange = Boolean(entries[0]?.isIntersecting);
        syncActive();
      },
      { threshold: 0.04 }
    );
    activeObs.observe(el);

    const onVisibility = () => {
      tabVisible = !document.hidden;
      syncActive();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      mountObs.disconnect();
      activeObs.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const handleSectionPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reducedMotion || e.pointerType === 'touch') return;
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    signalRef.current.pointerX = ((e.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2;
    signalRef.current.pointerY = ((e.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 2;
  };

  const handleSectionPointerLeave = () => {
    signalRef.current.pointerX = 0;
    signalRef.current.pointerY = 0;
  };

  const handleLaunch3DWorld = () => {
    const heroBtn = document.getElementById('hero-play-game-btn');
    if (heroBtn) {
      heroBtn.click();
    } else {
      launchGame();
    }
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      onPointerMove={handleSectionPointerMove}
      onPointerLeave={handleSectionPointerLeave}
      className="relative overflow-x-clip bg-[#080808] py-20 sm:py-28 text-white"
    >
      {/* Layer 1: Multi-Layer Parallax Atmospheric Environment */}
      <ProjectParallaxBackdrop
        signalRef={signalRef}
        introVisible={introInView}
        reducedMotion={reducedMotion}
      />

      {/* Layer 2: Single Shared R3F WebGL Depth Canvas */}
      <ProjectUniverseCanvas
        signalRef={signalRef}
        shouldMount={shouldMountCanvas}
        sectionActive={sectionActive}
        webglSupported={webglSupported}
        reducedMotion={reducedMotion}
      />

      {/* Custom Magnetic Desktop Project Cursor HUD */}
      <ProjectCursorHUD
        scopeRef={sectionRef}
        disabled={reducedMotion || Boolean(selectedProject)}
      />

      {/* Layer 3: Foreground Interactive Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Cinematic Section Intro Header */}
        <div className="relative text-center">
          {/* Horizontal Crimson Energy Laser Line */}
          <div className="mx-auto mb-7 h-[2px] max-w-2xl overflow-hidden rounded-full bg-white/5">
            <div
              className={`h-full w-full bg-gradient-to-r from-transparent via-[#FF3038] to-transparent shadow-[0_0_16px_rgba(255,48,56,0.9)] ${
                introInView ? 'pu-energy-line' : 'opacity-0'
              }`}
            />
          </div>

          {/* Character-by-character Reveal for "04. PROJECTS" */}
          <p
            aria-label={HEADING_EYEBROW}
            className="font-orbitron text-xs sm:text-sm font-semibold tracking-[0.32em] text-[#FF3038]"
          >
            {HEADING_EYEBROW.split('').map((ch, idx) => (
              <motion.span
                key={`${ch}-${idx}`}
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={introInView ? { opacity: 1, y: 0 } : undefined}
                transition={{
                  duration: 0.35,
                  delay: reducedMotion ? 0 : idx * 0.032,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block"
              >
                {ch === ' ' ? '\u00A0' : ch}
              </motion.span>
            ))}
          </p>

          {/* Upward Cinematic Reveal for "Featured Work" */}
          <div className="mt-3 overflow-hidden">
            <motion.h2
              initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 42 }}
              animate={introInView ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: 0.72,
                delay: reducedMotion ? 0 : 0.22,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="font-orbitron text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl"
            >
              Featured{' '}
              <span className="bg-gradient-to-r from-[#FF3038] to-[#C91520] bg-clip-text text-transparent">
                Work
              </span>
            </motion.h2>
          </div>

          {/* Subtitle Fade-in */}
          <motion.p
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
            animate={introInView ? { opacity: 1, y: 0 } : undefined}
            transition={{
              duration: 0.65,
              delay: reducedMotion ? 0 : 0.38,
            }}
            className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#A0A0A0] sm:text-base"
          >
            Production web applications, tax engines, AI knowledge hubs, and enterprise SaaS
            systems engineered for speed, scalability, and crisp user interaction.
          </motion.p>
        </div>

        {/* Center-Expanding Pinned Horizontal Showcase Container */}
        <motion.div
          initial={
            reducedMotion
              ? { opacity: 1, scaleX: 1 }
              : { opacity: 0, scaleX: 0.9, scaleY: 0.96 }
          }
          animate={
            introInView
              ? { opacity: 1, scaleX: 1, scaleY: 1 }
              : undefined
          }
          transition={{
            duration: 0.78,
            delay: reducedMotion ? 0 : 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-8 origin-center"
        >
          <PinnedProjectGallery
            projects={projectUniverseItems}
            onSelectProject={setSelectedProject}
            reducedMotion={reducedMotion}
            signalRef={signalRef}
          />
        </motion.div>

        {/* Individual 3D Floating Project Cards Grid Below Showcase */}
        <div className="mt-16 sm:mt-20">
          <div className="flex flex-col items-start justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end">
            <div>
              <p className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.22em] text-[#FF3038]">
                <Layers className="h-3.5 w-3.5" />
                SYSTEMS MATRIX
              </p>
              <h3 className="mt-1 font-orbitron text-xl font-bold text-white sm:text-2xl">
                Interactive Project Cards
              </h3>
            </div>

            {/* Category Filter Pills (Strictly Preserved Real Project Categories) */}
            <div className="flex flex-wrap gap-2">
              {uniqueCategories.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-lg border px-3 py-1.5 font-mono text-[11px] transition-all ${
                      active
                        ? 'border-[#FF3038] bg-[#FF3038]/20 text-white shadow-[0_0_14px_rgba(255,48,56,0.28)]'
                        : 'border-white/12 bg-white/[0.025] text-[#A0A0A0] hover:border-[#FF3038]/45 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGridProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.52,
                  delay: reducedMotion ? 0 : Math.min(idx * 0.06, 0.36),
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="h-full"
              >
                <ProjectHoloCard
                  project={project}
                  onSelect={setSelectedProject}
                  reducedMotion={reducedMotion}
                  variant="grid"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Preserved 3D Driving World Launch CTA */}
        <motion.div
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mt-16 sm:mt-20 rounded-2xl border border-[#FF3038]/30 bg-gradient-to-r from-[#FF3038]/12 via-[#100a0b] to-[#C91520]/12 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md"
        >
          <div className="text-center md:text-left">
            <h4 className="font-orbitron text-xl sm:text-2xl font-bold text-white">
              Drive Through Every Project Zone in 3D
            </h4>
            <p className="mt-1.5 text-sm text-[#A0A0A0] max-w-xl">
              Enter the interactive 3D world to physically drive up to each project building,
              explore the AI Intelligence Factory, and unlock live architecture panels.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLaunch3DWorld}
            className="shrink-0 inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-[#FF3038] to-[#C91520] px-6 py-3.5 font-orbitron text-xs sm:text-sm font-bold tracking-wider text-white shadow-lg shadow-red-600/30 transition-all hover:scale-[1.03] hover:shadow-red-500/45"
          >
            <Gamepad2 className="h-4 w-4" />
            ▶ LAUNCH 3D WORLD
          </button>
        </motion.div>
      </div>

      {/* Effect Five & Six: Cinematic Project Case Study Modal + Prev/Next Switching */}
      <CinematicProjectModal
        project={selectedProject}
        projects={projectUniverseItems}
        onClose={() => setSelectedProject(null)}
        onSelectProject={setSelectedProject}
        onLaunch3DWorld={handleLaunch3DWorld}
        reducedMotion={reducedMotion}
      />
    </section>
  );
};
