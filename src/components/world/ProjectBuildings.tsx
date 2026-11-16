import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import type { Project } from '../../types';
import { PROJECT_LOCATIONS } from '../../data/projectLocations';
import { FactoryArchitectureShell } from './ai-factory/FactoryArchitectureShell';

interface ProjectBuildingsProps {
  projects: Project[];
  activeProjectZoneId: string | null;
}

const CONDUIT_CURVE_POINTS: THREE.Vector3[][] = [
  // Left avenue ridge conduit: P01 -> P03 -> P05 -> P07
  [
    new THREE.Vector3(-18, 4.45, -18),
    new THREE.Vector3(-18, 4.65, -8),
    new THREE.Vector3(-18, 4.65, 2),
    new THREE.Vector3(-18, 4.45, 12),
  ],
  // Right avenue ridge conduit: P02 -> P04 -> P06 -> P08
  [
    new THREE.Vector3(-9, 4.65, -18),
    new THREE.Vector3(-9, 4.45, -8),
    new THREE.Vector3(-9, 4.45, 2),
    new THREE.Vector3(-9, 4.65, 12),
  ],
  // North campus high span bridge clear of elevated stunt tracks: P01 <-> P02
  [
    new THREE.Vector3(-18, 4.45, -18),
    new THREE.Vector3(-15.5, 5.45, -18),
    new THREE.Vector3(-11.5, 5.45, -18),
    new THREE.Vector3(-9, 4.65, -18),
  ],
  // East industrial feeder linking Projects Campus toward Factory corridor
  [
    new THREE.Vector3(-9, 4.45, -18),
    new THREE.Vector3(-4.5, 5.2, -18),
    new THREE.Vector3(2.0, 5.0, -18),
  ],
];

const PACKETS_PER_CONDUIT = 10;
const TOTAL_PACKETS = CONDUIT_CURVE_POINTS.length * PACKETS_PER_CONDUIT;

