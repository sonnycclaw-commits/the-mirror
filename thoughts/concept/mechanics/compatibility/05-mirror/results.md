# Compatibility System - MIRROR Results

**System:** compatibility
**Lens:** MIRROR (5/7)
**Created:** 2025-01-15
**Status:** Complete
**Depends on:** 02-blood.md, 04-skin.md

---

## Overview

This document presents the results of simulating the Compatibility system formulas from 02-blood.md against the edge cases identified in 04-skin.md.

---

## 1. Test Pair Scenarios

### 1.1 Resonant Pair (Both High Achievers)

**Input:**
- User A: All stars 0.75-0.90 brightness
- User B: All stars 0.70-0.88 brightness
- 5 shared domains

**Results:**
| Metric | Value | Expected | Status |
|--------|-------|----------|--------|
| Dynamic Type | AMPLIFYING | AMPLIFYING | OK |
| Confidence | 1.00 | High | OK |
| Interactions | 5 | 5 | OK |
| Resonances | 100% | >50% | OK |

**Analysis:** The algorithm correctly identifies mutual strength as AMPLIFYING. All 5 domain pairs produced RESONANCE interactions with strengths 0.48-0.70. The confidence is maximized because resonances dominate completely.

---

### 1.2 Challenging Pair (Opposite Patterns)

**Input:**
- User A: Health=0.90, Wealth=0.15, Purpose=0.85, Relationships=0.20, Soul=0.80
- User B: Health=0.18, Wealth=0.85, Purpose=0.22, Relationships=0.88, Soul=0.25
- Deliberate inversions in each domain

**Results:**
| Metric | Value | Expected | Status |
|--------|-------|----------|--------|
| Dynamic Type | CHALLENGING | CHALLENGING | OK |
| Confidence | 0.50 | Moderate | OK |
| Interactions | 5 | 5 | OK |
| Tensions | 100% | >40% | OK |
| Complement Score | 1.00 | High | OK |

**Analysis:** All 5 domain pairs produced TENSION interactions (gaps 0.55-0.72, all > 0.4 threshold). The complement score is maximized because every domain has one strong/one weak user - they perfectly balance each other. Confidence is moderate because complement score (1.0) competes with tension percentage for dominance.

**Insight:** High complement + high tension is an interesting dynamic - these users challenge each other but could also balance well.

---

### 1.3 Growth Pair (Mentor/Mentee)

**Input:**
- Mentor: All stars 0.75-0.90 brightness
- Mentee: All stars 0.38-0.50 brightness (in mentee range)

**Results:**
| Metric | Value | Expected | Status |
|--------|-------|----------|--------|
| Dynamic Type | CHALLENGING | GROWTH | MISMATCH |
| Confidence | 1.00 | - | - |
| Interactions | 5 | 5 | OK |
| Tensions | 80.8% | Low | ISSUE |
| Growth Edges | 19.2% | >40% | ISSUE |

**Analysis:** Only 1 of 5 interactions was GROWTH_EDGE (Relationships domain). The other 4 were classified as TENSION because the brightness gap exceeded 0.4 (e.g., 0.88 - 0.42 = 0.46).

**Root Cause:** TENSION has higher priority than GROWTH_EDGE in the detection pipeline. When the gap is >= 0.4, TENSION fires first, even if the mentee is in the valid GROWTH_EDGE range [0.3, 0.55].

**Recommendation:** Adjust the logic so GROWTH_EDGE is checked before TENSION, OR add a condition to TENSION that excludes cases where one star is in the mentee range. See Tuning Recommendations below.

---

### 1.4 Shadow Pair (Both Struggling)

**Input:**
- Both users: All stars 0.12-0.25 brightness (below 0.4 threshold)

**Results:**
| Metric | Value | Expected | Status |
|--------|-------|----------|--------|
| Dynamic Type | MIRRORING | MIRRORING | OK |
| Confidence | 1.00 | High | OK |
| Interactions | 5 | 5 | OK |
| Shadow Mirrors | 100% | >30% | OK |

**Analysis:** All 5 domain pairs correctly identified as SHADOW_MIRROR. The strength formula (geometric mean of darkness) produced values 0.32-0.49 final strength. The algorithm correctly prioritizes shadow mirrors as highest priority.

**Clinical Note:** This profile should trigger the clinical flags mentioned in SKIN 3.4 (CLINICAL_SHADOW_THRESHOLD = 0.70). At 100% shadow mirrors, support resources should be suggested.

---

### 1.5 Complementary Pair (Non-overlapping Domains)

