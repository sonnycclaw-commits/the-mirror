# Experiment Selection - BLOOD

**System:** experiment-selection
**Lens:** BLOOD (2/7)
**Created:** 2026-01-15
**Status:** Draft
**Depends on:** 01-skeleton.md, brightness-decay/06-scripture.md

---

## Overview

This document defines all formulas, algorithms, and constants for the experiment selection system. The goal is to select experiments that feel "right" - not too easy, not too hard, targeting the star that most needs attention, at a time when the user can actually succeed.

**Design philosophy:** Selection should feel like a wise friend who knows you, not an algorithm optimizing metrics.

---

## 1. Priority Score Formula

The core selection formula determines which experiment to offer. This expands on the SKELETON's `0.4/0.3/0.3` baseline.

### Formula

```
PRIORITY = (U * w_u) + (C * w_c) + (S * w_s) + CONNECTION_BONUS

where:
  U = star_urgency        [0.0, 1.0]
  C = capacity_fit        [0.0, 1.0]
  S = success_probability [0.0, 1.0]
  w_u = 0.40  (urgency weight)
  w_c = 0.35  (capacity weight)
  w_s = 0.25  (success weight)
```

### Weight Rationale

| Weight | Value | Why |
|--------|-------|-----|
| Urgency (w_u) | 0.40 | Stars at risk matter most - this is what distinguishes prioritization from random selection |
| Capacity (w_c) | 0.35 | Experiments that fit the user's current state succeed - slightly higher than SKELETON's 0.30 because capacity mismatch is the #1 cause of experiment failure |
| Success (w_s) | 0.25 | Historical success matters but shouldn't dominate - we need to explore, not just repeat what worked |

**Adjustment from SKELETON:** Changed 0.30/0.30 to 0.35/0.25 because capacity fit is more predictive of completion than historical success rate. A user who succeeded with morning experiments 90% of the time will still fail a morning experiment offered during a crisis.

### Priority Clamping

```
PRIORITY_FINAL = clamp(PRIORITY, 0.0, 1.0)
```

If CONNECTION_BONUS pushes priority above 1.0, excess does not overflow to other experiments.

---

## 2. Star Urgency Calculation

Urgency determines how much a star "needs" an experiment right now.

### Formula

```
URGENCY = base_urgency * trajectory_modifier * connection_modifier * time_modifier

where:
  base_urgency       = f(star_state)           [0.1, 0.9]
  trajectory_modifier = f(brightness_trend)     [0.8, 1.2]
  connection_modifier = f(connection_effects)   [0.7, 1.3]
  time_modifier      = f(days_since_attention) [1.0, 1.5]
```

### Base Urgency by Star State

| Star State | Base Urgency | Rationale |
|------------|--------------|-----------|
| FLICKERING (5+ days) | 0.9 | Highest priority - at risk of dimming, needs stabilization |
| DARK (growing intensity) | 0.85 | Active threat - shadow work urgently needed |
| DARK (stable) | 0.75 | Persistent threat but not worsening |
| DIM (declining brightness) | 0.70 | Slipping - needs intervention before becomes dark |
| DIM (stable) | 0.50 | Ready for growth, no urgency |
| BRIGHT (declining) | 0.65 | Protect gains before they fade |
| BRIGHT (stable) | 0.20 | Maintenance only - lowest urgency |
| DORMANT | 0.10 | User disengaged - don't push unless they re-engage |

### Trajectory Modifier

Based on 3-day brightness trend:

```python
def trajectory_modifier(brightness_history):
    """Compute modifier based on recent brightness direction."""
    if len(brightness_history) < 3:
        return 1.0

    delta = brightness_history[-1] - brightness_history[-3]

    if delta < -0.05:  # Declining significantly
        return 1.2     # Boost urgency
    elif delta < -0.02:  # Declining slightly
        return 1.1
    elif delta > 0.05:  # Rising significantly
        return 0.8     # Reduce urgency - star is improving
    elif delta > 0.02:  # Rising slightly
        return 0.9
    else:
        return 1.0     # Stable
```

### Connection Modifier

How connected stars affect urgency:

```python
def connection_modifier(star, connections):
    """Modify urgency based on connection network."""
    modifier = 1.0

    for conn in connections.involving(star):
        if conn.type == 'BLOCKS' and conn.blocker.is_active:
            # Being blocked by active dark star - urgent to address
            modifier *= 1.3
        elif conn.type == 'GROWTH_EDGE' and conn.source.is_bright:
            # Ready for growth - slight urgency boost
            modifier *= 1.1
        elif conn.type == 'SHADOW_MIRROR' and star.is_dark:
            # Dark star mirroring another - needs attention
            modifier *= 1.2
        elif conn.type == 'CAUSATION' and conn.source.brightness > 0.6:
            # Prerequisite met - time to act on downstream
            modifier *= 1.1

    return clamp(modifier, 0.7, 1.3)
```

