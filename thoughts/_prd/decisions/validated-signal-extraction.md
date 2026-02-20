# Decision Brief: Validated Signal Extraction

**Date**: 2026-01-18
**Status**: PROPOSED
**Severity**: HIGH (Core Architecture)
**Author**: Research Review

---

## Executive Summary

The current signal extraction system uses a **made-up taxonomy** (`VALUE, FEAR, PATTERN, DEFENSE, GOAL`) that is not grounded in validated psychological frameworks. This contradicts the deep research in `_deep_research/psychometric_frameworks.md` which explicitly recommends validated constructs (HEXACO, Schwartz Values, SDT, Kegan, Attachment).

**Recommendation**: Replace the simplified taxonomy with validated psychological constructs and add computational linguistics (Empath/LIWC) as an anchoring layer.

---

## The Problem

### Current State

| File | Taxonomy Used |
|------|---------------|
| `the-right-questions.prd.json` | `VALUE, FEAR, PATTERN, DEFENSE, GOAL` |
| `dynamic-signal-extraction.md` | `VALUE, FEAR, PATTERN, DEFENSE` |
| `discovery-architecture.md` | `VALUE, CONSTRAINT, FEAR, PATTERN, GOAL, DEFENSE_MECHANISM` |
| `synthesis-mechanics.md` | `VALUE, FEAR, DEFENSE, DESIRE` |

**None of these map to validated psychological constructs.**

### Research Recommends (psychometric-profiling.md)

| Layer | Framework | Validated Constructs |
|-------|-----------|---------------------|
| Traits | HEXACO | Honesty-Humility, Emotionality, Extraversion, Agreeableness, Conscientiousness, Openness |
| Motivation | SDT | Autonomy, Competence, Relatedness |
| Development | Kegan | Stage 3 (Socialized), Stage 4 (Self-Authoring), Stage 5 (Self-Transforming) |
| Patterns | Attachment | Secure, Anxious, Avoidant, Disorganized |
| Values | Schwartz | 10 validated value types |
| Behavior | Defense Mechanisms | Denial, Rationalization, Projection, Displacement, Intellectualization, Sublimation |

### The Gap

```
psychometric-profiling.md (theory) ──────────────> extractSignal tool (implementation)

     HEXACO traits                                  "VALUE" (undefined)
     SDT needs                                      "FEAR" (undefined)
     Kegan stages                                   "PATTERN" (undefined)
     Attachment styles                              "DEFENSE" (undefined)
     Schwartz values                                "GOAL" (undefined)
     Defense mechanisms
```

The implementation **ignores** the research.

---

## Why This Matters

### 1. No Construct Validity

When Claude extracts a "VALUE" signal, it has no grounding in what "VALUE" means psychologically. Contrast with:

- **Schwartz Values**: 10 specific values (Power, Achievement, Hedonism, Stimulation, Self-Direction, Universalism, Benevolence, Tradition, Conformity, Security) with validated definitions and cross-cultural research
- **Our VALUE**: Whatever Claude thinks a value is

### 2. No Validation Mechanism

Cambridge Analytica collected **ground truth** (questionnaire responses) and built correlations. We have:

- No comparison to validated instruments
- No inter-rater reliability
- No feedback loop to verify extraction accuracy
- No user confirmation mechanism

### 3. Barnum Effect Risk

Generic extractions like "You value meaningful work but fear rejection" sound profound but are true of almost everyone. Validated frameworks force specificity.

### 4. Wasted Research

The 83-page `psychometric_frameworks.md` research document is comprehensive and excellent. The PRD implementation ignores its core recommendations.

---

## Proposed Solution

### Option A: Validated Taxonomy (Recommended)

Replace the simplified taxonomy with specific validated constructs:

