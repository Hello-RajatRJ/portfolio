import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { Text, Billboard } from '@react-three/drei';
import { personal, experience } from '../../data/personalInfo';

export const PortfolioLandmarks: React.FC = () => {
  const avatarHoloRef = useRef<Group>(null);

  useFrame((_state, delta) => {
    if (avatarHoloRef.current) {
      avatarHoloRef.current.rotation.y += delta * 0.7;
    }
  });

  return (
    <group>
      {/* ── 1. ARCHITECTURAL GRAND PRIX STARTING GANTRY ── */}
      <group position={[0, 0, -4]}>
        {/* Checkered Start Line on Track */}
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6.4, 1.2]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        {/* Alternate slate black checkered squares */}
        {[-2.4, -0.8, 0.8, 2.4].map((sqX) => (
          <mesh key={`check-${sqX}`} position={[sqX, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.8, 1.2]} />
            <meshBasicMaterial color="#0b0f19" />
          </mesh>
        ))}

        {/* Left and Right Brushed Titanium Gantry Pylons */}
        {[-3.6, 3.6].map((colX) => (
          <group key={`arch-col-${colX}`} position={[colX, 0, 0]}>
            <mesh position={[0, 1.9, 0]} castShadow>
              <boxGeometry args={[0.45, 3.8, 0.45]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.15} />
            </mesh>
            {/* Cyan Status Light Conduit */}
            <mesh position={[0, 1.9, 0.24]}>
              <boxGeometry args={[0.1, 3.6, 0.04]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          </group>
        ))}

        {/* Overhead Heavy Box Truss Beam */}
        <mesh position={[0, 3.85, 0]}>
          <boxGeometry args={[8.4, 0.95, 0.65]} />
          <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Top Edge Cyan Accent Trim */}
        <mesh position={[0, 4.35, 0.34]}>
          <boxGeometry args={[8.2, 0.05, 0.02]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* 5 Formula 1 Style Starting Light Bulbs */}
        {[-1.6, -0.8, 0, 0.8, 1.6].map((lx) => (
          <group key={`start-lamp-${lx}`} position={[lx, 4.5, 0.35]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.14, 0.14, 0.1, 16]} />
              <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={2.5} />
            </mesh>
          </group>
        ))}

        {/* Gantry Front LED Banner Text */}
        <Text
          position={[0, 4.05, 0.35]}
          fontSize={0.46}
          color="#ffffff"
          outlineWidth={0.04}
          outlineColor="#000000"
          outlineOpacity={1}
          anchorX="center"
          anchorY="middle"
        >
          {personal.name.toUpperCase()}
        </Text>
        <Text
          position={[0, 3.62, 0.35]}
          fontSize={0.20}
          color="#38bdf8"
          outlineWidth={0.025}
          outlineColor="#000000"
          outlineOpacity={1}
          anchorX="center"
          anchorY="middle"
        >
          {personal.title.toUpperCase()} · GRAND PRIX SPEEDWAY
        </Text>

        {/* Reverse Side Text */}
        <Text
          position={[0, 4.05, -0.35]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.46}
          color="#ffffff"
          outlineWidth={0.04}
          outlineColor="#000000"
          outlineOpacity={1}
          anchorX="center"
          anchorY="middle"
        >
          {personal.name.toUpperCase()}
        </Text>
      </group>

      {/* ── 2. ABOUT ME LOCATION / EXECUTIVE ARCHITECTURAL PAVILION ── */}
      <group position={[6.0, 0, -4.5]} rotation={[0, -Math.PI / 4, 0]}>
        {/* Podium Base */}
        <mesh position={[0, 0.15, 0]} receiveShadow>
          <cylinderGeometry args={[2.0, 2.2, 0.3, 24]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.32, 0]}>
          <ringGeometry args={[1.85, 2.05, 32]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* Rotating Holographic Monolith */}
        <group ref={avatarHoloRef} position={[0, 1.2, 0]}>
          <mesh>
            <octahedronGeometry args={[0.55, 0]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={1.8}
              wireframe
            />
          </mesh>
        </group>

        {/* High-Visibility Camera-Facing Executive Plaque Billboard */}
        <Billboard position={[0, 2.65, 0]} follow lockX={false} lockY={false} lockZ={false}>
          {/* Cyan Perimeter Border */}
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[4.3, 1.6]} />
            <meshBasicMaterial color="#38bdf8" toneMapped={false} />
          </mesh>
          {/* Inner Dark Obsidian Board */}
          <mesh position={[0, 0, 0.025]}>
            <planeGeometry args={[4.15, 1.45]} />
            <meshBasicMaterial color="#080c16" />
          </mesh>

          {/* Header */}
          <Text
            position={[0, 0.48, 0.05]}
            fontSize={0.34}
            color="#ffffff"
            outlineWidth={0.038}
            outlineColor="#000000"
            outlineOpacity={1}
            anchorX="center"
            anchorY="middle"
          >
            RAJAT AMBEDKAR
          </Text>
          {/* Subtitle */}
          <Text
            position={[0, 0.22, 0.05]}
            fontSize={0.18}
            color="#38bdf8"
            outlineWidth={0.025}
            outlineColor="#000000"
            outlineOpacity={1}
            anchorX="center"
            anchorY="middle"
          >
            SENIOR FULL-STACK & 3D CREATIVE DEVELOPER
          </Text>
          {/* Bio text */}
          <Text
            position={[0, -0.08, 0.05]}
            fontSize={0.16}
            color="#cbd5e1"
            outlineWidth={0.022}
            outlineColor="#000000"
            outlineOpacity={1}
            maxWidth={3.8}
            lineHeight={1.25}
            anchorX="center"
            anchorY="middle"
          >
            Engineering high-performance enterprise platforms, interactive 3D WebGL, and scalable APIs.
          </Text>
          {/* Details */}
          <Text
            position={[0, -0.42, 0.05]}
            fontSize={0.15}
            color="#94a3b8"
            outlineWidth={0.022}
            outlineColor="#000000"
            outlineOpacity={1}
            anchorX="center"
            anchorY="middle"
          >
            India · 4+ Years Experience · rajatgautam179@gmail.com
          </Text>
        </Billboard>
      </group>

      {/* ── 3. CORE TECHNICAL ARSENAL OVERHEAD MARKER (Pie & Pedestal Pillars Removed for Clean Road) ── */}
      <group position={[18, 0, 0]}>
        <Billboard position={[0, 4.4, 0]} follow lockX={false} lockY={false} lockZ={false}>
          <Text
            position={[0, 0.22, 0]}
            fontSize={0.46}
            color="#ffffff"
            outlineWidth={0.048}
            outlineColor="#000000"
            outlineOpacity={1}
            anchorX="center"
            anchorY="middle"
          >
            CORE TECHNICAL ARSENAL
          </Text>
          <Text
            position={[0, -0.22, 0]}
            fontSize={0.22}
            color="#38bdf8"
            outlineWidth={0.03}
            outlineColor="#000000"
            outlineOpacity={1}
            anchorX="center"
            anchorY="middle"
          >
            SMASH SKILL CUBES · RESET ANYTIME
          </Text>
        </Billboard>
      </group>

      {/* ── 4. ENTERPRISE EXPERIENCE TOWERS ── */}
      <group position={[18, 0, 16]}>
        {experience.map((exp, idx) => {
          const exX = idx === 0 ? -2.2 : 2.2;
          return (
            <group key={exp.id} position={[exX, 0, 0]}>
              {/* Corporate Neon Tower Mass */}
              <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
                <boxGeometry args={[2.4, 3.0, 2.4]} />
                <meshStandardMaterial
                  color={exp.color}
                  emissive={exp.color}
                  emissiveIntensity={0.55}
                  roughness={0.22}
                  metalness={0.5}
                />
              </mesh>
              {/* Neon Rooftop Rim */}
              <mesh position={[0, 3.04, 0]}>
                <boxGeometry args={[2.52, 0.1, 2.52]} />
                <meshBasicMaterial color={exp.color} toneMapped={false} />
              </mesh>
              {/* Illuminated Facade Window Curtain */}
              <mesh position={[0, 1.5, 1.22]}>
                <planeGeometry args={[2.0, 2.6]} />
                <meshBasicMaterial color={exp.color} transparent opacity={0.78} toneMapped={false} />
              </mesh>
              <mesh position={[0, 1.5, -1.22]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[2.0, 2.6]} />
                <meshBasicMaterial color={exp.color} transparent opacity={0.68} toneMapped={false} />
              </mesh>

              {/* ── HIGH-VISIBILITY CAMERA-FACING COMPANY ROOFTOP BILLBOARD ── */}
              <Billboard position={[0, 3.8, 0]} follow lockX={false} lockY={false} lockZ={false}>
                {/* Glowing Company Neon Accent Border */}
                <mesh position={[0, 0, 0]}>
                  <planeGeometry args={[4.3, 1.35]} />
                  <meshBasicMaterial color={exp.color} toneMapped={false} />
                </mesh>
                {/* High-Contrast Plaque */}
                <mesh position={[0, 0, 0.02]}>
                  <planeGeometry args={[4.15, 1.22]} />
                  <meshBasicMaterial color="#080c16" />
                </mesh>

                {/* Top Accent Bar */}
                <mesh position={[0, 0.52, 0.035]}>
                  <planeGeometry args={[4.0, 0.05]} />
                  <meshBasicMaterial color="#38bdf8" />
                </mesh>

                {/* Bold Bright Company Name with Black Shadow Outline */}
                <Text
                  position={[0, 0.18, 0.05]}
                  fontSize={0.42}
                  color="#ffffff"
                  outlineWidth={0.045}
                  outlineColor="#000000"
                  outlineOpacity={1}
                  anchorX="center"
                  anchorY="middle"
                >
                  {exp.company.toUpperCase()}
                </Text>

                {/* Role and Period in Bright Cyan */}
                <Text
                  position={[0, -0.22, 0.05]}
                  fontSize={0.18}
                  color="#38bdf8"
                  outlineWidth={0.028}
                  outlineColor="#000000"
                  outlineOpacity={1}
                  anchorX="center"
                  anchorY="middle"
                >
                  {exp.role.toUpperCase()} · {exp.period}
                </Text>
              </Billboard>
            </group>
          );
        })}
      </group>

      {/* ── 5. CONTACT & FINISH LINE TIMING PORTAL ── */}
      <group position={[0, 0, 24]}>
        {/* Finish Line on ground */}
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6.4, 1.6]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* Checkered pattern */}
        {[-2.4, -0.8, 0.8, 2.4].map((fx) => (
          <mesh key={`fin-check-${fx}`} position={[fx, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.8, 1.6]} />
            <meshBasicMaterial color="#0b0f19" />
          </mesh>
        ))}

        {/* Brushed Titanium Arch Columns */}
        {[-3.6, 3.6].map((colX) => (
          <group key={`fin-col-${colX}`} position={[colX, 0, 0]}>
            <mesh position={[0, 2.1, 0]} castShadow>
              <cylinderGeometry args={[0.22, 0.32, 4.2, 16]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.15} />
            </mesh>
          </group>
        ))}

        {/* Finish Portal Header Beam */}
        <mesh position={[0, 4.2, 0]}>
          <boxGeometry args={[8.4, 0.95, 0.65]} />
          <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Clean Finish Line Banner with Black Outline */}
        <Text
          position={[0, 4.42, 0.35]}
          fontSize={0.48}
          color="#ffffff"
          outlineWidth={0.045}
          outlineColor="#000000"
          outlineOpacity={1}
          anchorX="center"
          anchorY="middle"
        >
          CIRCUIT FINISH LINE
        </Text>
        <Text
          position={[0, 3.96, 0.35]}
          fontSize={0.22}
          color="#38bdf8"
          outlineWidth={0.028}
          outlineColor="#000000"
          outlineOpacity={1}
          anchorX="center"
          anchorY="middle"
        >
          CONNECT WITH RAJAT · rajatgautam179@gmail.com
        </Text>

        {/* Reverse Side Text */}
        <Text
          position={[0, 4.42, -0.35]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.48}
          color="#ffffff"
          outlineWidth={0.045}
          outlineColor="#000000"
          outlineOpacity={1}
          anchorX="center"
          anchorY="middle"
        >
          CIRCUIT FINISH LINE
        </Text>
      </group>
    </group>
  );
};
