export interface ParallaxSignalState {
  pointerX: number; // -1 to 1 normalized within Projects section
  pointerY: number; // -1 to 1 normalized within Projects section
  scrollProgress: number; // 0 to 1 through section
  scrollVelocity: number; // smoothed scroll delta
  active: boolean;
}

