# Compatibility System - BLOOD

**System:** compatibility
**Lens:** BLOOD (2/7)
**Created:** 2026-01-15
**Status:** Draft
**Depends on:** 01-skeleton.md, brightness-decay/02-blood.md, connection-formation/06-scripture.md

---

## Overview

This document defines the mathematical formulas for multi-user constellation overlay and compatibility profile computation. It transforms the SKELETON's state machines into concrete algorithms for detecting interaction patterns between users' stars.

**Design Goals:**
- **No single percentage** - Multi-dimensional profiles, not "72% compatible"
- **Privacy-preserving** - Blurring propagates uncertainty without leaking data
- **Intuitive results** - Strength values feel meaningful at a glance
- **Scalable to groups** - N>2 users via pairwise decomposition

---

## 1. Overlay Positioning Math

### 1.1 Coordinate System

Each user's constellation exists in its own space. Overlay maps both to a shared coordinate system based on **domains** (not spatial coordinates).

```python
def create_overlay_coordinate_space(user_a, user_b):
    """
    Domain-based overlay. Stars interact if they share domains.
    No 2D spatial positioning - domains ARE the coordinates.
    """
    # Collect all domains present in either constellation
    domains_a = {star.domain for star in user_a.stars if star.state not in [DORMANT, NASCENT]}
    domains_b = {star.domain for star in user_b.stars if star.state not in [DORMANT, NASCENT]}

    shared_domains = domains_a & domains_b
    unique_to_a = domains_a - domains_b
    unique_to_b = domains_b - domains_a

    return OverlaySpace(
        shared=shared_domains,
        a_only=unique_to_a,
        b_only=unique_to_b
    )
```

**Why domain-based, not spatial?**
- Stars within the same domain represent related aspects of life
- Spatial proximity would require arbitrary position assignment
- Domain overlap is semantically meaningful ("you both care about Health")

### 1.2 Proximity Score

Two stars can interact based on domain relationship:

```python
def calculate_proximity(star_a, star_b):
    """
    Proximity determines if/how strongly two stars can interact.
    Returns value in [0.0, 1.0] where 1.0 = same domain.
    """
    if star_a.domain == star_b.domain:
        return PROXIMITY_SAME_DOMAIN  # 1.0

    if are_adjacent_domains(star_a.domain, star_b.domain):
        return PROXIMITY_ADJACENT  # 0.0 (future: 0.3)

    return PROXIMITY_DIFFERENT  # 0.0
```

**Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| PROXIMITY_SAME_DOMAIN | 1.0 | Full interaction potential |
| PROXIMITY_ADJACENT | 0.0 | Reserved for future cross-domain (could be 0.3) |
| PROXIMITY_DIFFERENT | 0.0 | No direct interaction |

**Domain Adjacency (Future Extension):**

| Domain | Adjacent To |
|--------|-------------|
| Health | Relationships, Soul |
| Relationships | Health, Purpose |
| Wealth | Purpose, Career |
| Purpose | Relationships, Wealth, Soul |
| Soul | Health, Purpose |

*Note: Adjacent domain interactions are designed but not implemented in v1.*

---

## 2. Interaction Detection Formulas

### 2.1 Interaction Detection Pipeline

```python
def detect_interactions(overlay, privacy_a, privacy_b):
    """
    Main pipeline for detecting all interaction lines between two constellations.
    """
    interactions = []

    # Get visible stars (respecting privacy)
    stars_a = get_visible_stars(overlay.user_a, privacy_a)
    stars_b = get_visible_stars(overlay.user_b, privacy_b)

    # Check each pair in shared domains
    for star_a in stars_a:
        for star_b in stars_b:
            proximity = calculate_proximity(star_a, star_b)

            if proximity >= MIN_INTERACTION_PROXIMITY:
                interaction = detect_interaction_type(star_a, star_b, privacy_a, privacy_b)
                if interaction and interaction.strength >= MIN_INTERACTION_STRENGTH:
                    interactions.append(interaction)

    return interactions
```

**Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| MIN_INTERACTION_PROXIMITY | 0.5 | Must share domain (or adjacent in future) |
| MIN_INTERACTION_STRENGTH | 0.2 | Below this, interaction not recorded |

### 2.2 Type Detection with Priority

```python
def detect_interaction_type(star_a, star_b, privacy_a, privacy_b):
    """
    Determine interaction type. Priority order prevents double-counting.
    Returns highest-priority matching type.
    """
    brightness_a = get_effective_brightness(star_a, privacy_a)
    brightness_b = get_effective_brightness(star_b, privacy_b)

    # Priority 1: SHADOW_MIRROR (both struggling)
    if is_shadow_mirror(brightness_a, brightness_b):
        strength = calculate_shadow_mirror_strength(brightness_a, brightness_b)
        return Interaction(type=SHADOW_MIRROR, strength=strength)

    # Priority 2: TENSION (active friction)
    if is_tension(brightness_a, brightness_b):
        strength = calculate_tension_strength(brightness_a, brightness_b)
        return Interaction(type=TENSION, strength=strength)

    # Priority 3: GROWTH_EDGE (asymmetric but constructive)
    if is_growth_edge(brightness_a, brightness_b):
        strength = calculate_growth_edge_strength(brightness_a, brightness_b)
        return Interaction(type=GROWTH_EDGE, strength=strength)

    # Priority 4: RESONANCE (both strong)
    if is_resonance(brightness_a, brightness_b):
        strength = calculate_resonance_strength(brightness_a, brightness_b)
        return Interaction(type=RESONANCE, strength=strength)

    # No qualifying interaction
    return None
```

