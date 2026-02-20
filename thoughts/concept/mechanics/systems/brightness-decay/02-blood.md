# Brightness & Decay - BLOOD

**System:** brightness-decay
**Lens:** BLOOD (2/7)
**Created:** 2026-01-15
**Status:** Draft
**Depends on:** 01-skeleton.md ✓, constellation-states/06-scripture.md ✓

---

## Overview

This document defines the formulas governing brightness dynamics. It builds on constellation-states (which defines state transitions) by elaborating the **continuous mechanics** of how brightness changes.

**Canonical values from constellation-states scripture are imported.** This document extends with formulas for streaks, recovery, neglect, and experience.

---

## 1. The Master Formula

The daily brightness update follows this structure:

```python
def update_brightness(star, day_events):
    # GAINS
    experiment_gain = calculate_experiment_gain(day_events.experiments)
    insight_gain = calculate_insight_gain(day_events.insights)
    streak_bonus = calculate_streak_bonus(star.streak_days)
    spillover_gain = calculate_spillover_received(star)
    recovery_bonus = calculate_recovery_bonus(star) if star.returning else 0

    total_gains = experiment_gain + insight_gain + spillover_gain + recovery_bonus
    total_gains *= streak_bonus  # Multiplier applied to all gains
    total_gains = min(total_gains, MAX_DAILY_GAIN)  # Cap

    # LOSSES
    skip_penalty = calculate_skip_penalty(day_events.skips, star)
    contradiction_penalty = calculate_contradiction_penalty(day_events.contradictions)
    dark_drain = calculate_dark_drain_received(star)
    decay = calculate_decay(star, day_events.engaged)
    neglect_acceleration = calculate_neglect_acceleration(star)

    total_losses = skip_penalty + contradiction_penalty + dark_drain + decay
    total_losses *= neglect_acceleration  # Multiplier when long-inactive

    # NET CHANGE
    net_change = total_gains - total_losses

    # SOFT FLOOR PROTECTION
    new_brightness = star.brightness + net_change
    new_brightness = apply_soft_floor(new_brightness, star.brightness)

    return clamp(new_brightness, MIN_BRIGHTNESS, MAX_BRIGHTNESS)
```

---

## 2. Gains Formulas

### 2.1 Experiment Gain

```python
def calculate_experiment_gain(experiments):
    total = 0
    for exp in experiments:
        base = BASE_EXPERIMENT_IMPACT  # 0.03
        difficulty = DIFFICULTY_MULTIPLIERS[exp.difficulty]
        alignment = exp.alignment_score  # 0.5 to 1.0
        novelty = NOVELTY_BONUS if exp.is_first_of_type else 1.0

        impact = base * difficulty * alignment * novelty
        total += impact

    return total
```

**Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| BASE_EXPERIMENT_IMPACT | 0.03 | From constellation-states |
| NOVELTY_BONUS | 1.2 | 20% boost for new experiment types |

**Difficulty Multipliers:**

| Difficulty | Multiplier | Rationale |
|------------|------------|-----------|
| tiny | 0.5 | Low effort, low reward (but consistent) |
| small | 0.75 | Moderate effort |
| medium | 1.0 | Baseline |
| stretch | 1.5 | High risk, high reward |

**Alignment Score:**

| Alignment | Score | Description |
|-----------|-------|-------------|
| Direct | 1.0 | Experiment targets this specific star |
| Related | 0.75 | Experiment targets connected star |
| Tangential | 0.5 | Weak conceptual link |

### 2.2 Insight Gain

```python
def calculate_insight_gain(insights):
    total = 0
    for insight in insights:
        base = INSIGHT_IMPACT  # 0.02
        depth = DEPTH_MULTIPLIERS[insight.depth]
        source = SOURCE_MULTIPLIERS[insight.source]

        impact = base * depth * source
        total += impact

    return total
```

**Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| INSIGHT_IMPACT | 0.02 | From constellation-states |

**Depth Multipliers:**

