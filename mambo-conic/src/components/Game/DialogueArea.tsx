import { motion } from 'framer-motion';
import Mambo from '../Mambo/Mambo';
import Dialogue from '../Dialogue/Dialogue';
import ChoiceMenu from '../UI/ChoiceMenu';
import { Scene, ChoiceScene } from '../../types/scene.types';

interface DialogueAreaProps {
  scene: Scene;
  gameMode: string;
  handleNext: () => void;
  handleChoice: (choiceIndex: number) => void;
}

export function DialogueArea({ scene, gameMode, handleNext, handleChoice }: DialogueAreaProps) {
  return (
    <div className="flex gap-4 items-end pb-2">
      {/* 曼波立绘 - 实验模式下缩小 */}
      <motion.div
        className="flex-shrink-0 flex items-end justify-center"
        initial={false}
        animate={{
          width: gameMode === 'experiment' ? '160px' : '256px',
        }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          animate={gameMode === 'experiment' ? { scale: 0.7 } : { scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Mambo
            expression={scene.mambo?.expression}
            action={scene.mambo?.action}
            labelScale={gameMode === 'experiment' ? 0.7 : 1.2}
          />
        </motion.div>
      </motion.div>

      {/* 对话框与选项 */}
      <div className="flex-1 flex flex-col gap-4">
        {/* 对话气泡 */}
        <Dialogue
          className="sketch-border paper-texture rounded-lg p-6 relative w-full"
          content={scene.dialogue}
          onNext={scene.type === 'choice' ? undefined : handleNext}
        />

        {/* 选项菜单 - 独立于气泡显示 */}
        {scene.type === 'choice' && (
          <div className="w-full">
            <ChoiceMenu
              options={(scene as ChoiceScene).options}
              onChoice={handleChoice}
            />
          </div>
        )}
      </div>
    </div>
  );
}
