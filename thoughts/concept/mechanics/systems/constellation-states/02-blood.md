# Constellation States - BLOOD

**System:** constellation-states
**Lens:** BLOOD (2/7)
**Created:** 2026-01-15
**Status:** Draft
**Depends on:** 01-skeleton.md ✓

---

## Overview

This document defines the mathematical formulas that govern star state transitions, brightness changes, and inter-star effects.

---

## 1. Core Properties

### 1.1 Brightness

The primary metric determining star state.

```
brightness ∈ [0.0, 1.0]
```

**Formula:**
```
brightness(t) = clamp(
    brightness(t-1) + daily_delta,
    MIN_BRIGHTNESS,
    MAX_BRIGHTNESS
)

daily_delta = positive_impacts - negative_impacts - decay
```

**Where:**
```
positive_impacts = Σ(action_impact × relevance_weight)
negative_impacts = Σ(skip_penalty × severity_weight)
decay = decay_rate × days_since_last_action
```

---

### 1.2 Variance

Measures stability over time. High variance = FLICKERING.

```
variance ∈ [0.0, 1.0]
```

**Formula (Rolling 7-day standard deviation):**
```
variance(t) = stddev(brightness[t-6], brightness[t-5], ..., brightness[t])
```

**Simplified for daily calculation:**
```
variance(t) = α × |brightness(t) - brightness(t-1)| + (1-α) × variance(t-1)

where α = VARIANCE_SMOOTHING_FACTOR
```

---

## 2. State Determination

### 2.1 State Transition Rules

States are determined by brightness AND variance AND duration.

```python
def determine_state(star, history):
    b = star.brightness
    v = star.variance
    days_stable = count_stable_days(history)
    days_inactive = days_since(star.last_engaged)

    # Dormancy check (highest priority)
    if is_dormant_candidate(star, days_inactive):
        return DORMANT

    # Dark star check
    if star.is_anti_pattern and star.contradictions >= 3:
        return DARK

    # Stability-based states
    if v > VARIANCE_THRESHOLD_HIGH:
        return FLICKERING

    if b >= BRIGHTNESS_THRESHOLD_BRIGHT and days_stable >= STABILIZATION_DAYS:
        return BRIGHT

    if b < BRIGHTNESS_THRESHOLD_DIM and days_stable >= STABILIZATION_DAYS:
        return DIM

    # Default to flickering if not stable enough
    return FLICKERING
```

### 2.2 Threshold Constants

| Constant | Value | Unit | Description |
|----------|-------|------|-------------|
| MIN_BRIGHTNESS | 0.05 | - | Floor (stars never hit true 0) |
| MAX_BRIGHTNESS | 1.0 | - | Ceiling |
| BRIGHTNESS_THRESHOLD_BRIGHT | 0.7 | - | Minimum to be BRIGHT |
| BRIGHTNESS_THRESHOLD_DIM | 0.5 | - | Maximum to be DIM |
| VARIANCE_THRESHOLD_HIGH | 0.15 | - | Above = FLICKERING |
| VARIANCE_THRESHOLD_LOW | 0.05 | - | Below = stable |
| STABILIZATION_DAYS | 7 | days | Required for state lock |
| VARIANCE_SMOOTHING_FACTOR | 0.3 | - | EMA alpha for variance |

### 2.3 Dormancy Thresholds

| From State | Days to Dormant | Rationale |
|------------|-----------------|-----------|
| FLICKERING | 14 | Unstable stars fade fast |
| DIM | 30 | Stable but weak, moderate inertia |
| BRIGHT | 60 | Strong stars persist longer |
| DARK | 30 | Dark stars are sticky |

---

## 3. Brightness Change Formulas

### 3.1 Positive Impacts

**Completed Experiment (aligned):**
```
impact = BASE_EXPERIMENT_IMPACT × difficulty_multiplier × streak_bonus

where:
  BASE_EXPERIMENT_IMPACT = 0.08
  difficulty_multiplier = {tiny: 0.5, small: 0.75, medium: 1.0, stretch: 1.5}
  streak_bonus = min(1 + (streak_days × 0.05), MAX_STREAK_BONUS)
  MAX_STREAK_BONUS = 1.5
```

**User Insight:**
```
impact = INSIGHT_IMPACT = 0.06
```

**Connection Formed:**
```
impact = CONNECTION_IMPACT = 0.04
```

### 3.2 Negative Impacts

