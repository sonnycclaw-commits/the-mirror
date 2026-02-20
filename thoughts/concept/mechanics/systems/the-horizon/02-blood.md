# The Horizon - BLOOD

**System:** the-horizon
**Lens:** BLOOD (2/7)
**Created:** 2026-01-15
**Status:** Draft
**Depends on:** 01-skeleton.md ✓, the-walk/02-blood.md

---

## Overview

Formulas for multi-Walk trajectory mechanics: slingshot acceleration, dark star drift, alignment bonuses, and Horizon-level momentum.

---

## 1. Slingshot Mechanics

### 1.1 Slingshot Formula

When a Walk reaches a milestone:

```
exit_velocity = approach_velocity × (1 + slingshot_multiplier)

slingshot_multiplier = star.slingshot_power × alignment × momentum_bonus
```

### 1.2 Slingshot Power (by timeframe)

Larger milestones provide bigger slingshots:

| Timeframe | Slingshot Power | Rationale |
|-----------|-----------------|-----------|
| 3_month | 0.15 | Small boost |
| 6_month | 0.25 | Moderate |
| 1_year | 0.40 | Significant |
| 3_year | 0.60 | Major transformation |
| 5_year | 0.80 | Life-changing |
| 10_year | 1.00 | Maximum boost |

### 1.3 Alignment Factor

Slingshot is maximized when next Walk direction aligns with current trajectory:

```
alignment = cosine_similarity(exit_direction, next_walk_direction)

# alignment ∈ [-1, 1]
# Negative alignment = backtracking (no slingshot)
# Zero alignment = perpendicular (reduced slingshot)
# Positive alignment = forward momentum (full slingshot)

effective_alignment = max(0, alignment)
```

### 1.4 Momentum Bonus

Horizon-level momentum amplifies slingshots:

```
momentum_bonus = 1 + (horizon.slingshot_velocity × MOMENTUM_AMPLIFIER)

MOMENTUM_AMPLIFIER = 0.2
```

### 1.5 Accumulated Slingshot Velocity

After each Walk completion:

```
horizon.slingshot_velocity = clamp(
    horizon.slingshot_velocity + slingshot_gain,
    0,
    MAX_ACCUMULATED_VELOCITY
)

slingshot_gain = slingshot_multiplier × approach_velocity
MAX_ACCUMULATED_VELOCITY = 2.0  # 2x base velocity cap
```

---

## 2. Dark Star Drift

### 2.1 Drift Condition

Drift only occurs when velocity is low:

```
is_drifting = (
    all_walks_velocity < DRIFT_THRESHOLD AND
    days_low_velocity >= DRIFT_DAYS
)

DRIFT_THRESHOLD = 0.1
DRIFT_DAYS = 30
```

### 2.2 Drift Pull Formula

Dark star exerts gravitational pull:

```
drift_pull = DARK_GRAVITY / distance_to_dark²

# Capped to prevent singularity
drift_pull = min(drift_pull, MAX_DRIFT_PULL)

DARK_GRAVITY = 0.05
MAX_DRIFT_PULL = 0.3
```

### 2.3 Drift Movement

When drifting, user moves toward dark star:

```
distance_to_dark_t+1 = distance_to_dark_t - drift_pull × (1 - velocity)

# Low velocity = more susceptible
# High velocity = drift has minimal effect
```

### 2.4 Drift Decay to Horizon

Extended drift degrades the Horizon:

```
horizon_decay = days_drifting / HORIZON_DECAY_PERIOD

# After HORIZON_DECAY_PERIOD days of drift, Horizon becomes Undefined
HORIZON_DECAY_PERIOD = 365  # 1 year
```

---

## 3. Horizon-Level Momentum

### 3.1 Horizon Momentum vs Walk Momentum

| Level | What it tracks | Decay rate |
|-------|---------------|------------|
| Walk momentum | Progress within single journey | 0.05/day |
| Horizon momentum | Accumulated across Walks | 0.02/day |

### 3.2 Horizon Momentum Update

After each Walk day:

```
horizon.momentum = horizon.momentum × (1 - HORIZON_MOMENTUM_DECAY) + walk_contribution

walk_contribution = Σ(walk.velocity × walk_weight) / num_active_walks
HORIZON_MOMENTUM_DECAY = 0.02  # Slower decay than Walk
```

