# Experiment Selection - SKIN

**System:** experiment-selection
**Lens:** SKIN (4/7)
**Created:** 2026-01-15
**Status:** Draft
**Depends on:** 01-skeleton.md, 02-blood.md

---

## Overview

This document defines boundaries, edge cases, and failure modes for the experiment selection system. The goal is adversarial: find every way the system can break before users do.

**Philosophy:** The selection system should degrade gracefully, never leave users stuck, and always have a sensible fallback.

---

## 1. Value Bounds

### 1.1 Core Priority Components

| Property | Type | Min | Max | Default | Behavior at Min | Behavior at Max |
|----------|------|-----|-----|---------|-----------------|-----------------|
| priority_score | float | 0.0 | 1.0 | 0.5 | Deprioritized but still selectable | Top candidate |
| star_urgency | float | 0.0 | 1.0 | 0.5 | Dormant star, lowest priority | Critical star, immediate attention |
| capacity_fit | float | 0.0 | 1.0 | 0.5 | User overwhelmed, no experiments | User has full capacity |
| success_probability | float | 0.05 | 0.95 | 0.5 | Near-hopeless but never zero | Near-certain but never guaranteed |

### 1.2 Urgency Modifiers

| Property | Type | Min | Max | Default | Behavior at Bound |
|----------|------|-----|-----|---------|-------------------|
| base_urgency | float | 0.1 | 0.9 | 0.5 | DORMANT state | FLICKERING state |
| trajectory_modifier | float | 0.8 | 1.2 | 1.0 | Rapidly improving | Rapidly declining |
| connection_modifier | float | 0.7 | 1.3 | 1.0 | No connection effects | Multiple urgent connections |
| time_modifier | float | 1.0 | 1.5 | 1.0 | Recent attention | 14+ days neglected |

### 1.3 Capacity Components

| Property | Type | Min | Max | Default | Behavior at Bound |
|----------|------|-----|-----|---------|-------------------|
| energy_level | float | 0.0 | 1.0 | 0.5 | Crisis state, worst time window | Low stress, optimal window |
| time_availability | float | 0.0 | 1.0 | 0.5 | No time available | Abundant time |
| historical_success | float | 0.0 | 1.0 | 0.5 | Never succeeded | Always succeeded |
| load_headroom | float | 0.0 | 1.0 | 1.0 | At max active (3) | No active experiments |
| stress_penalty | float | 0.0 | 0.35 | 0.0 | LOW stress | CRISIS stress |

### 1.4 Success Probability Modifiers

| Property | Type | Min | Max | Default | Behavior at Bound |
|----------|------|-----|-----|---------|-------------------|
| difficulty_modifier | float | 0.6 | 1.1 | 1.0 | STRETCH difficulty | TINY difficulty |
| template_modifier | float | 0.5 | 1.3 | 1.0 | Template always failed | Template always succeeded |
| star_modifier | float | 0.7 | 1.1 | 1.0 | DARK star | BRIGHT star |
| recency_modifier | float | 0.9 | 1.2 | 1.0 | Stale (no recent similar) | Just completed similar |

### 1.5 Connection Bonuses

| Property | Type | Min | Max | Default | Behavior at Bound |
|----------|------|-----|-----|---------|-------------------|
| growth_edge_bonus | float | 0.0 | 0.25 | 0.0 | No GROWTH_EDGE or prereq not met | Strong prereq met |
| resonance_bonus | float | 0.0 | 0.15 | 0.0 | No resonance | Multiple bright resonant partners |
| tension_penalty | float | 0.0 | 0.20 | 0.0 | No tension with active | In tension with active experiment |
| causation_boost | float | 0.0 | 0.10 | 0.0 | Not a cause star | Effect star needs urgent help |
| shadow_mirror_bonus | float | 0.0 | 0.38 | 0.0 | Not shadow or recently surfaced | Shadow neglected 21+ days |

### 1.6 System Limits

