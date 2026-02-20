# Connection Formation - BLOOD

**System:** connection-formation
**Lens:** BLOOD (2/7)
**Created:** 2026-01-15
**Status:** Draft
**Depends on:** 01-skeleton.md ✓, constellation-states ✓

---

## Overview

This document defines the mathematical formulas governing:
- How connections form and strengthen (evidence accumulation)
- How connections decay over time
- How connection type is determined (correlation, causation detection)
- How connections influence connected stars

---

## 1. Core Properties

### 1.1 Strength

The primary metric determining connection state.

```
strength ∈ [0.0, 1.0]
```

**Formula:**
```
strength(t) = clamp(
    strength(t-1) + evidence_delta - decay,
    0.0,
    MAX_STRENGTH
)

evidence_delta = new_evidence_impact × confidence_weight
decay = strength(t-1) × daily_decay_rate
```

**Strength bands:**
```
NASCENT:   0.00 - 0.20
FORMING:   0.20 - 0.40
WEAK:      0.40 - 0.60
MODERATE:  0.60 - 0.80
STRONG:    0.80 - 1.00
```

---

### 1.2 Evidence Count

Discrete counter of observations supporting the connection.

```
evidence_count ∈ [0, ∞)
```

**Accumulation:**
```
evidence_count(t) = evidence_count(t-1) + new_evidence_count - decayed_evidence

decayed_evidence: Evidence older than EVIDENCE_HALF_LIFE days counts as 0.5
                  Evidence older than 2×EVIDENCE_HALF_LIFE counts as 0
```

---

### 1.3 Confidence

TARS's confidence in the connection's validity.

```
confidence ∈ [0.0, 1.0]
```

**Formula:**
```
confidence = base_confidence × evidence_factor × consistency_factor

base_confidence = CONNECTION_TYPE_BASE_CONFIDENCE[type]
evidence_factor = min(evidence_count / EVIDENCE_SATURATION, 1.0)
consistency_factor = 1 - variance_of_evidence_timing
```

---

## 2. State Transition Thresholds

### 2.1 State Determination

```python
def determine_connection_state(conn, days_inactive):
    s = conn.strength
    e = conn.evidence_count

    # Dormancy check (highest priority)
    threshold = DORMANCY_THRESHOLD[current_state]
    if days_inactive >= threshold:
        return DORMANT

    # Strength-based states
    if s >= 0.80 and e >= 8:
        return STRONG
    if s >= 0.60 and e >= 5:
        return MODERATE
    if s >= 0.40 and e >= 3:
        return WEAK
    if s >= 0.20 and e >= 2:
        return FORMING
    if s > 0.00:
        return NASCENT

    return DISSOLVED  # Connection removed
```

### 2.2 Threshold Constants

| Constant | Value | Unit | Description |
|----------|-------|------|-------------|
| STRENGTH_NASCENT_MAX | 0.20 | - | Upper bound for NASCENT |
| STRENGTH_FORMING_MAX | 0.40 | - | Upper bound for FORMING |
| STRENGTH_WEAK_MAX | 0.60 | - | Upper bound for WEAK |
| STRENGTH_MODERATE_MAX | 0.80 | - | Upper bound for MODERATE |
| MAX_STRENGTH | 1.00 | - | Hard ceiling |
| EVIDENCE_FOR_FORMING | 2 | count | Required to enter FORMING |
| EVIDENCE_FOR_WEAK | 3 | count | Required to enter WEAK |
| EVIDENCE_FOR_MODERATE | 5 | count | Required to enter MODERATE |
| EVIDENCE_FOR_STRONG | 8 | count | Required to enter STRONG |

### 2.3 Dormancy Thresholds

| From State | Days to Dormant | Rationale |
|------------|-----------------|-----------|
| NASCENT | 7 | Unconfirmed fades fast |
| FORMING | 14 | Weak connections fade |
| WEAK | 30 | Monthly activity expected |
| MODERATE | 45 | Established deserves patience |
| STRONG | 60 | Core connections persist |

---

## 3. Evidence Accumulation

### 3.1 Evidence Types and Weights