```typescript
type SignalType =
  // Schwartz Values (10 types)
  | { domain: 'VALUE'; type: 'POWER' | 'ACHIEVEMENT' | 'HEDONISM' | 'STIMULATION' |
      'SELF_DIRECTION' | 'UNIVERSALISM' | 'BENEVOLENCE' | 'TRADITION' | 'CONFORMITY' | 'SECURITY' }

  // SDT Needs (3 types × 2 states)
  | { domain: 'NEED'; type: 'AUTONOMY' | 'COMPETENCE' | 'RELATEDNESS'; state: 'SATISFIED' | 'FRUSTRATED' }

  // McClelland Motives (3 types)
  | { domain: 'MOTIVE'; type: 'ACHIEVEMENT' | 'POWER' | 'AFFILIATION' }

  // Attachment Markers (4 types)
  | { domain: 'ATTACHMENT'; type: 'SECURE' | 'ANXIOUS' | 'AVOIDANT' | 'DISORGANIZED' }

  // Defense Mechanisms (Vaillant hierarchy)
  | { domain: 'DEFENSE'; type: 'DENIAL' | 'RATIONALIZATION' | 'PROJECTION' | 'DISPLACEMENT' |
      'INTELLECTUALIZATION' | 'SUBLIMATION' | 'HUMOR' | 'ANTICIPATION' }

  // Kegan Developmental Markers
  | { domain: 'DEVELOPMENT'; type: 'SOCIALIZED' | 'SELF_AUTHORING' | 'SELF_TRANSFORMING' }

  // Behavioral Patterns (keep these - observable)
  | { domain: 'PATTERN'; type: string; evidence: string }
```

### Option B: Hybrid LIWC + LLM

Add computational linguistics layer for validation:

```
User message →
  1. Empath word categories (validated, algorithmic)
  2. Claude semantic extraction (contextual, LLM)
  3. Cross-validation: Empath anchors + Claude contextualizes
```

**Example:**
- Empath detects: `{negative_emotion: 0.4, fear: 0.2, work: 0.3}`
- Claude extracts: `{domain: 'NEED', type: 'AUTONOMY', state: 'FRUSTRATED'}`
- Combined: Signal grounded in both word patterns AND semantic meaning

### Option C: Minimum Viable Validation

Add user confirmation loop:

```
Claude extracts signal →
  Present to user: "I'm noticing [signal]. Does this resonate?" →
  User confirms/denies →
  Signal confidence adjusted
```

This provides a feedback loop missing from current design.

---

## Impact Analysis

### Files Requiring Changes

#### HIGH IMPACT (Core Schema/Logic)

| File | Current | Change Required |
|------|---------|-----------------|
| `the-right-questions.prd.json` | S4-T01 defines `extractSignal` with simplified types | Redefine tool schema with validated constructs |
| `the-right-questions.prd.json` | S4-T03 Memory Graph schema | Add domain/type structure for validated signals |
| `patterns/dynamic-signal-extraction.md` | `type: z.enum(['VALUE', 'FEAR', 'PATTERN', 'DEFENSE'])` | Replace with validated taxonomy enum |
| `patterns/discovery-architecture.md` | Tool definitions use simplified types | Update `extractSignal` tool schema |
| `patterns/synthesis-mechanics.md` | Signal type assumes flat structure | Update to handle domain/type structure |
| `patterns/psychometric-profiling.md` | Good schema (`PsychometricProfile`) | **Use this as source of truth** - connect to tools |

#### MEDIUM IMPACT (Prompts/Logic)

| File | Current | Change Required |
|------|---------|-----------------|
| `patterns/discovery-architecture.md` | Phase prompts reference generic types | Update prompts to reference specific constructs |
| `system_soul.md` | May reference extraction approach | Review for consistency |
| `the-right-questions.prd.json` | S3-T02 Context Window builder | Update `summarizeProfile` to use validated structures |

#### LOW IMPACT (UI/Output)

| File | Current | Change Required |
|------|---------|-----------------|
| `the-right-questions.prd.json` | S5-T02 Contract prompting | Reference specific signal types in synthesis |
| `contract-wireframe.md` | May assume signal structure | Review for consistency |

### New Dependencies

| Dependency | Purpose | Cost |
|------------|---------|------|
| `empath-client` (Python) | LIWC-alternative word categories | Free, open source |
| OR `liwc.app` API | Gold standard word categories | ~$100/year |
| `@huggingface/inference` | Big Five from text (optional) | API costs |

