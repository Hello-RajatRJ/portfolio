import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
}

export const DeadpoolPreloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [slashing, setSlashing] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2100; // ~2.1s count, then 400ms slash reveal

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setSlashing(true);
        setTimeout(() => {
          setFinished(true);
          onComplete();
        }, 550);
      }
    }, 28);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (finished) return null;

  return (
    <AnimatePresence>
      {!finished && (
        <div className="fixed inset-0 z-[9999] overflow-hidden select-none pointer-events-auto">
          {/* Top Half of Screen - Slides up-left on slash */}
          <motion.div
            initial={{ x: 0, y: 0 }}
            animate={slashing ? { x: '-110%', y: '-40%' } : { x: 0, y: 0 }}
            transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
            className="absolute inset-0 bg-[#000000]"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 42%, 0 58%)',
            }}
          />

          {/* Bottom Half of Screen - Slides down-right on slash */}
          <motion.div
            initial={{ x: 0, y: 0 }}
            animate={slashing ? { x: '110%', y: '40%' } : { x: 0, y: 0 }}
            transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
            className="absolute inset-0 bg-[#050505]"
            style={{
              clipPath: 'polygon(0 58%, 100% 42%, 100% 100%, 0 100%)',
            }}
          />

          {/* Katana Slash Light Beam */}
          {slashing && (
            <motion.div
              initial={{ scaleX: 0, opacity: 1 }}
              animate={{ scaleX: 1.5, opacity: [1, 1, 0] }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="absolute top-1/2 left-[-20%] w-[140%] h-[4px] -translate-y-1/2 pointer-events-none z-30"
              style={{
                transform: 'rotate(-9deg)',
                background: 'linear-gradient(90deg, transparent, #FF2D2D 25%, #FFFFFF 50%, #E62429 75%, transparent)',
                boxShadow: '0 0 25px #FF2D2D, 0 0 50px #E62429, 0 0 80px #FFFFFF',
              }}
            />
          )}

          {/* Preloader Content (Fades out when slash begins) */}
          <motion.div
            animate={slashing ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="relative z-20 flex h-full w-full flex-col items-center justify-center px-4"
          >
            {/* Ambient Red Glow Halo */}
            <div className="absolute h-72 w-72 rounded-full bg-[#E62429]/15 blur-3xl pointer-events-none animate-pulse" />

            {/* Self-drawing SVG RJ Monogram */}
            <div className="relative mb-6 h-28 w-28 sm:h-32 sm:w-32 flex items-center justify-center">
              <svg
                viewBox="0 0 120 120"
                className="h-full w-full drop-shadow-[0_0_18px_rgba(230,36,41,0.7)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Hexagonal Shield Outline */}
                <motion.polygon
                  points="60,6 110,32 110,88 60,114 10,88 10,32"
                  stroke="#8B0000"
                  strokeWidth="2.5"
                  strokeDasharray="360"
                  initial={{ strokeDashoffset: 360 }}
                  animate={{ strokeDashoffset: 360 - (360 * progress) / 100 }}
                  transition={{ ease: 'linear' }}
                />

                {/* "R" Path */}
                <motion.path
                  d="M32 90 V32 H54 C66 32 72 38 72 48 C72 58 64 64 54 64 H32 M50 64 L72 90"
                  stroke="#E62429"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="240"
                  initial={{ strokeDashoffset: 240 }}
                  animate={{ strokeDashoffset: 240 - (240 * progress) / 100 }}
                  transition={{ ease: 'linear' }}
                />

                {/* "J" Path */}
                <motion.path
                  d="M86 32 V78 C86 86 80 90 70 90"
                  stroke="#FFFFFF"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="120"
                  initial={{ strokeDashoffset: 120 }}
                  animate={{ strokeDashoffset: 120 - (120 * progress) / 100 }}
                  transition={{ ease: 'linear' }}
                />
              </svg>
            </div>

            {/* Percentage Counter */}
            <div className="font-orbitron text-4xl sm:text-5xl font-black tracking-widest text-white drop-shadow-[0_0_12px_#FF2D2D]">
              {progress}
              <span className="text-[#E62429]">%</span>
            </div>

            {/* Comic Microcopy */}
            <div className="mt-4 text-center">
              <p className="font-bangers text-lg sm:text-xl tracking-wider text-[#FF2D2D] drop-shadow-[0_0_8px_rgba(230,36,41,0.5)]">
                Loading awesomeness… (this is not a drill)
              </p>
              <p className="mt-1 font-mono text-[11px] tracking-widest text-[#9CA3AF] uppercase">
                RAJAT .DEV · MAXIMUM EFFORT EDITION
              </p>
            </div>

            {/* Slim Red Progress Line */}
            <div className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-[#8B0000] via-[#E62429] to-[#FF2D2D]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