| Evidence Type | Base Impact | Confidence | Frequency |
|---------------|-------------|------------|-----------|
| Co-mention (same response) | 0.05 | 0.3 | Common |
| Co-mention (same session) | 0.08 | 0.4 | Common |
| Brightness correlation detected | 0.10 | 0.5 | Computed |
| User confirms connection | 0.20 | 0.9 | Rare |
| User creates connection | 0.25 | 1.0 | Rare |
| TARS hypothesis confirmed | 0.15 | 0.7 | Moderate |
| Behavioral causation detected | 0.12 | 0.6 | Computed |

### 3.2 Strength Gain Formula

```
strength_gain = BASE_EVIDENCE_IMPACT × type_multiplier × freshness_bonus × confidence

BASE_EVIDENCE_IMPACT = evidence_type_impact[type]
type_multiplier = {
    co_mention_response: 0.5,
    co_mention_session: 0.8,
    correlation_detected: 1.0,
    user_confirms: 2.0,
    user_creates: 2.5,
    tars_confirmed: 1.5,
    causation_detected: 1.2
}
freshness_bonus = 1.0 if first_evidence_in_7_days else 0.7
confidence = evidence_confidence
```

### 3.3 Evidence Diminishing Returns

Multiple evidence in same day has diminishing impact:

```
total_daily_gain = E₁ + (E₂ × 0.6) + (E₃ × 0.3) + (E₄+ × 0.1)

Where E_n is the nth evidence's strength_gain, sorted by impact descending
```

### 3.4 Daily Evidence Cap

```
MAX_DAILY_STRENGTH_GAIN = 0.15
total_daily_gain = min(total_daily_gain, MAX_DAILY_STRENGTH_GAIN)
```

---

## 4. Strength Decay

### 4.1 Daily Decay Formula

```
decay = strength × base_decay_rate × activity_factor

base_decay_rate = 1 - (0.5)^(1 / HALF_LIFE)
activity_factor = {
    engaged_today: 0,      # No decay if either star engaged
    engaged_week: 0.5,     # Half decay if recent activity
    inactive: 1.0          # Full decay if no activity
}
```

### 4.2 Half-Lives by Connection Type

| Connection Type | Half-Life | Daily Decay | Rationale |
|-----------------|-----------|-------------|-----------|
| RESONANCE | 30 days | 2.28% | Natural rhythm, slow fade |
| TENSION | 21 days | 3.25% | Competing forces, moderate fade |
| CAUSATION | 14 days | 4.83% | Needs reinforcement |
| GROWTH_EDGE | 45 days | 1.53% | Developmental, slow fade |
| SHADOW_MIRROR | 60 days | 1.15% | Deep patterns persist |
| BLOCKS | 21 days | 3.25% | Can be overcome |

### 4.3 Proportional Decay (Soft Floor)

Connections decay slower as they approach floor:

```
effective_decay = base_decay × (strength - FLOOR) / (1.0 - FLOOR)

FLOOR = 0.05  # Connections never fully hit 0
```

---

## 5. Connection Type Detection

### 5.1 Type Determination Algorithm

```python
def determine_connection_type(star_a, star_b, history):
    # Check for user-assigned type first
    if user_assigned_type:
        return user_assigned_type

    # Check for dark star involvement
    if star_a.state == DARK or star_b.state == DARK:
        return SHADOW_MIRROR

    # Check for blocking relationship
    if detect_blocking(star_a, star_b, history):
        return BLOCKS

    # Compute correlation
    corr = compute_brightness_correlation(star_a, star_b, window=30)

    if corr > RESONANCE_THRESHOLD:
        return RESONANCE
    if corr < TENSION_THRESHOLD:
        return TENSION

    # Check for causation
    causation = detect_granger_causality(star_a, star_b, history)
    if causation.confidence > CAUSATION_THRESHOLD:
        if causation.is_positive:
            return GROWTH_EDGE
        return CAUSATION

    # Default to resonance if no clear pattern
    return RESONANCE
```

### 5.2 Detection Thresholds

