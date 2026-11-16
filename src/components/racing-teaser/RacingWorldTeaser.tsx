import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useScroll } from 'framer-motion';
import { Gauge, Play, Trophy } from 'lucide-react';
import { useStore } from '../../store/useStore';

/* ─── Procedural Canvas Texture for Cyberpunk Billboard ─── */
function createBillboardTexture(title: string, subtitle: string, color: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();

  // Background Glass Slab
  ctx.fillStyle = '#07070a';
  ctx.fillRect(0, 0, 512, 160);

  // Border with Neon Glow
  ctx.strokeStyle = color;
  ctx.lineWidth = 8;
  ctx.strokeRect(6, 6, 500, 148);

  // Corner Accents
  ctx.fillStyle = color;
  ctx.fillRect(6, 6, 24, 24);
  ctx.fillRect(482, 6, 24, 24);

  // Text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 38px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, 256, 65);

  ctx.fillStyle = color;
  ctx.font = 'bold 18px monospace';
  ctx.fillText(subtitle, 256, 115);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

const LANDMARK_CONFIGS = [
  { name: 'CERETAX', tag: 'FINTECH ZONE', x: -5.8, initialZ: -12, h: 5.5, w: 2.4, color: '#FF2D2D' },
  { name: 'KNOWLEDGHER', tag: 'AI RAG VECTOR ZONE', x: 5.8, initialZ: -28, h: 6.2, w: 2.6, color: '#E62429' },
  { name: 'EBMCI TAIWAN', tag: 'HEALTHCARE CLUSTER', x: -5.8, initialZ: -44, h: 5.0, w: 2.2, color: '#FF2D2D' },
  { name: 'WESELL RESTAURANTS', tag: 'COMMERCE ZONE', x: 5.8, initialZ: -60, h: 5.4, w: 2.4, color: '#E62429' },
  { name: 'RESUME PEDESTAL', tag: 'NORTHWEST ZONE', x: -5.8, initialZ: -76, h: 6.6, w: 2.6, color: '#FFD700' },
];

/* ─── 3D Neon Speedway & Stylized Racing Car ─── */
const SpeedwayScene: React.FC<{ scrollProgress: number }> = ({ scrollProgress }) => {
  const roadGridRef = useRef<THREE.GridHelper>(null);
  const carGroupRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Mesh[]>([]);
  const speedLinesRef = useRef<THREE.LineSegments>(null);
  const landmarksRef = useRef<THREE.Group[]>([]);

  // Pre-generate textures for landmark billboards
  const landmarkTextures = useMemo(() => {
    return LANDMARK_CONFIGS.map((c) => createBillboardTexture(c.name, c.tag, c.color));
  }, []);

  // Animate road grid, wheels, and floating landmark buildings streaming past
  useFrame((_, delta) => {
    const speed = 2.4 + scrollProgress * 7.5;

    if (roadGridRef.current) {
      roadGridRef.current.position.z = (roadGridRef.current.position.z + delta * speed * 4) % 10;
    }

    if (speedLinesRef.current) {
      const positions = speedLinesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 2; i < positions.length; i += 3) {
        positions[i] += delta * speed * 12;
        if (positions[i] > 15) {
          positions[i] = -45;
        }
      }
      speedLinesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Move floating landmark buildings backward
    landmarksRef.current.forEach((grp) => {
      if (!grp) return;
      grp.position.z += delta * speed * 5;
      if (grp.position.z > 14) {
        grp.position.z -= 80;
      }
    });

    wheelsRef.current.forEach((wheel) => {
      if (wheel) wheel.rotation.x += delta * speed * 5;
    });

    if (carGroupRef.current) {
      carGroupRef.current.position.y = Math.sin(Date.now() * 0.008) * 0.04;
    }
  });

  return (
    <group position={[0, -0.6, 0]}>
      {/* 1. Infinite Neon Road Grid */}
      <gridHelper
        ref={roadGridRef}
        args={[100, 50, '#FF2D2D', '#8B0000']}
        position={[0, -0.2, 0]}
      />

      {/* 2. Neon Red Speedway Side Laser Curbs */}
      <mesh position={[-4.5, 0, 0]}>
        <boxGeometry args={[0.15, 0.2, 100]} />
        <meshBasicMaterial color="#FF2D2D" />
      </mesh>
      <mesh position={[4.5, 0, 0]}>
        <boxGeometry args={[0.15, 0.2, 100]} />
        <meshBasicMaterial color="#FF2D2D" />
      </mesh>

      {/* 3. Floating Project Landmark Buildings Streaming Past */}
      {LANDMARK_CONFIGS.map((config, idx) => (
        <group
          key={config.name}
          ref={(el) => {
            if (el) landmarksRef.current[idx] = el;
          }}
          position={[config.x, 0, config.initialZ]}
        >
          {/* Main Monolith Building Body */}
          <mesh position={[0, config.h / 2, 0]}>
            <boxGeometry args={[config.w, config.h, config.w]} />
            <meshStandardMaterial color="#0b0b0e" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Glowing Top Laser Crown */}
          <mesh position={[0, config.h + 0.05, 0]}>
            <boxGeometry args={[config.w * 1.05, 0.1, config.w * 1.05]} />
            <meshBasicMaterial color={config.color} />
          </mesh>

          {/* Billboard Sign facing road */}
          <mesh
            position={[config.x > 0 ? -config.w / 2 - 0.05 : config.w / 2 + 0.05, config.h * 0.65, 0]}
            rotation={[0, config.x > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}
          >
            <planeGeometry args={[config.w * 0.95, 0.75]} />
            <meshBasicMaterial map={landmarkTextures[idx]} transparent />
          </mesh>

          {/* Ground Neon Halo */}
          <pointLight position={[0, 0.5, 0]} color={config.color} intensity={2.2} distance={4} />
        </group>
      ))}

      {/* 4. Speed Lines Streaming Backward */}
      <lineSegments ref={speedLinesRef}>
        <bufferGeometry
          onUpdate={(geo) => {
            const count = 70;
            const positions = new Float32Array(count * 6);
            for (let i = 0; i < count; i++) {
              const x = (Math.random() - 0.5) * 16;
              const y = Math.random() * 4 - 0.2;
              const z = Math.random() * -60;
              positions[i * 6] = x;
              positions[i * 6 + 1] = y;
              positions[i * 6 + 2] = z;
              positions[i * 6 + 3] = x;
              positions[i * 6 + 4] = y;
              positions[i * 6 + 5] = z + 2.5;
            }
            geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
          }}
        />
        <lineBasicMaterial color="#FF2D2D" transparent opacity={0.65} />
      </lineSegments>

      {/* 5. Stylized Futuristic Low-Poly Cyber Car */}
      <group ref={carGroupRef} position={[0, 0.4, 2.5]}>
        {/* Chassis Lower Hull */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[1.6, 0.35, 3.4]} />
          <meshStandardMaterial color="#0A0A0A" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Hood & Cabin Shell */}
        <mesh position={[0, 0.5, -0.2]}>
          <boxGeometry args={[1.2, 0.4, 1.8]} />
          <meshStandardMaterial color="#E62429" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Windshield */}
        <mesh position={[0, 0.6, 0.6]} rotation={[0.4, 0, 0]}>
          <planeGeometry args={[1.05, 0.5]} />
          <meshBasicMaterial color="#111111" />
        </mesh>

        {/* Headlights (Crimson Neon) */}
        <mesh position={[-0.55, 0.22, 1.71]}>
          <boxGeometry args={[0.25, 0.08, 0.05]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0.55, 0.22, 1.71]}>
          <boxGeometry args={[0.25, 0.08, 0.05]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>

        {/* Taillights (Neon Red Glow Bar) */}
        <mesh position={[0, 0.32, -1.71]}>
          <boxGeometry args={[1.35, 0.08, 0.05]} />
          <meshBasicMaterial color="#FF2D2D" />
        </mesh>

        {/* Neon Undercar Glow */}
        <pointLight position={[0, -0.1, 0]} color="#FF2D2D" intensity={4} distance={3.5} />

        {/* Wheels */}
        {[
          [-0.85, 0, 1.0],
          [0.85, 0, 1.0],
          [-0.85, 0, -1.0],
          [0.85, 0, -1.0],
        ].map((pos, idx) => (
          <mesh
            key={idx}
            ref={(el) => {
              if (el) wheelsRef.current[idx] = el;
            }}
            position={pos as [number, number, number]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.3, 0.3, 0.25, 16]} />
            <meshStandardMaterial color="#161616" roughness={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

export const RacingWorldTeaser: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const launchGame = useStore((s) => s.launchGame);
  const [isInView, setIsInView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: '200px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Scroll progress for dynamic speedup
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const [scrollFactor, setScrollFactor] = useState(0);

  scrollYProgress.on('change', (v) => setScrollFactor(v));

  // Speedometer counter
  const speedDisplay = Math.min(185, Math.floor(45 + scrollFactor * 140));

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[85vh] py-20 bg-[#050505] overflow-hidden flex flex-col justify-between select-none border-t border-white/[0.04]"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-radial from-[#8B0000]/10 via-transparent to-[#050505] pointer-events-none" />

      {/* Header Info */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="h-[1px] w-6 bg-[#E62429]" />
          <span className="font-mono text-xs font-semibold tracking-[0.25em] text-[#E62429] uppercase">
            06 // INTERACTIVE 3D ENVIRONMENT
          </span>
          <span className="h-[1px] w-6 bg-[#E62429]" />
        </div>

        <h2 className="font-orbitron text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight uppercase">
          ENTER THE <span className="text-[#E62429] drop-shadow-[0_0_25px_rgba(230,36,41,0.6)]">3D RACING WORLD</span>
        </h2>

        <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base font-inter text-neutral-300">
          Drive through an interactive miniature cyberpunk metropolis. Navigate between project
          districts, inspect systems in real-time 3D, and uncover hidden objectives.
        </p>

        {/* Side Quest Callout */}
        <div className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-[#0D0D0D] px-5 py-2 font-mono text-xs text-neutral-200 shadow-lg">
          <Trophy className="h-4 w-4 text-[#FFD700]" />
          <span className="font-orbitron font-bold text-white">INTERACTIVE OBJECTIVE:</span>
          <span className="text-neutral-300">
            Drive to the <span className="text-[#FF2D2D] font-bold">Northwest Zone</span> to uncover the 3D Resume Pedestal.
          </span>
        </div>
      </div>

      {/* 3D Scene Viewport with Lazy-Mounting & DPR cap */}
      <div
        data-cursor-drive="true"
        className="relative h-[360px] sm:h-[440px] w-full my-6 cursor-grab active:cursor-grabbing"
      >
        {isInView && !isMobile ? (
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 2.5, 6.8], fov: 48 }}
            gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
            style={{ background: 'transparent' }}
          >
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 10, 5]} intensity={1.5} color="#FFFFFF" />
            <pointLight position={[0, 4, 2]} intensity={2.5} color="#FF2D2D" />
            <SpeedwayScene scrollProgress={scrollFactor} />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              maxPolarAngle={Math.PI / 2.1}
              minPolarAngle={Math.PI / 3.5}
              maxAzimuthAngle={Math.PI / 4}
              minAzimuthAngle={-Math.PI / 4}
              dampingFactor={0.05}
            />
          </Canvas>
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-[#0D0D0D] rounded-xl border border-white/10 mx-auto max-w-4xl p-6 text-center">
            <div>
              <Gauge className="h-10 w-10 text-[#FF2D2D] mx-auto mb-3" />
              <p className="font-orbitron text-sm text-neutral-300 uppercase tracking-wider">
                Interactive 3D Engine Ready
              </p>
              <p className="font-mono text-xs text-neutral-500 mt-1">
                Tap 'START ENGINE' below to load the full 3D simulation
              </p>
            </div>
          </div>
        )}

        {/* Drag Hint */}
        {!isMobile && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/70 border border-white/10 px-4 py-1 font-mono text-[11px] text-neutral-400 backdrop-blur-sm pointer-events-none">
            DRAG TO LOOK AROUND · SCROLL TO ACCELERATE
          </div>
        )}

        {/* Speedometer HUD Display */}
        <div className="absolute top-4 right-4 sm:right-10 flex items-center gap-3 rounded-xl bg-[#0D0D0D]/90 border border-[#E62429]/50 px-4 py-2 shadow-lg backdrop-blur-md pointer-events-none">
          <Gauge className="h-5 w-5 text-[#FF2D2D] animate-pulse" />
          <div className="text-left font-orbitron">
            <span className="text-lg sm:text-xl font-black text-white">{speedDisplay}</span>
            <span className="text-[10px] text-[#FF2D2D] font-mono ml-1 font-bold">MPH</span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="relative z-10 text-center">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={launchGame}
          id="teaser-start-engine-btn"
          className="relative inline-flex items-center gap-2.5 rounded-xl px-8 py-3.5 font-orbitron text-xs sm:text-sm font-bold tracking-wider text-white shadow-xl cursor-pointer border border-[#FF2D2D]/60"
          style={{
            background: 'linear-gradient(135deg, #E62429 0%, #8B0000 100%)',
            boxShadow: '0 0 25px rgba(230,36,41,0.5)',
          }}
        >
          <Play className="h-4 w-4 fill-white text-white" />
          START ENGINE
        </motion.button>
        <span className="block mt-2 font-mono text-[11px] tracking-wider text-neutral-400 uppercase">
          Three.js · Cannon Physics · 60 FPS
        </span>
      </div>
    </section>
  );
};
