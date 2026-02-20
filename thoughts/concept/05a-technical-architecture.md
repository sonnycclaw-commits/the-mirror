# Technical Architecture — The Moat & The Schedule

**Companion to 05-building-it.md**
**Created:** 2026-01-14
**Purpose:** Fill the technical gaps that 05-building-it.md leaves open

---

## What This Document Covers

05-building-it.md answers "what to build and when." This document answers:

1. **Context Graph Model** — The data structure that creates our moat
2. **Tech Stack Decision Log** — Why we chose each piece
3. **Micro-Revelations Schedule** — How we prevent the 7-day cliff
4. **Implementation Options** — Simple to complex migration path

---

# Part 1: Context Graph Model

## The Moat Thesis

ChatGPT has memory. We have understanding.

```
ChatGPT: "User mentioned they want to exercise more."
         (flat key-value, no structure)

S.T.A.R.S: "User says exercise is important. User skipped gym 3x after
            partner conflicts. User's 'not athletic' belief blocks action.
            Predicted: High risk of skipping Monday gym after Sunday fight."
            (structured graph with temporal patterns)
```

The difference is not conversation memory. The difference is **structured behavioral accumulation**.

---

## Why This Differentiates

| Capability | ChatGPT Memory | Context Graph |
|------------|----------------|---------------|
| "User wants X" | Yes | Yes |
| "User did/didn't do X" | No (unless told) | Yes (tracked) |
| "User says X but does Y" | No | **The Delta** |
| "X happens after Y" | No | **Causation edges** |
| "Belief Z blocks goal" | No | **Blocks edges** |
| "Optimal intervention time" | No | **Temporal patterns** |
| Value after 12 months | Reset-friendly | Irreplaceable |

ChatGPT is stateless between sessions unless manually updated. The Context Graph accumulates behavioral evidence that compounds over time.

---

## Node Types (5)

### 1. STATED Nodes
What the user says — goals, fears, beliefs, values.

```
┌─────────────────────────────────────────────────────────────┐
│  STATED Node                                                 │
├─────────────────────────────────────────────────────────────┤
│  subtype: goal | fear | belief | value | desire | complaint │
│  content: "I want to wake up early"                         │
│  domain:  health | wealth | relationships | purpose | soul  │
│  raw_excerpt: "Ugh, I wish I could just wake up early..."   │
│  confidence: 0.85                                            │
│  status: active | resolved | superseded                      │
└─────────────────────────────────────────────────────────────┘
```

**Source:** Extracted from conversation by TARS via structured output

### 2. BEHAVIORAL Nodes
What the user does — actions taken, actions skipped, outcomes.

```
┌─────────────────────────────────────────────────────────────┐
│  BEHAVIORAL Node                                             │
├─────────────────────────────────────────────────────────────┤
│  subtype: action_taken | action_skipped | kept | broken     │
│  content: "Woke up at 6am Monday"                           │
│  commitment_id: links to original commitment                │
│  observed_at: when behavior occurred                         │
│  source: self_report | integration | inferred               │
└─────────────────────────────────────────────────────────────┘
```

**Source:** Evening check-ins, device integrations (V2), pattern inference

### 3. EMOTIONAL Nodes
How the user feels — sentiment, resistance, breakthroughs.

```
┌─────────────────────────────────────────────────────────────┐
│  EMOTIONAL Node                                              │
├─────────────────────────────────────────────────────────────┤
│  subtype: sentiment | resistance | breakthrough | deflection│
│  content: "I felt energized for the first time in months"  │
│  sentiment_score: 0.8 (-1 to 1)                             │
│  markers: ["finally", "amazing", "clicked"]                 │
└─────────────────────────────────────────────────────────────┘
```

**Source:** Detected by TARS during conversation via NLP

### 4. TEMPORAL Nodes
Time-based patterns — computed aggregates, not raw observations.

