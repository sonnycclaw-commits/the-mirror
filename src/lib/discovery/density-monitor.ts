/**
 * Extraction Density Monitoring - S4-T05
 *
 * Monitors signal extraction density and provides alerts/fallbacks.
 *
 * Pre-mortem Elephant E2: Extraction density failure
 * - Target: 2.5+ signals per scenario
 * - Alert threshold: < 2 signals per 5 turns
 * - Synthesis guard: < 10 signals → extend follow-up phase
 */

export interface DensityStats {
  totalSignals: number
  totalTurns: number
  signalsPerTurn: number
  recentTurnCount: number // Last 5 turns
  recentSignalCount: number // Signals in last 5 turns
  recentDensity: number // signals per turn in recent window
}

export interface DensityCheck {
  healthy: boolean
  alert: boolean
  alertMessage?: string
  recommendExtend: boolean
  stats: DensityStats
}

/**
 * Domain coverage status for synthesis readiness (DECISION-001)
 */
export interface DomainCoverage {
  domains: Record<string, number> // domain -> signal count (high confidence only)
  requiredMet: boolean // VALUE and NEED present
  optionalMet: boolean // At least one of DEFENSE/PATTERN/ATTACHMENT
  missingRequired: string[] // Which required domains are missing
  recommendation?: string // Action to take if not ready
}

/**
 * Configuration for density monitoring
 */
export const DENSITY_CONFIG = {
  // Minimum signals per 5 turns before alerting
  MIN_RECENT_DENSITY: 2,

  // Turns window for recent density
  RECENT_TURN_WINDOW: 5,

  // Minimum signals before synthesis can proceed
  MIN_SIGNALS_FOR_SYNTHESIS: 10,

  // Target signals per scenario (for reporting)
  TARGET_PER_SCENARIO: 2.5,

  // If below this after 10 turns, something is wrong
  CRITICAL_MIN_DENSITY: 0.3,

  // Domain coverage requirements (DECISION-001)
  // Required: Must have signals from VALUE and NEED domains
  REQUIRED_DOMAINS: ['VALUE', 'NEED'] as const,
  // Optional: Need at least one from these domains
  OPTIONAL_DOMAINS: ['DEFENSE', 'PATTERN', 'ATTACHMENT', 'DEVELOPMENT', 'MOTIVE'] as const,
  // Minimum optional domains needed
  MIN_OPTIONAL_DOMAINS: 1,
} as const

/**
 * Calculate density statistics
 */
export function calculateDensityStats(
  totalSignals: number,
  totalTurns: number,
  recentSignals: number,
  recentTurns: number
): DensityStats {
  return {
    totalSignals,
    totalTurns,
    signalsPerTurn: totalTurns > 0 ? totalSignals / totalTurns : 0,
    recentTurnCount: recentTurns,
    recentSignalCount: recentSignals,
    recentDensity: recentTurns > 0 ? recentSignals / recentTurns : 0,
  }
}

/**
 * Check domain coverage for synthesis readiness (DECISION-001)
 *
 * For validated psychological profile synthesis, we need:
 * - Required: VALUE and NEED domains
 * - Optional: At least one of DEFENSE, PATTERN, or ATTACHMENT
 */
export function checkDomainCoverage(
  signals: Array<{ domain: string; confidence: number }>
): DomainCoverage {
  // Count signals by domain (high confidence only, > 0.6)
  const highConfSignals = signals.filter((s) => s.confidence > 0.6)
  const domains: Record<string, number> = {}

  for (const signal of highConfSignals) {
    const domain = signal.domain || 'PATTERN' // Default to PATTERN for backwards compat
    domains[domain] = (domains[domain] || 0) + 1
  }

  // Check required domains (VALUE and NEED)
  const missingRequired = DENSITY_CONFIG.REQUIRED_DOMAINS.filter(
    (d) => !domains[d] || domains[d] < 1
  )
  const requiredMet = missingRequired.length === 0

  // Check optional domains (DEFENSE, PATTERN, ATTACHMENT, etc.)
  const optionalPresent = DENSITY_CONFIG.OPTIONAL_DOMAINS.filter(
    (d) => domains[d] && domains[d] >= 1
  )
  const optionalMet = optionalPresent.length >= DENSITY_CONFIG.MIN_OPTIONAL_DOMAINS

  // Build recommendation if not ready - use conditional spread for exactOptionalPropertyTypes
  const baseResult = { domains, requiredMet, optionalMet, missingRequired }

  if (!requiredMet) {
    return {
      ...baseResult,
      recommendation:
        `Missing required domains: ${missingRequired.join(', ')}. ` +
        `Probe for ${missingRequired[0] === 'VALUE' ? 'what matters to them' : 'frustrated needs'}.`,
    }
  } else if (!optionalMet) {
    return {
      ...baseResult,
      recommendation: `Need at least one of: DEFENSE, PATTERN, or ATTACHMENT signals.`,
    }
  }

  return baseResult
}

