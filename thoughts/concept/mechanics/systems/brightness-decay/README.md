# Brightness & Decay System

**Status:** Complete (6/6 lenses)
**Last Updated:** 2026-01-15

---

## Overview

This system governs how star brightness changes over time. Brightness is the continuous value (0.05→1.0) that drives state transitions in constellation-states.

**Core insight:** The system is designed to be forgiving for mistakes, honest about patterns, and protective against death spirals. Users see glow and narrative, not numbers.

---

## Quick Stats

| Metric | Value |
|--------|-------|
| Days to BRIGHT (ideal) | 12 |
| Days to BRIGHT (recovery) | 12 |
| Daily gain cap | 0.06 |
| Minimum brightness | 0.05 (dormant) |
| Streak preservation | 50% on miss |

---

## Files

| File | Lens | Purpose |
|------|------|---------|
| `01-skeleton.md` | SKELETON | Structure and entity relationships |
| `02-blood.md` | BLOOD | Formulas and constants |
| `03-nerves.md` | NERVES | Research justifications |
| `04-skin.md` | SKIN | Edge cases and boundaries |
| `05-mirror/` | MIRROR | Simulation and validation |
| `06-scripture.md` | SCRIPTURE | **Canonical reference** |

**Start here:** `06-scripture.md` for implementation

---

## Key Formulas

### Daily Update
```
gains = (experiments + insights + spillover + recovery) × streak_bonus
losses = (skips + contradictions + decay + dark_drain) × neglect_multiplier
new_brightness = clamp(old + min(gains, 0.06) - losses, 0.05, 1.0)
```

### Streak Bonus
```
bonus = 1 + 0.15 × ln(streak_days), capped at 1.3
On miss: streak = floor(streak × 0.5)  # Preserve half
```

### Decay
```
decay = brightness × base_rate × distance_from_floor × zone_factor
Engagement cancels decay entirely for that day
```

---

## Design Principles

1. **First skip is free** — Life happens, no penalty
2. **Streaks preserve 50%** — Miss doesn't reset to zero
3. **Recovery is celebrated** — Longer absence = bigger welcome back
4. **Soft floor protection** — Stars go dormant, never die
5. **Daily cap** — Can't game with 100 experiments

---

## Validation Summary

All scenarios passed in MIRROR simulation:

- Ideal user reaches BRIGHT in 12 days ✓
- Gaming capped at 0.06/day ✓
- Struggling user stays stable (0.268), not death spiral ✓
- 60-day absence floors at 0.153, not zero ✓
- Recovery from DIM takes 12 days ✓

---

## Dependencies

```
constellation-states ──▶ brightness-decay ──▶ experiment-selection
                                          ──▶ phase-transitions
                                          ──▶ connection-formation
```

---

## Running Simulations

```bash
cd 05-mirror
python simulation.py
```

Output includes all test scenarios with day-by-day progression.

---

*"Stars don't punish. They wait. They always wait."*
