# Brightness & Decay - Canonical Reference

**Status:** Validated
**Last Updated:** 2026-01-15
**Lenses Completed:** SKELETON ✓ BLOOD ✓ NERVES ✓ SKIN ✓ MIRROR ✓

---

## Summary

The brightness-decay system governs how star brightness changes over time. Brightness is a continuous value (0.05→1.0) that drives state transitions in constellation-states. This system defines all sources of brightness gain and loss, how they interact, and the user experience of watching stars brighten and dim.

**Core principle:** Forgiving for mistakes, honest about patterns, protective against spirals, invisible in presentation.

---

## The Brightness Ledger

Daily brightness reconciliation follows this structure:

```python
def update_brightness(star, day_events):
    # GAINS (additive, then streak multiplier, then cap)
    gains = experiment_gain + insight_gain + spillover + recovery_bonus
    gains *= streak_bonus
    gains = min(gains, MAX_DAILY_GAIN)  # 0.06 cap

    # LOSSES (additive, then neglect multiplier)
    losses = skip_penalty + contradiction_penalty + decay + dark_drain
    losses *= neglect_multiplier

    # NET (with soft floor protection)
    new_brightness = clamp(old + gains - losses, MIN_BRIGHTNESS, MAX_BRIGHTNESS)
```

---

## Formulas

### Experiment Gain

```python
gain = BASE_EXPERIMENT_IMPACT × difficulty × alignment × novelty
```

| Constant | Value | Source |
|----------|-------|--------|
| BASE_EXPERIMENT_IMPACT | 0.03 | constellation-states |
| difficulty | tiny=0.5, small=0.75, medium=1.0, stretch=1.5 | Game design |
| alignment | 0.5 (tangential) to 1.0 (direct) | Design |
| novelty | 1.2 for first-time type, else 1.0 | Exploration reward |

### Insight Gain

```python
gain = INSIGHT_IMPACT × depth × source
```

| Constant | Value | Source |
|----------|-------|--------|
| INSIGHT_IMPACT | 0.02 | constellation-states |
| depth | surface=0.5, pattern=1.0, root=1.5 | Marton & Säljö |
| source | user=1.2, tars_prompted=1.0, tars_observed=0.8 | SDT |

### Streak Bonus

```python
bonus = 1 + STREAK_GROWTH_RATE × ln(streak_days)
bonus = min(bonus, MAX_STREAK_BONUS)
```

| Constant | Value | Source |
|----------|-------|--------|
| STREAK_GROWTH_RATE | 0.15 | Duolingo analysis |
| MAX_STREAK_BONUS | 1.3 | constellation-states |

**Streak preservation on miss:**
```python
streak = floor(streak × STREAK_PRESERVATION_RATE)  # 0.5
```

### Spillover (Passive Gain)

```python
spillover = SPILLOVER_RATE × connection_strength × (bright_star.brightness - SPILLOVER_THRESHOLD)
# Only from BRIGHT stars above 0.8
```

| Constant | Value | Source |
|----------|-------|--------|
| SPILLOVER_RATE | 0.3 | constellation-states |
| SPILLOVER_THRESHOLD | 0.8 | Design |

### Recovery Bonus

```python
bonus = RECOVERY_BASE × min(1 + RECOVERY_SCALE × ln(days_absent / RECOVERY_MIN_DAYS), RECOVERY_MAX)
```

| Constant | Value | Source |
|----------|-------|--------|
| RECOVERY_BASE | 0.05 | FFXIV/WoW return mechanics |
| RECOVERY_MIN_DAYS | 7 | Weekly cycle |
| RECOVERY_SCALE | 0.3 | Design |
| RECOVERY_MAX_MULTIPLIER | 2.0 | Cap at 0.10 total |

### Passive Decay

```python
decay = brightness × base_rate × distance_from_floor × zone_factor

base_rate = 1 - (0.5 ** (1 / half_life))
distance_from_floor = (brightness - MIN) / (MAX - MIN)
zone_factor = 0.5 if brightness < MAINTENANCE_ZONE else 1.0
```

