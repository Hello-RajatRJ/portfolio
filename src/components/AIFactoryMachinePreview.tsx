import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { CanvasErrorBoundary } from './CanvasErrorBoundary';

interface MachineStageSceneProps {
  deptNumber: number;
  simulating: boolean;
}

const MachineModel: React.FC<MachineStageSceneProps> = ({ deptNumber, simulating }) => {
  const rootRef = useRef<Group>(null);
  const rotorRef = useRef<Group>(null);
  const pulseRef = useRef<Group>(null);
  const sweepRef = useRef<Group>(null);

  const cloudDots = useMemo(() => {
    return Array.from({ length: 48 }, (_, i) => {
      const cluster = i % 3;
      const base: [number, number, number] =
        cluster === 0 ? [-0.9, 0.5, 0.3] : cluster === 1 ? [0.9, -0.3, -0.4] : [0.0, 0.8, -0.7];
      const angle = i * 1.7;
      return {
        pos: [
          base[0] + Math.cos(angle) * 0.38,
          base[1] + Math.sin(angle * 1.3) * 0.35,
          base[2] + Math.sin(angle * 0.9) * 0.38,
        ] as [number, number, number],
        col: cluster === 0 ? '#ef4444' : cluster === 1 ? '#fb923c' : '#fff7ed',
      };
    });
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const speed = simulating ? 2.4 : 0.75;
    if (rootRef.current) {
      rootRef.current.rotation.y += delta * 0.32 * speed;
    }
    if (rotorRef.current) {
      rotorRef.current.rotation.y -= delta * 1.4 * speed;
      rotorRef.current.rotation.z = Math.sin(t * speed) * 0.28;
    }
    if (pulseRef.current) {
      const s = 1 + Math.sin(t * 3.2 * speed) * 0.14;
      pulseRef.current.scale.set(s, s, s);
    }
    if (sweepRef.current) {
      sweepRef.current.position.y = Math.sin(t * 2.5 * speed) * 0.75;
    }
  });

  // Tailored 3D machine close-up matching each department's real engineering function
  return (
    <group ref={rootRef}>
      {/* Industrial turntable base */}
      <mesh position={[0, -1.35, 0]}>
        <cylinderGeometry args={[1.95, 2.15, 0.25, 24]} />
        <meshStandardMaterial color="#181920" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0, -1.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.7, 1.92, 32]} />
        <meshBasicMaterial color={simulating ? '#fde047' : '#ef4444'} toneMapped={false} />
      </mesh>

      {/* Dept 01-03: Multi-chute intake, scrubber rotor & rejection splitter */}
      {deptNumber <= 3 && (
        <group>
          <mesh position={[0, -0.45, 0]}>
            <boxGeometry args={[2.8, 0.28, 1.4]} />
            <meshStandardMaterial color="#1f2029" metalness={0.8} />
          </mesh>
          <group ref={rotorRef} position={[0, 0.35, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.72, 0.72, 1.5, 12]} />
              <meshStandardMaterial color="#7f1d1d" metalness={0.8} roughness={0.25} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.82, 0.08, 8, 24]} />
              <meshBasicMaterial color="#fb923c" toneMapped={false} />
            </mesh>
          </group>
          {[-0.85, 0, 0.85].map((cx, i) => (
            <mesh key={cx} position={[cx, 1.2, 0]}>
              <boxGeometry args={[0.42, 0.42, 0.42]} />
              <meshBasicMaterial color={i === 2 && deptNumber === 3 ? '#dc2626' : '#fff7ed'} toneMapped={false} />
            </mesh>
          ))}
        </group>
      )}

      {/* Dept 04-05: OCR Laser Gantry & Hydraulic Chunk Slicer */}
      {(deptNumber === 4 || deptNumber === 5) && (
        <group>
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[2.4, 0.28, 1.8]} />
            <meshStandardMaterial color="#181920" metalness={0.85} />
          </mesh>
          {[-1.05, 1.05].map((px) => (
            <mesh key={px} position={[px, 0.4, 0]}>
              <boxGeometry args={[0.2, 1.8, 0.2]} />
              <meshStandardMaterial color="#991b1b" metalness={0.8} />
            </mesh>
          ))}
          <group ref={sweepRef} position={[0, 0.3, 0]}>
            <mesh>
              <boxGeometry args={[2.1, 0.14, 1.4]} />
              <meshBasicMaterial color={deptNumber === 4 ? '#ef4444' : '#fb923c'} toneMapped={false} />
            </mesh>
          </group>
          {[-0.6, 0, 0.6].map((bx) => (
            <mesh key={bx} position={[bx, -0.15, 0]}>
              <boxGeometry args={[0.45, 0.35, 0.5]} />
              <meshBasicMaterial color="#fde68a" toneMapped={false} />
            </mesh>
          ))}
        </group>
      )}

      {/* Dept 06: 3D Semantic Embedding Point Cluster */}
      {deptNumber === 6 && (
        <group>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[1.35, 1.35, 2.2, 20, 1, true]} />
            <meshStandardMaterial color="#450a0a" transparent opacity={0.2} roughness={0.1} metalness={0.8} />
          </mesh>
          <group ref={pulseRef}>
            {cloudDots.map((d, i) => (
              <mesh key={i} position={d.pos}>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshBasicMaterial color={d.col} toneMapped={false} />
              </mesh>
            ))}
          </group>
        </group>
      )}

      {/* Dept 07-10: Vector DB Racks, Query Core & Search Radar / RAG Assembly */}
      {deptNumber >= 7 && deptNumber <= 10 && (
        <group>
          {[-0.85, 0, 0.85].map((rx, ri) => (
            <group key={rx} position={[rx, 0.1, 0]}>
              <mesh>
                <boxGeometry args={[0.48, 2.1, 0.7]} />
                <meshStandardMaterial color="#13141a" metalness={0.85} roughness={0.25} />
              </mesh>
              {[-0.6, 0, 0.6].map((ry) => (
                <mesh key={ry} position={[0, ry, 0.38]}>
                  <boxGeometry args={[0.32, 0.12, 0.04]} />
                  <meshBasicMaterial color={ri === 1 ? '#fb923c' : '#ef4444'} toneMapped={false} />
                </mesh>
              ))}
            </group>
          ))}
          <group ref={rotorRef} position={[0, 1.35, 0]}>
            <mesh>
              <torusGeometry args={[1.05, 0.08, 10, 28]} />
              <meshBasicMaterial color="#fde047" toneMapped={false} />
            </mesh>
          </group>
        </group>
      )}

      {/* Dept 11: Colossal Transformer Multi-Head Attention Neural Core */}
      {deptNumber === 11 && (
        <group position={[0, 0.2, 0]}>
          <group ref={pulseRef}>
            <mesh>
              <icosahedronGeometry args={[0.68, 1]} />
              <meshStandardMaterial color="#ef4444" emissive="#f97316" emissiveIntensity={1.8} />
            </mesh>
          </group>
          <group ref={rotorRef}>
            <mesh>
              <torusGeometry args={[1.15, 0.09, 10, 32]} />
              <meshBasicMaterial color="#ef4444" toneMapped={false} />
            </mesh>
            <mesh rotation={[Math.PI / 3, 0, 0]}>
              <torusGeometry args={[1.45, 0.07, 10, 32]} />
              <meshBasicMaterial color="#fb923c" toneMapped={false} />
            </mesh>
            <mesh rotation={[0, Math.PI / 4, Math.PI / 2]}>
              <torusGeometry args={[1.7, 0.05, 10, 32]} />
              <meshBasicMaterial color="#fff7ed" toneMapped={false} />
            </mesh>
          </group>
        </group>
      )}

      {/* Dept 12-15: Robotic Agent Arms, Safety Laser Gate, Output Hologram & Ops Spire */}
      {deptNumber >= 12 && (
        <group>
          <group ref={rotorRef} position={[0, 0.25, 0]}>
            <mesh position={[0, -0.3, 0]}>
              <cylinderGeometry args={[0.45, 0.65, 0.9, 12]} />
              <meshStandardMaterial color="#1f2029" metalness={0.85} />
            </mesh>
            <mesh position={[0.45, 0.45, 0]} rotation={[0, 0, -0.5]}>
              <boxGeometry args={[0.22, 1.35, 0.22]} />
              <meshStandardMaterial color="#dc2626" metalness={0.8} />
            </mesh>
            <mesh position={[-0.45, 0.45, 0]} rotation={[0, 0, 0.5]}>
              <boxGeometry args={[0.22, 1.35, 0.22]} />
              <meshBasicMaterial color="#fb923c" toneMapped={false} />
            </mesh>
          </group>
          <mesh position={[0, 1.15, 0]}>
            <octahedronGeometry args={[0.45, 0]} />
            <meshBasicMaterial color="#fff7ed" wireframe toneMapped={false} />
          </mesh>
        </group>
      )}
    </group>
  );
};

export const AIFactoryMachinePreview: React.FC<{ deptNumber: number; simulating: boolean }> = ({
  deptNumber,
  simulating,
}) => {
  return (
    <CanvasErrorBoundary
      fallback={
        <div className="w-full h-full flex items-center justify-center bg-black/60 text-orange-400 font-mono text-xs p-4 text-center">
          3D MACHINE TELEMETRY ACTIVE · STAGE {String(deptNumber).padStart(2, '0')}/15
        </div>
      }
    >
      <Canvas camera={{ position: [0, 1.1, 4.6], fov: 44 }} dpr={[1, 1.25]}>
        <color attach="background" args={['#090a0f']} />
        <ambientLight intensity={0.75} color="#fed7aa" />
        <directionalLight position={[4, 6, 4]} intensity={2.0} color="#ffffff" />
        <pointLight position={[-3, 2, 3]} intensity={3.5} color="#ef4444" />
        <MachineModel deptNumber={deptNumber} simulating={simulating} />
      </Canvas>
    </CanvasErrorBoundary>
  );
};

