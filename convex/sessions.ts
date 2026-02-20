/**
 * Session mutations for discovery flow
 *
 * Security: Public functions derive userId from authenticated JWT token
 * via getAuthenticatedUserId() - never from client parameters.
 */
import { mutation, query, internalMutation, internalQuery } from './_generated/server'
import { v } from 'convex/values'
import { getAuthenticatedUserId } from './lib/auth'

const phaseValidator = v.union(
  v.literal('SCENARIO'),
  v.literal('EXCAVATION'),
  v.literal('SYNTHESIS'),
  v.literal('CONTRACT')
)

/**
 * Create a new discovery session
 *
 * Security: userId derived from JWT, not client parameter
 */
export const create = mutation({
  args: {},
  returns: v.id('sessions'),
  handler: async (ctx) => {
    const userId = await getAuthenticatedUserId(ctx)
    const now = Date.now()
    return await ctx.db.insert('sessions', {
      userId,
      currentPhase: 'SCENARIO',
      createdAt: now,
      updatedAt: now,
    })
  },
})

/**
 * Update session phase (internal - for actions)
 */
export const updatePhase = internalMutation({
  args: {
    sessionId: v.id('sessions'),
    phase: phaseValidator,
  },
  returns: v.null(),
  handler: async (ctx, { sessionId, phase }) => {
    await ctx.db.patch(sessionId, {
      currentPhase: phase,
      updatedAt: Date.now(),
    })
  },
})

/**
 * Update session stream ID
 *
 * Security: Verifies authenticated user owns the session
 */
export const setStreamId = mutation({
  args: {
    sessionId: v.id('sessions'),
    streamId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, { sessionId, streamId }) => {
    const userId = await getAuthenticatedUserId(ctx)
    const session = await ctx.db.get(sessionId)

    if (!session || session.userId !== userId) {
      throw new Error('Session not found or access denied')
    }

    await ctx.db.patch(sessionId, {
      streamId,
      updatedAt: Date.now(),
    })
  },
})

/**
 * Get session by ID (internal - for actions)
 */
export const get = internalQuery({
  args: {
    sessionId: v.id('sessions'),
  },
  handler: async (ctx, { sessionId }) => {
    return await ctx.db.get(sessionId)
  },
})

/**
 * Get session by ID (public - for client)
 *
 * Security: Verifies authenticated user owns the session
 */
export const getPublic = query({
  args: {
    sessionId: v.id('sessions'),
  },
  handler: async (ctx, { sessionId }) => {
    const userId = await getAuthenticatedUserId(ctx)
    const session = await ctx.db.get(sessionId)

    if (!session || session.userId !== userId) {
      throw new Error('Session not found or access denied')
    }

    return session
  },
})

/**
 * Get active session for user
 *
 * Security: userId derived from JWT, not client parameter
 */
export const getActiveForUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthenticatedUserId(ctx)
    return await ctx.db
      .query('sessions')
      .withIndex('by_user_updated', (q) => q.eq('userId', userId))
      .order('desc')
      .first()
  },
})

/**
 * Increment turn counter (S3-T02) - internal for actions
 */
export const incrementTurn = internalMutation({
  args: {
    sessionId: v.id('sessions'),
  },
  returns: v.null(),
  handler: async (ctx, { sessionId }) => {
    const session = await ctx.db.get(sessionId)
    if (!session) throw new Error('Session not found')

    await ctx.db.patch(sessionId, {
      turnsInPhase: (session.turnsInPhase || 0) + 1,
      totalTurns: (session.totalTurns || 0) + 1,
      updatedAt: Date.now(),
    })
  },
})

/**
 * Increment scenario count (S3-T01)
 *
 * Security: Verifies authenticated user owns the session
 */
export const incrementScenarios = mutation({
  args: {
    sessionId: v.id('sessions'),
  },
  returns: v.null(),
  handler: async (ctx, { sessionId }) => {
    const userId = await getAuthenticatedUserId(ctx)
    const session = await ctx.db.get(sessionId)

    if (!session || session.userId !== userId) {
      throw new Error('Session not found or access denied')
    }

    await ctx.db.patch(sessionId, {
      scenariosExplored: (session.scenariosExplored || 0) + 1,
      updatedAt: Date.now(),
    })
  },
})
