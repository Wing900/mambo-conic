import { useEffect, useRef, useState } from 'react';
import type { ChapterData } from '../types/scene.types';
import type { AppPhase } from '../types/store.types';
import { MAMBO_IMAGE_URLS } from '../constants/mamboAssets';
import { collectLookAheadPreloadTargets } from '../utils/scenePreload';

interface UseGameEntryPreloaderOptions {
  appPhase: AppPhase;
  currentSceneId: string;
  scenesData: ChapterData;
  lookAhead?: number;
  minLoadingMs?: number;
}

interface EntryPreloadState {
  isLoading: boolean;
  progress: number;
}

interface CleanupHandle {
  cleanup: () => void;
  promise: Promise<void>;
}

function preloadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    const done = () => resolve();

    img.onload = done;
    img.onerror = done;
    img.decoding = 'async';
    img.src = url;

    if (img.complete) {
      resolve();
    }
  });
}

function preloadIframe(url: string, timeoutMs: number = 6000): CleanupHandle {
  if (typeof document === 'undefined') {
    return { cleanup: () => undefined, promise: Promise.resolve() };
  }

  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.tabIndex = -1;
  iframe.style.position = 'absolute';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';
  iframe.style.visibility = 'hidden';
  iframe.style.pointerEvents = 'none';

  let settled = false;
  const settle = (resolver: () => void) => {
    if (settled) return;
    settled = true;
    iframe.onload = null;
    iframe.onerror = null;
    if (iframe.parentNode) {
      iframe.parentNode.removeChild(iframe);
    }
    resolver();
  };

  const promise = new Promise<void>((resolve) => {
    const timer = window.setTimeout(() => {
      settle(resolve);
    }, timeoutMs);

    iframe.onload = () => {
      window.clearTimeout(timer);
      settle(resolve);
    };
    iframe.onerror = () => {
      window.clearTimeout(timer);
      settle(resolve);
    };
  });

  document.body.appendChild(iframe);
  iframe.src = url;

  return {
    cleanup: () => {
      if (settled) return;
      settled = true;
      iframe.onload = null;
      iframe.onerror = null;
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    },
    promise,
  };
}

export function useGameEntryPreloader({
  appPhase,
  currentSceneId,
  scenesData,
  lookAhead = 3,
  minLoadingMs = 600,
}: UseGameEntryPreloaderOptions): EntryPreloadState {
  const previousPhaseRef = useRef<AppPhase>(appPhase);
  const [state, setState] = useState<EntryPreloadState>({ isLoading: false, progress: 0 });

  useEffect(() => {
    const previousPhase = previousPhaseRef.current;
    previousPhaseRef.current = appPhase;

    const isEnteringGame = previousPhase !== 'game' && appPhase === 'game';
    if (!isEnteringGame) return;

    let isCancelled = false;
    const iframeCleanups: Array<() => void> = [];
    const startAt = Date.now();

    const runPreload = async () => {
      setState({ isLoading: true, progress: 0 });

      const sceneTargets = collectLookAheadPreloadTargets(currentSceneId, scenesData, lookAhead);
      const imageUrls = Array.from(new Set([...MAMBO_IMAGE_URLS, ...sceneTargets.imageUrls]));
      const iframeUrls = sceneTargets.iframeUrls;

      const total = imageUrls.length + iframeUrls.length;
      let completed = 0;

      const markCompleted = () => {
        completed += 1;
        const progress = total === 0 ? 100 : Math.round((completed / total) * 100);
        if (!isCancelled) {
          setState((prev) => ({ ...prev, progress }));
        }
      };

      const imageJobs = imageUrls.map((url) =>
        preloadImage(url).finally(() => {
          markCompleted();
        })
      );

      const iframeJobs = iframeUrls.map((url) => {
        const handle = preloadIframe(url);
        iframeCleanups.push(handle.cleanup);
        return handle.promise.finally(() => {
          markCompleted();
        });
      });

      await Promise.allSettled([...imageJobs, ...iframeJobs]);

      const elapsed = Date.now() - startAt;
      if (elapsed < minLoadingMs) {
        await new Promise((resolve) => window.setTimeout(resolve, minLoadingMs - elapsed));
      }

      if (!isCancelled) {
        setState({ isLoading: false, progress: 100 });
      }
    };

    void runPreload();

    return () => {
      isCancelled = true;
      for (const cleanup of iframeCleanups) {
        cleanup();
      }
    };
  }, [appPhase, currentSceneId, lookAhead, minLoadingMs, scenesData]);

  return state;
}
