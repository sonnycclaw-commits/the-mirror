# S.T.A.R.S. Mechanics - Quick Reference

## Commands

| Command | What It Does |
|---------|--------------|
| `/stars` | Show all systems, their status, recommend next step |
| `/stars <system>` | Work on a specific system (e.g., `/stars constellation-states`) |
| `/stars:skeleton` | Formalize structure → state machines |
| `/stars:blood` | Design formulas → math |
| `/stars:nerves` | Justify numbers → research |
| `/stars:skin` | Define limits → edge cases |
| `/stars:mirror` | Test feel → simulation |
| `/stars:tribe` | Multi-person → compatibility |
| `/stars:scripture` | Document → bible entry |

---

## The Seven Lenses

```
SKELETON → BLOOD → NERVES → SKIN → MIRROR → SCRIPTURE
    │                                   ↑
    └──────────── TRIBE ────────────────┘
```

| Lens | Question | Output |
|------|----------|--------|
| **SKELETON** | What are the parts? | Mermaid state diagram |
| **BLOOD** | What formulas? | Constants + equations |
| **NERVES** | Why these numbers? | Research citations |
| **SKIN** | What breaks? | Edge case table |
| **MIRROR** | Does it feel right? | Python/spreadsheet sim |
| **TRIBE** | How do they interact? | Compatibility rules |
| **SCRIPTURE** | Canonical reference | Bible entry |

---

## Systems Priority

| Priority | System | Status |
|----------|--------|--------|
| 🔴 Critical | `constellation-states` | ○○○○○○○ |
| 🔴 Critical | `brightness-decay` | ○○○○○○○ |
| 🔴 Critical | `experiment-selection` | ○○○○○○○ |
| 🟡 High | `phase-transitions` | ○○○○○○○ |
| 🟡 High | `connection-formation` | ○○○○○○○ |

---

## Artifact Locations

```
thoughts/concept/mechanics/
├── README.md              ← Bible index
├── CHEATSHEET.md          ← This file
├── systems/
│   └── <system>/
│       ├── 01-skeleton.md
│       ├── 02-blood.md
│       ├── 03-nerves.md
│       ├── 04-skin.md
│       ├── 05-mirror/
│       │   ├── simulation.py
│       │   └── results.md
│       └── 06-scripture.md
├── compatibility/
│   ├── 01-overlay-rules.md
│   ├── 02-interaction-types.md
│   ├── 03-scoring.md
│   └── 04-presentation.md
└── simulations/
```

---

## Compatibility Interaction Types

| Type | Pattern | Meaning |
|------|---------|---------|
| **RESONANCE** | Both bright in same domain | Mutual amplification |
| **TENSION** | Dark ↔ Bright in same domain | Friction point |
| **GROWTH_EDGE** | Bright ↔ Dim/Flickering | Mentorship potential |
| **SHADOW_MIRROR** | Both dark/dim in same domain | Shared wound |
| **COMPLEMENT** | Opposite strength profiles | Interdependence |

---

## Quick Start

1. Run `/stars` to see current status
2. Start with `constellation-states` (it's foundational)
3. Work through lenses: SKELETON → BLOOD → NERVES → SKIN → MIRROR
4. Add TRIBE when ready for compatibility features
5. Finish with SCRIPTURE to document

---

## Key Principles

- **Structure before numbers** - SKELETON has no math
- **Every number has a reason** - NERVES justifies BLOOD
- **Feel beats theory** - MIRROR can override formulas
- **Insight, not judgment** - Compatibility shows dynamics, doesn't judge

---

*"The mechanics are invisible. The transformation is visible."*
