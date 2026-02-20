/**
 * askFollowUp Tool - NO EXECUTE
 *
 * This tool is called by Claude to ask the user a follow-up question.
 * It has NO execute function - when Claude calls this tool, we return
 * to the UI to display the question and options to the user.
 */
import { tool } from 'ai'
import { z } from 'zod'

export const askFollowUpSchema = z.object({
  question: z
    .string()
    .describe('The follow-up question to ask the user'),
  options: z
    .array(
      z.object({
        id: z.string().describe('Unique option identifier'),
        label: z.string().describe('Short option label'),
        description: z.string().optional().describe('Longer description of option'),
      })
    )
    .min(2)
    .max(6)
    .describe('2-6 possible answers for the user to choose from'),
  intent: z
    .string()
    .describe('What you are trying to uncover (e.g., root_cause_of_fear, value_conflict)'),
})

export type AskFollowUpArgs = z.infer<typeof askFollowUpSchema>

/**
 * askFollowUp tool definition
 *
 * Returns args to UI for user interaction (execute is required for type compatibility)
 */
export const askFollowUp = tool({
  description: `Ask the user a curious, direct follow-up question with structured options.
Use this to probe deeper into their choices, feelings, and trade-offs.
NOT a generic "why" question - ask about specific feelings, costs, or contradictions.
Example: "You chose safety. What did that cost you?"`,
  inputSchema: askFollowUpSchema,
  // Pass-through execute - actual handling is done by UI based on tool call
  execute: async (args: AskFollowUpArgs) => args,
})
