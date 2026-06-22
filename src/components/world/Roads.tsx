import React from 'react';

// Simple road segment component
const RoadSegment: React.FC<{
  position: [number, number, number];
  args: [number, number]; // width, length
  rotation?: [number, number, number];
}> = ({ position, args, rotation = [-Math.PI / 2, 0, 0] }) => {
  return (
    <mesh position={position} rotation={rotation} receiveShadow>
      {/* Slightly above ground to prevent Z-fighting */}
      <planeGeometry args={args} />
      <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      
      {/* Center line (dashed) */}
      {args[1] > args[0] && ( // Vertical road
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[0.2, args[1]]} />
          <meshBasicMaterial color="#7c3aed" opacity={0.8} transparent />
        </mesh>
      )}
      {args[0] > args[1] && ( // Horizontal road
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[args[0], 0.2]} />
          <meshBasicMaterial color="#7c3aed" opacity={0.8} transparent />
        </mesh>
      )}
    </mesh>
  );
};

export const Roads: React.FC = () => {
  return (
    <group>
      {/* Main vertical highway (Center) */}
      <RoadSegment position={[0, -0.04, 0]} args={[4, 36]} />
      
      {/* West vertical highway */}
      <RoadSegment position={[-8, -0.04, 2]} args={[4, 28]} />
      
      {/* East vertical highway */}
      <RoadSegment position={[10, -0.04, 0]} args={[4, 36]} />

      {/* Main horizontal highway (Middle) */}
      <RoadSegment position={[0, -0.04, 0]} args={[36, 4]} />
      
      {/* North horizontal highway */}
      <RoadSegment position={[0, -0.04, -8]} args={[36, 4]} />
      
      {/* South horizontal highway (Bridge area) */}
      <RoadSegment position={[0, -0.04, 8]} args={[36, 4]} />
    </group>
  );
};