```
┌─────────────────────────────────────────────────────────────┐
│  TEMPORAL Node                                               │
├─────────────────────────────────────────────────────────────┤
│  pattern_type: day_of_week | time_of_day | after_event |   │
│                recovery_time | decay_rate                   │
│  pattern_key: "monday" | "morning" | "conflict_with_partner"│
│  pattern_value: { skip_probability: 0.7, avg_recovery: 3d } │
│  observation_count: 5                                        │
│  confidence: 0.72                                            │
└─────────────────────────────────────────────────────────────┘
```

**Source:** Computed by pattern detection algorithms after 3+ observations

### 5. RELATIONAL Nodes
People and entities mentioned.

```
┌─────────────────────────────────────────────────────────────┐
│  RELATIONAL Node                                             │
├─────────────────────────────────────────────────────────────┤
│  name: "Partner"                                             │
│  aliases: ["Sarah", "my wife"]                              │
│  relationship: "spouse"                                      │
│  mention_count: 12                                           │
│  avg_sentiment: -0.2                                         │
└─────────────────────────────────────────────────────────────┘
```

**Source:** Entity extraction during conversation

---

## Edge Types (6)

### Core Edges

```
CONTRADICTION    Said X, did Y         STATED ───> BEHAVIORAL
CAUSATION        A precedes/causes B   Any ───> Any
CORRELATION      A co-occurs with B    Any ───> Any
BLOCKS           Belief prevents goal  STATED ───> STATED
ENABLES          Insight → action      EMOTIONAL ───> BEHAVIORAL
MENTIONS         Signal references     Any ───> RELATIONAL
```

### Edge Properties (All Edges Have)

```
┌─────────────────────────────────────────────────────────────┐
│  Edge Properties                                             │
├─────────────────────────────────────────────────────────────┤
│  strength: 0.8          (current weight, 0-1)               │
│  initial_strength: 1.0  (when created)                      │
│  confidence: 0.7        (AI confidence in edge)             │
│  evidence_count: 4      (times observed)                    │
│  evidence: "Said family first, worked 70 hours"             │
│                                                              │
│  # Bi-temporal (when it was vs when we learned)            │
│  created_at: 2026-01-14  (system recorded)                  │
│  valid_from: 2026-01-10  (behavior occurred)                │
│  valid_until: null       (still true)                       │
│  expired_at: null        (not invalidated)                  │
│                                                              │
│  # Decay                                                     │
│  decay_half_life: 30     (days until 50% strength)          │
└─────────────────────────────────────────────────────────────┘
```

---

## Temporal Model

### Why Decay Matters

Insights and patterns fade. A conflict from 6 months ago shouldn't weigh the same as one from yesterday.

```
Edge Strength Over Time:

strength(t) = initial_strength × (0.5)^(t / half_life)

Example:
  Initial strength: 1.0
  Half-life: 30 days
  After 30 days: 0.5
  After 60 days: 0.25
  After 90 days: 0.125
```

### Personalized Decay Rates

Research shows 76% of momentum variance is individual. We learn each user's decay rate.

| Edge Type | Default Half-Life | Reason |
|-----------|-------------------|--------|
| Identity belief | 180 days | Core beliefs change slowly |
| Behavioral pattern | 30 days | Habits fade faster |
| Momentary sentiment | 7 days | Feelings are transient |
| Causation | 21 days | Need reinforcement |

### How Decay Creates Stickiness

```
Month 1:  Graph has recent edges, patterns weak
Month 3:  Patterns emerge, predictions begin
Month 6:  Graph is rich, predictions accurate
Month 12: Losing this graph = losing a year of behavioral history
```

The more time invested, the more irreplaceable the graph becomes.

---

## Prediction Algorithms

### Hybrid Approach

| Layer | Purpose | When Used |
|-------|---------|-----------|
| **Rule-based** | Explicit extraction | "I want X" → STATED.goal |
| **Bayesian** | Probabilistic updates | Updating trait beliefs |
| **Granger causality** | Temporal patterns | After 3+ A→B observations |

### Granger Causality Detection

When A reliably precedes B, we create a CAUSATION edge.

