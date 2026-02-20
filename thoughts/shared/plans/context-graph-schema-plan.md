# Context Graph Schema Design

**Created:** 2026-01-14  
**Author:** architect-agent  
**Purpose:** Three schema options for S.T.A.R.S. Context Graph (simple to complex)

---

## Overview

The Context Graph is the moat. ChatGPT has conversation memory; S.T.A.R.S. has **structured behavioral accumulation** that enables predictions ChatGPT cannot make.

### Core Principle
```
SIGNALS → STRUCTURE → PREDICTIONS
   │          │            │
   │          │            └─ "You always skip after conflict"
   │          └─ Edges: contradictions, causes, blockers
   └─ Nodes: stated, behavioral, emotional, temporal, relational
```

---

## Option A: Minimal (Day 0 MVP)

**Philosophy:** The smallest graph that validates the hypothesis. No graph database needed.

### Storage: Airtable + Simple JSON

Total: **2 tables, 0 edges computed live**

```
┌─────────────────────────────────────────────────────────────┐
│  AIRTABLE SCHEMA                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Table: signals                                             │
│  ├─ id (auto)                                               │
│  ├─ user_email (text)                                       │
│  ├─ timestamp (datetime)                                    │
│  ├─ signal_type (select: GOAL | BLOCKER | COMMITMENT |      │
│  │                       OUTCOME | SENTIMENT)               │
│  ├─ content (long text) — what they said                    │
│  ├─ outcome (select: null | YES | NO | PARTIAL)             │
│  ├─ sentiment (1-5)                                         │
│  └─ session_id (text) — groups signals by conversation      │
│                                                             │
│  Table: users                                               │
│  ├─ email (primary)                                         │
│  ├─ created_at (datetime)                                   │
│  ├─ last_session (datetime)                                 │
│  ├─ total_commitments (number)                              │
│  ├─ commitments_kept (number)                               │
│  └─ profile_summary (long text) — AI-generated              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Node Types (Minimal)

| Type | Source | Captured As |
|------|--------|-------------|
| **GOAL** | "I want to wake up early" | signal row |
| **BLOCKER** | "I struggle with mornings" | signal row |
| **COMMITMENT** | "I'll wake at 6am Monday" | signal row |
| **OUTCOME** | Did they do it? Y/N | outcome column on commitment row |
| **SENTIMENT** | How did it feel? 1-5 | sentiment column |

### Edge Types (None Stored)

Edges are computed at query time or not at all.

**The only "edge" that matters in Day 0:**
```
COMMITMENT ──[followed_by]──> OUTCOME (Y/N)
```

This is captured as columns on the same row, not as a separate edge.

### Temporal Model

- **All timestamps stored**: Created_at on every signal
- **No decay calculated**: Too early to model
- **Session grouping**: Same session_id = same conversation

### Query Patterns Needed

```sql
-- 1. User's follow-through rate
SELECT 
  (commitments_kept / NULLIF(total_commitments, 0)) * 100 AS follow_through_rate
FROM users WHERE email = ?

-- 2. All goals for a user
SELECT * FROM signals 
WHERE user_email = ? AND signal_type = 'GOAL'
ORDER BY timestamp DESC

-- 3. Recent outcomes
SELECT content, outcome, sentiment, timestamp FROM signals
WHERE user_email = ? AND outcome IS NOT NULL
ORDER BY timestamp DESC LIMIT 10
```

### What This Enables

1. **Basic Delta**: "You said you'd wake at 6am. Did you?"
2. **Follow-through %**: "You've kept 60% of your commitments"
3. **Profile Generation**: Claude reads all signals, generates summary
4. **Sentiment Trend**: "Your average feeling after taking action: 3.8/5"

### What This Does NOT Enable

- Pattern prediction ("you skip after conflicts")
- Temporal correlations ("Mondays are your vulnerability")
- Relationship mapping
- Blocker-to-action linking
- Decay modeling

### Complexity Cost

| Factor | Estimate |
|--------|----------|
| Setup time | 2-3 hours |
| Dev time (write signals) | 4 hours |
| Dev time (read signals) | 2 hours |
| Maintenance | Near zero |
| **Total** | **~1 day** |

### When to Use

- **Day 0 MVP**: 30-day validation sprint
- **Kill threshold testing**: Before building anything complex
- **Concierge testing**: Manual tracking with structure

### Upgrade Path

When metrics pass validation thresholds, migrate signals table to Postgres and add edge table.

---

## Option B: Core Product (V1)

**Philosophy:** Full behavioral tracking with temporal edges. Enables pattern prediction.

### Storage: PostgreSQL + pgvector

Why Postgres (not Neo4j yet):
- Team familiarity
- pgvector for semantic search
- Temporal extensions available
- Can add graph views later

### Schema

```sql
-- ============================================================================
-- NODES: 5 types from context-graph-model.md
-- ============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ,
    profile_summary JSONB,  -- AI-generated, cached
    follow_through_rate FLOAT DEFAULT 0.0,
    total_signals INTEGER DEFAULT 0
);