**Input:**
- User A: Stars in Health, Purpose, Soul
- User B: Stars in Wealth, Relationships, Career
- Zero domain overlap

**Results:**
| Metric | Value | Expected | Status |
|--------|-------|----------|--------|
| Dynamic Type | BALANCING | BALANCING | OK |
| Confidence | 1.00 | High | OK |
| Interactions | 0 | 0 | OK |
| Complement Score | 1.00 | High | OK |

**Analysis:** With zero shared domains, no direct interactions are possible. The complement score formula correctly identifies that together they cover 6 domains with no overlap - perfect complementarity. Dynamic type correctly falls through to BALANCING.

**Edge Case Note:** Per SKIN 3.1, this is the "no overlapping domains" case. The complement score of 1.0 might be misleading with only 3 stars per user (per MIN_DOMAINS_FOR_COMPLEMENT recommendation). Consider adding confidence penalty for small star counts.

---

### 1.6 Blurred Pair (Heavy Privacy)

**Input:**
- Both users: All stars 0.70-0.90 brightness
- Both users: blur_brightness = True

**Results:**
| Metric | Value | Expected | Status |
|--------|-------|----------|--------|
| Dynamic Type | AMPLIFYING | AMPLIFYING | OK |
| Confidence | 1.00 | High | OK |
| Interactions | 4 | ~5 | OK |
| Certainty | 0.562 | ~0.56 | OK |
| Final Strength | 0.373 | Reduced | OK |

**Analysis:**
- Blurred brightness uses state midpoints (BRIGHT = 0.85)
- Certainty = 0.75 * 0.75 = 0.5625 (floored to 0.562)
- Final strengths are ~40% lower than unblurred equivalents
- Still correctly identifies AMPLIFYING type

**Privacy Degradation:** The system degrades gracefully. Blurring reduces strength confidence but doesn't break classification. The "heavy blur" scenario still produces meaningful results.

---

### 1.7 Asymmetric Pair (5 vs 20 stars)

**Input:**
- User A: 5 stars (one per domain)
- User B: 20 stars (4 per domain, varying brightness)

**Results:**
| Metric | Value | Expected | Status |
|--------|-------|----------|--------|
| Dynamic Type | GROWTH | COMPLEX | MISMATCH |
| Confidence | 0.38 | Low | OK |
| Interactions | 20 | Many | OK |
| Resonances | 55.9% | - | - |
| Growth Edges | 44.1% | - | - |

**Analysis:** Each of User A's 5 stars interacts with 4 of User B's stars (20 total). The mix of RESONANCE (56%) and GROWTH_EDGE (44%) produces a GROWTH classification rather than COMPLEX.

**Key Finding:** Asymmetric constellation sizes don't produce COMPLEX - they produce mixed profiles. The low confidence (0.38) correctly signals uncertainty. Per SKIN 3.3, a confidence penalty based on size ratio should be applied.

**Recommendation:** Add `calculate_size_confidence()` from SKIN 3.3 to reduce overall profile confidence when star counts are asymmetric.

---

### 1.8 Dead Zone Pair (Both Middle Brightness)

**Input:**
- Both users: All stars 0.45-0.55 brightness

**Results:**
| Metric | Value | Expected | Status |
|--------|-------|----------|--------|
| Dynamic Type | COMPLEX | COMPLEX | OK |
| Confidence | 0.50 | Default | OK |
| Interactions | 0 | 0 | OK |
| Domains Shared | 5 | 5 | OK |

**Analysis:** With all stars in the [0.4, 0.6] "dead zone":
- Not below 0.4 (no SHADOW_MIRROR)
- Gap never >= 0.4 (no TENSION)
- Neither above 0.6 (no RESONANCE)
- Neither meets mentor threshold (no GROWTH_EDGE)

The system correctly produces zero interactions despite 5 shared domains. Dynamic type correctly falls to COMPLEX.

**UX Implication:** This is the "stable middle" case from SKIN 3.2. The UX should explain: "Both constellations are in balanced states. No dramatic patterns emerge."

---

### 1.9 Hidden Stars Pair (Alice hides 2 stars)

**Input:**
- User A: 5 stars, 2 hidden (Relationships, Soul)
- User B: 5 stars, all visible

**Results:**
| Metric | Value | Expected | Status |
|--------|-------|----------|--------|
| Dynamic Type | AMPLIFYING | AMPLIFYING | OK |
| Confidence | 0.98 | High | OK |
| Interactions | 3 | 3 | OK |
| Partial View | True | True | OK |
| Complement Score | 0.52 | Moderate | OK |

