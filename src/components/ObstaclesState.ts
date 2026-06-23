export interface Collidable {
  id: string;
  x: number;
  z: number;
  radius: number;
  type: 'circle' | 'box';
  width?: number;
  depth?: number;
}

// Global list of active obstacles that the car physics engine checks
export const obstaclesList: Collidable[] = [];
