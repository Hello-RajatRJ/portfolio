export interface Collidable {
  id: string;
  x: number;
  z: number;
  radius: number;
  type: 'circle' | 'box';
  width?: number;
  depth?: number;
}

// ─── WORLD COLLIDERS (Skyscrapers, Civic Pavilions, Trees, Project Buildings) ──
const CITY_SKYSCRAPERS: Collidable[] = [
  // North skyline
  { id: 'bldg-n1', type: 'box', x: -45, z: -55, width: 5.4, depth: 5.0, radius: 2.8 },
  { id: 'bldg-n2', type: 'box', x: -30, z: -55, width: 4.8, depth: 4.5, radius: 2.5 },
  { id: 'bldg-n3', type: 'box', x: -14, z: -58, width: 5.0, depth: 4.8, radius: 2.6 },
  { id: 'bldg-n4', type: 'box', x: 4,   z: -56, width: 4.6, depth: 4.8, radius: 2.4 },
  { id: 'bldg-n5', type: 'box', x: 20,  z: -55, width: 5.2, depth: 4.6, radius: 2.7 },
  { id: 'bldg-n6', type: 'box', x: 38,  z: -55, width: 4.8, depth: 4.8, radius: 2.5 },

  // East skyline
  { id: 'bldg-e1', type: 'box', x: 48, z: -35, width: 4.8, depth: 5.2, radius: 2.6 },
  { id: 'bldg-e2', type: 'box', x: 50, z: -15, width: 5.4, depth: 5.2, radius: 2.8 },
  { id: 'bldg-e3', type: 'box', x: 48, z: 8,   width: 5.0, depth: 4.8, radius: 2.6 },
  { id: 'bldg-e4', type: 'box', x: 48, z: 30,  width: 4.6, depth: 4.8, radius: 2.4 },
  { id: 'bldg-e5', type: 'box', x: 46, z: 48,  width: 4.8, depth: 4.8, radius: 2.5 },

  // South skyline
  { id: 'bldg-s1', type: 'box', x: 32,  z: 60, width: 4.8, depth: 4.8, radius: 2.5 },
  { id: 'bldg-s2', type: 'box', x: 12,  z: 62, width: 5.4, depth: 5.0, radius: 2.8 },
  { id: 'bldg-s3', type: 'box', x: -10, z: 62, width: 5.0, depth: 5.2, radius: 2.7 },
  { id: 'bldg-s4', type: 'box', x: -30, z: 60, width: 4.6, depth: 4.8, radius: 2.4 },
  { id: 'bldg-s5', type: 'box', x: -48, z: 58, width: 5.0, depth: 5.0, radius: 2.6 },

  // West skyline
  { id: 'bldg-w1', type: 'box', x: -50, z: 35,  width: 4.8, depth: 5.2, radius: 2.6 },
  { id: 'bldg-w2', type: 'box', x: -52, z: 12,  width: 5.2, depth: 5.0, radius: 2.7 },
  { id: 'bldg-w3', type: 'box', x: -50, z: -12, width: 4.8, depth: 4.8, radius: 2.5 },
  { id: 'bldg-w4', type: 'box', x: -50, z: -35, width: 5.0, depth: 5.0, radius: 2.6 },

  // Inner civic pavilions
  { id: 'bldg-c1', type: 'box', x: -32, z: -8, width: 3.8, depth: 3.8, radius: 2.0 },
  { id: 'bldg-c2', type: 'box', x: -32, z: 12, width: 3.8, depth: 3.8, radius: 2.0 },
  { id: 'bldg-c3', type: 'box', x: 26,  z: -8, width: 3.8, depth: 3.8, radius: 2.0 },
  { id: 'bldg-c4', type: 'box', x: 26,  z: 12, width: 3.8, depth: 3.8, radius: 2.0 },
];

