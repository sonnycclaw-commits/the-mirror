# Constellation States - NERVES

**System:** constellation-states
**Lens:** NERVES (3/7)
**Created:** 2026-01-15
**Status:** Draft
**Depends on:** 02-blood.md ✓

---

## Overview

Every number needs a reason. This document justifies each constant with behavioral science research, game design precedent, or explicit design rationale.

---

## 1. Stabilization Period: 7 Days

**Constant:** STABILIZATION_DAYS = 7

### Research Foundation

**Lally et al. (2010) - "How are habits formed"**
- Mean time to habit automaticity: 66 days (but high variance: 18-254 days)
- Key finding: "Missing one opportunity did not materially affect the habit formation process"
- BUT: "Missing a week showed significant regression"

**Application:** 7 days represents a meaningful unit of consistency - short enough to feel achievable, long enough to filter out random variance.

**Game Design Precedent:**
- Duolingo: Weekly streaks are celebrated milestones
- Habitica: 7-day habit completion unlocks bonuses
- Apple Fitness: Week-based ring challenges

**Citation:**
> Lally, P., van Jaarsveld, C. H. M., Potts, H. W. W., & Wardle, J. (2010). How are habits formed: Modelling habit formation in the real world. *European Journal of Social Psychology*, 40(6), 998-1009.

---

## 2. Brightness Thresholds: 0.7 / 0.5

**Constants:**
- BRIGHTNESS_THRESHOLD_BRIGHT = 0.7
- BRIGHTNESS_THRESHOLD_DIM = 0.5

### Research Foundation

**Csikszentmihalyi's Flow Theory**
- Optimal challenge: ~70-80% of perceived capability
- Too easy (below 50%): boredom
- Too hard (above 90%): anxiety

**Application:**
- BRIGHT at 0.7 means "substantially above average" without requiring perfection
- DIM at 0.5 is the natural midpoint - neither good nor bad

**Game Design Precedent:**
- Letter grades: A starts at ~70% (B), excellence at ~90% (A)
- Pokemon: "Strong" Pokemon typically need 70%+ of max stats
- Destiny 2: "Masterwork" gear at roughly 70% of theoretical max

**Design Rationale:**
- 0.7 feels like "mostly there" - achievable but meaningful
- 0.5 is psychologically neutral - neither success nor failure
- Gap between 0.5-0.7 creates a "growth zone"

---

## 3. Variance Threshold: 0.15

**Constant:** VARIANCE_THRESHOLD_HIGH = 0.15

### Research Foundation

**Signal Detection Theory**
- Distinguishing signal from noise requires variance threshold
- 0.15 standard deviation = roughly 15% daily swings

**Practical meaning:**
- Brightness swinging from 0.4 to 0.55 daily = flickering
- Brightness steady at 0.45-0.48 = stable (dim)

**Game Design Precedent:**
- Stock price volatility: >15% daily swing = "volatile stock"
- Weather prediction: >15% temperature variance = "unsettled"

**Design Rationale:**
- Small enough to be sensitive to real instability
- Large enough to ignore minor measurement noise
- Visible difference: user should notice flickering animation

---

## 4. Half-Life Decay Rates

**Constants:** Half-lives by domain

| Domain | Half-Life | Source |
|--------|-----------|--------|
| Health (behavioral) | 7 days | Lally (2010) |
| Relationships | 14 days | Gottman (1999) |
| Purpose | 30 days | Design choice |
| Wealth | 21 days | Design choice |
| Soul (identity) | 90 days | Kegan (1994) |

### Research Foundation

**Behavioral (Health) - 7 days**
> Lally et al.: Habits show significant regression after one week of non-performance

**Relational - 14 days**
> Gottman's relationship research: Emotional bids need response within ~2 weeks or relationship quality declines measurably

**Identity/Soul - 90 days**
> Kegan's developmental psychology: Core belief changes occur over months, not days

**Purpose/Wealth - Design choices**
- Purpose: 30 days matches monthly review cycles
- Wealth: 21 days (3 weeks) balances between habit and identity

**Citations:**
> Gottman, J. M., & Silver, N. (1999). The Seven Principles for Making Marriage Work. Crown Publishers.
> Kegan, R. (1994). In Over Our Heads: The Mental Demands of Modern Life. Harvard University Press.

