/**
 * Profile mutations - S4-T04 (DECISION-001 Enhanced)
 *
 * Manages synthesized psychological profiles with validated constructs:
 * - Schwartz Values
 * - SDT Needs (Self-Determination Theory)
 * - McClelland's Dominant Motives
 * - Vaillant's Defense Hierarchy
 * - Attachment Theory Markers
 * - Kegan's Developmental Stages
 */
import { query, internalMutation } from './_generated/server'
import { v } from 'convex/values'
import { getAuthenticatedUserId } from './lib/auth'

// Pattern validator (unchanged)
const patternValidator = v.object({
  name: v.string(),
  description: v.string(),
  evidence: v.array(v.string()),
  frequency: v.union(
    v.literal('CORE'),
    v.literal('FREQUENT'),
    v.literal('OCCASIONAL')
  ),
  domain: v.optional(
    v.union(
      v.literal('WORK'),
      v.literal('RELATIONSHIPS'),
      v.literal('HEALTH'),
      v.literal('PERSONAL_GROWTH'),
      v.literal('GENERAL')
    )
  ),
})

// Contradiction validator (unchanged)
const contradictionValidator = v.object({
  stated: v.string(),
  actual: v.string(),
  impact: v.string(),
  rootCause: v.optional(v.string()),
})

// Legacy needs validator (for backward compatibility)
const legacyNeedsValidator = v.optional(
  v.object({
    autonomy: v.object({
      frustrated: v.boolean(),
      evidence: v.optional(v.string()),
      recommendation: v.optional(v.string()),
    }),
    competence: v.object({
      frustrated: v.boolean(),
      evidence: v.optional(v.string()),
      recommendation: v.optional(v.string()),
    }),
    relatedness: v.object({
      frustrated: v.boolean(),
      evidence: v.optional(v.string()),
      recommendation: v.optional(v.string()),
    }),
  })
)

// NEW: Schwartz Values validator
const valuesValidator = v.object({
  primary: v.array(v.string()), // Top 3 Schwartz values
  secondary: v.optional(v.array(v.string())),
})

// NEW: SDT Needs validator (enhanced from legacy)
const needsValidator = v.object({
  autonomy: v.object({
    state: v.union(v.literal('SATISFIED'), v.literal('FRUSTRATED')),
    intensity: v.number(), // 0.0 - 1.0
    evidence: v.optional(v.string()),
  }),
  competence: v.object({
    state: v.union(v.literal('SATISFIED'), v.literal('FRUSTRATED')),
    intensity: v.number(),
    evidence: v.optional(v.string()),
  }),
  relatedness: v.object({
    state: v.union(v.literal('SATISFIED'), v.literal('FRUSTRATED')),
    intensity: v.number(),
    evidence: v.optional(v.string()),
  }),
})

// NEW: McClelland's Dominant Motive validator
const dominantMotiveValidator = v.object({
  type: v.union(
    v.literal('ACHIEVEMENT'),
    v.literal('POWER'),
    v.literal('AFFILIATION')
  ),
  evidence: v.array(v.string()),
})

// NEW: Vaillant's Defense Hierarchy validator
const defensesValidator = v.object({
  primary: v.array(v.string()), // Defense mechanism names
  maturityLevel: v.union(
    v.literal('IMMATURE'),
    v.literal('NEUROTIC'),
    v.literal('MATURE')
  ),
})

// NEW: Attachment Theory Markers validator
const attachmentMarkersValidator = v.object({
  style: v.union(
    v.literal('SECURE'),
    v.literal('ANXIOUS'),
    v.literal('AVOIDANT'),
    v.literal('DISORGANIZED')
  ),
  confidence: v.number(), // 0.0 - 1.0
  evidence: v.array(v.string()),
})

// NEW: Kegan's Developmental Stages validator
const developmentValidator = v.object({
  stage: v.union(
    v.literal('SOCIALIZED'),
    v.literal('SELF_AUTHORING'),
    v.literal('SELF_TRANSFORMING')
  ),
  state: v.union(v.literal('STABLE'), v.literal('TRANSITIONING')),
  evidence: v.array(v.string()),
})

// Contract focus validator (unchanged)
const contractFocusValidator = v.object({
  suggestedRefusal: v.string(),
  suggestedBecoming: v.string(),
  rationale: v.string(),
})

/**
 * Save a synthesized profile (DECISION-001 enhanced)
 *
 * Accepts the full psychometric profile structure with validated constructs.
 */
export const save = internalMutation({
  args: {
    sessionId: v.id('sessions'),
    // New validated construct fields
    values: valuesValidator,
    needs: needsValidator,
    dominantMotive: dominantMotiveValidator,
    defenses: defensesValidator,
    attachmentMarkers: attachmentMarkersValidator,
    development: developmentValidator,
    // Existing pattern fields
    corePatterns: v.array(patternValidator),
    antiPatterns: v.array(patternValidator),
    contradictions: v.array(contradictionValidator),
    // Legacy fields (optional for backward compatibility)
    primaryFears: v.optional(v.array(v.string())),
    coreValues: v.optional(v.array(v.string())),
    needsAssessment: legacyNeedsValidator,
    // Core output fields
    mirrorStatement: v.string(),
    contractFocus: contractFocusValidator,
  },
  returns: v.id('profiles'),
  handler: async (ctx, args) => {
    return await ctx.db.insert('profiles', {
      ...args,
      createdAt: Date.now(),
    })
  },
})

/**
 * Save a profile with legacy format (backward compatible)
 *
 * Converts legacy format to new structure with sensible defaults.
 */