| Property | Type | Min | Max | Default | Behavior at Bound |
|----------|------|-----|-----|---------|-------------------|
| active_experiment_count | int | 0 | 3 | 0 | Full capacity for new | No new experiments offered |
| queued_experiment_count | int | 0 | 5 | 0 | Queue empty | Oldest experiments expire |
| modification_count | int | 0 | 2 | 0 | Fresh experiment | Must accept or skip (no more mods) |
| skip_count (consecutive) | int | 0 | unbounded | 0 | No skips | Pivot triggered at 3+ |
| days_since_experiment | int | 0 | unbounded | 0 | Just completed | Long neglect |

### 1.7 Time Constants

| Property | Type | Min | Max | Default | Unit |
|----------|------|-----|-----|---------|------|
| offer_expiry | int | 1 | 168 | 24 | hours |
| queue_expiry | int | 1 | 30 | 7 | days |
| blacklist_duration | int | 7 | 365 | 30 | days |
| grace_period | int | 0 | 24 | 12 | hours |

---

## 2. Edge Case Table (Expanded from SKELETON)

### 2.1 User Has 0 Stars

| Aspect | Detail |
|--------|--------|
| **Input State** | New user, or user deleted all stars |
| **Expected Behavior** | Redirect to Mirror (star creation flow); no experiments offered |
| **Failure Mode** | Algorithm crashes with divide-by-zero or empty iteration |
| **Mitigation** | Pre-check: `if len(stars) == 0: return redirect_to_mirror()` |
| **Edge Variant** | User has 1 star that's DORMANT - treat as "effectively 0" |

### 2.2 All Stars Are BRIGHT and Stable

| Aspect | Detail |
|--------|--------|
| **Input State** | Every star has brightness > 0.7 and stable/rising trajectory |
| **Expected Behavior** | Offer MEDIUM/STRETCH experiments for expansion; don't force engagement |
| **Failure Mode** | Algorithm spams user with maintenance tasks they don't need |
| **Mitigation** | Set `min_urgency_threshold = 0.15` - below this, offer becomes optional |
| **Edge Variant** | User explicitly requests "give me something" - honor request |

### 2.3 All Stars Are DARK

| Aspect | Detail |
|--------|--------|
| **Input State** | Every star has brightness < 0.25 |
| **Expected Behavior** | Activate Sabbatical Mode; single TINY awareness experiment OR pause |
| **Failure Mode** | Algorithm overwhelms user with urgent experiments on all fronts |
| **Mitigation** | `if dark_count / total_count > 0.8: enter_sabbatical_mode()` |
| **Edge Variant** | One bright star remains - focus all selection on that anchor |

### 2.4 User at Max Active + Max Queued

| Aspect | Detail |
|--------|--------|
| **Input State** | 3 active experiments + 5 queued experiments |
| **Expected Behavior** | Discard newly generated experiments; wait for slots to open |
| **Failure Mode** | Memory grows unbounded; stale experiments persist forever |
| **Mitigation** | Hard limit on generation; queue expiry (7 days) enforced |
| **Edge Variant** | User completes 3 experiments same day - batch process queue |

### 2.5 Same Experiment Declined 3x

| Aspect | Detail |
|--------|--------|
| **Input State** | User declined same template+star combo 3 times |
| **Expected Behavior** | Blacklist template for this star for 30 days |
| **Failure Mode** | System keeps offering unwanted experiments; user frustration |
| **Mitigation** | Track decline_count per (template_id, star_id); blacklist at 3 |
| **Edge Variant** | User declines ALL templates for a star - surface the resistance to TARS |

### 2.6 Experiment Completes but Star Doesn't Brighten

| Aspect | Detail |
|--------|--------|
| **Input State** | User marks experiment completed; brightness calculation returns 0 gain |
| **Expected Behavior** | Log for review; still acknowledge completion; investigate template-star alignment |
| **Failure Mode** | User loses motivation; feels system is broken |
| **Mitigation** | Minimum gain floor: `gain = max(calculated_gain, 0.005)` for any completion |
| **Edge Variant** | Daily cap reached - acknowledge but explain gains tomorrow |

### 2.7 User Modifies Experiment 2x Then Wants More

