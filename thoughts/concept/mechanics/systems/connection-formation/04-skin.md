# Connection Formation - SKIN

**System:** connection-formation
**Lens:** SKIN (4/7)
**Created:** 2026-01-15
**Status:** Draft
**Depends on:** 03-nerves.md ✓

---

## Overview

Every system has boundaries. This document defines value ranges, edge cases, failure modes, and gaming prevention for connection formation.

---

## 1. Value Bounds

### 1.1 Connection Strength

| Property | Type | Min | Max | Default | Behavior at Bound |
|----------|------|-----|-----|---------|-------------------|
| strength | float | 0.0 | 1.0 | 0.0 | Clamped (no wrap) |

**At MIN (0.0):**
- Connection dissolves (removed from constellation)
- Evidence history preserved in archive (can reform)
- Rare - usually goes DORMANT before hitting 0

**At MAX (1.0):**
- Core structural connection
- Cannot strengthen further
- Full influence effects apply

**At FLOOR (0.05):**
- Connection goes DORMANT
- Visible as ghost line if user hovers
- Can be reactivated with single evidence

---

### 1.2 Evidence Count

| Property | Type | Min | Max | Default | Behavior at Bound |
|----------|------|-----|-----|---------|-------------------|
| evidence_count | int | 0 | ∞ | 0 | Uncapped |
| effective_evidence | float | 0 | 15 | 0 | Caps for state calculation |

**At MIN (0):**
- NASCENT state (or dissolved if strength also 0)

**Effective cap (15):**
- Beyond 15, evidence count still tracks but doesn't affect state
- Prevents "super-strong" connections with different rules

---

### 1.3 Confidence

| Property | Type | Min | Max | Default | Behavior at Bound |
|----------|------|-----|-----|---------|-------------------|
| confidence | float | 0.0 | 1.0 | 0.0 | Clamped |

**At MIN (0.0):**
- TARS uncertain about connection
- Won't surface to user
- Needs more evidence

**At MAX (1.0):**
- User-confirmed connection
- High reliability
- Featured in insights

---

### 1.4 Connection Limits

| Property | Type | Min | Max | Default | Notes |
|----------|------|-----|-----|---------|-------|
| connections_per_star | int | 0 | 10 | 0 | Soft cap |
| total_connections | int | 0 | 100 | 0 | Per constellation |
| concurrent_forming | int | 0 | 5 | 0 | Nascent + Forming limit |

---

## 2. Edge Cases

### 2.1 Strength Boundaries

**Case: strength drops to 0**
- Trigger: Complete evidence decay + no engagement
- Resolution: Connection dissolves, metadata archived
- Re-formation: If same stars, new connection starts fresh but inherits type hint

**Case: strength exactly at state boundary (0.4, 0.6, 0.8)**
- Question: Which state?
- Resolution: Inclusive upward (0.4 = WEAK, 0.6 = MODERATE, 0.8 = STRONG)

**Case: strength gain would exceed 1.0**
- Trigger: Strong evidence + already at 0.95
- Resolution: Clamp to 1.0, no spillover to other connections

---

### 2.2 State Transition Boundaries

**Case: Rapid state changes in same day**
- Trigger: Multiple evidence types processed
- Prevention: State calculated once per day (end of day)
- Visual: Connection appearance doesn't flicker

**Case: Connection formed between DORMANT stars**
- Question: Can dormant stars form new connections?
- Resolution: No - reactivate star first, then connection can form
- Rationale: Dormant means "not currently in play"

**Case: Connection type changes**
- Trigger: Correlation shifts from positive to negative
- Resolution: Type can change on re-evaluation (every 7 days)
- Visual: Type change is animated (line color shifts)
- History: Previous type noted in metadata

---

### 2.3 Connection Count Boundaries

**Case: Star has 0 connections**
- Valid: Newly formed or isolated star
- Visual: Standalone, no lines
- Note: Isolated stars have no spillover support

**Case: Star at max connections (10)**
- Trigger: TARS or user tries to add 11th
- Resolution: Must remove existing connection first
- UI: "This star has maximum connections. Which should we replace?"
- TARS: Won't suggest connections to maxed-out stars

**Case: Two stars would exceed limit with new connection**
- Example: Star A has 10, Star B has 8, try to connect
- Resolution: Check both stars; reject if either at max
- Message: "Star [name] has too many connections"

**Case: User has 100+ connections total**
- Trigger: Long-term engaged user
- Handling: Soft cap - new connections form slower (0.5x rate)
- TARS: Suggests consolidating dormant connections
- Hard cap: 150 connections (UI/performance limit)

---

### 2.4 Connection Type Edge Cases

