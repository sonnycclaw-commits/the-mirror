/**
 * Background Extraction Action (S4-T02)
 *
 * Handles parallel signal extraction with race condition protection.
 * Key insight: Synthesis phase MUST wait for all pending extractions
 * to avoid building profiles from incomplete data.
 *
 * Pattern: Extraction queue with status tracking
 */
import { query, internalMutation, internalQuery, internalAction } from './_generated/server'
import { v } from 'convex/values'
import { internal } from './_generated/api'
import { getAuthenticatedUserId } from './lib/auth'

/**
 * Extraction status enum
 */
const extractionStatusValidator = v.union(
  v.literal('PENDING'),
  v.literal('PROCESSING'),
  v.literal('COMPLETED'),
  v.literal('FAILED')
)

/**
 * Queue an extraction job (called when user message received) - internal for actions
 */
export const queueExtraction = internalMutation({
  args: {
    sessionId: v.id('sessions'),
    messageContent: v.string(),
    messageId: v.optional(v.id('messages')),
  },
  returns: v.id('extractionJobs'),
  handler: async (ctx, args) => {
    // Use conditional spread to omit undefined optional fields for exactOptionalPropertyTypes
    return await ctx.db.insert('extractionJobs', {
      sessionId: args.sessionId,
      messageContent: args.messageContent,
      status: 'PENDING',
      signalsExtracted: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...(args.messageId !== undefined && { messageId: args.messageId }),
    })
  },
})

/**
 * Update extraction job status
 */
