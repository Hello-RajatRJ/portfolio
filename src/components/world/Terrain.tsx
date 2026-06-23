import React, { useMemo } from 'react';
import { PlaneGeometry, Color } from 'three';

export const Terrain: React.FC = () => {
  // Generate terrain geometry with hills on the edges (expanded for larger map)
  const geometry = useMemo(() => {
    const geo = new PlaneGeometry(130, 130, 64, 64);
    geo.rotateX(-Math.PI / 2); // Lay flat
    
    const pos = geo.attributes.position;
    
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      
      let y = 0;
      
      // Keep center mostly flat (radius ~20 for larger map)
      const distFromCenter = Math.sqrt(x*x + z*z);
      
      if (distFromCenter > 20) {
        // Create rolling hills towards edges
        const factor = (distFromCenter - 20) / 45; // 0 to ~1
        y += Math.sin(x * 0.3) * Math.cos(z * 0.3) * 2 * factor;
        y += Math.sin(x * 0.1 + z * 0.1) * 4 * factor;
      }
      
      // South-center water area
      if (x > -10 && x < 10 && z > 12 && z < 28) {
        // Dip down for water
        const lakeFactor = Math.min(1, Math.abs(x) / 10) * Math.min(1, Math.abs(z - 20) / 8);
        y -= (1 - lakeFactor) * 2.0;
      }
      
      pos.setY(i, y);
    }
    
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} receiveShadow position={[0, -0.05, 0]}>
      <meshStandardMaterial 
        color={new Color('#e5e7eb')} 
        roughness={0.8} 
        metalness={0.05}
        wireframe={false}
      />
    </mesh>
  );
};
