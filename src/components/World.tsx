import React, { useRef, Suspense, lazy } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Group } from 'three';
import { skillCubesList, initSkillCubes } from './CarState';
import type { SkillCubeState } from './CarState';
import { HotWheelsSky } from './world/HotWheelsSky';
import { MiniatureCity } from './world/MiniatureCity';
import { ProjectBuildings } from './world/ProjectBuildings';
import { PortfolioLandmarks } from './world/PortfolioLandmarks';
import { RedHotWheelsTrack } from './world/RedHotWheelsTrack';
import { BowlingAlley } from './world/BowlingAlley';
import { HotWheelsArch } from './world/HotWheelsArch';
import { GasStation } from './world/GasStation';
import { GarageBuilding } from './world/GarageBuilding';
import { Roads } from './world/Roads';
import { CanvasErrorBoundary } from './CanvasErrorBoundary';
import type { Project, GameMode } from '../types';

const AIFactory = lazy(() => import('./world/ai-factory/AIFactory'));

const CUBE_COLORS = ['#00f0ff', '#f97316', '#ffd700', '#22c55e', '#ec4899', '#38bdf8', '#a855f7', '#ef4444'];
initSkillCubes();

// ─── 3D INTERACTIVE SKILL CUBES RENDERER ──────────────────────────────────────
const InteractiveSkillCubes: React.FC = () => {
  const cubesGroupRef = useRef<Group>(null);
  const wasMovingRef = useRef(true);

  useFrame(() => {
    if (!cubesGroupRef.current) return;
    const isMoving = skillCubesList.some(
      (c) => Math.abs(c.vel.x) > 0.01 || Math.abs(c.vel.y) > 0.01 || Math.abs(c.vel.z) > 0.01
    );

    // Only update transforms when cubes are moving or for one final frame after settling
    if (isMoving || wasMovingRef.current) {
      skillCubesList.forEach((cube, i) => {
        const mesh = cubesGroupRef.current?.children[i] as Group;
        if (mesh) {
          mesh.position.set(cube.pos.x, cube.pos.y, cube.pos.z);
          mesh.rotation.set(cube.rot.x, cube.rot.y, cube.rot.z);
        }
      });
    }
    wasMovingRef.current = isMoving;
  });

  return (
    <group ref={cubesGroupRef}>
      {skillCubesList.map((cube, i) => {
        const color = CUBE_COLORS[i % CUBE_COLORS.length];
        const half = cube.size / 2;
        return (
          <group key={cube.id} position={[cube.pos.x, cube.pos.y, cube.pos.z]}>
            {/* Main Cube Body */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[cube.size, cube.size, cube.size]} />
              <meshStandardMaterial
                color="#0f0507"
                roughness={0.15}
                metalness={0.85}
              />
            </mesh>

            {/* Glowing Wireframe Border */}
            <mesh>
              <boxGeometry args={[cube.size * 1.02, cube.size * 1.02, cube.size * 1.02]} />
              <meshBasicMaterial color={color} wireframe toneMapped={false} />
            </mesh>

            {/* Text on Front (+Z) */}
            <Text
              position={[0, 0, half + 0.02]}
              fontSize={0.34}
              color="#ffffff"
              outlineWidth={0.055}
              outlineColor="#000000"
              outlineOpacity={1}
              anchorX="center"
              anchorY="middle"
            >
              {cube.name}
            </Text>

            {/* Text on Back (-Z) */}
            <Text
              position={[0, 0, -half - 0.02]}
              rotation={[0, Math.PI, 0]}
              fontSize={0.34}
              color="#ffffff"
              outlineWidth={0.055}
              outlineColor="#000000"
              outlineOpacity={1}
              anchorX="center"
              anchorY="middle"
            >
              {cube.name}
            </Text>

            {/* Text on Right (+X) */}
            <Text
              position={[half + 0.02, 0, 0]}
              rotation={[0, Math.PI / 2, 0]}
              fontSize={0.34}
              color="#ffffff"
              outlineWidth={0.055}
              outlineColor="#000000"
              outlineOpacity={1}
              anchorX="center"
              anchorY="middle"
            >
              {cube.name}
            </Text>

            {/* Text on Left (-X) */}
            <Text
              position={[-half - 0.02, 0, 0]}
              rotation={[0, -Math.PI / 2, 0]}
              fontSize={0.34}
              color="#ffffff"
              outlineWidth={0.055}
              outlineColor="#000000"
              outlineOpacity={1}
              anchorX="center"
              anchorY="middle"
            >
              {cube.name}
            </Text>

            {/* Top (+Y) */}
            <Text
              position={[0, half + 0.02, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.34}
              color="#fde047"
              outlineWidth={0.055}
              outlineColor="#000000"
              outlineOpacity={1}
              anchorX="center"
              anchorY="middle"
            >
              {cube.name}
            </Text>
          </group>
        );
      })}
    </group>
  );
};

interface WorldProps {
  projects: Project[];
  activeProjectZoneId: string | null;
  currentZone: string | null;
  gameMode?: GameMode;
  onPositionUpdate?: (pos: number, total: number) => void;
  onBowlingScoreUpdate?: (pinsDown: number, text: string) => void;
}

export const World: React.FC<WorldProps> = ({
  projects,
  activeProjectZoneId,
  onBowlingScoreUpdate,
}) => {
  // Global skill cubes physics simulation loop
  useFrame((_state, delta) => {
    const isMoving = skillCubesList.some(
      (c) => Math.abs(c.vel.x) > 0.005 || Math.abs(c.vel.y) > 0.005 || Math.abs(c.vel.z) > 0.005
    );
    if (!isMoving) return;

    const dt = Math.min(delta, 0.08);

    skillCubesList.forEach((cube: SkillCubeState) => {
      cube.pos.x += cube.vel.x * dt;
      cube.pos.y += cube.vel.y * dt;
      cube.pos.z += cube.vel.z * dt;

      if (cube.pos.y > cube.size / 2) {
        cube.vel.y -= 12 * dt;
      } else {
        cube.pos.y = cube.size / 2;
        if (Math.abs(cube.vel.y) > 0.5) {
          cube.vel.y = -cube.vel.y * 0.35;
        } else {
          cube.vel.y = 0;
        }
        cube.vel.x *= 0.92;
        cube.vel.z *= 0.92;
      }

      cube.rot.x += cube.rotVel.x * dt;
      cube.rot.y += cube.rotVel.y * dt;
      cube.rot.z += cube.rotVel.z * dt;
      cube.rotVel.x *= 0.92;
      cube.rotVel.y *= 0.92;
      cube.rotVel.z *= 0.92;

      // Keep cubes in boundary
      const limit = 60.0;
      if (Math.abs(cube.pos.x) > limit) cube.pos.x = Math.sign(cube.pos.x) * limit;
      if (Math.abs(cube.pos.z) > limit) cube.pos.z = Math.sign(cube.pos.z) * limit;
    });
  });

  return (
    <group>
      {/* ── 1. ATMOSPHERIC RED SKY DOME, BLIMP & HOT AIR BALLOON ── */}
      <HotWheelsSky />

      {/* ── 2. HIGH-GRADE OBSIDIAN ASPHALT GROUND BASE (Expanded across City + AI Factory) ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[85, -0.05, 0]} receiveShadow>
        <planeGeometry args={[520, 380]} />
        <meshStandardMaterial
          color="#111625"
          roughness={0.65}
          metalness={0.16}
          envMapIntensity={1.25}
        />
      </mesh>

      {/* ── INTERCONNECTED URBAN STREET GRID ── */}
      <Roads />

      {/* ── 3. REALISTIC MODERN CITY (Skyscrapers, wide avenues, sidewalks, architecture) ── */}
      <MiniatureCity />

      {/* ── REFUEL GAS STATION (Octane 99 Fuel & Nitro) ── */}
      <GasStation position={[26.5, 0, -18.5]} />

      {/* ── HOT WHEELS CUSTOMS GARAGE (Choose Vehicle Bay) ── */}
      <GarageBuilding position={[-36.0, 0, 19.0]} rotation={[0, Math.PI / 2, 0]} />

      {/* ── 4. PORTFOLIO PROJECTS DISTRICT (8 Dedicated Project Pavilions) ── */}
      <ProjectBuildings
        projects={projects}
        activeProjectZoneId={activeProjectZoneId}
      />

      {/* ── 5. PORTFOLIO LANDMARKS (Start line, About Me, Skills plaza, Experience, Finish line) ── */}
      <PortfolioLandmarks />

      {/* ── 6. INTERACTIVE 3D SKILL CUBES (Physics bounce & tumble) ── */}
      <InteractiveSkillCubes />

      {/* ── ICONIC HOT WHEELS OVERHEAD ARCH ── */}
      <HotWheelsArch position={[0, 0, 5.0]} />

      {/* ── 7. HOT WHEELS ELEVATED TRACKS, LOOPS & RAMPS ── */}
      <RedHotWheelsTrack />

      {/* ── 8. BOWLING CHALLENGE (Dedicated Stunt/Arena zone at x=65) ── */}
      <BowlingAlley onScoreUpdate={onBowlingScoreUpdate} />

      {/* ── 9. AI INTELLIGENCE FACTORY (15-Stage Explorable Industrial World East of Bowling) ── */}
      <CanvasErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <AIFactory />
        </Suspense>
      </CanvasErrorBoundary>
    </group>
  );
};
