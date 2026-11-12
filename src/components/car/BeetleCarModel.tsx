import React, { useRef, useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh, MeshStandardMaterial, PointLight, SpotLight, Object3D } from 'three';
import type { CarPhysicsState, CarVisualState } from '../CarState';
import { NitroExhaustFlame } from './CarFX';

interface BeetleCarModelProps {
  physicsRef: React.MutableRefObject<CarPhysicsState>;
  visualRef: React.MutableRefObject<CarVisualState>;
}

export const BeetleCarModel: React.FC<BeetleCarModelProps> = ({
  physicsRef: _physicsRef,
  visualRef,
}) => {
  const { scene } = useGLTF('/models/stylized_car.glb');
  const wheeliePivotRef = useRef<Group>(null);
  const chassisRef = useRef<Group>(null);

  const targetLeftRef = useRef<Object3D>(null);
  const targetRightRef = useRef<Object3D>(null);
  const spotLeftRef = useRef<SpotLight>(null);
  const spotRightRef = useRef<SpotLight>(null);
  const tailLightRef = useRef<PointLight>(null);

  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    if (!clonedScene) return;
    clonedScene.traverse((child) => {
      // Hide ground plane shadow mesh
      if (child.name.includes('Ground') || child.name.includes('render')) {
        child.visible = false;
        return;
      }
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((mat) => {
            if (mat && 'roughness' in mat) {
              const std = mat as MeshStandardMaterial;
              std.metalness = 0.2;
              std.roughness = 0.35;
              std.envMapIntensity = 1.6;
              if (std.emissiveMap) {
                std.emissiveIntensity = 0.9;
              }
              std.needsUpdate = true;
            }
          });
        }
      }
    });
  }, [clonedScene]);

  useFrame(() => {
    const v = visualRef.current;

    if (wheeliePivotRef.current) {
      wheeliePivotRef.current.rotation.x = -v.wheelieAngle;
    }
    if (chassisRef.current) {
      chassisRef.current.rotation.z = -v.bodyRoll;
      chassisRef.current.rotation.x = v.bodyPitch;
    }

    if (spotLeftRef.current && targetLeftRef.current && spotLeftRef.current.target !== targetLeftRef.current) {
      spotLeftRef.current.target = targetLeftRef.current;
    }
    if (spotRightRef.current && targetRightRef.current && spotRightRef.current.target !== targetRightRef.current) {
      spotRightRef.current.target = targetRightRef.current;
    }

    if (tailLightRef.current) {
      tailLightRef.current.intensity = v.isBraking ? 5.0 : 1.2;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <group ref={wheeliePivotRef} position={[0, 0.28, -0.95]}>
        <group ref={chassisRef} position={[0, -0.28, 0.95]}>
          {/* ── STYLIZED NEON BEETLE MODEL ── */}
          {/* Scaled 0.95 (~3.55m length, ~1.81m width), facing +Z forward, flush on y=0 */}
          <group position={[0, 0, 0.175]} rotation={[0, Math.PI / 2, 0]} scale={[0.95, 0.95, 0.95]}>
            <primitive object={clonedScene} />
          </group>

          {/* Headlight beams */}
          <object3D ref={targetLeftRef} position={[-0.50, 0.1, 18.0]} />
          <object3D ref={targetRightRef} position={[0.50, 0.1, 18.0]} />

          <spotLight
            ref={spotLeftRef}
            position={[-0.50, 0.50, 1.56]}
            angle={0.42}
            penumbra={0.6}
            intensity={35}
            distance={30}
            color="#38bdf8"
          />
          <spotLight
            ref={spotRightRef}
            position={[0.50, 0.50, 1.56]}
            angle={0.42}
            penumbra={0.6}
            intensity={35}
            distance={30}
            color="#38bdf8"
          />

          {/* Crisp Headlight & Taillight Glows */}
          {[-0.50, 0.50].map((hx) => (
            <mesh key={`beetle-hl-${hx}`} position={[hx, 0.50, 1.56]}>
              <sphereGeometry args={[0.075, 10, 10]} />
              <meshBasicMaterial color="#e0f2fe" toneMapped={false} />
            </mesh>
          ))}
          {[-0.56, 0.56].map((tx) => (
            <mesh key={`beetle-tl-${tx}`} position={[tx, 0.48, -1.70]}>
              <sphereGeometry args={[0.065, 10, 10]} />
              <meshBasicMaterial color="#fb7185" toneMapped={false} />
            </mesh>
          ))}

          {/* Taillight */}
          <pointLight
            ref={tailLightRef}
            position={[0, 0.48, -1.78]}
            color="#f43f5e"
            intensity={1.8}
            distance={5}
          />

          {/* Dual Nitro Exhaust Flames */}
          <group position={[0, 0.28, 0]}>
            <NitroExhaustFlame visualRef={visualRef} />
          </group>

          {/* Cyan Neon Underglow Floor Trim (zero extra pointLight needed) */}
          <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.45, 3.0]} />
            <meshBasicMaterial color="#06b6d4" transparent opacity={0.28} depthWrite={false} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
