# The Walk - BLOOD

**System:** the-walk
**Lens:** BLOOD (2/7)
**Created:** 2026-01-15
**Status:** Draft
**Depends on:** 01-skeleton.md ✓

---

## Overview

This document defines the mathematical formulas governing journey mechanics: velocity, momentum, thrust, gravitational pull, and milestone progression.

---

## 1. State Vector Position

### 1.1 User Position in State Space

```
s_t = [P, M, E, C, G]

P = Physical (health, energy, body)          ∈ [0, 1]
M = Mental (cognition, focus, learning)      ∈ [0, 1]
E = Environmental (relationships, context)  ∈ [0, 1]
C = Cognitive (beliefs, patterns, schemas)  ∈ [0, 1]
G = Goal Alignment (stated vs actual)       ∈ [0, 1]
```

### 1.2 Position Update

```
s_t = s_{t-1} + v × Δt

where:
  v = velocity vector (direction × magnitude)
  Δt = time step (1 day)
```

---

## 2. Trajectory Mechanics

### 2.1 Trajectory Vector

```
trajectory = {
  direction: unit_vector,     // Where headed
  velocity: float [0, 1],     // How fast
  acceleration: float,        // Rate of change
  momentum: float             // Accumulated energy
}
```

### 2.2 Distance to Star

```
distance(user, star) = ||star.position - user.position||₂

# Euclidean distance in 5D state space
```

### 2.3 Direction to Star

```
direction(user, star) = normalize(star.position - user.position)

# Unit vector pointing toward star
```

---

## 3. Velocity and Momentum

### 3.1 Velocity Update (Daily)

```
v_t = clamp(
    v_{t-1} + a × Δt - decay,
    MIN_VELOCITY,
    MAX_VELOCITY
)

where:
  a = acceleration
  decay = momentum_decay_rate × v_{t-1}
```

### 3.2 Acceleration from Actions

```
acceleration = Σ(experiment_thrust) + milestone_bonus

experiment_thrust = difficulty_factor × completion_factor × relevance

difficulty_factor = {
    tiny: 0.01,
    small: 0.02,
    medium: 0.03,
    stretch: 0.05
}

completion_factor = {
    completed: 1.0,
    partial: 0.5,
    skipped: -0.02
}

relevance = cosine_similarity(experiment.direction, journey.direction)
```

### 3.3 Momentum Accumulation

```
momentum_t = momentum_{t-1} × (1 - MOMENTUM_DECAY) + velocity_gain

where:
  velocity_gain = v_t - v_{t-1} if positive, else 0
  MOMENTUM_DECAY = 0.05 per day
```

### 3.4 Momentum → Velocity Feedback

```
# High momentum makes velocity gains easier
velocity_gain_multiplier = 1 + (momentum × MOMENTUM_BOOST_FACTOR)

MOMENTUM_BOOST_FACTOR = 0.3
```

---

## 4. Milestone Mechanics

### 4.1 Milestone Reach Condition

```
star_reached = (
    distance(user, star) < REACH_THRESHOLD AND
    all(criterion.met for criterion in star.success_criteria)
)

REACH_THRESHOLD = 0.15 (15% of max distance)
```

### 4.2 Thrust from Milestone

When user reaches a milestone, they receive a **thrust boost**:

```
thrust = BASE_THRUST × difficulty_multiplier × completion_bonus

BASE_THRUST = 0.10 (10% velocity boost)

difficulty_multiplier = {
    1_month: 0.8,
    3_month: 1.0,
    6_month: 1.2,
    1_year: 1.5,
    2_year: 2.0,
    5_year: 3.0
}

completion_bonus = 1 + (milestone_index × 0.1)  # Later milestones worth more
```

### 4.3 Acceleration Boost from Milestone

```
acceleration_boost = MILESTONE_ACCEL_BONUS × (1 + momentum)

MILESTONE_ACCEL_BONUS = 0.05

# Each milestone makes future progress easier (snowball)
```

---

## 5. Gravitational Pull

### 5.1 Pull Formula

Stars exert gravitational pull as user approaches:

```
pull = G × star.mass / distance²

where:
  G = GRAVITY_CONSTANT = 0.01
  star.mass = timeframe_weight × 1.0 (all stars equal base mass)
  distance = distance(user, star)
```

### 5.2 Pull Effects

```
# Pull affects experiment priority
experiment_urgency_bonus = pull × PULL_URGENCY_FACTOR

PULL_URGENCY_FACTOR = 0.5

# Makes experiments toward close stars feel more urgent
```

### 5.3 Pull Cap (No Singularity)

