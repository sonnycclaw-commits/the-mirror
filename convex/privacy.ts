/**
 * Privacy & Data Management - S8-T02
 *
 * User data rights: export, delete, retention.
 *
 * Security: All functions derive userId from authenticated JWT token
 * via getAuthenticatedUserId() - never from client parameters.
 */
import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { getAuthenticatedUserId } from './lib/auth'

// Data retention configuration
const RETENTION_CONFIG = {
  // Days to keep completed sessions
  SESSION_RETENTION_DAYS: 90,
  // Days to keep signals after session ends
  SIGNAL_RETENTION_DAYS: 90,
  // Days to keep contracts (longer for user value)
  CONTRACT_RETENTION_DAYS: 365,
} as const

/**
 * Export all user data
 *
 * Security: userId derived from JWT, not client parameter
 */
export const exportUserData = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthenticatedUserId(ctx)
    // Get all sessions
    const sessions = await ctx.db
      .query('sessions')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect()

    const exportData: {
      exportedAt: string
      userId: string
      sessions: Array<{
        id: string
        createdAt: number
        phase: string
        messages: Array<{ role: string; content: string; createdAt: number }>
        signals: Array<{ type: string; content: string; confidence: number }>
        contract: {
          refusal: string
          becoming: string
          proof: string
          test: string
          vote: string
          rule: string
        } | null
      }>
    } = {
      exportedAt: new Date().toISOString(),
      userId,
      sessions: [],
    }

    for (const session of sessions) {
      // Get messages
      const messages = await ctx.db
        .query('messages')
        .withIndex('by_session', (q) => q.eq('sessionId', session._id))
        .collect()

      // Get signals
      const signals = await ctx.db
        .query('signals')
        .withIndex('by_session', (q) => q.eq('sessionId', session._id))
        .collect()

      // Get contract
      const contracts = await ctx.db
        .query('contracts')
        .withIndex('by_session', (q) => q.eq('sessionId', session._id))
        .collect()
      const contract = contracts[0]

      exportData.sessions.push({
        id: session._id,
        createdAt: session.createdAt,
        phase: session.currentPhase,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
          createdAt: m.createdAt,
        })),
        signals: signals.map((s) => ({
          type: s.type,
          content: s.content,
          confidence: s.confidence,
        })),
        contract: contract
          ? {
              refusal: contract.refusal,
              becoming: contract.becoming,
              proof: contract.proof,
              test: contract.test,
              vote: contract.vote,
              rule: contract.rule,
            }
          : null,
      })
    }

    return exportData
  },
})

/**
 * Delete all user data (GDPR right to erasure)
 *
 * Security: userId derived from JWT, not client parameter
 */
