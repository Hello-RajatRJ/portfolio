import { create } from 'zustand';
import type { GameState } from '../types';
import projectsData from '../data/projects.json';
import { AuthService, type UserProfile } from '../services/authService';

type View = 'landing' | 'game' | 'showcase' | 'builder' | 'chatbot' | 'assessment';

interface AppStore {
  // User Authentication & Profile
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authPendingTargetView: View | null;
  setAuthPendingTargetView: (view: View | null) => void;

  // View management
  view: View;
  setView: (view: View) => void;
  launchGame: () => void;
  returnToLanding: () => void;
  openResumeBuilder: () => void;
  openChatbotPage: () => void;
  openAssessmentPage: () => void;

  // Showcase
  openShowcase: () => void;
  showcasePage: string | null; // null = main showcase grid, otherwise category slug
  setShowcasePage: (page: string | null) => void;

  // Game state
  gameState: GameState;
  setGameState: (updater: GameState | ((prev: GameState) => GameState)) => void;

  // Projects data
  projects: typeof projectsData;

  // Mini-game state
  activeMiniGame: 'none' | 'coins' | 'checkpoint';
  setActiveMiniGame: (game: 'none' | 'coins' | 'checkpoint') => void;

  // Achievement notifications
  pendingAchievement: string | null;
  triggerAchievement: (message: string) => void;
  clearAchievement: () => void;

  // Day/night
  timeOfDay: number; // 0 = midnight, 0.5 = noon, 1 = midnight again
  setTimeOfDay: (t: number) => void;

  // AI Chatbot
  isChatbotOpen: boolean;
  setChatbotOpen: (open: boolean) => void;
  toggleChatbot: () => void;
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
  activeProjectZoneId: null,
  // Game modes & visuals
  gameMode: 'free-roam',
  cameraPerspective: 'tpp',
  nitroAmount: 100,
  gear: 1,
  // Fuel & Garage
  fuel: 100,
  milesDriven: 0,
  isRefueling: false,
  selectedCar: 'charger',
  showGarageModal: false,
  // Racing mode
  racePosition: 1,
  totalRacers: 6,
  currentLap: 1,
  totalLaps: 3,
  raceTimer: 0,
  raceFinished: false,
  raceCountdown: -1,
  // Bowling & Skills Interactive Reset
  bowlingPinsDown: 0,
  totalBowlingPins: 10,
  bowlingScoreText: null,
  skillsDisplaced: false,
  // AI Intelligence Factory & Guided Tour
  activeFactoryDeptId: null,
  nearbyFactoryDeptId: null,
  tourActive: false,
  tourPaused: false,
  tourStepIndex: 0,
  visitedFactoryDepts: [],
  factoryQuery: 'How does the AI Factory retrieve internal docs and execute safe tools?',
  factoryOutputFormat: 'text',
  // Stunt mode
  stuntScore: 0,
  airTime: 0,
  jumpDistance: 0,
  stuntMessage: null,
  // Legacy / extra mini-games state
  activeMiniGame: 'none',
  coinsCollected: 0,
  totalCoins: 20,
  checkpointsCleared: 0,
  totalCheckpoints: 5,
  raceStartTime: null,
  raceEndTime: null,
};

export const useStore = create<AppStore>((set, get) => ({
  // User Authentication & Profile
  user: AuthService.getUser(),
  setUser: (user) => set({ user }),
  showAuthModal: false,
  setShowAuthModal: (show) => set({ showAuthModal: show }),
  authPendingTargetView: null,
  setAuthPendingTargetView: (target) => set({ authPendingTargetView: target }),

  // View — default to complete portfolio landing page; opens 3D world on button click!
  view: 'landing',
  setView: (view) => set({ view }),
  launchGame: () => set({ view: 'game' }),
  returnToLanding: () => set({ view: 'landing', showcasePage: null }),

  openResumeBuilder: () => {
    const user = get().user;
    if (!user || !user.isLoggedIn) {
      set({ showAuthModal: true, authPendingTargetView: 'builder' });
    } else {
      set({ view: 'builder' });
    }
  },

  openChatbotPage: () => {
    const user = get().user;
    if (!user || !user.isLoggedIn) {
      set({ showAuthModal: true, authPendingTargetView: 'chatbot' });
    } else {
      set({ view: 'chatbot' });
    }
  },

  openAssessmentPage: () => {
    const user = get().user;
    if (!user || !user.isLoggedIn) {
      set({ showAuthModal: true, authPendingTargetView: 'assessment' });
    } else {
      set({ view: 'assessment' });
    }
  },

  // Showcase
  openShowcase: () => set({ view: 'showcase', showcasePage: null }),
  showcasePage: null,
  setShowcasePage: (page) => set({ showcasePage: page }),

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

  // AI Chatbot
  isChatbotOpen: false,
  setChatbotOpen: (open) => set({ isChatbotOpen: open }),
  toggleChatbot: () => set((state) => ({ isChatbotOpen: !state.isChatbotOpen })),
}));
