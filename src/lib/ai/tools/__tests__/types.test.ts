/**
 * Tests for Validated Signal Schema (DECISION-001)
 *
 * Tests verify:
 * 1. All 7 signal domains are defined
 * 2. Each domain has correct construct types
 * 3. State fields for NEED and DEVELOPMENT domains
 * 4. Supporting enums (EmotionalContext, LifeDomain)
 * 5. Signal interface matches expected structure
 */
import { describe, it, expect } from 'vitest'
import {
  // Domains
  SIGNAL_DOMAINS,
  type SignalDomain,

  // Constructs per domain
  SCHWARTZ_VALUES,
  type SchwartzValue,
  SDT_NEEDS,
  type SDTNeed,
  MCCLELLAND_MOTIVES,
  type McClellandMotive,
  VAILLANT_DEFENSES,
  type VaillantDefense,
  BOWLBY_ATTACHMENTS,
  type BowlbyAttachment,
  KEGAN_STAGES,
  type KeganStage,

  // State enums
  NEED_STATES,
  type NeedState,
  DEVELOPMENT_STATES,
  type DevelopmentState,

  // Supporting enums
  EMOTIONAL_CONTEXTS,
  type EmotionalContext,
  LIFE_DOMAINS,
  type LifeDomain,

  // Signal interface
  type Signal,
} from '../types'

