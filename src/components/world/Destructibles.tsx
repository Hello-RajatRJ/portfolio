import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Group } from 'three';
import { carGlobalPosition } from '../CarState';

// Physics state for destructible props
export interface DestructibleState {
  id: string;
  type: 'tree' | 'crate' | 'barrier';
  pos: Vector3;
  vel: Vector3;
  rot: Vector3;
  rotVel: Vector3;
  knocked: boolean;
  scale: number;
}

// Global registry of all destructibles
const destructiblesList: DestructibleState[] = [];

// Helper to initialize trees
const initTrees = () => {
  if (destructiblesList.length > 0) return; // already initialized

  // Add trees around the map edges — within ±22 boundary, spaced to not clutter gameplay
  const treePositions = [
    [-19, 6], [-19, -6], [-19, 18], [-19, -18],
    [19, 6], [19, -6], [19, 18], [19, -18],
    [-6, -19], [6, -19], [18, -19], [-18, -19],
    [0, 19], [12, 19], [-12, 19],
  ];

  treePositions.forEach((pos, i) => {
    destructiblesList.push({
      id: `tree-${i}`,
      type: 'tree',
      pos: new Vector3(pos[0], 0, pos[1]),
      vel: new Vector3(0, 0, 0),
      rot: new Vector3(0, Math.random() * Math.PI, 0),
      rotVel: new Vector3(0, 0, 0),
      knocked: false,
      scale: 0.65 + Math.random() * 0.35, // Smaller trees (was 1.0-1.5)
    });
  });
};

export const Destructibles: React.FC = () => {
  useEffect(() => {
    initTrees();
  }, []);

  return (
    <group>
      {/* We could use instanced mesh, but since they have independent physics, 
          mapping simple components is easier. For large amounts, we'd use InstancedMesh 
          and update instanceMatrix in useFrame. For a few dozen, standard mesh is fine. */}
      {destructiblesList.map((d, index) => {
        if (d.type === 'tree') return <Tree key={d.id} index={index} />;
        return null;
      })}
    </group>
  );
};

const Tree: React.FC<{ index: number }> = ({ index }) => {
  const groupRef = useRef<Group>(null);

  useFrame((_state, delta) => {
    const dt = Math.min(delta, 0.1);
    const item = destructiblesList[index];
    
    // Physics update
    if (item.knocked) {
      item.pos.addScaledVector(item.vel, dt);
      
      // Gravity
      if (item.pos.y > 0) {
        item.vel.y -= 9.81 * dt;
      } else {
        item.pos.y = 0;
        item.vel.y = 0;
        item.vel.x *= 0.9; // Friction
        item.vel.z *= 0.9;
        item.rotVel.multiplyScalar(0.95);
      }

      item.rot.addScaledVector(item.rotVel, dt);
    } else {
      // Collision check with car
      const dist = carGlobalPosition.distanceTo(item.pos);
      if (dist < 2.0) { // Collision radius
        item.knocked = true;
        // Direction away from car
        const dir = new Vector3().subVectors(item.pos, carGlobalPosition).normalize();
        dir.y = 0.5; // Pop upwards
        
        // Speed of hit (we don't have access to car speed here easily, so we just assume a hard hit)
        item.vel.copy(dir.multiplyScalar(15));
        item.rotVel.set(Math.random() * 5, Math.random() * 5, Math.random() * 5);
      }
    }

    // Apply to mesh
    if (groupRef.current) {
      groupRef.current.position.copy(item.pos);
      groupRef.current.rotation.set(item.rot.x, item.rot.y, item.rot.z);
    }
  });

  const item = destructiblesList[index];

  return (
    <group ref={groupRef} scale={item.scale}>
      {/* Trunk */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.3, 2, 6]} />
        <meshStandardMaterial color="#2a1a1a" roughness={0.9} />
      </mesh>
      {/* Leaves (Low poly cone) */}
      <mesh position={[0, 3, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.5, 3, 5]} />
        <meshStandardMaterial color="#00ff88" roughness={0.8} />
      </mesh>
      <mesh position={[0, 4.5, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.2, 2.5, 5]} />
        <meshStandardMaterial color="#00ffaa" roughness={0.8} />
      </mesh>
    </group>
  );
};
