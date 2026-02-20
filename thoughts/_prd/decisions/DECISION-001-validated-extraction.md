# DECISION-001: Validated Signal Extraction Schema

**Status**: IMPLEMENTED
**Date**: 2026-01-18
**Implemented**: 2026-01-18
**Scope**: Clean break - replace existing taxonomy entirely

---

## Implementation Status

### Completed (2026-01-18)

All core files updated to use validated 7-domain taxonomy:

| File | Changes |
|------|---------|
| `convex/schema.ts` | Added `signalDomainEnum` (7 domains), `signalStateEnum`, updated `lifeDomainEnum` to UPPERCASE |
| `convex/signals.ts` | Complete rewrite with domain-based structure, added `listBySessionAndDomain`, `getDomainDistribution` |
| `src/lib/ai/tools/types.ts` | Shared Zod schemas for all domains, states, emotional context |
| `src/lib/ai/tools/extract-signal.ts` | Complete rewrite with detection markers in tool description |
| `src/lib/ai/tools/synthesize-profile.ts` | Updated with DECISION-001 psychometric profile schema |
| `convex/profiles.ts` | Updated with values, needs, dominantMotive, defenses, attachmentMarkers, development structure |
| `src/lib/discovery/prompt-builder.ts` | Updated Signal interface, EXCAVATION prompt with construct guidance |
| `src/lib/discovery/density-monitor.ts` | Updated extraction reminder with domain examples |
| `convex/memoryGraph.ts` | Updated `getSignalSummary` with domain/type/lifeDomain grouping, added `getDomainCoverage` |
| `convex/contracts.ts` | Updated evidence validator with `signalDomain`/`signalType` |
| `convex/discovery.ts` | Fixed signal extraction call, formattedSignals mapping, synthesizeProfile integration |

### Key Implementation Details

1. **Domain/Type/State Structure**: Signals now use `domain` (psychological category), `type` (specific construct), and `state` (SATISFIED/FRUSTRATED for NEED, STABLE/TRANSITIONING for DEVELOPMENT)

2. **Tool Description as Prompt Engineering**: Detection markers embedded directly in `extractSignal` tool description for Claude to reference during extraction

3. **Domain Coverage Checking**: `density-monitor.ts` checks for required domains (VALUE, NEED) and optional domains (DEFENSE, PATTERN, ATTACHMENT) before allowing synthesis

4. **Backwards Compatibility**: `legacyType` field preserved in schema for historical signals

### Pre-existing Issues (Not Caused by DECISION-001)

TypeScript has `exactOptionalPropertyTypes` strictness issues across the codebase (implicit undefined vs explicit undefined). These predate DECISION-001 and don't block functionality.

---

## Decision

Replace the ad-hoc signal taxonomy (`VALUE, FEAR, PATTERN, DEFENSE, GOAL`) with validated psychological constructs organized by domain.

**Approach**: Clean break. No backwards compatibility. Existing signals will be migrated or discarded during development.

---

## Rationale

1. **Research alignment**: `psychometric_frameworks.md` and `behaviour_change_science.md` already recommend validated frameworks
2. **Construct validity**: Schwartz values, SDT needs, Kegan stages have decades of research backing
3. **Reduced Barnum effect**: Specific constructs force precision over generic "insights"
4. **Early stage**: Minimal migration cost since implementation is incomplete

---

## The Schema

### Domain → Type Structure

```typescript
type Signal = {
  id: string
  sessionId: string

  // PRIMARY: Psychological domain
  domain: SignalDomain

  // SECONDARY: Specific construct within domain
  type: string // Constrained by domain

  // TERTIARY: State (for applicable domains)
  state?: 'SATISFIED' | 'FRUSTRATED' | 'HIGH' | 'LOW' | 'TRANSITIONING'

  // Evidence
  content: string      // The insight in plain language
  source: string       // Exact user quote
  confidence: number   // 0.0 - 1.0

  // Context
  emotionalContext?: EmotionalContext
  lifeDomain?: LifeDomain
  scenarioId?: string

  createdAt: number
}
```

### Signal Domains (7 total)

