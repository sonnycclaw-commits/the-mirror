/**
 * renderUI Tool - Structured UI Output
 *
 * This tool allows Claude to output rich, structured UI components
 * using json-render. Unlike askFollowUp (NO_EXECUTE), this tool
 * executes immediately and returns the UI tree to be rendered.
 *
 * Use cases:
 * - InsightCards showing pattern observations
 * - ProfileSections displaying values, fears, needs
 * - MirrorStatements for reflection moments
 * - ContradictionCards showing stated vs actual
 * - ContractStatements for the final contract
 */
import { tool } from 'ai'
import { z } from 'zod'
import {
  uiTreeSchema,
  COMPONENT_TYPES,
  type UITree,
} from '../../json-render'

/**
 * Schema for the renderUI tool arguments
 */
export const renderUISchema = z.object({
  components: uiTreeSchema.describe(
    `Array of UI components to render. Available types: ${COMPONENT_TYPES.join(', ')}`
  ),
  position: z
    .enum(['before', 'after', 'replace'])
    .optional()
    .default('after')
    .describe('Where to render relative to message text: before text, after text, or replace text entirely'),
})

export type RenderUIArgs = z.infer<typeof renderUISchema>

/**
 * renderUI tool definition
 *
 * This is an EXECUTE tool - it returns the UI tree for rendering.
 * The execute function validates and returns the components.
 */
export const renderUI = tool({
  description: `Render structured UI components for rich content display.
Use this tool to show:
- InsightCard: Pattern observations with evidence
- ProfileSection: Values, fears, needs, patterns
- MirrorStatement: Core reflection statements
- ContradictionCard: Stated vs actual gaps
- ContractStatement: Contract field displays
- TextMessage: Emphasized text
- ActionButton: Interactive buttons
- Divider: Visual separators

Example usage for showing an insight:
{
  "components": [{
    "type": "InsightCard",
    "title": "Pattern Detected",
    "insight": "You consistently choose safety over growth",
    "evidence": "I always take the secure option",
    "domain": "VALUE",
    "confidence": "high"
  }]
}`,
  inputSchema: renderUISchema,
  execute: async (args: RenderUIArgs) => {
    // Validation happens via Zod schema
    // Just return the validated components
    return {
      success: true,
      components: args.components,
      position: args.position,
    }
  },
})

/**
 * Tool name constant for use in result checking
 */
export const RENDER_UI_TOOL_NAME = 'renderUI'

/**
 * Type guard for renderUI result
 */
export function isRenderUIResult(
  result: unknown
): result is { success: boolean; components: UITree; position: 'before' | 'after' | 'replace' } {
  return (
    typeof result === 'object' &&
    result !== null &&
    'success' in result &&
    'components' in result &&
    Array.isArray((result as Record<string, unknown>).components)
  )
}
