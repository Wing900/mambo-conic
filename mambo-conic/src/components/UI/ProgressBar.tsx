import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
  label?: string;
  color?: string;
  height?: string;
  compact?: boolean;
  icon?: string;
  interactive?: boolean;
  maxAdjustable?: number;
  onAdjust?: (value: number) => void;
}

export default function ProgressBar({
  current,
  total,
  showLabel = true,
  label = '进度',
  color = '#8B7355',
  height = 'h-3',
  compact = false,
  icon = '◉',
  interactive = false,
  maxAdjustable,
  onAdjust,
}: ProgressBarProps) {
  if (total <= 0) {
    return null;
  }

  const clampedCurrent = Math.min(total, Math.max(0, current));
  const [draftValue, setDraftValue] = useState(clampedCurrent);
  const effectiveMaxAdjustable = Math.min(total, Math.max(1, maxAdjustable ?? total));
  const canAdjust = interactive && typeof onAdjust === 'function';
  const previewValue = canAdjust ? Math.min(total, Math.max(1, draftValue)) : clampedCurrent;
  const percentage = Math.min(100, Math.max(0, (previewValue / total) * 100));
  const markerPercentage = Math.min(100, Math.max(0, percentage));
  const marks = useMemo(() => Array.from({ length: total }, (_, idx) => idx + 1), [total]);

  useEffect(() => {
    setDraftValue(clampedCurrent);
  }, [clampedCurrent]);

  const commitAdjust = () => {
    if (!canAdjust) return;
    const next = Math.min(effectiveMaxAdjustable, Math.max(1, draftValue));
    if (next !== clampedCurrent) {
      onAdjust(next);
    }
  };

  return (
    <div className="w-full">
      {/* 标签行 */}
      {showLabel && (
        <div className={`flex justify-between items-center ${compact ? 'mb-1 text-[11px]' : 'mb-2 text-sm'} text-warm-brown/80`}>
          <span className={`flex items-center gap-1.5 ${compact ? 'font-body' : 'font-handwriting'}`}>
            <span className={`${compact ? 'text-[10px]' : 'text-xs'} text-[#8B7355]`}>
              {icon}
            </span>
            <span>{label}</span>
          </span>
          <span className="font-mono">
            {previewValue}/{total} ({Math.round(percentage)}%)
          </span>
        </div>
      )}

      {/* 进度条 */}
      <div
        className={`w-full ${height} overflow-hidden relative group ${
          compact
            ? 'bg-[#fffdf8] rounded-full border border-[#8B7355]/30'
            : 'bg-white/50 rounded-full sketch-border'
        }`}
      >
        {/* 进度填充 */}
        <motion.div
          className="h-full relative"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {markerPercentage > 0 && (
          <motion.div
            className="absolute top-1/2 w-2 h-2 rounded-full bg-white border border-[#8B7355]"
            style={{ transform: 'translate(-50%, -50%)' }}
            initial={false}
            animate={{ left: `${markerPercentage}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        )}

        {/* 刻度点 */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {marks.map((mark) => {
            const left = total === 1 ? 0 : ((mark - 1) / (total - 1)) * 100;
            const isPassed = mark <= previewValue;
            return (
              <span
                key={mark}
                className={`absolute top-1/2 w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2 ${
                  isPassed ? 'bg-[#5D4E37]' : 'bg-[#D3C6AF]'
                }`}
                style={{ left: `${left}%` }}
              />
            );
          })}
        </div>

        {/* 可点击刻度层 */}
        {canAdjust && (
          <div className="absolute inset-0 z-20">
            {marks.map((mark) => {
              const left = total === 1 ? 0 : ((mark - 1) / (total - 1)) * 100;
              const disabled = mark > effectiveMaxAdjustable;
              return (
                <button
                  key={`jump-${mark}`}
                  type="button"
                  aria-label={`跳转到第 ${mark} 个进度点`}
                  disabled={disabled}
                  onClick={() => {
                    if (disabled) return;
                    setDraftValue(mark);
                    if (mark !== clampedCurrent) {
                      onAdjust(mark);
                    }
                  }}
                  className={`absolute top-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                    disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  style={{ left: `${left}%` }}
                />
              );
            })}
          </div>
        )}

        {canAdjust && (
          <input
            type="range"
            min={1}
            max={effectiveMaxAdjustable}
            step={1}
            value={Math.min(effectiveMaxAdjustable, Math.max(1, draftValue))}
            onChange={(e) => setDraftValue(Number(e.target.value))}
            onMouseUp={commitAdjust}
            onTouchEnd={commitAdjust}
            onKeyUp={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                commitAdjust();
              }
            }}
            aria-label="调整学习进度"
            title="悬停后可拖动跳转到已学节点"
            className="absolute inset-0 z-0 w-full h-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity appearance-none cursor-ew-resize bg-transparent"
          />
        )}
      </div>

      {compact && (
        <div className="mt-0.5 flex justify-between text-[10px] text-[#8B7355]/70 font-mono">
          <span>1</span>
          <span>{Math.min(effectiveMaxAdjustable, total)}</span>
        </div>
      )}

    </div>
  );
}