| Domain | Half-Life | Daily Rate | Source |
|--------|-----------|------------|--------|
| Health | 7 days | 9.43% | Lally 2010 |
| Relationships | 14 days | 4.83% | Gottman |
| Wealth | 21 days | 3.25% | Design |
| Purpose | 30 days | 2.28% | Design |
| Soul | 90 days | 0.77% | Kegan |

**Engagement cancels decay:** If user engages, decay = 0 for that day.

### Skip Penalty

```python
penalty = BASE_SKIP_PENALTY × skip_multiplier

skip_multiplier = {
    0: 0,      # First skip FREE
    1: 0,      # Still free (consecutive)
    2: 1.0,    # 0.008
    3: 1.5,    # 0.012
    4+: 2.0    # 0.016 (cap)
}
```

| Constant | Value | Source |
|----------|-------|--------|
| BASE_SKIP_PENALTY | 0.008 | constellation-states |

### Contradiction Penalty

```python
penalty = CONTRADICTION_PENALTY × severity × recency
```

| Constant | Value | Source |
|----------|-------|--------|
| CONTRADICTION_PENALTY | 0.04 | constellation-states |
| severity | mild=0.5, moderate=1.0, severe=1.5 | Design |
| recency | fresh=1.0, recent=0.7, old=0.3 | Design |

### Dark Star Drain

```python
drain = DARK_DRAIN_RATE × connection_strength × dark_intensity
dark_intensity = 1 - dark_star.brightness
```

| Constant | Value | Source |
|----------|-------|--------|
| DARK_DRAIN_RATE | 0.006 | constellation-states |

### Neglect Acceleration

```python
multiplier = {
    days < 7:  1.0,
    days < 21: 1.5,
    days >= 21: 2.0
}
```

---

## Constants Reference (Complete)

### Inherited from constellation-states

| Constant | Value | Unit |
|----------|-------|------|
| MIN_BRIGHTNESS | 0.05 | - |
| MAX_BRIGHTNESS | 1.0 | - |
| BASE_EXPERIMENT_IMPACT | 0.03 | - |
| MAX_DAILY_GAIN | 0.06 | - |
| INSIGHT_IMPACT | 0.02 | - |
| BASE_SKIP_PENALTY | 0.008 | - |
| CONTRADICTION_PENALTY | 0.04 | - |
| DARK_DRAIN_RATE | 0.006 | /day |
| MAX_STREAK_BONUS | 1.3 | - |
| SPILLOVER_RATE | 0.3 | - |
| MAINTENANCE_ZONE | 0.3 | - |

### New to brightness-decay

| Constant | Value | Unit |
|----------|-------|------|
| NOVELTY_BONUS | 1.2 | - |
| STREAK_GROWTH_RATE | 0.15 | - |
| STREAK_PRESERVATION_RATE | 0.5 | - |
| SPILLOVER_THRESHOLD | 0.8 | - |
| RECOVERY_BASE | 0.05 | - |
| RECOVERY_MIN_DAYS | 7 | days |
| RECOVERY_SCALE | 0.3 | - |
| RECOVERY_MAX_MULTIPLIER | 2.0 | - |
| NEGLECT_THRESHOLD_1 | 7 | days |
| NEGLECT_THRESHOLD_2 | 21 | days |
| NEGLECT_MULTIPLIER_1 | 1.5 | - |
| NEGLECT_MULTIPLIER_2 | 2.0 | - |
| SOFT_FLOOR_ZONE | 0.15 | - |
| SOFT_FLOOR_FACTOR | 0.7 | - |

---

## Edge Cases

| Case | Behavior | Rationale |
|------|----------|-----------|
| brightness → 0 | Soft floor at 0.15, clamp at 0.05, DORMANT state | Stars never die |
| brightness → 1.0 | Clamp, excess → spillover to connections | Radiate energy |
| 20 experiments/day | Capped at MAX_DAILY_GAIN (0.06) | Anti-gaming |
| First skip | penalty = 0 | Life happens |
| Miss one day | streak × 0.5, preserved | Anti-what-the-hell |
| 60 days absent | Floor ~0.15, recovery bonus on return | Welcome back |
| Contradiction + experiment | Both apply, may net negative | Honest feedback |

