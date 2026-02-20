# The Horizon - NERVES

**System:** the-horizon
**Lens:** NERVES (3/7)
**Created:** 2026-01-15
**Status:** Draft
**Depends on:** 01-skeleton.md ✓, 02-blood.md ✓

---

## Overview

Research justifications for Horizon constants and mechanics.

---

## 1. Slingshot Power by Timeframe

### Why These Values?

| Timeframe | Power | Rationale |
|-----------|-------|-----------|
| 3_month | 0.15 | Habit formation window; small identity shift |
| 1_year | 0.40 | New Year's resolution cycle; meaningful but not transformative |
| 5_year | 0.80 | Major life phase; career pivots, relationship changes |
| 10_year | 1.00 | Generational/identity transformation |

**Sources:**

| Finding | Source |
|---------|--------|
| 66-day habit formation average | Lally et al. (2010) |
| 5-year career pivot average | Bureau of Labor Statistics |
| 10-year identity coherence cycles | Erikson's stages, McAdams narrative identity |

**Scaling logic:** Power roughly correlates with log(timeframe). 10-year is double 5-year, but requires deep identity work, hence exponential difficulty → proportional reward.

---

## 2. Drift Threshold and Timing

### Why 30 Days?

| Source | Finding | Application |
|--------|---------|-------------|
| SaaS churn research | 30-day inactive = high churn risk | 30 days as danger zone |
| Habit extinction | 21-28 days typical for habit loss | 30 days conservative |
| Goal pursuit research | 4-week abandoned goal = rarely resumed | Aligns with 30d |

### Why 0.10 Velocity Threshold?

**Rationale:** Below 10% of max velocity, progress is imperceptible. User may not realize they've stalled. This is early warning territory.

---

## 3. Dark Gravity (Inverse Square)

### Why Inverse Square?

| Model | Behavior | Applied |
|-------|----------|---------|
| Linear pull | Constant pull regardless of distance | ✗ Too aggressive |
| Inverse | Pull decreases linearly | ✗ Too weak at distance |
| **Inverse square** | Weak at distance, strong when close | ✓ Natural |

**Physics intuition:** Gravity follows inverse-square. Users intuitively understand "closer = stronger pull."

**Psychological analog:** Temptation / behavioral economics shows proximity effects are nonlinear — closer to a failure mode = exponentially harder to resist.

---

## 4. Horizon Momentum Decay (0.02/day)

### Why Slower Than Walk?

| Level | Decay | Half-life | Rationale |
|-------|-------|-----------|-----------|
| Walk | 0.05/day | ~14 days | Tactical; needs constant action |
| Horizon | 0.02/day | ~35 days | Strategic; allows breathing room |

**Source:** Long-term goal research shows monthly check-ins sufficient for maintenance (Locke & Latham, 2002). Daily doesn't help strategic planning.

---

## 5. Post-Arrival Velocity Preservation (50%)

### Why 50%?

**Concept:** When you complete a 10-year Horizon, you don't start from zero — you carry wisdom, skills, and momentum.

| Preservation | Effect | Assessment |
|--------------|--------|------------|
| 0% | Total reset | ✗ Ignores accumulated growth |
| 50% | Moderate carryover | ✓ Fresh start with foundation |
| 100% | Full carry | ✗ Trivializes new Horizon |

**Research analog:** Expert beginners (chess, music) learn new domains faster. Transfer of learning is partial but real (~40-60% in skill transfer studies).

---

## 6. Periodic Review Interval (180 days)

### Why 6 Months?

| Interval | Usage |
|----------|-------|
| Quarterly (90d) | Too frequent for strategic planning |
| Semi-annually (180d) | Standard corporate/life planning cycle |
| Annually (365d) | Too infrequent; life changes faster |

**Source:** Strategic planning best practices (Harvard Business Review); therapy check-in cadences (6-month protocols).

---

## 7. Horizon Decay Period (365 days)

### Why 1 Year?

| Duration | Implication |
|----------|-------------|
| 90 days | Too aggressive; punishes life events |
| 180 days | Still harsh; sabbaticals can be 6mo |
| **365 days** | Respects major life disruptions |
| 730 days | Too lenient; Horizon loses meaning |

**Rationale:** A year of complete disengagement suggests the Horizon is no longer relevant. Life has moved on. Starting fresh is appropriate.

---

## 8. Dan Koe Excavation Protocol

### Why Vision + Anti-Vision?

| Approach | Limitation |
|----------|------------|
| Vision only | Positive can feel abstract, hard to motivate |
| Anti-vision only | Negative can trigger avoidance spirals |
| **Both** | Stakes + aspiration = complete picture |

**Sources:**

| Concept | Source |
|---------|--------|
| Away vs Toward motivation | NLP research; Higgins Regulatory Focus Theory |
| Fear + Hope dual pathway | Terror Management Theory |
| "What you resist persists" | Jungian shadow work |

**Dan Koe integration:** "Unfuck Your Life" explicitly uses anti-vision as stakes, then vision as direction. The Horizon captures both.

---

## 9. Constants with Sources

| Constant | Value | Source | Confidence |
|----------|-------|--------|------------|
| SLINGSHOT_1_YEAR | 0.40 | Goal-setting research | Medium |
| SLINGSHOT_10_YEAR | 1.00 | Design choice (max) | Low |
| DRIFT_THRESHOLD | 0.10 | Design choice | Low |
| DRIFT_DAYS | 30 | SaaS + habit research | Medium |
| DARK_GRAVITY | 0.05 | Physics metaphor | Low |
| HORIZON_MOMENTUM_DECAY | 0.02 | Strategic planning research | Medium |
| POST_ARRIVAL_PRESERVATION | 0.50 | Skill transfer research | Medium |
| PERIODIC_REVIEW_INTERVAL | 180 | Standard planning cycles | High |
| HORIZON_DECAY_PERIOD | 365 | Sabbatical/life event norms | Medium |

---

## 10. Research Bibliography

| ID | Citation | Key Finding |
|----|----------|-------------|
| LA-1 | Lally et al. (2010) | 66-day habit formation average |
| LL-1 | Locke & Latham (2002) | Goal-setting theory; monthly check-ins |
| HI-1 | Higgins (1997) | Regulatory Focus Theory (prevention vs promotion) |
| ER-1 | Erikson (1950) | Psychosocial development stages |
| MA-1 | McAdams (2006) | Narrative identity; life story coherence |
| KO-1 | Koe, Dan (2024) | "Unfuck Your Life" protocol |

---

## 11. Open Questions

- [ ] Should slingshot decay over time if next Walk isn't started?
- [ ] How does dark star brightness affect experiment selection?
- [ ] Is 365-day decay too long for engagement-focused product?
- [ ] Should anti-vision be surfaced periodically or only on review?

---

*NERVES complete. Proceed to SKIN for edge cases.*
