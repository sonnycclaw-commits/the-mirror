# S.T.A.R.S. Ideation

**Self-Tracking & Alignment Roadmap System** — "GPS for the Soul"

A living psychometric profile that evolves through conversation, then generates personalized pathways from current state to desired goals.

**Last Explored:** 2026-01-14
**Total Content:** ~173,000 words across 49 files
**Stage:** Post-research, pre-MVP. Major decisions made, implementation next.

---

## Quick Navigation

| Need | Go To |
|------|-------|
| **Understand the vision** | [life-os-pitch.md](vision/life-os-pitch.md) |
| **See all decisions** | [SYNTHESIS.md](SYNTHESIS.md) |
| **Critical challenges** | [CHALLENGES.md](CHALLENGES.md) |
| **KISS validation plan** | [KISS-PLAN.md](KISS-PLAN.md) |
| **Context graph model** | [visual/context-graph-model.md](visual/context-graph-model.md) |
| **Deep research** | [_deep_research/](_deep_research/) (797KB, 8 docs) |
| **Day 0 MVP plan** | [../shared/plans/day0-mvp-plan.md](../shared/plans/day0-mvp-plan.md) |

---

## Concept Evolution

```
LIFE OS → DAN KOE PROTOCOL → GAMIFICATION → S.T.A.R.S. → CONTROL THEORY

Phase 1: "Living psychometric profile"
Phase 2: "Unfuck Your Life" 7-day excavation
Phase 3: Game metaphor (Win/Lose conditions, Boss Fights)
Phase 4: Constellation naming, "Birth Chart"
Phase 5: Mathematical foundation (state vectors, decay functions)
```

---

## The Core Bet

That a **living, evolving profile** generating **personalized pathways** from **continuous conversation** beats:
- Static personality tests
- Generic habit trackers
- Pre-scripted courses
- Expensive human coaches

If right, the moat is **time** — the longer someone uses it, the more irreplaceable it becomes.

---

## The Moat Thesis: Context Graph

**Critical Insight:** The original moat ("living profile") is smoke — ChatGPT already has conversational memory. The ACTUAL moat is **structured behavioral accumulation**.

```
ChatGPT: flat memory (key-value)
This:    structured graph (nodes + edges + predictions)
```

| What We Capture | What It Enables |
|-----------------|-----------------|
| **STATED** (goals, fears, beliefs) | Know what they say |
| **BEHAVIORAL** (actions taken/skipped) | Know what they do |
| **DELTA** (said vs did) | Know where they're stuck |
| **TEMPORAL** (patterns, decay rates) | Know when to intervene |
| **RELATIONAL** (who helps/hinders) | Know their support system |

**The conversation is the interface. The graph is the product.**

### Needs Exploration
- [ ] Mathematical formalization (graph structure, edge weights)
- [ ] Temporal decay functions
- [ ] Prediction algorithms
- [ ] Code prototype

**See:** `visual/context-graph-model.md` for full conceptual model

---

## Folder Structure

```
ideation/
├── README.md                        # ← You are here
├── SYNTHESIS.md                     # Master decision tracker (what's ✅/❓)
├── CHALLENGES.md                    # Critical challenges & fatal risks
├── KISS-PLAN.md                     # Simplest validation path
├── discovery-session-2026-01-14.md  # Latest exploration (math, mechanics, story)
│
├── visual/
│   ├── context-graph-model.md       # ⭐ THE MOAT THESIS - needs math exploration
│   ├── midjourney-prompts.md        # 40+ visual prompts
│   └── artist-brief.md              # Commissioning spec
│
├── _deep_research/                  # 8 comprehensive research docs (797KB)
│   ├── psychometric_frameworks.md   # HEXACO, Big Five, SDT analysis
│   ├── competitive_landscape.md     # Market gap analysis
│   ├── behaviour_change_science.md  # Atomic Habits, Fogg model
│   ├── technical_architecture.md    # Convex, Temporal KG, MCP
│   ├── visual_design_architecture.md# Complete design system
│   ├── visual_design_research.md    # UI trust patterns
│   ├── unfuck_your_life.md          # 9 ego stages, journey mapping
│   └── 7-day-trial.md               # Day-by-day excavation protocol
│
├── architecture/                    # 12 strategic planning docs
│   ├── life-os-unified-architecture.md
│   ├── possibility-space-brainstorm.md
│   ├── strategic-direction.md
│   ├── mvp-plan.md
│   ├── scope-prioritization.md
│   └── ...
│
├── content/                         # Protocol content
│   ├── dan-koe-protocol-draft.md
│   └── question-bank-draft.md
│
├── research/                        # Market & tech research
│   ├── opportunity-space.md
│   ├── similar-apps-research.md
│   └── ...
│
├── vision/                          # Core pitch
│   └── life-os-pitch.md
│
├── experiments/
│   └── discovery-interview-findings.md
│
└── AI-patterns/                     # ⚠️ WRONG PROJECT (Renoz CRM) — ignore
```

