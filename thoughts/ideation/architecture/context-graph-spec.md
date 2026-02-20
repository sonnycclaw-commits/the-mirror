# Context Graph Technical Specification

**Version:** 1.0
**Created:** 2026-01-14
**Status:** Draft — needs implementation validation

---

## Overview

The Context Graph is the unified data structure that creates S.T.A.R.S.'s moat. It combines previously scattered components into a single architectural concept.

### The Moat Thesis

```
ChatGPT has memory (flat key-value).
The Context Graph has understanding (structured behavioral accumulation).
```

| Capability | ChatGPT | Context Graph |
|------------|---------|---------------|
| Conversation | ✓ | ✓ |
| Memory | ✓ (flat) | ✓ (structured) |
| Behavioral tracking | ❌ | ✓ |
| Delta (said vs did) | ❌ | ✓ |
| Pattern prediction | ❌ | ✓ |
| Intervention timing | ❌ | ✓ |
| Temporal decay | ❌ | ✓ |

---

## Architecture

The Context Graph unifies five previously separate components:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CONTEXT GRAPH                                 │
│                                                                      │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │  1. NEO4J PROPERTY GRAPH                                     │   │
│   │     Nodes: Skills, Concepts, Traits                          │   │
│   │     Edges: REQUIRES, UNLOCKS, BLOCKS, ENABLES                │   │
│   │     Source: technical_architecture.md                        │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │  2. TEMPORAL KNOWLEDGE GRAPH                                 │   │
│   │     Episode storage with bi-temporal timestamps              │   │
│   │     Decay functions per edge type                            │   │
│   │     Source: Graphiti/Zep architecture                        │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │  3. BEHAVIORAL SIGNAL LAYER                                  │   │
│   │     Actions taken/skipped, follow-through %                  │   │
│   │     Integrations: Calendar, HealthKit, Screen Time           │   │
│   │     Source: life-os-unified-architecture.md                  │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │  4. PSYCHOMETRIC BELIEF STATE                                │   │
│   │     Bayesian updates from observations                       │   │
│   │     HEXACO + SDT + Loevinger                                 │   │
│   │     Source: technical_architecture.md                        │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │  5. STATE VECTOR TRACKING                                    │   │
│   │     s_t = [P, M, E, C, G]                                    │   │
│   │     Thrust vectors, trajectories                             │   │
│   │     Source: discovery-session-2026-01-14.md                  │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Node Types

### 1. STATED Nodes
What the user says — goals, fears, beliefs, values.

```typescript
interface StatedNode {
  id: string;
  user_id: string;
  subtype: 'goal' | 'fear' | 'belief' | 'value' | 'desire' | 'complaint';
  content: string;
  raw_excerpt: string;  // Original user words
  domain: 'health' | 'wealth' | 'relationships' | 'purpose' | 'soul';
  confidence: number;   // AI extraction confidence
  created_at: DateTime;
  status: 'active' | 'resolved' | 'superseded';
}
```

### 2. BEHAVIORAL Nodes
What the user does — actions taken, actions skipped, outcomes.

```typescript
interface BehavioralNode {
  id: string;
  user_id: string;
  subtype: 'action_taken' | 'action_skipped' | 'commitment_kept' | 'commitment_broken';
  content: string;
  commitment_id?: string;  // Links to original commitment
  observed_at: DateTime;   // When behavior occurred
  created_at: DateTime;    // When system recorded it
  source: 'self_report' | 'integration' | 'inferred';
  integration_source?: 'calendar' | 'healthkit' | 'screen_time';
}
```

### 3. EMOTIONAL Nodes
How the user feels — sentiment, resistance, breakthroughs.

```typescript
interface EmotionalNode {
  id: string;
  user_id: string;
  subtype: 'sentiment' | 'resistance' | 'breakthrough' | 'deflection';
  content: string;
  sentiment_score: number;  // -1 to 1
  markers: string[];        // e.g., ["but...", "I can't..."]
  created_at: DateTime;
}
```

