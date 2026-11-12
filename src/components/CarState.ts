import { Vector3 } from 'three';

// ─── Global Exports ────────────────────────────────────────────────────────
export const carGlobalPosition = new Vector3(0, 0.06, -3.5);
export const carGlobalAngle = { value: 0 };
export const fuelSyncRequest: { targetFuel: number | null } = { targetFuel: null };

export interface SkillCubeState {
  id: string;
  name: string;
  initialPos: Vector3;
  initialRot: Vector3;
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
  steeringAngle: number;
}

export interface CarVisualState {
  wheelRot: number;
  wheelieAngle: number;
  bodyRoll: number;      // Lateral chassis tilt when cornering (radians)
  bodyPitch: number;     // Longitudinal chassis tilt when accelerating/braking (radians)
  isBoosting: boolean;   // Boost / nitro active
  isBraking: boolean;    // Brake / reverse lights active
  camX: number;
  camY: number;
  camZ: number;
}

// ─── Tuned Handling Physics Configuration ──────────────────────────────────
export const CAR_CONFIG = {
  // Acceleration & Speed
  accel: 38.0,           // Fast, punchy acceleration
  boostAccel: 68.0,      // Intense nitro rocket acceleration
  maxSpeed: 44.0,        // ~158 km/h top speed (exhilarating & fast across 160m map)
  maxBoostSpeed: 64.0,   // ~230 km/h nitro top speed
  maxRevSpeed: -16.0,    // Snappy reverse
  decel: 16.0,           // Controlled engine braking
  friction: 2.2,         // Low rolling drag for smooth glide
  brakeForce: 60.0,      // Strong, immediate brakes

  // Steering & Handling
  maxSteering: 0.70,     // Sharp, agile turning (~40 deg)
  steerSpeed: 9.5,       // Immediate wheel response on keypress
  steerReturn: 22.0,     // Snappy auto-center
  minSteerSpeed: 5.0,    // Crisp low-speed turning

  // Precision Grip & Handling
  normalGripRate: 30.0,  // Firm planted road grip with zero sliding

  // Suspension & Weight Transfer Visuals
  maxRoll: 0.08,
  maxPitch: 0.07,
  suspensionDamp: 12.0,

  // Boundaries & Collisions (Expanded Eastward to encompass AI Intelligence Factory)
  carRadius: 1.05,
  mapLimit: 80.0,
  mapBounds: {
    minX: -88.0,
    maxX: 268.0,
    minZ: -94.0,
    maxZ: 94.0,
  },
};

export const skillCubesList: SkillCubeState[] = [];

const SKILL_CUBE_NAMES = ['React', 'TypeScript', 'Three.js', 'Node.js', 'Next.js', 'SQL', 'Git', 'Docker'];

export function initSkillCubes() {
  if (skillCubesList.length > 0) return;
  const size = 0.95;
  SKILL_CUBE_NAMES.forEach((skill, i) => {
    const angle = (i / SKILL_CUBE_NAMES.length) * Math.PI * 2;
    const r = 2.6;
    const initPos = new Vector3(18 + Math.cos(angle) * r, size / 2, Math.sin(angle) * r);
    const initRot = new Vector3(0, -angle, 0);

    skillCubesList.push({
      id: `skill-${skill}`,
      name: skill,
      initialPos: initPos,
      initialRot: initRot,
      pos: initPos.clone(),
      vel: new Vector3(0, 0, 0),
      rot: initRot.clone(),
      rotVel: new Vector3(0, 0, 0),
      size,
    });
  });
}

export function resetSkillCubes() {
  initSkillCubes();
  skillCubesList.forEach((cube) => {
    cube.pos.copy(cube.initialPos);
    cube.vel.set(0, 0, 0);
    cube.rot.copy(cube.initialRot);
    cube.rotVel.set(0, 0, 0);
  });
}

// ─── Zone Config (expanded map) ────────────────────────────────────────────
export const ZONES = {
  welcome:  { x: 0,   z: -2.0, radius: 5.5 },
  projects: { x: -10, z: -5,  radius: 9.0 },
  skills:   { x: 13,  z: 0,   radius: 5.0 },
  resume:   { x: -9,  z: 12,  radius: 3.0 },
  contact:  { x: 9,   z: 12,  radius: 3.0 },
  minigame: { x: 13,  z: -12, radius: 5.5 },
  gasStation: { x: 24.9, z: -18.5, radius: 6.8 },
  garage:     { x: -33.0, z: 19.0, radius: 6.8 },
  aiFactory:  { x: 170.0, z: 0, radius: 85.0 },
};

export const tourJumpRequest: { stepIndex: number | null; teleportToFactory: boolean } = {
  stepIndex: null,
  teleportToFactory: false,
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
