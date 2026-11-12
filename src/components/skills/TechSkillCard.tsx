import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { findTechMeta } from '../../data/techRegistry';
import { TechFallbackIcon } from './TechFallbackIcon';
import { LaserScanEffect } from './LaserScanEffect';
import { EnergyProgressBar } from './EnergyProgressBar';
import { useEnergyCharge } from './useEnergyCharge';

export interface SkillEntry {
  name: string;
  level: number;
  category: string;
  icon: string;
}

interface TechSkillCardProps {
  skill: SkillEntry;
  cardIndex: number;
  categoryVisible: boolean;
  replayKey: number;
  reducedMotion: boolean;
  webglReady: boolean;
  webglFailed: boolean;
  isHovered: boolean;
  slotElementsRef: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  scanTimestampsRef: React.MutableRefObject<Record<string, number>>;
  onHoverChange: (skillName: string, hovered: boolean) => void;
  onSelect: (skillName: string) => void;
}

const cardVariant = {
  hidden: { opacity: 0, y: 26, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 220, damping: 20 },
  },
};

export const TechSkillCard: React.FC<TechSkillCardProps> = ({
  skill,
  cardIndex,
  categoryVisible,
  replayKey,
  reducedMotion,
  webglReady,
  webglFailed,
  isHovered,
  slotElementsRef,
  scanTimestampsRef,
  onHoverChange,
  onSelect,
}) => {
  const techMeta = findTechMeta(skill.name);
  const charge = useEnergyCharge(
    skill.level,
    categoryVisible,
    cardIndex * 85,
    replayKey,
    reducedMotion
  );
  const [tapped, setTapped] = useState(false);
  const tapTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (tapTimerRef.current !== null) {
        clearTimeout(tapTimerRef.current);
      }
    };
  }, []);

  const triggerScanPulse = () => {
    scanTimestampsRef.current[skill.name] = performance.now();
  };

  const handleEnter = () => {
    triggerScanPulse();
    onHoverChange(skill.name, true);
  };

  const handleLeave = () => {
    onHoverChange(skill.name, false);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') {
      triggerScanPulse();
      setTapped(true);
      if (tapTimerRef.current !== null) clearTimeout(tapTimerRef.current);
      tapTimerRef.current = window.setTimeout(() => setTapped(false), 780);
    }
  };

  return (
    <motion.div variants={cardVariant} className="h-full">
      <div
        role="button"
        tabIndex={0}
        aria-label={`Inspect ${skill.name} in 3D (${skill.level}% self-assessed proficiency)`}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onFocus={handleEnter}
        onBlur={handleLeave}
        onPointerDown={handlePointerDown}
        onClick={() => onSelect(skill.name)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(skill.name);
          }
        }}
        className={`tech-skill-card group rounded-xl p-4 h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3038]/80 cursor-pointer ${
          tapped ? 'is-tapped' : ''
        }`}
      >
        {/* Effect One: Left-to-Right Red Laser Hover Scanning Overlay */}
        <LaserScanEffect />

        <div className="relative z-[3] flex items-center justify-between mb-3 gap-2">
          <div className="flex items-center gap-3 min-w-0">
            {/* Effect Three: 3D Floating & Rotating Technology Artifact Anchor Slot */}
            <div
              ref={(el) => {
                slotElementsRef.current[skill.name] = el;
              }}
              className="relative w-11 h-11 shrink-0 flex items-center justify-center rounded-lg"
              style={{ perspective: 400 }}
            >
              {/* Subtle crimson telemetry pedestal beneath floating 3D object */}
              <div
                className="absolute inset-0 rounded-full transition-all duration-300 pointer-events-none"
                style={{
                  background: isHovered
                    ? 'radial-gradient(circle, rgba(255,48,56,0.32) 0%, rgba(201,21,32,0.08) 55%, transparent 75%)'
                    : 'radial-gradient(circle, rgba(255,48,56,0.12) 0%, transparent 72%)',
                  transform: isHovered ? 'scale(1.18)' : 'scale(1)',
                }}
              />

              {/* Graceful SVG fallback before WebGL hydrates or when WebGL unavailable */}
              <div
                className={`w-8 h-8 transition-all duration-300 ${
                  webglReady && !webglFailed
                    ? 'opacity-0 pointer-events-none'
                    : 'opacity-100 group-hover:scale-110 group-hover:-translate-y-0.5'
                }`}
              >
                <TechFallbackIcon tech={techMeta} />
              </div>
            </div>

            <span className="font-inter text-white text-sm font-bold truncate">
              {skill.name}
            </span>
          </div>

          {/* Self-assessed counting percentage */}
          <span
            title="Self-assessed proficiency indicator"
            className="font-orbitron text-xs font-bold tabular-nums shrink-0 transition-colors duration-300"
            style={{ color: isHovered ? '#FFFFFF' : '#FF3038' }}
          >
            {charge.percent}%
          </span>
        </div>

        {/* Effect Two: Futuristic Energy-Charging Progress Bar */}
        <div className="relative z-[3]">
          <EnergyProgressBar targetLevel={skill.level} charge={charge} isHovered={isHovered} />
        </div>
      </div>
    </motion.div>
  );
};