**Skipped Experiment:**
```
penalty = BASE_SKIP_PENALTY × skip_count_modifier

where:
  BASE_SKIP_PENALTY = 0.02
  skip_count_modifier = {1: 1.0, 2: 1.5, 3+: 2.0}
```

**Contradiction Detected:**
```
penalty = CONTRADICTION_PENALTY = 0.10
```

### 3.3 Decay

**Daily Decay (no engagement):**
```
decay(t) = brightness(t-1) × daily_decay_rate

daily_decay_rate = 1 - (0.5)^(1/half_life)
```

**Half-lives by Domain:**
| Domain | Half-Life | Daily Decay Rate |
|--------|-----------|------------------|
| Health (behavioral) | 7 days | 9.43% |
| Relationships | 14 days | 4.83% |
| Purpose | 30 days | 2.28% |
| Wealth | 21 days | 3.25% |
| Soul (identity) | 90 days | 0.77% |

### 3.4 Daily Impact Cap

To prevent gaming:
```
total_positive_impact = min(
    sum(all_positive_impacts),
    MAX_DAILY_IMPACT
)

MAX_DAILY_IMPACT = 0.15
```

---

## 4. Dark Star Mechanics

### 4.1 Energy Drain

Dark stars pull energy from connected stars.

```
drain_per_day = DARK_STAR_DRAIN_RATE × connection_strength × dark_star_intensity

where:
  DARK_STAR_DRAIN_RATE = 0.03
  connection_strength ∈ [0, 1]
  dark_star_intensity = 1 - dark_star.brightness  # darker = stronger pull
```

**Applied to connected stars:**
```
connected_star.brightness -= drain_per_day
```

### 4.2 Dark Star Formation

A star becomes DARK when:
```
is_dark = (contradiction_count >= 3) OR (user_identified_as_anti_pattern)

contradiction_count: times user said X but did opposite
```

### 4.3 Dark Star Integration

Dark → DIM transition requires:
```
confrontation_score = (
    direct_engagements × 0.4 +
    shadow_experiments_completed × 0.4 +
    explicit_acknowledgment × 0.2
)

transition when confrontation_score >= INTEGRATION_THRESHOLD = 1.0
```

---

## 5. Spillover Mechanics

When a BRIGHT star is capped and receives more positive impact:

```
if brightness >= MAX_BRIGHTNESS:
    excess = attempted_impact - (MAX_BRIGHTNESS - current_brightness)

    for connected_star in star.connections:
        spillover = excess × SPILLOVER_RATE × connection_strength
        connected_star.brightness += spillover

    SPILLOVER_RATE = 0.3  # 30% of excess flows to connections
```

---

## 6. Nascent Star Formation

### 6.1 Pattern Detection

```
topic_mentions = count_mentions(topic, window=30_days)
nascent_threshold = 3

if topic_mentions >= nascent_threshold and topic not in existing_stars:
    create_nascent_star(topic)
```

### 6.2 Nascent Star Properties

```
nascent_star = Star(
    brightness = NASCENT_INITIAL_BRIGHTNESS = 0.1,
    variance = NASCENT_INITIAL_VARIANCE = 0.3,
    state = NASCENT
)
```

### 6.3 Nascent → Flickering

```
if user_acknowledges(nascent_star):
    nascent_star.brightness = FLICKERING_INITIAL_BRIGHTNESS = 0.3
    nascent_star.state = FLICKERING
```

---

## 7. Constants Reference