### 2.3 Type-Specific Detection Formulas

#### SHADOW_MIRROR (Both Dark/Dim)

```python
def is_shadow_mirror(brightness_a, brightness_b):
    """Both users struggling in same domain."""
    return brightness_a <= SHADOW_THRESHOLD and brightness_b <= SHADOW_THRESHOLD

def calculate_shadow_mirror_strength(brightness_a, brightness_b):
    """
    Strength increases as both get darker (shared wound deepens).
    Max strength when both at minimum.
    """
    # How far each is below threshold (normalized)
    darkness_a = (SHADOW_THRESHOLD - brightness_a) / SHADOW_THRESHOLD
    darkness_b = (SHADOW_THRESHOLD - brightness_b) / SHADOW_THRESHOLD

    # Geometric mean rewards symmetry
    base_strength = sqrt(darkness_a * darkness_b)

    return clamp(base_strength, MIN_INTERACTION_STRENGTH, 1.0)
```

**Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| SHADOW_THRESHOLD | 0.4 | Both must be below this |

**Example calculations:**

| B_A | B_B | darkness_A | darkness_B | Strength |
|-----|-----|------------|------------|----------|
| 0.1 | 0.1 | 0.75 | 0.75 | 0.75 |
| 0.2 | 0.3 | 0.50 | 0.25 | 0.35 |
| 0.35 | 0.35 | 0.125 | 0.125 | 0.125 (below min) |

#### TENSION (One Dark, One Bright)

```python
def is_tension(brightness_a, brightness_b):
    """Large brightness gap in same domain creates friction."""
    gap = abs(brightness_a - brightness_b)
    return gap >= TENSION_GAP_THRESHOLD

def calculate_tension_strength(brightness_a, brightness_b):
    """
    Strength increases with brightness gap.
    Maximum when one is very bright, other very dim.
    """
    gap = abs(brightness_a - brightness_b)

    # Normalize gap beyond threshold
    excess_gap = gap - TENSION_GAP_THRESHOLD
    max_excess = (1.0 - MIN_BRIGHTNESS) - TENSION_GAP_THRESHOLD

    # Linear scale from threshold to max
    normalized_gap = excess_gap / max_excess

    # Apply tension multiplier (tensions feel stronger than resonances)
    strength = TENSION_BASE_STRENGTH + normalized_gap * TENSION_RANGE

    return clamp(strength, MIN_INTERACTION_STRENGTH, 1.0)
```

**Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| TENSION_GAP_THRESHOLD | 0.4 | Minimum gap to qualify |
| TENSION_BASE_STRENGTH | 0.4 | Minimum tension strength when detected |
| TENSION_RANGE | 0.5 | Range above base (max = 0.9) |

**Example calculations:**

| B_A | B_B | Gap | Excess | Strength |
|-----|-----|-----|--------|----------|
| 0.9 | 0.4 | 0.5 | 0.1 | 0.49 |
| 0.9 | 0.1 | 0.8 | 0.4 | 0.82 |
| 0.6 | 0.2 | 0.4 | 0.0 | 0.40 |

#### GROWTH_EDGE (Mentorship Opportunity)

```python
def is_growth_edge(brightness_a, brightness_b):
    """
    One user strong, other developing (not struggling).
    The dim star must be in growing zone, not dark.
    """
    if brightness_a >= GROWTH_MENTOR_THRESHOLD:
        return GROWTH_MENTEE_MIN <= brightness_b <= GROWTH_MENTEE_MAX
    if brightness_b >= GROWTH_MENTOR_THRESHOLD:
        return GROWTH_MENTEE_MIN <= brightness_a <= GROWTH_MENTEE_MAX
    return False

def calculate_growth_edge_strength(brightness_a, brightness_b):
    """
    Strength based on mentor's brightness and mentee's readiness.
    Optimal when mentor is very bright and mentee is mid-range.
    """
    # Identify mentor and mentee
    if brightness_a >= brightness_b:
        mentor_b, mentee_b = brightness_a, brightness_b
    else:
        mentor_b, mentee_b = brightness_b, brightness_a

    # Mentor contribution (how bright they are above threshold)
    mentor_factor = (mentor_b - GROWTH_MENTOR_THRESHOLD) / (1.0 - GROWTH_MENTOR_THRESHOLD)

    # Mentee readiness (peak at middle of mentee range)
    mentee_midpoint = (GROWTH_MENTEE_MIN + GROWTH_MENTEE_MAX) / 2
    mentee_range = GROWTH_MENTEE_MAX - GROWTH_MENTEE_MIN
    distance_from_optimal = abs(mentee_b - mentee_midpoint)
    mentee_factor = 1 - (distance_from_optimal / (mentee_range / 2))

    # Combined strength
    strength = GROWTH_BASE_STRENGTH + (mentor_factor * mentee_factor) * GROWTH_RANGE

    return clamp(strength, MIN_INTERACTION_STRENGTH, 1.0)
```

**Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| GROWTH_MENTOR_THRESHOLD | 0.6 | Must be this bright to mentor |
| GROWTH_MENTEE_MIN | 0.3 | Must be at least this (not struggling) |
| GROWTH_MENTEE_MAX | 0.55 | Must be below this (room to grow) |
| GROWTH_BASE_STRENGTH | 0.35 | Minimum when detected |
| GROWTH_RANGE | 0.45 | Range above base |

**Example calculations:**

| Mentor_B | Mentee_B | mentor_f | mentee_f | Strength |
|----------|----------|----------|----------|----------|
| 0.8 | 0.4 | 0.5 | 0.8 | 0.53 |
| 0.9 | 0.425 | 0.75 | 1.0 | 0.69 |
| 0.65 | 0.5 | 0.125 | 0.4 | 0.37 |

#### RESONANCE (Both Strong)

```python
def is_resonance(brightness_a, brightness_b):
    """Both users strong in same domain."""
    return brightness_a >= RESONANCE_THRESHOLD and brightness_b >= RESONANCE_THRESHOLD

def calculate_resonance_strength(brightness_a, brightness_b):
    """
    Strength increases with combined brightness.
    Both very bright = strong resonance.
    """
    # How far each is above threshold (normalized)
    excess_a = (brightness_a - RESONANCE_THRESHOLD) / (1.0 - RESONANCE_THRESHOLD)
    excess_b = (brightness_b - RESONANCE_THRESHOLD) / (1.0 - RESONANCE_THRESHOLD)

    # Geometric mean rewards symmetry
    base_strength = sqrt(excess_a * excess_b)

    # Scale to resonance range
    strength = RESONANCE_BASE_STRENGTH + base_strength * RESONANCE_RANGE

    return clamp(strength, MIN_INTERACTION_STRENGTH, 1.0)
```

**Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| RESONANCE_THRESHOLD | 0.6 | Both must be above this |
| RESONANCE_BASE_STRENGTH | 0.35 | Minimum when detected |
| RESONANCE_RANGE | 0.55 | Range above base (max = 0.9) |

**Example calculations:**

| B_A | B_B | excess_A | excess_B | Strength |
|-----|-----|----------|----------|----------|
| 0.8 | 0.8 | 0.5 | 0.5 | 0.63 |
| 0.9 | 0.9 | 0.75 | 0.75 | 0.76 |
| 0.7 | 0.65 | 0.25 | 0.125 | 0.45 |

### 2.4 Detection Priority Summary

```
PRIORITY ORDER (highest to lowest):
1. SHADOW_MIRROR - Both <= 0.4 (shared wound, clinically significant)
2. TENSION       - Gap >= 0.4 (active friction, high impact)
3. GROWTH_EDGE   - One >= 0.6, other in [0.3, 0.55] (asymmetric potential)
4. RESONANCE     - Both >= 0.6 (mutual strength)
5. (none)        - Gap < 0.4, both in middle zone
```

**Why this order?**
- Shadow mirrors are rare and significant - don't miss them
- Tension overrides growth_edge because friction dominates experience
- Growth_edge overrides resonance to highlight asymmetric dynamics
- Resonance is the "default good" when both are strong

---

## 3. Interaction Line Strength

### 3.1 Master Strength Formula

```python
def calculate_final_strength(star_a, star_b, interaction_type, privacy_a, privacy_b):
    """
    Final strength considers:
    1. Type-specific base strength (calculated above)
    2. Brightness of both stars (brighter = stronger signal)
    3. Privacy blur (uncertainty reduces confidence)
    """
    brightness_a = get_effective_brightness(star_a, privacy_a)
    brightness_b = get_effective_brightness(star_b, privacy_b)

    # Get type-specific strength
    base_strength = TYPE_STRENGTH_FUNCTIONS[interaction_type](brightness_a, brightness_b)

    # Brightness amplifier (both stars contribute)
    brightness_factor = calculate_brightness_factor(brightness_a, brightness_b)

    # Privacy uncertainty (blur reduces confidence)
    certainty = calculate_certainty(star_a, star_b, privacy_a, privacy_b)

    # Final formula
    final_strength = base_strength * brightness_factor * certainty

    return clamp(final_strength, 0.0, 1.0)
```

### 3.2 Brightness Factor

```python
def calculate_brightness_factor(brightness_a, brightness_b):
    """
    Brighter stars create stronger signals.
    Harmonic mean prevents one very bright star from dominating.
    """
    if brightness_a <= 0 or brightness_b <= 0:
        return 0

    harmonic_mean = 2 / (1/brightness_a + 1/brightness_b)

    # Scale to factor range [0.7, 1.0]
    factor = BRIGHTNESS_FACTOR_MIN + harmonic_mean * BRIGHTNESS_FACTOR_RANGE

    return factor
```

**Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| BRIGHTNESS_FACTOR_MIN | 0.7 | Minimum multiplier (very dim stars) |
| BRIGHTNESS_FACTOR_RANGE | 0.3 | Range above min (max = 1.0) |

**Why harmonic mean?**
- Prevents one bright star from overwhelming a dim one
- Both stars must contribute for high factor
- 0.9 + 0.1 = harmonic mean 0.18, not arithmetic 0.5

---

## 4. Profile Scoring

### 4.1 Interaction Aggregation

```python
def compute_profile(interactions):
    """
    Aggregate individual interactions into profile dimensions.
    """
    # Group by type
    by_type = defaultdict(list)
    for interaction in interactions:
        by_type[interaction.type].append(interaction)

    # Calculate weighted counts (strength-weighted)
    weighted_counts = {}
    total_weight = 0

    for itype, items in by_type.items():
        weight = sum(i.strength for i in items)
        weighted_counts[itype] = weight
        total_weight += weight

    # Calculate percentages
    if total_weight > 0:
        percentages = {k: v / total_weight for k, v in weighted_counts.items()}
    else:
        percentages = {k: 0 for k in InteractionType}

    return ProfileScores(
        resonances=percentages.get(RESONANCE, 0),
        tensions=percentages.get(TENSION, 0),
        growth_edges=percentages.get(GROWTH_EDGE, 0),
        shadow_mirrors=percentages.get(SHADOW_MIRROR, 0),
        raw_counts=weighted_counts,
        total_weight=total_weight
    )
```

### 4.2 Complement Score (Cross-Domain)

```python
def calculate_complement_score(user_a, user_b, privacy_a, privacy_b):
    """
    Complement measures how users balance each other across domains.
    High complement = different strengths cover different areas.
    """
    # Get domain-level brightness averages
    domains_a = get_domain_strengths(user_a, privacy_a)
    domains_b = get_domain_strengths(user_b, privacy_b)

    all_domains = set(domains_a.keys()) | set(domains_b.keys())

    complement_pairs = 0
    coverage_pairs = 0

    for domain in all_domains:
        strength_a = domains_a.get(domain, 0)
        strength_b = domains_b.get(domain, 0)

        # Complement: one strong, other weak, in DIFFERENT domains
        # Coverage: at least one is strong

        if strength_a >= COMPLEMENT_STRONG_THRESHOLD:
            coverage_pairs += 1
            if strength_b < COMPLEMENT_WEAK_THRESHOLD:
                complement_pairs += 1
        elif strength_b >= COMPLEMENT_STRONG_THRESHOLD:
            coverage_pairs += 1
            if strength_a < COMPLEMENT_WEAK_THRESHOLD:
                complement_pairs += 1

    if coverage_pairs == 0:
        return 0.0

    # Raw complement ratio
    raw_score = complement_pairs / len(all_domains)

    # Coverage bonus (complementarity is more meaningful with more coverage)
    coverage_ratio = coverage_pairs / len(all_domains)
    coverage_bonus = 1 + COMPLEMENT_COVERAGE_BONUS * coverage_ratio

    final_score = raw_score * coverage_bonus

    return clamp(final_score, 0.0, 1.0)

def get_domain_strengths(user, privacy):
    """Average brightness per domain for visible stars."""
    visible = get_visible_stars(user, privacy)

    by_domain = defaultdict(list)
    for star in visible:
        by_domain[star.domain].append(star.brightness)

    return {domain: mean(brightnesses) for domain, brightnesses in by_domain.items()}
```

**Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| COMPLEMENT_STRONG_THRESHOLD | 0.65 | Considered "strong" in domain |
| COMPLEMENT_WEAK_THRESHOLD | 0.35 | Considered "weak" in domain |
| COMPLEMENT_COVERAGE_BONUS | 0.3 | Bonus for more domain coverage |

### 4.3 Dynamic Type Determination

```python
def determine_dynamic_type(profile_scores, complement_score):
    """
    Determine overall relationship dynamic from profile scores.
    Priority-based when multiple thresholds met.
    """
    # Extract percentages
    shadow = profile_scores.shadow_mirrors
    tension = profile_scores.tensions
    growth = profile_scores.growth_edges
    resonance = profile_scores.resonances

    # Priority 1: MIRRORING (shared wounds dominate)
    if shadow >= DYNAMIC_THRESHOLD_MIRRORING:
        return DynamicType.MIRRORING

    # Priority 2: CHALLENGING (friction dominates)
    if tension >= DYNAMIC_THRESHOLD_CHALLENGING:
        return DynamicType.CHALLENGING

    # Priority 3: GROWTH (asymmetric potential)
    if growth >= DYNAMIC_THRESHOLD_GROWTH:
        return DynamicType.GROWTH

    # Priority 4: AMPLIFYING (mutual strength)
    if resonance >= DYNAMIC_THRESHOLD_AMPLIFYING:
        return DynamicType.AMPLIFYING

    # Priority 5: BALANCING (complementary)
    if complement_score >= DYNAMIC_THRESHOLD_BALANCING:
        return DynamicType.BALANCING

    # Priority 6: COMPLEX (no dominant pattern)
    return DynamicType.COMPLEX

def calculate_confidence(profile_scores, dynamic_type, complement_score):
    """
    How clearly does one type dominate?
    High confidence = clear pattern; low = mixed signals.
    """
    # Get the score for the determined type
    type_scores = {
        DynamicType.MIRRORING: profile_scores.shadow_mirrors,
        DynamicType.CHALLENGING: profile_scores.tensions,
        DynamicType.GROWTH: profile_scores.growth_edges,
        DynamicType.AMPLIFYING: profile_scores.resonances,
        DynamicType.BALANCING: complement_score,
        DynamicType.COMPLEX: 0
    }

    primary_score = type_scores[dynamic_type]

    # Calculate runner-up
    other_scores = [s for t, s in type_scores.items() if t != dynamic_type and t != DynamicType.COMPLEX]
    runner_up = max(other_scores) if other_scores else 0

    # Confidence = how far ahead is primary?
    gap = primary_score - runner_up

    # Normalize to confidence range
    confidence = CONFIDENCE_BASE + gap * CONFIDENCE_SCALE

    return clamp(confidence, 0.3, 1.0)
```

