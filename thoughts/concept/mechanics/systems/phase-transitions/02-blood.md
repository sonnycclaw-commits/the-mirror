# Phase Transitions - BLOOD

**System:** phase-transitions
**Lens:** BLOOD (2/7)
**Created:** 2026-01-15
**Status:** Draft
**Depends on:** 01-skeleton.md ✓

---

## Overview

This document defines the formulas and thresholds that govern phase transitions. Phases are determined by aggregate metrics computed from the constellation's stars and connections.

---

## 1. Aggregate Metrics

### 1.1 Star Count

```python
star_count = len([s for s in constellation.stars if s.state != DORMANT])
```

Only non-dormant stars count toward phase calculation.

### 1.2 Connection Metrics

```python
connection_count = len(constellation.connections)

max_possible = star_count * (star_count - 1) / 2

connection_density = connection_count / max_possible if max_possible > 0 else 0
```

**Edge case:** If star_count < 2, connection_density = 0.

### 1.3 Average Brightness

```python
avg_brightness = mean([s.brightness for s in active_stars])
```

Where `active_stars` excludes DORMANT stars.

### 1.4 Bright Star Ratio

```python
bright_count = len([s for s in active_stars if s.brightness >= BRIGHT_THRESHOLD])
bright_ratio = bright_count / star_count if star_count > 0 else 0
```

| Constant | Value | Description |
|----------|-------|-------------|
| BRIGHT_THRESHOLD | 0.7 | From constellation-states |

### 1.5 Dark Star Influence

```python
def calculate_dark_influence(constellation):
    total = 0
    for star in constellation.stars:
        if star.state == DARK:
            # Dark intensity = how dark (lower brightness = more intense)
            intensity = 1 - star.brightness
            # Count connections to non-dark stars
            affected_connections = len([c for c in star.connections if c.other.state != DARK])
            total += intensity * affected_connections * DARK_INFLUENCE_WEIGHT

    # Normalize to 0-1 range
    return min(total / star_count, 1.0) if star_count > 0 else 0
```

| Constant | Value | Description |
|----------|-------|-------------|
| DARK_INFLUENCE_WEIGHT | 0.2 | How much each dark connection matters |

### 1.6 Stability Score

```python
def calculate_stability(constellation, window=7):
    """How stable has the constellation been over the window?"""
    brightness_variance = variance([
        daily_avg_brightness[day] for day in range(window)
    ])
    phase_changes = count_phase_changes_in_window(window)

    # Lower variance and fewer changes = higher stability
    stability = 1 - (brightness_variance + phase_changes * 0.1)
    return clamp(stability, 0, 1)
```

---

## 2. Composite Scores

### 2.1 Integration Score

Measures how well-connected and balanced the constellation is.

```python
def calculate_integration(constellation):
    """
    Integration = connection quality + brightness balance + dark confrontation
    Range: 0.0 to 1.0
    """
    # Component 1: Connection density (40%)
    connection_component = connection_density * 0.4

    # Component 2: Brightness balance (30%)
    # Penalize if brightness is too uneven across stars
    brightness_std = std([s.brightness for s in active_stars])
    brightness_balance = (1 - brightness_std) * 0.3

    # Component 3: Dark star confrontation (30%)
    # Reward if dark stars are being addressed (low influence or integrated)
    dark_component = (1 - dark_influence) * 0.3

    return connection_component + brightness_balance + dark_component
```

### 2.2 Luminosity Score

Measures overall constellation brightness and health.

```python
def calculate_luminosity(constellation):
    """
    Luminosity = brightness + connections + stability - dark drag
    Range: 0.0 to 1.0

    NOTE: MIRROR simulation revealed the original formula capped too low.
    Adjusted to use density directly (not strength × density) for connection component.
    """
    # Component 1: Bright star ratio (45%)
    brightness_component = bright_ratio * 0.45

    # Component 2: Connection density (25%)
    # UPDATED: Removed strength multiplication — density alone is sufficient
    connection_component = connection_density * 0.25

    # Component 3: Stability (15%)
    stability_component = stability * 0.15

    # Component 4: Dark star drag (15% penalty)
    dark_penalty = dark_influence * 0.15

    return brightness_component + connection_component + stability_component - dark_penalty
```

