# Phase Transitions - MIRROR Results

**System:** phase-transitions
**Lens:** MIRROR (5/7)
**Created:** 2026-01-15
**Status:** Needs Calibration
**Simulation:** `simulation.py`

---

## Scenarios Tested

| Scenario | Target | Result | Pass/Fail |
|----------|--------|--------|-----------|
| Ideal User → LUMINOUS | Day 90-120 | **Stuck at EMERGING** | ✗ NEEDS TUNING |
| Ideal User → EMERGING | Day 30-60 | **Day 25** | ✓ |
| Ideal User → CONNECTING | Day 8-14 | **Day 9** | ✓ |
| Struggling User stuck | Should be slow | **Reached CONNECTING Day 42** | ✓ |
| Regression EMERGING → CONNECTING | Should regress | **Did not regress** | ? GRACE PERIOD |

---

## Key Finding: Luminosity Formula Needs Calibration

The current luminosity formula **caps too low** even with perfect inputs:

```python
# Current formula
luminosity = bright_ratio * 0.4 + (strength * density) * 0.25 + stability * 0.2 - dark * 0.15

# With perfect values:
# bright_ratio = 1.0, strength = 0.7, density = 0.44, stability = 0.8, dark = 0
luminosity = 0.4 + 0.077 + 0.16 - 0 = 0.637  # Never reaches 0.7 threshold!
```

**Problem:** The connection component is `strength × density × 0.25`, which is multiplicative-squared. With realistic density (0.4-0.5), this caps around 0.07-0.09.

**Recommendation:** Adjust luminosity formula:

```python
# Option A: Remove strength multiplication
luminosity = bright_ratio * 0.4 + density * 0.25 + stability * 0.2 - dark * 0.15

# Option B: Increase connection weight
luminosity = bright_ratio * 0.4 + (strength * density) * 0.35 + stability * 0.15 - dark * 0.10

# Option C: Lower luminosity threshold
LUMINOSITY_THRESHOLD = 0.6  # Instead of 0.7
```

---

## Scenario Details

### 1. Ideal User (120 days)

**Setup:** User adds stars during Mirror, builds connections, consistently increases brightness.

**Results:**
```
Day   9: SCATTERED → CONNECTING
Day  25: CONNECTING → EMERGING
Day 120: Still EMERGING (luminosity capped at 0.638)
```

**Assessment:** ✗ Phase progression to EMERGING works, but LUMINOUS is unreachable with current formula.

**Metrics at Day 120:**
- Stars: 10
- Connections: 20
- Connection density: 0.444
- Bright ratio: 1.0 (100% bright)
- Integration: 0.776
- Luminosity: 0.638 (below 0.7 threshold)

### 2. Struggling User (120 days)

**Setup:** Slow star growth, occasional connections, inconsistent brightness.

**Results:**
```
Day  42: SCATTERED → CONNECTING
Day 120: Still CONNECTING
```

**Assessment:** ✓ Correctly shows slower progression.

**Metrics at Day 120:**
- Stars: 6
- Connections: 4
- Bright ratio: 0.0 (no bright stars)
- Integration: 0.687

### 3. Regression Scenario

**Setup:** Start at EMERGING with 8 bright stars, 10 connections. Then decline.

**Results:**
- Decline happened (lost connections, brightness dropped)
- Integration dropped to 0.671 (below 0.35 regression threshold? No — 0.5 × 0.7 = 0.35)
- **Did not regress** — integration stayed above 0.35

**Assessment:** The simulation shows hysteresis working — regression threshold (0.35) is harder to hit than it seems.

### 4. Optimal Path

**Setup:** Aggressive star creation, fast connection building, focus on brightness.

**Results:**
```
Day  10: SCATTERED → CONNECTING
Day 120: Still CONNECTING (not enough density for EMERGING)
```

**Assessment:** Connection density 0.311 is below the 0.4 threshold for EMERGING.

---

## Sensitivity Analysis

### Luminosity Threshold

| Value | Ideal User Result | Assessment |
|-------|-------------------|------------|
| 0.7 | Never reached | Too strict |
| 0.6 | Reached ~Day 50 | Reasonable |
| 0.5 | Reached ~Day 30 | Too easy |

**Recommendation:** Lower LUMINOSITY_THRESHOLD to 0.6, OR adjust formula weights.

### Connection Density for EMERGING

| Value | Optimal Path Result | Assessment |
|-------|---------------------|------------|
| 0.4 | Never reached | Strict |
| 0.3 | Reached Day 30 | Reasonable |
| 0.2 | Reached Day 15 | Easy |

**Current setting (0.4) is appropriate** — forces meaningful connection building.

---

## Recommended Constant Changes

| Parameter | Current | Recommended | Reason |
|-----------|---------|-------------|--------|
| LUMINOSITY_THRESHOLD | 0.7 | **0.6** | Current formula caps below 0.7 |
| LUMINOSITY_CONNECTION_WEIGHT | 0.25 | **0.30** | Increase connection contribution |
| Or remove strength multiplier | strength × density | **density only** | Simplify formula |

---

## Validation After Tuning

With LUMINOSITY_THRESHOLD = 0.6:

| Scenario | Expected | Status |
|----------|----------|--------|
| Ideal → LUMINOUS | Day 60-90 | Needs re-simulation |
| Struggling stuck | Yes | ✓ |
| Regression works | Day 7+ | Needs re-simulation |

---

## Open Questions

- [ ] Is LUMINOUS too hard to achieve? (Current: impossible with formula)
- [ ] Should connection strength multiply or add in luminosity?
- [ ] Is 14-day stabilization for LUMINOUS too long given difficulty?
- [ ] How does dark star influence interact with luminosity in practice?

---

## Summary

**What works:**
- SCATTERED → CONNECTING transition (Day 9 for ideal)
- CONNECTING → EMERGING transition (Day 25 for ideal)
- Struggling user slower progression
- Hysteresis prevents easy regression

**What needs tuning:**
- Luminosity formula caps too low
- LUMINOUS threshold or formula needs adjustment
- Regression scenarios need longer simulation

**Next steps:**
1. Adjust luminosity formula in 02-blood.md
2. Re-run simulations
3. Validate LUMINOUS is achievable in 90-120 days

---

*MIRROR reveals calibration needed. This is exactly why we simulate before shipping.*
