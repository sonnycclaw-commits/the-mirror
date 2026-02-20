/**
 * Chat Route
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
import { useEffect, useState } from 'react'
import { FALLBACK_MESSAGES } from '@/lib/resilience'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'

// Server function to check authentication
const authStateFn = createServerFn().handler(async () => {
  // DEV BYPASS: Skip auth check in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[DEV] Auth bypass enabled for /chat')
    return { authenticated: true }
  }

  const { userId } = await auth()

  if (!userId) {
    throw redirect({
      to: '/',
      search: {
        redirect: '/chat',
      },
    })
  }

  return { authenticated: true }
})

export const Route = createFileRoute('/chat/')({
  beforeLoad: async () => await authStateFn(),
  component: ChatPage,
})

function ChatPage() {
  // userId is now derived from JWT on the server - no longer needed here
  const {
    sessionId,
    currentPhase,
    isLoading,
    error,
    pendingQuestion,
    messages,
    startSession,
    submitOption,
    isOffline,
    contract, // S9: Contract display fix
  } = useDiscovery({})

  // S9: Contract signing mutation
  const signContract = useMutation(api.contracts.sign)

  // S8-T04: Track retry attempts for error UI
  const [retryCount, setRetryCount] = useState(0)

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

  // S8-T04: Handle retry with count tracking
  const handleRetry = async () => {
    setRetryCount((c) => c + 1)
    try {
      await startSession()
    } catch {
      // Error already handled by hook
    }
  }

  // IMPORTANT: Check error states FIRST - otherwise user gets infinite spinner on failure

  // S8-T04: Show offline state
  if (isOffline && !sessionId) {
    return (
      <div className="flex items-center justify-center h-dvh bg-slate-900">
        <div className="text-center p-8 max-w-md">
          <div className="size-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
            <svg className="size-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m-3.536-3.536a4 4 0 010-5.656m-7.072 7.072a9 9 0 010-12.728m3.536 3.536a4 4 0 010 5.656" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-200 mb-2">You're Offline</h2>
          <p className="text-slate-400 mb-6">{FALLBACK_MESSAGES.NETWORK_ERROR}</p>
        </div>
      </div>
    )
  }

  // S8-T04: Show error with enhanced UI
  if (error) {
    return (
      <div className="flex items-center justify-center h-dvh bg-slate-900">
        <div className="text-center p-8 max-w-md">
          <div className="size-16 mx-auto mb-4 rounded-full bg-red-900/20 flex items-center justify-center">
            <svg className="size-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-200 mb-2">Something went wrong</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={handleRetry}
            disabled={isLoading}
            className="px-6 py-3 bg-amber-500 text-slate-900 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Retrying...' : retryCount > 0 ? 'Try Again' : 'Retry'}
          </button>
          {retryCount >= 3 && (
            <p className="text-slate-500 text-sm mt-4">
              Still having trouble? Try refreshing the page or check your connection.
            </p>
          )}
        </div>
      </div>
    )
  }

  // Show loading state while starting (only if no error)
  if (!sessionId || messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-dvh bg-slate-900">
        <div className="text-center">
          <div className="animate-spin size-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-slate-400">Starting discovery session...</p>
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
  if (contract) {
    return (
      <div className="min-h-dvh bg-gradient-to-b from-[#0D1117] to-[#161B22]">
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
    <div className="relative h-dvh">
      {/* S8-T04: Offline banner for active sessions */}
      {isOffline && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-amber-500/90 text-slate-900 px-4 py-2 text-center text-sm font-medium">
          <span className="inline-flex items-center gap-2">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m-3.536-3.536a4 4 0 010-5.656m-7.072 7.072a9 9 0 010-12.728m3.536 3.536a4 4 0 010 5.656" />
            </svg>
            You're offline. Your progress is saved and will sync when you reconnect.
          </span>
        </div>
      )}
      <DiscoveryInterface
        messages={messages}
        currentPhase={currentPhase}
        isStreaming={isLoading}
        isTyping={isLoading && !pendingQuestion}
        {...(uiPendingQuestion !== undefined && { pendingQuestion: uiPendingQuestion })}
        onSelectOption={handleSelectOption}
      />
    </div>
  )
}
