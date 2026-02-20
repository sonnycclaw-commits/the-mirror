/**
 * PhaseTransitionToast - Celebrates phase completion
 *
 * Shows a brief toast when user moves to a new phase in the discovery flow.
 */
import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'

const PHASE_LABELS: Record<string, { title: string; message: string }> = {
  SCENARIO: {
    title: 'Starting',
    message: "Let's look at how you show up in tough moments.",
  },
  EXCAVATION: {
    title: 'Going Deeper',
    message: "Now I want to understand the pattern underneath.",
  },
  SYNTHESIS: {
    title: 'Connecting the Dots',
    message: "I'm starting to see something. Let me show you.",
  },
  CONTRACT: {
    title: 'Making It Real',
    message: "Let's turn this insight into something you can hold onto.",
  },
}

interface PhaseTransitionToastProps {
  phase: string
  show: boolean
  onComplete: () => void
}

export function PhaseTransitionToast({ phase, show, onComplete }: PhaseTransitionToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        onComplete()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  const phaseInfo = PHASE_LABELS[phase]
  if (!phaseInfo) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
        >
          <div className="bg-[var(--twilight-800)] border border-[var(--glass-border)] rounded-2xl p-4 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3">
              {/* Phase indicator */}
              <div className="flex-shrink-0 size-10 rounded-full bg-gradient-to-br from-[var(--coral-500)] to-[var(--coral-600)] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--twilight-900)" strokeWidth="2">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--coral-400)]">
                  {phaseInfo.title}
                </p>
                <p className="text-sm text-[var(--twilight-300)] truncate">
                  {phaseInfo.message}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
