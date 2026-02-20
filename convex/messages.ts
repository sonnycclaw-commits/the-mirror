/**
 * Message mutations for chat history
 *
 * Security: Public functions verify session ownership via getAuthenticatedUserId()
 */
import { query, internalMutation, internalQuery } from './_generated/server'
import { v } from 'convex/values'
import { getAuthenticatedUserId } from './lib/auth'

const roleValidator = v.union(
  v.literal('user'),
  v.literal('assistant'),
  v.literal('system')
)

/**
 * Add a message to session history (internal - for actions)
 */
export const add = internalMutation({
  args: {
    sessionId: v.id('sessions'),
    role: roleValidator,
    content: v.string(),
    toolCalls: v.optional(v.any()),
    toolResults: v.optional(v.any()),
  },
  returns: v.id('messages'),
  handler: async (ctx, args) => {
    return await ctx.db.insert('messages', {
      sessionId: args.sessionId,
      role: args.role,
      content: args.content,
      toolCalls: args.toolCalls,
      toolResults: args.toolResults,
      createdAt: Date.now(),
    })
  },
})

/**
 * Get messages for session (internal - for actions)
 */
export const listBySession = internalQuery({
  args: {
    sessionId: v.id('sessions'),
  },
  handler: async (ctx, { sessionId }) => {
    return await ctx.db
      .query('messages')
      .withIndex('by_session_time', (q) => q.eq('sessionId', sessionId))
      .order('asc')
      .collect()
  },
})

/**
 * Get messages for session (public - for React hooks)
 *
 * Security: Verifies authenticated user owns the session before returning messages.
 * This prevents users from reading other users' session data.
 */
export const listBySessionPublic = query({
  args: {
    sessionId: v.id('sessions'),
  },
  handler: async (ctx, { sessionId }) => {
    const userId = await getAuthenticatedUserId(ctx)

    // Verify the session belongs to the authenticated user
    const session = await ctx.db.get(sessionId)
    if (!session || session.userId !== userId) {
      throw new Error('Session not found or access denied')
    }

    return await ctx.db
      .query('messages')
      .withIndex('by_session_time', (q) => q.eq('sessionId', sessionId))
      .order('asc')
      .collect()
  },
})
