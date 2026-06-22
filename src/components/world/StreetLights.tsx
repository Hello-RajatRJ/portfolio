import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CylinderGeometry, MeshStandardMaterial, Matrix4, InstancedMesh, PointLight } from 'three';

export const StreetLights: React.FC = () => {
  const lightCount = 12;
  const postRef = useRef<InstancedMesh>(null);
  const bulbRef = useRef<InstancedMesh>(null);

  // Positions for the lights along the roads
  const positions = useMemo(() => [
    [-10, 0, -2], [10, 0, -2], [-10, 0, 18], [10, 0, 18], // Horizontal roads
    [-18, 0, -10], [-18, 0, 10], [22, 0, -10], [22, 0, 10], // Vertical roads
    [0, 0, -10], [0, 0, 10], // Center vertical road
    [-2, 0, -22], [2, 0, 22] // Center horizontal edges
  ], []);

  const { postGeo, postMat, bulbGeo, bulbMat, matrices } = useMemo(() => {
    // Post
    const pGeo = new CylinderGeometry(0.1, 0.15, 4, 8);
    const pMat = new MeshStandardMaterial({ color: '#111', roughness: 0.6, metalness: 0.8 });
    
    // Bulb
    const bGeo = new CylinderGeometry(0.3, 0.3, 0.2, 8);
    const bMat = new MeshStandardMaterial({ 
      color: '#ffffff', 
      emissive: '#ffffaa', 
      emissiveIntensity: 0, // Starts off (daytime)
    });

    const mats = new Array<Matrix4>();

    positions.forEach((pos) => {
      const matrix = new Matrix4();
      matrix.makeTranslation(pos[0], 2, pos[1]);
      mats.push(matrix);
    });

    return { postGeo: pGeo, postMat: pMat, bulbGeo: bGeo, bulbMat: bMat, matrices: mats };
  }, [positions]);

  React.useEffect(() => {
    if (postRef.current && bulbRef.current) {
      matrices.forEach((matrix, i) => {
        postRef.current!.setMatrixAt(i, matrix);
        
        const bulbMatrix = matrix.clone();
        bulbMatrix.multiply(new Matrix4().makeTranslation(0, 2, 0));
        bulbRef.current!.setMatrixAt(i, bulbMatrix);
      });
      postRef.current.instanceMatrix.needsUpdate = true;
      bulbRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [matrices]);

  // Handle day/night logic for lights
  useFrame(() => {
    const time = Date.now() * 0.0005;
    const y = Math.cos(time) * 80;
    
    // Turn on lights when y < 5 (dusk/night)
    const intensity = y < 5 ? Math.min(1, (5 - y) / 10) : 0;
    
    if (bulbRef.current && bulbRef.current.material) {
      (bulbRef.current.material as any).emissiveIntensity = intensity * 2;
    }
  });

  return (
    <group>
      <instancedMesh ref={postRef} args={[postGeo, postMat, lightCount]} castShadow receiveShadow />
      <instancedMesh ref={bulbRef} args={[bulbGeo, bulbMat, lightCount]} />
      
      {/* Actual PointLights for a few key street lights to save performance */}
      {positions.slice(0, 6).map((pos, i) => (
        <React.Fragment key={i}>
           <StreetPointLight position={[pos[0], 4, pos[1]]} />
        </React.Fragment>
      ))}
    </group>
  );
};

// Extracted to separate component so we can useFrame easily
const StreetPointLight: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const lightRef = useRef<PointLight>(null);
  
  useFrame(() => {
    const time = Date.now() * 0.0005;
    const y = Math.cos(time) * 80;
    const intensity = y < 5 ? Math.min(1, (5 - y) / 10) : 0;
    
    if (lightRef.current) {
      lightRef.current.intensity = intensity * 15; // Max 15
    }
  });

  return (
    <pointLight 
      ref={lightRef} 
      position={position} 
      color="#ffffaa" 
      distance={15} 
      intensity={0} // Default 0
    />
  );
};
