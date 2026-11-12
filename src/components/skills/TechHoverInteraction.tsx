import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getSharedEffectGeometries } from './techLogoGeometry';

interface TechHoverInteractionProps {
  hoverIntensityRef: React.MutableRefObject<number>;
  selectedIntensityRef: React.MutableRefObject<number>;
  accentColor: string;
  reducedMotion: boolean;
}

const ORBIT_PARTICLE_COUNT = 12;

export const TechHoverInteraction: React.FC<TechHoverInteractionProps> = ({
  hoverIntensityRef,
  selectedIntensityRef,
  accentColor,
  reducedMotion,
}) => {
  const hostRef = useRef<THREE.Group>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const scanMeshRef = useRef<THREE.Mesh>(null);
  const innerMatRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const outerMatRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const scanMatRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const particleMatRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const dummyRef = useRef(new THREE.Object3D());

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const { innerRingGeo, outerRingGeo, particleGeo } = getSharedEffectGeometries();

    const innerMat = new THREE.MeshBasicMaterial({
      color: '#FF3038',
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const outerMat = new THREE.MeshBasicMaterial({
      color: accentColor,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const scanGeo = new THREE.RingGeometry(0.62, 0.72, 48, 1, 0, Math.PI * 0.65);
    const scanMat = new THREE.MeshBasicMaterial({
      color: '#FF3038',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const particleMat = new THREE.MeshBasicMaterial({
      color: '#FF6B70',
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const innerMesh = new THREE.Mesh(innerRingGeo, innerMat);
    const outerMesh = new THREE.Mesh(outerRingGeo, outerMat);
    const scanMesh = new THREE.Mesh(scanGeo, scanMat);
    scanMesh.position.z = 0.04;

    const inst = new THREE.InstancedMesh(particleGeo, particleMat, ORBIT_PARTICLE_COUNT);
    inst.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    innerRingRef.current = innerMesh;
    outerRingRef.current = outerMesh;
    scanMeshRef.current = scanMesh;
    innerMatRef.current = innerMat;
    outerMatRef.current = outerMat;
    scanMatRef.current = scanMat;
    particlesRef.current = inst;
    particleMatRef.current = particleMat;

    host.add(innerMesh, outerMesh, scanMesh, inst);

    return () => {
      host.remove(innerMesh, outerMesh, scanMesh, inst);
      scanGeo.dispose();
      innerMat.dispose();
      outerMat.dispose();
      scanMat.dispose();
      particleMat.dispose();
      innerMatRef.current = null;
      outerMatRef.current = null;
      scanMatRef.current = null;
      particleMatRef.current = null;
      scanMeshRef.current = null;
      particlesRef.current = null;
    };
  }, [accentColor]);

  useFrame((state, delta) => {
    const hover = hoverIntensityRef.current;
    const selected = selectedIntensityRef.current;
    const combined = Math.min(1, Math.max(hover, selected));

    const host = hostRef.current;
    if (!host) return;
    if (combined < 0.015) {
      host.visible = false;
      return;
    }
    host.visible = true;

    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    if (innerMatRef.current) {
      innerMatRef.current.opacity = hover * 0.42 + selected * 0.78;
    }
    if (outerMatRef.current) {
      outerMatRef.current.opacity = selected * 0.48 + hover * 0.16;
    }
    if (scanMatRef.current) {
      scanMatRef.current.opacity = hover * 0.36 + selected * 0.55;
    }

    if (innerRingRef.current && outerRingRef.current) {
      if (!reducedMotion) {
        innerRingRef.current.rotation.z += dt * (0.9 + selected * 1.1);
        innerRingRef.current.rotation.x = Math.sin(t * 1.3) * 0.25 * selected;
        outerRingRef.current.rotation.z -= dt * (0.65 + selected * 0.75);
        outerRingRef.current.rotation.y = Math.cos(t * 1.1) * 0.32 * selected;
      }
      const ringScale = 0.88 + combined * 0.18 + selected * 0.12;
      innerRingRef.current.scale.setScalar(ringScale);
      outerRingRef.current.scale.setScalar(ringScale * 1.04);
    }

    if (scanMeshRef.current && !reducedMotion) {
      scanMeshRef.current.rotation.z -= dt * 2.4;
    }

    const inst = particlesRef.current;
    const pMat = particleMatRef.current;
    if (inst && pMat) {
      const particleAlpha = Math.min(1, selected * 0.92 + hover * 0.45);
      pMat.opacity = particleAlpha;
      inst.visible = particleAlpha > 0.03;

      if (inst.visible) {
        const dummy = dummyRef.current;
        for (let i = 0; i < ORBIT_PARTICLE_COUNT; i++) {
          const speed = reducedMotion ? 0 : 0.75 + (i % 3) * 0.32;
          const theta = (i / ORBIT_PARTICLE_COUNT) * Math.PI * 2 + t * speed;
          const radius = 0.68 + Math.sin(t * 2 + i * 1.7) * 0.12 + selected * 0.18;
          const px = Math.cos(theta) * radius;
          const py = Math.sin(theta) * radius * (0.85 + (i % 2) * 0.2);
          const pz = Math.sin(theta * 2 + i) * 0.24;
          const s = (0.55 + 0.45 * Math.sin(t * 3.5 + i)) * (0.7 + selected * 0.65);

          dummy.position.set(px, py, pz);
          dummy.rotation.set(t + i, t * 0.8 + i, 0);
          dummy.scale.setScalar(s);
          dummy.updateMatrix();
          inst.setMatrixAt(i, dummy.matrix);
        }
        inst.instanceMatrix.needsUpdate = true;
      }
    }
  });

  return <group ref={hostRef} visible={false} />;
};
