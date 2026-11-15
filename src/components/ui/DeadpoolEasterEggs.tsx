import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export const DeadpoolEasterEggs: React.FC = () => {
  const [showSpeech, setShowSpeech] = useState(false);
  const [speechText, setSpeechText] = useState('MAXIMUM EFFORT! ⚔️');

  useEffect(() => {
    let textBuffer = '';
    let keyIndex = 0;

    const triggerConfetti = (msg: string) => {
      setSpeechText(msg);
      setShowSpeech(true);

      // Confetti burst of bullets / red particles
      const count = 120;
      const defaults = {
        origin: { y: 0.7 },
        colors: ['#E62429', '#8B0000', '#FF2D2D', '#FFFFFF', '#D4AF37'],
      };

      confetti({
        ...defaults,
        particleCount: Math.floor(count * 0.6),
        spread: 60,
        startVelocity: 45,
      });

      confetti({
        ...defaults,
        particleCount: Math.floor(count * 0.4),
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });

      confetti({
        ...defaults,
        particleCount: Math.floor(count * 0.5),
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });

      setTimeout(() => {
        setShowSpeech(false);
      }, 3500);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Check for word "deadpool"
      if (e.key.length === 1) {
        textBuffer += e.key.toLowerCase();
        if (textBuffer.length > 20) textBuffer = textBuffer.slice(-20);
        if (textBuffer.includes('deadpool')) {
          textBuffer = '';
          triggerConfetti('MAXIMUM EFFORT! ⚔️ Chimichanga time!');
          return;
        }
      }

      // 2. Check for Konami code
      if (e.key.toLowerCase() === KONAMI_CODE[keyIndex].toLowerCase()) {
        keyIndex++;
        if (keyIndex === KONAMI_CODE.length) {
          keyIndex = 0;
          triggerConfetti('MAXIMUM EFFORT! 💥 30 Extra Lives Granted!');
        }
      } else {
        keyIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AnimatePresence>
      {showSpeech && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 50, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate: [-3, 3, -2, 2, 0] }}
          exit={{ opacity: 0, scale: 0.8, y: -40 }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          className="fixed bottom-16 right-8 z-[1002] max-w-sm pointer-events-none"
        >
          <div className="dp-speech-bubble rounded-2xl px-6 py-4 text-center border-4 border-black">
            <span className="block font-bangers text-2xl tracking-wider text-black">
              {speechText}
            </span>
            <span className="mt-1 block font-mono text-[10px] uppercase font-bold text-[#E62429]">
              — Deadpool Approved Easter Egg
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
