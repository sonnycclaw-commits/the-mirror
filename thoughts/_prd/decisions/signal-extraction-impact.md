# Impact Analysis: Validated Signal Extraction

**Related Decision**: `validated-signal-extraction.md`
**Date**: 2026-01-18

---

## Summary

Migrating from simplified taxonomy (`VALUE, FEAR, PATTERN, DEFENSE, GOAL`) to validated psychological constructs requires changes across **8 files** in the PRD, affecting **12 stories**.

---

## File-by-File Impact

### 1. `the-right-questions.prd.json`

**Impact**: HIGH
**Changes Required**:

| Section | Line/Story | Change |
|---------|------------|--------|
| `tech_stack.ai` | ~14 | Add `"linguistics": "empath-client"` |
| Sprint S4 | stories array | Add S4-T06, S4-T07 |
| S4-T01 | ~435-437 | Rewrite tool schema description |
| S4-T02 | ~440-444 | Add Empath pre-processing step |
| S4-T03 | ~448-451 | Reference `PsychometricProfile` schema |
| S4-T04 | ~456-458 | Update synthesis to aggregate by domain |
| S4-T05 | ~463-467 | Monitor extraction by domain/construct |

**Specific Changes**:

```diff
// S4-T01
- "action": "Create tool with Schema inspired by `psychometric-profiling.md` (simplified for MVP: VALUE, FEAR, PATTERN, DEFENSE, GOAL)."
+ "action": "Create tool with validated schema: Schwartz Values (10), SDT Needs (3×2), Attachment Markers (4), Defense Mechanisms (8), Kegan Markers (3). Use PsychometricProfile from psychometric-profiling.md as reference."

// Add to Sprint S4 stories array
+ "S4-T06", "S4-T07"

// Add new stories
+ {
+   "id": "S4-T06",
+   "name": "Integrate Empath Word Categories",
+   "action": "Add empath-client for LIWC-style word category analysis. Pre-process user messages before LLM extraction.",
+   "validation": "Empath categories returned for each message. Logged alongside LLM extractions.",
+   "completion_promise": "S4_T06_COMPLETE"
+ },
+ {
+   "id": "S4-T07",
+   "name": "Implement Signal Confirmation Loop",
+   "action": "Add optional 'Does this resonate?' confirmation for high-impact signals. Track user confirmation rate.",
+   "validation": "Signals marked as confirmed/rejected by user. Confidence adjusted based on feedback.",
+   "completion_promise": "S4_T07_COMPLETE"
+ }
```

---

### 2. `patterns/dynamic-signal-extraction.md`

**Impact**: HIGH
**Changes Required**:

| Section | Line | Change |
|---------|------|--------|
| extractSignal tool | ~96-104 | Replace enum with validated types |
| Signal Taxonomy | ~135-212 | Already good - align tool to this |
| Example Flow | ~274-314 | Update example signals to use validated types |

**Specific Changes**:

```diff
// extractSignal tool definition (line ~96)
- type: z.enum([
-   'VALUE',
-   'FEAR',
-   'PATTERN',
-   'DEFENSE'
- ]).describe("The category of signal"),
+ domain: z.enum([
+   'VALUE',      // Schwartz
+   'NEED',       // SDT
+   'MOTIVE',     // McClelland
+   'ATTACHMENT', // Bowlby
+   'DEFENSE',    // Vaillant
+   'DEVELOPMENT',// Kegan
+   'PATTERN'     // Behavioral (observable)
+ ]).describe("The psychological domain"),
+ type: z.string().describe("Specific construct within domain (e.g., 'AUTONOMY' for NEED domain)"),
+ state: z.optional(z.enum(['SATISFIED', 'FRUSTRATED', 'HIGH', 'LOW'])),
```

---

### 3. `patterns/discovery-architecture.md`

**Impact**: HIGH
**Changes Required**:

