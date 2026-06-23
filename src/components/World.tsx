import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Grid, Text } from '@react-three/drei';
import { Vector3, Group } from 'three';
import { NeonPillar } from './Obstacles';
import { ZONES, skillCubesList } from './CarState';
import type { SkillCubeState } from './CarState';
import { Terrain } from './world/Terrain';
import { Water } from './world/Water';
import { Roads } from './world/Roads';
import { Mountains } from './world/Mountains';
import { StreetLights } from './world/StreetLights';
import { Destructibles } from './world/Destructibles';
import { Buildings } from './world/Buildings';
import { Signboards } from './world/Signboards';
import { MiniGames } from './world/MiniGames';
import type { Project } from '../types';

// List of skills to display as cubes
const SKILL_NAMES = ['React', 'TypeScript', 'Three.js', 'Node.js', 'Python', 'Web3', 'Git', 'SQL'];

// Initialize the global skill cubes list with initial positions if empty
if (skillCubesList.length === 0) {
  SKILL_NAMES.forEach((skill, i) => {
    // Arrange in a neat pile/stack in the Skills Zone
    const angle = (i / SKILL_NAMES.length) * Math.PI * 2;
    const r = 1.0 + Math.random() * 0.8;
    
    // Stack some on top of others
    const height = i % 2 === 0 ? 0.4 : 1.2;
 
    skillCubesList.push({
      id: `skill-${skill}`,
      name: skill,
      pos: new Vector3(ZONES.skills.x + Math.cos(angle) * r, height, ZONES.skills.z + Math.sin(angle) * r),
      vel: new Vector3(0, 0, 0),
      rot: new Vector3(Math.random() * 0.5, Math.random() * Math.PI, Math.random() * 0.5),
      rotVel: new Vector3(0, 0, 0),
      size: 0.8,
    });
  });
}
 
interface WorldProps {
  projects: Project[];
  activeProjectZoneId: string | null;
  currentZone: string | null;
}
 