```
Pseudocode:

1. Collect all (trigger, effect) sequences
2. Group by (trigger_type, effect_type)
3. For each group with 3+ occurrences:
   - Calculate average delay
   - Calculate delay variance
   - If variance < mean: consistent pattern
   - Create CAUSATION edge with confidence
```

### Prediction Types

```
commitment_outcome     → Will they keep this commitment?
vulnerability_window   → When are they likely to slip?
trigger_alert          → Something that historically causes problems
optimal_timing         → Best time for intervention
```

---

## Context Graph ↔ Constellation Mapping

The constellation is the **user-facing view** of the Context Graph.

```
CONTEXT GRAPH (internal)          CONSTELLATION (user-facing)
─────────────────────────         ─────────────────────────────
Nodes (signals)            →      Stars (points on map)
Edges (relationships)      →      Lines (connections)
Temporal decay             →      Star brightness (fading)
Pattern predictions        →      Suggested pathways
State vectors (domains)    →      θ axis positions
Time                       →      Radial distance (r axis)
```

Users see stars forming. The system sees nodes accumulating. Same data, different metaphor.

---

# Part 2: Tech Stack Decision Log

## The Tradeoffs Matrix

### Backend: Why Convex over Supabase

| Factor | Convex | Supabase | Winner |
|--------|--------|----------|--------|
| Real-time | Native, <50ms | WAL-based, 100-200ms | **Convex** |
| TypeScript | First-class | SDK available | **Convex** |
| AI Agent | Dedicated component | DIY | **Convex** |
| Vector search | Built-in | pgvector (mature) | Tie |
| SQL access | None | Full PostgreSQL | **Supabase** |
| Self-host | Open-source | Open-source | Tie |
| Mobile | Official Expo templates | More setup | **Convex** |

**Decision: Convex for MVP**

Why: Real-time is critical for coaching feel. Thread management built-in. Type safety reduces bugs.

Mitigation: If complex analytics needed, export to analytics layer.

### Temporal Knowledge Graph: Options

| Option | Pros | Cons | When |
|--------|------|------|------|
| **Airtable** | Fast, no setup | No edges, no decay | Day 0 MVP |
| **PostgreSQL** | Familiar, pgvector | Manual graph queries | V1 |
| **Zep/Graphiti** | Built for LLM memory | External dependency | V1.5 |
| **Neo4j** | Native graph, algorithms | Overkill for <10k users | V2+ |

**Decision: Start with Airtable, graduate to PostgreSQL**

Why: Prove value before building infrastructure. PostgreSQL handles 10k users fine.

Migration path: Airtable → Postgres is a weekend. Postgres → Neo4j is a quarter.

### Mobile: React Native vs Web vs KMP

| Factor | React Native | Web PWA | KMP (Compose) |
|--------|--------------|---------|---------------|
| Time to MVP | 4 weeks | 2 weeks | 8 weeks |
| Canvas perf | Unknown | Good | Best |
| Native feel | Good | Poor | Best |
| Code sharing | 95% iOS/Android | 100% | 80% iOS/Android |
| Team learning | Low | None | High |

**Decision: Web-first (Next.js), then React Native**

Why: Fastest validation. Canvas performance is sufficient for stars. Mobile can wait until Day 7 retention proven.

Constellation in browser → prove it works → port to native.

### Visualization: Canvas vs SVG vs WebGL

| Factor | SVG | Canvas 2D | WebGL/Pixi.js |
|--------|-----|-----------|---------------|
| 50 stars | Easy | Easy | Overkill |
| 500 stars | Slow | Fast | Fast |
| Animations | CSS | JS | Shaders |
| Learning | Low | Medium | High |
| Mobile | Good | Good | Battery drain |

**Decision: Canvas 2D with Pixi.js as fallback**

Why: 50 stars is the typical ceiling. Canvas handles this fine. Pixi.js only if performance issues.

---

## Stack Summary