**Case: Equal correlation in both directions**
- Trigger: Resonance detection with r = 0.5 exactly
- Resolution: Use RESONANCE (default positive interpretation)

**Case: Both positive correlation AND temporal causation detected**
- Example: Stars correlate AND A→B sequence exists
- Resolution: Priority order - user_assigned > BLOCKS > SHADOW_MIRROR > CAUSATION > GROWTH_EDGE > TENSION > RESONANCE
- In this case: CAUSATION wins (more specific)

**Case: User assigns type that contradicts data**
- Example: User says "tension" but correlation is +0.7
- Resolution: User type wins, but TARS may note discrepancy
- TARS: "You see this as tension. The data shows they often rise together. What's your experience?"

**Case: BLOCKS connection but blocked star reaches BRIGHT anyway**
- Question: Should this be possible?
- Resolution: No - BLOCKS enforces max cap
- Edge: If user breaks through via direct massive effort, BLOCKS weakens

---

### 2.5 Evidence Edge Cases

**Case: Same evidence claimed for multiple connections**
- Example: "I exercised" affects Health star AND Purpose star (exercise as purpose)
- Resolution: Evidence counts for all relevant connections
- Weight: Full weight to primary, 0.5× to secondary connections

**Case: Contradictory evidence in same session**
- Example: Co-mention positive, then user says "not connected"
- Resolution: User denial overrides, strength -= 0.15

**Case: Evidence age > EVIDENCE_HALF_LIFE**
- Trigger: Old evidence still in list
- Resolution: Contributes 0.5× to calculations
- Beyond 2× half-life: Contributes 0 (but stays in history)

**Case: Retroactive evidence entry**
- Trigger: "I realized these were connected yesterday"
- Resolution: Allow within 48h window only
- Beyond 48h: Note added but doesn't affect strength

---

### 2.6 Dark Star Connection Edge Cases

**Case: SHADOW_MIRROR between two DARK stars**
- Valid: Represents competing anti-patterns
- Behavior: Mutual drain (both pull from each other)
- Visual: Pulsing purple line between them
- TARS: "These shadow patterns are intertwined"

**Case: DARK star gains BLOCKS connection**
- Question: Can a dark star block another star?
- Resolution: Yes - dark patterns can create blocks
- Example: "Fear of Failure" (DARK) blocks "Creative Expression" (DIM)

**Case: Integrating dark star with connections**
- Trigger: Dark star transitions to DIM
- Effect: SHADOW_MIRROR connections become RESONANCE
- BLOCKS from dark star weaken by 50%

---

### 2.7 Time Boundaries

**Case: User inactive for 1+ year**
- All connections: DORMANT (strength at FLOOR)
- Re-engagement: Any reactivated star can reactivate its connections
- Connection types: Preserved

**Case: Evidence timing spans timezone change**
- Resolution: All timestamps are UTC server-side
- Display: Local time for user
- Calculation: UTC for consistency

**Case: Concurrent evidence from multiple devices**
- Trigger: User logs on phone and laptop simultaneously
- Resolution: Deduplicate by timestamp (±5 second window)
- Both count: If timestamps differ by >5 seconds

---

## 3. Invalid Input Handling

| Input | Invalid Values | Handling |
|-------|----------------|----------|
| strength | < 0 | Clamp to 0, log error |
| strength | > 1 | Clamp to 1 |
| strength | NaN/null | Error log, use 0 (dissolve) |
| type | unknown string | Default to RESONANCE, log warning |
| type | null | Calculate from data |
| star_a_id | non-existent | Reject operation, error |
| star_b_id | non-existent | Reject operation, error |
| star_a_id = star_b_id | Self-connection | Reject, log warning |
| evidence.timestamp | future | Reject evidence |
| evidence.timestamp | > 48h past | Accept but don't affect strength |
| direction | invalid enum | Default to 'bidirectional' |
| connection_id | duplicate | Idempotent (no-op) |

---

## 4. Failure Modes

### 4.1 Correlation Calculation Failure

**Impact:** Can't determine connection type
**Detection:** Insufficient data points (< MIN_OBSERVATIONS)
**Handling:**
1. Default to RESONANCE (neutral positive)
2. Mark confidence = 0.3 (low)
3. Re-evaluate after more data

**User Communication:**
> "I see a connection forming, but I need more observations to understand it."

### 4.2 Evidence Loss During Sync

**Impact:** Evidence not recorded, connection doesn't strengthen
**Detection:** Client timeout, sync failure
**Handling:**
1. Queue evidence locally
2. Retry with exponential backoff
3. Merge on reconnect (timestamp-based)

