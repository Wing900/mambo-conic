import { Scene, ChapterData } from '../types/scene.types';
import { createLogger } from './logger';

const logger = createLogger('SceneEngine');

/**
 * 场景引擎 - 解析并管理场景数据
 */
export class SceneEngine {
  private scenes: Map<string, Scene>;

  constructor(scenesData: ChapterData) {
    this.scenes = new Map(
      scenesData.scenes.map(scene => [scene.id, scene])
    );
  }

  // 获取场景
  getScene(sceneId: string): Scene {
    const scene = this.scenes.get(sceneId);
    if (!scene) {
      logger.error(`Scene not found: ${sceneId}`);
      return this.scenes.get('error') || this.createErrorScene(sceneId);
    }
    return scene;
  }

  // 创建错误场景
  private createErrorScene(sceneId: string): Scene {
    return {
      id: 'error',
      type: 'dialogue',
      mambo: { expression: 'sad' },
      dialogue: {
        text: `啊哦，找不到场景：${sceneId}`,
      },
      next: 'start',
    };
  }

  // 获取下一个场景ID
  getNextScene(currentScene: Scene, choice: number | null = null): string | undefined {
    if (currentScene.type === 'choice' && choice !== null) {
      return currentScene.options[choice]?.next;
    }
    if (currentScene.type === 'dialogue') {
      return currentScene.next ?? undefined;
    }
    return undefined;
  }

  // 验证场景完整性
  validateScenes(): string[] {
    const errors: string[] = [];

    this.scenes.forEach((scene, id) => {
      if (!scene.type) {
        errors.push(`Scene ${id}: missing type`);
      }
      if (scene.type === 'dialogue' && scene.next && !this.scenes.has(scene.next)) {
        errors.push(`Scene ${id}: next scene "${scene.next}" not found`);
      }
      if (scene.type === 'choice' && scene.options) {
        scene.options.forEach((option, index) => {
          if (option.next && !this.scenes.has(option.next)) {
            errors.push(`Scene ${id}: option ${index} next "${option.next}" not found`);
          }
        });
      }
    });
    return errors;
  }
}
