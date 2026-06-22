import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

export const Water: React.FC = () => {
  const waterRef = useRef<Mesh>(null);

  useFrame((_state) => {
    if (waterRef.current && waterRef.current.material) {
      // Simulate water ripples by moving the normal map or just animating opacity/color slightly
      // For a simple retro look, we'll just pulse the emissive intensity
      const time = Date.now() * 0.001;
      const material = waterRef.current.material as any;
      if (material.emissiveIntensity !== undefined) {
        material.emissiveIntensity = 0.5 + Math.sin(time * 2) * 0.2;
      }
    }
  });

  return (
    <mesh 
      ref={waterRef} 
      position={[0, -1.2, 20]} // Matches the dip in Terrain.tsx
      rotation={[-Math.PI / 2, 0, 0]} 
      receiveShadow
    >
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial 
        color="#7c3aed"
        emissive="#a855f7"
        emissiveIntensity={0.6}
        transparent
        opacity={0.6}
        roughness={0.2}
        metalness={0.5}
      />
      {/* Grid overlay for water to make it look cyber */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[20, 20, 10, 10]} />
        <meshBasicMaterial color="#c084fc" wireframe transparent opacity={0.3} />
      </mesh>
    </mesh>
  );
};
