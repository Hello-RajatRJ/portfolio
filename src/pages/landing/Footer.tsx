import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Gamepad2, Rocket } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { scrollToTarget } from '../../hooks/useLenisScroll';
import { personal } from '../../data/personalInfo';

export const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  const launchGame = useStore((s) => s.launchGame);

  // Scroll Progress to fill the giant text
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ['start end', 'end end'],
  });

  const fillWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const handleBackToTop = () => {
    scrollToTarget('#hero', { duration: 1.5 });
  };

  return (
    <footer
      ref={footerRef}
      className="relative bg-[#000000] border-t border-[#E62429]/30 pt-16 pb-12 overflow-hidden select-none"
    >
      {/* Ambient Red Glow Halo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#E62429]/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* 1. Huge Red "RAJAT .DEV" Text that Fills on Scroll */}
        <div className="relative text-center my-6 overflow-hidden">
          {/* Base Outlined Layer */}
          <div
            className="font-orbitron font-black text-[13vw] sm:text-[14vw] tracking-tighter leading-none"
            style={{
              WebkitTextStroke: '2px rgba(230, 36, 41, 0.35)',
              color: 'transparent',
            }}
          >
            RAJAT .DEV
          </div>

          {/* Overlay Solid Filled Layer that fills from Left to Right */}
          <motion.div
            style={{ width: fillWidth }}
            className="absolute inset-0 mx-auto overflow-hidden whitespace-nowrap text-center origin-left"
          >
            <div
              className="font-orbitron font-black text-[13vw] sm:text-[14vw] tracking-tighter leading-none bg-gradient-to-r from-[#8B0000] via-[#E62429] to-[#FF2D2D] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(230,36,41,0.7)]"
            >
              RAJAT .DEV
            </div>
          </motion.div>
        </div>

        {/* 2. Middle Row: Brand, Play 3D CTA, Back-to-Top Rocket Button */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 border-y border-white/10 py-8">
          {/* Left: Tagline */}
          <div className="text-center md:text-left">
            <span className="font-orbitron text-sm font-bold text-white block">
              {personal.name}
            </span>
            <span className="font-mono text-xs text-[#9CA3AF]">
              Full-Stack Developer · UI Architect · 3D Creator
            </span>
          </div>

          {/* Center: Play 3D World button */}
          <button
            onClick={launchGame}
            className="inline-flex items-center gap-2 rounded-xl border border-[#E62429]/60 bg-[#E62429]/20 px-5 py-2.5 font-orbitron text-xs font-bold text-white hover:bg-[#E62429] hover:shadow-[0_0_20px_#FF2D2D] transition-all cursor-pointer"
          >
            <Gamepad2 className="h-4 w-4" />
            ENTER 3D RACING WORLD
          </button>

          {/* Right: Back-to-Top Rocket Button */}
          <motion.button
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackToTop}
            className="inline-flex items-center gap-2.5 rounded-xl border border-[#FF2D2D]/60 bg-black/80 px-4 py-2.5 font-orbitron text-xs font-bold text-white hover:border-[#FF2D2D] hover:shadow-[0_0_15px_#FF2D2D] transition-all cursor-pointer"
          >
            <Rocket className="h-4 w-4 text-[#FF2D2D] animate-bounce" />
            BACK TO TOP
          </motion.button>
        </div>

        {/* 3. Bottom Row: Comic Disclaimer & Copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left font-mono text-xs text-neutral-400">
          <p className="font-bangers text-sm sm:text-base text-[#FF2D2D] tracking-wider">
            🌮 No chimichangas were harmed in the making of this site.
          </p>

          <p className="text-neutral-500 text-[11px]">
            &copy; {new Date().getFullYear()} {personal.name} &bull; Maximum Effort Edition
          </p>
        </div>
      </div>
    </footer>
  );
};
