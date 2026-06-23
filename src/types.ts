export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  tech: string[];
  features: string[];
  liveDemo: string;
  github: string;
  role: string;
  challenges: string;
  color: string;
  category: string;
  buildingStyle: string;
}

export type MiniGameType = 'none' | 'drift' | 'coins' | 'race';

export interface GameState {
  visitedProjects: string[];
  downloadedResume: boolean;
  submittedContact: boolean;
  activeProject: Project | null;
  showContact: boolean;
  currentZone: string | null;
  audioPlaying: boolean;
  speed: number;
  drift: number;
  activeProjectZoneId: string | null;
  // Mini-games state
  activeMiniGame: MiniGameType;
  coinsCollected: number;
  totalCoins: number;
  checkpointsCleared: number;
  totalCheckpoints: number;
  raceStartTime: number | null;
  raceEndTime: number | null;
  driftPoints: number;
  driftTimeLeft: number;
}

export interface Keys {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  handbrake: boolean;
  interact: boolean;
  wheelie: boolean;
  horn: boolean;
}