### Time Modifier

Stars neglected too long become more urgent:

```python
def time_modifier(days_since_last_experiment):
    """Boost urgency for neglected stars."""
    if days_since_last_experiment <= 3:
        return 1.0
    elif days_since_last_experiment <= 7:
        return 1.0 + 0.05 * (days_since_last_experiment - 3)  # 1.0 to 1.2
    elif days_since_last_experiment <= 14:
        return 1.2 + 0.02 * (days_since_last_experiment - 7)  # 1.2 to 1.34
    else:
        return 1.5  # Cap - don't over-prioritize ancient neglect
```

### Complete Urgency Calculation

```python
def calculate_urgency(star, connections, history):
    base = BASE_URGENCY[star.state]
    trajectory = trajectory_modifier(history.brightness[-3:])
    connection = connection_modifier(star, connections)
    time = time_modifier(history.days_since_experiment)

    urgency = base * trajectory * connection * time
    return clamp(urgency, 0.0, 1.0)
```

---

## 3. User Capacity Calculation

Capacity represents the user's current ability to complete experiments successfully.

### Formula

```
CAPACITY = (E * w_e) + (T * w_t) + (H * w_h) + (L * w_l) - stress_penalty

where:
  E = energy_level         [0.0, 1.0]
  T = time_availability    [0.0, 1.0]
  H = historical_success   [0.0, 1.0]
  L = load_headroom        [0.0, 1.0]
  w_e = 0.30
  w_t = 0.25
  w_h = 0.20
  w_l = 0.25
```

### Energy Level

```python
def energy_level(stress_state, time_of_day, day_of_week):
    """Estimate user energy from signals."""
    base = STRESS_TO_ENERGY[stress_state]  # See table below

    # Time-of-day adjustment (from user's optimal windows)
    if is_in_optimal_window(time_of_day):
        base *= 1.1
    elif is_in_worst_window(time_of_day):
        base *= 0.7

    # Day-of-week adjustment (from historical patterns)
    day_modifier = user.day_of_week_success_rate[day_of_week] / user.overall_success_rate
    day_modifier = clamp(day_modifier, 0.7, 1.3)

    return clamp(base * day_modifier, 0.0, 1.0)
```

| Stress State | Base Energy |
|--------------|-------------|
| LOW | 1.0 |
| MEDIUM | 0.7 |
| HIGH | 0.4 |
| CRISIS | 0.15 |

### Time Availability

```python
def time_availability(user_schedule, experiment_duration):
    """Score how well experiment fits available time."""
    available_minutes = user.next_free_window_minutes()
    required_minutes = DIFFICULTY_TO_MINUTES[experiment.difficulty]

    if available_minutes >= required_minutes * 2:
        return 1.0  # Plenty of buffer
    elif available_minutes >= required_minutes * 1.5:
        return 0.85
    elif available_minutes >= required_minutes:
        return 0.6  # Just fits - risky
    else:
        return 0.2  # Doesn't fit - low score but not zero (user might find time)
```

| Difficulty | Required Minutes |
|------------|------------------|
| TINY | 0.5 |
| SMALL | 5 |
| MEDIUM | 20 |
| STRETCH | 45 |

### Historical Success Rate

```python
def historical_success(user, experiment):
    """Success rate for similar experiments."""
    similar = user.experiments.filter(
        template_type=experiment.template.type,
        difficulty=experiment.difficulty,
        time_window=experiment.time_window,
        completed_within_days=30
    )

    if len(similar) < 3:
        return DEFAULT_SUCCESS_RATE  # 0.5 - assume average

    return similar.completion_rate()  # completed / (completed + skipped + failed)
```

### Load Headroom

```python
def load_headroom(user):
    """How much capacity remains given current active experiments."""
    active_count = user.active_experiment_count  # 0, 1, 2, or 3

    headroom_table = {
        0: 1.0,   # Full capacity
        1: 0.75,  # Some load
        2: 0.45,  # Getting heavy
        3: 0.0    # At max - should not be selecting anyway
    }

    return headroom_table[active_count]
```

### Stress Penalty

Applied after weighted sum to create a floor effect:

```python
def stress_penalty(stress_state):
    """Direct subtraction for stress - creates hard limits."""
    return {
        'LOW': 0.0,
        'MEDIUM': 0.05,
        'HIGH': 0.15,
        'CRISIS': 0.35
    }[stress_state]
```

### Complete Capacity Calculation

