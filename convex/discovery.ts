/**
 * Discovery Action - The Shadow Loop
 *
 * This is the core AI action that powers the discovery interview.
 * It uses Claude with our custom tools to guide the user through
 * the 4-phase discovery process.
 *
 * Updated for S3: Uses phase-machine and prompt-builder for
 * hierarchical context management.
 *
 * Updated for S4-T02: Background extraction with race condition handling.
 * Synthesis phase checks canSynthesize() before proceeding.
 */
import { action } from './_generated/server'
import { v } from 'convex/values'
import { api, internal } from './_generated/api'
import type { Doc } from './_generated/dataModel'
import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

import {
  askFollowUp,
  createExtractSignalTool,
  createTransitionPhaseTool,
  createOutputContractTool,
  createSynthesizeProfileTool,
  renderUI,
  TOOL_NAMES,
  type ExtractSignalArgs,
  type TransitionPhaseArgs,
  type OutputContractArgs,
  type SynthesizeProfileArgs,
} from '../src/lib/ai/tools'

import {
  buildDiscoveryContext,
  shouldForceTransition,
  canTransition,
  checkExtractionDensity,
  canProceedToSynthesis,
  getDensityPromptInjection,
  getExtractionReminder,
  type Phase,
  type Signal,
} from '../src/lib/discovery'

import { sanitizeUserInput } from './security'
import { getAuthenticatedUserId } from './lib/auth'

/**
 * Result type for runStep action
 */
type RunStepResult =
  | {
      type: 'QUESTION'
      question: unknown
      toolCallId: string
      text: string | undefined
      signalCount: number
      highConfidenceCount: number
      uiTree: unknown
    }
  | {
      type: 'CONTRACT'
      contract: Doc<'contracts'> | null
      text: string | undefined
      uiTree: unknown
    }
  | {
      type: 'MESSAGE'
      text: string | undefined
      signalCount: number
      uiTree: unknown
    }

/**
 * Run one step of the discovery loop
 *
 * Security: userId derived from JWT, not client parameter
 */
