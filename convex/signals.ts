/**
 * Signal mutations for psychological data extraction
 * DECISION-001: Validated Signal Extraction Schema
 *
 * Security: Public functions verify session ownership via getAuthenticatedUserId()
 *
 * Uses 7 validated psychological domains:
 * - VALUE (Schwartz)
 * - NEED (SDT)
 * - MOTIVE (McClelland)
 * - DEFENSE (Vaillant)
 * - ATTACHMENT (Bowlby)
 * - DEVELOPMENT (Kegan)
 * - PATTERN (Behavioral)
 */
import { query, internalMutation, internalQuery } from './_generated/server'
import { v } from 'convex/values'
import { getAuthenticatedUserId } from './lib/auth'

// =============================================================================
// DECISION-001: Validated Signal Domain/Type Validators
// =============================================================================

// Signal domain enum - the 7 validated psychological domains
const signalDomainValidator = v.union(
  v.literal('VALUE'),       // Schwartz Basic Human Values
  v.literal('NEED'),        // Self-Determination Theory
  v.literal('MOTIVE'),      // McClelland's Acquired Needs
  v.literal('DEFENSE'),     // Vaillant's Defense Mechanisms
  v.literal('ATTACHMENT'),  // Bowlby's Attachment Theory
  v.literal('DEVELOPMENT'), // Kegan's Adult Development
  v.literal('PATTERN')      // Behavioral observation (free-form)
)

// State for NEED (SATISFIED/FRUSTRATED) or DEVELOPMENT (STABLE/TRANSITIONING)
const signalStateValidator = v.optional(
  v.union(
    v.literal('SATISFIED'),
    v.literal('FRUSTRATED'),
    v.literal('STABLE'),
    v.literal('TRANSITIONING')
  )
)

// Emotional context validator
const emotionalContextValidator = v.optional(
  v.union(
    v.literal('neutral'),
    v.literal('defensive'),
    v.literal('vulnerable'),
    v.literal('resistant'),
    v.literal('open'),
    v.literal('conflicted')
  )
)

// Life domain validator (UPPERCASE for consistency)
const lifeDomainValidator = v.optional(
  v.union(
    v.literal('WORK'),
    v.literal('RELATIONSHIPS'),
    v.literal('HEALTH'),
    v.literal('PERSONAL_GROWTH'),
    v.literal('FINANCE'),
    v.literal('GENERAL')
  )
)

// Legacy signal type validator (for backward compatibility)
const legacySignalTypeValidator = v.optional(
  v.union(
    v.literal('VALUE'),
    v.literal('FEAR'),
    v.literal('CONSTRAINT'),
    v.literal('PATTERN'),
    v.literal('GOAL'),
    v.literal('DEFENSE_MECHANISM'),
    v.literal('CONTRADICTION'),
    v.literal('NEED')
  )
)

/**
 * Save an extracted signal (DECISION-001 schema)
 *
 * @example
 * // Saving a frustrated autonomy need
 * save({
 *   sessionId: "...",
 *   domain: "NEED",
 *   type: "AUTONOMY",
 *   state: "FRUSTRATED",
 *   content: "User feels trapped by external expectations",
 *   source: "I had to do what they wanted, I had no choice",
 *   confidence: 0.85,
 *   lifeDomain: "WORK"
 * })
 */
export const save = internalMutation({
  args: {
    sessionId: v.id('sessions'),
    // New DECISION-001 fields
    domain: signalDomainValidator,
    type: v.string(), // Specific construct within domain
    state: signalStateValidator,
    // Core fields
    content: v.string(),
    source: v.string(),
    confidence: v.number(),
    emotionalContext: emotionalContextValidator,
    scenarioId: v.optional(v.string()),
    lifeDomain: lifeDomainValidator,
    relatedSignals: v.optional(v.array(v.string())),
    // Legacy field for migration
    legacyType: legacySignalTypeValidator,
  },
  returns: v.id('signals'),
  handler: async (ctx, args) => {
    // Use conditional spread to omit undefined optional fields for exactOptionalPropertyTypes
    return await ctx.db.insert('signals', {
      sessionId: args.sessionId,
      domain: args.domain,
      type: args.type,
      content: args.content,
      source: args.source,
      confidence: args.confidence,
      createdAt: Date.now(),
      ...(args.state !== undefined && { state: args.state }),
      ...(args.emotionalContext !== undefined && { emotionalContext: args.emotionalContext }),
      ...(args.scenarioId !== undefined && { scenarioId: args.scenarioId }),
      ...(args.lifeDomain !== undefined && { lifeDomain: args.lifeDomain }),
      ...(args.legacyType !== undefined && { legacyType: args.legacyType }),
    })
  },
})

/**
 * Get all signals for a session (internal - for actions)
 */
export const listBySession = internalQuery({
  args: {
    sessionId: v.id('sessions'),
  },
  handler: async (ctx, { sessionId }) => {
    return await ctx.db
      .query('signals')
      .withIndex('by_session', (q) => q.eq('sessionId', sessionId))
      .collect()
  },
})