```python
def calculate_capacity(user, experiment):
    E = energy_level(user.stress, current_time(), current_day())
    T = time_availability(user.schedule, experiment.duration)
    H = historical_success(user, experiment)
    L = load_headroom(user)

    weighted = (E * 0.30) + (T * 0.25) + (H * 0.20) + (L * 0.25)
    penalty = stress_penalty(user.stress)

    return clamp(weighted - penalty, 0.0, 1.0)
```

---

## 4. Success Probability Model

Predicts how likely the user is to complete this specific experiment.

### Formula

```
SUCCESS_PROB = base_prob * difficulty_modifier * template_modifier * star_modifier * recency_modifier

where:
  base_prob           = user.overall_completion_rate    [0.2, 0.95]
  difficulty_modifier = f(experiment.difficulty)        [0.6, 1.1]
  template_modifier   = f(template_history)             [0.5, 1.3]
  star_modifier       = f(star_state)                   [0.7, 1.1]
  recency_modifier    = f(days_since_similar)           [0.9, 1.2]
```

### Base Probability

```python
def base_probability(user):
    """User's overall experiment completion rate, smoothed."""
    total_experiments = user.experiments.filter(
        state__in=['completed', 'skipped', 'failed'],
        completed_within_days=30
    )

    if len(total_experiments) < 5:
        return DEFAULT_BASE_PROB  # 0.5

    # Use smoothed rate to prevent extreme values
    raw_rate = total_experiments.completion_rate()
    return clamp(raw_rate, 0.2, 0.95)  # Floor/ceiling prevents over-confidence
```

### Difficulty Modifier

Harder experiments are less likely to succeed:

| Difficulty | Modifier | Rationale |
|------------|----------|-----------|
| TINY | 1.10 | Almost trivial - slight boost |
| SMALL | 1.00 | Baseline |
| MEDIUM | 0.85 | Requires effort |
| STRETCH | 0.60 | Significant challenge |

### Template Modifier

How well has this template type worked for this user?

```python
def template_modifier(user, template):
    """Adjust based on template-specific history."""
    history = user.experiments.filter(template_id=template.id)

    if len(history) == 0:
        return 1.0  # Unknown - assume baseline

    if len(history) < 3:
        # Limited data - regress toward mean
        raw_rate = history.completion_rate()
        return 0.6 * raw_rate + 0.4 * 0.5  # Blend with 50%

    # Enough data - use actual rate, bounded
    return clamp(history.completion_rate() * 1.2, 0.5, 1.3)
```

### Star Modifier

Star state affects likelihood of engagement:

| Star State | Modifier | Rationale |
|------------|----------|-----------|
| FLICKERING | 0.85 | Unstable - harder to sustain engagement |
| DARK | 0.70 | Avoidance patterns - hardest to complete |
| DIM | 1.00 | Neutral |
| BRIGHT | 1.10 | Momentum - easier to maintain |

### Recency Modifier

Recent success with similar experiments boosts probability:

```python
def recency_modifier(user, experiment):
    """Boost if similar experiment completed recently."""
    last_similar = user.experiments.filter(
        template_type=experiment.template.type,
        state='completed'
    ).most_recent()

    if not last_similar:
        return 0.95  # Never done - slight penalty for unknown

    days_since = (now() - last_similar.completed_at).days

    if days_since <= 1:
        return 1.2   # Just did this - momentum
    elif days_since <= 3:
        return 1.1
    elif days_since <= 7:
        return 1.0
    else:
        return 0.9   # Stale - slight penalty
```

### Complete Success Probability

```python
def calculate_success_probability(user, experiment):
    base = base_probability(user)
    diff_mod = DIFFICULTY_MODIFIER[experiment.difficulty]
    temp_mod = template_modifier(user, experiment.template)
    star_mod = STAR_STATE_MODIFIER[experiment.star.state]
    rec_mod = recency_modifier(user, experiment)

    prob = base * diff_mod * temp_mod * star_mod * rec_mod
    return clamp(prob, 0.05, 0.95)  # Never certain, never hopeless
```

---

## 5. Connection Effect Modifiers

How each of the 6 connection types affects experiment selection.

### Overview

| Connection Type | Effect | Mechanism | Magnitude |
|-----------------|--------|-----------|-----------|
| GROWTH_EDGE | **Enables** | Prerequisite met → boost target | +0.15 to +0.25 |
| RESONANCE | **Spillover** | Success spreads → multi-target bonus | +0.05 to +0.15 |
| TENSION | **Competes** | Mutual inhibition → avoid pairing | -0.20 if paired |
| CAUSATION | **Sequences** | Order matters → prioritize cause first | +0.10 to source |
| SHADOW_MIRROR | **Surfaces** | Dark needs attention → periodic boost | +0.10 every 7 days |
| BLOCKS | **Prevents** | Blocker active → hard filter | Filter out blocked |

