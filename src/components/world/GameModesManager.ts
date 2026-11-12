import { Vector3 } from 'three';
import type { GameMode } from '../../types';

// ─── 1. RACE TRACK WAYPOINTS (Full Closed Circuit) ───────────────────────────
export interface Waypoint {
  x: number;
  y: number;
  z: number;
}

export const RACE_WAYPOINTS: Waypoint[] = [
  { x: 0,   y: 0.06, z: -4 },  // Start/Finish Line
  { x: 0,   y: 0.06, z: 12 },  // Down main avenue
  { x: 8,   y: 0.06, z: 20 },  // Turn East past bridge
  { x: 20,  y: 0.06, z: 16 },  // Skills plaza curve
  { x: 22,  y: 0.06, z: -4 },  // Eastern straight
  { x: 14,  y: 0.06, z: -18 }, // North-East bend
  { x: -4,  y: 0.06, z: -22 }, // North bypass
  { x: -16, y: 0.06, z: -16 }, // Projects District entry
  { x: -18, y: 0.06, z: 4 },   // Projects District avenue
  { x: -10, y: 0.06, z: 10 },  // South-West chicane
  { x: -2,  y: 0.06, z: 2 },   // Approaching home straight
];

// ─── 2. AI RACER OPPONENTS ──────────────────────────────────────────────────
export interface AIRacer {
  id: string;
  name: string;
  number: string;
  color: string;
  accentColor: string;
  pos: Vector3;
  rotY: number;
  speed: number;
  topSpeed: number;
  waypointIndex: number;
  progress: number; // 0 to 1 along current segment
  lap: number;
  totalDistance: number;
  steerAngle: number;
}

export const initialAIRacers: AIRacer[] = [
  {
    id: 'ai-1',
    name: 'Twin Mill',
    number: '07',
    color: '#00f0ff',
    accentColor: '#ffffff',
    pos: new Vector3(-2.2, 0.06, -8),
    rotY: 0,
    speed: 15.5,
    topSpeed: 17.5,
    waypointIndex: 0,
    progress: 0.1,
    lap: 1,
    totalDistance: 0,
    steerAngle: 0,
  },
  {
    id: 'ai-2',
    name: 'Bone Shaker',
    number: '23',
    color: '#ffd700',
    accentColor: '#18181b',
    pos: new Vector3(2.2, 0.06, -9),
    rotY: 0,
    speed: 16.0,
    topSpeed: 18.0,
    waypointIndex: 0,
    progress: 0.08,
    lap: 1,
    totalDistance: 0,
    steerAngle: 0,
  },
  {
    id: 'ai-3',
    name: 'Night Shifter',
    number: '42',
    color: '#a855f7',
    accentColor: '#f43f5e',
    pos: new Vector3(-2.0, 0.06, -13),
    rotY: 0,
    speed: 14.8,
    topSpeed: 16.8,
    waypointIndex: 0,
    progress: 0.05,
    lap: 1,
    totalDistance: 0,
    steerAngle: 0,
  },
  {
    id: 'ai-4',
    name: 'Rodger Dodger',
    number: '88',
    color: '#22c55e',
    accentColor: '#ffffff',
    pos: new Vector3(2.0, 0.06, -14),
    rotY: 0,
    speed: 15.2,
    topSpeed: 17.2,
    waypointIndex: 0,
    progress: 0.03,
    lap: 1,
    totalDistance: 0,
    steerAngle: 0,
  },
  {
    id: 'ai-5',
    name: 'Rip Rod',
    number: '99',
    color: '#f97316',
    accentColor: '#ffffff',
    pos: new Vector3(0, 0.06, -17),
    rotY: 0,
    speed: 16.5,
    topSpeed: 18.5,
    waypointIndex: 0,
    progress: 0.01,
    lap: 1,
    totalDistance: 0,
    steerAngle: 0,
  },
];

// ─── 3. BOWLING PINS STATE ──────────────────────────────────────────────────
export interface BowlingPin {
  id: number;
  initialPos: [number, number, number];
  pos: Vector3;
  vel: Vector3;
  rot: Vector3;
  rotVel: Vector3;
  isDown: boolean;
}

// 10 bowling pins placed at dedicated Bowling Arena (x: 65, z: 2 to 7)
export const createBowlingPins = (): BowlingPin[] => {
  const pins: BowlingPin[] = [];
  const baseZ = 5.0;
  const baseX = 65.0;
  const rowSpacing = 0.9;
  const colSpacing = 0.65;

  // Triangle pin formation (1 in front, 2 behind, 3 next, 4 in back)
  const rows = [
    [{ x: 0, z: 0 }],
    [{ x: -colSpacing / 2, z: rowSpacing }, { x: colSpacing / 2, z: rowSpacing }],
    [{ x: -colSpacing, z: rowSpacing * 2 }, { x: 0, z: rowSpacing * 2 }, { x: colSpacing, z: rowSpacing * 2 }],
    [
      { x: -colSpacing * 1.5, z: rowSpacing * 3 },
      { x: -colSpacing * 0.5, z: rowSpacing * 3 },
      { x: colSpacing * 0.5, z: rowSpacing * 3 },
      { x: colSpacing * 1.5, z: rowSpacing * 3 },
    ],
  ];

  let id = 1;
  rows.forEach((row) => {
    row.forEach((offset) => {
      const px = baseX + offset.x;
      const pz = baseZ + offset.z;
      pins.push({
        id: id++,
        initialPos: [px, 0.45, pz],
        pos: new Vector3(px, 0.45, pz),
        vel: new Vector3(0, 0, 0),
        rot: new Vector3(0, 0, 0),
        rotVel: new Vector3(0, 0, 0),
        isDown: false,
      });
    });
  });

  return pins;
};

export const globalBowlingPins: BowlingPin[] = createBowlingPins();

export const resetBowlingPins = () => {
  globalBowlingPins.forEach((pin) => {
    pin.pos.set(pin.initialPos[0], pin.initialPos[1], pin.initialPos[2]);
    pin.vel.set(0, 0, 0);
    pin.rot.set(0, 0, 0);
    pin.rotVel.set(0, 0, 0);
    pin.isDown = false;
  });
};

// ─── 4. GAME MODE SPAWN LOCATIONS ───────────────────────────────────────────
export const MODE_SPAWNS: Record<GameMode, { x: number; y: number; z: number; angle: number }> = {
  'free-roam':  { x: 0, y: 0.06, z: -3.5, angle: 0 },
  'racing':     { x: 0, y: 0.06, z: -6.0, angle: 0 },
  'bowling':    { x: 65.0, y: 0.06, z: -18.0, angle: 0 }, // Dedicated Bowling Arena off the main track
  'stunt':      { x: 0, y: 0.06, z: -10.0, angle: 0 },    // Lining up straight for the south mega launch ramp
  'ai-factory': { x: 82.0, y: 0.06, z: 0, angle: Math.PI / 2 }, // Facing East right into AI Factory Grand Gate
};

