import React, { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { DeadpoolSkillOrb } from '../../components/skills/DeadpoolSkillOrb';
import { TechDetailModal } from '../../components/skills/TechDetailPanel';
import { findTechMeta, type TechMetadata } from '../../data/techRegistry';
import { skills as allSkills } from '../../data/personalInfo';
import type { PointerScreenState } from '../../components/skills/hoverMath';

const SKILL_GROUPS = [
  {
    code: '01',
    category: 'Frontend & UI Architecture',
    label: '// MODULES: FRONTEND & UI ARCHITECTURE (8)',
  },
  {
    code: '02',
    category: 'Backend, APIs & AI Systems',
    label: '// MODULES: BACKEND, APIS & AI SYSTEMS (5)',
  },
  {
    code: '03',
    category: 'Databases & Data Storage',
    label: '// MODULES: DATABASES & DATA STORAGE (3)',
  },
  {
    code: '04',
    category: 'Cloud, DevOps & Engineering Tools',
    label: '// MODULES: CLOUD, DEVOPS & ENGINEERING TOOLS (6)',
  },
  {
    code: '05',
    category: 'Core & Emerging Stack',
    label: '// MODULES: CORE & EMERGING STACK (5)',
  },
];

const ROW1_LOGOS = [
  'React 19', 'TypeScript', 'Node.js', 'Next.js', 'Three.js', 'PostgreSQL', 'Docker', 'Tailwind',
  'GSAP', 'WebGL', 'MongoDB', 'Vite',
];

const ROW2_LOGOS = [
  'Python', 'Spring Boot', 'GraphQL', 'Redis', 'Framer Motion', 'Linux', 'AWS', 'Git',
  'Jest', 'Figma', 'Turborepo', 'WebSockets',
];

export const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  const [selectedTech, setSelectedTech] = useState<TechMetadata | null>(null);
  const [selectedSkillName, setSelectedSkillName] = useState<string | null>(null);

  const pointerRef = useRef<PointerScreenState>({
    x: 0,
    y: 0,
    active: false,
    dragRotX: 0,
    dragRotY: 0,
    isDragging: false,
  });

  // Scroll speed-up for marquee
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const marqueeOffset1 = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const marqueeOffset2 = useTransform(scrollYProgress, [0, 1], ['-30%', '0%']);

  const handleSelectModule = (skillName: string) => {
    setSelectedSkillName(skillName);
    const meta = findTechMeta(skillName);
    setSelectedTech(meta);
  };

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative min-h-screen py-24 sm:py-32 bg-[#000000] overflow-hidden select-none"
    >
      {/* Background Ambience */}
      <div className="dp-halftone absolute inset-0 opacity-15 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#E62429]/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-[2px] w-8 bg-[#E62429]" />
            <span className="font-orbitron text-xs sm:text-sm font-bold tracking-[0.3em] text-[#E62429] uppercase">
              02 // WEAPONS OF CHOICE
            </span>
            <span className="h-[2px] w-8 bg-[#E62429]" />
          </div>

          <h2 className="font-orbitron text-3xl sm:text-5xl font-black text-white tracking-tight">
            TECH <span className="text-[#E62429] drop-shadow-[0_0_20px_rgba(230,36,41,0.6)]">ARSENAL</span>
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-xs sm:text-sm font-mono text-neutral-400">
            Click any module to inspect in 3D &bull; Self-assessed commercial proficiency
          </p>
        </div>

        {/* 1. Interactive 3D Skill Orb / Tech Sphere */}
        <div className="mb-14">
          <DeadpoolSkillOrb />
        </div>

        {/* 2. Five Categorized Skill Blocks (// MODULES naming style) flying in from alternating sides */}
        <div className="space-y-8 sm:space-y-10">
          {SKILL_GROUPS.map((group, groupIdx) => {
            const groupSkills = allSkills.filter((s) => s.category === group.category);
            const isEven = groupIdx % 2 === 0;

            return (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, x: isEven ? -60 : 60 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.7,
                  delay: 0.15 + groupIdx * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="dp-glow-box group relative rounded-2xl bg-[#0a0a0c]/90 p-5 sm:p-7 backdrop-blur-xl border border-white/10"
              >
                {/* Category Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 mb-5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-orbitron text-sm font-black text-[#FF2D2D]">
                      {group.code}
                    </span>
                    <h3 className="font-orbitron text-sm sm:text-base font-bold text-white tracking-wider">
                      {group.label}
                    </h3>
                  </div>
                  <span className="font-mono text-[10px] text-[#9CA3AF] uppercase">
                    CLICK TO INSPECT IN 3D
                  </span>
                </div>

                {/* Modules Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {groupSkills.map((item) => {
                    const isSelected = selectedSkillName === item.name;

                    return (
                      <div
                        key={item.name}
                        onClick={() => handleSelectModule(item.name)}
                        className={`group/item relative rounded-xl p-3 bg-black/60 border cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'border-[#FF2D2D] ring-2 ring-[#FF2D2D] shadow-[0_0_18px_rgba(255,45,45,0.6)]'
                            : 'border-white/10 hover:border-[#E62429] hover:bg-[#E62429]/10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="flex items-center gap-1.5 font-orbitron text-xs font-bold text-white group-hover/item:text-[#FF2D2D] transition-colors">
                            <span>{item.icon}</span>
                            <span>{item.name}</span>
                          </span>
                          <span className="font-mono text-xs font-bold text-[#FF2D2D]">
                            {item.level}%
                          </span>
                        </div>

                        {/* Animated Progress Bar */}
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-900 border border-white/5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={inView ? { width: `${item.level}%` } : { width: 0 }}
                            transition={{
                              duration: 1.1,
                              delay: 0.35 + groupIdx * 0.08,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className="h-full bg-gradient-to-r from-[#8B0000] via-[#E62429] to-[#FF2D2D] shadow-[0_0_8px_#FF2D2D]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 3. Dual-Row Tech Logo Marquee */}
        <div className="mt-20 overflow-hidden py-4 border-y border-[#E62429]/25 bg-black/50 backdrop-blur-md">
          {/* Row 1: Left */}
          <motion.div
            style={{ x: marqueeOffset1 }}
            className="flex whitespace-nowrap gap-6 mb-3 select-none"
          >
            {[...ROW1_LOGOS, ...ROW1_LOGOS, ...ROW1_LOGOS].map((logo, i) => (
              <span
                key={`${logo}-${i}`}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] font-orbitron text-xs sm:text-sm font-semibold tracking-wider text-neutral-300 hover:border-[#E62429] hover:text-white transition-colors"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#E62429]" />
                {logo}
              </span>
            ))}
          </motion.div>

          {/* Row 2: Right */}
          <motion.div
            style={{ x: marqueeOffset2 }}
            className="flex whitespace-nowrap gap-6 select-none"
          >
            {[...ROW2_LOGOS, ...ROW2_LOGOS, ...ROW2_LOGOS].map((logo, i) => (
              <span
                key={`${logo}-${i}`}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] font-orbitron text-xs sm:text-sm font-semibold tracking-wider text-neutral-300 hover:border-[#FF2D2D] hover:text-white transition-colors"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF2D2D]" />
                {logo}
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