### GROWTH_EDGE Bonus

```python
def growth_edge_bonus(star, connections):
    """
    If star has a bright prerequisite via GROWTH_EDGE,
    boost priority because growth conditions are met.
    """
    growth_edges = connections.filter(
        type='GROWTH_EDGE',
        target=star
    )

    bonus = 0.0
    for edge in growth_edges:
        if edge.source.brightness >= GROWTH_EDGE_THRESHOLD:  # 0.65
            # Stronger bonus for brighter prerequisites
            source_bonus = 0.15 + 0.10 * (edge.source.brightness - GROWTH_EDGE_THRESHOLD) / (1.0 - GROWTH_EDGE_THRESHOLD)
            bonus = max(bonus, source_bonus)  # Take best, don't stack

    return bonus  # [0.0, 0.25]
```

### RESONANCE Bonus

```python
def resonance_bonus(star, connections):
    """
    Stars in resonance brighten together.
    Slight bonus if resonant partner is being targeted or is bright.
    """
    resonances = connections.filter(type='RESONANCE', involves=star)

    bonus = 0.0
    for res in resonances:
        partner = res.other_star(star)
        if partner.brightness >= 0.7:
            # Bright partner - spillover likely
            bonus += 0.05
        if partner.has_active_experiment():
            # Both being worked on - synergy
            bonus += 0.10

    return min(bonus, 0.15)  # Cap spillover bonus
```

### TENSION Penalty

```python
def tension_penalty(candidate, active_experiments, connections):
    """
    Penalize experiments on stars in tension with active experiment targets.
    This prevents conflicting work.
    """
    penalty = 0.0

    for active in active_experiments:
        if connections.has_tension(candidate.star, active.star):
            penalty = 0.20  # Significant but not blocking
            break

    return penalty
```

### CAUSATION Boost

```python
def causation_boost(star, connections):
    """
    If star causes another star (A → B), and B needs attention,
    boost A's priority to address root cause.
    """
    caused = connections.filter(type='CAUSATION', source=star)

    boost = 0.0
    for cause in caused:
        if cause.target.urgency >= 0.6:
            # Effect star needs help - address cause
            boost = 0.10
            break

    return boost
```

### SHADOW_MIRROR Surfacing

```python
def shadow_mirror_bonus(star, connections, last_surfaced):
    """
    Dark stars need periodic attention even if user avoids them.
    Every 7 days without attention, boost priority.
    """
    if not star.is_dark:
        return 0.0

    shadow_mirrors = connections.filter(type='SHADOW_MIRROR', involves=star)
    if not shadow_mirrors:
        return 0.0

    days_since_surfaced = (now() - last_surfaced.get(star.id, EPOCH)).days

    if days_since_surfaced >= 7:
        # Time to surface - significant boost
        return 0.10 + 0.02 * min(days_since_surfaced - 7, 14)  # Max +0.38

    return 0.0
```

### BLOCKS Filter

```python
def is_blocked(star, connections):
    """
    If a star is blocked by an active/strong blocker,
    it CANNOT be targeted for experiments.
    This is a hard filter, not a penalty.
    """
    blockers = connections.filter(type='BLOCKS', blocked=star)

    for blocker in blockers:
        if blocker.source.brightness <= BLOCKER_THRESHOLD:  # 0.25 - dark/dim
            # Blocker is active - target is inaccessible
            return True

    return False
```

### Complete Connection Bonus

```python
def calculate_connection_bonus(candidate, context):
    """Combine all connection effects into single modifier."""
    star = candidate.star
    connections = context.connections

    if is_blocked(star, connections):
        return None  # Signal to filter out completely

    bonus = 0.0
    bonus += growth_edge_bonus(star, connections)
    bonus += resonance_bonus(star, connections)
    bonus += causation_boost(star, connections)
    bonus += shadow_mirror_bonus(star, connections, context.last_surfaced)

    penalty = tension_penalty(candidate, context.active_experiments, connections)

    return bonus - penalty  # Can be negative
```

---

## 6. Selection Algorithm

Full pseudocode for experiment selection.

### Main Selection Function

