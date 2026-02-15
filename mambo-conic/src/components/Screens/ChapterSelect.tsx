import { motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { CHAPTERS } from '../../constants/chapters';

export default function ChapterSelect() {
  const { setAppPhase, goToScene, toggleBackgroundMusic, isBackgroundMusicEnabled } = useGameStore();

  const handleStartChapter = (startScene: string) => {
    goToScene(startScene);
    setAppPhase('game');
  };

  return (
    <div className="w-full h-full flex flex-col p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setAppPhase('title')}
            className="text-warm-brown hover:text-coral transition-colors font-bold text-xl"
          >
            ← 返回
          </button>
          <h2 className="text-3xl font-handwriting text-warm-brown">学习目录</h2>
        </div>

        <button
          onClick={toggleBackgroundMusic}
          className="text-warm-brown/50 hover:text-coral transition-colors flex items-center gap-2 text-sm font-body"
        >
          <span>{isBackgroundMusicEnabled ? '🎵' : '🔇'}</span>
          <span>背景音乐</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CHAPTERS.map((chapter, index) => (
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
                relative p-6 rounded-xl border-2 
                ${chapter.locked 
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60' 
                    : 'border-warm-brown/20 bg-white shadow-paper hover:shadow-lg hover:-translate-y-1 cursor-pointer group'
                }
                transition-all duration-300
            `}
            onClick={() => !chapter.locked && handleStartChapter(chapter.startScene)}
          >
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-warm-brown group-hover:text-coral transition-colors">
                    {chapter.title}
                </h3>
                {chapter.locked && <span className="text-xl">🔒</span>}
            </div>
            <p className="text-warm-brown/70 leading-relaxed">
                {chapter.description}
            </p>
            
            {!chapter.locked && (
                <div className="mt-4 flex justify-end">
                    <span className="text-coral font-handwriting opacity-0 group-hover:opacity-100 transition-opacity">
                        点击开始 ▶
                    </span>
                </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
