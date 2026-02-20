/**
 * Tests for synthesizeProfile tool schema (DECISION-001)
 *
 * Tests the PsychometricProfile schema with validated psychological constructs:
 * - Schwartz Values (10 basic values)
 * - SDT Needs (autonomy, competence, relatedness)
 * - McClelland Motives (achievement, power, affiliation)
 * - Vaillant Defense Mechanisms
 * - Attachment Markers
 * - Kegan Developmental Stages
 */
import { describe, it, expect } from 'vitest'
import { synthesizeProfileSchema } from './synthesize-profile'

describe('synthesizeProfileSchema', () => {
  describe('Schwartz Values', () => {
    it('should accept valid primary values', () => {
      const validProfile = createValidProfile({
        values: {
          primary: ['ACHIEVEMENT', 'SELF_DIRECTION', 'POWER'],
        },
      })
      const result = synthesizeProfileSchema.safeParse(validProfile)
      expect(result.success).toBe(true)
    })

    it('should accept secondary values as optional', () => {
      const validProfile = createValidProfile({
        values: {
          primary: ['ACHIEVEMENT'],
          secondary: ['HEDONISM', 'STIMULATION'],
        },
      })
      const result = synthesizeProfileSchema.safeParse(validProfile)
      expect(result.success).toBe(true)
    })

    it('should reject invalid value types', () => {
      const invalidProfile = createValidProfile({
        values: {
          primary: ['INVALID_VALUE'],
        },
      })
      const result = synthesizeProfileSchema.safeParse(invalidProfile)
      expect(result.success).toBe(false)
    })

    it('should accept all 10 Schwartz values', () => {
      const allValues = [
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
      ]
      for (const value of allValues) {
        const profile = createValidProfile({
          values: { primary: [value as any] },
        })
        const result = synthesizeProfileSchema.safeParse(profile)
        expect(result.success, `Value ${value} should be valid`).toBe(true)
      }
    })
  })

  describe('SDT Needs Assessment', () => {
    it('should accept valid needs with state and intensity', () => {
      const validProfile = createValidProfile({
        needs: {
          autonomy: { state: 'FRUSTRATED', intensity: 0.8, evidence: 'Felt controlled' },
          competence: { state: 'SATISFIED', intensity: 0.6 },
          relatedness: { state: 'FRUSTRATED', intensity: 0.4 },
        },
      })
      const result = synthesizeProfileSchema.safeParse(validProfile)
      expect(result.success).toBe(true)
    })

    it('should reject invalid state values', () => {
      const invalidProfile = createValidProfile({
        needs: {
          autonomy: { state: 'INVALID', intensity: 0.5 },
          competence: { state: 'SATISFIED', intensity: 0.5 },
          relatedness: { state: 'SATISFIED', intensity: 0.5 },
        },
      })
      const result = synthesizeProfileSchema.safeParse(invalidProfile)
      expect(result.success).toBe(false)
    })

    it('should reject intensity outside 0-1 range', () => {
      const invalidProfile = createValidProfile({
        needs: {
          autonomy: { state: 'FRUSTRATED', intensity: 1.5 },
          competence: { state: 'SATISFIED', intensity: 0.5 },
          relatedness: { state: 'SATISFIED', intensity: 0.5 },
        },
      })
      const result = synthesizeProfileSchema.safeParse(invalidProfile)
      expect(result.success).toBe(false)
    })
  })

  describe('McClelland Dominant Motive', () => {
    it('should accept valid motive types', () => {
      const validTypes = ['ACHIEVEMENT', 'POWER', 'AFFILIATION']
      for (const type of validTypes) {
        const profile = createValidProfile({
          dominantMotive: {
            type: type as any,
            evidence: ['Evidence 1', 'Evidence 2'],
          },
        })
        const result = synthesizeProfileSchema.safeParse(profile)
        expect(result.success, `Motive ${type} should be valid`).toBe(true)
      }
    })

    it('should require evidence array', () => {
      const invalidProfile = createValidProfile({
        dominantMotive: {
          type: 'ACHIEVEMENT',
          // missing evidence
        },
      })
      const result = synthesizeProfileSchema.safeParse(invalidProfile)
      expect(result.success).toBe(false)
    })
  })

  describe('Vaillant Defense Mechanisms', () => {
    it('should accept valid defense mechanisms', () => {
      const validDefenses = [
        'DENIAL',
        'PROJECTION',
        'DISPLACEMENT',
        'RATIONALIZATION',
        'INTELLECTUALIZATION',
        'SUBLIMATION',
        'HUMOR',
        'ANTICIPATION',
      ]
      const profile = createValidProfile({
        defenses: {
          primary: validDefenses.slice(0, 3) as any,
          maturityLevel: 'NEUROTIC',
        },
      })
      const result = synthesizeProfileSchema.safeParse(profile)
      expect(result.success).toBe(true)
    })

    it('should accept all maturity levels', () => {
      const levels = ['IMMATURE', 'NEUROTIC', 'MATURE']
      for (const level of levels) {
        const profile = createValidProfile({
          defenses: {
            primary: ['DENIAL'],
            maturityLevel: level as any,
          },
        })
        const result = synthesizeProfileSchema.safeParse(profile)
        expect(result.success, `Maturity level ${level} should be valid`).toBe(true)
      }
    })
  })

  describe('Attachment Markers', () => {
    it('should accept valid attachment styles', () => {
      const styles = ['SECURE', 'ANXIOUS', 'AVOIDANT', 'DISORGANIZED']
      for (const style of styles) {
        const profile = createValidProfile({
          attachmentMarkers: {
            style: style as any,
            confidence: 0.7,
            evidence: ['Pattern observed'],
          },
        })
        const result = synthesizeProfileSchema.safeParse(profile)
        expect(result.success, `Attachment style ${style} should be valid`).toBe(true)
      }
    })

    it('should reject confidence outside 0-1 range', () => {
      const invalidProfile = createValidProfile({
        attachmentMarkers: {
          style: 'SECURE',
          confidence: 1.2,
          evidence: [],
        },
      })
      const result = synthesizeProfileSchema.safeParse(invalidProfile)
      expect(result.success).toBe(false)
    })
  })

  describe('Kegan Developmental Stages', () => {
    it('should accept valid developmental stages', () => {
      const stages = ['SOCIALIZED', 'SELF_AUTHORING', 'SELF_TRANSFORMING']
      for (const stage of stages) {
        const profile = createValidProfile({
          development: {
            stage: stage as any,
            state: 'STABLE',
            evidence: ['Observation'],
          },
        })
        const result = synthesizeProfileSchema.safeParse(profile)
        expect(result.success, `Stage ${stage} should be valid`).toBe(true)
      }
    })

    it('should accept transitioning state', () => {
      const profile = createValidProfile({
        development: {
          stage: 'SOCIALIZED',
          state: 'TRANSITIONING',
          evidence: ['Shows signs of transition'],
        },
      })
      const result = synthesizeProfileSchema.safeParse(profile)
      expect(result.success).toBe(true)
    })
  })

  describe('Patterns (behavioral observations)', () => {
    it('should accept patterns with lifeDomain', () => {
      const profile = createValidProfile({
        patterns: [
          {
            name: 'Conflict Avoidance',
            description: 'Avoids confrontation',
            evidence: ['Quote 1', 'Quote 2'],
            frequency: 'CORE',
            lifeDomain: 'RELATIONSHIPS',
          },
        ],
      })
      const result = synthesizeProfileSchema.safeParse(profile)
      expect(result.success).toBe(true)
    })

    it('should accept all life domains', () => {
      const domains = ['WORK', 'RELATIONSHIPS', 'HEALTH', 'PERSONAL_GROWTH', 'FINANCE', 'GENERAL']
      for (const domain of domains) {
        const profile = createValidProfile({
          patterns: [
            {
              name: 'Test Pattern',
              description: 'Test',
              evidence: ['Evidence'],
              frequency: 'OCCASIONAL',
              lifeDomain: domain as any,
            },
          ],
        })
        const result = synthesizeProfileSchema.safeParse(profile)
        expect(result.success, `Domain ${domain} should be valid`).toBe(true)
      }
    })
  })

  describe('Contradictions', () => {
    it('should accept contradictions with optional rootCause', () => {
      const profile = createValidProfile({
        contradictions: [
          {
            stated: 'I value health',
            actual: 'Never exercises',
            impact: 'Health declining',
            rootCause: 'Fear of failure',
          },
        ],
      })
      const result = synthesizeProfileSchema.safeParse(profile)
      expect(result.success).toBe(true)
    })

    it('should accept contradictions without rootCause', () => {
      const profile = createValidProfile({
        contradictions: [
          {
            stated: 'I value health',
            actual: 'Never exercises',
            impact: 'Health declining',
          },
        ],
      })
      const result = synthesizeProfileSchema.safeParse(profile)
      expect(result.success).toBe(true)
    })
  })

  describe('Mirror Statement', () => {
    it('should require mirrorStatement', () => {
      const profile = createValidProfile()
      delete (profile as any).mirrorStatement
      const result = synthesizeProfileSchema.safeParse(profile)
      expect(result.success).toBe(false)
    })

    it('should accept construct-referencing mirror statements', () => {
      const profile = createValidProfile({
        mirrorStatement:
          'You value ACHIEVEMENT and SELF_DIRECTION, but your AUTONOMY is frustrated. Your primary defense is RATIONALIZATION.',
      })
      const result = synthesizeProfileSchema.safeParse(profile)
      expect(result.success).toBe(true)
    })
  })

  describe('Contract Focus', () => {
    it('should require all contract focus fields', () => {
      const profile = createValidProfile({
        contractFocus: {
          suggestedRefusal: 'I refuse to avoid conflict',
          suggestedBecoming: 'I am the person who speaks up',
          rationale: 'Pattern of avoidance observed',
        },
      })
      const result = synthesizeProfileSchema.safeParse(profile)
      expect(result.success).toBe(true)
    })
  })

  describe('Full profile validation', () => {
    it('should accept a complete valid profile', () => {
      const completeProfile = createValidProfile()
      const result = synthesizeProfileSchema.safeParse(completeProfile)
      expect(result.success).toBe(true)
    })
  })
})

