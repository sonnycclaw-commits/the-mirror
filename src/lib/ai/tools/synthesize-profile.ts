/**
 * synthesizeProfile Tool - S4-T04
 *
 * Creates a psychological profile synthesis from extracted signals.
 * This is the "Mirror" phase - reflecting patterns back to the user.
 *
 * DECISION-001: Validated Psychological Constructs
 * The synthesis uses validated psychological constructs:
 * - Schwartz Values (10 basic human values)
 * - SDT Needs (autonomy, competence, relatedness)
 * - McClelland Motives (achievement, power, affiliation)
 * - Vaillant Defense Mechanisms (8 mechanisms across maturity levels)
 * - Attachment Markers (secure, anxious, avoidant, disorganized)
 * - Kegan Developmental Stages (socialized, self-authoring, self-transforming)
 */
import { tool } from 'ai'
import { z } from 'zod'

// =============================================================================
// Schwartz Values (10 Basic Human Values)
// =============================================================================
const schwartzValueEnum = z.enum([
  'POWER',
  'ACHIEVEMENT',
  'HEDONISM',
  'STIMULATION',
  'SELF_DIRECTION',
  'UNIVERSALISM',
  'BENEVOLENCE',
  'TRADITION',
  'CONFORMITY',
  'SECURITY',
])

const valuesSchema = z.object({
  primary: z
    .array(schwartzValueEnum)
    .describe('Top 3 values with strong behavioral evidence'),
  secondary: z
    .array(schwartzValueEnum)
    .optional()
    .describe('Additional values with moderate evidence'),
})

// =============================================================================
// SDT Needs Assessment (Self-Determination Theory)
// =============================================================================
const sdtNeedSchema = z.object({
  state: z.enum(['SATISFIED', 'FRUSTRATED']).describe('Current need state'),
  intensity: z
    .number()
    .min(0)
    .max(1)
    .describe('Intensity of satisfaction/frustration (0-1)'),
  evidence: z.string().optional().describe('Supporting observation from session'),
})

const needsSchema = z.object({
  autonomy: sdtNeedSchema.describe('Sense of volition and self-direction'),
  competence: sdtNeedSchema.describe('Sense of effectiveness and mastery'),
  relatedness: sdtNeedSchema.describe('Sense of connection and belonging'),
})

// =============================================================================
// McClelland Dominant Motive
// =============================================================================
const dominantMotiveSchema = z.object({
  type: z
    .enum(['ACHIEVEMENT', 'POWER', 'AFFILIATION'])
    .describe('Primary motivational driver'),
  evidence: z
    .array(z.string())
    .describe('Behavioral evidence supporting this motive'),
})

// =============================================================================
// Vaillant Defense Mechanisms
// =============================================================================
const defenseEnum = z.enum([
  'DENIAL',
  'PROJECTION',
  'DISPLACEMENT',
  'RATIONALIZATION',
  'INTELLECTUALIZATION',
  'SUBLIMATION',
  'HUMOR',
  'ANTICIPATION',
])

const defensesSchema = z.object({
  primary: z
    .array(defenseEnum)
    .describe('Primary defense mechanisms observed'),
  maturityLevel: z
    .enum(['IMMATURE', 'NEUROTIC', 'MATURE'])
    .describe('Overall defense maturity level'),
})

// =============================================================================
// Attachment Markers
// =============================================================================
const attachmentMarkersSchema = z.object({
  style: z
    .enum(['SECURE', 'ANXIOUS', 'AVOIDANT', 'DISORGANIZED'])
    .describe('Indicated attachment style'),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe('Confidence in this assessment (0-1)'),
  evidence: z
    .array(z.string())
    .describe('Behavioral patterns supporting this indication'),
})

// =============================================================================
// Kegan Developmental Stages
// =============================================================================
const developmentSchema = z.object({
  stage: z
    .enum(['SOCIALIZED', 'SELF_AUTHORING', 'SELF_TRANSFORMING'])
    .describe('Current developmental stage'),
  state: z
    .enum(['STABLE', 'TRANSITIONING'])
    .describe('Whether stable in stage or transitioning'),
  evidence: z
    .array(z.string())
    .describe('Observations supporting this assessment'),
})

