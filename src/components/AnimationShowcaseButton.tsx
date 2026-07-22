import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

/**
 * A premium animated button that transitions to the Animation Showcase page.
 * Uses Zustand view management (no router needed).
 */
const AnimationShowcaseButton: React.FC = () => {
  const openShowcase = useStore((s) => s.openShowcase);

  return (
    <motion.button
      id="hero-showcase-btn"
      onClick={openShowcase}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      className="group relative overflow-hidden rounded-xl px-8 py-4 font-orbitron text-sm tracking-widest font-bold"
      style={{
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)',
        boxShadow: '0 4px 24px rgba(139, 92, 246, 0.35)',
      }}
    >
      <span className="relative z-10 flex items-center gap-3 text-white">
        <span className="text-lg">✨</span>
        ANIMATION SHOWCASE
      </span>
      {/* Animated shimmer overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            'linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.15) 50%, transparent 80%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s ease-in-out infinite',
        }}
      />
    </motion.button>
  );
};

export default AnimationShowcaseButton;
