/**
 * Discovery Module - S3/S4 Implementation
 *
 * Exports:
 * - Phase machine (states, transitions, hard triggers)
 * - Prompt builder (hierarchical context management)
 * - Density monitor (extraction quality tracking)
 */

// Phase Machine (S3-T01)
export {
  PHASES,
  PHASE_CONFIG,
  canTransition,
  getNextPhase,
  getPhaseIndex,
  shouldForceTransition,
  getPhaseProgress,
  calculateSessionHealth,
  type Phase,
  type TransitionContext,
  type SessionHealth,
} from './phase-machine'

// Prompt Builder (S3-T02)
export {
  buildSystemPrompt,
  buildDiscoveryContext,
  summarizeSignals,
  getSlidingWindow,
  estimateTokens,
  isContextWithinLimits,
  type Signal,
  type ContextMessage,
  type DiscoveryContext,
} from './prompt-builder'

// Density Monitor (S4-T05)
export {
  DENSITY_CONFIG,
  calculateDensityStats,
  checkExtractionDensity,
  canProceedToSynthesis,
  getDensityPromptInjection,
  getExtractionReminder,
  type DensityStats,
  type DensityCheck,
} from './density-monitor'
