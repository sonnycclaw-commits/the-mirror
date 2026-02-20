/**
 * Tests for density-monitor.ts - Domain Coverage Monitoring
 * DECISION-001: Validated psychological signal extraction
 *
 * Synthesis requires:
 * - At least VALUE domain signals
 * - At least NEED domain signals
 * - At least one of: DEFENSE, PATTERN, or ATTACHMENT
 */
import { describe, it, expect } from 'vitest'
import {
  DENSITY_CONFIG,
  checkDomainCoverage,
  canProceedToSynthesis,
  getDomainPromptInjection,
  type DomainCoverage,
} from '../density-monitor'

describe('DENSITY_CONFIG domain coverage', () => {
  it('should define required domains as VALUE and NEED', () => {
    expect(DENSITY_CONFIG.REQUIRED_DOMAINS).toContain('VALUE')
    expect(DENSITY_CONFIG.REQUIRED_DOMAINS).toContain('NEED')
    expect(DENSITY_CONFIG.REQUIRED_DOMAINS.length).toBe(2)
  })

  it('should define optional domains for synthesis', () => {
    expect(DENSITY_CONFIG.OPTIONAL_DOMAINS).toContain('DEFENSE')
    expect(DENSITY_CONFIG.OPTIONAL_DOMAINS).toContain('PATTERN')
    expect(DENSITY_CONFIG.OPTIONAL_DOMAINS).toContain('ATTACHMENT')
    expect(DENSITY_CONFIG.OPTIONAL_DOMAINS).toContain('DEVELOPMENT')
    expect(DENSITY_CONFIG.OPTIONAL_DOMAINS).toContain('MOTIVE')
  })

  it('should require at least 1 optional domain', () => {
    expect(DENSITY_CONFIG.MIN_OPTIONAL_DOMAINS).toBe(1)
  })
})

describe('checkDomainCoverage', () => {
  it('should count signals by domain (high confidence only)', () => {
    const signals = [
      { domain: 'VALUE', confidence: 0.8 },
      { domain: 'VALUE', confidence: 0.9 },
      { domain: 'NEED', confidence: 0.7 },
      { domain: 'NEED', confidence: 0.3 }, // Low confidence, should not count
      { domain: 'DEFENSE', confidence: 0.75 },
    ]
    const result = checkDomainCoverage(signals)

    expect(result.domains['VALUE']).toBe(2)
    expect(result.domains['NEED']).toBe(1) // Only the high confidence one
    expect(result.domains['DEFENSE']).toBe(1)
  })

  it('should return requiredMet=true when VALUE and NEED are present', () => {
    const signals = [
      { domain: 'VALUE', confidence: 0.8 },
      { domain: 'NEED', confidence: 0.7 },
    ]
    const result = checkDomainCoverage(signals)

    expect(result.requiredMet).toBe(true)
    expect(result.missingRequired).toHaveLength(0)
  })

  it('should return requiredMet=false when VALUE is missing', () => {
    const signals = [
      { domain: 'NEED', confidence: 0.7 },
      { domain: 'DEFENSE', confidence: 0.8 },
    ]
    const result = checkDomainCoverage(signals)

    expect(result.requiredMet).toBe(false)
    expect(result.missingRequired).toContain('VALUE')
  })

  it('should return requiredMet=false when NEED is missing', () => {
    const signals = [
      { domain: 'VALUE', confidence: 0.8 },
      { domain: 'PATTERN', confidence: 0.75 },
    ]
    const result = checkDomainCoverage(signals)

    expect(result.requiredMet).toBe(false)
    expect(result.missingRequired).toContain('NEED')
  })

  it('should return optionalMet=true when at least one of DEFENSE/PATTERN/ATTACHMENT is present', () => {
    const signals = [
      { domain: 'VALUE', confidence: 0.8 },
      { domain: 'NEED', confidence: 0.7 },
      { domain: 'DEFENSE', confidence: 0.75 },
    ]
    const result = checkDomainCoverage(signals)

    expect(result.optionalMet).toBe(true)
  })

  it('should return optionalMet=true with PATTERN domain', () => {
    const signals = [
      { domain: 'VALUE', confidence: 0.8 },
      { domain: 'NEED', confidence: 0.7 },
      { domain: 'PATTERN', confidence: 0.8 },
    ]
    const result = checkDomainCoverage(signals)

    expect(result.optionalMet).toBe(true)
  })

  it('should return optionalMet=true with ATTACHMENT domain', () => {
    const signals = [
      { domain: 'VALUE', confidence: 0.8 },
      { domain: 'NEED', confidence: 0.7 },
      { domain: 'ATTACHMENT', confidence: 0.7 },
    ]
    const result = checkDomainCoverage(signals)

    expect(result.optionalMet).toBe(true)
  })

  it('should return optionalMet=false when no optional domains are present', () => {
    const signals = [
      { domain: 'VALUE', confidence: 0.8 },
      { domain: 'NEED', confidence: 0.7 },
    ]
    const result = checkDomainCoverage(signals)

    expect(result.optionalMet).toBe(false)
  })

  it('should provide recommendation when required domains missing', () => {
    const signals = [
      { domain: 'DEFENSE', confidence: 0.8 },
    ]
    const result = checkDomainCoverage(signals)

    expect(result.recommendation).toBeDefined()
    expect(result.recommendation).toContain('Missing required domains')
  })

  it('should provide recommendation when optional domains missing', () => {
    const signals = [
      { domain: 'VALUE', confidence: 0.8 },
      { domain: 'NEED', confidence: 0.7 },
    ]
    const result = checkDomainCoverage(signals)

    expect(result.recommendation).toBeDefined()
    expect(result.recommendation).toContain('DEFENSE')
    expect(result.recommendation).toContain('PATTERN')
    expect(result.recommendation).toContain('ATTACHMENT')
  })

  it('should not provide recommendation when all requirements met', () => {
    const signals = [
      { domain: 'VALUE', confidence: 0.8 },
      { domain: 'NEED', confidence: 0.7 },
      { domain: 'DEFENSE', confidence: 0.75 },
    ]
    const result = checkDomainCoverage(signals)

    expect(result.recommendation).toBeUndefined()
  })
})

