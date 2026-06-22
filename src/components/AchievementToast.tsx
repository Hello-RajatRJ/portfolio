import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Award } from 'lucide-react';

export const AchievementToast: React.FC = () => {
  const pendingAchievement = useStore((s) => s.pendingAchievement);
  const clearAchievement = useStore((s) => s.clearAchievement);

  useEffect(() => {
    if (pendingAchievement) {
      const timer = setTimeout(() => {
        clearAchievement();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [pendingAchievement, clearAchievement]);

  return (
    <AnimatePresence>
      {pendingAchievement && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="absolute bottom-24 right-5 flex items-center gap-3 bg-black/90 backdrop-blur-md border border-[#39ff14] px-5 py-3.5 rounded-xl shadow-[0_0_20px_rgba(57,255,20,0.35)] z-50 font-orbitron text-white min-w-[280px] pointer-events-auto"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#39ff14]/10 border border-[#39ff14]/30 text-[#39ff14] shrink-0">
            <Award className="animate-pulse" size={24} />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] tracking-widest text-[#39ff14] font-semibold">ACHIEVEMENT UNLOCKED</span>
            <span className="text-xs text-white/90 tracking-wide font-medium">{pendingAchievement}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