```
┌─────────────────────────────────────────────────────────────┐
│  MVP STACK                                                   │
├─────────────────────────────────────────────────────────────┤
│  Frontend:    Next.js 14 + React                            │
│  Visualization: Canvas 2D + Framer Motion                   │
│  Backend:     Convex                                         │
│  AI:          Claude API (structured outputs)               │
│  Auth:        Clerk (magic link)                            │
│  Hosting:     Vercel                                         │
│  Analytics:   PostHog                                        │
│  Email:       Resend                                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  V1 STACK (after validation)                                 │
├─────────────────────────────────────────────────────────────┤
│  + PostgreSQL with pgvector (Context Graph)                 │
│  + Edge detection algorithms                                 │
│  + Temporal pattern computation                              │
│  + React Native (mobile)                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  V2 STACK (after PMF)                                        │
├─────────────────────────────────────────────────────────────┤
│  + Neo4j (graph queries at scale)                           │
│  + Cross-user pattern mining                                 │
│  + Device integrations (HealthKit, Calendar)                │
│  + Champion marketplace infrastructure                       │
└─────────────────────────────────────────────────────────────┘
```

---

# Part 3: Micro-Revelations Schedule

## The Problem

From CHALLENGES.md:

- 92% of books unfinished
- 97% of courses abandoned
- 90% of apps abandoned within 3 days

We're asking for 7 days of excavation before the Birth Chart payoff.

**That's a death sentence without daily value.**

---

## The Solution: Daily Micro-Revelations

Every day delivers something. Day 7 is the crescendo, not the first note.

### Day 1: First Reflection

**What user does:** Answers 3-5 surface questions
- "What do you complain about but never change?"
- "What would someone conclude about your priorities watching your behavior?"

**What appears:** 3-5 scattered stars on empty sky

**Micro-revelation:**
> "Here's what I notice from today.
> You complain about [X] but keep doing [Y]. There's a gap there.
> Your first stars are scattered across [domains]. No pattern yet.
> But something is already visible: [one specific insight].
> Tomorrow, we go deeper. For now, sit with this: what do you notice about your own sky?"

**Why it works:** User feels seen on Day 1. Not assessed. Seen.

---

### Day 2: First Connection Drawn

**What user does:** Answers questions about energy and time
- "When did you last feel fully alive?"
- "What are you waiting for permission to do?"

**What appears:** 2-3 new stars + first line connecting two stars

**Micro-revelation:**
> "I noticed something.
> [Star A] and [Star B] are connected. You mentioned [X] when talking about energy, and again when talking about frustration.
> That's not random. There's a thread here.
> Tomorrow, we look at the life you're afraid of becoming."

**Why it works:** Connection = pattern = intelligence. TARS is paying attention.

---

### Day 3: First Dark Star Appears

**What user does:** Answers anti-vision questions
- "Describe the life you're terrified of living in 10 years"
- "What's the worst-case path you're currently on?"

**What appears:** Dark star (not black, but dim/purple) + connection to existing stars

**Micro-revelation:**
> "This star is different. It's what you're moving away from.
> [Anti-vision summary in one sentence].
> The good news: you can see it now. Most people can't see their dark stars until they're already there.
> Tomorrow, I'll show you a pattern you might not have noticed yourself."

**Why it works:** Naming the fear reduces its power. Dark star is progress, not failure.

---

### Day 4: Pattern TARS Noticed That User Didn't

**What user does:** Answers questions about relationships and patterns
- "Who energizes you vs drains you?"
- "What pattern keeps repeating despite your efforts?"

**What appears:** Multiple new connections forming a cluster

**Micro-revelation:**
> "I've been counting.
> You mentioned [Person/Thing] [N] times in [domain]. Every time, the sentiment was [positive/negative].
> You didn't explicitly say [Person/Thing] was a problem. But your words drew that pattern without you noticing.
> What do you make of that?"

**Why it works:** TARS reveals something user couldn't see themselves. This is the "magic" moment.

---

### Day 5: First Prediction

**What user does:** Answers questions about triggers and vulnerabilities
- "When do you most often break your own promises?"
- "What circumstances make you give up?"

**What appears:** Pulsing connection between trigger and behavior

**Micro-revelation:**
> "Based on what you've shared, here's a prediction:
> When [trigger happens], you're likely to [behavior].
> This isn't judgment. It's pattern recognition.
> You've given me 5 days of data. I can start to see the shape of your momentum.
> Tomorrow, we name what's been hiding."

