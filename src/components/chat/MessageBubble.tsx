import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

// Simple Mirror avatar icon
function MirrorAvatar() {
  return (
    <div className="flex-shrink-0 size-8 rounded-full bg-gradient-to-br from-[var(--coral-500)] to-[var(--coral-600)] flex items-center justify-center shadow-lg">
      {/* Mirror symbol */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--twilight-900)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2v4" />
        <path d="M12 18v4" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    </div>
  )
}

export function MessageBubble({ role, content, isStreaming = false }: MessageBubbleProps) {
  const isUser = role === 'user'

  return (
    <motion.article
      role="article"
      data-testid="message-bubble"
      data-role={role}
      aria-label={`${role} message`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
      className={cn(
        'flex w-full gap-3 motion-reduce:transition-none',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {/* Mirror avatar for assistant messages */}
      {!isUser && <MirrorAvatar />}

      <div
        className={cn(
          'max-w-[80%] px-5 py-3.5 rounded-2xl break-words leading-relaxed shadow-sm',
          isUser
            ? 'bg-[var(--coral-500)] text-[var(--twilight-900)] rounded-br-sm font-medium'
            : 'bg-[var(--twilight-800)] border border-[var(--glass-border)] text-[var(--twilight-100)] rounded-bl-sm'
        )}
      >
        <p className="text-pretty whitespace-pre-wrap">
          {content}
          {isStreaming && (
            <span className="inline-block w-1.5 h-4 ml-1 bg-[var(--coral-glow)] animate-pulse rounded-full align-middle" />
          )}
        </p>
      </div>
    </motion.article>
  )
}

