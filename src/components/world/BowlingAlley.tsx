import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { Text } from '@react-three/drei';
import { carGlobalPosition } from '../CarState';
import { globalBowlingPins } from './GameModesManager';
import confetti from 'canvas-confetti';

interface BowlingAlleyProps {
  onScoreUpdate?: (pinsDown: number, text: string) => void;
}

export const BowlingAlley: React.FC<BowlingAlleyProps> = ({ onScoreUpdate }) => {
  const pinsGroupRef = useRef<Group>(null);
  const strikeTriggered = useRef(false);
  const lastReportedScore = useRef(-1);

  useFrame((_state, delta) => {
    const dt = Math.min(delta, 0.05);
    const carPos = carGlobalPosition;

    let pinsDownCount = 0;

    globalBowlingPins.forEach((pin) => {
      // 1. Collision detection with car
      const dx = pin.pos.x - carPos.x;
      const dz = pin.pos.z - carPos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      // Car radius (~1.1) + Pin radius (~0.35)
      if (dist < 1.45) {
        const nx = dx / (dist || 1);
        const nz = dz / (dist || 1);
        const impactSpeed = 16.0;

        pin.vel.x = nx * impactSpeed + (Math.random() - 0.5) * 6;
        pin.vel.z = nz * impactSpeed + (Math.random() - 0.5) * 6;
        pin.vel.y = Math.random() * 5 + 3.0;

        pin.rotVel.x = (Math.random() - 0.5) * 12;
        pin.rotVel.z = (Math.random() - 0.5) * 12;
        pin.isDown = true;
      }

      // 2. Physics integration for pins
      if (pin.vel.lengthSq() > 0.01 || pin.pos.y > 0.45) {
        pin.pos.x += pin.vel.x * dt;
        pin.pos.z += pin.vel.z * dt;
        pin.pos.y += pin.vel.y * dt;

        // Gravity
        if (pin.pos.y > 0.45) {
          pin.vel.y -= 25.0 * dt;
        } else {
          pin.pos.y = 0.45;
          pin.vel.y = -pin.vel.y * 0.3; // bounce
          pin.vel.x *= 0.92; // friction
          pin.vel.z *= 0.92;
        }

        // Angular rotation tumble
        pin.rot.x += pin.rotVel.x * dt;
        pin.rot.z += pin.rotVel.z * dt;
        pin.rotVel.x *= 0.95;
        pin.rotVel.z *= 0.95;

        // If tilted over, mark as down
        if (Math.abs(pin.rot.x) > 0.5 || Math.abs(pin.rot.z) > 0.5) {
          pin.isDown = true;
        }
      }

      if (pin.isDown) {
        pinsDownCount++;
      }
    });

    // 3. Update scores and celebrate strike (only notify on actual score change to prevent 90fps re-render loops)
    if (pinsDownCount === 0 && (strikeTriggered.current || lastReportedScore.current !== 0)) {
      strikeTriggered.current = false;
      lastReportedScore.current = 0;
    } else if (pinsDownCount === 10 && !strikeTriggered.current) {
      strikeTriggered.current = true;
      lastReportedScore.current = 10;
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      onScoreUpdate?.(10, 'STRIKE! 10/10 PINS SMASHED! 🎳🔥');
    } else if (pinsDownCount > 0 && pinsDownCount < 10 && pinsDownCount !== lastReportedScore.current) {
      lastReportedScore.current = pinsDownCount;
      onScoreUpdate?.(pinsDownCount, `${pinsDownCount}/10 PINS DOWN!`);
    }

    // Update Three.js mesh transforms
    if (pinsGroupRef.current) {
      globalBowlingPins.forEach((pin, i) => {
        const pinMesh = pinsGroupRef.current?.children[i] as Group;
        if (pinMesh) {
          pinMesh.position.copy(pin.pos);
          pinMesh.rotation.set(pin.rot.x, pin.rot.y, pin.rot.z);
        }
      });
    }
  });

  return (
    <group>
      {/* ── DEDICATED SEPARATE BOWLING RUNWAY LANE (x: 65, z: -20 to 12) ── */}
      <mesh position={[65, 0.02, -4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4.4, 32]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.15} metalness={0.2} />
      </mesh>

      {/* Safety Gutter Curbs */}
      {[-2.3, 2.3].map((gx) => (
        <mesh key={`gutter-${gx}`} position={[65 + gx, 0.1, -4]}>
          <boxGeometry args={[0.25, 0.2, 32]} />
          <meshStandardMaterial color="#18080c" metalness={0.8} />
        </mesh>
      ))}

      {/* Runway Speed Arrow Chevrons */}
      {[-16, -10, -4, 2].map((rz) => (
        <mesh key={`bowling-arr-${rz}`} position={[65, 0.03, rz]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.6, 0.4]} />
          <meshBasicMaterial color="#fde047" />
        </mesh>
      ))}

      {/* Overhead "BOWLING CHALLENGE" Banner Arch */}
      <group position={[65, 0, -18]}>
        <mesh position={[-2.4, 2.5, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 5, 8]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        <mesh position={[2.4, 2.5, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 5, 8]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        <mesh position={[0, 5.0, 0]}>
          <boxGeometry args={[5.2, 1.0, 0.3]} />
          <meshStandardMaterial color="#7f1d1d" />
        </mesh>
        <Text
          position={[0, 5.0, 0.18]}
          fontSize={0.48}
          color="#fde047"
          outlineWidth={0.045}
          outlineColor="#000000"
          outlineOpacity={1}
          anchorX="center"
          anchorY="middle"
        >
          BOWLING CHALLENGE 🎳
        </Text>
      </group>

      {/* ── 10 GIANT BOWLING PINS ── */}
      <group ref={pinsGroupRef}>
        {globalBowlingPins.map((pin) => (
          <group key={`pin-${pin.id}`} position={pin.initialPos}>
            {/* Lower Pin Base Body */}
            <mesh position={[0, 0.3, 0]} castShadow>
              <cylinderGeometry args={[0.26, 0.18, 0.6, 16]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.15} metalness={0.1} />
            </mesh>
            {/* Bulging Mid Belly */}
            <mesh position={[0, 0.65, 0]} castShadow>
              <sphereGeometry args={[0.28, 16, 16]} />
              <meshStandardMaterial color="#ffffff" roughness={0.15} metalness={0.1} />
            </mesh>
            {/* Tapered Neck */}
            <mesh position={[0, 0.95, 0]}>
              <cylinderGeometry args={[0.12, 0.22, 0.5, 16]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.15} />
            </mesh>
            {/* Red Stripe 1 */}
            <mesh position={[0, 0.95, 0]}>
              <cylinderGeometry args={[0.15, 0.17, 0.06, 16]} />
              <meshStandardMaterial color="#dc2626" roughness={0.2} />
            </mesh>
            {/* Red Stripe 2 */}
            <mesh position={[0, 1.05, 0]}>
              <cylinderGeometry args={[0.13, 0.14, 0.06, 16]} />
              <meshStandardMaterial color="#dc2626" roughness={0.2} />
            </mesh>
            {/* Rounded Head Crown */}
            <mesh position={[0, 1.25, 0]} castShadow>
              <sphereGeometry args={[0.17, 16, 16]} />
              <meshStandardMaterial color="#ffffff" roughness={0.15} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};
