import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';

const CORE_SKILLS = [
  { name: 'React 19', color: '#61DAFB' },
  { name: 'Node.js', color: '#68A063' },
  { name: 'Three.js', color: '#FFFFFF' },
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'Next.js', color: '#FFFFFF' },
  { name: 'PostgreSQL', color: '#336791' },
  { name: 'Docker', color: '#2496ED' },
  { name: 'GSAP', color: '#0AE448' },
  { name: 'Tailwind', color: '#38B2AC' },
  { name: 'MongoDB', color: '#47A248' },
  { name: 'WebGL', color: '#FF2D2D' },
  { name: 'Git', color: '#F05032' },
];

interface OrbContentProps {
  onHoverSkill: (name: string | null) => void;
}

const OrbSphereGroup: React.FC<OrbContentProps> = ({ onHoverSkill }) => {
  const groupRef = useRef<THREE.Group>(null);
  const isHoveredRef = useRef(false);

  // Distribute skills evenly on a spherical surface using Fibonacci sphere algorithm
  const skillNodes = useMemo(() => {
    const nodes = [];
    const radius = 3.6;
    const count = CORE_SKILLS.length;
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      nodes.push({
        ...CORE_SKILLS[i],
        position: [x * radius, y * radius, z * radius] as [number, number, number],
      });
    }
    return nodes;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // Slow down rotation if hovered
    const speed = isHoveredRef.current ? 0.08 : 0.32;
    groupRef.current.rotation.y += delta * speed;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
  });

  return (
    <group ref={groupRef}>
      {/* Central Deadpool Crimson Core Wireframe Sphere */}
      <mesh>
        <sphereGeometry args={[2.2, 18, 18]} />
        <meshBasicMaterial
          color="#E62429"
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Inner Glowing Node */}
      <mesh>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial color="#FF2D2D" transparent opacity={0.2} />
      </mesh>

      {/* Floating Skill Labels */}
      {skillNodes.map((skill) => (
        <group key={skill.name} position={skill.position}>
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <Html center distanceFactor={12}>
              <div
                onMouseEnter={() => {
                  isHoveredRef.current = true;
                  onHoverSkill(skill.name);
                }}
                onMouseLeave={() => {
                  isHoveredRef.current = false;
                  onHoverSkill(null);
                }}
                className="group cursor-pointer select-none whitespace-nowrap rounded-lg border border-[#E62429]/60 bg-black/80 px-2.5 py-1 text-center font-orbitron text-xs font-bold text-white shadow-[0_0_12px_rgba(230,36,41,0.5)] backdrop-blur-sm transition-all duration-300 hover:scale-125 hover:border-[#FF2D2D] hover:bg-[#E62429] hover:shadow-[0_0_20px_#FF2D2D]"
              >
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF2D2D]" />
                  {skill.name}
                </span>
              </div>
            </Html>
          </Float>
        </group>
      ))}
    </group>
  );
};

export const DeadpoolSkillOrb: React.FC = () => {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  return (
    <div className="relative mx-auto h-[340px] sm:h-[420px] w-full max-w-2xl select-none">
      {/* Active Skill Overlay Callout */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center">
        <span className="inline-block font-bangers text-xl sm:text-2xl tracking-widest text-[#FF2D2D] drop-shadow-[0_0_8px_#E62429]">
          {activeSkill ? `⚔️ ${activeSkill.toUpperCase()}` : '⚔️ INTERACTIVE TECH SPHERE (DRAG / HOVER)'}
        </span>
      </div>

      <Canvas
        camera={{ position: [0, 0, 9.5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#FF2D2D" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#E62429" />
        <OrbSphereGroup onHoverSkill={setActiveSkill} />
      </Canvas>
    </div>
  );
};