| Aspect | Detail |
|--------|--------|
| **Input State** | modification_count = 2, user requests another modification |
| **Expected Behavior** | Offer choice: accept current implementation OR skip entire experiment |
| **Failure Mode** | Infinite modification loop; experiment never resolves |
| **Mitigation** | Hard cap at 2 modifications; modification_count enforced in state machine |
| **Edge Variant** | First modification was system-suggested (constraint change) - count toward limit anyway |

### 2.8 Two Stars Need Attention Equally

| Aspect | Detail |
|--------|--------|
| **Input State** | Two stars have identical priority_score (within 0.01) |
| **Expected Behavior** | Tie-break: connection bonus > recency > deterministic randomness |
| **Failure Mode** | Non-deterministic selection confuses replay/debugging |
| **Mitigation** | Use seeded random with user_id + date as seed for deterministic daily order |
| **Edge Variant** | Three-way tie - same logic applies iteratively |

### 2.9 Social Experiment Fails Due to External Party

| Aspect | Detail |
|--------|--------|
| **Input State** | "Call mom" experiment - mom didn't answer |
| **Expected Behavior** | Treat as SKIPPED (not FAILED); no user fault penalty |
| **Failure Mode** | User penalized for things outside their control |
| **Mitigation** | Social experiments have `external_dependency = true` flag; different failure handling |
| **Edge Variant** | User didn't even attempt - harder to verify; trust user report |

### 2.10 User Reports Dishonest Completion

| Aspect | Detail |
|--------|--------|
| **Input State** | User marks experiment done but didn't actually do it |
| **Expected Behavior** | Trust user; system self-corrects via non-brightening patterns |
| **Failure Mode** | Gaming the system undermines user's own transformation |
| **Mitigation** | No technical mitigation - psychological safety over enforcement |
| **Edge Variant** | Repeated false completions with no brightness gain - TARS gets curious |

### 2.11 Deadline at 11:59 PM, User Asleep

| Aspect | Detail |
|--------|--------|
| **Input State** | Experiment deadline passes overnight; user sleeping |
| **Expected Behavior** | 12-hour grace period; morning check-in instead of auto-fail |
| **Failure Mode** | Harsh midnight deadline feels punitive |
| **Mitigation** | `actual_deadline = deadline + GRACE_PERIOD` for failure check |
| **Edge Variant** | User has irregular sleep schedule - use their reported sleep window |

### 2.12 User Constraints Change Mid-Experiment

| Aspect | Detail |
|--------|--------|
| **Input State** | Active experiment requires "gym access"; user loses gym membership |
| **Expected Behavior** | Offer modification path; don't auto-fail |
| **Failure Mode** | User stuck with impossible experiment |
| **Mitigation** | Constraint change detection triggers `offer_modification()` |
| **Edge Variant** | Temporary constraint change (traveling) - suggest pause or adapt |

### 2.13 Connection Type Changes While Experiment Active

| Aspect | Detail |
|--------|--------|
| **Input State** | Star A GROWTH_EDGE to Star B; experiment on B active; connection becomes BLOCKS |
| **Expected Behavior** | Complete current experiment normally; future selection affected |
| **Failure Mode** | Retroactive failure feels arbitrary |
| **Mitigation** | Connection effects only apply at selection time, not execution time |
| **Edge Variant** | Connection deleted entirely - same principle; complete current work |

### 2.14 Zero Historical Data for Success Prediction

| Aspect | Detail |
|--------|--------|
| **Input State** | New user with no experiment history |
| **Expected Behavior** | Use DEFAULT_SUCCESS_RATE (0.5) and DEFAULT_BASE_PROB (0.5) |
| **Failure Mode** | Algorithm cannot compute success probability |
| **Mitigation** | All success calculations have fallback defaults |
| **Edge Variant** | User has history but not for this template type - blend with defaults |

### 2.15 Concurrent Experiment Completions

