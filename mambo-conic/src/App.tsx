import { useGameStore } from './store/useGameStore';
import scenesData from './data/scenes/chapter01';
import { logger } from './utils/logger';

// Screens
import TitleScreen from './components/Screens/TitleScreen';
import ChapterSelect from './components/Screens/ChapterSelect';

// Hooks
import { useSceneLoader } from './hooks/useSceneLoader';

// Game Components
import { GameHeader } from './components/Game/GameHeader';
import { GameMain } from './components/Game/GameMain';

function App() {
  const { currentScene, handleNext, handleChoice } = useSceneLoader(scenesData);
  const { appPhase, gameMode } = useGameStore();

  logger.debug('渲染, appPhase:', appPhase, 'gameMode:', gameMode);

  // --- 路由逻辑 ---

  if (appPhase === 'title') {
    return <TitleScreen />;
  }

  if (appPhase === 'chapters') {
    return <ChapterSelect />;
  }

  // --- 游戏主界面 ---

  if (!currentScene) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#5D4E37] text-xl">加载中...</div>
      </div>
    );
  }

  return (
    <div className="minh-screen flex flex-col items-center justify-center p-4">
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
    </div>
  );
}

export default App;
