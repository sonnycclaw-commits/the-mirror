# The Walk - NERVES

**System:** the-walk
**Lens:** NERVES (3/7)
**Created:** 2026-01-15
**Status:** Draft
**Depends on:** 01-skeleton.md ✓, 02-blood.md ✓

---

## Overview

Research citations and rationale for every constant in BLOOD.

---

## 1. Momentum and Velocity

### Momentum Decay Rate (0.05/day)

| Source | Finding |
|--------|---------|
| Ebbinghaus (1885) | Memory decay follows exponential curve |
| Lally (2010) | Habit automaticity plateaus around day 66 |
| Goal gradient hypothesis | Motivation increases approaching goals |

**Rationale:** 5% daily decay means momentum halves in ~14 days without action. This aligns with the 2-week window where habits are most fragile.

### Momentum Boost Factor (0.30)

| Source | Finding |
|--------|---------|
| Bandura (1997) | Self-efficacy builds through mastery experiences |
| Csikszentmihalyi (1990) | Flow states create positive feedback loops |
| "Winner effect" (Zilioli, 2014) | Success increases testosterone → confidence |

**Rationale:** 30% bonus at max momentum means consistent action roughly doubles effective velocity. Not so high as to create runaway effects.

---

## 2. Milestone Mechanics

### Base Thrust (0.10)

| Source | Finding |
|--------|---------|
| Locke & Latham (2002) | Goal completion provides motivational boost |
| Amabile & Kramer (2011) | "Progress principle" — small wins drive engagement |
| Dopamine research | Milestone completion = dopamine release |

**Rationale:** 10% velocity boost per milestone is significant but not game-breaking. User needs ~3 milestones to double their velocity from 0.1 to 0.2.

### Difficulty Multipliers (0.8-3.0)

| Timeframe | Multiplier | Rationale |
|-----------|------------|-----------|
| 1 month | 0.8 | Short-term, less transformative |
| 3 month | 1.0 | Baseline |
| 6 month | 1.2 | Meaningful sustained effort |
| 1 year | 1.5 | Requires identity shift |
| 2 year | 2.0 | Major life change |
| 5 year | 3.0 | Generational transformation |

**Source:** Proportional to estimated effort and identity change required.

---

## 3. Gravitational Pull

### Inverse Square Law

| Source | Finding |
|--------|---------|
| Physics | Natural force decay: F ∝ 1/r² |
| Goal gradient hypothesis (Hull, 1932) | Motivation increases as goal approaches |
| "Last mile" behavior economics | People push harder near finish |

**Rationale:** Using physics metaphor creates intuitive understanding. As you approach a star, it "pulls" harder — experiments toward it feel more urgent.

### Max Pull Cap (0.50)

**Rationale:** Prevents singularity. Even the closest star shouldn't dominate all experiment selection. 50% cap means other priorities can still surface.

---

## 4. Decay Rates

### Base Velocity Decay (0.02/day)

| Source | Finding |
|--------|---------|
| Lally (2010) | Average 66 days to habit automaticity |
| Habit research | 2-3 weeks without action loses >50% of habit strength |
| SaaS churn data | User engagement decays exponentially |

**Rationale:** 2% daily decay means velocity halves in ~35 days. Gentle enough to allow occasional breaks, steep enough to require regular action.

### Decay Acceleration (0.01/day²)

| Source | Finding |
|--------|---------|
| Abstinence violation effect | Extended lapses trigger spirals |
| "What the hell" effect | After one failure, subsequent failures easier |

**Rationale:** 1% acceleration means by day 10 of inaction, decay rate has doubled from 2% to 12%. Creates gentle urgency without punishment.

---

## 5. Stall Thresholds

### Stall Threshold (0.05 velocity)

**Rationale:** Below 5% velocity, progress is essentially imperceptible. User may not realize they've stalled. TARS intervention appropriate.

### Stall Days (14)

| Source | Finding |
|--------|---------|
| Mobile app analytics | 14-day inactivity predicts churn |
| SaaS best practices | 2-week window for re-engagement |
| Habit research | 2 weeks is "danger zone" for habit loss |

**Rationale:** 14 days is long enough to not be annoying (occasional breaks allowed) but short enough to catch stalls before they become abandonment.

---

## 6. Waiting/Paused Thresholds

### Waiting Expiry (30 days)

| Source | Finding |
|--------|---------|
| Conversion funnel research | Intent-to-action gap ~30 days |
| SaaS trial benchmarks | 30-day trials = industry standard |

