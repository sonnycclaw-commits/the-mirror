/**
 * Discovery Route - S6-T01
 *
 * Main discovery flow entry point. Same functionality as /chat
 * but with a more user-friendly URL.
 *
 * Security: userId is derived from JWT on the server via Convex auth.
 * Client no longer passes userId - it's extracted from the authenticated session.
 */
import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import { DiscoveryInterface } from '@/components/discovery/DiscoveryInterface'
import { ContractView } from '@/components/contract'
import { useDiscovery } from '@/lib/use-discovery'
import { useEffect } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'

// Server function to check authentication
const authStateFn = createServerFn().handler(async () => {
  // DEV BYPASS: Skip auth check in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[DEV] Auth bypass enabled for /discovery')
    return { authenticated: true }
  }

  const { userId } = await auth()

  if (!userId) {
    throw redirect({
      to: '/',
      search: {
        redirect: '/discovery',
      },
    })
  }

  return { authenticated: true }
})

import { z } from 'zod'

const discoverySearchSchema = z.object({
  initialMessage: z.string().optional(),
})

export const Route = createFileRoute('/discovery')({
  beforeLoad: async () => await authStateFn(),
  component: DiscoveryPage,
  validateSearch: (search) => discoverySearchSchema.parse(search),
})

import { RevealOverlay } from '@/components/effects/RevealOverlay'
import { PhaseTransitionToast } from '@/components/discovery/PhaseTransitionToast'
import { PhaseInterstitial } from '@/components/discovery/PhaseInterstitial'
import { MirrorMoment } from '@/components/mirror/MirrorMoment'
import { generateMirrorSynthesis } from '@/lib/signals/mirror-synthesis'
import { useSignalStore } from '@/lib/stores/signals'
import { useState, useRef, useEffect as useEffectReact, useMemo } from 'react'
import type { Phase } from '@/components/discovery/PhaseProgress'