| Aspect | Detail |
|--------|--------|
| **Input State** | User marks 2 experiments complete within seconds |
| **Expected Behavior** | Process sequentially; both contribute to brightness (respecting daily cap) |
| **Failure Mode** | Race condition causes duplicate processing or lost updates |
| **Mitigation** | Use optimistic locking with version numbers; retry on conflict |
| **Edge Variant** | Same experiment marked complete twice - idempotency key prevents double-counting |

---

## 3. Boundary Conditions for Formula Constants

### 3.1 Priority Weights (W_URGENCY, W_CAPACITY, W_SUCCESS)

| Condition | W_URGENCY | W_CAPACITY | W_SUCCESS | Result |
|-----------|-----------|------------|-----------|--------|
| At 0 | 0.0 | 0.35 | 0.25 | Urgency ignored; capacity-driven selection |
| At 1 | 1.0 | 0.0 | 0.0 | Pure urgency; no consideration of whether user can actually do it |
| All 0 | 0.0 | 0.0 | 0.0 | Connection bonus only; essentially random if no connections |
| Sum > 1 | 0.5 | 0.5 | 0.5 | Priority can exceed 1.0 before bonus; clamping saves us |
| Sum < 1 | 0.2 | 0.2 | 0.2 | Priority artificially low; connection bonus has outsized impact |
| Valid | 0.40 | 0.35 | 0.25 | Sum = 1.0; balanced contribution |

**Invariant:** `W_URGENCY + W_CAPACITY + W_SUCCESS = 1.0`

**What breaks outside range:**
- Weights > 1.0 individually: One factor dominates completely
- Weights < 0.0: Inverses the factor (high urgency = low priority)
- Sum != 1.0: Connection bonus has disproportionate influence

### 3.2 GROWTH_EDGE_THRESHOLD (0.65)

| Value | Effect |
|-------|--------|
| 0.0 | Any brightness enables growth edge (too permissive) |
| 0.5 | Dim stars enable growth (maybe acceptable) |
| 0.65 | Only genuinely bright stars enable growth (designed) |
| 0.9 | Only exceptionally bright stars enable (too restrictive) |
| 1.0 | Growth edge never activates (GROWTH_EDGE connection useless) |

**Safe range:** 0.5 to 0.8

### 3.3 BLOCKER_THRESHOLD (0.25)

| Value | Effect |
|-------|--------|
| 0.0 | Only completely dark stars block (BLOCKS never activates) |
| 0.1 | Only deeply dark stars block |
| 0.25 | Dark and very dim stars block (designed) |
| 0.5 | Half the brightness range blocks (too aggressive) |
| 1.0 | All stars block everything (system deadlocks) |

**Safe range:** 0.15 to 0.35

### 3.4 BASE_SKIP_PENALTY (0.008)

| Value | Effect |
|-------|--------|
| 0.0 | Skips have no consequence (no accountability) |
| 0.008 | Mild penalty; ~12 skips to drop a state tier |
| 0.02 | Moderate penalty; ~5 skips to drop a tier |
| 0.05 | Harsh penalty; 2 skips drops a tier |
| 0.1+ | Single skip causes significant damage (punitive) |

**Safe range:** 0.005 to 0.015

### 3.5 TIME_MODIFIER_MAX (1.5)

| Value | Effect |
|-------|--------|
| 1.0 | No urgency boost for neglected stars |
| 1.25 | Moderate boost for neglected (perhaps too mild) |
| 1.5 | Significant boost (designed) |
| 2.0 | Neglected stars dominate selection |
| 3.0+ | Ancient neglect overrides all other factors |

**Safe range:** 1.25 to 1.75

### 3.6 DIFFICULTY_MOD_STRETCH (0.60)

| Value | Effect |
|-------|--------|
| 0.0 | STRETCH experiments never predicted to succeed |
| 0.3 | Very pessimistic about STRETCH |
| 0.60 | Realistic skepticism (designed) |
| 0.85 | STRETCH treated like MEDIUM (underestimates challenge) |
| 1.0+ | STRETCH easier than baseline (inverted logic) |

**Safe range:** 0.4 to 0.7

---

## 4. Degenerate User Cases

### 4.1 New User (0 stars, 0 history)

