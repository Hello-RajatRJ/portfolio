import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';

import { Car } from './Car';
import { World } from './World';
import { DayNightCycle } from './world/DayNightCycle';
import type { GameState, Project } from '../types';

interface GameCanvasProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  projects: Project[];
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, setGameState, projects }) => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 4, 22], fov: 65, near: 0.1, far: 300 }}
      style={{ background: '#04040f' }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      {/* Fog for depth and aesthetics */}
      <fog attach="fog" args={['#04040f', 30, 90]} />

      <DayNightCycle />

      <Suspense fallback={null}>

        {/* World environment */}
        <World
          projects={projects}
          activeProjectZoneId={gameState.activeProjectZoneId}
          currentZone={gameState.currentZone}
        />

        {/* Player car with driving physics */}
        <Car
          gameState={gameState}
          setGameState={setGameState}
          projects={projects}
        />
      </Suspense>
    </Canvas>
  );
};
