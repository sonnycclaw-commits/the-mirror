/**
 * Memory Graph - S4-T03
 *
 * Manages the psychological signal graph with:
 * - Scenarios (grouping context for signals)
 * - Contradictions (explicit links between conflicting signals)
 * - Evidence links (connecting signals to source messages)
 *
 * Security: All public functions verify session ownership via getAuthenticatedUserId()
 *
 * Key query: "all signals for scenario X"
 */
import { mutation, query, internalMutation } from './_generated/server'
import { v } from 'convex/values'
import { getAuthenticatedUserId } from './lib/auth'

// ============================================
// SCENARIOS
// ============================================

/**
 * Create a new scenario
 *
 * Security: Verifies authenticated user owns the session
 */
export const createScenario = mutation({
  args: {
    sessionId: v.id('sessions'),
    name: v.string(),
    description: v.string(),
    phase: v.union(
      v.literal('SCENARIO'),
      v.literal('EXCAVATION'),
      v.literal('SYNTHESIS'),
      v.literal('CONTRACT')
    ),
  },
  returns: v.id('scenarios'),
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx)
    const session = await ctx.db.get(args.sessionId)
    if (!session || session.userId !== userId) {
      throw new Error('Session not found or access denied')
    }

    // Deactivate any existing active scenario
    const activeScenarios = await ctx.db
      .query('scenarios')
      .withIndex('by_session_active', (q) =>
        q.eq('sessionId', args.sessionId).eq('isActive', true)
      )
      .collect()

    for (const scenario of activeScenarios) {
      await ctx.db.patch(scenario._id, { isActive: false })
    }

    return await ctx.db.insert('scenarios', {
      sessionId: args.sessionId,
      name: args.name,
      description: args.description,
      phase: args.phase,
      isActive: true,
      createdAt: Date.now(),
    })
  },
})

/**
 * Get active scenario for session
 *
 * Security: Verifies authenticated user owns the session
 */
export const getActiveScenario = query({
  args: {
    sessionId: v.id('sessions'),
  },
  handler: async (ctx, { sessionId }) => {
    const userId = await getAuthenticatedUserId(ctx)
    const session = await ctx.db.get(sessionId)
    if (!session || session.userId !== userId) {
      throw new Error('Session not found or access denied')
    }

    return await ctx.db
      .query('scenarios')
      .withIndex('by_session_active', (q) =>
        q.eq('sessionId', sessionId).eq('isActive', true)
      )
      .first()
  },
})

/**
 * Get all scenarios for session
 *
 * Security: Verifies authenticated user owns the session
 */
export const listScenarios = query({
  args: {
    sessionId: v.id('sessions'),
  },
  handler: async (ctx, { sessionId }) => {
    const userId = await getAuthenticatedUserId(ctx)
    const session = await ctx.db.get(sessionId)
    if (!session || session.userId !== userId) {
      throw new Error('Session not found or access denied')
    }

    return await ctx.db
      .query('scenarios')
      .withIndex('by_session', (q) => q.eq('sessionId', sessionId))
      .collect()
  },
})

// ============================================
// CONTRADICTIONS
// ============================================

const contradictionTypeValidator = v.union(
  v.literal('SAY_DO_GAP'),
  v.literal('VALUE_BEHAVIOR'),
  v.literal('TEMPORAL'),
  v.literal('IMPLICIT')
)

/**
 * Record a contradiction between two signals
 *
 * Security: Verifies authenticated user owns the session
 */
export const recordContradiction = mutation({
  args: {
    sessionId: v.id('sessions'),
    signalA: v.id('signals'),
    signalB: v.id('signals'),
    contradictionType: contradictionTypeValidator,
    description: v.string(),
    confidence: v.number(),
  },
  returns: v.id('contradictions'),
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx)
    const session = await ctx.db.get(args.sessionId)
    if (!session || session.userId !== userId) {
      throw new Error('Session not found or access denied')
    }

    return await ctx.db.insert('contradictions', {
      sessionId: args.sessionId,
      signalA: args.signalA,
      signalB: args.signalB,
      contradictionType: args.contradictionType,
      description: args.description,
      confidence: args.confidence,
      createdAt: Date.now(),
    })
  },
})

