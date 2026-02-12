import { create } from 'zustand';
import { GameStore, PlayerState, AppPhase, SaveData } from '../types/store.types';
import { GameMode } from '../types/scene.types';
import { getSceneAudioManager, getBackgroundMusicManager } from '../utils/audioManager';

const STORAGE_KEY = 'mabo_lab_progress';

export const useGameStore = create<GameStore>((set, get) => {
  // 保存进度到 localStorage
  const saveProgress = () => {
    const state = get();
    const saveData: SaveData = {
      currentSceneId: state.currentSceneId,
      sceneHistory: state.sceneHistory,
      playerState: state.playerState,
      lastPlayed: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
    } catch (e) {
      console.warn('[GameStore] 保存进度失败:', e);
    }
  };

  // 注意：不在初始化时自动播放背景音乐
  // 浏览器要求用户必须先与页面交互才能播放音频
  // 背景音乐将在用户首次交互后通过 setAppPhase 启用

  return {
    // State
    appPhase: 'title',
    isAudioEnabled: true,
    isBackgroundMusicEnabled: false,
    currentSceneId: 'ch01_s01_welcome',
    sceneHistory: [],
    gameMode: 'dialogue' as GameMode,
    playerState: {
      score: 0,
      favorability: 0,
      completedScenes: [],
    },
    characterName: '曼波',

    // Actions
    setAppPhase: (phase) => {
      const currentPhase = get().appPhase;

      const bgmManager = getBackgroundMusicManager();
      const sceneAudioManager = getSceneAudioManager(get().isAudioEnabled);

      // 离开 title/chapters 去其他页面时，停止背景音乐
      if ((currentPhase === 'title' || currentPhase === 'chapters') &&
          (phase !== 'title' && phase !== 'chapters')) {
        bgmManager.stop();
        bgmManager.setEnabled(false);
        set({ isBackgroundMusicEnabled: false });
      }

      // 离开 game 时，停止场景语音
      if (currentPhase === 'game' && phase !== 'game') {
        sceneAudioManager.stop();
      }

      set({ appPhase: phase });
    },

    toggleAudio: () => {
      const newState = { isAudioEnabled: !get().isAudioEnabled };
      set(newState);

      if (!newState.isAudioEnabled) {
        getSceneAudioManager().setEnabled(false);
        getBackgroundMusicManager().stop();
        set({ isBackgroundMusicEnabled: false });
      } else {
        getSceneAudioManager().setEnabled(true);
      }
    },

    toggleBackgroundMusic: () => {
      const bgmManager = getBackgroundMusicManager();
      const currentState = get().isBackgroundMusicEnabled;

      if (currentState) {
        // 停止播放
        bgmManager.stop();
        bgmManager.setEnabled(false);
        set({ isBackgroundMusicEnabled: false });
      } else {
        // 开始播放（强制播放）
        bgmManager.setEnabled(true);
        bgmManager.play(true, true);
        set({ isBackgroundMusicEnabled: true });
      }
    },

    setCharacterName: (name: string) => set({ characterName: name }),

    goToScene: (sceneId: string, addToHistory: boolean = true) => {
      const current = get().currentSceneId;
      set((state) => ({
        currentSceneId: sceneId,
        sceneHistory: addToHistory
          ? [...state.sceneHistory, current]
          : state.sceneHistory,
      }));

      // 停止当前场景语音，播放新场景语音
      const sceneAudioManager = getSceneAudioManager(get().isAudioEnabled);
      sceneAudioManager.stop();
      sceneAudioManager.play(sceneId);

      // 自动保存进度
      saveProgress();
    },

    setGameMode: (mode: GameMode) => {
      set({ gameMode: mode });
    },

    goBack: () => {
      const history = get().sceneHistory;
      if (history.length > 0) {
        const previous = history[history.length - 1];
        set({
          currentSceneId: previous,
          sceneHistory: history.slice(0, -1),
        });

        // 停止当前场景语音，播放返回场景语音
        const sceneAudioManager = getSceneAudioManager(get().isAudioEnabled);
        sceneAudioManager.stop();
        sceneAudioManager.play(previous);
      }
    },

    updatePlayerState: (updates: Partial<PlayerState>) => {
      set((state) => ({
        playerState: { ...state.playerState, ...updates }
      }));
      // 自动保存进度
      saveProgress();
    },

    markSceneCompleted: (sceneId: string) => {
      set((state) => {
        const completedScenes = state.playerState.completedScenes;
        if (!completedScenes.includes(sceneId)) {
          return {
            playerState: {
              ...state.playerState,
              completedScenes: [...completedScenes, sceneId],
            }
          };
        }
        return state;
      });
    },

    resetGame: () => {
      set({
        appPhase: 'title',
        currentSceneId: 'ch01_s01_welcome',
        sceneHistory: [],
        playerState: {
          score: 0,
          favorability: 0,
          completedScenes: [],
        },
        isBackgroundMusicEnabled: false,
      });

      // 停止所有音频
      getSceneAudioManager().stop();
      getBackgroundMusicManager().stop();

      // 清除存档
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.warn('[GameStore] 清除存档失败:', e);
      }
    },

    hasSavedProgress: () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved !== null;
      } catch (e) {
        return false;
      }
    },

    loadProgress: () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return null;
        return JSON.parse(saved) as SaveData;
      } catch (e) {
        console.warn('[GameStore] 加载存档失败:', e);
        return null;
      }
    },

    continueGame: () => {
      const saved = get().loadProgress();
      if (!saved) return;

      set({
        currentSceneId: saved.currentSceneId,
        sceneHistory: saved.sceneHistory,
        playerState: saved.playerState,
        appPhase: 'game',
      });

      // 播放场景语音
      const sceneAudioManager = getSceneAudioManager(get().isAudioEnabled);
      sceneAudioManager.play(saved.currentSceneId);
    },
  };
});