| Section | Line | Change |
|---------|------|--------|
| extractSignal tool | ~51-61 | Match new schema |
| Signal-driven prompts | ~157-177 | Reference validated constructs |
| summarizeProfile | ~306-317 | Update to aggregate by domain |
| Memory Graph schema | ~365-379 | Use domain/type structure |

**Specific Changes**:

```diff
// extractSignal tool (line ~51)
- type: z.enum(['VALUE', 'CONSTRAINT', 'FEAR', 'PATTERN', 'GOAL', 'DEFENSE_MECHANISM']),
+ domain: z.enum(['VALUE', 'NEED', 'MOTIVE', 'ATTACHMENT', 'DEFENSE', 'DEVELOPMENT', 'PATTERN']),
+ type: z.string(),
+ state: z.optional(z.string()),

// summarizeProfile function (line ~306)
- const values = signals.filter(s => s.type === 'VALUE').map(s => s.content);
- const constraints = signals.filter(s => s.type === 'CONSTRAINT').map(s => s.content);
- const fears = signals.filter(s => s.type === 'FEAR').map(s => s.content);
+ const values = signals.filter(s => s.domain === 'VALUE').map(s => `${s.type}: ${s.content}`);
+ const needs = signals.filter(s => s.domain === 'NEED').map(s => `${s.type} (${s.state}): ${s.content}`);
+ const defenses = signals.filter(s => s.domain === 'DEFENSE').map(s => `${s.type}: ${s.content}`);
+ const development = signals.filter(s => s.domain === 'DEVELOPMENT').map(s => s.type);
```

---

### 4. `patterns/synthesis-mechanics.md`

**Impact**: MEDIUM
**Changes Required**:

| Section | Line | Change |
|---------|------|--------|
| Signal type definition | ~19-25 | Update to domain/type structure |
| Pattern Recognition | ~40-47 | Update to check by domain |
| Contradiction Detection | ~49-56 | Reference specific constructs |
| Contract Generation Prompt | ~64-96 | Reference validated constructs |

**Specific Changes**:

```diff
// Signal type (line ~19)
- type: 'VALUE' | 'FEAR' | 'DEFENSE' | 'DESIRE';
+ domain: 'VALUE' | 'NEED' | 'MOTIVE' | 'ATTACHMENT' | 'DEFENSE' | 'DEVELOPMENT' | 'PATTERN';
+ type: string;
+ state?: string;

// Contract Generation (line ~74)
- Identify the dominant negative pattern.
+ Identify SDT need frustrations (AUTONOMY/COMPETENCE/RELATEDNESS with state=FRUSTRATED).
+ Cross-reference with defense mechanisms used to cope.
```

---

### 5. `patterns/psychometric-profiling.md`

**Impact**: LOW (Source of Truth)
**Changes Required**:

This file is **already correct**. It should be the reference for all other files.

| Section | Status |
|---------|--------|
| Core Frameworks table | ✓ Correct (HEXACO, SDT, Kegan, Attachment) |
| Analysis Techniques | ✓ Correct (Lexical, Narrative, Structural) |
| PsychometricProfile interface | ✓ Correct - USE THIS |

**Action**: Add note at top indicating this is the canonical schema.

```diff
+ > **STATUS**: This is the canonical schema for signal extraction.
+ > All tools (extractSignal, synthesizeProfile) MUST align with this structure.
```

---

### 6. `system_soul.md`

**Impact**: LOW
**Changes Required**: Review for references to signal types. Update any mentions of the simplified taxonomy.

---

### 7. `technical_architecture.md`

**Impact**: LOW
**Changes Required**: Add Empath to tech stack if using Option 1.

---

### 8. `contract-wireframe.md`

**Impact**: LOW
**Changes Required**: Review for signal structure assumptions.

---

## PRD Story Modifications

### Stories to Modify