export const deleteAllUserData = mutation({
  args: {
    confirmDelete: v.literal(true), // Require explicit confirmation
  },
  handler: async (ctx) => {
    const userId = await getAuthenticatedUserId(ctx)
    const deletedCounts = {
      sessions: 0,
      messages: 0,
      signals: 0,
      contracts: 0,
      extractionJobs: 0,
      scenarios: 0,
      contradictions: 0,
      evidenceLinks: 0,
      profiles: 0,
    }

    // Get all sessions
    const sessions = await ctx.db
      .query('sessions')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect()

    for (const session of sessions) {
      // Delete messages
      const messages = await ctx.db
        .query('messages')
        .withIndex('by_session', (q) => q.eq('sessionId', session._id))
        .collect()
      for (const msg of messages) {
        await ctx.db.delete(msg._id)
        deletedCounts.messages++
      }

      // Delete signals
      const signals = await ctx.db
        .query('signals')
        .withIndex('by_session', (q) => q.eq('sessionId', session._id))
        .collect()
      for (const sig of signals) {
        await ctx.db.delete(sig._id)
        deletedCounts.signals++
      }

      // Delete contracts
      const contracts = await ctx.db
        .query('contracts')
        .withIndex('by_session', (q) => q.eq('sessionId', session._id))
        .collect()
      for (const contract of contracts) {
        await ctx.db.delete(contract._id)
        deletedCounts.contracts++
      }

      // Delete extraction jobs
      const jobs = await ctx.db
        .query('extractionJobs')
        .withIndex('by_session', (q) => q.eq('sessionId', session._id))
        .collect()
      for (const job of jobs) {
        await ctx.db.delete(job._id)
        deletedCounts.extractionJobs++
      }

      // Delete scenarios
      const scenarios = await ctx.db
        .query('scenarios')
        .withIndex('by_session', (q) => q.eq('sessionId', session._id))
        .collect()
      for (const scenario of scenarios) {
        await ctx.db.delete(scenario._id)
        deletedCounts.scenarios++
      }

      // Delete contradictions
      const contradictions = await ctx.db
        .query('contradictions')
        .withIndex('by_session', (q) => q.eq('sessionId', session._id))
        .collect()
      for (const contradiction of contradictions) {
        await ctx.db.delete(contradiction._id)
        deletedCounts.contradictions++
      }

      // Delete evidence links
      const links = await ctx.db
        .query('evidenceLinks')
        .withIndex('by_session', (q) => q.eq('sessionId', session._id))
        .collect()
      for (const link of links) {
        await ctx.db.delete(link._id)
        deletedCounts.evidenceLinks++
      }

      // Delete profiles
      const profiles = await ctx.db
        .query('profiles')
        .withIndex('by_session', (q) => q.eq('sessionId', session._id))
        .collect()
      for (const profile of profiles) {
        await ctx.db.delete(profile._id)
        deletedCounts.profiles++
      }

      // Finally delete the session
      await ctx.db.delete(session._id)
      deletedCounts.sessions++
    }

    return {
      success: true,
      deletedAt: new Date().toISOString(),
      counts: deletedCounts,
    }
  },
})

/**
 * Delete a single session and all its data
 *
 * Security: userId derived from JWT, not client parameter
 */
export const deleteSession = mutation({
  args: {
    sessionId: v.id('sessions'),
  },
  handler: async (ctx, { sessionId }) => {
    const userId = await getAuthenticatedUserId(ctx)

    // Verify ownership
    const session = await ctx.db.get(sessionId)
    if (!session || session.userId !== userId) {
      throw new Error('Session not found or access denied')
    }

    // Delete all related data (same pattern as above but for single session)
    const tables = [
      'messages',
      'signals',
      'contracts',
      'extractionJobs',
      'scenarios',
      'contradictions',
      'evidenceLinks',
      'profiles',
    ] as const

    for (const table of tables) {
      const records = await ctx.db
        .query(table)
        .withIndex('by_session', (q) => q.eq('sessionId', sessionId))
        .collect()
      for (const record of records) {
        await ctx.db.delete(record._id)
      }
    }

    await ctx.db.delete(sessionId)

    return { success: true }
  },
})

/**
 * Get data retention info for user
 *
 * Security: userId derived from JWT, not client parameter
 */
export const getRetentionInfo = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthenticatedUserId(ctx)
    const sessions = await ctx.db
      .query('sessions')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect()

    return {
      retentionPolicy: {
        sessions: `${RETENTION_CONFIG.SESSION_RETENTION_DAYS} days`,
        signals: `${RETENTION_CONFIG.SIGNAL_RETENTION_DAYS} days`,
        contracts: `${RETENTION_CONFIG.CONTRACT_RETENTION_DAYS} days`,
      },
      userData: {
        totalSessions: sessions.length,
        oldestSession: sessions.length > 0
          ? new Date(Math.min(...sessions.map(s => s.createdAt))).toISOString()
          : null,
        newestSession: sessions.length > 0
          ? new Date(Math.max(...sessions.map(s => s.createdAt))).toISOString()
          : null,
      },
    }
  },
})
