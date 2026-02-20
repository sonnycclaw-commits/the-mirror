# Impact Analysis: the-mirror Codebase

**Related Decision**: `validated-signal-extraction.md`
**Codebase**: `/Users/joelchan/Documents/Coding/App-Dev/live/unfuck-your-life/the-mirror`
**Date**: 2026-01-18

---

## Executive Summary

The implementation is **more sophisticated than expected**. It already includes:
- SDT needs as subtypes (`autonomy_frustration`, `competence_frustration`, `relatedness_frustration`)
- Defense mechanisms (`rationalization`, `projection`, `avoidance`, `intellectualization`, `denial`)
- Domain categorization (`work`, `relationships`, `health`, `personal_growth`, `general`)
- SDT needs assessment in profile synthesis

**Still missing** for full validated framework alignment:
- Schwartz's 10 specific value types (not generic VALUE)
- HEXACO/Big Five personality markers
- Kegan developmental stage markers
- Attachment style markers
- Empath/LIWC word-category layer
- User confirmation loop

---

## Current State vs Validated Framework

| Construct | Current Implementation | Validated Target |
|-----------|----------------------|------------------|
| **Values** | `VALUE` with subtypes `core_value`, `stated_value`, `hidden_value` | Schwartz 10: `POWER`, `ACHIEVEMENT`, `HEDONISM`, `STIMULATION`, `SELF_DIRECTION`, `UNIVERSALISM`, `BENEVOLENCE`, `TRADITION`, `CONFORMITY`, `SECURITY` |
| **SDT Needs** | ✅ `autonomy_frustration`, `competence_frustration`, `relatedness_frustration` | Already implemented |
| **Defenses** | ✅ `rationalization`, `projection`, `avoidance`, `intellectualization`, `denial` | Add `displacement`, `sublimation`, `humor`, `anticipation` |
| **Personality** | ❌ Not present | HEXACO 6 factors |
| **Development** | ❌ Not present | Kegan 3 stages |
| **Attachment** | ❌ Not present | 4 attachment styles |

---

## File-by-File Impact

### 1. `convex/schema.ts`

**Current**: Lines 13-22 define `signalTypeEnum`
**Impact**: MEDIUM
**Effort**: ~2 hours

```typescript
// CURRENT (line 13-22)
const signalTypeEnum = v.union(
  v.literal('VALUE'),
  v.literal('FEAR'),
  v.literal('CONSTRAINT'),
  v.literal('PATTERN'),
  v.literal('GOAL'),
  v.literal('DEFENSE_MECHANISM'),
  v.literal('CONTRADICTION'),
  v.literal('NEED')
)

// PROPOSED - Add domain field
const signalDomainEnum = v.union(
  v.literal('VALUE'),        // Schwartz values
  v.literal('NEED'),         // SDT needs
  v.literal('MOTIVE'),       // McClelland motives
  v.literal('ATTACHMENT'),   // Bowlby attachment
  v.literal('DEFENSE'),      // Vaillant defenses
  v.literal('DEVELOPMENT'),  // Kegan stages
  v.literal('PATTERN'),      // Behavioral (observable)
  v.literal('FEAR'),         // Keep for backwards compat
  v.literal('GOAL'),         // Keep for backwards compat
)

// ADD: Schwartz value types as signal_type options
const schwartzValueTypes = v.union(
  v.literal('POWER'),
  v.literal('ACHIEVEMENT'),
  v.literal('HEDONISM'),
  v.literal('STIMULATION'),
  v.literal('SELF_DIRECTION'),
  v.literal('UNIVERSALISM'),
  v.literal('BENEVOLENCE'),
  v.literal('TRADITION'),
  v.literal('CONFORMITY'),
  v.literal('SECURITY'),
)

// ADD: Kegan stages
const keganStageEnum = v.union(
  v.literal('SOCIALIZED'),
  v.literal('SELF_AUTHORING'),
  v.literal('SELF_TRANSFORMING'),
)

// ADD: Attachment styles
const attachmentStyleEnum = v.union(
  v.literal('SECURE'),
  v.literal('ANXIOUS'),
  v.literal('AVOIDANT'),
  v.literal('DISORGANIZED'),
)
```

**Changes Required**:
- Add `psychologicalDomain` field to signals table (line 114)
- Add Schwartz value subtypes (line 25-58 area)
- Add Kegan stage subtypes
- Add attachment style subtypes
- Update `signalSubtypeEnum` to include new validated constructs

---

### 2. `convex/signals.ts`

**Current**: Lines 9-18 mirror schema validators
**Impact**: MEDIUM
**Effort**: ~1 hour

