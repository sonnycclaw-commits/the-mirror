/**
 * SignalPill Component (S1-T01)
 *
 * Subtle inline notification when a signal is extracted.
 * Appears below latest AI message, fades out after 4 seconds.
 */
import { motion } from 'motion/react'
import type { SignalDomain, Signal } from '@/lib/ai/tools/types'
import {
  SIGNAL_VISUALS,
  humanizeSignalType,
  getStateLabel,
  getSignalColorVar
} from '@/lib/signals/visual-map'
import { springTransition } from '@/lib/springs'

export interface SignalPillProps {
  domain: SignalDomain
  type: string
  state?: Signal['state']
  onDismiss?: () => void
  /** Auto-dismiss after this many ms (default 4000) */
  dismissAfter?: number
}

export function SignalPill({
  domain,
  type,
  state,
  onDismiss,
  dismissAfter = 4000
}: SignalPillProps) {
  const visual = SIGNAL_VISUALS[domain]
  const stateLabel = getStateLabel(state)

  // Auto-dismiss effect
  if (dismissAfter > 0 && onDismiss) {
    setTimeout(onDismiss, dismissAfter)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.9 }}
      transition={springTransition('float')}
      role="status"
      aria-live="polite"
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--twilight-800)]/80 border border-[var(--glass-border)] backdrop-blur-sm"
      style={{
        boxShadow: `0 0 20px ${visual.glowColor}`,
      }}
    >
      {/* Pulsing diamond indicator */}
      <motion.span
        className="text-sm"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ color: getSignalColorVar(domain) }}
      >
        ◆
      </motion.span>

      {/* Signal type */}
      <span
        className="text-sm font-medium"
        style={{ color: getSignalColorVar(domain) }}
      >
        {humanizeSignalType(type)}
      </span>

      {/* State indicator (if applicable) */}
      {stateLabel && (
        <>
          <span className="text-[var(--twilight-600)]">•</span>
          <span className="text-xs text-[var(--twilight-400)]">
            {stateLabel}
          </span>
        </>
      )}
    </motion.div>
  )
}
