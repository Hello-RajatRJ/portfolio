import React, { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Globe, MapPin, Briefcase, CheckCircle2, Cpu } from 'lucide-react';
import { personal } from '../../data/personalInfo';

const COUNTRIES_SERVED = [
  { name: 'Australia', flag: '🇦🇺' },
  { name: 'Taiwan', flag: '🇹🇼' },
  { name: 'USA', flag: '🇺🇸' },
  { name: 'India', flag: '🇮🇳' },
  { name: 'Armenia', flag: '🇦🇲' },
];

const QUICK_FACTS = [
  { label: 'Location', value: 'India', icon: MapPin },
  { label: 'Experience', value: '4+ Years', icon: Briefcase },
  { label: 'Status', value: 'Open to Work', icon: CheckCircle2, isStatus: true },
  { label: 'Focus', value: 'Full-Stack + 3D Web', icon: Cpu },
];

export const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  // Giant Outlined Background Text moving horizontally against scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const backgroundX = useTransform(scrollYProgress, [0, 1], ['12%', '-22%']);

  // Vanilla 3D tilt tracking for Photo Card
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [isGlitching, setIsGlitching] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: -y * 14,
      ry: x * 14,
    });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  // Real word-by-word reveal text
  const bioWords = [
    'I', 'am', 'a', 'passionate', 'full-stack', 'developer,', 'UI', 'architect,', 'and', '3D', 'web', 'engineer',
    'dedicated', 'to', 'building', 'immersive,', 'high-performance', 'web', 'experiences', 'that', 'push', 'boundaries.',
    'My', 'entire', 'portfolio', 'is', 'an', 'interactive', '3D', 'world', 'you', 'can', 'physically', 'drive', 'through,',
    'exploring', 'real-world', 'production', 'systems', 'engineered', 'for', 'clients', 'across', 'the', 'globe.',
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen py-24 sm:py-32 bg-[#050505] overflow-hidden select-none"
    >
      {/* 1. Giant Outlined "ABOUT" Background Moving in Reverse Scroll Parallax */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 pointer-events-none select-none z-0 overflow-hidden">
        <motion.div
          style={{ x: backgroundX }}
          className="dp-watermark-text text-[24vw] tracking-tighter opacity-15"
        >
          ABOUT ABOUT ABOUT
        </motion.div>
      </div>

      {/* Halftone Ambient Accent */}
      <div className="dp-halftone absolute inset-0 opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-[2px] w-8 bg-[#E62429]" />
            <span className="font-orbitron text-xs sm:text-sm font-bold tracking-[0.3em] text-[#E62429] uppercase">
              01 // THE MAN BEHIND THE MASK
            </span>
            <span className="h-[2px] w-8 bg-[#E62429]" />
          </div>

          <h2 className="font-orbitron text-3xl sm:text-5xl font-black text-white tracking-tight">
            WHO I <span className="text-[#E62429] drop-shadow-[0_0_18px_rgba(230,36,41,0.6)]">AM</span>
          </h2>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Mask-framed Photo with 3D Tilt, Glitch & Comic Speech Bubble */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-sm">
              {/* Comic Speech Bubble */}
              <motion.div
                initial={{ opacity: 0, y: 15, rotate: -6 }}
                animate={inView ? { opacity: 1, y: 0, rotate: -3 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="dp-speech-bubble absolute -top-8 -right-4 sm:-right-8 z-30 px-3.5 py-1.5 rounded-xl text-center pointer-events-none"
              >
                <span className="font-bangers text-sm sm:text-base text-black">
                  Yes, he can code AND look this good.
                </span>
              </motion.div>

              {/* Offset Red Border Frame */}
              <div className="absolute -inset-2.5 rounded-3xl border-2 border-[#E62429]/80 shadow-[0_0_30px_rgba(230,36,41,0.4)] pointer-events-none transform -rotate-2" />

              {/* 3D Tilt Photo Card Container */}
              <div
                ref={cardRef}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                onMouseEnter={() => setIsGlitching(true)}
                onMouseLeave={() => setIsGlitching(false)}
                style={{
                  transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                  transition: 'transform 0.15s ease-out',
                }}
                className="relative overflow-hidden rounded-2xl bg-black border border-white/10 p-2 shadow-2xl cursor-pointer group"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-neutral-900">
                  <img
                    src="/myimage.png"
                    alt={personal.name}
                    className={`h-full w-full object-cover object-top transition-all duration-300 ${
                      isGlitching
                        ? 'scale-105 contrast-125 saturate-125 filter drop-shadow-[-3px_0_0_#00FFFF] drop-shadow-[3px_0_0_#FF2D2D]'
                        : 'grayscale-[15%]'
                    }`}
                  />

                  {/* Gradient bottom shadow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-85" />

                  {/* Name Badge Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-left">
                    <span className="font-orbitron text-lg font-black text-white block">
                      {personal.name}
                    </span>
                    <span className="font-mono text-xs text-[#FF2D2D] font-bold">
                      Full-Stack Developer · UI Architect · 3D Creator
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Word-by-Word Scroll Text Reveal & Quick Facts & Country Flags */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h3 className="font-orbitron text-2xl sm:text-3xl font-black text-white leading-snug">
              Passionate developer bridging robust backend systems with{' '}
              <span className="text-[#FF2D2D] drop-shadow-[0_0_12px_#E62429]">
                interactive 3D UX.
              </span>
            </h3>

            {/* Word-by-Word Scroll Text Reveal */}
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-neutral-300 flex flex-wrap gap-x-1.5 gap-y-0.5">
              {bioWords.map((word, idx) => (
                <motion.span
                  key={`${word}-${idx}`}
                  initial={{ opacity: 0.15, y: 6 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.35, delay: 0.2 + idx * 0.02 }}
                  className={
                    word.includes('3D') || word.includes('full-stack') || word.includes('drive')
                      ? 'text-[#FF2D2D] font-bold'
                      : 'text-neutral-300'
                  }
                >
                  {word}
                </motion.span>
              ))}
            </p>

            {/* Quick-Fact Cards (Location, Experience, Status, Focus) */}
            <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {QUICK_FACTS.map((fact, idx) => {
                const Icon = fact.icon;
                return (
                  <motion.div
                    key={fact.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4 + idx * 0.08, duration: 0.5 }}
                    className="dp-glow-box rounded-xl bg-black/80 p-3.5 border border-white/10 backdrop-blur-md"
                  >
                    <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                      <Icon className="h-3.5 w-3.5 text-[#E62429]" />
                      <span className="font-mono text-[10px] uppercase">{fact.label}</span>
                    </div>
                    <div className="font-orbitron text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                      {fact.isStatus && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-r from-emerald-400 to-[#FF2D2D]" />
                        </span>
                      )}
                      <span>{fact.value}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Row of Country Flags/Labels Popping in (Australia, Taiwan, USA, India, Armenia) */}
            <div className="mt-8 pt-5 border-t border-white/10">
              <span className="font-mono text-[11px] font-bold tracking-widest text-[#9CA3AF] uppercase block mb-3 flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-[#E62429]" />
                GLOBAL CLIENT FOOTPRINT &bull; 5+ COUNTRIES SERVED
              </span>

              <div className="flex flex-wrap items-center gap-2.5">
                {COUNTRIES_SERVED.map((c, idx) => (
                  <motion.div
                    key={c.name}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.55 + idx * 0.08, type: 'spring', stiffness: 300, damping: 20 }}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-3 py-1.5 font-orbitron text-xs font-semibold text-white shadow-sm hover:border-[#E62429] hover:bg-[#E62429]/15 transition-colors cursor-default"
                  >
                    <span className="text-base">{c.flag}</span>
                    <span>{c.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
