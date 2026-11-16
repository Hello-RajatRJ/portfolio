import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { RotateCcw, Sparkles } from 'lucide-react';
import { TechDetailModal } from '../../components/skills/TechDetailPanel';
import { findTechMeta, type TechMetadata } from '../../data/techRegistry';
import { skills as allSkills } from '../../data/personalInfo';
import type { PointerScreenState } from '../../components/skills/hoverMath';

const SKILL_GROUPS = [
  {
    code: '01',
    category: 'Frontend',
    label: 'FRONTEND & UI ARCHITECTURE',
  },
  {
    code: '02',
    category: 'Backend',
    label: 'BACKEND & REST / GRAPHQL APIS',
  },
  {
    code: '03',
    category: 'Database',
    label: 'DATABASES & DATA STORAGE',
  },
  {
    code: '04',
    category: 'DevOps & Tools',
    label: 'CLOUD, DEVOPS & TOOLING',
  },
  {
    code: '05',
    category: '3D & Animation',
    label: '3D WEB & INTERACTION DYNAMICS',
  },
];

const MARQUEE_TECH = [
  'React 19', 'Next.js', 'TypeScript', 'Node.js', 'React-Admin', 'PostgreSQL',
  'Three.js', 'Tailwind CSS', 'Docker', 'AWS', 'GraphQL', 'MongoDB',
  'GSAP', 'WebGL', 'Redis', 'CI/CD Pipelines',
];

const STICKER_CHIPS = [
  { name: 'React 19', icon: '⚛️', color: 'border-cyan-500/70 bg-cyan-950/40 text-cyan-200', rot: -4 },
  { name: 'TypeScript', icon: '🔷', color: 'border-blue-500/70 bg-blue-950/40 text-blue-200', rot: 3 },
  { name: 'Node.js', icon: '🟢', color: 'border-emerald-500/70 bg-emerald-950/40 text-emerald-200', rot: -2 },
  { name: 'Next.js', icon: '▲', color: 'border-neutral-400/70 bg-neutral-900/60 text-white', rot: 5 },
  { name: 'React-Admin', icon: '⚡', color: 'border-amber-500/70 bg-amber-950/40 text-amber-200', rot: -3 },
  { name: 'PostgreSQL', icon: '🐘', color: 'border-sky-500/70 bg-sky-950/40 text-sky-200', rot: 4 },
  { name: 'Three.js', icon: '🧊', color: 'border-[#FF2D2D]/70 bg-red-950/40 text-red-200', rot: -5 },
  { name: 'Docker', icon: '🐳', color: 'border-blue-400/70 bg-blue-950/30 text-blue-200', rot: 2 },
  { name: 'Tailwind CSS', icon: '💨', color: 'border-teal-400/70 bg-teal-950/40 text-teal-200', rot: -6 },
  { name: 'AWS Cloud', icon: '☁️', color: 'border-orange-500/70 bg-orange-950/40 text-orange-200', rot: 3 },
];