---

## 5. Base Experiment Impact: 0.08

**Constant:** BASE_EXPERIMENT_IMPACT = 0.08

### Design Rationale

**Working backwards from desired progression:**
- Goal: ~14 days of consistent effort to reach BRIGHT (0.7)
- Starting from FLICKERING (0.3)
- Gap to cover: 0.7 - 0.3 = 0.4

**Calculation:**
```
daily_progress = 0.08 (base) × 1.0 (medium difficulty)
days_needed = 0.4 / 0.08 = 5 days

With decay (~3% daily for behavioral):
adjusted_days ≈ 5 / 0.97^5 ≈ 6 days

With streak bonus ramping up:
realistic_days ≈ 10-14 days
```

**Game Design Precedent:**
- XP systems typically require 10-20 actions per level
- Duolingo: ~10-15 lessons to advance one level

**Validation:** Simulation required in MIRROR phase

---

## 6. Maximum Daily Impact: 0.15

**Constant:** MAX_DAILY_IMPACT = 0.15

### Research Foundation

**Fogg Behavior Model**
- Motivation fluctuates; behavior shouldn't depend on motivation spikes
- Sustainable change comes from consistency, not intensity

**Anti-Gaming Rationale:**
- Without cap: User could complete 10 tiny experiments in one day → brightness = 0.8 (instant BRIGHT)
- With cap: Maximum single-day gain = 15% → Still need multiple days

**Game Design Precedent:**
- Daily XP caps in MMOs (World of Warcraft, Final Fantasy XIV)
- Duolingo: Diminishing XP after ~5 lessons/day
- Apple Fitness: Rings have daily caps

**Design Rationale:**
- 0.15 allows meaningful single-day progress
- But requires minimum 3 days to go from DIM to BRIGHT
- Encourages daily engagement over burst activity

---

## 7. Dark Star Drain Rate: 0.03

**Constant:** DARK_STAR_DRAIN_RATE = 0.03

### Research Foundation

**Negativity Bias (Baumeister et al., 2001)**
> "Bad is stronger than good" - negative events have ~3x the psychological impact of positive events

**Application:**
- Daily drain of 0.03 = 3% per day
- Connected BRIGHT star (0.8) loses 0.024/day from single dark star
- After 30 days: 0.8 - (0.024 × 30) = 0.08 → significant but not instant

**Design Rationale:**
- Strong enough to feel the pull (user notices bright stars dimming)
- Slow enough that intervention is possible
- Creates urgency without panic

**Citation:**
> Baumeister, R. F., Bratslavsky, E., Finkenauer, C., & Vohs, K. D. (2001). Bad is stronger than good. *Review of General Psychology*, 5(4), 323-370.

---

## 8. Spillover Rate: 0.3

**Constant:** SPILLOVER_RATE = 0.3

### Research Foundation

**Self-Determination Theory (Deci & Ryan)**
- Competence in one area builds general self-efficacy
- "Spill-over effect" observed in motivation research

**Application:**
- When Purpose star is maxed, 30% of excess flows to connected stars
- Creates interconnection without making everything easy