-- Unified signals table (polymorphic node storage)
CREATE TABLE signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- Node type discrimination
    signal_type TEXT NOT NULL CHECK (signal_type IN (
        'STATED',      -- Goals, values, fears, beliefs
        'BEHAVIORAL',  -- Actions taken, actions skipped
        'EMOTIONAL',   -- Sentiment, resistance, breakthrough
        'TEMPORAL',    -- Time patterns (computed, not raw)
        'RELATIONAL'   -- People mentioned
    )),
    
    -- Subtype for finer discrimination
    subtype TEXT,  -- 'goal', 'fear', 'belief', 'action_taken', 'action_skipped', etc.
    
    -- Content
    content TEXT NOT NULL,
    raw_excerpt TEXT,  -- Original user words
    
    -- Metadata
    session_id UUID,
    message_index INTEGER,  -- Position in conversation
    
    -- AI extraction metadata
    confidence FLOAT DEFAULT 1.0,  -- AI's confidence in extraction
    extraction_model TEXT,  -- Which model extracted this
    
    -- Temporal
    created_at TIMESTAMPTZ DEFAULT NOW(),
    observed_at TIMESTAMPTZ,  -- When behavior occurred (may differ from created_at)
    
    -- State
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'superseded')),
    
    -- Vector for semantic matching
    embedding vector(1024)  -- BGE-large dimension
);

CREATE INDEX idx_signals_user ON signals(user_id);
CREATE INDEX idx_signals_type ON signals(user_id, signal_type);
CREATE INDEX idx_signals_session ON signals(session_id);
CREATE INDEX idx_signals_embedding ON signals USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Commitments (special case: tracked outcomes)
CREATE TABLE commitments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    signal_id UUID REFERENCES signals(id),  -- The STATED signal that created this
    
    -- What was committed
    description TEXT NOT NULL,
    domain TEXT,  -- 'health', 'wealth', 'relationships', 'purpose', 'soul'
    
    -- Temporal
    committed_at TIMESTAMPTZ DEFAULT NOW(),
    due_at TIMESTAMPTZ,  -- When it should happen
    window_hours INTEGER DEFAULT 24,  -- Grace period
    
    -- Outcome
    outcome TEXT CHECK (outcome IN ('pending', 'kept', 'broken', 'partial', 'expired')),
    outcome_at TIMESTAMPTZ,
    outcome_sentiment INTEGER CHECK (outcome_sentiment BETWEEN 1 AND 5),
    outcome_notes TEXT,
    
    -- Metadata
    reminder_sent BOOLEAN DEFAULT FALSE,
    follow_up_sent BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_commitments_user ON commitments(user_id);
CREATE INDEX idx_commitments_pending ON commitments(user_id, outcome) WHERE outcome = 'pending';
CREATE INDEX idx_commitments_due ON commitments(due_at) WHERE outcome = 'pending';

-- Entities (people mentioned)
CREATE TABLE entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- Identity
    name TEXT NOT NULL,
    aliases TEXT[],  -- Alternative names/references
    entity_type TEXT DEFAULT 'person' CHECK (entity_type IN ('person', 'organization', 'place')),
    
    -- Relationship to user
    relationship TEXT,  -- 'partner', 'boss', 'friend', 'family'
    
    -- Aggregated sentiment
    mention_count INTEGER DEFAULT 0,
    avg_sentiment FLOAT,  -- -1 to 1
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_mentioned_at TIMESTAMPTZ,
    
    UNIQUE(user_id, name)
);

