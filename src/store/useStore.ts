import { create } from 'zustand';
import type { GameState } from '../types';
import projectsData from '../data/projects.json';

type View = 'landing' | 'game';

interface AppStore {
  // View management
  view: View;
  setView: (view: View) => void;
  launchGame: () => void;
  returnToLanding: () => void;

  // Game state
  gameState: GameState;
  setGameState: (updater: GameState | ((prev: GameState) => GameState)) => void;

  // Projects data
  projects: typeof projectsData;

  // Mini-game state
  activeMiniGame: 'none' | 'drift' | 'coins' | 'checkpoint';
  setActiveMiniGame: (game: 'none' | 'drift' | 'coins' | 'checkpoint') => void;

  // Achievement notifications
  pendingAchievement: string | null;
  triggerAchievement: (message: string) => void;
  clearAchievement: () => void;

  // Day/night
  timeOfDay: number; // 0 = midnight, 0.5 = noon, 1 = midnight again
  setTimeOfDay: (t: number) => void;
}

const initialGameState: GameState = {
  visitedProjects: [],
  downloadedResume: false,
  submittedContact: false,
  activeProject: null,
  showContact: false,
  currentZone: null,
  audioPlaying: false,
  speed: 0,
  drift: 0,
  activeProjectZoneId: null,
  activeMiniGame: 'none',
  coinsCollected: 0,
  totalCoins: 20,
  checkpointsCleared: 0,
  totalCheckpoints: 5,
  raceStartTime: null,
  raceEndTime: null,
  driftPoints: 0,
  driftTimeLeft: 30,
};

export const useStore = create<AppStore>((set) => ({
  // View
  view: 'landing',
  setView: (view) => set({ view }),
  launchGame: () => set({ view: 'game' }),
  returnToLanding: () => set({ view: 'landing' }),

  // Game state
  gameState: initialGameState,
  setGameState: (updater) =>
    set((state) => ({
      gameState:
        typeof updater === 'function' ? updater(state.gameState) : updater,
    })),

  // Projects
  projects: projectsData,

  // Mini-games
  activeMiniGame: 'none',
  setActiveMiniGame: (game) => set({ activeMiniGame: game }),

  // Achievements
  pendingAchievement: null,
  triggerAchievement: (message) => set({ pendingAchievement: message }),
  clearAchievement: () => set({ pendingAchievement: null }),

  // Day/night cycle (starts at dawn: 0.2)
  timeOfDay: 0.2,
  setTimeOfDay: (t) => set({ timeOfDay: t }),
}));