/**
 * Check extraction density and return alerts/recommendations
 */
export function checkExtractionDensity(
  totalSignals: number,
  totalTurns: number,
  recentSignals: number, // Signals in last 5 turns
  recentTurns: number = DENSITY_CONFIG.RECENT_TURN_WINDOW
): DensityCheck {
  const stats = calculateDensityStats(
    totalSignals,
    totalTurns,
    recentSignals,
    recentTurns
  )

  // Check if recent density is below threshold
  const recentDensityLow =
    recentTurns >= DENSITY_CONFIG.RECENT_TURN_WINDOW &&
    stats.recentDensity < DENSITY_CONFIG.MIN_RECENT_DENSITY / DENSITY_CONFIG.RECENT_TURN_WINDOW

  // Check if overall density is critically low
  const criticallyLow =
    totalTurns >= 10 && stats.signalsPerTurn < DENSITY_CONFIG.CRITICAL_MIN_DENSITY

  // Check if synthesis should be blocked
  const insufficientForSynthesis =
    totalSignals < DENSITY_CONFIG.MIN_SIGNALS_FOR_SYNTHESIS

  // Build alert message if needed
  let alertMessage: string | undefined
  if (criticallyLow) {
    alertMessage = `CRITICAL: Only ${totalSignals} signals in ${totalTurns} turns (${stats.signalsPerTurn.toFixed(2)}/turn). ` +
      `Remember: Extract a signal after EVERY meaningful user response.`
  } else if (recentDensityLow) {
    alertMessage = `LOW DENSITY: Only ${recentSignals} signals in last ${recentTurns} turns. ` +
      `Target is ${DENSITY_CONFIG.MIN_RECENT_DENSITY} per ${DENSITY_CONFIG.RECENT_TURN_WINDOW} turns.`
  }

  const result: DensityCheck = {
    healthy: !recentDensityLow && !criticallyLow,
    alert: recentDensityLow || criticallyLow,
    recommendExtend: insufficientForSynthesis,
    stats,
  }
  if (alertMessage) {
    result.alertMessage = alertMessage
  }
  return result
}

/**
 * Check if synthesis phase can proceed
 * Returns false if signal count is too low or domain coverage insufficient
 *
 * @param totalSignals - Total number of extracted signals
 * @param highConfidenceSignals - Number of high confidence signals (> 0.7)
 * @param domainCoverage - Optional domain coverage check (DECISION-001)
 */
export function canProceedToSynthesis(
  totalSignals: number,
  highConfidenceSignals: number,
  domainCoverage?: DomainCoverage
): { allowed: boolean; reason?: string; recommendation?: string } {
  // Check minimum total signals
  if (totalSignals < DENSITY_CONFIG.MIN_SIGNALS_FOR_SYNTHESIS) {
    return {
      allowed: false,
      reason: `Insufficient signals for synthesis (${totalSignals}/${DENSITY_CONFIG.MIN_SIGNALS_FOR_SYNTHESIS})`,
      recommendation:
        'Continue excavation phase. Ask deeper follow-up questions to extract more signals.',
    }
  }

  // Check for quality - need some high confidence signals
  const minHighConfidence = Math.floor(DENSITY_CONFIG.MIN_SIGNALS_FOR_SYNTHESIS / 3)
  if (highConfidenceSignals < minHighConfidence) {
    return {
      allowed: false,
      reason: `Insufficient high-confidence signals (${highConfidenceSignals}/${minHighConfidence})`,
      recommendation:
        'Probe deeper to validate existing signals. Look for patterns that appear multiple times.',
    }
  }

  // Check domain coverage if provided (DECISION-001)
  if (domainCoverage) {
    if (!domainCoverage.requiredMet) {
      return {
        allowed: false,
        reason: `Missing required domains: ${domainCoverage.missingRequired.join(', ')}`,
        ...(domainCoverage.recommendation !== undefined && { recommendation: domainCoverage.recommendation }),
      }
    }

    if (!domainCoverage.optionalMet) {
      return {
        allowed: false,
        reason: 'Insufficient domain coverage',
        ...(domainCoverage.recommendation !== undefined && { recommendation: domainCoverage.recommendation }),
      }
    }
  }

  return { allowed: true }
}