| Domain | Source Framework | Types | Notes |
|--------|-----------------|-------|-------|
| `VALUE` | Schwartz | 10 value types | What matters to them |
| `NEED` | Self-Determination Theory | 3 needs × 2 states | Autonomy, Competence, Relatedness |
| `MOTIVE` | McClelland | 3 motives | Achievement, Power, Affiliation |
| `DEFENSE` | Vaillant | 8 mechanisms | How they protect themselves |
| `ATTACHMENT` | Bowlby/Ainsworth | 4 styles | Relational patterns |
| `DEVELOPMENT` | Kegan | 3 stages | Meaning-making complexity |
| `PATTERN` | Behavioral observation | Free text | Observable behaviors |

---

## Domain Specifications

### 1. VALUE (Schwartz's 10 Basic Values)

```typescript
type SchwartzValue =
  | 'POWER'          // Social status, dominance over people/resources
  | 'ACHIEVEMENT'    // Personal success through competence
  | 'HEDONISM'       // Pleasure, sensuous gratification
  | 'STIMULATION'    // Excitement, novelty, challenge
  | 'SELF_DIRECTION' // Independent thought and action
  | 'UNIVERSALISM'   // Understanding, tolerance, protection for all
  | 'BENEVOLENCE'    // Preserving welfare of close others
  | 'TRADITION'      // Respect for customs and ideas
  | 'CONFORMITY'     // Restraint of actions that harm others
  | 'SECURITY'       // Safety, harmony, stability
```

**Detection Markers**:
- POWER: "I want to be in charge", "I need control", status references
- ACHIEVEMENT: "I want to succeed", competence language, goal orientation
- SELF_DIRECTION: "I want freedom", autonomy language, resists constraints
- SECURITY: "I need stability", risk aversion, safety seeking
- BENEVOLENCE: "I want to help", care for close others

### 2. NEED (Self-Determination Theory)

```typescript
type SDTNeed = 'AUTONOMY' | 'COMPETENCE' | 'RELATEDNESS'
type SDTState = 'SATISFIED' | 'FRUSTRATED'

// Combined signal
{ domain: 'NEED', type: 'AUTONOMY', state: 'FRUSTRATED' }
```

**Detection Markers**:
- AUTONOMY frustrated: "I had to", "They made me", "I had no choice", "I felt trapped"
- COMPETENCE frustrated: "I can't", "I don't know how", "It's too hard", "I'm not good enough"
- RELATEDNESS frustrated: "No one understands", "I'm alone", "I feel disconnected"

### 3. MOTIVE (McClelland's Needs)

```typescript
type McClellandMotive = 'ACHIEVEMENT' | 'POWER' | 'AFFILIATION'
```

**Detection Markers**:
- ACHIEVEMENT: Task orientation, feedback seeking, moderate risk taking
- POWER: Influence language, leadership themes, impact focus
- AFFILIATION: Harmony seeking, relationship prioritization, approval needs

### 4. DEFENSE (Vaillant's Hierarchy)

```typescript
type DefenseMechanism =
  // Immature
  | 'DENIAL'              // Refusing to accept reality
  | 'PROJECTION'          // Attributing own feelings to others
  | 'DISPLACEMENT'        // Redirecting emotion to safer target
  // Neurotic
  | 'RATIONALIZATION'     // Creating logical justification
  | 'INTELLECTUALIZATION' // Avoiding emotions via analysis
  // Mature
  | 'SUBLIMATION'         // Channeling into productive activity
  | 'HUMOR'               // Finding comedy in difficulty
  | 'ANTICIPATION'        // Realistic planning for future discomfort
```

**Detection Markers**:
- DENIAL: "It's not that bad", minimization
- RATIONALIZATION: "Work is more important anyway", logical justification
- PROJECTION: "They probably didn't want to see me"
- INTELLECTUALIZATION: "Let me research this more", avoiding feeling
- SUBLIMATION: Exercise after frustration (healthy channeling)

### 5. ATTACHMENT (Bowlby/Ainsworth)

```typescript
type AttachmentStyle = 'SECURE' | 'ANXIOUS' | 'AVOIDANT' | 'DISORGANIZED'
```

**Detection Markers**:
- SECURE: Balanced stories about relationships, acknowledges both good and bad
- ANXIOUS: Rambling, caught up in past, overwhelming detail, fear of abandonment
- AVOIDANT: Short answers, dismissive ("It was fine"), lack of specific memories
- DISORGANIZED: Contradictory statements, unresolved trauma references

