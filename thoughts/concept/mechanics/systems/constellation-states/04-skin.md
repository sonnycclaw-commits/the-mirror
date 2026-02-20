# Constellation States - SKIN

**System:** constellation-states
**Lens:** SKIN (4/7)
**Created:** 2026-01-15
**Status:** Draft
**Depends on:** 03-nerves.md ✓

---

## Overview

Every system has boundaries. This document defines value ranges, edge cases, failure modes, and gaming prevention for constellation states.

---

## 1. Value Bounds

### 1.1 Brightness

| Property | Type | Min | Max | Default | Behavior at Bound |
|----------|------|-----|-----|---------|-------------------|
| brightness | float | 0.05 | 1.0 | 0.3 | Clamped (no wrap) |

**At MIN (0.05):**
- Star becomes DORMANT visually (grayed)
- Still tracked, can be reactivated
- Never reaches true 0 (stars don't die)

**At MAX (1.0):**
- Spillover activates (excess flows to connections)
- Visual: Full glow, no further visual change
- Continued engagement still valuable (spillover + maintenance)

---

### 1.2 Variance

| Property | Type | Min | Max | Default | Behavior at Bound |
|----------|------|-----|-----|---------|-------------------|
| variance | float | 0.0 | 1.0 | 0.0 | Clamped |

**At MIN (0.0):**
- Perfectly stable (rare)
- Indicates consistent engagement or consistent neglect

**At MAX (1.0):**
- Extreme instability
- Rare edge case - would require dramatic daily swings
- Star is definitively FLICKERING

---

### 1.3 Days Counters

| Property | Type | Min | Max | Default | Notes |
|----------|------|-----|-----|---------|-------|
| days_stable | int | 0 | ∞ | 0 | Resets on variance spike |
| days_inactive | int | 0 | ∞ | 0 | Resets on any engagement |
| streak_days | int | 0 | 365 | 0 | Caps at 1 year |
| contradiction_count | int | 0 | ∞ | 0 | Never resets (memory) |

---

### 1.4 Connection Limits

| Property | Type | Min | Max | Default | Notes |
|----------|------|-----|-----|---------|-------|
| connections_per_star | int | 0 | 10 | 0 | Prevents hairball |
| total_stars | int | 0 | 50 | 0 | UI constraint |

---

## 2. Edge Cases

### 2.1 Brightness Boundaries

**Case: brightness = 0.0 (theoretically impossible)**
- Trigger: Bug or data corruption
- Handling: Clamp to MIN_BRIGHTNESS (0.05)
- Log: Error level, investigate

**Case: brightness oscillates exactly at 0.5**
- Question: Is it DIM or potentially BRIGHT?
- Resolution: Treat as DIM until proven BRIGHT (bias toward current state)

**Case: brightness = 0.7 exactly**
- Question: BRIGHT or still DIM?
- Resolution: ≥ 0.7 = BRIGHT (inclusive threshold)

---

### 2.2 State Transition Boundaries

**Case: Rapid state changes (FLICKERING → DIM → FLICKERING in one day)**
- Trigger: High variance + brightness near threshold
- Prevention: STABILIZATION_DAYS requirement (7 days)
- Visual: No transition animation for sub-day changes

**Case: Simultaneous contradictory triggers**
- Example: User completes experiment (+0.08) AND skips different experiment (-0.02) same day
- Resolution: All impacts apply, net effect calculated
- Order: Positive first, then negative, then decay

---

### 2.3 Star Count Boundaries

**Case: User has 0 stars**
- When: New user before first excavation
- Display: Empty sky with subtle nebula
- TARS: "Your sky is waiting. Let's find your first star."

**Case: User has 50+ stars**
- When: Long-term engaged user
- Prevention: Soft cap at 50 stars
- Handling: TARS suggests archiving dormant stars
- "You have many dormant stars. Want to archive some to focus your sky?"

**Case: All stars are DARK**
- When: User in crisis
- Detection: 3+ dark stars, 0 bright stars
- Response: TARS suggests "low gravity mode" or professional resources
- Safety: Don't gamify crisis states

---

### 2.4 Connection Boundaries

**Case: Star has 0 connections**
- Valid: New star, isolated concern
- Display: Standalone star, no lines
- Note: Isolated stars are vulnerable (no spillover)

**Case: Star has max connections (10)**
- Trigger: User or TARS connecting everything
- Handling: New connections require removing old one
- UI: "This star has maximum connections. Replace one?"

**Case: Circular connections (A→B→C→A)**
- Valid: Allowed, represents interconnected life areas
- Calculation: Spillover and drain propagate (with diminishing factor)
- Limit: Effects don't compound infinitely (capped at 3 hops)

---

### 2.5 Time Boundaries

**Case: User changes timezone**
- Handling: Server-side timestamps (UTC)
- Day boundary: Midnight in user's current timezone
- No penalty for timezone changes

**Case: User inactive for 1+ year**
- All stars: DORMANT
- Brightness: Decayed to MIN (0.05) each
- Re-engagement: Any star can reactivate to FLICKERING
- Welcome back: Special TARS message acknowledging absence

**Case: Retroactive data entry**
- Example: "I did exercise yesterday but forgot to log"
- Handling: Allow within 48-hour window
- Beyond 48h: Cannot retroactively impact (prevents gaming)

---

### 2.6 Dark Star Boundaries

**Case: Dark star connected to dark star**
- Interaction: Both drain each other (mutual destruction)
- Visual: Pulsing connection between them
- TARS: "These dark stars are feeding each other. Addressing one may help both."

**Case: Dark star with no connections**
- Valid: Isolated anti-pattern
- Behavior: No drain effect (nothing to pull from)
- Note: Still needs integration to resolve

**Case: User disputes dark star designation**
- Example: "I don't think this is a dark star"
- Handling: User can override TARS assessment
- Process: Star reverts to DIM, contradiction_count resets
- Note: If pattern recurs, dark star will re-emerge

---

## 3. Invalid Input Handling

| Input | Invalid Values | Handling |
|-------|----------------|----------|
| brightness | < 0 | Clamp to 0.05 |
| brightness | > 1 | Clamp to 1.0 |
| brightness | NaN/null | Error log, use previous value |
| variance | < 0 | Clamp to 0 |
| variance | > 1 | Clamp to 1 |
| state | unknown string | Default to FLICKERING, log error |
| domain | unknown string | Error, reject operation |
| timestamp | future date | Reject, log warning |
| timestamp | > 48h past | Reject retroactive, notify user |
| star_id | non-existent | Error, reject operation |
| connection | to self | Reject, stars can't self-connect |
| connection | duplicate | Ignore, idempotent |

---

## 4. Failure Modes

### 4.1 Network Failure During Check-in

**Impact:** Experiment result not recorded
**Detection:** Client timeout or error response
**Handling:**
1. Queue action locally on device
2. Retry with exponential backoff
3. Sync on reconnect

**User Communication:**
> "We'll sync when you're back online. Your progress is saved locally."

### 4.2 AI Hallucination in Pattern Detection

**Impact:** TARS incorrectly identifies pattern/star
**Detection:** User flags or disputes
**Handling:**
1. User can reject nascent star suggestions
2. User can dispute dark star designation
3. Disputed items go to human review queue (future)

**Prevention:**
- Confidence thresholds for TARS assertions
- Require 3+ evidence points before dark star
- User confirmation before state-changing assertions

### 4.3 Calculation Overflow

**Impact:** Brightness exceeds bounds due to bug
**Detection:** Automated bounds checking
**Handling:** Clamp values, log error
**Prevention:** All calculations wrapped in clamp()

### 4.4 Stale State After Extended Absence

**Impact:** User returns after long absence to corrupted/outdated state
**Detection:** last_engaged > 365 days
**Handling:**
1. Recalculate all stars from last known good state
2. Apply decay for elapsed time
3. Present "welcome back" summary

---

## 5. Gaming Prevention

### 5.1 Clock Manipulation

**Attack:** User changes device time to accelerate decay recovery or reset streaks
**Mitigation:**
- Server-side timestamps only
- Device time used only for display
- All state calculations server-authoritative

### 5.2 Spam Engagement

**Attack:** User rapidly completes many tiny experiments to boost brightness
**Mitigation:**
- MAX_DAILY_IMPACT = 0.15 (hard cap)
- Diminishing returns on same-day experiments
- Quality over quantity messaging from TARS

### 5.3 Contradiction Avoidance

**Attack:** User only logs successes, never admits skips
**Mitigation:**
- TARS asks directly: "Did the experiment happen?"
- Unanswered check-ins count as skips after 24h
- Pattern detection for "always succeeds" (suspiciously consistent)

### 5.4 Multi-Account

**Attack:** User creates fresh account to reset/re-experience
**Mitigation:** None needed
**Rationale:**
- Fresh start is valid user need
- If users are resetting frequently, indicates product issue
- Track as churn metric, not gaming

### 5.5 Social Gaming (Compatibility)

**Attack:** Users share answers to engineer "compatible" constellations
**Mitigation:**
- Compatibility based on actual engagement, not just answers
- Behavioral data (experiments done) weighted heavily
- TARS detects suspiciously identical constellations

---

## 6. Constraints Summary

```
INVARIANTS (must always be true):
- brightness ∈ [0.05, 1.0]
- variance ∈ [0.0, 1.0]
- state ∈ {nascent, flickering, dim, bright, dark, dormant}
- domain ∈ {health, relationships, purpose, wealth, soul}
- connections_per_star ≤ 10
- total_stars ≤ 50 (soft cap, 75 hard cap)
- streak_days ≤ 365

NEVER:
- Delete a star permanently (dormancy only)
- Allow negative brightness
- Process future-dated events
- Trust client timestamps for calculations
- Allow self-referential connections
- Apply decay multiple times per day

ALWAYS:
- Clamp calculated values to valid ranges
- Log boundary violations
- Provide user feedback on rejected actions
- Calculate state after all daily impacts applied
```

---

## 7. Monitoring and Alerts

| Condition | Severity | Action |
|-----------|----------|--------|
| brightness < 0 or > 1 | Error | Fix data, investigate |
| User has 0 stars for > 30 days | Warning | Retention concern |
| All stars DARK | High | Safety check, suggest resources |
| State flip-flops 3x in 7 days | Warning | Possible threshold tuning issue |
| User disputes > 3 TARS assertions | Info | Review TARS accuracy |
| Spillover frequency > 50% | Info | User is maxing out, consider expansion |

---

*SKIN complete. Proceed to MIRROR for simulation.*