export const World: React.FC<WorldProps> = ({ projects, activeProjectZoneId, currentZone }) => {
  const resumeRef = useRef<Group>(null);
  const portalRef = useRef<Group>(null);
 
  // Global skill cubes physics simulation loop
  useFrame((_state, delta) => {
    const dt = Math.min(delta, 0.1);
    
    // 1. Animate skill cubes physics
    skillCubesList.forEach((cube: SkillCubeState) => {
      // Update position with velocity
      cube.pos.x += cube.vel.x * dt;
      cube.pos.y += cube.vel.y * dt;
      cube.pos.z += cube.vel.z * dt;
 
      // Apply Gravity
      if (cube.pos.y > cube.size / 2) {
        cube.vel.y -= 9.81 * dt;
      } else {
        // Collide with ground
        cube.pos.y = cube.size / 2;
        
        // Bounce back y velocity
        if (Math.abs(cube.vel.y) > 0.5) {
          cube.vel.y = -cube.vel.y * 0.35;
        } else {
          cube.vel.y = 0;
        }
 
        // Apply friction
        cube.vel.x *= 0.92;
        cube.vel.z *= 0.92;
        cube.rotVel.x *= 0.90;
        cube.rotVel.y *= 0.90;
        cube.rotVel.z *= 0.90;
      }
 
      // Update rotations
      cube.rot.x += cube.rotVel.x * dt;
      cube.rot.y += cube.rotVel.y * dt;
      cube.rot.z += cube.rotVel.z * dt;
 
      // Map boundary checks for cubes — expanded for larger playground
      const limit = 21.5;
      if (cube.pos.x > limit) { cube.pos.x = limit; cube.vel.x = -cube.vel.x * 0.5; }
      if (cube.pos.x < -limit) { cube.pos.x = -limit; cube.vel.x = -cube.vel.x * 0.5; }
      if (cube.pos.z > limit) { cube.pos.z = limit; cube.vel.z = -cube.vel.z * 0.5; }
      if (cube.pos.z < -limit) { cube.pos.z = -limit; cube.vel.z = -cube.vel.z * 0.5; }
    });

    // 2. Animate resume model rotation
    if (resumeRef.current) {
      resumeRef.current.rotation.y += dt * 1.5;
    }

    // 3. Animate contact booth portal pulse
    if (portalRef.current) {
      portalRef.current.rotation.y -= dt * 0.8;
    }
  });

  return (
    <group>
      {/* 1. Neon Floor Grid - expanded for larger map */}
      <Grid
        position={[0, -0.01, 0]}
        args={[55, 55]}
        cellSize={1.5}
        cellThickness={1.0}
        cellColor="#e5e7eb"
        sectionSize={6}
        sectionThickness={1.5}
        sectionColor="#a855f7"
        fadeDistance={30}
        infiniteGrid
      />

      {/* Terrain, Water, Roads, Mountains, Lights, Signs, MiniGames */}
      <Terrain />
      <Water />
      <Roads />
      <Mountains />
      <StreetLights />
      <Signboards />
      <MiniGames />

      {/* 2. Map Boundaries - Neon Pillars (expanded for larger map) */}
      {/* North & South walls */}
      {[-22, -16, -10, -4, 0, 4, 10, 16, 22].map((coord) => (
        <React.Fragment key={`bound-${coord}`}>
          <NeonPillar id={`pillar-n-${coord}`} position={[coord, 0, -22]} color="#a855f7" />
          <NeonPillar id={`pillar-s-${coord}`} position={[coord, 0, 22]} color="#a855f7" />
        </React.Fragment>
      ))}
      {/* East & West walls */}
      {[-16, -10, -4, 0, 4, 10, 16].map((coord) => (
        <React.Fragment key={`bound-ew-${coord}`}>
          <NeonPillar id={`pillar-w-${coord}`} position={[-22, 0, coord]} color="#a855f7" />
          <NeonPillar id={`pillar-e-${coord}`} position={[22, 0, coord]} color="#a855f7" />
        </React.Fragment>
      ))}

      {/* 3. Obstacles (Destructibles) */}
      <Destructibles />

      {/* 4. Welcome Zone */}
      <group position={[ZONES.welcome.x, 0, ZONES.welcome.z]}>
        {/* Glow Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[ZONES.welcome.radius - 0.2, ZONES.welcome.radius, 32]} />
          <meshBasicMaterial color="#7c3aed" toneMapped={false} />
        </mesh>
        
        {/* Floating text */}
        <Text
          position={[0, 2.5, 0]}
          fontSize={0.6}
          color="#7c3aed"
          anchorX="center"
          anchorY="middle"
        >
          RAJAT'S RIDE
        </Text>
        <Text
          position={[0, 1.8, 0]}
          fontSize={0.35}
          color="#0f172a"
          anchorX="center"
          anchorY="middle"
        >
          PORTFOLIO
        </Text>
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.18}
          color="#6b7280"
          anchorX="center"
          anchorY="middle"
        >
          WASD / Arrows to Drive | SPACE to Drift
        </Text>
      </group>

      {/* 5. Projects Zone & Billboards */}
      <group>
        {/* Glowing Zone Indicator */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[ZONES.projects.x, 0.02, ZONES.projects.z]}>
          <ringGeometry args={[ZONES.projects.radius - 0.3, ZONES.projects.radius, 32]} />
          <meshBasicMaterial color="#7c3aed" toneMapped={false} opacity={0.15} transparent />
        </mesh>
        
        <Text
          position={[ZONES.projects.x, 4.0, ZONES.projects.z]}
          fontSize={0.6}
          color="#7c3aed"
        >
          PROJECTS
        </Text>

        {/* Project Buildings */}
        <Buildings projects={projects} activeProjectZoneId={activeProjectZoneId} />
      </group>

      {/* 6. Skills Zone (Physically Knockable Blocks) */}
      <group>
        {/* Ring boundary for skills zone */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[ZONES.skills.x, 0.02, ZONES.skills.z]}>
          <ringGeometry args={[ZONES.skills.radius - 0.3, ZONES.skills.radius, 32]} />
          <meshBasicMaterial color="#7c3aed" toneMapped={false} opacity={0.15} transparent />
        </mesh>
        
        <Text
          position={[ZONES.skills.x, 4.0, ZONES.skills.z]}
          fontSize={0.6}
          color="#7c3aed"
        >
          SKILLS
        </Text>
        
        <Text
          position={[ZONES.skills.x, 3.4, ZONES.skills.z]}
          fontSize={0.16}
          color="#6b7280"
        >
          Smash the blocks to test the physics!
        </Text>

        {/* Dynamic Skill Cubes */}
        {skillCubesList.map((cube: SkillCubeState, index: number) => (
          <SkillCube key={cube.id} index={index} name={cube.name} size={cube.size} />
        ))}
      </group>

      {/* 7. Resume Zone (Pedestal + Floating doc) */}
      <group position={[ZONES.resume.x, 0, ZONES.resume.z]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[ZONES.resume.radius - 0.2, ZONES.resume.radius, 24]} />
          <meshBasicMaterial color="#7c3aed" toneMapped={false} />
        </mesh>

        {/* Pedestal */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.6, 0.8, 1.0, 8]} />
          <meshStandardMaterial color="#f3f4f6" roughness={0.3} metalness={0.2} />
        </mesh>
        <mesh position={[0, 1.02, 0]}>
          <torusGeometry args={[0.6, 0.05, 8, 16]} />
          <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={1.5} toneMapped={false} />
        </mesh>

        {/* Floating Rotating Document */}
        <group ref={resumeRef} position={[0, 1.8, 0]}>
          {/* Main Paper Sheet */}
          <mesh castShadow>
            <boxGeometry args={[0.7, 0.9, 0.06]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
          {/* Neon outline around document */}
          <mesh>
            <boxGeometry args={[0.74, 0.94, 0.07]} />
            <meshBasicMaterial color="#7c3aed" wireframe toneMapped={false} />
          </mesh>
          {/* Graphic lines on the document */}
          <mesh position={[0, 0.25, 0.035]}>
            <boxGeometry args={[0.4, 0.04, 0.005]} />
            <meshBasicMaterial color="#7c3aed" />
          </mesh>
          <mesh position={[0, 0.1, 0.035]}>
            <boxGeometry args={[0.5, 0.03, 0.005]} />
            <meshBasicMaterial color="#a855f7" />
          </mesh>
          <mesh position={[0, -0.05, 0.035]}>
            <boxGeometry args={[0.5, 0.03, 0.005]} />
            <meshBasicMaterial color="#a855f7" />
          </mesh>
          <mesh position={[0, -0.2, 0.035]}>
            <boxGeometry args={[0.5, 0.03, 0.005]} />
            <meshBasicMaterial color="#a855f7" />
          </mesh>
        </group>

        <Text
          position={[0, 2.8, 0]}
          fontSize={0.4}
          color="#7c3aed"
        >
          RESUME
        </Text>
        <Text
          position={[0, 0.1, 1.8]}
          fontSize={0.16}
          color="#6b7280"
          anchorY="middle"
        >
          Drive over pedestal to download
        </Text>
      </group>

      {/* 8. Contact Zone (Telephone booth portal) */}
      <group position={[ZONES.contact.x, 0, ZONES.contact.z]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[ZONES.contact.radius - 0.2, ZONES.contact.radius, 24]} />
          <meshBasicMaterial color="#7c3aed" toneMapped={false} />
        </mesh>

        {/* Sci Fi Telephone booth frame */}
        <mesh position={[0, 1.8, 0]} castShadow>
          <boxGeometry args={[1.5, 3.6, 1.5]} />
          <meshStandardMaterial color="#d1d5db" roughness={0.5} wireframe />
        </mesh>
        
        {/* Holographic Glowing Sphere inside */}
        <group ref={portalRef} position={[0, 1.8, 0]}>
          <mesh>
            <octahedronGeometry args={[0.7, 1]} />
            <meshBasicMaterial color="#7c3aed" wireframe toneMapped={false} transparent opacity={0.8} />
          </mesh>
          <mesh scale={[0.7, 0.7, 0.7]}>
            <octahedronGeometry args={[0.7, 1]} />
            <meshStandardMaterial 
              color="#7c3aed" 
              emissive="#7c3aed" 
              emissiveIntensity={1.5} 
              toneMapped={false} 
              transparent 
              opacity={0.4} 
            />
          </mesh>
        </group>

        <Text
          position={[0, 4.0, 0]}
          fontSize={0.4}
          color="#7c3aed"
        >
          CONTACT
        </Text>
        <Text
          position={[0, 0.1, 1.8]}
          fontSize={0.16}
          color="#6b7280"
        >
          {currentZone === 'contact' ? 'Press ENTER to write message' : 'Drive in to connect'}
        </Text>
      </group>
    </group>
  );
};