**Prevention:**
- Optimistic UI update
- Background sync
- Conflict resolution prefers newer timestamp

### 4.3 Circular Influence Cascade

**Impact:** Spillover/drain creates infinite loop
**Detection:** Effect propagation > 3 hops
**Handling:**
1. Cap propagation at 3 hops
2. Each hop reduces effect by 50%
3. Same connection can't be traversed twice in one cascade

**Example:**
```
A → B → C → A (circular)
Spillover from A:
  B gets 15%
  C gets 15% × 50% = 7.5%
  A gets 7.5% × 50% = 3.75% (STOPS, back to origin)
```

### 4.4 Type Flip-Flop

**Impact:** Connection type changes repeatedly, confusing user
**Detection:** Type changed 2+ times in 14 days
**Handling:**
1. Lock type for 14 days after change
2. Log as potential data quality issue
3. TARS acknowledges: "This connection is complex - it shows different patterns"

---

## 5. Gaming Prevention

### 5.1 Evidence Spam

**Attack:** User rapidly logs many co-mentions to boost connection
**Mitigation:**
- MAX_DAILY_STRENGTH_GAIN = 0.15 (hard cap)
- Diminishing returns: E₁ + (E₂ × 0.6) + (E₃ × 0.3)
- Same source can't provide evidence twice in 24h

### 5.2 Connection Farming

**Attack:** User creates many weak connections to boost overall "connected" score
**Mitigation:**
- No "total connection score" metric visible to user
- Quality metrics focus on MODERATE+ connections only
- TARS doesn't reward connection quantity

### 5.3 Type Manipulation

**Attack:** User assigns types to engineer desired compatibility
**Mitigation:**
- User-assigned types have confidence cap (0.8)
- System can override if evidence strongly contradicts
- Compatibility uses computed types, not user-assigned

### 5.4 Evidence Backdating

**Attack:** User claims "I realized yesterday these were connected"
**Mitigation:**
- 48h window for retroactive evidence
- Beyond 48h: metadata only, no strength impact
- Server-side timestamp for all calculations

### 5.5 Connection Deletion Gaming

**Attack:** User deletes and recreates connections to reset strength/type
**Mitigation:**
- Deleted connections enter 7-day cooldown
- Recreation within cooldown inherits previous strength × 0.5
- Type history influences new type detection

---

## 6. Constraints Summary

```
INVARIANTS (must always be true):
- strength ∈ [0.0, 1.0]
- state ∈ {nascent, forming, weak, moderate, strong, dormant}
- type ∈ {resonance, tension, causation, growth_edge, shadow_mirror, blocks}
- direction ∈ {bidirectional, a_to_b, b_to_a}
- connections_per_star ≤ 10
- total_connections ≤ 150
- star_a ≠ star_b (no self-connections)
- both stars must be non-dormant for connection to be active

NEVER:
- Allow negative strength
- Create self-referential connections
- Trust client timestamps for calculations
- Process future-dated evidence
- Allow cascade propagation > 3 hops
- Delete connection history permanently (archive only)

ALWAYS:
- Clamp calculated values to valid ranges
- Log boundary violations
- Preserve connection type history
- Check both stars' connection limits
- Apply evidence diminishing returns
- Re-evaluate type periodically (7 days)
```

---

## 7. Monitoring and Alerts

| Condition | Severity | Action |
|-----------|----------|--------|
| strength < 0 or > 1 | Error | Fix data, investigate |
| Type flip-flops 3x in 30 days | Warning | Review detection algorithm |
| Connection count > 100 | Info | Consider UX for dense graphs |
| All connections DORMANT | Warning | User disengagement concern |
| BLOCKS connection unaddressed > 60d | Info | TARS should surface |
| Circular cascade detected | Debug | Log for performance analysis |
| Evidence rejected (> 48h) frequently | Info | User may want longer window |
| Same-second duplicate evidence | Debug | Possible sync issue |

---

## 8. Special Cases

### 8.1 Excavation Period (Day 1-7)

During the 7-day mirror phase, special rules apply:

```
MODIFIED CONSTRAINTS:
- EVIDENCE_FOR_FORMING = 1 (vs normal 2)
- Decay rate = 0.5× (connections form easily)
- MAX_CONCURRENT_FORMING = 10 (vs normal 5)
- Type detection confidence boosted 1.5×
```

Rationale: User should see rich constellation structure emerge during excavation.

### 8.2 Compatibility Mode

When viewing another user's constellation:

```
VISIBILITY RULES:
- Only WEAK+ connections visible
- Types shown but strength hidden
- Evidence details private
- User can choose to share more
```

---

*SKIN complete. Proceed to MIRROR for simulation.*
