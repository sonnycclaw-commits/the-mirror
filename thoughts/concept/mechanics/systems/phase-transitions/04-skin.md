# Phase Transitions - SKIN

**System:** phase-transitions
**Lens:** SKIN (4/7)
**Created:** 2026-01-15
**Status:** Draft
**Depends on:** 03-nerves.md ✓

---

## Overview

This document defines boundaries, edge cases, and failure modes for the phase transition system.

---

## Value Bounds

| Property | Type | Min | Max | Default | Behavior at Bound |
|----------|------|-----|-----|---------|-------------------|
| phase | enum | SCATTERED | LUMINOUS | SCATTERED | Clamp (no lower/higher) |
| star_count | int | 0 | 100 | 0 | Soft cap at 50, hard cap at 100 |
| connection_count | int | 0 | n(n-1)/2 | 0 | Max = all possible pairs |
| connection_density | float | 0.0 | 1.0 | 0.0 | 1.0 = fully connected |
| integration_score | float | 0.0 | 1.0 | 0.0 | Computed, clamped |
| luminosity_score | float | 0.0 | 1.0 | 0.0 | Computed, clamped |
| dark_influence | float | 0.0 | 1.0 | 0.0 | Computed, clamped |
| days_in_phase | int | 0 | ∞ | 0 | No max (track indefinitely) |
| phase_progress | float | 0 | 100 | 0 | Percentage to next phase |

---

## Edge Cases

### EC-01: Zero stars

**Trigger:** New user, no stars yet
**Question:** What phase is an empty constellation?
**Resolution:**
- Phase = SCATTERED (default)
- Phase progress = 0%
- TARS prompts Birth Chart / Mirror initiation
- "Your sky is empty. Let's light the first star."

### EC-02: One star