### 4. TEMPORAL Nodes
Time-based patterns — computed aggregates, not raw observations.

```typescript
interface TemporalNode {
  id: string;
  user_id: string;
  pattern_type: 'day_of_week' | 'time_of_day' | 'after_event' | 'recovery_time' | 'decay_rate';
  pattern_key: string;      // e.g., "monday", "morning", "conflict_with_partner"
  pattern_value: any;       // Depends on type
  observation_count: number;
  confidence: number;
  first_observed_at: DateTime;
  last_observed_at: DateTime;
}
```

### 5. RELATIONAL Nodes
People and entities mentioned.

```typescript
interface RelationalNode {
  id: string;
  user_id: string;
  name: string;
  aliases: string[];
  entity_type: 'person' | 'organization' | 'place';
  relationship: string;     // e.g., 'partner', 'boss', 'friend'
  mention_count: number;
  avg_sentiment: number;    // -1 to 1
  last_mentioned_at: DateTime;
}
```

---

## Edge Types

### Core Edges

| Edge Type | From | To | Meaning |
|-----------|------|-----|---------|
| **CONTRADICTION** | STATED | BEHAVIORAL | Says X, does Y |
| **CAUSATION** | Any | Any | A reliably precedes/causes B |
| **CORRELATION** | Any | Any | A often co-occurs with B |
| **BLOCKS** | STATED (belief) | STATED (goal) | Belief prevents goal |
| **ENABLES** | EMOTIONAL | BEHAVIORAL | Insight leads to action |
| **SEQUENCE** | Any | Any | Temporal ordering |
| **MENTIONS** | Any | RELATIONAL | Signal references entity |

### Edge Properties

All edges include temporal and confidence metadata:

```typescript
interface Edge {
  id: string;
  user_id: string;
  from_node_id: string;
  to_node_id: string;
  edge_type: EdgeType;

  // Strength and confidence
  strength: number;           // 0-1, current weight
  initial_strength: number;   // Original weight when created
  confidence: number;         // AI confidence in edge
  evidence_count: number;     // Times observed

  // Evidence
  evidence: string;           // Why this edge exists

  // Bi-temporal timestamps (Graphiti pattern)
  created_at: DateTime;       // When system recorded
  expired_at: DateTime | null;// When invalidated (null = active)
  valid_from: DateTime;       // When fact became true
  valid_until: DateTime | null;// When fact stopped being true

  // Decay
  decay_half_life: number;    // Days until 50% weight
}
```

---

## Temporal Model

### Bi-Temporal Timestamps

Every edge has four timestamps (following Graphiti/Zep architecture):

```
┌─────────────────────────────────────────────────────────────────┐
│  EDGE: "User said family first" CONTRADICTS "Worked 70 hours"   │
├─────────────────────────────────────────────────────────────────┤
│  created_at:  2026-01-14T10:00:00  (system recorded)            │
│  expired_at:  null                 (still valid)                │
│  valid_from:  2026-01-10T00:00:00  (when behavior occurred)     │
│  valid_until: null                 (still contradicting)        │
└─────────────────────────────────────────────────────────────────┘
```

### Half-Life Decay

Different edge types decay at different rates:

```typescript
const HALF_LIVES: Record<string, number> = {
  // Identity (slow decay)
  'identity_belief': 180,      // 6 months
  'core_value': 180,

  // Patterns (medium decay)
  'behavioral_pattern': 30,    // 1 month
  'preference': 30,
  'causation': 21,             // 3 weeks

  // Momentary (fast decay)
  'sentiment': 7,              // 1 week
  'momentary_state': 1,        // 1 day
};

function getEdgeWeight(edge: Edge, now: DateTime): number {
  const ageDays = daysBetween(edge.valid_from, now);
  const halfLife = HALF_LIVES[edge.edge_type] ?? 30;
  return edge.initial_strength * Math.pow(0.5, ageDays / halfLife);
}
```

