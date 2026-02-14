import { useMemo } from 'react';
import type { ChapterData } from '../../types/scene.types';
import { collectLookAheadPreloadTargets } from '../../utils/scenePreload';

interface IframePreloaderProps {
  currentSceneId: string;
  scenesData: ChapterData;
  lookAhead?: number;
}

export function IframePreloader({ currentSceneId, scenesData, lookAhead = 3 }: IframePreloaderProps) {
  const preloadUrls = useMemo(() => {
    const { iframeUrls } = collectLookAheadPreloadTargets(currentSceneId, scenesData, lookAhead);
    return iframeUrls;
  }, [currentSceneId, scenesData, lookAhead]);

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