| Aspect | Detail |
|--------|--------|
| **State** | Just completed onboarding, no Mirror session yet |
| **stars** | [] |
| **experiments** | [] |
| **constraints** | Possibly empty or minimal from intake |
| **Expected** | Redirect to Mirror; cannot run selection |
| **Mitigation** | Guard clause: `if not user.has_stars(): return redirect_mirror()` |
| **Failure if missed** | Division by zero, empty iteration, null reference |

### 4.2 New User with Stars (post-Mirror, 0 history)

| Aspect | Detail |
|--------|--------|
| **State** | Completed Mirror, has 3-7 stars, no experiments yet |
| **stars** | [3-7 stars, all DIM, brightness ~0.3] |
| **experiments** | [] |
| **constraints** | From intake |
| **Expected** | All defaults kick in; success_prob = 0.5, capacity = 0.5 |
| **Mitigation** | All formulas have explicit defaults for missing data |
| **Consideration** | First experiments should be TINY to establish baseline |

### 4.3 Whale User (100+ stars, years of data)

| Aspect | Detail |
|--------|--------|
| **State** | Power user with extensive constellation |
| **stars** | 100+ stars across all domains |
| **experiments** | Thousands of completed experiments |
| **connections** | Hundreds of connections (N^2 problem potential) |
| **Expected** | Selection still runs in reasonable time; UI handles long lists |
| **Failure Mode** | O(N^2) connection checks; slow selection; UI overwhelm |
| **Mitigation** | MAX_STARS_FOR_SELECTION = 20 most urgent; paginate connections |
| **Consideration** | Consider "constellation views" feature for large constellations |

### 4.4 Relapsed User (was engaged, went dormant)

| Aspect | Detail |
|--------|--------|
| **State** | Active for 6 months, then 60 days inactive |
| **stars** | All dimmed or dormant from decay |
| **experiments** | Historical success data exists but stale |
| **Expected** | Gentle re-engagement; don't overwhelm; acknowledge absence |
| **Failure Mode** | Massive urgency spike on all stars; overwhelming |
| **Mitigation** | `if days_inactive > 30: enter_reengagement_mode()` |
| **Reengagement mode** | Single TINY experiment; TARS conversation first; no shame |

### 4.5 All-Dark Constellation

| Aspect | Detail |
|--------|--------|
| **State** | Every star is DARK (brightness < 0.25, negative pattern) |
| **stars** | All showing shadow patterns or avoidance |
| **Expected** | Sabbatical mode; address psychological safety first |
| **Failure Mode** | Algorithm tries to fix everything at once; user despair |
| **Mitigation** | DARK_RATIO_THRESHOLD = 0.8; above triggers sabbatical |
| **Sabbatical options** | Low Gravity (no experiments), One Anchor (single tiny) |

### 4.6 Perfect User (never fails experiments)

| Aspect | Detail |
|--------|--------|
| **State** | 100% completion rate over 50+ experiments |
| **success_probability** | Would calculate to 1.0+ |
| **Expected** | Cap at 0.95; offer STRETCH for challenge |
| **Failure Mode** | Overconfidence; no room for growth |
| **Mitigation** | SUCCESS_PROB_CEILING = 0.95; humility margin |
| **Consideration** | User may be selecting too-easy experiments; suggest difficulty increase |

### 4.7 Failing User (always fails experiments)

| Aspect | Detail |
|--------|--------|
| **State** | 0% completion rate over 10+ experiments |
| **success_probability** | Would calculate to 0.0 |
| **Expected** | Floor at 0.05; investigate root cause; TINY only |
| **Failure Mode** | User gives up; system becomes useless |
| **Mitigation** | SUCCESS_PROB_FLOOR = 0.05; pivot intervention |
| **Investigation** | TARS conversation: constraints wrong? Goals wrong? Life crisis? |

### 4.8 Hyper-Engaged User (multiple experiments per hour)

