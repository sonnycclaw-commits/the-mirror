/**
 * Tools Registry
 *
 * Central export for all discovery tools.
 * Tools are grouped by execution pattern:
 * - NO_EXECUTE: Returns to UI for user interaction
 * - EXECUTE: Runs automatically and saves to Convex
 *
 * Updated S4-T04: Added synthesizeProfile tool
 */

// Schema exports for type safety
export {
  askFollowUpSchema,
  type AskFollowUpArgs,
} from './ask-follow-up'

export {
  extractSignalSchema,
  signalDomainSchema,
  signalStateSchema,
  emotionalContextSchema,
  lifeDomainSchema,
  type ExtractSignalArgs,
  createExtractSignalTool,
  isValidTypeForDomain,
  getValidTypesForDomain,
} from './extract-signal'

export {
  transitionPhaseSchema,
  phaseSchema,
  type TransitionPhaseArgs,
  type Phase,
} from './transition-phase'

export {
  outputContractSchema,
  CONTRACT_FIELD_LIMITS,
  type OutputContractArgs,
  type ContractEvidence,
} from './output-contract'

export {
  synthesizeProfileSchema,
  type SynthesizeProfileArgs,
  type Pattern,
  type ContradictionSummary,
  type Needs,
} from './synthesize-profile'

export {
  renderUISchema,
  RENDER_UI_TOOL_NAME,
  isRenderUIResult,
  type RenderUIArgs,
} from './render-ui'

// Tool exports
export { askFollowUp } from './ask-follow-up'
// createExtractSignalTool exported above with schemas
export { createTransitionPhaseTool } from './transition-phase'
export { createOutputContractTool } from './output-contract'
export { createSynthesizeProfileTool, SYNTHESIZE_PROFILE_TOOL_NAME } from './synthesize-profile'
export { renderUI } from './render-ui'

/**
 * Tool types for the Shadow Loop
 */
export const TOOL_NAMES = {
  ASK_FOLLOW_UP: 'askFollowUp',
  EXTRACT_SIGNAL: 'extractSignal',
  TRANSITION_PHASE: 'transitionPhase',
  OUTPUT_CONTRACT: 'outputContract',
  SYNTHESIZE_PROFILE: 'synthesizeProfile',
  RENDER_UI: 'renderUI',
} as const

export type ToolName = (typeof TOOL_NAMES)[keyof typeof TOOL_NAMES]

/**
 * Pattern: NO_EXECUTE tools return control to UI
 */
export const NO_EXECUTE_TOOLS = [TOOL_NAMES.ASK_FOLLOW_UP] as const

/**
 * Pattern: EXECUTE tools run automatically
 */
export const EXECUTE_TOOLS = [
  TOOL_NAMES.EXTRACT_SIGNAL,
  TOOL_NAMES.TRANSITION_PHASE,
  TOOL_NAMES.OUTPUT_CONTRACT,
  TOOL_NAMES.SYNTHESIZE_PROFILE,
  TOOL_NAMES.RENDER_UI,
] as const