/**
 * Helper to create a valid profile with optional overrides
 */
function createValidProfile(overrides: Record<string, any> = {}): Record<string, any> {
  const baseProfile = {
    values: {
      primary: ['ACHIEVEMENT', 'SELF_DIRECTION', 'POWER'],
      secondary: ['HEDONISM'],
    },
    needs: {
      autonomy: { state: 'FRUSTRATED', intensity: 0.7, evidence: 'Felt controlled at work' },
      competence: { state: 'SATISFIED', intensity: 0.6 },
      relatedness: { state: 'SATISFIED', intensity: 0.8, evidence: 'Strong relationships' },
    },
    dominantMotive: {
      type: 'ACHIEVEMENT',
      evidence: ['Goal-oriented language', 'Competition references'],
    },
    defenses: {
      primary: ['RATIONALIZATION', 'INTELLECTUALIZATION'],
      maturityLevel: 'NEUROTIC',
    },
    attachmentMarkers: {
      style: 'ANXIOUS',
      confidence: 0.65,
      evidence: ['Fear of abandonment patterns'],
    },
    development: {
      stage: 'SELF_AUTHORING',
      state: 'STABLE',
      evidence: ['Takes ownership of decisions'],
    },
    patterns: [
      {
        name: 'Conflict Avoidance',
        description: 'Consistently avoids confrontation',
        evidence: ['Quote about avoiding arguments'],
        frequency: 'CORE',
        lifeDomain: 'RELATIONSHIPS',
      },
    ],
    contradictions: [
      {
        stated: 'I value authenticity',
        actual: 'Hides true feelings',
        impact: 'Relationships feel shallow',
        rootCause: 'Fear of rejection',
      },
    ],
    mirrorStatement:
      'You value ACHIEVEMENT and SELF_DIRECTION, but your AUTONOMY is frustrated. Your primary defense is RATIONALIZATION, which helps you avoid the discomfort of your ANXIOUS attachment style.',
    contractFocus: {
      suggestedRefusal: 'I refuse to rationalize away my needs',
      suggestedBecoming: 'I am the person who acknowledges and acts on my authentic desires',
      rationale: 'Based on frustrated autonomy and rationalization defense pattern',
    },
  }

  // Deep merge overrides
  return deepMerge(baseProfile, overrides)
}

function deepMerge(target: Record<string, any>, source: Record<string, any>): Record<string, any> {
  const result = { ...target }
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      result[key] = deepMerge(target[key], source[key])
    } else {
      result[key] = source[key]
    }
  }
  return result
}