CREATE INDEX idx_entities_user ON entities(user_id);

-- ============================================================================
-- EDGES: Relationships between signals
-- ============================================================================

CREATE TABLE edges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- Edge endpoints
    from_signal_id UUID NOT NULL REFERENCES signals(id),
    to_signal_id UUID NOT NULL REFERENCES signals(id),
    
    -- Edge type
    edge_type TEXT NOT NULL CHECK (edge_type IN (
        'CONTRADICTION',  -- Said X, did Y
        'CAUSATION',      -- A caused B
        'CORRELATION',    -- A often co-occurs with B
        'BLOCKS',         -- A blocks B
        'ENABLES',        -- A enables B
        'MENTIONS',       -- Signal mentions entity
        'SEQUENCE'        -- A came before B in time
    )),
    
    -- Strength and confidence
    strength FLOAT DEFAULT 1.0,  -- 0-1
    confidence FLOAT DEFAULT 1.0,  -- AI confidence
    
    -- Evidence
    evidence TEXT,  -- Why this edge exists
    evidence_count INTEGER DEFAULT 1,  -- How many times observed
    
    -- Temporal
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_observed_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Decay tracking
    initial_strength FLOAT DEFAULT 1.0,
    decay_rate FLOAT DEFAULT 0.1,  -- Per day
    
    UNIQUE(from_signal_id, to_signal_id, edge_type)
);

CREATE INDEX idx_edges_user ON edges(user_id);
CREATE INDEX idx_edges_from ON edges(from_signal_id);
CREATE INDEX idx_edges_to ON edges(to_signal_id);
CREATE INDEX idx_edges_type ON edges(user_id, edge_type);

-- Entity mentions (links signals to entities)
CREATE TABLE entity_mentions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    signal_id UUID NOT NULL REFERENCES signals(id),
    entity_id UUID NOT NULL REFERENCES entities(id),
    
    -- Context
    sentiment FLOAT,  -- -1 to 1 in this mention
    excerpt TEXT,  -- The part mentioning them
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(signal_id, entity_id)
);

CREATE INDEX idx_mentions_signal ON entity_mentions(signal_id);
CREATE INDEX idx_mentions_entity ON entity_mentions(entity_id);

-- ============================================================================
-- TEMPORAL PATTERNS (Computed aggregates)
-- ============================================================================

CREATE TABLE temporal_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    
    pattern_type TEXT NOT NULL CHECK (pattern_type IN (
        'day_of_week',     -- e.g., "low energy Mondays"
        'time_of_day',     -- e.g., "productive mornings"
        'after_event',     -- e.g., "skip after conflict"
        'recovery_time',   -- e.g., "bounces back in 5 days"
        'decay_rate'       -- e.g., "motivation decays 40% faster than average"
    )),
    
    -- Pattern details
    pattern_key TEXT,  -- e.g., "monday", "morning", "conflict_with_partner"
    pattern_value JSONB,  -- Depends on type
    
    -- Statistical strength
    observation_count INTEGER DEFAULT 0,
    confidence FLOAT DEFAULT 0.0,
    
    -- Timing
    first_observed_at TIMESTAMPTZ,
    last_observed_at TIMESTAMPTZ,
    
    UNIQUE(user_id, pattern_type, pattern_key)
);

CREATE INDEX idx_patterns_user ON temporal_patterns(user_id);

-- ============================================================================
-- PREDICTIONS (What the graph reveals)
-- ============================================================================

CREATE TABLE predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- What's predicted
    prediction_type TEXT NOT NULL CHECK (prediction_type IN (
        'commitment_outcome',  -- Will they keep this commitment?
        'vulnerability_window',  -- When are they likely to slip?
        'trigger_alert',  -- Something that historically causes problems
        'optimal_timing'  -- Best time for intervention
    )),
    
    -- Prediction content
    prediction JSONB NOT NULL,
    
    -- Confidence
    confidence FLOAT NOT NULL,
    evidence_signals UUID[],  -- Signals that led to this prediction
    
    -- Timing
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,  -- Prediction expires
    
    -- Outcome tracking
    outcome TEXT CHECK (outcome IN ('pending', 'correct', 'incorrect')),
    outcome_at TIMESTAMPTZ
);

