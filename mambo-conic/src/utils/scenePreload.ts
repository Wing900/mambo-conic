import type { ChapterData, Scene, DialogueScene, ChoiceScene } from '../types/scene.types';

export interface ScenePreloadTargets {
  imageUrls: string[];
  iframeUrls: string[];
}

function getSceneNextIds(scene: Scene): string[] {
  if (scene.type === 'dialogue') {
    const next = (scene as DialogueScene).next;
    return next ? [next] : [];
  }

  return ((scene as ChoiceScene).options || [])
    .map((option) => option.next)
    .filter((nextId): nextId is string => Boolean(nextId));
}

function collectSceneResourceUrls(scene: Scene, imageUrls: Set<string>, iframeUrls: Set<string>) {
  const blackboard = scene.blackboard;
  if (!blackboard) return;

  if (blackboard.type === 'image') {
    imageUrls.add(blackboard.src);
    return;
  }

  if (blackboard.type === 'iframe') {
    iframeUrls.add(blackboard.src);
    return;
  }

  if (blackboard.type === 'lab') {
    iframeUrls.add(`/labs/${blackboard.labType}/index.html`);
  }
}

export function collectLookAheadPreloadTargets(
  currentSceneId: string,
  scenesData: ChapterData,
  lookAhead: number = 3
): ScenePreloadTargets {
  const scenesMap = new Map<string, Scene>();
  for (const scene of scenesData.scenes) {
    scenesMap.set(scene.id, scene);
  }

  const imageUrls = new Set<string>();
  const iframeUrls = new Set<string>();
  const visited = new Set<string>();
  const queue: { sceneId: string; depth: number }[] = [{ sceneId: currentSceneId, depth: 0 }];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) break;

    const { sceneId, depth } = current;
    if (depth > lookAhead || visited.has(sceneId)) continue;
    visited.add(sceneId);

    const scene = scenesMap.get(sceneId);
    if (!scene) continue;

    collectSceneResourceUrls(scene, imageUrls, iframeUrls);

    if (depth < lookAhead) {
      const nextIds = getSceneNextIds(scene);
      for (const nextSceneId of nextIds) {
        queue.push({ sceneId: nextSceneId, depth: depth + 1 });
      }
    }
  }

  return {
    imageUrls: Array.from(imageUrls),
    iframeUrls: Array.from(iframeUrls),
  };
}
