import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import type { TechLayerDef, TechMetadata } from '../../data/techRegistry';

export interface TechPartTemplate {
  geometry: THREE.BufferGeometry;
  color: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  metalness: number;
  roughness: number;
  clearcoat: number;
  transparent?: boolean;
  opacity?: number;
  baseEmissiveIntensity: number;
  emissiveColor?: string;
}

export interface InstantiatedTechLogo {
  group: THREE.Group;
  materials: THREE.MeshPhysicalMaterial[];
  dispose: () => void;
}

// Shared reusable lightweight geometries & soft shadow texture
let sharedShadowGeo: THREE.PlaneGeometry | null = null;
let sharedShadowTex: THREE.CanvasTexture | null = null;
let sharedInnerRingGeo: THREE.TorusGeometry | null = null;
let sharedOuterRingGeo: THREE.TorusGeometry | null = null;
let sharedParticleGeo: THREE.OctahedronGeometry | null = null;

export function getSharedEffectGeometries() {
  if (!sharedShadowGeo) {
    sharedShadowGeo = new THREE.PlaneGeometry(1.15, 1.15);
  }
  if (!sharedShadowTex && typeof document !== 'undefined') {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 31);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.72)');
      grad.addColorStop(0.45, 'rgba(18, 4, 4, 0.36)');
      grad.addColorStop(0.75, 'rgba(220, 38, 38, 0.10)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    sharedShadowTex = tex;
  }
  if (!sharedInnerRingGeo) {
    sharedInnerRingGeo = new THREE.TorusGeometry(0.68, 0.014, 10, 64);
  }
  if (!sharedOuterRingGeo) {
    sharedOuterRingGeo = new THREE.TorusGeometry(0.84, 0.01, 10, 72);
  }
  if (!sharedParticleGeo) {
    sharedParticleGeo = new THREE.OctahedronGeometry(0.032, 0);
  }
  return {
    shadowGeo: sharedShadowGeo,
    shadowTex: sharedShadowTex,
    innerRingGeo: sharedInnerRingGeo,
    outerRingGeo: sharedOuterRingGeo,
    particleGeo: sharedParticleGeo,
  };
}

const svgLoader = new SVGLoader();
const TEMPLATE_CACHE = new Map<string, TechPartTemplate[]>();

const WORLD_ICON_SCALE = 0.0108; // Maps 100x100 SVG space into ~1.0 unit diameter

/**
 * Parses an SVG path string written in 0..100 coordinates into an upright, centered,
 * beveled THREE.BufferGeometry with positive determinant winding preserved.
 */