CREATE INDEX idx_predictions_user ON predictions(user_id);
CREATE INDEX idx_predictions_active ON predictions(user_id, valid_until) WHERE outcome = 'pending';

-- ============================================================================
-- HELPER VIEWS
-- ============================================================================

-- The Delta: Stated vs Behavioral contradictions
CREATE VIEW v_contradictions AS
SELECT 
    e.user_id,
    s1.content AS stated,
    s2.content AS behavioral,
    e.strength,
    e.evidence,
    e.last_observed_at
FROM edges e
JOIN signals s1 ON e.from_signal_id = s1.id
JOIN signals s2 ON e.to_signal_id = s2.id
WHERE e.edge_type = 'CONTRADICTION'
  AND s1.signal_type = 'STATED'
  AND s2.signal_type = 'BEHAVIORAL';

-- Follow-through by domain
CREATE VIEW v_follow_through_by_domain AS
SELECT 
    user_id,
    domain,
    COUNT(*) FILTER (WHERE outcome = 'kept') AS kept,
    COUNT(*) FILTER (WHERE outcome = 'broken') AS broken,
    COUNT(*) FILTER (WHERE outcome = 'partial') AS partial,
    COUNT(*) AS total,
    ROUND(
        COUNT(*) FILTER (WHERE outcome = 'kept')::numeric / NULLIF(COUNT(*), 0) * 100, 
        1
    ) AS follow_through_pct
FROM commitments
WHERE outcome != 'pending'
GROUP BY user_id, domain;

-- Entity relationship quality
CREATE VIEW v_entity_relationships AS
SELECT 
    e.user_id,
    e.name,
    e.relationship,
    e.mention_count,
    e.avg_sentiment,
    CASE 
        WHEN e.avg_sentiment > 0.3 THEN 'support'
        WHEN e.avg_sentiment < -0.3 THEN 'blocker'
        ELSE 'neutral'
    END AS relationship_quality
FROM entities e
WHERE e.mention_count >= 3;
```

### Edge Types (Full)

| Edge | From | To | Meaning |
|------|------|------|---------|
| **CONTRADICTION** | STATED | BEHAVIORAL | Says X, does Y |
| **CAUSATION** | Any | Any | A reliably precedes/causes B |
| **CORRELATION** | Any | Any | A often co-occurs with B |
| **BLOCKS** | STATED (belief) | STATED (goal) | Belief prevents goal |
| **ENABLES** | EMOTIONAL (breakthrough) | BEHAVIORAL (action) | Insight leads to action |
| **SEQUENCE** | Any | Any | Temporal ordering |

### Temporal Model

```
Edge Strength Over Time:
  strength(t) = initial_strength * e^(-decay_rate * days_since_last_observed)

User-Personalized Decay:
  decay_rate = base_rate * user_decay_multiplier

Pattern Detection:
  - After 3+ observations of A→B, create CAUSATION edge
  - Strength increases with each observation
  - Confidence = observations / (observations + 3)  [Beta prior]
```

### Cypher-Style Queries (Pseudo-SQL)

```sql
-- 1. Find all contradictions for a user
SELECT * FROM v_contradictions WHERE user_id = ?;

-- 2. What blocks a specific goal?
SELECT s2.content AS blocker, e.strength
FROM signals s1
JOIN edges e ON e.to_signal_id = s1.id
JOIN signals s2 ON e.from_signal_id = s2.id
WHERE s1.user_id = ? 
  AND s1.content ILIKE '%exercise%'
  AND e.edge_type = 'BLOCKS';

-- 3. Predict commitment outcome based on patterns
SELECT 
    c.description,
    tp.pattern_key,
    tp.pattern_value,
    CASE 
        WHEN EXTRACT(DOW FROM c.due_at) = tp.pattern_key::int THEN 'HIGH RISK'
        ELSE 'NORMAL'
    END AS risk_level
