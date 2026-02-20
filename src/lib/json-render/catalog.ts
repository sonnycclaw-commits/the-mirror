/**
 * JSON-Render Component Catalog
 *
 * Defines the schema for all structured UI components that the AI can render.
 * These components are used for rich content in the discovery flow.
 *
 * Component categories:
 * - Content: TextMessage, InsightCard, MirrorStatement
 * - Profile: ProfileSection, ContradictionCard
 * - Contract: ContractStatement
 * - Interactive: ActionButton
 * - Layout: Section, Divider
 */
import { z } from 'zod'

// =============================================================================
// Base Schemas
// =============================================================================

/**
 * Emphasis levels for text variants
 */
export const emphasisSchema = z.enum(['normal', 'strong', 'subtle', 'warning'])
export type Emphasis = z.infer<typeof emphasisSchema>

// =============================================================================
// Content Components
// =============================================================================

/**
 * TextMessage - Simple text with optional emphasis
 * Use for: Conversation text, observations, transitions
 */
export const textMessageSchema = z.object({
  type: z.literal('TextMessage'),
  text: z.string().describe('The message text'),
  emphasis: emphasisSchema.optional().describe('Visual emphasis level'),
})
export type TextMessageProps = z.infer<typeof textMessageSchema>

/**
 * InsightCard - Pattern observation card
 * Use for: Highlighting discovered patterns, values, behaviors
 */
export const insightCardSchema = z.object({
  type: z.literal('InsightCard'),
  title: z.string().describe('Short insight title (e.g., "Pattern Detected")'),
  insight: z.string().describe('The insight observation'),
  evidence: z.string().optional().describe('Quote or evidence supporting insight'),
  domain: z
    .enum(['VALUE', 'NEED', 'MOTIVE', 'DEFENSE', 'ATTACHMENT', 'DEVELOPMENT', 'PATTERN'])
    .optional()
    .describe('Psychological domain this insight relates to'),
  confidence: z
    .enum(['low', 'medium', 'high'])
    .optional()
    .describe('Confidence level in this insight'),
})
export type InsightCardProps = z.infer<typeof insightCardSchema>

/**
 * MirrorStatement - Core reflection statement
 * Use for: The main "mirror moment" - reflecting their patterns back
 */
export const mirrorStatementSchema = z.object({
  type: z.literal('MirrorStatement'),
  statement: z.string().describe('The mirror reflection statement'),
  evidence: z.array(z.string()).optional().describe('Supporting quotes from user'),
})
export type MirrorStatementProps = z.infer<typeof mirrorStatementSchema>

// =============================================================================
// Profile Components
// =============================================================================

/**
 * ProfileSection - Display extracted values, fears, needs, patterns
 * Use for: Showing synthesized profile data
 */
export const profileSectionSchema = z.object({
  type: z.literal('ProfileSection'),
  sectionType: z
    .enum(['values', 'fears', 'needs', 'patterns', 'defenses', 'motives'])
    .describe('Type of profile section'),
  title: z.string().describe('Section title'),
  items: z
    .array(
      z.object({
        label: z.string().describe('Item label (e.g., value name)'),
        description: z.string().optional().describe('Additional context'),
        strength: z.enum(['low', 'medium', 'high']).optional(),
      })
    )
    .describe('Items in this section'),
})
export type ProfileSectionProps = z.infer<typeof profileSectionSchema>

/**
 * ContradictionCard - Stated vs actual gaps
 * Use for: Highlighting contradictions between what user says and does
 */
export const contradictionCardSchema = z.object({
  type: z.literal('ContradictionCard'),
  stated: z.string().describe('What the user stated/believes'),
  actual: z.string().describe('What their actions/patterns reveal'),
  insight: z.string().optional().describe('What this contradiction might mean'),
})
export type ContradictionCardProps = z.infer<typeof contradictionCardSchema>

// =============================================================================
// Contract Components
// =============================================================================

/**
 * ContractStatement - Individual contract field display
 * Use for: Displaying the 6 contract fields (refusal, becoming, proof, test, vote, rule)
 */
export const contractStatementSchema = z.object({
  type: z.literal('ContractStatement'),
  field: z
    .enum(['refusal', 'becoming', 'proof', 'test', 'vote', 'rule'])
    .describe('Which contract field this is'),
  label: z.string().describe('Human-readable field label'),
  content: z.string().describe('The contract statement content'),
})
export type ContractStatementProps = z.infer<typeof contractStatementSchema>

// =============================================================================
// Interactive Components
// =============================================================================

/**
 * ActionButton - Clickable action button
 * Use for: Providing user actions (continue, skip, confirm)
 */
export const actionButtonSchema = z.object({
  type: z.literal('ActionButton'),
  label: z.string().describe('Button label'),
  action: z.string().describe('Action identifier for handler'),
  variant: z
    .enum(['primary', 'secondary', 'ghost'])
    .optional()
    .describe('Button visual variant'),
  disabled: z.boolean().optional().describe('Whether button is disabled'),
})
export type ActionButtonProps = z.infer<typeof actionButtonSchema>

// =============================================================================
// Layout Components
// =============================================================================

/**
 * Divider - Visual separator
 * Use for: Separating content sections
 */
export const dividerSchema = z.object({
  type: z.literal('Divider'),
  spacing: z.enum(['small', 'medium', 'large']).optional().describe('Vertical spacing'),
})
export type DividerProps = z.infer<typeof dividerSchema>

// =============================================================================
// Combined Schema (non-recursive for simplicity)
// =============================================================================

/**
 * Leaf component schema (no nesting)
 */
export const leafComponentSchema = z.discriminatedUnion('type', [
  textMessageSchema,
  insightCardSchema,
  mirrorStatementSchema,
  profileSectionSchema,
  contradictionCardSchema,
  contractStatementSchema,
  actionButtonSchema,
  dividerSchema,
])

/**
 * Type for leaf UI components (no nesting)
 */
export type LeafComponent =
  | TextMessageProps
  | InsightCardProps
  | MirrorStatementProps
  | ProfileSectionProps
  | ContradictionCardProps
  | ContractStatementProps
  | ActionButtonProps
  | DividerProps

/**
 * UI Tree schema - array of leaf components
 */
export const uiTreeSchema = z.array(leafComponentSchema).describe('Array of UI components to render')
export type UITree = z.infer<typeof uiTreeSchema>

/**
 * Component type names for documentation
 */
export const COMPONENT_TYPES = [
  'TextMessage',
  'InsightCard',
  'MirrorStatement',
  'ProfileSection',
  'ContradictionCard',
  'ContractStatement',
  'ActionButton',
  'Divider',
] as const

export type ComponentType = (typeof COMPONENT_TYPES)[number]

// Legacy exports for compatibility
export type UIComponent = LeafComponent
export const componentSchema = leafComponentSchema
