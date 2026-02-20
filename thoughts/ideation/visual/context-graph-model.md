# Context Graph: What Creates Stickiness

**Question:** Why would someone stay when ChatGPT exists?

**Answer:** Not the conversation. The **structured accumulation of signals** into a graph that enables predictions and interventions ChatGPT cannot.

---

## The Graph Model

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CONTEXT GRAPH                                 │
│                                                                      │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐        │
│  │   IDENTITY   │────▶│   PATTERNS   │────▶│  PREDICTIONS │        │
│  │    NODES     │     │    EDGES     │     │   (EMERGENT) │        │
│  └──────────────┘     └──────────────┘     └──────────────┘        │
│         │                    │                    │                  │
│         ▼                    ▼                    ▼                  │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐        │
│  │  What you    │     │  How things  │     │  What will   │        │
│  │  said/did    │     │  connect     │     │  happen next │        │
│  └──────────────┘     └──────────────┘     └──────────────┘        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Node Types (What We Capture)

### 1. STATED NODES (What they say)
```
┌─────────────────────────────────────┐
│ STATED                              │
├─────────────────────────────────────┤
│ • Goals ("I want to wake up early") │
│ • Values ("Family is important")    │
│ • Fears ("I'm afraid of failure")   │
│ • Beliefs ("I'm not a morning...")  │
│ • Desires ("I wish I could...")     │
│ • Complaints ("I hate my job")      │
└─────────────────────────────────────┘
```

**Signal source:** Direct conversation, excavation questions

### 2. BEHAVIORAL NODES (What they do)
```
┌─────────────────────────────────────┐
│ BEHAVIORAL                          │
├─────────────────────────────────────┤
│ • Actions taken (did the thing)     │
│ • Actions skipped (didn't do it)    │
│ • Response time (fast/slow reply)   │
│ • Session patterns (when they come) │
│ • Topic avoidance (what they skip)  │
│ • Commitment follow-through (%)     │
└─────────────────────────────────────┘
```

**Signal source:** App usage, follow-up responses, calendar/integration data

### 3. EMOTIONAL NODES (How they feel)
```
┌─────────────────────────────────────┐
│ EMOTIONAL                           │
├─────────────────────────────────────┤
│ • Sentiment in text (positive/neg)  │
│ • Energy level (high/low)           │
│ • Resistance markers ("but...", "I  │
│   can't...", deflection)            │
│ • Breakthrough markers (insight,    │
│   relief, motivation spike)         │
│ • Shame/guilt patterns              │
└─────────────────────────────────────┘
```

**Signal source:** NLP analysis of conversation, explicit mood check-ins

### 4. TEMPORAL NODES (When things happen)
```
┌─────────────────────────────────────┐
│ TEMPORAL                            │
├─────────────────────────────────────┤
│ • Time of day patterns              │
│ • Day of week patterns              │
│ • Cycle patterns (monthly, etc.)    │
│ • Decay rate (how fast momentum     │
│   drops after action)               │
│ • Recovery time (how long to        │
│   bounce back from setback)         │
└─────────────────────────────────────┘
```

**Signal source:** Timestamp analysis, behavioral tracking

### 5. RELATIONAL NODES (Who matters)
```
┌─────────────────────────────────────┐
│ RELATIONAL                          │
├─────────────────────────────────────┤
│ • People mentioned (partner, boss)  │
│ • Relationship quality signals      │
│ • Conflict patterns                 │
│ • Support sources                   │
│ • Triggers (who causes what)        │
└─────────────────────────────────────┘
```

**Signal source:** Entity extraction from conversation, explicit relationship mapping

---

## Edge Types (How Things Connect)

### CONTRADICTION EDGES
```
STATED: "Family is my priority"
            │
            │ ←── CONTRADICTION
            ▼
BEHAVIORAL: Worked 70 hours last week
```

**Value:** Surface the gap between espoused values and lived behavior.

### CAUSATION EDGES
```
TRIGGER: "Had argument with partner"
            │
            │ ←── CAUSES
            ▼
PATTERN: Skip morning routine next 3 days
```

**Value:** Predict what derails them before it happens.

### CORRELATION EDGES
```
TEMPORAL: Low energy on Mondays
            │
            │ ←── CORRELATES
            ▼
BEHAVIORAL: Most skipped commitments on Mon/Tue
```

**Value:** Suggest interventions at the right time.

### BLOCKERS EDGES
```
STATED: "I want to exercise"
            │
            │ ←── BLOCKED BY
            ▼
BELIEF: "I'm not an athletic person"
```

**Value:** Identify the real obstacle (identity, not logistics).

### ENABLES EDGES
```
EMOTIONAL: Breakthrough insight
            │
            │ ←── ENABLES
            ▼
BEHAVIORAL: Action taken within 24 hours
```

**Value:** Learn what precedes successful action.

---

## Emergent Properties (What the Graph Reveals)

### 1. THE DELTA
```
┌─────────────────────────────────────────┐
│           THE DELTA                      │
│                                          │
│   WHO YOU SAY YOU ARE                    │
│            ▲                             │
│            │  GAP = The Work             │
│            ▼                             │
│   WHO YOUR BEHAVIOR REVEALS              │
│                                          │
└─────────────────────────────────────────┘
```

**ChatGPT can't do this:** It doesn't track behavior over time. It only knows what you tell it in conversation. The graph tracks the delta between stated and actual.

