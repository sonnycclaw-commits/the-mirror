/**
 * Return Hook Component (S6-T02)
 *
 * Displays return engagement prompts when user comes back.
 * Shows context from their last session and contract status.
 */
import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import { getDueReminders, dismissReminder, type ContractReminder } from '@/lib/reminders'

export interface ReturnHookProps {
  onContinue: () => void
  onViewContract: () => void
}

export function ReturnHook({ onContinue, onViewContract }: ReturnHookProps) {
  const [reminder, setReminder] = useState<ContractReminder | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Check for due reminders on mount
  useEffect(() => {
    const due = getDueReminders()
    if (due.length > 0) {
      setReminder(due[0]!)
      setIsVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    if (reminder) {
      dismissReminder(reminder.contractId, reminder.type)
    }
    setIsVisible(false)
  }

  if (!reminder) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50"
        >
          <div className="bg-[var(--twilight-900)] border border-[var(--glass-border)] rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🪞</span>
              <div>
                <h3 className="font-medium text-white">Welcome back</h3>
                <p className="text-xs text-[var(--twilight-400)]">
                  {reminder.type === 'daily' && 'Daily check-in'}
                  {reminder.type === 'weekly' && 'Weekly reflection'}
                  {reminder.type === 'milestone' && 'Milestone reached'}
                </p>
              </div>
            </div>

            {/* Message */}
            <p className="text-[var(--twilight-200)] mb-6">
              {reminder.message}
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  handleDismiss()
                  onViewContract()
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--coral-500)] text-[var(--twilight-900)] font-medium hover:scale-105 transition-transform"
              >
                Review Contract
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2.5 rounded-xl border border-[var(--glass-border)] text-[var(--twilight-300)] hover:bg-[var(--twilight-800)] transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
