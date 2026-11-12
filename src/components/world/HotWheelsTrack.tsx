import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group, TorusGeometry, MeshStandardMaterial, MeshBasicMaterial } from 'three';
import { Text } from '@react-three/drei';
import { BOOST_PADS } from './HotWheelsPhysics';

// ─── 1. ICONIC HOT WHEELS UNLEASHED TRACK SEGMENT ──────────────────────────
// High-gloss molded flame-orange plastic with longitudinal seam grooves,
// raised rails, embedded rectangular white LED reflectors, and snap clips.
interface TrackSegmentProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  length: number;
  width?: number;
  incline?: number; // pitch slope
  bank?: number;    // roll angle for banked curves (matches hotwheels.jpeg)
  hasConnector?: boolean;
  hasDriftStrip?: boolean; // Dark asphalt with yellow chevrons (matches hotwheels1.jpeg)
}

export const TrackSegment: React.FC<TrackSegmentProps> = ({
  position,
  rotation = [0, 0, 0],
  length,
  width = 4.6,
  incline = 0,
  bank = 0,
  hasConnector = true,
  hasDriftStrip = false,
}) => {
  const halfW = width / 2;
  const railThick = 0.14;
  const railHeight = 0.28;

  // Authentic Hot Wheels Unleashed glossy orange plastic material
  const orangeTrackMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#ff4800',
        roughness: 0.12,
        metalness: 0.18,
        envMapIntensity: 2.4,
      }),
    []
  );

  const orangeGrooveMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#d43a00',
        roughness: 0.25,
        metalness: 0.15,
      }),
    []
  );

  const blueRailMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#0055ff',
        roughness: 0.16,
        metalness: 0.35,
        envMapIntensity: 1.9,
      }),
    []
  );

  const whiteLedMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#ffffff',
        emissive: '#f0f9ff',
        emissiveIntensity: 3.5,
        toneMapped: false,
      }),
    []
  );

  const yellowStripeMat = useMemo(
    () =>
      new MeshBasicMaterial({
        color: '#ffd000',
        toneMapped: false,
      }),
    []
  );

  const connectorMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#0040cc',
        roughness: 0.3,
        metalness: 0.5,
      }),
    []
  );

  const darkUnderbodyMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#111827',
        roughness: 0.7,
        metalness: 0.6,
      }),
    []
  );

  // Number of reflector markers along this segment
  const reflectorCount = Math.max(1, Math.floor(length / 2.2));

  return (
    <group position={position} rotation={rotation}>
      <group rotation={[incline, 0, bank]}>
        {/* Main High-Gloss Flame Orange Track Bed */}
        <mesh position={[0, 0, length / 2]} receiveShadow castShadow>
          <boxGeometry args={[width, 0.12, length]} />
          <primitive object={orangeTrackMat} attach="material" />
        </mesh>

        {/* Longitudinal Injection Mold Seam Grooves (matches hotwheels1.jpeg) */}
        {[-halfW * 0.55, halfW * 0.55].map((gx, idx) => (
          <mesh key={`groove-${idx}`} position={[gx, 0.061, length / 2]} receiveShadow>
            <boxGeometry args={[0.03, 0.005, length]} />
            <primitive object={orangeGrooveMat} attach="material" />
          </mesh>
        ))}

        {/* Optional Textured Dark Drift Strip with Yellow Chevrons (hotwheels1.jpeg) */}
        {hasDriftStrip && (
          <group position={[0, 0.062, length / 2]}>
            <mesh receiveShadow>
              <boxGeometry args={[width * 0.75, 0.004, length * 0.98]} />
              <meshStandardMaterial color="#18181b" roughness={0.9} metalness={0.2} />
            </mesh>
            {/* Bold Yellow Directional Drift Chevrons */}
            {Array.from({ length: Math.floor(length / 1.8) }).map((_, ci) => (
              <mesh
                key={`drift-chev-${ci}`}
                position={[0, 0.006, -length / 2 + 1.0 + ci * 1.8]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <planeGeometry args={[1.6, 0.5]} />
                <meshBasicMaterial color="#ffd700" toneMapped={false} />
              </mesh>
            ))}
          </group>
        )}

        {/* Structural Dark Underbody Plate */}
        <mesh position={[0, -0.07, length / 2]} receiveShadow>
          <boxGeometry args={[width * 0.95, 0.04, length]} />
          <primitive object={darkUnderbodyMat} attach="material" />
        </mesh>

        {/* Left Electric Blue Raised Side Rail */}
        <mesh position={[-halfW + railThick / 2, railHeight / 2 + 0.05, length / 2]} castShadow receiveShadow>
          <boxGeometry args={[railThick, railHeight, length]} />
          <primitive object={blueRailMat} attach="material" />
        </mesh>

        {/* Right Electric Blue Raised Side Rail */}
        <mesh position={[halfW - railThick / 2, railHeight / 2 + 0.05, length / 2]} castShadow receiveShadow>
          <boxGeometry args={[railThick, railHeight, length]} />
          <primitive object={blueRailMat} attach="material" />
        </mesh>

        {/* Embedded White LED Reflector Strips (hotwheels1.jpeg & hotwheels2.jpeg) */}
        {Array.from({ length: reflectorCount }).map((_, ri) => {
          const rz = (ri + 0.5) * (length / reflectorCount);
          return (
            <group key={`led-pair-${ri}`}>
              {/* Left inner rail reflector */}
              <mesh position={[-halfW + railThick + 0.015, 0.16, rz]}>
                <boxGeometry args={[0.025, 0.06, 0.45]} />
                <primitive object={whiteLedMat} attach="material" />
              </mesh>
              {/* Right inner rail reflector */}
              <mesh position={[halfW - railThick - 0.015, 0.16, rz]}>
                <boxGeometry args={[0.025, 0.06, 0.45]} />
                <primitive object={whiteLedMat} attach="material" />
              </mesh>
            </group>
          );
        })}

        {/* Center Golden Dual Racing Lines */}
        {!hasDriftStrip && (
          <>
            <mesh position={[-0.22, 0.065, length / 2]}>
              <boxGeometry args={[0.08, 0.005, length]} />
              <primitive object={yellowStripeMat} attach="material" />
            </mesh>
            <mesh position={[0.22, 0.065, length / 2]}>
              <boxGeometry args={[0.08, 0.005, length]} />
              <primitive object={yellowStripeMat} attach="material" />
            </mesh>
          </>
        )}

        {/* Iconic Snap Connector Joiner Clip on Track End (hotwheels1.jpeg) */}
        {hasConnector && (
          <group position={[0, -0.04, length]}>
            <mesh castShadow>
              <boxGeometry args={[width * 1.04, 0.16, 0.28]} />
              <primitive object={connectorMat} attach="material" />
            </mesh>
            {/* Locking Tabs */}
            <mesh position={[-halfW - 0.05, 0.08, 0]}>
              <boxGeometry args={[0.08, 0.22, 0.24]} />
              <primitive object={connectorMat} attach="material" />
            </mesh>
            <mesh position={[halfW + 0.05, 0.08, 0]}>
              <boxGeometry args={[0.08, 0.22, 0.24]} />
              <primitive object={connectorMat} attach="material" />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
};

// ─── 2. TUBULAR DOWEL SUPPORT PILLAR ───────────────────────────────────────
// White tubular dowel poles with gold/blue clamp collars (matches hotwheels1.jpeg)
const SupportPillar: React.FC<{
  position: [number, number, number];
  height: number;
  color?: string;
}> = ({ position, height, color = '#f8fafc' }) => {
  return (
    <group position={position}>
      {/* Main Dowel Tube */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.26, height, 16]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.4} />
      </mesh>
      {/* Gold Clamp Ring */}
      <mesh position={[0, height * 0.85, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.22, 16]} />
        <meshStandardMaterial color="#ffd700" roughness={0.2} metalness={0.7} />
      </mesh>
      {/* Top Mounting Collar Under Track */}
      <mesh position={[0, height, 0]}>
        <cylinderGeometry args={[0.42, 0.35, 0.18, 16]} />
        <meshStandardMaterial color="#0055ff" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Heavy Steel Ground Base */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.6, 0.72, 0.16, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
    </group>
  );
};

// ─── 3. STUNT FLAMING HOOP / RING OF FIRE ──────────────────────────────────
const FlamingStuntRing: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const outerRingRef = useRef<Mesh>(null);
  const innerRingRef = useRef<Mesh>(null);

  const ringGeo = useMemo(() => new TorusGeometry(2.6, 0.22, 16, 32), []);

  useFrame((_, delta) => {
    if (outerRingRef.current) outerRingRef.current.rotation.z += delta * 1.5;
    if (innerRingRef.current) innerRingRef.current.rotation.z -= delta * 2.2;
  });

  return (
    <group position={position}>
      {/* Supporting truss columns */}
      <mesh position={[-3.4, -1.8, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.25, 4.0, 8]} />
        <meshStandardMaterial color="#0052cc" metalness={0.6} />
      </mesh>
      <mesh position={[3.4, -1.8, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.25, 4.0, 8]} />
        <meshStandardMaterial color="#0052cc" metalness={0.6} />
      </mesh>

      {/* Outer Flame Ring */}
      <mesh ref={outerRingRef} geometry={ringGeo}>
        <meshStandardMaterial
          color="#ff3300"
          emissive="#ff5500"
          emissiveIntensity={3.8}
          toneMapped={false}
        />
      </mesh>

      {/* Inner Plasma Core */}
      <mesh ref={innerRingRef} geometry={ringGeo} scale={[0.88, 0.88, 0.88]}>
        <meshBasicMaterial color="#ffff00" wireframe transparent opacity={0.7} toneMapped={false} />
      </mesh>

      <pointLight color="#ff6600" intensity={7} distance={14} />

      {/* Floating Stunt Banner */}
      <Text position={[0, 3.4, 0.1]} fontSize={0.42} color="#ffd700" anchorX="center" anchorY="middle">
        🔥 MEGA AIR STUNT 🔥
      </Text>
    </group>
  );
};

// ─── 4. HOT WHEELS MOTORIZED BOOSTER STATION ───────────────────────────────
// Yellow friction rollers & animated neon chevrons (matches hotwheels1.jpeg & hotwheels3.jpeg)
const BoosterStation: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
}> = ({ position, rotation = [0, 0, 0] }) => {
  const wheelLRef = useRef<Mesh>(null);
  const wheelRRef = useRef<Mesh>(null);
  const chevronRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (wheelLRef.current) wheelLRef.current.rotation.x += delta * 25;
    if (wheelRRef.current) wheelRRef.current.rotation.x += delta * 25;

    if (chevronRef.current) {
      chevronRef.current.position.z = (Date.now() * 0.007) % 1.6;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Left Motor Housing */}
      <group position={[-2.45, 0.45, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.85, 1.8]} />
          <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh ref={wheelLRef} rotation={[0, 0, Math.PI / 2]} position={[0.24, 0, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.28, 16]} />
          <meshStandardMaterial color="#ffd700" roughness={0.7} />
        </mesh>
      </group>

      {/* Right Motor Housing */}
      <group position={[2.45, 0.45, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.85, 1.8]} />
          <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh ref={wheelRRef} rotation={[0, 0, Math.PI / 2]} position={[-0.24, 0, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.28, 16]} />
          <meshStandardMaterial color="#ffd700" roughness={0.7} />
        </mesh>
      </group>

      {/* Embedded Dark Rubber Accelerator Pad on Track */}
      <mesh position={[0, 0.062, 0]}>
        <boxGeometry args={[2.2, 0.01, 2.4]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>

      {/* Glowing Neon Accelerator Chevrons */}
      <group ref={chevronRef} position={[0, 0.07, 0]}>
        {[-0.8, -0.2, 0.4].map((offsetZ, i) => (
          <group key={i} position={[0, 0, offsetZ]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.22, 0.48, 3, 1, 0, Math.PI]} />
              <meshBasicMaterial color="#00f0ff" toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>

      <pointLight position={[0, 0.4, 0]} color="#00f0ff" intensity={4.5} distance={6} />
    </group>
  );
};

// ─── 5. TWIN 360° VERTICAL STUNT LOOPS (Matches hotwheels.jpeg) ─────────────
const TwinVerticalLoops: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const loopRadius = 4.8;

  return (
    <group position={position}>
      {/* Primary Loop 1 */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, loopRadius, 0]} castShadow receiveShadow>
          <torusGeometry args={[loopRadius, 0.55, 16, 48, Math.PI * 1.95]} />
          <meshStandardMaterial color="#ff4800" roughness={0.14} metalness={0.2} />
        </mesh>
        <mesh position={[0.55, loopRadius, 0]}>
          <torusGeometry args={[loopRadius + 0.12, 0.08, 12, 48, Math.PI * 1.95]} />
          <meshStandardMaterial color="#0055ff" roughness={0.2} metalness={0.4} />
        </mesh>
        <mesh position={[-0.55, loopRadius, 0]}>
          <torusGeometry args={[loopRadius + 0.12, 0.08, 12, 48, Math.PI * 1.95]} />
          <meshStandardMaterial color="#0055ff" roughness={0.2} metalness={0.4} />
        </mesh>
      </group>

      {/* Secondary Concentric Loop 2 (Offset by 3.5m, as seen in hotwheels.jpeg) */}
      <group position={[3.5, 0, 1.2]}>
        <mesh position={[0, loopRadius * 0.9, 0]} castShadow receiveShadow>
          <torusGeometry args={[loopRadius * 0.9, 0.52, 16, 48, Math.PI * 1.95]} />
          <meshStandardMaterial color="#ff5500" roughness={0.14} metalness={0.2} />
        </mesh>
        <mesh position={[0.52, loopRadius * 0.9, 0]}>
          <torusGeometry args={[loopRadius * 0.9 + 0.12, 0.08, 12, 48, Math.PI * 1.95]} />
          <meshStandardMaterial color="#0055ff" roughness={0.2} metalness={0.4} />
        </mesh>
        <mesh position={[-0.52, loopRadius * 0.9, 0]}>
          <torusGeometry args={[loopRadius * 0.9 + 0.12, 0.08, 12, 48, Math.PI * 1.95]} />
          <meshStandardMaterial color="#0055ff" roughness={0.2} metalness={0.4} />
        </mesh>
      </group>

      {/* Structural Steel Scaffolding Towers */}
      {[-3.5, 1.8, 6.0].map((x) => (
        <mesh key={`scaffold-${x}`} position={[x, loopRadius * 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.25, loopRadius * 1.4, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
      ))}

      {/* Overhead Hot Wheels Neon Emblem */}
      <Text position={[1.8, loopRadius * 2 + 0.8, 0.1]} fontSize={0.7} color="#ff5500" anchorX="center" anchorY="middle">
        HOT WHEELS
      </Text>
      <Text position={[1.8, loopRadius * 2 + 0.15, 0.1]} fontSize={0.32} color="#ffd700" anchorX="center" anchorY="middle">
        360° TWIN LOOPS
      </Text>
    </group>
  );
};

// ─── 6. AUTHENTIC HOT WHEELS UNLEASHED START / FINISH ARCH GANTRY ──────────
// 1:1 match with hotwheels2.jpeg & hotwheels3.jpeg
const RacingArchGantry: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Industrial Grey/Blue Steel Lattice Side Towers */}
      <mesh position={[-2.8, 2.2, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.24, 4.4, 8]} />
        <meshStandardMaterial color="#0052cc" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[2.8, 2.2, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.24, 4.4, 8]} />
        <meshStandardMaterial color="#0052cc" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Yellow/Black Safety Hazard Banding on tower bases */}
      {[-2.8, 2.8].map((tx) => (
        <mesh key={`tower-base-${tx}`} position={[tx, 0.6, 0]}>
          <cylinderGeometry args={[0.26, 0.28, 0.6, 8]} />
          <meshStandardMaterial color="#ffd700" roughness={0.4} />
        </mesh>
      ))}

      {/* Cross Overhead Steel Support Truss */}
      <mesh position={[0, 4.4, 0]} castShadow>
        <boxGeometry args={[6.2, 0.45, 0.45]} />
        <meshStandardMaterial color="#0052cc" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Sky Blue Arch Backdrop (hotwheels2.jpeg & hotwheels3.jpeg) */}
      <mesh position={[0, 4.6, 0]}>
        <boxGeometry args={[5.2, 1.25, 0.16]} />
        <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.3} />
      </mesh>

      {/* Blazing Yellow / Orange Flame Crest Wings shooting from top & sides */}
      {/* Top Flame Crest */}
      <mesh position={[0, 5.35, 0.02]} rotation={[0, 0, 0]}>
        <coneGeometry args={[1.1, 0.7, 4]} />
        <meshStandardMaterial color="#ffd700" emissive="#ff8800" emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      {/* Left Flame Wing */}
      <mesh position={[-2.7, 4.85, 0.02]} rotation={[0, 0, 0.45]}>
        <boxGeometry args={[1.1, 0.55, 0.12]} />
        <meshStandardMaterial color="#ffd700" emissive="#ff5500" emissiveIntensity={1.0} toneMapped={false} />
      </mesh>
      {/* Right Flame Wing */}
      <mesh position={[2.7, 4.85, 0.02]} rotation={[0, 0, -0.45]}>
        <boxGeometry args={[1.1, 0.55, 0.12]} />
        <meshStandardMaterial color="#ffd700" emissive="#ff5500" emissiveIntensity={1.0} toneMapped={false} />
      </mesh>

      {/* Checkered Flag Graphic Badge (center) */}
      <mesh position={[0, 4.6, 0.1]}>
        <boxGeometry args={[3.2, 0.9, 0.05]} />
        <meshStandardMaterial color="#111827" roughness={0.5} />
      </mesh>

      {/* Bold 3D "START" Text */}
      <Text position={[0, 4.8, 0.14]} fontSize={0.46} color="#ffffff" anchorX="center" anchorY="middle">
        START
      </Text>

      {/* Hot Wheels Flame Ribbon Logo Badge */}
      <mesh position={[0, 4.25, 0.14]}>
        <boxGeometry args={[2.4, 0.32, 0.04]} />
        <meshStandardMaterial color="#dc2626" emissive="#ef4444" emissiveIntensity={0.6} />
      </mesh>
      <Text position={[0, 4.25, 0.17]} fontSize={0.22} color="#ffd700" anchorX="center" anchorY="middle">
        HOT WHEELS
      </Text>

      {/* Hot Wheels Teardrop Banner Flags on Sides (Matches hotwheels2.jpeg) */}
      {/* Left Banner */}
      <group position={[-3.6, 2.5, 0]}>
        {/* Curved Flagpole */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 2.8, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>
        {/* Orange Fabric Banner */}
        <mesh position={[0.26, 0.2, 0]}>
          <planeGeometry args={[0.55, 2.2]} />
          <meshStandardMaterial color="#ff5500" roughness={0.4} />
        </mesh>
        <Text position={[0.26, 0.2, 0.01]} fontSize={0.17} color="#ffd700" rotation={[0, 0, -Math.PI / 2]}>
          HOT WHEELS
        </Text>
      </group>

      {/* Right Banner */}
      <group position={[3.6, 2.5, 0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 2.8, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>
        <mesh position={[-0.26, 0.2, 0]}>
          <planeGeometry args={[0.55, 2.2]} />
          <meshStandardMaterial color="#ff5500" roughness={0.4} />
        </mesh>
        <Text position={[-0.26, 0.2, 0.01]} fontSize={0.17} color="#ffd700" rotation={[0, 0, Math.PI / 2]}>
          HOT WHEELS
        </Text>
      </group>
    </group>
  );
};

// ─── 7. STAGED COMPETITOR TOY CARS ON STARTING GRID ────────────────────────
// Matches hotwheels2.jpeg & hotwheels3.jpeg (cars lined up waiting to race)
interface ToyCarProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  type: 'muscle' | 'pickup' | 'dragster' | 'streetrod';
}

