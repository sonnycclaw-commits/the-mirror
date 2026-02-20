# Experiment Selection System

**Status:** Complete (all 6 lenses)
**Last Updated:** 2026-01-15

---

## What It Does

Selects which experiments (small real-world actions) to recommend to users. Balances:
- **Star urgency** - Which stars need attention?
- **User capacity** - What can the user handle right now?
- **Success probability** - What's likely to work?

**Design Philosophy:** Selection should feel like a wise friend who knows you, not an algorithm optimizing metrics.

---

## Quick Reference

### Priority Formula
```
PRIORITY = (Urgency × 0.40) + (Capacity × 0.35) + (Success × 0.25) + CONNECTION_BONUS
```

### Key Constraints
| Constraint | Value |
|------------|-------|
| Max active experiments | 3 |
| Max queued experiments | 5 |
| Offer expiry | 24 hours |
| Queue expiry | 7 days |
| Max modifications | 2 per experiment |

### Difficulty Levels
| Level | Time | When to Use |
|-------|------|-------------|
| TINY | 5 min | Crisis/high stress |
| SMALL | 30 min | Normal capacity |
| MEDIUM | 2 hours | High capacity |
| STRETCH | Half day | High capacity + momentum |

---

## Artifacts

| Lens | File | Purpose |
|------|------|---------|
| SKELETON | [01-skeleton.md](01-skeleton.md) | State machine, entities, transitions |
| BLOOD | [02-blood.md](02-blood.md) | Formulas, algorithms, constants |
| NERVES | [03-nerves.md](03-nerves.md) | Research citations, justifications |
| SKIN | [04-skin.md](04-skin.md) | Edge cases, boundaries, failure modes |
| MIRROR | [05-mirror/](05-mirror/) | Simulation code and results |
| SCRIPTURE | [06-scripture.md](06-scripture.md) | **Canonical reference** (start here) |

---

## State Machine

```
[*] → Generated → Offered → Accepted → Active → Completed
                    ↓           ↓          ↓
                 Declined    Queued     Skipped
                    ↓           ↓          ↓
                 Expired    Expired     Failed
```

11 states total. See [01-skeleton.md](01-skeleton.md) for full Mermaid diagram.

---

## Dependencies

**Requires (all complete):**
- `constellation-states` - Star state definitions
- `brightness-decay` - How experiments affect brightness
- `connection-formation` - Connection types that modify selection

**Consumed by:**
- The Walk (daily experiment flow)
- Engagement loop (gamification layer)
- Compatibility layer (future)

---

## Simulation Results

9 scenarios tested, all passed:
- New user journey (Day 1-7)
- All-dark constellation
- Perfect user (100% success)
- Failing user (0% success)
- High stress periods
- BLOCKS filter
- GROWTH_EDGE boost
- Multi-day progression
- CRISIS mode

See [05-mirror/results.md](05-mirror/results.md) for details.

---

## For Developers

**Start with:** [06-scripture.md](06-scripture.md) - the canonical reference

**Run simulation:**
```bash
cd thoughts/concept/mechanics/systems/experiment-selection/05-mirror
python simulation.py
```

**Key implementation notes:**
1. Always check BLOCKS connections before selection (hard filter)
2. Capacity is subtractive for stress (not multiplicative)
3. CRISIS mode forces TINY difficulty - don't override
4. Division by zero possible with 0% completion rate - use floor

---

## Research Foundation

Grounded in:
- Csikszentmihalyi (Flow Theory)
- Fogg Behavior Model (B=MAP)
- Kahneman & Tversky (Prospect Theory)
- Baumeister (Ego Depletion)
- Ryan & Deci (Self-Determination Theory)

See [03-nerves.md](03-nerves.md) for full citations.
