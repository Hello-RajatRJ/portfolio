import React, { useRef, useEffect } from 'react';
import { ConeGeometry, MeshStandardMaterial, Color, Matrix4, InstancedMesh } from 'three';

const MOUNT_COUNT = 40;

const { mountainGeo, mountainMat, mountainMatrices } = (() => {
  const geo = new ConeGeometry(1, 1, 5, 1);
  const mat = new MeshStandardMaterial({
    color: new Color('#0a0a1a'),
    roughness: 1.0,
    flatShading: true,
    wireframe: false,
  });
  const mats = new Array<Matrix4>();

  for (let i = 0; i < MOUNT_COUNT; i++) {
    const matrix = new Matrix4();
    const angle = (i / MOUNT_COUNT) * Math.PI * 2 + (Math.random() * 0.2);
    const radius = 60 + Math.random() * 20;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const height = 15 + Math.random() * 25;
    const width = 10 + Math.random() * 15;
    matrix.makeTranslation(x, height / 2 - 2, z);
    const scaleMatrix = new Matrix4().makeScale(width, height, width);
    matrix.multiply(scaleMatrix);
    const rotMatrix = new Matrix4().makeRotationY(Math.random() * Math.PI);
    matrix.multiply(rotMatrix);
    mats.push(matrix);
  }
  return { mountainGeo: geo, mountainMat: mat, mountainMatrices: mats };
})();

export const Mountains: React.FC = () => {
  const meshRef = useRef<InstancedMesh>(null);

  useEffect(() => {
    if (meshRef.current) {
      mountainMatrices.forEach((matrix, i) => {
        meshRef.current!.setMatrixAt(i, matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, []);

  return (
    <instancedMesh 
      ref={meshRef}
      args={[mountainGeo, mountainMat, MOUNT_COUNT]} 
      receiveShadow
    />
  );
};
