/**
 * ConstellationTrigger (S2-T04)
 *
 * Button in discovery header to open constellation view.
 * Shows signal count badge and pulses on new signals.
 */
import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useSignalStore } from '@/lib/stores/signals'
import { useSignalEvent } from '@/lib/stores/signal-events'

export interface ConstellationTriggerProps {
  onClick: () => void
}

export function ConstellationTrigger({ onClick }: ConstellationTriggerProps) {
  const signalCount = useSignalStore(state => state.signals.length)
  const [isPulsing, setIsPulsing] = useState(false)

  // Pulse animation when new signal arrives
  const handleSignalAdded = useCallback(() => {
    setIsPulsing(true)
    setTimeout(() => setIsPulsing(false), 1000)
  }, [])

  useSignalEvent('SIGNAL_ADDED', handleSignalAdded)

  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-lg hover:bg-[var(--twilight-800)] transition-colors group"
      aria-label={`View constellation (${signalCount} signals)`}
      title="See what's emerging"
    >
      {/* Star icon */}
      <motion.svg
        className="w-5 h-5 text-[var(--twilight-400)] group-hover:text-[var(--coral-400)] transition-colors"
        animate={isPulsing ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
        />
      </motion.svg>

      {/* Badge */}
      <AnimatePresence>
        {signalCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full text-[10px] font-bold bg-[var(--coral-500)] text-white"
          >
            {signalCount > 99 ? '99+' : signalCount}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
