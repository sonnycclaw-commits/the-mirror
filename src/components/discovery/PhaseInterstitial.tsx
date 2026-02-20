/**
 * PhaseInterstitial (S3-T01)
 *
 * Full-screen celebratory moment when transitioning between phases.
 * Shows constellation snapshot, phase name, and brief meditation.
 */
import { motion, AnimatePresence } from 'motion/react'
import { useEffect } from 'react'
import type { Phase } from '../discovery/PhaseProgress'
import { ConstellationCanvas } from '../signals/ConstellationCanvas'
import { buildConstellation } from '@/lib/signals/constellation'
import { useSignalStore } from '@/lib/stores/signals'
import { hapticPhaseTransition } from '@/lib/haptics'
import { springTransition } from '@/lib/springs'

export interface PhaseInterstitialProps {
  fromPhase: Phase
  toPhase: Phase
  isVisible: boolean
  onComplete: () => void
  /** Auto-dismiss after this many ms (default 4000) */
  duration?: number
}

/**
 * Phase metadata for display
 */
const PHASE_META: Record<Phase, { title: string; message: string; emoji: string }> = {
  SCENARIO: {
    title: 'Setting the Scene',
    message: 'You\'ve shared your situation. Now let\'s dig deeper.',
    emoji: '🌅',
  },
  EXCAVATION: {
    title: 'Excavation',
    message: 'We\'re uncovering what lies beneath the surface.',
    emoji: '⛏️',
  },
  SYNTHESIS: {
    title: 'Synthesis',
    message: 'The patterns are becoming clear. Let\'s connect the dots.',
    emoji: '🔮',
  },
  CONTRACT: {
    title: 'Your Contract',
    message: 'Time to make it real. What will you commit to?',
    emoji: '📜',
  },
}

export function PhaseInterstitial({
  fromPhase: _fromPhase,
  toPhase,
  isVisible,
  onComplete,
  duration = 4000,
}: PhaseInterstitialProps) {
  const signals = useSignalStore(state => state.signals)
  const constellation = buildConstellation(signals, 200, 200)
  const meta = PHASE_META[toPhase]

  // Auto-dismiss after duration
  useEffect(() => {
    if (isVisible) {
      hapticPhaseTransition()
      const timer = setTimeout(onComplete, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--twilight-950)] p-8"
          onClick={onComplete}
          role="dialog"
          aria-modal="true"
          aria-label={`Entering ${meta.title} phase`}
        >
          {/* Background glow */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 2, opacity: 0.15 }}
              transition={{ duration: 2, ease: 'easeOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-radial from-[var(--coral-500)] to-transparent"
            />
          </div>

          {/* Content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={springTransition('reveal')}
            className="relative z-10 flex flex-col items-center text-center max-w-md"
          >
            {/* Mini constellation */}
            {signals.length > 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, ...springTransition('float') }}
                className="mb-6"
              >
                <ConstellationCanvas
                  constellation={constellation}
                  animated={false}
                  className="opacity-60"
                />
              </motion.div>
            )}

            {/* Emoji */}
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 500, damping: 25 }}
              className="text-5xl mb-4"
            >
              {meta.emoji}
            </motion.span>

            {/* Phase title */}
            <motion.h2
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-serif text-white mb-2"
            >
              {meta.title}
            </motion.h2>

            {/* Message */}
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-[var(--twilight-300)] text-lg"
            >
              {meta.message}
            </motion.p>

            {/* Signal count */}
            {signals.length > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-[var(--twilight-500)] text-sm mt-6"
              >
                {signals.length} insight{signals.length !== 1 ? 's' : ''} gathered
              </motion.p>
            )}

            {/* Tap to continue hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ delay: 2.5, duration: 2, repeat: Infinity }}
              className="text-[var(--twilight-600)] text-xs mt-8"
            >
              Tap to continue
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
