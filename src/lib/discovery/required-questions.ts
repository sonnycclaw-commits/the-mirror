/**
 * Required Profile Questions
 *
 * Minimum question set to guarantee profile coverage.
 * Each question targets specific signal domains.
 *
 * Based on Dan Koe protocol + signal extraction requirements.
 */

import type { SignalDomain } from '@/lib/ai/tools/types'

export interface ProfileQuestion {
  id: string
  question: string
  followUp?: string
  targetDomains: SignalDomain[]
  phase: 'SCENARIO' | 'EXCAVATION' | 'SYNTHESIS'
  required: boolean
}

/**
 * The minimum 8 questions needed to build a profile.
 * These should be asked even if the AI would otherwise skip them.
 */
export const REQUIRED_QUESTIONS: ProfileQuestion[] = [
  // Q1: Entry point - reveals initial concerns
  {
    id: 'entry',
    question: "What's been on your mind lately that you haven't told anyone?",
    targetDomains: ['VALUE', 'NEED'],
    phase: 'SCENARIO',
    required: true,
  },

  // Q2: Repeated complaints - reveals patterns
  {
    id: 'complaints',
    question: "What do you complain about repeatedly but never actually change? Give me three things.",
    targetDomains: ['PATTERN', 'NEED'],
    phase: 'EXCAVATION',
    required: true,
  },

  // Q3: Behavior vs words - reveals defenses
  {
    id: 'behavior_gap',
    question: "If someone watched your actual behavior this week—not your words—what would they conclude you actually want?",
    targetDomains: ['DEFENSE', 'VALUE'],
    phase: 'EXCAVATION',
    required: true,
  },

  // Q4: Unbearable truth - reveals core fear
  {
    id: 'unbearable_truth',
    question: "What truth about your current life would be unbearable to admit to someone you deeply respect?",
    targetDomains: ['DEFENSE', 'ATTACHMENT'],
    phase: 'EXCAVATION',
    required: true,
  },

  // Q5: 5-year projection - reveals anti-vision
  {
    id: 'five_year',
    question: "If absolutely nothing changes, describe a typical Tuesday five years from now. Where are you? What does your body feel like? Who's around?",
    targetDomains: ['PATTERN', 'NEED'],
    phase: 'EXCAVATION',
    required: true,
  },

  // Q6: Embarrassing reason - reveals true blocker
  {
    id: 'embarrassing_reason',
    question: "What's the most embarrassing reason you haven't changed? The one that makes you sound weak, scared, or lazy rather than reasonable.",
    targetDomains: ['DEFENSE', 'DEVELOPMENT'],
    phase: 'EXCAVATION',
    required: true,
  },

  // Q7: Identity protection - reveals attachment/development
  {
    id: 'identity',
    question: "What identity would you have to give up to actually become who you want to be?",
    targetDomains: ['ATTACHMENT', 'DEVELOPMENT'],
    phase: 'EXCAVATION',
    required: true,
  },

  // Q8: Ideal Tuesday - reveals values/vision
  {
    id: 'ideal_tuesday',
    question: "Forget what's realistic. If you could snap your fingers and live a different life in three years, what does a Tuesday look like?",
    targetDomains: ['VALUE', 'MOTIVE'],
    phase: 'SYNTHESIS',
    required: true,
  },
]

/**
 * Domain coverage requirements for a complete profile.
 * Profile is incomplete if any domain has 0 signals.
 */
export const DOMAIN_REQUIREMENTS: Record<SignalDomain, { min: number; label: string }> = {
  VALUE: { min: 1, label: 'Core Values' },
  NEED: { min: 1, label: 'Psychological Needs' },
  MOTIVE: { min: 0, label: 'Motivations' }, // Optional
  DEFENSE: { min: 1, label: 'Defense Patterns' },
  ATTACHMENT: { min: 1, label: 'Attachment Style' },
  DEVELOPMENT: { min: 0, label: 'Development Stage' }, // Optional
  PATTERN: { min: 1, label: 'Behavioral Patterns' },
}

/**
 * Get required questions not yet asked
 */
export function getUnansweredRequired(askedIds: string[]): ProfileQuestion[] {
  return REQUIRED_QUESTIONS.filter(q => q.required && !askedIds.includes(q.id))
}

/**
 * Get next required question based on current phase
 */
export function getNextRequiredQuestion(
  phase: 'SCENARIO' | 'EXCAVATION' | 'SYNTHESIS',
  askedIds: string[]
): ProfileQuestion | null {
  const unanswered = getUnansweredRequired(askedIds)
  const phaseQuestions = unanswered.filter(q => q.phase === phase)
  return phaseQuestions[0] || null
}

/**
 * Check if profile meets minimum requirements
 */
export function isProfileComplete(domainCounts: Record<SignalDomain, number>): boolean {
  for (const [domain, req] of Object.entries(DOMAIN_REQUIREMENTS)) {
    const count = domainCounts[domain as SignalDomain] || 0
    if (count < req.min) return false
  }
  return true
}

/**
 * Get missing domains for profile completion
 */
export function getMissingDomains(domainCounts: Record<SignalDomain, number>): SignalDomain[] {
  const missing: SignalDomain[] = []
  for (const [domain, req] of Object.entries(DOMAIN_REQUIREMENTS)) {
    const count = domainCounts[domain as SignalDomain] || 0
    if (count < req.min) missing.push(domain as SignalDomain)
  }
  return missing
}

/**
 * Questions targeting specific missing domains
 */
export function getQuestionForDomain(domain: SignalDomain): ProfileQuestion | null {
  return REQUIRED_QUESTIONS.find(q => q.targetDomains.includes(domain)) || null
}
