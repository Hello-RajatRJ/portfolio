import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { findTechMeta, type TechMetadata } from '../../data/techRegistry';
import { FloatingTechIcon } from './FloatingTechIcon';
import type { PointerScreenState } from './hoverMath';

interface SkillItem {
  name: string;
  level: number;
  category: string;
  icon: string;
}

interface TechIconGroupProps {
  skillsList: SkillItem[];
  slotElementsRef: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  scanTimestampsRef: React.MutableRefObject<Record<string, number>>;
  pointerRef: React.MutableRefObject<PointerScreenState>;
  hoveredSkillName: string | null;
  selectedTech: TechMetadata | null;
  sectionActive: boolean;
  reducedMotion: boolean;
}

const SPOTLIGHT_DUST_COUNT = 26;

const SpotlightDustField: React.FC<{ active: boolean; reducedMotion: boolean }> = ({
  active,
  reducedMotion,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial | null>(null);
  const geoRef = useRef<THREE.BufferGeometry | null>(null);
  const fadeRef = useRef(0);

  useEffect(() => {
    const pts = pointsRef.current;
    if (!pts) return;

    const positions = new Float32Array(SPOTLIGHT_DUST_COUNT * 3);
    for (let i = 0; i < SPOTLIGHT_DUST_COUNT; i++) {
      const a = (i / SPOTLIGHT_DUST_COUNT) * Math.PI * 2;
      const r = 1.4 + ((i * 37) % 100) / 45;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = (((i * 53) % 100) / 100 - 0.5) * 3.2;
      positions[i * 3 + 2] = 2.0 + ((i * 19) % 100) / 40;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: '#FF3038',
      size: 0.055,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    pts.geometry = geo;
    pts.material = mat;
    geoRef.current = geo;
    matRef.current = mat;

    return () => {
      geo.dispose();
      mat.dispose();
      geoRef.current = null;
      matRef.current = null;
    };
  }, []);

  useFrame((state, delta) => {
    const pts = pointsRef.current;
    const mat = matRef.current;
    if (!pts || !mat) return;

    const dt = Math.min(delta, 0.05);
    fadeRef.current = THREE.MathUtils.damp(fadeRef.current, active ? 1 : 0, 8, dt);

    if (fadeRef.current < 0.02) {
      pts.visible = false;
      return;
    }
    pts.visible = true;
    mat.opacity = 0.52 * fadeRef.current;
    const isDesktop = state.size.width >= 768;
    pts.position.x = isDesktop ? -1.9 : 0;
    pts.position.y = isDesktop ? 0.1 : 1.6;
    if (!reducedMotion) {
      pts.rotation.y += dt * 0.18;
      pts.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
    }
  });

  return <points ref={pointsRef} visible={false} />;
};

export const TechIconGroup: React.FC<TechIconGroupProps> = ({
  skillsList,
  slotElementsRef,
  scanTimestampsRef,
  pointerRef,
  hoveredSkillName,
  selectedTech,
  sectionActive,
  reducedMotion,
}) => {
  const { gl } = useThree();
  const canvasRectRef = useRef<DOMRect | null>(null);
  const rimLightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    canvasRectRef.current = gl.domElement.getBoundingClientRect();
    if (rimLightRef.current && !reducedMotion) {
      const t = clock.elapsedTime;
      rimLightRef.current.position.x = -5 + Math.sin(t * 0.55) * 1.6;
      rimLightRef.current.position.y = -2 + Math.cos(t * 0.45) * 1.4;
    }
  });

  const gridSkillNames = new Set(skillsList.map((s) => s.name));
  const selectedIsInGrid = selectedTech ? gridSkillNames.has(selectedTech.name) : false;

  return (
    <>
      <ambientLight intensity={0.48} color="#fff5f5" />
      <directionalLight position={[4, 7, 10]} intensity={1.9} color="#ffffff" />
      <directionalLight position={[-6, -3, 6]} intensity={0.95} color="#fca5a5" />
      <pointLight
        ref={rimLightRef}
        position={[-5, -2, 7]}
        intensity={2.8}
        distance={36}
        color="#FF3038"
      />
      <pointLight position={[6, 4, -4]} intensity={1.9} distance={34} color="#C91520" />

      {/* Offline procedural studio reflection cubemap (renders once on mount at 64px) */}
      <Environment resolution={64} frames={1}>
        <Lightformer
          form="rect"
          intensity={2.4}
          color="#ffffff"
          position={[0, 5, 5]}
          scale={[10, 3, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={2.8}
          color="#FF3038"
          position={[-6, -2, 4]}
          scale={[5, 8, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.6}
          color="#C91520"
          position={[6, 2, -4]}
          scale={[6, 6, 1]}
          target={[0, 0, 0]}
        />
      </Environment>

      <SpotlightDustField active={Boolean(selectedTech)} reducedMotion={reducedMotion} />

      {skillsList.map((skill) => {
        const meta = findTechMeta(skill.name);
        const isSelected = Boolean(selectedTech && selectedTech.id === meta.id && selectedIsInGrid);
        const isHovered = hoveredSkillName === skill.name;

        return (
          <FloatingTechIcon
            key={skill.name}
            skillName={skill.name}
            tech={meta}
            slotElementsRef={slotElementsRef}
            scanTimestampsRef={scanTimestampsRef}
            canvasRectRef={canvasRectRef}
            pointerRef={pointerRef}
            isHovered={isHovered}
            isSelected={isSelected}
            anySelected={Boolean(selectedTech)}
            sectionActive={sectionActive}
            reducedMotion={reducedMotion}
          />
        );
      })}

      {/* Standalone 3D spotlight artifact if user inspects an extra tech (e.g. Express.js) via panel */}
      {selectedTech && !selectedIsInGrid && (
        <FloatingTechIcon
          key={`standalone-${selectedTech.id}`}
          skillName={selectedTech.name}
          tech={selectedTech}
          slotElementsRef={slotElementsRef}
          scanTimestampsRef={scanTimestampsRef}
          canvasRectRef={canvasRectRef}
          pointerRef={pointerRef}
          isHovered={false}
          isSelected
          anySelected
          isSpotlightStandalone
          sectionActive
          reducedMotion={reducedMotion}
        />
      )}
    </>
  );
};
