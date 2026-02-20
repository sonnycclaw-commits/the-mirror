# Brightness & Decay - SKIN

**System:** brightness-decay
**Lens:** SKIN (4/7)
**Created:** 2026-01-15
**Status:** Draft
**Depends on:** 03-nerves.md ✓

---

## Overview

This document defines boundaries, edge cases, failure modes, and gaming prevention for the brightness-decay system.

---

## Value Bounds

| Property | Type | Min | Max | Default | Behavior at Bound |
|----------|------|-----|-----|---------|-------------------|
| brightness | float | 0.05 | 1.0 | 0.3 | Clamp (soft floor at 0.15) |
| streak_days | int | 0 | 365 | 0 | Clamp at max |
| consecutive_skips | int | 0 | ∞ | 0 | No max (but penalty caps at 2x) |
| days_since_engaged | int | 0 | ∞ | 0 | Triggers dormancy at threshold |
| daily_gain | float | 0 | 0.06 | - | Hard cap |
| streak_bonus | float | 1.0 | 1.3 | 1.0 | Hard cap |
| neglect_multiplier | float | 1.0 | 2.0 | 1.0 | Hard cap |
| recovery_bonus | float | 0 | 0.10 | 0 | Hard cap |

---

## Edge Cases

### EC-01: Brightness approaches zero

**Trigger:** Extended inaction + cumulative decay
**Question:** Can brightness hit exactly 0.05 (floor)? What happens below?
**Resolution:**
- Soft floor kicks in at 0.15 — decay rate reduced by 30%
- Below 0.05, value is clamped to 0.05
- At floor, star transitions to DORMANT state (from constellation-states)
- DORMANT stars are grayed out but visible — they don't disappear

### EC-02: Brightness at ceiling

**Trigger:** Sustained high engagement
**Question:** What happens when brightness = 1.0 and user keeps engaging?
**Resolution:**
- Gains beyond 1.0 are not wasted — they trigger spillover
- Spillover flows to connected stars at SPILLOVER_RATE
- User sees: "Your [star] is at full brightness. Energy is flowing to connected stars."

### EC-03: Rapid engagement burst

**Trigger:** User completes 10+ experiments in one day
**Question:** Can user "bank" progress by cramming?
**Resolution:**
- MAX_DAILY_GAIN = 0.06 hard caps single-day progress
- Beyond cap, extra experiments don't increase brightness
- User sees: "You've made great progress today. Tomorrow's a new day."
- This prevents gaming but doesn't punish engagement — just caps it

### EC-04: Zero engagement for extended period

**Trigger:** User doesn't engage for 30+ days
**Question:** What happens to a star with extended neglect?
**Resolution:**
- Days 1-7: Normal decay
- Days 8-21: Decay × 1.5 (neglect acceleration tier 1)
- Days 22+: Decay × 2.0 (neglect acceleration tier 2)
- Eventually reaches soft floor (0.05) and goes DORMANT
- Star is preserved, can be reactivated with recovery bonus

### EC-05: User returns after 1 year absence

**Trigger:** Very long-term absence
**Question:** Is there a point of no return?
**Resolution:**
- No. Stars NEVER disappear.
- After 1 year, all stars are likely DORMANT (brightness = 0.05)
- First engagement triggers recovery bonus (capped at 0.10)
- User sees: "Welcome back. Your constellation has been waiting."
- Full recovery path: DORMANT → FLICKERING → normal progression

### EC-06: Streak broken and resumed same day

**Trigger:** User misses morning check-in but completes evening experiment
**Question:** Does partial-day engagement count?
**Resolution:**
- Daily reconciliation happens at check-in time (configurable)
- If user engages before reconciliation: streak continues
- If user engages after reconciliation: new streak starts from Day 1
- Default reconciliation: 3 AM local time (catches night owls)

### EC-07: Multiple experiments, mixed results

**Trigger:** User completes 2 experiments, skips 1, has 1 insight
**Question:** How do gains and losses combine?
**Resolution:**
- All gains are summed: experiments + insight + spillover + recovery
- All losses are summed: skips + contradictions + decay + drain
- Gains apply streak multiplier
- Losses apply neglect multiplier
- Net = (gains × streak) - (losses × neglect)
- Order: Calculate all, then apply net

### EC-08: Dark star connected to bright star

**Trigger:** User has DARK star connected to BRIGHT star
**Question:** Does drain compete with spillover?
**Resolution:**
- Both happen in same reconciliation
- Spillover (from BRIGHT → other stars) happens first
- Dark drain (from DARK → connected stars) happens second
- Net effect: BRIGHT star radiates energy, DARK star absorbs some
- If DARK drains the BRIGHT star itself: drain reduces BRIGHT's brightness

### EC-09: Contradiction while completing experiment

**Trigger:** User completes health experiment but TARS detects they skipped sleep (contradiction)
**Question:** Does experiment credit offset contradiction penalty?
**Resolution:**
- Both apply independently
- Gain: +0.03 (experiment)
- Loss: -0.04 (contradiction)
- Net: -0.01
- User sees: "You did the stretch, but I notice you're still skipping sleep. What's happening there?"

### EC-10: Recovery bonus on non-dormant star

**Trigger:** User was absent 10 days, star is DIM (not DORMANT)
**Question:** Does recovery bonus still apply?
**Resolution:**
- Yes. Recovery bonus applies to ANY star returning from absence ≥ 7 days
- The star doesn't need to be DORMANT to receive welcome-back bonus
- This rewards return regardless of how far the star fell