const StagedToyCar: React.FC<ToyCarProps> = ({ position, rotation = [0, 0, 0], color, type }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Car Body */}
      {type === 'muscle' && (
        <group>
          {/* Main Body */}
          <mesh position={[0, 0.28, 0]} castShadow>
            <boxGeometry args={[0.88, 0.32, 2.1]} />
            <meshStandardMaterial color={color} roughness={0.2} metalness={0.7} envMapIntensity={2.0} />
          </mesh>
          {/* Cabin */}
          <mesh position={[0, 0.52, -0.15]} castShadow>
            <boxGeometry args={[0.76, 0.28, 0.95]} />
            <meshStandardMaterial color="#09090b" roughness={0.1} metalness={0.9} />
          </mesh>
          {/* Dual White Racing Stripes (hotwheels2.jpeg orange car) */}
          <mesh position={[-0.14, 0.445, 0]}>
            <boxGeometry args={[0.08, 0.01, 2.08]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
          <mesh position={[0.14, 0.445, 0]}>
            <boxGeometry args={[0.08, 0.01, 2.08]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
        </group>
      )}

      {type === 'pickup' && (
        <group>
          {/* Heavy Pickup Cab */}
          <mesh position={[0, 0.34, 0.2]} castShadow>
            <boxGeometry args={[0.92, 0.42, 1.1]} />
            <meshStandardMaterial color={color} roughness={0.25} metalness={0.6} />
          </mesh>
          {/* Open Truck Bed */}
          <mesh position={[0, 0.24, -0.6]} castShadow>
            <boxGeometry args={[0.9, 0.24, 0.85]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} />
          </mesh>
          {/* Front Bull Bar */}
          <mesh position={[0, 0.24, 0.82]}>
            <boxGeometry args={[0.8, 0.2, 0.1]} />
            <meshStandardMaterial color="#111827" metalness={0.8} />
          </mesh>
        </group>
      )}

      {type === 'dragster' && (
        <group>
          {/* Sleek Needle Nose Dragster */}
          <mesh position={[0, 0.22, 0]} castShadow>
            <boxGeometry args={[0.7, 0.24, 2.3]} />
            <meshStandardMaterial color={color} roughness={0.15} metalness={0.8} />
          </mesh>
          {/* Twin Glowing Jet Thrusters (hotwheels2.jpeg rocket car) */}
          <mesh position={[-0.22, 0.26, -1.18]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.14, 0.16, 0.32, 12]} />
            <meshStandardMaterial color="#ff0044" emissive="#ff0044" emissiveIntensity={2.5} toneMapped={false} />
          </mesh>
          <mesh position={[0.22, 0.26, -1.18]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.14, 0.16, 0.32, 12]} />
            <meshStandardMaterial color="#ff0044" emissive="#ff0044" emissiveIntensity={2.5} toneMapped={false} />
          </mesh>
        </group>
      )}

      {type === 'streetrod' && (
        <group>
          {/* Lime Green Street Rod (hotwheels1.jpeg) */}
          <mesh position={[0, 0.26, 0]} castShadow>
            <boxGeometry args={[0.82, 0.34, 1.9]} />
            <meshStandardMaterial color={color} roughness={0.18} metalness={0.6} />
          </mesh>
          {/* Exposed Chrome V8 Engine on Hood */}
          <mesh position={[0, 0.44, 0.45]}>
            <boxGeometry args={[0.38, 0.22, 0.45]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
          </mesh>
          {/* Yellow flame accents */}
          <mesh position={[0, 0.28, 0.15]}>
            <boxGeometry args={[0.84, 0.1, 0.8]} />
            <meshStandardMaterial color="#facc15" />
          </mesh>
        </group>
      )}

      {/* 4 Chunky Toy Wheels with Chrome Hubcaps */}
      {[-0.46, 0.46].map((wx) =>
        [-0.65, 0.65].map((wz) => (
          <group key={`wheel-${wx}-${wz}`} position={[wx, 0.18, wz]}>
            {/* Black Rubber Tire */}
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.2, 0.2, 0.14, 16]} />
              <meshStandardMaterial color="#18181b" roughness={0.8} />
            </mesh>
            {/* Chrome/Gold Hubcap */}
            <mesh rotation={[0, 0, Math.PI / 2]} position={[wx > 0 ? 0.075 : -0.075, 0, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 0.02, 12]} />
              <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        ))
      )}

      {/* Headlight Dots */}
      <mesh position={[-0.28, 0.26, 1.06]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <mesh position={[0.28, 0.26, 1.06]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
    </group>
  );
};

