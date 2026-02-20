/**
 * Observability Utilities - S8-T03
 *
 * Logging, metrics, and error tracking infrastructure.
 */

// Log levels
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

// Redact PII from log entries
const PII_PATTERNS = [
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email
  /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // Phone
  /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
]

function redactPII(text: string): string {
  let redacted = text
  for (const pattern of PII_PATTERNS) {
    redacted = redacted.replace(pattern, '[REDACTED]')
  }
  return redacted
}

/**
 * Structured logger for the application
 */
export const logger = {
  debug(message: string, meta?: Record<string, unknown>) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, meta ? redactPII(JSON.stringify(meta)) : '')
    }
  },

  info(message: string, meta?: Record<string, unknown>) {
    console.info(`[INFO] ${message}`, meta ? redactPII(JSON.stringify(meta)) : '')
  },

  warn(message: string, meta?: Record<string, unknown>) {
    console.warn(`[WARN] ${message}`, meta ? redactPII(JSON.stringify(meta)) : '')
  },

  error(message: string, error?: Error, meta?: Record<string, unknown>) {
    console.error(`[ERROR] ${message}`, {
      error: error?.message,
      stack: error?.stack,
      ...meta,
    })

    // In production, send to error tracking service
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error)
    }
  },
}

/**
 * AI call logging (for debugging and cost tracking)
 */
export interface AICallLog {
  timestamp: number
  sessionId: string
  phase: string
  promptTokens?: number
  completionTokens?: number
  latencyMs: number
  toolCalls: string[]
  success: boolean
  error?: string
}

const aiCallLogs: AICallLog[] = []
const MAX_LOGS = 1000

export function logAICall(log: AICallLog) {
  // Rotate logs
  if (aiCallLogs.length >= MAX_LOGS) {
    aiCallLogs.shift()
  }
  aiCallLogs.push(log)

  // Log summary
  logger.info('AI Call', {
    sessionId: log.sessionId,
    phase: log.phase,
    latencyMs: log.latencyMs,
    toolCalls: log.toolCalls,
    success: log.success,
  })
}

export function getAICallStats() {
  if (aiCallLogs.length === 0) return null

  const successCalls = aiCallLogs.filter(l => l.success)
  const avgLatency = successCalls.length > 0
    ? successCalls.reduce((sum, l) => sum + l.latencyMs, 0) / successCalls.length
    : 0

  return {
    totalCalls: aiCallLogs.length,
    successRate: (successCalls.length / aiCallLogs.length) * 100,
    avgLatencyMs: Math.round(avgLatency),
    recentErrors: aiCallLogs.filter(l => !l.success).slice(-5).map(l => l.error),
  }
}

/**
 * Session metrics tracking
 */
export interface SessionMetrics {
  sessionId: string
  startTime: number
  endTime?: number
  phaseTransitions: Array<{ from: string; to: string; timestamp: number }>
  signalCount: number
  messageCount: number
  contractGenerated: boolean
}

const sessionMetrics: Map<string, SessionMetrics> = new Map()

export function startSessionMetrics(sessionId: string) {
  sessionMetrics.set(sessionId, {
    sessionId,
    startTime: Date.now(),
    phaseTransitions: [],
    signalCount: 0,
    messageCount: 0,
    contractGenerated: false,
  })
}

export function recordPhaseTransition(sessionId: string, from: string, to: string) {
  const metrics = sessionMetrics.get(sessionId)
  if (metrics) {
    metrics.phaseTransitions.push({ from, to, timestamp: Date.now() })
  }
}

export function incrementMetric(sessionId: string, metric: 'signalCount' | 'messageCount') {
  const metrics = sessionMetrics.get(sessionId)
  if (metrics) {
    metrics[metric]++
  }
}

export function markContractGenerated(sessionId: string) {
  const metrics = sessionMetrics.get(sessionId)
  if (metrics) {
    metrics.contractGenerated = true
    metrics.endTime = Date.now()
  }
}

export function getSessionMetrics(sessionId: string): SessionMetrics | undefined {
  return sessionMetrics.get(sessionId)
}

/**
 * Health check endpoint data
 */
export function getHealthStatus() {
  const aiStats = getAICallStats()

  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    ai: aiStats ? {
      successRate: aiStats.successRate,
      avgLatencyMs: aiStats.avgLatencyMs,
    } : null,
    activeSessions: sessionMetrics.size,
  }
}

/**
 * Error boundary helper for React
 */
export function reportError(error: Error, errorInfo?: { componentStack?: string }) {
  logger.error('React Error Boundary', error, {
    componentStack: errorInfo?.componentStack,
    url: typeof window !== 'undefined' ? window.location.href : 'server',
  })
}