/**
 * Get all contradictions for session
 *
 * Security: Verifies authenticated user owns the session
 */
export const listContradictions = query({
  args: {
    sessionId: v.id('sessions'),
  },
  handler: async (ctx, { sessionId }) => {
    const userId = await getAuthenticatedUserId(ctx)
    const session = await ctx.db.get(sessionId)
    if (!session || session.userId !== userId) {
      throw new Error('Session not found or access denied')
    }

    return await ctx.db
      .query('contradictions')
      .withIndex('by_session', (q) => q.eq('sessionId', sessionId))
      .collect()
  },
})

/**
 * Get contradictions for a specific signal
 *
 * Security: Verifies authenticated user owns the signal's session
 */
export const getContradictionsForSignal = query({
  args: {
    signalId: v.id('signals'),
  },
  handler: async (ctx, { signalId }) => {
    const userId = await getAuthenticatedUserId(ctx)

    // Get signal to find its session
    const signal = await ctx.db.get(signalId)
    if (!signal) {
      throw new Error('Signal not found')
    }

    const session = await ctx.db.get(signal.sessionId)
    if (!session || session.userId !== userId) {
      throw new Error('Access denied')
    }

    const asA = await ctx.db
      .query('contradictions')
      .withIndex('by_signal_a', (q) => q.eq('signalA', signalId))
      .collect()

    const asB = await ctx.db
      .query('contradictions')
      .withIndex('by_signal_b', (q) => q.eq('signalB', signalId))
      .collect()

    return [...asA, ...asB]
  },
})

/**
 * Mark a contradiction as resolved
 *
 * Security: Verifies authenticated user owns the contradiction's session
 */
export const resolveContradiction = mutation({
  args: {
    contradictionId: v.id('contradictions'),
  },
  handler: async (ctx, { contradictionId }) => {
    const userId = await getAuthenticatedUserId(ctx)

    const contradiction = await ctx.db.get(contradictionId)
    if (!contradiction) {
      throw new Error('Contradiction not found')
    }

    const session = await ctx.db.get(contradiction.sessionId)
    if (!session || session.userId !== userId) {
      throw new Error('Access denied')
    }

    await ctx.db.patch(contradictionId, {
      resolvedAt: Date.now(),
    })
  },
})

// ============================================
// EVIDENCE LINKS
// ============================================

/**
 * Create an evidence link between signal and message
 */
export const createEvidenceLink = internalMutation({
  args: {
    sessionId: v.id('sessions'),
    signalId: v.id('signals'),
    messageId: v.id('messages'),
    scenarioId: v.optional(v.id('scenarios')),
    quote: v.string(),
    turnNumber: v.number(),
  },
  handler: async (ctx, args) => {
    // Use conditional spread to omit undefined optional fields for exactOptionalPropertyTypes
    return await ctx.db.insert('evidenceLinks', {
      sessionId: args.sessionId,
      signalId: args.signalId,
      messageId: args.messageId,
      quote: args.quote,
      turnNumber: args.turnNumber,
      createdAt: Date.now(),
      ...(args.scenarioId !== undefined && { scenarioId: args.scenarioId }),
    })
  },
})

/**
 * Get all evidence links for a signal
 *
 * Security: Verifies authenticated user owns the signal's session
 */
export const getEvidenceForSignal = query({
  args: {
    signalId: v.id('signals'),
  },
  handler: async (ctx, { signalId }) => {
    const userId = await getAuthenticatedUserId(ctx)

    // Get signal to find its session
    const signal = await ctx.db.get(signalId)
    if (!signal) {
      throw new Error('Signal not found')
    }

    const session = await ctx.db.get(signal.sessionId)
    if (!session || session.userId !== userId) {
      throw new Error('Access denied')
    }

    return await ctx.db
      .query('evidenceLinks')
      .withIndex('by_signal', (q) => q.eq('signalId', signalId))
      .collect()
  },
})

// ============================================
// COMPOSITE QUERIES (Key for S4-T03 validation)
// ============================================

/**
 * Get all signals for a specific scenario
 * This is the key validation query for S4-T03
 *
 * Security: Verifies authenticated user owns the scenario's session
 */
