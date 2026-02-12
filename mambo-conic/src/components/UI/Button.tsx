import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';
type IconPosition = 'left' | 'right';

const variants: Record<Variant, string> = {
  primary: 'bg-coral text-white hover:bg-opacity-90',
  secondary: 'bg-soft-pink text-warm-brown hover:bg-opacity-80',
  outline: 'border-2 border-coral text-coral hover:bg-coral hover:text-white',
  ghost: 'text-warm-brown hover:bg-soft-pink',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-6 py-2 text-base',
  lg: 'px-8 py-3 text-lg',
};

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  icon?: ReactNode;
  iconPosition?: IconPosition;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  icon = null,
  iconPosition = 'left',
}: ButtonProps) {
  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`
        sketch-border font-handwriting font-medium
        transition-all duration-200 ease-out
        rounded-full
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
    >
      {icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </motion.button>
  );
}
