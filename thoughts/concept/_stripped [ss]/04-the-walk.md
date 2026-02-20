# The Walk: Behavioral Transformation Engine

**Created:** 2026-01-14
**Author:** phoenix-agent (refactoring planner)
**Status:** Design specification — ready for implementation

---

## What The Walk IS

The Walk is the action layer that transforms insight into behavior change. Where The Mirror reveals who you are and who you are becoming, The Walk is **the bridge between knowing and doing**. It is a personalized, AI-driven behavioral intervention system that generates specific actions, times them for maximum likelihood of completion, tracks follow-through, and adapts based on what actually works for each individual user. The Walk is not advice — it is a closed-loop system where every recommendation is an experiment, every action (or inaction) is data, and the system learns what moves you specifically.

---

## The Behavior Change Mechanism

### Why Insight Alone Fails

Research consistently shows insight does not cause behavior change:
- **Webb and Sheeran (2006)**: Large meta-analysis found medium-to-large intention changes produce only small-to-medium behavior changes (intention-behavior gap).
- **Orbell and Sheeran (1998)**: Without implementation intentions, only about 50% of people who intend to act actually do.
- **Baumeister et al. (2007)**: Self-control is a limited resource; insight consumes it without replenishing.

### The Mechanism: Implementation Intentions + Feedback Loops

The Walk operationalizes **Gollwitzer's Implementation Intentions** (1999) — the most empirically validated behavior change technique:

```
IF [situation] THEN [behavior]
```

**Research Evidence:**
- Gollwitzer and Sheeran (2006) meta-analysis: d = 0.65 effect size (medium-large)
- Effect holds across health, academic, and interpersonal domains
- Works by delegating behavioral control from conscious intention to environmental cues

### The Walk Formula

```
Action = Context Graph Insight + Implementation Intention + Optimal Timing + Feedback
```

| Component | What It Does | Source |
|-----------|--------------|--------|
| **Insight** | Identifies the leverage point | The Mirror (Context Graph) |
| **Implementation Intention** | Specifies exactly when/where/how | AI generation from profile |
| **Optimal Timing** | Delivers when most likely to succeed | Context Graph predictions |
| **Feedback** | Closes the loop, updates the model | Follow-up + behavioral signals |

---

## The Core Loop: PIER

The Walk operates on a **PIER loop** (Plan, Implement, Evaluate, Refine):

### 1. PLAN: Generate the Micro-Experiment

**Input:** Context Graph profile + stated goal + current state
**Output:** One specific implementation intention

```typescript
interface MicroExperiment {
  id: string;
  user_id: string;

  // The insight that drives this
  insight_source: {
    type: 'contradiction' | 'pattern' | 'goal' | 'resistance';
    summary: string;
    evidence_node_ids: string[];
  };

  // The implementation intention
  if_trigger: string;        // "When I finish my morning coffee..."
  then_behavior: string;     // "...I will write for 10 minutes"
  location: string;          // "At my desk"

  // Sizing
  difficulty: 'trivial' | 'small' | 'medium' | 'stretch';
  estimated_minutes: number;

  // Timing
  suggested_date: Date;
  suggested_time?: string;
  optimal_window_start?: string;
  optimal_window_end?: string;

  // Status
  status: 'pending' | 'reminded' | 'completed' | 'skipped' | 'rescheduled';
  created_at: DateTime;
}
```

### 2. IMPLEMENT: Execute with Support

**Principle: Remove friction, add commitment devices.**

| Support Type | What It Does | Implementation |
|--------------|--------------|----------------|
| **Reminder** | Surfaces the commitment at optimal time | Push notification / email |
| **Pre-commitment** | Asks for commitment before the moment | "Will you do X tomorrow? [Yes/Reschedule]" |
| **Environmental cue** | Links to existing routine | "After [existing habit]..." |
| **Social stake** | Optional accountability | Share commitment with friend |

### 3. EVALUATE: Measure Outcome

**Follow-up Types:**

| Timing | Question | Purpose |
|--------|----------|---------|
| **Day-of (evening)** | "Did you do X?" (Y/N) | Action completion |
| **Next day** | "What happened? How did it feel?" | Qualitative feedback |
| **Week after** | "Looking back, was this valuable?" | Perceived impact |

**Key Metric: Follow-Through Rate (FTR)**

