import React from 'react';
import { Text } from '@react-three/drei';

export interface FactoryArchitectureShellProps {
  position: [number, number, number];
  size: [number, number, number]; // width, height, depth
  code?: string; // e.g. "01", "P01"
  accent?: string;
  secondaryAccent?: string;
  highlighted?: boolean;
  /** Which horizontal face displays the glowing entrance hood & code plaque: 'N' (-Z), 'S' (+Z), 'E' (+X), 'W' (-X) */
  frontFace?: 'N' | 'S' | 'E' | 'W';
}

/**
 * Shared futuristic industrial hall shell used across AI Factory departments
 * and the Project Engineering Campus: dark charcoal metallic superstructure,
 * recessed red glass curtain bays, neon corner ribs, rooftop cooling truss,
 * and a bold illuminated code plaque.
 */
export const FactoryArchitectureShell: React.FC<FactoryArchitectureShellProps> = ({
  position,
  size,
  code,
  accent = '#ef4444',
  secondaryAccent = '#fb923c',
  highlighted = false,
  frontFace = 'S',
}) => {
  const [w, h, d] = size;
  const trim = highlighted ? '#fde047' : accent;
  const subTrim = highlighted ? '#fb923c' : secondaryAccent;

  // Compute front-face orientation and plaque offset for clean signage alignment
  const faceTransform: { pos: [number, number, number]; rotY: number; span: number } =
    frontFace === 'N'
      ? { pos: [0, h * 0.72, -d / 2 - 0.16], rotY: Math.PI, span: Math.min(w * 0.55, 6.2) }
      : frontFace === 'E'
        ? { pos: [w / 2 + 0.16, h * 0.72, 0], rotY: Math.PI / 2, span: Math.min(d * 0.55, 6.2) }
        : frontFace === 'W'
          ? { pos: [-w / 2 - 0.16, h * 0.72, 0], rotY: -Math.PI / 2, span: Math.min(d * 0.55, 6.2) }
          : { pos: [0, h * 0.72, d / 2 + 0.16], rotY: 0, span: Math.min(w * 0.55, 6.2) };

  const ribCount = w >= 12 ? 3 : 2;
  const pilasterOffsets = Array.from(
    { length: ribCount },
    (_, i) => (-0.36 + (i / (ribCount - 1)) * 0.72) * w
  );

  return (
    <group position={position}>
      {/* Grounded Reinforced Foundation Apron (anchored to -0.06 below -0.05 ground) */}
      <mesh position={[0, 0.11, 0]} receiveShadow>
        <boxGeometry args={[w + 1.3, 0.34, d + 1.3]} />
        <meshStandardMaterial color="#15161d" metalness={0.8} roughness={0.32} />
      </mesh>
      {/* Perimeter Foundation Underglow Collar */}
      <mesh position={[0, 0.29, 0]}>
        <boxGeometry args={[w + 0.9, 0.05, d + 0.9]} />
        <meshBasicMaterial color={trim} toneMapped={false} />
      </mesh>

      {/* Main Charcoal Metallic Structural Core */}
      <mesh position={[0, h / 2 + 0.24, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color="#121319"
          emissive={highlighted ? '#7f1d1d' : '#1f0709'}
          emissiveIntensity={highlighted ? 0.6 : 0.26}
          metalness={0.84}
          roughness={0.26}
        />
      </mesh>

      {/* Recessed Luminous Industrial Curtain Glass Band around mid-level */}
      <mesh position={[0, h * 0.52 + 0.24, 0]}>
        <boxGeometry args={[w + 0.06, h * 0.32, d + 0.06]} />
        <meshStandardMaterial
          color="#7f1d1d"
          emissive={trim}
          emissiveIntensity={highlighted ? 1.15 : 0.65}
          metalness={0.75}
          roughness={0.14}
          transparent
          opacity={0.78}
        />
      </mesh>

      {/* Vertical Metallic Structural Pilasters on North/South walls */}
      {pilasterOffsets.map((px, i) => (
        <mesh key={`pil-${i}`} position={[px, h / 2 + 0.24, 0]}>
          <boxGeometry args={[0.28, h + 0.04, d + 0.22]} />
          <meshStandardMaterial color="#1c1d26" metalness={0.88} roughness={0.25} />
        </mesh>
      ))}

      {/* Four Corner Vertical Neon Racing-Red Structural Ribs */}
      {[
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ].map(([sx, sz], i) => (
        <mesh key={`frib-${i}`} position={[sx * (w / 2 + 0.06), h / 2 + 0.24, sz * (d / 2 + 0.06)]}>
          <boxGeometry args={[0.18, h + 0.08, 0.18]} />
          <meshBasicMaterial color={trim} toneMapped={false} />
        </mesh>
      ))}

      {/* Dual Glowing Rooftop Parapet Collars */}
      <mesh position={[0, h + 0.28, 0]}>
        <boxGeometry args={[w + 0.3, 0.2, d + 0.3]} />
        <meshBasicMaterial color={trim} toneMapped={false} />
      </mesh>
      <mesh position={[0, h + 0.5, 0]}>
        <boxGeometry args={[w * 0.78, 0.22, d * 0.78]} />
        <meshStandardMaterial color="#1a1b24" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0, h + 0.64, 0]}>
        <boxGeometry args={[w * 0.8, 0.07, d * 0.8]} />
        <meshBasicMaterial color={subTrim} toneMapped={false} />
      </mesh>

      {/* Illuminated Department / Project Code Gable Plaque */}
      {code && (
        <group position={faceTransform.pos} rotation={[0, faceTransform.rotY, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[Math.max(2.2, faceTransform.span * 0.42), 1.15, 0.14]} />
            <meshStandardMaterial color="#090a0f" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.08]}>
            <planeGeometry args={[Math.max(2.0, faceTransform.span * 0.39), 0.98]} />
            <meshBasicMaterial color={trim} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, 0.1]}>
            <planeGeometry args={[Math.max(1.85, faceTransform.span * 0.36), 0.84]} />
            <meshBasicMaterial color="#090a0f" />
          </mesh>
          <Text
            position={[0, 0.02, 0.13]}
            fontSize={0.56}
            color="#fff7ed"
            outlineWidth={0.04}
            outlineColor="#000000"
            outlineOpacity={1}
            anchorX="center"
            anchorY="middle"
          >
            {code}
          </Text>
        </group>
      )}
    </group>
  );
};