**Dynamic Type Thresholds:**

| Type | Threshold | Rationale |
|------|-----------|-----------|
| MIRRORING | 0.30 | Lower - shadow mirrors are rare and significant |
| CHALLENGING | 0.40 | Higher - tensions need to dominate to define dynamic |
| GROWTH | 0.40 | Higher - growth edges need sustained presence |
| AMPLIFYING | 0.50 | Higher - resonances should be majority |
| BALANCING | 0.60 | Complement score threshold |

**Confidence Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| CONFIDENCE_BASE | 0.5 | Minimum confidence when type detected |
| CONFIDENCE_SCALE | 1.0 | Scale factor for gap → confidence |

---

## 5. Privacy Blurring Math

### 5.1 Effective Brightness with Blur

```python
def get_effective_brightness(star, privacy_settings):
    """
    When privacy is blurred, return range estimate instead of exact value.
    """
    if star.id in privacy_settings.hidden_stars:
        return None  # Star completely hidden

    if privacy_settings.blur_brightness:
        return get_blurred_brightness(star)

    return star.brightness

def get_blurred_brightness(star):
    """
    Convert exact brightness to state-based range.
    Returns midpoint of state range.
    """
    state = star.state

    return BLURRED_VALUES[state]
```

**Blurred Values:**

| State | True Range | Blurred Value | Uncertainty |
|-------|------------|---------------|-------------|
| BRIGHT | 0.7-1.0 | 0.85 | +/- 0.15 |
| STEADY | 0.5-0.7 | 0.60 | +/- 0.10 |
| FLICKERING | 0.3-0.5 | 0.40 | +/- 0.10 |
| DIM | 0.15-0.3 | 0.225 | +/- 0.075 |
| DARK | 0.05-0.15 | 0.10 | +/- 0.05 |

### 5.2 Uncertainty Propagation

```python
def calculate_certainty(star_a, star_b, privacy_a, privacy_b):
    """
    Uncertainty from blurring reduces interaction strength confidence.
    """
    certainty_a = 1.0 if not privacy_a.blur_brightness else BLUR_CERTAINTY
    certainty_b = 1.0 if not privacy_b.blur_brightness else BLUR_CERTAINTY

    # Combined certainty (both must be certain for full confidence)
    combined = certainty_a * certainty_b

    # Ensure minimum certainty (interactions still meaningful when blurred)
    return max(combined, MIN_CERTAINTY)
```

**Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| BLUR_CERTAINTY | 0.75 | Certainty when one star is blurred |
| MIN_CERTAINTY | 0.5 | Minimum certainty (both blurred) |

**Effect on strength:**

| A Blurred | B Blurred | Certainty | Strength Multiplier |
|-----------|-----------|-----------|---------------------|
| No | No | 1.0 | 100% |
| Yes | No | 0.75 | 75% |
| No | Yes | 0.75 | 75% |
| Yes | Yes | 0.5625 | ~56% (floored to 50%) |

### 5.3 Interaction Type with Blur

```python
def detect_interaction_type_blurred(star_a, star_b, privacy_a, privacy_b):
    """
    With blurring, type detection uses range overlap logic.
    """
    bright_a = get_effective_brightness(star_a, privacy_a)
    bright_b = get_effective_brightness(star_b, privacy_b)

    # Get uncertainty ranges
    range_a = get_brightness_range(star_a, privacy_a)  # (min, max)
    range_b = get_brightness_range(star_b, privacy_b)

    # Check if types are POSSIBLE given ranges
    possible_types = []

    # Shadow mirror possible if both ranges include values <= 0.4
    if range_a[0] <= SHADOW_THRESHOLD and range_b[0] <= SHADOW_THRESHOLD:
        possible_types.append(SHADOW_MIRROR)

    # Tension possible if ranges could have gap >= 0.4
    max_gap = max(range_a[1], range_b[1]) - min(range_a[0], range_b[0])
    if max_gap >= TENSION_GAP_THRESHOLD:
        possible_types.append(TENSION)

    # Continue for other types...

    # Use midpoint values for actual classification
    return detect_interaction_type(star_a, star_b, privacy_a, privacy_b)
```

