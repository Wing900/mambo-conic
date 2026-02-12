import { audioLogger } from './logger';

// 音频格式列表，按优先级顺序
const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.m4a', '.ogg'];

// 背景音乐路径
const BACKGROUND_MUSIC_PATH = '/labmusic/backmusic.mp3';

/**
 * 从场景 ID 提取章节 ID
 * 例如: ch01_s1_welcome -> ch01
 */
function extractChapterId(sceneId: string): string {
  const match = sceneId.match(/^ch\d+/);
  return match ? match[0] : '';
}

/**
 * 获取场景语音的 URL（按优先级顺序检查）
 * @param sceneId 场景 ID
 * @returns 音频 URL 或 null
 */
export function getSceneAudioUrl(sceneId: string): string | null {
  const chapterId = extractChapterId(sceneId);
  if (!chapterId) {
    return null;
  }
  return `/labmusic/${chapterId}/${sceneId}.mp3`;
}

/**
 * 尝试所有格式获取场景语音 URL
 * 用于播放时按顺序尝试
 */
export function getAllPossibleSceneUrls(sceneId: string): string[] {
  const chapterId = extractChapterId(sceneId);
  if (!chapterId) {
    return [];
  }
  return AUDIO_EXTENSIONS.map(ext => `/labmusic/${chapterId}/${sceneId}${ext}`);
}

/**
 * 获取背景音乐 URL
 */
export function getBackgroundMusicUrl(): string {
  return BACKGROUND_MUSIC_PATH;
}

/**
 * 音频管理器类 - 管理场景语音
 */
export class SceneAudioManager {
  private currentAudio: HTMLAudioElement | null = null;
  private enabled: boolean = true;
  private currentSceneId: string = '';

  constructor(enabled: boolean = true) {
    this.enabled = enabled;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  /**
   * 播放场景语音
   * @param sceneId 场景 ID
   * @returns 是否成功开始播放
   */
  async play(sceneId: string): Promise<boolean> {
    if (!this.enabled) {
      return false;
    }

    this.stop();
    this.currentSceneId = sceneId;

    // 按优先级尝试不同格式
    const urls = getAllPossibleSceneUrls(sceneId);

    for (const url of urls) {
      try {
        const audio = new Audio(url);

        // 设置超时，如果文件不存在或加载太慢
        const loadPromise = new Promise<boolean>((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error('Audio load timeout'));
          }, 3000);

          audio.addEventListener('canplaythrough', () => {
            clearTimeout(timeoutId);
            resolve(true);
          });

          audio.addEventListener('error', () => {
            clearTimeout(timeoutId);
            reject(new Error('Audio load error'));
          });

          // 触发加载
          audio.load();
        });

        await loadPromise;

        // 加载成功，开始播放
        this.currentAudio = audio;
        await this.currentAudio.play();
        return true;
      } catch (error) {
        // 当前格式失败，尝试下一个
        continue;
      }
    }

    return false;
  }

  /**
   * 停止当前播放的音频
   */
  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    this.currentSceneId = '';
  }

  /**
   * 暂停当前播放的音频
   */
  pause(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
    }
  }

  /**
   * 恢复播放
   */
  resume(): void {
    if (this.currentAudio && this.enabled) {
      this.currentAudio.play().catch(err => audioLogger.warn('Failed to resume audio', err));
    }
  }

  /**
   * 获取当前播放的场景 ID
   */
  getCurrentSceneId(): string {
    return this.currentSceneId;
  }

  /**
   * 检查是否正在播放
   */
  isPlaying(): boolean {
    return this.currentAudio !== null && !this.currentAudio.paused;
  }

  /**
   * 清理资源
   */
  destroy(): void {
    this.stop();
  }
}

/**
 * 背景音乐管理器类
 */
export class BackgroundMusicManager {
  private audio: HTMLAudioElement | null = null;
  private enabled: boolean = false;
  private isPlaying: boolean = false;
  private hasUserInteracted: boolean = false;

  constructor() {
    // 默认不播放背景音乐
    this.enabled = false;

    // 监听用户交互事件
    const interactionEvents = ['click', 'keydown', 'touchstart', 'mousedown'];
    const handleInteraction = () => {
      this.hasUserInteracted = true;
      interactionEvents.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };
    interactionEvents.forEach(event => {
      document.addEventListener(event, handleInteraction, { once: true });
    });
  }

  /**
   * 设置是否启用背景音乐
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  /**
   * 播放背景音乐
   * @param loop 是否循环播放（默认 true）
   * @param force 是否强制播放（跳过用户交互检查）
   */
  async play(loop: boolean = true, force: boolean = false): Promise<boolean> {
    if (!this.enabled || this.isPlaying) {
      return this.isPlaying;
    }

    // 检查用户是否已交互（除非强制播放）
    if (!this.hasUserInteracted && !force) {
      return false;
    }

    try {
      // 如果已有音频实例，先停止
      if (this.audio) {
        this.stop();
      }

      this.audio = new Audio(BACKGROUND_MUSIC_PATH);
      this.audio.loop = loop;
      this.audio.volume = 0.5; // 背景音乐音量调低
      await this.audio.play();
      this.isPlaying = true;
      return true;
    } catch (error) {
      // 静默处理用户未交互和播放中断错误
      const errorName = (error as Error).name;
      if (errorName === 'NotAllowedError' || errorName === 'AbortError') {
        // 这些是预期的错误，不打印警告
        return false;
      }
      audioLogger.warn('Failed to play background music:', error);
      return false;
    }
  }

  /**
   * 停止背景音乐
   */
  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
    this.isPlaying = false;
  }

  /**
   * 暂停背景音乐
   */
  pause(): void {
    if (this.audio) {
      this.audio.pause();
    }
  }

  /**
   * 恢复播放背景音乐
   */
  resume(): void {
    if (this.audio && this.enabled && !this.isPlaying) {
      this.audio.play().catch(err => audioLogger.warn('Failed to resume background music', err));
      this.isPlaying = true;
    }
  }

  /**
   * 设置音量 (0-1)
   */
  setVolume(volume: number): void {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * 检查是否正在播放
   */
  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }
}

// 全局单例
let globalSceneAudioManager: SceneAudioManager | null = null;
let globalBackgroundMusicManager: BackgroundMusicManager | null = null;

export function getSceneAudioManager(enabled: boolean = true): SceneAudioManager {
  if (!globalSceneAudioManager) {
    globalSceneAudioManager = new SceneAudioManager(enabled);
  } else {
    globalSceneAudioManager.setEnabled(enabled);
  }
  return globalSceneAudioManager;
}

export function getBackgroundMusicManager(): BackgroundMusicManager {
  if (!globalBackgroundMusicManager) {
    globalBackgroundMusicManager = new BackgroundMusicManager();
  }
  return globalBackgroundMusicManager;
}