```python
def select_experiments(context: SelectionContext) -> List[Experiment]:
    """
    Select experiments to offer to the user.

    Returns up to `available_slots` experiments, sorted by priority.
    """
    # 0. Early exit if user at capacity
    available_slots = MAX_ACTIVE - context.user.active_experiment_count
    if available_slots <= 0:
        return []

    # 1. Get eligible stars
    eligible_stars = get_eligible_stars(context)

    # 2. Generate candidates for each star
    candidates = []
    for star in eligible_stars:
        # 2a. Check blocking connections
        if is_blocked(star, context.connections):
            continue

        # 2b. Determine appropriate difficulty
        difficulty = select_difficulty(star, context.user_capacity)

        # 2c. Find matching templates
        templates = filter_templates(
            domain=star.domain,
            difficulty=difficulty,
            constraints=context.constraints
        )

        # 2d. Generate experiments from templates
        for template in templates[:MAX_TEMPLATES_PER_STAR]:
            experiment = generate_experiment(star, template)

            # 2e. Calculate priority components
            urgency = calculate_urgency(star, context.connections, context.history)
            capacity = calculate_capacity(context.user, experiment)
            success = calculate_success_probability(context.user, experiment)
            connection_bonus = calculate_connection_bonus(experiment, context)

            if connection_bonus is None:
                continue  # Blocked

            # 2f. Compute final priority
            experiment.priority_score = (
                (urgency * W_URGENCY) +
                (capacity * W_CAPACITY) +
                (success * W_SUCCESS) +
                connection_bonus
            )
            experiment.priority_score = clamp(experiment.priority_score, 0.0, 1.0)

            candidates.append(experiment)

    # 3. Sort by priority
    candidates.sort(key=lambda e: e.priority_score, reverse=True)

    # 4. Apply diversity filter (no duplicate stars in top results)
    filtered = apply_diversity_filter(candidates)

    # 5. Apply tension filter (no experiments on stars in tension)
    filtered = apply_tension_filter(filtered, context.connections)

    # 6. Return top N
    return filtered[:available_slots]
```

### Difficulty Selection

```python
def select_difficulty(star, user_capacity) -> Difficulty:
    """
    Choose appropriate difficulty based on star state and user capacity.

    Matrix logic:
    - Crisis/Low capacity → TINY always
    - Flickering stars → TINY (stabilization)
    - Dark stars → TINY or SMALL (awareness)
    - Dim stars → SMALL (growth)
    - Bright stars → MEDIUM (expansion)
    - User requests stretch → STRETCH (with success warning)
    """
    # Capacity constraints dominate
    if user_capacity.stress_state == 'CRISIS':
        return Difficulty.TINY

    if user_capacity.score < 0.3:
        return Difficulty.TINY

    # Star state determines base
    state_to_difficulty = {
        'FLICKERING': Difficulty.TINY,
        'DARK': Difficulty.TINY,  # Awareness tasks
        'DIM': Difficulty.SMALL,
        'BRIGHT': Difficulty.MEDIUM,
        'DORMANT': Difficulty.TINY,  # Re-engagement
    }

    base_difficulty = state_to_difficulty.get(star.state, Difficulty.SMALL)

    # Capacity can reduce but not increase difficulty
    if user_capacity.score < 0.5 and base_difficulty.value > Difficulty.SMALL.value:
        return Difficulty.SMALL

    return base_difficulty
```

### Diversity Filter

```python
def apply_diversity_filter(candidates: List[Experiment]) -> List[Experiment]:
    """
    Ensure variety in experiment selection.
    No more than 2 experiments targeting the same star in top results.
    No more than 3 experiments in the same domain.
    """
    filtered = []
    star_counts = {}
    domain_counts = {}

    for candidate in candidates:
        star_id = candidate.star.id
        domain = candidate.star.domain

        if star_counts.get(star_id, 0) >= MAX_PER_STAR:
            continue

        if domain_counts.get(domain, 0) >= MAX_PER_DOMAIN:
            continue

        filtered.append(candidate)
        star_counts[star_id] = star_counts.get(star_id, 0) + 1
        domain_counts[domain] = domain_counts.get(domain, 0) + 1

    return filtered
```

### Tension Filter

```python
def apply_tension_filter(candidates: List[Experiment], connections) -> List[Experiment]:
    """
    Remove experiments that would put user in conflicting work.
    If star A and star B are in tension, only keep the higher priority one.
    """
    filtered = []
    excluded_stars = set()

    for candidate in candidates:
        if candidate.star.id in excluded_stars:
            continue

        filtered.append(candidate)

        # Find all stars in tension with this one
        tension_stars = connections.filter(
            type='TENSION',
            involves=candidate.star
        ).get_other_stars(candidate.star)

        for ts in tension_stars:
            excluded_stars.add(ts.id)

    return filtered
```

### Tie-Breaking

