/**
 * useDiscovery Hook
 *
 * React hook for managing the discovery interview flow.
 * Integrates with Convex actions and provides UI state.
 */
'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { useQuery, useMutation, useAction } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import type { AskFollowUpArgs, Phase } from './ai/tools'
import type { UITree } from './json-render'
import {
  withRetry,
  withTimeout,
  getFallbackMessage,
  saveRecoveryState,
  loadRecoveryState,
  clearRecoveryState,
  initNetworkListeners,
  getNetworkStatus,
} from './resilience'
import { useSignalStore } from './stores/signals'
import type { Signal } from './ai/tools/types'

// AI call timeout in milliseconds (30 seconds)
const AI_TIMEOUT_MS = 30000

export interface UseDiscoveryOptions {
  // userId is now derived from JWT on server - no longer passed from client
  sessionId?: Id<'sessions'>
  // Initial message from MagicInput - used to start discovery with user's actual intent
  initialMessage?: string
}

export interface PendingQuestion {
  question: string
  options: AskFollowUpArgs['options']
  toolCallId: string
}

export interface DiscoveryState {
  sessionId: Id<'sessions'> | null
  currentPhase: Phase
  isLoading: boolean
  error: string | null
  pendingQuestion: PendingQuestion | null
  contract: {
    id: Id<'contracts'>
    refusal: string
    becoming: string
    proof: string
    test: string
    vote: string
    rule: string
  } | null
  uiTree: UITree | null
}

