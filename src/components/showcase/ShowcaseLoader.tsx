import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

/**
 * Premium loading screen with counter animation (0% → 100%).
 * Inspired by award-winning site intros.
 * Shows a counting progress, then reveals content via clip-path.
 */
interface ShowcaseLoaderProps {
  onComplete: () => void;
  duration?: number; // total duration in seconds
}

const ShowcaseLoader: React.FC<ShowcaseLoaderProps> = ({ onComplete, duration = 2.5 }) => {
  const [count, setCount] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const counterRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const counter = { val: 0 };
    gsap.to(counter, {
      val: 100,
      duration,
      ease: 'power2.inOut',
      onUpdate: () => {
        setCount(Math.round(counter.val));
      },
      onComplete: () => {
        // Exit animation
        gsap.to(containerRef.current, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.8,
          ease: 'power4.inOut',
          onComplete: () => {
            setIsDone(true);
            onComplete();
          },
        });
      },
    });
  }, [duration, onComplete]);

  if (isDone) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        className="fixed inset-0 z-[9500] flex flex-col items-center justify-center bg-[#0a0a0f]"
        style={{ clipPath: 'inset(0 0 0 0)' }}
      >
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/10 via-transparent to-indigo-900/10" />

        {/* Counter */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          <span
            ref={counterRef}
            className="font-orbitron text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {count}
          </span>

          {/* Progress bar */}
          <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
              style={{ width: `${count}%` }}
            />
          </div>

          <span className="font-orbitron text-[10px] tracking-[0.4em] text-white/30 uppercase">
            Loading Experience
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ShowcaseLoader;
