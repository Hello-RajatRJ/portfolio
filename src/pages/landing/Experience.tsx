import React, { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Briefcase, Calendar } from 'lucide-react';
import { experience } from '../../data/personalInfo';

interface ExperienceCardProps {
  exp: (typeof experience)[0];
  index: number;
  inView: boolean;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ exp, index, inView }) => {
  const isEven = index % 2 === 0;
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -y * 8, ry: x * 8 });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <div
      className={`relative flex flex-col md:flex-row items-center mb-12 sm:mb-16 ${
        isEven ? 'md:flex-row-reverse' : ''
      }`}
    >
      {/* 1. Center Glowing Timeline Node */}
      <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black border-2 border-[#E62429] shadow-[0_0_16px_#FF2D2D]">
        <div className="h-2.5 w-2.5 rounded-full bg-[#FF2D2D] animate-ping" />
      </div>

      {/* 2. Interactive 3D Card with Slash Reveal */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? 80 : -80 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{
          duration: 0.75,
          delay: 0.15 + index * 0.12,
          ease: [0.16, 1, 0.3, 1],
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
        className={`ml-12 md:ml-0 w-full md:w-[calc(50%-2.5rem)] dp-glow-box group relative rounded-2xl bg-[#0a0a0c]/90 p-5 sm:p-7 backdrop-blur-xl border border-[#E62429]/30 shadow-2xl`}
      >
        {/* Subtle Katana Slash Top Line */}
        <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-[#FF2D2D]/60 to-transparent" />

        {/* Header: Company & Dates */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 mb-4">
          <div>
            <span className="font-mono text-xs font-bold text-[#FF2D2D] tracking-wider uppercase flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5" />
              {exp.company}
            </span>
            <h3 className="mt-1 font-orbitron text-base sm:text-lg font-black text-white group-hover:text-[#FF2D2D] transition-colors">
              {exp.role}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-white/[0.04] border border-white/10 px-3 py-1 font-mono text-[10px] text-neutral-300">
            <Calendar className="h-3 w-3 text-[#E62429]" />
            <span>{exp.period}</span>
          </div>
        </div>

        {/* Bullet Achievements */}
        <ul className="space-y-2 text-xs sm:text-sm text-neutral-300">
          {exp.highlights?.map((hl, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E62429]" />
              <span className="leading-relaxed">{hl}</span>
            </li>
          ))}
        </ul>

        {/* Tech Stack Chips */}
        <div className="mt-5 flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
          {exp.tech?.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-white/10 bg-black/60 px-2 py-0.5 font-mono text-[10px] text-neutral-300 transition-colors group-hover:border-[#E62429]/50 group-hover:text-white"
            >
              {tech}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export const Experience: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  // Scrubbed Glowing Red Line that draws itself down on scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end center'],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative min-h-screen py-24 sm:py-32 bg-[#050505] overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="dp-halftone absolute inset-0 opacity-15 pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-[#E62429]/10 blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-[2px] w-8 bg-[#E62429]" />
            <span className="font-orbitron text-xs sm:text-sm font-bold tracking-[0.3em] text-[#E62429] uppercase">
              03 // BATTLE LOGS
            </span>
            <span className="h-[2px] w-8 bg-[#E62429]" />
          </div>

          <h2 className="font-orbitron text-3xl sm:text-5xl font-black text-white tracking-tight">
            WORK <span className="text-[#E62429] drop-shadow-[0_0_20px_rgba(230,36,41,0.6)]">HISTORY</span>
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-sm sm:text-base font-inter text-neutral-400">
            Proven commercial track record architecting high-availability platforms, tax compliance
            engines, and fluid reactive UI.
          </p>

          {/* Animated 4+ Years Commercial Badge */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 inline-flex items-center gap-3 rounded-full border border-[#FF2D2D]/60 bg-black/90 px-5 py-2 shadow-[0_0_25px_rgba(230,36,41,0.45)] backdrop-blur-md"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2D2D] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E62429]" />
            </span>
            <span className="font-orbitron text-xs sm:text-sm font-black tracking-wider text-white">
              <span className="text-[#FF2D2D]">4+ YEARS</span> COMMERCIAL TRACK RECORD
            </span>
            <span className="rounded bg-[#E62429]/25 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#FF2D2D] border border-[#E62429]/50">
              COMMERCIAL BATTLES
            </span>
          </motion.div>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Timeline Track (Muted Grey) */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-neutral-900" />

          {/* Animated Glowing Red Line Drawn on Scroll */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-4 md:left-1/2 top-0 w-[2px] -translate-x-1/2 bg-gradient-to-b from-[#8B0000] via-[#E62429] to-[#FF2D2D] shadow-[0_0_12px_#FF2D2D] origin-top"
          />

          {/* Experience Cards */}
          <div className="relative z-10 pt-4">
            {experience.map((exp, idx) => (
              <ExperienceCard key={exp.id || idx} exp={exp} index={idx} inView={inView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