| Constant | Value | Description |
|----------|-------|-------------|
| RESONANCE_THRESHOLD | 0.5 | Correlation for resonance |
| TENSION_THRESHOLD | -0.3 | Correlation for tension |
| CAUSATION_THRESHOLD | 0.6 | Granger confidence for causation |
| BLOCKING_THRESHOLD | 0.7 | Confidence for blocks detection |
| MIN_OBSERVATIONS | 5 | Minimum data points for correlation |
| CORRELATION_WINDOW | 30 | Days of history for correlation |

### 5.3 Granger Causality Detection

```python
def detect_granger_causality(star_a, star_b, history):
    """
    Detects if changes in star_a predict changes in star_b.
    """
    # Get event sequences
    a_events = get_brightness_changes(star_a, history, threshold=0.1)
    b_events = get_brightness_changes(star_b, history, threshold=0.1)

    # Find A→B sequences
    a_to_b_lags = []
    for a_event in a_events:
        for b_event in b_events:
            lag = b_event.time - a_event.time
            if 0 < lag < MAX_CAUSATION_LAG:
                a_to_b_lags.append(lag)

    if len(a_to_b_lags) < MIN_CAUSATION_OBSERVATIONS:
        return CausationResult(confidence=0, direction=None)

    # Calculate consistency
    mean_lag = mean(a_to_b_lags)
    lag_variance = variance(a_to_b_lags)
    consistency = 1 - (lag_variance / mean_lag) if mean_lag > 0 else 0

    confidence = (len(a_to_b_lags) / SATURATION_COUNT) × consistency

    return CausationResult(
        confidence=min(confidence, 1.0),
        direction='a_to_b',
        mean_lag=mean_lag,
        is_positive=detect_direction_sign(a_events, b_events)
    )

MAX_CAUSATION_LAG = 72  # hours
MIN_CAUSATION_OBSERVATIONS = 3
SATURATION_COUNT = 8  # Observations for max confidence
```

### 5.4 Blocking Detection

```python
def detect_blocking(star_a, star_b, history):
    """
    Detects if star_a prevents star_b from reaching BRIGHT.
    """
    # Check if B has high engagement but no brightness gain
    b_engagement = get_engagement_score(star_b, days=30)
    b_progress = get_brightness_change(star_b, days=30)

    if b_engagement > HIGH_ENGAGEMENT and b_progress < LOW_PROGRESS:
        # Check if A is active during B's stuck period
        a_activity = get_activity_during(star_a, star_b.stuck_periods)
        if a_activity > ACTIVITY_THRESHOLD:
            return BlockingResult(
                confidence=0.7,
                blocker=star_a,
                blocked=star_b
            )

    return BlockingResult(confidence=0)

HIGH_ENGAGEMENT = 0.6
LOW_PROGRESS = 0.05
ACTIVITY_THRESHOLD = 0.5
```

---

## 6. Connection Influence on Stars

### 6.1 Resonance Effect

When connected stars have RESONANCE:

```
# When star_a brightness changes
delta_a = star_a.brightness - star_a.previous_brightness

# Apply spillover to star_b
spillover_b = delta_a × RESONANCE_SPILLOVER × connection.strength × direction_factor

direction_factor = {
    positive_delta: 1.0,    # Rising lifts connected
    negative_delta: 0.5     # Falling pulls connected (less)
}

star_b.brightness += spillover_b

RESONANCE_SPILLOVER = 0.15  # 15% of change transfers
```

### 6.2 Tension Effect

When connected stars have TENSION:

```
# When star_a gains brightness significantly
if delta_a > TENSION_ACTIVATION_THRESHOLD:
    drain_b = delta_a × TENSION_DRAIN × connection.strength
    star_b.brightness -= drain_b

TENSION_ACTIVATION_THRESHOLD = 0.05  # Only activates on significant gains
TENSION_DRAIN = 0.08  # 8% drain to competing star
```

### 6.3 Causation Effect

When connection type is CAUSATION (A → B):

```
# When star_a has event, predict star_b event
if star_a.had_significant_event(today):
    prediction = Prediction(
        star=star_b,
        expected_change=predicted_direction,
        expected_time=now + mean_lag,
        confidence=connection.strength × causation_confidence
    )
    queue_prediction(prediction)

# When prediction comes true, strengthen connection
if prediction.verified:
    connection.strength += PREDICTION_VERIFIED_BONUS

PREDICTION_VERIFIED_BONUS = 0.05
```

