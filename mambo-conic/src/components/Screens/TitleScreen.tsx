import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import Button from '../UI/Button';
import Mambo from '../Mambo/Mambo';

export default function TitleScreen() {
  const { setAppPhase, isAudioEnabled, toggleAudio, toggleBackgroundMusic, isBackgroundMusicEnabled, hasSavedProgress, continueGame } = useGameStore();
  const [showAbout, setShowAbout] = useState(false);

  const hasSaved = hasSavedProgress();

  return (
    <div className="w-full h-screen flex items-center justify-center p-4">
      {/* 核心中央画板 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl sketch-border paper-texture bg-white/80 p-16 flex flex-col items-center relative shadow-paper"
      >
        {/* 左上角小装饰 */}
        <div className="absolute top-6 left-8 font-handwriting text-warm-brown/30 text-xl -rotate-12 select-none">
          Math & Fun
        </div>

        {/* 右上角关于按钮 */}
        <div className="absolute top-5 right-6">
          <button
            onClick={() => setShowAbout(!showAbout)}
            className="text-warm-brown/30 hover:text-warm-brown/60 transition-colors text-xs font-body tracking-wide"
          >
            About
          </button>
          <AnimatePresence>
            {showAbout && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-8 sketch-border paper-texture bg-white/90 rounded-xl shadow-paper px-5 py-4 min-w-[210px] z-50"
              >
                <p className="font-handwriting text-warm-brown text-sm mb-3">SCNU · Mabo Lab</p>
                <div className="text-xs font-body text-warm-brown/60 space-y-1.5">
                  <div className="flex justify-between gap-6">
                    <span className="text-warm-brown/35">Team</span>
                    <span className="text-warm-brown/70">Bin & Wjszbd</span>
                  </div>
                  <div className="flex justify-between gap-6">
                    <span className="text-warm-brown/35">Mail</span>
                    <span className="text-warm-brown/70">2249381074@qq.com</span>
                  </div>
                  <div className="flex justify-between gap-6">
                    <span className="text-warm-brown/35">Year</span>
                    <span className="text-warm-brown/70">2026</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 标题区 */}
        <div className="text-center mb-10">
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-7xl font-handwriting text-warm-brown mb-2"
          >
            Mabo Lab
          </motion.h1>
          <div className="h-1 w-32 bg-coral/30 mx-auto rounded-full" />
          <p className="mt-4 text-warm-brown/60 tracking-widest font-body uppercase text-sm">
            圆锥曲线探索实验室
          </p>
        </div>

        {/* 中间角色区 */}
        <div className="mb-12 relative h-56 flex items-center justify-center">
          <motion.div

            className="w-48 h-48"
            animate={{
                y: [0, -10, 0],
                rotate: [0, 2, 0]
            }}
            transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }}
          >
            <Mambo expression="happy" action="bounce" />
          </motion.div>

          {/* 气泡对话 - 更加紧凑 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -right-24 top-8 bg-soft-pink px-5 py-3 rounded-2xl shadow-sm border border-warm-brown/10"
          >
            <span className="font-handwriting text-warm-brown text-base">嗨！等你很久啦~</span>
            <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[12px] border-r-soft-pink" />
          </motion.div>
        </div>

        {/* 挥挥区 - 垂直堆叠，保持整齐 */}
        <div className="flex flex-col gap-4 w-64">
          {hasSaved && (
            <Button onClick={continueGame} variant="secondary" size="lg">
              继续上次进度
            </Button>
          )}
          <Button onClick={() => setAppPhase('chapters')} variant="primary" size="lg">
            进入实验室
          </Button>

          <div className="flex gap-3 justify-center">
            <button
              onClick={toggleBackgroundMusic}
              className="text-warm-brown/50 hover:text-coral transition-colors flex items-center justify-center gap-2 text-sm font-body"
            >
              <span>{isBackgroundMusicEnabled ? '🎵' : '🔇'}</span>
              <span>背景音乐</span>
            </button>

            <button
              onClick={toggleAudio}
              className="text-warm-brown/50 hover:text-coral transition-colors flex items-center justify-center gap-2 text-sm font-body"
            >
              <span>{isAudioEnabled ? '🔊' : '🔇'}</span>
              <span>语音</span>
            </button>
          </div>
        </div>

        {/* 底部脚注 */}
        <div className="absolute bottom-6 font-body text-[10px] text-warm-brown/20 uppercase tracking-tighter">
          Interactive Geometry Learning Tool • 2026
        </div>
      </motion.div>
    </div>
  );
}
