import React from 'react';

// Clean Z-fighting-free road segment with depth-offset lane stripes
const RoadSegment: React.FC<{
  position: [number, number, number];
  args: [number, number]; // width, length
  rotation?: [number, number, number];
}> = ({ position, args, rotation = [-Math.PI / 2, 0, 0] }) => {
  const isVertical = args[1] > args[0];
  return (
    <group position={position} rotation={rotation}>
      <mesh receiveShadow>
        <planeGeometry args={args} />
        <meshStandardMaterial
          color="#131622"
          roughness={0.78}
          metalness={0.18}
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
      </mesh>

      {/* Cyber neon cyan center lane marking */}
      <mesh position={[0, 0, 0.008]}>
        <planeGeometry args={isVertical ? [0.12, args[1]] : [args[0], 0.12]} />
        <meshBasicMaterial
          color="#38bdf8"
          opacity={0.35}
          transparent
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-2}
          polygonOffsetUnits={-2}
          toneMapped={false}
        />
      </mesh>

      {/* Cyber neon purple road shoulder lines */}
      {isVertical ? (
        <>
          <mesh position={[args[0] * 0.44, 0, 0.008]}>
            <planeGeometry args={[0.08, args[1]]} />
            <meshBasicMaterial
              color="#c084fc"
              opacity={0.4}
              transparent
              depthWrite={false}
              polygonOffset
              polygonOffsetFactor={-2}
              polygonOffsetUnits={-2}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[-args[0] * 0.44, 0, 0.008]}>
            <planeGeometry args={[0.08, args[1]]} />
            <meshBasicMaterial
              color="#c084fc"
              opacity={0.4}
              transparent
              depthWrite={false}
              polygonOffset
              polygonOffsetFactor={-2}
              polygonOffsetUnits={-2}
              toneMapped={false}
            />
          </mesh>
        </>
      ) : (
        <>
          <mesh position={[0, args[1] * 0.44, 0.008]}>
            <planeGeometry args={[args[0], 0.08]} />
            <meshBasicMaterial
              color="#c084fc"
              opacity={0.4}
              transparent
              depthWrite={false}
              polygonOffset
              polygonOffsetFactor={-2}
              polygonOffsetUnits={-2}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0, -args[1] * 0.44, 0.008]}>
            <planeGeometry args={[args[0], 0.08]} />
            <meshBasicMaterial
              color="#c084fc"
              opacity={0.4}
              transparent
              depthWrite={false}
              polygonOffset
              polygonOffsetFactor={-2}
              polygonOffsetUnits={-2}
              toneMapped={false}
            />
          </mesh>
        </>
      )}
    </group>
  );
};

export const Roads: React.FC = () => {
  return (
    <group>
      {/* ── NORTH-SOUTH URBAN AVENUES (y = -0.025, clean height below E-W intersections) ── */}
      {/* Central Grand Boulevard */}
      <RoadSegment position={[0, -0.025, 0]} args={[8.0, 160]} />

      {/* West Avenue 1 (Projects District) */}
      <RoadSegment position={[-13.5, -0.025, 0]} args={[4.8, 100]} />

      {/* West Avenue 2 (Garage & Western Skyline) */}
      <RoadSegment position={[-28, -0.025, 0]} args={[4.8, 100]} />

      {/* Far West Skyline Parkway */}
      <RoadSegment position={[-44, -0.025, 0]} args={[4.8, 110]} />

      {/* East Avenue 1 (Skills Plaza & Gas Station) */}
      <RoadSegment position={[18, -0.025, 0]} args={[4.8, 100]} />

      {/* East Avenue 2 (Eastern Commercial Towers) */}
      <RoadSegment position={[35, -0.025, 0]} args={[4.8, 100]} />

      {/* Far East Skyline Parkway */}
      <RoadSegment position={[52, -0.025, 0]} args={[4.8, 110]} />

      {/* ── EAST-WEST CROSS STREETS (y = -0.010, staggered cleanly above N-S roads) ── */}
      {/* Far North Highway */}
      <RoadSegment position={[0, -0.01, -45]} args={[130, 6.8]} />

      {/* North Corporate Street */}
      <RoadSegment position={[0, -0.01, -26]} args={[110, 4.8]} />

      {/* North Mid-Town Street (Between Project Pavilions) */}
      <RoadSegment position={[0, -0.01, -11]} args={[110, 4.8]} />

      {/* Central Trans-City Expressway (Extends past Bowling Arena straight into AI Factory Gate & Tunnel) */}
      <RoadSegment position={[98, -0.01, 0]} args={[334, 7.6]} />

      {/* South Mid-Town Street (Between Project Pavilions) */}
      <RoadSegment position={[0, -0.01, 11]} args={[110, 4.8]} />

      {/* South Civic Boulevard */}
      <RoadSegment position={[0, -0.01, 26]} args={[110, 4.8]} />

      {/* Far South Highway */}
      <RoadSegment position={[0, -0.01, 45]} args={[130, 6.8]} />

      {/* ── ARENA FEEDER ROADS (Leading to Bowling Alley & Stunt Arena) ── */}
      <RoadSegment position={[68, -0.01, -14]} args={[24, 4.2]} />
      <RoadSegment position={[68, -0.01, 16]} args={[24, 4.2]} />
      <RoadSegment position={[65, -0.025, 1]} args={[4.5, 40]} />

      {/* ── AI INTELLIGENCE FACTORY ROAD NETWORK (East Industrial Complex, x: 94..258) ── */}
      {/* North Production Line Avenue (Depts 01..05) */}
      <RoadSegment position={[174, -0.01, -46]} args={[164, 7.6]} />
      {/* South Retrieval, Agent & QC Avenue (Depts 08..13) */}
      <RoadSegment position={[174, -0.01, 46]} args={[164, 7.6]} />
      {/* West Factory Entry Perimeter Road */}
      <RoadSegment position={[96, -0.025, 0]} args={[6.0, 98]} />
      {/* West Output & Ops Blvd (Depts 14 & 15) */}
      <RoadSegment position={[122, -0.025, 0]} args={[7.2, 98]} />
      {/* LLM Reactor Flank Roads (Connect N/S wings to Central Observation Tunnel) */}
      <RoadSegment position={[144, -0.025, 0]} args={[6.4, 96]} />
      <RoadSegment position={[196, -0.025, 0]} args={[6.4, 96]} />
      {/* East Vector Corridor Blvd (Depts 06..08) */}
      <RoadSegment position={[224, -0.025, 0]} args={[7.6, 98]} />
    </group>
  );
};
