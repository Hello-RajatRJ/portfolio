import React, { useMemo } from 'react';
import { MeshStandardMaterial, BoxGeometry, Matrix4, InstancedMesh, Vector3 } from 'three';
import { Text } from '@react-three/drei';

// ─── 1. POLISHED ARENA FLOOR WITH SAFETY HAZARD BORDERS ─────────────────────
const ArenaFloor: React.FC = () => {
  const floorMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#080c18',
        roughness: 0.22,
        metalness: 0.42,
        envMapIntensity: 2.2,
      }),
    []
  );

  return (
    <group position={[0, -0.04, 0]}>
      {/* High-gloss polished industrial epoxy floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[110, 110]} />
        <primitive object={floorMat} attach="material" />
      </mesh>

      {/* Yellow & Black perimeter safety hazard border */}
      {[-36, 36].map((z) => (
        <mesh key={`curb-z-${z}`} position={[0, 0.05, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[74, 0.8]} />
          <meshStandardMaterial color="#ffd700" roughness={0.4} />
        </mesh>
      ))}
      {[-36, 36].map((x) => (
        <mesh key={`curb-x-${x}`} position={[x, 0.05, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <planeGeometry args={[74, 0.8]} />
          <meshStandardMaterial color="#ffd700" roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
};

// ─── 2. GIANT RETRO NEON JUKEBOX (Direct 1:1 from hotwheels2.jpeg) ───────────
// Features concentric rainbow neon tube arches (magenta, cyan, yellow, lime, white),
// Art Deco arched cabinet, chrome speaker grille, and warm neon floor lighting.
const RetroNeonJukebox: React.FC<{ position: [number, number, number]; rotation?: [number, number, number] }> = ({
  position,
  rotation = [0, 0, 0],
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Heavy Wooden/Chrome Cabinet Base (Width 7m, Height 9m, Depth 3m) */}
      <mesh position={[0, 4.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[6.4, 8.0, 2.6]} />
        <meshStandardMaterial color="#1a0f0a" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Top Arched Dome Crown */}
      <mesh position={[0, 8.0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <cylinderGeometry args={[3.2, 3.2, 2.6, 24, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#1a0f0a" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Outer Chrome Rim Arch */}
      <mesh position={[0, 5.0, 1.34]}>
        <torusGeometry args={[3.1, 0.22, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* ── CONCENTRIC GLOWING RAINBOW NEON TUBE ARCHES (hotwheels2.jpeg) ─── */}
      {/* Tube 1: Outer Blazing Magenta / Neon Pink */}
      <mesh position={[0, 5.0, 1.38]}>
        <torusGeometry args={[2.8, 0.1, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#ff007f" emissive="#ff007f" emissiveIntensity={3.5} toneMapped={false} />
      </mesh>
      {/* Tube 2: Electric Cyan / Blue */}
      <mesh position={[0, 5.0, 1.38]}>
        <torusGeometry args={[2.55, 0.09, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={3.5} toneMapped={false} />
      </mesh>
      {/* Tube 3: Radiant Lime / Green */}
      <mesh position={[0, 5.0, 1.38]}>
        <torusGeometry args={[2.3, 0.08, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={3.2} toneMapped={false} />
      </mesh>
      {/* Tube 4: Bright Golden Yellow */}
      <mesh position={[0, 5.0, 1.38]}>
        <torusGeometry args={[2.05, 0.08, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffea00" emissiveIntensity={3.2} toneMapped={false} />
      </mesh>
      {/* Tube 5: Inner Pure White Glow */}
      <mesh position={[0, 5.0, 1.38]}>
        <torusGeometry args={[1.8, 0.07, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={4.0} toneMapped={false} />
      </mesh>

      {/* Vertical Side Neon Pillar Tubes */}
      {[-2.8, 2.8].map((px) => (
        <group key={`side-neon-${px}`} position={[px, 2.5, 1.38]}>
          <mesh>
            <cylinderGeometry args={[0.08, 0.08, 5.0, 12]} />
            <meshStandardMaterial color="#ff007f" emissive="#ff007f" emissiveIntensity={3.2} toneMapped={false} />
          </mesh>
          <mesh position={[px > 0 ? -0.15 : 0.15, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 5.0, 12]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={3.2} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* Circular Chrome Speaker Grille (Center lower half) */}
      <mesh position={[0, 2.5, 1.34]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.12, 24]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 2.5, 1.42]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.35, 1.35, 0.04, 24]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>

      {/* Illuminated Song Selection Glass Display */}
      <mesh position={[0, 5.0, 1.33]}>
        <planeGeometry args={[2.8, 1.6]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffb700" emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      <Text position={[0, 5.15, 1.36]} fontSize={0.28} color="#0f172a" anchorX="center" anchorY="middle">
        HOT WHEELS JUKEBOX
      </Text>
      <Text position={[0, 4.75, 1.36]} fontSize={0.18} color="#b45309" anchorX="center" anchorY="middle">
        ★ UNLEASHED ROCK & BEATS ★
      </Text>

      {/* Glowing Rainbow Ambient PointLight */}
      <pointLight position={[0, 4.5, 2.4]} color="#ff00aa" intensity={12} distance={18} />
      <pointLight position={[0, 2.0, 2.4]} color="#00f0ff" intensity={8} distance={14} />
    </group>
  );
};

// ─── 3. MODERN ORANGE WALL WITH WHITE CHEVRON STRIPES (hotwheels2.jpeg) ─────
// Signature geometric white diagonal line accents on matte flame-orange walls
const OrangeAccentWall: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
  width: number;
  height: number;
}> = ({ position, rotation = [0, 0, 0], width, height }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Main Flame-Orange Wall Panel */}
      <mesh position={[0, height / 2, 0]} receiveShadow>
        <boxGeometry args={[width, height, 0.8]} />
        <meshStandardMaterial color="#ea580c" roughness={0.5} metalness={0.1} />
      </mesh>

      {/* Diagonal White Geometric Accent Stripes (hotwheels2.jpeg) */}
      {[-16, -10, -4, 2, 8, 14, 20].map((sx, idx) => (
        <group key={`stripe-${idx}`} position={[sx, height / 2, 0.42]}>
          <mesh rotation={[0, 0, 0.62]}>
            <boxGeometry args={[0.32, height * 1.3, 0.02]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
          <mesh rotation={[0, 0, -0.62]}>
            <boxGeometry args={[0.32, height * 1.3, 0.02]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Wall-Mounted Hot Wheels Unleashed TV Display (hotwheels2.jpeg) */}
      <group position={[-6, height * 0.65, 0.5]}>
        {/* TV Frame */}
        <mesh castShadow>
          <boxGeometry args={[5.2, 3.0, 0.18]} />
          <meshStandardMaterial color="#09090b" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Glowing Screen */}
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[4.9, 2.7]} />
          <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.8} />
        </mesh>
        <Text position={[0, 0.35, 0.12]} fontSize={0.48} color="#ffd700" anchorX="center" anchorY="middle">
          HOT WHEELS
        </Text>
        <Text position={[0, -0.35, 0.12]} fontSize={0.24} color="#ffffff" anchorX="center" anchorY="middle">
          UNLEASHED TV
        </Text>
      </group>
    </group>
  );
};

// ─── 4. SKATEPARK HALF-PIPES & STREET ART GRAFFITI MURALS (hotwheels1.jpeg) ──
const SkateparkAndStreetArt: React.FC = () => {
  const woodMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#b45309',
        roughness: 0.65,
        metalness: 0.08,
      }),
    []
  );

  return (
    <group>
      {/* ── Wooden Skatepark Bowl / Quarter-Pipe Ramp at [-25, 0, 18] ── */}
      <group position={[-25, 0, 18]} rotation={[0, 0.35, 0]}>
        {/* Curved Plywood Face */}
        <mesh position={[0, 2.2, 0]} rotation={[0, 0, -0.32]} castShadow receiveShadow>
          <boxGeometry args={[11, 0.32, 9]} />
          <primitive object={woodMat} attach="material" />
        </mesh>
        {/* Metal Coping Rail along ramp lip */}
        <mesh position={[5.1, 3.8, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 9, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.2} />
        </mesh>
        {/* Sub-framework Support Underneath */}
        <mesh position={[-2.2, 1.1, 0]}>
          <boxGeometry args={[6.8, 2.2, 8.8]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </mesh>
      </group>

      {/* ── Second Skatepark Quarter-Pipe Ramp at [-25, 0, -18] ── */}
      <group position={[-25, 0, -18]} rotation={[0, -0.35, 0]}>
        <mesh position={[0, 2.2, 0]} rotation={[0, 0, -0.32]} castShadow receiveShadow>
          <boxGeometry args={[11, 0.32, 9]} />
          <primitive object={woodMat} attach="material" />
        </mesh>
        <mesh position={[5.1, 3.8, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 9, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.2} />
        </mesh>
      </group>

      {/* ── Authentic Hot Wheels Street Art / Graffiti Murals on West Wall ── */}
      <group position={[-37.4, 6.0, 0]} rotation={[0, Math.PI / 2, 0]}>
        {/* Mural Background Board */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[36, 8.5]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>

        {/* Giant Fiery Graffiti Flame Tag */}
        <Text position={[-8, 1.2, 0.08]} fontSize={1.8} color="#ea580c" anchorX="center" anchorY="middle">
          🔥 UNLEASHED 🔥
        </Text>
        <Text position={[-8, -0.6, 0.08]} fontSize={0.65} color="#ffd700" anchorX="center" anchorY="middle">
          HOT WHEELS RACING CIRCUIT
        </Text>

        {/* Bold Racing Number #68 Emblem (hotwheels1.jpeg) */}
        <group position={[8, 0.8, 0.08]}>
          {/* Round Circle Decal */}
          <mesh>
            <circleGeometry args={[1.8, 32]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <Text position={[0, 0, 0.05]} fontSize={1.4} color="#0f172a" anchorX="center" anchorY="middle">
            68
          </Text>
        </group>

        {/* Checkerboard Racing Strip along bottom of mural */}
        {Array.from({ length: 18 }).map((_, cIdx) => (
          <mesh key={`check-${cIdx}`} position={[-17 + cIdx * 2.0, -3.2, 0.05]}>
            <planeGeometry args={[1.0, 1.0]} />
            <meshBasicMaterial color={cIdx % 2 === 0 ? '#ffffff' : '#000000'} />
          </mesh>
        ))}

        {/* Directional Chevron Signs (>>>) pointing toward the curve */}
        {[-4, 0, 4].map((cx) => (
          <group key={`arrow-${cx}`} position={[cx, -1.8, 0.06]}>
            <Text fontSize={0.9} color="#ffd700">
              {'>>>'}
            </Text>
          </group>
        ))}
      </group>
    </group>
  );
};

// ─── 5. SKYSCRAPER PANORAMIC GLASS CURTAIN WALLS & CITY SKYLINE ─────────────
// Matches hotwheels.jpeg ("Skyscraper Unveil")
const SkyscraperWalls: React.FC = () => {
  const glassMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#0f172a',
        roughness: 0.08,
        metalness: 0.92,
        transparent: true,
        opacity: 0.32,
        envMapIntensity: 2.8,
      }),
    []
  );

  const concreteMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#1e293b',
        roughness: 0.85,
        metalness: 0.2,
      }),
    []
  );

  const steelFrameMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#0055ff',
        roughness: 0.28,
        metalness: 0.75,
      }),
    []
  );

  return (
    <group>
      {/* North & South Panoramic Glass Curtain Walls */}
      {[
        { pos: [0, 0, 38] as [number, number, number], rot: [0, 0, 0] as [number, number, number] },
        { pos: [0, 0, -38] as [number, number, number], rot: [0, Math.PI, 0] as [number, number, number] },
      ].map((wall, idx) => (
        <group key={`glass-wall-${idx}`} position={wall.pos} rotation={wall.rot}>
          {/* Lower Heavy Concrete Foundation Wall (0 -> 4m) */}
          <mesh position={[0, 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[76, 4, 1.2]} />
            <primitive object={concreteMat} attach="material" />
          </mesh>

          {/* Yellow Safety Hazard Trim Strip */}
          <mesh position={[0, 4.05, 0.61]}>
            <boxGeometry args={[76, 0.18, 0.05]} />
            <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.5} />
          </mesh>

          {/* Panoramic Skyscraper Glass Curtain Wall (4m -> 22m) */}
          <mesh position={[0, 13, 0]}>
            <boxGeometry args={[76, 18, 0.4]} />
            <primitive object={glassMat} attach="material" />
          </mesh>

          {/* Vertical Steel Mullions / Window Frame Columns */}
          {[-30, -20, -10, 0, 10, 20, 30].map((mx) => (
            <mesh key={`mullion-${mx}`} position={[mx, 13, 0.25]} castShadow>
              <boxGeometry args={[0.5, 18, 0.5]} />
              <primitive object={steelFrameMat} attach="material" />
            </mesh>
          ))}

          {/* Horizontal Window Transom Beams */}
          {[9, 15, 21].map((my) => (
            <mesh key={`transom-${my}`} position={[0, my, 0.22]}>
              <boxGeometry args={[76, 0.4, 0.45]} />
              <primitive object={steelFrameMat} attach="material" />
            </mesh>
          ))}
        </group>
      ))}

      {/* East Flame-Orange Accent Wall (hotwheels2.jpeg) */}
      <OrangeAccentWall position={[38, 0, 0]} rotation={[0, -Math.PI / 2, 0]} width={76} height={22} />

      {/* Distant Illuminated Skyscraper Silhouettes Outside Windows */}
      <DistantCitySkyline />
    </group>
  );
};

// Distant skyscrapers outside the arena glass windows (hotwheels.jpeg "Skyscraper Unveil")
const DistantCitySkyline: React.FC = () => {
  const buildingCount = 36;

  const { geo, mat, matrices } = useMemo(() => {
    const bGeo = new BoxGeometry(1, 1, 1);
    const bMat = new MeshStandardMaterial({
      color: '#080c18',
      roughness: 0.5,
      metalness: 0.8,
      emissive: '#1e1b4b',
      emissiveIntensity: 0.4,
    });

    const mats: Matrix4[] = [];
    for (let i = 0; i < buildingCount; i++) {
      const angle = (i / buildingCount) * Math.PI * 2 + Math.random() * 0.1;
      const radius = 55 + Math.random() * 25;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const width = 8 + Math.random() * 12;
      const depth = 8 + Math.random() * 12;
      const height = 30 + Math.random() * 55;

      const m = new Matrix4();
      m.makeTranslation(x, height / 2 - 4, z);
      m.scale(new Vector3(width, height, depth));
      mats.push(m);
    }

    return { geo: bGeo, mat: bMat, matrices: mats };
  }, []);

  const meshRef = React.useRef<InstancedMesh>(null);
  React.useEffect(() => {
    if (meshRef.current) {
      matrices.forEach((m, i) => meshRef.current!.setMatrixAt(i, m));
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [matrices]);

  return <instancedMesh ref={meshRef} args={[geo, mat, buildingCount]} />;
};

// ─── 6. OVERHEAD INDUSTRIAL ROOF TRUSSES & STADIUM FLOODLIGHTS ─────────────
const OverheadRoofTrusses: React.FC = () => {
  const trussMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#1e293b',
        metalness: 0.8,
        roughness: 0.4,
      }),
    []
  );

  return (
    <group position={[0, 22, 0]}>
      {/* 5 Massive Cross-Girders Spanning Overhead East-West */}
      {[-28, -14, 0, 14, 28].map((z) => (
        <group key={`truss-z-${z}`} position={[0, 0, z]}>
          {/* Main Top Chord Beam */}
          <mesh castShadow>
            <boxGeometry args={[76, 0.8, 0.6]} />
            <primitive object={trussMat} attach="material" />
          </mesh>
          {/* Bottom Chord Beam */}
          <mesh position={[0, -1.8, 0]} castShadow>
            <boxGeometry args={[76, 0.6, 0.5]} />
            <primitive object={trussMat} attach="material" />
          </mesh>

          {/* Suspended Stadium Floodlight Banks */}
          {[-18, 0, 18].map((lx) => (
            <group key={`flood-${lx}`} position={[lx, -2.6, 0]}>
              <mesh castShadow>
                <boxGeometry args={[3.0, 0.6, 1.2]} />
                <meshStandardMaterial color="#0f172a" roughness={0.5} />
              </mesh>
              <mesh position={[0, -0.32, 0]}>
                <boxGeometry args={[2.7, 0.05, 0.9]} />
                <meshBasicMaterial color="#ffffff" toneMapped={false} />
              </mesh>
              <spotLight
                position={[0, -0.5, 0]}
                angle={0.55}
                penumbra={0.7}
                intensity={45}
                distance={35}
                color="#f8fafc"
                castShadow={false}
              />
            </group>
          ))}
        </group>
      ))}

      {/* Central Suspended 4-Sided Hot Wheels Jumbotron Display */}
      <group position={[0, -4.5, 0]}>
        {/* Truss Hanger Cables */}
        {[-3, 3].map((hx) =>
          [-3, 3].map((hz) => (
            <mesh key={`hanger-${hx}-${hz}`} position={[hx, 2.5, hz]}>
              <cylinderGeometry args={[0.04, 0.04, 5.0, 6]} />
              <meshStandardMaterial color="#64748b" metalness={0.9} />
            </mesh>
          ))
        )}

        {/* Jumbotron Housing Box */}
        <mesh castShadow>
          <boxGeometry args={[7.2, 3.2, 7.2]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
        <mesh>
          <boxGeometry args={[7.35, 3.35, 7.35]} />
          <meshBasicMaterial color="#ff4800" wireframe />
        </mesh>

        {/* 4 Digital Video Screens */}
        {/* North Display */}
        <group position={[0, 0, -3.62]} rotation={[0, Math.PI, 0]}>
          <mesh>
            <planeGeometry args={[6.8, 2.8]} />
            <meshBasicMaterial color="#0284c7" />
          </mesh>
          <Text position={[0, 0.4, 0.02]} fontSize={0.65} color="#ffd700" anchorX="center" anchorY="middle">
            HOT WHEELS
          </Text>
          <Text position={[0, -0.4, 0.02]} fontSize={0.35} color="#ffffff" anchorX="center" anchorY="middle">
            ★ UNLEASHED ARENA ★
          </Text>
        </group>

        {/* South Display */}
        <group position={[0, 0, 3.62]}>
          <mesh>
            <planeGeometry args={[6.8, 2.8]} />
            <meshBasicMaterial color="#0284c7" />
          </mesh>
          <Text position={[0, 0.4, 0.02]} fontSize={0.65} color="#ffd700" anchorX="center" anchorY="middle">
            HOT WHEELS
          </Text>
          <Text position={[0, -0.4, 0.02]} fontSize={0.35} color="#ffffff" anchorX="center" anchorY="middle">
            ★ UNLEASHED ARENA ★
          </Text>
        </group>

        {/* East Display */}
        <group position={[3.62, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <mesh>
            <planeGeometry args={[6.8, 2.8]} />
            <meshBasicMaterial color="#ff4800" />
          </mesh>
          <Text position={[0, 0.4, 0.02]} fontSize={0.65} color="#ffffff" anchorX="center" anchorY="middle">
            SPEED LOOP
          </Text>
          <Text position={[0, -0.4, 0.02]} fontSize={0.35} color="#ffd700" anchorX="center" anchorY="middle">
            360° MEGA STUNT
          </Text>
        </group>

        {/* West Display */}
        <group position={[-3.62, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh>
            <planeGeometry args={[6.8, 2.8]} />
            <meshBasicMaterial color="#ff4800" />
          </mesh>
          <Text position={[0, 0.4, 0.02]} fontSize={0.65} color="#ffffff" anchorX="center" anchorY="middle">
            PORTFOLIO
          </Text>
          <Text position={[0, -0.4, 0.02]} fontSize={0.35} color="#ffd700" anchorX="center" anchorY="middle">
            RAJAT'S RIDE 3D
          </Text>
        </group>
      </group>
    </group>
  );
};

// ─── MASTER HOT WHEELS ARENA ENVIRONMENT COMPONENT ─────────────────────────
export const HotWheelsArena: React.FC = () => {
  return (
    <group>
      {/* 1. Polished Arena Floor with Safety Hazard Markings */}
      <ArenaFloor />

      {/* 2. Giant Retro Neon Jukebox from hotwheels2.jpeg */}
      <RetroNeonJukebox position={[25, 0, 8]} rotation={[0, -Math.PI / 2, 0]} />

      {/* 3. Panoramic Skyscraper Glass Walls, Orange Accent Wall & City Skyline */}
      <SkyscraperWalls />

      {/* 4. Skatepark Ramps & Authentic Hot Wheels Graffiti Murals (hotwheels1.jpeg) */}
      <SkateparkAndStreetArt />

      {/* 5. Overhead Steel Roof Trusses, Stadium Lights & 4-Sided Jumbotron */}
      <OverheadRoofTrusses />
    </group>
  );
};
