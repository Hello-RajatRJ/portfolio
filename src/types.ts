export interface ProjectProofMetrics {
  headline: string;
  stat: string;
  statLabel: string;
  badge: string;
}

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
  vertical?: string;
  problem?: string;
  owned?: string;
  metrics?: ProjectProofMetrics;
  buildingStyle: string;
}

export type MiniGameType = 'none' | 'coins' | 'race';
export type GameMode = 'free-roam' | 'racing' | 'bowling' | 'stunt' | 'ai-factory';
export type CameraPerspective = 'tpp' | 'tpp-close' | 'hood' | 'drone';
export type CarChoice = 'mustang' | 'charger' | 'cyberpunk' | 'beetle';
export type FactoryOutputFormat = 'text' | 'json' | 'code' | 'summary' | 'audio';

export interface GameState {
  visitedProjects: string[];
  downloadedResume: boolean;
  submittedContact: boolean;
  activeProject: Project | null;
  showContact: boolean;
  currentZone: string | null;
  audioPlaying: boolean;
  speed: number;
  activeProjectZoneId: string | null;
  // Game modes & visuals
  gameMode: GameMode;
  cameraPerspective: CameraPerspective;
  nitroAmount: number;
  gear: number;
  // Fuel & Garage
  fuel: number;
  milesDriven: number;
  isRefueling: boolean;
  selectedCar: CarChoice;
  showGarageModal: boolean;
  // Racing mode
  racePosition: number;
  totalRacers: number;
  currentLap: number;
  totalLaps: number;
  raceTimer: number;
  raceFinished: boolean;
  raceCountdown: number; // >0: countdown, 0: GO!, -1: racing
  // Bowling & Skills Interactive Reset
  bowlingPinsDown: number;
  totalBowlingPins: number;
  bowlingScoreText: string | null;
  skillsDisplaced: boolean;
  // AI Intelligence Factory & Guided Tour
  activeFactoryDeptId: string | null;
  nearbyFactoryDeptId: string | null;
  tourActive: boolean;
  tourPaused: boolean;
  tourStepIndex: number;
  visitedFactoryDepts: string[];
  factoryQuery: string;
  factoryOutputFormat: FactoryOutputFormat;
  // Stunt mode
  stuntScore: number;
  airTime: number;
  jumpDistance: number;
  stuntMessage: string | null;
  // Legacy / extra mini-games state
  activeMiniGame: MiniGameType;
  coinsCollected: number;
  totalCoins: number;
  checkpointsCleared: number;
  totalCheckpoints: number;
  raceStartTime: number | null;
  raceEndTime: number | null;
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
  reset: boolean;
  cameraToggle: boolean;
  garage: boolean;
}
