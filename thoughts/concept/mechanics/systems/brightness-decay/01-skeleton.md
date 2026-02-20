# Brightness & Decay - SKELETON

**Status:** Draft
**Last Updated:** 2026-01-15
**Depends on:** constellation-states

---

## Purpose

This system defines how brightness (a continuous value 0→1) changes over time. Brightness drives state transitions in constellation-states, but this system is the authoritative source on the **dynamics** — all sources of change, how they interact, and what users experience.

---

## Core Model: The Brightness Ledger

Brightness changes through a **daily ledger** model. At the end of each day (or at check-in), the system reconciles all brightness changes.

```
┌─────────────────────────────────────────────────────────────┐
│                    BRIGHTNESS LEDGER                        │
├─────────────────────────────────────────────────────────────┤
│  GAINS                          │  LOSSES                   │
│  ─────                          │  ──────                   │
│  + Experiment completion        │  - Passive decay          │
│  + Insight recognition          │  - Experiment skip        │
│  + Streak bonus                 │  - Contradiction penalty  │
│  + Spillover from bright stars  │  - Dark star drain        │
│  + Recovery bonus               │  - Neglect acceleration   │
├─────────────────────────────────────────────────────────────┤
│                    NET CHANGE = Σ(gains) - Σ(losses)        │
│                    NEW_BRIGHTNESS = clamp(old + net, min, max)│
└─────────────────────────────────────────────────────────────┘
```

---

## Sources of Brightness Gain

### 1. Experiment Completion

When a user completes an experiment aligned with a star.

```
                    ┌──────────────────┐
   Experiment ──────│  Impact Sizing   │──────▶ brightness gain
                    └──────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
        Difficulty      Alignment       Novelty
        (tiny→stretch)  (star match)   (first time?)
```

**Sub-types:**
- **Tiny experiment** — Minimal gain, but consistent
- **Small experiment** — Moderate gain
- **Medium experiment** — Larger gain
- **Stretch experiment** — Highest gain, but risky

### 2. Insight Recognition

When a user has a meaningful realization about a star.

```
                    ┌──────────────────┐
   Insight ─────────│  Impact Sizing   │──────▶ brightness gain
                    └──────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
        Depth           Novelty         Source
     (surface→deep)  (new pattern?)  (user vs TARS)
```

### 3. Streak Bonus

Consecutive days of engagement multiply impact.

```
   Day 1: base impact
   Day 2: base impact × streak_multiplier
   Day 3: base impact × streak_multiplier²
   ...
   Day N: base impact × min(streak_multiplier^(N-1), max_streak_bonus)
```

**Key property:** Streak resets on skip, but not fully — a "partial reset" preserves some momentum.

### 4. Spillover (from Bright Stars)

Bright stars radiate energy to connected stars.

```
                    ┌─────────────┐
   BRIGHT star ────▶│  Spillover  │────▶ connected stars gain brightness
                    └─────────────┘
                          │
                          ▼
                  Connection strength
                  determines magnitude
```

**Key property:** Only BRIGHT stars spill over. DIM/FLICKERING don't radiate.

### 5. Recovery Bonus

Stars that have been DIM or DARK get a boost when re-engaged.

```
   ┌────────────────────────────────────────────┐
   │  IF star.state in [DIM, DARK, DORMANT]     │
   │  AND user engages after long absence       │
   │  THEN apply recovery_bonus to first action │
   └────────────────────────────────────────────┘
```

**Key property:** Encourages return. "It's never too late."

---

## Sources of Brightness Loss

### 1. Passive Decay

Stars dim naturally without engagement. This is the core "use it or lose it" mechanic.

```
                    ┌──────────────────┐
   Time passes ─────│  Decay Engine    │──────▶ brightness loss
                    └──────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
        Domain          Current         Engagement
      (half-life)      brightness      (cancels if engaged)
```

**Key properties:**
- Decay is **proportional** — faster when bright, slower when dim
- Decay has a **soft floor** — stars don't die, they go dormant
- Engagement **cancels** decay for that day (not just reduces)

### 2. Experiment Skip

When a user commits to an experiment but doesn't complete it.

```
                    ┌──────────────────┐
   Skip ────────────│  Penalty Sizing  │──────▶ brightness loss
                    └──────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
        Frequency       Reason          Pattern
      (first vs 3rd)  (forgot vs      (same star
                       refused)        repeatedly?)
```

**Key property:** First skip is nearly free. Repeated skips compound.

### 3. Contradiction Penalty

When user's stated values contradict their behavior.

```
   ┌─────────────────────────────────────────────────────────┐
   │  User says: "Family is my priority"                     │
   │  User does: Skips family time for work repeatedly       │
   │  TARS notices: "You've chosen work over family 5x"      │
   │  Result: Relationships star takes contradiction penalty │
   └─────────────────────────────────────────────────────────┘
```

**Key property:** TARS names contradictions without judgment. The penalty is informational, not punitive.

### 4. Dark Star Drain

DARK stars actively pull energy from connected stars.

```
   ┌──────────────┐          ┌──────────────┐
   │  DARK star   │─────────▶│  Connected   │
   │  (gravity)   │  drains  │  star dims   │
   └──────────────┘          └──────────────┘
```

**Key property:** The darker the dark star, the stronger the pull. Integration (confronting it) reduces drain.

### 5. Neglect Acceleration

Long periods of total inactivity accelerate decay.

```
   Days 1-7:   Normal decay rate
   Days 8-14:  Accelerated decay (neglect multiplier)
   Days 15+:   Maximum decay (approaching dormancy)
```

