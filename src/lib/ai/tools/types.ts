/**
 * Validated Psychological Signal Types (DECISION-001)
 *
 * Evidence-based psychological constructs for signal extraction:
 * - Schwartz Values (10 basic human values)
 * - SDT Needs (Self-Determination Theory)
 * - McClelland Motives (achievement, power, affiliation)
 * - Vaillant Defense Mechanisms (8 mechanisms across maturity levels)
 * - Bowlby Attachment Styles (4 attachment patterns)
 * - Kegan Developmental Stages (3 adult stages)
 */

// =============================================================================
// Signal Domains
// =============================================================================

export const SIGNAL_DOMAINS = [
  'VALUE',
  'NEED',
  'MOTIVE',
  'DEFENSE',
  'ATTACHMENT',
  'DEVELOPMENT',
  'PATTERN',
] as const

export type SignalDomain = (typeof SIGNAL_DOMAINS)[number]

// =============================================================================
// VALUE Domain - Schwartz Basic Human Values
// =============================================================================

export const SCHWARTZ_VALUES = [
  'POWER', // Social status, prestige, control over resources
  'ACHIEVEMENT', // Personal success through competence
  'HEDONISM', // Pleasure and sensuous gratification
  'STIMULATION', // Excitement, novelty, challenge
  'SELF_DIRECTION', // Independent thought and action
  'UNIVERSALISM', // Understanding, tolerance, protection for all
  'BENEVOLENCE', // Preserving welfare of close others
  'TRADITION', // Respect for customs and culture
  'CONFORMITY', // Restraint of actions that violate social norms
  'SECURITY', // Safety, harmony, stability
] as const

export type SchwartzValue = (typeof SCHWARTZ_VALUES)[number]

// =============================================================================
// NEED Domain - Self-Determination Theory
// =============================================================================

export const SDT_NEEDS = ['AUTONOMY', 'COMPETENCE', 'RELATEDNESS'] as const

export type SDTNeed = (typeof SDT_NEEDS)[number]

export const NEED_STATES = ['SATISFIED', 'FRUSTRATED'] as const

export type NeedState = (typeof NEED_STATES)[number]

// =============================================================================
// MOTIVE Domain - McClelland's Acquired Needs Theory
// =============================================================================

export const MCCLELLAND_MOTIVES = ['ACHIEVEMENT', 'POWER', 'AFFILIATION'] as const

export type McClellandMotive = (typeof MCCLELLAND_MOTIVES)[number]

// =============================================================================
// DEFENSE Domain - Vaillant's Defense Mechanisms
// =============================================================================

export const VAILLANT_DEFENSES = [
  'DENIAL', // Immature: Refusing to accept reality
  'PROJECTION', // Immature: Attributing own feelings to others
  'DISPLACEMENT', // Neurotic: Redirecting emotions to safer target
  'RATIONALIZATION', // Neurotic: Logical justification for irrational behavior
  'INTELLECTUALIZATION', // Neurotic: Distancing from emotions through abstraction
  'SUBLIMATION', // Mature: Channeling impulses into socially acceptable activities
  'HUMOR', // Mature: Finding comedy in difficult situations
  'ANTICIPATION', // Mature: Realistic planning for future discomfort
] as const

export type VaillantDefense = (typeof VAILLANT_DEFENSES)[number]

// =============================================================================
// ATTACHMENT Domain - Bowlby's Attachment Theory
// =============================================================================

export const BOWLBY_ATTACHMENTS = [
  'SECURE', // Comfortable with intimacy and autonomy
  'ANXIOUS', // Preoccupied with relationships, fear of abandonment
  'AVOIDANT', // Dismissive of intimacy, overly self-reliant
  'DISORGANIZED', // Conflicted, inconsistent attachment behaviors
] as const

export type BowlbyAttachment = (typeof BOWLBY_ATTACHMENTS)[number]

// =============================================================================
// DEVELOPMENT Domain - Kegan's Adult Development Stages
// =============================================================================

export const KEGAN_STAGES = [
  'SOCIALIZED', // Identity defined by relationships and roles
  'SELF_AUTHORING', // Identity defined by internal values and standards
  'SELF_TRANSFORMING', // Can hold multiple value systems simultaneously
] as const

export type KeganStage = (typeof KEGAN_STAGES)[number]

export const DEVELOPMENT_STATES = ['STABLE', 'TRANSITIONING'] as const

export type DevelopmentState = (typeof DEVELOPMENT_STATES)[number]

// =============================================================================
// Supporting Enums
// =============================================================================

export const EMOTIONAL_CONTEXTS = [
  'NEUTRAL', // No strong emotional tone
  'DEFENSIVE', // Protective, guarded responses
  'VULNERABLE', // Open about weaknesses or fears
  'RESISTANT', // Pushing back against inquiry
  'OPEN', // Receptive, willing to explore
  'CONFLICTED', // Mixed or contradictory emotional signals
] as const

export type EmotionalContext = (typeof EMOTIONAL_CONTEXTS)[number]

export const LIFE_DOMAINS = [
  'WORK', // Career, professional life
  'RELATIONSHIPS', // Romantic, family, friendships
  'HEALTH', // Physical and mental wellbeing
  'PERSONAL_GROWTH', // Self-improvement, learning
  'FINANCE', // Money, financial decisions
  'GENERAL', // Cross-cutting or unspecified
] as const

export type LifeDomain = (typeof LIFE_DOMAINS)[number]

// =============================================================================
// Signal Interface
// =============================================================================

/**
 * A psychological signal extracted from user input
 *
 * The 'type' field is flexible:
 * - For VALUE domain: Use SchwartzValue (e.g., 'ACHIEVEMENT')
 * - For NEED domain: Use SDTNeed (e.g., 'AUTONOMY')
 * - For MOTIVE domain: Use McClellandMotive (e.g., 'POWER')
 * - For DEFENSE domain: Use VaillantDefense (e.g., 'RATIONALIZATION')
 * - For ATTACHMENT domain: Use BowlbyAttachment (e.g., 'SECURE')
 * - For DEVELOPMENT domain: Use KeganStage (e.g., 'SELF_AUTHORING')
 * - For PATTERN domain: Use free-form string describing the pattern
 */
export interface Signal {
  /** The psychological domain this signal belongs to */
  domain: SignalDomain

  /** The specific construct type within the domain (or free-form for PATTERN) */
  type: string

  /** The signal content in plain language */
  content: string

  /** The exact user words that evidenced this signal */
  source: string

  /** Confidence level 0.0-1.0 in this extraction */
  confidence: number

  /** State for NEED domain (SATISFIED/FRUSTRATED) or DEVELOPMENT domain (STABLE/TRANSITIONING) */
  state?: NeedState | DevelopmentState

  /** The emotional context when this signal was revealed */
  emotionalContext?: EmotionalContext

  /** Life domain this signal applies to */
  lifeDomain?: LifeDomain

  /** ID of the scenario this signal was extracted from */
  scenarioId?: string

  /** IDs of signals this relates to or contradicts */
  relatedSignalIds?: string[]
}