```
pull = min(pull, MAX_PULL)

MAX_PULL = 0.5
```

---

## 6. Journey Progress

### 6.1 Overall Progress

```
progress = milestones_reached / total_milestones

# 0 to 1, displayed as percentage
```

### 6.2 Current Segment Progress

```
segment_progress = 1 - (distance_to_next_star / distance_from_last_star)

# How far through current segment
```

### 6.3 Estimated Time to Complete

```
eta = remaining_distance / average_velocity

where:
  remaining_distance = Σ(distance between remaining stars)
  average_velocity = moving_average(velocity, window=14_days)
```

---

## 7. Decay and Stall

### 7.1 Velocity Decay (No Action)

```
decay_rate = BASE_DECAY × (1 + days_inactive × DECAY_ACCELERATION)

BASE_DECAY = 0.02 per day
DECAY_ACCELERATION = 0.01 per day

# Decay accelerates the longer you're inactive
```

### 7.2 Momentum Decay

```
momentum_t = momentum_{t-1} × (1 - MOMENTUM_DECAY)

MOMENTUM_DECAY = 0.05 per day

# Momentum decays faster than velocity
```

### 7.3 Stall Detection

```
is_stalled = (
    velocity < STALL_THRESHOLD AND
    days_since_milestone > STALL_DAYS
)

STALL_THRESHOLD = 0.05
STALL_DAYS = 14

# TARS intervenes when stalled
```

---

## 8. Multi-Journey Capacity

### 8.1 Total Capacity Pool

```
total_experiments_per_day = user.capacity × MAX_DAILY_EXPERIMENTS

where:
  user.capacity ∈ [0, 1]  # from experiment-selection
  MAX_DAILY_EXPERIMENTS = 3
```

### 8.2 Journey Allocation

```
def allocate_experiments(journeys, total_capacity):
    if len(journeys) == 1:
        return {journeys[0]: total_capacity}

    # Weight by urgency (stalled journeys get priority)
    weights = {j: calculate_urgency(j) for j in journeys}
    total_weight = sum(weights.values())

    allocation = {
        j: round(total_capacity × weights[j] / total_weight)
        for j in journeys
    }

    # Ensure minimum 1 per journey
    for j in journeys:
        allocation[j] = max(1, allocation[j])

    return allocation
```

### 8.3 Urgency Calculation

```
urgency = (
    stall_factor × 0.4 +
    proximity_factor × 0.3 +
    age_factor × 0.3
)

stall_factor = days_since_progress / 30  # Capped at 1
proximity_factor = 1 - (distance_to_next / max_distance)
age_factor = min(1, days_active / 90)  # Older journeys get slight priority
```

---

## 9. Constants Reference

| Constant | Value | Unit | Description |
|----------|-------|------|-------------|
| MIN_VELOCITY | 0.0 | - | Can't go backwards |
| MAX_VELOCITY | 1.0 | - | Speed cap |
| REACH_THRESHOLD | 0.15 | - | Distance to "reach" star |
| BASE_THRUST | 0.10 | - | Velocity boost per milestone |
| MILESTONE_ACCEL_BONUS | 0.05 | - | Acceleration boost per milestone |
| GRAVITY_CONSTANT | 0.01 | - | Pull strength |
| MAX_PULL | 0.50 | - | Pull cap |
| PULL_URGENCY_FACTOR | 0.50 | - | Pull → experiment urgency |
| MOMENTUM_DECAY | 0.05 | /day | Momentum decay rate |
| MOMENTUM_BOOST_FACTOR | 0.30 | - | Momentum → velocity bonus |
| BASE_DECAY | 0.02 | /day | Velocity decay base |
| DECAY_ACCELERATION | 0.01 | /day² | Decay speeds up |
| STALL_THRESHOLD | 0.05 | - | Below = stalled |
| STALL_DAYS | 14 | days | Days before stall warning |
| MAX_DAILY_EXPERIMENTS | 3 | - | Hard cap |
| MAX_ACTIVE_JOURNEYS | 3 | - | Hard cap |
| WAITING_EXPIRE_DAYS | 30 | days | Waiting → Faded |
| PAUSED_EXPIRE_DAYS | 90 | days | Paused → Abandoned |

---

## 10. Algorithms

### 10.1 Daily Journey Update