### 3.3 Milestone Momentum Boost

Reaching a milestone boosts Horizon momentum:

```
milestone_boost = MILESTONE_MOMENTUM_BASE × timeframe_multiplier

MILESTONE_MOMENTUM_BASE = 0.2

timeframe_multiplier = {
    '3_month': 0.5,
    '6_month': 0.75,
    '1_year': 1.0,
    '3_year': 1.5,
    '5_year': 2.0,
    '10_year': 3.0
}
```

---

## 4. Anti-Vision Dark Star

### 4.1 Dark Star Position

The anti-vision is positioned in state space opposite the vision:

```
dark_star.position = user.position - vision_direction × DARK_DISTANCE

# Dark star is "behind" the user, pulling backwards
DARK_DISTANCE = 2.0  # Far enough to not be immediate threat
```

### 4.2 Dark Star Brightness

Dark star brightness inversely correlates with user velocity:

```
dark_brightness = BASE_DARK_BRIGHTNESS × (1 - average_velocity)

# When moving fast → dark star fades
# When stalled → dark star brightens

BASE_DARK_BRIGHTNESS = 0.5
```

### 4.3 Profile Star Shadow Projection

Existing profile stars can cast shadows toward the dark star:

```
shadow_potential = profile_star.dark_connections / profile_star.total_connections

# Stars with more dark connections are more susceptible to anti-vision projection
```

---

## 5. Horizon Review Triggers

### 5.1 Automatic Review Points

```
should_review = (
    milestone_just_reached OR
    days_since_last_review > PERIODIC_REVIEW_INTERVAL OR
    major_life_event_detected
)

PERIODIC_REVIEW_INTERVAL = 180  # 6 months
```

### 5.2 Review Prompt Logic

After milestone:

```
if milestone.timeframe in ['1_year', '3_year', '5_year', '10_year']:
    review_depth = 'full'  # Complete Horizon check
else:
    review_depth = 'light'  # Quick confirmation
```

---

## 6. Arrival Mechanics

### 6.1 North Star Reach Condition

```
arrived = (
    distance_to_north_star < ARRIVAL_THRESHOLD AND
    all(criterion.met for criterion in north_star.success_criteria)
)

ARRIVAL_THRESHOLD = 0.1
```

### 6.2 Arrival Celebration

When North Star reached:

```
celebration_intensity = (
    horizon.slingshot_velocity +
    horizon.momentum +
    years_on_journey
) × CELEBRATION_FACTOR

CELEBRATION_FACTOR = 0.5
```

### 6.3 Post-Arrival State

```
horizon.state = ARRIVED
horizon.velocity_preserved = horizon.slingshot_velocity × POST_ARRIVAL_PRESERVATION

# Velocity carries into next Horizon
POST_ARRIVAL_PRESERVATION = 0.5  # 50% carries forward
```

---

## 7. Constants Reference

| Constant | Value | Unit | Description |
|----------|-------|------|-------------|
| SLINGSHOT_3_MONTH | 0.15 | - | 3-month milestone slingshot |
| SLINGSHOT_6_MONTH | 0.25 | - | 6-month milestone slingshot |
| SLINGSHOT_1_YEAR | 0.40 | - | 1-year milestone slingshot |
| SLINGSHOT_3_YEAR | 0.60 | - | 3-year milestone slingshot |
| SLINGSHOT_5_YEAR | 0.80 | - | 5-year milestone slingshot |
| SLINGSHOT_10_YEAR | 1.00 | - | 10-year milestone slingshot |
| MOMENTUM_AMPLIFIER | 0.20 | - | Momentum → slingshot boost |
| MAX_ACCUMULATED_VELOCITY | 2.00 | - | Cap on accumulated slingshot |
| DRIFT_THRESHOLD | 0.10 | - | Velocity below = drifting |
| DRIFT_DAYS | 30 | days | Days before drift state |
| DARK_GRAVITY | 0.05 | - | Dark star pull strength |
| MAX_DRIFT_PULL | 0.30 | - | Cap on drift pull |
| DARK_DISTANCE | 2.00 | - | Distance from user to dark star |
| BASE_DARK_BRIGHTNESS | 0.50 | - | Dark star visibility baseline |
| HORIZON_MOMENTUM_DECAY | 0.02 | /day | Slower than Walk decay |
| MILESTONE_MOMENTUM_BASE | 0.20 | - | Momentum boost per milestone |
| PERIODIC_REVIEW_INTERVAL | 180 | days | Forced review frequency |
| ARRIVAL_THRESHOLD | 0.10 | - | Distance to "arrive" |
| POST_ARRIVAL_PRESERVATION | 0.50 | - | Velocity carried to next Horizon |
| HORIZON_DECAY_PERIOD | 365 | days | Days of drift → Undefined |