### PRD Story Changes

| Story | Current | Proposed Change |
|-------|---------|-----------------|
| S4-T01 | "Define extractSignal Tool - Schema inspired by psychometric-profiling.md (simplified for MVP: VALUE, FEAR, PATTERN, DEFENSE, GOAL)" | "Define extractSignal Tool - Schema uses validated constructs: Schwartz Values (10), SDT Needs (3), McClelland Motives (3), Attachment Markers (4), Defense Mechanisms (8), Kegan Markers (3)" |
| S4-T02 | Background extraction action | Add Empath pre-processing step |
| S4-T03 | Memory Graph schema | Use `PsychometricProfile` structure from psychometric-profiling.md |
| S4-T04 | synthesizeProfile tool | Update to aggregate validated constructs |
| S4-T05 | Extraction density monitoring | Monitor by domain (are we getting SDT needs? Values? etc.) |
| NEW S4-T06 | - | "Implement User Confirmation Loop - present extracted signals for validation" |
| NEW S4-T07 | - | "Integrate Empath for word-category anchoring" |

---

## Decision Options

### Option 1: Full Validated Taxonomy (Recommended)

**Scope**: High
**Risk**: Medium (more complex extraction prompts)
**Benefit**: Psychometrically valid, research-aligned, defensible

- Replace simplified types with validated constructs
- Add Empath/LIWC layer
- Add user confirmation loop
- Use `PsychometricProfile` schema from psychometric-profiling.md

### Option 2: Incremental - SDT + Values Only

**Scope**: Medium
**Risk**: Low
**Benefit**: Captures most important constructs without full complexity

- Replace `VALUE` with Schwartz 10 values
- Replace `FEAR` with SDT need frustrations
- Keep `PATTERN`, `DEFENSE` as-is initially
- Defer HEXACO, Kegan, Attachment to v2

### Option 3: Status Quo + Validation Layer

**Scope**: Low
**Risk**: Low
**Benefit**: Quick to implement, some improvement

- Keep simplified taxonomy
- Add user confirmation loop
- Add Empath word-category cross-validation
- Document that constructs are "inspired by" but not validated

---

## Recommendation

**Option 1: Full Validated Taxonomy**

Rationale:
1. The research already exists and recommends this approach
2. The `PsychometricProfile` schema in psychometric-profiling.md is already defined
3. Doing it "right" now avoids technical debt and refactoring later
4. Validated constructs enable future research/publication if desired
5. Reduces Barnum effect risk - extractions will be more specific and defensible

---

## Open Questions

1. **Empath vs LIWC**: Empath is free but less validated. LIWC is gold standard but costs ~$100/year. Which?

2. **User confirmation UX**: How intrusive should the "does this resonate?" loop be? Every signal? End of phase?

3. **Complexity budget**: 10 Schwartz values + 3 SDT needs + 8 defenses = 21+ signal types. Too many for MVP?

4. **Training data**: Should we fine-tune extraction prompts on validated instruments (e.g., PVQ, VIA-IS)?

---

## Next Steps

1. [ ] Decide on Option 1/2/3
2. [ ] Update `extractSignal` tool schema in discovery-architecture.md
3. [ ] Update PRD stories S4-T01 through S4-T05
4. [ ] Add new stories for Empath integration and user confirmation
5. [ ] Update system prompts with validated construct definitions
6. [ ] Create mapping document: "How to detect [construct] in conversation"

---

## References

- `_deep_research/psychometric_frameworks.md` - Source research
- `_deep_research/behaviour_change_science.md` - BCT taxonomy, habit loops
- `patterns/psychometric-profiling.md` - `PsychometricProfile` schema (use this!)
- [Empath GitHub](https://github.com/Ejhfast/empath-client)
- [LIWC-22](https://www.liwc.app/)
- [Schwartz Values Theory](https://en.wikipedia.org/wiki/Theory_of_basic_human_values)
