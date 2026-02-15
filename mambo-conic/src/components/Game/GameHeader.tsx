import { useGameStore } from '../../store/useGameStore';
import SettingsButton from '../UI/SettingsButton';
import ProgressBar from '../UI/ProgressBar';

interface GameHeaderProps {
  progress?: {
    label: string;
    current: number;
    total: number;
    maxAdjustable: number;
  };
  onAdjustProgress?: (value: number) => void;
}

export function GameHeader({ progress, onAdjustProgress }: GameHeaderProps) {
  const { sceneHistory, goBack, playerState, setAppPhase } = useGameStore();

  return (
    <div className="px-2 group">
      <div className="flex justify-between items-center">
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
              ← 返回上一场景
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

      {progress && progress.total > 0 && (
        <div className="max-h-0 opacity-0 overflow-hidden pointer-events-none transition-all duration-200 [transition-delay:0ms] group-hover:[transition-delay:200ms] group-focus-within:[transition-delay:200ms] group-hover:max-h-12 group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:max-h-12 group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-hover:mt-1.5 group-focus-within:mt-1.5">
          <ProgressBar
            current={progress.current}
            total={progress.total}
            label={progress.label}
            showLabel
            height="h-1.5"
            compact
            icon="✦"
            interactive={progress.maxAdjustable > 0}
            maxAdjustable={progress.maxAdjustable}
            onAdjust={onAdjustProgress}
          />
        </div>
      )}
    </div>
  );
}