**Why it works:** Prediction = proof the system is learning. Not guessing. Learning.

---

### Day 6: Shadow Star Named

**What user does:** Shadow work questions
- "What part of yourself have you been hiding from yourself?"
- "What are you afraid to want?"

**What appears:** Dim star that's been present but unnamed becomes labeled

**Micro-revelation:**
> "This star has been here since Day [N]. You mentioned [X] then, and it's connected to [Y] and [Z].
> Today you gave it a name: [shadow aspect].
> That star doesn't have to be bright right now. It just has to be seen.
> Tomorrow, we bring it all together. Your Birth Chart."

**Why it works:** Shadow integration is powerful. Naming = power transfer.

---

### Day 7: Full Birth Chart Reveal

**What user does:** Final integration questions
- "Looking at everything: what do you see?"
- "What's the one thing that would change everything?"

**What appears:** Camera pulls back. Full constellation visible. All connections drawn.

**Full revelation:**
> "Here's what I see in your sky.
> [TARS narrates the full chart with specific insights about clusters, dark stars, bright stars, and connections]
> This is your Birth Chart. This is who you are right now.
> Not who you have to be. Who you are right now.
> Tomorrow, we start walking."

**Why it works:** This is the emotional peak. 7 days of tension released in one moment.

---

## Cliffhanger Structure

Each day ends with anticipation for the next:

| Day | Cliffhanger |
|-----|-------------|
| 1 | "Tomorrow, we go deeper." |
| 2 | "Tomorrow, we look at the life you're afraid of becoming." |
| 3 | "Tomorrow, I'll show you a pattern you didn't see." |
| 4 | "Tomorrow, I make my first prediction about you." |
| 5 | "Tomorrow, we name what's been hiding." |
| 6 | "Tomorrow, we bring it all together. Your Birth Chart." |
| 7 | "Tomorrow, we start walking. But first... look at your sky." |

---

## Retention Model

```
Without Micro-Revelations:
  Day 1: 100%
  Day 2: 60%  ("More questions? Where's my profile?")
  Day 3: 35%  (Life got busy, no visible progress)
  Day 7: 20%  (Below kill threshold)

With Micro-Revelations:
  Day 1: 100%
  Day 2: 85%  ("That connection was interesting...")
  Day 3: 75%  ("I saw my dark star")
  Day 4: 70%  ("It noticed something I didn't")
  Day 5: 65%  ("It predicted me correctly")
  Day 6: 60%  ("I named my shadow")
  Day 7: 55%  (Birth Chart reveal!)

Target: 40% at Day 7 = PMF signal
```

---

# Part 4: Implementation Options

## The Migration Path

```
OPTION A (Day 0)     OPTION B (V1)        OPTION C (V2+)
─────────────────    ─────────────────    ─────────────────
Airtable             PostgreSQL           Neo4j + Postgres
2 tables             Full schema          Graph + Source
~1 day setup         ~2 weeks             ~12 weeks

Validates:           Enables:             Enables:
- Basic Delta        - Pattern prediction - Cross-user learning
- Follow-through %   - Edge detection     - Network effects
- Profile gen        - Temporal decay     - Enterprise features
                     - Full Delta         - Relationship mapping

Kill threshold:      PMF threshold:       Scale threshold:
30 users             10,000 users         100,000+ users
```

---

## Option A: Minimal (Airtable)

**When:** Day 0 MVP, 30-day validation sprint

**Schema:**
```
signals table:
  - user_email (text)
  - signal_type (GOAL | BLOCKER | COMMITMENT | OUTCOME)
  - content (text)
  - outcome (null | YES | NO | PARTIAL)
  - sentiment (1-5)
  - timestamp

users table:
  - email
  - total_commitments
  - commitments_kept
  - profile_summary (AI-generated)
```

**What it enables:**
- "You said you'd wake at 6am. Did you?" (basic Delta)
- "You've kept 60% of your commitments" (follow-through)
- Claude reads all signals, generates profile summary