function extrudeSvgPath(layer: TechLayerDef, curveSegments = 6): THREE.BufferGeometry | null {
  const svgDoc = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="${layer.d}" /></svg>`;
  const parsed = svgLoader.parse(svgDoc);
  const shapes: THREE.Shape[] = [];
  for (const path of parsed.paths) {
    const created = SVGLoader.createShapes(path);
    shapes.push(...created);
  }
  if (shapes.length === 0) return null;

  const depth = (layer.depth ?? 0.14) / WORLD_ICON_SCALE;
  const geom = new THREE.ExtrudeGeometry(shapes, {
    depth,
    bevelEnabled: true,
    bevelThickness: 2.2,
    bevelSize: 1.5,
    bevelSegments: 2,
    curveSegments,
  });

  // Center in 0..100 SVG space before flipping Y upright
  geom.translate(-50, -50, -depth * 0.5);
  // rotateX(PI) flips Y (+down -> +up) and Z while keeping det = +1 (outward normals intact)
  geom.rotateX(Math.PI);
  geom.scale(WORLD_ICON_SCALE, WORLD_ICON_SCALE, WORLD_ICON_SCALE);
  geom.computeVertexNormals();
  return geom;
}

function makeGearShape(teeth: number, outerR: number, innerR: number, holeR: number): THREE.Shape {
  const shape = new THREE.Shape();
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a0 = i * step;
    const a1 = a0 + step * 0.22;
    const a2 = a0 + step * 0.48;
    const a3 = a0 + step * 0.72;
    const x0 = Math.cos(a0) * innerR;
    const y0 = Math.sin(a0) * innerR;
    if (i === 0) shape.moveTo(x0, y0);
    else shape.lineTo(x0, y0);
    shape.lineTo(Math.cos(a1) * outerR, Math.sin(a1) * outerR);
    shape.lineTo(Math.cos(a2) * outerR, Math.sin(a2) * outerR);
    shape.lineTo(Math.cos(a3) * innerR, Math.sin(a3) * innerR);
  }
  shape.closePath();

  const hole = new THREE.Path();
  hole.absarc(0, 0, holeR, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  return shape;
}

function buildSpecialParts(tech: TechMetadata): TechPartTemplate[] {
  const parts: TechPartTemplate[] = [];

  if (tech.special3D === 'react-atom') {
    const ringGeo = new THREE.TorusGeometry(0.45, 0.036, 12, 38);
    const coreGeo = new THREE.SphereGeometry(0.115, 16, 16);
    const haloGeo = new THREE.TorusGeometry(0.49, 0.012, 8, 36);

    parts.push({
      geometry: coreGeo,
      color: '#61DAFB',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      metalness: 0.35,
      roughness: 0.12,
      clearcoat: 1.0,
      baseEmissiveIntensity: 0.38,
      emissiveColor: '#22D3EE',
    });

    const angles = [0, Math.PI / 3, (Math.PI * 2) / 3];
    angles.forEach((angle, idx) => {
      parts.push({
        geometry: ringGeo,
        color: '#61DAFB',
        position: [0, 0, (idx - 1) * 0.018],
        rotation: [0.38, (idx - 1) * 0.25, angle],
        scale: [1, 0.38, 1],
        metalness: 0.55,
        roughness: 0.16,
        clearcoat: 0.9,
        baseEmissiveIntensity: 0.22,
        emissiveColor: '#0EA5E9',
      });
    });

    parts.push({
      geometry: haloGeo,
      color: '#DC2626',
      position: [0, 0, -0.06],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      metalness: 0.85,
      roughness: 0.25,
      clearcoat: 0.6,
      transparent: true,
      opacity: 0.35,
      baseEmissiveIntensity: 0.2,
      emissiveColor: '#EF4444',
    });
    return parts;
  }

  if (tech.special3D === 'redux-zustand') {
    const loopGeo = new THREE.TorusGeometry(0.39, 0.032, 10, 34);
    const nodeGeo = new THREE.SphereGeometry(0.068, 12, 12);
    const coreGeo = new THREE.DodecahedronGeometry(0.145, 0);

    // Three Redux orbital loops
    for (let i = 0; i < 3; i++) {
      const a = (i * Math.PI * 2) / 3;
      parts.push({
        geometry: loopGeo,
        color: '#764ABC',
        position: [Math.cos(a) * 0.04, Math.sin(a) * 0.04, (i - 1) * 0.02],
        rotation: [0.35, 0.2, a],
        scale: [1, 0.44, 1],
        metalness: 0.58,
        roughness: 0.2,
        clearcoat: 0.85,
        baseEmissiveIntensity: 0.22,
        emissiveColor: '#9333EA',
      });
      parts.push({
        geometry: nodeGeo,
        color: '#C084FC',
        position: [Math.cos(a + 0.35) * 0.34, Math.sin(a + 0.35) * 0.34, 0.05],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        metalness: 0.45,
        roughness: 0.14,
        clearcoat: 1,
        baseEmissiveIntensity: 0.32,
        emissiveColor: '#A855F7',
      });
    }

    // Zustand faceted copper-amber crystal core
    parts.push({
      geometry: coreGeo,
      color: '#F59E0B',
      position: [0, 0, 0.04],
      rotation: [0.3, 0.5, 0],
      scale: [1, 1, 1],
      metalness: 0.72,
      roughness: 0.2,
      clearcoat: 0.9,
      baseEmissiveIntensity: 0.24,
      emissiveColor: '#D97706',
    });
    return parts;
  }

  if (tech.special3D === 'docker-whale') {
    const whaleGeo = tech.layers[0] ? extrudeSvgPath(tech.layers[0], 6) : null;
    if (whaleGeo) {
      parts.push({
        geometry: whaleGeo,
        color: '#2496ED',
        position: [0, 0.08, -0.02],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        metalness: 0.45,
        roughness: 0.22,
        clearcoat: 0.85,
        baseEmissiveIntensity: 0.14,
        emissiveColor: '#0284C7',
      });
    }

    // 5 genuine 3D beveled shipping container cubes stacked on whale back
    const boxGeo = new THREE.BoxGeometry(0.115, 0.095, 0.125);
    const crateCoords: [number, number, string][] = [
      [-0.22, 0.16, '#38BDF8'],
      [-0.08, 0.16, '#0EA5E9'],
      [0.06, 0.16, '#38BDF8'],
      [-0.15, 0.28, '#0EA5E9'],
      [-0.01, 0.28, '#7DD3FC'],
    ];
    crateCoords.forEach(([x, y, c], idx) => {
      parts.push({
        geometry: boxGeo,
        color: c,
        position: [x, y, idx >= 3 ? 0.03 : 0.015],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        metalness: 0.4,
        roughness: 0.24,
        clearcoat: 0.8,
        baseEmissiveIntensity: 0.16,
        emissiveColor: '#0284C7',
      });
    });
    return parts;
  }

  if (tech.special3D === 'java-cup') {
    // Lathed ceramic/steel coffee mug profile
    const pts = [
      new THREE.Vector2(0.0, -0.32),
      new THREE.Vector2(0.2, -0.32),
      new THREE.Vector2(0.24, -0.22),
      new THREE.Vector2(0.27, 0.08),
      new THREE.Vector2(0.24, 0.1),
      new THREE.Vector2(0.2, -0.2),
      new THREE.Vector2(0.0, -0.2),
    ];
    const cupGeo = new THREE.LatheGeometry(pts, 28);
    const handleGeo = new THREE.TorusGeometry(0.125, 0.026, 12, 24, Math.PI);
    const saucerGeo = new THREE.CylinderGeometry(0.35, 0.28, 0.04, 28);
    const steamGeo = extrudeSvgPath({
      d: 'M48 44 C38 35 58 26 46 14 C52 24 41 33 52 44 Z',
      color: '#ED8B00',
      depth: 0.06,
    });

    parts.push({
      geometry: saucerGeo,
      color: '#5382A1',
      position: [0, -0.42, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      metalness: 0.72,
      roughness: 0.22,
      clearcoat: 0.75,
      baseEmissiveIntensity: 0.1,
    });
    parts.push({
      geometry: cupGeo,
      color: '#5382A1',
      position: [-0.04, -0.08, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      metalness: 0.65,
      roughness: 0.2,
      clearcoat: 0.85,
      baseEmissiveIntensity: 0.12,
    });
    parts.push({
      geometry: handleGeo,
      color: '#64748B',
      position: [0.22, -0.18, 0],
      rotation: [0, 0, -Math.PI / 2],
      scale: [1, 1, 1],
      metalness: 0.7,
      roughness: 0.22,
      clearcoat: 0.75,
      baseEmissiveIntensity: 0.1,
    });
    if (steamGeo) {
      parts.push({
        geometry: steamGeo,
        color: '#ED8B00',
        position: [-0.09, 0.14, 0.02],
        rotation: [0, 0, 0],
        scale: [0.85, 0.85, 1],
        metalness: 0.35,
        roughness: 0.18,
        clearcoat: 0.9,
        baseEmissiveIntensity: 0.28,
        emissiveColor: '#F97316',
      });
      parts.push({
        geometry: steamGeo,
        color: '#FB923C',
        position: [0.07, 0.18, -0.02],
        rotation: [0, 0.4, 0],
        scale: [0.7, 0.75, 1],
        metalness: 0.35,
        roughness: 0.18,
        clearcoat: 0.9,
        baseEmissiveIntensity: 0.25,
        emissiveColor: '#EA580C',
      });
    }
    return parts;
  }

  if (tech.special3D === 'threejs-pyramid') {
    const outerTriGeo = new THREE.TorusGeometry(0.42, 0.028, 12, 3);
    const midTriGeo = new THREE.TorusGeometry(0.24, 0.024, 12, 3);
    const coreOctaGeo = new THREE.OctahedronGeometry(0.14, 0);

    parts.push({
      geometry: outerTriGeo,
      color: '#F8FAFC',
      position: [0, -0.06, 0],
      rotation: [0, 0, Math.PI / 2],
      scale: [1, 1, 1],
      metalness: 0.75,
      roughness: 0.18,
      clearcoat: 0.9,
      baseEmissiveIntensity: 0.18,
    });
    parts.push({
      geometry: midTriGeo,
      color: '#CBD5E1',
      position: [0, -0.02, 0.08],
      rotation: [0, 0, -Math.PI / 2],
      scale: [1, 1, 1],
      metalness: 0.8,
      roughness: 0.18,
      clearcoat: 0.85,
      baseEmissiveIntensity: 0.16,
    });
    parts.push({
      geometry: coreOctaGeo,
      color: '#EF4444',
      position: [0, -0.02, 0.02],
      rotation: [0.35, 0.4, 0],
      scale: [1, 1, 1],
      metalness: 0.35,
      roughness: 0.12,
      clearcoat: 1,
      transparent: true,
      opacity: 0.88,
      baseEmissiveIntensity: 0.34,
      emissiveColor: '#DC2626',
    });
    return parts;
  }

  if (tech.special3D === 'ai-core') {
    const coreGeo = new THREE.IcosahedronGeometry(0.23, 0);
    const gyro1Geo = new THREE.TorusGeometry(0.41, 0.024, 12, 48);
    const gyro2Geo = new THREE.TorusGeometry(0.35, 0.02, 12, 48);
    const sparkGeo = new THREE.OctahedronGeometry(0.055, 0);

    parts.push({
      geometry: coreGeo,
      color: '#DC2626',
      position: [0, 0, 0],
      rotation: [0.3, 0.4, 0],
      scale: [1, 1, 1],
      metalness: 0.45,
      roughness: 0.14,
      clearcoat: 1.0,
      baseEmissiveIntensity: 0.42,
      emissiveColor: '#EF4444',
    });
    parts.push({
      geometry: gyro1Geo,
      color: '#F87171',
      position: [0, 0, 0],
      rotation: [0.85, 0.4, 0],
      scale: [1, 1, 1],
      metalness: 0.8,
      roughness: 0.2,
      clearcoat: 0.85,
      baseEmissiveIntensity: 0.22,
      emissiveColor: '#DC2626',
    });
    parts.push({
      geometry: gyro2Geo,
      color: '#FCA5A5',
      position: [0, 0, 0],
      rotation: [-0.7, 0.8, 0.3],
      scale: [1, 1, 1],
      metalness: 0.78,
      roughness: 0.18,
      clearcoat: 0.85,
      baseEmissiveIntensity: 0.2,
      emissiveColor: '#F87171',
    });
    parts.push({
      geometry: sparkGeo,
      color: '#FFFFFF',
      position: [0.36, 0.3, 0.08],
      rotation: [0, 0, 0],
      scale: [1, 1.35, 1],
      metalness: 0.5,
      roughness: 0.12,
      clearcoat: 1,
      baseEmissiveIntensity: 0.45,
      emissiveColor: '#FCA5A5',
    });
    return parts;
  }

  if (tech.special3D === 'git-tree') {
    const diamondGeo = tech.layers[0] ? extrudeSvgPath(tech.layers[0], 6) : null;
    if (diamondGeo) {
      parts.push({
        geometry: diamondGeo,
        color: '#F05032',
        position: [0, 0, -0.02],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        metalness: 0.45,
        roughness: 0.22,
        clearcoat: 0.85,
        baseEmissiveIntensity: 0.15,
        emissiveColor: '#EA580C',
      });
    }
    const stemGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.46, 12);
    const branchGeo = new THREE.CylinderGeometry(0.026, 0.026, 0.25, 12);
    const nodeGeo = new THREE.SphereGeometry(0.068, 16, 16);

    parts.push({
      geometry: stemGeo,
      color: '#F8FAFC',
      position: [0, 0, 0.09],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      metalness: 0.65,
      roughness: 0.18,
      clearcoat: 0.9,
      baseEmissiveIntensity: 0.12,
    });
    parts.push({
      geometry: branchGeo,
      color: '#F8FAFC',
      position: [0.09, 0.05, 0.09],
      rotation: [0, 0, -0.68],
      scale: [1, 1, 1],
      metalness: 0.65,
      roughness: 0.18,
      clearcoat: 0.9,
      baseEmissiveIntensity: 0.12,
    });
    const nodes: [number, number][] = [
      [0, 0.2],
      [0, -0.18],
      [0.18, 0.14],
    ];
    nodes.forEach(([nx, ny]) => {
      parts.push({
        geometry: nodeGeo,
        color: '#FFFFFF',
        position: [nx, ny, 0.11],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        metalness: 0.55,
        roughness: 0.14,
        clearcoat: 1.0,
        baseEmissiveIntensity: 0.22,
      });
    });
    return parts;
  }

  if (tech.special3D === 'socketio-bolt') {
    const outerRing = new THREE.TorusGeometry(0.41, 0.055, 16, 48);
    const discGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.09, 36);
    const boltGeo = extrudeSvgPath({
      d: 'M55 18 L32 53 H48 L43 82 L68 46 H52 Z',
      color: '#FFFFFF',
      depth: 0.13,
    });

    parts.push({
      geometry: discGeo,
      color: '#111827',
      position: [0, 0, -0.02],
      rotation: [Math.PI / 2, 0, 0],
      scale: [1, 1, 1],
      metalness: 0.82,
      roughness: 0.24,
      clearcoat: 0.7,
      baseEmissiveIntensity: 0.06,
    });
    parts.push({
      geometry: outerRing,
      color: '#F8FAFC',
      position: [0, 0, 0.02],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      metalness: 0.72,
      roughness: 0.18,
      clearcoat: 0.9,
      baseEmissiveIntensity: 0.16,
    });
    if (boltGeo) {
      parts.push({
        geometry: boltGeo,
        color: '#FFFFFF',
        position: [0, 0, 0.08],
        rotation: [0, 0, 0],
        scale: [0.78, 0.78, 1],
        metalness: 0.65,
        roughness: 0.16,
        clearcoat: 1,
        baseEmissiveIntensity: 0.28,
        emissiveColor: '#EF4444',
      });
    }
    return parts;
  }

  if (tech.special3D === 'agile-orbit') {
    const arc1 = new THREE.TorusGeometry(0.36, 0.048, 14, 42, Math.PI * 1.42);
    const coneGeo = new THREE.ConeGeometry(0.095, 0.17, 14);
    const dotGeo = new THREE.SphereGeometry(0.065, 16, 16);

    parts.push({
      geometry: arc1,
      color: '#EF4444',
      position: [0, 0, 0],
      rotation: [0.15, 0, 0.4],
      scale: [1, 1, 1],
      metalness: 0.6,
      roughness: 0.2,
      clearcoat: 0.9,
      baseEmissiveIntensity: 0.24,
      emissiveColor: '#DC2626',
    });
    parts.push({
      geometry: coneGeo,
      color: '#F97316',
      position: [0.33, 0.13, 0.02],
      rotation: [0, 0, 0.32],
      scale: [1, 1, 1],
      metalness: 0.55,
      roughness: 0.2,
      clearcoat: 0.9,
      baseEmissiveIntensity: 0.26,
      emissiveColor: '#EA580C',
    });
    parts.push({
      geometry: dotGeo,
      color: '#FFFFFF',
      position: [0, 0, 0.03],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      metalness: 0.65,
      roughness: 0.15,
      clearcoat: 1,
      baseEmissiveIntensity: 0.22,
    });
    return parts;
  }

  if (tech.special3D === 'cicd-gears') {
    const gear1Shape = makeGearShape(8, 0.28, 0.22, 0.09);
    const gear2Shape = makeGearShape(6, 0.21, 0.16, 0.065);
    const g1 = new THREE.ExtrudeGeometry(gear1Shape, {
      depth: 0.11,
      bevelEnabled: true,
      bevelThickness: 0.018,
      bevelSize: 0.012,
      bevelSegments: 2,
    });
    g1.translate(0, 0, -0.055);
    const g2 = new THREE.ExtrudeGeometry(gear2Shape, {
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.016,
      bevelSize: 0.01,
      bevelSegments: 2,
    });
    g2.translate(0, 0, -0.05);

    parts.push({
      geometry: g1,
      color: '#EF4444',
      position: [-0.13, -0.06, 0.02],
      rotation: [0, 0, 0.2],
      scale: [1, 1, 1],
      metalness: 0.68,
      roughness: 0.22,
      clearcoat: 0.85,
      baseEmissiveIntensity: 0.22,
      emissiveColor: '#DC2626',
    });
    parts.push({
      geometry: g2,
      color: '#E2E8F0',
      position: [0.22, 0.18, -0.02],
      rotation: [0, 0, 0.5],
      scale: [1, 1, 1],
      metalness: 0.85,
      roughness: 0.2,
      clearcoat: 0.9,
      baseEmissiveIntensity: 0.12,
    });
    return parts;
  }

  // Standard multi-layer extruded SVG shapes
  for (const layer of tech.layers) {
    const geom = extrudeSvgPath(layer);
    if (!geom) continue;
    parts.push({
      geometry: geom,
      color: layer.color,
      position: [0, 0, layer.zOffset ?? 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      metalness: layer.metalness ?? (tech.materialStyle === 'metallic' ? 0.65 : 0.42),
      roughness: layer.roughness ?? (tech.materialStyle === 'glass' ? 0.16 : 0.22),
      clearcoat: tech.materialStyle === 'glass' ? 1.0 : 0.8,
      baseEmissiveIntensity: layer.emissiveIntensity ?? 0.12,
      emissiveColor: layer.color,
    });
  }

  return parts;
}

function getTechPartTemplates(tech: TechMetadata): TechPartTemplate[] {
  const cached = TEMPLATE_CACHE.get(tech.id);
  if (cached) return cached;
  const built = buildSpecialParts(tech);
  TEMPLATE_CACHE.set(tech.id, built);
  return built;
}

export function instantiateTechLogoGroup(tech: TechMetadata): InstantiatedTechLogo {
  const templates = getTechPartTemplates(tech);
  const group = new THREE.Group();
  const materials: THREE.MeshPhysicalMaterial[] = [];

  templates.forEach((tpl) => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(tpl.color),
      metalness: tpl.metalness,
      roughness: tpl.roughness,
      clearcoat: tpl.clearcoat,
      clearcoatRoughness: 0.16,
      reflectivity: 0.9,
      emissive: new THREE.Color(tpl.emissiveColor ?? tech.brandColor),
      emissiveIntensity: tpl.baseEmissiveIntensity,
      transparent: tpl.transparent ?? false,
      opacity: tpl.opacity ?? 1.0,
    });
    mat.userData.baseEmissive = tpl.baseEmissiveIntensity;
    mat.userData.baseOpacity = tpl.opacity ?? 1.0;
    mat.userData.wasOriginallyTransparent = Boolean(tpl.transparent);

    const mesh = new THREE.Mesh(tpl.geometry, mat);
    mesh.position.set(tpl.position[0], tpl.position[1], tpl.position[2]);
    mesh.rotation.set(tpl.rotation[0], tpl.rotation[1], tpl.rotation[2]);
    mesh.scale.set(tpl.scale[0], tpl.scale[1], tpl.scale[2]);
    group.add(mesh);
    materials.push(mat);
  });

  const dispose = () => {
    materials.forEach((m) => m.dispose());
  };

  return { group, materials, dispose };
}
