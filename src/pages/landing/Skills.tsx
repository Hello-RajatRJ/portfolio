import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Zap } from 'lucide-react';
import { skills } from '../../data/personalInfo';
import { findTechMeta, type TechMetadata } from '../../data/techRegistry';
import { CanvasErrorBoundary } from '../../components/CanvasErrorBoundary';
import { TechIconGroup } from '../../components/skills/TechIconGroup';
import { TechDetailModal } from '../../components/skills/TechDetailPanel';
import { TechCategory } from '../../components/skills/TechCategory';
import { AmbientParticleField } from '../../components/skills/AmbientParticleField';
import type { PointerScreenState } from '../../components/skills/hoverMath';
import '../../components/skills/skillsEffects.css';

// Extract unique categories directly from the existing skills array
const categories = Array.from(new Set(skills.map((s) => s.category)));

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/* ─── Animation Variants ─── */
const sectionHeader = {
  hidden: { opacity: 0, y: 40, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export const TechArsenalSection: React.FC = () => {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const slotElementsRef = useRef<Record<string, HTMLDivElement | null>>({});
  const scanTimestampsRef = useRef<Record<string, number>>({});
  const pointerRef = useRef<PointerScreenState>({
    x: 0,
    y: 0,
    active: false,
    dragRotX: 0,
    dragRotY: 0,
    isDragging: false,
  });

  const [hoveredSkillName, setHoveredSkillName] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<TechMetadata | null>(null);
  const [replayKey, setReplayKey] = useState(0);
  const [shouldMountCanvas, setShouldMountCanvas] = useState(false);
  const [sectionActive, setSectionActive] = useState(false);
  const [webglReady, setWebglReady] = useState(false);
  const [webglFailed, setWebglFailed] = useState(() => !checkWebGLSupport());
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  // Respect OS prefers-reduced-motion live
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Pause 3D render loop & particle animation when scrolled outside viewport or tab hidden
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let tabVisible = !document.hidden;
    let inRange = false;

    const syncActive = () => {
      setSectionActive(tabVisible && inRange);
    };

    const mountObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldMountCanvas(true);
        }
      },
      { rootMargin: '550px 0px' }
    );
    mountObserver.observe(el);

    const activeObserver = new IntersectionObserver(
      (entries) => {
        inRange = Boolean(entries[0]?.isIntersecting);
        if (inRange) setShouldMountCanvas(true);
        syncActive();
      },
      { rootMargin: '120px 0px' }
    );
    activeObserver.observe(el);

    const onVisibility = () => {
      tabVisible = !document.hidden;
      syncActive();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      mountObserver.disconnect();
      activeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  // Shared lightweight pointer tracking (zero React re-renders during movement)
  useEffect(() => {
    if (!sectionActive && !selectedTech) return;

    const handlePointerMove = (e: PointerEvent) => {
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;
      pointerRef.current.active = true;
    };
    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, [sectionActive, selectedTech]);

  const handleHoverChange = (skillName: string, hovered: boolean) => {
    if (hovered) {
      setHoveredSkillName(skillName);
    } else {
      setHoveredSkillName((prev) => (prev === skillName ? null : prev));
    }
  };

  const handleSelectSkill = (skillName: string) => {
    setShouldMountCanvas(true);
    setSelectedTech(findTechMeta(skillName));
  };

  const showLiveWebGL = shouldMountCanvas && !webglFailed;

  return (
    <section
      id="skills"
      ref={ref}
      className="py-20 sm:py-32 bg-[#080808] relative overflow-hidden"
    >
      {/* Effect Five: Ambient Particle Universe strictly behind all categories & modules */}
      <AmbientParticleField
        sectionRef={ref}
        pointerRef={pointerRef}
        active={sectionActive}
        reducedMotion={reducedMotion}
      />

      {/* Subtle ambient crimson glow behind command center header */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,48,56,0.06), transparent 70%)' }}
      />

      {/* Effect Three: Single Shared WebGL Canvas for all Floating 3D Technology Objects */}
      {showLiveWebGL && (
        <div
          className={`fixed inset-0 pointer-events-none ${selectedTech ? 'z-[108]' : 'z-30'}`}
          aria-hidden="true"
        >
          <CanvasErrorBoundary fallback={null}>
            <Canvas
              frameloop={sectionActive || selectedTech ? 'always' : 'demand'}
              camera={{ position: [0, 0, 24], fov: 24, near: 0.1, far: 100 }}
              dpr={[1, 1.5]}
              gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
              onCreated={({ gl }) => {
                gl.setClearColor(0x000000, 0);
                setWebglReady(true);
                gl.domElement.addEventListener('webglcontextlost', (e) => {
                  e.preventDefault();
                  setWebglFailed(true);
                  setWebglReady(false);
                });
              }}
              style={{ width: '100%', height: '100%', background: 'transparent' }}
            >
              <TechIconGroup
                skillsList={skills}
                slotElementsRef={slotElementsRef}
                scanTimestampsRef={scanTimestampsRef}
                pointerRef={pointerRef}
                hoveredSkillName={hoveredSkillName}
                selectedTech={selectedTech}
                sectionActive={sectionActive}
                reducedMotion={reducedMotion}
              />
            </Canvas>
          </CanvasErrorBoundary>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={sectionHeader}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-14"
        >
          <p className="font-orbitron text-[#FF3038] text-sm tracking-[0.3em] mb-3">
            02. SKILLS
          </p>
          <h2 className="font-orbitron text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
            Tech{' '}
            <span className="bg-gradient-to-r from-[#FF3038] to-[#C91520] bg-clip-text text-transparent">
              Arsenal
            </span>
          </h2>

          {/* Subtle command bar: self-assessed clarity + explicit recharge trigger */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="font-inter text-xs text-[#A0A0A0]">
              Self-assessed proficiency indicators &bull; Click any module to inspect in 3D
            </span>
            <button
              type="button"
              onClick={() => setReplayKey((k) => k + 1)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.025] border border-white/[0.12] hover:border-[#FF3038] text-[10px] font-orbitron tracking-wider text-[#A0A0A0] hover:text-white transition-colors"
            >
              <Zap size={11} className="text-[#FF3038]" />
              <span>RECHARGE</span>
            </button>
          </div>
        </motion.div>

        {categories.map((cat, catIdx) => (
          <TechCategory
            key={cat}
            category={cat}
            categoryIndex={catIdx}
            skillsInCategory={skills.filter((s) => s.category === cat)}
            replayKey={replayKey}
            reducedMotion={reducedMotion}
            webglReady={webglReady}
            webglFailed={webglFailed}
            hoveredSkillName={hoveredSkillName}
            slotElementsRef={slotElementsRef}
            scanTimestampsRef={scanTimestampsRef}
            onHoverChange={handleHoverChange}
            onSelectSkill={handleSelectSkill}
          />
        ))}
      </div>

      {/* Effect Four: Click-to-Expand Holographic Technology Details Modal */}
      <TechDetailModal
        tech={selectedTech}
        pointerRef={pointerRef}
        webglEnabled={!webglFailed && webglReady}
        onSelectTech={(next) => setSelectedTech(next)}
        onClose={() => setSelectedTech(null)}
      />
    </section>
  );
};

export { TechArsenalSection as Skills };