```python
def break_ties(experiments: List[Experiment]) -> List[Experiment]:
    """
    When priorities are equal (within 0.01), break ties by:
    1. Connection bonus (GROWTH_EDGE favored)
    2. Recency (least recently attempted star)
    3. Random (for true fairness)
    """
    def tie_breaker_key(exp):
        return (
            -exp.connection_bonus,  # Higher bonus first
            exp.star.days_since_last_experiment,  # More neglected first
            random.random()  # Final randomness
        )

    # Group by priority (within 0.01)
    groups = group_by_priority(experiments, tolerance=0.01)

    result = []
    for group in groups:
        group.sort(key=tie_breaker_key)
        result.extend(group)

    return result
```

---

## 7. Constants Table

All magic numbers with values and status.

### Priority Weights

| Constant | Value | Unit | Description | Source |
|----------|-------|------|-------------|--------|
| W_URGENCY | 0.40 | - | Weight for star urgency in priority | Design |
| W_CAPACITY | 0.35 | - | Weight for user capacity fit | Design |
| W_SUCCESS | 0.25 | - | Weight for success probability | Design |

### Star Urgency

| Constant | Value | Unit | Description | Source |
|----------|-------|------|-------------|--------|
| BASE_URGENCY_FLICKERING | 0.90 | - | Urgency for flickering stars | 02a-walk-mechanics |
| BASE_URGENCY_DARK_GROWING | 0.85 | - | Urgency for intensifying dark stars | Design |
| BASE_URGENCY_DARK_STABLE | 0.75 | - | Urgency for stable dark stars | Design |
| BASE_URGENCY_DIM_DECLINING | 0.70 | - | Urgency for declining dim stars | Design |
| BASE_URGENCY_BRIGHT_DECLINING | 0.65 | - | Urgency for declining bright stars | 02a-walk-mechanics |
| BASE_URGENCY_DIM_STABLE | 0.50 | - | Urgency for stable dim stars | 02a-walk-mechanics |
| BASE_URGENCY_BRIGHT_STABLE | 0.20 | - | Urgency for stable bright stars | 02a-walk-mechanics |
| BASE_URGENCY_DORMANT | 0.10 | - | Urgency for dormant stars | Design |
| TIME_MODIFIER_MAX | 1.5 | - | Maximum time-based urgency boost | Design |
| TRAJECTORY_MODIFIER_RANGE | [0.8, 1.2] | - | Range for trajectory adjustment | Design |

### User Capacity

| Constant | Value | Unit | Description | Source |
|----------|-------|------|-------------|--------|
| STRESS_ENERGY_LOW | 1.0 | - | Energy at low stress | Design |
| STRESS_ENERGY_MEDIUM | 0.7 | - | Energy at medium stress | Design |
| STRESS_ENERGY_HIGH | 0.4 | - | Energy at high stress | Design |
| STRESS_ENERGY_CRISIS | 0.15 | - | Energy during crisis | Design |
| STRESS_PENALTY_MEDIUM | 0.05 | - | Capacity penalty for medium stress | Design |
| STRESS_PENALTY_HIGH | 0.15 | - | Capacity penalty for high stress | Design |
| STRESS_PENALTY_CRISIS | 0.35 | - | Capacity penalty for crisis | Design |
| DEFAULT_SUCCESS_RATE | 0.5 | - | Assumed success rate with no data | Design |
| DIFFICULTY_TIME_TINY | 0.5 | minutes | Time required for tiny experiments | Design |
| DIFFICULTY_TIME_SMALL | 5 | minutes | Time required for small experiments | Design |
| DIFFICULTY_TIME_MEDIUM | 20 | minutes | Time required for medium experiments | Design |
| DIFFICULTY_TIME_STRETCH | 45 | minutes | Time required for stretch experiments | Design |

### Success Probability

| Constant | Value | Unit | Description | Source |
|----------|-------|------|-------------|--------|
| DIFFICULTY_MOD_TINY | 1.10 | - | Success modifier for tiny | Design |
| DIFFICULTY_MOD_SMALL | 1.00 | - | Success modifier for small | Design |
| DIFFICULTY_MOD_MEDIUM | 0.85 | - | Success modifier for medium | Design |
| DIFFICULTY_MOD_STRETCH | 0.60 | - | Success modifier for stretch | Design |
| STAR_STATE_MOD_FLICKERING | 0.85 | - | Success modifier for flickering stars | Design |
| STAR_STATE_MOD_DARK | 0.70 | - | Success modifier for dark stars | Design |
| STAR_STATE_MOD_DIM | 1.00 | - | Success modifier for dim stars | Design |
| STAR_STATE_MOD_BRIGHT | 1.10 | - | Success modifier for bright stars | Design |
| SUCCESS_PROB_FLOOR | 0.05 | - | Minimum success probability | Design |
| SUCCESS_PROB_CEILING | 0.95 | - | Maximum success probability | Design |

