import { useMemo } from 'react';
import type { ChapterData } from '../types/scene.types';
import { getChapterBySceneId } from '../constants/chapters';
import { CHAPTER_PROGRESS_CONFIG } from '../data/progress/chapterProgressConfig';

interface ChapterProgressResult {
  chapterTitle: string;
  currentUnit: number;
  totalUnits: number;
  maxAdjustableUnit: number;
  getSceneIdByUnit: (unit: number) => string | null;
}

export function useChapterProgress(
  scenesData: ChapterData,
  currentSceneId: string,
  sceneHistory: string[]
): ChapterProgressResult {
  return useMemo(() => {
    const chapter = getChapterBySceneId(currentSceneId);
    const fallback: ChapterProgressResult = {
      chapterTitle: '学习进度',
      currentUnit: 0,
      totalUnits: 0,
      maxAdjustableUnit: 0,
      getSceneIdByUnit: () => null,
    };

    if (!chapter) return fallback;

    const chapterConfig = CHAPTER_PROGRESS_CONFIG[chapter.id] || [];
    const existingSceneIds = new Set(
      scenesData.scenes
        .filter((scene) => scene.id.startsWith(chapter.scenePrefix))
        .map((scene) => scene.id)
    );
    const units: string[] = [];
    for (const point of chapterConfig) {
      if (!existingSceneIds.has(point.sceneId)) continue;
      const unitCount = point.units && point.units > 0 ? Math.floor(point.units) : 1;
      for (let i = 0; i < unitCount; i += 1) {
        units.push(point.sceneId);
      }
    }

    if (units.length === 0) return fallback;

    const sceneHistorySet = new Set(sceneHistory);
    const sceneVisited = (sceneId: string) => sceneHistorySet.has(sceneId) || sceneId === currentSceneId;

    let currentUnit = 0;
    let maxAdjustableUnit = 0;
    for (let i = 0; i < units.length; i += 1) {
      if (sceneVisited(units[i])) {
        maxAdjustableUnit = i + 1;
      }
      if (units[i] === currentSceneId) {
        currentUnit = i + 1;
      }
    }

    if (currentUnit === 0) {
      currentUnit = maxAdjustableUnit;
    }

    return {
      chapterTitle: chapter.title,
      currentUnit,
      totalUnits: units.length,
      maxAdjustableUnit: Math.max(maxAdjustableUnit, currentUnit),
      getSceneIdByUnit: (unit: number) => {
        if (unit < 1 || unit > units.length) return null;
        return units[unit - 1] || null;
      },
    };
  }, [currentSceneId, sceneHistory, scenesData]);
}
