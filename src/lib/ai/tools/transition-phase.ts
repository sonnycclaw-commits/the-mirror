/**
 * transitionPhase Tool - WITH EXECUTE
 */
import { tool } from 'ai'
import { z } from 'zod'

export const phaseSchema = z.enum([
  'SCENARIO',
  'EXCAVATION',
  'SYNTHESIS',
  'CONTRACT',
])

export type Phase = z.infer<typeof phaseSchema>

export const transitionPhaseSchema = z.object({
  targetPhase: phaseSchema.describe('The phase to transition to'),
  reason: z
    .string()
    .describe('Why the transition is happening (for logging)'),
  signalCount: z
    .number()
    .optional()
    .describe('Number of signals extracted'),
})

export type TransitionPhaseArgs = z.infer<typeof transitionPhaseSchema>

/**
 * Result type for phase transitions
 */
export type TransitionResult = {
  success: boolean
  newPhase?: Phase
  reason?: unknown
  recommendation?: string
  pendingExtractions?: number
}

/**
 * Factory to create transitionPhase tool with Convex context
 */
export function createTransitionPhaseTool(
  updatePhase: (args: TransitionPhaseArgs) => Promise<TransitionResult | void>
) {
  return tool({
    description: `Transition to a new discovery phase.`,
    inputSchema: transitionPhaseSchema,
    execute: async (args: TransitionPhaseArgs) => {
      const result = await updatePhase(args)
      if (result) return result
      return { success: true, newPhase: args.targetPhase }
    },
  })
}
