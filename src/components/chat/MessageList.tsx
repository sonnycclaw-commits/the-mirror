import { useRef, useEffect, useCallback } from 'react'
import { MessageBubble, type MessageBubbleProps } from './MessageBubble'

export interface Message extends MessageBubbleProps {
  id: string
}

export interface MessageListProps {
  messages: Message[]
  isStreaming?: boolean
}

export function MessageList({ messages, isStreaming }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll respecting reduced motion preference
  const scrollToBottom = useCallback(() => {
    if (!bottomRef.current) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    bottomRef.current.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'end',
    })
  }, [])

  // Scroll on new messages
  useEffect(() => {
    scrollToBottom()
  }, [messages.length, scrollToBottom])

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto overscroll-contain px-4 py-6 space-y-4 scroll-mt-16"
      role="log"
      aria-label="Conversation history"
      aria-live="polite"
    >
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id}
          role={message.role}
          content={message.content}
          isStreaming={!!(isStreaming && index === messages.length - 1)}
        />
      ))}

      {/* Scroll anchor */}
      <div ref={bottomRef} aria-hidden="true" />
    </div>
  )
}
