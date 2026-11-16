import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  CatmullRomCurve3,
  Vector3,
  TubeGeometry,
  MeshPhysicalMaterial,
  Object3D,
  InstancedMesh,
  Color,
  Group,
} from 'three';
import { Text, Billboard } from '@react-three/drei';
import { AI_DEPARTMENTS, AI_PIPELINE_CONDUITS } from '../../../data/aiFactoryData';
import { carGlobalPosition } from '../../CarState';

const _dummy = new Object3D();
const _tmpPos = new Vector3();
const _tmpTan = new Vector3();
const _color = new Color();

interface ConveyorRun {
  start: [number, number, number];
  end: [number, number, number];
  count: number;
  color: string;
  speed: number;
  scale?: [number, number, number];
}

// Physical moving conveyor runs aligned cleanly with the Start-at-01 Clockwise Factory Layout
const CONVEYOR_RUNS: ConveyorRun[] = [
  // Dept 01 multi-source intake conveyors (right at Entrance Left [104, 0, -22])
  { start: [94, 0.85, -28], end: [101, 0.85, -24], count: 6, color: '#fb923c', speed: 0.25, scale: [0.55, 0.35, 0.55] },
  { start: [94, 0.85, -22], end: [101, 0.85, -22], count: 6, color: '#ef4444', speed: 0.23, scale: [0.55, 0.35, 0.55] },
  { start: [94, 0.85, -16], end: [101, 0.85, -20], count: 6, color: '#fef3c7', speed: 0.26, scale: [0.55, 0.35, 0.55] },
  // 02 -> 03 -> 04 -> 05 -> 06 North Spine Elevated Conveyor Bridges (y=2.55m)
  { start: [119, 2.55, -60], end: [137, 2.55, -60], count: 10, color: '#f97316', speed: 0.2, scale: [0.65, 0.36, 0.65] },
  { start: [151, 2.55, -60], end: [169, 2.55, -60], count: 10, color: '#fb923c', speed: 0.2, scale: [0.6, 0.34, 0.6] },
  // Dept 03 Rejection Conveyor (diverts corrupted/duplicate payloads into incinerator bin at [153, 0, -77])
  { start: [144, 1.4, -67], end: [153, 0.9, -76], count: 8, color: '#dc2626', speed: 0.28, scale: [0.48, 0.32, 0.48] },
  { start: [183, 2.55, -60], end: [201, 2.55, -60], count: 10, color: '#fff7ed', speed: 0.22, scale: [0.5, 0.3, 0.5] },
  { start: [215, 2.55, -60], end: [235, 2.55, -60], count: 10, color: '#fb923c', speed: 0.22, scale: [0.45, 0.3, 0.45] },
  // Dept 05->06 Chunking split cubes & Dept 06->07 East run
  { start: [242, 1.4, -56], end: [242, 1.4, -33], count: 14, color: '#fde68a', speed: 0.28, scale: [0.34, 0.28, 0.34] },
  // Dept 09 -> 10 Retrieval Selected Capsules
  { start: [234, 2.55, 62], end: [215, 2.55, 62], count: 10, color: '#fb923c', speed: 0.24, scale: [0.5, 0.35, 0.5] },
  // Dept 14 -> 15 Final Response Dispatch Conveyor
  { start: [122, 1.35, 57], end: [104, 1.35, 52], count: 10, color: '#fff7ed', speed: 0.24, scale: [0.62, 0.4, 0.62] },
];

// Illuminated animated road wayfinder chevrons: guides car from Main Gate -> Dept 01 -> clockwise 02..15 loop
interface NavArrowMarker {
  x: number;
  z: number;
  yaw: number; // Direction angle around Y
  phase: number;
  isStartGuide?: boolean;
}