**Changes Required**:
- Mirror all validator changes from schema.ts
- Update `save` mutation args to include new fields
- Add new query: `listBySessionAndDomain` for domain-based retrieval

---

### 3. `src/lib/ai/tools/extract-signal.ts`

**Current**: Lines 16-25 define `signalTypeSchema`
**Impact**: HIGH (Core extraction logic)
**Effort**: ~3 hours

```typescript
// CURRENT (line 16-25)
export const signalTypeSchema = z.enum([
  'VALUE',
  'FEAR',
  'CONSTRAINT',
  'PATTERN',
  'GOAL',
  'DEFENSE_MECHANISM',
  'CONTRADICTION',
  'NEED',
])

// PROPOSED - Domain + Type structure
export const signalDomainSchema = z.enum([
  'VALUE',        // Schwartz
  'NEED',         // SDT
  'MOTIVE',       // McClelland
  'ATTACHMENT',   // Bowlby
  'DEFENSE',      // Vaillant
  'DEVELOPMENT',  // Kegan
  'PATTERN',      // Behavioral
])

export const signalTypeSchema = z.discriminatedUnion('domain', [
  z.object({
    domain: z.literal('VALUE'),
    type: z.enum([
      'POWER', 'ACHIEVEMENT', 'HEDONISM', 'STIMULATION',
      'SELF_DIRECTION', 'UNIVERSALISM', 'BENEVOLENCE',
      'TRADITION', 'CONFORMITY', 'SECURITY'
    ]),
  }),
  z.object({
    domain: z.literal('NEED'),
    type: z.enum(['AUTONOMY', 'COMPETENCE', 'RELATEDNESS']),
    state: z.enum(['SATISFIED', 'FRUSTRATED']),
  }),
  z.object({
    domain: z.literal('ATTACHMENT'),
    type: z.enum(['SECURE', 'ANXIOUS', 'AVOIDANT', 'DISORGANIZED']),
  }),
  z.object({
    domain: z.literal('DEVELOPMENT'),
    type: z.enum(['SOCIALIZED', 'SELF_AUTHORING', 'SELF_TRANSFORMING']),
  }),
  // ... etc
])
```

**Changes Required**:
- Restructure from flat enum to domain/type discriminated union
- Update tool description (lines 135-155) with validated construct guidance
- Add domain-specific detection hints

---

### 4. `src/lib/ai/tools/synthesize-profile.ts`

**Current**: Already has good SDT structure (lines 50-66)
**Impact**: LOW
**Effort**: ~1 hour

**Changes Required**:
- Add `schwartzValues` to profile output schema
- Add `attachmentMarkers` to profile output schema
- Add `developmentStage` to profile output schema
- Update prompt guidance to reference validated constructs

---

### 5. `src/lib/discovery/prompt-builder.ts`

**Current**: Lines 37-163 define phase prompts
**Impact**: MEDIUM
**Effort**: ~2 hours

**Changes Required**:
- Update EXCAVATION prompt (line 59-82) to reference specific validated constructs
- Add Schwartz value detection guidance
- Add Kegan stage language markers
- Add attachment narrative coherence markers
- Update `summarizeSignals` function (line 168-196) to group by domain

---

### 6. `src/lib/discovery/density-monitor.ts`

**Current**: Monitors extraction density by count only
**Impact**: LOW
**Effort**: ~1 hour

**Changes Required**:
- Add domain distribution monitoring (are we getting values AND needs AND patterns?)
- Alert if extraction is skewed to one domain
- Add `canProceedToSynthesis` check for domain coverage

---

### 7. `convex/memoryGraph.ts`

**Current**: Lines 312-347 aggregate by type
**Impact**: LOW
**Effort**: ~30 min

**Changes Required**:
- Update `getSignalSummary` to also group by domain
- Add query for domain distribution

---

### 8. `convex/profiles.ts`

**Current**: Stores profile data
**Impact**: LOW (if exists - need to verify)
**Effort**: ~30 min

**Changes Required**:
- Update schema to store validated constructs
- Add Schwartz values array
- Add developmental stage assessment

---

## New Files Required

### 9. `src/lib/linguistics/empath-client.ts` (NEW)

**Purpose**: Integrate Empath word-category analysis
**Effort**: ~4 hours