### 2. PATTERN PREDICTION
```
Based on graph:
- You always skip workouts after conflict with partner
- Your motivation decays 40% faster than average
- Mondays are your vulnerability window
- You deflect when asked about [topic]

Therefore:
- Pre-emptive check-in after conflict detected
- Shorter commitment windows (3 days not 7)
- Extra support on Monday mornings
- Gentle probe on avoided topic when ready
```

**ChatGPT can't do this:** It doesn't have structured behavioral data to build prediction models.

### 3. INTERVENTION TIMING
```
Graph shows:
- Energy dip Thursday afternoons
- Most skipped actions happen 48-72 hours after commitment
- Recovery from setback takes 5 days average

Therefore:
- Send reminder Wednesday, not Friday
- Check-in at 48 hours, not 7 days
- Don't push new commitment until day 6 post-setback
```

**ChatGPT can't do this:** It has no temporal behavioral model.

### 4. RELATIONSHIP MAPPING
```
Graph shows:
- Partner mentioned 47 times, 60% negative sentiment
- Boss mentioned 23 times, 80% negative sentiment
- Friend "Sarah" mentioned 12 times, 95% positive

Therefore:
- Relationship with partner is primary blocker
- Work stress is secondary
- Sarah is an underutilized support resource
```

**ChatGPT can't do this:** It doesn't accumulate entity-level analysis.

---

## Signal Sources (How We Capture)

### FROM CONVERSATION (Text Analysis)
| Signal | Extraction Method |
|--------|-------------------|
| Goals | "I want to...", "My goal is..." |
| Fears | "I'm afraid...", "What if..." |
| Beliefs | "I am...", "I'm not...", "I can't..." |
| Resistance | "But...", "I don't think...", deflection |
| Breakthrough | "I never thought of it that way", "Oh..." |
| Entities | NER for people, places, events |
| Sentiment | Per-message sentiment scoring |
| Topics | Topic modeling per session |

### FROM BEHAVIOR (Usage Analysis)
| Signal | Capture Method |
|--------|----------------|
| Session timing | Timestamp of each interaction |
| Response latency | Time between prompt and response |
| Commitment tracking | Did they do what they said? |
| Topic avoidance | What they skip when prompted |
| Engagement depth | Message length, follow-up questions |
| Return patterns | Days between sessions |

### FROM INTEGRATIONS (External Data)
| Signal | Source |
|--------|--------|
| Calendar alignment | Did they block time? |
| Health metrics | Sleep, exercise, HRV |
| Location | Are they where they said they'd be? |
| Screen time | Attention patterns |

---

## The Stickiness Model

### Why ChatGPT Isn't Sticky
- Memory is flat (key-value, not graph)
- No behavioral tracking
- No temporal patterns
- No prediction capability
- No intervention timing
- Resets with new conversation

### Why This Could Be Sticky
```
VALUE OVER TIME
       │
       │  Month 1: Conversation + basic profile
       │
       │  Month 3: Patterns emerge from behavior
       │           (ChatGPT can't do this)
       │
       │  Month 6: Predictions become accurate
       │           ("You always do X after Y")
       │
       │  Month 12: Graph is irreplaceable
       │            (You'd have to rebuild a year of patterns)
       ▼
```

**The moat isn't the conversation. It's the accumulated behavioral graph.**

---

## Minimum Graph for Day 0 MVP

Even in the 30-day test, start capturing:

### Must Capture
- [ ] Stated goals (from conversation)
- [ ] Stated blockers (from conversation)
- [ ] Commitment made (what they said they'd do)
- [ ] Commitment outcome (did they do it? Y/N)
- [ ] Follow-up sentiment (how did it feel? 1-5)
- [ ] Session timestamp

### Nice to Have
- [ ] Entity extraction (who did they mention?)
- [ ] Topic tracking (what themes recur?)
- [ ] Resistance markers (where did they deflect?)

### Store In
Airtable with columns:
```
| user_id | timestamp | node_type | content | outcome | sentiment |
|---------|-----------|-----------|---------|---------|-----------|
| u001    | 2026-01-14| GOAL      | Wake early | — | — |
| u001    | 2026-01-14| COMMITMENT| Wake 6am Mon | YES | 4 |
| u001    | 2026-01-21| BEHAVIORAL| Kept commitment | — | — |
```

**This is the seed of the graph. Even in MVP, you're building differentiation.**

---

## Visual: The Compound Effect

```
WEEK 1
┌─────┐
│  •  │  Single data point
└─────┘

MONTH 1
┌─────────────┐
│  •───•      │  A few connections
│   \ /       │
│    •        │
└─────────────┘

MONTH 6
┌─────────────────────┐
│  •───•───•          │
│  │\ /│\ /│          │  Patterns emerge
│  • ─ • ─ •          │
│  │/ \│/ \│          │
│  •───•───•          │
└─────────────────────┘

MONTH 12
┌─────────────────────────────┐
│  Dense web of connections   │
│  Predictions become         │  This is the moat
│  accurate                   │
│  Switching = rebuilding     │
└─────────────────────────────┘
```

---

## The Answer to "Why Sticky?"

**Not because of the conversation.**
ChatGPT can have conversations.

**Because of the graph.**
The structured accumulation of:
- What you say vs what you do (delta)
- When you succeed vs fail (timing)
- Who helps vs hinders (relationships)
- What predicts your behavior (patterns)

**ChatGPT has memory. This has understanding.**

---

*The conversation is the interface. The graph is the product.*