| Aspect | Detail |
|--------|--------|
| **State** | User completing experiments rapidly throughout day |
| **experiments** | 10+ completions in single day |
| **Expected** | Daily cap limits brightness gain; acknowledge dedication |
| **Failure Mode** | User gaming system OR genuine hypomanic episode |
| **Mitigation** | MAX_DAILY_IMPACT = 0.06; soft warning at high volume |
| **Consideration** | Pattern may indicate manic state - surface gently to TARS |

---

## 5. State Machine Stress Tests

### 5.1 Can You Get Stuck in a State?

| State | Stuck Possible? | Scenario | Resolution |
|-------|-----------------|----------|------------|
| GENERATED | No | Momentary; always transitions immediately | N/A |
| QUEUED | Yes | User never completes active experiments | Queue expiry (7 days) |
| OFFERED | Yes | User ignores app entirely | Offer expiry (24 hours) |
| ACCEPTED | No | Momentary; requires user action to enter | N/A |
| ACTIVE | Yes | User abandons without marking outcome | Deadline + grace period auto-fails |
| MODIFIED | No | Momentary; requires user action to exit | N/A |

**Guaranteed resolution:** Every non-terminal state has a timeout that forces transition to terminal state.

### 5.2 Longest Valid Path

```
GENERATED -> QUEUED (7d) -> OFFERED (24h) -> ACCEPTED -> ACTIVE -> MODIFIED -> ACTIVE -> MODIFIED -> ACTIVE -> FAILED

Maximum duration: 7 days + 24 hours + 48 hours (deadline) + 12 hours (grace) + 2x modification cycles
                  ~9.5 days for single experiment lifecycle
```

**Pathological but valid:**
- User at max active for 7 days (experiments in queue)
- Queue expires just as slot opens (queued experiment offered)
- User accepts after 23.5 hours
- User modifies twice
- Deadline passes during grace period

### 5.3 Infinite Loop Risks

| Risk | Trigger | Prevention |
|------|---------|------------|
| ACTIVE <-> MODIFIED loop | User keeps modifying without committing | modification_count cap (2) |
| Decline -> Offer -> Decline | Same experiment re-offered after decline | Blacklist after 3 declines |
| Generate -> Discard -> Generate | Full queue, constant generation | Generation only runs when slots exist |
| Pivot -> Fail -> Pivot | User fails all pivots | Sabbatical mode after 5 consecutive failures |

**Invariant:** No state transition can return to the same state without user action OR timeout.

### 5.4 Race Conditions

| Scenario | Risk | Mitigation |
|----------|------|------------|
| Multiple experiments completing simultaneously | Duplicate brightness gains | Idempotency keys per completion |
| Experiment expires while user accepting | User thinks accepted, system thinks expired | Optimistic locking; check state before transition |
| Two clients completing same experiment | Double-counting | Unique constraint on (experiment_id, outcome) |
| Queue processed while new experiments generated | Queue inconsistency | Transaction isolation; queue operations atomic |
| Connection changes during selection | Stale connection data used | Refresh connections at start of selection |

**Race condition defense:**
1. Every state transition checks current state matches expected state
2. Idempotency keys prevent duplicate operations
3. Transactions are atomic at experiment level
4. Connection data is snapshotted at selection start

### 5.5 State Corruption Recovery

| Corruption | Detection | Recovery |
|------------|-----------|----------|
| Experiment stuck in ACTIVE past deadline + grace | `active_at + deadline + grace < now()` | Force transition to FAILED |
| Experiment in OFFERED past expiry | `offered_at + offer_expiry < now()` | Force transition to EXPIRED |
| Experiment in QUEUED past expiry | `created_at + queue_expiry < now()` | Force transition to EXPIRED |
| modification_count > 2 but state = MODIFIED | Invalid state | Force modification_count = 2; offer skip |
| active_experiment_count shows 3 but only 2 ACTIVE | Count mismatch | Recount from source; update cache |

**Recovery job:** Runs hourly; scans for stuck/corrupt states; applies corrections; logs anomalies.

---

## 6. Graceful Degradation

### 6.1 User Capacity Cannot Be Computed