**MIRROR tuning note:** Original formula used `strength × density × 0.25` which capped luminosity at ~0.64 even with perfect inputs. Updated to `density × 0.25` and adjusted brightness weight from 0.4 to 0.45.

---

## 3. Phase Thresholds

### 3.1 Forward Transition Thresholds

| Transition | Metric | Threshold |
|------------|--------|-----------|
| SCATTERED → CONNECTING | connection_count | ≥ 3 |
| SCATTERED → CONNECTING | OR connection_density | ≥ 0.2 |
| CONNECTING → EMERGING | integration_score | ≥ 0.5 |
| CONNECTING → EMERGING | AND bright_ratio | ≥ 0.3 |
| CONNECTING → EMERGING | AND connection_density | ≥ 0.4 |
| EMERGING → LUMINOUS | luminosity_score | ≥ 0.7 |
| EMERGING → LUMINOUS | AND bright_ratio | ≥ 0.6 |
| EMERGING → LUMINOUS | AND dark_influence | ≤ 0.2 |
| EMERGING → LUMINOUS | AND days_stable | ≥ 14 |

### 3.2 Regression Thresholds (with Hysteresis)

| Transition | Metric | Threshold | Grace Days |
|------------|--------|-----------|------------|
| CONNECTING → SCATTERED | connection_count | < 2 | 7 |
| CONNECTING → SCATTERED | AND connection_density | < 0.1 | 7 |
| EMERGING → CONNECTING | integration_score | < 0.35 | 7 |
| EMERGING → CONNECTING | OR bright_ratio | < 0.2 | 7 |
| LUMINOUS → EMERGING | luminosity_score | < 0.5 | 14 |
| LUMINOUS → EMERGING | OR bright_ratio | < 0.4 | 14 |

### 3.3 Hysteresis Factor

```python
HYSTERESIS_FACTOR = 0.7  # Regression threshold = Forward threshold × 0.7
```

This prevents flickering. To regress from CONNECTING to SCATTERED:
- Forward: connection_count ≥ 3
- Regression: connection_count < 3 × 0.7 = 2.1 → effectively < 2

---

## 4. Phase Determination Algorithm

```python
def determine_phase(constellation, current_phase, days_in_phase):
    # Calculate all metrics
    metrics = {
        'star_count': calculate_star_count(constellation),
        'connection_count': calculate_connection_count(constellation),
        'connection_density': calculate_connection_density(constellation),
        'avg_brightness': calculate_avg_brightness(constellation),
        'bright_ratio': calculate_bright_ratio(constellation),
        'dark_influence': calculate_dark_influence(constellation),
        'stability': calculate_stability(constellation),
        'integration': calculate_integration(constellation),
        'luminosity': calculate_luminosity(constellation),
    }

    # Check for advancement (higher priority)
    new_phase = check_advancement(current_phase, metrics)
    if new_phase != current_phase:
        return new_phase, 0  # Reset days_in_phase

    # Check for regression
    new_phase = check_regression(current_phase, metrics, days_in_phase)
    if new_phase != current_phase:
        return new_phase, 0  # Reset days_in_phase

    return current_phase, days_in_phase + 1


def check_advancement(current_phase, metrics):
    if current_phase == SCATTERED:
        if (metrics['connection_count'] >= CONNECTION_THRESHOLD_FORWARD or
            metrics['connection_density'] >= DENSITY_THRESHOLD_FORWARD):
            return CONNECTING

    elif current_phase == CONNECTING:
        if (metrics['integration'] >= INTEGRATION_THRESHOLD and
            metrics['bright_ratio'] >= BRIGHT_RATIO_CONNECTING and
            metrics['connection_density'] >= DENSITY_THRESHOLD_CONNECTING):
            return EMERGING

    elif current_phase == EMERGING:
        if (metrics['luminosity'] >= LUMINOSITY_THRESHOLD and
            metrics['bright_ratio'] >= BRIGHT_RATIO_EMERGING and
            metrics['dark_influence'] <= DARK_INFLUENCE_MAX and
            constellation.days_stable >= STABILIZATION_DAYS):
            return LUMINOUS

    return current_phase


def check_regression(current_phase, metrics, days_below):
    if current_phase == CONNECTING:
        if (metrics['connection_count'] < CONNECTION_THRESHOLD_REGRESS and
            metrics['connection_density'] < DENSITY_THRESHOLD_REGRESS):
            if days_below >= REGRESSION_GRACE_CONNECTING:
                return SCATTERED

    elif current_phase == EMERGING:
        if (metrics['integration'] < INTEGRATION_THRESHOLD * HYSTERESIS_FACTOR or
            metrics['bright_ratio'] < BRIGHT_RATIO_CONNECTING * HYSTERESIS_FACTOR):
            if days_below >= REGRESSION_GRACE_EMERGING:
                return CONNECTING

    elif current_phase == LUMINOUS:
        if (metrics['luminosity'] < LUMINOSITY_THRESHOLD * HYSTERESIS_FACTOR or
            metrics['bright_ratio'] < BRIGHT_RATIO_EMERGING * HYSTERESIS_FACTOR):
            if days_below >= REGRESSION_GRACE_LUMINOUS:
                return EMERGING

    return current_phase
```