---

## 6. Group Aggregation (N>2)

### 6.1 Pairwise Decomposition

```python
def compute_group_profile(users, privacy_settings):
    """
    For N users, compute all pairwise profiles and aggregate.
    """
    n = len(users)
    if n < 2:
        raise ValueError("Need at least 2 users for group profile")

    # Compute all pairs
    pairwise_profiles = []
    for i in range(n):
        for j in range(i + 1, n):
            user_a, user_b = users[i], users[j]
            privacy_a, privacy_b = privacy_settings[user_a.id], privacy_settings[user_b.id]

            interactions = detect_interactions_for_pair(user_a, user_b, privacy_a, privacy_b)
            profile = compute_profile(interactions)
            complement = calculate_complement_score(user_a, user_b, privacy_a, privacy_b)

            pairwise_profiles.append(PairProfile(
                users=(user_a.id, user_b.id),
                profile=profile,
                complement=complement
            ))

    # Aggregate
    return aggregate_pairwise_profiles(pairwise_profiles, n)
```

### 6.2 Profile Aggregation Formula

```python
def aggregate_pairwise_profiles(pairwise_profiles, n):
    """
    Combine pairwise profiles into group profile.
    Weighted by interaction count (pairs with more interactions have more influence).
    """
    total_pairs = len(pairwise_profiles)  # n*(n-1)/2

    # Weighted average of each dimension
    aggregated = defaultdict(float)
    total_weight = 0

    for pair_profile in pairwise_profiles:
        weight = pair_profile.profile.total_weight
        total_weight += weight

        for dimension in ['resonances', 'tensions', 'growth_edges', 'shadow_mirrors']:
            value = getattr(pair_profile.profile, dimension)
            aggregated[dimension] += value * weight

    if total_weight > 0:
        for dimension in aggregated:
            aggregated[dimension] /= total_weight

    # Complement is averaged (not weighted by interactions)
    avg_complement = mean([p.complement for p in pairwise_profiles])

    # Special group patterns
    group_patterns = detect_group_patterns(pairwise_profiles, n)

    return GroupProfile(
        scores=aggregated,
        complement=avg_complement,
        pair_count=total_pairs,
        patterns=group_patterns,
        dynamic_type=determine_group_dynamic_type(aggregated, avg_complement, group_patterns)
    )
```

### 6.3 Group-Specific Patterns

```python
def detect_group_patterns(pairwise_profiles, n):
    """
    Detect patterns unique to groups (not present in pairs).
    """
    patterns = []

    # Build pair-type matrix
    by_pair = {(p.users[0], p.users[1]): p for p in pairwise_profiles}

    # Pattern: TRIANGULAR_TENSION
    # A-B tension, B-C tension, A-C resonance (or other triangular dynamics)
    if n >= 3:
        for triple in itertools.combinations(range(n), 3):
            a, b, c = triple

            ab = get_dominant_type(by_pair.get((a, b)) or by_pair.get((b, a)))
            bc = get_dominant_type(by_pair.get((b, c)) or by_pair.get((c, b)))
            ac = get_dominant_type(by_pair.get((a, c)) or by_pair.get((c, a)))

            if ab == TENSION and bc == TENSION and ac == RESONANCE:
                patterns.append(GroupPattern.TRIANGULAR_TENSION)

    # Pattern: COLLECTIVE_BLIND_SPOT
    # All members dark in same domain
    domain_darkness = analyze_domain_darkness(pairwise_profiles)
    for domain, darkness_ratio in domain_darkness.items():
        if darkness_ratio >= COLLECTIVE_BLIND_SPOT_THRESHOLD:
            patterns.append(GroupPattern.COLLECTIVE_BLIND_SPOT)
            break

    # Pattern: SHARED_STRENGTH
    # All members bright in same domain
    domain_brightness = analyze_domain_brightness(pairwise_profiles)
    for domain, brightness_ratio in domain_brightness.items():
        if brightness_ratio >= SHARED_STRENGTH_THRESHOLD:
            patterns.append(GroupPattern.SHARED_STRENGTH)
            break

    return patterns
```

**Group Pattern Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| COLLECTIVE_BLIND_SPOT_THRESHOLD | 0.8 | 80% of members dark in domain |
| SHARED_STRENGTH_THRESHOLD | 0.8 | 80% of members bright in domain |

### 6.4 Group Dynamic Type

```python
def determine_group_dynamic_type(aggregated_scores, complement_score, patterns):
    """
    Group dynamics can differ from pairwise due to emergent patterns.
    """
    # Check for pattern-based overrides
    if GroupPattern.COLLECTIVE_BLIND_SPOT in patterns:
        return GroupDynamicType.VULNERABLE  # Group has shared weakness

    if GroupPattern.SHARED_STRENGTH in patterns:
        return GroupDynamicType.SYNERGISTIC  # Group amplifies each other

    if GroupPattern.TRIANGULAR_TENSION in patterns:
        return GroupDynamicType.TRIANGULATED  # Complex dynamics

    # Fall back to standard type determination
    base_type = determine_dynamic_type(
        ProfileScores(**aggregated_scores),
        complement_score
    )

    # Map individual types to group types
    return GROUP_TYPE_MAP.get(base_type, GroupDynamicType.COMPLEX)
```

