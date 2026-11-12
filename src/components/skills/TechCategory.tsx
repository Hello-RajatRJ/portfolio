import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TechSkillCard, type SkillEntry } from './TechSkillCard';

interface TechCategoryProps {
  category: string;
  categoryIndex: number;
  skillsInCategory: SkillEntry[];
  replayKey: number;
  reducedMotion: boolean;
  webglReady: boolean;
  webglFailed: boolean;
  hoveredSkillName: string | null;
  slotElementsRef: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  scanTimestampsRef: React.MutableRefObject<Record<string, number>>;
  onHoverChange: (skillName: string, hovered: boolean) => void;
  onSelectSkill: (skillName: string) => void;
}

const categoryTitle = {
  hidden: { opacity: 0, x: -24, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export const TechCategory: React.FC<TechCategoryProps> = ({
  category,
  categoryIndex,
  skillsInCategory,
  replayKey,
  reducedMotion,
  webglReady,
  webglFailed,
  hoveredSkillName,
  slotElementsRef,
  scanTimestampsRef,
  onHoverChange,
  onSelectSkill,
}) => {
  const catRef = useRef<HTMLDivElement | null>(null);
  // Trigger energy charging & entrance once per category when entering viewport
  const categoryInView = useInView(catRef, { once: true, amount: 0.14 });

  return (
    <motion.div
      ref={catRef}
      initial="hidden"
      animate={categoryInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.055,
            delayChildren: Math.min(categoryIndex * 0.04, 0.18),
          },
        },
      }}
      className="mb-12"
    >
      <motion.div
        variants={categoryTitle}
        className="mb-6 flex flex-wrap items-center justify-between gap-2"
      >
        <h3 className="font-orbitron text-sm tracking-widest flex items-center gap-3 text-[#FF3038]">
          <motion.span
            initial={{ width: 0 }}
            animate={categoryInView ? { width: 32 } : { width: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="h-px inline-block bg-gradient-to-r from-[#C91520] to-[#FF3038]"
          />
          <span className="font-mono text-xs text-white/40">
            {String(categoryIndex + 1).padStart(2, '0')} //
          </span>
          <span>{category.toUpperCase()}</span>
        </h3>
        <span className="font-mono text-[10px] tracking-[0.2em] text-[#A0A0A0] uppercase">
          {skillsInCategory.length} {skillsInCategory.length === 1 ? 'MODULE' : 'MODULES'}
        </span>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {skillsInCategory.map((skill, idx) => (
          <TechSkillCard
            key={skill.name}
            skill={skill}
            cardIndex={idx}
            categoryVisible={categoryInView}
            replayKey={replayKey}
            reducedMotion={reducedMotion}
            webglReady={webglReady}
            webglFailed={webglFailed}
            isHovered={hoveredSkillName === skill.name}
            slotElementsRef={slotElementsRef}
            scanTimestampsRef={scanTimestampsRef}
            onHoverChange={onHoverChange}
            onSelect={onSelectSkill}
          />
        ))}
      </div>
    </motion.div>
  );
};

