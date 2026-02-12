import { motion, AnimatePresence } from 'framer-motion';
import { choiceTransition } from '../../utils/animations';
import { SceneOption } from '../../types/scene.types';

interface ChoiceMenuProps {
  options: SceneOption[];
  onChoice: (index: number) => void;
  disabled?: boolean;
}

export default function ChoiceMenu({ options, onChoice, disabled = false }: ChoiceMenuProps) {
  if (!options || options.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="mt-2 space-y-2"
      {...choiceTransition.container}
    >
      <AnimatePresence>
        {options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => !disabled && onChoice(index)}
            disabled={disabled}
            className={`
              w-full p-4 sketch-border paper-texture rounded-lg
              transition-all duration-200 ease-out
              text-left text-warm-brown relative overflow-hidden
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            {...choiceTransition.item}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
            whileHover={disabled ? {} : choiceTransition.item.whileHover}
            whileTap={disabled ? {} : choiceTransition.item.whileTap}
          >
            <motion.div
              className="absolute inset-0 bg-soft-pink/50"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />

            <span className="relative z-10 text-coral font-bold mr-3 text-xl">
              {String.fromCharCode(65 + index)}.
            </span>

            <span className="relative z-10 font-body">
              {option.text}
            </span>

            <motion.span
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-coral"
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              →
            </motion.span>
          </motion.button>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