// =============================================================================
// Behavioral Patterns (Observable)
// =============================================================================
const lifeDomainEnum = z.enum([
  'WORK',
  'RELATIONSHIPS',
  'HEALTH',
  'PERSONAL_GROWTH',
  'FINANCE',
  'GENERAL',
])

const patternSchema = z.object({
  name: z.string().describe('Short name for the pattern (e.g., "Conflict Avoidance")'),
  description: z
    .string()
    .describe('Detailed description of the pattern and its manifestation'),
  evidence: z
    .array(z.string())
    .describe('Specific quotes/examples from the session that support this'),
  frequency: z
    .enum(['CORE', 'FREQUENT', 'OCCASIONAL'])
    .describe('How often this pattern appears'),
  lifeDomain: lifeDomainEnum
    .optional()
    .describe('Primary life domain this affects'),
})

// =============================================================================
// Contradictions (Stated vs Actual)
// =============================================================================
const contradictionSummarySchema = z.object({
  stated: z.string().describe('What the user says they value/want'),
  actual: z.string().describe('What their behavior actually shows'),
  impact: z.string().describe('How this gap affects their life'),
  rootCause: z.string().optional().describe('Hypothesized underlying reason'),
})

// =============================================================================
// Contract Focus
// =============================================================================
const contractFocusSchema = z.object({
  suggestedRefusal: z
    .string()
    .describe('Suggested "I refuse to..." statement'),
  suggestedBecoming: z
    .string()
    .describe('Suggested "I am the person who..." statement'),
  rationale: z.string().describe('Why these are recommended based on patterns'),
})

// =============================================================================
// Full PsychometricProfile Schema
// =============================================================================
export const synthesizeProfileSchema = z.object({
  // Schwartz Values (ranked by evidence)
  values: valuesSchema.describe('Schwartz Basic Human Values assessment'),

  // SDT Needs Assessment
  needs: needsSchema.describe('Self-Determination Theory needs analysis'),

  // Dominant Motive (McClelland)
  dominantMotive: dominantMotiveSchema.describe('McClelland motivational profile'),

  // Defense Profile (Vaillant)
  defenses: defensesSchema.describe('Vaillant defense mechanism profile'),

  // Attachment Indication
  attachmentMarkers: attachmentMarkersSchema.describe('Attachment style indicators'),

  // Developmental Stage (Kegan)
  development: developmentSchema.describe('Kegan developmental stage assessment'),

  // Behavioral Patterns (observable)
  patterns: z
    .array(patternSchema)
    .describe('Observable behavioral patterns across life domains'),

  // Contradictions (stated vs actual)
  contradictions: z
    .array(contradictionSummarySchema)
    .describe('Gaps between stated values and actual behavior'),

  // The Mirror Statement - key insight referencing constructs
  mirrorStatement: z
    .string()
    .describe(
      'The key insight that references specific constructs. Example: "You value ACHIEVEMENT and SELF_DIRECTION, but your AUTONOMY is frustrated. Your primary defense is RATIONALIZATION..."'
    ),

  // Contract Focus
  contractFocus: contractFocusSchema.describe('Suggested contract elements based on profile'),
})

// =============================================================================
// Exported Types
// =============================================================================
export type SynthesizeProfileArgs = z.infer<typeof synthesizeProfileSchema>
export type Pattern = z.infer<typeof patternSchema>
export type ContradictionSummary = z.infer<typeof contradictionSummarySchema>
export type SDTNeed = z.infer<typeof sdtNeedSchema>
export type Needs = z.infer<typeof needsSchema>
export type Values = z.infer<typeof valuesSchema>
export type DominantMotive = z.infer<typeof dominantMotiveSchema>
export type Defenses = z.infer<typeof defensesSchema>
export type AttachmentMarkers = z.infer<typeof attachmentMarkersSchema>
export type Development = z.infer<typeof developmentSchema>
export type ContractFocus = z.infer<typeof contractFocusSchema>
export type SchwartzValue = z.infer<typeof schwartzValueEnum>
export type DefenseMechanism = z.infer<typeof defenseEnum>
export type LifeDomain = z.infer<typeof lifeDomainEnum>

