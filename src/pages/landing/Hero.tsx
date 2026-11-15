import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Gamepad2, Sparkles } from 'lucide-react';
import { scrollToTarget } from '../../hooks/useLenisScroll';
import { useStore } from '../../store/useStore';

const HERO_ROLES = [
  'Full-Stack Developer',
  'UI Architect',
  '3D Web Engineer',
  'Problem Slayer',
];

const HERO_TECH_CHIPS = [
  { name: 'React 19', badge: 'Frontend' },
  { name: 'TypeScript', badge: 'Strict' },
  { name: 'Node.js', badge: 'Backend' },
  { name: 'Python', badge: 'AI & Data' },
  { name: 'AWS / Azure', badge: 'Cloud' },
  { name: 'Gemini AI', badge: 'LLMs' },
];

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const launchGame = useStore((s) => s.launchGame);

  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [statsCounted, setStatsCounted] = useState(false);

  // Mouse Parallax Offsets
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Scroll Progress across 200vh
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Scroll-linked transforms
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const textSplitLeft = useTransform(scrollYProgress, [0, 0.8], ['0%', '-38%']);
  const textSplitRight = useTransform(scrollYProgress, [0, 0.8], ['0%', '38%']);
  const foregroundY = useTransform(scrollYProgress, [0, 1], ['0%', '-45%']);
  const foregroundOpacity = useTransform(scrollYProgress, [0, 0.75, 0.95], [1, 0.85, 0]);
  const chipsDrift = useTransform(scrollYProgress, [0, 1], ['0px', '-90px']);
  const slashWipeScale = useTransform(scrollYProgress, [0.65, 0.98], [0, 1.4]);
  const slashWipeOpacity = useTransform(scrollYProgress, [0.65, 0.9, 1], [0, 1, 1]);

  // Typewriter effect
  useEffect(() => {
    const currentWord = HERO_ROLES[roleIndex];
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (displayedText.length < currentWord.length) {
        timer = setTimeout(() => {
          setDisplayedText(currentWord.slice(0, displayedText.length + 1));
        }, 75);
      } else {
        timer = setTimeout(() => setIsDeleting(true), 2200);
      }
    } else {
      if (displayedText.length > 0) {
        timer = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, 40);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % HERO_ROLES.length);
        }, 250);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, roleIndex]);

  // Trigger stats count up after initial intro
  useEffect(() => {
    const timer = setTimeout(() => setStatsCounted(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 2;
    const y = (clientY / innerHeight - 0.5) * 2;
    setMouseOffset({ x, y });
  };

  return (
    <div
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative h-[200vh] w-full bg-black select-none"
    >
      {/* Pinned 100vh Sticky Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center items-center">
        {/* 1. Full-Bleed Video Background with Duotone Red Tint, Scanlines & Grain */}
        <motion.div
          style={{
            scale: videoScale,
            y: videoY,
            x: mouseOffset.x * 12,
          }}
          className="absolute inset-0 h-full w-full pointer-events-none overflow-hidden"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/myimage.png"
            className="h-full w-full object-cover object-center brightness-60 contrast-125"
          >
            <source src="/video/Man_rolling_neck_movements_98e1ec5b_1080p.mp4" type="video/mp4" />
          </video>

          {/* Deadpool Crimson Duotone & Vignette Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#8B0000]/35 to-[#0A0A0A] mix-blend-multiply" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#E62429]/10 to-black/90 pointer-events-none" />

          {/* CRT Scanline Shader Effect */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.6) 0px, rgba(0,0,0,0.6) 1px, transparent 1px, transparent 2px)',
              backgroundSize: '100% 2px',
            }}
          />
        </motion.div>

        {/* 2. Background Huge Outlined Watermark "RAJAT" with Outward Split on Scroll */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10 overflow-hidden">
          <div className="flex items-center justify-center font-orbitron font-black text-[18vw] sm:text-[16vw] tracking-tighter leading-none opacity-25">
            <motion.span
              style={{
                x: textSplitLeft,
                WebkitTextStroke: '2px #E62429',
                color: 'transparent',
              }}
              className="inline-block"
            >
              RAJ
            </motion.span>
            <motion.span
              style={{
                x: textSplitRight,
                WebkitTextStroke: '2px #FF2D2D',
                color: 'transparent',
              }}
              className="inline-block"
            >
              AT
            </motion.span>
          </div>
        </div>

        {/* 3. Foreground Hero Content with Parallax & Text Reveal */}
        <motion.div
          style={{
            y: foregroundY,
            opacity: foregroundOpacity,
            x: mouseOffset.x * -18,
          }}
          className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center pt-8 sm:pt-4"
        >
          {/* "Available for opportunities" badge with pulsing red dot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-[#E62429]/60 bg-black/80 px-4 py-1.5 shadow-[0_0_15px_rgba(230,36,41,0.45)] backdrop-blur-md"
          >
            <span className="h-2 w-2 rounded-full bg-[#FF2D2D] animate-ping" />
            <span className="font-orbitron font-bold text-xs tracking-wider text-white">
              Available for opportunities · India
            </span>
          </motion.div>

          {/* Primary Solid Red Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-orbitron text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-tight"
          >
            RAJAT{' '}
            <span className="text-[#E62429] drop-shadow-[0_0_25px_rgba(230,36,41,0.85)]">
              AMBEDKAR
            </span>
          </motion.h1>

          {/* Solid Red Role Line with Typewriter Cycling Roles */}
          <div className="mt-2 sm:mt-3 h-8 sm:h-10 flex items-center justify-center">
            <span className="font-mono text-base sm:text-xl font-bold text-[#FF2D2D] tracking-wide">
              &gt; {displayedText}
              <span className="animate-pulse text-white">|</span>
            </span>
          </div>

          {/* Tagline: "Building immersive web experiences that push boundaries" */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-2.5 max-w-2xl text-sm sm:text-base md:text-lg font-inter text-neutral-300 leading-relaxed"
          >
            Building immersive web experiences that push boundaries.
          </motion.p>

          {/* 6 Hero Floating Tech Chips with Magnetic Hover */}
          <motion.div
            style={{ y: chipsDrift }}
            className="mt-5 flex flex-wrap items-center justify-center gap-2 max-w-2xl"
          >
            {HERO_TECH_CHIPS.map((chip, idx) => (
              <motion.div
                key={chip.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + idx * 0.05 }}
                whileHover={{ scale: 1.1, y: -4 }}
                className="group relative flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/60 px-3 py-1 font-mono text-xs text-neutral-300 backdrop-blur-md transition-colors hover:border-[#E62429] hover:bg-[#E62429]/15 hover:text-white cursor-pointer shadow-sm"
              >
                <span>{chip.name}</span>
                <span className="rounded bg-[#E62429]/20 px-1 py-0.2 text-[9px] font-bold text-[#FF2D2D] group-hover:bg-[#E62429] group-hover:text-white">
                  {chip.badge}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Hero Standout Stats (4+, 8+, 5+) counting up after intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={statsCounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="mt-5 flex items-center justify-center gap-6 sm:gap-10 font-orbitron"
          >
            <div className="text-center">
              <span className="text-xl sm:text-2xl font-black text-white">
                <span className="text-[#FF2D2D]">4</span>+
              </span>
              <span className="block text-[10px] text-neutral-400 font-mono">Years Exp</span>
            </div>
            <div className="h-6 w-px bg-white/15" />
            <div className="text-center">
              <span className="text-xl sm:text-2xl font-black text-white">
                <span className="text-[#FF2D2D]">8</span>+
              </span>
              <span className="block text-[10px] text-neutral-400 font-mono">Projects Delivered</span>
            </div>
            <div className="h-6 w-px bg-white/15" />
            <div className="text-center">
              <span className="text-xl sm:text-2xl font-black text-white">
                <span className="text-[#FF2D2D]">5</span>+
              </span>
              <span className="block text-[10px] text-neutral-400 font-mono">Countries Served</span>
            </div>
          </motion.div>

          {/* Action Buttons: "View My Work" (solid red glow) and "Enter 3D World" (outline) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-6 sm:mt-7 flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={() => scrollToTarget('#projects')}
              className="relative inline-flex items-center gap-2.5 rounded-xl px-7 py-3 font-orbitron text-xs sm:text-sm font-black tracking-wider text-white transition-all hover:scale-105 active:scale-95 cursor-pointer border border-[#FF2D2D]/60"
              style={{
                background: 'linear-gradient(135deg, #E62429 0%, #8B0000 100%)',
                boxShadow: '0 0 25px rgba(230,36,41,0.65), inset 0 0 10px rgba(255,255,255,0.2)',
              }}
            >
              <Sparkles className="h-4 w-4 text-white" />
              VIEW MY WORK
            </button>

            <button
              onClick={launchGame}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-[#E62429]/70 bg-black/70 px-6 py-3 font-orbitron text-xs sm:text-sm font-bold tracking-wider text-neutral-200 backdrop-blur-md transition-all hover:border-[#FF2D2D] hover:bg-[#E62429]/15 hover:text-white active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(230,36,41,0.25)]"
            >
              <Gamepad2 className="h-4 w-4 text-[#FF2D2D]" />
              ENTER 3D WORLD
            </button>
          </motion.div>

          {/* Scroll cue: animated mouse icon with "Scroll, I dare you" */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            onClick={() => scrollToTarget('#about')}
            className="mt-7 flex flex-col items-center gap-1 cursor-pointer group"
          >
            <div className="relative h-8 w-4.5 rounded-full border-2 border-[#E62429]/70 p-1 flex justify-center group-hover:border-[#FF2D2D] transition-colors">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                className="h-1.5 w-1 rounded-full bg-[#FF2D2D] shadow-[0_0_6px_#FF2D2D]"
              />
            </div>
            <span className="font-bangers text-xs sm:text-sm tracking-wider text-neutral-400 group-hover:text-[#FF2D2D] transition-colors">
              Scroll, I dare you
            </span>
            <ArrowDown className="h-3 w-3 text-[#E62429] animate-bounce" />
          </motion.div>
        </motion.div>

        {/* 4. Katana Slash Wipe Overlay transitioning into About */}
        <motion.div
          style={{
            scaleX: slashWipeScale,
            opacity: slashWipeOpacity,
          }}
          className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center overflow-hidden"
        >
          <div
            className="w-[160vw] h-[6px] bg-gradient-to-r from-transparent via-[#FF2D2D] to-transparent shadow-[0_0_35px_#FF2D2D,0_0_70px_#E62429]"
            style={{ transform: 'rotate(-7deg)' }}
          />
        </motion.div>
      </div>
    </div>
  );
};
