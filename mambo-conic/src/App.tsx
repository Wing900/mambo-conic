import { useGameStore } from './store/useGameStore';
import chapter01 from './data/scenes/chapter01';
import chapter02 from './data/scenes/chapter02';
import chapter03 from './data/scenes/chapter03';
import type { ChapterData } from './types/scene.types';
import { logger } from './utils/logger';

const allScenesData: ChapterData = {
  chapter: 'all',
  scenes: [...chapter01.scenes, ...chapter02.scenes, ...chapter03.scenes],
};

// Screens
import TitleScreen from './components/Screens/TitleScreen';
import ChapterSelect from './components/Screens/ChapterSelect';

// Hooks
import { useSceneLoader } from './hooks/useSceneLoader';
import { useGameEntryPreloader } from './hooks/useGameEntryPreloader';

// Game Components
import { GameHeader } from './components/Game/GameHeader';
import { GameMain } from './components/Game/GameMain';
import { IframePreloader } from './components/Game/IframePreloader';
import { GameLoadingScreen } from './components/Game/GameLoadingScreen';

function App() {
  const { currentScene, handleNext, handleChoice } = useSceneLoader(allScenesData);
  const { appPhase, gameMode, currentSceneId } = useGameStore();
  const { isLoading: isEntryLoading, progress: loadingProgress } = useGameEntryPreloader({
    appPhase,
    currentSceneId,
    scenesData: allScenesData,
    lookAhead: 3,
    minLoadingMs: 650,
  });

  logger.debug('渲染, appPhase:', appPhase, 'gameMode:', gameMode);

  // --- 路由逻辑 ---

  if (appPhase === 'title') {
    return <TitleScreen />;
  }

  if (appPhase === 'chapters') {
    return <ChapterSelect />;
  }

  // --- 游戏主界面 ---

  if (appPhase === 'game' && (isEntryLoading || !currentScene)) {
    return <GameLoadingScreen progress={loadingProgress} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* 主容器 */}
      <div className="w-full max-w-6xl h-[90vh] flex flex-col gap-4">
        {/* 顶部信息栏 */}
        <GameHeader />

        {/* 黑板与对话区域 */}
        <GameMain
          scene={currentScene}
          gameMode={gameMode}
          handleNext={handleNext}
          handleChoice={handleChoice}
        />
      </div>

      {/* iframe 预加载 */}
      <IframePreloader currentSceneId={currentSceneId} scenesData={allScenesData} />
    </div>
  );
}

export default App;
