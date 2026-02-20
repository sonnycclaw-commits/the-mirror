/**
 * Signal Store (S0-T01)
 *
 * Zustand store for managing extracted signals with UI-friendly accessors.
 * Emits events for reactive UI components.
 */
import { create } from 'zustand'
import type { Signal, SignalDomain } from '../ai/tools/types'
import { signalEvents } from './signal-events'

/**
 * High confidence threshold for "strong" signals
 */
const HIGH_CONFIDENCE_THRESHOLD = 0.7

export interface SignalStore {
  // State
  signals: Signal[]

  // Computed accessors
  byDomain: Record<SignalDomain, Signal[]>
  highConfidence: Signal[]
  latestSignal: Signal | null
  domainCoverage: number // 0-7, how many domains have at least one signal

  // Actions
  addSignal: (signal: Signal) => void
  addSignals: (signals: Signal[]) => void
  reset: () => void

  // Derived helpers
  getEmergingPattern: () => string | null
  getSignalsForDomain: (domain: SignalDomain) => Signal[]
  hasSignalInDomain: (domain: SignalDomain) => boolean
}

/**
 * Create empty domain map
 */
function createEmptyByDomain(): Record<SignalDomain, Signal[]> {
  return {
    VALUE: [],
    NEED: [],
    MOTIVE: [],
    DEFENSE: [],
    ATTACHMENT: [],
    DEVELOPMENT: [],
    PATTERN: [],
  }
}

/**
 * Group signals by domain
 */
function groupByDomain(signals: Signal[]): Record<SignalDomain, Signal[]> {
  const grouped = createEmptyByDomain()
  for (const signal of signals) {
    grouped[signal.domain].push(signal)
  }
  return grouped
}

/**
 * Count how many domains have at least one signal
 */
function countDomainCoverage(byDomain: Record<SignalDomain, Signal[]>): number {
  return Object.values(byDomain).filter(signals => signals.length > 0).length
}

export const useSignalStore = create<SignalStore>((set, get) => ({
  // Initial state
  signals: [],
  byDomain: createEmptyByDomain(),
  highConfidence: [],
  latestSignal: null,
  domainCoverage: 0,

  // Actions
  addSignal: (signal: Signal) => {
    set(state => {
      const newSignals = [...state.signals, signal]
      const newByDomain = groupByDomain(newSignals)
      const newHighConfidence = newSignals.filter(s => s.confidence >= HIGH_CONFIDENCE_THRESHOLD)
      const newDomainCoverage = countDomainCoverage(newByDomain)

      // Emit event for UI components
      signalEvents.emit({ type: 'SIGNAL_ADDED', signal })

      // Check if this completes a domain
      const wasEmpty = state.byDomain[signal.domain].length === 0
      if (wasEmpty && newByDomain[signal.domain].length > 0) {
        signalEvents.emit({ type: 'DOMAIN_COMPLETE', domain: signal.domain })
      }

      // Check for pattern detection (3+ high confidence signals)
      const pattern = getEmergingPatternFromSignals(newHighConfidence)
      if (pattern && !getEmergingPatternFromSignals(state.highConfidence)) {
        signalEvents.emit({ type: 'PATTERN_DETECTED', pattern })
      }

      return {
        signals: newSignals,
        byDomain: newByDomain,
        highConfidence: newHighConfidence,
        latestSignal: signal,
        domainCoverage: newDomainCoverage,
      }
    })
  },

  addSignals: (signals: Signal[]) => {
    for (const signal of signals) {
      get().addSignal(signal)
    }
  },

  reset: () => {
    set({
      signals: [],
      byDomain: createEmptyByDomain(),
      highConfidence: [],
      latestSignal: null,
      domainCoverage: 0,
    })
  },

  // Derived helpers
  getEmergingPattern: () => {
    const { highConfidence } = get()
    return getEmergingPatternFromSignals(highConfidence)
  },

  getSignalsForDomain: (domain: SignalDomain) => {
    return get().byDomain[domain]
  },

  hasSignalInDomain: (domain: SignalDomain) => {
    return get().byDomain[domain].length > 0
  },
}))

/**
 * Extract emerging pattern description from high-confidence signals
 */
function getEmergingPatternFromSignals(signals: Signal[]): string | null {
  if (signals.length < 3) return null

  // Find the most common domain
  const domainCounts = new Map<SignalDomain, number>()
  for (const signal of signals) {
    domainCounts.set(signal.domain, (domainCounts.get(signal.domain) || 0) + 1)
  }

  // Get highest count domain
  let topDomain: SignalDomain = 'PATTERN'
  let topCount = 0
  for (const [domain, count] of domainCounts) {
    if (count > topCount) {
      topDomain = domain
      topCount = count
    }
  }

  // Build pattern description
  const topSignals = signals.filter(s => s.domain === topDomain)
  if (topSignals.length >= 2) {
    const types = [...new Set(topSignals.map(s => s.type))]
    return `${topDomain.toLowerCase()}: ${types.join(', ')}`
  }

  return null
}