### Research Foundation

From discovery-session-2026-01-14.md:

```
Momentum(t) = M_0 × e^(-λ × t) + M_stable

Key findings:
- Median stabilization: 9-10 days
- 76% variance is individual
- λ_high = habits, discipline (fast decay)
- λ_low = identity shifts, beliefs (slow decay)
```

---

## State Vectors

### The P, M, E, C, G Model

From discovery-session-2026-01-14.md:

```typescript
interface StateVector {
  P: number;  // Physical (health, energy, body)
  M: number;  // Mental (cognition, focus, learning)
  E: number;  // Environmental (relationships, context, resources)
  C: number;  // Cognitive (beliefs, patterns, schemas)
  G: number;  // Goal Alignment (delta between stated and actual)
}
```

### Bayesian Identity Update

```
s_0' = s_0 + α × (outcome - expected)

where:
  α = learning rate (how much this changes self-belief)
  outcome = what actually happened (0 or 1)
  expected = what the model predicted
```

### Thrust Vector

```typescript
interface ThrustVector {
  direction: number[];  // Unit vector in state space
  magnitude: number;    // intensity × consistency × difficulty
}
```

---

## Prediction Algorithms

### Approach: Hybrid (Rule-Based + Bayesian + Granger)

| Layer | Purpose | When Used |
|-------|---------|-----------|
| **Rule-based** | Explicit user statements | "I want X" = goal node |
| **Bayesian** | Probabilistic inference | Updating beliefs from observations |
| **Granger causality** | Detect "X leads to Y" | After 3+ observations of sequence |

### Granger Causality Detection

```typescript
interface CausalEdge {
  from_type: string;
  to_type: string;
  avg_delay_hours: number;
  occurrence_count: number;
  confidence: number;
}

async function detectCausalEdges(
  observations: Observation[],
  minOccurrences: number = 3
): Promise<CausalEdge[]> {
  const sequences = extractTemporalSequences(observations);
  const candidates = new Map<string, number[]>();

  // Count A -> B sequences
  for (const seq of sequences) {
    for (let i = 0; i < seq.length - 1; i++) {
      const key = `${seq[i].type}|${seq[i+1].type}`;
      const delay = seq[i+1].timestamp - seq[i].timestamp;
      if (!candidates.has(key)) candidates.set(key, []);
      candidates.get(key)!.push(delay);
    }
  }

  // Filter by frequency and consistency
  return Array.from(candidates.entries())
    .filter(([_, delays]) => delays.length >= minOccurrences)
    .filter(([_, delays]) => stddev(delays) < mean(delays))  // Consistent timing
    .map(([key, delays]) => ({
      from_type: key.split('|')[0],
      to_type: key.split('|')[1],
      avg_delay_hours: mean(delays) / 3600000,
      occurrence_count: delays.length,
      confidence: delays.length / (delays.length + 3)  // Beta prior
    }));
}
```

### Prediction Types

```typescript
type PredictionType =
  | 'commitment_outcome'    // Will they keep this commitment?
  | 'vulnerability_window'  // When are they likely to slip?
  | 'trigger_alert'         // Something that historically causes problems
  | 'optimal_timing';       // Best time for intervention

interface Prediction {
  id: string;
  user_id: string;
  prediction_type: PredictionType;
  prediction: any;          // Type-specific payload
  confidence: number;
  evidence_signals: string[];
  valid_until: DateTime;
  outcome?: 'pending' | 'correct' | 'incorrect';
}
```

---

## Stickiness Quantification

### Formula