| Missing Data | Fallback | Rationale |
|--------------|----------|-----------|
| stress_state unknown | Assume MEDIUM | Conservative middle ground |
| time_availability unknown | Assume 0.5 | Neither abundant nor scarce |
| historical_success unknown | Assume 0.5 (DEFAULT_SUCCESS_RATE) | No bias toward success or failure |
| load_headroom unknown | Count active experiments directly | Derived, not stored |
| day_of_week patterns missing | Use 1.0 modifier | No adjustment |
| optimal windows missing | Use default windows (6-9, 12-14, 18-21) | Standard waking hours |

**Degradation message to TARS:** "I have limited data about your current state. Selections may not be perfectly calibrated - tell me if something feels wrong."

### 6.2 Success Probability Data Missing

| Missing Data | Fallback | Rationale |
|--------------|----------|-----------|
| base_probability (no experiment history) | 0.5 | Assume average |
| template_modifier (no template history) | 1.0 | No adjustment |
| star_modifier (star state unknown) | 1.0 | No adjustment |
| recency_modifier (no similar experiments) | 0.95 | Slight penalty for unknown territory |

**Complete fallback:** `success_probability = 0.5 * difficulty_modifier` when all data missing.

### 6.3 Connection Graph Unavailable

| Scenario | Detection | Fallback |
|----------|-----------|----------|
| Connection service down | Timeout after 2s | Proceed without connection effects |
| Connection data corrupt | Schema validation fails | Proceed without connection effects |
| Connection graph too large | > 1000 edges for user | Sample top 100 by weight |

**No connections mode:**
- Skip all connection bonus calculations
- Skip BLOCKS filter (potentially risky - document)
- Skip TENSION filter
- Log degraded mode for review

**Risk acknowledgment:** Proceeding without BLOCKS filter may offer experiments on blocked stars. Acceptable degradation because BLOCKS situations are rare and consequences are mild (user can decline).

### 6.4 Template Database Empty or Unavailable

| Scenario | Detection | Fallback |
|----------|-----------|----------|
| No templates match constraints | Empty template list returned | Relax constraints iteratively |
| Template service down | Timeout after 2s | Use cached templates (last 24h) |
| Template data corrupt | Schema validation fails | Use cached templates |

**Constraint relaxation order:**
1. Remove time constraints
2. Remove location constraints
3. Remove energy constraints
4. Reduce difficulty (SMALL -> TINY)
5. If still empty: offer "custom experiment" flow with TARS

### 6.5 Star Data Unavailable

| Scenario | Detection | Fallback |
|----------|-----------|----------|
| Star service down | Timeout after 2s | Use cached star states (last 1h) |
| Star state unknown | Null state | Assume DIM (base_urgency = 0.5) |
| Brightness history missing | Empty array | trajectory_modifier = 1.0 |
| Star domain unknown | Null domain | Cannot match templates; skip star |

**Critical dependency:** Star data is required for selection. If completely unavailable:
- Show user: "I can't access your constellation right now. Try again in a few minutes."
- Queue any completed experiments for later processing
- Do not offer new experiments until star data restored

---

## 7. Invalid Input Handling

| Input | Valid Values | Invalid Values | Handling |
|-------|--------------|----------------|----------|
| experiment.state | enum values | null, unknown string | Reject transition; log error |
| experiment.difficulty | TINY, SMALL, MEDIUM, STRETCH | null, numeric, other | Default to SMALL |
| star.brightness | 0.0 to 1.0 | negative, >1.0, null | Clamp to [0.0, 1.0]; null = 0.3 |
| user.stress_state | LOW, MEDIUM, HIGH, CRISIS | null, numeric, other | Default to MEDIUM |
| timestamp | past or current | future | Reject; log warning |
| user_id | valid UUID | null, malformed | Reject request |
| template_id | existing template | null, non-existent | Skip template; log warning |
| implementation_intention | complete (trigger, behavior, location) | partial or null | Cannot activate; prompt completion |

---

## 8. Failure Modes

