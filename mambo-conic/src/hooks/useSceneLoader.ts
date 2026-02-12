import { useState, useEffect } from 'react';
import { Scene, DialogueScene, ChoiceScene } from '../types/scene.types';
import { SceneEngine } from '../utils/SceneEngine';
import { useGameStore } from '../store/useGameStore';
import { createLogger } from '../utils/logger';

const logger = createLogger('SceneLoader');

export function useSceneLoader(scenesData: any) {
  const [engine] = useState(() => new SceneEngine(scenesData));
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);

  const {
    currentSceneId,
    setGameMode,
  } = useGameStore();

  // 验证场景数据（开发阶段）
  useEffect(() => {
    const errors = engine.validateScenes();
    if (errors.length > 0) {
      logger.warn('Scene validation warnings:', errors);
    }
  }, [engine]);

  // 加载场景
  useEffect(() => {
    logger.info('加载场景:', currentSceneId);
    const scene = engine.getScene(currentSceneId);
    setCurrentScene(scene);
    logger.debug('场景类型:', scene?.type, '黑板类型:', scene?.blackboard?.type);

    // 根据黑板内容类型自动切换游戏模式
    if (scene?.blackboard?.type === 'lab') {
      logger.debug('切换到实验模式');
      setGameMode('experiment');
    } else {
      logger.debug('切换到对话模式');
      setGameMode('dialogue');
    }
  }, [currentSceneId, engine, setGameMode]);

  const handleNext = () => {
    if (currentScene?.type === 'dialogue' && (currentScene as DialogueScene).next) {
      const { goToScene } = useGameStore.getState();
      goToScene((currentScene as DialogueScene).next || '');
    }
  };

  const handleChoice = (choiceIndex: number) => {
    const nextSceneId = engine.getNextScene(currentScene!, choiceIndex);
    const selectedOption = (currentScene as ChoiceScene).options?.[choiceIndex];

    // 如果有分数变化，更新玩家状态
    if (selectedOption?.scoreChange) {
      const { updatePlayerState, playerState } = useGameStore.getState();
      updatePlayerState({
        score: playerState.score + selectedOption.scoreChange
      });
    }

    if (nextSceneId) {
      const { goToScene } = useGameStore.getState();
      goToScene(nextSceneId);
    }
  };

  return {
    currentScene,
    handleNext,
    handleChoice,
  };
}
