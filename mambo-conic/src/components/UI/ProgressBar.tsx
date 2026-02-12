import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
  label?: string;
  color?: string;
  height?: string;
}

export default function ProgressBar({
  current,
  total,
  showLabel = true,
  label = '进度',
  color = 'from-coral to-soft-pink',
  height = 'h-3'
}: ProgressBarProps) {
  if (total <= 0) {
    return null;
  }

  const percentage = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div className="w-full">
      {/* 标签行 */}
      {showLabel && (
        <div className="flex justify-between items-center mb-2 text-sm text-warm-brown/70">
          <span className="font-handwriting">{label}</span>
          <span className="font-mono">
            {current} / {total}
          </span>
        </div>
      )}

      {/* 进度条 */}
      <div className={`w-full ${height} bg-white/50 rounded-full overflow-hidden sketch-border relative`}>
        {/* 背景纹理 */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(0,0,0,0.02) 2px,
                rgba(0,0,0,0.02) 4px
              )
            `
          }}
        />

        {/* 进度填充 */}
        <motion.div
          className={`h-full bg-gradient-to-r ${color} relative`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* 高光效果 */}
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)'
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
