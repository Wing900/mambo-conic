import { Transition, Variant } from 'framer-motion';

// 页面切换动画
export const pageTransition: {
  initial: Variant;
  animate: Variant;
  exit: Variant;
  transition: Transition;
} = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: 'easeInOut' }
};

// 曼波动画配置
export const mamboTransition = {
  expression: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.3 }
  }
};

// 对话框动画配置
export const dialogueTransition = {
  container: {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.4, type: 'spring' as const }
  },
  text: {
    initial: { opacity: 0 },
    animate: { opacity: 1 }
  }
};

// 选项按钮动画
export const choiceVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
      type: 'spring' as const
    }
  })
};

// 选择菜单动画配置（向后兼容）
export const choiceTransition = {
  container: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    whileHover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    whileTap: {
      scale: 0.98
    }
  }
};

// 黑板内容切换动画
export const blackboardTransition = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.4, ease: 'easeInOut' as const }
};