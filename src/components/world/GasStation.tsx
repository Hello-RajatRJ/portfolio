import React, { useRef, Suspense } from 'react';
import { useGLTF, Billboard, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Mesh, PointLight } from 'three';
import { CanvasErrorBoundary } from '../CanvasErrorBoundary';

interface GasStationProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  onRefuelProgress?: (amount: number) => void;
  onRefuelComplete?: () => void;
}

const GasStationModel: React.FC = () => {
  const { scene } = useGLTF('/lowpoly_gas_station.glb');
  const clonedScene = React.useMemo(() => scene.clone(true), [scene]);

  return (
    <group position={[1.29, 0.18, 0.66]} rotation={[0, Math.PI, 0]} scale={[0.36, 0.48, 0.44]}>
      <primitive object={clonedScene} />
    </group>
  );
};

export const GasStation: React.FC<GasStationProps> = ({
  position = [26.5, 0, -18.5],
  rotation = [0, 0, 0],
}) => {
  const ringRef = useRef<Mesh>(null);
  const glowLightRef = useRef<PointLight>(null);

  useFrame((state, delta) => {
    // Pulse refuel ring
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 1.5;
    }

    if (glowLightRef.current) {
      glowLightRef.current.intensity = 3.0 + Math.sin(state.clock.elapsedTime * 4) * 1.5;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* ── 3D LOW POLY GAS STATION MODEL (Normalized 11.2m x 4.9m x 8.6m fit inside E-Ave block) ── */}
      <CanvasErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <GasStationModel />
        </Suspense>
      </CanvasErrorBoundary>

      {/* ── GROUND FUEL STATION PAVED ISLAND BASE ── */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[11.6, 0.08, 9.6]} />
        <meshStandardMaterial color="#1e293b" roughness={0.78} metalness={0.15} />
      </mesh>

      {/* North & South Yellow Safety Curbs (keeps E-W drive-through under canopy open) */}
      {[-4.6, 4.6].map((sz) => (
        <mesh key={`curb-z-${sz}`} position={[0, 0.09, sz]}>
          <boxGeometry args={[11.2, 0.1, 0.24]} />
          <meshBasicMaterial color="#eab308" />
        </mesh>
      ))}

      {/* Glowing Canopy Perimeter Emerald LED Fascia Trim (y = 4.95m visibility beacon) */}
      <mesh position={[-1.5, 4.96, 0]}>
        <boxGeometry args={[4.75, 0.16, 7.1]} />
        <meshStandardMaterial color="#052e16" emissive="#22c55e" emissiveIntensity={1.6} />
      </mesh>

      {/* Rooftop Emergency Fuel Beacon Orb */}
      <mesh position={[-1.5, 5.45, 0]}>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshBasicMaterial color="#4ade80" toneMapped={false} />
      </mesh>

      {/* Drive-In Refuel Lane Green Guide Strips */}
      {[-1.2, 1.2].map((lz) => (
        <mesh key={`lane-${lz}`} position={[-1.6, 0.09, lz]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[7.2, 0.14]} />
          <meshBasicMaterial color="#22c55e" opacity={0.75} transparent />
        </mesh>
      ))}

      {/* ── REFUEL PAD HOLOGRAPHIC DOCKING ZONE DIRECTLY UNDER CANOPY ── */}
      <group position={[-1.6, 0.10, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        {/* Pulsating Target Disc */}
        <mesh ref={ringRef}>
          <ringGeometry args={[1.7, 2.35, 32]} />
          <meshBasicMaterial color="#22c55e" opacity={0.85} transparent toneMapped={false} />
        </mesh>
        {/* Inner Solid Marker */}
        <mesh>
          <circleGeometry args={[1.3, 24]} />
          <meshBasicMaterial color="#10b981" opacity={0.32} transparent />
        </mesh>
      </group>

      <pointLight
        ref={glowLightRef}
        position={[-1.6, 2.8, 0.1]}
        color="#4ade80"
        intensity={4.5}
        distance={14}
      />

      {/* ── CANOPY ARCHITECTURAL HEADER SIGN ── */}
      <Billboard position={[-1.5, 7.2, 0]}>
        {/* High-tech Header Board */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[11.5, 2.2]} />
          <meshBasicMaterial color="#0b111e" />
        </mesh>
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[11.2, 1.9]} />
          <meshBasicMaterial color="#064e3b" />
        </mesh>

        <Text
          position={[0, 0.40, 0.06]}
          fontSize={0.92}
          color="#4ade80"
          outlineWidth={0.075}
          outlineColor="#000000"
          outlineOpacity={1}
          anchorX="center"
          anchorY="middle"
        >
          OCTANE 99 FUEL STATION
        </Text>

        <Text
          position={[0, -0.42, 0.06]}
          fontSize={0.44}
          color="#a7f3d0"
          outlineWidth={0.045}
          outlineColor="#000000"
          outlineOpacity={1}
          anchorX="center"
          anchorY="middle"
        >
          DRIVE UNDER CANOPY · HOLD [E] TO REFUEL
        </Text>
      </Billboard>

      {/* Fuel Pump & Roadside Sign Illumination */}
      {[-3.2, 0.2].map((pz) => (
        <group key={`pump-light-${pz}`} position={[-1.6, 4.1, pz]}>
          <pointLight color="#86efac" intensity={2.4} distance={10} />
        </group>
      ))}
    </group>
  );
};
