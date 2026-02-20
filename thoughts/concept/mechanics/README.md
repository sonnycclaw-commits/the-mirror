# S.T.A.R.S. Mechanics Bible

**The canonical reference for all game systems in S.T.A.R.S.**

---

## Philosophy

Every number has a reason. Every formula has a derivation. Every system has been tested.

This is not a specification document. This is the **bible** - the authoritative source of truth for how S.T.A.R.S. works at the mechanical level.

---

## The Seven Lenses

Each system is developed through seven lenses:

| Lens | Question | Artifact |
|------|----------|----------|
| **SKELETON** | What are the parts and how do they connect? | State diagram (Mermaid) |
| **BLOOD** | What formulas govern behavior? | Formula spec (Markdown + math) |
| **NERVES** | What research/precedent justifies this? | Citations + rationale |
| **SKIN** | What breaks? What's the safe range? | Edge case table + constraints |
| **MIRROR** | Does it feel right when you play it? | Simulation code + results |
| **TRIBE** | How do constellations interact? | Compatibility rules |
| **SCRIPTURE** | The canonical reference | Bible entry |

---

## Systems Index

### Core Mechanics

| System | Status | Scripture |
|--------|--------|-----------|
| [Constellation States](systems/constellation-states/) | **✓ Complete** | [06-scripture.md](systems/constellation-states/06-scripture.md) |
| [Brightness & Decay](systems/brightness-decay/) | **✓ Complete** | [06-scripture.md](systems/brightness-decay/06-scripture.md) |
| [Experiment Selection](systems/experiment-selection/) | **✓ Complete** | [06-scripture.md](systems/experiment-selection/06-scripture.md) |
| [Phase Transitions](systems/phase-transitions/) | **✓ Complete** | [06-scripture.md](systems/phase-transitions/06-scripture.md) |
| [Connection Formation](systems/connection-formation/) | **✓ Complete** | [06-scripture.md](systems/connection-formation/06-scripture.md) |
| [The Walk](systems/the-walk/) | **✓ Complete** | [06-scripture.md](systems/the-walk/06-scripture.md) |

### Compatibility Layer

| System | Status | Scripture |
|--------|--------|-----------|
| [Multi-User Compatibility](compatibility/) | **Complete** | [06-scripture.md](compatibility/06-scripture.md) |

---

## Dependency Graph

```
constellation-states ──┬──→ brightness-decay ──→ the-walk
                       │
                       ├──→ phase-transitions ──→ the-walk
                       │
                       └──→ connection-formation
                                    │
experiment-selection ←──────────────┘
         │                          │
         ├──→ the-walk ←────────────┘
         │
         └──→ compatibility (multi-user)
```

**All systems complete.** The Walk integrates with all core mechanics to power the behavioral change engine.

---

## How to Use This Bible

### For Designers
1. Pick a system from the index
2. Work through the seven lenses in order (or flexibly with dependency awareness)
3. Each lens produces an artifact in the system's folder
4. Final SCRIPTURE lens produces the canonical bible entry

### For Developers
1. Find the SCRIPTURE entry for the system you're implementing
2. All formulas, constants, and edge cases are documented there
3. Simulation code in `/simulations/` shows expected behavior

### For QA
1. Use MIRROR simulations to generate test cases
2. Edge cases from SKIN define boundary conditions
3. NERVES provides acceptance criteria rationale

---

## Simulations

All simulations live in `/simulations/` and can be run to verify mechanics.

```bash
# Run single-user simulations
cd simulations/single-user
python run_all.py

# Run compatibility simulations
cd simulations/pair-compatibility
python run_all.py
```

---

## Version History

| Date | Change | Author |
|------|--------|--------|
| 2026-01-15 | Initial bible structure created | Claude + Joel |
| 2026-01-15 | Constellation States system completed (all 6 lenses) | Claude + Joel |
| 2026-01-15 | Brightness & Decay system completed (all 6 lenses) | Claude + Joel |
| 2026-01-15 | Phase Transitions system completed (all 6 lenses, MIRROR-tuned) | Claude + Joel |
| 2026-01-15 | Connection Formation system completed (all 6 lenses) | Claude + Joel |
| 2026-01-15 | Experiment Selection system completed (all 5 lenses + SCRIPTURE) | Claude + Joel |
| 2026-01-15 | Multi-User Compatibility system completed (all 6 lenses) | Claude + Joel |

---

*"A game is a series of interesting decisions." - Sid Meier*

*"The interesting decisions in S.T.A.R.S. are: Who am I? Who are we together?"*