### EC-11: Negative net change at floor

**Trigger:** Star at 0.06, losses would push below floor
**Question:** What happens?
**Resolution:**
- Soft floor protection kicks in
- Actual drop = proposed drop × 0.7 (when in 0.05-0.15 zone)
- Clamp to MIN_BRIGHTNESS (0.05)
- Star cannot go below 0.05 under any circumstances

### EC-12: Timezone change

**Trigger:** User travels across timezones
**Question:** Does this affect decay calculation?
**Resolution:**
- Server uses UTC timestamps for all calculations
- Daily reconciliation based on user's configured local time
- Timezone changes don't create "free days" or "double days"
- If user changes timezone: next reconciliation happens at normal time in new zone

---

## Invalid Inputs

| Input | Invalid Values | Handling |
|-------|----------------|----------|
| experiment.difficulty | null, undefined, invalid string | Default to "small" |
| experiment.alignment_score | < 0, > 1, NaN | Clamp to [0.5, 1.0] |
| insight.depth | invalid string | Default to "surface" |
| insight.source | invalid string | Default to "tars_prompted" |
| skip.consecutive_count | negative | Clamp to 0 |
| timestamp | future date (> now + 48h) | Reject, log error |
| timestamp | past date (> 48h ago) | Accept with warning, flag for review |
| brightness (from DB) | < 0, > 1, NaN | Clamp to [0.05, 1.0], log corruption |

---

## Failure Modes

| Scenario | Impact | Handling | User Communication |
|----------|--------|----------|-------------------|
| Network failure during check-in | Experiment result not recorded | Queue locally, sync on reconnect | "Saved locally. We'll sync when you're back online." |
| DB corruption (brightness NaN) | Invalid star state | Clamp to valid range, log alert | None (silent fix) |
| TARS misclassifies insight depth | Wrong multiplier applied | User can flag, queued for review | None (accept classification) |
| TARS false positive contradiction | Undeserved penalty | User can dispute, reset contradiction count | "TARS got it wrong. Contradiction removed." |
| Server time drift | Decay calculations off | NTP sync, maximum 24h drift allowed | None (invisible) |
| Calculation overflow | Brightness > 1.0 attempted | Clamp before storage | None |

---

## Gaming Prevention

| Attack | Mitigation | Effectiveness |
|--------|------------|---------------|
| **Clock manipulation** | Server-side timestamps only | High |
| **Spam experiments** | MAX_DAILY_GAIN cap (0.06) | High |
| **Spam insights** | Insights require TARS interaction (rate limited) | High |
| **Multi-device** | Same user ID, server reconciliation | High |
| **Account reset** | Not prevented — harmless (user loses history) | N/A |
| **Retroactive logging** | Allow within 48h only, flag for review beyond | Medium |
| **Fake experiments** | Requires TARS interaction to confirm | Medium |
| **Automated engagement** | TARS dialogue prevents simple automation | Medium |

### Gaming we don't prevent (and why)

| "Attack" | Why We Allow It |
|----------|-----------------|
| Creating new account | User loses all progress — self-punishing |
| Lying to TARS | TARS will notice patterns; honesty is required for the system to work |
| Only doing tiny experiments | Progress is real, just slow. Tiny experiments are valid. |
| Ignoring dark stars | Their choice. Dark stars will continue to drain. |

---

## Constraints Summary

```
INVARIANTS:
- brightness ∈ [0.05, 1.0]
- streak_days ≥ 0
- daily_gain ≤ MAX_DAILY_GAIN (0.06)
- streak_bonus ≤ MAX_STREAK_BONUS (1.3)
- neglect_multiplier ≤ NEGLECT_MULTIPLIER_2 (2.0)
- recovery_bonus ≤ RECOVERY_BASE × RECOVERY_MAX_MULTIPLIER (0.10)

NEVER:
- Delete a star (dormancy only)
- Allow brightness < MIN_BRIGHTNESS (0.05)
- Allow brightness > MAX_BRIGHTNESS (1.0)
- Process future-dated events (> 48h ahead)
- Apply decay on engaged days
- Reset streak to 0 on single miss (preserve 50%)
- Punish first skip (consecutive_skips == 0 → penalty = 0)

ALWAYS:
- Use server-side timestamps
- Apply soft floor protection below 0.15
- Apply spillover before dark drain
- Cap daily gains before calculating net
- Welcome returning users with recovery bonus
```

---

## Decision Table: Edge Case Quick Reference

| Condition | Result |
|-----------|--------|
| brightness + gain > 1.0 | Clamp to 1.0, excess → spillover |
| brightness - loss < 0.05 | Soft floor, clamp to 0.05 |
| streak miss | streak = floor(streak × 0.5) |
| skip count = 1 | penalty = 0 (free pass) |
| skip count = 2 | penalty = BASE_SKIP_PENALTY |
| skip count ≥ 4 | penalty = BASE_SKIP_PENALTY × 2 (cap) |
| days absent ≤ 7 | neglect_multiplier = 1.0 |
| days absent 8-21 | neglect_multiplier = 1.5 |
| days absent > 21 | neglect_multiplier = 2.0 |
| days absent ≥ 7, re-engaged | recovery_bonus applied |
| BRIGHT star at 1.0, gains | spillover to connections |
| DARK connected to star | drain = 0.006 × strength × intensity |

---

*SKIN complete. Boundaries defined. Proceed to MIRROR for simulation.*