/**
 * Factory to create synthesizeProfile tool with Convex context
 */
export function createSynthesizeProfileTool(
  saveProfile: (profile: SynthesizeProfileArgs) => Promise<string>
) {
  return tool({
    description: `Synthesize a psychometric profile using validated psychological constructs.

## When to Use
Call this tool during the SYNTHESIS phase after sufficient signals have been extracted.
Requires at least 8-10 high-confidence signals for a meaningful synthesis.

## Validated Constructs to Assess

### Schwartz Values (select top 3 with strong evidence)
The 10 basic human values: POWER, ACHIEVEMENT, HEDONISM, STIMULATION, SELF_DIRECTION,
UNIVERSALISM, BENEVOLENCE, TRADITION, CONFORMITY, SECURITY.
Look for: What they prioritize, trade-offs they make, what they sacrifice.

### SDT Needs Assessment
For each need (AUTONOMY, COMPETENCE, RELATEDNESS), assess:
- State: SATISFIED or FRUSTRATED
- Intensity: 0-1 scale
Language markers:
- Autonomy frustrated: "I had to", "They made me", "I had no choice"
- Competence frustrated: "I can't", "I don't know how", "It's too hard"
- Relatedness frustrated: "No one understands", "I'm alone in this"

### McClelland Dominant Motive
Determine primary driver: ACHIEVEMENT, POWER, or AFFILIATION.
- Achievement: Focus on goals, standards, improvement
- Power: Focus on influence, impact, status
- Affiliation: Focus on belonging, relationships, harmony

### Vaillant Defense Mechanisms
Identify primary defenses from: DENIAL, PROJECTION, DISPLACEMENT, RATIONALIZATION,
INTELLECTUALIZATION, SUBLIMATION, HUMOR, ANTICIPATION.
Assess maturity level: IMMATURE, NEUROTIC, or MATURE.

### Attachment Markers
Indicate style: SECURE, ANXIOUS, AVOIDANT, or DISORGANIZED.
Provide confidence (0-1) - be conservative, attachment is hard to assess from limited data.

### Kegan Developmental Stage
- SOCIALIZED: Defined by relationships and external expectations
- SELF_AUTHORING: Has own value system, can step back from relationships
- SELF_TRANSFORMING: Can hold multiple systems, sees self as evolving
Mark if STABLE in stage or TRANSITIONING.

### Behavioral Patterns
Observable patterns across life domains (WORK, RELATIONSHIPS, HEALTH, PERSONAL_GROWTH, FINANCE, GENERAL).
Focus on frequency: CORE (always), FREQUENT (usually), OCCASIONAL (sometimes).

### Contradictions
Gaps between stated values/goals and actual behavior - these are growth edges.

### Mirror Statement (KEY DELIVERABLE)
A 2-3 sentence insight that:
1. References specific constructs by name
2. Connects multiple observations
3. Feels uncomfortably accurate

Example: "You value ACHIEVEMENT and SELF_DIRECTION, but your AUTONOMY is frustrated by
external obligations you feel unable to refuse. Your primary defense is RATIONALIZATION -
you explain away your authentic desires to maintain your ANXIOUS attachment relationships."

## Best Practices
- Ground every construct assessment in specific evidence (quotes)
- Be conservative with confidence levels - especially for attachment
- Don't moralize or judge - observe and reflect
- The profile should feel like looking in a mirror, not a diagnosis
- Prioritize contradictions - they're the growth edges`,
    inputSchema: synthesizeProfileSchema,
    execute: async (args: SynthesizeProfileArgs) => {
      const profileId = await saveProfile(args)
      return {
        success: true,
        profileId,
        patternCount: args.patterns.length,
        contradictionCount: args.contradictions.length,
        mirrorStatement: args.mirrorStatement,
      }
    },
  })
}

/**
 * Tool name constant
 */
export const SYNTHESIZE_PROFILE_TOOL_NAME = 'synthesizeProfile'
