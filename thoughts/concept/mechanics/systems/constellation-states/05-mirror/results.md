# Constellation States - MIRROR Results

**System:** constellation-states
**Lens:** MIRROR (5/7)
**Created:** 2026-01-15
**Status:** Validated

---

## Summary

Three iterations of simulation were required to tune constants:

| Version | Issue | Fix |
|---------|-------|-----|
| V1 | Too fast progression (5 days to BRIGHT) | Reduced impacts |
| V2 | Struggling users declined too fast | Added proportional decay |
| V3 | Dark star drain slightly aggressive | Fine-tuned drain rate |

**Final result: 6/6 validation checks pass.**

---

## Validation Results

| Scenario | Target | V1 | V2 | V3 (Final) |
|----------|--------|-----|-----|------------|
| Ideal user → BRIGHT | 10-18 days | 5 ✗ | 9 ✗ | **12 ✓** |
| Gaming → BRIGHT | 7+ days | 3 ✗ | 5 ✗ | **7 ✓** |
| Struggling end brightness | ≥50% start | 53% ✗ | 42% ✗ | **95% ✓** |
| Absent user floor | >0.1 | 0.17 ✓ | 0.17 ✓ | **0.34 ✓** |
| Dark star drain 60d | >0.25 | 0.05 ✗ | 0.05 ✗ | **0.27 ✓** |
| Recovery → BRIGHT | <30 days | 8 ✓ | 16 ✓ | **21 ✓** |

---

## Final Tuned Constants

These constants replace those in `02-blood.md`:

### Impacts (Reduced)

| Constant | Original | Tuned | Reason |
|----------|----------|-------|--------|
| BASE_EXPERIMENT_IMPACT | 0.08 | **0.03** | Slower progression |
| MAX_DAILY_IMPACT | 0.15 | **0.06** | Anti-gaming |
| INSIGHT_IMPACT | 0.06 | **0.02** | Proportional |
| CONNECTION_IMPACT | 0.04 | **0.015** | Proportional |

### Penalties (Reduced)

| Constant | Original | Tuned | Reason |
|----------|----------|-------|--------|
| BASE_SKIP_PENALTY | 0.02 | **0.008** | Gentler on struggling users |
| CONTRADICTION_PENALTY | 0.10 | **0.04** | Less punishing |

### Streak (Reduced)

| Constant | Original | Tuned | Reason |
|----------|----------|-------|--------|
| MAX_STREAK_BONUS | 1.5 | **1.3** | Prevent runaway |
| Streak increment | 0.05/day | **0.02/day** | Slower ramp |

### Dark Star (Reduced)

| Constant | Original | Tuned | Reason |
|----------|----------|-------|--------|
| DARK_STAR_DRAIN_RATE | 0.03 | **0.006** | Gradual drain |

### NEW: Decay Formula

**Original (linear):**
```
decay = brightness × daily_decay_rate
```

**Tuned (proportional):**
```
decay = brightness × daily_decay_rate × decay_factor

where:
  decay_factor = (brightness - MIN_BRIGHTNESS) / (MAX_BRIGHTNESS - MIN_BRIGHTNESS)

  if brightness < MAINTENANCE_ZONE (0.3):
    decay_factor *= 0.5
```

This creates "soft floor" behavior - decay slows dramatically near the minimum, preventing crash-to-zero.

---

## Scenario Details

### Ideal User (Daily Engagement)

```
Day  1: 0.330 (flickering)
Day  7: 0.523 (flickering)
Day 12: 0.700 ← BRIGHT threshold crossed
Day 14: 0.775 (bright)
Day 21: 1.000 (bright, capped)
Day 30: 1.000 (bright, stable)
```

**Assessment:** 12 days to BRIGHT with daily medium-difficulty experiments feels earned. Not instant gratification, not a grind.

### Struggling User (30% Completion)

```
Day  1: 0.285
Day 14: 0.373 (peak)
Day 30: 0.286 (dim)
```

**Assessment:** User maintains roughly starting brightness despite 70% skip rate. Small completions offset decay. Not punishing, but not rewarding avoidance either.

### Gaming Attempt (10 tiny/day)

```
Day  1: 0.360
Day  7: 0.720 ← BRIGHT threshold crossed
Day 14: 1.000 (capped)
```

**Assessment:** Gaming still works but takes 7 days instead of 3. The cap forces consistency over bursts.

### Dark Star Drain (60 days, no engagement)

```
Day  1: 0.782
Day 30: 0.449
Day 60: 0.273
```

**Assessment:** Connected bright star (0.8) drops to 0.27 over 2 months with dark star draining it. Noticeable but not devastating. User has time to intervene.

### Recovery from Low (Consistent small efforts)

```
Day  1: 0.172 (starting low)
Day 14: 0.506 (crossed DIM threshold)
Day 21: 0.710 ← BRIGHT threshold crossed
Day 30: 0.974
```

**Assessment:** Even from 0.15, consistent effort reaches BRIGHT in 3 weeks. Recovery is possible and feels achievable.

---

## Key Insights

### 1. Proportional Decay is Essential

Linear decay creates a "death spiral" for struggling users. Proportional decay creates a soft floor that prevents total collapse while still creating urgency.

### 2. Engagement Should Protect

In V3, doing an experiment fully protects from decay for that day. This makes even tiny experiments valuable for maintenance.

### 3. Anti-Gaming Requires Time, Not Just Caps

MAX_DAILY_IMPACT alone wasn't enough. Reducing base impacts forces multiple days of engagement regardless of intensity.

### 4. Dark Star Drain Must Be Slow

At 3%/day, dark stars devastated constellations too quickly. At 0.6%/day, they create urgency without panic.

---

## Recommendations for BLOOD Update

Update `02-blood.md` with:

1. Replace all impact/penalty constants with tuned values
2. Add proportional decay formula with maintenance zone
3. Add "engagement protects from decay" rule
4. Update dark star drain rate

---

## Files in This Directory

- `simulation.py` - V1 simulation (original constants)
- `simulation_v2.py` - V2 simulation (first tuning)
- `simulation_v3.py` - V3 simulation (final tuning)
- `results.md` - This file

---

*MIRROR complete. Constants validated. Ready for SCRIPTURE.*