// SkillCube component linked to global physics indices
const SkillCube: React.FC<{ index: number; name: string; size: number }> = ({ index, name, size }) => {
  const groupRef = useRef<Group>(null);
  
  // Set position/rotation in 3D scene from our physics registry
  useFrame(() => {
    const cube = skillCubesList[index];
    if (groupRef.current && cube) {
      groupRef.current.position.copy(cube.pos);
      groupRef.current.rotation.set(cube.rot.x, cube.rot.y, cube.rot.z);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Box Mesh */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial color="#f3f4f6" roughness={0.2} metalness={0.1} />
      </mesh>
      
      {/* Glowing Neon Outline */}
      <mesh>
        <boxGeometry args={[size * 1.02, size * 1.02, size * 1.02]} />
        <meshBasicMaterial color="#a855f7" wireframe toneMapped={false} opacity={0.65} transparent />
      </mesh>

      {/* Label on multiple sides of cube */}
      <Text
        position={[0, 0, size / 2 + 0.01]}
        fontSize={0.18}
        color="#0f172a"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
      <Text
        position={[0, 0, -size / 2 - 0.01]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.18}
        color="#0f172a"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
      <Text
        position={[size / 2 + 0.01, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.18}
        color="#0f172a"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
      <Text
        position={[-size / 2 - 0.01, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        fontSize={0.18}
        color="#0f172a"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </group>
  );
};
