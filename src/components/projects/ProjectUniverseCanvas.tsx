import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CanvasErrorBoundary } from '../CanvasErrorBoundary';
import type { ParallaxSignalState } from './projectTypes';

interface UniverseSceneProps {
  signalRef: React.MutableRefObject<ParallaxSignalState>;
  reducedMotion: boolean;
}

interface FloatingBodyMeta {
  mesh: THREE.Group;
  baseX: number;
  baseY: number;
  baseZ: number;
  rotSpeedX: number;
  rotSpeedY: number;
  floatAmp: number;
  floatSpeed: number;
  phase: number;
}

const ProjectUniverseScene: React.FC<UniverseSceneProps> = ({ signalRef, reducedMotion }) => {
  const rootGroupRef = useRef<THREE.Group>(null);
  const bodiesRef = useRef<FloatingBodyMeta[]>([]);
  const pointsRef = useRef<THREE.Points | null>(null);
  const filamentsRef = useRef<THREE.LineSegments | null>(null);

  useEffect(() => {
    const root = rootGroupRef.current;
    if (!root) return;

    const disposableGeos: THREE.BufferGeometry[] = [];
    const disposableMats: THREE.Material[] = [];
    const builtBodies: FloatingBodyMeta[] = [];

    // 1. Floating Low-Poly Geometric Structures (Dark Metallic + Crimson Wireframe Shells)
    const hullMat = new THREE.MeshStandardMaterial({
      color: '#111114',
      metalness: 0.85,
      roughness: 0.3,
      transparent: true,
      opacity: 0.65,
    });
    const wireMat = new THREE.MeshBasicMaterial({
      color: '#FF3038',
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    const ringMat = new THREE.MeshBasicMaterial({
      color: '#C91520',
      transparent: true,
      opacity: 0.34,
    });
    disposableMats.push(hullMat, wireMat, ringMat);

    const shapes: Array<{
      geo: THREE.BufferGeometry;
      pos: [number, number, number];
      scale: number;
      phase: number;
    }> = [
      { geo: new THREE.OctahedronGeometry(0.95, 0), pos: [-6.8, 2.3, -4.2], scale: 1.15, phase: 0.2 },
      { geo: new THREE.IcosahedronGeometry(0.75, 0), pos: [6.6, 2.8, -5.0], scale: 1.0, phase: 1.4 },
      { geo: new THREE.OctahedronGeometry(0.65, 0), pos: [-4.2, -2.5, -3.5], scale: 0.9, phase: 2.3 },
      { geo: new THREE.TorusGeometry(0.9, 0.035, 8, 28), pos: [4.8, -2.1, -3.8], scale: 1.05, phase: 3.1 },
      { geo: new THREE.TetrahedronGeometry(0.85, 0), pos: [0.4, 3.3, -6.2], scale: 1.1, phase: 4.0 },
      { geo: new THREE.IcosahedronGeometry(0.6, 0), pos: [-8.5, -0.4, -5.8], scale: 0.9, phase: 4.9 },
      { geo: new THREE.OctahedronGeometry(0.8, 0), pos: [8.4, -0.6, -5.5], scale: 1.0, phase: 5.7 },
    ];

    shapes.forEach((cfg, idx) => {
      disposableGeos.push(cfg.geo);
      const grp = new THREE.Group();
      grp.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      grp.scale.setScalar(cfg.scale);

      const core = new THREE.Mesh(cfg.geo, hullMat);
      const wire = new THREE.Mesh(cfg.geo, wireMat);
      wire.scale.setScalar(1.08);
      grp.add(core, wire);

      if (idx % 2 === 0) {
        const ringGeo = new THREE.TorusGeometry(1.25, 0.014, 6, 36);
        disposableGeos.push(ringGeo);
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2.6;
        grp.add(ring);
      }

      root.add(grp);
      builtBodies.push({
        mesh: grp,
        baseX: cfg.pos[0],
        baseY: cfg.pos[1],
        baseZ: cfg.pos[2],
        rotSpeedX: 0.1 + (idx % 3) * 0.05,
        rotSpeedY: 0.16 + (idx % 4) * 0.04,
        floatAmp: 0.28 + (idx % 3) * 0.08,
        floatSpeed: 0.5 + (idx % 3) * 0.14,
        phase: cfg.phase,
      });
    });

    // 2. Crimson & Warm-White Spatial Dust Field
    const particleCount = 150;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const cRed = new THREE.Color('#FF3038');
    const cDeep = new THREE.Color('#C91520');
    const cWhite = new THREE.Color('#FFFFFF');

    for (let i = 0; i < particleCount; i++) {
      // Deterministic pseudo-random spread for reproducible WebGL look
      const seedA = Math.sin(i * 12.9898) * 43758.5453;
      const seedB = Math.sin(i * 78.233) * 19341.123;
      const seedC = Math.sin(i * 39.425) * 28411.771;
      const rx = seedA - Math.floor(seedA);
      const ry = seedB - Math.floor(seedB);
      const rz = seedC - Math.floor(seedC);

      positions[i * 3] = (rx - 0.5) * 22;
      positions[i * 3 + 1] = (ry - 0.5) * 11;
      positions[i * 3 + 2] = -1.5 - rz * 9;

      const palette = i % 7 === 0 ? cWhite : i % 2 === 0 ? cRed : cDeep;
      colors[i * 3] = palette.r;
      colors[i * 3 + 1] = palette.g;
      colors[i * 3 + 2] = palette.b;
    }

    const ptsGeo = new THREE.BufferGeometry();
    ptsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    ptsGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const ptsMat = new THREE.PointsMaterial({
      size: 0.075,
      vertexColors: true,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const ptsMesh = new THREE.Points(ptsGeo, ptsMat);
    root.add(ptsMesh);
    disposableGeos.push(ptsGeo);
    disposableMats.push(ptsMat);

    // 3. Subtle Data Filament Network Connecting Nearby Clusters
    const filamentPositions: number[] = [];
    for (let i = 0; i < builtBodies.length - 1; i++) {
      const a = builtBodies[i];
      const b = builtBodies[i + 1];
      filamentPositions.push(a.baseX, a.baseY, a.baseZ, b.baseX, b.baseY, b.baseZ);
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(filamentPositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: '#FF3038',
      transparent: true,
      opacity: 0.14,
    });
    const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
    root.add(lineSegments);
    disposableGeos.push(lineGeo);
    disposableMats.push(lineMat);

    bodiesRef.current = builtBodies;
    pointsRef.current = ptsMesh;
    filamentsRef.current = lineSegments;

    return () => {
      bodiesRef.current = [];
      pointsRef.current = null;
      filamentsRef.current = null;
      builtBodies.forEach((b) => root.remove(b.mesh));
      root.remove(ptsMesh);
      root.remove(lineSegments);
      disposableGeos.forEach((g) => g.dispose());
      disposableMats.forEach((m) => m.dispose());
    };
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const sig = signalRef.current;
    const t = state.clock.elapsedTime;
    const velBoost = Math.min(Math.abs(sig.scrollVelocity) * 0.04, 1.4);

    if (rootGroupRef.current) {
      const targetRotY = sig.pointerX * 0.085;
      const targetRotX = sig.pointerY * -0.055 + (sig.scrollProgress - 0.5) * 0.14;
      rootGroupRef.current.rotation.y += (targetRotY - rootGroupRef.current.rotation.y) * Math.min(1, dt * 3.5);
      rootGroupRef.current.rotation.x += (targetRotX - rootGroupRef.current.rotation.x) * Math.min(1, dt * 3.5);
    }

    if (reducedMotion) return;

    const bodies = bodiesRef.current;
    for (let i = 0; i < bodies.length; i++) {
      const b = bodies[i];
      b.mesh.rotation.x += dt * b.rotSpeedX * (1 + velBoost);
      b.mesh.rotation.y += dt * b.rotSpeedY * (1 + velBoost);
      b.mesh.position.y = b.baseY + Math.sin(t * b.floatSpeed + b.phase) * b.floatAmp;
      b.mesh.position.x = b.baseX + sig.pointerX * (i % 2 === 0 ? -0.35 : 0.25);
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.015 + sig.scrollProgress * 0.18;
    }

    if (filamentsRef.current) {
      filamentsRef.current.rotation.z = Math.sin(t * 0.18) * 0.03;
    }
  });

  return (
    <>
      <ambientLight intensity={0.28} />
      <pointLight position={[-6, 4, 3]} intensity={1.8} color="#FF3038" distance={22} />
      <pointLight position={[7, -3, 2]} intensity={1.2} color="#C91520" distance={20} />
      <pointLight position={[0, 2, 5]} intensity={0.45} color="#ffffff" distance={18} />
      <group ref={rootGroupRef} />
    </>
  );
};

interface ProjectUniverseCanvasProps {
  signalRef: React.MutableRefObject<ParallaxSignalState>;
  shouldMount: boolean;
  sectionActive: boolean;
  webglSupported: boolean;
  reducedMotion: boolean;
}

export const ProjectUniverseCanvas: React.FC<ProjectUniverseCanvasProps> = ({
  signalRef,
  shouldMount,
  sectionActive,
  webglSupported,
  reducedMotion,
}) => {
  if (!webglSupported || !shouldMount) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] opacity-85"
    >
      <CanvasErrorBoundary fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 7.5], fov: 46, near: 0.1, far: 45 }}
          dpr={[1, 1.5]}
          frameloop={sectionActive && !reducedMotion ? 'always' : 'demand'}
          gl={{
            alpha: true,
            antialias: false,
            powerPreference: 'high-performance',
          }}
          style={{ pointerEvents: 'none', background: 'transparent' }}
        >
          <ProjectUniverseScene signalRef={signalRef} reducedMotion={reducedMotion} />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
};

