/**
 * ConstellationSheet (S2-T03)
 *
 * Drawer that shows the full constellation visualization.
 * Mobile: Bottom sheet (70% height)
 * Desktop: Right sidebar (400px)
 */
import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useCallback } from 'react'
import { ConstellationCanvas } from './ConstellationCanvas'
import { SignalList } from './SignalList'
import { buildConstellation } from '@/lib/signals/constellation'
import { useSignalStore } from '@/lib/stores/signals'
import { springTransition } from '@/lib/springs'
import type { SignalDomain } from '@/lib/ai/tools/types'

export interface ConstellationSheetProps {
  isOpen: boolean
  onClose: () => void
  highlightDomain?: SignalDomain
}

export function ConstellationSheet({
  isOpen,
  onClose,
  highlightDomain,
}: ConstellationSheetProps) {
  const signals = useSignalStore(state => state.signals)
  const domainCoverage = useSignalStore(state => state.domainCoverage)

  // Build constellation from signals
  const constellation = buildConstellation(signals, 320, 320)

  // ESC to close
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Sheet */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={springTransition('snappy')}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] bg-[var(--twilight-900)] border-l border-[var(--glass-border)] z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  The Emerging Self
                </h2>
                <p className="text-xs text-[var(--twilight-400)]">
                  {signals.length} signal{signals.length !== 1 ? 's' : ''} · {domainCoverage} domain{domainCoverage !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-[var(--twilight-800)] transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5 text-[var(--twilight-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </header>

            {/* Constellation visualization */}
            <div className="flex-shrink-0 p-4 flex justify-center bg-[var(--twilight-950)]">
              <ConstellationCanvas
                constellation={constellation}
                {...(highlightDomain !== undefined && { highlightDomain })}
                animated
              />
            </div>

            {/* Signal list */}
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-sm font-medium text-[var(--twilight-300)] uppercase tracking-wider mb-3">
                Detected Signals
              </h3>
              <SignalList signals={signals} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