### 6. DEVELOPMENT (Kegan's Stages)

```typescript
type KeganStage = 'SOCIALIZED' | 'SELF_AUTHORING' | 'SELF_TRANSFORMING'
type DevelopmentState = 'STABLE' | 'TRANSITIONING'
```

**Detection Markers**:
- SOCIALIZED (Stage 3): "What will they think?", identity defined by others, can't separate self from relationships
- SELF_AUTHORING (Stage 4): "I decided this matters to me", internal compass, can take perspective on relationships
- SELF_TRANSFORMING (Stage 5): "I can see how my view created this", holds paradox, sees self as evolving

### 7. PATTERN (Behavioral Observation)

```typescript
// Free-form behavioral patterns observed across scenarios
type Pattern = {
  domain: 'PATTERN'
  type: string // e.g., "conflict_avoidance", "productive_procrastination"
  content: string
}
```

Common patterns to look for:
- `people_pleasing`: Prioritizes others' needs over own
- `conflict_avoidance`: Avoids difficult conversations
- `productive_procrastination`: Activity that feels productive but avoids real work
- `intention_gap`: Intend to do X, don't follow through
- `burst_crash`: High intensity start, rapid burnout
- `perfectionism`: Waits for conditions to be "right"

---

## Supporting Enums

### Emotional Context

```typescript
type EmotionalContext =
  | 'NEUTRAL'
  | 'DEFENSIVE'
  | 'VULNERABLE'
  | 'RESISTANT'
  | 'OPEN'
  | 'CONFLICTED'
```

### Life Domain

```typescript
type LifeDomain =
  | 'WORK'
  | 'RELATIONSHIPS'
  | 'HEALTH'
  | 'PERSONAL_GROWTH'
  | 'FINANCE'
  | 'GENERAL'
```

---

## Profile Synthesis Schema

When synthesizing, aggregate signals into validated structures:

```typescript
interface PsychometricProfile {
  // Schwartz Values (ranked by evidence)
  values: {
    primary: SchwartzValue[]   // Top 3 with strong evidence
    secondary: SchwartzValue[] // Supporting values
  }

  // SDT Needs Assessment
  needs: {
    autonomy: { state: SDTState; evidence: string; intensity: number }
    competence: { state: SDTState; evidence: string; intensity: number }
    relatedness: { state: SDTState; evidence: string; intensity: number }
  }

  // Dominant Motive
  dominantMotive: {
    type: McClellandMotive
    evidence: string[]
  }

  // Defense Profile
  defenses: {
    primary: DefenseMechanism[]
    maturityLevel: 'IMMATURE' | 'NEUROTIC' | 'MATURE'
  }

  // Attachment Indication
  attachmentMarkers: {
    style: AttachmentStyle
    confidence: number
    evidence: string[]
  }

  // Developmental Stage
  development: {
    stage: KeganStage
    state: DevelopmentState
    evidence: string[]
  }

  // Behavioral Patterns
  patterns: {
    name: string
    frequency: 'CORE' | 'FREQUENT' | 'OCCASIONAL'
    evidence: string[]
    domain?: LifeDomain
  }[]

  // Contradictions (cross-domain)
  contradictions: {
    stated: string
    actual: string
    impact: string
  }[]

  // The Mirror Statement
  mirrorStatement: string
}
```

---

## Tool Updates

### extractSignal Tool

```typescript
const extractSignalSchema = z.object({
  domain: z.enum([
    'VALUE', 'NEED', 'MOTIVE', 'DEFENSE',
    'ATTACHMENT', 'DEVELOPMENT', 'PATTERN'
  ]),

  type: z.string().describe('Specific construct (e.g., AUTONOMY, ACHIEVEMENT, DENIAL)'),

  state: z.enum(['SATISFIED', 'FRUSTRATED', 'HIGH', 'LOW', 'TRANSITIONING'])
    .optional()
    .describe('For NEED and DEVELOPMENT domains'),

  content: z.string()
    .describe('The insight in plain language'),

  source: z.string()
    .describe('EXACT user quote that evidences this'),

  confidence: z.number().min(0).max(1),

  emotionalContext: z.enum([
    'NEUTRAL', 'DEFENSIVE', 'VULNERABLE', 'RESISTANT', 'OPEN', 'CONFLICTED'
  ]).optional(),

  lifeDomain: z.enum([
    'WORK', 'RELATIONSHIPS', 'HEALTH', 'PERSONAL_GROWTH', 'FINANCE', 'GENERAL'
  ]).optional(),
})
```

