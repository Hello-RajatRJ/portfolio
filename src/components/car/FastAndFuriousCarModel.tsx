import React, { useRef, useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh, MeshStandardMaterial, PointLight, SpotLight, Object3D } from 'three';
import type { CarPhysicsState, CarVisualState } from '../CarState';
import { NitroExhaustFlame } from './CarFX';

interface FastAndFuriousModelProps {
  physicsRef?: React.MutableRefObject<CarPhysicsState>;
  visualRef: React.MutableRefObject<CarVisualState>;
}

export const FastAndFuriousCarModel: React.FC<FastAndFuriousModelProps> = ({
  visualRef,
}) => {
  const { scene } = useGLTF('/fast__furious_night_race_3d_scene.glb');
  const wheeliePivotRef = useRef<Group>(null);
  const chassisRef = useRef<Group>(null);

  // Spotlights for aggressive muscle car headlights
  const targetLeftRef = useRef<Object3D>(null);
  const targetRightRef = useRef<Object3D>(null);
  const spotLeftRef = useRef<SpotLight>(null);
  const spotRightRef = useRef<SpotLight>(null);
  const tailLightRef = useRef<PointLight>(null);

  // Clone scene so it can be safely used
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    if (!clonedScene) return;
    try {
      clonedScene.traverse((child) => {
        if ((child as Mesh).isMesh) {
          const mesh = child as Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          if (mesh.material) {
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach((m) => {
              if (m && 'roughness' in m) {
                const mat = m as MeshStandardMaterial;
                mat.roughness = Math.min(mat.roughness || 0.4, 0.35);
                mat.metalness = Math.max(mat.metalness || 0.5, 0.75);
                mat.envMapIntensity = 2.5;
              }
            });
          }
        }
      });
    } catch {
      // Fallback gracefully without throwing
    }
  }, [clonedScene]);

  useFrame(() => {
    const v = visualRef.current;

    // 1. Wheelie Pop on Boost
    if (wheeliePivotRef.current) {
      wheeliePivotRef.current.rotation.x = -v.wheelieAngle;
    }

    // 2. Suspension pitch & roll
    if (chassisRef.current) {
      chassisRef.current.rotation.z = -v.bodyRoll;
      chassisRef.current.rotation.x = v.bodyPitch;
    }

    // 3. Headlight targets
    if (spotLeftRef.current && targetLeftRef.current && spotLeftRef.current.target !== targetLeftRef.current) {
      spotLeftRef.current.target = targetLeftRef.current;
    }
    if (spotRightRef.current && targetRightRef.current && spotRightRef.current.target !== targetRightRef.current) {
      spotRightRef.current.target = targetRightRef.current;
    }

    // 4. Taillight flare on brake
    if (tailLightRef.current) {
      tailLightRef.current.intensity = v.isBraking ? 6.0 : 1.6;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ── WHEELIE PIVOT (Pivot centered on rear axle) ── */}
      <group ref={wheeliePivotRef} position={[0, 0.28, -0.95]}>
        <group ref={chassisRef} position={[0, 0, 0.95]}>
          {/* ── 1969 DODGE CHARGER R/T MODEL (Scaled 65x to real automotive ~3.5m length) ── */}
          <group position={[0, 0.40, -0.12]} rotation={[0, Math.PI, 0]} scale={[65, 65, 65]}>
            <primitive object={clonedScene} />
          </group>

          {/* ── HEADLIGHT SPOTLIGHTS & TARGETS ── */}
          <object3D ref={targetLeftRef} position={[-0.48, 0.1, 18.0]} />
          <object3D ref={targetRightRef} position={[0.48, 0.1, 18.0]} />

          <spotLight
            ref={spotLeftRef}
            position={[-0.48, 0.42, 1.7]}
            angle={0.45}
            penumbra={0.6}
            intensity={48}
            distance={38}
            color="#fef08a"
          />
          <spotLight
            ref={spotRightRef}
            position={[0.48, 0.42, 1.7]}
            angle={0.45}
            penumbra={0.6}
            intensity={48}
            distance={38}
            color="#fef08a"
          />

          {/* High-visibility glowing headlight lenses */}
          {[-0.48, 0.48].map((hx) => (
            <mesh key={`hl-${hx}`} position={[hx, 0.42, 1.72]}>
              <sphereGeometry args={[0.08, 12, 12]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>
          ))}

          {/* ── REAR TAILLIGHTS & BRAKE GLOW ── */}
          <mesh position={[0, 0.42, -1.75]}>
            <boxGeometry args={[1.35, 0.1, 0.04]} />
            <meshBasicMaterial color={visualRef.current.isBraking ? '#ff003c' : '#b91c1c'} />
          </mesh>
          <pointLight
            ref={tailLightRef}
            position={[0, 0.42, -1.85]}
            color="#ff003c"
            intensity={2.5}
            distance={6}
          />

          {/* ── NITRO EXHAUST FLAMES ── */}
          <NitroExhaustFlame visualRef={visualRef} />

          {/* Aggressive Fast & Furious Crimson Underglow */}
          <pointLight position={[0, -0.15, 0]} color="#ef4444" intensity={3.0} distance={5.0} />
        </group>
      </group>
    </group>
  );
};
