# Brightness & Decay - MIRROR Results

**System:** brightness-decay
**Lens:** MIRROR (5/7)
**Created:** 2026-01-15
**Status:** Validated
**Simulation:** `simulation.py`

---

## Scenarios Tested

| Scenario | Target | Result | Pass/Fail |
|----------|--------|--------|-----------|
| Ideal User → BRIGHT | 10-18 days | **12 days** | ✓ |
| Gaming (20 experiments day 1) | Capped | **+0.06 (capped at MAX_DAILY_GAIN)** | ✓ |
| Struggling User (30% completion) | Stable, not death spiral | **0.268 at day 30 (DIM, stable)** | ✓ |
| Absent User floor | >0.10 after 60 days | **0.153 minimum** | ✓ |
| Dark Star drain @ 60 days | >0.05 | **0.104** | ✓ |
| Recovery from DIM → BRIGHT | <30 days | **12 days** | ✓ |

---

## Scenario Details

### 1. Ideal User (daily medium experiment)

**Setup:** User completes one medium experiment (aligned) every day for 30 days.

**Results:**
```
Day  1: brightness = 0.330, streak = 1, state = dim
Day  7: brightness = 0.540, streak = 7, state = flickering
Day 12: brightness = 0.700+         state = BRIGHT
Day 14: brightness = 0.812, streak = 14, state = bright
Day 21: brightness = 1.000, streak = 21, state = bright (ceiling)
Day 30: brightness = 1.000, streak = 30, state = bright
```

**Assessment:** ✓ Feels right.
- Two weeks of perfect engagement reaches BRIGHT
- Ceiling hit at day 21 — user might feel "stuck" but spillover kicks in
- Progression is motivating without being trivial

**Days to BRIGHT: 12**

---

### 2. Struggling User (30% completion rate)

**Setup:** User completes ~30% of experiments (random), skips the rest. Tiny difficulty when engaged.

**Results:**
```
Day  1: brightness = 0.293, streak = 0, state = dim
Day  7: brightness = 0.292, streak = 0, state = dim
Day 14: brightness = 0.344, streak = 3, state = dim
Day 21: brightness = 0.298, streak = 0, state = dim
Day 30: brightness = 0.268, streak = 0, state = dim
```

**Assessment:** ✓ Feels right.
- User stays DIM but doesn't death spiral to floor
- Small engaged periods create temporary bumps (day 14 had a streak)
- Final brightness 0.268 is stable — not punished harshly

**Key insight:** The soft floor and maintenance zone protection are working. User is struggling but not destroyed.

---

### 3. Absent User (14 days active → 60 days absent → return)

**Setup:** User engages daily for 2 weeks, disappears for 60 days, then returns.

**Results:**
```
Day  1: brightness = 0.330, state = dim (starting)
Day 14: brightness = 0.812, state = BRIGHT (peak)
Day 30: brightness = 0.317, state = dim (decaying)
Day 60: brightness = 0.180, state = dim (neglect acceleration)
Day 74: brightness = 0.153, state = dim (floor approach)
Day 75: brightness = 0.210, state = dim (RETURN + recovery bonus)
Day 88: brightness = 0.575, state = flickering (recovering)
```

**Assessment:** ✓ Feels right.
- User reached BRIGHT before leaving (good engagement)
- 60 days of absence drops to 0.153 but not to floor
- Soft floor protection visible (0.153 > 0.05)
- Recovery bonus + engagement brings back to 0.575 in 14 days
- "Welcome back" mechanic working as intended

**Minimum brightness: 0.153** (well above floor)

---

### 4. Gaming Attempt (20 experiments in one day)

**Setup:** User tries to "cheat" by cramming 20 tiny experiments in day 1.

**Results:**
```
Day 1: brightness = 0.360 (+0.06)
```

**Assessment:** ✓ Working as intended.
- 20 tiny experiments = 20 × 0.03 × 0.5 = 0.30 theoretical gain
- Actual gain: 0.06 (capped at MAX_DAILY_GAIN)
- Gaming is prevented — cramming doesn't work

---

### 5. Dark Star Drain (60 days, no engagement)

**Setup:** Star starts at 0.6, connected to DARK star, user never engages.

