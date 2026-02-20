/**
 * Contract Reminder Scheduler (S6-T01)
 *
 * Schedules and manages return engagement hooks.
 * Uses localStorage for persistence and service worker for notifications.
 */

export interface ContractReminder {
  contractId: string
  scheduledAt: number // timestamp
  type: 'daily' | 'weekly' | 'milestone'
  message: string
  dismissed: boolean
}

const STORAGE_KEY = 'mirror-contract-reminders'

/**
 * Get all scheduled reminders
 */
export function getReminders(): ContractReminder[] {
  if (typeof localStorage === 'undefined') return []
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

/**
 * Save reminders
 */
function saveReminders(reminders: ContractReminder[]): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders))
}

/**
 * Schedule a new reminder
 */
export function scheduleReminder(
  contractId: string,
  delayMs: number,
  type: ContractReminder['type'],
  message: string
): void {
  const reminders = getReminders()
  reminders.push({
    contractId,
    scheduledAt: Date.now() + delayMs,
    type,
    message,
    dismissed: false,
  })
  saveReminders(reminders)
}

/**
 * Schedule the default contract reminder sequence
 */
export function scheduleContractReminders(contractId: string): void {
  // Day 1: Evening check-in
  scheduleReminder(
    contractId,
    12 * 60 * 60 * 1000, // 12 hours
    'daily',
    'How did the first day of your contract go?'
  )

  // Day 3: Mid-week reflection
  scheduleReminder(
    contractId,
    3 * 24 * 60 * 60 * 1000,
    'milestone',
    'You\'re 3 days into your commitment. What patterns are you noticing?'
  )

  // Day 7: Week one completion
  scheduleReminder(
    contractId,
    7 * 24 * 60 * 60 * 1000,
    'weekly',
    'One week complete. Ready to reflect on what you\'ve learned?'
  )
}

/**
 * Get due reminders (ones that should fire now)
 */
export function getDueReminders(): ContractReminder[] {
  const now = Date.now()
  return getReminders().filter(r => !r.dismissed && r.scheduledAt <= now)
}

/**
 * Dismiss a reminder
 */
export function dismissReminder(contractId: string, type: ContractReminder['type']): void {
  const reminders = getReminders()
  const updated = reminders.map(r =>
    r.contractId === contractId && r.type === type
      ? { ...r, dismissed: true }
      : r
  )
  saveReminders(updated)
}

/**
 * Clear all reminders for a contract
 */
export function clearContractReminders(contractId: string): void {
  const reminders = getReminders().filter(r => r.contractId !== contractId)
  saveReminders(reminders)
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof Notification === 'undefined') return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false

  const result = await Notification.requestPermission()
  return result === 'granted'
}

/**
 * Show a notification
 */
export function showNotification(title: string, message: string): void {
  if (typeof Notification === 'undefined') return
  if (Notification.permission !== 'granted') return

  new Notification(title, {
    body: message,
    icon: '/favicon.ico',
    tag: 'mirror-reminder',
  })
}