**What it doesn't enable:**
- Pattern prediction
- Temporal correlations
- Relationship mapping
- Decay modeling

**Upgrade trigger:** Kill thresholds pass

---

## Option B: Core Product (PostgreSQL)

**When:** After validation passes, V1 product

**What changes:**
- Full signal extraction with 5 node types
- Edge table with 6 edge types
- Temporal pattern computation
- Prediction generation
- pgvector for semantic search

**What it enables:**
- The full Delta with contradictions surfaced
- "You skip workouts after partner conflicts"
- "Check in on Wednesday, not Friday"
- Personalized decay modeling

**Upgrade trigger:** PMF confirmed + 10k users + enterprise demand

---

## Option C: Platform Scale (Neo4j)

**When:** After PMF, 100k+ users

**What changes:**
- Native graph database
- Cross-user pattern mining
- Graph algorithms (PageRank, community detection)
- Multi-user relationship mapping

**What it enables:**
- "847 users with your pattern found this helped..."
- Team constellations (enterprise)
- Couples/family constellation linking
- Network effects (value increases with users)

---

## Cost Comparison

| Option | Dev Time | Monthly Cost | Team Size |
|--------|----------|--------------|-----------|
| A | 1 day | $0 (free tier) | 1 person |
| B | 2 weeks | $50-200 | 1-2 people |
| C | 12 weeks | $500-2000 | 3-5 people |

**Principle:** Only build what the current stage needs.

---

# Appendix: Key Diagrams

## Context Graph → Constellation Flow

```
USER CONVERSATION
       │
       ▼
┌──────────────────┐
│  TARS Extraction │ ← Claude structured outputs
│  (Excavation)    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Signal Storage  │ ← 5 node types
│  (Postgres/AT)   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Edge Detection  │ ← 6 edge types
│  (Pattern Agent) │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Temporal Decay  │ ← Half-life per edge type
│  (Cron job)      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Constellation   │ ← Polar coordinates
│  Rendering       │   Star brightness = edge strength
└──────────────────┘
```

## Micro-Revelation Timeline

```
DAY 1        DAY 2        DAY 3        DAY 4        DAY 5        DAY 6        DAY 7
  │            │            │            │            │            │            │
  ▼            ▼            ▼            ▼            ▼            ▼            ▼
┌────┐      ┌────┐      ┌────┐      ┌────┐      ┌────┐      ┌────┐      ┌────────┐
│ *  │      │ *──*│     │ *──*│     │ *──*│     │ *══*│     │ *──*│     │  BIRTH │
│  * │      │   * │     │ ●  │     │ ●──*│     │ ●══*│     │ ●──☆│     │  CHART │
│    │      │    *│     │   *│     │   *│     │   *│     │   *│     │ REVEAL │
└────┘      └────┘      └────┘      └────┘      └────┘      └────┘      └────────┘
  │            │            │            │            │            │            │
First       First       Dark        Pattern     First       Shadow      Full
stars       line        star        noticed     prediction  named       reveal
```

Legend:
- `*` = regular star
- `●` = dark star
- `☆` = shadow star (named)
- `──` = regular connection
- `══` = pulsing connection (prediction)

---

## Success Metrics by Phase

### Day 0 (Airtable)

| Metric | Kill | Target |
|--------|------|--------|
| Profile accuracy | <3.0/5 | >4.0/5 |
| Action taken | <20% | >30% |
| Want next experiment | <30% | >50% |

### V1 (PostgreSQL)

| Metric | Kill | Target |
|--------|------|--------|
| Week 4 retention | <25% | >40% |
| Month 3 retention | <15% | >25% |
| Prediction accuracy | <50% | >60% |
| "It knows me" NPS | <30 | >50 |

### V2 (Neo4j)

| Metric | Kill | Target |
|--------|------|--------|
| Cross-user accuracy | <55% | >65% |
| Enterprise revenue | <$25k | >$50k |
| Network effect | None | Measurable |

---

*This document is a living companion to 05-building-it.md. Update as decisions are validated.*