---

## 5. Constants Reference

### Forward Thresholds

| Constant | Value | Unit | Description |
|----------|-------|------|-------------|
| CONNECTION_THRESHOLD_FORWARD | 3 | count | Connections to enter CONNECTING |
| DENSITY_THRESHOLD_FORWARD | 0.2 | ratio | Alt path to CONNECTING |
| INTEGRATION_THRESHOLD | 0.5 | score | Integration to enter EMERGING |
| BRIGHT_RATIO_CONNECTING | 0.3 | ratio | Bright stars for EMERGING |
| DENSITY_THRESHOLD_CONNECTING | 0.4 | ratio | Connection density for EMERGING |
| LUMINOSITY_THRESHOLD | 0.7 | score | Luminosity to enter LUMINOUS |
| BRIGHT_RATIO_EMERGING | 0.6 | ratio | Bright stars for LUMINOUS |
| DARK_INFLUENCE_MAX | 0.2 | score | Max dark influence for LUMINOUS |
| STABILIZATION_DAYS | 14 | days | Stable days before LUMINOUS |

### Regression Thresholds

| Constant | Value | Unit | Description |
|----------|-------|------|-------------|
| CONNECTION_THRESHOLD_REGRESS | 2 | count | Below this → SCATTERED |
| DENSITY_THRESHOLD_REGRESS | 0.1 | ratio | Below this → SCATTERED |
| HYSTERESIS_FACTOR | 0.7 | - | Regression = Forward × 0.7 |
| REGRESSION_GRACE_CONNECTING | 7 | days | Grace before CONNECTING → SCATTERED |
| REGRESSION_GRACE_EMERGING | 7 | days | Grace before EMERGING → CONNECTING |
| REGRESSION_GRACE_LUMINOUS | 14 | days | Grace before LUMINOUS → EMERGING |

### Metric Weights

| Constant | Value | Description |
|----------|-------|-------------|
| DARK_INFLUENCE_WEIGHT | 0.2 | Weight per dark connection |
| INTEGRATION_CONNECTION_WEIGHT | 0.4 | Connection component of integration |
| INTEGRATION_BALANCE_WEIGHT | 0.3 | Brightness balance component |
| INTEGRATION_DARK_WEIGHT | 0.3 | Dark confrontation component |
| LUMINOSITY_BRIGHTNESS_WEIGHT | 0.4 | Bright ratio in luminosity |
| LUMINOSITY_CONNECTION_WEIGHT | 0.25 | Connection quality in luminosity |
| LUMINOSITY_STABILITY_WEIGHT | 0.2 | Stability in luminosity |
| LUMINOSITY_DARK_PENALTY | 0.15 | Dark influence penalty |

---

## 6. Timeline Expectations

Based on the formulas, expected progression timelines:

### Ideal User (daily engagement, experiments completed)

| Milestone | Expected Time | Rationale |
|-----------|---------------|-----------|
| First star | Day 1 | Birth Chart begins |
| SCATTERED | Day 1-7 | Mirror phase, stars appearing |
| CONNECTING | Day 8-14 | Connections form as patterns link |
| EMERGING | Day 30-60 | Integration builds over weeks |
| LUMINOUS | Day 90+ | Requires sustained brightness + stability |

