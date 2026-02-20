# S.T.A.R.S. Discovery Session
**Date:** 2026-01-14
**Status:** Ideation - decisions captured, not finalized

---

## Vision Summary

**S.T.A.R.S.** = Self-Tracking & Alignment Roadmap System

A "GPS for the Soul" that treats personal transformation as a navigation problem in high-dimensional state space. Not a habit tracker - a **Stochastic Control System** for identity.

### Core Insight
People are drawn to astrology/tarot because of the psychological hook of having a personalized framework applied to their life. S.T.A.R.S. creates that same feeling, but with a **dynamic system** that actually evolves with reality.

---

## Decisions Made

### 1. Core Transformation
**External → Internal locus of control**
- Users stop blaming circumstances, own their choices
- System helps them see their unconscious patterns

### 2. The Birth Chart (Initial State s_0)
**Hybrid approach - triangulated from:**
- Psychometric frameworks (HEXACO, SDT, VIA Strengths, etc.)
- Self-reported domain ratings
- Behavioral/narrative inference (implicit motives)

### 3. Star Map Visualization
**Polar Coordinate System:**
- θ (angle) = Life domains (Career, Health, Relationships, Purpose, Soul)
- r (radius) = Temporal distance (center = now, outer = future/past)
- Vector = Life trajectory (direction + magnitude of change)

**Star Types:**
- **Checkpoint stars** = Regular intervals showing state at that moment
- **Event stars** = Significant moments (insights, goal completions)

### 4. Story Framework: "The Constellation"
**Metaphor:** You are a star forming. Each insight lights a new point. Patterns emerge.

**2D Archetype System:**

| Dimension | Values | Meaning |
|-----------|--------|---------|
| **PHASE** | Scattered → Connecting → Emerging → Luminous | Journey stage (macro) |
| **STAR QUALITY** | Bright, Dim, Flickering, Dark Star | Insight type (micro) |

**Reading example:**
> "You are in the Connecting phase. Your constellation shows 4 bright stars clustered around Purpose, but 2 dark stars in Relationships are creating drag."

### 5. Core Game Loop
**Hybrid: Daily Ritual + Quest System**
- Morning: Intention setting, excavation
- Day: Pattern interrupts, quest execution
- Evening: Reflection, synthesis
- Quests overlay the ritual (boss fights, milestones)

### 6. Progression Metric
**Behavioral change (measured outcomes)** - NOT engagement/streaks

**Verification = All three weighted:**
- Self-report (user says they did it)
- Integration data (Calendar, HealthKit, screen time)
- Narrative analysis (AI detects change in how they talk)

### 7. Decay Function
**Research-backed model:**
```
Momentum(t) = M_0 × e^(-λ × t) + M_stable

- M_0 = initial thrust from completing a node
- λ = personal decay rate (learned per user, trait-dependent)
- t = time since last reinforcement
- M_stable = baseline "identity floor"
```

**Key findings:**
- Decay is non-linear (asymptotic/logistic)
- Median stabilization: 9-10 days
- 76% variance is individual (must personalize λ)
- Fast decay: discipline, habits (λ high)
- Slow decay: identity shifts, core beliefs (λ low)

**TARS pulse frequency:**
- Daily during first 2 weeks after thrust
- Spaced repetition - increase intervals as stability grows
- Weight identity-level insights differently

### 8. TARS Companion
**Evolving personality** - adapts based on user's state
- Interstellar-inspired (Honesty + Humor settings)
- Doesn't just schedule - **negotiates** conflicts
- Sees state vector and adjusts approach

### 9. Champion Marketplace
**V2 expansion** - not in V1 scope
- V1 = Mirror + generic Walk
- V2 = Star Walk marketplace with Dan Koe et al.

### 10. Platform
**Mobile required** (for ritual loop + notifications)
- React Native likely (fastest to MVP)
- Need Canvas for Polar visualization (react-native-skia?)
- Trade-off: KMP = better Canvas, React = faster iteration