const NAV_CHEVRONS: NavArrowMarker[] = [
  // Gate (x=94, z=0) -> East along Expressway -> Turn Left (North) straight into Dept 01 [117, 0, -22]!
  { x: 96, z: 0, yaw: Math.PI / 2, phase: 0, isStartGuide: true },
  { x: 103, z: 0, yaw: Math.PI / 2, phase: 1, isStartGuide: true },
  { x: 110, z: 0, yaw: Math.PI / 2, phase: 2, isStartGuide: true },
  { x: 117, z: -2, yaw: Math.PI, phase: 3, isStartGuide: true },
  { x: 117, z: -8, yaw: Math.PI, phase: 4, isStartGuide: true },
  { x: 117, z: -14, yaw: Math.PI, phase: 5, isStartGuide: true },
  // 01 -> 02 Northbound
  { x: 117, z: -32, yaw: Math.PI, phase: 6 },
  { x: 117, z: -40, yaw: Math.PI, phase: 7 },
  // North Production Avenue Eastbound (02 -> 06)
  { x: 126, z: -46, yaw: Math.PI / 2, phase: 8 },
  { x: 144, z: -46, yaw: Math.PI / 2, phase: 9 },
  { x: 162, z: -46, yaw: Math.PI / 2, phase: 10 },
  { x: 180, z: -46, yaw: Math.PI / 2, phase: 11 },
  { x: 198, z: -46, yaw: Math.PI / 2, phase: 12 },
  { x: 216, z: -46, yaw: Math.PI / 2, phase: 13 },
  // East Vector Corridor Southbound (07 -> 09)
  { x: 224, z: -34, yaw: 0, phase: 14 },
  { x: 224, z: -12, yaw: 0, phase: 15 },
  { x: 224, z: 8, yaw: 0, phase: 16 },
  { x: 224, z: 32, yaw: 0, phase: 17 },
  // South Wing Westbound (10 -> 15) & Tunnel Highlight
  { x: 214, z: 46, yaw: -Math.PI / 2, phase: 18 },
  { x: 190, z: 46, yaw: -Math.PI / 2, phase: 19 },
  { x: 162, z: 46, yaw: -Math.PI / 2, phase: 20 },
  { x: 135, z: 46, yaw: -Math.PI / 2, phase: 21 },
  { x: 112, z: 46, yaw: -Math.PI / 2, phase: 22 },
  // Central Glass Observation Tunnel Eastbound (Dept 11)
  { x: 150, z: 0, yaw: Math.PI / 2, phase: 23 },
  { x: 164, z: 0, yaw: Math.PI / 2, phase: 24 },
  { x: 178, z: 0, yaw: Math.PI / 2, phase: 25 },
];

// Exterior ventilation turbine positions across department roofs
const FAN_POSITIONS: [number, number, number][] = AI_DEPARTMENTS.flatMap((d) =>
  d.id === 'dept-11'
    ? [
        [d.buildingPos[0] - 4, 16.5, d.buildingPos[2] - 10],
        [d.buildingPos[0] + 4, 16.5, d.buildingPos[2] + 10],
      ]
    : [
        [d.buildingPos[0] - 2.5, 6.4, d.buildingPos[2] - 1.5],
        [d.buildingPos[0] + 2.5, 6.4, d.buildingPos[2] + 1.5],
      ]
);

