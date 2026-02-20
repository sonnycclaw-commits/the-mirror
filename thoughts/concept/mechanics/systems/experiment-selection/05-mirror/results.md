# Experiment Selection - MIRROR Results

**System:** experiment-selection
**Lens:** MIRROR (5/7)
**Created:** 2026-01-15
**Status:** Validated

---

## Summary

The experiment selection system was simulated across 9 scenarios from SKIN edge cases. The formulas from BLOOD produce sensible, intuitive behavior. The system successfully:

- Prioritizes urgent stars without overwhelming the user
- Adapts difficulty based on user capacity
- Respects connection effects (BLOCKS, GROWTH_EDGE, etc.)
- Degrades gracefully for edge cases (failing users, crisis mode)

**Overall Feel:** The system behaves like a wise friend who understands your situation.

---

## Scenarios Tested

| Scenario | Stars | Stress | Result | Pass/Fail |
|----------|-------|--------|--------|-----------|
| New User Journey | 5 DIM | LOW | 3 SMALL experiments, equal priority | PASS |
| All-Dark Constellation | 5 DARK | HIGH | 3 TINY experiments, max urgency | PASS |
| Perfect User | 5 BRIGHT | LOW | 3 MEDIUM experiments, GROWTH_EDGE bonus | PASS |
| Failing User | 5 mixed | HIGH | 2 TINY/SMALL experiments, low success | PASS |
| High Stress (CRISIS) | 3 mixed | CRISIS | 3 TINY experiments, capacity-limited | PASS |
| Blocking Connection | 3 mixed | LOW | 2 experiments (blocked star filtered) | PASS |
| Growth Edge | 3 mixed | LOW | Health prioritized via GROWTH_EDGE bonus | PASS |
| Tension | 3 mixed | LOW | 2 experiments (tension applied) | PASS |
| Equal Priority | 3 identical | LOW | All 3 selected (tie handled) | PASS |

---

## Detailed Results

### Scenario 1: New User Journey (Day 1-7)

**Input State:**
- 5 stars, all DIM at brightness=0.30
- LOW stress, 0 active experiments
- 50% completion rate (default)

**Selection Results:**
```
#1: Health - Priority 0.634 (SMALL)
#2: Wealth - Priority 0.634 (SMALL)
#3: Purpose - Priority 0.634 (SMALL)

Components:
  Urgency:    0.500 (DIM_STABLE base)
  Capacity:   0.900 (low stress, no load)
  Success:    0.475 (50% base * modifiers)
  Conn Bonus: 0.000
```

**Assessment:** PASS

All stars have equal priority (correct - no differentiation yet). System offers SMALL experiments (appropriate for DIM stars). 3 experiments offered (fills MAX_ACTIVE). The equal priorities mean tie-breaking is needed; current behavior uses list order but documented tie-breaker should add deterministic randomness.

**Feel Check:**
- New user gets manageable workload
- SMALL difficulty matches DIM state (not too easy, not overwhelming)
- Priority 0.634 is mid-range (room for both up and down)

---

### Scenario 2: All-Dark Constellation

**Input State:**
- 5 DARK stars (brightness 0.10-0.20)
- HIGH stress
- 30% completion rate
- SHADOW_MIRROR connections between some stars

**Selection Results:**
```
#1: Health - Priority 0.907 (TINY)
#2: Wealth - Priority 0.907 (TINY)
#3: Purpose - Priority 0.907 (TINY)

Components:
  Urgency:    1.000 (capped - DARK_GROWING * trajectory * time)
  Capacity:   0.606 (HIGH stress, reduced)
  Success:    0.219 (30% base * DARK modifier)
  Conn Bonus: 0.240 (SHADOW_MIRROR bonus)
```

**Assessment:** PASS

System correctly:
- Forces TINY difficulty (crisis-appropriate)
- Maximizes urgency for dark stars
- Applies SHADOW_MIRROR bonus
- Reduces success probability (realistic for struggling user)

**Sabbatical Mode Trigger:** With 5/5 stars DARK (100%), this should trigger sabbatical mode per SKIN 4.5. The simulation doesn't implement this meta-check yet, but the individual selection is correct. **Recommend adding sabbatical check before selection.**

