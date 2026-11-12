import React, { useRef, useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh, Object3D, MeshStandardMaterial, SpotLight, PointLight, CylinderGeometry } from 'three';
import type { CarPhysicsState, CarVisualState } from './CarState';
import { NitroExhaustFlame } from './car/CarFX';

interface VehicleModelProps {
  physicsRef: React.MutableRefObject<CarPhysicsState>;
  visualRef: React.MutableRefObject<CarVisualState>;
}

export const VehicleModel: React.FC<VehicleModelProps> = ({
  visualRef,
}) => {
  const { scene } = useGLTF('/models/cyberpunk_car.glb');
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  // Rear axle pivot for authentic wheelie lift + chassis suspension group
  const wheeliePivotRef = useRef<Group>(null);
  const chassisRef = useRef<Group>(null);

  // Spotlight targets placed forward down the road
  const targetLeftRef = useRef<Object3D>(null);
  const targetRightRef = useRef<Object3D>(null);

  // SpotLight refs to link with targets
  const spotLeftRef = useRef<SpotLight>(null);
  const spotRightRef = useRef<SpotLight>(null);

  // Tail brake lights ref
  const tailLightRef = useRef<PointLight>(null);
  const tailBarRef = useRef<Mesh>(null);
  const reverseLightRef = useRef<PointLight>(null);

  // Preserve authentic cyberpunk car textures while enhancing automotive sheen & neon emissive strips
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
              if (m && 'metalness' in m) {
                const mat = m as MeshStandardMaterial;
                mat.metalness = 0.55;
                mat.roughness = 0.28;
                mat.envMapIntensity = 1.8;
                if (mat.emissiveMap) {
                  mat.emissiveIntensity = 1.65;
                }
                mat.needsUpdate = true;
              }
            });
          }
        }
      });
    } catch {
      // Safe fallback
    }
  }, [clonedScene]);

  // Reusable volumetric beam geometry: narrow at -5 (z=1.05 near car), wide at +5 (z=11.05 far)
  const beamGeo = useMemo(() => {
    const geo = new CylinderGeometry(1.6, 0.12, 10, 16, 1, true);
    geo.rotateX(Math.PI / 2);
    return geo;
  }, []);

  // Reusable materials
  const { beamMat, lensMat, tailMat, groundPuddleMat, underglowMat } = useMemo(
    () => ({
      beamMat: new MeshStandardMaterial({
        color: '#e0f2fe',
        emissive: '#bae6fd',
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.1,
        roughness: 0.6,
        depthWrite: false,
      }),
      groundPuddleMat: new MeshStandardMaterial({
        color: '#e0f2fe',
        emissive: '#bae6fd',
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.18,
        roughness: 0.4,
        depthWrite: false,
      }),
      lensMat: new MeshStandardMaterial({
        color: '#ffffff',
        emissive: '#e0f2fe',
        emissiveIntensity: 3.5,
        toneMapped: false,
      }),
      tailMat: new MeshStandardMaterial({
        color: '#ff003c',
        emissive: '#dc2626',
        emissiveIntensity: 1.5,
        toneMapped: false,
      }),
      underglowMat: new MeshStandardMaterial({
        color: '#a855f7',
        emissive: '#7c3aed',
        emissiveIntensity: 2.2,
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
      }),
    }),
    []
  );

  // Update chassis dynamics, spotlight targets & tail lights on frame
  useFrame(() => {
    const v = visualRef.current;

    if (wheeliePivotRef.current) {
      wheeliePivotRef.current.rotation.x = -v.wheelieAngle;
    }

    // Apply suspension pitch (dive on brake, squat on accel) and lateral roll (cornering lean)
    if (chassisRef.current) {
      chassisRef.current.rotation.x = v.bodyPitch;
      chassisRef.current.rotation.z = -v.bodyRoll;
    }

    // Ensure SpotLight targets remain properly bound in Three.js scene graph
    if (spotLeftRef.current && targetLeftRef.current && spotLeftRef.current.target !== targetLeftRef.current) {
      spotLeftRef.current.target = targetLeftRef.current;
    }
    if (spotRightRef.current && targetRightRef.current && spotRightRef.current.target !== targetRightRef.current) {
      spotRightRef.current.target = targetRightRef.current;
    }

    // Dynamic brake light brightness
    if (tailLightRef.current) {
      tailLightRef.current.intensity = v.isBraking ? 5.5 : 1.4;
      tailLightRef.current.color.set(v.isBraking ? '#ff003c' : '#dc2626');
    }

    // Flare rear light bar
    if (tailBarRef.current && tailBarRef.current.material) {
      const mat = tailBarRef.current.material as MeshStandardMaterial;
      mat.emissive.set(v.isBraking ? '#ff1e56' : '#991b1b');
      mat.emissiveIntensity = v.isBraking ? 4.5 : 1.2;
    }

    // Reverse light
    if (reverseLightRef.current) {
      const isReversing = v.isBraking && v.wheelRot < -0.1;
      reverseLightRef.current.intensity = isReversing ? 2.5 : 0;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <group ref={wheeliePivotRef} position={[0, 0.28, -0.95]}>
        <group ref={chassisRef} position={[0, -0.28, 0.95]}>
          {/* ── 3D CYBERPUNK NIGHT RUNNER MODEL ──────────────────────────── */}
          {/* Scaled 0.0068 to real car dimensions: ~3.67m length, ~1.51m width, ground flush */}
          <primitive
            object={clonedScene}
            scale={[0.0068, 0.0068, 0.0068]}
            position={[0, 0, 0]}
            rotation={[0, Math.PI, 0]}
          />

          {/* ── HEADLIGHTS ────────────────────────────────────────────────── */}
          <object3D ref={targetLeftRef} position={[-0.46, 0.05, 18.0]} />
          <object3D ref={targetRightRef} position={[0.46, 0.05, 18.0]} />

          <spotLight
            ref={spotLeftRef}
            position={[-0.46, 0.44, 1.75]}
            angle={0.42}
            penumbra={0.65}
            intensity={36}
            distance={32}
            color="#e0f2fe"
            castShadow={false}
          />
          <spotLight
            ref={spotRightRef}
            position={[0.46, 0.44, 1.75]}
            angle={0.42}
            penumbra={0.65}
            intensity={36}
            distance={32}
            color="#e0f2fe"
            castShadow={false}
          />

          {/* Sleek Headlight Lenses aligned with front nose */}
          <mesh position={[-0.46, 0.44, 1.78]} rotation={[0, 0.1, 0]} material={lensMat}>
            <boxGeometry args={[0.2, 0.045, 0.03]} />
          </mesh>
          <mesh position={[0.46, 0.44, 1.78]} rotation={[0, -0.1, 0]} material={lensMat}>
            <boxGeometry args={[0.2, 0.045, 0.03]} />
          </mesh>

          {/* Volumetric 3D Light Projector Beams */}
          <group position={[-0.46, 0.34, 6.75]} rotation={[0.02, -0.02, 0]}>
            <mesh geometry={beamGeo} material={beamMat} />
          </group>
          <group position={[0.46, 0.34, 6.75]} rotation={[0.02, 0.02, 0]}>
            <mesh geometry={beamGeo} material={beamMat} />
          </group>

          {/* Road Surface Illuminated Light Puddle */}
          <mesh position={[0, 0.03, 7.2]} rotation={[-Math.PI / 2, 0, 0]} material={groundPuddleMat}>
            <planeGeometry args={[3.2, 10.5]} />
          </mesh>

          {/* ── TAIL LIGHTS ───────────────────────────────────────────────── */}
          <mesh ref={tailBarRef} position={[0, 0.54, -1.78]} material={tailMat}>
            <boxGeometry args={[1.18, 0.045, 0.02]} />
          </mesh>

          <pointLight
            ref={tailLightRef}
            position={[0, 0.54, -1.86]}
            color="#dc2626"
            intensity={1.6}
            distance={5.0}
          />

          <pointLight
            ref={reverseLightRef}
            position={[0, 0.4, -1.86]}
            color="#ffffff"
            intensity={0}
            distance={3.0}
          />

          {/* ── CYBERPUNK CHASSIS UNDERGLOW ───────────────────────────────── */}
          <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} material={underglowMat}>
            <planeGeometry args={[1.35, 3.1]} />
          </mesh>

          {/* ── NITRO EXHAUST FLAMES ── */}
          <group position={[0, 0.28, 0]}>
            <NitroExhaustFlame visualRef={visualRef} />
          </group>
        </group>
      </group>
    </group>
  );
};
