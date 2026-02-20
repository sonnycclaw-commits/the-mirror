/**
 * extractSignal Tool - DECISION-001 Validated Schema
 *
 * This tool is called by Claude to extract psychological signals from user input.
 * Uses 7 validated psychological domains with evidence-based constructs.
 *
 * @see DECISION-001-validated-extraction.md
 * @see types.ts for full type definitions
 */
import { tool } from 'ai'
import { z } from 'zod'
import {
  SIGNAL_DOMAINS,
  SCHWARTZ_VALUES,
  SDT_NEEDS,
  MCCLELLAND_MOTIVES,
  VAILLANT_DEFENSES,
  BOWLBY_ATTACHMENTS,
  KEGAN_STAGES,
  LIFE_DOMAINS,
  type SignalDomain,
} from './types'

// =============================================================================
// Zod Schemas (aligned with DECISION-001)
// =============================================================================

export const signalDomainSchema = z.enum(SIGNAL_DOMAINS)

export const signalStateSchema = z
  .enum(['SATISFIED', 'FRUSTRATED', 'STABLE', 'TRANSITIONING'])
  .optional()

export const emotionalContextSchema = z
  .enum(['neutral', 'defensive', 'vulnerable', 'resistant', 'open', 'conflicted'])
  .optional()

export const lifeDomainSchema = z.enum(LIFE_DOMAINS).optional()

export const extractSignalSchema = z.object({
  domain: signalDomainSchema.describe(
    'The psychological domain: VALUE (Schwartz), NEED (SDT), MOTIVE (McClelland), DEFENSE (Vaillant), ATTACHMENT (Bowlby), DEVELOPMENT (Kegan), or PATTERN (behavioral)'
  ),

  type: z.string().describe(
    'Specific construct within the domain. For VALUE: one of POWER, ACHIEVEMENT, HEDONISM, STIMULATION, SELF_DIRECTION, UNIVERSALISM, BENEVOLENCE, TRADITION, CONFORMITY, SECURITY. For NEED: AUTONOMY, COMPETENCE, or RELATEDNESS. For MOTIVE: ACHIEVEMENT, POWER, or AFFILIATION. For DEFENSE: DENIAL, PROJECTION, DISPLACEMENT, RATIONALIZATION, INTELLECTUALIZATION, SUBLIMATION, HUMOR, ANTICIPATION. For ATTACHMENT: SECURE, ANXIOUS, AVOIDANT, DISORGANIZED. For DEVELOPMENT: SOCIALIZED, SELF_AUTHORING, SELF_TRANSFORMING. For PATTERN: free-form descriptive string.'
  ),

  state: signalStateSchema.describe(
    'State for applicable domains: NEED (SATISFIED/FRUSTRATED) or DEVELOPMENT (STABLE/TRANSITIONING)'
  ),

  content: z
    .string()
    .describe(
      'The insight in plain language (e.g., "User feels trapped by external expectations at work")'
    ),

  source: z
    .string()
    .describe('The EXACT words from the user that evidenced this signal'),

  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe('Confidence level 0.0-1.0 in this extraction'),

  emotionalContext: emotionalContextSchema.describe(
    'The emotional state when this was revealed'
  ),

  scenarioId: z
    .string()
    .optional()
    .describe('ID of the scenario this signal was extracted from'),

  lifeDomain: lifeDomainSchema.describe(
    'Life area this applies to: WORK, RELATIONSHIPS, HEALTH, PERSONAL_GROWTH, FINANCE, or GENERAL'
  ),

  relatedSignals: z
    .array(z.string())
    .optional()
    .describe('IDs of signals this contradicts or relates to'),
})

export type ExtractSignalArgs = z.infer<typeof extractSignalSchema>

/**
 * Factory to create extractSignal tool with Convex context
 */