// ─── 8. BANKED HIGH-SPEED CURVE (Segmented arc matching hotwheels.jpeg) ────
const BankedCurve: React.FC<{
  center: [number, number, number];
  radius: number;
  startAngle: number;
  endAngle: number;
  bankAngle: number; // Inward tilt
  elevationStart: number;
  elevationEnd: number;
}> = ({ center, radius, startAngle, endAngle, bankAngle, elevationStart, elevationEnd }) => {
  const segmentCount = 6;
  const segments = useMemo(() => {
    const list = [];
    const angleStep = (endAngle - startAngle) / segmentCount;
    for (let i = 0; i < segmentCount; i++) {
      const a1 = startAngle + i * angleStep;
      const a2 = a1 + angleStep;
      const midA = (a1 + a2) / 2;
      const x = center[0] + Math.cos(midA) * radius;
      const z = center[2] + Math.sin(midA) * radius;
      const t = (i + 0.5) / segmentCount;
      const y = elevationStart + t * (elevationEnd - elevationStart);
      const segLength = 2 * radius * Math.sin(angleStep / 2) * 1.05;
      const yaw = -midA + Math.PI / 2;
      list.push({ x, y, z, yaw, segLength });
    }
    return list;
  }, [center, radius, startAngle, endAngle, segmentCount, elevationStart, elevationEnd]);

  return (
    <group>
      {segments.map((s, i) => (
        <TrackSegment
          key={`banked-${i}`}
          position={[s.x, s.y, s.z]}
          rotation={[0, s.yaw, 0]}
          length={s.segLength}
          bank={bankAngle}
          hasConnector={i === 0 || i === segmentCount - 1}
          hasDriftStrip={true} // Add authentic drift chevrons to banked curves!
        />
      ))}
    </group>
  );
};

