# Connection Formation - MIRROR Results

**System:** connection-formation
**Lens:** MIRROR (5/7)
**Created:** 2026-01-15
**Status:** Draft - Tuning Required
**Depends on:** 04-skin.md ✓

---

## Scenarios Tested

| Scenario | Days | Final Strength | Final State | Pass/Fail |
|----------|------|----------------|-------------|-----------|
| Organic Formation | 60 | 0.81 | STRONG | ✓ |
| User Created | 30 | 0.53 | WEAK | ✗ (too slow) |
| Neglected Decay | 60 | 0.32 | DORMANT | ✓ |
| Evidence Spam | 7 | 0.91 | STRONG | ✓ (7 days) |
| Excavation Boost | 14 | 0.77 | MODERATE | ✓ |
| Reactivation | 90 | 0.68 | MODERATE | ✓ |

---

## Detailed Results

### Scenario 1: Organic Formation (60 days)

**Pattern:** Gradual evidence accumulation through natural use

```
Day  1: strength=0.05, state=nascent (no evidence yet)
Day  4: strength=0.20, state=forming (3 evidence)
Day 11: strength=0.40, state=weak (MILESTONE)
Day 14: strength=0.60, state=moderate (MILESTONE)
Day 22: strength=0.80, state=strong (MILESTONE)
Day 60: strength=0.81, state=strong (stable)
```

**Assessment:** ✓ PASS
- Reaches WEAK in ~11 days (target: 10-20)
- Reaches MODERATE in ~14 days (two weeks feels right)
- Reaches STRONG in ~22 days (three weeks of consistent evidence)
- Decays slightly during inactive periods but recovers

---

### Scenario 2: User Created Connection (30 days)

**Pattern:** User explicitly creates connection on Day 1

```
Day  1: strength=0.15, state=nascent (user_creates impact)
Day  4: strength=0.23, state=forming
Day 13: strength=0.40, state=weak (MILESTONE - too slow!)
Day 30: strength=0.53, state=weak (never reaches moderate)
```

**Assessment:** ✗ FAIL - Needs Tuning
- User-created connections should feel immediately validated
- Current: Takes 13 days to reach WEAK
- Target: Should reach WEAK within 3-5 days

**Recommended Change:**
```
user_creates impact: 0.25 → 0.35
+ immediate boost to evidence_count: +2
```

---

### Scenario 3: Neglected Connection Decay (60 days)

**Pattern:** Strong connection (0.75) with zero engagement

```
Day  1: strength=0.73, state=moderate
Day 21: strength=0.50, state=weak (half-strength)
Day 45: strength=0.35, state=dormant (crossed threshold)
Day 60: strength=0.32, state=dormant
```

**Assessment:** ✓ PASS
- Decay rate feels appropriate (not too punishing)
- Goes dormant at Day 45 (matches DORMANCY_THRESHOLD for MODERATE)
- Doesn't hit floor (0.05) - preserves history

---

### Scenario 4: Evidence Spam Gaming (7 days)

**Pattern:** 10 evidence submissions per day

```
Day 1: strength=0.13, daily_gain=0.13 (capped from 0.5 potential)
Day 4: strength=0.52, state=weak
Day 5: strength=0.65, state=moderate
Day 7: strength=0.91, state=strong
```

**Assessment:** ✓ PASS (Marginal)
- Daily cap (0.15) prevents instant strong
- Still reaches STRONG in 7 days with spam (acceptable?)
- Evidence count is absurd (70) but strength is capped

**Consideration:**
- Is 7 days too fast for pure gaming?
- Could add evidence-based caps too (max 5 per day?)

---

### Scenario 5: Excavation Period Boost (14 days)

**Pattern:** Enhanced evidence rates during Day 1-7

```
Day  2: strength=0.25, state=forming (fast!)
Day  4: strength=0.41, state=weak (MILESTONE)
Day  8: strength=0.60, state=moderate (MILESTONE)
Day 12: strength=0.80, peak
Day 14: strength=0.77, state=moderate (slight decay)
```

**Assessment:** ✓ PASS
- Excavation boost creates visible constellation structure quickly
- WEAK by Day 4 (vs Day 11 in normal mode)
- Users see meaningful connections during onboarding