---

## 7. Constants Table (Complete Reference)

### Interaction Detection

| Constant | Value | Category | Description |
|----------|-------|----------|-------------|
| MIN_INTERACTION_PROXIMITY | 0.5 | Detection | Must share domain |
| MIN_INTERACTION_STRENGTH | 0.2 | Detection | Below this, not recorded |
| SHADOW_THRESHOLD | 0.4 | Shadow Mirror | Both below this |
| TENSION_GAP_THRESHOLD | 0.4 | Tension | Minimum brightness gap |
| TENSION_BASE_STRENGTH | 0.4 | Tension | Minimum strength |
| TENSION_RANGE | 0.5 | Tension | Strength range |
| GROWTH_MENTOR_THRESHOLD | 0.6 | Growth Edge | Mentor minimum |
| GROWTH_MENTEE_MIN | 0.3 | Growth Edge | Mentee minimum (not struggling) |
| GROWTH_MENTEE_MAX | 0.55 | Growth Edge | Mentee maximum (room to grow) |
| GROWTH_BASE_STRENGTH | 0.35 | Growth Edge | Minimum strength |
| GROWTH_RANGE | 0.45 | Growth Edge | Strength range |
| RESONANCE_THRESHOLD | 0.6 | Resonance | Both above this |
| RESONANCE_BASE_STRENGTH | 0.35 | Resonance | Minimum strength |
| RESONANCE_RANGE | 0.55 | Resonance | Strength range |

### Strength Calculation

| Constant | Value | Category | Description |
|----------|-------|----------|-------------|
| BRIGHTNESS_FACTOR_MIN | 0.7 | Brightness | Minimum multiplier |
| BRIGHTNESS_FACTOR_RANGE | 0.3 | Brightness | Range to 1.0 |

### Profile Scoring

| Constant | Value | Category | Description |
|----------|-------|----------|-------------|
| DYNAMIC_THRESHOLD_MIRRORING | 0.30 | Dynamic Type | Shadow mirror % |
| DYNAMIC_THRESHOLD_CHALLENGING | 0.40 | Dynamic Type | Tension % |
| DYNAMIC_THRESHOLD_GROWTH | 0.40 | Dynamic Type | Growth edge % |
| DYNAMIC_THRESHOLD_AMPLIFYING | 0.50 | Dynamic Type | Resonance % |
| DYNAMIC_THRESHOLD_BALANCING | 0.60 | Dynamic Type | Complement score |
| COMPLEMENT_STRONG_THRESHOLD | 0.65 | Complement | "Strong" in domain |
| COMPLEMENT_WEAK_THRESHOLD | 0.35 | Complement | "Weak" in domain |
| COMPLEMENT_COVERAGE_BONUS | 0.3 | Complement | Coverage multiplier |
| CONFIDENCE_BASE | 0.5 | Confidence | Minimum confidence |
| CONFIDENCE_SCALE | 1.0 | Confidence | Gap multiplier |

### Privacy

| Constant | Value | Category | Description |
|----------|-------|----------|-------------|
| BLUR_CERTAINTY | 0.75 | Privacy | Certainty when blurred |
| MIN_CERTAINTY | 0.5 | Privacy | Floor when both blurred |
| BLURRED_VALUE_BRIGHT | 0.85 | Privacy | Midpoint for BRIGHT |
| BLURRED_VALUE_STEADY | 0.60 | Privacy | Midpoint for STEADY |
| BLURRED_VALUE_FLICKERING | 0.40 | Privacy | Midpoint for FLICKERING |
| BLURRED_VALUE_DIM | 0.225 | Privacy | Midpoint for DIM |
| BLURRED_VALUE_DARK | 0.10 | Privacy | Midpoint for DARK |

### Group Dynamics

| Constant | Value | Category | Description |
|----------|-------|----------|-------------|
| COLLECTIVE_BLIND_SPOT_THRESHOLD | 0.8 | Group | 80% dark in domain |
| SHARED_STRENGTH_THRESHOLD | 0.8 | Group | 80% bright in domain |

---

## 8. Example Scenarios

### Scenario A: Classic Resonance

```
User A: Health star at 0.85 (BRIGHT)
User B: Health star at 0.75 (STEADY)

Detection:
  Both >= 0.6? Yes → RESONANCE candidate
  Shadow? No (both > 0.4)
  Tension? No (gap = 0.10 < 0.4)
  Growth? No (both above mentee range)

Strength:
  excess_a = (0.85 - 0.6) / 0.4 = 0.625
  excess_b = (0.75 - 0.6) / 0.4 = 0.375
  base_strength = sqrt(0.625 * 0.375) = 0.484
  scaled = 0.35 + 0.484 * 0.55 = 0.616

  brightness_factor = harmonic(0.85, 0.75) = 0.797
  scaled factor = 0.7 + 0.797 * 0.3 = 0.939

  final = 0.616 * 0.939 = 0.58

Result: RESONANCE with strength 0.58
```