### Tool Description Update

```markdown
## What to Extract

### VALUES (Schwartz)
Look for what fundamentally matters:
- POWER: "I want control", status seeking
- ACHIEVEMENT: "I want to succeed", competence focus
- SELF_DIRECTION: "I want freedom", autonomy seeking
- SECURITY: "I need stability", risk aversion
- BENEVOLENCE: "I want to help", care for close others
- UNIVERSALISM: "I believe in fairness", concern for all people

### NEEDS (SDT)
Detect frustration or satisfaction:
- "I had to" / "They made me" → NEED: AUTONOMY, FRUSTRATED
- "I can't" / "I don't know how" → NEED: COMPETENCE, FRUSTRATED
- "No one understands" → NEED: RELATEDNESS, FRUSTRATED

### DEFENSES (Vaillant)
How do they protect themselves?
- "It's not that bad" → DEFENSE: DENIAL
- "Work is more important" → DEFENSE: RATIONALIZATION
- "Let me research more" → DEFENSE: INTELLECTUALIZATION

### ATTACHMENT (Bowlby)
Listen to how they talk about relationships:
- Balanced, acknowledges bad → ATTACHMENT: SECURE
- Overwhelming detail, anxiety → ATTACHMENT: ANXIOUS
- Dismissive, "it was fine" → ATTACHMENT: AVOIDANT

### DEVELOPMENT (Kegan)
Listen to HOW they make meaning:
- "What will they think?" → DEVELOPMENT: SOCIALIZED
- "I decided this matters" → DEVELOPMENT: SELF_AUTHORING
- "Both views are valid" → DEVELOPMENT: SELF_TRANSFORMING
```

---

## Optional: Empath Integration

**Decision**: Defer to v1.1. Ship validated taxonomy first.

When implemented:
```typescript
// Pre-process user message
const empathCategories = analyzeMessage(userMessage)

// Inject into prompt
`Empath word categories for context: ${JSON.stringify(empathCategories)}`

// Cross-validate: If Empath shows high anxiety but Claude extracts SECURE attachment, flag for review
```

---

## Optional: User Confirmation

**Decision**: Implement end-of-phase confirmation only.

At end of EXCAVATION phase:
```
"Before we move on, I want to check: I noticed you seem to value [ACHIEVEMENT] highly,
but feel frustrated in your sense of [AUTONOMY]. Does that resonate?"
```

Store confirmation:
```typescript
{
  signalId: string,
  confirmed: boolean,
  userRefinement?: string
}
```

---

## Migration Path

Since we're doing a clean break:

1. ~~**Drop existing signals** in development database~~
2. ✅ **Update schema** with new domain/type structure (`convex/schema.ts`)
3. ✅ **Update tools** with validated constructs (`extract-signal.ts`, `synthesize-profile.ts`)
4. ✅ **Update prompts** with detection guidance (`prompt-builder.ts`, `density-monitor.ts`)
5. **Test extraction** on sample conversations - *PENDING*
6. **Validate** that signals match expected constructs - *PENDING*

No migration script needed - fresh start.

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Domain coverage | All 7 domains extracted per session | Count distinct domains |
| Schwartz value precision | User confirms 80%+ | End-of-phase confirmation |
| SDT need accuracy | User confirms 80%+ | End-of-phase confirmation |
| Signal density | 2.5+ signals per scenario | Density monitor |
| Barnum avoidance | <20% generic extractions | Manual review of "PATTERN" domain usage |

---

## References

- Schwartz, S. H. (1992). Universals in the content and structure of values
- Deci, E. L., & Ryan, R. M. (2000). Self-Determination Theory
- McClelland, D. C. (1961). The Achieving Society
- Vaillant, G. E. (1977). Adaptation to Life
- Bowlby, J. (1969). Attachment and Loss
- Kegan, R. (1982). The Evolving Self
