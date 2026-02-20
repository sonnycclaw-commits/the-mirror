/**
 * SignalPillContainer (S1-T02)
 *
 * Manages signal pill queue and positioning within chat flow.
 * Subscribes to signal events and displays pills below AI messages.
 */
import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence } from 'motion/react'
import { SignalPill } from './SignalPill'
import { useSignalEvent } from '@/lib/stores/signal-events'
import type { Signal } from '@/lib/ai/tools/types'
import { hapticSignal } from '@/lib/haptics'

interface QueuedPill {
  id: string
  signal: Signal
  timestamp: number
}

export function SignalPillContainer() {
  const [queue, setQueue] = useState<QueuedPill[]>([])
  const [activePill, setActivePill] = useState<QueuedPill | null>(null)

  // Pop next pill from queue when active pill is dismissed
  const dismissActivePill = useCallback(() => {
    setActivePill(null)
  }, [])

  // Process queue - show next pill when current is dismissed
  useEffect(() => {
    if (!activePill && queue.length > 0) {
      const [next, ...rest] = queue
      if (next) {
        setActivePill(next)
        setQueue(rest)
      }
    }
  }, [activePill, queue])

  // Subscribe to new signal events
  const handleSignalAdded = useCallback((event: { type: 'SIGNAL_ADDED'; signal: Signal }) => {
    const newPill: QueuedPill = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      signal: event.signal,
      timestamp: Date.now(),
    }

    // Trigger haptic feedback
    hapticSignal()

    // If no active pill, show immediately
    if (!activePill) {
      setActivePill(newPill)
    } else {
      // Queue for later
      setQueue(prev => [...prev, newPill])
    }
  }, [activePill])

  useSignalEvent('SIGNAL_ADDED', handleSignalAdded)

  return (
    <div className="flex justify-center py-2">
      <AnimatePresence mode="wait">
        {activePill && (
          <SignalPill
            key={activePill.id}
            domain={activePill.signal.domain}
            type={activePill.signal.type}
            state={activePill.signal.state}
            onDismiss={dismissActivePill}
            dismissAfter={4000}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