export const runStep = action({
  args: {
    sessionId: v.id('sessions'),
    userMessage: v.optional(v.string()),
    toolResult: v.optional(
      v.object({
        toolCallId: v.string(),
        toolName: v.string(),
        result: v.any(),
      })
    ),
    userRequestedAdvance: v.optional(v.boolean()),
  },
  handler: async (ctx, args): Promise<RunStepResult> => {
    const startTime = Date.now()

    // Security: Get userId from authenticated JWT token
    const userId = await getAuthenticatedUserId(ctx)

    // S8-T01: Sanitize user input
    const sanitizedMessage = args.userMessage
      ? sanitizeUserInput(args.userMessage)
      : undefined

    // Get current session state
    const session = await ctx.runQuery(internal.sessions.get, {
      sessionId: args.sessionId,
    })
    if (!session) throw new Error('Session not found')

    // Get recent messages
    const messages = await ctx.runQuery(internal.messages.listBySession, {
      sessionId: args.sessionId,
    })

    // Get extracted signals for context
    const signals = await ctx.runQuery(internal.signals.listBySession, {
      sessionId: args.sessionId,
    })

    // Convert signals to the format expected by prompt-builder (DECISION-001)
    // Use conditional spread to handle exactOptionalPropertyTypes
    const formattedSignals: Signal[] = signals.map((s: Doc<'signals'>) => ({
      domain: s.domain as Signal['domain'],
      type: s.type,
      content: s.content,
      source: s.source,
      confidence: s.confidence,
      ...(s.state !== undefined && { state: s.state }),
      ...(s.scenarioId !== undefined && { scenarioId: s.scenarioId }),
      ...(s.lifeDomain !== undefined && { lifeDomain: s.lifeDomain }),
    }))

    // Check for hard triggers (S3-T06)
    const forceCheck = shouldForceTransition({
      currentPhase: session.currentPhase as Phase,
      signalCount: signals.length,
      highConfidenceSignals: signals.filter((s: Doc<'signals'>) => s.confidence > 0.7).length,
      scenariosExplored: session.scenariosExplored || 0,
      userRequestedAdvance: args.userRequestedAdvance ?? false,
    })

    // Force phase transition if triggered
    if (forceCheck.force && forceCheck.targetPhase) {
      await ctx.runMutation(internal.sessions.updatePhase, {
        sessionId: args.sessionId,
        phase: forceCheck.targetPhase,
      })
      // Update local reference
      session.currentPhase = forceCheck.targetPhase
    }

    // S4-T05: Check extraction density
    const totalTurns = session.totalTurns || 0
    const recentTurns = Math.min(5, totalTurns)
    // Count signals in recent turns (approximation based on creation time)
    const recentSignals = signals.filter((s: Doc<'signals'>) => {
      const signalAge = Date.now() - s.createdAt
      // Assuming ~30 seconds per turn on average
      return signalAge < recentTurns * 30000
    }).length

    const densityCheck = checkExtractionDensity(
      signals.length,
      totalTurns,
      recentSignals,
      recentTurns
    )

    // Build context with hierarchical prompt management (S3-T02)
    const discoveryContext = buildDiscoveryContext(
      session.currentPhase as Phase,
      messages.map((m: Doc<'messages'>) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      formattedSignals,
      {
        scenariosExplored: session.scenariosExplored || 0,
        turnsInPhase: session.turnsInPhase || 0,
      }
    )

    // S4-T05: Enhance system prompt with density monitoring
    let enhancedSystemPrompt = discoveryContext.systemPrompt
    enhancedSystemPrompt += getExtractionReminder() // Always include extraction reminder
    if (densityCheck.alert) {
      enhancedSystemPrompt += getDensityPromptInjection(densityCheck)
    }

    // Use sliding window for messages (last 10 only)
    const aiMessages = [...discoveryContext.messages]

    // Add user message if present (S8-T01: use sanitized input)
    if (sanitizedMessage) {
      aiMessages.push({ role: 'user', content: sanitizedMessage })
      await ctx.runMutation(internal.messages.add, {
        sessionId: args.sessionId,
        role: 'user',
        content: sanitizedMessage,
      })

      // S4-T02: Queue background extraction (runs in parallel with main flow)
      const jobId = await ctx.runMutation(internal.extraction.queueExtraction, {
        sessionId: args.sessionId,
        messageContent: sanitizedMessage,
      })

      // Schedule background extraction (non-blocking)
      ctx.scheduler.runAfter(0, internal.extraction.runBackgroundExtraction, {
        jobId,
        sessionId: args.sessionId,
        messageContent: sanitizedMessage,
      })
    }

    // Add tool result if present (continuing after askFollowUp)
    if (args.toolResult) {
      // Tool results need special handling in message format
      aiMessages.push({
        role: 'user',
        content: `[Selected: ${JSON.stringify(args.toolResult.result)}]`,
      })
    }

    // Increment turn counter
    await ctx.runMutation(internal.sessions.incrementTurn, {
      sessionId: args.sessionId,
    })

    // Create tools with Convex context (DECISION-001: Validated schema)
    // Use conditional spread for optional fields to satisfy exactOptionalPropertyTypes
    const extractSignal = createExtractSignalTool(async (signal: ExtractSignalArgs) => {
      await ctx.runMutation(internal.signals.save, {
        sessionId: args.sessionId,
        // DECISION-001 required fields
        domain: signal.domain,       // Psychological domain (VALUE, NEED, etc.)
        type: signal.type,           // Specific construct (AUTONOMY, ACHIEVEMENT, etc.)
        content: signal.content,
        source: signal.source,
        confidence: signal.confidence,
        // Optional fields - conditionally spread
        ...(signal.state !== undefined && { state: signal.state }),
        ...(signal.emotionalContext !== undefined && { emotionalContext: signal.emotionalContext }),
        ...(signal.scenarioId !== undefined && { scenarioId: signal.scenarioId }),
        ...(signal.lifeDomain !== undefined && { lifeDomain: signal.lifeDomain }),
        ...(signal.relatedSignals !== undefined && { relatedSignals: signal.relatedSignals }),
      })
    })

    const transitionPhase = createTransitionPhaseTool(async (transition: TransitionPhaseArgs) => {
      // S4-T02: Check for pending extractions before SYNTHESIS transition
      // This prevents building profiles from incomplete data
      if (transition.targetPhase === 'SYNTHESIS') {
        const synthesisReady = await ctx.runQuery(internal.extraction.canSynthesize, {
          sessionId: args.sessionId,
        })

        if (!synthesisReady.ready) {
          console.warn(`Synthesis blocked: ${synthesisReady.message}`)
          return {
            success: false as const,
            reason: synthesisReady.message,
            pendingExtractions: synthesisReady.pendingCount,
          }
        }

        // S4-T05: Check signal density before synthesis
        const highConfidenceSignals = signals.filter((s: Doc<'signals'>) => s.confidence > 0.7).length
        const densityOk = canProceedToSynthesis(signals.length, highConfidenceSignals)

        if (!densityOk.allowed) {
          console.warn(`Synthesis blocked (density): ${densityOk.reason}`)
          return {
            success: false as const,
            reason: densityOk.reason ?? 'Insufficient signal density',
            ...(densityOk.recommendation !== undefined && { recommendation: densityOk.recommendation }),
          }
        }
      }

      // Validate transition (S3-T01)
      const canTransitionResult = canTransition(
        session.currentPhase as Phase,
        transition.targetPhase as Phase,
        {
          currentPhase: session.currentPhase as Phase,
          signalCount: signals.length,
          highConfidenceSignals: signals.filter((s: Doc<'signals'>) => s.confidence > 0.7).length,
          scenariosExplored: session.scenariosExplored || 0,
        }
      )

      if (!canTransitionResult.allowed) {
        console.warn(`Phase transition blocked: ${canTransitionResult.reason}`)
        return { success: false as const, reason: canTransitionResult.reason ?? 'Transition not allowed' }
      }

      await ctx.runMutation(internal.sessions.updatePhase, {
        sessionId: args.sessionId,
        phase: transition.targetPhase,
      })
      return { success: true as const }
    })

    // S5-T01: Enhanced contract with evidence grounding
    const outputContract = createOutputContractTool(async (contract: OutputContractArgs) => {
      // Map evidence to filter out undefined optional fields
      const mappedEvidence = contract.evidence?.map(e => ({
        quote: e.quote,
        ...(e.scenarioName !== undefined && { scenarioName: e.scenarioName }),
        ...(e.signalType !== undefined && { signalType: e.signalType }),
      }))

      const contractId = await ctx.runMutation(internal.contracts.create, {
        sessionId: args.sessionId,
        userId,
        refusal: contract.refusal,
        becoming: contract.becoming,
        proof: contract.proof,
        test: contract.test,
        vote: contract.vote,
        rule: contract.rule,
        ...(mappedEvidence !== undefined && { evidence: mappedEvidence }),
        ...(contract.mirrorMoment !== undefined && { mirrorMoment: contract.mirrorMoment }),
        ...(contract.primaryContradiction !== undefined && { primaryContradiction: contract.primaryContradiction }),
      })
      return contractId
    })

    // S4-T04: Create synthesizeProfile tool for SYNTHESIS phase (DECISION-001)
    const synthesizeProfile = createSynthesizeProfileTool(
      async (profile: SynthesizeProfileArgs) => {
        // Map values to handle optional secondary field
        const mappedValues = {
          primary: profile.values.primary,
          ...(profile.values.secondary !== undefined && { secondary: profile.values.secondary }),
        }

        // Map needs to handle optional evidence fields
        const mappedNeeds = {
          autonomy: {
            state: profile.needs.autonomy.state,
            intensity: profile.needs.autonomy.intensity,
            ...(profile.needs.autonomy.evidence !== undefined && { evidence: profile.needs.autonomy.evidence }),
          },
          competence: {
            state: profile.needs.competence.state,
            intensity: profile.needs.competence.intensity,
            ...(profile.needs.competence.evidence !== undefined && { evidence: profile.needs.competence.evidence }),
          },
          relatedness: {
            state: profile.needs.relatedness.state,
            intensity: profile.needs.relatedness.intensity,
            ...(profile.needs.relatedness.evidence !== undefined && { evidence: profile.needs.relatedness.evidence }),
          },
        }

        // Map contradictions to handle optional rootCause
        const mappedContradictions = profile.contradictions.map(c => ({
          stated: c.stated,
          actual: c.actual,
          impact: c.impact,
          ...(c.rootCause !== undefined && { rootCause: c.rootCause }),
        }))

        const profileId = await ctx.runMutation(internal.profiles.save, {
          sessionId: args.sessionId,
          // DECISION-001: Validated psychological constructs
          values: mappedValues,
          needs: mappedNeeds,
          dominantMotive: profile.dominantMotive,
          defenses: profile.defenses,
          attachmentMarkers: profile.attachmentMarkers,
          development: profile.development,
          // Patterns and contradictions
          corePatterns: profile.patterns, // Map 'patterns' to 'corePatterns' for schema
          antiPatterns: [],               // Not in new schema, default to empty
          contradictions: mappedContradictions,
          // Output
          mirrorStatement: profile.mirrorStatement,
          contractFocus: profile.contractFocus,
        })
        return profileId
      }
    )

    // Run AI with tools (S4-T05: using enhanced prompt with density monitoring)
    const result = await generateText({
      model: anthropic('claude-sonnet-4-20250514'),
      system: enhancedSystemPrompt,
      messages: aiMessages,
      tools: {
        askFollowUp,
        extractSignal,
        transitionPhase,
        outputContract,
        synthesizeProfile,
        renderUI,
      },
      // Note: AI SDK 6.0 uses stopWhen instead of maxSteps for multi-step control
    })

    // S8-T03: Log AI call for observability
    const latencyMs = Date.now() - startTime
    console.info('[AI Call]', {
      sessionId: args.sessionId,
      phase: session.currentPhase,
      latencyMs,
      toolCalls: result.toolCalls?.map((tc) => tc.toolName) || [],
      success: true,
    })

    // Save assistant message
    await ctx.runMutation(internal.messages.add, {
      sessionId: args.sessionId,
      role: 'assistant',
      content: result.text || '',
      toolCalls: result.toolCalls,
    })

    // Extract UI tree from renderUI calls (if any)
    const renderUICall = result.toolCalls?.find(
      (tc) => tc.toolName === TOOL_NAMES.RENDER_UI
    )
    const uiTree = (renderUICall as { args?: { components?: unknown } } | undefined)?.args?.components || null

    // Check for askFollowUp (NO_EXECUTE tool - return to UI)
    const askFollowUpCall = result.toolCalls?.find(
      (tc) => tc.toolName === TOOL_NAMES.ASK_FOLLOW_UP
    )

    if (askFollowUpCall) {
      return {
        type: 'QUESTION' as const,
        question: (askFollowUpCall as unknown as { args: unknown }).args,
        toolCallId: askFollowUpCall.toolCallId,
        text: result.text,
        signalCount: discoveryContext.signalCount,
        highConfidenceCount: discoveryContext.highConfidenceCount,
        uiTree,
      }
    }

    // Check for outputContract (session complete)
    const contractCall = result.toolCalls?.find(
      (tc) => tc.toolName === TOOL_NAMES.OUTPUT_CONTRACT
    )

    if (contractCall) {
      const contract: Doc<'contracts'> | null = await ctx.runQuery(internal.contracts.getBySession, {
        sessionId: args.sessionId,
      })
      return {
        type: 'CONTRACT' as const,
        contract,
        text: result.text,
        uiTree,
      }
    }

    // Default: just return message
    return {
      type: 'MESSAGE' as const,
      text: result.text,
      signalCount: discoveryContext.signalCount,
      uiTree,
    }
  },
})

/**
 * Request user-initiated phase advance ("I'm ready for my contract")
 * S3-T06: Escape hatch
 *
 * Security: userId derived from JWT, not client parameter
 */
export const requestAdvance = action({
  args: {
    sessionId: v.id('sessions'),
  },
  handler: async (ctx, args): Promise<RunStepResult> => {
    // Call runStep with userRequestedAdvance flag via ctx.runAction
    // Note: runStep will derive userId from auth internally
    return await ctx.runAction(api.discovery.runStep, {
      sessionId: args.sessionId,
      userRequestedAdvance: true,
    })
  },
})
