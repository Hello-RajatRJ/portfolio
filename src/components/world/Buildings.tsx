import React from 'react';
import { Text } from '@react-three/drei';
import type { Project } from '../../types';
import { PROJECT_BILLBOARDS } from '../Car';

interface BuildingsProps {
  projects: Project[];
  activeProjectZoneId: string | null;
}

export const Buildings: React.FC<BuildingsProps> = ({ projects, activeProjectZoneId }) => {
  return (
    <group>
      {PROJECT_BILLBOARDS.map((bb) => {
        const project = projects.find((p) => p.id === bb.id);
        if (!project) return null;
        
        const isCurrentActive = activeProjectZoneId === bb.id;
        const color = project.color;
        const style = project.buildingStyle;

        return (
          <group key={bb.id} position={[bb.x, 0, bb.z]} scale={[0.8, 0.8, 0.8]}>
            {/* Ground Ring (Zone Trigger) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
              <ringGeometry args={[bb.radius - 0.2, bb.radius, 32]} />
              <meshBasicMaterial 
                color={isCurrentActive ? '#7c3aed' : color} 
                toneMapped={false} 
              />
            </mesh>

            {/* Interaction Prompt */}
            {isCurrentActive && (
              <Text
                position={[0, 4.5, 0]}
                fontSize={0.45}
                color="#7c3aed"
              >
                PRESS ENTER
              </Text>
            )}
            
            <Text
              position={[0, 3.8, 0]}
              fontSize={0.25}
              color={color}
            >
              {project.name}
            </Text>

            {/* Render Building Model based on style */}
            <BuildingModel style={style} color={color} />
          </group>
        );
      })}
    </group>
  );
};

const BuildingModel: React.FC<{ style: string; color: string }> = ({ style, color }) => {
  const baseMaterial = <meshStandardMaterial color="#f3f4f6" roughness={0.3} metalness={0.1} />;
  const glowMaterial = <meshBasicMaterial color={color} toneMapped={false} />;

  switch (style) {
    case 'restaurant':
      return (
        <group>
          <mesh position={[0, 1, 0]} castShadow receiveShadow>
            <boxGeometry args={[3, 2, 2]} />
            {baseMaterial}
          </mesh>
          {/* Neon sign on top */}
          <mesh position={[0, 2.5, 0]}>
            <boxGeometry args={[2.5, 0.5, 0.1]} />
            {glowMaterial}
          </mesh>
          {/* Awning */}
          <mesh position={[0, 1.5, 1.2]} rotation={[-0.3, 0, 0]} castShadow>
            <boxGeometry args={[3.2, 0.1, 0.8]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </group>
      );
    
    case 'medical':
    case 'hospital':
      return (
        <group>
          {/* Main block */}
          <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.5, 3, 2.5]} />
            {baseMaterial}
          </mesh>
          {/* Cross sign */}
          <group position={[0, 2, 1.26]}>
            <mesh>
              <boxGeometry args={[0.8, 0.2, 0.1]} />
              {glowMaterial}
            </mesh>
            <mesh>
              <boxGeometry args={[0.2, 0.8, 0.1]} />
              {glowMaterial}
            </mesh>
          </group>
        </group>
      );
    
    case 'library':
    case 'school':
      return (
        <group>
          {/* Main block */}
          <mesh position={[0, 1, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.5, 2, 2.5]} />
            {baseMaterial}
          </mesh>
          {/* Pillars */}
          {[-1.2, -0.4, 0.4, 1.2].map(x => (
            <mesh key={x} position={[x, 1, 1.3]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, 2, 8]} />
              {baseMaterial}
            </mesh>
          ))}
          {/* Roof */}
          <mesh position={[0, 2.2, 0.2]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[2.8, 1, 4]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </group>
      );
    
    case 'social':
      return (
        <group>
          {/* Tower */}
          <mesh position={[0, 2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.5, 1.5, 4, 16]} />
            {baseMaterial}
          </mesh>
          {/* Ring */}
          <mesh position={[0, 2.5, 0]} rotation={[0.2, 0, 0]}>
            <torusGeometry args={[1.8, 0.1, 8, 32]} />
            {glowMaterial}
          </mesh>
          <mesh position={[0, 1.5, 0]} rotation={[-0.2, 0, 0]}>
            <torusGeometry args={[1.8, 0.1, 8, 32]} />
            {glowMaterial}
          </mesh>
        </group>
      );
    
    case 'tech':
      return (
        <group>
          {/* Pyramid/tech shape */}
          <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0, 2, 3, 4]} />
            {baseMaterial}
          </mesh>
          {/* Glowing core */}
          <mesh position={[0, 1.5, 0]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            {glowMaterial}
          </mesh>
        </group>
      );
      
    case 'finance':
      return (
        <group>
          {/* Skyscraper */}
          <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 5, 1.5]} />
            {baseMaterial}
          </mesh>
          {/* Glowing vertical strips */}
          <mesh position={[0.76, 2.5, 0]}>
            <boxGeometry args={[0.05, 4.8, 0.2]} />
            {glowMaterial}
          </mesh>
          <mesh position={[-0.76, 2.5, 0]}>
            <boxGeometry args={[0.05, 4.8, 0.2]} />
            {glowMaterial}
          </mesh>
        </group>
      );
      
    default:
      // Generic building
      return (
        <group>
          <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[2, 3, 2]} />
            {baseMaterial}
          </mesh>
          <mesh position={[0, 3, 0]}>
            <boxGeometry args={[2.1, 0.1, 2.1]} />
            {glowMaterial}
          </mesh>
        </group>
      );
  }
};