FROM commitments c
LEFT JOIN temporal_patterns tp ON tp.user_id = c.user_id 
    AND tp.pattern_type = 'day_of_week'
WHERE c.outcome = 'pending';

-- 4. Who is a support vs blocker?
SELECT * FROM v_entity_relationships 
WHERE user_id = ? 
ORDER BY relationship_quality, mention_count DESC;

-- 5. What enables action for this user?
SELECT s1.content AS enabler, s2.content AS action, e.evidence_count
FROM edges e
JOIN signals s1 ON e.from_signal_id = s1.id
JOIN signals s2 ON e.to_signal_id = s2.id
WHERE e.user_id = ? AND e.edge_type = 'ENABLES'
ORDER BY e.evidence_count DESC LIMIT 10;
```

### What This Enables

1. **The Delta**: Surface said-vs-did contradictions automatically
2. **Pattern Prediction**: "You skip workouts after partner conflicts"
3. **Intervention Timing**: "Check in on Wednesday, not Friday"
4. **Relationship Mapping**: "Partner mentions are 60% negative"
5. **Blocker Detection**: "I'm not athletic" blocks "exercise goal"
6. **Personalized Decay**: Learn each user's momentum fade rate

### Complexity Cost

| Factor | Estimate |
|--------|----------|
| Schema setup | 4 hours |
| Signal extraction (AI) | 16 hours |
| Edge detection (AI) | 16 hours |
| Pattern computation | 8 hours |
| Query layer | 8 hours |
| Testing | 8 hours |
| **Total** | **~2 weeks** |

### When to Use

- **After Day 0 validation passes**
- **V1 product build**
- **First 1,000 users**

---

## Option C: Platform Scale (V2+)

**Philosophy:** Multi-user relationship mapping, cross-user pattern learning, enterprise features.

### Storage: Neo4j + PostgreSQL Hybrid

Why Neo4j now:
- Native graph traversals
- Cross-user pattern mining
- Relationship-first queries
- Graph algorithms built-in

Architecture:
```
┌─────────────────────────────────────────────────────────────┐
│  PostgreSQL                     │  Neo4j                    │
│  (Source of truth)              │  (Graph analytics)        │
├─────────────────────────────────┼───────────────────────────┤
│  • Users table                  │  • User nodes             │
│  • Signals table                │  • Signal nodes           │
│  • Commitments table            │  • Entity nodes           │
│  • Auth/sessions                │  • All edges              │
│                                 │  • Cross-user patterns    │
│  CDC → Debezium → Kafka → ──────┼→ Neo4j Ingestion          │
└─────────────────────────────────┴───────────────────────────┘
```

### Neo4j Schema

```cypher
// ============================================================================
// NODE TYPES
// ============================================================================

// User node
CREATE CONSTRAINT user_unique IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE;

(:User {
    id: $pg_user_id,
    email: $email,
    created_at: datetime(),
    follow_through_rate: 0.65,
    decay_multiplier: 1.2,  // Compared to average
    tier: 'individual'  // or 'team', 'enterprise'
})

// Signal nodes (by type)
CREATE CONSTRAINT signal_unique IF NOT EXISTS FOR (s:Signal) REQUIRE s.id IS UNIQUE;

(:Goal:Signal {
    id: $pg_signal_id,
    content: "Wake up early",
    domain: "health",
    created_at: datetime(),
    status: "active"
})

(:Behavior:Signal {
    id: $pg_signal_id,
    content: "Worked 70 hours",
    behavior_type: "action_taken",
    created_at: datetime()
})

(:Emotion:Signal {
    id: $pg_signal_id,
    content: "Feeling overwhelmed",
    sentiment: -0.6,
    created_at: datetime()
})

(:Belief:Signal {
    id: $pg_signal_id,
    content: "I'm not a morning person",
    belief_domain: "identity",
    created_at: datetime()
})

// Entity nodes (people)
CREATE CONSTRAINT entity_unique IF NOT EXISTS FOR (e:Entity) REQUIRE e.id IS UNIQUE;

(:Person:Entity {
    id: $pg_entity_id,
    name: "Partner",
    relationship: "spouse",
    avg_sentiment: -0.2
})