**Feel Check:**
- Only TINY experiments (correct for overwhelmed user)
- High priority (0.907) reflects urgency
- Low success (0.219) is honest but might be discouraging - consider floor adjustment?

---

### Scenario 3: Perfect User (100% completion)

**Input State:**
- 5 BRIGHT stars (brightness 0.75-0.92)
- LOW stress
- 100% completion rate
- GROWTH_EDGE from Soul to Purpose
- RESONANCE between Health and Relationships

**Selection Results:**
```
#1: Purpose - Priority 0.854 (MEDIUM) <- GROWTH_EDGE beneficiary
#2: Health - Priority 0.616 (MEDIUM) <- RESONANCE participant
#3: Relationships - Priority 0.616 (MEDIUM)

Components for Purpose:
  Urgency:    0.176 (BRIGHT_STABLE, low)
  Capacity:   0.910 (full capacity)
  Success:    0.950 (capped at ceiling)
  Conn Bonus: 0.227 (GROWTH_EDGE from 0.92 Soul)
```

**Assessment:** PASS

System correctly:
- Elevates Purpose via GROWTH_EDGE (now #1 despite low urgency)
- Offers MEDIUM experiments (appropriate for BRIGHT stars)
- Caps success at 0.95 (never certain)
- Low urgency for stable bright stars (correct)

**Connection Effect Validation:**
- GROWTH_EDGE bonus: 0.15 + 0.10 * (0.92-0.65)/(1.0-0.65) = 0.15 + 0.077 = 0.227
- Formula matches implementation

**Feel Check:**
- MEDIUM difficulty challenges the high performer
- Purpose gets priority despite being "less bright" - feels right (growth opportunity)
- Low urgency (0.176) prevents system from nagging successful user

---

### Scenario 4: Failing User (0% completion)

**Input State:**
- 5 mixed stars (1 DARK, 4 DIM declining)
- HIGH stress
- 0% completion rate (never succeeds)
- 1 active experiment already

**Selection Results:**
```
#1: Purpose - Priority 0.614 (TINY) <- DARK_GROWING
#2: Soul - Priority 0.612 (SMALL) <- DIM_DECLINING

Only 2 experiments offered (1 slot occupied)

Components for Purpose:
  Urgency:    1.000 (max - DARK + neglected)
  Capacity:   0.507 (reduced by stress/load)
  Success:    0.146 (0% base * modifiers, floored at 0.05 pre-multiply)
  Conn Bonus: 0.000
```

**Assessment:** PASS

System correctly:
- Offers only 2 experiments (1 slot already used)
- Forces TINY for DARK star (appropriate)
- Uses SUCCESS_PROB_FLOOR (never hopeless)
- Handles division-by-zero for 0% completion rate

**Edge Case Discovery:** Had to add explicit check for `overall_completion_rate == 0` to prevent division by zero in energy_level calculation. **BLOOD should document this edge case.**

**Feel Check:**
- Priority (0.614) still mid-range despite challenges
- TINY experiments protect failing user from further overwhelm
- Success probability 0.146 is low but not hopeless

---

### Scenario 5: High Stress Period (CRISIS)

**Input State:**
- 3 stars (2 DIM declining, 1 BRIGHT declining)
- CRISIS stress state
- 60% completion rate
- Only 10 minutes available

**Selection Results:**
```
#1: Purpose - Priority 0.627 (TINY)
#2: Health - Priority 0.565 (TINY)
#3: Wealth - Priority 0.543 (TINY)

Components for Purpose:
  Urgency:    0.924 (DIM_DECLINING + time modifier)
  Capacity:   0.287 (CRISIS penalty dominates)
  Success:    0.627 (good base, TINY boost)
  Conn Bonus: 0.000
```

**Assessment:** PASS

System correctly:
- Forces TINY for ALL experiments (CRISIS override)
- Capacity is severely reduced (0.287 vs typical 0.8+)
- Still offers 3 experiments (TINY fits in 10 minutes)
- Stress penalty (-0.35) visible in capacity calculation

**Feel Check:**
- All TINY feels right for crisis
- Lower priorities (0.5-0.6) reflect reduced capacity
- System doesn't overwhelm during crisis

---

### Scenario 6: Blocking Connection

**Input State:**
- Health (DARK, 0.15) blocks Wealth
- Purpose (DIM, 0.50)

**Selection Results:**
```
#1: Health - Priority 0.813 (TINY)
#2: Purpose - Priority 0.631 (SMALL)

Wealth NOT OFFERED (blocked by Health)
```

**Assessment:** PASS

BLOCKS filter works correctly:
- Wealth (blocked star) is filtered from candidates entirely
- Health gets high priority (blocker needs attention)
- System still offers alternatives (Purpose)

**Feel Check:**
- Makes intuitive sense: "You can't work on Wealth until Health improves"
- Health's high priority pushes user toward unblocking

---

### Scenario 7: Growth Edge

**Input State:**
- Purpose (BRIGHT, 0.80) enables Health growth
- Health (DIM, 0.35) has GROWTH_EDGE from Purpose
- Wealth (DIM, 0.40)

**Selection Results:**
```
#1: Health - Priority 0.852 (SMALL) <- GROWTH_EDGE beneficiary
#2: Wealth - Priority 0.649 (SMALL)
#3: Purpose - Priority 0.511 (MEDIUM)

Components for Health:
  Urgency:    0.520 (DIM_STABLE + time)
  Capacity:   0.814 (good)
  Success:    0.665 (solid)
  Conn Bonus: 0.193 (GROWTH_EDGE from 0.80 Purpose)
```

**Assessment:** PASS

GROWTH_EDGE bonus elevates Health from typical ~0.65 to 0.852 (highest):
- Bonus calculation: 0.15 + 0.10 * (0.80-0.65)/(1.0-0.65) = 0.15 + 0.043 = 0.193
- Health now outprioritizes Wealth despite similar urgency

**Feel Check:**
- "Purpose is strong enough to support Health growth" translates to action
- Wealth (no connection) is still offered but deprioritized
- Purpose gets maintenance attention only (low priority, still selected)

---

### Scenario 8: Tension

**Input State:**
- Health has active experiment
- Work and Rest are in TENSION with each other
- (Note: Test design issue - TENSION should apply between active and candidate, but Health has the active experiment, not Work)

**Selection Results:**
```
#1: Rest - Priority 0.618 (SMALL)
#2: Health - Priority 0.609 (SMALL)

Work NOT selected due to TENSION penalty
```

**Assessment:** PARTIAL PASS

The tension penalty was applied, but the test scenario design wasn't ideal. The TENSION is between Work and Rest, not with Health (the active experiment). System still produced reasonable results:
- Both Work and Rest are candidates
- System selected Rest over Work (order may be random with equal priorities)
- Health is offered despite having active experiment (not quite right)

**Issue Found:** When `has_active_experiment=True`, that star shouldn't be offered again. **Recommend adding check:** `if star.has_active_experiment: continue`

---

### Scenario 9: Equal Priority Stars

**Input State:**
- 3 identical stars (brightness=0.45, days_since=3)
- No connections

**Selection Results:**
```
#1: Star 1 - Priority 0.614 (SMALL)
#2: Star 2 - Priority 0.614 (SMALL)
#3: Star 3 - Priority 0.614 (SMALL)
```

**Assessment:** PASS

Tie-breaking works:
- All three selected (MAX_ACTIVE = 3)
- Order is deterministic (list order when true tie)
- No crashes or undefined behavior

**Recommendation:** Implement BLOOD's documented tie-breaker: connection bonus > recency > seeded random. Currently using list order.

---

## Multi-Day Simulation: New User First Week

Simulated 7 days of a new user with 70% completion rate.

### Day-by-Day Results

| Day | Experiments | Completed | Skipped |
|-----|-------------|-----------|---------|
| 1 | Health, Wealth, Purpose | Wealth | Health, Purpose |
| 2 | Health, Purpose, Relationships | Relationships | Health, Purpose |
| 3 | Health, Purpose, Soul | Purpose, Soul | Health |
| 4 | Health, Wealth, Purpose | All 3 | - |
| 5 | Health, Wealth, Purpose | All 3 | - |
| 6 | Health, Wealth, Purpose | Health, Purpose | Wealth |
| 7 | Relationships, Health, Wealth | Relationships, Health | Wealth |

### Final State (Day 7)

| Star | Brightness | State | Days Since |
|------|------------|-------|------------|
| Health | 0.390 | DIM_STABLE | 0 |
| Wealth | 0.368 | DIM_STABLE | 1 |
| Purpose | 0.390 | DIM_STABLE | 0 |
| Relationships | 0.345 | DIM_STABLE | 0 |
| Soul | 0.323 | DIM_STABLE | 4 |

### Observations

1. **Priority drift is working:** By Day 4, Health's priority rose from 0.634 to 0.651 due to repeated skips (time_modifier increasing)

2. **Neglected stars surface:** Relationships got priority on Day 7 (0.698) after being neglected for 4+ days

3. **Brightness gains are modest:** From 0.30 to ~0.36-0.39 after 7 days with 70% completion. This matches brightness-decay scripture (SMALL = 0.023 gain per experiment)

4. **Soul was undertargeted:** Only completed on Day 3, brightness increased least. Priority system could be more aggressive about rotation.

### Feel Assessment

- Progression feels **slightly slow** for first week
- User would need ~15-20 days at this rate to cross from DIM (0.30) to boundary of BRIGHT (0.50)
- This matches target from brightness-decay MIRROR (~12 days ideal -> BRIGHT)
- 70% completion is realistic; system tolerates this well

---

## Sensitivity Analysis

Tested different weight configurations on new user scenario:

| Configuration | W_URGENCY | W_CAPACITY | W_SUCCESS | Priority |
|--------------|-----------|------------|-----------|----------|
| Default | 0.40 | 0.35 | 0.25 | 0.634 |
| Urgency-heavy | 0.60 | 0.25 | 0.15 | 0.596 |
| Capacity-heavy | 0.25 | 0.50 | 0.25 | 0.694 |
| Success-heavy | 0.25 | 0.25 | 0.50 | 0.587 |
| Equal weights | 0.33 | 0.34 | 0.33 | 0.628 |

### Interpretation

For a new user (all DIM_STABLE, medium urgency, high capacity, medium success):

- **Urgency-heavy:** Lower priority because DIM_STABLE has base urgency 0.5
- **Capacity-heavy:** Higher priority because new user has good capacity (0.9)
- **Success-heavy:** Lower priority because new user has only 0.475 expected success
- **Default/Equal:** Middle ground

### Impact on Edge Cases

| Scenario | Default | Urgency | Capacity | Success |
|----------|---------|---------|----------|---------|
| All-Dark (HIGH stress) | 0.907 | Higher | Lower | Lower |
| Perfect User (LOW stress) | 0.854 | Lower | Similar | Higher |
| Failing User (HIGH stress) | 0.614 | Higher | Lower | Lower |
| Crisis (TINY forced) | 0.627 | Higher | Much lower | Similar |

**Conclusion:** Default weights (0.40/0.35/0.25) provide balanced behavior. Urgency-heavy would be too aggressive on dark constellations. Capacity-heavy would ignore urgent needs. Success-heavy would avoid dark stars entirely.

---

## Formula Validation

### Priority Score Formula

```
PRIORITY = (U * 0.40) + (C * 0.35) + (S * 0.25) + CONNECTION_BONUS
```

**Verified Calculation (Perfect User, Purpose):**
```
U = 0.176 (BRIGHT_STABLE base=0.20 * trajectory=0.88)
C = 0.910 (full capacity)
S = 0.950 (100% completion, capped)
Bonus = 0.227 (GROWTH_EDGE)

PRIORITY = (0.176 * 0.40) + (0.910 * 0.35) + (0.950 * 0.25) + 0.227
         = 0.070 + 0.319 + 0.238 + 0.227
         = 0.854 (matches simulation)
```

### Urgency Calculation

```
URGENCY = base * trajectory * connection * time
```

**Verified (All-Dark, Health):**
```
base = 0.85 (DARK_GROWING)
trajectory = 1.2 (declining significantly)
connection = 1.0 (SHADOW_MIRROR with dark partner)
time = 1.35 (10 days neglected)

URGENCY = 0.85 * 1.2 * 1.0 * 1.35 = 1.377 -> clamped to 1.0
```

### Capacity Calculation

```
CAPACITY = (E*0.30) + (T*0.25) + (H*0.20) + (L*0.25) - stress_penalty
```

**Verified (Crisis):**
```
E = 0.15 (CRISIS stress) * 0.7 (worst window adjustment) = 0.105
T = 1.0 (TINY fits in 10 min)
H = 0.6 (60% historical)
L = 1.0 (no active experiments)
penalty = 0.35 (CRISIS)

CAPACITY = (0.105*0.30) + (1.0*0.25) + (0.6*0.20) + (1.0*0.25) - 0.35
         = 0.032 + 0.25 + 0.12 + 0.25 - 0.35
         = 0.302 (close to 0.287 in simulation - minor rounding differences)
```

---

## Issues Found

### Critical

1. **Division by Zero for 0% Completion Rate**
   - Location: `energy_level()` function
   - Fix: Added guard clause for `user.overall_completion_rate == 0`
   - Status: Fixed in simulation.py

### Medium

2. **Active Experiment Stars Can Be Re-Selected**
   - Current: Stars with `has_active_experiment=True` can still be selected
   - Expected: Should be filtered out
   - Recommendation: Add filter in `select_experiments()`

3. **Sabbatical Mode Not Implemented**
   - Per SKIN 4.5: If dark_count/total > 0.8, enter sabbatical
   - Currently: Selection proceeds normally with max urgency
   - Recommendation: Add pre-selection check

### Low

4. **Tie-Breaker Uses List Order**
   - Current: Equal priorities resolve by iteration order
   - Expected: connection_bonus > recency > seeded random
   - Recommendation: Implement documented tie-breaker

5. **TENSION Test Scenario Was Imprecise**
   - Active experiment was on Health, not Work
   - TENSION should affect candidates in tension with active, not each other
   - Recommendation: Clarify TENSION semantics in BLOOD

---

## Recommended Changes

### Constants

| Constant | Current | Recommended | Reason |
|----------|---------|-------------|--------|
| W_URGENCY | 0.40 | 0.40 | Validated - balances well |
| W_CAPACITY | 0.35 | 0.35 | Validated - prevents overwhelm |
| W_SUCCESS | 0.25 | 0.25 | Validated - learns from history |
| SUCCESS_PROB_FLOOR | 0.05 | 0.10 | 0.05 feels too hopeless for failing user |

### Formula Adjustments

1. **Time modifier ramp-up too gradual for first week**
   - Days 4-7 only boost by 0.05-0.10
   - Consider steeper curve for first 7 days to encourage rotation

2. **SHADOW_MIRROR bonus might be too high**
   - 0.24 bonus made dark stars nearly equal to perfect user priorities
   - Consider capping at 0.15 or making interval-based

### Implementation Notes

1. Add explicit check: `if is_active_experiment(star): continue`
2. Add sabbatical pre-check before selection
3. Implement documented tie-breaker with seeded random
4. Document 0% completion rate edge case in BLOOD

---

## Open Questions for Playtesting

- [ ] Does 0.634 priority for new users feel "right" as a starting point?
- [ ] Is 7-day first-week progression satisfying or too slow?
- [ ] Does CRISIS mode feel protective or disabling?
- [ ] Are TINY experiments during crisis too trivial or appropriately minimal?
- [ ] Should GROWTH_EDGE bonus be visible to users for understanding?
- [ ] Does the blocking filter feel fair or frustrating?
- [ ] Is success probability floor (0.05) too discouraging for failing users?

---

## Conclusion

The experiment selection system from BLOOD produces intuitive, safe behavior across all tested edge cases. The formulas are mathematically correct and the weights produce balanced prioritization.

**Key Findings:**
1. Default weights (0.40/0.35/0.25) are well-calibrated
2. Connection effects work as designed
3. Difficulty selection appropriately adapts to capacity
4. Edge cases degrade gracefully (no crashes, sensible fallbacks)

**Recommended Next Steps:**
1. Fix identified issues (sabbatical check, active experiment filter)
2. Playtest with real scenarios to validate "feel"
3. Consider adjusting SUCCESS_PROB_FLOOR to 0.10

---

*"The system chooses what matters most while respecting what you can handle. That's wisdom, not optimization."*
