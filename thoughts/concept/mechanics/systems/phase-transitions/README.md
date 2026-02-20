# Phase Transitions System

**Status:** Complete (6/6 lenses)
**Last Updated:** 2026-01-15

---

## Overview

This system governs how a user's overall constellation evolves through four macro-phases: SCATTERED → CONNECTING → EMERGING → LUMINOUS.

**Core insight:** Phases describe where the user is in their journey of self-discovery, not achievements to unlock. Regression is possible and not shameful.

---

## Quick Stats

| Metric | Value |
|--------|-------|
| Days to CONNECTING (ideal) | 9 |
| Days to EMERGING (ideal) | 25 |
| Days to LUMINOUS (ideal) | 60-90 |
| Grace period (LUMINOUS regression) | 14 days |

---

## Files

| File | Lens | Purpose |
|------|------|---------|
| `01-skeleton.md` | SKELETON | Four phases, state machine |
| `02-blood.md` | BLOOD | Formulas, thresholds (MIRROR-tuned) |
| `03-nerves.md` | NERVES | Research justifications |
| `04-skin.md` | SKIN | Edge cases and boundaries |
| `05-mirror/` | MIRROR | Simulation (revealed formula issue) |
| `06-scripture.md` | SCRIPTURE | **Canonical reference** |

**Start here:** `06-scripture.md` for implementation

---

## The Four Phases

| Phase | Visual | Meaning |
|-------|--------|---------|
| SCATTERED | ✦ · · ✧ | Discovering — stars appear, no pattern |
| CONNECTING | ✦──☆ · ✧──● | Relating — lines forming |
| EMERGING | ✦──☆──✧ | Understanding — shape visible |
| LUMINOUS | ☆══✦══☆ | Becoming — constellation blazes |

---

## Key Formulas

### Integration Score
```
integration = density × 0.4 + balance × 0.3 + (1 - dark) × 0.3
```

### Luminosity Score (MIRROR-tuned)
```
luminosity = bright_ratio × 0.45 + density × 0.25 + stability × 0.15 - dark × 0.15
```

---

## MIRROR Tuning Note

Original luminosity formula capped at ~0.64 even with perfect inputs. Adjusted:
- Brightness weight: 0.40 → 0.45
- Connection: `strength × density` → `density` (removed multiplication)
- Stability weight: 0.20 → 0.15

---

## Dependencies

```
constellation-states ──▶ phase-transitions ──▶ TARS layer
brightness-decay    ──▶                    ──▶ Visual system
connection-formation ─▶ (placeholder)      ──▶ Compatibility
```

---

*"Your constellation is always your constellation. The phase just describes how much of it you can see."*
