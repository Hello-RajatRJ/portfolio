import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { Text } from '@react-three/drei';
import { runLiveQuerySimulation } from '../../../data/aiFactoryData';
import { FactoryArchitectureShell } from './FactoryArchitectureShell';
import { carGlobalPosition } from '../../CarState';
import type { FactoryOutputFormat } from '../../../types';

interface DeptsBProps {
  activeDeptId: string | null;
  factoryQuery: string;
  factoryOutputFormat: FactoryOutputFormat;
}

export const AIFactoryDepartmentsB: React.FC<DeptsBProps> = ({
  activeDeptId,
  factoryQuery,
  factoryOutputFormat,
}) => {
  const radarDishRef = useRef<Group>(null);
  const ragMixerRef = useRef<Group>(null);
  const coreRing1Ref = useRef<Group>(null);
  const coreRing2Ref = useRef<Group>(null);
  const coreRing3Ref = useRef<Group>(null);
  const tokenSpinnerRef = useRef<Group>(null);
  const agentArm1Ref = useRef<Group>(null);
  const agentArm2Ref = useRef<Group>(null);
  const safetyScanRef = useRef<Group>(null);
  const tokenCounterRef = useRef<number>(142840);
  const sim = useMemo(() => runLiveQuerySimulation(factoryQuery), [factoryQuery]);

  const deptBFrame = useRef(0);

  useFrame((state, delta) => {
    deptBFrame.current++;
    // Distance cull: skip department animations when player is in City (> 95m)
    const distToFactory = Math.hypot(carGlobalPosition.x - 130, carGlobalPosition.z);
    if (distToFactory > 95) return;
    if (deptBFrame.current % 2 !== 0) return;

    const t = state.clock.elapsedTime;
    tokenCounterRef.current += delta * 142;

    if (radarDishRef.current) {
      radarDishRef.current.rotation.y += delta * 1.4;
    }
    if (ragMixerRef.current) {
      ragMixerRef.current.rotation.y -= delta * 2.0;
    }
    if (coreRing1Ref.current) {
      coreRing1Ref.current.rotation.y += delta * 0.9;
      coreRing1Ref.current.rotation.x = Math.sin(t * 0.6) * 0.32;
    }
    if (coreRing2Ref.current) {
      coreRing2Ref.current.rotation.y -= delta * 1.3;
      coreRing2Ref.current.rotation.z = Math.cos(t * 0.5) * 0.45;
    }
    if (coreRing3Ref.current) {
      coreRing3Ref.current.rotation.z += delta * 1.6;
    }
    if (tokenSpinnerRef.current) {
      tokenSpinnerRef.current.rotation.y += delta * 1.15;
    }
    if (agentArm1Ref.current) {
      agentArm1Ref.current.rotation.y = Math.sin(t * 1.5) * 1.25;
    }
    if (agentArm2Ref.current) {
      agentArm2Ref.current.rotation.y = Math.cos(t * 1.7) * 1.25;
    }
    if (safetyScanRef.current) {
      safetyScanRef.current.position.x = 148 + Math.sin(t * 2.4) * 4.5;
    }
  });

  const liveOutputSnippet = useMemo(() => {
    const raw = sim.outputsByFormat[factoryOutputFormat] || sim.outputsByFormat.text;
    return raw.length > 165 ? raw.slice(0, 162) + '...' : raw;
  }, [sim, factoryOutputFormat]);

  return (
    <group>
      {/* ── DEPT 08: USER QUERY PROCESSING TERMINAL [242, 0, 18] ── */}
      <group>
        <FactoryArchitectureShell
          position={[242, 0, 18]}
          size={[11, 5.8, 15]}
          code="08"
          highlighted={activeDeptId === 'dept-08'}
          frontFace="W"
        />
        <mesh position={[236.2, 3.2, 18]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[10.5, 3.2]} />
          <meshBasicMaterial color="#090a0e" />
        </mesh>
        <Text
          position={[236.05, 4.0, 18]}
          rotation={[0, -Math.PI / 2, 0]}
          fontSize={0.38}
          color="#fb923c"
          outlineWidth={0.03}
          outlineColor="#000000"
        >
          {'ACTIVE QUERY ➔ EMBED ➔ SEARCH'}
        </Text>
        <Text
          position={[236.05, 2.9, 18]}
          rotation={[0, -Math.PI / 2, 0]}
          fontSize={0.29}
          color="#fff7ed"
          maxWidth={9.2}
          anchorX="center"
        >
          {`"${sim.originalQuery.slice(0, 68)}"`}
        </Text>
      </group>

      {/* ── DEPT 09: SEMANTIC SEARCH & RETRIEVAL [242, 0, 58] ── */}
      <group>
        <FactoryArchitectureShell
          position={[242, 0, 58]}
          size={[13, 5.6, 11]}
          code="09"
          highlighted={activeDeptId === 'dept-09'}
          frontFace="W"
        />
        {/* Sweeping Volumetric Cosine Similarity Radar Scanner */}
        <group position={[238, 6.4, 54]}>
          <mesh>
            <cylinderGeometry args={[0.9, 1.1, 1.0, 12]} />
            <meshStandardMaterial color="#1f2029" metalness={0.85} />
          </mesh>
          <group ref={radarDishRef} position={[0, 0.7, 0]}>
            <mesh rotation={[0.45, 0, 0]}>
              <coneGeometry args={[2.8, 3.2, 16, 1, true]} />
              <meshBasicMaterial color="#ef4444" transparent opacity={0.24} wireframe />
            </mesh>
            <mesh position={[0, 0.2, 1.4]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.14, 0.14, 2.8, 8]} />
              <meshBasicMaterial color="#fb923c" toneMapped={false} />
            </mesh>
          </group>
        </group>
        {/* Top-K Similarity Match Score Bars facing North-West checkpoint */}
        {[
          { x: -3.2, score: '0.95', h: 2.8 },
          { x: 0,    score: '0.91', h: 2.3 },
          { x: 3.2,  score: '0.88', h: 1.9 },
        ].map((bar) => (
          <group key={bar.score} position={[240 + bar.x, 0.3, 51.6]}>
            <mesh position={[0, bar.h / 2, 0]}>
              <boxGeometry args={[1.4, bar.h, 0.45]} />
              <meshBasicMaterial color="#ef4444" toneMapped={false} />
            </mesh>
            <Text position={[0, bar.h + 0.45, -0.25]} rotation={[0, Math.PI, 0]} fontSize={0.34} color="#fde047">
              {`COS ${bar.score}`}
            </Text>
          </group>
        ))}
      </group>

      {/* ── DEPT 10: RAG CONTEXT ASSEMBLY PLANT [208, 0, 64] ── */}
      <group>
        <FactoryArchitectureShell
          position={[208, 0, 64]}
          size={[13, 5.6, 9]}
          code="10"
          highlighted={activeDeptId === 'dept-10'}
          frontFace="N"
        />
        {[-3.2, 0, 3.2].map((px, i) => (
          <mesh key={`rag-in-${px}`} position={[208 + px, 4.4, 59.0]}>
            <cylinderGeometry args={[0.26, 0.26, 2.8, 10]} />
            <meshBasicMaterial color={i === 1 ? '#fb923c' : '#ef4444'} toneMapped={false} />
          </mesh>
        ))}
        <group ref={ragMixerRef} position={[208, 2.4, 58.6]}>
          <mesh>
            <octahedronGeometry args={[1.45, 0]} />
            <meshStandardMaterial color="#f97316" emissive="#dc2626" emissiveIntensity={1.3} wireframe />
          </mesh>
        </group>
      </group>

      {/* ── DEPT 11: LLM INTELLIGENCE CORE REACTOR [170, 0, 0] (COLOSSAL BRAIN OF FACTORY) ── */}
      <group>
        <FactoryArchitectureShell
          position={[170, 0, -11.5]}
          size={[17, 13.8, 8.2]}
          code="11"
          accent="#ef4444"
          secondaryAccent="#fde047"
          highlighted={activeDeptId === 'dept-11'}
          frontFace="W"
        />
        <FactoryArchitectureShell
          position={[170, 0, 11.5]}
          size={[17, 13.8, 8.2]}
          code="11"
          accent="#ef4444"
          secondaryAccent="#fde047"
          highlighted={activeDeptId === 'dept-11'}
          frontFace="E"
        />

        {/* Overhead Reactor Containment Bridge Deck bridging across Observation Tunnel */}
        <mesh position={[170, 10.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[18.8, 6.2, 16.8]} />
          <meshStandardMaterial
            color="#101118"
            emissive="#450a0a"
            emissiveIntensity={activeDeptId === 'dept-11' ? 0.68 : 0.34}
            metalness={0.88}
            roughness={0.22}
          />
        </mesh>

        {/* Vertical Side Cooling Radiator Fins */}
        {[-7, -3.5, 0, 3.5, 7].map((fx) => (
          <mesh key={`core-fin-${fx}`} position={[170 + fx, 10.6, 0]}>
            <boxGeometry args={[0.45, 6.5, 17.8]} />
            <meshStandardMaterial color="#1d1e28" metalness={0.9} roughness={0.25} />
          </mesh>
        ))}

        {/* Glowing Reactor Accelerator Belts circling Superstructure */}
        {[8.2, 10.8, 13.4].map((ry) => (
          <mesh key={`core-belt-${ry}`} position={[170, ry, 0]}>
            <boxGeometry args={[19.2, 0.26, 17.3]} />
            <meshBasicMaterial color={ry > 12 ? '#fb923c' : '#ef4444'} toneMapped={false} />
          </mesh>
        ))}

        {/* Four Corner Plasma Stabilizer Pylons linking containment bridge to Reactor Orb */}
        {[
          [-6.5, -5.5],
          [6.5, -5.5],
          [-6.5, 5.5],
          [6.5, 5.5],
        ].map(([px, pz], pi) => (
          <mesh key={`core-plasma-${pi}`} position={[170 + px, 16.5, pz]}>
            <cylinderGeometry args={[0.32, 0.45, 6.2, 10]} />
            <meshBasicMaterial color="#fb923c" toneMapped={false} />
          </mesh>
        ))}

        {/* GLASS OBSERVATION TUNNEL (Drivable Central Corridor z = 0, x: 158..182, width 9.8m clear) */}
        <group position={[170, 0, 0]}>
          {[-4.9, 4.9].map((tz) => (
            <mesh key={`tunnel-glass-${tz}`} position={[0, 2.8, tz]}>
              <boxGeometry args={[24.0, 5.4, 0.14]} />
              <meshStandardMaterial color="#dc2626" transparent opacity={0.18} roughness={0.08} metalness={0.9} />
            </mesh>
          ))}
          {[-10, -5, 0, 5, 10].map((tx) => (
            <group key={`tunnel-rib-${tx}`} position={[tx, 0, 0]}>
              <mesh position={[0, 5.75, 0]}>
                <boxGeometry args={[0.42, 0.35, 10.2]} />
                <meshBasicMaterial color="#ef4444" toneMapped={false} />
              </mesh>
              <mesh position={[0, 2.8, -5.0]}>
                <boxGeometry args={[0.35, 5.6, 0.24]} />
                <meshBasicMaterial color="#fb923c" toneMapped={false} />
              </mesh>
              <mesh position={[0, 2.8, 5.0]}>
                <boxGeometry args={[0.35, 5.6, 0.24]} />
                <meshBasicMaterial color="#fb923c" toneMapped={false} />
              </mesh>
            </group>
          ))}
          <Text position={[-11.8, 4.9, 0]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.55} color="#fff7ed" outlineWidth={0.04} outlineColor="#000000">
            LLM REACTOR OBSERVATION TUNNEL
          </Text>
          <Text position={[11.8, 4.9, 0]} rotation={[0, Math.PI / 2, 0]} fontSize={0.55} color="#fff7ed" outlineWidth={0.04} outlineColor="#000000">
            TRANSFORMER ATTENTION CORE
          </Text>
        </group>

        {/* COLOSSAL TRANSFORMER NEURAL REACTOR SPHERE & MULTI-HEAD ATTENTION RINGS */}
        <group position={[170, 19.6, 0]}>
          <mesh>
            <icosahedronGeometry args={[3.4, 1]} />
            <meshStandardMaterial
              color="#ef4444"
              emissive="#f97316"
              emissiveIntensity={2.0}
              metalness={0.4}
              roughness={0.2}
            />
          </mesh>
          <mesh>
            <icosahedronGeometry args={[3.9, 1]} />
            <meshBasicMaterial color="#fde047" wireframe transparent opacity={0.35} toneMapped={false} />
          </mesh>
          <mesh position={[0, 1.0, 0]}>
            <cylinderGeometry args={[0.75, 0.75, 15.0, 16]} />
            <meshBasicMaterial color="#fb923c" transparent opacity={0.45} toneMapped={false} />
          </mesh>

          <group ref={coreRing1Ref}>
            <mesh>
              <torusGeometry args={[5.5, 0.34, 12, 40]} />
              <meshBasicMaterial color="#ef4444" toneMapped={false} />
            </mesh>
          </group>
          <group ref={coreRing2Ref}>
            <mesh rotation={[Math.PI / 3, 0, 0]}>
              <torusGeometry args={[6.9, 0.28, 12, 40]} />
              <meshBasicMaterial color="#fb923c" toneMapped={false} />
            </mesh>
          </group>
          <group ref={coreRing3Ref}>
            <mesh rotation={[0, Math.PI / 4, Math.PI / 2]}>
              <torusGeometry args={[8.3, 0.22, 12, 40]} />
              <meshBasicMaterial color="#fff7ed" toneMapped={false} />
            </mesh>
          </group>

          <group ref={tokenSpinnerRef}>
            {Array.from({ length: 12 }, (_, ti) => {
              const ang = (ti / 12) * Math.PI * 2;
              return (
                <mesh key={`tok-${ti}`} position={[Math.cos(ang) * 9.5, Math.sin(ti * 2) * 1.6, Math.sin(ang) * 9.5]}>
                  <boxGeometry args={[0.85, 0.85, 0.85]} />
                  <meshBasicMaterial color={ti % 2 === 0 ? '#ef4444' : '#fde68a'} toneMapped={false} />
                </mesh>
              );
            })}
          </group>
        </group>

        <Text
          position={[160.2, 12.2, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          fontSize={0.72}
          color="#fde047"
          outlineWidth={0.05}
          outlineColor="#000000"
        >
          142 TOKENS/SEC · 80 LAYERS · 64 HEADS
        </Text>
      </group>

      {/* ── DEPT 12: AI AGENT & TOOL EXECUTION CENTER [176, 0, 64] ── */}
      <group>
        <FactoryArchitectureShell
          position={[176, 0, 64]}
          size={[13, 5.4, 9]}
          code="12"
          highlighted={activeDeptId === 'dept-12'}
          frontFace="N"
        />
        {[-2.8, 2.8].map((ax, idx) => (
          <group key={`agent-bay-${idx}`} position={[176 + ax, 0.3, 57.5]}>
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.7, 0.9, 1.0, 12]} />
              <meshStandardMaterial color="#1f2028" metalness={0.85} />
            </mesh>
            <group ref={idx === 0 ? agentArm1Ref : agentArm2Ref} position={[0, 1.2, 0]}>
              <mesh position={[0, 1.2, 0]} rotation={[0.4, 0, 0]}>
                <boxGeometry args={[0.35, 2.6, 0.35]} />
                <meshStandardMaterial color="#dc2626" metalness={0.8} />
              </mesh>
              <mesh position={[0, 2.2, -1.0]} rotation={[1.2, 0, 0]}>
                <boxGeometry args={[0.25, 2.0, 0.25]} />
                <meshBasicMaterial color="#fb923c" toneMapped={false} />
              </mesh>
            </group>
            <Text position={[0, 3.6, -1.2]} rotation={[0, Math.PI, 0]} fontSize={0.34} color="#fff7ed" outlineWidth={0.03} outlineColor="#000000">
              {idx === 0 ? 'API · DB QUERY' : 'SEARCH · CODE EXEC'}
            </Text>
          </group>
        ))}
      </group>

      {/* ── DEPT 13: VALIDATION & SAFETY QC LAB [148, 0, 64] ── */}
      <group>
        <FactoryArchitectureShell
          position={[148, 0, 64]}
          size={[13, 5.4, 9]}
          code="13"
          highlighted={activeDeptId === 'dept-13'}
          frontFace="N"
        />
        {[-3.4, 0, 3.4].map((gx, gi) => (
          <group key={`qc-gate-${gi}`} position={[148 + gx, 2.2, 58.6]}>
            <mesh>
              <boxGeometry args={[2.2, 3.4, 0.25]} />
              <meshStandardMaterial color="#dc2626" transparent opacity={0.18} />
            </mesh>
            <mesh position={[0, 1.75, 0]}>
              <boxGeometry args={[2.4, 0.2, 0.35]} />
              <meshBasicMaterial color={gi === 2 ? '#fbbf24' : '#ef4444'} toneMapped={false} />
            </mesh>
          </group>
        ))}
        <group ref={safetyScanRef} position={[148, 2.2, 58.3]}>
          <mesh>
            <boxGeometry args={[0.14, 3.6, 0.14]} />
            <meshBasicMaterial color="#fff7ed" toneMapped={false} />
          </mesh>
        </group>
      </group>

      {/* ── DEPT 14: FINAL RESPONSE GENERATION CINEMA SCREEN [122, 0, 64] ── */}
      <group>
        <FactoryArchitectureShell
          position={[122, 0, 64]}
          size={[13, 6.2, 9]}
          code="14"
          highlighted={activeDeptId === 'dept-14'}
          frontFace="N"
        />
        {/* Giant North-Facing Holographic Production Display Wall facing South Avenue */}
        <group position={[122, 3.6, 58.7]} rotation={[0, Math.PI, 0]}>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[12.0, 4.9]} />
            <meshBasicMaterial color="#ef4444" toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, 0.04]}>
            <planeGeometry args={[11.5, 4.4]} />
            <meshBasicMaterial color="#090a0f" />
          </mesh>
          <Text position={[0, 1.65, 0.08]} fontSize={0.42} color="#fb923c" anchorX="center">
            {`CERTIFIED AI OUTPUT [${factoryOutputFormat.toUpperCase()}] · DISPATCHING`}
          </Text>
          <Text
            position={[0, -0.25, 0.08]}
            fontSize={0.28}
            color="#fff7ed"
            maxWidth={10.8}
            lineHeight={1.26}
            anchorX="center"
            anchorY="middle"
          >
            {liveOutputSnippet}
          </Text>
        </group>
      </group>

      {/* ── DEPT 15: MONITORING & EVALUATION OPS CITADEL [98, 0, 60] (SW Corner Finish) ── */}
      <group>
        <FactoryArchitectureShell
          position={[98, 0, 60]}
          size={[11, 7.0, 11]}
          code="15"
          highlighted={activeDeptId === 'dept-15'}
          frontFace="N"
        />
        {[
          { x: -3.6, h: 4.5, col: '#ef4444', lbl: 'TOKENS' },
          { x: -1.2, h: 3.4, col: '#fb923c', lbl: 'LATENCY' },
          { x: 1.2,  h: 5.2, col: '#fff7ed', lbl: 'RECALL' },
          { x: 3.6,  h: 4.0, col: '#f59e0b', lbl: 'EVAL' },
        ].map((sp) => (
          <group key={sp.lbl} position={[98 + sp.x, 0.3, 53.6]}>
            <mesh position={[0, sp.h / 2, 0]}>
              <boxGeometry args={[0.9, sp.h, 0.9]} />
              <meshBasicMaterial color={sp.col} toneMapped={false} />
            </mesh>
            <Text position={[0, sp.h + 0.5, -0.5]} rotation={[0, Math.PI, 0]} fontSize={0.32} color="#fff7ed" outlineWidth={0.03} outlineColor="#000000">
              {sp.lbl}
            </Text>
          </group>
        ))}
      </group>
    </group>
  );
};