---

## What's Decided

| Decision | Choice |
|----------|--------|
| **Entry Experience** | 7-day "Mirror" excavation → "Birth Chart" reveal |
| **Visualization** | Polar star map (θ=domains, r=time, stars=insights) |
| **Archetypes** | 4 phases (Scattered→Luminous) × 4 star types |
| **Progression Metric** | Behavioral change, not engagement streaks |
| **Decay Math** | Non-linear, trait-dependent, personalized |
| **Companion** | TARS (Interstellar-inspired, evolving personality) |
| **Business Model** | Freemium 7-day → $19/mo Pro → $299 Lifetime |
| **Colors** | Twilight/Sage/Coral palette (balanced, not cold) |
| **Psychometrics** | HEXACO + SDT + Loevinger (scientific backend, mystical framing) |

---

## What's Still Open

| Question | Options | Priority |
|----------|---------|----------|
| Life domain labels (θ axes) | 5 domains? 4? Custom? | HIGH |
| Phase transition triggers | Time? Achievement? AI-judged? | HIGH |
| Platform choice | React Native? KMP? Web-first? | HIGH |
| Visual style temperature | Cool? Warm? Balanced? | MEDIUM |
| Initial style samples | Commission artist? DIY from Midjourney? | MEDIUM |

---

## Key Tensions (Map These)

Understanding these tensions preserves the logic of past decisions:

| Tension | Pull A | Pull B | Current Stance |
|---------|--------|--------|----------------|
| **Scientific vs Popular** | HEXACO (valid but unknown) | MBTI (popular but pseudoscience) | Scientific backend, mystical framing |
| **Depth vs Activation** | 7-day deep excavation | Quick start, deepen over time | Deep first (bet on quality) |
| **Coach vs Therapy** | Address psychological blockers | Avoid clinical claims (liability) | "AI coach" with disclaimers |
| **Product vs Platform** | Focused transformation app | Psychometric API for others | Start product, build to platform |
| **Game Mechanics** | Duolingo-style XP/streaks | Real behavioral change | Game metaphor, not mechanics |
| **Math vs Magic** | Control theory, state vectors | Constellation mysticism | Math powers it, magic sells it |

---

## Research Inventory

| Topic | File | Key Finding |
|-------|------|-------------|
| Psychometrics | `_deep_research/psychometric_frameworks.md` | HEXACO > Big Five |
| Competition | `_deep_research/competitive_landscape.md` | No one does living profiles |
| Behavior Change | `_deep_research/behaviour_change_science.md` | Atomic Habits, Fogg model |
| Tech Stack | `_deep_research/technical_architecture.md` | Convex + Temporal KG |
| Visual Design | `_deep_research/visual_design_architecture.md` | Full design system |
| UI Trust | `_deep_research/visual_design_research.md` | Headspace/Duolingo patterns |
| User Journey | `_deep_research/unfuck_your_life.md` | 9 ego stages mapped |
| 7-Day Protocol | `_deep_research/7-day-trial.md` | Day-by-day excavation |
| Market | `research/opportunity-space.md` | $70B TAM, 35% CAGR |
| Competitors | `research/similar-apps-research.md` | Gaps identified |

---

## Status

### Completed
- [x] Product vision documented
- [x] Deep research executed (797KB, 8 comprehensive docs)
- [x] Psychometric framework selected (HEXACO + SDT + Loevinger)
- [x] Visual design system defined
- [x] Business model defined
- [x] Critical challenges identified (CHALLENGES.md)
- [x] KISS validation plan created (KISS-PLAN.md)
- [x] Context graph moat thesis defined

### Needs Exploration
- [x] **Context graph mathematical model** → See `architecture/context-graph-spec.md`
- [ ] Context graph code prototype (Option A: Airtable MVP)
- [x] Temporal decay functions → Half-life model specified
- [x] Prediction algorithms → Hybrid (rule + Bayesian + Granger)

### Blocked Until Validation
- [ ] Life domain labels finalized
- [ ] Platform choice confirmed
- [ ] Phase transition triggers defined
- [ ] MVP scope locked

---

## Analogies

| Analogy | What It Means |
|---------|---------------|
| **Spotify Wrapped** | "This is me" moment — seeing yourself reflected back |
| **GPS for the Soul** | Knows where you are, where you want to go, and the path between |
| **Coach in Pocket** | $500/hr quality at $19/month |
| **Birth Chart** | Mystical framing for scientific psychometrics |

---

## North Star

**If users don't feel deeply seen in the first 7 days, nothing else matters.**

40% retention at Day 7 = Product-Market Fit signal.

---

*This ideation represents serious, thorough work: ~173k words of research, analysis, and decision-making. Preserve it.*