**Results:**
```
Day  1: brightness = 0.580 (-0.020)
Day 14: brightness = 0.369 (-0.013)
Day 30: brightness = 0.237 (-0.006)
Day 45: brightness = 0.163 (-0.004)
Day 60: brightness = 0.104 (-0.004)
```

**Assessment:** ✓ Feels right.
- Dark star drain + decay combined
- Drops significantly but doesn't reach floor even at day 60
- Soft floor and maintenance zone protection working
- User still has chance to recover

---

### 6. Recovery from DIM (start at 0.25)

**Setup:** User returns after absence, star at 0.25 (DIM), engages daily with medium experiments.

**Results:**
```
Day  1: brightness = 0.310 (+0.06, includes recovery bonus)
Day  7: brightness = 0.520, streak = 7, state = flickering
Day 12: brightness = 0.700+ state = BRIGHT
Day 14: brightness = 0.792, streak = 14, state = bright
Day 21: brightness = 1.000, streak = 21, state = bright
```

**Assessment:** ✓ Feels right.
- Recovery bonus gives +0.06 on day 1 (0.25 → 0.31)
- Same progression speed as ideal user (12 days to BRIGHT)
- Recovery is FAST — the system celebrates return

**Days from DIM to BRIGHT: 12**

---

## Sensitivity Analysis

### Half-Life (Health domain)

| Value | 30-day Absent Result | Assessment |
|-------|----------------------|------------|
| 5 days | 0.08 (near floor) | Too punishing |
| **7 days** | **0.153** | **Feels right** |
| 14 days | 0.28 | Too forgiving |

**Conclusion:** 7-day half-life is well-calibrated for Health.

### MAX_DAILY_GAIN

| Value | Gaming Result (Day 1) | Days to BRIGHT (Ideal) | Assessment |
|-------|----------------------|------------------------|------------|
| 0.04 | 0.34 | 18 days | Too slow |
| **0.06** | **0.36** | **12 days** | **Feels right** |
| 0.10 | 0.40 | 8 days | Gaming viable |

**Conclusion:** 0.06 prevents gaming while allowing satisfying progress.

### STREAK_PRESERVATION_RATE

| Value | Effect | Assessment |
|-------|--------|------------|
| 0.0 | Full reset on miss | Too punishing (what-the-hell effect) |
| **0.5** | **Half streak preserved** | **Feels right** |
| 1.0 | No reset | No stakes |

**Conclusion:** 0.5 balances forgiveness with stakes.

---

## Feel Assessment

| Aspect | Assessment | Notes |
|--------|------------|-------|
| Progression speed | ✓ | 12 days to BRIGHT feels earned |
| Punishment severity | ✓ | Struggling user stays stable, not destroyed |
| Recovery time | ✓ | 12 days from DIM to BRIGHT is reasonable |
| Gaming prevention | ✓ | MAX_DAILY_GAIN cap is effective |
| Absent user floor | ✓ | Soft floor works, never hits bottom |
| Dark star impact | ✓ | Noticeable but not overwhelming |
| Early game | ✓ | First gains feel significant |
| Ceiling frustration | ? | Need to test spillover experience at 1.0 |

---

## Recommended Constant Changes

| Parameter | Current | Recommended | Reason |
|-----------|---------|-------------|--------|
| *None* | - | - | All parameters validated |

The current constants produce expected behavior across all scenarios.

---

## Open Questions for Playtesting

- [ ] Does ceiling at 1.0 feel limiting? (Spillover should mitigate)
- [ ] Is recovery time (12 days from DIM to BRIGHT) satisfying?
- [ ] Does struggling user feel "stuck" or "stable"?
- [ ] Is 60-day absence recovery too easy or too hard?
- [ ] How does dark star drain *feel* to the user?

---

## Validation Summary

All scenarios pass their targets:

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Ideal → BRIGHT | 10-18 days | 12 days | ✓ |
| Gaming cap | ≤ 0.06/day | 0.06 exactly | ✓ |
| Struggling floor | > 0.20 | 0.268 | ✓ |
| Absent floor | > 0.10 | 0.153 | ✓ |
| Dark drain @ 60d | > 0.05 | 0.104 | ✓ |
| Recovery → BRIGHT | < 30 days | 12 days | ✓ |

**MIRROR VALIDATION: PASSED**

---

*MIRROR complete. Numbers produce expected feel. Proceed to SCRIPTURE.*
