import { motion } from 'framer-motion';

interface GameLoadingScreenProps {
  progress: number;
}

export function GameLoadingScreen({ progress }: GameLoadingScreenProps) {
  const displayProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[90vh] flex items-center justify-center">
        <div className="w-full max-w-2xl sketch-border paper-texture rounded-lg p-8 md:p-10">
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-handwriting text-warm-brown">
              游戏加载中
            </h2>

            <div className="flex items-center justify-center gap-2 text-coral">
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  className="inline-block w-3 h-3 rounded-full bg-coral"
                  animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: dot * 0.15,
                  }}
                />
              ))}
            </div>

            <div className="w-full max-w-lg mx-auto">
              <div className="h-3 rounded-full bg-white/70 border border-warm-brown/20 overflow-hidden">
                <motion.div
                  className="h-full bg-coral"
                  initial={false}
                  animate={{ width: `${displayProgress}%` }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                />
              </div>
              <p className="mt-2 text-sm text-warm-brown/70 font-body">
                正在准备立绘和实验内容... {displayProgress}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
