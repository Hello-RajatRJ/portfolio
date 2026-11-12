import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { TechMetadata } from '../../data/techRegistry';
import { getSharedEffectGeometries, instantiateTechLogoGroup } from './techLogoGeometry';
import { TechHoverInteraction } from './TechHoverInteraction';
import { computeCursorProximity, type PointerScreenState } from './hoverMath';

interface FloatingTechIconProps {
  skillName: string;
  tech: TechMetadata;
  slotElementsRef: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  scanTimestampsRef: React.MutableRefObject<Record<string, number>>;
  canvasRectRef: React.MutableRefObject<DOMRect | null>;
  pointerRef: React.MutableRefObject<PointerScreenState>;
  isHovered: boolean;
  isSelected: boolean;
  anySelected: boolean;
  isSpotlightStandalone?: boolean;
  sectionActive: boolean;
  reducedMotion: boolean;
}

function wrapAngle(a: number): number {
  let res = a % (Math.PI * 2);
  if (res > Math.PI) res -= Math.PI * 2;
  if (res < -Math.PI) res += Math.PI * 2;
  return res;
}

function dampAngle(current: number, target: number, lambda: number, dt: number): number {
  const diff = Math.atan2(Math.sin(target - current), Math.cos(target - current));
  return current + diff * (1 - Math.exp(-lambda * dt));
}