export const getSignalsForScenario = query({
  args: {
    scenarioId: v.id('scenarios'),
  },
  handler: async (ctx, { scenarioId }) => {
    const userId = await getAuthenticatedUserId(ctx)

    // Get scenario to find its session
    const scenario = await ctx.db.get(scenarioId)
    if (!scenario) {
      throw new Error('Scenario not found')
    }

    const session = await ctx.db.get(scenario.sessionId)
    if (!session || session.userId !== userId) {
      throw new Error('Access denied')
    }

    // Get all evidence links for this scenario
    const evidenceLinks = await ctx.db
      .query('evidenceLinks')
      .withIndex('by_scenario', (q) => q.eq('scenarioId', scenarioId))
      .collect()

    // Get unique signal IDs
    const signalIds = [...new Set(evidenceLinks.map((e) => e.signalId))]

    // Fetch all signals
    const signals = await Promise.all(
      signalIds.map((id) => ctx.db.get(id))
    )

    return signals.filter((s) => s !== null)
  },
})

/**
 * Get complete signal graph for session
 * Returns signals with their contradictions and evidence
 *
 * Security: Verifies authenticated user owns the session
 */
export const getSignalGraph = query({
  args: {
    sessionId: v.id('sessions'),
  },
  handler: async (ctx, { sessionId }) => {
    const userId = await getAuthenticatedUserId(ctx)
    const session = await ctx.db.get(sessionId)
    if (!session || session.userId !== userId) {
      throw new Error('Session not found or access denied')
    }

    // Get all signals
    const signals = await ctx.db
      .query('signals')
      .withIndex('by_session', (q) => q.eq('sessionId', sessionId))
      .collect()

    // Get all contradictions
    const contradictions = await ctx.db
      .query('contradictions')
      .withIndex('by_session', (q) => q.eq('sessionId', sessionId))
      .collect()

    // Get all evidence links
    const evidenceLinks = await ctx.db
      .query('evidenceLinks')
      .withIndex('by_session', (q) => q.eq('sessionId', sessionId))
      .collect()

    // Get all scenarios
    const scenarios = await ctx.db
      .query('scenarios')
      .withIndex('by_session', (q) => q.eq('sessionId', sessionId))
      .collect()

    // Build enriched signal data
    const enrichedSignals = signals.map((signal) => ({
      ...signal,
      contradictions: contradictions.filter(
        (c) => c.signalA === signal._id || c.signalB === signal._id
      ),
      evidence: evidenceLinks.filter((e) => e.signalId === signal._id),
    }))

    return {
      signals: enrichedSignals,
      contradictions,
      scenarios,
      stats: {
        totalSignals: signals.length,
        highConfidenceSignals: signals.filter((s) => s.confidence > 0.7).length,
        totalContradictions: contradictions.length,
        unresolvedContradictions: contradictions.filter((c) => !c.resolvedAt).length,
      },
    }
  },
})

/**
 * Get signal summary (for synthesis) - DECISION-001 updated
 *
 * Groups signals by:
 * - domain: Psychological domain (VALUE, NEED, DEFENSE, etc.)
 * - type: Specific construct within domain (AUTONOMY, ACHIEVEMENT, etc.)
 * - lifeDomain: Life area (WORK, RELATIONSHIPS, etc.)
 *
 * Security: Verifies authenticated user owns the session
 */