function DiscoveryPage() {
  const { initialMessage } = Route.useSearch()

  // Pass initialMessage to the hook - it will use it for the first step
  // instead of a hardcoded greeting. This eliminates the race condition
  // where two effects were both trying to send messages at mount.
  const {
    sessionId,
    currentPhase,
    isLoading,
    error,
    pendingQuestion,
    messages,
    signals,
    startSession,
    submitOption,
    contract, // S9: Contract display fix
  } = useDiscovery({
    ...(initialMessage !== undefined && { initialMessage }),
  })

  // S9: Insight Reveal Logic
  const [revealedSignal, setRevealedSignal] = useState<{ label: string; type: string } | null>(null)
  const lastSignalCount = useRef(0)

  // Detect new signals
  useEffect(() => {
    if (signals && signals.length > lastSignalCount.current) {
      const newSignal = signals[signals.length - 1] as any // Type bypass for dynamic data field
      // Only reveal meaningful signals (ignoring system/hidden ones if any)
      if (newSignal) {
        setRevealedSignal({
          label: newSignal.data?.label || 'New Insight',
          type: newSignal.type
        })
      }
      lastSignalCount.current = signals.length
    }
  }, [signals])

  // Phase transition state - interstitial for major transitions
  const [showPhaseToast, setShowPhaseToast] = useState(false)
  const [showPhaseInterstitial, setShowPhaseInterstitial] = useState(false)
  const [interstitialTransition, setInterstitialTransition] = useState<{ from: Phase; to: Phase } | null>(null)
  const lastPhase = useRef(currentPhase)

  // Mirror Moment state
  const [showMirrorMoment, setShowMirrorMoment] = useState(false)
  const [mirrorMomentComplete, setMirrorMomentComplete] = useState(false)
  const storeSignals = useSignalStore(state => state.signals)

  // Generate mirror synthesis when entering CONTRACT phase
  const mirrorSynthesis = useMemo(() => {
    if (currentPhase === 'CONTRACT' && storeSignals.length > 0) {
      return generateMirrorSynthesis(storeSignals)
    }
    return null
  }, [currentPhase, storeSignals])

  // Detect phase changes - show interstitial for SYNTHESIS/CONTRACT, toast otherwise
  useEffectReact(() => {
    if (currentPhase !== lastPhase.current) {
      const from = lastPhase.current
      const to = currentPhase

      // Major transitions get the full interstitial
      if (to === 'SYNTHESIS' || to === 'CONTRACT') {
        setInterstitialTransition({ from, to })
        setShowPhaseInterstitial(true)

        // Show Mirror Moment when entering CONTRACT phase
        if (to === 'CONTRACT') {
          // Delay to show after interstitial
          setTimeout(() => {
            setShowMirrorMoment(true)
          }, 4500) // After interstitial auto-dismisses
        }
      } else {
        // Minor transitions get just the toast
        setShowPhaseToast(true)
      }

      lastPhase.current = currentPhase
    }
  }, [currentPhase])

  // S9: Contract signing mutation
  const signContract = useMutation(api.contracts.sign)

  // Auto-start session if needed
  useEffect(() => {
    if (!sessionId && !isLoading) {
      startSession().catch(console.error)
    }
  }, [sessionId, isLoading, startSession])

  // Handle option selection
  const handleSelectOption = (optionId: string, toolCallId: string) => {
    submitOption(optionId, toolCallId).catch(console.error)
  }

  // IMPORTANT: Check error FIRST - otherwise user gets infinite spinner on failure
  if (error) {
    return (
      <div className="flex items-center justify-center h-dvh bg-transparent">
        <div className="text-center p-8 glass-card rounded-2xl">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => startSession()}
            className="px-6 py-3 bg-[var(--coral-500)] text-[var(--twilight-900)] rounded-xl font-semibold hover:scale-105 transition-transform"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Show loading state while starting (only if no error)
  if (!sessionId || messages.length === 0) {
    return (
      <div data-testid="session-recovery" className="flex items-center justify-center h-dvh bg-transparent">
        <div className="text-center">
          <div className="animate-spin size-8 border-4 border-[var(--coral-500)] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-[var(--twilight-400)]">Initializing reflection...</p>
        </div>
      </div>
    )
  }

  // Transform pending question for UI
  const uiPendingQuestion = pendingQuestion
    ? {
        question: pendingQuestion.question,
        options: pendingQuestion.options.map((opt) => ({
          id: opt.id,
          label: opt.label,
          ...(opt.description !== undefined && { description: opt.description }),
        })),
        toolCallId: pendingQuestion.toolCallId,
      }
    : undefined

  // S9: Show contract when generated (CRITICAL FIX)
  // Wait for Mirror Moment to complete before showing contract
  if (contract && mirrorMomentComplete) {
    return (
      <div className="min-h-dvh">
        <ContractView
          contract={{
            ...contract,
            status: 'DRAFT',
          }}
          onSign={async () => {
            try {
              await signContract({ contractId: contract.id })
            } catch (err) {
              console.error('Failed to sign contract:', err)
            }
          }}
        />
      </div>
    )
  }

  return (
    <>
      <DiscoveryInterface
        messages={messages}
        currentPhase={currentPhase}
        isStreaming={isLoading}
        isTyping={isLoading && !pendingQuestion}
        {...(uiPendingQuestion !== undefined && { pendingQuestion: uiPendingQuestion })}
        onSelectOption={handleSelectOption}
      />

      {/* Insight Reveal Overlay */}
      <RevealOverlay
        isOpen={!!revealedSignal}
        title="Insight Crystallized"
        onClose={() => setRevealedSignal(null)}
      >
        <div className="flex flex-col items-center gap-4">
          <p className="text-xl text-[var(--twilight-100)] font-medium">
            {revealedSignal?.label}
          </p>
          <p className="text-sm text-[var(--twilight-400)] uppercase tracking-widest">
            {revealedSignal?.type}
          </p>
        </div>
      </RevealOverlay>

      {/* Phase transition toast */}
      <PhaseTransitionToast
        phase={currentPhase}
        show={showPhaseToast}
        onComplete={() => setShowPhaseToast(false)}
      />

      {/* Phase interstitial for major transitions */}
      {interstitialTransition && (
        <PhaseInterstitial
          fromPhase={interstitialTransition.from}
          toPhase={interstitialTransition.to}
          isVisible={showPhaseInterstitial}
          onComplete={() => {
            setShowPhaseInterstitial(false)
            setInterstitialTransition(null)
          }}
        />
      )}

      {/* Mirror Moment - the climactic reveal */}
      {mirrorSynthesis && (
        <MirrorMoment
          mirrorStatement={mirrorSynthesis.statement}
          patternName={mirrorSynthesis.patternName}
          isVisible={showMirrorMoment}
          onComplete={() => {
            setShowMirrorMoment(false)
            setMirrorMomentComplete(true)
          }}
        />
      )}
    </>
  )
}
