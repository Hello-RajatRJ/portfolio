import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CanvasErrorBoundary } from './CanvasErrorBoundary';

interface ProjectPreview3DProps {
  buildingStyle: string;
  simulating: boolean;
}

const ProjectCoreModel: React.FC<{ buildingStyle: string; simulating: boolean }> = ({
  buildingStyle,
  simulating,
}) => {
  const spinRef = useRef<THREE.Group>(null);
  const ringARef = useRef<THREE.Mesh>(null);
  const ringBRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const speed = simulating ? 2.1 : 0.65;
    const t = state.clock.elapsedTime;

    if (spinRef.current) {
      spinRef.current.rotation.y += dt * speed;
    }
    if (ringARef.current) {
      ringARef.current.rotation.x += dt * speed * 1.1;
      ringARef.current.rotation.z += dt * 0.4;
    }
    if (ringBRef.current) {
      ringBRef.current.rotation.y -= dt * speed * 1.25;
      ringBRef.current.rotation.x += dt * 0.5;
    }
    if (pulseRef.current) {
      const s = 1 + Math.sin(t * (simulating ? 6 : 2.5)) * (simulating ? 0.14 : 0.05);
      pulseRef.current.scale.setScalar(s);
    }
  });

  const renderVariant = () => {
    switch (buildingStyle) {
      case 'medical':
      case 'hospital':
        return (
          <group>
            {/* Biometric Double-Helix Stack */}
            {Array.from({ length: 8 }, (_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const y = -0.75 + (i / 7) * 1.5;
              const r = 0.62;
              return (
                <group key={`helix-${i}`} position={[0, y, 0]}>
                  <mesh position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]}>
                    <sphereGeometry args={[0.11, 12, 12]} />
                    <meshBasicMaterial color="#ef4444" toneMapped={false} />
                  </mesh>
                  <mesh position={[-Math.cos(angle) * r, 0, -Math.sin(angle) * r]}>
                    <sphereGeometry args={[0.11, 12, 12]} />
                    <meshBasicMaterial color="#fb923c" toneMapped={false} />
                  </mesh>
                  <mesh rotation={[0, -angle, Math.PI / 2]}>
                    <cylinderGeometry args={[0.025, 0.025, r * 2, 6]} />
                    <meshBasicMaterial color="#fde047" transparent opacity={0.7} />
                  </mesh>
                </group>
              );
            })}
            <mesh ref={ringARef} rotation={[Math.PI / 3, 0, 0]}>
              <torusGeometry args={[1.05, 0.035, 10, 40]} />
              <meshBasicMaterial color="#f97316" toneMapped={false} />
            </mesh>
          </group>
        );

      case 'library':
      case 'school':
        return (
          <group>
            {/* Knowledge Graph Tiered Stack */}
            {[
              { y: -0.62, w: 1.55, color: '#ef4444' },
              { y: -0.2, w: 1.25, color: '#f97316' },
              { y: 0.22, w: 0.96, color: '#fb923c' },
              { y: 0.64, w: 0.66, color: '#fde047' },
            ].map((tier, i) => (
              <group key={`tier-${i}`} position={[0, tier.y, 0]}>
                <mesh>
                  <boxGeometry args={[tier.w, 0.24, tier.w]} />
                  <meshStandardMaterial
                    color="#1a1b24"
                    emissive={tier.color}
                    emissiveIntensity={simulating ? 0.5 : 0.25}
                    metalness={0.82}
                    roughness={0.22}
                  />
                </mesh>
                <mesh>
                  <boxGeometry args={[tier.w + 0.06, 0.045, tier.w + 0.06]} />
                  <meshBasicMaterial color={tier.color} toneMapped={false} />
                </mesh>
              </group>
            ))}
            <mesh ref={ringBRef} position={[0, 0.1, 0]}>
              <torusGeometry args={[1.15, 0.03, 10, 42]} />
              <meshBasicMaterial color="#ef4444" toneMapped={false} />
            </mesh>
          </group>
        );

      case 'social':
        return (
          <group>
            {/* Connected Social Mesh Hub */}
            <mesh ref={pulseRef}>
              <icosahedronGeometry args={[0.48, 0]} />
              <meshStandardMaterial
                color="#dc2626"
                emissive="#ef4444"
                emissiveIntensity={simulating ? 1.15 : 0.65}
                metalness={0.5}
                roughness={0.2}
              />
            </mesh>
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const a = (i / 6) * Math.PI * 2;
              const y = i % 2 === 0 ? 0.42 : -0.42;
              const rx = Math.cos(a) * 0.98;
              const rz = Math.sin(a) * 0.98;
              return (
                <group key={`mesh-node-${i}`}>
                  <mesh position={[rx, y, rz]}>
                    <octahedronGeometry args={[0.16, 0]} />
                    <meshBasicMaterial color={i % 2 === 0 ? '#fb923c' : '#fde047'} toneMapped={false} />
                  </mesh>
                  <mesh position={[rx * 0.5, y * 0.5, rz * 0.5]} rotation={[0, -a, y > 0 ? 0.4 : -0.4]}>
                    <boxGeometry args={[0.92, 0.025, 0.025]} />
                    <meshBasicMaterial color="#f87171" transparent opacity={0.75} />
                  </mesh>
                </group>
              );
            })}
            <mesh ref={ringARef}>
              <torusGeometry args={[1.12, 0.03, 10, 40]} />
              <meshBasicMaterial color="#fb923c" toneMapped={false} />
            </mesh>
          </group>
        );

      case 'tech':
        return (
          <group>
            {/* AI / Neural Inference Core */}
            <mesh ref={pulseRef}>
              <icosahedronGeometry args={[0.56, 1]} />
              <meshBasicMaterial color="#fb923c" wireframe toneMapped={false} />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.32, 18, 18]} />
              <meshBasicMaterial color="#ef4444" toneMapped={false} />
            </mesh>
            <mesh ref={ringARef}>
              <torusGeometry args={[0.98, 0.04, 10, 44]} />
              <meshBasicMaterial color="#ef4444" toneMapped={false} />
            </mesh>
            <mesh ref={ringBRef} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[1.18, 0.035, 10, 44]} />
              <meshBasicMaterial color="#fde047" toneMapped={false} />
            </mesh>
          </group>
        );

      case 'finance':
        return (
          <group>
            {/* Tax Engine Crystal Ledger */}
            <mesh ref={pulseRef}>
              <octahedronGeometry args={[0.72, 0]} />
              <meshStandardMaterial
                color="#7f1d1d"
                emissive="#ef4444"
                emissiveIntensity={simulating ? 1.1 : 0.65}
                metalness={0.85}
                roughness={0.18}
              />
            </mesh>
            <mesh>
              <octahedronGeometry args={[0.8, 0]} />
              <meshBasicMaterial color="#fde047" wireframe toneMapped={false} />
            </mesh>
            {[0, 1, 2, 3].map((i) => {
              const a = (i / 4) * Math.PI * 2;
              return (
                <mesh
                  key={`slab-${i}`}
                  position={[Math.cos(a) * 1.05, 0, Math.sin(a) * 1.05]}
                  rotation={[0, -a, 0]}
                >
                  <boxGeometry args={[0.14, 0.9, 0.34]} />
                  <meshStandardMaterial color="#1f202a" emissive="#f97316" emissiveIntensity={0.4} metalness={0.85} roughness={0.25} />
                </mesh>
              );
            })}
          </group>
        );

      default:
        // Commerce / Marketplace Pavilion Node
        return (
          <group>
            <mesh ref={pulseRef}>
              <boxGeometry args={[0.88, 1.12, 0.88]} />
              <meshStandardMaterial
                color="#171821"
                emissive="#dc2626"
                emissiveIntensity={simulating ? 0.85 : 0.45}
                metalness={0.85}
                roughness={0.22}
              />
            </mesh>
            <mesh>
              <boxGeometry args={[0.96, 1.2, 0.96]} />
              <meshBasicMaterial color="#f97316" wireframe toneMapped={false} />
            </mesh>
            <mesh ref={ringARef}>
              <torusGeometry args={[1.08, 0.035, 10, 42]} />
              <meshBasicMaterial color="#ef4444" toneMapped={false} />
            </mesh>
            <mesh ref={ringBRef} rotation={[Math.PI / 2.2, 0.3, 0]}>
              <torusGeometry args={[1.22, 0.03, 10, 42]} />
              <meshBasicMaterial color="#fde047" toneMapped={false} />
            </mesh>
          </group>
        );
    }
  };

  return (
    <group>
      {/* Turntable Industrial Inspection Pedestal */}
      <mesh position={[0, -1.16, 0]}>
        <cylinderGeometry args={[1.55, 1.72, 0.22, 32]} />
        <meshStandardMaterial color="#181922" metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[0, -1.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.28, 1.48, 36]} />
        <meshBasicMaterial color={simulating ? '#fb923c' : '#ef4444'} toneMapped={false} />
      </mesh>
      <group ref={spinRef}>{renderVariant()}</group>
    </group>
  );
};