```typescript
interface StickinessScore {
  volume: number;        // 0-1, data quantity
  richness: number;      // 0-1, pattern diversity
  depth: number;         // 0-1, temporal coverage
  accuracy_lift: number; // 0-1, prediction improvement
  composite: number;     // Weighted sum
}

function calculateStickiness(graph: ContextGraph): StickinessScore {
  const volume = Math.log(graph.nodeCount + 1) / Math.log(10000);
  const richness = graph.uniqueEdgeTypes / 50;
  const depth = graph.daysCovered / 365;
  const accuracy_lift = graph.predictionAccuracy - 0.5;

  return {
    volume: clamp(volume, 0, 1),
    richness: clamp(richness, 0, 1),
    depth: clamp(depth, 0, 1),
    accuracy_lift: clamp(accuracy_lift * 2, 0, 1),
    composite: 0.2*volume + 0.3*richness + 0.2*depth + 0.3*accuracy_lift
  };
}
```

### Compound Value Over Time

```
Month 1:  Conversation + basic profile           (stickiness ~0.1)
Month 3:  Patterns emerge from behavior          (stickiness ~0.3)
Month 6:  Predictions become accurate            (stickiness ~0.5)
Month 12: Graph is irreplaceable                 (stickiness ~0.8)
```

---

## Implementation Options

### Option A: Minimal (Day 0 MVP)

| Factor | Value |
|--------|-------|
| **Storage** | Airtable (2 tables) |
| **Dev Time** | ~1 day |
| **Enables** | Basic follow-through %, profile generation |
| **Use When** | 30-day validation sprint |

### Option B: Core Product (V1)

| Factor | Value |
|--------|-------|
| **Storage** | PostgreSQL + pgvector |
| **Dev Time** | ~2 weeks |
| **Enables** | The Delta, pattern prediction, decay modeling |
| **Use When** | After validation, first 10k users |

### Option C: Platform Scale (V2+)

| Factor | Value |
|--------|-------|
| **Storage** | Neo4j + PostgreSQL hybrid |
| **Dev Time** | ~12 weeks |
| **Enables** | Cross-user patterns, network effects, enterprise |
| **Use When** | After PMF, 100k+ users |

**See:** `thoughts/shared/plans/context-graph-schema-plan.md` for full schemas.

---

## Visualization Relationship

### Context Graph ↔ Polar Star Map

The polar star map is the **user-facing view** of the context graph:

```
CONTEXT GRAPH (internal)          POLAR STAR MAP (user-facing)
─────────────────────────         ─────────────────────────────
Nodes (signals)            →      Stars (points on map)
Edges (relationships)      →      Lines (connections)
Temporal decay             →      Star brightness (fading)
Pattern predictions        →      Suggested pathways
State vectors (P,M,E,C,G)  →      Domain positions (θ axis)
Time                       →      Radial distance (r axis)
```

The user never sees "nodes" and "edges" — they see a constellation forming.

---

## Open Questions

### Technical
- [ ] PostgreSQL vs Neo4j cutover point — at what scale?
- [ ] Granger causality minimum observations — 3? 5? 10?
- [ ] Decay function validation — does half-life match user perception?

### Product
- [ ] How to communicate stickiness value without feeling manipulative?
- [ ] What's the "export my data" story? (Portable profile)
- [ ] How does Context Graph relate to GDPR right-to-delete?

### Mathematical
- [ ] State vector dimensionality — is P,M,E,C,G optimal?
- [ ] Bayesian prior selection — what are reasonable defaults?
- [ ] Cross-user pattern transfer — how much data before reliable?

---

## Source Files

This specification synthesizes:

| Component | Source File |
|-----------|-------------|
| Neo4j schema | `_deep_research/technical_architecture.md` |
| State vectors | `discovery-session-2026-01-14.md` |
| Decay math | `discovery-session-2026-01-14.md` |
| Signal extraction | `architecture/life-os-unified-architecture.md` |
| Bayesian updates | `_deep_research/technical_architecture.md` |
| Conceptual model | `visual/context-graph-model.md` |
| Schema options | `shared/plans/context-graph-schema-plan.md` |
| Research | `opc/.claude/cache/agents/oracle/output-20260114-224230.md` |

---

*This is the authoritative specification for the Context Graph. All future implementation should reference this document.*