// Project District Buildings (8 Showcase Pavilions)
const PROJECT_BUILDING_COLLIDERS: Collidable[] = [
  { id: 'proj-bldg-wesell',     type: 'box', x: -18, z: -18, width: 2.6, depth: 2.6, radius: 1.4 },
  { id: 'proj-bldg-ebmci',      type: 'box', x: -9,  z: -18, width: 2.6, depth: 2.6, radius: 1.4 },
  { id: 'proj-bldg-knowledger', type: 'box', x: -18, z: -8,  width: 2.6, depth: 2.6, radius: 1.4 },
  { id: 'proj-bldg-teachercool',type: 'box', x: -9,  z: -8,  width: 2.6, depth: 2.6, radius: 1.4 },
  { id: 'proj-bldg-hye',        type: 'box', x: -18, z: 2,   width: 2.6, depth: 2.6, radius: 1.4 },
  { id: 'proj-bldg-iallo',      type: 'box', x: -9,  z: 2,   width: 2.6, depth: 2.6, radius: 1.4 },
  { id: 'proj-bldg-ceretax',    type: 'box', x: -18, z: 12,  width: 2.6, depth: 2.6, radius: 1.4 },
  { id: 'proj-bldg-sarina',     type: 'box', x: -9,  z: 12,  width: 2.6, depth: 2.6, radius: 1.4 },
];

// Landmark Arches, Monuments & Track Structures
const LANDMARK_COLLIDERS: Collidable[] = [
  { id: 'arch-col-start-l', type: 'circle', x: -3.6, z: -4, radius: 0.55 },
  { id: 'arch-col-start-r', type: 'circle', x: 3.6,  z: -4, radius: 0.55 },
  { id: 'arch-col-hw-l',    type: 'circle', x: -3.8, z: 5,  radius: 0.55 },
  { id: 'arch-col-hw-r',    type: 'circle', x: 3.8,  z: 5,  radius: 0.55 },
  { id: 'arch-col-fin-l',   type: 'circle', x: -3.6, z: 24, radius: 0.55 },
  { id: 'arch-col-fin-r',   type: 'circle', x: 3.6,  z: 24, radius: 0.55 },
  // Hot Wheels Billboards (Image 1)
  { id: 'bb-pylon-r1',      type: 'circle', x: 5.7,  z: 10.5, radius: 0.4 },
  { id: 'bb-pylon-r2',      type: 'circle', x: 9.3,  z: 10.5, radius: 0.4 },
  { id: 'bb-pylon-l1',      type: 'circle', x: -9.3, z: 1.5,  radius: 0.4 },
  { id: 'bb-pylon-l2',      type: 'circle', x: -5.7, z: 1.5,  radius: 0.4 },
  // Overhead Track Portal Side Pylons (Left & Right of Central Speedway — center lane unobstructed)
  { id: 'sky-pylon-l',      type: 'circle', x: -4.4, z: -8.5, radius: 0.5 },
  { id: 'sky-pylon-r',      type: 'circle', x: 4.4,  z: -8.5, radius: 0.5 },
  // Gas Station Convenience Store & Garage Workshop Hall (Forecourts & Canopies remain drivable)
  { id: 'col-gas-station',  type: 'box',    x: 29.9,  z: -18.5, width: 4.5, depth: 6.4, radius: 3.5 },
  { id: 'col-garage-hall',  type: 'box',    x: -38.5, z: 19.0,  width: 5.0, depth: 8.4, radius: 4.5 },
  // Outer Stunt Arena Structures
  { id: 'col-stunt-ramp-l', type: 'circle', x: 72.5, z: 11.5, radius: 0.6 },
  { id: 'col-stunt-ramp-r', type: 'circle', x: 77.5, z: 11.5, radius: 0.6 },
];

// Urban Sidewalk Trees
const TREE_COLLIDERS: Collidable[] = [];
for (let z = -60; z <= 60; z += 12) {
  if (Math.abs(z) > 4) {
    TREE_COLLIDERS.push({ id: `tree-cz-l-${z}`, type: 'circle', x: -5.2, z, radius: 0.5 });
    TREE_COLLIDERS.push({ id: `tree-cz-r-${z}`, type: 'circle', x: 5.2, z, radius: 0.5 });
  }
}
for (let x = -60; x <= 60; x += 14) {
  if (Math.abs(x) > 6) {
    TREE_COLLIDERS.push({ id: `tree-cx-t-${x}`, type: 'circle', x, z: -5.2, radius: 0.5 });
    TREE_COLLIDERS.push({ id: `tree-cx-b-${x}`, type: 'circle', x, z: 5.2, radius: 0.5 });
  }
}

