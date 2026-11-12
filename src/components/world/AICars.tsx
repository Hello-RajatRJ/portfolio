import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { Text } from '@react-three/drei';
import { carGlobalPosition } from '../CarState';
import { initialAIRacers, RACE_WAYPOINTS, type AIRacer } from './GameModesManager';
import type { GameMode } from '../../types';

interface AICarsProps {
  gameMode: GameMode;
  onPositionUpdate?: (pos: number, total: number) => void;
}

export const AICars: React.FC<AICarsProps> = ({ gameMode, onPositionUpdate }) => {
  const aiRef = useRef<AIRacer[]>(initialAIRacers);
  const groupsRef = useRef<(Group | null)[]>([]);

  useFrame((_state, delta) => {
    // Only simulate racing AI if in racing or free-roam mode
    const dt = Math.min(delta, 0.05);
    const racers = aiRef.current;
    const numWaypoints = RACE_WAYPOINTS.length;

    // 1. Move each AI racer towards next waypoint
    racers.forEach((racer, idx) => {
      if (gameMode !== 'racing' && gameMode !== 'free-roam') return;

      const nextIdx = (racer.waypointIndex + 1) % numWaypoints;
      const nextWp = RACE_WAYPOINTS[nextIdx];

      const dirX = nextWp.x - racer.pos.x;
      const dirZ = nextWp.z - racer.pos.z;
      const distToNext = Math.sqrt(dirX * dirX + dirZ * dirZ);

      // Facing angle
      const targetAngle = Math.atan2(dirX, dirZ);
      racer.rotY += (targetAngle - racer.rotY) * 6.0 * dt;

      // Move forward
      const currentSpeed = gameMode === 'racing' ? racer.topSpeed : racer.speed * 0.7;
      racer.pos.x += Math.sin(racer.rotY) * currentSpeed * dt;
      racer.pos.z += Math.cos(racer.rotY) * currentSpeed * dt;
      racer.totalDistance += currentSpeed * dt;

      // Checkpoint reached
      if (distToNext < 3.5) {
        racer.waypointIndex = nextIdx;
        if (nextIdx === 0) {
          racer.lap += 1;
        }
      }

      // Update 3D Group Transform
      const grp = groupsRef.current[idx];
      if (grp) {
        grp.position.set(racer.pos.x, racer.pos.y, racer.pos.z);
        grp.rotation.y = racer.rotY;
      }
    });

    // 2. Calculate Player's Rank against AI Racers
    const playerPos = carGlobalPosition;
    // Find player's closest waypoint
    let closestWpIdx = 0;
    let minDist = 999;
    RACE_WAYPOINTS.forEach((wp, i) => {
      const d = Math.hypot(playerPos.x - wp.x, playerPos.z - wp.z);
      if (d < minDist) {
        minDist = d;
        closestWpIdx = i;
      }
    });

    // Approximate player's progress
    const playerProgress = closestWpIdx;
    let rank = 1;
    racers.forEach((ai) => {
      // Compare lap and progress
      if (ai.lap > 1) {
        rank++;
      } else if (ai.waypointIndex > playerProgress) {
        rank++;
      }
    });

    onPositionUpdate?.(Math.min(6, rank), 6);
  });

  return (
    <group>
      {initialAIRacers.map((racer, i) => (
        <group
          key={racer.id}
          ref={(el) => { groupsRef.current[i] = el; }}
          position={[racer.pos.x, racer.pos.y, racer.pos.z]}
        >
          {/* Main Car Chassis */}
          <mesh position={[0, 0.32, 0]} castShadow>
            <boxGeometry args={[1.3, 0.45, 2.7]} />
            <meshStandardMaterial
              color={racer.color}
              metalness={0.8}
              roughness={0.15}
              envMapIntensity={2.0}
            />
          </mesh>

          {/* Cabin & Windshield */}
          <mesh position={[0, 0.65, -0.15]}>
            <boxGeometry args={[1.05, 0.35, 1.4]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
          </mesh>

          {/* Dual Racing Stripes */}
          <mesh position={[0, 0.56, 0]}>
            <planeGeometry args={[0.35, 2.6]} />
            <meshBasicMaterial color={racer.accentColor} />
          </mesh>

          {/* Rear Race Spoiler */}
          <mesh position={[0, 0.85, -1.2]}>
            <boxGeometry args={[1.4, 0.08, 0.35]} />
            <meshStandardMaterial color="#18181b" />
          </mesh>
          {[-0.5, 0.5].map((sx) => (
            <mesh key={`sp-${sx}`} position={[sx, 0.65, -1.2]}>
              <cylinderGeometry args={[0.03, 0.03, 0.35, 6]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          ))}

          {/* Racing Number on Roof */}
          <Text
            position={[0, 0.84, -0.15]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.5}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {racer.number}
          </Text>

          {/* 4 Rubber Tires with Chrome Wheels */}
          {[-0.68, 0.68].map((wx) =>
            [-0.85, 0.85].map((wz) => (
              <group key={`tire-${wx}-${wz}`} position={[wx, 0.22, wz]}>
                <mesh rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.26, 0.26, 0.22, 16]} />
                  <meshStandardMaterial color="#18181b" roughness={0.7} />
                </mesh>
                <mesh rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.15, 0.15, 0.24, 12]} />
                  <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.2} />
                </mesh>
              </group>
            ))
          )}

          {/* Glowing Red Taillights */}
          {[-0.45, 0.45].map((lx) => (
            <mesh key={`tail-${lx}`} position={[lx, 0.35, -1.36]}>
              <boxGeometry args={[0.24, 0.08, 0.04]} />
              <meshBasicMaterial color="#ff003c" />
            </mesh>
          ))}

          {/* Glowing Headlights */}
          {[-0.45, 0.45].map((lx) => (
            <mesh key={`head-${lx}`} position={[lx, 0.32, 1.36]}>
              <boxGeometry args={[0.24, 0.08, 0.04]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};