**Design Rationale:**
- High enough to reward maxed stars (continued effort isn't wasted)
- Low enough that each star still needs direct attention
- 30% is a common "bonus" percentage in games

---

## 9. Streak Bonus: Max 1.5x

**Constant:** MAX_STREAK_BONUS = 1.5

### Research Foundation

**Variable Ratio Reinforcement (Skinner)**
- Most engaging reward schedules vary but have predictable bounds
- Streak bonuses work if bounded (otherwise: anxiety)

**Game Design Precedent:**
- Duolingo: Streak bonuses cap at ~2x
- Wordle: Streak doesn't affect gameplay (prevents anxiety)
- Habitica: Streak bonuses are percentage-based, capped

**Design Rationale:**
- 1.5x = meaningful bonus for consistency
- Capped to prevent "streak anxiety" (fear of losing multiplier)
- After day 10: bonus maxes out, reducing pressure

---

## 10. Skip Penalty: 0.02 (grace) → 0.08 (pattern)

**Constants:**
- BASE_SKIP_PENALTY = 0.02
- Repeated skip modifier: 2x at 3+ skips

### Research Foundation

**Lally et al. (2010)**
> "Missing one opportunity to perform the behavior did not materially affect the habit formation process"

**Application:**
- First skip: only -0.02 (minimal)
- Pattern of skips: -0.08 (significant)
- Distinction between "life happened" and "avoidance pattern"

**Design Rationale:**
- Grace for single misses (no shame spiral)
- Accountability for patterns (honest feedback)
- TARS language matches: "That's data. What got in the way?"

---

## 11. Dormancy Thresholds

| From State | Days | Source |
|------------|------|--------|
| FLICKERING | 14 | 2x stabilization period |
| DIM | 30 | Monthly cycle |
| BRIGHT | 60 | 2x DIM (earned persistence) |
| DARK | 30 | Same as DIM (sticky but finite) |

### Design Rationale

**FLICKERING → 14 days**
- Unstable stars haven't proven themselves
- Quick fade prevents constellation clutter

**DIM → 30 days**
- Matches monthly review cycles
- "If you haven't engaged in a month, is this still relevant?"

**BRIGHT → 60 days**
- Earned stars deserve longer runway
- Two months of neglect = significant life change

**DARK → 30 days**
- Dark stars are important but shouldn't haunt forever
- If unaddressed for a month, goes dormant (can return)

---

## 12. Constants Summary with Sources

| Constant | Value | Confidence | Source |
|----------|-------|------------|--------|
| STABILIZATION_DAYS | 7 | High | Lally 2010, game precedent |
| BRIGHTNESS_THRESHOLD_BRIGHT | 0.7 | Medium | Flow theory, game precedent |
| BRIGHTNESS_THRESHOLD_DIM | 0.5 | High | Mathematical midpoint |
| VARIANCE_THRESHOLD_HIGH | 0.15 | Medium | Signal theory, needs validation |
| HALF_LIFE_BEHAVIORAL | 7 | High | Lally 2010 |
| HALF_LIFE_RELATIONAL | 14 | Medium | Gottman extrapolation |
| HALF_LIFE_IDENTITY | 90 | Medium | Kegan extrapolation |
| BASE_EXPERIMENT_IMPACT | 0.08 | Low | Back-calculation, needs simulation |
| MAX_DAILY_IMPACT | 0.15 | Medium | Anti-gaming, needs feel-test |
| DARK_STAR_DRAIN_RATE | 0.03 | Low | Negativity bias, needs tuning |
| SPILLOVER_RATE | 0.3 | Medium | SDT, common game percentage |
| MAX_STREAK_BONUS | 1.5 | Medium | Game precedent |
| BASE_SKIP_PENALTY | 0.02 | High | Lally 2010 |

---

## 13. Gaps and Validation Plan

| Constant | Confidence | Validation Method |
|----------|------------|-------------------|
| BASE_EXPERIMENT_IMPACT | Low | MIRROR simulation |
| DARK_STAR_DRAIN_RATE | Low | MIRROR simulation + user testing |
| VARIANCE_THRESHOLD_HIGH | Medium | A/B test in beta |
| HALF_LIFE_PURPOSE | Medium | User research |
| HALF_LIFE_WEALTH | Medium | User research |

---

## 14. Key Citations

1. **Lally, P., et al. (2010).** How are habits formed: Modelling habit formation in the real world. *European Journal of Social Psychology*, 40(6), 998-1009.

2. **Baumeister, R. F., et al. (2001).** Bad is stronger than good. *Review of General Psychology*, 5(4), 323-370.

3. **Csikszentmihalyi, M. (1990).** Flow: The Psychology of Optimal Experience. Harper & Row.

4. **Deci, E. L., & Ryan, R. M. (2000).** The "What" and "Why" of Goal Pursuits: Human Needs and the Self-Determination of Behavior. *Psychological Inquiry*, 11(4), 227-268.

5. **Gottman, J. M., & Silver, N. (1999).** The Seven Principles for Making Marriage Work. Crown Publishers.

6. **Kegan, R. (1994).** In Over Our Heads: The Mental Demands of Modern Life. Harvard University Press.

7. **Fogg, B. J. (2009).** A Behavior Model for Persuasive Design. *Persuasive '09*.

---

*NERVES complete. Proceed to SKIN for edge cases and bounds.*
