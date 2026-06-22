import React, { useMemo, useRef, useEffect } from 'react';
import { ConeGeometry, MeshStandardMaterial, Color, Matrix4, InstancedMesh } from 'three';

export const Mountains: React.FC = () => {
  const mountCount = 40;
  const meshRef = useRef<InstancedMesh>(null);
  
  const { geometry, material, matrices } = useMemo(() => {
    // Low poly cone
    const geo = new ConeGeometry(1, 1, 5, 1);
    
    // Synthwave dark mountain material
    const mat = new MeshStandardMaterial({
      color: new Color('#0a0a1a'),
      roughness: 1.0,
      flatShading: true,
      wireframe: false,
    });

    const mats = new Array<Matrix4>();

    for (let i = 0; i < mountCount; i++) {
      const matrix = new Matrix4();
      
      // Place around the perimeter (radius ~60-80)
      const angle = (i / mountCount) * Math.PI * 2 + (Math.random() * 0.2);
      const radius = 60 + Math.random() * 20;
      
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      // Randomize height and width
      const height = 15 + Math.random() * 25;
      const width = 10 + Math.random() * 15;
      
      // Translate
      matrix.makeTranslation(x, height / 2 - 2, z);
      
      // Scale
      const scaleMatrix = new Matrix4().makeScale(width, height, width);
      matrix.multiply(scaleMatrix);
      
      // Rotate randomly around Y
      const rotMatrix = new Matrix4().makeRotationY(Math.random() * Math.PI);
      matrix.multiply(rotMatrix);
      
      mats.push(matrix);
    }
    
    return { geometry: geo, material: mat, matrices: mats };
  }, []);

  useEffect(() => {
    if (meshRef.current) {
      matrices.forEach((matrix, i) => {
        meshRef.current!.setMatrixAt(i, matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [matrices]);

  return (
    <instancedMesh 
      ref={meshRef}
      args={[geometry, material, mountCount]} 
      receiveShadow
    />
  );
};