| Depth | Multiplier | Example |
|-------|------------|---------|
| surface | 0.5 | "I noticed I skipped again" |
| pattern | 1.0 | "I always skip on weekends" |
| root | 1.5 | "I skip because I fear failure" |

**Source Multipliers:**

| Source | Multiplier | Rationale |
|--------|------------|-----------|
| user_initiated | 1.2 | User discovered it themselves |
| tars_prompted | 1.0 | TARS asked, user answered |
| tars_observed | 0.8 | TARS named it, user agreed |

### 2.3 Streak Bonus

Consecutive days of engagement multiply all gains.

```python
def calculate_streak_bonus(streak_days):
    if streak_days <= 1:
        return 1.0

    # Logarithmic growth: big early gains, diminishing returns
    bonus = 1 + STREAK_GROWTH_RATE * log(streak_days)
    return min(bonus, MAX_STREAK_BONUS)
```

**Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| STREAK_GROWTH_RATE | 0.15 | Controls curve steepness |
| MAX_STREAK_BONUS | 1.3 | From constellation-states (30% max boost) |

**Streak Values:**

| Days | Bonus | Total Gain Multiplier |
|------|-------|----------------------|
| 1 | 1.0 | 100% |
| 3 | 1.16 | 116% |
| 7 | 1.29 | 129% |
| 14 | 1.30 | 130% (capped) |
| 30 | 1.30 | 130% (capped) |

### 2.4 Streak Preservation (Partial Reset)

Missing a day doesn't fully reset the streak.

```python
def update_streak(star, engaged_today):
    if engaged_today:
        star.streak_days += 1
    else:
        # Partial reset: keep some momentum
        star.streak_days = max(
            0,
            floor(star.streak_days * STREAK_PRESERVATION_RATE)
        )
```

**Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| STREAK_PRESERVATION_RATE | 0.5 | Keep half on miss |

**Example:**
```
Day 7 streak → miss → Day 3 streak (not Day 0)
Day 14 streak → miss → Day 7 streak
```

### 2.5 Spillover Gain

Received from connected BRIGHT stars.

```python
def calculate_spillover_received(star):
    total = 0
    for connection in star.connections:
        other = connection.other_star
        if other.state == BRIGHT and other.brightness >= SPILLOVER_THRESHOLD:
            spillover = (
                SPILLOVER_RATE *
                connection.strength *
                (other.brightness - SPILLOVER_THRESHOLD)
            )
            total += spillover

    return total
```

**Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| SPILLOVER_RATE | 0.3 | From constellation-states |
| SPILLOVER_THRESHOLD | 0.8 | Must be very bright to spill |

**Key insight:** Spillover is **passive** — BRIGHT stars radiate automatically. Users don't have to do anything; they just benefit from their bright stars lifting others.

### 2.6 Recovery Bonus

First engagement after absence gets a boost.

```python
def calculate_recovery_bonus(star):
    if not star.returning:
        return 0

    days_absent = star.days_since_last_engaged

    # Bonus scales with absence (encourages return)
    if days_absent < RECOVERY_MIN_DAYS:
        return 0

    bonus = RECOVERY_BASE * min(
        1 + RECOVERY_SCALE * log(days_absent / RECOVERY_MIN_DAYS),
        RECOVERY_MAX_MULTIPLIER
    )

    return bonus
```

**Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| RECOVERY_BASE | 0.05 | Base recovery bonus |
| RECOVERY_MIN_DAYS | 7 | Absence must be 7+ days to qualify |
| RECOVERY_SCALE | 0.3 | How fast bonus grows with absence |
| RECOVERY_MAX_MULTIPLIER | 2.0 | Cap at 2x base (0.10 total) |

**Example:**
```
7 days absent  → +0.05 bonus
14 days absent → +0.06 bonus
30 days absent → +0.08 bonus
60 days absent → +0.10 bonus (capped)
```

**Key insight:** The system *celebrates* return. "You came back. That matters more than how long you were gone."

---

## 3. Losses Formulas

### 3.1 Passive Decay

Stars dim without engagement (from constellation-states).