**Key property:** This creates urgency without panic. The user has time, but not forever.

---

## Interaction Model

### Processing Order

```
   1. Calculate all gains (additive)
   2. Apply daily cap to gains
   3. Calculate all losses (additive)
   4. Apply engagement cancellation to decay (if applicable)
   5. Calculate net change
   6. Apply soft floor protection
   7. Update brightness
   8. Check for state transitions (constellation-states)
```

### Timing

```
   ┌─────────────────────────────────────────────────────────┐
   │                     DAILY CYCLE                         │
   ├─────────────────────────────────────────────────────────┤
   │  Morning: Experiment offered                            │
   │  Day:     User may complete, skip, or ignore            │
   │  Evening: Check-in (required for constellation update)  │
   │  Night:   System reconciles ledger, updates brightness  │
   └─────────────────────────────────────────────────────────┘
```

**Key property:** Brightness doesn't update in real-time. It reconciles at check-in. This prevents anxiety-inducing micro-fluctuations.

---

## Experience Design

### What Users See

```
   ┌─────────────────────────────────────────────────────────┐
   │  NEVER show:                                            │
   │  - Raw numbers (0.73 → 0.71)                            │
   │  - Anxiety-inducing countdowns                          │
   │  - Punishment framing ("You lost 5%!")                  │
   │                                                         │
   │  ALWAYS show:                                           │
   │  - Visual brightness (glow intensity)                   │
   │  - Trend direction (brightening / dimming / stable)     │
   │  - TARS narrative ("Your Health star is steadier now")  │
   └─────────────────────────────────────────────────────────┘
```

### TARS Commentary

```
   Brightening:
   - "Your [star] is responding. It's brighter than last week."
   - "Three days of small moves. Your [star] noticed."

   Dimming:
   - "Your [star] is asking for attention. No rush."
   - "I notice [star] has been quiet. What's happening there?"

   Stable:
   - "Your [star] is holding steady. Maintenance mode."
   - "[Star] isn't moving. That's not bad — it's waiting."

   Recovery:
   - "Welcome back. Your [star] remembered you."
   - "[Star] was dormant, but look — it's flickering again."
```

---

## Recovery Mechanics

### The "Never Dead" Principle

```
   ┌─────────────────────────────────────────────────────────┐
   │  Stars NEVER reach zero brightness.                     │
   │  Stars NEVER disappear.                                 │
   │  Stars go DORMANT — grayed out, waiting.                │
   │  One action can wake a dormant star.                    │
   └─────────────────────────────────────────────────────────┘
```

### Recovery Path

```
   DORMANT ──[any engagement]──▶ FLICKERING
                                     │
                                     ▼
                           (normal progression resumes)
```

**Key property:** Recovery is FAST. The first action after dormancy gets a bonus. The system welcomes return, not punishes absence.

---

## Protection Mechanisms

### 1. Daily Gain Cap

Prevents gaming — no matter how many experiments, there's a maximum daily gain.

### 2. Soft Floor

Brightness can't go below a minimum. Stars dim but don't die.

### 3. Engagement Cancellation

If you engage with a star AT ALL, decay is cancelled for that day. No double-penalty.

### 4. Streak Preservation

Missing one day doesn't fully reset a streak. Partial preservation encourages return.

### 5. Maintenance Zone

Below a certain brightness threshold, decay slows dramatically. The system protects struggling stars.

---

## Entity Relationships

```
   ┌──────────────┐
   │     Star     │
   │  (the entity │
   │   being      │
   │   tracked)   │
   └──────┬───────┘
          │
          │ has
          ▼
   ┌──────────────┐         ┌──────────────┐
   │  Brightness  │◀───────▶│   Variance   │
   │  (continuous │ derived │  (stability  │
   │   0→1)       │         │   measure)   │
   └──────┬───────┘         └──────────────┘
          │
          │ drives
          ▼
   ┌──────────────┐
   │    State     │
   │ (from const- │
   │  ellation-   │
   │  states)     │
   └──────────────┘
```

---

## Edge Cases (Questions for SKIN)

| Case | Question |
|------|----------|
| Rapid engagement | What if user does 10 experiments in one day? |
| Contradictory signals | What if user completes experiment but TARS detects contradiction? |
| All stars decaying | What if user neglects entire constellation? |
| Bright star with dark connection | How does spillover interact with drain? |
| Clock manipulation | What if user changes device time? |
| Vacation mode | Should user be able to "pause" decay? |
| Retroactive logging | What if user logs experiment from yesterday? |

---

## Open Questions for BLOOD

- [ ] What are the specific impact values for each experiment type?
- [ ] How does streak multiplier scale?
- [ ] What is the spillover rate from bright stars?
- [ ] How much does contradiction penalty cost?
- [ ] What is the recovery bonus magnitude?
- [ ] How fast does neglect acceleration kick in?

---

## Relationship to Other Systems

**Depends on:**
- constellation-states (provides state definitions, some constants)

**Depended on by:**
- experiment-selection (needs to know impact of experiments)
- phase-transitions (needs aggregate brightness metrics)
- connection-formation (needs spillover mechanics)

---

## Summary

Brightness-decay is the **heartbeat** of the constellation. It's what makes stars feel alive — growing when tended, dimming when neglected, but never dying. The system is designed to be:

1. **Forgiving** — First mistakes are free, recovery is fast
2. **Honest** — Contradictions are named, patterns revealed
3. **Protective** — Soft floors, caps, and cancellation prevent spirals
4. **Invisible** — Users see glow and narrative, not numbers

*"Your stars are always waiting. They never give up on you."*
