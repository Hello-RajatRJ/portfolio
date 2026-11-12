import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { Text } from '@react-three/drei';

export const HotWheelsSky: React.FC = () => {
  const blimpRef = useRef<Group>(null);
  const balloonRef = useRef<Group>(null);
  const cloudsRef = useRef<Group>(null);

  useFrame((_state, delta) => {
    // 1. Animate Racing Blimp cruising across the expanded sky (Portfolio City + AI Factory)
    if (blimpRef.current) {
      blimpRef.current.position.x += delta * 2.2;
      if (blimpRef.current.position.x > 265) {
        blimpRef.current.position.x = -85;
      }
      // Gentle pitch & yaw oscillation
      blimpRef.current.rotation.z = Math.sin(_state.clock.elapsedTime * 0.5) * 0.03;
    }

    // 2. Animate Hot-Air Balloon floating bobbing motion
    if (balloonRef.current) {
      balloonRef.current.position.y = 26 + Math.sin(_state.clock.elapsedTime * 0.4) * 1.2;
      balloonRef.current.rotation.y += delta * 0.05;
    }

    // 3. Gentle cloud drift
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.003;
    }
  });

  return (
    <group>
      {/* ── 1. CINEMATIC MIDNIGHT SKY DOME (Expanded around City + AI Factory) ── */}
      <mesh position={[90, 0, 0]}>
        <sphereGeometry args={[360, 32, 16]} />
        <meshBasicMaterial color="#050814" side={2} depthWrite={false} />
      </mesh>

      {/* Horizon soft twilight gradient band (Anchored deeply below ground base) */}
      <mesh position={[90, -12, 0]}>
        <cylinderGeometry args={[355, 355, 80, 36, 1, true]} />
        <meshBasicMaterial color="#0f172a" side={2} transparent opacity={0.8} depthWrite={false} />
      </mesh>

      {/* Atmospheric Cloud Ring */}
      <group ref={cloudsRef} position={[90, 0, 0]}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const dist = 210 + (i % 3) * 28;
          const cx = Math.cos(rad) * dist;
          const cz = Math.sin(rad) * dist;
          const cy = 42 + (i % 2) * 12;
          return (
            <group key={`cloud-${i}`} position={[cx, cy, cz]} rotation={[0, -rad, 0]}>
              <mesh>
                <sphereGeometry args={[14, 8, 8]} />
                <meshStandardMaterial color="#1e293b" transparent opacity={0.35} roughness={1} />
              </mesh>
              <mesh position={[8, -2, 2]}>
                <sphereGeometry args={[10, 8, 8]} />
                <meshStandardMaterial color="#334155" transparent opacity={0.3} roughness={1} />
              </mesh>
              <mesh position={[-8, -1, -2]}>
                <sphereGeometry args={[11, 8, 8]} />
                <meshStandardMaterial color="#1e293b" transparent opacity={0.3} roughness={1} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* ── 2. HOT AIR BALLOON (Image 1 top left) ── */}
      <group ref={balloonRef} position={[-16, 22, 20]}>
        {/* Main Balloon Envelope */}
        <mesh position={[0, 4.5, 0]}>
          <sphereGeometry args={[4.2, 24, 16]} />
          <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Striped flame accent panels */}
        <mesh position={[0, 4.5, 0]}>
          <cylinderGeometry args={[3.8, 1.4, 4.5, 16]} />
          <meshStandardMaterial color="#f97316" roughness={0.3} />
        </mesh>
        {/* Arena Text on Balloon */}
        <group position={[0, 4.6, 4.0]}>
          <Text
            fontSize={1.2}
            color="#ffffff"
            outlineWidth={0.08}
            outlineColor="#000000"
            outlineOpacity={1}
            anchorX="center"
            anchorY="middle"
          >
            APEX CITY
          </Text>
        </group>
        {/* Burner Glow Ring */}
        <mesh position={[0, 1.8, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.4, 12]} />
          <meshBasicMaterial color="#ffea00" />
        </mesh>
        <pointLight position={[0, 1.8, 0]} color="#f97316" intensity={3.5} distance={15} />
        {/* Ropes */}
        {[-0.8, 0.8].map((rx) =>
          [-0.8, 0.8].map((rz) => (
            <mesh key={`rope-${rx}-${rz}`} position={[rx * 0.6, 1.0, rz * 0.6]}>
              <cylinderGeometry args={[0.02, 0.02, 1.8, 6]} />
              <meshBasicMaterial color="#450a0a" />
            </mesh>
          ))
        )}
        {/* Wicker Basket */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.2, 0.9, 1.2]} />
          <meshStandardMaterial color="#7f1d1d" roughness={0.8} />
        </mesh>
      </group>

      {/* ── 3. HOT WHEELS RACING BLIMP / ZEPPELIN (Image 1 top right) ── */}
      <group ref={blimpRef} position={[16, 26, 22]} rotation={[0, -Math.PI / 3, 0]}>
        {/* Main Aerostat Hull (Deep Red glossy cigar body) */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[3.2, 3.2, 16, 24]} />
          <meshStandardMaterial color="#dc2626" roughness={0.15} metalness={0.35} />
        </mesh>
        {/* Nose cone */}
        <mesh position={[0, 0, 8.8]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[3.2, 3.2, 24]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.15} metalness={0.4} />
        </mesh>
        {/* Tail cone */}
        <mesh position={[0, 0, -8.8]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[3.2, 3.2, 24]} />
          <meshStandardMaterial color="#991b1b" roughness={0.2} metalness={0.4} />
        </mesh>
        {/* Hot Wheels Yellow/Orange side flame decal panel */}
        <mesh position={[3.25, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[10, 2.2]} />
          <meshStandardMaterial color="#f97316" roughness={0.2} />
        </mesh>
        <mesh position={[-3.25, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[10, 2.2]} />
          <meshStandardMaterial color="#f97316" roughness={0.2} />
        </mesh>
        <Text
          position={[3.28, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
          fontSize={1.25}
          color="#ffffff"
          outlineWidth={0.08}
          outlineColor="#000000"
          outlineOpacity={1}
          anchorX="center"
          anchorY="middle"
        >
          VELOCITY GP
        </Text>
        <Text
          position={[-3.28, 0, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          fontSize={1.25}
          color="#ffffff"
          outlineWidth={0.08}
          outlineColor="#000000"
          outlineOpacity={1}
          anchorX="center"
          anchorY="middle"
        >
          VELOCITY GP
        </Text>

        {/* Gondola Passenger Cabin underneath */}
        <mesh position={[0, -3.6, 0]}>
          <boxGeometry args={[1.4, 1.1, 6.0]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Cabin window glow */}
        <mesh position={[0, -3.6, 0]}>
          <boxGeometry args={[1.45, 0.4, 5.2]} />
          <meshBasicMaterial color="#fde047" />
        </mesh>

        {/* Tail Stabilizer Fins (Cross formation) */}
        {/* Top fin */}
        <mesh position={[0, 3.2, -8.5]}>
          <boxGeometry args={[0.2, 3.2, 3.0]} />
          <meshStandardMaterial color="#ffd700" roughness={0.3} />
        </mesh>
        {/* Bottom fin */}
        <mesh position={[0, -3.2, -8.5]}>
          <boxGeometry args={[0.2, 3.2, 3.0]} />
          <meshStandardMaterial color="#ffd700" roughness={0.3} />
        </mesh>
        {/* Left fin */}
        <mesh position={[-3.2, 0, -8.5]}>
          <boxGeometry args={[3.2, 0.2, 3.0]} />
          <meshStandardMaterial color="#ffd700" roughness={0.3} />
        </mesh>
        {/* Right fin */}
        <mesh position={[3.2, 0, -8.5]}>
          <boxGeometry args={[3.2, 0.2, 3.0]} />
          <meshStandardMaterial color="#ffd700" roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
};
