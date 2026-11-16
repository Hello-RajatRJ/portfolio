import React, { useMemo, Suspense } from 'react';
import { Text, Billboard, useGLTF } from '@react-three/drei';
import { CanvasErrorBoundary } from '../CanvasErrorBoundary';

// ─── 3D GLTF IMPORTED MODERN BUILDINGS ───────────────────────────────────────
const ModernNightBuilding: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
  name?: string;
}> = ({ position, rotation = [0, 0, 0], name }) => {
  const { scene } = useGLTF('/modern_night_building_game-ready.glb');
  const cloned = useMemo(() => scene.clone(true), [scene]);

  return (
    <group position={position} rotation={rotation}>
      {/* Grounded base firmly touching -0.05 ground slab (scale 0.14 => min.y = -5.945 -> offset +5.90 puts base at -0.045) */}
      <group position={[0, 5.9, 0]} scale={[0.14, 0.14, 0.14]}>
        <primitive object={cloned} />
      </group>

      {name && (
        <Billboard position={[0, 13.4, 0]}>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[4.8, 1.05]} />
            <meshBasicMaterial color="#ef4444" toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, 0.025]}>
            <planeGeometry args={[4.6, 0.9]} />
            <meshBasicMaterial color="#050508" />
          </mesh>
          <Text
            position={[0, 0, 0.055]}
            fontSize={0.44}
            color="#ffffff"
            outlineWidth={0.055}
            outlineColor="#000000"
            outlineOpacity={1}
            anchorX="center"
            anchorY="middle"
          >
            {name}
          </Text>
        </Billboard>
      )}
    </group>
  );
};

const OfficeBuildingModel: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
  name?: string;
}> = ({ position, rotation = [0, 0, 0], name }) => {
  const { scene } = useGLTF('/officeBuilding.glb');
  const cloned = useMemo(() => scene.clone(true), [scene]);

  return (
    <group position={position} rotation={rotation}>
      {/* Centered and scaled corporate office complex */}
      <group position={[34.49, 0.086, -10.95]} scale={[0.18, 0.18, 0.18]}>
        <primitive object={cloned} />
      </group>

      {name && (
        <Billboard position={[0, 3.8, 0]}>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[5.0, 1.05]} />
            <meshBasicMaterial color="#38bdf8" toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, 0.025]}>
            <planeGeometry args={[4.8, 0.9]} />
            <meshBasicMaterial color="#080c16" />
          </mesh>
          <Text
            position={[0, 0, 0.055]}
            fontSize={0.44}
            color="#ffffff"
            outlineWidth={0.055}
            outlineColor="#000000"
            outlineOpacity={1}
            anchorX="center"
            anchorY="middle"
          >
            {name}
          </Text>
        </Billboard>
      )}
    </group>
  );
};

const AsianNightSkyline: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
}> = ({ position, rotation = [0, 0, 0] }) => {
  const { scene } = useGLTF('/asian_themed_low_poly_night_city_buildings.glb');
  const cloned = useMemo(() => scene.clone(true), [scene]);

  return (
    <group position={position} rotation={rotation}>
      {/* Grounded solidly on -0.05 tarmac at realistic distant city scale (0.16 => ~168m x 48m) */}
      <group position={[11.0, -0.05, 0]} scale={[0.16, 0.16, 0.16]}>
        <primitive object={cloned} />
      </group>
    </group>
  );
};

interface BuildingSpec {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  color: string;
  glassColor?: string;
  hasHelipad?: boolean;
  hasAntenna?: boolean;
  name?: string;
}

