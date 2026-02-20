'use client'

export interface StreamingTextProps {
  /** Stream ID - will be properly typed in S2 when integrated with Convex */
  streamId?: string
  /** Fallback text to display if no stream */
  text?: string
  /** Called when streaming completes */
  onComplete?: (text: string) => void
  /** Whether currently streaming */
  isStreaming?: boolean
}

/**
 * StreamingText component - placeholder for Sprint 2 Convex integration
 *
 * TODO S2-T06: Integrate with @convex-dev/persistent-text-streaming/react
 * - Use useStream hook with proper streamId typing
 * - Handle streaming state and errors
 */
export function StreamingText({
  text = '',
  isStreaming = false,
  onComplete,
}: StreamingTextProps) {
  // Will be replaced with useStream hook in S2
  if (!isStreaming && text && onComplete) {
    onComplete(text)
  }

  return (
    <span className="text-pretty whitespace-pre-wrap">
      {text}
      {isStreaming && (
        <span
          className="inline-block w-2 h-4 ml-1 bg-amber-400 animate-pulse motion-reduce:animate-none"
          aria-hidden="true"
        />
      )}
    </span>
  )
}
