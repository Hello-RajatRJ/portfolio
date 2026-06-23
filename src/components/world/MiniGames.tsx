import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Mesh } from 'three';
import { Text } from '@react-three/drei';
import { carGlobalPosition } from '../CarState';
import { useStore } from '../../store/useStore';

// Define positions statically outside the component
const coins = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  pos: new Vector3(
    (Math.random() - 0.5) * 36,
    0.5,
    (Math.random() - 0.5) * 36
  )
}));

const checkpoints = [
  new Vector3(18, 0, 20), // Start/End in minigame zone
  new Vector3(-20, 0, 15),
  new Vector3(-25, 0, -25),
  new Vector3(20, 0, -20),
  new Vector3(25, 0, -5),
];

export const MiniGames: React.FC = () => {
  const gameState = useStore((s) => s.gameState);
  const setGameState = useStore((s) => s.setGameState);
  const triggerAchievement = useStore((s) => s.triggerAchievement);

  // Helper refs to prevent constant re-renders for logic
  const collectedCoins = useRef<Set<number>>(new Set());
  const currentCheckpoint = useRef(0);
  
  // State for rendering coins without reading refs during render
  const [localCoinsCollected, setLocalCoinsCollected] = useState<Set<number>>(new Set());

  // Update loop for mini-game logic
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);

    // 1. Coin Collection Logic
    if (gameState.activeMiniGame === 'coins') {
      let newlyCollected = false;
      coins.forEach((coin, i) => {
        if (!collectedCoins.current.has(i)) {
          if (carGlobalPosition.distanceTo(coin.pos) < 2.0) {
            collectedCoins.current.add(i);
            newlyCollected = true;
          }
        }
      });
      
      if (newlyCollected) {
        setLocalCoinsCollected(new Set(collectedCoins.current));
        setGameState(prev => ({ ...prev, coinsCollected: collectedCoins.current.size }));
        if (collectedCoins.current.size === coins.length) {
          // Win!
          setGameState(prev => ({ ...prev, activeMiniGame: 'none' }));
          triggerAchievement("Coin Collector: Collected all 20 hidden coins!");
        }
      }
    }

    // 2. Checkpoint Race Logic
    if (gameState.activeMiniGame === 'race') {
      const targetPos = checkpoints[currentCheckpoint.current];
      if (carGlobalPosition.distanceTo(targetPos) < 4.0) {
        currentCheckpoint.current++;
        setGameState(prev => ({ ...prev, checkpointsCleared: currentCheckpoint.current }));
        
        if (currentCheckpoint.current >= checkpoints.length) {
          // Finish line!
          const timeTaken = (Date.now() - (gameState.raceStartTime || Date.now())) / 1000;
          setGameState(prev => ({ 
            ...prev, 
            activeMiniGame: 'none', 
            raceEndTime: Date.now() 
          }));
          
          const storedBest = localStorage.getItem('race_best_time');
          if (!storedBest || timeTaken < parseFloat(storedBest)) {
            localStorage.setItem('race_best_time', timeTaken.toString());
            triggerAchievement(`🏆 New Personal Best: ${timeTaken.toFixed(1)}s!`);
          } else {
            const best = parseFloat(storedBest);
            triggerAchievement(`Race Finished in ${timeTaken.toFixed(1)}s! (PB: ${best.toFixed(1)}s)`);
          }
          currentCheckpoint.current = 0; // reset
        }
      }
    }

    // 3. Drift Challenge Logic
    if (gameState.activeMiniGame === 'drift') {
      const isDrifting = gameState.drift > 15;
      const addedPoints = isDrifting ? Math.round(gameState.drift * dt * 4) : 0;
      const newTimeLeft = Math.max(0, gameState.driftTimeLeft - dt);

      if (newTimeLeft <= 0) {
        // Complete Drift Game
        const finalScore = gameState.driftPoints + addedPoints;
        setGameState(prev => ({
          ...prev,
          activeMiniGame: 'none',
          driftPoints: 0,
          driftTimeLeft: 30
        }));

        if (finalScore >= 1000) {
          triggerAchievement(`Drift King: Scored ${finalScore} points!`);
        } else {
          triggerAchievement(`Drift Complete! Score: ${finalScore} pts`);
        }
      } else {
        // Continue Drift Game
        if (addedPoints > 0 || Math.abs(gameState.driftTimeLeft - newTimeLeft) > 0.05) {
          setGameState(prev => ({
            ...prev,
            driftPoints: prev.driftPoints + addedPoints,
            driftTimeLeft: newTimeLeft
          }));
        }
      }
    }
  });

  return (
    <group>
      {/* Minigame Starter Zone — subtle neon boundary */}
      <group position={[13, 0, -12]}>
        {/* Small subtle ring marker (not a huge debug ring) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[5.2, 5.5, 48]} />
          <meshBasicMaterial color="#7c3aed" toneMapped={false} opacity={0.4} transparent />
        </mesh>
        {/* Inner zone glow disc */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <circleGeometry args={[5.2, 48]} />
          <meshBasicMaterial color="#a855f7" toneMapped={false} opacity={0.04} transparent />
        </mesh>

        <Text position={[0, 4.5, 0]} fontSize={0.55} color="#a855f7">
          MINI-GAMES
        </Text>
        <Text position={[0, 3.8, 0]} fontSize={0.22} color="rgba(255,255,255,0.6)">
          Enter zone to start a challenge
        </Text>

        {/* Buttons (rendered as 3D physical triggers) */}
        {gameState.activeMiniGame === 'none' && (
          <>
            <MinigameTrigger 
              position={[-5, 0, -5]} 
              title="COINS" 
              color="#ffff00" 
              onTrigger={() => {
                collectedCoins.current.clear();
                setLocalCoinsCollected(new Set());
                setGameState(s => ({ ...s, activeMiniGame: 'coins', coinsCollected: 0 }));
              }} 
            />
            <MinigameTrigger 
              position={[5, 0, -5]} 
              title="RACE" 
              color="#00f0ff" 
              onTrigger={() => {
                currentCheckpoint.current = 0;
                setGameState(s => ({ ...s, activeMiniGame: 'race', checkpointsCleared: 0, raceStartTime: Date.now() }));
              }} 
            />
            <MinigameTrigger 
              position={[0, 0, -8]} 
              title="DRIFT" 
              color="#ff007f" 
              onTrigger={() => {
                setGameState(s => ({ ...s, activeMiniGame: 'drift', driftPoints: 0, driftTimeLeft: 30 }));
              }} 
            />
          </>
        )}
      </group>

      {/* Render Coins */}
      {gameState.activeMiniGame === 'coins' && coins.map((coin, i) => (
        !localCoinsCollected.has(i) && <Coin key={i} position={coin.pos} />
      ))}

      {/* Render Checkpoints */}
      {gameState.activeMiniGame === 'race' && (
        <Checkpoint 
          position={checkpoints[gameState.checkpointsCleared]} 
          index={gameState.checkpointsCleared} 
        />
      )}
      
      {/* Render Drift Arena (just some cones in the center) */}
      {gameState.activeMiniGame === 'drift' && (
        <group position={[0, 0, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
            <ringGeometry args={[10, 10.5, 32]} />
            <meshBasicMaterial color="#ff007f" toneMapped={false} />
          </mesh>
          <Text position={[0, 4.5, 0]} fontSize={0.8} color="#ff007f">DRIFT KING</Text>
          <Text position={[0, 3.7, 0]} fontSize={0.3} color="#ffffff">Drift around the circle to score points!</Text>
          <Text position={[0, 3.0, 0]} fontSize={0.3} color="#ffff00">Score: {gameState.driftPoints}</Text>
          <Text position={[0, 2.5, 0]} fontSize={0.3} color="#00f0ff">Time Left: {Math.ceil(gameState.driftTimeLeft)}s</Text>
          
          <DriftCone position={[4, 0, 4]} />
          <DriftCone position={[-4, 0, 4]} />
          <DriftCone position={[4, 0, -4]} />
          <DriftCone position={[-4, 0, -4]} />
          <DriftCone position={[0, 0, 0]} />
        </group>
      )}
    </group>
  );
};

const MinigameTrigger: React.FC<{ position: [number, number, number], title: string, color: string, onTrigger: () => void }> = ({ position, title, color, onTrigger }) => {
  useFrame(() => {
    // Offset by parent group position (13, 0, -12)
    const pos = new Vector3(...position).add(new Vector3(13, 0, -12));
    if (carGlobalPosition.distanceTo(pos) < 2) {
      onTrigger();
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.5, 1, 1.5]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      <Text position={[0, 1.5, 0]} fontSize={0.3} color="#ffffff">{title}</Text>
    </group>
  );
};

const Coin: React.FC<{ position: Vector3 }> = ({ position }) => {
  const ref = useRef<Mesh>(null);
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.05;
    }
  });
  return (
    <mesh ref={ref} position={position} castShadow>
      <cylinderGeometry args={[0.5, 0.5, 0.1, 16]} />
      <meshStandardMaterial color="#ffff00" metalness={0.8} roughness={0.2} emissive="#ffff00" emissiveIntensity={0.5} />
    </mesh>
  );
};

const Checkpoint: React.FC<{ position: Vector3, index: number }> = ({ position, index }) => {
  return (
    <group position={position}>
      <mesh rotation={[0, 0, 0]} position={[0, 2, 0]}>
        <torusGeometry args={[3, 0.2, 16, 32]} />
        <meshBasicMaterial color="#00f0ff" toneMapped={false} />
      </mesh>
      <Text position={[0, 6, 0]} fontSize={1} color="#00f0ff">
        CHECKPOINT {index + 1}
      </Text>
    </group>
  );
};

const DriftCone: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.5, 0]}>
        <coneGeometry args={[0.4, 1.0, 8]} />
        <meshStandardMaterial color="#ff007f" emissive="#ff007f" emissiveIntensity={0.8} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.8, 0.1, 0.8]} />
        <meshStandardMaterial color="#0c0c1e" roughness={0.5} />
      </mesh>
    </group>
  );
};