// Pattern nodes (cross-user learned patterns)
CREATE CONSTRAINT pattern_unique IF NOT EXISTS FOR (p:Pattern) REQUIRE p.id IS UNIQUE;

(:Pattern {
    id: $pattern_id,
    description: "Conflict with partner precedes skipped commitments",
    occurrence_count: 847,  // Across all users
    confidence: 0.73,
    discovered_at: datetime()
})

// ============================================================================
// EDGE TYPES
// ============================================================================

// User owns signals
(u:User)-[:OWNS]->(s:Signal)

// Contradiction edge
(stated:Goal)-[:CONTRADICTS {
    strength: 0.8,
    evidence: "Said family first, worked 70 hours",
    observed_count: 3,
    last_observed: datetime()
}]->(behavior:Behavior)

// Causation edge
(trigger:Signal)-[:CAUSES {
    strength: 0.7,
    lag_hours: 24,
    observed_count: 5
}]->(effect:Signal)

// Blocks edge
(belief:Belief)-[:BLOCKS {
    strength: 0.9,
    evidence: "Identity conflict"
}]->(goal:Goal)

// Enables edge
(breakthrough:Emotion)-[:ENABLES {
    strength: 0.6,
    lag_hours: 48
}]->(action:Behavior)

// Entity mentions
(signal:Signal)-[:MENTIONS {
    sentiment: -0.4,
    excerpt: "argument with partner"
}]->(person:Person)

// User relationship (multi-user)
(u1:User)-[:KNOWS {
    relationship: "partner",
    since: date()
}]->(u2:User)

// Pattern application
(p:Pattern)-[:APPLIES_TO {
    fit_score: 0.82
}]->(u:User)

// ============================================================================
// CROSS-USER PATTERNS (Platform-Level Learning)
// ============================================================================

// Pattern nodes aggregate across users
(:Pattern {
    id: "pattern_conflict_skip",
    pattern_type: "trigger_sequence",
    description: "Conflict with partner → skip commitment within 72h",
    triggers: ["conflict", "argument", "fight"],
    effects: ["skip", "missed", "forgot"],
    avg_lag_hours: 48,
    occurrence_count: 1247,
    user_count: 312,
    confidence: 0.71
})

// Link patterns to users who exhibit them
(p:Pattern)-[:EXHIBITS {
    first_observed: datetime(),
    observation_count: 4,
    personal_strength: 0.85
}]->(u:User)
```

### Multi-User Relationship Mapping

```cypher
// When two users are in a relationship:
(alice:User)-[:PARTNER_OF {since: date('2020-01-01')}]->(bob:User)

// Cross-reference their signals:
MATCH (alice:User)-[:PARTNER_OF]->(bob:User)
MATCH (alice)-[:OWNS]->(as:Signal)
MATCH (bob)-[:OWNS]->(bs:Signal)
WHERE as.created_at > datetime() - duration('P7D')
  AND bs.created_at > datetime() - duration('P7D')
  AND as.content CONTAINS 'argument'
  AND bs.content CONTAINS 'stressed'
RETURN as, bs

// This enables: "Alice mentioned argument on Tuesday. 
// Bob mentioned feeling stressed on Wednesday. Pattern detected."
```

### Cross-User Pattern Learning

```cypher
// Find common patterns across users
MATCH (u:User)-[:OWNS]->(trigger:Signal)
MATCH (u)-[:OWNS]->(effect:Signal)
WHERE trigger.signal_type = 'EMOTIONAL' 
  AND trigger.sentiment < -0.5
  AND effect.signal_type = 'BEHAVIORAL'
  AND effect.behavior_type = 'action_skipped'
  AND effect.created_at > trigger.created_at
  AND effect.created_at < trigger.created_at + duration('P3D')
WITH trigger.content AS trigger_content, 
     effect.content AS effect_content,
     COUNT(DISTINCT u) AS user_count
WHERE user_count > 50  // Only patterns seen in 50+ users
MERGE (p:Pattern {
    trigger_type: 'negative_emotion',
    effect_type: 'skipped_action'
})
SET p.occurrence_count = user_count
RETURN p