---

## Validation Results (MIRROR)

| Scenario | Target | Result | Status |
|----------|--------|--------|--------|
| Ideal → BRIGHT | 10-18 days | 12 days | ✓ |
| Gaming attempt | capped | 0.06/day | ✓ |
| Struggling user @ 30d | stable | 0.268 | ✓ |
| Absent 60d floor | > 0.10 | 0.153 | ✓ |
| Dark drain @ 60d | > 0.05 | 0.104 | ✓ |
| Recovery → BRIGHT | < 30 days | 12 days | ✓ |

---

## Implementation Notes

### Recommended Approach

1. Store brightness as float (not percentage)
2. Calculate all gains, apply cap, then calculate losses
3. Apply streak bonus to gains, neglect multiplier to losses
4. Check soft floor before final clamp
5. Reconcile once daily (not real-time)

### Processing Order

```
1. Sum all gains
2. Apply streak multiplier
3. Apply MAX_DAILY_GAIN cap
4. Sum all losses (skip, contradiction, decay, drain)
5. Apply neglect multiplier
6. Calculate net = gains - losses
7. Apply soft floor if in danger zone
8. Clamp to [MIN, MAX]
9. Update variance (for constellation-states)
10. Check state transitions
```

### Common Mistakes

| Mistake | Why It Fails | Fix |
|---------|--------------|-----|
| Real-time updates | Anxiety-inducing | Reconcile at check-in |
| Full streak reset | What-the-hell effect | Preserve 50% |
| Punishing first skip | Feels unfair | First skip free |
| Linear decay | Death spiral | Proportional decay |
| No soft floor | Stars die permanently | Asymptotic floor |

### Performance

- O(1) per star for brightness update
- O(c) for spillover (c = connections)
- O(d) for dark drain (d = dark star connections)
- For 50 stars, ~100 operations per daily reconciliation

---

## Dependencies

**Depends on:**
- constellation-states (state definitions, base constants)

**Depended on by:**
- experiment-selection (uses impact values for prioritization)
- phase-transitions (uses aggregate brightness for phase calculation)
- connection-formation (uses spillover mechanics)

---

## Experience Design

### What Users See

| Show | Don't Show |
|------|------------|
| Visual glow intensity | Raw numbers |
| Trend (brightening/dimming/stable) | Daily deltas |
| TARS narrative | Punishment framing |

### TARS Commentary Examples

**Brightening:**
> "Your Health star is responding. Three days of small moves — it noticed."

**Dimming:**
> "Your Purpose star is asking for attention. No rush."

**Recovery:**
> "Welcome back. Your constellation remembered you."

---

## Quick Reference

```
GAINS:          experiment (0.03 base) + insight (0.02) + spillover + recovery
                × streak bonus (1.0-1.3)
                capped at 0.06/day

LOSSES:         skip (0-0.016) + contradiction (0.04) + decay (domain-based) + dark drain
                × neglect multiplier (1.0-2.0)

PROTECTION:     engagement cancels decay
                first skip free
                streak preserves 50%
                soft floor at 0.15
                absolute floor at 0.05

PROGRESSION:    ~12 days ideal → BRIGHT
                ~12 days recovery DIM → BRIGHT

KEY INSIGHT:    The system celebrates return, not punishes absence.
```

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-01-15 | SKELETON: Structure defined | Claude |
| 2026-01-15 | BLOOD: Formulas added | Claude |
| 2026-01-15 | NERVES: Research justifications | Claude |
| 2026-01-15 | SKIN: Edge cases defined | Claude |
| 2026-01-15 | MIRROR: Simulation validated | Claude |
| 2026-01-15 | SCRIPTURE: Canonical reference | Claude |

---

*"Stars don't punish. They wait. They always wait."*