export const AIFactoryInfrastructure: React.FC<{
  activeDeptId: string | null;
  nearbyDeptId: string | null;
}> = ({ activeDeptId, nearbyDeptId }) => {
  const particleMeshRef = useRef<InstancedMesh>(null);
  const cargoMeshRef = useRef<InstancedMesh>(null);
  const chevronMeshRef = useRef<InstancedMesh>(null);
  const fanGroupRef = useRef<Group>(null);
  const checkpointRingsRef = useRef<Group>(null);

  const { curves, tubeGeometries } = useMemo(() => {
    const builtCurves = AI_PIPELINE_CONDUITS.map(
      (c) => new CatmullRomCurve3(c.points.map((p) => new Vector3(p[0], p[1], p[2])))
    );
    const builtGeos = builtCurves.map(
      (curve, idx) => new TubeGeometry(curve, 24, AI_PIPELINE_CONDUITS[idx].radius || 0.22, 8, false)
    );
    return { curves: builtCurves, tubeGeometries: builtGeos };
  }, []);

  const pipeGlassMat = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: '#2b1214',
        emissive: '#5a0e0e',
        emissiveIntensity: 0.42,
        transparent: true,
        opacity: 0.38,
        roughness: 0.1,
        metalness: 0.65,
      }),
    []
  );

  useEffect(() => {
    return () => {
      tubeGeometries.forEach((g) => g.dispose());
      pipeGlassMat.dispose();
    };
  }, [tubeGeometries, pipeGlassMat]);

  const PARTICLES_PER_PIPE = 16;
  const totalParticles = curves.length * PARTICLES_PER_PIPE;
  const totalCargo = useMemo(() => CONVEYOR_RUNS.reduce((s, r) => s + r.count, 0), []);

  const cargoSlots = useMemo(() => {
    const list: { run: ConveyorRun; offset: number }[] = [];
    CONVEYOR_RUNS.forEach((run) => {
      for (let i = 0; i < run.count; i++) {
        list.push({ run, offset: i / run.count });
      }
    });
    return list;
  }, []);

  useEffect(() => {
    if (particleMeshRef.current) {
      for (let i = 0; i < totalParticles; i++) {
        const pipeIdx = Math.floor(i / PARTICLES_PER_PIPE);
        const cHex = AI_PIPELINE_CONDUITS[pipeIdx]?.color || '#ef4444';
        particleMeshRef.current.setColorAt(i, _color.set(cHex));
      }
      if (particleMeshRef.current.instanceColor) {
        particleMeshRef.current.instanceColor.needsUpdate = true;
      }
    }
    if (cargoMeshRef.current) {
      cargoSlots.forEach((slot, i) => {
        cargoMeshRef.current!.setColorAt(i, _color.set(slot.run.color));
      });
      if (cargoMeshRef.current.instanceColor) {
        cargoMeshRef.current.instanceColor.needsUpdate = true;
      }
    }
    if (chevronMeshRef.current) {
      NAV_CHEVRONS.forEach((nav, i) => {
        chevronMeshRef.current!.setColorAt(i, _color.set(nav.isStartGuide ? '#fde047' : '#f97316'));
      });
      if (chevronMeshRef.current.instanceColor) {
        chevronMeshRef.current.instanceColor.needsUpdate = true;
      }
    }
  }, [totalParticles, cargoSlots]);

  const infraFrameRef = useRef(0);

  useFrame((state, delta) => {
    infraFrameRef.current++;
    // Distance cull: skip particle recalculations if player is far away in City (> 95m)
    const distToFactory = Math.hypot(carGlobalPosition.x - 130, carGlobalPosition.z);
    if (distToFactory > 95) return;

    // Throttle complex particle matrix calculations to every 2nd frame (60Hz on 120Hz displays)
    if (infraFrameRef.current % 2 !== 0) return;

    const t = state.clock.elapsedTime;

    if (particleMeshRef.current) {
      let idx = 0;
      for (let p = 0; p < curves.length; p++) {
        const curve = curves[p];
        const speed = 0.25 + (p % 3) * 0.05;
        for (let j = 0; j < PARTICLES_PER_PIPE; j++) {
          const u = (j / PARTICLES_PER_PIPE + t * speed) % 1;
          curve.getPointAt(u, _tmpPos);
          curve.getTangentAt(u, _tmpTan);
          _dummy.position.copy(_tmpPos);
          _dummy.lookAt(_tmpPos.x + _tmpTan.x, _tmpPos.y + _tmpTan.y, _tmpPos.z + _tmpTan.z);
          _dummy.scale.set(0.15, 0.15, 0.44);
          _dummy.updateMatrix();
          particleMeshRef.current.setMatrixAt(idx++, _dummy.matrix);
        }
      }
      particleMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    if (cargoMeshRef.current) {
      for (let i = 0; i < cargoSlots.length; i++) {
        const { run, offset } = cargoSlots[i];
        const u = (offset + t * run.speed) % 1;
        const x = run.start[0] + (run.end[0] - run.start[0]) * u;
        const y = run.start[1] + (run.end[1] - run.start[1]) * u;
        const z = run.start[2] + (run.end[2] - run.start[2]) * u;
        _dummy.position.set(x, y, z);
        _dummy.rotation.set(0, Math.sin(t + i) * 0.12, 0);
        const s = run.scale || [0.5, 0.35, 0.5];
        _dummy.scale.set(s[0], s[1], s[2]);
        _dummy.updateMatrix();
        cargoMeshRef.current.setMatrixAt(i, _dummy.matrix);
      }
      cargoMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    // Pulse animated road directional guide markers in flowing sequential wave
    if (chevronMeshRef.current) {
      for (let i = 0; i < NAV_CHEVRONS.length; i++) {
        const nav = NAV_CHEVRONS[i];
        const pulse = 0.8 + Math.max(0, Math.sin(t * 5.2 - nav.phase * 0.85)) * 0.55;
        _dummy.position.set(nav.x, 0.035, nav.z);
        _dummy.rotation.set(-Math.PI / 2, 0, -nav.yaw);
        _dummy.scale.set(pulse * (nav.isStartGuide ? 1.25 : 0.95), pulse * (nav.isStartGuide ? 1.25 : 0.95), 1);
        _dummy.updateMatrix();
        chevronMeshRef.current.setMatrixAt(i, _dummy.matrix);
      }
      chevronMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    if (fanGroupRef.current) {
      const children = fanGroupRef.current.children;
      for (let i = 0; i < children.length; i++) {
        children[i].rotation.y += delta * (3.2 + (i % 3) * 0.8);
      }
    }

    if (checkpointRingsRef.current) {
      const rings = checkpointRingsRef.current.children;
      for (let i = 0; i < rings.length; i++) {
        rings[i].rotation.z = t * 1.15 + i * 0.4;
      }
    }
  });

  return (
    <group>
      {/* ── 1. MASSIVE INDUSTRIAL FACTORY COMPLEX BASE DECK ── */}
      <mesh position={[178, -0.04, 0]} receiveShadow>
        <boxGeometry args={[174, 0.06, 178]} />
        <meshStandardMaterial color="#0b0c12" roughness={0.76} metalness={0.28} />
      </mesh>

      {/* Perimeter Crimson Industrial Strip Markings */}
      {[-86, 86].map((fz) => (
        <mesh key={`f-edge-z-${fz}`} position={[178, -0.005, fz]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[172, 0.45]} />
          <meshBasicMaterial color="#dc2626" toneMapped={false} />
        </mesh>
      ))}
      {[92, 264].map((fx) => (
        <mesh key={`f-edge-x-${fx}`} position={[fx, -0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.45, 172]} />
          <meshBasicMaterial color="#dc2626" toneMapped={false} />
        </mesh>
      ))}

      {/* ── 2. MONUMENTAL ENTRANCE GATE WITH CLEAR "START AT 01" GUIDANCE (x = 94, z = 0) ── */}
      <group position={[94, 0, 0]}>
        {[-5.8, 5.8].map((pz) => (
          <group key={`gate-pylon-${pz}`} position={[0, 0, pz]}>
            <mesh position={[0, 4.8, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.6, 9.8, 1.6]} />
              <meshStandardMaterial color="#181920" metalness={0.85} roughness={0.25} />
            </mesh>
            <mesh position={[-0.82, 4.8, 0]}>
              <boxGeometry args={[0.1, 8.8, 0.42]} />
              <meshBasicMaterial color="#ef4444" toneMapped={false} />
            </mesh>
            <mesh position={[0.82, 4.8, 0]}>
              <boxGeometry args={[0.1, 8.8, 0.42]} />
              <meshBasicMaterial color="#f97316" toneMapped={false} />
            </mesh>
          </group>
        ))}

        <mesh position={[0, 9.6, 0]} castShadow>
          <boxGeometry args={[2.2, 2.2, 13.6]} />
          <meshStandardMaterial color="#0f1016" metalness={0.85} roughness={0.22} />
        </mesh>
        <mesh position={[-1.12, 9.6, 0]}>
          <boxGeometry args={[0.08, 2.32, 13.4]} />
          <meshBasicMaterial color="#dc2626" toneMapped={false} />
        </mesh>

        <Text
          position={[-1.2, 9.95, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          fontSize={0.78}
          color="#fff7ed"
          outlineWidth={0.055}
          outlineColor="#000000"
          outlineOpacity={1}
          anchorX="center"
          anchorY="middle"
        >
          AI INTELLIGENCE FACTORY
        </Text>
        <Text
          position={[-1.2, 9.05, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          fontSize={0.34}
          color="#fde047"
          outlineWidth={0.035}
          outlineColor="#000000"
          outlineOpacity={1}
          anchorX="center"
          anchorY="middle"
        >
          {'START HERE ➔ TURN LEFT FOR STAGE 01 (DATA COLLECTION)'}
        </Text>

        <Text
          position={[1.2, 9.8, 0]}
          rotation={[0, Math.PI / 2, 0]}
          fontSize={0.62}
          color="#fff7ed"
          outlineWidth={0.05}
          outlineColor="#000000"
          outlineOpacity={1}
          anchorX="center"
          anchorY="middle"
        >
          {'AI FACTORY EXIT ➔ BOWLING ARENA & CITY'}
        </Text>
      </group>

      {/* ── 2B. ENTRANCE FRONT-RIGHT ARRIVAL & WAYFINDER DIRECTORY HUB [104, 0, +22] ── */}
      {/* Replaces old #14 entrance slot so entrants ONLY see Stage 01 & Start Directions! */}
      <group position={[104, 0, 22]}>
        <mesh position={[0, 0.16, 0]} receiveShadow>
          <boxGeometry args={[9.5, 0.36, 11.5]} />
          <meshStandardMaterial color="#14151c" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.36, 0]}>
          <boxGeometry args={[9.7, 0.08, 11.7]} />
          <meshBasicMaterial color="#ef4444" toneMapped={false} />
        </mesh>
        {/* Wayfinder Totem Pylon */}
        <mesh position={[0, 3.2, 0]} castShadow>
          <boxGeometry args={[2.2, 6.2, 6.8]} />
          <meshStandardMaterial color="#101118" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[0, 6.45, 0]}>
          <boxGeometry args={[2.5, 0.25, 7.1]} />
          <meshBasicMaterial color="#f97316" toneMapped={false} />
        </mesh>
        {/* Route Directory Sign Facing Entrance Boulevard (North-West / Road) */}
        <Text
          position={[1.18, 4.4, 0]}
          rotation={[0, Math.PI / 2, 0]}
          fontSize={0.46}
          color="#fde047"
          outlineWidth={0.04}
          outlineColor="#000000"
          anchorX="center"
        >
          {'PIPELINE ROUTE: 01 ➔ 15'}
        </Text>
        <Text
          position={[1.18, 3.3, 0]}
          rotation={[0, Math.PI / 2, 0]}
          fontSize={0.30}
          color="#fff7ed"
          maxWidth={6.0}
          textAlign="center"
          anchorX="center"
        >
          {'1. TURN LEFT AT GATE -> STAGE 01\n2. NORTH WING: 02 TO 06\n3. EAST CORRIDOR: 07 TO 09\n4. TUNNEL TO CORE 11 -> 15'}
        </Text>
      </group>

      {/* Strategic Minimal Industrial Lighting (2 key warm/red lights -> locked 90 FPS) */}
      <pointLight position={[94, 8, 0]} color="#ef4444" intensity={6.5} distance={42} />
      <pointLight position={[170, 12, 0]} color="#f97316" intensity={8.5} distance={58} />

      {/* ── 2C. ANIMATED INDUSTRIAL ROAD GANTRY LIGHT ARCHES ── */}
      {[122, 160, 196].map((gx) => (
        <React.Fragment key={`arch-pair-${gx}`}>
          {[-46, 46].map((gz) => (
            <group key={`arch-${gx}-${gz}`} position={[gx, 0, gz]}>
              {[-4.2, 4.2].map((az) => (
                <mesh key={`post-${az}`} position={[0, 2.8, az]}>
                  <boxGeometry args={[0.35, 5.6, 0.35]} />
                  <meshStandardMaterial color="#181920" metalness={0.85} roughness={0.3} />
                </mesh>
              ))}
              <mesh position={[0, 5.65, 0]}>
                <boxGeometry args={[0.45, 0.35, 8.8]} />
                <meshStandardMaterial color="#121319" metalness={0.85} />
              </mesh>
              <mesh position={[0, 5.45, 0]}>
                <boxGeometry args={[0.25, 0.1, 8.2]} />
                <meshBasicMaterial color="#fb923c" toneMapped={false} />
              </mesh>
            </group>
          ))}
        </React.Fragment>
      ))}

      {/* ── 2D. ANIMATED FLOOR WAYFINDER CHEVRONS GUIDING 01 -> 15 ── */}
      <instancedMesh ref={chevronMeshRef} args={[undefined, undefined, NAV_CHEVRONS.length]} frustumCulled={false}>
        <coneGeometry args={[1.05, 1.5, 3]} />
        <meshBasicMaterial toneMapped={false} transparent opacity={0.9} />
      </instancedMesh>

      {/* ── 3. CONNECTED TRANSPARENT GLASS CONDUITS BETWEEN ALL 15 DEPARTMENTS ── */}
      {tubeGeometries.map((geo, i) => (
        <mesh key={`conduit-tube-${i}`} geometry={geo} material={pipeGlassMat} />
      ))}

      {/* Physical Elevated Conveyor Structural Trusses */}
      {[128, 160, 192, 225].map((bx) => (
        <group key={`n-conv-bridge-${bx}`} position={[bx, 2.35, -60]}>
          <mesh>
            <boxGeometry args={[19, 0.25, 1.5]} />
            <meshStandardMaterial color="#18181f" metalness={0.85} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <boxGeometry args={[19, 0.04, 1.1]} />
            <meshBasicMaterial color="#dc2626" toneMapped={false} />
          </mesh>
        </group>
      ))}
      {[135, 162, 224].map((bx) => (
        <group key={`s-conv-bridge-${bx}`} position={[bx, 2.35, 62]}>
          <mesh>
            <boxGeometry args={[19, 0.25, 1.5]} />
            <meshStandardMaterial color="#18181f" metalness={0.85} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <boxGeometry args={[19, 0.04, 1.1]} />
            <meshBasicMaterial color="#f97316" toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* ── 4. INSTANCED GLOWING DATA STREAM PARTICLES INSIDE PIPES ── */}
      <instancedMesh ref={particleMeshRef} args={[undefined, undefined, totalParticles]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {/* ── 5. INSTANCED CONVEYOR CARGO CONTAINERS & REJECT BLOCKS ── */}
      <instancedMesh ref={cargoMeshRef} args={[undefined, undefined, totalCargo]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {/* ── 6. ROOFTOP INDUSTRIAL COOLING VENTILATION FANS ── */}
      <group>
        {FAN_POSITIONS.map(([fx, fy, fz], i) => (
          <mesh key={`fan-housing-${i}`} position={[fx, fy, fz]}>
            <cylinderGeometry args={[1.25, 1.35, 0.65, 12]} />
            <meshStandardMaterial color="#14151c" metalness={0.85} roughness={0.3} />
          </mesh>
        ))}
        <group ref={fanGroupRef}>
          {FAN_POSITIONS.map(([fx, fy, fz], i) => (
            <group key={`fan-rotor-${i}`} position={[fx, fy + 0.36, fz]}>
              <mesh>
                <boxGeometry args={[2.1, 0.06, 0.25]} />
                <meshStandardMaterial color="#ef4444" metalness={0.7} roughness={0.3} />
              </mesh>
              <mesh rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[2.1, 0.06, 0.25]} />
                <meshStandardMaterial color="#ef4444" metalness={0.7} roughness={0.3} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* ── 7. ALL 15 DEPARTMENT CHECKPOINT INSPECTION BAYS & OVERHEAD SIGNS ── */}
      <group ref={checkpointRingsRef}>
        {AI_DEPARTMENTS.map((dept) => {
          const isHighlighted = activeDeptId === dept.id || nearbyDeptId === dept.id;
          const ringColor = isHighlighted
            ? '#fef08a'
            : dept.number === 1
              ? '#fde047'
              : dept.number === 11
                ? '#f97316'
                : '#ef4444';
          return (
            <mesh
              key={`cp-ring-${dept.id}`}
              position={[dept.checkpointPos[0], 0.08, dept.checkpointPos[2]]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <ringGeometry args={[2.15, 2.75, 24]} />
              <meshBasicMaterial
                color={ringColor}
                toneMapped={false}
                transparent
                opacity={isHighlighted ? 1.0 : dept.number === 1 ? 0.92 : 0.72}
              />
            </mesh>
          );
        })}
      </group>

      {AI_DEPARTMENTS.map((dept) => {
        const isHighlighted = activeDeptId === dept.id || nearbyDeptId === dept.id;
        return (
          <group key={`cp-marker-${dept.id}`}>
            <mesh
              position={[dept.checkpointPos[0], 0.04, dept.checkpointPos[2]]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <circleGeometry args={[2.05, 20]} />
              <meshBasicMaterial
                color={isHighlighted ? '#f97316' : dept.number === 1 ? '#dc2626' : '#7f1d1d'}
                transparent
                opacity={isHighlighted ? 0.5 : dept.number === 1 ? 0.42 : 0.28}
              />
            </mesh>

            <Billboard
              position={[
                dept.buildingPos[0],
                dept.number === 11 ? 22.2 : dept.number === 1 ? 10.6 : 9.8,
                dept.buildingPos[2],
              ]}
              follow
            >
              <mesh position={[0, 0, 0]}>
                <planeGeometry args={[8.6, 2.15]} />
                <meshBasicMaterial
                  color={isHighlighted ? '#fde047' : dept.number === 1 ? '#f97316' : '#dc2626'}
                  toneMapped={false}
                />
              </mesh>
              <mesh position={[0, 0, 0.02]}>
                <planeGeometry args={[8.28, 1.86]} />
                <meshBasicMaterial color="#090a0f" />
              </mesh>
              <Text
                position={[0, 0.38, 0.05]}
                fontSize={0.52}
                color="#fff7ed"
                outlineWidth={0.045}
                outlineColor="#000000"
                outlineOpacity={1}
                anchorX="center"
                anchorY="middle"
              >
                {`${dept.code} · ${dept.name}`}
              </Text>
              <Text
                position={[0, -0.34, 0.05]}
                fontSize={0.28}
                color={isHighlighted || dept.number === 1 ? '#fde047' : '#fb923c'}
                outlineWidth={0.03}
                outlineColor="#000000"
                outlineOpacity={1}
                anchorX="center"
                anchorY="middle"
              >
                {isHighlighted
                  ? 'PRESS [E] TO EXPLORE PROCESS'
                  : dept.number === 1
                    ? '★ START PIPELINE HERE · CHECKPOINT 01/15'
                    : `STAGE ${dept.code}/15 · CHECKPOINT`}
              </Text>
            </Billboard>
          </group>
        );
      })}

      {/* ── 8. BEYOND-PERIMETER INDUSTRIAL MEGACITY SILHOUETTES (grounded cleanly at y = -0.06) ── */}
      {[
        [286, -70, 14, 34, 14],
        [292, -25, 16, 44, 18],
        [288, 25,  14, 38, 16],
        [290, 72,  16, 30, 14],
        [135, -112, 14, 28, 12],
        [210, -114, 16, 36, 12],
        [145, 112,  14, 30, 12],
        [220, 114,  18, 34, 12],
      ].map(([sx, sz, sw, sh, sd], idx) => (
        <group key={`dist-ind-${idx}`} position={[sx, 0, sz]}>
          <mesh position={[0, sh / 2 - 0.06, 0]}>
            <boxGeometry args={[sw, sh, sd]} />
            <meshStandardMaterial color="#0b0c12" metalness={0.7} roughness={0.4} />
          </mesh>
          <mesh position={[0, sh - 0.25, 0]}>
            <boxGeometry args={[sw + 0.2, 0.25, sd + 0.2]} />
            <meshBasicMaterial color={idx % 2 === 0 ? '#ef4444' : '#f97316'} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
