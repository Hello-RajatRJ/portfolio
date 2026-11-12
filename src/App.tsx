import React, { Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './store/useStore';
import { Landing } from './pages/Landing';
import AnimationShowcase from './pages/AnimationShowcase';
import { HUD } from './components/HUD';

const GameCanvas = React.lazy(() =>
  import('./components/GameCanvas').then((m) => ({ default: m.GameCanvas }))
);
import { AudioPlayer } from './components/AudioPlayer';
import { ProjectDetailsModal } from './components/ProjectDetailsModal';
import { ContactFormModal } from './components/ContactFormModal';
import { MobileControls } from './components/MobileControls';
import { useInput, inputState } from './hooks/useInput';
import type { CameraPerspective } from './types';
import { ArrowLeft } from 'lucide-react';
import { MiniGameOverlay } from './components/MiniGameOverlay';
import { AchievementToast } from './components/AchievementToast';
import { OrientationGuard } from './components/OrientationGuard';
import { ControlsModal } from './components/ControlsModal';
import { SEO } from './components/SEO';
import { AuthModal } from './components/AuthModal';
import CursorAvatar from './components/CursorAvatar';

const GameView: React.FC = () => {
  const gameState = useStore((s) => s.gameState);
  const setGameState = useStore((s) => s.setGameState);
  const projects = useStore((s) => s.projects);
  const returnToLanding = useStore((s) => s.returnToLanding);

  const [loading, setLoading] = React.useState(true);
  const [showControls, setShowControls] = React.useState(false);
  const didFinishRef = React.useRef(false);

  useInput();

  const finishLoading = React.useCallback(() => {
    if (didFinishRef.current) return;
    didFinishRef.current = true;
    setLoading(false);
    setShowControls(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(finishLoading, 450);
    return () => clearTimeout(timer);
  }, [finishLoading]);

  const onAudioToggle = (playing: boolean) => {
    setGameState((s) => ({ ...s, audioPlaying: playing }));
  };

  return (
    <>
      {/* Loading Screen with Hot Wheels Red Aesthetics */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="loading-screen"
            id="loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              background: 'radial-gradient(circle at center, #3b0712 0%, #160408 70%, #080204 100%)',
            }}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-orbitron tracking-widest text-yellow-400 font-bold uppercase">
                Interactive 3D Racing Experience
              </span>
              <div
                className="loading-title"
                style={{
                  color: '#ffffff',
                  textShadow: '0 0 20px #ef4444, 0 0 40px #dc2626',
                  letterSpacing: '0.2em',
                }}
              >
                VELOCITY 3D PORTFOLIO
              </div>
              <span className="text-xs font-mono text-red-300">
                RAJAT AMBEDKAR · FULL-STACK DEVELOPER
              </span>
            </div>
            <div className="loading-bar-track" style={{ borderColor: 'rgba(239, 68, 68, 0.4)' }}>
              <div
                className="loading-bar-fill"
                style={{ background: 'linear-gradient(90deg, #f97316, #ef4444, #ffd700)' }}
              />
            </div>
            <div className="loading-subtitle text-yellow-300/80">
              BUILDING 3D MINIATURE CITY & TRACKS...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Canvas */}
      <div className="game-wrapper" id="game-wrapper">
        <Suspense fallback={null}>
          <GameCanvas
            gameState={gameState}
            setGameState={setGameState}
            projects={projects}
            onReady={finishLoading}
          />
        </Suspense>
      </div>

      {/* HUD Overlay */}
      <div className="hud-overlay" id="hud-overlay-root">
        <HUD
          gameState={gameState}
          setGameState={setGameState}
          projects={projects}
          totalProjects={projects.length}
        />
        <AudioPlayer isPlaying={gameState.audioPlaying} onToggle={onAudioToggle} />
        <MiniGameOverlay />
        <AchievementToast />

        {/* Mobile On-Screen Touch Driving Controls */}
        <MobileControls
          onCameraToggle={() => {
            const modes: CameraPerspective[] = ['tpp', 'tpp-close', 'hood', 'drone'];
            const curIdx = modes.indexOf(gameState.cameraPerspective);
            const nextMode = modes[(curIdx + 1) % modes.length];
            setGameState((s) => ({ ...s, cameraPerspective: nextMode }));
          }}
          onReset={() => {
            inputState.reset = true;
            setTimeout(() => { inputState.reset = false; }, 100);
          }}
        />

        {/* Back to Portfolio button */}
        <button
          id="back-to-portfolio-btn"
          onClick={returnToLanding}
          className="absolute top-5 left-5 flex items-center gap-2 px-4 py-2 rounded-lg font-orbitron text-xs tracking-widest text-white hover:text-yellow-300 border border-red-600/70 hover:border-yellow-400 bg-red-950/80 backdrop-blur hover:bg-red-900 transition-all duration-300 z-30 pointer-events-auto shadow-xl cursor-pointer"
          style={{ fontSize: '0.65rem', letterSpacing: '0.15em' }}
        >
          <ArrowLeft size={14} />
          BACK TO PORTFOLIO
        </button>
      </div>

      {/* Landscape orientation guard (mobile only) */}
      <OrientationGuard />

      {/* Project Details Modal */}
      {gameState.activeProject && (
        <ProjectDetailsModal
          project={gameState.activeProject}
          projects={projects}
          onSelectProject={(nextProject) =>
            setGameState((s) => ({
              ...s,
              activeProject: nextProject,
              visitedProjects: s.visitedProjects.includes(nextProject.id)
                ? s.visitedProjects
                : [...s.visitedProjects, nextProject.id],
            }))
          }
          onClose={() => {
            inputState.interact = false;
            setGameState((s) => ({ ...s, activeProject: null }));
          }}
        />
      )}

      {/* Contact Modal */}
      {gameState.showContact && (
        <ContactFormModal
          onClose={() => {
            inputState.interact = false;
            setGameState((s) => ({ ...s, showContact: false }));
          }}
          onSuccess={() => setGameState((s) => ({ ...s, submittedContact: true }))}
        />
      )}

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

export const App: React.FC = () => {
  const view = useStore((s) => s.view);
  const setView = useStore((s) => s.setView);
  const showAuthModal = useStore((s) => s.showAuthModal);
  const setShowAuthModal = useStore((s) => s.setShowAuthModal);
  const authPendingTargetView = useStore((s) => s.authPendingTargetView);
  const setAuthPendingTargetView = useStore((s) => s.setAuthPendingTargetView);

  const isGameView = view !== 'landing' && view !== 'showcase';

  // Lock document scroll only when the full-screen 3D game is active
  useEffect(() => {
    document.documentElement.classList.toggle('game-active', isGameView);
    if (!isGameView) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
    return () => {
      document.documentElement.classList.remove('game-active');
    };
  }, [isGameView]);

  return (
    <>
      <SEO />
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        targetFeatureLabel="Developer Tools"
        onSuccess={() => {
          if (authPendingTargetView) {
            setView(authPendingTargetView);
            setAuthPendingTargetView(null);
          }
        }}
      />
      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          <motion.div
            key="landing"
            id="landing-scroll-container"
            className="landing-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <CursorAvatar />
            <Landing />
          </motion.div>
        ) : view === 'showcase' ? (
          <motion.div
            key="showcase"
            id="showcase-scroll-container"
            className="landing-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimationShowcase />
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 overflow-hidden"
          >
            <GameView />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default App;