**Analysis:** Hidden stars are correctly excluded from interaction detection. Only 3 domain pairs produce interactions. The partial_view metadata correctly flags that the profile is incomplete.

**Privacy Protection:** The system never reveals which specific stars are hidden - only that the view is partial.

---

## 2. Edge Case Test Results

### 2.1 Division by Zero Protection

**Test:** Stars with brightness at MIN_BRIGHTNESS_VALUE (0.05)

**Result:** PASS - No division error occurred

**Implementation:** The `harmonic_mean()` function enforces minimum brightness before computing reciprocals.

---

### 2.2 Maximum Brightness (1.0)

**Test:** Both stars at brightness = 1.0

**Result:** PASS - Interaction strength = 0.90 (correctly clamped)

**Formula verification:**
- excess_a = (1.0 - 0.6) / 0.4 = 1.0
- excess_b = (1.0 - 0.6) / 0.4 = 1.0
- base_strength = 0.35 + sqrt(1.0 * 1.0) * 0.55 = 0.90
- brightness_factor = 0.7 + 1.0 * 0.3 = 1.0
- final_strength = 0.90 * 1.0 = 0.90

---

### 2.3 All Stars Hidden

**Test:** One user hides all their stars

**Result:** PASS - Zero interactions detected

**Behavior:** `get_visible_stars()` returns empty list, no star pairs to compare.

---

### 2.4 Both Blurred Certainty Floor

**Test:** Both users have blur_brightness = True

**Result:** PASS - Certainty = 0.562

**Calculation:**
- certainty_a = 0.75 (BLUR_CERTAINTY)
- certainty_b = 0.75
- combined = 0.75 * 0.75 = 0.5625
- max(0.5625, 0.5) = 0.5625 (above floor)

---

### 2.5 Dead Zone Detection

**Test:** Both users with all stars at 0.50 brightness

**Result:** PASS - Zero interactions, COMPLEX type

**Behavior:** The "dead zone" (brightness in [0.4, 0.6], gaps < 0.4) correctly produces no qualifying interactions.

---

## 3. Results Analysis

### 3.1 Dynamic Type Distribution

| Type | Count | Scenarios |
|------|-------|-----------|
| AMPLIFYING | 3 | Resonant, Blurred, Hidden Stars |
| CHALLENGING | 2 | Opposite Patterns, Growth (incorrect) |
| GROWTH | 1 | Asymmetric (unexpected) |
| MIRRORING | 1 | Shadow |
| BALANCING | 1 | Complementary |
| COMPLEX | 1 | Dead Zone |

### 3.2 Match Rate

**7 out of 9 scenarios matched expectations (78%)**

Mismatches:
1. **Growth Pair** - Classified as CHALLENGING instead of GROWTH
2. **Asymmetric Pair** - Classified as GROWTH instead of COMPLEX

### 3.3 Strength Ranges by Type

| Interaction Type | Base Strength Range | Final Strength Range |
|-----------------|---------------------|---------------------|
| RESONANCE | 0.45 - 0.73 | 0.40 - 0.70 |
| TENSION | 0.44 - 0.69 | 0.37 - 0.55 |
| GROWTH_EDGE | 0.35 - 0.44 | 0.31 - 0.39 |
| SHADOW_MIRROR | 0.41 - 0.66 | 0.32 - 0.49 |

**Observation:** GROWTH_EDGE has the lowest strength range, which may cause it to be overshadowed by other types in mixed profiles.

---

## 4. Tuning Recommendations

### 4.1 CRITICAL: GROWTH_EDGE vs TENSION Priority

**Issue:** TENSION triggers before GROWTH_EDGE when gap >= 0.4, even when one user is clearly in mentee range.

**Current Priority Order:**
1. SHADOW_MIRROR (both <= 0.4)
2. TENSION (gap >= 0.4)
3. GROWTH_EDGE (one >= 0.6, other in [0.3, 0.55])
4. RESONANCE (both >= 0.6)

**Proposed Fix:** Modify TENSION detection to exclude valid GROWTH_EDGE cases:

```python
def is_tension(brightness_a, brightness_b):
    """Large brightness gap creates friction, unless valid mentorship."""
    gap = abs(brightness_a - brightness_b)

    if gap < TENSION_GAP_THRESHOLD:
        return False

    # Exclude valid mentorship dynamics
    if is_growth_edge(brightness_a, brightness_b):
        return False

    return True
```

**Alternative:** Swap priority 2 and 3:
1. SHADOW_MIRROR
2. GROWTH_EDGE  <-- check first
3. TENSION
4. RESONANCE