/**
 * Get all signals for a session (public - for React hooks)
 *
 * Security: Verifies authenticated user owns the session
 */
export const listBySessionPublic = query({
  args: {
    sessionId: v.id('sessions'),
  },
  handler: async (ctx, { sessionId }) => {
    const userId = await getAuthenticatedUserId(ctx)

    // Verify session ownership
    const session = await ctx.db.get(sessionId)
    if (!session || session.userId !== userId) {
      throw new Error('Session not found or access denied')
    }

    return await ctx.db
      .query('signals')
      .withIndex('by_session', (q) => q.eq('sessionId', sessionId))
      .collect()
  },
})

/**
 * Get signals by domain for session (DECISION-001)
 *
 * Security: Verifies authenticated user owns the session
 *
 * @example
 * // Get all NEED signals
 * listBySessionAndDomain({ sessionId: "...", domain: "NEED" })
 */
export const listBySessionAndDomain = query({
  args: {
    sessionId: v.id('sessions'),
    domain: signalDomainValidator,
  },
  handler: async (ctx, { sessionId, domain }) => {
    const userId = await getAuthenticatedUserId(ctx)
    const session = await ctx.db.get(sessionId)
    if (!session || session.userId !== userId) {
      throw new Error('Session not found or access denied')
    }

    return await ctx.db
      .query('signals')
      .withIndex('by_session_domain', (q) =>
        q.eq('sessionId', sessionId).eq('domain', domain)
      )
      .collect()
  },
})

/**
 * Get signals by specific type within a domain
 *
 * Security: Verifies authenticated user owns the session
 *
 * @example
 * // Get all AUTONOMY needs
 * listBySessionAndType({ sessionId: "...", type: "AUTONOMY" })
 */
export const listBySessionAndType = query({
  args: {
    sessionId: v.id('sessions'),
    type: v.string(),
  },
  handler: async (ctx, { sessionId, type }) => {
    const userId = await getAuthenticatedUserId(ctx)
    const session = await ctx.db.get(sessionId)
    if (!session || session.userId !== userId) {
      throw new Error('Session not found or access denied')
    }

    return await ctx.db
      .query('signals')
      .withIndex('by_session_type', (q) =>
        q.eq('sessionId', sessionId).eq('type', type)
      )
      .collect()
  },
})

/**
 * Get signals by life domain (WORK, RELATIONSHIPS, etc.)
 *
 * Security: Verifies authenticated user owns the session
 */
export const listBySessionAndLifeDomain = query({
  args: {
    sessionId: v.id('sessions'),
    lifeDomain: v.union(
      v.literal('WORK'),
      v.literal('RELATIONSHIPS'),
      v.literal('HEALTH'),
      v.literal('PERSONAL_GROWTH'),
      v.literal('FINANCE'),
      v.literal('GENERAL')
    ),
  },
  handler: async (ctx, { sessionId, lifeDomain }) => {
    const userId = await getAuthenticatedUserId(ctx)
    const session = await ctx.db.get(sessionId)
    if (!session || session.userId !== userId) {
      throw new Error('Session not found or access denied')
    }

    return await ctx.db
      .query('signals')
      .withIndex('by_session_life_domain', (q) =>
        q.eq('sessionId', sessionId).eq('lifeDomain', lifeDomain)
      )
      .collect()
  },
})

/**
 * Get domain distribution for density monitoring
 *
 * Returns count of signals per domain for a session.
 *
 * Security: Verifies authenticated user owns the session
 */
export const getDomainDistribution = query({
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

    const distribution: Record<string, number> = {
      VALUE: 0,
      NEED: 0,
      MOTIVE: 0,
      DEFENSE: 0,
      ATTACHMENT: 0,
      DEVELOPMENT: 0,
      PATTERN: 0,
    }

    for (const signal of signals) {
      const domain = signal.domain
      if (domain in distribution) {
        distribution[domain] = (distribution[domain] ?? 0) + 1
      }
    }

    return distribution
  },
})

/**
 * Get signal summary for synthesis
 *
 * Groups signals by domain with evidence for profile synthesis.
 *
 * Security: Verifies authenticated user owns the session
 */
export const getSignalSummaryForSynthesis = query({
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

    // Group by domain
    const byDomain: Record<string, typeof signals> = {}
    for (const signal of signals) {
      const arr = byDomain[signal.domain] ?? (byDomain[signal.domain] = [])
      arr.push(signal)
    }

    return {
      total: signals.length,
      byDomain,
      // High confidence signals (>= 0.7) for synthesis priority
      highConfidence: signals.filter((s) => s.confidence >= 0.7),
      // Signals with frustrated needs for priority attention
      frustrations: signals.filter(
        (s) => s.domain === 'NEED' && s.state === 'FRUSTRATED'
      ),
    }
  },
})
