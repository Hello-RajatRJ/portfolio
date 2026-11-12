import React, { Suspense } from 'react';
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

  return (
    <CanvasErrorBoundary>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 2.0, -8.7], fov: 60, near: 0.5, far: 560 }}
        style={{ background: '#070a12' }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
          });
          onReady?.();
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false,
          precision: 'highp',
        }}
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
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-near={1}
          shadow-camera-far={140}
          shadow-camera-left={-35}
          shadow-camera-right={35}
          shadow-camera-top={35}
          shadow-camera-bottom={-35}
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

          {/* Player car */}
          <Car
            gameState={gameState}
            setGameState={setGameState}
            projects={projects}
          />
        </Suspense>
      </Canvas>
    </CanvasErrorBoundary>
  );
};
