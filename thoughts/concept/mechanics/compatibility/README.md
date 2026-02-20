# Compatibility System

**Status:** Complete (all 6 lenses)
**Last Updated:** 2026-01-15

---

## What It Does

Overlays two (or more) constellations to detect interaction patterns and produce multi-dimensional compatibility profiles. Enables relationship insight without reductive single-percentage scoring.

**Design Philosophy:** Insight, not judgment. Never "incompatible" - always "here's your dynamic."

---

## Quick Reference

### Interaction Types (Priority Order)
| Type | Detection | Meaning |
|------|-----------|---------|
| SHADOW_MIRROR | Both ≤ 0.4, same domain | Shared struggles |
| TENSION | Gap ≥ 0.4, same domain | Friction points |
| GROWTH_EDGE | Mentor ≥ 0.6, mentee 0.3-0.55 | Learning potential |
| RESONANCE | Both ≥ 0.6, same domain | Mutual strengths |
| COMPLEMENT | Cross-domain balance | Filling gaps |

### Profile Types
| Type | When | Meaning |
|------|------|---------|
| MIRRORING | shadow_mirror ≥ 0.30 | Shared shadow work needed |
| CHALLENGING | tension ≥ 0.35 | Growth through friction |
| GROWTH | growth_edge ≥ 0.25 | Mentor/mentee dynamic |
| AMPLIFYING | resonance ≥ 0.40 | Mutual reinforcement |
| BALANCING | complement ≥ 0.30 | Complementary strengths |
| COMPLEX | No dominant | Multi-faceted dynamic |

### Key Constraints
| Constraint | Value |
|------------|-------|
| Invite expiry | 30 days |
| Pending response window | 7 days |
| Paused auto-expire | 60 days |
| Rate limit (invites/day) | 30 |
| Max pending invites | 50 |
| Group size cap | 10 |

---

## Artifacts

| Lens | File | Purpose |
|------|------|---------|
| SKELETON | [01-skeleton.md](01-skeleton.md) | Consent flow, overlay lifecycle, entity model |
| BLOOD | [02-blood.md](02-blood.md) | Detection formulas, strength calc, profile scoring |
| NERVES | [03-nerves.md](03-nerves.md) | Research citations (27 sources), confidence levels |
| SKIN | [04-skin.md](04-skin.md) | Privacy edge cases, abuse prevention, graceful degradation |
| MIRROR | [05-mirror/](05-mirror/) | Simulation code, 7/9 scenarios passed |
| SCRIPTURE | [06-scripture.md](06-scripture.md) | **Canonical reference** (start here) |

---

## Consent State Machine

```
[*] → INVITED → PENDING → ACTIVE ↔ PAUSED
         ↓          ↓         ↓
      EXPIRED   DECLINED   REVOKED
                    ↓
                COOLDOWN
```

9 states total. Mutual consent required. Either party can revoke anytime.

---

## Privacy Model

| Feature | Behavior |
|---------|----------|
| Hide star | Excluded from interactions |
| Hide domain | All stars in domain hidden |
| Blur brightness | Use state midpoint, reduce certainty |
| Revoke | Immediate deletion, no archive |

Certainty floor: 0.50 (both users blurred)

---

## Simulation Results

**7/9 scenarios matched** (78%)

| Scenario | Expected | Actual |
|----------|----------|--------|
| Resonant Pair | AMPLIFYING | AMPLIFYING ✓ |
| Challenging Pair | CHALLENGING | CHALLENGING ✓ |
| Growth Pair | GROWTH | CHALLENGING ✗ |
| Shadow Pair | MIRRORING | MIRRORING ✓ |
| Asymmetric Pair | COMPLEX | GROWTH ✗ |

**Tuning needed:** Check GROWTH_EDGE before TENSION to fix mentor/mentee misclassification.

---

## Dependencies

**Requires:**
- `constellation-states` - Star state definitions
- `brightness-decay` - Brightness values for detection

**Consumers:**
- Relationship insights UI
- Group dynamics features
- Partner experiment suggestions

---

## Research Foundation

Grounded in:
- Interpersonal Complementarity Theory (warmth similarity, dominance complementarity)
- Jung's Shadow Work (mutual shadow exploration deepens connection)
- Vygotsky's ZPD (mentee range 0.3-0.55)
- Attachment Theory (anxious-avoidant tension patterns)
- GDPR consent principles (multi-party relational data)

See [03-nerves.md](03-nerves.md) for 27 citations with confidence levels.

---

## For Developers

**Start with:** [06-scripture.md](06-scripture.md) - the canonical reference

**Run simulation:**
```bash
cd thoughts/concept/mechanics/compatibility/05-mirror
python simulation.py
```

**Key implementation notes:**
1. Check interaction types in priority order (SHADOW_MIRROR first)
2. Use harmonic mean for brightness factor (prevents domination)
3. Certainty compounds multiplicatively with blur
4. Rate limit invite spam aggressively
5. CASCADE DELETE on revoke - no stale data