```typescript
function calculateFTR(user_id: string, window_days: number = 30): number {
  const experiments = getExperiments(user_id, window_days);
  const completed = experiments.filter(e => e.status === 'completed').length;
  const total = experiments.filter(e => e.status !== 'pending').length;
  return total > 0 ? completed / total : 0;
}
```

### 4. REFINE: Update the Model

Every action (or inaction) feeds back into the Context Graph:

| Outcome | Context Graph Update |
|---------|---------------------|
| **Completed + positive** | Strengthen commitment prediction, note effective triggers |
| **Completed + neutral** | Adjust difficulty calibration |
| **Skipped (acknowledged)** | Log resistance, identify blockers |
| **Ignored** | Decay reminder effectiveness, flag engagement issue |

---

## Personalization via Context Graph

The Context Graph predictions directly drive Walk personalization:

### 1. Commitment Outcome Prediction
Do not assign stretch experiments when likelihood < 30%. Build momentum first.

### 2. Vulnerability Window Detection
Pre-emptive check-in before vulnerability windows. "Friday evening has been hard. What is your plan?"

### 3. Trigger Alerts
When trigger detected (from conversation or calendar), surface adaptive intervention.

### 4. Optimal Timing
Schedule experiments for proven success windows, not just "when the user says."

---

## Daily and Weekly Loops

### Daily Loop
- **Morning (optional)**: Surface today's experiment, pre-commitment ask
- **Optimal Window**: Reminder at predicted best time for action
- **Evening**: Did you complete? What did you notice? (No guilt for misses)

**Key Principle:** Lightweight by default. Most days = 1 reminder + 1 check-in.

### Weekly Loop
- **Weekly Reflection**: Experiments completed, patterns noticed, progress
- **Next Week Planning**: AI suggests 2-3 experiments, user accepts/modifies/declines
- **Momentum Check**: "What is one thing you are proud of this week?"

---

## Progress Indicators

1. **Follow-Through Rate (FTR) Trend** - Primary behavior metric
2. **Streak and Consistency** - Genuine consistency tracking (not gamification)
3. **Pattern Shifts** - "You started using the 'after dinner' trigger."
4. **Said vs Did Delta** - Alignment between stated priorities and actual behavior
5. **Identity Momentum** - "Someone who writes daily" confidence increasing

---

## Minimum Viable Walk (Day 0 MVP)

### What Ships

| Component | Implementation | Effort |
|-----------|----------------|--------|
| **Profile to Action** | Claude prompt generates 1 specific action | 1 day |
| **Implementation Intention** | "When [X], I will [Y]" format | In prompt |
| **Reminder** | Email at user-specified time (Resend) | 0.5 day |
| **Follow-up** | Day 2 email: "Did you do it? How was it?" | 0.5 day |
| **Data capture** | Typeform embedded in email | 0 dev |
| **Basic tracking** | Airtable: did/didn't, sentiment | 0 dev |

### MVP Validation Metrics

| Metric | Target | Kill Threshold |
|--------|--------|----------------|
| % who open reminder email | >50% | <30% |
| % who report taking action | >30% | <15% |
| % who report positive outcome | >40% | <20% |
| % who want "experiment #2" | >50% | <25% |

---

## Research Foundation

- **Implementation Intentions (Gollwitzer, 1999)**: d = 0.65 effect size
- **Habit Stacking (Clear, 2018)**: Attach new behaviors to existing routines
- **Tiny Habits (Fogg, 2020)**: Start absurdly small, shrink to fit motivation
- **Self-Determination Theory (Deci and Ryan)**: Autonomy, competence, relatedness
- **Coaching Effectiveness (Theeboom et al., 2014)**: Goal-setting, accountability, personalized feedback, behavioral experiments

---

## What The Walk is NOT

- Gamified dopamine slot machine
- Guilt delivery system
- Overwhelming daily todo list
- Generic advice engine
- Human coaching replacement

---

## Summary

**The Walk is:**
1. The action layer that transforms insight into behavior
2. A closed-loop system: recommend, act, measure, adapt
3. Personalized via Context Graph predictions
4. Operationalized implementation intentions (if-then plans)
5. Designed for compounding value over time

**The Walk MVP validates:**
1. Can AI generate useful, specific actions?
2. Do people actually do them?
3. Do they report positive outcomes?
4. Do they want more?

If yes: Build the full system.
If no: The hypothesis was wrong.

---

*The Walk is where transformation happens. The Mirror shows you who you are. The Walk makes you who you want to become.*
