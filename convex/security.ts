/**
 * Security Utilities - S8-T01
 *
 * Rate limiting, input validation, and authorization helpers.
 *
 * Security: Public functions derive userId from authenticated JWT token
 * via getAuthenticatedUserId() - never from client parameters.
 */
import { v } from 'convex/values'
import { mutation, query, internalQuery, QueryCtx, MutationCtx, ActionCtx } from './_generated/server'
import { Id } from './_generated/dataModel'
import { internal } from './_generated/api'
import { getAuthenticatedUserId } from './lib/auth'

// Rate limit configuration
const RATE_LIMITS = {
  // Max chat actions per user per minute
  CHAT_ACTIONS_PER_MINUTE: 20,
  // Max sessions per user per hour
  SESSIONS_PER_HOUR: 5,
  // Max signals extracted per session
  SIGNALS_PER_SESSION: 100,
} as const

/**
 * Check if user owns a session (for queries/mutations with direct DB access)
 */
export async function verifySessionOwnership(
  ctx: QueryCtx | MutationCtx,
  sessionId: Id<'sessions'>,
  userId: string
): Promise<boolean> {
  const session = await ctx.db.get(sessionId)
  if (!session) return false
  return session.userId === userId
}

/**
 * Internal query for session ownership check (used by actions)
 */
export const checkSessionOwnership = internalQuery({
  args: {
    sessionId: v.id('sessions'),
    userId: v.string(),
  },
  handler: async (ctx, { sessionId, userId }) => {
    const session = await ctx.db.get(sessionId)
    if (!session) return false
    return session.userId === userId
  },
})

/**
 * Verify session ownership from an action context
 */
export async function verifySessionOwnershipFromAction(
  ctx: ActionCtx,
  sessionId: Id<'sessions'>,
  userId: string
): Promise<boolean> {
  return await ctx.runQuery(internal.security.checkSessionOwnership, {
    sessionId,
    userId,
  })
}

/**
 * Rate limiting check using in-memory tracking
 * In production, use Redis or a proper rate limiter
 *
 * Security: userId derived from JWT, not client parameter
 */
export const checkRateLimit = mutation({
  args: {
    action: v.union(v.literal('chat'), v.literal('session'), v.literal('signal')),
  },
  handler: async (ctx, { action }) => {
    const userId = await getAuthenticatedUserId(ctx)
    // For MVP, we track via session metadata
    // In production, use a dedicated rate limit table or Redis

    const now = Date.now()
    const oneMinuteAgo = now - 60 * 1000
    const oneHourAgo = now - 60 * 60 * 1000

    if (action === 'session') {
      // Count sessions created in last hour
      const recentSessions = await ctx.db
        .query('sessions')
        .withIndex('by_user', (q) => q.eq('userId', userId))
        .filter((q) => q.gte(q.field('createdAt'), oneHourAgo))
        .collect()

      if (recentSessions.length >= RATE_LIMITS.SESSIONS_PER_HOUR) {
        return { allowed: false, reason: 'Too many sessions. Please wait before starting a new one.' }
      }
    }

    if (action === 'chat') {
      // Count messages in last minute
      const userSessions = await ctx.db
        .query('sessions')
        .withIndex('by_user', (q) => q.eq('userId', userId))
        .collect()

      let recentMessageCount = 0
      for (const session of userSessions.slice(-3)) {
        const messages = await ctx.db
          .query('messages')
          .withIndex('by_session_time', (q) =>
            q.eq('sessionId', session._id).gte('createdAt', oneMinuteAgo)
          )
          .collect()
        recentMessageCount += messages.filter(m => m.role === 'user').length
      }

      if (recentMessageCount >= RATE_LIMITS.CHAT_ACTIONS_PER_MINUTE) {
        return { allowed: false, reason: 'Slow down! Too many messages.' }
      }
    }

    return { allowed: true }
  },
})

/**
 * Sanitize user input before processing
 */
export function sanitizeUserInput(input: string): string {
  // Remove potential XSS vectors (though we don't use dangerouslySetInnerHTML)
  let sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')

  // Limit length to prevent abuse
  const MAX_INPUT_LENGTH = 5000
  if (sanitized.length > MAX_INPUT_LENGTH) {
    sanitized = sanitized.substring(0, MAX_INPUT_LENGTH)
  }

  // Remove null bytes and other control characters
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')

  return sanitized.trim()
}

/**
 * Validate session can be modified by user
 *
 * Security: userId derived from JWT, not client parameter
 */
export const validateSessionAccess = query({
  args: {
    sessionId: v.id('sessions'),
  },
  handler: async (ctx, { sessionId }) => {
    const userId = await getAuthenticatedUserId(ctx)
    const session = await ctx.db.get(sessionId)
    if (!session) {
      return { valid: false, error: 'Session not found' }
    }
    if (session.userId !== userId) {
      return { valid: false, error: 'Access denied' }
    }
    return { valid: true }
  },
})

/**
 * Get security audit log for a session
 *
 * Security: userId derived from JWT, not client parameter
 */
export const getSessionAuditLog = query({
  args: {
    sessionId: v.id('sessions'),
  },
  handler: async (ctx, { sessionId }) => {
    const userId = await getAuthenticatedUserId(ctx)

    // Verify ownership first
    const session = await ctx.db.get(sessionId)
    if (!session || session.userId !== userId) {
      return null
    }

    const messages = await ctx.db
      .query('messages')
      .withIndex('by_session', (q) => q.eq('sessionId', sessionId))
      .collect()

    const signals = await ctx.db
      .query('signals')
      .withIndex('by_session', (q) => q.eq('sessionId', sessionId))
      .collect()

    return {
      sessionCreated: session.createdAt,
      messageCount: messages.length,
      signalCount: signals.length,
      lastActivity: session.updatedAt,
    }
  },
})
