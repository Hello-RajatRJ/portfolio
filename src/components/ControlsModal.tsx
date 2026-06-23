import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Keyboard, Smartphone, X } from 'lucide-react';

interface ControlsModalProps {
  onClose: () => void;
}

export const ControlsModal: React.FC<ControlsModalProps> = ({ onClose }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Basic touch detection
    setIsMobile(window.matchMedia('(max-width: 768px)').matches || navigator.maxTouchPoints > 0);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/60 backdrop-blur-sm pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-black/80 border border-purple-500/30 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.2)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-transparent">
          <div className="flex items-center gap-2 text-purple-400">
            {isMobile ? <Smartphone size={18} /> : <Keyboard size={18} />}
            <h2 className="font-orbitron tracking-widest text-sm font-bold text-white">DRIVING CONTROLS</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 font-mono text-sm text-white/80 space-y-4">
          {!isMobile ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span>Steer & Drive</span>
                <span className="text-purple-400 font-bold tracking-wider">WASD / ARROWS</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span>Drift / Handbrake</span>
                <span className="text-purple-400 font-bold tracking-wider">SPACE</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span>Wheelie / Nose Up</span>
                <span className="text-purple-400 font-bold tracking-wider">SHIFT</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span>Honk Horn</span>
                <span className="text-purple-400 font-bold tracking-wider">H</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Interact</span>
                <span className="text-purple-400 font-bold tracking-wider">ENTER</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span>Steer & Drive</span>
                <span className="text-purple-400 font-bold tracking-wider">ON-SCREEN JOYSTICK</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span>Drift</span>
                <span className="text-purple-400 font-bold tracking-wider">BRAKE BUTTON</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span>Wheelie</span>
                <span className="text-purple-400 font-bold tracking-wider">WHEELIE BUTTON</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span>Honk Horn</span>
                <span className="text-purple-400 font-bold tracking-wider">HORN BUTTON</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Interact</span>
                <span className="text-purple-400 font-bold tracking-wider">ACTION BUTTON</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-orbitron text-xs tracking-widest rounded transition-colors shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]"
          >
            START ENGINE
          </button>
        </div>
      </motion.div>
    </div>
  );
};
