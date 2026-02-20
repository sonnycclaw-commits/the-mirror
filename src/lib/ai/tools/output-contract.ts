/**
 * outputContract Tool - WITH EXECUTE
 *
 * S5-T01: Enhanced with max_length constraints for mobile display
 *
 * The Momentum Contract is the final artifact - a commitment document
 * that crystallizes the user's transformation intention.
 *
 * Design constraint: Each field must fit on a mobile card (~140 chars max)
 */
import { tool } from 'ai'
import { z } from 'zod'

/**
 * Max character lengths for mobile-friendly display
 */
export const CONTRACT_FIELD_LIMITS = {
  refusal: 140,      // "I refuse to..." - fits one card
  becoming: 140,     // "I am the person who..." - fits one card
  proof: 120,        // 1-Year Goal - shorter for impact
  test: 100,         // 1-Month Goal - actionable, concise
  vote: 80,          // Today's Action - immediate, specific
  rule: 100,         // Non-Negotiable - memorable constraint
  evidenceItem: 200, // Each evidence quote
} as const

export const outputContractSchema = z.object({
  refusal: z
    .string()
    .max(CONTRACT_FIELD_LIMITS.refusal)
    .describe(
      `The Anti-Vision: "I refuse to..." - A powerful rejection of who they were. ` +
      `Max ${CONTRACT_FIELD_LIMITS.refusal} chars. Must start with "I refuse to".`
    ),

  becoming: z
    .string()
    .max(CONTRACT_FIELD_LIMITS.becoming)
    .describe(
      `The Identity: "I am the person who..." - The new identity they're claiming. ` +
      `Max ${CONTRACT_FIELD_LIMITS.becoming} chars. Must start with "I am the person who".`
    ),

  proof: z
    .string()
    .max(CONTRACT_FIELD_LIMITS.proof)
    .describe(
      `1-Year Goal: What will prove this transformation worked? ` +
      `Max ${CONTRACT_FIELD_LIMITS.proof} chars. Specific, measurable.`
    ),

  test: z
    .string()
    .max(CONTRACT_FIELD_LIMITS.test)
    .describe(
      `1-Month Goal: The first milestone. ` +
      `Max ${CONTRACT_FIELD_LIMITS.test} chars. Achievable but stretching.`
    ),

  vote: z
    .string()
    .max(CONTRACT_FIELD_LIMITS.vote)
    .describe(
      `Today's Action: What they will do TODAY to vote for the new identity. ` +
      `Max ${CONTRACT_FIELD_LIMITS.vote} chars. Specific, doable in 24 hours.`
    ),

  rule: z
    .string()
    .max(CONTRACT_FIELD_LIMITS.rule)
    .describe(
      `The Non-Negotiable: A constraint they commit to never breaking. ` +
      `Max ${CONTRACT_FIELD_LIMITS.rule} chars. Clear boundary.`
    ),

  evidence: z
    .array(
      z.object({
        quote: z
          .string()
          .max(CONTRACT_FIELD_LIMITS.evidenceItem)
          .describe('Exact quote from user that supports this contract'),
        scenarioName: z
          .string()
          .optional()
          .describe('Which scenario this quote came from'),
        signalType: z
          .enum([
            'VALUE',
            'FEAR',
            'CONSTRAINT',
            'PATTERN',
            'GOAL',
            'DEFENSE_MECHANISM',
            'CONTRADICTION',
            'NEED',
          ])
          .optional()
          .describe('What type of signal this quote evidenced'),
      })
    )
    .min(3)
    .max(7)
    .describe(
      'List of user quotes that ground the contract in their own words. ' +
      'Minimum 3, maximum 7 evidence items.'
    ),

  mirrorMoment: z
    .string()
    .optional()
    .describe(
      'The moment of recognition - when the user saw themselves clearly. ' +
      'Optional but powerful for the contract narrative.'
    ),

  primaryContradiction: z
    .object({
      stated: z.string().describe('What they said they wanted'),
      actual: z.string().describe('What their behavior showed'),
    })
    .optional()
    .describe(
      'The key contradiction that this contract resolves. ' +
      'Grounds the transformation in self-awareness.'
    ),
})

export type OutputContractArgs = z.infer<typeof outputContractSchema>

/**
 * Evidence item type for easier use
 */
export type ContractEvidence = OutputContractArgs['evidence'][number]

/**
 * Factory to create outputContract tool with Convex context
 */
export function createOutputContractTool(
  saveContract: (contract: OutputContractArgs) => Promise<string>
) {
  return tool({
    description: `Generate the final Momentum Contract.

## The Momentum Contract Structure

The contract has 6 core fields, each with strict length limits for mobile display:

1. **Refusal** (${CONTRACT_FIELD_LIMITS.refusal} chars): "I refuse to..." - The anti-vision
2. **Becoming** (${CONTRACT_FIELD_LIMITS.becoming} chars): "I am the person who..." - The new identity
3. **Proof** (${CONTRACT_FIELD_LIMITS.proof} chars): 1-Year Goal - Long-term evidence
4. **Test** (${CONTRACT_FIELD_LIMITS.test} chars): 1-Month Goal - First milestone
5. **Vote** (${CONTRACT_FIELD_LIMITS.vote} chars): Today's Action - Immediate commitment
6. **Rule** (${CONTRACT_FIELD_LIMITS.rule} chars): Non-Negotiable - Hard boundary

## Required: Evidence Grounding

The contract MUST include 3-7 evidence items - actual quotes from the user's session.
This grounds the contract in their own words and makes it feel personal, not generic.

## Quality Criteria

- **Specific**: "I refuse to stay in bed past 7am" not "I refuse to be lazy"
- **Personal**: Uses their language, references their scenarios
- **Actionable**: Every field points to behavior, not just feeling
- **Grounded**: Evidence shows WHY this contract fits THEM

## When to Call

Only call this tool in the CONTRACT phase after:
- Sufficient signals extracted (10+)
- Profile synthesized
- User has had the "mirror moment"`,
    inputSchema: outputContractSchema,
    execute: async (args: OutputContractArgs) => {
      const contractId = await saveContract(args)
      return {
        success: true,
        contractId,
        summary: {
          refusalLength: args.refusal.length,
          becomingLength: args.becoming.length,
          evidenceCount: args.evidence.length,
          hasContradiction: !!args.primaryContradiction,
        },
      }
    },
  })
}

