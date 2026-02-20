/**
 * Tests for prompt-builder.ts - DECISION-001
 * Validated Construct Detection Guidance
 */
import { describe, it, expect } from 'vitest'
import {
  summarizeSignals,
  buildSystemPrompt,
  type Signal,
} from '../prompt-builder'

describe('Signal interface', () => {
  it('should support domain field for grouping', () => {
    const signal: Signal = {
      domain: 'VALUE',
      type: 'POWER',
      content: 'User wants control over decisions',
      source: 'I want to be in charge',
      confidence: 0.8,
    }
    expect(signal.domain).toBe('VALUE')
  })

  it('should support state field for NEED and DEVELOPMENT domains', () => {
    const needSignal: Signal = {
      domain: 'NEED',
      type: 'AUTONOMY',
      state: 'FRUSTRATED',
      content: 'User feels lack of autonomy',
      source: 'I had to do it',
      confidence: 0.85,
    }
    expect(needSignal.state).toBe('FRUSTRATED')
    expect(needSignal.domain).toBe('NEED')
  })

  it('should support optional lifeDomain field', () => {
    const signal: Signal = {
      domain: 'VALUE',
      type: 'ACHIEVEMENT',
      content: 'Career focus',
      source: 'I want to succeed at work',
      confidence: 0.9,
      lifeDomain: 'work',
    }
    expect(signal.lifeDomain).toBe('work')
  })
})

describe('summarizeSignals', () => {
  it('should return message for empty signals', () => {
    const result = summarizeSignals([])
    expect(result).toBe('No signals extracted yet.')
  })

  it('should group signals by domain', () => {
    const signals: Signal[] = [
      {
        domain: 'VALUE',
        type: 'POWER',
        content: 'Wants control',
        source: 'I want to be in charge',
        confidence: 0.8,
      },
      {
        domain: 'VALUE',
        type: 'ACHIEVEMENT',
        content: 'Wants success',
        source: 'I want to succeed',
        confidence: 0.9,
      },
      {
        domain: 'NEED',
        type: 'AUTONOMY',
        state: 'FRUSTRATED',
        content: 'Feels controlled',
        source: 'I had to do it',
        confidence: 0.85,
      },
    ]
    const result = summarizeSignals(signals)

    // Should contain VALUE domain with both types
    expect(result).toContain('[VALUE]')
    expect(result).toContain('POWER')
    expect(result).toContain('ACHIEVEMENT')

    // Should contain NEED domain
    expect(result).toContain('[NEED]')
    expect(result).toContain('AUTONOMY')
  })

  it('should only include high confidence signals in domain summary', () => {
    const signals: Signal[] = [
      {
        domain: 'VALUE',
        type: 'POWER',
        content: 'Wants control',
        source: 'I want to be in charge',
        confidence: 0.8, // High confidence
      },
      {
        domain: 'VALUE',
        type: 'SECURITY',
        content: 'Wants safety',
        source: 'Maybe I want safety',
        confidence: 0.3, // Low confidence
      },
    ]
    const result = summarizeSignals(signals)

    // Should contain high confidence type
    expect(result).toContain('POWER')
    // Should not contain low confidence type
    expect(result).not.toContain('SECURITY')
  })

  it('should show total signals and domains covered', () => {
    const signals: Signal[] = [
      {
        domain: 'VALUE',
        type: 'POWER',
        content: 'Wants control',
        source: 'I want to be in charge',
        confidence: 0.8,
      },
      {
        domain: 'NEED',
        type: 'AUTONOMY',
        content: 'Feels controlled',
        source: 'I had to do it',
        confidence: 0.85,
      },
      {
        domain: 'DEFENSE',
        type: 'RATIONALIZATION',
        content: 'Makes excuses',
        source: 'Work is more important anyway',
        confidence: 0.75,
      },
    ]
    const result = summarizeSignals(signals)

    // Should show total signals count
    expect(result).toContain('3 signals')
    // Should show domains covered count
    expect(result).toContain('3 domains covered')
  })

  it('should handle signals without domain by defaulting to PATTERN', () => {
    const signals: Signal[] = [
      {
        type: 'habit_loop',
        content: 'Recurring behavior',
        source: 'I always do this',
        confidence: 0.8,
      } as Signal, // Cast to allow missing domain for backwards compat
    ]
    const result = summarizeSignals(signals)

    // Should group under PATTERN domain
    expect(result).toContain('[PATTERN]')
  })
})

describe('EXCAVATION phase prompt', () => {
  it('should include validated construct detection guidance', () => {
    const prompt = buildSystemPrompt('EXCAVATION', [])

    // VALUES (Schwartz)
    expect(prompt).toContain('VALUES')
    expect(prompt).toContain('Schwartz')
    expect(prompt).toContain('POWER')
    expect(prompt).toContain('ACHIEVEMENT')
    expect(prompt).toContain('SELF_DIRECTION')
    expect(prompt).toContain('SECURITY')
    expect(prompt).toContain('BENEVOLENCE')

    // NEEDS (SDT)
    expect(prompt).toContain('NEEDS')
    expect(prompt).toContain('SDT')
    expect(prompt).toContain('AUTONOMY')
    expect(prompt).toContain('COMPETENCE')
    expect(prompt).toContain('RELATEDNESS')
    expect(prompt).toContain('frustrated')

    // DEFENSES (Vaillant)
    expect(prompt).toContain('DEFENSES')
    expect(prompt).toContain('Vaillant')
    expect(prompt).toContain('DENIAL')
    expect(prompt).toContain('RATIONALIZATION')
    expect(prompt).toContain('PROJECTION')
    expect(prompt).toContain('INTELLECTUALIZATION')

    // ATTACHMENT (Bowlby)
    expect(prompt).toContain('ATTACHMENT')
    expect(prompt).toContain('Bowlby')
    expect(prompt).toContain('SECURE')
    expect(prompt).toContain('ANXIOUS')
    expect(prompt).toContain('AVOIDANT')

    // DEVELOPMENT (Kegan)
    expect(prompt).toContain('DEVELOPMENT')
    expect(prompt).toContain('Kegan')
    expect(prompt).toContain('SOCIALIZED')
    expect(prompt).toContain('SELF_AUTHORING')
    expect(prompt).toContain('SELF_TRANSFORMING')
  })

  it('should include detection markers for each construct', () => {
    const prompt = buildSystemPrompt('EXCAVATION', [])

    // SDT detection markers
    expect(prompt).toContain('"I had to"')
    expect(prompt).toContain('"They made me"')
    expect(prompt).toContain('"No choice"')
    expect(prompt).toContain('"I can\'t"')
    expect(prompt).toContain('"No one understands"')

    // Defense detection markers
    expect(prompt).toContain('"It\'s not that bad"')
    expect(prompt).toContain('"Work is more important anyway"')

    // Attachment detection markers
    expect(prompt).toContain('fear of abandonment')
    expect(prompt).toContain('Dismissive')

    // Development detection markers
    expect(prompt).toContain('"What will they think?"')
    expect(prompt).toContain('"I decided this matters"')
    expect(prompt).toContain('"Both perspectives are valid"')
  })
})