export const updateJobStatus = internalMutation({
  args: {
    jobId: v.id('extractionJobs'),
    status: extractionStatusValidator,
    signalsExtracted: v.optional(v.number()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Build patch data, omitting undefined optional fields for exactOptionalPropertyTypes
    const patchData: Record<string, unknown> = {
      status: args.status,
      updatedAt: Date.now(),
    }
    if (args.signalsExtracted !== undefined) patchData.signalsExtracted = args.signalsExtracted
    if (args.error !== undefined) patchData.error = args.error

    await ctx.db.patch(args.jobId, patchData)
  },
})

/**
 * Get pending extraction count for session
 * Used by synthesis to check if safe to proceed
 *
 * Security: Verifies authenticated user owns the session
 */
export const getPendingCount = query({
  args: {
    sessionId: v.id('sessions'),
  },
  returns: v.number(),
  handler: async (ctx, { sessionId }) => {
    const userId = await getAuthenticatedUserId(ctx)
    const session = await ctx.db.get(sessionId)
    if (!session || session.userId !== userId) {
      throw new Error('Session not found or access denied')
    }

    const pending = await ctx.db
      .query('extractionJobs')
      .withIndex('by_session_status', (q) =>
        q.eq('sessionId', sessionId).eq('status', 'PENDING')
      )
      .collect()

    const processing = await ctx.db
      .query('extractionJobs')
      .withIndex('by_session_status', (q) =>
        q.eq('sessionId', sessionId).eq('status', 'PROCESSING')
      )
      .collect()

    return pending.length + processing.length
  },
})

/**
 * Check if synthesis can proceed (no pending extractions) - internal for actions
 */
export const canSynthesize = internalQuery({
  args: {
    sessionId: v.id('sessions'),
  },
  returns: v.object({
    ready: v.boolean(),
    pendingCount: v.number(),
    message: v.string(),
  }),
  handler: async (ctx, { sessionId }) => {
    const pending = await ctx.db
      .query('extractionJobs')
      .withIndex('by_session_status', (q) =>
        q.eq('sessionId', sessionId).eq('status', 'PENDING')
      )
      .collect()

    const processing = await ctx.db
      .query('extractionJobs')
      .withIndex('by_session_status', (q) =>
        q.eq('sessionId', sessionId).eq('status', 'PROCESSING')
      )
      .collect()

    const totalPending = pending.length + processing.length

    if (totalPending === 0) {
      return {
        ready: true,
        pendingCount: 0,
        message: 'All extractions complete. Safe to synthesize.',
      }
    }

    return {
      ready: false,
      pendingCount: totalPending,
      message: `Waiting for ${totalPending} extraction(s) to complete before synthesis.`,
    }
  },
})

/**
 * Get extraction stats for session (for density monitoring S4-T05)
 *
 * Security: Verifies authenticated user owns the session
 */
export const getExtractionStats = query({
  args: {
    sessionId: v.id('sessions'),
  },
  returns: v.object({
    totalJobs: v.number(),
    completed: v.number(),
    failed: v.number(),
    pending: v.number(),
    totalSignals: v.number(),
    avgSignalsPerMessage: v.number(),
  }),
  handler: async (ctx, { sessionId }) => {
    const userId = await getAuthenticatedUserId(ctx)
    const session = await ctx.db.get(sessionId)
    if (!session || session.userId !== userId) {
      throw new Error('Session not found or access denied')
    }

    const allJobs = await ctx.db
      .query('extractionJobs')
      .withIndex('by_session', (q) => q.eq('sessionId', sessionId))
      .collect()

    const completed = allJobs.filter((j) => j.status === 'COMPLETED')
    const failed = allJobs.filter((j) => j.status === 'FAILED')
    const pending = allJobs.filter(
      (j) => j.status === 'PENDING' || j.status === 'PROCESSING'
    )

    const totalSignals = completed.reduce(
      (sum, j) => sum + (j.signalsExtracted || 0),
      0
    )

    return {
      totalJobs: allJobs.length,
      completed: completed.length,
      failed: failed.length,
      pending: pending.length,
      totalSignals,
      avgSignalsPerMessage:
        completed.length > 0 ? totalSignals / completed.length : 0,
    }
  },
})

/**
 * Run background extraction (called after each user message) - internal for scheduler
 *
 * This action runs extractSignal in parallel with the main conversation.
 * The synthesis phase queries canSynthesize() before proceeding.
 */
export const runBackgroundExtraction = internalAction({
  args: {
    jobId: v.id('extractionJobs'),
    sessionId: v.id('sessions'),
    messageContent: v.string(),
  },
  handler: async (ctx, args) => {
    // Mark as processing
    await ctx.runMutation(internal.extraction.updateJobStatus, {
      jobId: args.jobId,
      status: 'PROCESSING',
    })

    try {
      // Get existing signals for context
      const existingSignals = await ctx.runQuery(internal.signals.listBySession, {
        sessionId: args.sessionId,
      })

      // Get session for phase context
      const session = await ctx.runQuery(internal.sessions.get, {
        sessionId: args.sessionId,
      })

      if (!session) {
        throw new Error('Session not found')
      }

      // Import AI SDK dynamically (action context)
      const { generateObject } = await import('ai')
      const { anthropic } = await import('@ai-sdk/anthropic')
      const { z } = await import('zod')

      // Define extraction schema
      const extractionResultSchema = z.object({
        signals: z.array(
          z.object({
            type: z.enum([
              'VALUE',
              'FEAR',
              'CONSTRAINT',
              'PATTERN',
              'GOAL',
              'DEFENSE_MECHANISM',
              'CONTRADICTION',
              'NEED',
            ]),
            subtype: z
              .enum([
                'core_value',
                'stated_value',
                'hidden_value',
                'explicit_fear',
                'implicit_fear',
                'avoidance_pattern',
                'limiting_belief',
                'external_constraint',
                'self_imposed_rule',
                'habit_loop',
                'relational_pattern',
                'coping_mechanism',
                'rationalization',
                'projection',
                'avoidance',
                'intellectualization',
                'denial',
                'autonomy_frustration',
                'competence_frustration',
                'relatedness_frustration',
                'say_do_gap',
                'value_behavior_mismatch',
                'unspecified',
              ])
              .optional(),
            content: z.string(),
            source: z.string(),
            confidence: z.number().min(0).max(1),
            emotionalContext: z
              .enum([
                'neutral',
                'defensive',
                'vulnerable',
                'resistant',
                'open',
                'conflicted',
              ])
              .optional(),
            lifeDomain: z
              .enum([
                'WORK',
                'RELATIONSHIPS',
                'HEALTH',
                'PERSONAL_GROWTH',
                'GENERAL',
              ])
              .optional(),
          })
        ),
      })

      // Build extraction prompt
      const existingSignalsSummary = existingSignals
        .map((s) => `- ${s.type}: ${s.content} (${s.confidence})`)
        .join('\n')

      const result = await generateObject({
        model: anthropic('claude-sonnet-4-20250514'),
        schema: extractionResultSchema,
        prompt: `You are a psychological signal extractor for a discovery interview.

Current phase: ${session.currentPhase}
User message: "${args.messageContent}"

Existing signals extracted so far:
${existingSignalsSummary || 'None yet'}

Extract any psychological signals from this message. Look for:
1. VALUES: What they prioritize (stated and hidden)
2. FEARS: What they avoid, what makes them defensive
3. PATTERNS: Recurring behaviors
4. CONTRADICTIONS: Gaps between what they SAY and DO
5. DEFENSE_MECHANISMS: How they protect themselves
6. NEEDS: SDT deficits - autonomy ("I had to"), competence ("I can't"), relatedness ("No one understands")

Rules:
- Use EXACT quotes from the user as source
- Only mark confidence > 0.7 if pattern appears 2+ times
- Note if this contradicts existing signals
- Return empty array if no clear signals

Return an array of signals (can be empty).`,
      })

      // Save extracted signals
      // Map legacy type to psychological domain
      const typeToDomain: Record<string, 'VALUE' | 'NEED' | 'MOTIVE' | 'DEFENSE' | 'ATTACHMENT' | 'DEVELOPMENT' | 'PATTERN'> = {
        'VALUE': 'VALUE',
        'FEAR': 'PATTERN',  // Fear patterns map to PATTERN domain
        'CONSTRAINT': 'PATTERN',
        'PATTERN': 'PATTERN',
        'GOAL': 'MOTIVE',
        'DEFENSE_MECHANISM': 'DEFENSE',
        'CONTRADICTION': 'PATTERN',
        'NEED': 'NEED',
      }

      let signalsExtracted = 0
      for (const signal of result.object.signals) {
        const domain = typeToDomain[signal.type] ?? 'PATTERN'
        await ctx.runMutation(internal.signals.save, {
          sessionId: args.sessionId,
          domain,
          type: signal.subtype ?? signal.type, // Use subtype as specific construct
          content: signal.content,
          source: signal.source,
          confidence: signal.confidence,
          ...(signal.emotionalContext !== undefined && { emotionalContext: signal.emotionalContext }),
          ...(signal.lifeDomain !== undefined && { lifeDomain: signal.lifeDomain }),
        })
        signalsExtracted++
      }

      // Mark as completed
      await ctx.runMutation(internal.extraction.updateJobStatus, {
        jobId: args.jobId,
        status: 'COMPLETED',
        signalsExtracted,
      })

      return { success: true, signalsExtracted }
    } catch (error) {
      // Mark as failed
      await ctx.runMutation(internal.extraction.updateJobStatus, {
        jobId: args.jobId,
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error',
      })

      return { success: false, error: String(error) }
    }
  },
})