### Struggling User (30% engagement)

| Milestone | Expected Time |
|-----------|---------------|
| SCATTERED | Indefinite (stuck) |
| CONNECTING | Week 4-8 (slow) |
| EMERGING | Unlikely without sustained effort |
| LUMINOUS | Very unlikely |

### Key insight

LUMINOUS is **hard to achieve and easy to lose**. This is intentional — it represents genuine transformation, not a milestone to unlock.

---

## 7. Phase Progress Indicator

Users see progress toward next phase.

```python
def calculate_phase_progress(constellation, current_phase):
    """Returns 0-100% progress toward next phase."""

    if current_phase == SCATTERED:
        # Progress = how close to CONNECTION_THRESHOLD
        progress = min(
            connection_count / CONNECTION_THRESHOLD_FORWARD,
            connection_density / DENSITY_THRESHOLD_FORWARD
        )

    elif current_phase == CONNECTING:
        # Progress = average of three requirements
        integration_progress = integration / INTEGRATION_THRESHOLD
        brightness_progress = bright_ratio / BRIGHT_RATIO_CONNECTING
        density_progress = connection_density / DENSITY_THRESHOLD_CONNECTING
        progress = (integration_progress + brightness_progress + density_progress) / 3

    elif current_phase == EMERGING:
        # Progress = average of four requirements
        luminosity_progress = luminosity / LUMINOSITY_THRESHOLD
        brightness_progress = bright_ratio / BRIGHT_RATIO_EMERGING
        dark_progress = 1 - (dark_influence / DARK_INFLUENCE_MAX) if dark_influence < DARK_INFLUENCE_MAX else 0
        stability_progress = days_stable / STABILIZATION_DAYS
        progress = (luminosity_progress + brightness_progress + dark_progress + stability_progress) / 4

    elif current_phase == LUMINOUS:
        progress = 1.0  # Already at max phase

    return clamp(progress, 0, 1) * 100
```

---

## 8. Example Scenarios

### Scenario A: New User Journey

```
Day 1: First star appears
  → Phase: SCATTERED, Progress to CONNECTING: 0%

Day 7: 5 stars, 0 connections
  → Phase: SCATTERED, Progress: 0%

Day 10: 6 stars, 3 connections
  → Phase: CONNECTING (threshold met!)
  → Progress to EMERGING: 20%

Day 30: 8 stars, 10 connections, avg brightness 0.55
  → Phase: CONNECTING, Progress: 60%

Day 45: 8 stars, 12 connections, integration 0.52
  → Phase: EMERGING (threshold met!)
  → Progress to LUMINOUS: 30%

Day 90: 10 stars, 20 connections, luminosity 0.72, 14 days stable
  → Phase: LUMINOUS (achieved!)
```

### Scenario B: Regression Example

```
Day 90: LUMINOUS achieved
Day 100: User disengages, brightness drops
  → luminosity = 0.55 (below 0.7 × 0.7 = 0.49? No, still above)
  → Phase: Still LUMINOUS

Day 110: Continued disengagement
  → luminosity = 0.48 (below 0.49)
  → Grace period begins (14 days)

Day 120: Still below threshold
  → Warning: "Your constellation is dimming..."

Day 124: 14 days below threshold
  → Phase: EMERGING (regression)
  → "You've shifted back to EMERGING. Your constellation shape is still there."
```

---

## 9. Open Questions for NERVES

- [ ] Why 14 days stabilization for LUMINOUS? (Research on sustained behavior change)
- [ ] Why 0.7 hysteresis factor? (Game design precedent)
- [ ] Is 90+ days to LUMINOUS too long? (User motivation research)
- [ ] Are the component weights in integration/luminosity correct?
- [ ] Should dark stars completely block LUMINOUS?

---

## 10. Dependencies

**Requires:**
- constellation-states: Star states and brightness values
- brightness-decay: Brightness dynamics
- connection-formation: Connection data (PLACEHOLDER until built)

**Exports to:**
- TARS interaction layer: Phase-specific prompts
- Visual system: Phase-specific rendering
- Weekly/monthly reviews: Phase progress reports

---

*BLOOD complete. Proceed to NERVES for research justification.*