**Rationale:** 30 days gives users time to decide without leaving journey in limbo forever. After 30 days, interest has likely faded.

### Paused Expiry (90 days)

| Source | Finding |
|--------|---------|
| "Return player" campaigns (gaming) | 60-90 day window for re-engagement |
| Life events (sabbaticals) | 3 months = typical break duration |

**Rationale:** 90 days respects legitimate life events (illness, travel, major life changes) while eventually releasing resources.

---

## 7. Multi-Journey Capacity

### Max Daily Experiments (3)

| Source | Finding |
|--------|---------|
| Cognitive load (Miller, 1956) | Working memory ~7±2 items |
| Tiny Habits (Fogg, 2020) | 2-3 behaviors max for new habit formation |
| Implementation intentions | Specific plans work; vague lists don't |

**Rationale:** 3 experiments is ambitious but achievable. More than 3 risks overwhelm and skip cascade.

### Max Active Journeys (3)

**Rationale:** Mirrors experiment cap. Each journey needs at least 1 experiment/day to progress. 3 journeys × 1 experiment = 3 total, hitting capacity.

---

## 8. Reach Threshold (0.15)

**Rationale:** 15% of max distance means user must get "close but not exact" to a milestone. Allows for imperfect navigation while requiring genuine progress.

---

## 9. Preview/Conversion Timing

### Preview Duration (2-5 min)

| Source | Finding |
|--------|---------|
| TED talks | Optimal attention span 12-18 minutes |
| Video completion rates | Sharp dropoff after 2 minutes |
| Emotional arc theory | Narrative needs setup → build → payoff |

**Rationale:** Long enough to create emotional investment, short enough to hold attention. 3-4 milestones × 30-40 seconds each = ~2-3 minutes.

---

## 10. Constants with Sources

| Constant | Value | Source | Confidence |
|----------|-------|--------|------------|
| MOMENTUM_DECAY | 0.05 | Ebbinghaus, Lally | Medium |
| MOMENTUM_BOOST_FACTOR | 0.30 | Bandura, "winner effect" | Low |
| BASE_THRUST | 0.10 | Progress principle | Medium |
| MILESTONE_ACCEL_BONUS | 0.05 | Design choice | Low |
| GRAVITY_CONSTANT | 0.01 | Physics metaphor | Low |
| MAX_PULL | 0.50 | Design choice | Low |
| BASE_DECAY | 0.02 | Lally, SaaS research | Medium |
| DECAY_ACCELERATION | 0.01 | AVE research | Low |
| STALL_THRESHOLD | 0.05 | Design choice | Low |
| STALL_DAYS | 14 | App analytics | Medium |
| WAITING_EXPIRE_DAYS | 30 | Conversion research | Medium |
| PAUSED_EXPIRE_DAYS | 90 | Gaming, life events | Medium |
| MAX_DAILY_EXPERIMENTS | 3 | Miller, Fogg | High |
| MAX_ACTIVE_JOURNEYS | 3 | Derived from above | Medium |
| REACH_THRESHOLD | 0.15 | Design choice | Low |

---

## 11. Research Bibliography

| ID | Citation | Key Finding |
|----|----------|-------------|
| EB-1 | Ebbinghaus (1885). Memory | Forgetting curve = exponential |
| LA-1 | Lally et al. (2010). Habit formation | 66 days average to automaticity |
| BA-1 | Bandura (1997). Self-efficacy | Mastery builds confidence |
| CS-1 | Csikszentmihalyi (1990). Flow | Optimal experience creates loops |
| LL-1 | Locke & Latham (2002). Goal-setting theory | Specific goals > vague |
| AK-1 | Amabile & Kramer (2011). Progress principle | Small wins drive motivation |
| HU-1 | Hull (1932). Goal gradient | Motivation increases near goal |
| FO-1 | Fogg (2020). Tiny Habits | 2-3 behaviors max |
| MI-1 | Miller (1956). Magical number 7±2 | Working memory limits |
| ZI-1 | Zilioli (2014). Winner effect | Success → testosterone → confidence |

---

## 12. Open Questions

- [ ] Should momentum boost be linear or logarithmic?
- [ ] Is inverse-square gravity too steep? Consider linear alternative.
- [ ] Should stall intervention be TARS-initiated or user-requested?
- [ ] How do we validate these constants post-launch? A/B test framework?

---

*NERVES complete. Proceed to SKIN for edge cases.*
