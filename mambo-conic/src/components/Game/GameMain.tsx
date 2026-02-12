import { BlackboardArea } from './BlackboardArea';
import { DialogueArea } from './DialogueArea';
import { Scene } from '../../types/scene.types';

interface GameMainProps {
  scene: Scene;
  gameMode: string;
  handleNext: () => void;
  handleChoice: (choiceIndex: number) => void;
}

export function GameMain({ scene, gameMode, handleNext, handleChoice }: GameMainProps) {
  return (
    <>
      {/* 黑板区域 - 上半部分 - 允许收缩但保持最小高度 */}
      <BlackboardArea blackboard={scene.blackboard} />

      {/* 角色与对话区域 - 下半部分 - 自适应高度 */}
      <DialogueArea
        scene={scene}
        gameMode={gameMode}
        handleNext={handleNext}
        handleChoice={handleChoice}
      />
    </>
  );
}