```python
def calculate_decay(star, engaged_today):
    # Engagement cancels decay
    if engaged_today:
        return 0

    half_life = HALF_LIVES[star.domain]
    base_rate = 1 - (0.5 ** (1 / half_life))

    # Proportional decay: slower near floor
    distance_from_floor = (star.brightness - MIN_BRIGHTNESS) / (MAX_BRIGHTNESS - MIN_BRIGHTNESS)

    # Maintenance zone protection
    zone_factor = 0.5 if star.brightness < MAINTENANCE_ZONE else 1.0

    decay = star.brightness * base_rate * distance_from_floor * zone_factor

    return decay
```

**Constants (from constellation-states):**

| Domain | Half-Life | Daily Decay Rate |
|--------|-----------|------------------|
| Health | 7 days | 9.43% |
| Relationships | 14 days | 4.83% |
| Wealth | 21 days | 3.25% |
| Purpose | 30 days | 2.28% |
| Soul | 90 days | 0.77% |

| Constant | Value | Description |
|----------|-------|-------------|
| MIN_BRIGHTNESS | 0.05 | From constellation-states |
| MAINTENANCE_ZONE | 0.3 | From constellation-states |

### 3.2 Skip Penalty

Committed but didn't complete.

```python
def calculate_skip_penalty(skips, star):
    if len(skips) == 0:
        return 0

    # Track consecutive skips on this star
    consecutive = star.consecutive_skips

    # Progressive penalty
    if consecutive == 0:
        # First skip: nearly free
        return 0
    elif consecutive == 1:
        return BASE_SKIP_PENALTY  # 0.008
    elif consecutive == 2:
        return BASE_SKIP_PENALTY * 1.5  # 0.012
    else:
        return BASE_SKIP_PENALTY * 2.0  # 0.016 (capped)
```

**Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| BASE_SKIP_PENALTY | 0.008 | From constellation-states |
| MAX_SKIP_MULTIPLIER | 2.0 | Cap at 2x base |

**Skip Progression:**

| Consecutive Skips | Penalty | Cumulative |
|-------------------|---------|------------|
| 1st | 0 | 0 |
| 2nd | 0.008 | 0.008 |
| 3rd | 0.012 | 0.020 |
| 4th+ | 0.016 | 0.036+ |

**Key insight:** First skip is free. Life happens. The penalty kicks in when skipping becomes a pattern.

### 3.3 Contradiction Penalty

Say-do mismatch detected by TARS.

```python
def calculate_contradiction_penalty(contradictions):
    total = 0
    for c in contradictions:
        severity = SEVERITY_MULTIPLIERS[c.severity]
        recency = RECENCY_MULTIPLIERS[c.recency]

        penalty = CONTRADICTION_PENALTY * severity * recency
        total += penalty

    return total
```

**Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| CONTRADICTION_PENALTY | 0.04 | From constellation-states |

**Severity Multipliers:**

| Severity | Multiplier | Example |
|----------|------------|---------|
| mild | 0.5 | "I'll call mom" → didn't call |
| moderate | 1.0 | "Family is priority" → chose work 3x |
| severe | 1.5 | Core value directly violated |

**Recency Multipliers:**

| Recency | Multiplier | Description |
|---------|------------|-------------|
| fresh | 1.0 | Contradiction in last 24h |
| recent | 0.7 | Contradiction in last week |
| old | 0.3 | Contradiction > 1 week ago |

### 3.4 Dark Star Drain

From constellation-states, applied after all other calculations.

```python
def calculate_dark_drain_received(star):
    total = 0
    for connection in star.connections:
        other = connection.other_star
        if other.state == DARK:
            dark_intensity = 1 - other.brightness  # Darker = stronger
            drain = (
                DARK_DRAIN_RATE *
                connection.strength *
                dark_intensity
            )
            total += drain

    return total
```

**Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| DARK_DRAIN_RATE | 0.006 | From constellation-states |

### 3.5 Neglect Acceleration

Long inactivity accelerates all losses.