### Connection Effects

| Constant | Value | Unit | Description | Source |
|----------|-------|------|-------------|--------|
| GROWTH_EDGE_THRESHOLD | 0.65 | - | Brightness needed to enable growth edge | Design |
| GROWTH_EDGE_BONUS_MIN | 0.15 | - | Minimum bonus from growth edge | Design |
| GROWTH_EDGE_BONUS_MAX | 0.25 | - | Maximum bonus from growth edge | Design |
| RESONANCE_BONUS_PER_BRIGHT | 0.05 | - | Bonus per bright resonant partner | Design |
| RESONANCE_BONUS_ACTIVE | 0.10 | - | Bonus if resonant partner has active experiment | Design |
| RESONANCE_BONUS_CAP | 0.15 | - | Maximum resonance bonus | Design |
| TENSION_PENALTY | 0.20 | - | Penalty for targeting star in tension with active | Design |
| CAUSATION_BOOST | 0.10 | - | Boost for cause star when effect needs help | Design |
| SHADOW_SURFACE_INTERVAL | 7 | days | Days between shadow surfacing attempts | Design |
| SHADOW_SURFACE_BONUS_BASE | 0.10 | - | Base bonus for surfacing shadow | Design |
| SHADOW_SURFACE_BONUS_RATE | 0.02 | /day | Additional bonus per day overdue | Design |
| BLOCKER_THRESHOLD | 0.25 | - | Brightness below which blocker is active | Design |

### Selection Limits

| Constant | Value | Unit | Description | Source |
|----------|-------|------|-------------|--------|
| MAX_ACTIVE | 3 | - | Maximum active experiments | 01-skeleton |
| MAX_QUEUED | 5 | - | Maximum queued experiments | 01-skeleton |
| MAX_TEMPLATES_PER_STAR | 3 | - | Templates to consider per star | Design |
| MAX_PER_STAR | 2 | - | Max experiments per star in results | Design |
| MAX_PER_DOMAIN | 3 | - | Max experiments per domain in results | Design |
| TIE_TOLERANCE | 0.01 | - | Priority difference considered a tie | Design |

### Time Constants

| Constant | Value | Unit | Description | Source |
|----------|-------|------|-------------|--------|
| OFFER_EXPIRY | 24 | hours | Time before offered experiment expires | 01-skeleton |
| QUEUE_EXPIRY | 7 | days | Time before queued experiment expires | 01-skeleton |
| BLACKLIST_DURATION | 30 | days | Duration template is blacklisted after 3 declines | Design |
| GRACE_PERIOD | 12 | hours | Grace period after deadline before auto-fail | Design |

---

## 8. Brightness Impact from Experiments

Integrating with brightness-decay system for experiment outcomes.

### Brightness Gain on Completion

From brightness-decay/06-scripture.md:

```python
gain = BASE_EXPERIMENT_IMPACT * difficulty * alignment * novelty

where:
  BASE_EXPERIMENT_IMPACT = 0.03
  difficulty = {TINY: 0.5, SMALL: 0.75, MEDIUM: 1.0, STRETCH: 1.5}
  alignment = 0.5 (tangential) to 1.0 (direct)
  novelty = 1.2 for first-time type, else 1.0
```

| Difficulty | Base Gain | With Streak (1.3x) | Daily Cap |
|------------|-----------|-------------------|-----------|
| TINY | 0.015 | 0.020 | 0.06 |
| SMALL | 0.023 | 0.030 | 0.06 |
| MEDIUM | 0.030 | 0.039 | 0.06 |
| STRETCH | 0.045 | 0.059 | 0.06 |

### Skip Penalty

From brightness-decay/06-scripture.md:

```python
penalty = BASE_SKIP_PENALTY * skip_multiplier

where:
  BASE_SKIP_PENALTY = 0.008
  skip_multiplier = {0: 0, 1: 0, 2: 1.0, 3: 1.5, 4+: 2.0}
```

**First two skips are FREE** - life happens. Penalties start on third consecutive skip.

### Failed Experiment Penalty

```python
# Failed = deadline passed without report
# Treated as skip + ambiguity penalty
penalty = skip_penalty + AMBIGUITY_PENALTY

where:
  AMBIGUITY_PENALTY = 0.005  # Smaller than skip
```

---

## 9. Open Questions for NERVES

