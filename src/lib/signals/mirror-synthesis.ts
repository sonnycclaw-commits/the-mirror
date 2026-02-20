/**
 * Mirror Statement Generator (S4-T02)
 *
 * Synthesizes signals into a compelling mirror statement.
 * Uses pattern recognition to craft the "You are someone who..." statement.
 */
import type { Signal, SignalDomain } from '../ai/tools/types'
import { SIGNAL_VISUALS, humanizeSignalType } from './visual-map'

export interface MirrorSynthesis {
  /** The core pattern name */
  patternName: string
  /** The full mirror statement */
  statement: string
  /** Key signals that support this synthesis */
  keySignals: Signal[]
  /** Confidence in this synthesis (0-1) */
  confidence: number
}

/**
 * Pattern templates based on dominant signal domains
 */
const PATTERN_TEMPLATES: Record<SignalDomain, string[]> = {
  VALUE: [
    'The {type} Seeker',
    'Driven by {type}',
    'The Principled {type}',
  ],
  NEED: [
    'The {state} Soul',
    'Seeking {type}',
    'The {type} Hunger',
  ],
  MOTIVE: [
    'The {type} Drive',
    'Powered by {type}',
    'The {type} Engine',
  ],
  DEFENSE: [
    'The {type} Shield',
    'Protected by {type}',
    'The {type} Armor',
  ],
  ATTACHMENT: [
    'The {type} Heart',
    'Connecting through {type}',
    'The {type} Bond',
  ],
  DEVELOPMENT: [
    'The {state} Journey',
    'Growing through {type}',
    'The {type} Path',
  ],
  PATTERN: [
    'The Repeating {type}',
    'Caught in {type}',
    'The {type} Loop',
  ],
}

/**
 * Statement templates based on signal combinations
 */
const STATEMENT_TEMPLATES = [
  'You are someone who deeply values {value}, yet finds yourself repeatedly choosing {defense} when your need for {need} feels threatened.',
  'You are someone who craves {need}, but has learned to protect yourself through {defense} — even when it costs you {value}.',
  'You are someone whose {motive} drive pushes you forward, while your {defense} pattern holds you back from the {need} you truly want.',
  'You are someone who genuinely believes in {value}, yet your {attachment} style creates the very {need} gap you\'re trying to fill.',
  'You are someone whose strength in {value} becomes your struggle when your {defense} takes over.',
]

/**
 * Generate a mirror statement from signals
 */
export function generateMirrorSynthesis(signals: Signal[]): MirrorSynthesis | null {
  if (signals.length < 2) {
    return null
  }

  // Group signals by domain
  const byDomain = new Map<SignalDomain, Signal[]>()
  for (const signal of signals) {
    const group = byDomain.get(signal.domain) || []
    group.push(signal)
    byDomain.set(signal.domain, group)
  }

  // Find dominant domain
  let dominantDomain: SignalDomain = 'PATTERN'
  let maxCount = 0
  for (const [domain, domainSignals] of byDomain) {
    if (domainSignals.length > maxCount) {
      dominantDomain = domain
      maxCount = domainSignals.length
    }
  }

  // Get highest confidence signal per domain
  const topSignals = new Map<SignalDomain, Signal>()
  for (const [domain, domainSignals] of byDomain) {
    const sorted = [...domainSignals].sort((a, b) => b.confidence - a.confidence)
    const top = sorted[0]
    if (top) {
      topSignals.set(domain, top)
    }
  }

  // Generate pattern name
  const dominantSignal = topSignals.get(dominantDomain)
  const patternName = generatePatternName(dominantDomain, dominantSignal)

  // Generate statement
  const statement = generateStatement(topSignals)

  // Calculate overall confidence
  const avgConfidence = signals.reduce((sum, s) => sum + s.confidence, 0) / signals.length

  return {
    patternName,
    statement,
    keySignals: Array.from(topSignals.values()),
    confidence: avgConfidence,
  }
}

/**
 * Generate a pattern name from domain and signal
 */
function generatePatternName(domain: SignalDomain, signal?: Signal): string {
  const templates = PATTERN_TEMPLATES[domain]
  const template = templates[Math.floor(Math.random() * templates.length)]!

  if (!signal) {
    return SIGNAL_VISUALS[domain].label
  }

  const type = humanizeSignalType(signal.type)
  const state = signal.state ? humanizeSignalType(signal.state) : 'Seeking'

  return template
    .replace('{type}', type)
    .replace('{state}', state)
}

/**
 * Generate a statement from top signals
 */
function generateStatement(topSignals: Map<SignalDomain, Signal>): string {
  // Build substitution map
  const subs: Record<string, string> = {
    value: '',
    need: '',
    motive: '',
    defense: '',
    attachment: '',
    pattern: '',
  }

  for (const [domain, signal] of topSignals) {
    const key = domain.toLowerCase()
    subs[key] = humanizeSignalType(signal.type)
    if (signal.state) {
      subs[`${key}_state`] = humanizeSignalType(signal.state)
    }
  }

  // Pick a template based on available signals
  let bestTemplate = STATEMENT_TEMPLATES[0]!
  let bestScore = 0

  for (const template of STATEMENT_TEMPLATES) {
    let score = 0
    if (template.includes('{value}') && subs.value) score++
    if (template.includes('{need}') && subs.need) score++
    if (template.includes('{motive}') && subs.motive) score++
    if (template.includes('{defense}') && subs.defense) score++
    if (template.includes('{attachment}') && subs.attachment) score++

    if (score > bestScore) {
      bestScore = score
      bestTemplate = template
    }
  }

  // Apply substitutions
  let result = bestTemplate
  for (const [key, value] of Object.entries(subs)) {
    result = result.replace(`{${key}}`, value || 'something')
  }

  return result
}

/**
 * Quick synthesis for display (simpler than full generation)
 */
export function getQuickSynthesis(signals: Signal[]): string | null {
  if (signals.length === 0) return null

  const highConfidence = signals.filter(s => s.confidence >= 0.7)
  if (highConfidence.length === 0) {
    return 'Patterns are still emerging...'
  }

  const topSignal = highConfidence.sort((a, b) => b.confidence - a.confidence)[0]
  if (!topSignal) return null

  const visual = SIGNAL_VISUALS[topSignal.domain]
  return `${visual.emoji} ${humanizeSignalType(topSignal.type)}`
}
