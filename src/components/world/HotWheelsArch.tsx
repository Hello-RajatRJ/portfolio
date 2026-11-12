import React from 'react';
import { Text } from '@react-three/drei';

export const HotWheelsArch: React.FC<{ position?: [number, number, number] }> = ({
  position = [0, 0, 5.0],
}) => {
  return (
    <group position={position}>
      {/* ── LEFT TOWER PILLAR (Miniature scale) ── */}
      <group position={[-3.8, 0, 0]}>
        <mesh position={[0, 1.9, 0]} castShadow>
          <boxGeometry args={[0.6, 3.8, 0.6]} />
          <meshStandardMaterial color="#991b1b" metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Yellow Chevron Turn Sign <<< */}
        <mesh position={[0.33, 1.8, 0]}>
          <boxGeometry args={[0.05, 0.8, 0.5]} />
          <meshStandardMaterial color="#18080c" />
        </mesh>
        <Text
          position={[0.36, 1.8, 0]}
          rotation={[0, Math.PI / 2, 0]}
          fontSize={0.26}
          color="#fde047"
          anchorX="center"
          anchorY="middle"
        >
          &lt;&lt;&lt;
        </Text>
      </group>

      {/* ── RIGHT TOWER PILLAR ── */}
      <group position={[3.8, 0, 0]}>
        <mesh position={[0, 1.9, 0]} castShadow>
          <boxGeometry args={[0.6, 3.8, 0.6]} />
          <meshStandardMaterial color="#991b1b" metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Yellow Chevron Turn Sign >>> */}
        <mesh position={[-0.33, 1.8, 0]}>
          <boxGeometry args={[0.05, 0.8, 0.5]} />
          <meshStandardMaterial color="#18080c" />
        </mesh>
        <Text
          position={[-0.36, 1.8, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          fontSize={0.26}
          color="#fde047"
          anchorX="center"
          anchorY="middle"
        >
          &gt;&gt;&gt;
        </Text>
      </group>

      {/* ── OVERHEAD MAIN ARCH TRUSS (Compact scale) ── */}
      <mesh position={[0, 3.8, 0]} castShadow>
        <boxGeometry args={[8.2, 0.8, 0.6]} />
        <meshStandardMaterial color="#dc2626" metalness={0.8} roughness={0.15} />
      </mesh>

      {/* Overhead Sleek Crest Plate (replaces cylindrical pie crest above arch) */}
      <mesh position={[0, 4.5, 0]}>
        <boxGeometry args={[4.4, 0.8, 0.56]} />
        <meshStandardMaterial color="#b91c1c" metalness={0.75} roughness={0.22} />
      </mesh>
      <mesh position={[0, 4.92, 0]}>
        <boxGeometry args={[4.5, 0.06, 0.6]} />
        <meshBasicMaterial color="#ea580c" toneMapped={false} />
      </mesh>

      {/* Gold Chrome Crest Logo */}
      <Text
        position={[0, 4.5, 0.38]}
        fontSize={0.62}
        color="#fef08a"
        outlineWidth={0.05}
        outlineColor="#000000"
        outlineOpacity={1}
        anchorX="center"
        anchorY="middle"
      >
        VELOCITY GP
      </Text>
      <Text
        position={[0, 3.8, 0.32]}
        fontSize={0.24}
        color="#ffffff"
        outlineWidth={0.035}
        outlineColor="#000000"
        outlineOpacity={1}
        anchorX="center"
        anchorY="middle"
      >
        RAJAT AMBEDKAR RACING · PORTFOLIO
      </Text>

      {/* Reverse Side Text */}
      <Text
        position={[0, 4.5, -0.38]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.62}
        color="#fef08a"
        outlineWidth={0.05}
        outlineColor="#000000"
        outlineOpacity={1}
        anchorX="center"
        anchorY="middle"
      >
        VELOCITY GP
      </Text>
    </group>
  );
};
