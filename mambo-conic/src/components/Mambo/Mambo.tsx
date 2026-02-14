import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { mamboTransition } from '../../utils/animations';
import { useGameStore } from '../../store/useGameStore';
import { MamboExpression, MamboAction } from '../../types/scene.types';
import { MamboProps } from '../../types/component.types';
import { MAMBO_EXPRESSION_IMAGES } from '../../constants/mamboAssets';

const placeholderSvg = (expression: MamboExpression, name: string): string =>
  `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300"%3E%3Crect fill="%23FFE4E1" width="200" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%235D4E37" font-size="16"%3E${name}${expression === 'happy' ? '😊' : expression === 'sad' ? '😢' : expression === 'thinking' ? '🤔' : '😊'}%3C/text%3E%3C/svg%3E`;

const actionVariants: Record<MamboAction, any> = {
  bounce: {
    y: [0, -20, 0],
    transition: {
      duration: 0.5,
      repeat: 2,
      ease: "easeInOut"
    }
  },
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  },
  idle: {
    y: [0, -5, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  excited: {
    scale: [1, 1.1, 1],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 0.6,
      repeat: 2,
      ease: "easeInOut"
    }
  }
};

type AvatarEmojis = Record<MamboExpression, string>;

export default function Mambo({ expression = 'normal', action = 'idle', visible = true, mode = 'full', labelScale = 1 }: MamboProps) {
  const { characterName } = useGameStore();
  const [imageSrc, setImageSrc] = useState(MAMBO_EXPRESSION_IMAGES[expression]);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageSrc(MAMBO_EXPRESSION_IMAGES[expression] || MAMBO_EXPRESSION_IMAGES.normal);
    setImageError(false);
  }, [expression]);

  if (mode === 'avatar') {
    const avatarEmojis: AvatarEmojis = {
      normal: '😊',
      happy: '😄',
      sad: '😢',
      thinking: '🤔',
      excited: '🎉',
      surprised: '😮'
    };

    return (
      <motion.div
        className="w-16 h-16 rounded-full bg-soft-pink shadow-soft flex items-center justify-center"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.3, type: "spring" }}
      >
        <span className="text-3xl">
          {avatarEmojis[expression] || avatarEmojis.normal}
        </span>
      </motion.div>
    );
  }

  if (!visible) {
    return null;
  }

  const currentAction = actionVariants[action] || actionVariants.idle;

  return (
    <motion.div
      className="relative w-full h-full flex items-end justify-center"
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 50 }}
      transition={{ duration: 0.4, type: "spring" }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={expression}
          animate={currentAction}
          className="relative"
        >
          <motion.img
            src={imageError ? placeholderSvg(expression, characterName) : imageSrc}
            alt={characterName}
            className="w-full h-auto max-h-full object-contain drop-shadow-lg"
            {...mamboTransition.expression}
            onError={(e) => {
              if (!imageError) {
                setImageError(true);
                (e.target as HTMLImageElement).src = placeholderSvg(expression, characterName);
              }
            }}
          />

          <motion.div
            className="absolute bottom-1 right-1 text-coral font-handwriting font-bold drop-shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            style={{ fontSize: `${labelScale * 0.875}rem` }}
          >
            {characterName}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
