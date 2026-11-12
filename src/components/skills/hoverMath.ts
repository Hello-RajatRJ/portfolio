import * as THREE from 'three';

export interface PointerScreenState {
  x: number;
  y: number;
  active: boolean;
  dragRotX: number;
  dragRotY: number;
  isDragging: boolean;
}

export interface ProximityResult {
  proximity: number; // 0..1 smooth magnetic falloff
  lookY: number; // target Y yaw (rad)
  lookX: number; // target X pitch (rad)
  magWorldX: number; // subtle magnetic world offset X
  magWorldY: number; // subtle magnetic world offset Y
}

const PROXIMITY_RADIUS_PX = 148;

export function computeCursorProximity(
  pointer: PointerScreenState,
  slotCenterX: number,
  slotCenterY: number,
  worldPerPixel: number,
  isDirectlyHovered: boolean
): ProximityResult {
  if (!pointer.active) {
    return { proximity: 0, lookY: 0, lookX: 0, magWorldX: 0, magWorldY: 0 };
  }

  const dx = pointer.x - slotCenterX;
  const dy = pointer.y - slotCenterY;
  const dist = Math.hypot(dx, dy);

  const rawProx = Math.max(0, 1 - dist / PROXIMITY_RADIUS_PX);
  const smoothProx = rawProx * rawProx * (3 - 2 * rawProx);
  const strength = isDirectlyHovered ? Math.max(0.85, smoothProx) : smoothProx;

  if (strength <= 0.001) {
    return { proximity: 0, lookY: 0, lookX: 0, magWorldX: 0, magWorldY: 0 };
  }

  const clampedX = THREE.MathUtils.clamp(dx / PROXIMITY_RADIUS_PX, -1, 1);
  const clampedY = THREE.MathUtils.clamp(dy / PROXIMITY_RADIUS_PX, -1, 1);

  const magPx = 7.5 * strength;
  return {
    proximity: strength,
    lookY: clampedX * 0.56 * strength,
    lookX: clampedY * 0.42 * strength,
    magWorldX: clampedX * magPx * worldPerPixel,
    magWorldY: -clampedY * magPx * worldPerPixel,
  };
}

