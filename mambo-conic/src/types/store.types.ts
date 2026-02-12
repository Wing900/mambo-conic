import { GameMode } from './scene.types';

export type AppPhase = 'title' | 'chapters' | 'game';

// 玩家状态
export interface PlayerState {
  score: number;
  favorability: number;
  completedScenes: string[];
}

// 游戏状态
export interface GameState {
  appPhase: AppPhase;
  isAudioEnabled: boolean;
  isBackgroundMusicEnabled: boolean;
  currentSceneId: string;
  sceneHistory: string[];
  gameMode: GameMode;
  playerState: PlayerState;
  characterName: string;
}

// 本地存储的进度数据
export interface SaveData {
  currentSceneId: string;
  sceneHistory: string[];
  playerState: PlayerState;
  lastPlayed: string;
}

// Store Actions
export interface GameActions {
  setAppPhase: (phase: AppPhase) => void;
  toggleAudio: () => void;
  toggleBackgroundMusic: () => void;
  setCharacterName: (name: string) => void;
  goToScene: (sceneId: string, addToHistory?: boolean) => void;
  setGameMode: (mode: GameMode) => void;
  goBack: () => void;
  updatePlayerState: (updates: Partial<PlayerState>) => void;
  markSceneCompleted: (sceneId: string) => void;
  resetGame: () => void;
  hasSavedProgress: () => boolean;
  loadProgress: () => SaveData | null;
  continueGame: () => void;
}

// 完整的 Store 类型
export type GameStore = GameState & GameActions;