export function createExtractSignalTool(
  saveSignal: (signal: ExtractSignalArgs) => Promise<void>
) {
  return tool({
    description: `Extract a psychological signal using validated constructs (DECISION-001).

## The 7 Psychological Domains

### 1. VALUE (Schwartz's 10 Basic Human Values)
What fundamentally matters to them:
- **POWER**: Status, control, dominance ("I want to be in charge")
- **ACHIEVEMENT**: Success through competence ("I want to succeed")
- **HEDONISM**: Pleasure, enjoyment ("I just want to feel good")
- **STIMULATION**: Excitement, novelty ("I need something new")
- **SELF_DIRECTION**: Freedom, independence ("I want to choose my own path")
- **UNIVERSALISM**: Fairness, protection for all ("Everyone deserves...")
- **BENEVOLENCE**: Care for close others ("I want to help my family")
- **TRADITION**: Respect for customs ("That's how it's always been done")
- **CONFORMITY**: Social compliance ("I don't want to rock the boat")
- **SECURITY**: Safety, stability ("I need to feel secure")

### 2. NEED (Self-Determination Theory)
Detect frustration or satisfaction:
- "I had to" / "They made me" / "I had no choice" → **AUTONOMY** FRUSTRATED
- "I can't" / "I don't know how" / "It's too hard" → **COMPETENCE** FRUSTRATED
- "No one understands" / "I feel alone" → **RELATEDNESS** FRUSTRATED
- Opposite markers indicate SATISFIED state

### 3. MOTIVE (McClelland's Acquired Needs)
What drives their behavior:
- **ACHIEVEMENT**: Task focus, feedback seeking, moderate risks
- **POWER**: Influence language, leadership themes, impact focus
- **AFFILIATION**: Harmony seeking, approval needs, relationship priority

### 4. DEFENSE (Vaillant's Defense Mechanisms)
How do they protect themselves?
- **DENIAL**: "It's not that bad" - refusing to accept reality
- **PROJECTION**: "They probably didn't want to" - attributing own feelings to others
- **DISPLACEMENT**: Anger at safe target instead of real source
- **RATIONALIZATION**: "Work is more important anyway" - logical justification
- **INTELLECTUALIZATION**: "Let me research this more" - avoiding feeling via analysis
- **SUBLIMATION**: Exercise after frustration (healthy channeling)
- **HUMOR**: Finding comedy in difficulty (mature)
- **ANTICIPATION**: Realistic planning for discomfort (mature)

### 5. ATTACHMENT (Bowlby's Attachment Theory)
How they talk about relationships:
- **SECURE**: Balanced stories, acknowledges both good and bad
- **ANXIOUS**: Rambling, overwhelming detail, fear of abandonment
- **AVOIDANT**: Short answers, dismissive ("It was fine"), lacks specific memories
- **DISORGANIZED**: Contradictory statements, unresolved trauma references

### 6. DEVELOPMENT (Kegan's Adult Development)
HOW they make meaning (not what):
- **SOCIALIZED**: "What will they think?" - identity defined by others
- **SELF_AUTHORING**: "I decided this matters to me" - internal compass
- **SELF_TRANSFORMING**: "I can see how my view created this" - holds paradox

### 7. PATTERN (Behavioral Observation)
Observable recurring behaviors:
- Use free-form type string describing the pattern
- Examples: "conflict_avoidance", "productive_procrastination", "burst_crash"

## Best Practices
- Extract AFTER every meaningful user response
- Use the exact quote as source
- Only mark high confidence (>0.7) when pattern is clear across 2+ data points
- Always include state for NEED and DEVELOPMENT domains
- Note lifeDomain when the signal is context-specific`,
    inputSchema: extractSignalSchema,
    execute: async (args: ExtractSignalArgs) => {
      await saveSignal(args)
      return {
        success: true,
        domain: args.domain,
        type: args.type,
        state: args.state,
        confidence: args.confidence,
      }
    },
  })
}

// =============================================================================
// Domain-specific validation helpers
// =============================================================================

/**
 * Validate that type matches domain
 */
export function isValidTypeForDomain(domain: SignalDomain, type: string): boolean {
  switch (domain) {
    case 'VALUE':
      return (SCHWARTZ_VALUES as readonly string[]).includes(type)
    case 'NEED':
      return (SDT_NEEDS as readonly string[]).includes(type)
    case 'MOTIVE':
      return (MCCLELLAND_MOTIVES as readonly string[]).includes(type)
    case 'DEFENSE':
      return (VAILLANT_DEFENSES as readonly string[]).includes(type)
    case 'ATTACHMENT':
      return (BOWLBY_ATTACHMENTS as readonly string[]).includes(type)
    case 'DEVELOPMENT':
      return (KEGAN_STAGES as readonly string[]).includes(type)
    case 'PATTERN':
      return true // Free-form for patterns
    default:
      return false
  }
}

/**
 * Get valid types for a domain
 */
export function getValidTypesForDomain(domain: SignalDomain): readonly string[] {
  switch (domain) {
    case 'VALUE':
      return SCHWARTZ_VALUES
    case 'NEED':
      return SDT_NEEDS
    case 'MOTIVE':
      return MCCLELLAND_MOTIVES
    case 'DEFENSE':
      return VAILLANT_DEFENSES
    case 'ATTACHMENT':
      return BOWLBY_ATTACHMENTS
    case 'DEVELOPMENT':
      return KEGAN_STAGES
    case 'PATTERN':
      return ['(free-form)']
    default:
      return []
  }
}
