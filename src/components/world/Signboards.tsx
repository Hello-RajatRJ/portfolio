import React from 'react';
import { Text } from '@react-three/drei';

interface SignProps {
  position: [number, number, number];
  rotation: [number, number, number];
  text: string;
  color?: string;
}

const Sign: React.FC<SignProps> = ({ position, rotation, text, color = '#00f0ff' }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Post */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
        <meshStandardMaterial color="#111" roughness={0.7} />
      </mesh>
      
      {/* Board */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <boxGeometry args={[1.5, 0.4, 0.05]} />
        <meshStandardMaterial color="#222" roughness={0.8} />
      </mesh>
      
      {/* Neon border */}
      <mesh position={[0, 1.8, 0.03]}>
        <boxGeometry args={[1.55, 0.45, 0.01]} />
        <meshBasicMaterial color={color} wireframe toneMapped={false} />
      </mesh>

      {/* Text */}
      <Text
        position={[0, 1.8, 0.04]}
        fontSize={0.15}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </group>
  );
};

export const Signboards: React.FC = () => {
  return (
    <group>
      {/* Starting zone signs */}
      <Sign position={[-3, 0, 10]} rotation={[0, Math.PI / 4, 0]} text="<- PROJECTS" color="#00f0ff" />
      <Sign position={[3, 0, 10]} rotation={[0, -Math.PI / 4, 0]} text="SKILLS ->" color="#ffff00" />
      
      {/* Project signs */}
      <Sign position={[-18, 0, -2]} rotation={[0, 0, 0]} text="ENTERPRISES ^" color="#4A90D9" />
      <Sign position={[-5, 0, -10]} rotation={[0, Math.PI / 2, 0]} text="<- TECH HUB" color="#00BCD4" />
      
      {/* More signs around the map */}
      <Sign position={[0, 0, -2]} rotation={[0, 0, 0]} text="^ MORE PROJECTS" color="#ff007f" />
    </group>
  );
};