// ─── MASTER HOT WHEELS TRACK CIRCUIT COMPONENT ─────────────────────────────
export const HotWheelsTrack: React.FC = () => {
  return (
    <group>
      {/* ── 1. SOUTH RUNWAY & MEGA LAKE STUNT JUMP ────────────────────────── */}
      {/* Main launch runway extending seamlessly from z = -11.0 to z = 9.5 (length: 20.5m) */}
      <TrackSegment position={[0, 0, -11.0]} length={20.5} />

      {/* Starting Grid Painted Slots on Runway (z = -5.5 to 0.5) */}
      <group position={[0, 0.063, -2.5]}>
        {/* Blue starting grid box outline */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.8, 6.0]} />
          <meshBasicMaterial color="#0284c7" wireframe toneMapped={false} opacity={0.6} transparent />
        </mesh>
        {/* Grid Lane divider */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[0.08, 5.8]} />
          <meshBasicMaterial color="#ffd700" toneMapped={false} />
        </mesh>
        {/* White Transverse Starting Box Markers */}
        {[-2.5, -0.5, 1.5].map((lineZ, li) => (
          <mesh key={`grid-line-${li}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, lineZ]}>
            <planeGeometry args={[3.6, 0.12]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* Staged Competitor Hot Wheels Toy Cars (hotwheels2.jpeg & hotwheels3.jpeg) */}
      {/* Row 1 Ahead - Left: Red Muscle Pickup */}
      <StagedToyCar position={[-1.25, 0.06, -0.5]} color="#dc2626" type="pickup" />
      {/* Row 1 Ahead - Right: Flame Orange Muscle Car with white racing stripes */}
      <StagedToyCar position={[1.25, 0.06, -0.5]} color="#ff5500" type="muscle" />
      {/* (Player starts in Center Lane at [0, 0.06, -3.5]) */}
      {/* Row 3 Behind Flanks - Left: Lime Green Street Rod */}
      <StagedToyCar position={[-1.3, 0.06, -6.5]} color="#84cc16" type="streetrod" />
      {/* Row 3 Behind Flanks - Right: Rocket Dragster with glowing exhaust */}
      <StagedToyCar position={[1.3, 0.06, -6.5]} color="#1e3a8a" type="dragster" />

      {/* Authentic Hot Wheels Unleashed Flame Start Gantry at z = 2.5 */}
      <RacingArchGantry position={[0, 0, 2.5]} />

      {/* Motorized Booster Pad at z = 6.0 */}
      <BoosterStation position={[BOOST_PADS[0].x, 0, BOOST_PADS[0].z]} />

      {/* Launch Incline Ramp (z: 9.5 -> 14.0, height: 0 -> 3.2m) */}
      <TrackSegment position={[0, 0, 9.5]} length={5.5} incline={-0.58} />

      {/* White Dowel Support Pillars under Launch Ramp lip (hotwheels1.jpeg) */}
      <SupportPillar position={[-2.1, 0, 13.8]} height={3.1} />
      <SupportPillar position={[2.1, 0, 13.8]} height={3.1} />

      {/* Flaming Stunt Ring of Fire floating above the lake gap */}
      <FlamingStuntRing position={[0, 3.8, 16.8]} />

      {/* Landing Catch Ramp on the other side of the lake (z: 19.5 -> 24.5) */}
      <TrackSegment position={[0, 2.8, 19.5]} length={5.5} incline={0.45} />
      <SupportPillar position={[-2.1, 0, 19.8]} height={2.7} />
      <SupportPillar position={[2.1, 0, 19.8]} height={2.7} />

      {/* Runway connecting to South Banked Turn */}
      <TrackSegment position={[0, 0, 24.5]} length={4.0} />

      {/* ── 2. SOUTH-EAST BANKED HIGH-SPEED CURVE ──────────────────────────── */}
      {/* Sweeps 90° from South straight into East Flyover (11, 20) with drift chevrons */}
      <BankedCurve
        center={[6, 0, 23]}
        radius={7}
        startAngle={Math.PI / 2}
        endAngle={0}
        bankAngle={-0.35} // Inward banking tilt ~20°
        elevationStart={0}
        elevationEnd={2.8}
      />
      <SupportPillar position={[11, 0, 20]} height={2.8} />

      {/* ── 3. EAST ELEVATED FLYOVER HIGHWAY ───────────────────────────────── */}
      {/* High Elevated Bridge straight (x = 11, y = 2.8m, z: -6.0 -> 20.0) */}
      <TrackSegment position={[11, 2.8, 6.0]} length={14.0} />
      <SupportPillar position={[9.2, 0, 13.0]} height={2.7} />
      <SupportPillar position={[12.8, 0, 13.0]} height={2.7} />
      <TrackSegment position={[11, 2.8, -6.0]} length={12.0} />
      <SupportPillar position={[9.2, 0, 0]} height={2.7} />
      <SupportPillar position={[12.8, 0, 0]} height={2.7} />

      {/* Flyover Booster Pad */}
      <BoosterStation position={[BOOST_PADS[2].x, 2.8, BOOST_PADS[2].z]} rotation={[0, Math.PI, 0]} />

      {/* ── 4. TWIN 360° VERTICAL STUNT LOOPS (hotwheels.jpeg reference) ────── */}
      <TwinVerticalLoops position={[17.0, 0, 3.5]} />

      {/* ── 5. NORTH STUNT JUMP & BANKED OVERPASS ────────────────────────── */}
      <TrackSegment position={[0, 0, -11.0]} rotation={[0, Math.PI, 0]} length={5.4} incline={-0.55} />
      <SupportPillar position={[-2.1, 0, -15.2]} height={2.9} />
      <SupportPillar position={[2.1, 0, -15.2]} height={2.9} />
      <TrackSegment position={[0, 2.6, -20.0]} rotation={[0, Math.PI, 0]} length={5.4} incline={0.42} />
      <SupportPillar position={[-2.1, 0, -20.2]} height={2.5} />
      <SupportPillar position={[2.1, 0, -20.2]} height={2.5} />

      {/* ── 6. WEST CIRCUIT ACCELERATOR ────────────────────────────────────── */}
      <BoosterStation position={[BOOST_PADS[3].x, 0, BOOST_PADS[3].z]} rotation={[0, -Math.PI / 2, 0]} />
    </group>
  );
};
