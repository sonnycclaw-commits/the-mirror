/**
 * Contract mutations for Momentum Contracts
 * S5-T01: Enhanced with evidence grounding
 *
 * Security: Public functions derive userId from authenticated JWT token
 * via getAuthenticatedUserId() - never from client parameters.
 */
import { mutation, query, internalMutation, internalQuery } from './_generated/server'
import { v } from 'convex/values'
import { getAuthenticatedUserId } from './lib/auth'

// DECISION-001: Signal domain enum for validated evidence
const signalDomainValidator = v.optional(
  v.union(
    v.literal('VALUE'),
    v.literal('NEED'),
    v.literal('MOTIVE'),
    v.literal('DEFENSE'),
    v.literal('ATTACHMENT'),
    v.literal('DEVELOPMENT'),
    v.literal('PATTERN')
  )
)

// Legacy signal type validator (for backwards compatibility)
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

// DECISION-001: Updated evidence validator with domain/type structure
const evidenceValidator = v.optional(
  v.array(
    v.object({
      quote: v.string(),
      scenarioName: v.optional(v.string()),
      // New validated domain structure
      signalDomain: signalDomainValidator,
      signalType: v.optional(v.string()), // Specific construct within domain
      // Legacy field for backwards compatibility
      legacySignalType: legacySignalTypeValidator,
    })
  )
)

const contradictionValidator = v.optional(
  v.object({
    stated: v.string(),
    actual: v.string(),
  })
)

/**
 * Create a contract (internal - called from discovery action)
 */
export const create = internalMutation({
  args: {
    sessionId: v.id('sessions'),
    userId: v.string(),
    refusal: v.string(),
    becoming: v.string(),
    proof: v.string(),
    test: v.string(),
    vote: v.string(),
    rule: v.string(),
    evidence: evidenceValidator,
    mirrorMoment: v.optional(v.string()),
    primaryContradiction: contradictionValidator,
  },
  returns: v.id('contracts'),
  handler: async (ctx, args) => {
    // Use conditional spread to omit undefined optional fields for exactOptionalPropertyTypes
    return await ctx.db.insert('contracts', {
      sessionId: args.sessionId,
      userId: args.userId,
      status: 'DRAFT',
      refusal: args.refusal,
      becoming: args.becoming,
      proof: args.proof,
      test: args.test,
      vote: args.vote,
      rule: args.rule,
      createdAt: Date.now(),
      ...(args.evidence !== undefined && { evidence: args.evidence }),
      ...(args.mirrorMoment !== undefined && { mirrorMoment: args.mirrorMoment }),
      ...(args.primaryContradiction !== undefined && { primaryContradiction: args.primaryContradiction }),
    })
  },
})

/**
 * Sign a contract
 *
 * Security: Verifies authenticated user owns the contract
 */
export const sign = mutation({
  args: {
    contractId: v.id('contracts'),
  },
  returns: v.null(),
  handler: async (ctx, { contractId }) => {
    const userId = await getAuthenticatedUserId(ctx)
    const contract = await ctx.db.get(contractId)

    if (!contract || contract.userId !== userId) {
      throw new Error('Contract not found or access denied')
    }

    await ctx.db.patch(contractId, {
      status: 'SIGNED',
      signedAt: Date.now(),
    })
  },
})

/**
 * Get contract by session (internal - for actions)
 */
export const getBySession = internalQuery({
  args: {
    sessionId: v.id('sessions'),
  },
  handler: async (ctx, { sessionId }) => {
    return await ctx.db
      .query('contracts')
      .withIndex('by_session', (q) => q.eq('sessionId', sessionId))
      .first()
  },
})

/**
 * Get contracts for user
 *
 * Security: userId derived from JWT, not client parameter
 */
export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthenticatedUserId(ctx)
    return await ctx.db
      .query('contracts')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .order('desc')
      .collect()
  },
})

/**
 * Get public contract by ID (for sharing)
 */
export const getPublic = query({
  args: {
    contractId: v.id('contracts'),
  },
  handler: async (ctx, { contractId }) => {
    const contract = await ctx.db.get(contractId)
    if (!contract || contract.status !== 'SIGNED') {
      return null
    }
    // Return only public fields
    return {
      id: contract._id,
      refusal: contract.refusal,
      becoming: contract.becoming,
      proof: contract.proof,
      test: contract.test,
      vote: contract.vote,
      rule: contract.rule,
      signedAt: contract.signedAt,
    }
  },
})
