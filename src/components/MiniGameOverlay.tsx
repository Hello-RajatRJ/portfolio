import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Timer, Coins } from 'lucide-react';

export const MiniGameOverlay: React.FC = () => {
  const gameState = useStore((s) => s.gameState);
  const setGameState = useStore((s) => s.setGameState);

  const activeGame = gameState.activeMiniGame;
  const [elapsed, setElapsed] = React.useState(0);

  React.useEffect(() => {
    if (activeGame !== 'race' || !gameState.raceStartTime) {
      setTimeout(() => setElapsed(0), 0);
      return;
    }

    const interval = setInterval(() => {
      const start = gameState.raceStartTime || Date.now();
      setElapsed((Date.now() - start) / 1000);
    }, 100);

    return () => clearInterval(interval);
  }, [activeGame, gameState.raceStartTime]);

  if (activeGame === 'none') return null;

  const handleCancel = () => {
    setGameState((prev) => ({
      ...prev,
      activeMiniGame: 'none',
      coinsCollected: 0,
      checkpointsCleared: 0,
      raceStartTime: null,
      raceEndTime: null,
    }));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="absolute top-24 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3 bg-black/85 backdrop-blur-md border border-[#ff007f] px-6 py-4 rounded-xl shadow-[0_0_15px_rgba(255,0,127,0.3)] pointer-events-auto z-10 font-orbitron text-white min-w-[320px]"
      >
        {activeGame === 'coins' && (
          <>
            <div className="flex items-center gap-2 text-yellow-400 text-sm font-semibold tracking-wider">
              <Coins className="animate-bounce" size={18} />
              <span>COIN COLLECTOR CHALLENGE</span>
            </div>
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 my-1 font-mono">
              {gameState.coinsCollected} / {gameState.totalCoins}
            </div>
            <p className="text-[10px] text-white/50 tracking-wide text-center">
              Explore the grid and collect all glowing yellow coins!
            </p>
          </>
        )}

        {activeGame === 'race' && (
          <>
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold tracking-wider">
              <Timer className="animate-pulse" size={18} />
              <span>CHECKPOINT TIME TRIAL</span>
            </div>
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 my-1 font-mono">
              {gameState.checkpointsCleared} / {gameState.totalCheckpoints}
            </div>
            <div className="text-xs text-white/80 font-mono tracking-widest bg-cyan-950/40 border border-cyan-800/40 px-3 py-1 rounded">
              TIME: {elapsed.toFixed(1)}s
            </div>
            <p className="text-[10px] text-white/50 tracking-wide text-center">
              Drive through the cyan rings as quickly as possible!
            </p>
          </>
        )}

        <button
          onClick={handleCancel}
          className="mt-2 text-[9px] uppercase tracking-widest text-red-400 hover:text-red-300 border border-red-900/40 hover:border-red-500/40 bg-red-950/20 px-3 py-1.5 rounded transition-all duration-200 cursor-pointer pointer-events-auto"
        >
          Cancel Challenge
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