export const FloatingTechIcon: React.FC<FloatingTechIconProps> = ({
  skillName,
  tech,
  slotElementsRef,
  scanTimestampsRef,
  canvasRectRef,
  pointerRef,
  isHovered,
  isSelected,
  anySelected,
  isSpotlightStandalone = false,
  sectionActive,
  reducedMotion,
}) => {
  const outerGroupRef = useRef<THREE.Group>(null);
  const logoAnchorRef = useRef<THREE.Group>(null);
  const logoMatsRef = useRef<THREE.MeshPhysicalMaterial[]>([]);
  const shadowMeshRef = useRef<THREE.Mesh | null>(null);
  const shadowMatRef = useRef<THREE.MeshBasicMaterial | null>(null);

  const hoverIntensityRef = useRef(0);
  const selectedIntensityRef = useRef(isSpotlightStandalone ? 1 : 0);

  const stateRef = useRef({
    initialized: false,
    posX: 0,
    posY: 0,
    posZ: 0,
    scale: isSpotlightStandalone ? 0.01 : 1,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    idleRotY: (tech.motion.phase % (Math.PI * 2)) - Math.PI,
    idlePhase: tech.motion.phase,
    fadeOpacity: isSpotlightStandalone ? 0 : 1,
    streakBoost: 0,
  });

  useEffect(() => {
    const logoHost = logoAnchorRef.current;
    const outer = outerGroupRef.current;
    if (!logoHost || !outer) return;

    const { group, materials, dispose } = instantiateTechLogoGroup(tech);
    logoMatsRef.current = materials;
    logoHost.add(group);

    // Subtle soft ground shadow behind floating artifact
    const { shadowGeo, shadowTex } = getSharedEffectGeometries();
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex ?? null,
      transparent: true,
      opacity: 0.48,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.set(0.03, -0.09, -0.34);
    outer.add(shadowMesh);

    shadowMeshRef.current = shadowMesh;
    shadowMatRef.current = shadowMat;

    return () => {
      logoHost.remove(group);
      outer.remove(shadowMesh);
      logoMatsRef.current = [];
      shadowMeshRef.current = null;
      shadowMatRef.current = null;
      shadowMat.dispose();
      dispose();
    };
  }, [tech]);

  useFrame((rootState, delta) => {
    const outer = outerGroupRef.current;
    const logoHost = logoAnchorRef.current;
    if (!outer || !logoHost) return;

    if (!sectionActive && !isSelected) {
      outer.visible = false;
      return;
    }

    const canvasRect = canvasRectRef.current;
    const cam = rootState.camera;
    if (!canvasRect || canvasRect.width === 0 || canvasRect.height === 0) return;
    if (!(cam instanceof THREE.PerspectiveCamera)) return;

    const dt = Math.min(delta, 0.05);
    const s = stateRef.current;
    const t = rootState.clock.elapsedTime;
    const motion = tech.motion;

    // World metrics on Z=0 plane
    const fovRad = THREE.MathUtils.degToRad(cam.fov * 0.5);
    const tanHalfFov = Math.tan(fovRad);
    const camZ = cam.position.z;
    const visH0 = 2 * camZ * tanHalfFov;
    const visW0 = visH0 * (canvasRect.width / canvasRect.height);
    const worldPerPx0 = visH0 / canvasRect.height;

    const slotEl = !isSpotlightStandalone ? slotElementsRef.current[skillName] : null;
    let slotCenterX = canvasRect.left + canvasRect.width * 0.5;
    let slotCenterY = canvasRect.top + canvasRect.height * 0.5;
    let slotWidthPx = 48;
    let inViewport = isSpotlightStandalone;

    if (slotEl) {
      const r = slotEl.getBoundingClientRect();
      slotCenterX = r.left + r.width * 0.5;
      slotCenterY = r.top + r.height * 0.5;
      slotWidthPx = r.width || 48;
      inViewport = r.bottom >= -140 && r.top <= window.innerHeight + 140;
    }

    if (!inViewport && !isSelected) {
      outer.visible = false;
      return;
    }

    const slotNx = (slotCenterX - canvasRect.left) / canvasRect.width - 0.5;
    const slotNy = 0.5 - (slotCenterY - canvasRect.top) / canvasRect.height;
    const slotWorldX = slotNx * visW0;
    const slotWorldY = slotNy * visH0;
    const baseScale = slotWidthPx * 0.96 * worldPerPx0;

    // Proximity & magnetic pull only apply when browsing the grid
    const prox = isSelected
      ? { proximity: 0, lookY: 0, lookX: 0, magWorldX: 0, magWorldY: 0 }
      : computeCursorProximity(pointerRef.current, slotCenterX, slotCenterY, worldPerPx0, isHovered);

    const targetHover = isHovered ? 1.0 : prox.proximity * 0.65;
    hoverIntensityRef.current = THREE.MathUtils.damp(
      hoverIntensityRef.current,
      targetHover,
      10,
      dt
    );
    selectedIntensityRef.current = THREE.MathUtils.damp(
      selectedIntensityRef.current,
      isSelected ? 1.0 : 0.0,
      7.5,
      dt
    );

    const targetFade = anySelected && !isSelected ? 0.0 : 1.0;
    s.fadeOpacity = THREE.MathUtils.damp(s.fadeOpacity, targetFade, 11, dt);

    if (s.fadeOpacity < 0.025) {
      outer.visible = false;
      return;
    }
    outer.visible = true;

    // Target spotlight coordinates at z = 3.5 when clicked
    const isDesktop = canvasRect.width >= 768;
    const zoomZ = 3.6;
    const zoomVisH = 2 * (camZ - zoomZ) * tanHalfFov;
    const zoomVisW = zoomVisH * (canvasRect.width / canvasRect.height);
    const zoomWorldPerPx = zoomVisH / canvasRect.height;

    const spotNx = isDesktop ? -0.21 : 0.0;
    const spotNy = isDesktop ? 0.02 : 0.27;
    const spotX = spotNx * zoomVisW;
    const spotY = spotNy * zoomVisH;
    const spotPxSize = isDesktop
      ? Math.min(canvasRect.height * 0.34, canvasRect.width * 0.23, 245)
      : Math.min(canvasRect.width * 0.42, canvasRect.height * 0.22, 165);
    const spotScale = spotPxSize * zoomWorldPerPx;

    // Idle gentle float + asynchronous phase offset
    const idleFloatY =
      reducedMotion || isSelected
        ? 0
        : Math.sin(t * motion.floatSpeed + motion.phase) * motion.floatAmp * baseScale;
    const idleFloatZ =
      reducedMotion || isSelected
        ? 0
        : Math.cos(t * motion.floatSpeed * 0.72 + motion.phase) * motion.depthAmp * baseScale;

    if (!isSelected && !reducedMotion) {
      // Pause idle advance when closely hovered so user inspects cleanly
      const spinScale = Math.max(0.18, 1 - hoverIntensityRef.current * 0.85);
      s.idleRotY = wrapAngle(s.idleRotY + dt * motion.speedY * spinScale);
    }

    const selBlend = selectedIntensityRef.current;
    const targetPosX = THREE.MathUtils.lerp(slotWorldX + prox.magWorldX, spotX, selBlend);
    const targetPosY = THREE.MathUtils.lerp(
      slotWorldY + idleFloatY + (isHovered ? 0.055 * baseScale : 0),
      spotY,
      selBlend
    );
    const targetPosZ = THREE.MathUtils.lerp(
      idleFloatZ + hoverIntensityRef.current * 0.32,
      zoomZ,
      selBlend
    );
    const targetScale = THREE.MathUtils.lerp(
      baseScale * (1 + hoverIntensityRef.current * 0.24),
      spotScale,
      selBlend
    );

    if (!s.initialized) {
      s.posX = targetPosX;
      s.posY = targetPosY;
      s.posZ = targetPosZ;
      s.scale = targetScale;
      s.rotY = isSelected ? 0 : s.idleRotY;
      s.initialized = true;
    } else {
      // Slot X/Y tracks DOM strictly fast so scroll feels locked; magnetic/zoom smoothly springs
      if (selBlend > 0.02) {
        s.posX = THREE.MathUtils.damp(s.posX, targetPosX, 9.5, dt);
        s.posY = THREE.MathUtils.damp(s.posY, targetPosY, 9.5, dt);
        s.posZ = THREE.MathUtils.damp(s.posZ, targetPosZ, 8.5, dt);
      } else {
        s.posX = targetPosX;
        s.posY = targetPosY;
        s.posZ = THREE.MathUtils.damp(s.posZ, targetPosZ, 12, dt);
      }
      s.scale = THREE.MathUtils.damp(s.scale, targetScale, 10, dt);
    }

    // Target 3D orientation (idle gentle rock vs cursor-directed vs camera-facing inspect)
    let targetRotX = reducedMotion
      ? 0
      : Math.sin(t * Math.abs(motion.speedX) * 2.2 + motion.phase) * 0.16;
    let targetRotY = s.idleRotY;
    let targetRotZ = reducedMotion
      ? 0
      : Math.cos(t * Math.abs(motion.speedZ) * 2.5 + motion.phase) * 0.07;

    if (isSelected) {
      const p = pointerRef.current;
      // Camera-facing with interactive cursor / drag 360deg inspect tilt
      const pointerTiltY = p.active ? ((p.x / window.innerWidth) - 0.5) * 0.42 : 0;
      const pointerTiltX = p.active ? ((p.y / window.innerHeight) - 0.5) * 0.32 : 0;
      targetRotY = p.dragRotY + pointerTiltY + (reducedMotion ? 0 : Math.sin(t * 0.85) * 0.09);
      targetRotX = p.dragRotX + pointerTiltX + (reducedMotion ? 0 : Math.cos(t * 0.7) * 0.05);
      targetRotZ = 0;
    } else if (hoverIntensityRef.current > 0.03) {
      // Smoothly turn icon toward the cursor while subtly keeping depth feel
      const blend = hoverIntensityRef.current;
      targetRotY = wrapAngle(
        Math.atan2(
          Math.sin(s.idleRotY) * (1 - blend) + Math.sin(prox.lookY) * blend,
          Math.cos(s.idleRotY) * (1 - blend) + Math.cos(prox.lookY) * blend
        )
      );
      targetRotX = THREE.MathUtils.lerp(targetRotX, prox.lookX, blend);
      targetRotZ = THREE.MathUtils.lerp(targetRotZ, -prox.lookY * 0.14, blend);
    }

    s.rotX = dampAngle(s.rotX, targetRotX, isSelected ? 8.5 : 9.0, dt);
    s.rotY = dampAngle(s.rotY, targetRotY, isSelected ? 8.5 : 7.5, dt);
    s.rotZ = dampAngle(s.rotZ, targetRotZ, 8.5, dt);

    // Subtle motion stretch impulse during rapid zoom transition
    const zoomVelocity = Math.abs(targetPosZ - s.posZ);
    s.streakBoost = THREE.MathUtils.damp(s.streakBoost, Math.min(0.18, zoomVelocity * 0.045), 14, dt);

    outer.position.set(s.posX, s.posY, s.posZ);
    outer.scale.set(
      s.scale * (1 - s.streakBoost * 0.15),
      s.scale * (1 - s.streakBoost * 0.15),
      s.scale * (1 + s.streakBoost * 0.9)
    );

    logoHost.rotation.set(s.rotX, s.rotY, s.rotZ);

    // Synchronized red laser illumination pulse as sweep passes over left logo slot (~165ms peak)
    const scanTs = scanTimestampsRef.current[skillName];
    let laserFlash = 0;
    if (!reducedMotion && scanTs !== undefined) {
      const scanAge = performance.now() - scanTs;
      if (scanAge >= 0 && scanAge <= 520) {
        laserFlash = Math.exp(-Math.pow((scanAge - 165) / 90, 2));
      }
    }

    // Per-icon independent glow, rim reflection & fade transitions
    const glowGain = hoverIntensityRef.current * 0.28 + selBlend * 0.44 + laserFlash * 0.65;
    const opacityMult = s.fadeOpacity;
    const needsTransparent = opacityMult < 0.99;

    const mats = logoMatsRef.current;
    for (let i = 0; i < mats.length; i++) {
      const m = mats[i];
      const baseEmissive = (m.userData.baseEmissive as number) ?? 0.12;
      const baseOp = (m.userData.baseOpacity as number) ?? 1.0;
      const origTrans = Boolean(m.userData.wasOriginallyTransparent);

      m.emissiveIntensity = baseEmissive + glowGain;
      m.opacity = baseOp * opacityMult;
      const nextTrans = origTrans || needsTransparent;
      if (m.transparent !== nextTrans) {
        m.transparent = nextTrans;
        m.needsUpdate = true;
      }
    }

    if (shadowMatRef.current && shadowMeshRef.current) {
      const shadowVis = Math.max(0, 1 - selBlend * 1.4) * opacityMult;
      shadowMeshRef.current.visible = shadowVis > 0.02;
      shadowMatRef.current.opacity = 0.46 * shadowVis;
      const shadowScale = 1 - idleFloatZ * 0.15 + hoverIntensityRef.current * 0.12;
      shadowMeshRef.current.scale.setScalar(Math.max(0.6, shadowScale));
    }
  });

  return (
    <group ref={outerGroupRef}>
      <group ref={logoAnchorRef} />
      <TechHoverInteraction
        hoverIntensityRef={hoverIntensityRef}
        selectedIntensityRef={selectedIntensityRef}
        accentColor={tech.brandColor}
        reducedMotion={reducedMotion}
      />
    </group>
  );
};
