import React, { useEffect } from 'react';

import { obstaclesList } from './ObstaclesState';
import type { Collidable } from './ObstaclesState';

interface ObstacleProps {
  id: string;
  position: [number, number, number];
  radius: number;
  type?: 'circle' | 'box';
  width?: number;
  depth?: number;
  children: React.ReactNode;
}

export const Obstacle: React.FC<ObstacleProps> = ({
  id,
  position,
  radius,
  type = 'circle',
  width,
  depth,
  children,
}) => {
  useEffect(() => {
    const obstacle: Collidable = {
      id,
      x: position[0],
      z: position[2],
      radius,
      type,
      width,
      depth,
    };
    obstaclesList.push(obstacle);
    return () => {
      const index = obstaclesList.findIndex((o) => o.id === id);
      if (index !== -1) {
        obstaclesList.splice(index, 1);
      }
    };
  }, [id, position, radius, type, width, depth]);

  return <group position={position}>{children}</group>;
};

// Cyber Tree Obstacle (Cylinder trunk with glowing cone foliage)
export const CyberTree: React.FC<{ id: string; position: [number, number, number] }> = ({ id, position }) => {
  return (
    <Obstacle id={id} position={position} radius={1.2}>
      {/* Trunk */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.35, 1.5, 6]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.9} metalness={0.1} />
      </mesh>
      
      {/* Neon Foliage (Cone) */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <coneGeometry args={[1.2, 2.0, 5]} />
        <meshStandardMaterial 
          color="#ff007f" 
          emissive="#ff007f" 
          emissiveIntensity={0.6} 
          roughness={0.2}
        />
      </mesh>
      
      {/* Light glow ring at ground level */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.1, 1.2, 16]} />
        <meshBasicMaterial color="#ff007f" toneMapped={false} />
      </mesh>
    </Obstacle>
  );
};

// Neon Column / Pillar Obstacle
export const NeonPillar: React.FC<{ id: string; position: [number, number, number]; color?: string }> = ({
  id,
  position,
  color = '#00f0ff',
}) => {
  return (
    <Obstacle id={id} position={position} radius={0.9}>
      {/* Pillar Body */}
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.5, 4, 8]} />
        <meshStandardMaterial color="#0a0a1f" roughness={0.5} metalness={0.8} />
      </mesh>
      
      {/* Glowing Rings */}
      <mesh position={[0, 3.8, 0]}>
        <torusGeometry args={[0.45, 0.08, 8, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
      <mesh position={[0, 2.0, 0]}>
        <torusGeometry args={[0.48, 0.06, 8, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <torusGeometry args={[0.52, 0.08, 8, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
    </Obstacle>
  );
};

// Rock / Boulder Obstacle
export const CyberRock: React.FC<{ id: string; position: [number, number, number]; scale?: [number, number, number] }> = ({
  id,
  position,
  scale = [1, 1, 1],
}) => {
  // Bounding radius is roughly the average scale factor times 1.2
  const avgScale = (scale[0] + scale[1] + scale[2]) / 3;
  const radius = avgScale * 1.1;

  return (
    <Obstacle id={id} position={position} radius={radius}>
      <mesh scale={scale} castShadow receiveShadow>
        <dodecahedronGeometry args={[1, 1]} />
        <meshStandardMaterial 
          color="#0f0f2d" 
          roughness={0.85} 
          metalness={0.4} 
          flatShading
        />
      </mesh>
      
      {/* Neon glowing cracks/outlines inside the rock */}
      <mesh scale={[scale[0] * 1.02, scale[1] * 1.02, scale[2] * 1.02]}>
        <dodecahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#39ff14" wireframe toneMapped={false} opacity={0.3} transparent />
      </mesh>
    </Obstacle>
  );
};