export const saveLegacy = internalMutation({
  args: {
    sessionId: v.id('sessions'),
    corePatterns: v.array(patternValidator),
    antiPatterns: v.array(patternValidator),
    contradictions: v.array(contradictionValidator),
    primaryFears: v.array(v.string()),
    coreValues: v.array(v.string()),
    needsAssessment: v.object({
      autonomy: v.object({
        frustrated: v.boolean(),
        evidence: v.optional(v.string()),
        recommendation: v.optional(v.string()),
      }),
      competence: v.object({
        frustrated: v.boolean(),
        evidence: v.optional(v.string()),
        recommendation: v.optional(v.string()),
      }),
      relatedness: v.object({
        frustrated: v.boolean(),
        evidence: v.optional(v.string()),
        recommendation: v.optional(v.string()),
      }),
    }),
    mirrorStatement: v.string(),
    contractFocus: contractFocusValidator,
  },
  returns: v.id('profiles'),
  handler: async (ctx, args) => {
    // Convert legacy needsAssessment to new needs format
    // Handle optional evidence fields explicitly for exactOptionalPropertyTypes
    const autonomyEvidence = args.needsAssessment.autonomy.evidence
    const competenceEvidence = args.needsAssessment.competence.evidence
    const relatednessEvidence = args.needsAssessment.relatedness.evidence

    const needs = {
      autonomy: {
        state: args.needsAssessment.autonomy.frustrated
          ? ('FRUSTRATED' as const)
          : ('SATISFIED' as const),
        intensity: args.needsAssessment.autonomy.frustrated ? 0.7 : 0.3,
        ...(autonomyEvidence !== undefined && { evidence: autonomyEvidence }),
      },
      competence: {
        state: args.needsAssessment.competence.frustrated
          ? ('FRUSTRATED' as const)
          : ('SATISFIED' as const),
        intensity: args.needsAssessment.competence.frustrated ? 0.7 : 0.3,
        ...(competenceEvidence !== undefined && { evidence: competenceEvidence }),
      },
      relatedness: {
        state: args.needsAssessment.relatedness.frustrated
          ? ('FRUSTRATED' as const)
          : ('SATISFIED' as const),
        intensity: args.needsAssessment.relatedness.frustrated ? 0.7 : 0.3,
        ...(relatednessEvidence !== undefined && { evidence: relatednessEvidence }),
      },
    }

    // Create default values from coreValues
    const values = {
      primary: args.coreValues.slice(0, 3),
      secondary: args.coreValues.slice(3),
    }

    // Create default constructs
    const dominantMotive = {
      type: 'ACHIEVEMENT' as const,
      evidence: ['Inferred from legacy profile - needs validation'],
    }

    const defenses = {
      primary: ['Unknown'],
      maturityLevel: 'NEUROTIC' as const,
    }

    const attachmentMarkers = {
      style: 'SECURE' as const,
      confidence: 0.3,
      evidence: ['Inferred from legacy profile - needs validation'],
    }

    const development = {
      stage: 'SELF_AUTHORING' as const,
      state: 'STABLE' as const,
      evidence: ['Inferred from legacy profile - needs validation'],
    }

    return await ctx.db.insert('profiles', {
      sessionId: args.sessionId,
      values,
      needs,
      dominantMotive,
      defenses,
      attachmentMarkers,
      development,
      corePatterns: args.corePatterns,
      antiPatterns: args.antiPatterns,
      contradictions: args.contradictions,
      primaryFears: args.primaryFears,
      coreValues: args.coreValues,
      needsAssessment: args.needsAssessment,
      mirrorStatement: args.mirrorStatement,
      contractFocus: args.contractFocus,
      createdAt: Date.now(),
    })
  },
})

/**
 * Get profile for session
 *
 * Security: Verifies authenticated user owns the session
 */
export const getBySession = query({
  args: {
    sessionId: v.id('sessions'),
  },
  handler: async (ctx, { sessionId }) => {
    const userId = await getAuthenticatedUserId(ctx)
    const session = await ctx.db.get(sessionId)

    if (!session || session.userId !== userId) {
      throw new Error('Session not found or access denied')
    }

    return await ctx.db
      .query('profiles')
      .withIndex('by_session', (q) => q.eq('sessionId', sessionId))
      .first()
  },
})

/**
 * Get profile for session (internal)
 */
export const getBySessionInternal = query({
  args: {
    sessionId: v.id('sessions'),
  },
  handler: async (ctx, { sessionId }) => {
    return await ctx.db
      .query('profiles')
      .withIndex('by_session', (q) => q.eq('sessionId', sessionId))
      .first()
  },
})

/**
 * Update specific profile fields
 */
export const update = internalMutation({
  args: {
    profileId: v.id('profiles'),
    // All fields optional for partial updates
    values: v.optional(valuesValidator),
    needs: v.optional(needsValidator),
    dominantMotive: v.optional(dominantMotiveValidator),
    defenses: v.optional(defensesValidator),
    attachmentMarkers: v.optional(attachmentMarkersValidator),
    development: v.optional(developmentValidator),
    corePatterns: v.optional(v.array(patternValidator)),
    antiPatterns: v.optional(v.array(patternValidator)),
    contradictions: v.optional(v.array(contradictionValidator)),
    mirrorStatement: v.optional(v.string()),
    contractFocus: v.optional(contractFocusValidator),
  },
  returns: v.null(),
  handler: async (ctx, { profileId, ...updates }) => {
    // Filter out undefined values
    const definedUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    )

    if (Object.keys(definedUpdates).length > 0) {
      await ctx.db.patch(profileId, definedUpdates)
    }
  },
})