```typescript
/**
 * Empath Integration - Computational Linguistics Layer
 *
 * Pre-processes user messages to extract validated word categories
 * before LLM extraction. Provides anchoring for Claude's extractions.
 */
import { Empath } from 'empath-client'

export interface EmpathAnalysis {
  // LIWC-style categories
  negativeEmotion: number
  positiveEmotion: number
  anxiety: number
  anger: number
  sadness: number

  // Social categories
  family: number
  friends: number
  work: number

  // Cognitive categories
  certainty: number
  tentative: number
  insight: number
  causation: number
}

export function analyzeMessage(text: string): EmpathAnalysis {
  const lexicon = new Empath()
  return lexicon.analyze(text, { normalize: true })
}
```

### 10. `src/components/discovery/SignalConfirmation.tsx` (NEW)

**Purpose**: User confirmation loop for extracted signals
**Effort**: ~3 hours

```tsx
/**
 * Signal Confirmation Component
 *
 * Displays extracted signal and asks "Does this resonate?"
 * User can confirm, reject, or refine.
 */
interface SignalConfirmationProps {
  signal: Signal
  onConfirm: () => void
  onReject: () => void
  onRefine: (refined: string) => void
}
```

---

## Database Migration

### Migration Script

```typescript
// convex/migrations/001_validated_signals.ts

/**
 * Migration: Add validated psychological domains
 *
 * 1. Add psychologicalDomain field to existing signals
 * 2. Infer domain from existing type/subtype where possible
 */
export const migrateSignalsToValidated = internalMutation({
  handler: async (ctx) => {
    const signals = await ctx.db.query('signals').collect()

    for (const signal of signals) {
      // Infer domain from existing type
      let domain = 'PATTERN' // default

      if (signal.type === 'VALUE') domain = 'VALUE'
      if (signal.type === 'NEED') domain = 'NEED'
      if (signal.type === 'DEFENSE_MECHANISM') domain = 'DEFENSE'
      if (signal.type === 'FEAR') domain = 'FEAR' // backwards compat

      // Infer specific type from subtype where possible
      let specificType = signal.subtype || 'unspecified'

      // SDT subtypes → SDT types
      if (signal.subtype === 'autonomy_frustration') {
        domain = 'NEED'
        specificType = 'AUTONOMY'
      }
      // ... etc

      await ctx.db.patch(signal._id, {
        psychologicalDomain: domain,
        validatedType: specificType,
      })
    }
  }
})
```

---

## Implementation Order

### Phase 1: Schema Foundation (Day 1)
1. Update `convex/schema.ts` with new domain enums
2. Update `convex/signals.ts` validators
3. Run migration to add domain field

### Phase 2: Tool Updates (Day 2)
4. Update `extract-signal.ts` with validated taxonomy
5. Update `synthesize-profile.ts` schema
6. Update tool descriptions with construct guidance

### Phase 3: Prompt Updates (Day 2-3)
7. Update `prompt-builder.ts` phase prompts
8. Add construct detection guidance
9. Update signal summarization

### Phase 4: Integration (Day 3-4)
10. Add Empath client (optional)
11. Add SignalConfirmation component (optional)
12. Update density monitor for domain coverage

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Breaking existing signals | Medium | High | Migration script preserves data, adds new fields |
| LLM extraction quality drops | Medium | Medium | Extensive prompt examples, gradual rollout |
| Discriminated union complexity | Low | Medium | TypeScript catches errors at build time |
| Empath dependency issues | Medium | Low | Make Empath optional, use LLM-only fallback |

---

## Effort Estimate

| Component | Effort | Priority |
|-----------|--------|----------|
| Schema changes | 2 hours | P0 |
| Signal validator changes | 1 hour | P0 |
| extract-signal.ts restructure | 3 hours | P0 |
| prompt-builder.ts updates | 2 hours | P1 |
| synthesize-profile.ts updates | 1 hour | P1 |
| density-monitor.ts updates | 1 hour | P2 |
| memoryGraph.ts updates | 30 min | P2 |
| Migration script | 1 hour | P0 |
| Empath integration (optional) | 4 hours | P3 |
| SignalConfirmation UI (optional) | 3 hours | P3 |

**Total Core (P0-P1)**: ~10 hours
**Total with Optional (P0-P3)**: ~18 hours

---

## Decision Points

1. **Use discriminated union or flat domain+type?**
   - Discriminated: Better type safety, more complex
   - Flat: Simpler, but less TypeScript protection

2. **Empath integration priority?**
   - Now: Better grounding from day 1
   - Later: Ship validated taxonomy first, add anchoring later

3. **User confirmation UX?**
   - Every signal: More validation, slower flow
   - End of phase: Less intrusive, batch confirmation
   - Optional: User toggles in settings

4. **Backwards compatibility?**
   - Keep old types (`VALUE`, `FEAR`, etc.) as aliases?
   - Or hard cut to new schema?