### Scenario B: Shadow Mirror

```
User A: Purpose star at 0.15 (DIM)
User B: Purpose star at 0.20 (DIM)

Detection:
  Both <= 0.4? Yes → SHADOW_MIRROR (priority 1)

Strength:
  darkness_a = (0.4 - 0.15) / 0.4 = 0.625
  darkness_b = (0.4 - 0.20) / 0.4 = 0.5
  base_strength = sqrt(0.625 * 0.5) = 0.559

  brightness_factor = 0.7 + harmonic(0.15, 0.2) * 0.3 = 0.752

  final = 0.559 * 0.752 = 0.42

Result: SHADOW_MIRROR with strength 0.42
```

### Scenario C: Growth Edge with Blur

```
User A: Career star at 0.82 (BRIGHT), privacy: visible
User B: Career star at 0.45 (FLICKERING), privacy: blur_brightness=true

Effective values:
  brightness_a = 0.82 (exact)
  brightness_b = 0.40 (FLICKERING midpoint)

Detection:
  Mentor threshold: 0.82 >= 0.6 ✓
  Mentee range: 0.40 in [0.3, 0.55] ✓
  → GROWTH_EDGE

Strength:
  mentor_factor = (0.82 - 0.6) / 0.4 = 0.55
  mentee_midpoint = 0.425
  distance_from_optimal = |0.40 - 0.425| = 0.025
  mentee_factor = 1 - (0.025 / 0.125) = 0.8

  base_strength = 0.35 + (0.55 * 0.8) * 0.45 = 0.548

  certainty = 1.0 * 0.75 = 0.75 (B is blurred)
  brightness_factor = 0.7 + harmonic(0.82, 0.40) * 0.3 = 0.86

  final = 0.548 * 0.86 * 0.75 = 0.35

Result: GROWTH_EDGE with strength 0.35 (reduced by blur uncertainty)
```

### Scenario D: Profile Computation

```
Interactions detected:
  - RESONANCE (Health): strength 0.58
  - RESONANCE (Purpose): strength 0.62
  - TENSION (Wealth): strength 0.71
  - GROWTH_EDGE (Relationships): strength 0.44

Weighted counts:
  resonances: 0.58 + 0.62 = 1.20
  tensions: 0.71
  growth_edges: 0.44
  shadow_mirrors: 0

  total_weight: 2.35

Percentages:
  resonances: 1.20 / 2.35 = 0.51 (51%)
  tensions: 0.71 / 2.35 = 0.30 (30%)
  growth_edges: 0.44 / 2.35 = 0.19 (19%)

Dynamic type determination:
  MIRRORING? 0 < 0.30 → No
  CHALLENGING? 0.30 < 0.40 → No
  GROWTH? 0.19 < 0.40 → No
  AMPLIFYING? 0.51 >= 0.50 → YES

Result: AMPLIFYING dynamic type
Confidence: 0.5 + (0.51 - 0.30) * 1.0 = 0.71
```

---

## 9. Open Questions for NERVES

- [ ] Why 0.4 for shadow threshold? (vs 0.3 or 0.5)
- [ ] Why geometric mean for shadow/resonance? (vs arithmetic)
- [ ] Why harmonic mean for brightness factor? (vs min or average)
- [ ] Research on group dynamics threshold (0.8 for collective patterns)
- [ ] Why these dynamic type thresholds? (psychological basis)
- [ ] Blur uncertainty of 0.75 - what's the research basis?
- [ ] Adjacent domain interactions - worth implementing?

---

## 10. Implementation Notes

### Performance Considerations

```
Time complexity:
- Pairwise detection: O(S_a * S_b) where S = visible stars
- Profile aggregation: O(I) where I = interactions
- Group of N: O(N^2 * S^2) worst case

Typical user:
- 10-20 stars per user
- 5-10 shared domain stars
- 10-40 interactions per pair
- Computation: <100ms for pair, <500ms for group of 5
```

### Recommended Approach

1. Pre-filter stars by domain before pairwise comparison
2. Cache domain-level brightness averages
3. Invalidate on star state change, not brightness change (reduces churn)
4. For groups, compute pairwise in parallel

### Common Mistakes

| Mistake | Why It Fails | Fix |
|---------|--------------|-----|
| Not checking priority order | Double-counting interactions | Always check in priority order |
| Using arithmetic mean for brightness | Lets one star dominate | Use harmonic mean |
| Ignoring uncertainty from blur | Overconfident results | Apply certainty multiplier |
| Computing complement on hidden domains | Leaks privacy | Only use visible stars |

---

## 11. Dependencies

**Imports from:**
- constellation-states (star states, brightness thresholds)
- brightness-decay (brightness values, state definitions)
- connection-formation (connection types for internal reference)

**Exports to:**
- TARS narrative (profile data for story generation)
- UI visualization (interaction lines, strength for rendering)

---

*BLOOD complete. All formulas defined. Proceed to NERVES for research justification of thresholds and weights.*
