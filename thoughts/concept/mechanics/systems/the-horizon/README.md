# The Horizon

**Status:** Draft
**Created:** 2026-01-15
**Lenses:** SKELETON ✓ BLOOD ✓ NERVES ✓ SKIN ✓ MIRROR ✓ TRIBE ○

---

## Overview

The Horizon is the **strategic layer** above The Walk — multi-Walk planning for 1-5-10 year trajectories.

**Core insight:** The Walk gets you to the next star. The Horizon tells you which stars to walk toward.

---

## Three Layers

```
Star Map  = who you are now (present)
The Walk  = journey to near milestones (tactical, 3-6 months)
Horizon   = long-term trajectory (strategic, 1-10 years)
```

---

## Key Mechanics

### Vision / Anti-Vision

Uses Dan Koe's excavation protocol:
- **Anti-Vision:** "Fast forward 10 years. Nothing changes. What does your life look like?"
- **Vision:** "If fear weren't a factor, what would your life look like?"

Anti-vision becomes a **Dark Star** in the constellation, exerting gravitational pull.

### Slingshot

When you complete a Walk milestone, you get a velocity boost:

```
exit_velocity = approach × (1 + slingshot_power × alignment)
```

Longer timeframe milestones provide bigger slingshots (10-year = 1.0, 3-month = 0.15).

### Drift

If all Walks stall (velocity < 0.1 for 30+ days), user drifts toward Dark Star.

---

## States

| State | Description |
|-------|-------------|
| UNDEFINED | No Horizon set |
| EXCAVATING | Vision/Anti-Vision discovery |
| MAPPED | Trajectory defined |
| ACTIVE | Walking toward Horizon |
| REVIEWING | Milestone reached, checking validity |
| DRIFTING | All Walks stalled |
| ARRIVED | North Star reached |

---

## Files

| File | Description |
|------|-------------|
| [01-skeleton.md](./01-skeleton.md) | States, transitions, entity relationships |
| [02-blood.md](./02-blood.md) | Slingshot, drift, momentum formulas |
| [03-nerves.md](./03-nerves.md) | Research citations |
| [04-skin.md](./04-skin.md) | Edge cases |
| [05-mirror/](./05-mirror/) | Simulation + results |
| [06-scripture.md](./06-scripture.md) | Canonical reference |

---

## Dependencies

- **the-walk** — Walk mechanics, velocity, momentum
- **constellation-states** — Profile stars, dark stars

---

## Integration Points

- Slingshot velocity feeds into next Walk's starting velocity
- Dark star connects to constellation's dark star mechanics
- Horizon context influences experiment selection priority
