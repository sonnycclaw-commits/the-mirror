import { ErrorBoundary } from '../ErrorBoundary'
import { MessageList, type Message } from '../chat/MessageList'
import { TypingIndicator } from '../chat/TypingIndicator'
import { QuestionCard, type QuestionOption } from './QuestionCard'
import { PhaseProgress, type Phase } from './PhaseProgress'
import { UITreeRenderer, type UITree } from '@/lib/json-render'
import { SignalPillContainer } from '../signals/SignalPillContainer'
import { ConstellationTrigger } from '../signals/ConstellationTrigger'
import { ConstellationSheet } from '../signals/ConstellationSheet'
import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'

export interface DiscoveryInterfaceProps {
  messages: Message[]
  currentPhase: Phase
  isStreaming?: boolean
  isTyping?: boolean
  pendingQuestion?: {
    question: string
    options: QuestionOption[]
    toolCallId: string
  }
  uiTree?: UITree | null
  onSelectOption: (optionId: string, toolCallId: string) => void
  onAction?: (action: string) => void
}

export function DiscoveryInterface({
  messages,
  currentPhase,
  isStreaming = false,
  isTyping = false,
  pendingQuestion,
  uiTree,
  onSelectOption,
  onAction,
}: DiscoveryInterfaceProps) {
  // When a question is pending, show only the last 2 messages for context
  // This focuses attention on the question while maintaining conversational flow
  const hasActiveQuestion = !!pendingQuestion
  const contextMessages = hasActiveQuestion
    ? messages.slice(-2) // Last 2 messages for context
    : messages

  // Constellation sheet state
  const [isConstellationOpen, setIsConstellationOpen] = useState(false)

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-dvh bg-[var(--twilight-900)]">
        {/* Skip link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-[var(--coral-glow)] focus:text-[var(--twilight-900)]"
        >
          Skip to conversation
        </a>

        {/* Phase progress header with constellation trigger */}
        <header className="border-b border-[var(--glass-border)] flex items-center justify-between">
          <PhaseProgress currentPhase={currentPhase} />
          <div className="pr-2">
            <ConstellationTrigger onClick={() => setIsConstellationOpen(true)} />
          </div>
        </header>

        {/* Main content area */}
        <main id="main-content" className="flex-1 flex flex-col overflow-hidden scroll-mt-16">
          {/* Context indicator when chat is collapsed */}
          <AnimatePresence>
            {hasActiveQuestion && messages.length > 2 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex-shrink-0 px-4 py-2 bg-[var(--twilight-800)]/50 border-b border-[var(--glass-border)]"
              >
                <p className="text-xs text-[var(--twilight-500)] text-center">
                  {messages.length - 2} earlier message{messages.length - 2 !== 1 ? 's' : ''} hidden
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Message list - shows all messages or just context when question active */}
          <MessageList messages={contextMessages} isStreaming={isStreaming} />

          {/* Signal pill notifications - shows when signals are extracted */}
          <SignalPillContainer />

          {/* Rich UI components from json-render */}
          {uiTree && uiTree.length > 0 && (
            <div className="flex-shrink-0 px-4 py-3">
              <UITreeRenderer
                tree={uiTree}
                {...(onAction !== undefined && { onAction })}
              />
            </div>
          )}

          {/* Typing indicator */}
          {isTyping && !pendingQuestion && <TypingIndicator />}

          {/* Question card when AI asks - now gets more prominence */}
          <AnimatePresence>
            {pendingQuestion && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="flex-shrink-0 p-4 border-t border-[var(--glass-border)] bg-[var(--twilight-800)]/50 backdrop-blur-sm"
              >
                <QuestionCard
                  question={pendingQuestion.question}
                  options={pendingQuestion.options}
                  onSelect={(optionId) =>
                    onSelectOption(optionId, pendingQuestion.toolCallId)
                  }
                  disabled={isStreaming}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Constellation sheet */}
      <ConstellationSheet
        isOpen={isConstellationOpen}
        onClose={() => setIsConstellationOpen(false)}
      />
    </ErrorBoundary>
  )
}


