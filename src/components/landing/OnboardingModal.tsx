/**
 * OnboardingModal - First-time user introduction
 *
 * Shows a brief 1-2 screen explanation of what The Mirror does
 * and what users can expect from the experience.
 */
import { motion, AnimatePresence } from 'motion/react'
import { useState, useEffect } from 'react'

const ONBOARDING_KEY = 'mirror_onboarding_seen'

interface OnboardingModalProps {
  onComplete: () => void
}

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeen = localStorage.getItem(ONBOARDING_KEY)
    if (!hasSeen) {
      setIsVisible(true)
    }
  }, [])

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true')
    setIsVisible(false)
    onComplete()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-md bg-[var(--twilight-800)] border border-[var(--glass-border)] rounded-3xl p-8 shadow-2xl"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center size-16 rounded-full bg-gradient-to-br from-[var(--coral-500)] to-[var(--coral-600)] mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--twilight-900)" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v4" />
                  <path d="M12 18v4" />
                </svg>
              </div>
              <h2 className="text-2xl font-display text-[var(--twilight-50)] mb-2">
                Welcome to The Mirror
              </h2>
            </div>

            {/* Content */}
            <div className="space-y-4 text-[var(--twilight-300)] text-center mb-8">
              <p>
                In about <strong className="text-[var(--twilight-100)]">10 minutes</strong>,
                I'll help you see the pattern you keep repeating.
              </p>
              <p>
                I'll ask you some questions, then create a
                <strong className="text-[var(--twilight-100)]"> personal contract</strong> —
                a single page you can hold onto.
              </p>
              <p className="text-sm text-[var(--twilight-400)]">
                This is a space for honesty. I won't judge.
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={handleComplete}
              className="w-full py-4 bg-[var(--coral-500)] text-[var(--twilight-900)] font-semibold text-lg rounded-2xl hover:bg-[var(--coral-400)] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_20px_-5px_rgba(224,122,95,0.4)]"
            >
              I'm Ready
            </button>

            {/* Skip option */}
            <button
              onClick={handleComplete}
              className="w-full mt-3 py-2 text-[var(--twilight-500)] text-sm hover:text-[var(--twilight-300)] transition-colors"
            >
              Skip intro
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook to check if onboarding has been completed
export function useOnboardingStatus() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true) // Default true to prevent flash

  useEffect(() => {
    setHasSeenOnboarding(!!localStorage.getItem(ONBOARDING_KEY))
  }, [])

  return hasSeenOnboarding
}
