import React, { useRef } from 'react';
import { Billboard, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group, PointLight } from 'three';

interface GarageBuildingProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export const GarageBuilding: React.FC<GarageBuildingProps> = ({
  position = [-36.0, 0, 19.0],
  rotation = [0, Math.PI / 2, 0],
}) => {
  const turntableRef = useRef<Group>(null);
  const neonLightRef = useRef<PointLight>(null);

  useFrame((state, delta) => {
    if (turntableRef.current) {
      turntableRef.current.rotation.y += delta * 0.55;
    }
    if (neonLightRef.current) {
      neonLightRef.current.intensity = 3.6 + Math.sin(state.clock.elapsedTime * 3) * 1.1;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* ── CONCRETE SHOWROOM APRON PAD (Fits 8.8m x 10.4m plot cleanly beside West Ave 2) ── */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[8.8, 0.08, 10.4]} />
        <meshStandardMaterial color="#172033" metalness={0.35} roughness={0.65} />
      </mesh>

      {/* Cyan Apron Perimeter Trim */}
      {[-4.28, 4.28].map((sx) => (
        <mesh key={`apron-trim-${sx}`} position={[sx, 0.09, 0]}>
          <boxGeometry args={[0.16, 0.04, 10.2]} />
          <meshBasicMaterial color="#0ea5e9" />
        </mesh>
      ))}

      {/* ── MAIN GARAGE WORKSHOP STRUCTURE (Placed in rear half z = -2.5) ── */}
      <mesh position={[0, 2.95, -2.5]} castShadow receiveShadow>
        <boxGeometry args={[8.4, 5.8, 5.0]} />
        <meshStandardMaterial color="#253248" metalness={0.65} roughness={0.3} />
      </mesh>

      {/* Brushed Metallic Corner Pilasters for crisp silhouette contrast */}
      {[-4.1, 4.1].map((px) => (
        <mesh key={`pillar-${px}`} position={[px, 2.95, 0.04]}>
          <boxGeometry args={[0.45, 5.8, 0.25]} />
          <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.22} />
        </mesh>
      ))}

      {/* Roof Parapet & Glowing Cyan Perimeter Neon Frame */}
      <mesh position={[0, 6.0, -2.5]}>
        <boxGeometry args={[8.8, 0.45, 5.5]} />
        <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0, 6.0, -2.5]}>
        <boxGeometry args={[8.9, 0.14, 5.6]} />
        <meshBasicMaterial color="#38bdf8" toneMapped={false} />
      </mesh>

      {/* Illuminated Rooftop Sky Beacon Tower (Visible down the avenues) */}
      <mesh position={[0, 6.55, -2.5]}>
        <cylinderGeometry args={[0.45, 0.6, 0.7, 16]} />
        <meshStandardMaterial color="#0c4a6e" emissive="#38bdf8" emissiveIntensity={1.8} />
      </mesh>

      {/* ── ILLUMINATED OPEN SERVICE BAY PORTAL (Facing Turn-Table Forecourt) ── */}
      {/* Bright Cyan Neon Bay Arch Frame */}
      <mesh position={[0, 4.25, 0.06]}>
        <boxGeometry args={[6.2, 0.28, 0.18]} />
        <meshBasicMaterial color="#38bdf8" toneMapped={false} />
      </mesh>
      {[-3.0, 3.0].map((bx) => (
        <mesh key={`bay-post-${bx}`} position={[bx, 2.1, 0.06]}>
          <boxGeometry args={[0.24, 4.2, 0.18]} />
          <meshBasicMaterial color="#38bdf8" toneMapped={false} />
        </mesh>
      ))}

      {/* Upper Roll-up Shutter Louvers (Partially raised showing inside workshop) */}
      <mesh position={[0, 3.65, 0.02]}>
        <boxGeometry args={[5.76, 0.9, 0.08]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.35} />
      </mesh>

      {/* Yellow / Black Safety Hazard Header Stripe */}
      <mesh position={[0, 4.55, 0.05]}>
        <planeGeometry args={[6.2, 0.34]} />
        <meshBasicMaterial color="#facc15" />
      </mesh>

      {/* Glowing Interior Workshop Backdrop Panel (Illuminated bay look) */}
      <mesh position={[0, 1.75, 0.01]}>
        <planeGeometry args={[5.76, 3.1]} />
        <meshBasicMaterial color="#0c4a6e" />
      </mesh>
      {/* Horizontal Neon Shop Floor Light Strip & Tool Bay Silhouette */}
      <mesh position={[0, 2.75, 0.025]}>
        <planeGeometry args={[5.1, 0.16]} />
        <meshBasicMaterial color="#e0f2fe" toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.05, 0.025]}>
        <planeGeometry args={[4.4, 1.3]} />
        <meshBasicMaterial color="#082f49" />
      </mesh>
      {/* Hydraulic Two-Post Car Lift Silhouette inside bay */}
      {[-1.55, 1.55].map((lx) => (
        <mesh key={`lift-${lx}`} position={[lx, 1.55, 0.04]}>
          <boxGeometry args={[0.22, 2.7, 0.04]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      ))}

      {/* ── DRIVE-ON SHOWROOM TURNTABLE FORECOURT (z = +2.8 -> directly beside West Ave 2) ── */}
      <group position={[0, 0.09, 2.8]}>
        <group ref={turntableRef}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[2.25, 32]} />
            <meshStandardMaterial color="#0f172a" metalness={0.75} roughness={0.25} />
          </mesh>
          {/* Rotating Tech Spokes */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            <planeGeometry args={[4.1, 0.14]} />
            <meshBasicMaterial color="#38bdf8" opacity={0.65} transparent />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.01, 0]}>
            <planeGeometry args={[4.1, 0.14]} />
            <meshBasicMaterial color="#38bdf8" opacity={0.65} transparent />
          </mesh>
        </group>

        {/* Outer Glowing Cyan Showroom Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[2.25, 2.65, 32]} />
          <meshBasicMaterial color="#38bdf8" opacity={0.9} transparent toneMapped={false} />
        </mesh>
      </group>

      {/* Glowing Forecourt & Interior Workshop Lighting */}
      <pointLight
        ref={neonLightRef}
        position={[0, 3.6, 2.4]}
        color="#38bdf8"
        intensity={4.2}
        distance={15}
      />

      {/* Side Showroom Glowing Display Windows */}
      {[-4.22, 4.22].map((wx) => (
        <mesh key={`side-win-${wx}`} position={[wx, 2.8, -2.5]} rotation={[0, wx > 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
          <planeGeometry args={[3.4, 2.2]} />
          <meshBasicMaterial color="#0ea5e9" opacity={0.65} transparent />
        </mesh>
      ))}

      {/* ── ARCHITECTURAL GARAGE BILLBOARD (Zero Z-fighting clean depth steps) ── */}
      <Billboard position={[0, 8.0, -0.5]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[12.8, 2.3]} />
          <meshBasicMaterial color="#080c16" />
        </mesh>
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[12.4, 1.95]} />
          <meshBasicMaterial color="#0c4a6e" />
        </mesh>

        <Text
          position={[0, 0.42, 0.06]}
          fontSize={0.80}
          color="#ffffff"
          outlineWidth={0.06}
          outlineColor="#000000"
          outlineOpacity={1}
          anchorX="center"
          anchorY="middle"
        >
          PERFORMANCE MOTORWORKS GARAGE
        </Text>

        <Text
          position={[0, -0.44, 0.06]}
          fontSize={0.38}
          color="#7dd3fc"
          outlineWidth={0.036}
          outlineColor="#000000"
          outlineOpacity={1}
          anchorX="center"
          anchorY="middle"
        >
          CHOOSE CAR · DRIVE IN OR PRESS [G]
        </Text>
      </Billboard>

      {/* Dual Bay Floodlights Illuminating Forecourt & Approach */}
      {[-3.2, 3.2].map((lx) => (
        <group key={`garage-flood-${lx}`} position={[lx, 5.2, 0.3]}>
          <mesh rotation={[0.45, 0, 0]}>
            <boxGeometry args={[0.5, 0.28, 0.36]} />
            <meshStandardMaterial color="#18181b" />
          </mesh>
          <pointLight color="#fef08a" intensity={2.4} distance={14} />
        </group>
      ))}
    </group>
  );
};
