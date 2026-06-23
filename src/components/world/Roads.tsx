import React from 'react';

// Road segment — clean asphalt look, no debug center lines
const RoadSegment: React.FC<{
  position: [number, number, number];
  args: [number, number]; // width, length
  rotation?: [number, number, number];
}> = ({ position, args, rotation = [-Math.PI / 2, 0, 0] }) => {
  const isVertical = args[1] > args[0];
  return (
    <mesh position={position} rotation={rotation} receiveShadow>
      <planeGeometry args={args} />
      <meshStandardMaterial color="#b8bfc8" roughness={0.85} metalness={0.0} />

      {/* Subtle white dashed lane marking */}
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={isVertical ? [0.12, args[1]] : [args[0], 0.12]} />
        <meshBasicMaterial color="#ffffff" opacity={0.18} transparent />
      </mesh>

      {/* Road shoulder lines */}
      {isVertical ? (
        <>
          <mesh position={[args[0] * 0.42, 0, 0.005]}>
            <planeGeometry args={[0.08, args[1]]} />
            <meshBasicMaterial color="#f0f0f0" opacity={0.15} transparent />
          </mesh>
          <mesh position={[-args[0] * 0.42, 0, 0.005]}>
            <planeGeometry args={[0.08, args[1]]} />
            <meshBasicMaterial color="#f0f0f0" opacity={0.15} transparent />
          </mesh>
        </>
      ) : (
        <>
          <mesh position={[0, args[1] * 0.42, 0.005]}>
            <planeGeometry args={[args[0], 0.08]} />
            <meshBasicMaterial color="#f0f0f0" opacity={0.15} transparent />
          </mesh>
          <mesh position={[0, -args[1] * 0.42, 0.005]}>
            <planeGeometry args={[args[0], 0.08]} />
            <meshBasicMaterial color="#f0f0f0" opacity={0.15} transparent />
          </mesh>
        </>
      )}
    </mesh>
  );
};

export const Roads: React.FC = () => {
  return (
    <group>
      {/* Main vertical highway */}
      <RoadSegment position={[0, -0.03, 0]} args={[5, 44]} />

      {/* West vertical highway */}
      <RoadSegment position={[-9, -0.03, 2]} args={[4, 32]} />

      {/* East vertical highway */}
      <RoadSegment position={[11, -0.03, 0]} args={[4, 44]} />

      {/* Main horizontal highway */}
      <RoadSegment position={[0, -0.03, 0]} args={[44, 5]} />

      {/* North horizontal highway */}
      <RoadSegment position={[0, -0.03, -9]} args={[44, 4]} />

      {/* South horizontal */}
      <RoadSegment position={[0, -0.03, 9]} args={[44, 4]} />
    </group>
  );
};
