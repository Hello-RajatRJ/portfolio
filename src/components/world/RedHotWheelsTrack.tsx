import React, { useMemo } from 'react';
import { MeshStandardMaterial } from 'three';
import { Text } from '@react-three/drei';
import { BOOST_PADS } from './HotWheelsPhysics';

// ─── 1. HOT WHEELS BILLBOARD (Image 1 reference) ──────────────────────────────
export const HotWheelsBillboard: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
}> = ({ position, rotation = [0, 0, 0] }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Dual Steel Support Stanchions */}
      {[-1.8, 1.8].map((sx) => (
        <group key={`pylon-${sx}`} position={[sx, 1.5, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.09, 0.12, 3.0, 12]} />
            <meshStandardMaterial color="#1e3a8a" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Base mounting flange */}
          <mesh position={[0, -1.45, 0]}>
            <cylinderGeometry args={[0.26, 0.3, 0.1, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Billboard Outer Heavy Frame */}
      <mesh position={[0, 3.4, 0]} castShadow>
        <boxGeometry args={[4.6, 2.2, 0.22]} />
        <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.25} />
      </mesh>

      {/* Inner White Contrast Bezel */}
      <mesh position={[0, 3.4, 0.115]}>
        <boxGeometry args={[4.3, 1.95, 0.04]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>

      {/* Glossy Racing Red / Orange Flame Billboard Face */}
      <mesh position={[0, 3.4, 0.14]}>
        <planeGeometry args={[4.1, 1.75]} />
        <meshStandardMaterial
          color="#ea580c"
          roughness={0.15}
          metalness={0.3}
        />
      </mesh>

      {/* Racing Crest Typography */}
      <Text
        position={[0, 3.65, 0.17]}
        fontSize={0.62}
        color="#fef08a"
        outlineWidth={0.048}
        outlineColor="#000000"
        outlineOpacity={1}
        anchorX="center"
        anchorY="middle"
      >
        VELOCITY GP
      </Text>
      <Text
        position={[0, 3.12, 0.17]}
        fontSize={0.21}
        color="#ffffff"
        outlineWidth={0.028}
        outlineColor="#000000"
        outlineOpacity={1}
        anchorX="center"
        anchorY="middle"
      >
        RACE · EXPLORE · ENJOY
      </Text>

      {/* Overhead Solar Spotlight */}
      <mesh position={[0, 4.6, 0.4]} rotation={[-0.4, 0, 0]}>
        <boxGeometry args={[2.0, 0.08, 0.25]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <pointLight position={[0, 4.3, 0.5]} color="#fef08a" intensity={0.9} distance={6} />
    </group>
  );
};

// ─── 2. HOT WHEELS TRACK SEGMENT (Glossy Orange + Hazard Curbs) ────────────────
interface TrackSegmentProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  length: number;
  width?: number;
  hasChevrons?: boolean;
}

export const RedTrackSegment: React.FC<TrackSegmentProps> = ({
  position,
  rotation = [0, 0, 0],
  length,
  width = 4.6,
  hasChevrons = true,
}) => {
  const halfW = width / 2;

  // High-Gloss Molded Flame-Orange Track Material (Image 1 reference)
  const trackMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#ff4900',
        roughness: 0.1,
        metalness: 0.18,
        envMapIntensity: 2.6,
      }),
    []
  );

  const railMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#f8fafc',
        roughness: 0.2,
        metalness: 0.35,
      }),
    []
  );

  // Red & White Racing Hazard Curbs (Image 1 & 4 reference)
  const stripeCount = Math.max(2, Math.floor(length / 1.5));
  const stripeLen = length / stripeCount;

  // Center speed chevrons (Image 1)
  const chevronCount = hasChevrons ? Math.max(1, Math.floor(length / 4.2)) : 0;
  const chevronSpacing = length / (chevronCount + 1);

  return (
    <group position={position} rotation={rotation}>
      {/* Molded High-Gloss Center Roadbed */}
      <mesh receiveShadow castShadow>
        <boxGeometry args={[width, 0.12, length]} />
        <primitive object={trackMat} attach="material" />
      </mesh>

      {/* Raised White Safety Outer Rails */}
      {[-halfW, halfW].map((rx) => (
        <mesh key={`rail-${rx}`} position={[rx, 0.18, 0]}>
          <boxGeometry args={[0.22, 0.36, length]} />
          <primitive object={railMat} attach="material" />
        </mesh>
      ))}

      {/* Alternating Red & White Hazard Curb Stripes along inner rail face */}
      {Array.from({ length: stripeCount }).map((_, idx) => {
        const sz = -length / 2 + (idx + 0.5) * stripeLen;
        const isRed = idx % 2 === 0;
        const color = isRed ? '#dc2626' : '#ffffff';
        return (
          <group key={`curb-${idx}`}>
            {/* Left Curb Stripe */}
            <mesh position={[-halfW + 0.12, 0.08, sz]}>
              <boxGeometry args={[0.08, 0.12, stripeLen * 0.96]} />
              <meshBasicMaterial color={color} />
            </mesh>
            {/* Right Curb Stripe */}
            <mesh position={[halfW - 0.12, 0.08, sz]}>
              <boxGeometry args={[0.08, 0.12, stripeLen * 0.96]} />
              <meshBasicMaterial color={color} />
            </mesh>
          </group>
        );
      })}

      {/* Yellow Center Seam Groove */}
      <mesh position={[0, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, length]} />
        <meshBasicMaterial color="#fde047" />
      </mesh>

      {/* Center White Speed Chevrons (Image 1) */}
      {Array.from({ length: chevronCount }).map((_, cIdx) => {
        const cz = -length / 2 + (cIdx + 1) * chevronSpacing;
        return (
          <group key={`chevr-${cIdx}`} position={[0, 0.068, cz]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh position={[0, 0.2, 0]}>
              <planeGeometry args={[1.2, 0.22]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, -0.2, 0]}>
              <planeGeometry args={[1.6, 0.22]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// ─── 3. MAIN HOT WHEELS TRACK ENVIRONMENT ────────────────────────────────────
export const RedHotWheelsTrack: React.FC = () => {
  return (
    <group>
      {/* ── 1. DOWNTOWN SPEEDWAY BOULEVARD (Open & Unobstructed through City Center) ── */}
      <RedTrackSegment position={[0, 0.06, 0]} length={72} width={4.6} />

      {/* ── 2. OUTER STUNT & BOWLING ARENA MEGA LAUNCH RAMP (x = 75, beside Bowling at x = 65) ── */}
      {/* Acceleration Runway approaching the launch (z: -16.5 to 9.5) */}
      <RedTrackSegment position={[75, 0.06, -3.5]} length={26.0} width={4.6} />

      {/* Launch Incline (z: 9.5 to 14.0, pitch up 33 deg) */}
      <group position={[75, 1.6, 11.75]} rotation={[-0.58, 0, 0]}>
        <RedTrackSegment position={[0, 0, 0]} length={4.8} width={4.6} />
      </group>

      {/* Jump Gap (z: 14 to 19.5): Flying through neon ring of fire! */}
      <group position={[75, 4.2, 16.8]}>
        <mesh>
          <torusGeometry args={[3.2, 0.25, 16, 32]} />
          <meshBasicMaterial color="#ffea00" />
        </mesh>
        <mesh>
          <torusGeometry args={[3.5, 0.15, 16, 32]} />
          <meshBasicMaterial color="#ff4400" />
        </mesh>
        <pointLight color="#ff4400" intensity={4} distance={15} />
      </group>

      {/* Catch / Landing Ramp (z: 19.5 to 24.5, pitch down to absorb car) */}
      <group position={[75, 1.4, 22.0]} rotation={[0.45, 0, 0]}>
        <RedTrackSegment position={[0, 0, 0]} length={5.4} width={4.6} />
      </group>

      {/* Landing Runoff Strip */}
      <RedTrackSegment position={[75, 0.06, 30.5]} length={12.0} width={4.6} />

      {/* Arena Hot Wheels Billboard */}
      <HotWheelsBillboard position={[70.5, 0, 2.0]} rotation={[0, Math.PI / 2, 0]} />

      {/* ── 4. ELEVATED WEST HIGHWAY FLYOVER & SPIRAL CONNECTOR ── */}
      {/* Elevated Highway bridge section (x: -14, z: -10 to 10 at y = 4.5m) */}
      <group position={[-14, 4.5, 0]}>
        <RedTrackSegment position={[0, 0, 0]} length={20} width={4.4} />
      </group>
      {/* Support Concrete Pillars (North & South of cross road z = 0) */}
      {[-8.5, 8.5].map((pz) => (
        <group key={`elev-col-${pz}`} position={[-14, 2.2, pz]}>
          <mesh>
            <cylinderGeometry args={[0.4, 0.5, 4.4, 12]} />
            <meshStandardMaterial color="#1c1917" metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* ── 5. ELEVATED SKYLINE ROLLERCOASTER OVERPASS ── */}
      {/* High overhead sweeping orange track soaring above Central Speedway at y = 7.2m */}
      <group position={[0, 7.2, -6]} rotation={[0.08, 0, -0.04]}>
        <RedTrackSegment position={[0, 0, 0]} length={48} width={4.6} />
      </group>
      {/* Portal Horizontal Support Crossbeam & Left/Right Curbside Track Pylons (keeps center lane open) */}
      <mesh position={[0, 6.75, -8.5]}>
        <boxGeometry args={[9.4, 0.42, 0.55]} />
        <meshStandardMaterial color="#0284c7" metalness={0.85} roughness={0.22} />
      </mesh>
      {[-4.4, 4.4].map((px) => (
        <group key={`sky-pylon-${px}`} position={[px, 3.4, -8.5]}>
          <mesh>
            <cylinderGeometry args={[0.32, 0.45, 6.9, 12]} />
            <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.25} />
          </mesh>
          {/* White & Orange Collar Rings */}
          <mesh position={[0, 2.0, 0]}>
            <cylinderGeometry args={[0.38, 0.38, 0.35, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 2.4, 0]}>
            <cylinderGeometry args={[0.38, 0.38, 0.35, 12]} />
            <meshBasicMaterial color="#ea580c" />
          </mesh>
        </group>
      ))}

      {/* ── 6. HOT WHEELS BILLBOARDS (Image 1 reference beside the track) ── */}
      {/* Trackside Billboard Right (approaching South Stunt Ramp) */}
      <HotWheelsBillboard position={[7.5, 0, 10.5]} rotation={[0, -Math.PI / 8, 0]} />
      {/* Trackside Billboard Left (near Project District entry) */}
      <HotWheelsBillboard position={[-7.5, 0, 1.5]} rotation={[0, Math.PI / 8, 0]} />

      {/* ── 7. GLOWING NEON SPEED BOOST PADS (Image 4 "SLIPSTREAM!") ── */}
      {BOOST_PADS.map((pad) => (
        <group key={pad.id} position={[pad.x, 0.08, pad.z]}>
          {/* Cyan Glow Pad Bed */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.6, 3.4]} />
            <meshBasicMaterial color="#00f0ff" transparent opacity={0.85} />
          </mesh>
          {/* Animated Speed Chevrons */}
          {[-0.9, 0, 0.9].map((offZ, idx) => (
            <mesh key={`b-arr-${idx}`} position={[0, 0.01, offZ]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[1.8, 0.38]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          ))}
          <pointLight color="#00f0ff" intensity={2.5} distance={7} />
        </group>
      ))}
    </group>
  );
};
