import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, InstancedMesh, Object3D, Color } from 'three';
import { Text } from '@react-three/drei';
import { FactoryArchitectureShell } from './FactoryArchitectureShell';

const _dummy = new Object3D();
const _col = new Color();

export const AIFactoryDepartmentsA: React.FC<{ activeDeptId: string | null }> = ({ activeDeptId }) => {
  const scrubberRef = useRef<Group>(null);
  const ocrLaserRef = useRef<Group>(null);
  const chunkPistonRef = useRef<Group>(null);
  const embedCloudRef = useRef<InstancedMesh>(null);
  const serverCubesRef = useRef<InstancedMesh>(null);
  const ingestTurbineRef = useRef<Group>(null);
  const startBeaconRef = useRef<Group>(null);

  // 1,600 3D semantic vector points clustered in 4 meaningful concept clouds for Dept 06 [242, 0, -64]
  const EMBED_COUNT = 1600;
  const embedPoints = useMemo(() => {
    const centers: [number, number, number, string][] = [
      [-1.8, 3.8, -1.6, '#ef4444'],
      [1.8, 4.4, 1.4, '#fb923c'],
      [-1.4, 2.8, 1.9, '#fff7ed'],
      [1.6, 2.7, -1.7, '#f59e0b'],
    ];
    return Array.from({ length: EMBED_COUNT }, (_, i) => {
      const c = centers[i % centers.length];
      const theta = ((i * 137.5) % 360) * (Math.PI / 180);
      const phi = ((i * 73.1) % 180) * (Math.PI / 180);
      const rad = 0.25 + ((i * 29) % 100) * 0.011;
      return {
        x: c[0] + Math.sin(phi) * Math.cos(theta) * rad,
        y: c[1] + Math.cos(phi) * rad * 0.85,
        z: c[2] + Math.sin(phi) * Math.sin(theta) * rad,
        color: c[3],
      };
    });
  }, []);

  // 480 glowing vector storage cubes across 4 Vector DB monolith racks in Dept 07 [242, 0, -24]
  const CUBE_COUNT = 480;
  const serverCubeData = useMemo(() => {
    const list: { x: number; y: number; z: number; color: string; phase: number }[] = [];
    const racks = [-4.2, -1.4, 1.4, 4.2];
    for (let r = 0; r < racks.length; r++) {
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 12; col++) {
          if (list.length >= CUBE_COUNT) break;
          list.push({
            x: 235.6 + (col % 2 === 0 ? -0.55 : 0.55),
            y: 1.0 + row * 0.45,
            z: -24 + racks[r] + (Math.floor(col / 2) - 2.5) * 0.36,
            color: (row + col + r) % 4 === 0 ? '#fff7ed' : (row + r) % 2 === 0 ? '#ef4444' : '#fb923c',
            phase: r * 1.1 + row * 0.4 + col * 0.2,
          });
        }
      }
    }
    return list;
  }, []);

  useEffect(() => {
    if (embedCloudRef.current) {
      embedPoints.forEach((p, i) => {
        _dummy.position.set(p.x, p.y, p.z);
        _dummy.scale.set(0.088, 0.088, 0.088);
        _dummy.updateMatrix();
        embedCloudRef.current!.setMatrixAt(i, _dummy.matrix);
        embedCloudRef.current!.setColorAt(i, _col.set(p.color));
      });
      embedCloudRef.current.instanceMatrix.needsUpdate = true;
      if (embedCloudRef.current.instanceColor) embedCloudRef.current.instanceColor.needsUpdate = true;
    }
    if (serverCubesRef.current) {
      serverCubeData.forEach((c, i) => {
        _dummy.position.set(c.x, c.y, c.z);
        _dummy.scale.set(0.24, 0.24, 0.24);
        _dummy.updateMatrix();
        serverCubesRef.current!.setMatrixAt(i, _dummy.matrix);
        serverCubesRef.current!.setColorAt(i, _col.set(c.color));
      });
      serverCubesRef.current.instanceMatrix.needsUpdate = true;
      if (serverCubesRef.current.instanceColor) serverCubesRef.current.instanceColor.needsUpdate = true;
    }
  }, [embedPoints, serverCubeData]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (startBeaconRef.current) {
      startBeaconRef.current.rotation.y += delta * 1.4;
      startBeaconRef.current.position.y = 7.4 + Math.sin(t * 2.4) * 0.35;
    }
    if (ingestTurbineRef.current) {
      ingestTurbineRef.current.rotation.y += delta * 2.2;
    }
    if (scrubberRef.current) {
      scrubberRef.current.rotation.z += delta * 1.9;
    }
    if (ocrLaserRef.current) {
      ocrLaserRef.current.position.z = Math.sin(t * 2.6) * 2.2;
    }
    if (chunkPistonRef.current) {
      const cycle = Math.abs(Math.sin(t * 3.1));
      chunkPistonRef.current.position.y = 2.0 + Math.pow(cycle, 3) * 1.9;
    }
    if (embedCloudRef.current) {
      embedCloudRef.current.rotation.y += delta * 0.35;
    }
    if (serverCubesRef.current) {
      for (let i = 0; i < serverCubeData.length; i += 3) {
        const c = serverCubeData[i];
        const s = 0.2 + Math.max(0, Math.sin(t * 4.0 + c.phase)) * 0.1;
        _dummy.position.set(c.x, c.y, c.z);
        _dummy.scale.set(s, s, s);
        _dummy.updateMatrix();
        serverCubesRef.current.setMatrixAt(i, _dummy.matrix);
      }
      serverCubesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* ── DEPT 01: DATA COLLECTION GATEWAY [104, 0, -22] (FIRST BUILDING AT FACTORY ENTRANCE!) ── */}
      <group>
        <FactoryArchitectureShell
          position={[104, 0, -22]}
          size={[11, 6.2, 15]}
          code="01 · START"
          accent="#f97316"
          secondaryAccent="#fde047"
          highlighted={activeDeptId === 'dept-01'}
          frontFace="E"
        />
        {/* Rotating Start Pipeline Holo Beacon */}
        <group ref={startBeaconRef} position={[104, 7.4, -22]}>
          <mesh>
            <octahedronGeometry args={[1.15, 0]} />
            <meshBasicMaterial color="#fde047" wireframe toneMapped={false} />
          </mesh>
        </group>

        {/* 8 Source Intake Chutes (PDF, IMG, TXT, AUD, VID, API, DB, PROMPT) facing Entrance Boulevard */}
        {['PDF', 'IMG', 'TXT', 'AUD', 'VID', 'API', 'DB', 'PROMPT'].map((src, i) => {
          const sz = -28.3 + i * 1.8;
          return (
            <group key={`src-chute-${src}`} position={[110.2, 1.9, sz]}>
              <mesh>
                <cylinderGeometry args={[0.36, 0.54, 3.4, 10]} />
                <meshStandardMaterial color="#1f2029" metalness={0.85} roughness={0.25} />
              </mesh>
              <mesh position={[0, 1.75, 0]}>
                <boxGeometry args={[0.92, 0.34, 0.92]} />
                <meshBasicMaterial color={i % 2 === 0 ? '#ef4444' : '#fde047'} toneMapped={false} />
              </mesh>
              <Text
                position={[0.6, 2.25, 0]}
                rotation={[0, Math.PI / 2, 0]}
                fontSize={0.28}
                color="#fff7ed"
                outlineWidth={0.03}
                outlineColor="#000000"
              >
                {src}
              </Text>
            </group>
          );
        })}

        {/* Illuminated Start Display Screen Facing East [110, 3.5, -22] */}
        <mesh position={[109.7, 4.9, -22]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[10.5, 1.75]} />
          <meshBasicMaterial color="#090a0e" />
        </mesh>
        <Text position={[109.85, 5.25, -22]} rotation={[0, Math.PI / 2, 0]} fontSize={0.44} color="#fde047" anchorX="center">
          STAGE 01 · START PIPELINE HERE · 14.2K/MIN
        </Text>
        <Text position={[109.85, 4.55, -22]} rotation={[0, Math.PI / 2, 0]} fontSize={0.28} color="#fff7ed" anchorX="center">
          PDF · IMG · TXT · AUD · VID · API · DB · USER PROMPT
        </Text>
      </group>

      {/* ── DEPT 02: DATA INGESTION TERMINAL [112, 0, -64] ── */}
      <group>
        <FactoryArchitectureShell
          position={[112, 0, -64]}
          size={[13, 5.6, 9]}
          code="02"
          highlighted={activeDeptId === 'dept-02'}
          frontFace="S"
        />
        <group ref={ingestTurbineRef} position={[112, 3.3, -59.2]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.6, 0.22, 10, 24]} />
            <meshBasicMaterial color="#fb923c" toneMapped={false} />
          </mesh>
          <mesh>
            <boxGeometry args={[3.0, 0.25, 0.4]} />
            <meshStandardMaterial color="#dc2626" metalness={0.8} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[3.0, 0.25, 0.4]} />
            <meshStandardMaterial color="#dc2626" metalness={0.8} />
          </mesh>
        </group>
        {[-3.2, 3.2].map((hx) => (
          <mesh key={`hopper-${hx}`} position={[112 + hx, 6.9, -64]}>
            <cylinderGeometry args={[1.5, 0.7, 1.8, 12]} />
            <meshStandardMaterial color="#7f1d1d" metalness={0.8} roughness={0.25} />
          </mesh>
        ))}
      </group>

      {/* ── DEPT 03: DATA CLEANING & PREPROCESSING [144, 0, -64] ── */}
      <group>
        <FactoryArchitectureShell
          position={[144, 0, -64]}
          size={[13, 5.4, 9]}
          code="03"
          highlighted={activeDeptId === 'dept-03'}
          frontFace="S"
        />
        <group ref={scrubberRef} position={[144, 3.0, -59.2]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[1.55, 1.55, 1.6, 12]} />
            <meshStandardMaterial color="#27272f" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.65, 0.12, 8, 24]} />
            <meshBasicMaterial color="#ef4444" toneMapped={false} />
          </mesh>
        </group>
        {/* Physical Rejection Incinerator Station [153, 0, -77] */}
        <group position={[153, 0, -77]}>
          <mesh position={[0, 1.6, 0]}>
            <boxGeometry args={[5.5, 3.2, 4.6]} />
            <meshStandardMaterial color="#1c0b0e" metalness={0.75} roughness={0.35} />
          </mesh>
          <mesh position={[0, 3.28, 0]}>
            <boxGeometry args={[5.7, 0.16, 4.8]} />
            <meshBasicMaterial color="#dc2626" toneMapped={false} />
          </mesh>
          <Text position={[0, 2.2, 2.38]} fontSize={0.44} color="#ef4444" outlineWidth={0.04} outlineColor="#000000">
            REJECTED NOISE &amp; DUPLICATES
          </Text>
          <mesh position={[-4.5, 1.15, 5.0]} rotation={[0, -0.78, 0]}>
            <boxGeometry args={[1.1, 0.22, 13]} />
            <meshStandardMaterial color="#450a0a" metalness={0.8} />
          </mesh>
        </group>
      </group>

      {/* ── DEPT 04: DOCUMENT PARSING & OCR BAY [176, 0, -64] ── */}
      <group>
        <FactoryArchitectureShell
          position={[176, 0, -64]}
          size={[13, 5.6, 9]}
          code="04"
          highlighted={activeDeptId === 'dept-04'}
          frontFace="S"
        />
        <group position={[176, 2.6, -58.4]}>
          <mesh rotation={[-0.35, 0, 0]}>
            <boxGeometry args={[6.4, 2.8, 0.24]} />
            <meshStandardMaterial color="#1e1b22" metalness={0.6} roughness={0.3} />
          </mesh>
          <group ref={ocrLaserRef}>
            <mesh>
              <boxGeometry args={[6.8, 0.16, 0.16]} />
              <meshBasicMaterial color="#ef4444" toneMapped={false} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ── DEPT 05: CHUNKING ENGINE [208, 0, -64] ── */}
      <group>
        <FactoryArchitectureShell
          position={[208, 0, -64]}
          size={[13, 5.6, 9]}
          code="05"
          highlighted={activeDeptId === 'dept-05'}
          frontFace="S"
        />
        <group ref={chunkPistonRef} position={[208, 3.0, -58.8]}>
          <mesh>
            <boxGeometry args={[4.6, 1.2, 1.1]} />
            <meshStandardMaterial color="#991b1b" metalness={0.85} roughness={0.22} />
          </mesh>
          <mesh position={[0, -0.65, 0]}>
            <boxGeometry args={[4.4, 0.14, 0.25]} />
            <meshBasicMaterial color="#fb923c" toneMapped={false} />
          </mesh>
        </group>
        <Text position={[208, 1.8, -58.9]} fontSize={0.35} color="#fff7ed" outlineWidth={0.03} outlineColor="#000000">
          FIXED · SEMANTIC · RECURSIVE SPLIT
        </Text>
      </group>

      {/* ── DEPT 06: EMBEDDING GENERATION LAB [242, 0, -64] ── */}
      <group>
        <FactoryArchitectureShell
          position={[242, 0, -64]}
          size={[13, 5.8, 9]}
          code="06"
          highlighted={activeDeptId === 'dept-06'}
          frontFace="S"
        />
        {/* Forward Glass Containment Chamber housing the 1,600-point 3D Vector Cloud */}
        <mesh position={[242, 3.2, -57.2]}>
          <cylinderGeometry args={[3.3, 3.3, 4.9, 24, 1, true]} />
          <meshStandardMaterial color="#450a0a" transparent opacity={0.22} roughness={0.1} metalness={0.8} />
        </mesh>
        <group position={[242, -0.2, -57.2]}>
          <instancedMesh ref={embedCloudRef} args={[undefined, undefined, EMBED_COUNT]} frustumCulled={false}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial toneMapped={false} />
          </instancedMesh>
        </group>
        <Text
          position={[242, 5.7, -56.4]}
          fontSize={0.42}
          color="#fb923c"
          outlineWidth={0.04}
          outlineColor="#000000"
        >
          [0.21, -0.48, 0.91, 0.32, ...]
        </Text>
      </group>

      {/* ── DEPT 07: VECTOR DATABASE STORAGE WAREHOUSE [242, 0, -24] ── */}
      <group>
        <FactoryArchitectureShell
          position={[242, 0, -24]}
          size={[11, 6.2, 15]}
          code="07"
          highlighted={activeDeptId === 'dept-07'}
          frontFace="W"
        />
        {[
          { z: -29.8, label: 'PINECONE' },
          { z: -26.0, label: 'QDRANT' },
          { z: -22.2, label: 'WEAVIATE' },
          { z: -18.4, label: 'CHROMA' },
        ].map((db) => (
          <group key={db.label} position={[235.9, 3.1, db.z]}>
            <mesh>
              <boxGeometry args={[0.8, 5.2, 2.8]} />
              <meshStandardMaterial color="#18181f" metalness={0.85} roughness={0.25} />
            </mesh>
            <Text
              position={[-0.48, 2.0, 0]}
              rotation={[0, -Math.PI / 2, 0]}
              fontSize={0.34}
              color="#fff7ed"
              outlineWidth={0.03}
              outlineColor="#000000"
            >
              {db.label}
            </Text>
          </group>
        ))}
        <instancedMesh ref={serverCubesRef} args={[undefined, undefined, CUBE_COUNT]} frustumCulled={false}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial toneMapped={false} />
        </instancedMesh>
      </group>
    </group>
  );
};