```python
def update_journey_daily(journey, today_experiments):
    # Calculate experiment contributions
    total_thrust = 0
    for exp in today_experiments:
        if exp.status == 'completed':
            thrust = calculate_experiment_thrust(exp, journey)
            total_thrust += thrust

    # Update acceleration
    journey.acceleration = total_thrust

    # Apply velocity change
    velocity_delta = journey.acceleration - calculate_decay(journey)
    journey.velocity = clamp(
        journey.velocity + velocity_delta,
        MIN_VELOCITY,
        MAX_VELOCITY
    )

    # Update momentum
    if velocity_delta > 0:
        journey.momentum += velocity_delta
    journey.momentum *= (1 - MOMENTUM_DECAY)

    # Update position
    direction = calculate_direction(journey.current_position, journey.next_star)
    journey.current_position += direction * journey.velocity

    # Check milestone reach
    if check_milestone_reached(journey):
        apply_milestone_bonus(journey)
        advance_to_next_star(journey)

    # Check stall
    if is_stalled(journey):
        trigger_stall_intervention(journey)

    return journey
```

### 10.2 Milestone Celebration

```python
def apply_milestone_bonus(journey):
    star = journey.current_star

    # Thrust boost
    thrust = BASE_THRUST * get_difficulty_multiplier(star.timeframe)
    thrust *= (1 + journey.milestone_index * 0.1)  # Later = more
    journey.velocity += thrust

    # Acceleration boost
    accel_bonus = MILESTONE_ACCEL_BONUS * (1 + journey.momentum)
    journey.acceleration += accel_bonus

    # Achievement record
    record_milestone_reached(journey, star)

    # Trigger celebration UI
    emit_milestone_event(journey, star)
```

### 10.3 Preview Narrative Generation

```python
def generate_journey_preview(discovery_output):
    """
    Generate AI narratives for each milestone for the "play the tape" moment.
    """
    scenarios = []

    for i, milestone in enumerate(discovery_output.milestones):
        scenario = agent.invoke("scenario-writer", {
            "milestone": milestone,
            "user_context": discovery_output,
            "previous_milestones": discovery_output.milestones[:i],
            "voice": "TARS",
            "style": "vivid_second_person_present_tense",
            "length": "2-3 paragraphs",
            "include_elements": [
                "specific_date_projection",
                "sensory_detail",
                "emotional_beat",
                "identity_shift",
                "relationship_impact"
            ]
        })
        scenarios.append(scenario)

    # North Star gets special treatment
    north_star_scenario = agent.invoke("scenario-writer", {
        "milestone": discovery_output.north_star,
        "is_north_star": True,
        "user_context": discovery_output,
        "voice": "TARS",
        "style": "climactic_but_open",
        "length": "3-4 paragraphs"
    })
    scenarios.append(north_star_scenario)

    return scenarios
```

---

## 11. State Transition Diagram with Numbers

```
                    ┌─────────────────────────────────────┐
                    │           DISCOVERY                  │
                    │     15-30 min interview              │
                    └─────────────┬───────────────────────┘
                                  │ discovery_complete
                                  ▼
                    ┌─────────────────────────────────────┐
                    │            PLOTTED                   │
                    │      stars placed, path visible      │
                    └─────────────┬───────────────────────┘
                                  │ automatic
                                  ▼
                    ┌─────────────────────────────────────┐
                    │           PREVIEWING                 │
                    │      2-5 min "play the tape"         │
                    └──────┬────────────────┬─────────────┘
                           │                │
          user subscribes  │                │  "not yet"
                           ▼                ▼
          ┌─────────────────────┐    ┌─────────────────────┐
          │       WALKING       │    │       WAITING       │
          │  velocity: 0→1      │    │  frozen, whispers   │
          │  experiments active │    │  expires: 30 days   │
          └─────────┬───────────┘    └─────────────────────┘
                    │
                    │ milestone reached
                    ▼
          ┌─────────────────────┐
          │      MILESTONE      │
          │  thrust: +BASE_THRUST│
          │  accel: +ACCEL_BONUS │
          └─────────┬───────────┘
                    │
                    │ continues
                    ▼
          ┌─────────────────────┐
          │  [back to WALKING]  │
          │        ...          │
          │  until North Star   │
          └─────────────────────┘
```

---

## 12. Open Questions for NERVES

- [ ] Why 0.05 momentum decay? (What research supports this?)
- [ ] Why 0.10 base thrust? (Calibration needed)
- [ ] Why 0.15 reach threshold? (What "feels" like arriving?)
- [ ] Is inverse-square gravity the right model? (Or linear pull?)
- [ ] Why 14 days for stall? (Habit formation research)
- [ ] Why 30 days for Waiting expiry? (User behavior patterns)

---

*BLOOD complete. Proceed to NERVES for research justifications.*