---

## 8. Algorithms

### 8.1 Slingshot Calculation

```python
def calculate_slingshot(walk, milestone, next_walk=None):
    # Get slingshot power from timeframe
    power = SLINGSHOT_POWER[milestone.timeframe]

    # Calculate alignment if next walk exists
    if next_walk:
        current_direction = walk.trajectory.direction
        next_direction = direction(walk.position, next_walk.first_star.position)
        alignment = max(0, cosine_similarity(current_direction, next_direction))
    else:
        alignment = 1.0  # No next walk = no alignment penalty

    # Momentum bonus
    momentum_bonus = 1 + (walk.horizon.slingshot_velocity * MOMENTUM_AMPLIFIER)

    # Final multiplier
    multiplier = power * alignment * momentum_bonus

    # Exit velocity
    exit_velocity = walk.velocity * (1 + multiplier)

    # Accumulate to Horizon
    walk.horizon.slingshot_velocity += multiplier * walk.velocity
    walk.horizon.slingshot_velocity = min(
        walk.horizon.slingshot_velocity,
        MAX_ACCUMULATED_VELOCITY
    )

    return exit_velocity
```

### 8.2 Drift Update

```python
def update_drift(horizon):
    # Check if drifting
    all_velocity = sum(w.velocity for w in horizon.active_walks) / len(horizon.active_walks)

    if all_velocity < DRIFT_THRESHOLD:
        horizon.days_low_velocity += 1
    else:
        horizon.days_low_velocity = 0

    if horizon.days_low_velocity >= DRIFT_DAYS:
        horizon.state = DRIFTING

        # Calculate drift pull
        distance = distance(horizon.user_position, horizon.dark_star.position)
        pull = min(DARK_GRAVITY / distance**2, MAX_DRIFT_PULL)

        # Move toward dark star
        drift_amount = pull * (1 - all_velocity)
        horizon.distance_to_dark -= drift_amount

        # Update dark star brightness
        horizon.dark_star.brightness = BASE_DARK_BRIGHTNESS * (1 - all_velocity)

    return horizon
```

### 8.3 Horizon Daily Update

```python
def update_horizon_daily(horizon):
    # Update all Walks (Walk-level updates)
    for walk in horizon.active_walks:
        update_walk_daily(walk)

    # Calculate Horizon momentum
    walk_contribution = sum(w.velocity for w in horizon.active_walks) / max(1, len(horizon.active_walks))
    horizon.momentum = horizon.momentum * (1 - HORIZON_MOMENTUM_DECAY) + walk_contribution * 0.1

    # Decay accumulated slingshot (very slow)
    horizon.slingshot_velocity *= (1 - HORIZON_MOMENTUM_DECAY / 2)

    # Check drift
    update_drift(horizon)

    # Check for milestone (triggers Review)
    for walk in horizon.active_walks:
        if check_milestone_reached(walk):
            horizon.state = REVIEWING
            trigger_horizon_review(horizon, walk.current_milestone)

    return horizon
```

---

## 9. Open Questions for NERVES

- [ ] Why 0.4 slingshot for 1-year? How does this compare to orbital mechanics?
- [ ] Why 30 days before drift? What behavior research supports this?
- [ ] Is inverse-square dark gravity correct? Or should it be linear?
- [ ] Why 50% velocity preservation post-arrival?
- [ ] How does 365-day decay compare to real goal abandonment rates?

---

*BLOOD complete. Proceed to NERVES for research justifications.*