```python
def calculate_neglect_acceleration(star):
    days = star.days_since_last_engaged

    if days < NEGLECT_THRESHOLD_1:
        return 1.0  # Normal
    elif days < NEGLECT_THRESHOLD_2:
        return NEGLECT_MULTIPLIER_1  # Accelerating
    else:
        return NEGLECT_MULTIPLIER_2  # Maximum acceleration
```

**Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| NEGLECT_THRESHOLD_1 | 7 | Days before acceleration begins |
| NEGLECT_THRESHOLD_2 | 21 | Days before max acceleration |
| NEGLECT_MULTIPLIER_1 | 1.5 | 50% faster losses |
| NEGLECT_MULTIPLIER_2 | 2.0 | 100% faster losses (cap) |

**Timeline:**

| Days Inactive | Loss Multiplier | Effect |
|---------------|-----------------|--------|
| 0-7 | 1.0x | Normal decay |
| 8-21 | 1.5x | Accelerating |
| 22+ | 2.0x | Maximum (approaching dormancy) |

---

## 4. Protection Mechanisms

### 4.1 Daily Gain Cap

```python
MAX_DAILY_GAIN = 0.06  # From constellation-states
```

No matter how many experiments, insights, or spillovers, daily gain is capped.

### 4.2 Soft Floor

Brightness approaches but never reaches zero.

```python
def apply_soft_floor(new_brightness, old_brightness):
    # If dropping toward floor, slow down
    if new_brightness < SOFT_FLOOR_ZONE:
        # Asymptotic approach: halve the remaining distance
        distance_to_floor = new_brightness - MIN_BRIGHTNESS
        new_brightness = MIN_BRIGHTNESS + (distance_to_floor * SOFT_FLOOR_FACTOR)

    return new_brightness
```

**Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| SOFT_FLOOR_ZONE | 0.15 | Below this, soft floor kicks in |
| SOFT_FLOOR_FACTOR | 0.7 | Reduce drop by 30% |
| MIN_BRIGHTNESS | 0.05 | Absolute floor |

### 4.3 Engagement Cancellation

```python
if engaged_today:
    decay = 0  # Not reduced — CANCELLED
```

If you showed up, you don't pay decay tax. This is binary, not graduated.

---

## 5. Experience Formulas

### 5.1 Trend Calculation

What users see (brightening/dimming/stable).

```python
def calculate_trend(star, window=7):
    brightness_changes = get_brightness_history(star, window)

    avg_change = mean(brightness_changes)

    if avg_change > TREND_THRESHOLD_UP:
        return "brightening"
    elif avg_change < TREND_THRESHOLD_DOWN:
        return "dimming"
    else:
        return "stable"
```

**Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| TREND_THRESHOLD_UP | 0.01 | Average daily gain to show "brightening" |
| TREND_THRESHOLD_DOWN | -0.01 | Average daily loss to show "dimming" |

### 5.2 Visual Intensity

Maps brightness to visual glow.

```python
def calculate_glow_intensity(brightness):
    # Non-linear: more dramatic at extremes
    return brightness ** GLOW_EXPONENT
```

**Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| GLOW_EXPONENT | 0.7 | < 1 means brighter stars appear MORE different |

---

## 6. Constants Reference (Complete)

### Inherited from constellation-states

| Constant | Value | Unit | Source |
|----------|-------|------|--------|
| MIN_BRIGHTNESS | 0.05 | - | constellation-states |
| MAX_BRIGHTNESS | 1.0 | - | constellation-states |
| BASE_EXPERIMENT_IMPACT | 0.03 | - | constellation-states |
| MAX_DAILY_GAIN | 0.06 | - | constellation-states |
| INSIGHT_IMPACT | 0.02 | - | constellation-states |
| BASE_SKIP_PENALTY | 0.008 | - | constellation-states |
| CONTRADICTION_PENALTY | 0.04 | - | constellation-states |
| DARK_DRAIN_RATE | 0.006 | /day | constellation-states |
| MAX_STREAK_BONUS | 1.3 | - | constellation-states |
| SPILLOVER_RATE | 0.3 | - | constellation-states |
| MAINTENANCE_ZONE | 0.3 | - | constellation-states |

