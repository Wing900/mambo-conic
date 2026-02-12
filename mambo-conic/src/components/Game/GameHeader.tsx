import { useGameStore } from '../../store/useGameStore';
import SettingsButton from '../UI/SettingsButton';

export function GameHeader() {
  const { sceneHistory, goBack, playerState, setAppPhase } = useGameStore();

  return (
    <div className="flex justify-between items-center px-2">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setAppPhase('chapters')}
          className="sketch-border bg-white px-3 py-1 rounded-full text-sm text-[#5D4E37] hover:bg-[#FFAB91] hover:text-white transition-colors"
        >
          ☰ 目录
        </button>

        {sceneHistory.length > 0 && (
          <button
            onClick={goBack}
            className="sketch-border bg-[#FFE4E1] px-3 py-1 rounded-full text-sm text-[#5D4E37] hover:bg-[#FFAB91] hover:text-white transition-colors"
          >
            ← 返回
          </button>
        )}
        <h1 className="text-2xl font-handwriting text-[#5D4E37] hidden md:block">
          曼波带你学圆锥曲线
        </h1>
      </div>
      <div className="flex gap-4 items-center text-sm text-[#5D4E37]/70">
        <span>得分: {playerState.score}</span>
        <SettingsButton />
      </div>
    </div>
  );
}