**Trigger:** User has exactly one star
**Question:** Can you progress with one star?
**Resolution:**
- Phase = SCATTERED (can't have connections with 1 star)
- connection_density = 0 (by definition)
- Progress to CONNECTING blocked until star_count ≥ 2
- "You have one star. Let's find another."

### EC-03: All stars DORMANT

**Trigger:** User abandons app, all stars go dormant
**Question:** What phase is a dormant constellation?
**Resolution:**
- Phase calculation excludes DORMANT stars
- If all stars dormant → active_star_count = 0 → Phase = SCATTERED
- On return, dormant stars can reactivate
- "Your constellation went dark, but it's still here. Let's wake it up."

### EC-04: All stars DARK

**Trigger:** User has only dark stars (extreme shadow state)
**Question:** What phase when everything is dark?
**Resolution:**
- dark_influence = very high (likely 1.0)
- Can still be CONNECTING or EMERGING if connections exist
- Cannot reach LUMINOUS (dark_influence > DARK_INFLUENCE_MAX)
- TARS: "Your constellation is in shadow. That's not wrong — it's where we start."
- Suggest professional support if pattern persists

### EC-05: Very large constellation (50+ stars)

**Trigger:** Long-term user accumulates many stars
**Question:** Does phase scale with star count?
**Resolution:**
- Phase formulas use RATIOS (density, bright_ratio), not absolute counts
- 50 stars with 25 bright = same bright_ratio as 10 stars with 5 bright
- Soft cap at 50 stars: suggest archiving dormant stars
- Hard cap at 100 stars: no new stars created
- "Your constellation is vast. Consider archiving dormant stars to focus."

### EC-06: Rapid star creation

**Trigger:** User creates 10 stars in one day
**Question:** Can phase jump multiple levels?
**Resolution:**
- Phase is recalculated daily, not real-time
- Even if thresholds are met, phase advances one step per day max
- Prevents gaming by bulk star creation
- Progress can jump significantly, but phase transitions are gated

### EC-07: Rapid star deletion (archiving)

**Trigger:** User archives many stars at once
**Question:** Can archiving cause immediate regression?
**Resolution:**
- Archiving removes stars from active calculation
- If this drops below threshold → grace period applies
- User is warned before archiving: "This will affect your phase progress"
- Archived stars can be restored

### EC-08: Connection to only dark stars

**Trigger:** Bright star connected only to dark stars
**Question:** Does this count toward connection_density?
**Resolution:**
- Yes, connections count regardless of star state
- But dark_influence increases when dark stars have connections
- Mixed blessing: density helps integration, but dark drain applies

### EC-09: Phase calculated during Mirror (days 1-7)

**Trigger:** User in Birth Chart creation
**Question:** Should phase change during Mirror?
**Resolution:**
- Phase = SCATTERED during Mirror (locked)
- Phase transitions unlock on Day 8 (start of Walk)
- Progress bar hidden during Mirror
- "Complete your Birth Chart first. Then we'll talk about phases."

### EC-10: User stuck in SCATTERED long-term

**Trigger:** User has stars but never forms connections
**Question:** Is permanent SCATTERED a valid state?
**Resolution:**
- Yes — some users may prefer isolated exploration
- TARS occasionally suggests connection exploration
- No forced progression
- "You have several stars but no connections yet. Want to explore how they relate?"

### EC-11: Immediate regression after achievement

**Trigger:** User achieves LUMINOUS, then all bright stars dim in one event
**Question:** Can user lose LUMINOUS immediately?
**Resolution:**
- No — grace period of 14 days applies
- Even catastrophic drop gives time to recover
- TARS warns: "Something significant changed. Your luminosity dropped sharply."
- User has 14 days to address

### EC-12: Multiple phase boundaries crossed

**Trigger:** Metrics drop from LUMINOUS thresholds to SCATTERED thresholds at once
**Question:** Does user skip phases in regression?
**Resolution:**
- No — regression is one phase at a time
- Each phase has its own grace period
- LUMINOUS → EMERGING (14 days) → CONNECTING (7 days) → SCATTERED (7 days)
- Minimum 28 days from LUMINOUS to SCATTERED

### EC-13: Exactly at threshold

**Trigger:** integration_score = 0.5 exactly
**Question:** Advance or not?
**Resolution:**
- Threshold is ≥, so exactly at threshold = advance
- For regression, threshold is <, so exactly at threshold = stay
- This creates a small "safe zone" at the boundary

---

## Invalid Inputs

| Input | Invalid Values | Handling |
|-------|----------------|----------|
| phase (from DB) | null, invalid string | Default to SCATTERED |
| star_count | negative | Clamp to 0 |
| connection_count | > max_possible | Clamp to max_possible |
| days_in_phase | negative | Clamp to 0 |
| metrics (computed) | NaN, Infinity | Clamp to [0, 1], log error |

---

## Failure Modes

| Scenario | Impact | Handling | User Communication |
|----------|--------|----------|-------------------|
| Metrics calculation error | Wrong phase | Fallback to previous phase, log alert | None (silent) |
| Connection data missing | Can't compute density | Use star-only metrics, flag degraded | None |
| DB corruption (phase enum) | Invalid state | Reset to SCATTERED, log alert | "We needed to recalibrate your constellation." |
| Time manipulation | Grace periods gamed | Server-side timestamps | None |

---

## Gaming Prevention

| Attack | Mitigation | Effectiveness |
|--------|------------|---------------|
| Bulk star creation | One phase advance per day max | High |
| Fake connections | Connections require TARS validation | Medium |
| Brightness pumping | Daily cap from brightness-decay | High |
| Phase camping | No benefit to staying in lower phases | N/A |
| Regression avoidance | Grace periods are generous but finite | Medium |

### Gaming we don't prevent (and why)

| "Attack" | Why We Allow It |
|----------|-----------------|
| Slow and steady | That's the intended path |
| Focusing on connections | Good strategy, encouraged |
| Avoiding dark stars | Their choice, but drags luminosity |

---

## Constraints Summary

```
INVARIANTS:
- phase ∈ {SCATTERED, CONNECTING, EMERGING, LUMINOUS}
- 0 ≤ connection_density ≤ 1
- 0 ≤ integration_score ≤ 1
- 0 ≤ luminosity_score ≤ 1
- days_in_phase ≥ 0
- Regression requires grace period expiration

NEVER:
- Skip phases (must go through each)
- Regress without warning
- Lock user out of lower phases
- Hide phase from user
- Phase during Mirror (days 1-7)

ALWAYS:
- Use ratios, not absolute counts (scalability)
- Apply hysteresis to prevent flickering
- Warn before regression
- Allow recovery during grace period
- Calculate phase daily, not real-time
```

---

## Decision Table: Edge Cases Quick Reference

| Condition | Result |
|-----------|--------|
| star_count = 0 | Phase = SCATTERED, progress = 0 |
| star_count = 1 | Phase = SCATTERED, cannot advance |
| all stars DORMANT | Phase = SCATTERED |
| all stars DARK | Phase ≤ EMERGING (cannot reach LUMINOUS) |
| 50+ stars | Soft cap warning, ratios still apply |
| during Mirror | Phase = SCATTERED (locked) |
| exactly at threshold | Advance (≥ comparison) |
| metrics drop sharply | Grace period protects |
| skip phases (regression) | Not possible, one at a time |

---

*SKIN complete. Boundaries defined. Proceed to MIRROR for simulation.*