| Constant | Value | Unit | Source | Notes |
|----------|-------|------|--------|-------|
| MIN_BRIGHTNESS | 0.05 | - | | Stars never fully disappear |
| MAX_BRIGHTNESS | 1.0 | - | | Hard cap |
| BRIGHTNESS_THRESHOLD_BRIGHT | 0.7 | - | | ~70% of max = bright |
| BRIGHTNESS_THRESHOLD_DIM | 0.5 | - | | Below midpoint = dim |
| VARIANCE_THRESHOLD_HIGH | 0.15 | - | | Flickering indicator |
| VARIANCE_THRESHOLD_LOW | 0.05 | - | | Stability indicator |
| STABILIZATION_DAYS | 7 | days | | Week of consistency |
| BASE_EXPERIMENT_IMPACT | 0.08 | - | | Single action impact |
| MAX_DAILY_IMPACT | 0.15 | - | | Anti-gaming cap |
| MAX_STREAK_BONUS | 1.5 | - | | 50% bonus max |
| BASE_SKIP_PENALTY | 0.02 | - | | Gentle first skip |
| CONTRADICTION_PENALTY | 0.10 | - | | Say-do mismatch hurts |
| DARK_STAR_DRAIN_RATE | 0.03 | /day | | Energy pull rate |
| SPILLOVER_RATE | 0.3 | - | | 30% excess flows |
| INTEGRATION_THRESHOLD | 1.0 | - | | Dark→Dim requirement |
| NASCENT_INITIAL_BRIGHTNESS | 0.1 | - | | Ghost-like start |
| FLICKERING_INITIAL_BRIGHTNESS | 0.3 | - | | Acknowledged start |
| DORMANCY_THRESHOLD_FLICKERING | 14 | days | | Fast fade |
| DORMANCY_THRESHOLD_DIM | 30 | days | | Medium inertia |
| DORMANCY_THRESHOLD_BRIGHT | 60 | days | | Slow fade |
| DORMANCY_THRESHOLD_DARK | 30 | days | | Sticky but fades |

---

## 8. Algorithms

### 8.1 Daily State Update

```python
def update_star_daily(star, today_actions):
    # Calculate brightness change
    positive = calculate_positive_impacts(today_actions)
    positive = min(positive, MAX_DAILY_IMPACT)  # cap

    negative = calculate_negative_impacts(today_actions)
    decay = calculate_decay(star)

    star.brightness = clamp(
        star.brightness + positive - negative - decay,
        MIN_BRIGHTNESS,
        MAX_BRIGHTNESS
    )

    # Update variance
    star.variance = update_variance(star)

    # Check dark star drain
    if star.state == DARK:
        apply_energy_drain(star)

    # Check spillover
    if star.brightness >= MAX_BRIGHTNESS and positive > 0:
        apply_spillover(star, positive)

    # Determine new state
    star.state = determine_state(star)

    return star
```

### 8.2 Constellation Daily Update

```python
def update_constellation_daily(constellation):
    for star in constellation.stars:
        update_star_daily(star, get_today_actions(star))

    # Dark stars drain after all updates
    for star in constellation.stars:
        if star.state == DARK:
            for connection in star.connections:
                other = connection.other_star(star)
                drain = calculate_drain(star, connection)
                other.brightness = max(MIN_BRIGHTNESS, other.brightness - drain)

    # Check for dormancy
    for star in constellation.stars:
        check_dormancy(star)

    return constellation
```

---

## 9. State Transition Diagram with Numbers

```
                    ┌─────────────────────────────────────┐
                    │           NASCENT                    │
                    │        brightness: 0.1               │
                    │        variance: 0.3                 │
                    └─────────────┬───────────────────────┘
                                  │ user_acknowledges
                                  ▼
                    ┌─────────────────────────────────────┐
                    │          FLICKERING                  │
                    │     brightness: 0.3 - 0.7            │
                    │     variance: > 0.15                 │
                    └──────┬────────────────┬─────────────┘
                           │                │
          b≥0.7, v<0.1     │                │  b<0.5, v<0.1
          for 7 days       │                │  for 7 days
                           ▼                ▼
         ┌─────────────────────┐    ┌─────────────────────┐
         │       BRIGHT        │    │         DIM         │
         │   brightness: ≥0.7  │    │  brightness: <0.5   │
         │   variance: <0.1    │    │  variance: <0.1     │
         └─────────┬───────────┘    └──────────┬──────────┘
                   │                           │
                   │ decay                     │ 3x contradiction
                   ▼                           ▼
         ┌─────────────────────┐    ┌─────────────────────┐
         │      DORMANT        │    │        DARK         │
         │   brightness: any   │    │  drains connected   │
         │   grayed out        │    │  stars at 0.03/day  │
         └─────────────────────┘    └─────────────────────┘
```

---

## 10. Open Questions for NERVES

- [ ] Why 7 days for stabilization? (Need research on habit formation windows)
- [ ] Why 0.7/0.5 brightness thresholds? (Justify against alternatives)
- [ ] Why 0.03 dark star drain rate? (What feels right vs punishing?)
- [ ] Are half-lives by domain correct? (Lally study focused on habits)
- [ ] Is MAX_DAILY_IMPACT=0.15 the right anti-gaming balance?

---

*BLOOD complete. Proceed to NERVES for research justifications.*
