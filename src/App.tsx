import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './store/useStore';
import { Landing } from './pages/Landing';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { AudioPlayer } from './components/AudioPlayer';
import { ProjectDetailsModal } from './components/ProjectDetailsModal';
import { ContactFormModal } from './components/ContactFormModal';
import { useInput } from './hooks/useInput';
import { ArrowLeft } from 'lucide-react';
import { MiniGameOverlay } from './components/MiniGameOverlay';
import { AchievementToast } from './components/AchievementToast';
import { OrientationGuard } from './components/OrientationGuard';
import { ControlsModal } from './components/ControlsModal';

const GameView: React.FC = () => {
  const gameState = useStore((s) => s.gameState);
  const setGameState = useStore((s) => s.setGameState);
  const projects = useStore((s) => s.projects);
  const returnToLanding = useStore((s) => s.returnToLanding);

  const [loading, setLoading] = React.useState(true);
  const [showControls, setShowControls] = React.useState(false);

  useInput();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setShowControls(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const onAudioToggle = (playing: boolean) => {
    setGameState((s) => ({ ...s, audioPlaying: playing }));
  };

  return (
    <>
      {/* Loading Screen */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="loading-screen"
            id="loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="loading-title">PORTFOLIO WORLD</div>
            <div className="loading-bar-track">
              <div className="loading-bar-fill" />
            </div>
            <div className="loading-subtitle">RENDERING 3D WORLD...</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Canvas */}
      <div className="game-wrapper" id="game-wrapper">
        <GameCanvas
          gameState={gameState}
          setGameState={setGameState}
          projects={projects}
        />
      </div>

      {/* HUD Overlay */}
      <div className="hud-overlay" id="hud-overlay-root">
        <HUD gameState={gameState} totalProjects={projects.length} />
        <AudioPlayer isPlaying={gameState.audioPlaying} onToggle={onAudioToggle} />
        <MiniGameOverlay />
        <AchievementToast />

        {/* Back to Portfolio button */}
        <button
          id="back-to-portfolio-btn"
          onClick={returnToLanding}
          className="absolute top-5 left-5 flex items-center gap-2 px-4 py-2 rounded-lg font-orbitron text-xs tracking-widest text-white/70 hover:text-white border border-white/10 hover:border-white/20 bg-black/30 backdrop-blur hover:bg-black/50 transition-all duration-300 z-10 pointer-events-auto"
          style={{ fontSize: '0.55rem', letterSpacing: '0.15em' }}
        >
          <ArrowLeft size={12} />
          PORTFOLIO
        </button>
      </div>

      {/* Landscape orientation guard (mobile only) */}
      <OrientationGuard />

      {/* Project Details Modal */}
      <AnimatePresence>
        {gameState.activeProject && (
          <ProjectDetailsModal
            project={gameState.activeProject}
            onClose={() => setGameState((s) => ({ ...s, activeProject: null }))}
          />
        )}
      </AnimatePresence>

      {/* Contact Modal */}
      <AnimatePresence>
        {gameState.showContact && (
          <ContactFormModal
            onClose={() => setGameState((s) => ({ ...s, showContact: false }))}
            onSuccess={() => setGameState((s) => ({ ...s, submittedContact: true }))}
          />
        )}
      </AnimatePresence>

      {/* Controls Modal */}
      <AnimatePresence>
        {showControls && (
          <ControlsModal onClose={() => {
            setShowControls(false);
            // Optionally auto-enable audio when they dismiss the modal
            if (!gameState.audioPlaying) onAudioToggle(true);
          }} />
        )}
      </AnimatePresence>
    </>
  );
};

const App: React.FC = () => {
  const view = useStore((s) => s.view);

  return (
    <AnimatePresence mode="wait">
      {view === 'landing' ? (
        <motion.div
          key="landing"
          className="landing-view"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4 }}
          style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}
        >
          <Landing />
        </motion.div>
      ) : (
        <motion.div
          key="game"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <GameView />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default App;