### 6.4 Growth Edge Effect

When connection type is GROWTH_EDGE (A → B):

```
# Star A serves as accelerator for star B
if star_a.state == BRIGHT:
    star_b.impact_multiplier += GROWTH_EDGE_BOOST × connection.strength

GROWTH_EDGE_BOOST = 0.2  # 20% boost when enabler is bright
```

### 6.5 Shadow Mirror Effect

When connection type is SHADOW_MIRROR:

```
# Dark star drains connected star
if star_dark.state == DARK:
    drain = SHADOW_DRAIN_RATE × connection.strength × dark_intensity
    star_other.brightness -= drain

    dark_intensity = 1 - star_dark.brightness  # Darker = stronger pull

SHADOW_DRAIN_RATE = 0.01  # Per day (gentler than constellation-states dark drain)
```

### 6.6 Blocks Effect

When connection type is BLOCKS (A -|→ B):

```
# Star A caps star B's maximum brightness
if connection.type == BLOCKS and connection.state >= WEAK:
    star_b.effective_max = MAX_BRIGHTNESS × (1 - BLOCK_FACTOR × connection.strength)

BLOCK_FACTOR = 0.5  # At strength=1.0, max brightness is 0.5

# Breaking the block
if star_a.state == DORMANT or connection.strength < BLOCK_RELEASE_THRESHOLD:
    star_b.effective_max = MAX_BRIGHTNESS  # Block lifted

BLOCK_RELEASE_THRESHOLD = 0.3
```

---

## 7. Combination Rules

### 7.1 Multiple Connections to Same Star

When a star has multiple connections, effects combine:

```python
def calculate_total_connection_effects(star, connections):
    total_spillover = 0
    total_drain = 0
    max_block = 0
    max_boost = 0

    for conn in connections:
        effect = calculate_connection_effect(star, conn)

        if effect.type == 'spillover':
            total_spillover += effect.value
        elif effect.type == 'drain':
            total_drain += effect.value
        elif effect.type == 'block':
            max_block = max(max_block, effect.value)  # Worst block wins
        elif effect.type == 'boost':
            max_boost = max(max_boost, effect.value)  # Best boost wins

    # Apply with caps
    net_spillover = min(total_spillover, MAX_SPILLOVER_PER_DAY)
    net_drain = min(total_drain, MAX_DRAIN_PER_DAY)

    return ConnectionEffects(
        spillover=net_spillover,
        drain=net_drain,
        effective_max_reduction=max_block,
        impact_boost=max_boost
    )

MAX_SPILLOVER_PER_DAY = 0.10
MAX_DRAIN_PER_DAY = 0.08
```

### 7.2 Connection Count Soft Cap

```
# Beyond 10 connections, new connections form slower
if star.connection_count >= SOFT_CAP:
    new_connection_rate = base_rate × (SOFT_CAP / star.connection_count)

SOFT_CAP = 10
```

---

## 8. Constants Reference

| Constant | Value | Unit | Source | Notes |
|----------|-------|------|--------|-------|
| MAX_STRENGTH | 1.0 | - | | Hard ceiling |
| FLOOR | 0.05 | - | | Soft floor |
| EVIDENCE_FOR_FORMING | 2 | count | | |
| EVIDENCE_FOR_WEAK | 3 | count | | |
| EVIDENCE_FOR_MODERATE | 5 | count | | |
| EVIDENCE_FOR_STRONG | 8 | count | | Consistent pattern |
| MAX_DAILY_STRENGTH_GAIN | 0.15 | - | | Anti-gaming |
| RESONANCE_SPILLOVER | 0.15 | - | | 15% transfer |
| TENSION_DRAIN | 0.08 | - | | 8% drain |
| SHADOW_DRAIN_RATE | 0.01 | /day | | Gentle drain |
| GROWTH_EDGE_BOOST | 0.2 | - | | 20% accelerator |
| BLOCK_FACTOR | 0.5 | - | | Max reduction |
| RESONANCE_THRESHOLD | 0.5 | corr | | Positive correlation |
| TENSION_THRESHOLD | -0.3 | corr | | Negative correlation |
| CAUSATION_THRESHOLD | 0.6 | conf | | Granger confidence |
| MIN_OBSERVATIONS | 5 | count | | For correlation |
| CORRELATION_WINDOW | 30 | days | | History window |
| MAX_CAUSATION_LAG | 72 | hours | | Event sequence |
| PREDICTION_VERIFIED_BONUS | 0.05 | - | | Reward accuracy |
| SOFT_CAP | 10 | count | | Connection limit |
| EVIDENCE_HALF_LIFE | 30 | days | | Evidence freshness |

