import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  Vector3,
  Matrix4,
  InstancedMesh,
  BoxGeometry,
  SphereGeometry,
  MeshBasicMaterial,
  ConeGeometry,
} from 'three';
import type { CarPhysicsState, CarVisualState } from '../CarState';

interface CarFXProps {
  physicsRef: React.MutableRefObject<CarPhysicsState>;
  visualRef: React.MutableRefObject<CarVisualState>;
}

// Reusable Three.js math instances to prevent garbage collection pauses at 90fps
const _smokeMatrix = new Matrix4();
const _smokeRotMatrix = new Matrix4();
const _smokeScaleVec = new Vector3();
const _skidMatrix = new Matrix4();

// ─── 1. TIRE SMOKE PARTICLES (Dense Billowing Smoke) ────────────────────────
export const TireSmoke: React.FC<CarFXProps> = ({ physicsRef, visualRef }) => {
  const particleCount = 120;
  const meshRef = useRef<InstancedMesh>(null);

  const particles = useRef<
    { pos: Vector3; vel: Vector3; life: number; maxLife: number; scale: number; rot: number }[]
  >([]);

  if (particles.current.length === 0) {
    particles.current = Array.from({ length: particleCount }).map(() => ({
      pos: new Vector3(0, -100, 0),
      vel: new Vector3(0, 0, 0),
      life: 0,
      maxLife: 0.65,
      scale: 0.2,
      rot: 0,
    }));
  }

  const { geo, mat } = useMemo(
    () => ({
      geo: new SphereGeometry(0.3, 8, 8),
      mat: new MeshBasicMaterial({
        color: '#f8fafc',
        transparent: true,
        opacity: 0.52,
        depthWrite: false,
      }),
    }),
    []
  );

  useFrame((_s, delta) => {
    if (!meshRef.current) return;
    const dt = Math.min(delta, 0.08);
    const p = physicsRef.current;
    const v = visualRef.current;

    // Trigger smoke on hard braking or nitro boost launch
    const isBraking = v.isBraking && Math.abs(p.speed) > 3.0;
    const isBoosting = v.isBoosting;
    const isSkidding = isBraking || isBoosting;

    particles.current.forEach((pt, i) => {
      // Spawn fresh smoke puffs from rear wheels
      if (isSkidding && pt.life <= 0 && Math.random() < 0.65) {
        const carAngle = p.angle;
        // Real rear tire offsets: ±0.74m side, -0.95m rear
        const back = -0.95;
        const side = (i % 2 === 0 ? 0.74 : -0.74) + (Math.random() - 0.5) * 0.12;

        pt.pos.set(
          p.posX + Math.sin(carAngle) * back + Math.cos(carAngle) * side,
          0.09 + Math.random() * 0.05,
          p.posZ + Math.cos(carAngle) * back - Math.sin(carAngle) * side
        );

        const spreadX = (Math.random() - 0.5) * 1.2;
        const spreadZ = (Math.random() - 0.5) * 1.2;

        pt.vel.set(
          spreadX - p.vx * 0.15,
          1.1 + Math.random() * 1.5,
          spreadZ - p.vz * 0.15
        );
        pt.maxLife = 0.5 + Math.random() * 0.35;
        pt.life = pt.maxLife;
        pt.scale = 0.35 + Math.random() * 0.2;
        pt.rot = Math.random() * Math.PI * 2;
      }

      if (pt.life > 0) {
        pt.life -= dt;
        pt.pos.addScaledVector(pt.vel, dt);
        // Expand rapidly as smoke billows into air
        pt.scale += dt * 2.2;
        pt.rot += dt * 1.8;

        const currentScale = pt.scale;
        _smokeMatrix.makeTranslation(pt.pos.x, pt.pos.y, pt.pos.z);
        _smokeScaleVec.set(currentScale, currentScale * 0.85, currentScale);
        _smokeMatrix.scale(_smokeScaleVec);
        _smokeRotMatrix.makeRotationY(pt.rot);
        _smokeMatrix.multiply(_smokeRotMatrix);
        meshRef.current!.setMatrixAt(i, _smokeMatrix);
      } else {
        _smokeMatrix.makeTranslation(0, -100, 0);
        meshRef.current!.setMatrixAt(i, _smokeMatrix);
      }
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[geo, mat, particleCount]} />;
};

// ─── 2. TIRE SKID MARKS ─────────────────────────────────────────────────────
export const SkidMarks: React.FC<CarFXProps> = ({ physicsRef, visualRef }) => {
  const maxMarks = 120;
  const meshRef = useRef<InstancedMesh>(null);
  const markIndex = useRef(0);
  const lastSpawnDist = useRef(0);

  const { geo, mat } = useMemo(
    () => ({
      geo: new BoxGeometry(0.24, 0.002, 0.55),
      mat: new MeshBasicMaterial({
        color: '#09090b',
        transparent: true,
        opacity: 0.65,
        depthWrite: false,
      }),
    }),
    []
  );

  useFrame(() => {
    if (!meshRef.current) return;
    const p = physicsRef.current;
    const v = visualRef.current;

    const isSkidding = v.isBraking && Math.abs(p.speed) > 4.5;

    if (isSkidding) {
      const curDist = p.posX * p.posX + p.posZ * p.posZ;
      if (Math.abs(curDist - lastSpawnDist.current) > 0.12) {
        lastSpawnDist.current = curDist;
        const carAngle = p.angle;
        const back = -0.95;

        // Left rear tire mark
        const idxL = markIndex.current % maxMarks;
        const sideL = -0.74;
        _skidMatrix.makeRotationY(carAngle);
        _skidMatrix.setPosition(
          p.posX + Math.sin(carAngle) * back + Math.cos(carAngle) * sideL,
          0.007,
          p.posZ + Math.cos(carAngle) * back - Math.sin(carAngle) * sideL
        );
        meshRef.current.setMatrixAt(idxL, _skidMatrix);

        // Right rear tire mark
        const idxR = (markIndex.current + 1) % maxMarks;
        const sideR = 0.74;
        _skidMatrix.makeRotationY(carAngle);
        _skidMatrix.setPosition(
          p.posX + Math.sin(carAngle) * back + Math.cos(carAngle) * sideR,
          0.007,
          p.posZ + Math.cos(carAngle) * back - Math.sin(carAngle) * sideR
        );
        meshRef.current.setMatrixAt(idxR, _skidMatrix);

        markIndex.current = (markIndex.current + 2) % maxMarks;
        meshRef.current.instanceMatrix.needsUpdate = true;
      }
    }
  });

  return <instancedMesh ref={meshRef} args={[geo, mat, maxMarks]} />;
};

// ─── 3. NITRO EXHAUST FLAME (Shoots Backward Out of Quad Tips) ─────────────
export const NitroExhaustFlame: React.FC<{ visualRef: React.MutableRefObject<CarVisualState> }> = ({
  visualRef,
}) => {
  const flamesRef = useRef<import('three').Group>(null);

  const flameGeo = useMemo(() => new ConeGeometry(0.065, 0.55, 10), []);
  const coreGeo = useMemo(() => new ConeGeometry(0.035, 0.38, 10), []);

  const fireOrangeMat = useMemo(
    () =>
      new MeshBasicMaterial({
        color: '#ff4d00',
        transparent: true,
        opacity: 0.95,
        toneMapped: false,
      }),
    []
  );

  const fireYellowMat = useMemo(
    () =>
      new MeshBasicMaterial({
        color: '#ffd700',
        transparent: true,
        opacity: 0.98,
        toneMapped: false,
      }),
    []
  );

  const cyanNitroMat = useMemo(
    () =>
      new MeshBasicMaterial({
        color: '#00f0ff',
        transparent: true,
        opacity: 0.95,
        toneMapped: false,
      }),
    []
  );

  useFrame(() => {
    const v = visualRef.current;
    const showFlame = v.isBoosting;
    if (flamesRef.current) {
      flamesRef.current.visible = showFlame;
      if (showFlame) {
        const flicker = 0.85 + Math.random() * 0.4;
        flamesRef.current.scale.set(1.0, 1.0, flicker);
      }
    }
  });

  // Quad tips aligned with rear chrome exhaust pipes
  const tipX = [-0.45, -0.32, 0.32, 0.45];

  return (
    <group ref={flamesRef} visible={false}>
      {tipX.map((tx, idx) => (
        <group
          key={`nitro-flame-${idx}`}
          position={[tx, -0.12, -1.72]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          {/* Outer Orange Fire */}
          <mesh geometry={flameGeo} material={fireOrangeMat} position={[0, 0.28, 0]} />
          {/* Inner Yellow Core */}
          <mesh geometry={coreGeo} material={idx % 2 === 0 ? fireYellowMat : cyanNitroMat} position={[0, 0.2, 0]} />
        </group>
      ))}
      {/* Dynamic Fiery Exhaust PointLight */}
      <pointLight position={[0, -0.1, -1.9]} color="#ff4d00" intensity={4.5} distance={5} />
    </group>
  );
};