// Apply learned pattern to new user
MATCH (p:Pattern {pattern_type: 'trigger_sequence'})
MATCH (u:User {id: $new_user_id})-[:OWNS]->(s:Signal)
WHERE s.content CONTAINS p.triggers[0]
MERGE (p)-[:MAY_AFFECT {
    probability: 0.7,
    based_on: p.user_count
}]->(u)
```

### Enterprise Features

```cypher
// Team constellation (anonymized)
MATCH (t:Team {id: $team_id})-[:HAS_MEMBER]->(u:User)
MATCH (u)-[:OWNS]->(s:Signal)
WHERE s.created_at > datetime() - duration('P30D')
RETURN 
    t.name AS team,
    COUNT(DISTINCT u) AS members,
    AVG(u.follow_through_rate) AS avg_follow_through,
    // Aggregated patterns, not individual data
    COLLECT(DISTINCT s.domain) AS active_domains

// Manager view: team dynamics without individual exposure
MATCH (t:Team)-[:HAS_MEMBER]->(u:User)
MATCH (u)-[:OWNS]->(s:Signal)-[:MENTIONS]->(e:Entity)
WHERE e.entity_type = 'organization'
WITH t, e.name AS entity, AVG(e.avg_sentiment) AS sentiment
RETURN t.name, entity, sentiment
ORDER BY sentiment ASC  // Surface friction points
```

### Query Patterns (Graph Algorithms)

```cypher
// 1. Find user's most influential blockers (PageRank)
CALL gds.pageRank.stream({
    nodeProjection: ['Belief', 'Goal', 'Behavior'],
    relationshipProjection: {
        BLOCKS: { type: 'BLOCKS', properties: 'strength' },
        ENABLES: { type: 'ENABLES', properties: 'strength' }
    },
    relationshipWeightProperty: 'strength'
}) YIELD nodeId, score
WHERE gds.util.asNode(nodeId):Belief
RETURN gds.util.asNode(nodeId).content AS blocker, score
ORDER BY score DESC LIMIT 5

// 2. Shortest path from current state to goal
MATCH (current:Behavior {status: 'latest'}), (goal:Goal {id: $goal_id})
CALL gds.shortestPath.dijkstra.stream({
    sourceNode: current,
    targetNode: goal,
    relationshipWeightProperty: 'strength'
}) YIELD path
RETURN [n IN nodes(path) | n.content] AS steps

// 3. Community detection for related goals
CALL gds.louvain.stream({
    nodeProjection: ['Goal', 'Behavior'],
    relationshipProjection: 'ENABLES'
}) YIELD nodeId, communityId
WITH communityId, COLLECT(gds.util.asNode(nodeId).content) AS members
RETURN communityId, members
ORDER BY SIZE(members) DESC

// 4. Similarity between users (for pattern transfer)
MATCH (u1:User)-[:EXHIBITS]->(p:Pattern)<-[:EXHIBITS]-(u2:User)
WHERE u1.id = $user_id AND u1 <> u2
WITH u2, COUNT(p) AS shared_patterns
ORDER BY shared_patterns DESC LIMIT 10
RETURN u2.id, shared_patterns
// These similar users' patterns may apply to u1
```

### Additional Infrastructure

| Component | Purpose | Technology |
|-----------|---------|------------|
| **Kafka** | CDC from Postgres to Neo4j | Confluent Cloud |
| **Debezium** | Postgres change capture | Debezium Connector |
| **Neo4j Aura** | Managed graph database | Neo4j Aura Enterprise |
| **Redis** | Caching hot paths | Redis Cloud |
| **Temporal.io** | Workflow orchestration | For pattern jobs |
| **pgvector** | Semantic search (stay in PG) | Extension |
| **GDS** | Neo4j Graph Data Science | For algorithms |

### Privacy Considerations

```
Cross-user patterns must be:
  ├─ Aggregated (min 50 users)
  ├─ Anonymized (no PII in patterns)
  ├─ Opt-in (user consents to contribute)
  └─ Deletable (user can remove their contribution)