| Scenario | Impact | Handling | User Communication |
|----------|--------|----------|-------------------|
| Network failure during check-in | Experiment result not recorded | Queue locally; sync on reconnect | "We'll sync when you're back online" |
| Network failure during selection | No experiments offered | Show cached/queued experiments if any | "Having trouble connecting - here's what you were working on" |
| AI hallucination in TARS response | Incorrect pattern identified | User can flag; human review queue | "Something feel off? Let me know." |
| Database corruption | Historical data lost | Restore from backup; acknowledge to user | "We had a technical issue. Some history may be incomplete." |
| Priority calculation overflow | Invalid priority scores | Clamping catches this | Silent handling |
| Concurrent modification conflict | Update lost | Optimistic locking; retry with merged state | Silent retry; no user impact |
| Template-star mismatch | Experiment doesn't affect intended star | Minimum gain floor ensures some progress | "This might not be the perfect fit, but every step counts." |

---

## 9. Gaming Prevention

| Attack Vector | Impact | Mitigation | Detection |
|---------------|--------|------------|-----------|
| Clock manipulation | Accelerate/reset decay | Server-side timestamps only | Client timestamp >> server timestamp |
| Spam completion of TINY experiments | Rapid brightness inflation | MAX_DAILY_IMPACT cap (0.06); diminishing returns | > 10 completions in 1 hour |
| Marking experiments complete without doing them | False progress; undermines transformation | Trust user; self-correcting (no real behavior change = no real results) | Sustained high completion + no life improvement (hard to detect) |
| Creating experiments for easy completion | Gaming difficulty system | Templates are system-defined; user can't create arbitrary experiments | N/A |
| Exploiting connection bonuses | Artificial priority inflation | Connection bonus capped; requires actual bright stars | Connections manipulated without corresponding behavior |
| Multi-account fresh start | New Birth Chart experience | Not harmful; may indicate product issue | Same device/IP, new account |
| Avoiding experiments via constant declining | Never engage with system | Blacklist + pivot; sabbatical mode | Decline rate > 90% over 2 weeks |

---

## 10. Constraints Summary

```
INVARIANTS:
- priority_score in [0.0, 1.0]
- success_probability in [0.05, 0.95]  // Never hopeless, never certain
- active_experiment_count in [0, 3]
- queued_experiment_count in [0, 5]
- modification_count in [0, 2]
- brightness in [0.0, 1.0]
- W_URGENCY + W_CAPACITY + W_SUCCESS = 1.0
- All experiments must target exactly one star
- All experiments must have one implementation intention when ACTIVE

EVENTUALLY TRUE:
- Every QUEUED experiment reaches terminal state within 7 days
- Every OFFERED experiment reaches terminal state within 24 hours
- Every ACTIVE experiment reaches terminal state within deadline + grace period
- Every MODIFIED experiment returns to ACTIVE immediately

NEVER:
- Offer experiments when user has 3 active
- Offer experiments on BLOCKED stars (when BLOCKS is available)
- Allow more than 2 modifications to single experiment
- Delete experiments (terminal states preserved for history)
- Process future-dated events
- Exceed MAX_DAILY_IMPACT for brightness gain

MUST HANDLE:
- 0 stars (redirect to Mirror)
- 0 history (use defaults)
- All stars DARK (sabbatical mode)
- Connection graph unavailable (proceed without connections)
- Network failure (queue locally)
- Race conditions (idempotency + optimistic locking)
```

---

## 11. Test Scenarios for MIRROR

Scenarios to simulate in the next phase:

### Stress Tests
1. 100 stars, 500 connections, all need attention
2. User completes experiment every 5 minutes for 2 hours
3. Connection type changes mid-selection algorithm
4. Network timeout at every API call
5. User at max active + max queued for 30 days

### Edge Cases
1. New user first experiment selection
2. Perfect user (100% success) offered STRETCH
3. Failing user (0% success) offered TINY
4. All stars exactly equal priority
5. Single star with 20 connections, all types represented

### Recovery Tests
1. Experiment stuck in ACTIVE for 7 days
2. Database restored from 24-hour-old backup
3. Connection service returns inconsistent data
4. Template service unavailable for 1 hour

---

*SKIN complete. Proceed to MIRROR for simulation and testing.*
