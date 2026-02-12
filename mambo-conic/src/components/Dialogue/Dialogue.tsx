import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dialogueTransition } from '../../utils/animations';
import { useGameStore } from '../../store/useGameStore';
import { DialogueProps } from '../../types/component.types';

export default function Dialogue({ content, onNext, onComplete, className = '' }: DialogueProps) {
  const { characterName } = useGameStore();
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [showContinueIndicator, setShowContinueIndicator] = useState(false);

  const text = content?.text || '';
  const speaker = content?.speaker || characterName;
  const speed = content?.speed || 50; // 每个字符的延迟（毫秒）

  // 打字机效果
  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    setShowContinueIndicator(false);

    if (!text) {
      setIsComplete(true);
      return;
    }

    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
        setTimeout(() => setShowContinueIndicator(true), 300);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  // 通知父组件打字完成
  useEffect(() => {
    if (isComplete && onComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  // 处理点击
  const handleClick = useCallback(() => {
    if (!isComplete) {
      setDisplayedText(text);
      setIsComplete(true);
      setShowContinueIndicator(true);
    } else if (onNext) {
      onNext();
    }
  }, [isComplete, text, onNext]);

  return (
    <motion.div
      className={`relative flex flex-col cursor-pointer select-none ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      {...dialogueTransition.container}
    >
      {/* 气泡尾巴 - 指向左侧曼波 */}
      <div className="absolute -left-3 bottom-8 w-6 h-6 bg-white border-l-2 border-b-2 border-warm-brown/30 transform rotate-45 z-10 paper-texture" />

      {speaker && (
        <motion.div
          className="mb-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <span className="inline-block bg-soft-pink px-4 py-1.5 rounded-full text-sm font-handwriting shadow-soft">
            {speaker}
          </span>
        </motion.div>
      )}

      <div className="flex-1 text-warm-brown text-lg leading-relaxed relative">
        {/* 占位文本 - 用于预先计算高度 */}
        <p className="invisible pointer-events-none" aria-hidden="true">
          {text}
          <span className="inline-block ml-1">▎</span>
        </p>

        {/* 实际显示的打字机文本 */}
        <motion.p
          {...dialogueTransition.text}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="absolute top-0 left-0 w-full"
        >
          {displayedText}
          <AnimatePresence>
            {!isComplete && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [1, 0, 1] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block ml-1 text-coral"
              >
                ▎
              </motion.span>
            )}
          </AnimatePresence>
        </motion.p>
      </div>

      <AnimatePresence>
        {showContinueIndicator && onNext && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="flex justify-end mt-2 text-coral text-sm font-handwriting"
          >
            点击继续 ▶
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isComplete ? 0.5 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-coral/5 to-transparent" />
      </motion.div>
    </motion.div>
  );
}