export function useDiscovery({ sessionId: initialSessionId, initialMessage }: UseDiscoveryOptions) {
  const [sessionId, setSessionId] = useState<Id<'sessions'> | null>(initialSessionId ?? null)
  const [hasStarted, setHasStarted] = useState(false) // Track if we've initiated the first step
  const [pendingQuestion, setPendingQuestion] = useState<PendingQuestion | null>(null)
  const [uiTree, setUiTree] = useState<UITree | null>(null)
  const [contract, setContract] = useState<DiscoveryState['contract']>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOffline, setIsOffline] = useState(false)

  // S8-T04: Initialize network listeners and check for recovery state
  useEffect(() => {
    // Set up network status listeners
    const cleanup = initNetworkListeners(
      () => setIsOffline(false), // onOnline
      () => setIsOffline(true)   // onOffline
    )

    // Check initial network status
    const status = getNetworkStatus()
    setIsOffline(!status.isOnline)

    // Check for recovery state from previous session
    if (!initialSessionId) {
      const recovery = loadRecoveryState()
      if (recovery && recovery.sessionId) {
        // Could auto-restore session here if needed
        console.info('[Recovery] Found previous session:', recovery.sessionId)
      }
    }

    return cleanup
  }, [initialSessionId])

  // Queries (use public variants for React hooks)
  const session = useQuery(
    api.sessions.getPublic,
    sessionId ? { sessionId } : 'skip'
  )
  const messages = useQuery(
    api.messages.listBySessionPublic,
    sessionId ? { sessionId } : 'skip'
  )
  const signals = useQuery(
    api.signals.listBySessionPublic,
    sessionId ? { sessionId } : 'skip'
  )

  // S8-T04: Save recovery state when session changes
  useEffect(() => {
    if (sessionId) {
      const phase = session?.currentPhase ?? 'SCENARIO'
      saveRecoveryState({
        sessionId,
        lastPhase: phase,
        ...(pendingQuestion?.toolCallId !== undefined && { pendingToolCall: pendingQuestion.toolCallId }),
      })
    }
  }, [sessionId, session?.currentPhase, pendingQuestion?.toolCallId])

  // S0-T04: Sync signals from Convex query to signal store for UI consumption
  const addSignal = useSignalStore(state => state.addSignal)
  const resetSignalStore = useSignalStore(state => state.reset)
  const signalStoreCount = useSignalStore(state => state.signals.length)

  useEffect(() => {
    if (!signals) return

    // On new session or first load, sync all signals
    // Only add signals that aren't already in the store
    if (signals.length > signalStoreCount) {
      const newSignals = signals.slice(signalStoreCount)
      for (const dbSignal of newSignals) {
        // Map Convex signal to Signal type
        // Build imperatively to avoid exactOptionalPropertyTypes issues
        const signal: Signal = {
          domain: dbSignal.domain as Signal['domain'],
          type: dbSignal.type,
          content: dbSignal.content,
          source: dbSignal.source,
          confidence: dbSignal.confidence,
        }
        if (dbSignal.state) (signal as any).state = dbSignal.state
        if (dbSignal.emotionalContext) (signal as any).emotionalContext = dbSignal.emotionalContext
        if (dbSignal.lifeDomain) (signal as any).lifeDomain = dbSignal.lifeDomain
        addSignal(signal)
      }
    }
  }, [signals, signalStoreCount, addSignal])

  // Reset signal store when session changes
  useEffect(() => {
    if (!sessionId) {
      resetSignalStore()
    }
  }, [sessionId, resetSignalStore])

  // Mutations
  const createSession = useMutation(api.sessions.create)

  // Actions
  const runStep = useAction(api.discovery.runStep)

  /**
   * Start a new discovery session
   * S8-T04: Enhanced with retry logic and user-friendly error messages
   */
  const startSession = useCallback(async () => {
    // S8-T04: Check network status before starting
    if (isOffline) {
      setError('You appear to be offline. Please check your connection.')
      return null
    }

    setIsLoading(true)
    setError(null)
    try {
      const newSessionId = await createSession({})
      setSessionId(newSessionId)

      // Run initial step to get first question (with retry)
      // Use the user's actual intent if provided, otherwise a gentle greeting
      const firstMessage = initialMessage?.trim() || 'Hello, I want to start the discovery process.'
      setHasStarted(true) // Mark that we've started - prevents duplicate sends

      // Wrap with timeout to prevent infinite loading if AI hangs
      const result = await withTimeout(
        withRetry(
          () => runStep({
            sessionId: newSessionId,
            userMessage: firstMessage,
          }),
          { maxAttempts: 3, baseDelayMs: 1000 }
        ),
        AI_TIMEOUT_MS,
        'The AI is taking too long to respond. Please try again.'
      )

      if (result.type === 'QUESTION') {
        const question = result.question as { question: string; options: AskFollowUpArgs['options'] }
        setPendingQuestion({
          question: question.question,
          options: question.options,
          toolCallId: result.toolCallId,
        })
      }

      // Set uiTree if present in result
      if (result.uiTree && Array.isArray(result.uiTree)) {
        setUiTree(result.uiTree as UITree)
      } else {
        setUiTree(null)
      }

      return newSessionId
    } catch (e) {
      // S8-T04: Use user-friendly error message
      const friendlyMessage = e instanceof Error
        ? getFallbackMessage(e)
        : 'Failed to start session'
      setError(friendlyMessage)
      throw e
    } finally {
      setIsLoading(false)
    }
  }, [createSession, runStep, isOffline])

  /**
   * Submit a selected option
   * S8-T04: Enhanced with retry logic and user-friendly error messages
   */
  const submitOption = useCallback(async (optionId: string, toolCallId: string) => {
    if (!sessionId) throw new Error('No active session')

    // S8-T04: Check network status
    if (isOffline) {
      setError('You appear to be offline. Your selection will be saved when you reconnect.')
      return null
    }

    setIsLoading(true)
    setError(null)
    setPendingQuestion(null)

    try {
      // S8-T04: Wrap with retry and timeout for transient failures
      const result = await withTimeout(
        withRetry(
          () => runStep({
            sessionId,
            toolResult: {
              toolCallId,
              toolName: 'askFollowUp',
              result: { selectedOptionId: optionId },
            },
          }),
          { maxAttempts: 3, baseDelayMs: 1000 }
        ),
        AI_TIMEOUT_MS,
        'The AI is taking too long to respond. Please try again.'
      )

      if (result.type === 'QUESTION') {
        const question = result.question as { question: string; options: AskFollowUpArgs['options'] }
        setPendingQuestion({
          question: question.question,
          options: question.options,
          toolCallId: result.toolCallId,
        })
      } else if (result.type === 'CONTRACT' && result.contract) {
        // Map Convex contract (_id) to our contract type (id)
        setContract({
          id: result.contract._id,
          refusal: result.contract.refusal,
          becoming: result.contract.becoming,
          proof: result.contract.proof,
          test: result.contract.test,
          vote: result.contract.vote,
          rule: result.contract.rule,
        })
        // S8-T04: Clear recovery state when contract is generated (session complete)
        clearRecoveryState()
      }

      // Set uiTree if present in result
      if (result.uiTree && Array.isArray(result.uiTree)) {
        setUiTree(result.uiTree as UITree)
      } else {
        setUiTree(null)
      }

      return result
    } catch (e) {
      // S8-T04: Use user-friendly error message
      const friendlyMessage = e instanceof Error
        ? getFallbackMessage(e)
        : 'Failed to submit option'
      setError(friendlyMessage)
      throw e
    } finally {
      setIsLoading(false)
    }
  }, [sessionId, runStep, isOffline])

  /**
   * Send a free-text message
   * S8-T04: Enhanced with retry logic and user-friendly error messages
   */
  const sendMessage = useCallback(async (message: string) => {
    if (!sessionId) throw new Error('No active session')

    // S8-T04: Check network status
    if (isOffline) {
      setError('You appear to be offline. Your message will be sent when you reconnect.')
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      // S8-T04: Wrap with retry and timeout for transient failures
      const result = await withTimeout(
        withRetry(
          () => runStep({
            sessionId,
            userMessage: message,
          }),
          { maxAttempts: 3, baseDelayMs: 1000 }
        ),
        AI_TIMEOUT_MS,
        'The AI is taking too long to respond. Please try again.'
      )

      if (result.type === 'QUESTION') {
        const question = result.question as { question: string; options: AskFollowUpArgs['options'] }
        setPendingQuestion({
          question: question.question,
          options: question.options,
          toolCallId: result.toolCallId,
        })
      } else if (result.type === 'CONTRACT' && result.contract) {
        // Map Convex contract (_id) to our contract type (id)
        setContract({
          id: result.contract._id,
          refusal: result.contract.refusal,
          becoming: result.contract.becoming,
          proof: result.contract.proof,
          test: result.contract.test,
          vote: result.contract.vote,
          rule: result.contract.rule,
        })
        // S8-T04: Clear recovery state when contract is generated (session complete)
        clearRecoveryState()
      }

      // Set uiTree if present in result
      if (result.uiTree && Array.isArray(result.uiTree)) {
        setUiTree(result.uiTree as UITree)
      } else {
        setUiTree(null)
      }

      return result
    } catch (e) {
      // S8-T04: Use user-friendly error message
      const friendlyMessage = e instanceof Error
        ? getFallbackMessage(e)
        : 'Failed to send message'
      setError(friendlyMessage)
      throw e
    } finally {
      setIsLoading(false)
    }
  }, [sessionId, runStep, isOffline])

  // Computed state
  const state: DiscoveryState = useMemo(() => ({
    sessionId,
    currentPhase: (session?.currentPhase as Phase) ?? 'SCENARIO',
    isLoading,
    error,
    pendingQuestion,
    contract,
    uiTree,
  }), [sessionId, session, isLoading, error, pendingQuestion, contract, uiTree])

  // Formatted messages for UI
  const formattedMessages = useMemo(() => {
    if (!messages) return []
    return messages.map((m: { _id: Id<'messages'>; role: string; content: string }) => ({
      id: m._id,
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))
  }, [messages])

  return {
    // State
    ...state,
    messages: formattedMessages,
    signals: signals ?? [],
    isOffline, // S8-T04: Expose network status for UI
    hasStarted, // Track if first step has been sent

    // Actions
    startSession,
    submitOption,
    sendMessage,
  }
}
