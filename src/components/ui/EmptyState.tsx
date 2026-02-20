/**
 * EmptyState (S5-T01)
 *
 * Beautiful empty state component for when there's no data to display.
 * Provides encouraging messages and gentle animations.
 */
import { motion } from 'motion/react'

export interface EmptyStateProps {
  /** Visual variant */
  variant: 'constellation' | 'signals' | 'contract' | 'general'
  /** Optional custom title */
  title?: string
  /** Optional custom message */
  message?: string
  /** Optional action button */
  action?: {
    label: string
    onClick: () => void
  }
}

const VARIANTS = {
  constellation: {
    emoji: '✨',
    title: 'Your constellation is forming',
    message: 'Keep exploring. Each insight adds a new star.',
  },
  signals: {
    emoji: '🔮',
    title: 'Patterns emerging...',
    message: 'The more you share, the more I see.',
  },
  contract: {
    emoji: '📜',
    title: 'Almost ready',
    message: 'Complete your reflection to craft your contract.',
  },
  general: {
    emoji: '🌙',
    title: 'Nothing here yet',
    message: 'Start your journey to see results.',
  },
}

export function EmptyState({ variant, title, message, action }: EmptyStateProps) {
  const config = VARIANTS[variant]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      {/* Animated emoji */}
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 20 }}
        className="text-4xl mb-4"
      >
        {config.emoji}
      </motion.span>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-lg font-medium text-[var(--twilight-200)] mb-2"
      >
        {title || config.title}
      </motion.h3>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-[var(--twilight-500)] max-w-xs"
      >
        {message || config.message}
      </motion.p>

      {/* Optional action */}
      {action && (
        <motion.button
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={action.onClick}
          className="mt-6 px-4 py-2 rounded-lg bg-[var(--coral-500)]/10 text-[var(--coral-400)] text-sm font-medium hover:bg-[var(--coral-500)]/20 transition-colors"
        >
          {action.label}
        </motion.button>
      )}

      {/* Subtle breathing animation */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, var(--coral-500) 0%, transparent 70%)',
          opacity: 0.05,
        }}
      />
    </motion.div>
  )
}