- [ ] Why 0.40/0.35/0.25 weights? (Adjusted from SKELETON's 0.40/0.30/0.30)
- [ ] What research supports the trajectory modifier ranges?
- [ ] Is 7 days the right interval for shadow surfacing?
- [ ] Should TENSION be a hard filter instead of a penalty?
- [ ] What's the right GROWTH_EDGE_THRESHOLD (0.65)?
- [ ] How were difficulty time estimates (0.5/5/20/45 min) derived?
- [ ] Should tie-breaking use deterministic hash instead of random?
- [ ] Is the stress penalty additive or should it be multiplicative?
- [ ] How should capacity weights be validated?
- [ ] What's the empirical basis for success probability modifiers?

---

## 10. Worked Examples

### Example 1: High-Priority Selection

**Context:**
- Star: Health (FLICKERING for 6 days, brightness 0.32)
- User: LOW stress, morning, completed 4/5 recent experiments
- Connections: GROWTH_EDGE from bright Purpose star (0.78)

**Calculation:**

```
Urgency:
  base = 0.90 (flickering)
  trajectory = 1.15 (declining over 3 days)
  connection = 1.1 (GROWTH_EDGE ready)
  time = 1.15 (6 days since experiment)
  URGENCY = 0.90 * 1.15 * 1.1 * 1.15 = 1.31 → clamped to 1.0

Capacity (for TINY experiment):
  energy = 1.0 * 1.1 (optimal window) = 1.1 → 1.0
  time_availability = 1.0 (plenty of time for 30 sec)
  historical = 0.8 (4/5 completion)
  load_headroom = 0.75 (1 active)
  weighted = (1.0 * 0.30) + (1.0 * 0.25) + (0.8 * 0.20) + (0.75 * 0.25)
           = 0.30 + 0.25 + 0.16 + 0.19 = 0.90
  CAPACITY = 0.90 - 0.0 (no stress penalty) = 0.90

Success:
  base = 0.80 (80% completion rate)
  difficulty_mod = 1.10 (TINY)
  template_mod = 1.0 (no history)
  star_mod = 0.85 (FLICKERING)
  recency_mod = 1.0 (recent success)
  SUCCESS = 0.80 * 1.10 * 1.0 * 0.85 * 1.0 = 0.75

Connection Bonus:
  growth_edge = 0.15 + 0.10 * (0.78 - 0.65) / 0.35 = 0.15 + 0.037 = 0.19
  BONUS = 0.19

PRIORITY = (1.0 * 0.40) + (0.90 * 0.35) + (0.75 * 0.25) + 0.19
         = 0.40 + 0.315 + 0.19 + 0.19
         = 1.09 → clamped to 1.0
```

**Result:** Priority 1.0 - this experiment should be offered.

### Example 2: Low-Priority Rejection

**Context:**
- Star: Wealth (BRIGHT, stable at 0.82)
- User: HIGH stress, evening (worst window)
- Connections: None notable

**Calculation:**

```
Urgency:
  base = 0.20 (bright stable)
  trajectory = 1.0 (stable)
  connection = 1.0 (none)
  time = 1.0 (recent attention)
  URGENCY = 0.20

Capacity (for MEDIUM experiment):
  energy = 0.4 * 0.7 (worst window) = 0.28
  time_availability = 0.6 (barely fits)
  historical = 0.5 (no data)
  load_headroom = 0.45 (2 active)
  weighted = (0.28 * 0.30) + (0.6 * 0.25) + (0.5 * 0.20) + (0.45 * 0.25)
           = 0.084 + 0.15 + 0.10 + 0.11 = 0.44
  CAPACITY = 0.44 - 0.15 (high stress penalty) = 0.29

Success:
  base = 0.50
  difficulty_mod = 0.85 (MEDIUM)
  template_mod = 1.0
  star_mod = 1.10 (BRIGHT)
  recency_mod = 0.9 (stale)
  SUCCESS = 0.50 * 0.85 * 1.0 * 1.10 * 0.9 = 0.42

Connection Bonus: 0.0

PRIORITY = (0.20 * 0.40) + (0.29 * 0.35) + (0.42 * 0.25) + 0.0
         = 0.08 + 0.10 + 0.11 + 0.0
         = 0.29
```

**Result:** Priority 0.29 - this experiment should be deprioritized.

---

## Summary

The experiment selection system balances three core factors:
1. **Star Urgency** (40%) - Which star needs attention most?
2. **User Capacity** (35%) - Can the user actually do this right now?
3. **Success Probability** (25%) - Will this experiment likely succeed?

Connection effects modify these base scores, with BLOCKS acting as a hard filter and TENSION preventing conflicting work.

The algorithm feels like a wise friend because it:
- Never pushes when you're overwhelmed (capacity awareness)
- Prioritizes what truly matters (urgency from star state)
- Learns from your history (success probability)
- Respects the relationships in your constellation (connection effects)

---

*BLOOD complete. Proceed to NERVES to justify these numbers with research.*