Enterprise multi-user:
  ├─ Explicit consent from both parties
  ├─ Relationship type declared (not inferred)
  ├─ Either party can sever connection
  └─ Manager views never show individual signals
```

### Complexity Cost

| Factor | Estimate |
|--------|----------|
| Neo4j setup + schema | 1 week |
| CDC pipeline (PG → Neo4j) | 2 weeks |
| Graph query layer | 1 week |
| Cross-user pattern mining | 2 weeks |
| Enterprise features | 2 weeks |
| Privacy/consent system | 1 week |
| Testing | 2 weeks |
| **Total** | **~12 weeks** |

### When to Use

- **After V1 product-market fit**
- **10,000+ users** (patterns need volume)
- **Enterprise sales** (team features)
- **Relationship features** (couples, families)

---

## Comparison Matrix

| Factor | Option A (Minimal) | Option B (Core) | Option C (Platform) |
|--------|-------------------|-----------------|---------------------|
| **Storage** | Airtable | PostgreSQL | Neo4j + PostgreSQL |
| **Dev Time** | 1 day | 2 weeks | 12 weeks |
| **Node Types** | 5 (flat) | 5 (structured) | 5 (graph nodes) |
| **Edge Types** | 0 | 6 | 6 + cross-user |
| **Temporal** | Timestamps only | Decay modeling | Decay + predictions |
| **Multi-user** | No | No | Yes |
| **Pattern Learning** | No | Per-user | Cross-user |
| **Predictions** | No | Yes | Yes + transferred |
| **Scale** | 30 users | 10,000 users | 100,000+ users |
| **Team Support** | No | No | Yes |
| **Switching Cost** | Low | Medium | High |

---

## Recommended Path

```
Week 1-4: Option A (Airtable)
├─ Validate with 30 users
├─ Measure kill thresholds
└─ If pass → proceed

Week 5-12: Option B (PostgreSQL)
├─ Full signal extraction
├─ Edge detection
├─ Pattern computation
├─ V1 product launch
└─ Measure retention

Month 3+: Option C (Neo4j)
├─ Only if PMF confirmed
├─ Only if 10k+ users
├─ Only if enterprise demand
└─ Otherwise: stay on Option B
```

### Key Principle

**Option A proves value exists.**  
**Option B delivers value at scale.**  
**Option C creates network effects.**

Start with A. Graduate to B when validation passes. Consider C when growth demands it.

---

## Implementation Notes

### From A to B Migration

```sql
-- Airtable export → Postgres import
INSERT INTO signals (user_id, signal_type, subtype, content, created_at)
SELECT 
    u.id,
    CASE at.signal_type
        WHEN 'GOAL' THEN 'STATED'
        WHEN 'BLOCKER' THEN 'STATED'
        WHEN 'COMMITMENT' THEN 'STATED'
        WHEN 'OUTCOME' THEN 'BEHAVIORAL'
        ELSE 'STATED'
    END,
    LOWER(at.signal_type),
    at.content,
    at.timestamp
FROM airtable_export at
JOIN users u ON u.email = at.user_email;
```

### From B to C Migration

```
1. Deploy Neo4j Aura
2. Set up Debezium + Kafka
3. Initial bulk load from Postgres
4. Enable CDC for real-time sync
5. Build graph query layer
6. Switch reads to Neo4j
7. Keep Postgres as source of truth
```

---

## Success Metrics by Option

### Option A Success

| Metric | Target |
|--------|--------|
| Profile accuracy rating | > 4.0/5 |
| Action taken rate | > 30% |
| Positive outcome rate | > 40% |
| Want next experiment | > 50% |

### Option B Success

| Metric | Target |
|--------|--------|
| Week 4 retention | > 40% |
| Month 3 retention | > 25% |
| Follow-through improvement | > 10% over baseline |
| Prediction accuracy | > 60% |
| "It knows me" NPS | > 50 |

### Option C Success

| Metric | Target |
|--------|--------|
| Cross-user pattern accuracy | > 65% |
| Enterprise revenue | > $50k ARR |
| Multi-user feature adoption | > 20% |
| Network effect measurable | Retention improves with usage |

---

*This plan designed by architect-agent for S.T.A.R.S. Context Graph implementation.*