/**
 * Generate prompt injection for density awareness
 * This gets added to the system prompt when density is low
 */
export function getDensityPromptInjection(check: DensityCheck): string {
  if (check.healthy) {
    return ''
  }

  const lines = [
    '\n## ⚠️ EXTRACTION DENSITY ALERT',
    '',
    check.alertMessage || 'Signal extraction density is below target.',
    '',
    '**REQUIRED ACTIONS:**',
    '1. Call `extractSignal` after EVERY meaningful user response',
    '2. Look for hidden signals in seemingly simple answers',
    '3. Extract contradictions when user says one thing but implies another',
    '4. Note emotional context (defensive, vulnerable, resistant)',
    '',
    `Current stats: ${check.stats.totalSignals} signals in ${check.stats.totalTurns} turns (${check.stats.signalsPerTurn.toFixed(2)}/turn)`,
    '',
  ]

  return lines.join('\n')
}

/**
 * Generate extraction reminder for system prompt
 * Always included to ensure consistent extraction (DECISION-001 updated)
 */
export function getExtractionReminder(): string {
  return `
## CRITICAL: Signal Extraction Protocol (DECISION-001)

After EVERY user response, you MUST call \`extractSignal\` across the 7 domains:

**VALUE** (Schwartz) - What matters to them:
- "I want to be in charge" → domain: VALUE, type: POWER
- "I want to succeed" → domain: VALUE, type: ACHIEVEMENT
- "I need stability" → domain: VALUE, type: SECURITY

**NEED** (SDT) - Frustration or satisfaction:
- "I had to" / "They made me" → domain: NEED, type: AUTONOMY, state: FRUSTRATED
- "I can't" / "I don't know how" → domain: NEED, type: COMPETENCE, state: FRUSTRATED
- "No one understands" → domain: NEED, type: RELATEDNESS, state: FRUSTRATED

**DEFENSE** (Vaillant) - Protection patterns:
- "It's not that bad" → domain: DEFENSE, type: DENIAL
- "Work is more important" → domain: DEFENSE, type: RATIONALIZATION
- "Let me research more" → domain: DEFENSE, type: INTELLECTUALIZATION

**ATTACHMENT** (Bowlby) - Relationship stories:
- Balanced, acknowledges both → domain: ATTACHMENT, type: SECURE
- Overwhelming detail, fear → domain: ATTACHMENT, type: ANXIOUS
- Dismissive, "It was fine" → domain: ATTACHMENT, type: AVOIDANT

**DEVELOPMENT** (Kegan) - Meaning-making:
- "What will they think?" → domain: DEVELOPMENT, type: SOCIALIZED
- "I decided this matters" → domain: DEVELOPMENT, type: SELF_AUTHORING

**PATTERN** (Behavioral) - Recurring behaviors:
- Use free-form type: "conflict_avoidance", "productive_procrastination"

**NO EXCUSES**: Even short responses often contain signals. "I guess so" might indicate:
- domain: PATTERN, type: conflict_avoidance (they don't commit to opinions)
- domain: NEED, type: AUTONOMY, state: FRUSTRATED (they feel controlled)

Extract first, then respond.
`
}

/**
 * Generate prompt injection for domain coverage awareness (DECISION-001)
 * This gets added to the system prompt when domain coverage is insufficient
 */
export function getDomainPromptInjection(coverage: DomainCoverage): string {
  if (coverage.requiredMet && coverage.optionalMet) {
    return ''
  }

  const lines = [
    '\n## DOMAIN COVERAGE ALERT',
    '',
    coverage.recommendation || 'Need more diverse signal extraction.',
    '',
    `Current coverage: ${Object.entries(coverage.domains)
      .map(([d, c]) => `${d}:${c}`)
      .join(', ')}`,
    '',
  ]

  return lines.join('\n')
}