export const getSignalSummary = query({
  args: {
    sessionId: v.id('sessions'),
  },
  handler: async (ctx, { sessionId }) => {
    const userId = await getAuthenticatedUserId(ctx)
    const session = await ctx.db.get(sessionId)
    if (!session || session.userId !== userId) {
      throw new Error('Session not found or access denied')
    }

    const signals = await ctx.db
      .query('signals')
      .withIndex('by_session', (q) => q.eq('sessionId', sessionId))
      .collect()

    // Group by psychological domain (VALUE, NEED, DEFENSE, etc.)
    const byDomain: Record<string, typeof signals> = {}
    for (const signal of signals) {
      const domain = signal.domain
      if (!byDomain[domain]) {
        byDomain[domain] = []
      }
      byDomain[domain].push(signal)
    }

    // Group by specific type within domain (AUTONOMY, ACHIEVEMENT, etc.)
    const byType: Record<string, typeof signals> = {}
    for (const signal of signals) {
      const arr = byType[signal.type] ?? (byType[signal.type] = [])
      arr.push(signal)
    }

    // Group by life domain (WORK, RELATIONSHIPS, etc.)
    const byLifeDomain: Record<string, typeof signals> = {}
    for (const signal of signals) {
      const lifeDomain = signal.lifeDomain || 'GENERAL'
      if (!byLifeDomain[lifeDomain]) {
        byLifeDomain[lifeDomain] = []
      }
      byLifeDomain[lifeDomain].push(signal)
    }

    return {
      byDomain,       // Psychological domain grouping
      byType,         // Specific construct grouping
      byLifeDomain,   // Life area grouping
      total: signals.length,
      highConfidence: signals.filter((s) => s.confidence > 0.7),
      // DECISION-001: Include frustrated needs for priority attention
      frustrations: signals.filter(
        (s) => s.domain === 'NEED' && s.state === 'FRUSTRATED'
      ),
    }
  },
})

// ============================================
// DOMAIN COVERAGE QUERIES (DECISION-001)
// ============================================

/**
 * Get signals by domain for session
 * Useful for targeted domain analysis
 *
 * Security: Verifies authenticated user owns the session
 */
export const listBySessionAndDomain = query({
  args: {
    sessionId: v.id('sessions'),
    domain: v.union(
      v.literal('VALUE'),
      v.literal('NEED'),
      v.literal('MOTIVE'),
      v.literal('DEFENSE'),
      v.literal('ATTACHMENT'),
      v.literal('DEVELOPMENT'),
      v.literal('PATTERN')
    ),
  },
  handler: async (ctx, { sessionId, domain }) => {
    const userId = await getAuthenticatedUserId(ctx)
    const session = await ctx.db.get(sessionId)
    if (!session || session.userId !== userId) {
      throw new Error('Session not found or access denied')
    }

    // Use the by_session_domain index if available
    const allSignals = await ctx.db
      .query('signals')
      .withIndex('by_session_domain', (q) =>
        q.eq('sessionId', sessionId).eq('domain', domain)
      )
      .collect()

    return allSignals
  },
})

/**
 * Get domain coverage summary for session (DECISION-001)
 *
 * Returns counts by psychological domain for synthesis readiness check.
 * Domains: VALUE, NEED, DEFENSE, PATTERN, ATTACHMENT, DEVELOPMENT, MOTIVE
 *
 * Security: Verifies authenticated user owns the session
 */
export const getDomainCoverage = query({
  args: {
    sessionId: v.id('sessions'),
  },
  handler: async (ctx, { sessionId }) => {
    const userId = await getAuthenticatedUserId(ctx)
    const session = await ctx.db.get(sessionId)
    if (!session || session.userId !== userId) {
      throw new Error('Session not found or access denied')
    }

    const signals = await ctx.db
      .query('signals')
      .withIndex('by_session', (q) => q.eq('sessionId', sessionId))
      .collect()

    // Count by domain (only high confidence signals, > 0.6)
    const coverage: Record<string, number> = {}
    const highConfSignals = signals.filter((s) => s.confidence > 0.6)

    for (const signal of highConfSignals) {
      const domain = signal.domain || 'PATTERN' // Default to PATTERN for backwards compat
      coverage[domain] = (coverage[domain] || 0) + 1
    }

    // Check required domains
    const requiredDomains = ['VALUE', 'NEED'] as const
    const missingRequired = requiredDomains.filter(
      (d) => !coverage[d] || coverage[d] < 1
    )

    // Check optional domains
    const optionalDomains = ['DEFENSE', 'PATTERN', 'ATTACHMENT', 'DEVELOPMENT', 'MOTIVE'] as const
    const optionalPresent = optionalDomains.filter(
      (d) => coverage[d] && coverage[d] >= 1
    )

    return {
      coverage,
      totalSignals: signals.length,
      highConfidenceSignals: highConfSignals.length,
      domainsPresent: Object.keys(coverage),
      // Synthesis readiness
      requiredMet: missingRequired.length === 0,
      optionalMet: optionalPresent.length >= 1,
      missingRequired,
    }
  },
})
