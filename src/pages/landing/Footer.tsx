import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Heart } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { personal } from '../../data/personalInfo';

export const Footer: React.FC = () => {
  const launchGame = useStore((s) => s.launchGame);

  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="bg-black border-t border-neutral-800 py-12"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Logo + tagline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-center md:text-left flex flex-col items-center md:items-start"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-black border-2 border-red-600 flex items-center justify-center shadow-[0_0_16px_rgba(220,38,38,0.4)]">
                <span className="font-orbitron text-sm font-black text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.85)]">
                  R<span className="text-white text-[10px]">J</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-orbitron text-base font-black tracking-wide text-white">
                <span className="bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
                  RAJAT
                </span>
                <span className="bg-black text-red-400 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-red-700/60 shadow-[0_0_8px_rgba(220,38,38,0.3)]">
                  .DEV
                </span>
              </div>
            </div>
            <p className="font-inter text-sm text-neutral-400">{personal.tagline}</p>
          </motion.div>

          {/* Center: Play Game */}
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            whileHover={{ scale: 1.06, y: -3, boxShadow: '0 12px 35px rgba(220,38,38,0.4)' }}
            whileTap={{ scale: 0.97 }}
            onClick={launchGame}
            id="footer-play-btn"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-orbitron text-xs tracking-widest font-bold text-white transition-all cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
          >
            <Gamepad2 size={16} />
            PLAY 3D PORTFOLIO
          </motion.button>

          {/* Right: Credits */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-inter text-sm text-neutral-500 flex items-center gap-1.5"
          >
            Built with{' '}
            <motion.span
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="inline-flex"
            >
              <Heart size={12} className="text-red-500 mx-0.5" />
            </motion.span>{' '}
            using React & Three.js
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-8 pt-8 border-t border-neutral-800 text-center font-inter text-xs text-neutral-600 origin-left"
        >
          © {new Date().getFullYear()} {personal.name} · All rights reserved
        </motion.div>
      </div>
    </motion.footer>
  );
};