### 11. 7-Day Mirror Output
**Constellation + Narrative**
- Visual star map with initial points plotted
- AI-generated "reading" of who you are
- NOT full psychometric scores (yet)

---

## Open Questions

### Design Questions
- [ ] Exact domain labels for θ (Career, Health, Relationships, Purpose, Soul - or different?)
- [ ] How many phases? (4 as sketched, or more granular?)
- [ ] What triggers phase transitions?
- [ ] Dark Star mechanics - how do you "integrate" one?
- [ ] Star quality criteria - what makes a star Bright vs Flickering?

### Technical Questions
- [ ] Canvas library for React Native (Skia? Reanimated?)
- [ ] Convex vs other realtime options
- [ ] Temporal Knowledge Graph implementation (Graphiti? Custom?)
- [ ] MCP integrations priority order (Calendar first? Health?)
- [ ] Local-first vs cloud storage for privacy

### Business Questions
- [ ] MVP timeline (8 weeks as sketched?)
- [ ] Validation metric (40% retention after 7-day mirror?)
- [ ] Freemium/premium split for gradual unveiling
- [ ] Champion outreach strategy for V2

---

## Architecture Summary

```
┌─────────────────────────────────────────────────────────────────────┐
│                      S.T.A.R.S. V1 ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   FRONTEND (React Native + Skia)                                    │
│   ├── Polar Canvas (Star Map visualization)                         │
│   ├── Semantic Zoom (Macro → Meso → Micro)                         │
│   └── TARS Chat Interface                                           │
│                                                                      │
│   BACKEND (Convex / Node.js)                                        │
│   ├── Reflector Agent (evening analysis, triple extraction)         │
│   ├── Architect Agent (path planning, decay calculation)            │
│   └── Negotiator Agent (calendar conflicts)                         │
│                                                                      │
│   DATA LAYER                                                         │
│   ├── Temporal Knowledge Graph (episodes, not profiles)             │
│   ├── State Vector (s_t) with decay tracking                        │
│   └── Encrypted local storage (privacy-first)                       │
│                                                                      │
│   INTEGRATIONS (MCP)                                                │
│   ├── Calendar (Google/Apple)                                       │
│   ├── HealthKit / Google Fit                                        │
│   └── Screen Time APIs                                              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## The Math

### State Vector
```
s_t = [P, M, E, C, G]

P = Physical (health, energy, body)
M = Mental (cognition, focus, learning)
E = Environmental (relationships, context, resources)
C = Cognitive (beliefs, patterns, schemas)
G = Goal Alignment (delta between stated and actual)
```

### Thrust Vector
Each Star Node applies a force:
```
v_node = (direction, magnitude)

direction = alignment with North Star (vision)
magnitude = intensity × consistency × difficulty
```

### Bayesian Identity Update
Completing hard things updates your identity prior:
```
s_0' = s_0 + α × (outcome - expected)

where α = learning rate (how much this changes who you believe you are)
```

---

## Bibliography (from ideation)

### Control & Decision
- "Algorithms for Decision Making" - Kochenderfer (POMDPs)
- "Cybernetics" - Wiener (feedback systems)
- "Behavior: The Control of Perception" - Powers (PCT)

### Physics of Cognition
- "The Free Energy Principle" - Friston
- "Active Inference" - Parr, Pezzulo, Friston

### Stochastic Processes
- "Reinforcement Learning: An Introduction" - Sutton & Barto
- "Introduction to Stochastic Dynamic Programming" - Ross

### Philosophy
- "Being and Time" - Heidegger (Thrownness)
- "The View from Nowhere" - Nagel

---

## Next Steps

1. **Decide platform** - React Native + Skia vs alternatives
2. **Design the 7-day excavation flow** - exact questions, pacing
3. **Define domain labels** - what are the θ axes?
4. **Prototype Polar Canvas** - can we render this performantly?
5. **Design TARS personality model** - how does it adapt?

---

*This document captures ideation, not commitments. All decisions subject to change during implementation.*
