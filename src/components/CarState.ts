import { Vector3 } from 'three';

// ─── Global Exports ────────────────────────────────────────────────────────
export const carGlobalPosition = new Vector3(0, 0, 13);
export const carGlobalAngle = { value: 0 };

export interface SkillCubeState {
  id: string;
  name: string;
  pos: Vector3;
  vel: Vector3;
  rot: Vector3;
  rotVel: Vector3;
  size: number;
}

export interface CarPhysicsState {
  posX: number;
  posZ: number;
  posY: number;
  velY: number;
  speed: number;
  angle: number;
  vx: number;
  vz: number;
  driftScore: number;
  steeringAngle: number;
}

export interface CarVisualState {
  wheelRot: number;
  wheelieAngle: number;
  camX: number;
  camY: number;
  camZ: number;
}

export const skillCubesList: SkillCubeState[] = [];

// ─── Zone Config (expanded map) ────────────────────────────────────────────
export const ZONES = {
  welcome:  { x: 0,   z: 10,  radius: 4.0 },
  projects: { x: -10, z: -5,  radius: 9.0 },
  skills:   { x: 13,  z: 0,   radius: 5.0 },
  resume:   { x: -9,  z: 12,  radius: 3.0 },
  contact:  { x: 9,   z: 12,  radius: 3.0 },
  minigame: { x: 13,  z: -12, radius: 5.5 },
};

export const PROJECT_BILLBOARDS = [
  { id: 'wesell-restaurants', x: -16, z: -10, radius: 2.5 },
  { id: 'ebmci-taiwan',       x: -10, z: -10, radius: 2.5 },
  { id: 'knowledger',         x:  -4, z: -10, radius: 2.5 },
  { id: 'teachercool',        x: -16, z:  -4, radius: 2.5 },
  { id: 'hye-connect',        x: -10, z:  -4, radius: 2.5 },
  { id: 'iallo',              x:  -4, z:  -4, radius: 2.5 },
  { id: 'ceretax',            x: -16, z:   2, radius: 2.5 },
  { id: 'sarina-clinic',      x:  -4, z:   2, radius: 2.5 },
];