export const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stickerConstraintsRef = useRef<HTMLDivElement>(null);

  const [selectedTech, setSelectedTech] = useState<TechMetadata | null>(null);
  const [selectedSkillName, setSelectedSkillName] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);

  const pointerRef = useRef<PointerScreenState>({
    x: 0,
    y: 0,
    active: false,
    dragRotX: 0,
    dragRotY: 0,
    isDragging: false,
  });

  // Single slow, restrained marquee
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const marqueeOffset = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);

  const handleSelectModule = (skillName: string) => {
    setSelectedSkillName(skillName);
    const meta = findTechMeta(skillName);
    setSelectedTech(meta);
  };

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative min-h-screen py-24 sm:py-32 bg-[#050505] overflow-hidden select-none border-t border-white/[0.04]"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-[#E62429]/05 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-[1px] w-6 bg-[#E62429]" />
            <span className="font-mono text-xs font-semibold tracking-[0.25em] text-[#E62429] uppercase">
              02 // TECHNICAL ARSENAL
            </span>
            <span className="h-[1px] w-6 bg-[#E62429]" />
          </div>

          <h2 className="font-orbitron text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            PRODUCTION <span className="text-[#E62429]">TOOLKIT</span>
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-xs sm:text-sm font-mono text-neutral-400">
            Engineered with strict types, verified architectures, and zero vanity metrics.
          </p>
        </div>

        {/* 1. Draggable Sticker-Style Chips with Reset Button */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="font-mono text-xs uppercase tracking-wider text-neutral-300 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF2D2D] animate-ping" />
              <span>INTERACTIVE STICKER BOARD</span>
            </span>
            <button
              onClick={() => setResetKey((k) => k + 1)}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-[#0D0D0D] px-2.5 py-1 font-mono text-[11px] text-neutral-400 hover:text-white hover:border-[#E62429] transition-colors cursor-pointer"
              title="Reset sticker positions"
            >
              <RotateCcw className="h-3 w-3 text-[#FF2D2D]" />
              <span>Reset</span>
            </button>
          </div>

          <div
            ref={stickerConstraintsRef}
            key={resetKey}
            className="relative min-h-[160px] sm:min-h-[180px] w-full rounded-xl border border-white/10 bg-[#0D0D0D]/90 p-5 sm:p-6 backdrop-blur-xl overflow-hidden flex flex-wrap items-center justify-center gap-3 sm:gap-4 select-none shadow-xl"
          >
            {STICKER_CHIPS.map((stk) => (
              <motion.div
                key={`${stk.name}-${resetKey}`}
                drag
                dragConstraints={stickerConstraintsRef}
                dragElastic={0.15}
                whileHover={{ scale: 1.06, zIndex: 30 }}
                whileDrag={{ scale: 1.12, rotate: 0, zIndex: 50, cursor: 'grabbing' }}
                onClick={() => handleSelectModule(stk.name)}
                style={{ rotate: stk.rot }}
                className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-1.5 font-mono text-xs sm:text-sm font-semibold shadow-md cursor-grab transition-shadow active:shadow-lg backdrop-blur-md ${stk.color}`}
              >
                <span>{stk.icon}</span>
                <span>{stk.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 2. Five Categorized Skill Blocks (No Fake Percentages) */}
        <div className="space-y-6 sm:space-y-8">
          {SKILL_GROUPS.map((group) => {
            const groupSkills = allSkills.filter((s) => s.category === group.category);

            return (
              <div
                key={group.category}
                className="relative rounded-xl bg-[#0D0D0D] p-5 sm:p-6 border border-white/10"
              >
                {/* Category Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="font-orbitron text-xs sm:text-sm font-black text-[#FF2D2D]">
                      {group.code}
                    </span>
                    <h3 className="font-orbitron text-xs sm:text-sm font-bold text-white tracking-wider uppercase">
                      {group.label}
                    </h3>
                  </div>
                  <span className="font-mono text-[10px] text-neutral-400 uppercase flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-[#FF2D2D]" />
                    Click to inspect 3D node
                  </span>
                </div>

                {/* Modules Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {groupSkills.map((item) => {
                    const isSelected = selectedSkillName === item.name;

                    return (
                      <button
                        key={item.name}
                        onClick={() => handleSelectModule(item.name)}
                        className={`text-left rounded-lg p-3 bg-[#050505] border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'border-[#FF2D2D] ring-1 ring-[#FF2D2D] shadow-[0_0_12px_rgba(255,45,45,0.4)]'
                            : 'border-white/10 hover:border-[#E62429] hover:bg-[#E62429]/05'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{item.icon}</span>
                          <span className="font-orbitron text-xs sm:text-sm font-semibold text-neutral-200 group-hover:text-white">
                            {item.name}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. Single Slow Elegant Tech Marquee */}
        <div className="mt-16 overflow-hidden py-3.5 border-y border-white/10 bg-[#0D0D0D]/60 backdrop-blur-md">
          <motion.div
            style={{ x: marqueeOffset }}
            className="flex whitespace-nowrap gap-6 select-none"
          >
            {[...MARQUEE_TECH, ...MARQUEE_TECH, ...MARQUEE_TECH].map((tech, i) => (
              <span
                key={`${tech}-${i}`}
                className="inline-flex items-center gap-2 px-3 py-1 font-mono text-xs sm:text-sm text-neutral-300 uppercase tracking-wider"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#E62429]" />
                {tech}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Tech 3D Inspection Detail Modal */}
      {selectedTech && (
        <TechDetailModal
          tech={selectedTech}
          pointerRef={pointerRef}
          webglEnabled={true}
          onSelectTech={(next) => {
            setSelectedTech(next);
            setSelectedSkillName(next.name);
          }}
          onClose={() => {
            setSelectedTech(null);
            setSelectedSkillName(null);
          }}
        />
      )}
    </section>
  );
};