| Story | Current Name | Change |
|-------|--------------|--------|
| S4-T01 | Define extractSignal Tool | Rewrite action/validation for validated schema |
| S4-T02 | Implement Background Extraction Action | Add Empath pre-processing |
| S4-T03 | Schema: Memory Graph | Reference PsychometricProfile |
| S4-T04 | Define synthesizeProfile Tool | Update to aggregate by domain |
| S4-T05 | Add Extraction Density Monitoring | Monitor by domain distribution |

### Stories to Add

| Story | Name | Sprint |
|-------|------|--------|
| S4-T06 | Integrate Empath Word Categories | S4 |
| S4-T07 | Implement Signal Confirmation Loop | S4 |

### Stories Indirectly Affected

| Story | Reason |
|-------|--------|
| S3-T02 | Context Window builder uses summarizeProfile |
| S5-T02 | Contract prompting references signals |
| S2-T02 | extractSignal tool definition |

---

## Schema Migration

### Old Schema

```typescript
type Signal = {
  type: 'VALUE' | 'FEAR' | 'PATTERN' | 'DEFENSE' | 'GOAL';
  content: string;
  source: string;
  confidence: number;
};
```

### New Schema

```typescript
type Signal = {
  id: string;

  // Validated domain
  domain: 'VALUE' | 'NEED' | 'MOTIVE' | 'ATTACHMENT' | 'DEFENSE' | 'DEVELOPMENT' | 'PATTERN';

  // Specific construct (constrained by domain)
  type: string;
  // VALUE: 'POWER' | 'ACHIEVEMENT' | 'HEDONISM' | 'STIMULATION' | 'SELF_DIRECTION' |
  //        'UNIVERSALISM' | 'BENEVOLENCE' | 'TRADITION' | 'CONFORMITY' | 'SECURITY'
  // NEED: 'AUTONOMY' | 'COMPETENCE' | 'RELATEDNESS'
  // MOTIVE: 'ACHIEVEMENT' | 'POWER' | 'AFFILIATION'
  // ATTACHMENT: 'SECURE' | 'ANXIOUS' | 'AVOIDANT' | 'DISORGANIZED'
  // DEFENSE: 'DENIAL' | 'RATIONALIZATION' | 'PROJECTION' | 'DISPLACEMENT' |
  //          'INTELLECTUALIZATION' | 'SUBLIMATION' | 'HUMOR' | 'ANTICIPATION'
  // DEVELOPMENT: 'SOCIALIZED' | 'SELF_AUTHORING' | 'SELF_TRANSFORMING'
  // PATTERN: (free text - behavioral observation)

  // State (for applicable domains)
  state?: 'SATISFIED' | 'FRUSTRATED' | 'HIGH' | 'LOW' | 'PRESENT' | 'ABSENT';

  // Evidence
  content: string;
  source: string;
  confidence: number;

  // Validation
  empath_categories?: Record<string, number>; // LIWC-style word categories
  user_confirmed?: boolean;
};
```

---

## Implementation Order

1. **Phase 1: Schema** (No behavior change)
   - Update type definitions in discovery-architecture.md
   - Update synthesis-mechanics.md
   - Add canonical note to psychometric-profiling.md

2. **Phase 2: PRD Stories**
   - Modify S4-T01 through S4-T05
   - Add S4-T06, S4-T07

3. **Phase 3: Prompts**
   - Update system prompts to reference validated constructs
   - Add construct definitions to extraction prompts

4. **Phase 4: Integration** (Implementation time)
   - Add Empath dependency
   - Build confirmation UI component

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Extraction prompts become too complex | Medium | Medium | Provide clear examples per domain |
| Too many signal types overwhelm synthesis | Medium | High | Aggregate to domain level for contract |
| Empath adds latency | Low | Low | Run in parallel with LLM |
| Users confused by "does this resonate?" | Medium | Medium | Make optional, end-of-phase only |

---

## Decision Required

Before proceeding, confirm:

1. **Option 1, 2, or 3?** (Full validated, SDT+Values only, or Status quo + validation)
2. **Empath or LIWC?** (Free vs gold standard)
3. **User confirmation UX?** (Every signal vs end-of-phase)