export const ProjectBuildings: React.FC<ProjectBuildingsProps> = ({
  projects,
  activeProjectZoneId,
}) => {
  const holoRefs = useRef<(THREE.Group | null)[]>([]);
  const packetMeshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmpPos = useMemo(() => new THREE.Vector3(), []);

  const conduits = useMemo(
    () =>
      CONDUIT_CURVE_POINTS.map((pts) => {
        const curve = new THREE.CatmullRomCurve3(pts);
        const geo = new THREE.TubeGeometry(curve, 36, 0.11, 8, false);
        return { curve, geo };
      }),
    []
  );

  const packetGeo = useMemo(() => new THREE.SphereGeometry(0.16, 10, 10), []);
  const packetMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#fb923c',
        toneMapped: false,
      }),
    []
  );

  useEffect(() => {
    return () => {
      conduits.forEach((c) => c.geo.dispose());
      packetGeo.dispose();
      packetMat.dispose();
    };
  }, [conduits, packetGeo, packetMat]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    holoRefs.current.forEach((group, idx) => {
      if (!group) return;
      group.rotation.y += dt * (idx % 2 === 0 ? 0.9 : -0.8);
      group.position.y = Math.sin(t * 2.2 + idx * 0.9) * 0.14;
    });

    const mesh = packetMeshRef.current;
    if (mesh) {
      let instanceIdx = 0;
      conduits.forEach((c, cIdx) => {
        for (let p = 0; p < PACKETS_PER_CONDUIT; p++) {
          const u = (p / PACKETS_PER_CONDUIT + t * (0.24 + cIdx * 0.03)) % 1;
          c.curve.getPointAt(u, tmpPos);
          dummy.position.copy(tmpPos);
          const pulse = 0.85 + Math.sin(t * 6 + instanceIdx) * 0.25;
          dummy.scale.setScalar(pulse);
          dummy.updateMatrix();
          mesh.setMatrixAt(instanceIdx++, dummy.matrix);
        }
      });
      mesh.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group name="projects-engineering-campus">
      {/* ── CAMPUS ENTRANCE PORTAL ARCH (Matches AI Factory Gate Identity) ── */}
      <group position={[-13.5, 0, -22.2]}>
        {[-3.4, 3.4].map((sx) => (
          <group key={`proj-gate-col-${sx}`} position={[sx, 2.9, 0]}>
            <mesh>
              <boxGeometry args={[0.52, 5.8, 0.56]} />
              <meshStandardMaterial color="#15161d" metalness={0.86} roughness={0.28} />
            </mesh>
            <mesh position={[sx > 0 ? -0.28 : 0.28, 0, 0]}>
              <boxGeometry args={[0.08, 5.4, 0.22]} />
              <meshBasicMaterial color="#ef4444" toneMapped={false} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 5.95, 0]}>
          <boxGeometry args={[7.8, 0.92, 0.72]} />
          <meshStandardMaterial color="#0e0f14" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[0, 5.44, 0]}>
          <boxGeometry args={[7.4, 0.08, 0.78]} />
          <meshBasicMaterial color="#f97316" toneMapped={false} />
        </mesh>
        <Text
          position={[0, 6.05, 0.38]}
          fontSize={0.48}
          color="#ffffff"
          outlineWidth={0.055}
          outlineColor="#000000"
          anchorX="center"
          anchorY="middle"
        >
          PRODUCTION PROJECTS CAMPUS
        </Text>
        <Text
          position={[0, 5.62, 0.38]}
          fontSize={0.24}
          color="#fb923c"
          outlineWidth={0.032}
          outlineColor="#000000"
          anchorX="center"
          anchorY="middle"
        >
          08 AI & FULL-STACK SYSTEMS · DRIVE BAY & PRESS [E]
        </Text>
      </group>

      {/* ── CONNECTED OVERHEAD DATA PIPELINES ── */}
      {conduits.map((c, idx) => (
        <mesh key={`proj-conduit-${idx}`} geometry={c.geo}>
          <meshStandardMaterial
            color="#991b1b"
            emissive="#ef4444"
            emissiveIntensity={0.45}
            transparent
            opacity={0.42}
            roughness={0.18}
            metalness={0.5}
          />
        </mesh>
      ))}

      <instancedMesh
        ref={packetMeshRef}
        args={[packetGeo, packetMat, TOTAL_PACKETS]}
        frustumCulled={false}
      />

      {/* ── 8 HOLOGRAPHIC INDUSTRIAL PROJECT PAVILIONS ── */}
      {projects.map((project, idx) => {
        const loc = PROJECT_LOCATIONS[project.id];
        if (!loc) return null;

        const isActive = activeProjectZoneId === project.id;
        const isTower = loc.modelType === 'tower';
        const code = `P${String(idx + 1).padStart(2, '0')}`;
        const width = isTower ? 2.4 : 2.15;
        const depth = isTower ? 2.4 : 2.1;
        const height = isTower ? 3.8 : 2.75;
        const isLeftRow = loc.x < -13.5;
        const frontFace: 'E' | 'W' = isLeftRow ? 'E' : 'W';

        const outerSideX = isLeftRow ? loc.x - width / 2 - 0.14 : loc.x + width / 2 + 0.14;
        const checkpointX = isLeftRow ? loc.x + 2.15 : loc.x - 2.15;
        const roofBaseY = height + 0.68;
        const billboardY = height + 2.55;
        const accentColor = isActive ? '#fde047' : '#ef4444';
        const trimColor = isActive ? '#fde047' : '#f97316';

        return (
          <group key={project.id} name={`project-pavilion-${project.id}`}>
            {/* Grounded Industrial Bay Apron (anchors curb & pavilion seamlessly) */}
            <mesh position={[checkpointX, 0.015, loc.z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[2.4, 2.9]} />
              <meshStandardMaterial color="#111218" metalness={0.55} roughness={0.65} />
            </mesh>

            {/* AI-Factory-Style Multi-Layered Metallic / Glass Shell */}
            <FactoryArchitectureShell
              position={[loc.x, 0, loc.z]}
              size={[width, height, depth]}
              code={code}
              accent="#dc2626"
              secondaryAccent="#f97316"
              highlighted={isActive}
              frontFace={frontFace}
            />

            {/* Exterior Cooling Fin Manifold & Conduit Anchor on Outer Wall */}
            <group position={[outerSideX, height * 0.5 + 0.2, loc.z]}>
              {[-0.55, 0, 0.55].map((rz) => (
                <mesh key={`fin-${rz}`} position={[0, 0, rz]}>
                  <boxGeometry args={[0.16, height * 0.65, 0.24]} />
                  <meshStandardMaterial color="#1e202b" metalness={0.85} roughness={0.28} />
                </mesh>
              ))}
              <mesh position={[isLeftRow ? -0.1 : 0.1, height * 0.22, 0]}>
                <boxGeometry args={[0.06, 0.12, depth * 0.72]} />
                <meshBasicMaterial color={trimColor} toneMapped={false} />
              </mesh>
            </group>

            {/* Rooftop Cooling Pedestal + Rotating Wireframe Hologram Core */}
            <group position={[loc.x, roofBaseY, loc.z]}>
              <mesh position={[0, 0.12, 0]}>
                <cylinderGeometry args={[0.58, 0.74, 0.22, 8]} />
                <meshStandardMaterial color="#181922" metalness={0.85} roughness={0.25} />
              </mesh>
              <group
                position={[0, 0.78, 0]}
                ref={(el) => {
                  holoRefs.current[idx] = el;
                }}
              >
                <mesh>
                  {idx % 2 === 0 ? (
                    <octahedronGeometry args={[0.48, 0]} />
                  ) : (
                    <icosahedronGeometry args={[0.46, 0]} />
                  )}
                  <meshBasicMaterial
                    color={accentColor}
                    wireframe
                    toneMapped={false}
                  />
                </mesh>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.62, 0.035, 8, 28]} />
                  <meshBasicMaterial color={trimColor} toneMapped={false} />
                </mesh>
              </group>
            </group>

            {/* Curbside Holographic Inspection Pad (facing x = -13.5 Avenue) */}
            <group position={[checkpointX, 0.032, loc.z]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[1.05, 24]} />
                <meshBasicMaterial
                  color={isActive ? '#f97316' : '#991b1b'}
                  transparent
                  opacity={isActive ? 0.52 : 0.28}
                />
              </mesh>
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]}>
                <ringGeometry args={[1.02, 1.24, 24]} />
                <meshBasicMaterial
                  color={accentColor}
                  toneMapped={false}
                />
              </mesh>
              {/* Dual Short Beacon Bollards */}
              {[-0.95, 0.95].map((bz) => (
                <group key={`bollard-${bz}`} position={[isLeftRow ? -0.85 : 0.85, 0.34, bz]}>
                  <mesh>
                    <boxGeometry args={[0.12, 0.68, 0.12]} />
                    <meshStandardMaterial color="#1a1b24" metalness={0.8} roughness={0.3} />
                  </mesh>
                  <mesh position={[0, 0.28, 0]}>
                    <boxGeometry args={[0.15, 0.1, 0.15]} />
                    <meshBasicMaterial color={trimColor} toneMapped={false} />
                  </mesh>
                </group>
              ))}
            </group>

            {/* AI-Factory-Style High-Visibility Floating Project Billboard */}
            <Billboard position={[loc.x, billboardY, loc.z]} follow>
              <mesh position={[0, 0, 0]}>
                <planeGeometry args={[6.8, 2.15]} />
                <meshBasicMaterial color={accentColor} toneMapped={false} />
              </mesh>
              <mesh position={[0, 0, 0.02]}>
                <planeGeometry args={[6.55, 1.92]} />
                <meshBasicMaterial color="#05060b" />
              </mesh>
              <Text
                position={[0, 0.58, 0.05]}
                fontSize={0.28}
                color="#fb923c"
                outlineWidth={0.035}
                outlineColor="#000000"
                outlineOpacity={1}
                anchorX="center"
                anchorY="middle"
              >
                {`${code} · ${project.category.toUpperCase()}`}
              </Text>
              <Text
                position={[0, 0.08, 0.05]}
                fontSize={0.52}
                color="#ffffff"
                outlineWidth={0.065}
                outlineColor="#000000"
                outlineOpacity={1}
                anchorX="center"
                anchorY="middle"
              >
                {project.name.toUpperCase()}
              </Text>
              <Text
                position={[0, -0.52, 0.05]}
                fontSize={0.28}
                color={isActive ? '#fde047' : '#94a3b8'}
                outlineWidth={0.035}
                outlineColor="#000000"
                outlineOpacity={1}
                anchorX="center"
                anchorY="middle"
              >
                {isActive ? '★ PRESS [E] TO EXPLORE ARCHITECTURE' : 'DRIVE TO CHECKPOINT BAY'}
              </Text>
            </Billboard>
          </group>
        );
      })}
    </group>
  );
};
