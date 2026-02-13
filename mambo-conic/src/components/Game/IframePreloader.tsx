import { useMemo } from 'react';
import type { ChapterData, Scene, DialogueScene, ChoiceScene } from '../../types/scene.types';

interface IframePreloaderProps {
  currentSceneId: string;
  scenesData: ChapterData;
  lookAhead?: number;
}

/** 从场景的 blackboard 中提取需要预加载的 URL */
function getPreloadUrl(scene: Scene): string | null {
  const bb = scene.blackboard;
  if (!bb) return null;
  if (bb.type === 'iframe') return bb.src;
  if (bb.type === 'lab') return `/labs/${bb.labType}/index.html`;
  return null;
}

/**
 * 预加载即将到来的 iframe / lab 场景。
 * 在当前场景前方 lookAhead 步内，找到所有需要 iframe 的 URL，
 * 用隐藏的 iframe 提前加载，切换时秒开。
 */
export function IframePreloader({ currentSceneId, scenesData, lookAhead = 3 }: IframePreloaderProps) {
  const scenesMap = useMemo(() => {
    const map = new Map<string, Scene>();
    for (const scene of scenesData.scenes) {
      map.set(scene.id, scene);
    }
    return map;
  }, [scenesData]);

  const preloadUrls = useMemo(() => {
    const urls = new Set<string>();
    const visited = new Set<string>();

    // 当前场景已在显示的 URL，不需要预加载
    const currentScene = scenesMap.get(currentSceneId);
    const currentUrl = currentScene ? getPreloadUrl(currentScene) : null;

    // BFS 向前探索
    const queue: { sceneId: string; depth: number }[] = [];

    if (currentScene) {
      if (currentScene.type === 'dialogue') {
        const next = (currentScene as DialogueScene).next;
        if (next) queue.push({ sceneId: next, depth: 1 });
      } else if (currentScene.type === 'choice') {
        for (const opt of (currentScene as ChoiceScene).options || []) {
          if (opt.next) queue.push({ sceneId: opt.next, depth: 1 });
        }
      }
    }

    while (queue.length > 0) {
      const { sceneId, depth } = queue.shift()!;
      if (depth > lookAhead || visited.has(sceneId)) continue;
      visited.add(sceneId);

      const scene = scenesMap.get(sceneId);
      if (!scene) continue;

      const url = getPreloadUrl(scene);
      if (url && url !== currentUrl) {
        urls.add(url);
      }

      if (depth < lookAhead) {
        if (scene.type === 'dialogue') {
          const next = (scene as DialogueScene).next;
          if (next) queue.push({ sceneId: next, depth: depth + 1 });
        } else if (scene.type === 'choice') {
          for (const opt of (scene as ChoiceScene).options || []) {
            if (opt.next) queue.push({ sceneId: opt.next, depth: depth + 1 });
          }
        }
      }
    }

    return Array.from(urls);
  }, [currentSceneId, scenesMap, lookAhead]);

  if (preloadUrls.length === 0) return null;

  return (
    <>
      {preloadUrls.map(url => (
        <iframe
          key={url}
          src={url}
          style={{
            position: 'absolute',
            width: 0,
            height: 0,
            border: 'none',
            visibility: 'hidden',
            pointerEvents: 'none',
          }}
          tabIndex={-1}
          aria-hidden="true"
          title="preload"
        />
      ))}
    </>
  );
}
