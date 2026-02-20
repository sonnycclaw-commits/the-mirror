/**
 * Signal Visual Mapper (S0-T03)
 *
 * Maps signal domains and types to visual properties for UI rendering.
 * Follows the Digital Renaissance design system.
 */
import type { SignalDomain, Signal } from '../ai/tools/types'

export interface SignalVisual {
  /** Lucide icon name */
  icon: string
  /** Design system color token (twilight, coral, sage, etc.) */
  color: string
  /** CSS color for glow effects */
  glowColor: string
  /** Human-readable domain label */
  label: string
  /** Short label for pills */
  shortLabel: string
  /** Emoji for quick recognition */
  emoji: string
}

/**
 * Visual properties for each signal domain
 */
export const SIGNAL_VISUALS: Record<SignalDomain, SignalVisual> = {
  VALUE: {
    icon: 'compass',
    color: 'coral',
    glowColor: 'rgba(224, 122, 95, 0.4)',
    label: 'Core Value',
    shortLabel: 'Value',
    emoji: '🧭',
  },
  NEED: {
    icon: 'heart',
    color: 'sage',
    glowColor: 'rgba(156, 175, 136, 0.4)',
    label: 'Deep Need',
    shortLabel: 'Need',
    emoji: '💚',
  },
  MOTIVE: {
    icon: 'flame',
    color: 'amber',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    label: 'Driving Motive',
    shortLabel: 'Motive',
    emoji: '🔥',
  },
  DEFENSE: {
    icon: 'shield',
    color: 'twilight',
    glowColor: 'rgba(148, 163, 184, 0.4)',
    label: 'Defense Pattern',
    shortLabel: 'Defense',
    emoji: '🛡️',
  },
  ATTACHMENT: {
    icon: 'users',
    color: 'violet',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    label: 'Attachment Style',
    shortLabel: 'Attach',
    emoji: '🔗',
  },
  DEVELOPMENT: {
    icon: 'trending-up',
    color: 'emerald',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    label: 'Growth Stage',
    shortLabel: 'Growth',
    emoji: '📈',
  },
  PATTERN: {
    icon: 'sparkles',
    color: 'coral',
    glowColor: 'rgba(224, 122, 95, 0.6)',
    label: 'Pattern',
    shortLabel: 'Pattern',
    emoji: '✨',
  },
}

/**
 * Get visual properties for a signal
 */
export function getSignalVisual(signal: Signal): SignalVisual {
  return SIGNAL_VISUALS[signal.domain]
}

/**
 * Get CSS custom property for color
 */
export function getSignalColorVar(domain: SignalDomain): string {
  const { color } = SIGNAL_VISUALS[domain]
  return `var(--${color}-500)`
}

/**
 * Get signal type label (humanize the constant)
 */
export function humanizeSignalType(type: string): string {
  return type
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Get state label for frustrated/satisfied needs
 */
export function getStateLabel(state?: string): string | null {
  if (!state) return null
  switch (state) {
    case 'SATISFIED': return 'fulfilled'
    case 'FRUSTRATED': return 'unmet'
    case 'STABLE': return 'stable'
    case 'TRANSITIONING': return 'shifting'
    default: return state.toLowerCase()
  }
}

/**
 * Get CSS class for signal confidence level
 */
export function getConfidenceClass(confidence: number): string {
  if (confidence >= 0.8) return 'signal-high'
  if (confidence >= 0.5) return 'signal-medium'
  return 'signal-low'
}

/**
 * Get size class for constellation nodes
 */
export function getNodeSize(confidence: number): 'small' | 'medium' | 'large' {
  if (confidence >= 0.8) return 'large'
  if (confidence >= 0.5) return 'medium'
  return 'small'
}
