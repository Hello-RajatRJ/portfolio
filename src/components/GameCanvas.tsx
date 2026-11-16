import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Car } from './Car';
import { World } from './World';
import { CanvasErrorBoundary } from './CanvasErrorBoundary';
import type { GameState, Project } from '../types';

interface GameCanvasProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  projects: Project[];
  onReady?: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, setGameState, projects, onReady }) => {
  const [recoveryAttempt, setRecoveryAttempt] = useState(0);
  const [contextLost, setContextLost] = useState(false);
  const cleanupListenersRef = useRef<(() => void) | null>(null);
  const isSafeMode = recoveryAttempt > 0;

  useEffect(() => {
    return () => {
      cleanupListenersRef.current?.();
      cleanupListenersRef.current = null;
    };
  }, []);

  const handlePositionUpdate = (pos: number, total: number) => {
    setGameState((prev) => {
      if (prev.racePosition === pos && prev.totalRacers === total) return prev;
      return { ...prev, racePosition: pos, totalRacers: total };
    });
  };

  const handleBowlingScoreUpdate = (pinsDown: number, text: string) => {
    setGameState((prev) => {
      if (prev.bowlingPinsDown === pinsDown && prev.bowlingScoreText === text) return prev;
      return {
        ...prev,
        bowlingPinsDown: pinsDown,
        bowlingScoreText: text,
      };
    });
  };

  const handleReset = () => {
    setContextLost(false);
    setRecoveryAttempt((prev) => prev + 1);
  };

  return (
    <CanvasErrorBoundary onReset={handleReset}>
      <Canvas
        key={recoveryAttempt}
        shadows={!isSafeMode}
        dpr={isSafeMode ? 1 : [1, 1.25]}
        camera={{ position: [0, 2.0, -8.7], fov: 60, near: 0.5, far: 380 }}
        style={{ background: '#070a12' }}
        onCreated={({ gl }) => {
          cleanupListenersRef.current?.();
          const canvas = gl.domElement;
          const onContextLost = (e: Event) => {
            e.preventDefault();
            setContextLost(true);
          };
          const onContextRestored = () => {
            setContextLost(false);
          };
          canvas.addEventListener('webglcontextlost', onContextLost);
          canvas.addEventListener('webglcontextrestored', onContextRestored);
          cleanupListenersRef.current = () => {
            canvas.removeEventListener('webglcontextlost', onContextLost);
            canvas.removeEventListener('webglcontextrestored', onContextRestored);
          };
          setContextLost(false);
          onReady?.();
        }}
        gl={
          isSafeMode
            ? {
                antialias: false,
                powerPreference: 'default',
                failIfMajorPerformanceCaveat: false,
                precision: 'mediump',
                stencil: false,
                depth: true,
              }
            : {
                antialias: false,
                powerPreference: 'high-performance',
                failIfMajorPerformanceCaveat: false,
                precision: 'mediump',
                stencil: false,
                depth: true,
              }
        }
      >
        {/* Sleek midnight atmospheric depth fog (tuned for large City + AI Factory world) */}
        <fog attach="fog" args={['#070a12', 110, 380]} />

        {/* Professional studio lighting (Neutral, clean, high-contrast, offline-safe) */}
        <ambientLight color="#94a3b8" intensity={0.75} />
        <hemisphereLight args={['#38bdf8', '#0f172a', 0.65]} />

        {/* Main key spotlight casting crisp realistic vehicle & building shadows */}
        <directionalLight
          position={[28, 48, 24]}
          color="#ffffff"
          intensity={2.2}
          castShadow={!isSafeMode}
          shadow-mapSize={[1024, 1024]}
          shadow-camera-near={1}
          shadow-camera-far={110}
          shadow-camera-left={-28}
          shadow-camera-right={28}
          shadow-camera-top={28}
          shadow-camera-bottom={-28}
          shadow-bias={-0.0003}
          shadow-normalBias={0.04}
        />

        {/* Architectural cyan/azure rim fill light from opposite quadrant */}
        <directionalLight
          position={[-32, 24, -30]}
          color="#38bdf8"
          intensity={1.2}
        />

        <Suspense fallback={null}>
          {/* 3D World environment */}
          <World
            projects={projects}
            activeProjectZoneId={gameState.activeProjectZoneId}
            currentZone={gameState.currentZone}
            gameMode={gameState.gameMode}
            onPositionUpdate={handlePositionUpdate}
            onBowlingScoreUpdate={handleBowlingScoreUpdate}
          />
        </Suspense>

        <Suspense fallback={null}>
          {/* Player car */}
          <Car
            gameState={gameState}
            setGameState={setGameState}
            projects={projects}
          />
        </Suspense>
      </Canvas>

      {contextLost && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(7, 10, 18, 0.92)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f8fafc',
            fontFamily: 'Orbitron, sans-serif',
            padding: '20px',
            textAlign: 'center',
            zIndex: 45,
          }}
        >
          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#38bdf8', marginBottom: '10px' }}>
            WEBGL CONTEXT INTERRUPTED
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', maxWidth: '420px', marginBottom: '18px', lineHeight: 1.5 }}>
            Your browser paused the 3D GPU context. Re-initialize below to resume driving in compatibility mode.
          </div>
          <button
            onClick={handleReset}
            style={{
              padding: '10px 24px',
              background: '#38bdf8',
              color: '#082f49',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 900,
              cursor: 'pointer',
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
            }}
          >
            RE-INITIALIZE SPEEDWAY
          </button>
        </div>
      )}
    </CanvasErrorBoundary>
  );
};
