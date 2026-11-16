import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Gamepad2, ArrowUp } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { scrollToTarget } from '../../hooks/useLenisScroll';
import { personal } from '../../data/personalInfo';

export const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  const launchGame = useStore((s) => s.launchGame);

  // Scroll Progress to fill the giant wordmark with surgical precision via clip-path
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ['start end', 'end end'],
  });

  // Flawless liquid fill reveal without text displacement or double-vision jitter
  const fillClip = useTransform(
    scrollYProgress,
    [0.1, 0.95],
    ['inset(0 100% 0 0)', 'inset(0 0% 0 0)']
  );

  const handleBackToTop = () => {
    scrollToTarget('#hero', { duration: 1.2 });
  };

  return (
    <footer
      ref={footerRef}
      className="relative bg-[#050505] border-t border-white/[0.08] pt-16 pb-12 overflow-hidden select-none"
    >
      {/* Ambient Red Glow Halo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[250px] bg-[#E62429]/08 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* 1. Large Red "RAJAT .DEV" Wordmark that Fills via CSS Clip-Path */}
        <div className="relative text-center my-6 overflow-hidden select-none">
          {/* Base Outlined Layer */}
          <div
            className="font-orbitron font-black text-[11vw] sm:text-[10vw] tracking-tighter leading-none select-none"
            style={{
              WebkitTextStroke: '1.5px rgba(230, 36, 41, 0.35)',
              color: 'transparent',
            }}
          >
            RAJAT .DEV
          </div>

          {/* Overlay Solid Filled Layer that fills from Left to Right via clip-path */}
          <motion.div
            style={{ clipPath: fillClip }}
            className="absolute inset-0 w-full text-center select-none pointer-events-none"
          >
            <div
              className="font-orbitron font-black text-[11vw] sm:text-[10vw] tracking-tighter leading-none bg-gradient-to-r from-[#8B0000] via-[#E62429] to-[#FF2D2D] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(230,36,41,0.6)]"
            >
              RAJAT .DEV
            </div>
          </motion.div>
        </div>

        {/* 2. Middle Row: Brand, Play 3D CTA, Back-to-Top Button */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 border-y border-white/10 py-7">
          {/* Left: Tagline */}
          <div className="text-center md:text-left">
            <span className="font-orbitron text-sm font-bold text-white block tracking-wider">
              {personal.name}
            </span>
            <span className="font-mono text-xs text-neutral-400">
              Full-Stack Developer · Available for Relocation &amp; Freelance
            </span>
          </div>

          {/* Center: Play 3D World button */}
          <button
            onClick={launchGame}
            className="inline-flex items-center gap-2 rounded-lg border border-[#E62429]/50 bg-[#0D0D0D] px-5 py-2.5 font-orbitron text-xs font-bold text-white hover:border-[#FF2D2D] hover:bg-[#E62429]/15 hover:shadow-[0_0_20px_rgba(230,36,41,0.4)] transition-all cursor-pointer"
          >
            <Gamepad2 className="h-4 w-4 text-[#FF2D2D]" />
            <span>ENTER 3D RACING WORLD</span>
          </button>

          {/* Right: Back-to-Top Button */}
          <button
            onClick={handleBackToTop}
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-[#0D0D0D] px-4 py-2.5 font-mono text-xs font-semibold text-neutral-300 hover:text-white hover:border-[#FF2D2D] transition-all cursor-pointer"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="h-3.5 w-3.5 text-[#FF2D2D]" />
          </button>
        </div>

        {/* 3. Bottom Row: Clean Professional Colophon */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left font-mono text-xs text-neutral-400">
          <p className="text-neutral-400">
            Engineered with React 19, Three.js &amp; TypeScript · Mohali, India (IST)
          </p>

          <p className="text-neutral-500 text-[11px]">
            &copy; {new Date().getFullYear()} Rajat Ambedkar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
