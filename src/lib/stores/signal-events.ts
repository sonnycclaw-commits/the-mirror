/**
 * Signal Event Emitter (S0-T02)
 *
 * Simple event system for UI components to react to signal changes
 * without polling or prop drilling.
 */
import type { Signal, SignalDomain } from '../ai/tools/types'

export type SignalEvent =
  | { type: 'SIGNAL_ADDED'; signal: Signal }
  | { type: 'PATTERN_DETECTED'; pattern: string }
  | { type: 'DOMAIN_COMPLETE'; domain: SignalDomain }

type SignalEventHandler = (event: SignalEvent) => void

/**
 * Simple event emitter for signal events
 */
class SignalEventEmitter {
  private handlers = new Set<SignalEventHandler>()

  /**
   * Subscribe to signal events
   * @returns Unsubscribe function
   */
  subscribe(handler: SignalEventHandler): () => void {
    this.handlers.add(handler)
    return () => {
      this.handlers.delete(handler)
    }
  }

  /**
   * Emit event to all subscribers
   */
  emit(event: SignalEvent): void {
    for (const handler of this.handlers) {
      try {
        handler(event)
      } catch (err) {
        console.error('[SignalEvents] Handler error:', err)
      }
    }
  }

  /**
   * Get number of active subscribers (for debugging)
   */
  get subscriberCount(): number {
    return this.handlers.size
  }
}

/**
 * Global signal event emitter instance
 */
export const signalEvents = new SignalEventEmitter()

/**
 * React hook for subscribing to signal events
 */
import { useEffect } from 'react'

export function useSignalEvents(handler: SignalEventHandler): void {
  useEffect(() => {
    return signalEvents.subscribe(handler)
  }, [handler])
}

/**
 * React hook for subscribing to specific event types
 */
export function useSignalEvent<T extends SignalEvent['type']>(
  type: T,
  handler: (event: Extract<SignalEvent, { type: T }>) => void
): void {
  useEffect(() => {
    return signalEvents.subscribe((event) => {
      if (event.type === type) {
        handler(event as Extract<SignalEvent, { type: T }>)
      }
    })
  }, [type, handler])
}