describe('canProceedToSynthesis with domain coverage', () => {
  it('should block synthesis when required domains missing', () => {
    const coverage: DomainCoverage = {
      domains: { DEFENSE: 2 },
      requiredMet: false,
      optionalMet: true,
      missingRequired: ['VALUE', 'NEED'],
      recommendation: 'Missing required domains: VALUE, NEED',
    }

    const result = canProceedToSynthesis(15, 10, coverage)

    expect(result.allowed).toBe(false)
    expect(result.reason).toContain('Missing required domains')
    expect(result.recommendation).toBeDefined()
  })

  it('should block synthesis when optional domains missing', () => {
    const coverage: DomainCoverage = {
      domains: { VALUE: 3, NEED: 2 },
      requiredMet: true,
      optionalMet: false,
      missingRequired: [],
      recommendation: 'Need at least one of: DEFENSE, PATTERN, or ATTACHMENT signals.',
    }

    const result = canProceedToSynthesis(15, 10, coverage)

    expect(result.allowed).toBe(false)
    expect(result.reason).toContain('Insufficient domain coverage')
    expect(result.recommendation).toBeDefined()
  })

  it('should allow synthesis when all domain requirements met', () => {
    const coverage: DomainCoverage = {
      domains: { VALUE: 3, NEED: 2, DEFENSE: 1 },
      requiredMet: true,
      optionalMet: true,
      missingRequired: [],
    }

    const result = canProceedToSynthesis(15, 10, coverage)

    expect(result.allowed).toBe(true)
  })

  it('should still enforce minimum signal count', () => {
    const coverage: DomainCoverage = {
      domains: { VALUE: 2, NEED: 1, DEFENSE: 1 },
      requiredMet: true,
      optionalMet: true,
      missingRequired: [],
    }

    // Only 5 total signals, below MIN_SIGNALS_FOR_SYNTHESIS
    const result = canProceedToSynthesis(5, 4, coverage)

    expect(result.allowed).toBe(false)
    expect(result.reason).toContain('Insufficient signals')
  })

  it('should still enforce high confidence signal count', () => {
    const coverage: DomainCoverage = {
      domains: { VALUE: 5, NEED: 3, DEFENSE: 2 },
      requiredMet: true,
      optionalMet: true,
      missingRequired: [],
    }

    // 15 total signals but only 2 high confidence
    const result = canProceedToSynthesis(15, 2, coverage)

    expect(result.allowed).toBe(false)
    expect(result.reason).toContain('high-confidence')
  })
})

describe('getDomainPromptInjection', () => {
  it('should return empty string when all requirements met', () => {
    const coverage: DomainCoverage = {
      domains: { VALUE: 3, NEED: 2, DEFENSE: 1 },
      requiredMet: true,
      optionalMet: true,
      missingRequired: [],
    }

    const result = getDomainPromptInjection(coverage)

    expect(result).toBe('')
  })

  it('should return prompt injection when required domains missing', () => {
    const coverage: DomainCoverage = {
      domains: { DEFENSE: 2 },
      requiredMet: false,
      optionalMet: true,
      missingRequired: ['VALUE', 'NEED'],
      recommendation: 'Missing required domains: VALUE, NEED. Probe for what matters to them.',
    }

    const result = getDomainPromptInjection(coverage)

    expect(result).toContain('DOMAIN COVERAGE ALERT')
    expect(result).toContain('VALUE')
    expect(result).toContain('NEED')
    expect(result).toContain('Current coverage')
  })

  it('should return prompt injection when optional domains missing', () => {
    const coverage: DomainCoverage = {
      domains: { VALUE: 3, NEED: 2 },
      requiredMet: true,
      optionalMet: false,
      missingRequired: [],
      recommendation: 'Need at least one of: DEFENSE, PATTERN, or ATTACHMENT signals.',
    }

    const result = getDomainPromptInjection(coverage)

    expect(result).toContain('DOMAIN COVERAGE ALERT')
    expect(result).toContain('DEFENSE')
    expect(result).toContain('PATTERN')
    expect(result).toContain('ATTACHMENT')
  })
})