### 4.2 MODERATE: Growth Edge Strength Boost

**Issue:** GROWTH_EDGE has the lowest strength range (0.35-0.44 base), which may underrepresent its importance.

**Recommendation:** Increase GROWTH_BASE_STRENGTH from 0.35 to 0.40, and GROWTH_RANGE from 0.45 to 0.50.

**New Range:** 0.40 - 0.90 (matches RESONANCE better)

### 4.3 MODERATE: Asymmetric Size Confidence Penalty

**Issue:** Asymmetric star counts (5 vs 20) don't trigger COMPLEX type.

**Recommendation:** Implement `calculate_size_confidence()` from SKIN 3.3:

```python
def calculate_size_confidence(stars_a, stars_b):
    size_a, size_b = len(stars_a), len(stars_b)

    if min(size_a, size_b) < MIN_STARS_FOR_CONFIDENCE:  # 5
        return MIN_SIZE_CONFIDENCE  # 0.4

    ratio = min(size_a, size_b) / max(size_a, size_b)

    if ratio < SIZE_RATIO_PENALTY_THRESHOLD:  # 0.3
        return ratio / SIZE_RATIO_PENALTY_THRESHOLD

    return 1.0
```

For 5 vs 20 stars: ratio = 0.25 < 0.3, penalty = 0.25/0.3 = 0.83

### 4.4 LOW: Complement Score with Small Constellations

**Issue:** Two users with 3 stars each in non-overlapping domains get "perfect complement" (1.0).

**Recommendation:** Add minimum domain requirement from SKIN 3.1:

```python
MIN_DOMAINS_FOR_COMPLEMENT = 3  # Need breadth
MIN_SHARED_FOR_COMPARISON = 1   # At least one shared domain

if len(all_domains) < MIN_DOMAINS_FOR_COMPLEMENT:
    return None  # Insufficient data
```

### 4.5 LOW: TENSION Confidence Reduction

**Issue:** CHALLENGING type has confidence of only 0.50 even with 100% tensions.

**Cause:** The high complement score (1.0) competes with tension (1.0), reducing gap.

**Recommendation:** In CHALLENGING dynamics, don't penalize confidence for high complement - they're complementary signals, not competing.

---

## 5. Surprising Behaviors

### 5.1 High Complement with High Tension

In the "Challenging Pair" scenario, we see:
- Tensions: 100%
- Complement Score: 1.0

This is not contradictory - it means "these users are very different, which creates friction AND makes them balance each other well." The UX should frame this positively: "You challenge each other in ways that could lead to growth."

### 5.2 Blurred Pairs Maintain Classification

Even with both users heavily blurred, the AMPLIFYING classification holds. The reduced certainty (0.56) and strength (~40% reduction) don't prevent correct classification. This suggests the threshold values are robust.

### 5.3 Dead Zone is Strict

The dead zone (0.4-0.6 brightness, gap < 0.4) produces exactly zero interactions. This is intentional but may surprise users who have many stars in this "stable middle" range. UX explanation is essential.

---

## 6. Validation Summary

### Passes (7/9)

1. **Resonant Pair** - Correctly AMPLIFYING
2. **Challenging Pair** - Correctly CHALLENGING
3. **Shadow Pair** - Correctly MIRRORING
4. **Complementary Pair** - Correctly BALANCING
5. **Blurred Pair** - Correctly AMPLIFYING with degraded certainty
6. **Dead Zone Pair** - Correctly COMPLEX with zero interactions
7. **Hidden Stars Pair** - Correctly AMPLIFYING with partial view

### Failures (2/9)

1. **Growth Pair** - TENSION priority overshadows GROWTH_EDGE
2. **Asymmetric Pair** - Mixed profile instead of COMPLEX

### Edge Cases (5/5)

1. **Division by Zero** - PASS
2. **Maximum Brightness** - PASS
3. **All Stars Hidden** - PASS
4. **Both Blurred Certainty** - PASS
5. **Dead Zone Detection** - PASS

---

## 7. Next Steps

1. **Implement GROWTH_EDGE priority fix** - Critical for mentor/mentee scenarios
2. **Add size confidence penalty** - For asymmetric constellations
3. **Verify strength ranges** - After tuning, re-run simulation
4. **Add clinical flag checks** - For high shadow mirror percentages
5. **Document dead zone UX** - Ensure stable middle is explained well

---

*MIRROR complete. Simulation validates core formulas with 78% scenario match rate. Two tuning adjustments needed for GROWTH_EDGE priority and size asymmetry handling.*