// AI Intelligence Factory Buildings & Infrastructure Colliders
// Leaves all Factory Ring Roads (z = 0, z = ±46, x = 96, x = 122, x = 144, x = 196, x = 224)
// and the Dept 11 LLM Core Glass Observation Tunnel (z ∈ [-6.5, +6.5] at x = 170) wide open!
const AI_FACTORY_COLLIDERS: Collidable[] = [
  // Entrance Left: Dept 01 Start + Entrance Right: Pipeline Guidance Hub
  { id: 'ai-dept-01', type: 'box', x: 104, z: -22, width: 12, depth: 16, radius: 10.0 },
  { id: 'ai-wayfinder-hub', type: 'box', x: 104, z: 22, width: 10, depth: 12, radius: 7.5 },
  // North Production Wing (02..06)
  { id: 'ai-dept-02', type: 'box', x: 112, z: -64, width: 14, depth: 10, radius: 8.5 },
  { id: 'ai-dept-03', type: 'box', x: 144, z: -64, width: 14, depth: 10, radius: 8.5 },
  { id: 'ai-dept-03-reject', type: 'box', x: 153, z: -77, width: 6.5, depth: 5.5, radius: 4.2 },
  { id: 'ai-dept-04', type: 'box', x: 176, z: -64, width: 14, depth: 10, radius: 8.5 },
  { id: 'ai-dept-05', type: 'box', x: 208, z: -64, width: 14, depth: 10, radius: 8.5 },
  { id: 'ai-dept-06', type: 'box', x: 242, z: -64, width: 14, depth: 10, radius: 8.5 },
  // East Vector & Search Corridor (07..09)
  { id: 'ai-dept-07', type: 'box', x: 242, z: -24, width: 12, depth: 16, radius: 10.0 },
  { id: 'ai-dept-08', type: 'box', x: 242, z: 18,  width: 12, depth: 16, radius: 10.0 },
  { id: 'ai-dept-09', type: 'box', x: 242, z: 58,  width: 14, depth: 12, radius: 9.0 },
  // South Retrieval, Agent, Safety, Output & Ops Wing (10, 12, 13, 14, 15)
  { id: 'ai-dept-10', type: 'box', x: 208, z: 64,  width: 14, depth: 10, radius: 8.5 },
  { id: 'ai-dept-12', type: 'box', x: 176, z: 64,  width: 14, depth: 10, radius: 8.5 },
  { id: 'ai-dept-13', type: 'box', x: 148, z: 64,  width: 14, depth: 10, radius: 8.5 },
  { id: 'ai-dept-14', type: 'box', x: 122, z: 64,  width: 14, depth: 10, radius: 8.5 },
  { id: 'ai-dept-15', type: 'box', x: 98,  z: 60,  width: 12, depth: 12, radius: 8.5 },
  // Dept 11 LLM Core Twin Buttresses straddling the drivable Observation Tunnel at z = 0
  { id: 'ai-dept-11-n', type: 'box', x: 170, z: -11.5, width: 18, depth: 9.0, radius: 10.0 },
  { id: 'ai-dept-11-s', type: 'box', x: 170, z: 11.5,  width: 18, depth: 9.0, radius: 10.0 },
  // AI Factory Main Entrance Arch Pylons (x = 94, z = ±5.8 -> center lane open)
  { id: 'ai-gate-l', type: 'circle', x: 94, z: -5.8, radius: 0.9 },
  { id: 'ai-gate-r', type: 'circle', x: 94, z: 5.8,  radius: 0.9 },
];

// Global active obstacles list containing every physical structure in the world
export const obstaclesList: Collidable[] = [
  ...CITY_SKYSCRAPERS,
  ...PROJECT_BUILDING_COLLIDERS,
  ...LANDMARK_COLLIDERS,
  ...TREE_COLLIDERS,
  ...AI_FACTORY_COLLIDERS,
];
