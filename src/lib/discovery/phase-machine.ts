/**
 * Phase Machine - S3-T01
 *
 * Implements the 4-Phase Discovery Process:
 * SCENARIO → EXCAVATION → SYNTHESIS → CONTRACT
 *
 * This is NOT an XState machine. We use Convex database state
 * as the source of truth, with pure functions for transitions.
 */

/**
 * The 4 phases of the discovery interview
 */
export const PHASES = ['SCENARIO', 'EXCAVATION', 'SYNTHESIS', 'CONTRACT'] as const
export type Phase = (typeof PHASES)[number]

/**
 * Phase metadata for UI and prompts
 */
export const PHASE_CONFIG: Record<
  Phase,
  {
    label: string
    description: string
    minSignals: number
    voice: string
  }
> = {
  SCENARIO: {
    label: 'Scenario',
    description: 'Select a situation that resonates with you',
    minSignals: 0,
    voice: 'Warm and curious, like a trusted friend',
  },
  EXCAVATION: {
    label: 'Excavation',
    description: 'Uncover the hidden patterns behind your choices',
    minSignals: 0,
    voice: 'The Mirror - neutral, observant, compassionate',
  },
  SYNTHESIS: {
    label: 'Synthesis',
    description: 'See your patterns reflected back',
    minSignals: 5,
    voice: 'The Architect - structural, clear',
  },
  CONTRACT: {
    label: 'Contract',
    description: 'Build your Momentum Contract',
    minSignals: 8,
    voice: 'The General - protective, strategic',
  },
}

/**
 * Phase transition rules
 */
export interface TransitionContext {
  currentPhase: Phase
  signalCount: number
  highConfidenceSignals: number // confidence > 0.7
  scenariosExplored: number
  userRequestedAdvance?: boolean // "I'm ready for my contract"
}

/**
 * Determine if a phase transition is allowed
 */
export function canTransition(
  from: Phase,
  to: Phase,
  ctx: TransitionContext
): { allowed: boolean; reason?: string } {
  const fromIndex = PHASES.indexOf(from)
  const toIndex = PHASES.indexOf(to)

  // Can't go backwards
  if (toIndex < fromIndex) {
    return { allowed: false, reason: 'Cannot return to previous phases' }
  }

  // Can't skip phases (except with user override)
  if (toIndex > fromIndex + 1 && !ctx.userRequestedAdvance) {
    return { allowed: false, reason: 'Must complete each phase in order' }
  }

  // Phase-specific rules
  switch (to) {
    case 'EXCAVATION':
      // Need at least 1 scenario explored
      if (ctx.scenariosExplored < 1) {
        return { allowed: false, reason: 'Explore at least one scenario first' }
      }
      return { allowed: true }

    case 'SYNTHESIS':
      // Need sufficient signals for synthesis
      if (ctx.highConfidenceSignals < 5 && !ctx.userRequestedAdvance) {
        return {
          allowed: false,
          reason: `Need 5+ high-confidence signals (have ${ctx.highConfidenceSignals})`,
        }
      }
      return { allowed: true }

    case 'CONTRACT':
      // Need synthesis complete
      if (ctx.signalCount < 8 && !ctx.userRequestedAdvance) {
        return {
          allowed: false,
          reason: `Need 8+ signals for contract (have ${ctx.signalCount})`,
        }
      }
      return { allowed: true }

    default:
      return { allowed: true }
  }
}

/**
 * Get the next phase in sequence
 */
export function getNextPhase(current: Phase): Phase | null {
  const currentIndex = PHASES.indexOf(current)
  if (currentIndex >= PHASES.length - 1) return null
  return PHASES[currentIndex + 1] ?? null
}

/**
 * Get phase index (0-3)
 */
export function getPhaseIndex(phase: Phase): number {
  return PHASES.indexOf(phase)
}

/**
 * Check if we should force transition (hard triggers from S3-T06)
 */
export function shouldForceTransition(ctx: TransitionContext): {
  force: boolean
  targetPhase?: Phase
  reason?: string
} {
  // Hard trigger: > 12 signals = MUST go to SYNTHESIS
  if (ctx.signalCount > 12 && ctx.currentPhase === 'EXCAVATION') {
    return {
      force: true,
      targetPhase: 'SYNTHESIS',
      reason: 'Signal extraction complete (>12 signals)',
    }
  }

  // Hard trigger: User escape hatch
  if (ctx.userRequestedAdvance) {
    const next = getNextPhase(ctx.currentPhase)
    if (next) {
      return {
        force: true,
        targetPhase: next,
        reason: 'User requested to advance',
      }
    }
  }

  return { force: false }
}

/**
 * Get phase progress for UI
 */
export function getPhaseProgress(current: Phase): {
  phase: Phase
  index: number
  total: number
  isComplete: boolean
  isCurrent: boolean
}[] {
  const currentIndex = PHASES.indexOf(current)

  return PHASES.map((phase, index) => ({
    phase,
    index,
    total: PHASES.length,
    isComplete: index < currentIndex,
    isCurrent: index === currentIndex,
  }))
}

/**
 * Calculate session health metrics
 */
export interface SessionHealth {
  signalDensity: number // signals per turn
  phaseVelocity: number // turns in current phase
  isStuck: boolean // > 10 turns without signal
  recommendation: 'continue' | 'probe_deeper' | 'advance' | 'force_advance'
}

export function calculateSessionHealth(
  signalCount: number,
  turnCount: number,
  turnsInCurrentPhase: number,
  lastSignalTurn: number
): SessionHealth {
  const signalDensity = turnCount > 0 ? signalCount / turnCount : 0
  const turnsSinceLastSignal = turnCount - lastSignalTurn
  const isStuck = turnsSinceLastSignal > 10

  let recommendation: SessionHealth['recommendation'] = 'continue'

  if (isStuck) {
    recommendation = 'force_advance'
  } else if (signalDensity < 0.2 && turnCount > 5) {
    recommendation = 'probe_deeper'
  } else if (signalDensity > 0.5 && turnsInCurrentPhase > 8) {
    recommendation = 'advance'
  }

  return {
    signalDensity,
    phaseVelocity: turnsInCurrentPhase,
    isStuck,
    recommendation,
  }
}