### New to brightness-decay

| Constant | Value | Unit | Description |
|----------|-------|------|-------------|
| NOVELTY_BONUS | 1.2 | - | Boost for first-time experiment type |
| STREAK_GROWTH_RATE | 0.15 | - | Log curve steepness |
| STREAK_PRESERVATION_RATE | 0.5 | - | Keep half streak on miss |
| SPILLOVER_THRESHOLD | 0.8 | - | Brightness required to spill |
| RECOVERY_BASE | 0.05 | - | Base return bonus |
| RECOVERY_MIN_DAYS | 7 | days | Minimum absence for bonus |
| RECOVERY_SCALE | 0.3 | - | Bonus growth rate |
| RECOVERY_MAX_MULTIPLIER | 2.0 | - | Max bonus = 2x base |
| MAX_SKIP_MULTIPLIER | 2.0 | - | Max skip penalty multiplier |
| NEGLECT_THRESHOLD_1 | 7 | days | Start of acceleration |
| NEGLECT_THRESHOLD_2 | 21 | days | Max acceleration |
| NEGLECT_MULTIPLIER_1 | 1.5 | - | First acceleration tier |
| NEGLECT_MULTIPLIER_2 | 2.0 | - | Max acceleration |
| SOFT_FLOOR_ZONE | 0.15 | - | Protection kicks in |
| SOFT_FLOOR_FACTOR | 0.7 | - | Reduce drop by 30% |
| TREND_THRESHOLD_UP | 0.01 | /day | Show "brightening" |
| TREND_THRESHOLD_DOWN | -0.01 | /day | Show "dimming" |
| GLOW_EXPONENT | 0.7 | - | Visual intensity curve |

---

## 7. Example Scenarios

### Scenario A: Ideal Day

```
User completes medium experiment (aligned)
User has insight (pattern-level)
Streak: Day 5

Gains:
  experiment = 0.03 × 1.0 × 1.0 = 0.03
  insight = 0.02 × 1.0 × 1.0 = 0.02
  streak_bonus = 1 + 0.15 × ln(5) = 1.24

  total_gains = (0.03 + 0.02) × 1.24 = 0.062 → capped at 0.06

Losses:
  decay = 0 (engaged today)
  skips = 0

  total_losses = 0

Net: +0.06 brightness
```

### Scenario B: Missed Day

```
User skips (2nd consecutive)
No engagement
Health star at 0.5

Gains: 0

Losses:
  skip_penalty = 0.008 × 1.5 = 0.012
  decay = 0.5 × 0.0943 × ((0.5-0.05)/(1.0-0.05)) × 1.0 = 0.022

  total_losses = 0.034

Net: -0.034 brightness (0.5 → 0.466)
```

### Scenario C: Return After Absence

```
User returns after 14 days absence
Completes tiny experiment
Star at 0.25 (DIM)

Gains:
  experiment = 0.03 × 0.5 = 0.015
  recovery_bonus = 0.05 × (1 + 0.3 × ln(14/7)) = 0.06
  streak_bonus = 1.0 (reset)

  total_gains = 0.015 + 0.06 = 0.075 → capped at 0.06

Losses:
  decay = 0 (engaged today)

  total_losses = 0

Net: +0.06 brightness (0.25 → 0.31)
```

---

## 8. Open Questions for NERVES

- [ ] Why log curve for streaks? (vs linear or exponential)
- [ ] Why 50% streak preservation? (vs 0% or 75%)
- [ ] Why 7 days minimum for recovery bonus?
- [ ] Why 0.8 spillover threshold? (vs 0.7 BRIGHT threshold)
- [ ] Is neglect acceleration too punishing?
- [ ] Research on optimal soft floor approach?

---

## 9. Relationship to Other Systems

**Imports from:**
- constellation-states (base constants, decay formula)

**Exports to:**
- experiment-selection (impact values for prioritization)
- phase-transitions (aggregate brightness metrics)
- connection-formation (spillover mechanics)

---

*BLOOD complete. The numbers are set. Proceed to NERVES for research justification.*
