/**
 * ConfidenceIndicator (S5-T02)
 *
 * Visual indicator for signal confidence levels.
 * Provides at-a-glance understanding of how certain we are.
 */
import { motion } from 'motion/react'

export interface ConfidenceIndicatorProps {
  /** Confidence value 0-1 */
  confidence: number
  /** Display size */
  size?: 'sm' | 'md' | 'lg'
  /** Show percentage label */
  showLabel?: boolean
  /** Variant styling */
  variant?: 'bar' | 'ring' | 'dots'
}

// Size configurations
const SIZES = {
  sm: { bar: 'h-1', ring: 'w-4 h-4', dots: 'w-1 h-1 gap-0.5' },
  md: { bar: 'h-1.5', ring: 'w-6 h-6', dots: 'w-1.5 h-1.5 gap-1' },
  lg: { bar: 'h-2', ring: 'w-8 h-8', dots: 'w-2 h-2 gap-1.5' },
}

// Color based on confidence
function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.8) return 'var(--sage-400)'
  if (confidence >= 0.5) return 'var(--coral-400)'
  return 'var(--twilight-500)'
}

function getConfidenceLabel(confidence: number): string {
  if (confidence >= 0.8) return 'High'
  if (confidence >= 0.5) return 'Medium'
  return 'Low'
}

export function ConfidenceIndicator({
  confidence,
  size = 'md',
  showLabel = false,
  variant = 'bar',
}: ConfidenceIndicatorProps) {
  const color = getConfidenceColor(confidence)
  const sizeConfig = SIZES[size]

  if (variant === 'bar') {
    return (
      <div className="flex items-center gap-2">
        <div className={`flex-1 min-w-[40px] bg-[var(--twilight-700)] rounded-full overflow-hidden ${sizeConfig.bar}`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${confidence * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
        {showLabel && (
          <span className="text-xs text-[var(--twilight-400)]">
            {Math.round(confidence * 100)}%
          </span>
        )}
      </div>
    )
  }

  if (variant === 'ring') {
    const circumference = 2 * Math.PI * 16 // radius = 16
    const strokeDashoffset = circumference * (1 - confidence)

    return (
      <div className="flex items-center gap-2">
        <svg className={sizeConfig.ring} viewBox="0 0 36 36">
          {/* Background ring */}
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="var(--twilight-700)"
            strokeWidth="3"
          />
          {/* Progress ring */}
          <motion.circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          />
        </svg>
        {showLabel && (
          <span className="text-xs text-[var(--twilight-400)]">
            {getConfidenceLabel(confidence)}
          </span>
        )}
      </div>
    )
  }

  // Dots variant
  const filledDots = Math.round(confidence * 5)
  return (
    <div className="flex items-center gap-2">
      <div className={`flex ${sizeConfig.dots}`}>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-full ${sizeConfig.dots.split(' ')[0]} ${sizeConfig.dots.split(' ')[1]}`}
            style={{
              backgroundColor: i < filledDots ? color : 'var(--twilight-700)',
            }}
          />
        ))}
      </div>
      {showLabel && (
        <span className="text-xs text-[var(--twilight-400)]">
          {getConfidenceLabel(confidence)}
        </span>
      )}
    </div>
  )
}