---

## 9. Algorithms

### 9.1 Daily Connection Update

```python
def update_connection_daily(conn):
    # Calculate decay
    activity = get_activity_factor(conn.star_a, conn.star_b)
    decay = calculate_decay(conn, activity)

    # Apply decay
    conn.strength = max(FLOOR, conn.strength - decay)

    # Re-evaluate type periodically
    if should_reevaluate_type(conn):
        new_type = determine_connection_type(conn.star_a, conn.star_b)
        if new_type != conn.type:
            conn.type = new_type
            conn.type_changed_at = now()

    # Update state
    conn.state = determine_connection_state(conn)

    # Apply effects to stars
    apply_connection_effects(conn)

    return conn
```

### 9.2 New Evidence Processing

```python
def process_new_evidence(conn, evidence):
    # Calculate strength gain
    gain = calculate_evidence_impact(evidence)

    # Apply diminishing returns if multiple today
    today_count = conn.evidence_today_count
    if today_count > 0:
        gain = gain × DIMINISHING_FACTORS[min(today_count, 3)]

    # Apply daily cap
    remaining_cap = MAX_DAILY_STRENGTH_GAIN - conn.strength_gained_today
    gain = min(gain, remaining_cap)

    # Update connection
    conn.strength = min(MAX_STRENGTH, conn.strength + gain)
    conn.evidence_count += 1
    conn.evidence.append(evidence)
    conn.last_engaged = now()
    conn.strength_gained_today += gain

    # Update state if threshold crossed
    conn.state = determine_connection_state(conn)

    return conn

DIMINISHING_FACTORS = {1: 0.6, 2: 0.3, 3: 0.1}
```

### 9.3 Connection Type Re-evaluation

```python
def should_reevaluate_type(conn):
    # Re-evaluate every 7 days or after significant evidence
    days_since_eval = days_since(conn.type_evaluated_at)
    evidence_since_eval = conn.evidence_count - conn.evidence_at_last_eval

    return (
        days_since_eval >= TYPE_REEVALUATION_INTERVAL or
        evidence_since_eval >= TYPE_REEVALUATION_EVIDENCE
    )

TYPE_REEVALUATION_INTERVAL = 7  # days
TYPE_REEVALUATION_EVIDENCE = 3  # new observations
```

---

## 10. Formation During Excavation (Day 1-7)

Special rules during the 7-day Mirror phase:

```python
EXCAVATION_MULTIPLIERS = {
    'evidence_impact': 1.5,      # Evidence counts more
    'nascent_threshold': 1,      # Single co-mention creates nascent
    'tars_hypothesis_rate': 2.0, # TARS more actively suggests
    'decay_rate': 0.5            # Slower decay during learning
}
```

Rationale: During excavation, we want connections to form readily so users see the constellation structure emerge. After Day 7, normal thresholds apply.

---

## 11. Open Questions for NERVES

- [ ] Why is correlation threshold 0.5 for resonance? (Statistical significance?)
- [ ] Is 72-hour max lag for causation justified? (Behavioral psychology?)
- [ ] What research supports the spillover rates (15%, 8%)?
- [ ] Are half-lives by connection type appropriate? (Need longitudinal data)
- [ ] Is the blocking mechanism psychologically valid? (Limiting beliefs research?)
- [ ] How do multiple connection effects combine optimally? (Systems dynamics?)

---

*BLOOD complete. Proceed to NERVES for research justifications.*
