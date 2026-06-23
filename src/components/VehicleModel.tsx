import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh, Object3D } from 'three';

import type { CarPhysicsState, CarVisualState } from './CarState';

interface VehicleModelProps {
  physicsRef: React.MutableRefObject<CarPhysicsState>;
  visualRef: React.MutableRefObject<CarVisualState>;
}

export const VehicleModel: React.FC<VehicleModelProps> = ({
  physicsRef,
  visualRef,
}) => {
  const { scene } = useGLTF('/models/cyberpunk_car.glb');
  const bodyRef = useRef<Group>(null);

  // Cache wheel references
  const wheelRefs = useRef<{
    frontLeft: Object3D | null;
    frontRight: Object3D | null;
    rearLeft: Object3D | null;
    rearRight: Object3D | null;
  }>({
    frontLeft: null,
    frontRight: null,
    rearLeft: null,
    rearRight: null,
  });

  // Enable shadows on all meshes and try to find wheel nodes
  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Fix for black materials (if it's highly metallic without an HDRI, it looks pitch black)
        if (mesh.material) {
          const mat = mesh.material as import('three').MeshStandardMaterial;
          // Reduce metalness so it doesn't reflect the black void
          if (mat.metalness !== undefined) mat.metalness = 0.2;
          if (mat.roughness !== undefined) mat.roughness = 0.8;
          mat.needsUpdate = true;
        }
      }

      const name = child.name.toLowerCase();
      
      // Hide the giant ground shadow plane that comes with stylized_car
      if (name.includes('ground')) {
        child.visible = false;
        return;
      }

      // Stylized car wheel mapping
      if (name.includes('wheels_left')) {
        wheelRefs.current.frontLeft = child;
      } else if (name.includes('wheels_right')) {
        wheelRefs.current.frontRight = child;
      }
      
      // Legacy luaz wheel mapping
      if (name.includes('wheel') || name.includes('tire') || name.includes('tyre') || name.includes('koleso')) {
        if (name.includes('front') || name.includes('fl') || name.includes('lf') || name.includes('передн')) {
          if (name.includes('left') || name.includes('fl') || name.includes('lf') || name.includes('лев')) {
            wheelRefs.current.frontLeft = child;
          } else if (name.includes('right') || name.includes('fr') || name.includes('rf') || name.includes('прав')) {
            wheelRefs.current.frontRight = child;
          } else if (!wheelRefs.current.frontLeft) {
            wheelRefs.current.frontLeft = child;
          } else if (!wheelRefs.current.frontRight) {
            wheelRefs.current.frontRight = child;
          }
        } else if (name.includes('rear') || name.includes('back') || name.includes('rl') || name.includes('rr') || name.includes('задн')) {
          if (name.includes('left') || name.includes('rl') || name.includes('lr') || name.includes('лев')) {
            wheelRefs.current.rearLeft = child;
          } else if (name.includes('right') || name.includes('rr') || name.includes('lr') || name.includes('прав')) {
            wheelRefs.current.rearRight = child;
          } else if (!wheelRefs.current.rearLeft) {
            wheelRefs.current.rearLeft = child;
          } else if (!wheelRefs.current.rearRight) {
            wheelRefs.current.rearRight = child;
          }
        }
      }
    });
  }, [scene]);

  // Apply steering + rotation to wheels via useFrame
  useFrame(() => {
    const wheels = wheelRefs.current;
    const v = visualRef.current;
    const p = physicsRef.current;

    if (wheels.frontLeft) {
      wheels.frontLeft.rotation.x = v.wheelRot;
      // Skip steering if it's the stylized car since left wheels are a single mesh
      if (!scene.getObjectByName('Plane.007_wheels_left_0')) {
        wheels.frontLeft.rotation.y = p.steeringAngle;
      }
    }
    
    if (wheels.frontRight) {
      wheels.frontRight.rotation.x = v.wheelRot;
      if (!scene.getObjectByName('Plane.007_wheels_right_0')) {
        wheels.frontRight.rotation.y = p.steeringAngle;
      }
    }
    if (wheels.rearLeft) {
      wheels.rearLeft.rotation.x = v.wheelRot;
    }
    if (wheels.rearRight) {
      wheels.rearRight.rotation.x = v.wheelRot;
    }

    if (bodyRef.current) {
      bodyRef.current.rotation.x = v.wheelieAngle;
    }
  });

  return (
    <group ref={bodyRef}>
      {/* The Luaz GLB — scale tuned to match physics collider radius ~1.1 */}
      <primitive
        object={scene}
        scale={[0.004, 0.004, 0.004]}
        position={[0, 0, 0]}
        rotation={[0, Math.PI, 0]}
      />
    </group>
  );
};

// Preload the model so it's ready before the game starts
useGLTF.preload('/models/cyberpunk_car.glb');