---

### Scenario 6: Dormant Reactivation (90 days)

**Pattern:** Active 30d → Dormant 45d → Reactivate 15d

```
Day 30: strength=0.65, state=moderate
Day 45: strength=0.50, state=weak (decay during absence)
Day 60: strength=0.42, state=dormant (threshold crossed)
Day 75: reactivation event
Day 90: strength=0.68, state=moderate (recovered!)
```

**Assessment:** ✓ PASS
- Reactivation works (single evidence wakes connection)
- Recovery to moderate level takes ~15 days (reasonable)
- History preserved through dormancy

---

## Sensitivity Analysis

### Evidence Impact Values

| Parameter | Current | -50% | +50% | Recommendation |
|-----------|---------|------|------|----------------|
| co_mention_response | 0.05 | Too slow | Fast | Keep |
| co_mention_session | 0.08 | Slow | Good | Keep |
| user_confirms | 0.20 | Slow | Good | Keep |
| user_creates | 0.25 | **Too slow** | Good | **Increase to 0.35** |
| correlation_detected | 0.10 | OK | Fast | Keep |

### Half-Life Comparison (45 days, starting at 0.8)

| Type | Half-Life | Day 30 Strength | Day 45 Strength |
|------|-----------|-----------------|-----------------|
| CAUSATION | 14 days | 0.38 | 0.26 |
| TENSION | 21 days | 0.50 | 0.38 |
| RESONANCE | 30 days | 0.59 | 0.48 |
| GROWTH_EDGE | 45 days | 0.68 | 0.57 |
| SHADOW_MIRROR | 60 days | 0.74 | 0.65 |

**Assessment:** Decay rates feel differentiated. CAUSATION decays fastest (needs reinforcement), SHADOW_MIRROR persists longest (deep patterns).

---

## Feel Assessment

| Aspect | Assessment | Notes |
|--------|------------|-------|
| Formation speed | ✓ | 2-3 weeks to meaningful connection |
| Gaming prevention | ✓ | Daily cap prevents instant strength |
| Decay feel | ✓ | Not punishing, gradual fade |
| Reactivation | ✓ | Single evidence wakes dormant |
| User creation | ✗ | Should feel more immediately validated |
| Type differentiation | ✓ | Different decay rates feel right |
| Excavation boost | ✓ | Creates visible structure quickly |

---

## Recommended Changes

| Parameter | Current | Recommended | Reason |
|-----------|---------|-------------|--------|
| user_creates impact | 0.25 | 0.35 | User intention should be respected |
| user_creates evidence | +1 | +2 | Immediate evidence count boost |
| MAX_DAILY_EVIDENCE | none | 5 | Consider adding to limit spam |

### V2 Constants (Post-Tuning)

```python
EVIDENCE_IMPACTS = {
    "co_mention_response": 0.05,
    "co_mention_session": 0.08,
    "correlation_detected": 0.10,
    "user_confirms": 0.20,
    "user_creates": 0.35,  # INCREASED from 0.25
    "tars_confirmed": 0.15,
    "causation_detected": 0.12,
}

# Consider adding
MAX_DAILY_EVIDENCE = 5  # NEW - limits spam
```

---

## Open Questions for Playtesting

- [ ] Does 7 days to STRONG via gaming feel exploitative?
- [ ] Should user_creates give immediate FORMING state (not just strength boost)?
- [ ] Is the excavation boost (1.5×) strong enough to create "aha" moment?
- [ ] Do different connection types feel meaningfully different during play?
- [ ] Is the visual distinction between WEAK/MODERATE/STRONG clear enough?

---

## Validation Status

```
✓ PASS: Organic formation reaches WEAK in 10-20 days (11)
✓ PASS: Evidence spam is capped (7 days, not instant)
✓ PASS: Neglected connection decays to 0.32, not 0
✗ FAIL: User-created connection should start stronger
✓ PASS: Excavation boost accelerates formation (4 days to WEAK)
✓ PASS: Dormant connections can reactivate

OVERALL: 5/6 PASS - One tuning change recommended
```

---

*MIRROR complete. Apply recommended changes and proceed to SCRIPTURE.*