// ─── AUTHENTIC ARCHITECTURAL SKYSCRAPERS ──────────────────────────────────────
const RealSkyscraper: React.FC<{ b: BuildingSpec }> = ({ b }) => {
  const podiumH = 0.65;
  const mainTowerH = b.h * 0.65;
  const upperTierH = b.h * 0.35;
  const glassColor = b.glassColor || '#ef4444';
  const isNeon = true;

  return (
    <group position={[b.x, 0, b.z]}>
      {/* ── 1. GROUND PODIUM & ENTRANCE LOBBY (Sunk to y = -0.06 so zero ground gap) ── */}
      <mesh position={[0, podiumH / 2 - 0.06, 0]} receiveShadow>
        <boxGeometry args={[b.w * 1.08, podiumH, b.d * 1.08]} />
        <meshStandardMaterial
          color={b.color}
          emissive={b.color}
          emissiveIntensity={0.42}
          roughness={0.4}
          metalness={0.45}
        />
      </mesh>
      <mesh position={[0, podiumH - 0.03, 0]}>
        <boxGeometry args={[b.w * 1.12, 0.08, b.d * 1.12]} />
        <meshBasicMaterial color={glassColor} toneMapped={false} />
      </mesh>
      {/* Glass Entrance Vestibule with Neon Ambient Glow */}
      <mesh position={[0, podiumH / 2, b.d * 0.54 + 0.05]}>
        <boxGeometry args={[b.w * 0.45, podiumH * 0.8, 0.12]} />
        <meshStandardMaterial
          color={glassColor}
          emissive={glassColor}
          emissiveIntensity={0.95}
          transparent
          opacity={0.85}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {/* Entrance Glass Canopy */}
      <mesh position={[0, podiumH * 0.85, b.d * 0.54 + 0.28]}>
        <boxGeometry args={[b.w * 0.55, 0.04, 0.45]} />
        <meshStandardMaterial color="#09090b" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* ── 2. MAIN TOWER BODY (Glass Curtain Wall & Structural Spandrels) ── */}
      <group position={[0, podiumH + mainTowerH / 2 - 0.06, 0]}>
        {/* Core Mass */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[b.w, mainTowerH, b.d]} />
          <meshStandardMaterial
            color={b.color}
            emissive={b.color}
            emissiveIntensity={isNeon ? 0.65 : 0}
            roughness={0.2}
            metalness={0.45}
            envMapIntensity={2.2}
          />
        </mesh>

        {/* Neon vertical corner ribs on all skyline & border buildings */}
        {isNeon &&
          [
            [-1, -1],
            [1, -1],
            [-1, 1],
            [1, 1],
          ].map(([sx, sz], idx) => (
            <mesh
              key={`neon-rib-${idx}`}
              position={[sx * (b.w * 0.505), 0, sz * (b.d * 0.505)]}
            >
              <boxGeometry args={[0.14, mainTowerH, 0.14]} />
              <meshBasicMaterial color={glassColor} toneMapped={false} />
            </mesh>
          ))}

        {/* Realistic Architectural Window Grids & Louvers */}
        <mesh position={[0, 0, b.d / 2 + 0.02]}>
          <planeGeometry args={[b.w * 0.88, mainTowerH * 0.88]} />
          <meshStandardMaterial
            color={glassColor}
            emissive={glassColor}
            emissiveIntensity={0.9}
            roughness={0.08}
            metalness={0.92}
            transparent
            opacity={0.9}
          />
        </mesh>
        <mesh position={[0, 0, -b.d / 2 - 0.02]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[b.w * 0.88, mainTowerH * 0.88]} />
          <meshStandardMaterial
            color={glassColor}
            emissive={glassColor}
            emissiveIntensity={0.75}
            roughness={0.08}
            metalness={0.92}
            transparent
            opacity={0.85}
          />
        </mesh>
        <mesh position={[b.w / 2 + 0.02, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[b.d * 0.88, mainTowerH * 0.88]} />
          <meshStandardMaterial
            color={glassColor}
            emissive={glassColor}
            emissiveIntensity={0.75}
            roughness={0.08}
            metalness={0.92}
            transparent
            opacity={0.85}
          />
        </mesh>
        <mesh position={[-b.w / 2 - 0.02, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[b.d * 0.88, mainTowerH * 0.88]} />
          <meshStandardMaterial
            color={glassColor}
            emissive={glassColor}
            emissiveIntensity={0.75}
            roughness={0.08}
            metalness={0.92}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Floor-Dividing Structural Horizontal Neon Ribs */}
        {[-0.3, 0, 0.3].map((offY, idx) => (
          <mesh key={`rib-${idx}`} position={[0, mainTowerH * offY, 0]}>
            <boxGeometry args={[b.w * 1.03, 0.08, b.d * 1.03]} />
            <meshBasicMaterial color={glassColor} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* ── 3. UPPER SETBACK TIER (Modern Architectural Step-Back) ── */}
      <group position={[0, podiumH + mainTowerH + upperTierH / 2 - 0.06, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[b.w * 0.74, upperTierH, b.d * 0.74]} />
          <meshStandardMaterial
            color={b.color}
            emissive={b.color}
            emissiveIntensity={0.58}
            roughness={0.18}
            metalness={0.5}
            envMapIntensity={2.5}
          />
        </mesh>
        {/* Setback Facade Windows */}
        <mesh position={[0, 0, (b.d * 0.74) / 2 + 0.015]}>
          <planeGeometry args={[b.w * 0.62, upperTierH * 0.82]} />
          <meshStandardMaterial
            color={glassColor}
            emissive={glassColor}
            emissiveIntensity={0.95}
            roughness={0.08}
            metalness={0.95}
            transparent
            opacity={0.92}
          />
        </mesh>
      </group>

      {/* ── 4. REALISTIC ROOFTOP EQUIPMENT & PARAPET ── */}
      <group position={[0, podiumH + mainTowerH + upperTierH - 0.06, 0]}>
        {/* Roof Parapet Ledge */}
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[b.w * 0.76, 0.12, b.d * 0.76]} />
          <meshBasicMaterial color={glassColor} toneMapped={false} />
        </mesh>

        {/* Elevator Machine Penthouse */}
        <mesh position={[-b.w * 0.15, 0.25, 0]} castShadow>
          <boxGeometry args={[b.w * 0.35, 0.38, b.d * 0.35]} />
          <meshStandardMaterial color="#18181b" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Industrial HVAC Cooling Tower Units */}
        <mesh position={[b.w * 0.18, 0.18, -b.d * 0.15]} castShadow>
          <boxGeometry args={[0.55, 0.24, 0.42]} />
          <meshStandardMaterial color="#71717a" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[b.w * 0.18, 0.31, -b.d * 0.15]}>
          <cylinderGeometry args={[0.16, 0.16, 0.04, 16]} />
          <meshStandardMaterial color="#09090b" roughness={0.8} />
        </mesh>

        {/* Rooftop Helipad (on selected prominent towers) */}
        {b.hasHelipad && (
          <group position={[0, 0.13, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[b.w * 0.28, 24]} />
              <meshStandardMaterial color="#18181b" roughness={0.6} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
              <ringGeometry args={[b.w * 0.24, b.w * 0.26, 24]} />
              <meshBasicMaterial color="#fde047" />
            </mesh>
            <Text
              position={[0, 0.02, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.35}
              color="#fde047"
              anchorX="center"
              anchorY="middle"
            >
              H
            </Text>
          </group>
        )}

        {/* Communications Mast & FAA Aircraft Warning Light */}
        {b.hasAntenna && (
          <group position={[b.hasHelipad ? b.w * 0.25 : 0, 0.1, 0]}>
            <mesh position={[0, 0.65, 0]}>
              <cylinderGeometry args={[0.02, 0.05, 1.3, 8]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
            </mesh>
            <mesh position={[0, 1.32, 0]}>
              <sphereGeometry args={[0.08, 12, 12]} />
              <meshBasicMaterial color="#ef4444" toneMapped={false} />
            </mesh>
          </group>
        )}

        {/* ── HIGH-VISIBILITY ROOFTOP CORPORATE SIGNBOARD ── */}
        {b.name && (
          <Billboard position={[0, 1.25, 0]} follow lockX={false} lockY={false} lockZ={false}>
            {/* Neon Accent Border */}
            <mesh position={[0, 0, 0]}>
              <planeGeometry args={[4.6, 1.05]} />
              <meshBasicMaterial color="#ef4444" toneMapped={false} />
            </mesh>
            {/* Dark Backing Board */}
            <mesh position={[0, 0, 0.025]}>
              <planeGeometry args={[4.4, 0.9]} />
              <meshBasicMaterial color="#0a0306" />
            </mesh>
            {/* Bold Bright Building Name with Heavy Black Outline */}
            <Text
              position={[0, 0, 0.055]}
              fontSize={0.46}
              color="#fde047"
              outlineWidth={0.055}
              outlineColor="#000000"
              outlineOpacity={1}
              anchorX="center"
              anchorY="middle"
            >
              🏢 {b.name}
            </Text>
          </Billboard>
        )}
      </group>
    </group>
  );
};

// ─── EXPANDED REALISTIC SKYSCRAPERS CITY DATA ─────────────────────────────────
const SkyscraperBlocks: React.FC = () => {
  const buildingsData: BuildingSpec[] = useMemo(() => {
    return [
      // North skyline (neon-trimmed perimeter high-rises along North Parkway)
      { x: -45, z: -55, w: 4.8, d: 4.5, h: 5.5, color: '#dc2626', glassColor: '#ff5500', hasHelipad: true, hasAntenna: true, name: 'METRO TOWER' },
      { x: -30, z: -55, w: 4.2, d: 4.0, h: 4.8, color: '#0ea5e9', glassColor: '#38bdf8', hasAntenna: true },
      { x: -14, z: -58, w: 4.5, d: 4.2, h: 6.0, color: '#ea580c', glassColor: '#fde047', hasHelipad: true, hasAntenna: true, name: 'APEX PLAZA' },
      { x: 4,   z: -56, w: 4.0, d: 4.4, h: 5.2, color: '#e11d48', glassColor: '#fb7185', hasAntenna: true },
      { x: 20,  z: -55, w: 4.6, d: 4.0, h: 5.8, color: '#16a34a', glassColor: '#4ade80', hasHelipad: true, hasAntenna: true, name: 'VELOCITY CENTER' },
      { x: 38,  z: -55, w: 4.2, d: 4.2, h: 4.6, color: '#dc2626', glassColor: '#f97316', hasAntenna: true },

      // East city edge skyline (border between Portfolio City & Bowling/AI Complex)
      { x: 48, z: -35, w: 4.2, d: 4.6, h: 5.2, color: '#dc2626', glassColor: '#ff6b00', hasAntenna: true },
      { x: 50, z: -15, w: 4.8, d: 4.6, h: 6.4, color: '#f59e0b', glassColor: '#fde047', hasHelipad: true, hasAntenna: true, name: 'HORIZON TOWER' },
      { x: 48, z: 8,   w: 4.4, d: 4.2, h: 5.0, color: '#ef4444', glassColor: '#fb923c', hasAntenna: true },
      { x: 48, z: 30,  w: 4.0, d: 4.2, h: 4.5, color: '#ea580c', glassColor: '#38bdf8', hasHelipad: true },
      { x: 46, z: 48,  w: 4.2, d: 4.2, h: 4.8, color: '#dc2626', glassColor: '#fde047', hasAntenna: true },

      // South skyline (Neon Metropolitan border towers along South Parkway)
      { x: 32,  z: 60, w: 4.2, d: 4.2, h: 5.0, color: '#ef4444', glassColor: '#ff6b00', hasAntenna: true },
      { x: 12,  z: 62, w: 4.8, d: 4.5, h: 5.8, color: '#10b981', glassColor: '#4ade80', hasHelipad: true, hasAntenna: true, name: 'CYBER METROPOLIS' },
      { x: -10, z: 62, w: 4.5, d: 4.6, h: 5.4, color: '#f43f5e', glassColor: '#fb923c', hasAntenna: true },
      { x: -30, z: 60, w: 4.0, d: 4.2, h: 4.8, color: '#0ea5e9', glassColor: '#38bdf8', hasAntenna: true },
      { x: -48, z: 58, w: 4.4, d: 4.4, h: 5.0, color: '#ea580c', glassColor: '#fde047', hasHelipad: true, hasAntenna: true },

      // West backdrop (Neon Tech innovation border along West Avenue)
      { x: -50, z: 35,  w: 4.2, d: 4.6, h: 5.0, color: '#dc2626', glassColor: '#f97316', hasAntenna: true },
      { x: -52, z: 12,  w: 4.6, d: 4.4, h: 6.2, color: '#e11d48', glassColor: '#fde047', hasHelipad: true, hasAntenna: true, name: 'TITAN TOWER' },
      { x: -50, z: -12, w: 4.2, d: 4.2, h: 5.2, color: '#0284c7', glassColor: '#38bdf8', hasAntenna: true },
      { x: -50, z: -35, w: 4.4, d: 4.4, h: 5.5, color: '#ef4444', glassColor: '#fb923c', hasHelipad: true, hasAntenna: true },

      // Inner architectural civic pavilions (Bright Neon small city buildings)
      { x: -32, z: -8, w: 3.2, d: 3.2, h: 2.8, color: '#00f5d4', glassColor: '#38bdf8', name: 'DEV LABS' },
      { x: -32, z: 12, w: 3.2, d: 3.2, h: 2.6, color: '#ff2a85', glassColor: '#f472b6' },
      { x: 26,  z: -8, w: 3.2, d: 3.2, h: 2.8, color: '#a855f7', glassColor: '#38bdf8', name: 'INNOVATION HUB' },
      { x: 26,  z: 12, w: 3.2, d: 3.2, h: 2.5, color: '#22c55e', glassColor: '#fde047' },
    ];
  }, []);

  return (
    <group>
      {buildingsData.map((b, i) => (
        <RealSkyscraper key={`real-bldg-${i}`} b={b} />
      ))}
    </group>
  );
};

// ─── REALISTIC URBAN TREES (Multi-tiered canopy) ─────────────────────────────
const RealisticTrees: React.FC = () => {
  const treePositions = useMemo(() => {
    const list: [number, number, number][] = [];
    // Central avenue sidewalk trees
    for (let z = -60; z <= 60; z += 12) {
      if (Math.abs(z) > 4) {
        list.push([-5.2, 0, z]);
        list.push([5.2, 0, z]);
      }
    }
    // Cross boulevard trees
    for (let x = -60; x <= 60; x += 14) {
      if (Math.abs(x) > 6) {
        list.push([x, 0, -5.2]);
        list.push([x, 0, 5.2]);
      }
    }
    return list;
  }, []);

  return (
    <group>
      {treePositions.map(([tx, ty, tz], i) => (
        <group key={`real-tree-${i}`} position={[tx, ty, tz]}>
          {/* Concrete Tree Well / Planter Box */}
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[1.1, 0.1, 1.1]} />
            <meshStandardMaterial color="#27272a" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.06, 0]}>
            <boxGeometry args={[0.9, 0.11, 0.9]} />
            <meshStandardMaterial color="#1c1917" roughness={0.9} />
          </mesh>

          {/* Organic Trunk */}
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.07, 0.11, 0.8, 8]} />
            <meshStandardMaterial color="#451a03" roughness={0.9} />
          </mesh>

          {/* Layered Foliage Canopies */}
          <mesh position={[0, 0.95, 0]}>
            <sphereGeometry args={[0.55, 12, 12]} />
            <meshStandardMaterial color="#15803d" roughness={0.6} />
          </mesh>
          <mesh position={[0, 1.35, 0]}>
            <sphereGeometry args={[0.42, 12, 12]} />
            <meshStandardMaterial color="#16a34a" roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ─── MODERN DUAL-ARM STREETLIGHT MASTS ───────────────────────────────────────
const ModernStreetlights: React.FC = () => {
  const lightPositions = useMemo(() => {
    const list: [number, number, number, number][] = [];
    for (let z = -55; z <= 55; z += 18) {
      list.push([-4.5, 0, z, Math.PI / 2]);
      list.push([4.5, 0, z, -Math.PI / 2]);
    }
    return list;
  }, []);

  return (
    <group>
      {lightPositions.map(([lx, ly, lz, rotY], i) => (
        <group key={`msl-${i}`} position={[lx, ly, lz]} rotation={[0, rotY, 0]}>
          <mesh position={[0, 1.0, 0]}>
            <cylinderGeometry args={[0.03, 0.05, 2.0, 8]} />
            <meshStandardMaterial color="#18181b" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0.3, 2.05, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <cylinderGeometry args={[0.02, 0.02, 0.6, 6]} />
            <meshStandardMaterial color="#18181b" metalness={0.9} />
          </mesh>
          {/* Luminous High-Intensity Luminaire (Emissive glow without GPU pointlight penalty) */}
          <mesh position={[0.55, 2.22, 0]}>
            <boxGeometry args={[0.22, 0.06, 0.12]} />
            <meshBasicMaterial color="#fef08a" toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ─── GRAND SPEEDWAY MARKINGS (Renders cleanly above Roads.tsx without duplicate coplanar asphalt) ──
const ExpandedCityRoads: React.FC = () => {
  return (
    <group position={[0, 0.012, 0]}>
      {/* ── WHITE LANE DASHES ACROSS GRAND SPEEDWAY (Avoid intersections) ── */}
      {[-70, -60, -52, -36, -18, 18, 36, 52, 60, 70].map((rz) => (
        <mesh key={`dash-${rz}`} position={[0, 0, rz]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.24, 3.4]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.75}
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-3}
            polygonOffsetUnits={-3}
          />
        </mesh>
      ))}

      {/* ── SPEED CHEVRONS / RACING ARROWS ── */}
      {[-32, -16, 16, 32].map((az) => (
        <group key={`arrow-${az}`} position={[0, 0.008, az]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[2.0, 0.5]} />
            <meshBasicMaterial
              color="#fde047"
              depthWrite={false}
              polygonOffset
              polygonOffsetFactor={-4}
              polygonOffsetUnits={-4}
            />
          </mesh>
          <mesh position={[0, 0.8, 0]}>
            <planeGeometry args={[1.3, 0.4]} />
            <meshBasicMaterial
              color="#fde047"
              depthWrite={false}
              polygonOffset
              polygonOffsetFactor={-4}
              polygonOffsetUnits={-4}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export const MiniatureCity: React.FC = () => {
  return (
    <group>
      <ExpandedCityRoads />
      <SkyscraperBlocks />
      <RealisticTrees />
      <ModernStreetlights />

      {/* ── GROUNDED EXPANDED WORLD PERIMETER BORDER WALL (y = -0.06..2.5m, flush on tarmac) ── */}
      <group>
        {/* North Wall (z = -94.8, x: -88..268 -> len 356, center 90) */}
        <mesh position={[90, 1.22, -94.8]} receiveShadow>
          <boxGeometry args={[358, 2.56, 0.9]} />
          <meshStandardMaterial color="#12141c" metalness={0.65} roughness={0.45} />
        </mesh>
        <mesh position={[90, 2.52, -94.8]}>
          <boxGeometry args={[358, 0.14, 1.0]} />
          <meshBasicMaterial color="#ef4444" toneMapped={false} />
        </mesh>

        {/* South Wall (z = +94.8) */}
        <mesh position={[90, 1.22, 94.8]} receiveShadow>
          <boxGeometry args={[358, 2.56, 0.9]} />
          <meshStandardMaterial color="#12141c" metalness={0.65} roughness={0.45} />
        </mesh>
        <mesh position={[90, 2.52, 94.8]}>
          <boxGeometry args={[358, 0.14, 1.0]} />
          <meshBasicMaterial color="#ef4444" toneMapped={false} />
        </mesh>

        {/* West Wall (x = -88.8, z: -95..95 -> len 190) */}
        <mesh position={[-88.8, 1.22, 0]} receiveShadow>
          <boxGeometry args={[0.9, 2.56, 190.4]} />
          <meshStandardMaterial color="#12141c" metalness={0.65} roughness={0.45} />
        </mesh>
        <mesh position={[-88.8, 2.52, 0]}>
          <boxGeometry args={[1.0, 0.14, 190.4]} />
          <meshBasicMaterial color="#f97316" toneMapped={false} />
        </mesh>

        {/* East Factory Outer Wall (x = +268.8) */}
        <mesh position={[268.8, 1.22, 0]} receiveShadow>
          <boxGeometry args={[0.9, 2.56, 190.4]} />
          <meshStandardMaterial color="#12141c" metalness={0.65} roughness={0.45} />
        </mesh>
        <mesh position={[268.8, 2.52, 0]}>
          <boxGeometry args={[1.0, 0.14, 190.4]} />
          <meshBasicMaterial color="#ef4444" toneMapped={false} />
        </mesh>
      </group>

      {/* ── 3D IMPORTED ARCHITECTURAL BUILDINGS ── */}
      <CanvasErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          {/* Modern Night Skyscraper (Grounded firmly at y = -0.05) */}
          <ModernNightBuilding position={[34, 0, 22]} name="QUANTUM RESIDENCE" />
          <ModernNightBuilding position={[-36, 0, -26]} name="NEO METROPOLIS" />
        </Suspense>
      </CanvasErrorBoundary>

      <CanvasErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          {/* Office Commercial Building Complex */}
          <OfficeBuildingModel position={[28, 0, -34]} name="CYBERTECH HQ" />
          <OfficeBuildingModel position={[-34, 0, 32]} rotation={[0, Math.PI, 0]} name="ENTERPRISE CENTER" />
        </Suspense>
      </CanvasErrorBoundary>

      <CanvasErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          {/* Asian Themed Night City Skyline Backdrops (Grounded outside north & south border walls) */}
          <AsianNightSkyline position={[10, 0, -138]} />
          <AsianNightSkyline position={[160, 0, -138]} />
          <AsianNightSkyline position={[10, 0, 138]} rotation={[0, Math.PI, 0]} />
          <AsianNightSkyline position={[160, 0, 138]} rotation={[0, Math.PI, 0]} />
        </Suspense>
      </CanvasErrorBoundary>
    </group>
  );
};

export default MiniatureCity;