export const ProjectPreview3D: React.FC<ProjectPreview3DProps> = ({
  buildingStyle,
  simulating,
}) => {
  return (
    <div className="w-full h-56 md:h-64 rounded-xl overflow-hidden border border-red-500/40 bg-[#090a0f] relative">
      <CanvasErrorBoundary
        fallback={
          <div className="w-full h-full flex items-center justify-center text-xs font-mono text-red-400">
            3D HOLOGRAPHIC PREVIEW UNAVAILABLE
          </div>
        }
      >
        <Canvas camera={{ position: [0, 0.95, 4.3], fov: 44 }} dpr={[1, 1.25]}>
          <color attach="background" args={['#090a0f']} />
          <ambientLight intensity={0.75} />
          <pointLight position={[3, 4, 3]} intensity={2.4} color="#fb923c" />
          <pointLight position={[-3, 2, -2]} intensity={1.8} color="#ef4444" />
          <ProjectCoreModel buildingStyle={buildingStyle} simulating={simulating} />
        </Canvas>
      </CanvasErrorBoundary>
      <div className="pointer-events-none absolute top-2.5 left-3 px-2 py-0.5 rounded bg-black/75 border border-red-500/40 text-[10px] font-mono tracking-wider text-orange-300">
        {simulating ? '● LIVE SYSTEM SIMULATION ACTIVE' : 'LIVE 3D HOLOGRAPHIC CORE'}
      </div>
    </div>
  );
};