describe('Signal Schema - DECISION-001', () => {
  describe('Signal Domains', () => {
    it('should have exactly 7 domains', () => {
      expect(SIGNAL_DOMAINS).toHaveLength(7)
    })

    it('should include all required domains', () => {
      const expectedDomains: SignalDomain[] = [
        'VALUE',
        'NEED',
        'MOTIVE',
        'DEFENSE',
        'ATTACHMENT',
        'DEVELOPMENT',
        'PATTERN',
      ]

      expectedDomains.forEach(domain => {
        expect(SIGNAL_DOMAINS).toContain(domain)
      })
    })
  })

  describe('VALUE domain (Schwartz)', () => {
    it('should have all 10 Schwartz values', () => {
      expect(SCHWARTZ_VALUES).toHaveLength(10)
    })

    it('should include all Schwartz value types', () => {
      const expectedValues: SchwartzValue[] = [
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

      expectedValues.forEach(value => {
        expect(SCHWARTZ_VALUES).toContain(value)
      })
    })
  })

  describe('NEED domain (SDT)', () => {
    it('should have all 3 SDT needs', () => {
      expect(SDT_NEEDS).toHaveLength(3)
    })

    it('should include autonomy, competence, relatedness', () => {
      const expectedNeeds: SDTNeed[] = ['AUTONOMY', 'COMPETENCE', 'RELATEDNESS']

      expectedNeeds.forEach(need => {
        expect(SDT_NEEDS).toContain(need)
      })
    })

    it('should have SATISFIED and FRUSTRATED states', () => {
      const expectedStates: NeedState[] = ['SATISFIED', 'FRUSTRATED']

      expectedStates.forEach(state => {
        expect(NEED_STATES).toContain(state)
      })
    })
  })

  describe('MOTIVE domain (McClelland)', () => {
    it('should have all 3 McClelland motives', () => {
      expect(MCCLELLAND_MOTIVES).toHaveLength(3)
    })

    it('should include achievement, power, affiliation', () => {
      const expectedMotives: McClellandMotive[] = [
        'ACHIEVEMENT',
        'POWER',
        'AFFILIATION',
      ]

      expectedMotives.forEach(motive => {
        expect(MCCLELLAND_MOTIVES).toContain(motive)
      })
    })
  })

  describe('DEFENSE domain (Vaillant)', () => {
    it('should have all 8 Vaillant defense mechanisms', () => {
      expect(VAILLANT_DEFENSES).toHaveLength(8)
    })

    it('should include all defense mechanism types', () => {
      const expectedDefenses: VaillantDefense[] = [
        'DENIAL',
        'PROJECTION',
        'DISPLACEMENT',
        'RATIONALIZATION',
        'INTELLECTUALIZATION',
        'SUBLIMATION',
        'HUMOR',
        'ANTICIPATION',
      ]

      expectedDefenses.forEach(defense => {
        expect(VAILLANT_DEFENSES).toContain(defense)
      })
    })
  })

  describe('ATTACHMENT domain (Bowlby)', () => {
    it('should have all 4 Bowlby attachment styles', () => {
      expect(BOWLBY_ATTACHMENTS).toHaveLength(4)
    })

    it('should include all attachment styles', () => {
      const expectedAttachments: BowlbyAttachment[] = [
        'SECURE',
        'ANXIOUS',
        'AVOIDANT',
        'DISORGANIZED',
      ]

      expectedAttachments.forEach(attachment => {
        expect(BOWLBY_ATTACHMENTS).toContain(attachment)
      })
    })
  })

  describe('DEVELOPMENT domain (Kegan)', () => {
    it('should have all 3 Kegan stages', () => {
      expect(KEGAN_STAGES).toHaveLength(3)
    })

    it('should include socialized, self-authoring, self-transforming', () => {
      const expectedStages: KeganStage[] = [
        'SOCIALIZED',
        'SELF_AUTHORING',
        'SELF_TRANSFORMING',
      ]

      expectedStages.forEach(stage => {
        expect(KEGAN_STAGES).toContain(stage)
      })
    })

    it('should have STABLE and TRANSITIONING states', () => {
      const expectedStates: DevelopmentState[] = ['STABLE', 'TRANSITIONING']

      expectedStates.forEach(state => {
        expect(DEVELOPMENT_STATES).toContain(state)
      })
    })
  })

  describe('Supporting Enums', () => {
    it('should have all emotional context values', () => {
      const expectedContexts: EmotionalContext[] = [
        'NEUTRAL',
        'DEFENSIVE',
        'VULNERABLE',
        'RESISTANT',
        'OPEN',
        'CONFLICTED',
      ]

      expect(EMOTIONAL_CONTEXTS).toHaveLength(6)
      expectedContexts.forEach(context => {
        expect(EMOTIONAL_CONTEXTS).toContain(context)
      })
    })

    it('should have all life domain values', () => {
      const expectedDomains: LifeDomain[] = [
        'WORK',
        'RELATIONSHIPS',
        'HEALTH',
        'PERSONAL_GROWTH',
        'FINANCE',
        'GENERAL',
      ]

      expect(LIFE_DOMAINS).toHaveLength(6)
      expectedDomains.forEach(domain => {
        expect(LIFE_DOMAINS).toContain(domain)
      })
    })
  })

  describe('Signal Interface', () => {
    it('should allow creating a VALUE signal', () => {
      const signal: Signal = {
        domain: 'VALUE',
        type: 'ACHIEVEMENT',
        content: 'Values professional success and recognition',
        source: 'I need to be the best at what I do',
        confidence: 0.85,
      }

      expect(signal.domain).toBe('VALUE')
      expect(signal.type).toBe('ACHIEVEMENT')
    })

    it('should allow creating a NEED signal with state', () => {
      const signal: Signal = {
        domain: 'NEED',
        type: 'AUTONOMY',
        state: 'FRUSTRATED',
        content: 'Feels constrained by external expectations',
        source: 'I had to do what they wanted',
        confidence: 0.9,
      }

      expect(signal.domain).toBe('NEED')
      expect(signal.state).toBe('FRUSTRATED')
    })

    it('should allow creating a DEVELOPMENT signal with state', () => {
      const signal: Signal = {
        domain: 'DEVELOPMENT',
        type: 'SELF_AUTHORING',
        state: 'TRANSITIONING',
        content: 'Moving from socialized to self-authoring',
        source: 'I am starting to question what I was taught',
        confidence: 0.7,
      }

      expect(signal.domain).toBe('DEVELOPMENT')
      expect(signal.state).toBe('TRANSITIONING')
    })

    it('should allow creating a PATTERN signal with free text type', () => {
      const signal: Signal = {
        domain: 'PATTERN',
        type: 'Procrastinates on emotionally difficult tasks',
        content: 'Delays confrontation until crisis point',
        source: 'I just kept putting it off',
        confidence: 0.8,
      }

      expect(signal.domain).toBe('PATTERN')
      expect(typeof signal.type).toBe('string')
    })

    it('should allow optional fields', () => {
      const signal: Signal = {
        domain: 'DEFENSE',
        type: 'RATIONALIZATION',
        content: 'Justifies avoidance with logical reasons',
        source: 'It made sense to wait',
        confidence: 0.75,
        emotionalContext: 'DEFENSIVE',
        lifeDomain: 'WORK',
        scenarioId: 'scenario-123',
        relatedSignalIds: ['signal-456'],
      }

      expect(signal.emotionalContext).toBe('DEFENSIVE')
      expect(signal.lifeDomain).toBe('WORK')
      expect(signal.scenarioId).toBe('scenario-123')
      expect(signal.relatedSignalIds).toContain('signal-456')
    })
  })
})
