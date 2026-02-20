/**
 * Resilience Utilities - S8-T04
 *
 * Network handling, retry logic, graceful degradation.
 */

import { logger } from './observability'

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxAttempts: number
  baseDelayMs: number
  maxDelayMs: number
  backoffMultiplier: number
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
}

/**
 * Exponential backoff retry wrapper
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const { maxAttempts, baseDelayMs, maxDelayMs, backoffMultiplier } = {
    ...DEFAULT_RETRY_CONFIG,
    ...config,
  }

  let lastError: Error | undefined
  let delay = baseDelayMs

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt === maxAttempts) {
        logger.error(`Retry exhausted after ${maxAttempts} attempts`, lastError)
        throw lastError
      }

      // Check if error is retryable
      if (!isRetryableError(lastError)) {
        throw lastError
      }

      logger.warn(`Attempt ${attempt} failed, retrying in ${delay}ms`, {
        error: lastError.message,
      })

      await sleep(delay)
      delay = Math.min(delay * backoffMultiplier, maxDelayMs)
    }
  }

  throw lastError
}

/**
 * Check if an error is retryable
 */
function isRetryableError(error: Error): boolean {
  const message = error.message.toLowerCase()

  // Network errors
  if (
    message.includes('network') ||
    message.includes('timeout') ||
    message.includes('econnreset') ||
    message.includes('econnrefused')
  ) {
    return true
  }

  // Rate limit errors
  if (message.includes('rate limit') || message.includes('429')) {
    return true
  }

  // Server errors (5xx)
  if (message.includes('500') || message.includes('502') || message.includes('503')) {
    return true
  }

  return false
}

/**
 * Sleep helper
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Timeout wrapper
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage = 'Operation timed out'
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout>

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(timeoutMessage))
    }, timeoutMs)
  })

  try {
    const result = await Promise.race([promise, timeoutPromise])
    clearTimeout(timeoutId!)
    return result
  } catch (error) {
    clearTimeout(timeoutId!)
    throw error
  }
}

/**
 * Network status detection
 */
export function isOnline(): boolean {
  if (typeof navigator !== 'undefined') {
    return navigator.onLine
  }
  return true
}

/**
 * Network status hook data
 */
export interface NetworkStatus {
  isOnline: boolean
  isReconnecting: boolean
  lastOnline: number | null
}

let networkStatus: NetworkStatus = {
  isOnline: true,
  isReconnecting: false,
  lastOnline: null,
}

/**
 * Initialize network listeners
 */
export function initNetworkListeners(
  onOnline?: () => void,
  onOffline?: () => void
) {
  if (typeof window === 'undefined') return

  const handleOnline = () => {
    networkStatus = {
      isOnline: true,
      isReconnecting: false,
      lastOnline: Date.now(),
    }
    logger.info('Network reconnected')
    onOnline?.()
  }

  const handleOffline = () => {
    networkStatus = {
      ...networkStatus,
      isOnline: false,
      isReconnecting: true,
    }
    logger.warn('Network disconnected')
    onOffline?.()
  }

  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)

  // Initialize current state
  networkStatus.isOnline = navigator.onLine
  if (navigator.onLine) {
    networkStatus.lastOnline = Date.now()
  }

  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}

export function getNetworkStatus(): NetworkStatus {
  return { ...networkStatus }
}

/**
 * Graceful degradation for AI responses
 * These messages are in The Mirror's voice - warm but honest
 */
export const FALLBACK_MESSAGES = {
  AI_UNAVAILABLE: "I lost my train of thought for a moment. Let me try again.",
  RATE_LIMITED: "Give me a moment to catch up. There's a lot to process.",
  NETWORK_ERROR: "It looks like we lost connection. I'll be here when you're back.",
  TIMEOUT: "That one's taking me longer to think through. Let me try a simpler approach.",
  GENERIC_ERROR: "Something got tangled up. Don't worry — I remember everything you've told me.",
  PROGRESS_SAVED: "Your progress is saved. We can pick up right where we left off.",
} as const

/**
 * Get appropriate fallback message for error
 */
export function getFallbackMessage(error: Error): string {
  const message = error.message.toLowerCase()

  if (message.includes('rate limit') || message.includes('429')) {
    return FALLBACK_MESSAGES.RATE_LIMITED
  }

  if (
    message.includes('network') ||
    message.includes('offline') ||
    message.includes('econnreset')
  ) {
    return FALLBACK_MESSAGES.NETWORK_ERROR
  }

  if (message.includes('timeout')) {
    return FALLBACK_MESSAGES.TIMEOUT
  }

  if (
    message.includes('anthropic') ||
    message.includes('ai') ||
    message.includes('500')
  ) {
    return FALLBACK_MESSAGES.AI_UNAVAILABLE
  }

  return FALLBACK_MESSAGES.GENERIC_ERROR
}

/**
 * Session recovery helper
 */
export interface RecoveryState {
  sessionId: string
  lastPhase: string
  lastMessageId?: string
  pendingToolCall?: string
}

const RECOVERY_KEY = 'mirror_recovery_state'

export function saveRecoveryState(state: RecoveryState) {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(RECOVERY_KEY, JSON.stringify(state))
    } catch {
      // Ignore quota errors
    }
  }
}

export function loadRecoveryState(): RecoveryState | null {
  if (typeof localStorage !== 'undefined') {
    try {
      const data = localStorage.getItem(RECOVERY_KEY)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  }
  return null
}

export function clearRecoveryState() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(RECOVERY_KEY)
  }
}
