# S.T.A.R.S. Ideation Synthesis

**Last Updated:** 2026-01-14
**Purpose:** Map all ideation work, decisions made, variants explored, and narrow the lineage

---

## The Moat Thesis: Context Graph

**Critical Insight (2026-01-14):** The original moat claim ("living profile") is smoke — ChatGPT already has conversational memory. The ACTUAL moat is **structured behavioral accumulation**.

### ChatGPT Has Memory. This Has Understanding.

| Capability | ChatGPT | Context Graph |
|------------|---------|---------------|
| Conversation | ✓ | ✓ |
| Memory | ✓ (flat key-value) | ✓ (structured graph) |
| Behavioral tracking | ❌ | ✓ |
| Delta (said vs did) | ❌ | ✓ |
| Pattern prediction | ❌ | ✓ |
| Intervention timing | ❌ | ✓ |
| Relationship mapping | ❌ | ✓ |

### The Graph Structure

```
SIGNALS → STRUCTURE → PREDICTIONS
   │          │            │
   │          │            └─ "You always skip after conflict"
   │          └─ Edges: contradictions, causes, blockers
   └─ Nodes: stated, behavioral, emotional, temporal, relational
```

**Node Types:**
- **STATED** — Goals, fears, beliefs, values (from conversation)
- **BEHAVIORAL** — Actions taken/skipped, follow-through % (from usage)
- **EMOTIONAL** — Sentiment, resistance markers, breakthroughs (from NLP)
- **TEMPORAL** — Session patterns, decay rate, recovery time (from timestamps)
- **RELATIONAL** — People mentioned, conflict patterns (from entity extraction)

**Edge Types:**
- **CONTRADICTION** — Says "family first" → worked 70 hours
- **CAUSATION** — Argument with partner → skips routine for 3 days
- **BLOCKS** — "I want to exercise" blocked by "I'm not athletic"
- **ENABLES** — Breakthrough insight → action within 24 hours

### Compound Value Over Time

```
Month 1:  Conversation + basic profile
Month 3:  Patterns emerge from behavior (ChatGPT can't do this)
Month 6:  Predictions become accurate
Month 12: Graph is irreplaceable (switching = rebuilding a year of data)
```

### ✅ SPECIFIED: Technical Model

The context graph is now formally specified:

| Component | Status | Location |
|-----------|--------|----------|
| Node types (5) | ✅ Specified | `architecture/context-graph-spec.md` |
| Edge types (7) | ✅ Specified | `architecture/context-graph-spec.md` |
| Bi-temporal timestamps | ✅ Specified | Graphiti/Zep pattern |
| Half-life decay | ✅ Specified | Per-edge-type decay rates |
| Prediction algorithms | ✅ Specified | Hybrid: Rule + Bayesian + Granger |
| Stickiness formula | ✅ Specified | Composite score (volume, richness, depth, accuracy) |
| Implementation options | ✅ Specified | A (Airtable) → B (Postgres) → C (Neo4j) |

**See:** `architecture/context-graph-spec.md` for authoritative specification
**See:** `visual/context-graph-model.md` for conceptual model
**See:** `shared/plans/context-graph-schema-plan.md` for SQL/Cypher schemas

**TODO:** Code prototype (start with Option A: Airtable MVP)

---

## The Concept Evolution

```
ORIGINAL VISION (Life OS)
"A living psychometric profile that evolves through conversation"
           │
           ▼
DAN KOE INTEGRATION
"Unfuck Your Life" 1-day protocol as entry point
           │
           ▼
GAMIFICATION LAYER
Vision/Anti-Vision as Win/Lose conditions, XP, Boss Fights
           │
           ▼
S.T.A.R.S. NAMING
"Self-Tracking & Alignment Roadmap System"
"GPS for the Soul"
           │
           ▼
CONSTELLATION METAPHOR
Polar star map, "Birth Chart", mystical but data-driven
           │
           ▼
CURRENT VISION
"Infrastructure for Human Agency" - Stochastic Control for Identity
```

---

## Decision Tree: What's Been Decided

### ✅ DECIDED: Core Transformation
**External → Internal locus of control**
- Users stop blaming circumstances
- Own their choices
- See unconscious patterns

### ✅ DECIDED: Entry Experience
**7-Day "Mirror" (Psychological Excavation)**
- Dan Koe's protocol questions
- Generates "Birth Chart"
- 40% retention = Product-Market Fit signal

### ✅ DECIDED: Core Metaphor
**The Constellation**
- You are a star forming
- Each insight lights a new point
- Patterns emerge over time
- NOT: Journey/path, Garden, Game levels

### ✅ DECIDED: Visualization System
**Polar Coordinate Star Map**
- θ (angle) = Life domains
- r (radius) = Time (center=now, outer=future)
- Stars = Checkpoint + Event types
- Lines = Connections between insights

### ✅ DECIDED: Archetype System
**Phase × Star Quality (2D)**

| Phase | Meaning |
|-------|---------|
| SCATTERED | Day 1-7, initial exploration |
| CONNECTING | Week 2-4, patterns forming |
| EMERGING | Month 2-3, clarity growing |
| LUMINOUS | Month 4+, coherent identity |

| Star Quality | Meaning |
|--------------|---------|
| BRIGHT | Proven strength |
| DIM | Shadow aspect |
| FLICKERING | Emerging potential |
| DARK STAR | Gravity well/vice |

### ✅ DECIDED: Progression Metric
**Behavioral change (measured outcomes)**
- NOT engagement streaks
- NOT check-in frequency
- Actual life changes verified by:
  - Self-report
  - Integration data (calendar, health)
  - Narrative analysis

### ✅ DECIDED: Decay Math
**Non-linear, trait-dependent, personalized**
```
Momentum(t) = M_0 × e^(-λ × t) + M_stable

λ = personal decay rate (learned per user)
λ_high = discipline, habits (fast decay)
λ_low = identity shifts, beliefs (slow decay)
```
- Median stabilization: 9-10 days
- 76% variance is individual

### ✅ DECIDED: AI Companion
**TARS with Evolving Personality**
- Interstellar-inspired
- Honesty + Humor settings
- Negotiates conflicts (not just schedules)
- Adapts based on user state

### ✅ DECIDED: Business Model (V1 vs V2)
- **V1:** Mirror + generic Walk (prove the loop)
- **V2:** Champion Marketplace (Dan Koe et al.)

### ✅ DECIDED: Color Palette
**Balanced (Twilight/Sage/Coral)**
- Deep Twilight #2D3A4F (wisdom)
- Soft Sage #6B9080 (growth)
- Warm Coral #E07A5F (energy)
- Dark Night #121822 (background)

### ✅ DECIDED: Visual Asset Approach
**AI-generated with custom model training**
- Use Midjourney for exploration
- Train Layer/Scenario on style samples
- Code-based animations (not pre-rendered)

---

## Decision Tree: What's Still Open

### ❓ OPEN: Platform
| Option | Pros | Cons |
|--------|------|------|
| **React Native** | Fastest to MVP | Canvas performance unknown |
| **KMP (Compose)** | Best Canvas, native | Steeper curve, slower iteration |
| **Web-first (PWA)** | Fastest, widest reach | Not truly mobile, notifications limited |

**Leaning:** React Native (fastest to test hypothesis)

### ❓ OPEN: Life Domains (θ axes)
| Option | Domains |
|--------|---------|
| **5 Domains** | Health, Wealth, Relationships, Purpose, Soul |
| **4 Domains** | Physical, Mental, Social, Spiritual |
| **6 Domains** | Body, Mind, Work, Love, Play, Spirit |
| **Custom** | User-defined from excavation |

**Need to decide:** What labels resonate? How many is too many?

### ❓ OPEN: Phase Transition Triggers
What causes a user to advance from Scattered → Connecting → Emerging → Luminous?
- Time-based? (After 7 days, after 30 days)
- Achievement-based? (X stars lit, Y connections formed)
- Behavioral-based? (Measured change in outcomes)
- AI-judged? (TARS assesses readiness)

### ❓ OPEN: Psychometric Framework
| Framework | Validity | Complexity | Decision |
|-----------|----------|------------|----------|
| **HEXACO** | HIGH | High | **Recommended primary** |
| **Big Five** | HIGH | Medium | Alternative |
| **SDT (3 needs)** | HIGH | Low | **Layer on top** |
| **Loevinger (9 stages)** | HIGH | High | **For ego development** |
| **Reiss (16 desires)** | HIGH | High | V2 depth |
| **MBTI** | LOW | Low | ❌ Rejected |
| **Enneagram** | LOW | Medium | ❌ Rejected |

**Need to decide:** How to combine HEXACO + SDT + Loevinger into one profile?

### ❓ OPEN: Initial Style Samples
Before training AI model, need 15-20 reference samples:
- Commission artist? ($200-500)
- DIY from Midjourney? (cleanup needed)
- Hybrid? (Midjourney → cleanup → training)

### ❓ OPEN: Integration Priorities
| Integration | Purpose | V1? |
|-------------|---------|-----|
| Calendar (Google/Apple) | Behavioral verification | Maybe |
| HealthKit | Physical state | Maybe |
| Screen Time | Attention patterns | Later |
| Contacts | Relationship mapping | Later |

---

## Variant Spin-offs to Consider

### Spin-off A: "Champion Walks" as Core Product
Instead of building the Mirror + Walk, what if V1 is JUST the marketplace?
- Partner with 1 champion (Dan Koe)
- Build his specific "Star Walk" as the only path
- Prove the model before generalizing

**Pro:** Faster to market, built-in audience
**Con:** Dependent on champion, less differentiated

### Spin-off B: Enterprise/B2B "Life OS for Teams"
- Same psychometric engine
- Team constellation shows collective patterns
- Manager sees anonymized team dynamics

**Pro:** Higher ACV, enterprise budgets
**Con:** Different product, privacy concerns, slower sales

### Spin-off C: "Birth Chart as a Service"
- Just the 7-day Mirror
- Generate beautiful constellation + narrative
- Share on social (Spotify Wrapped for personality)
- No ongoing Walk

**Pro:** Viral potential, lower complexity
**Con:** No retention, one-time revenue

### Spin-off D: Coaching Tool (B2B2C)
- Sell to coaches, not end users
- Coach uses system to track client progress
- Client gets the app, coach gets the dashboard

**Pro:** Coaches are early adopters, can charge more
**Con:** Smaller market, intermediary relationship

---

## A/B Variants to Test

### Visual Style A/B
| A: Cool (Blue/Silver) | B: Warm (Gold/Coral) |
|-----------------------|----------------------|
| Crystalline, precise | Soft, inviting |
| Professional feel | Personal feel |
| Risk: Too cold | Risk: Too soft |

**Test:** Show both to 10 target users, measure emotional response

### Onboarding A/B
| A: Deep First (7 days) | B: Quick Start (1 day) |
|------------------------|------------------------|
| Full excavation before seeing map | See map immediately, deepen over time |
| Higher quality data | Higher activation |
| Risk: Drop-off before payoff | Risk: Shallow engagement |

**Test:** Prototype both flows, measure Day 7 retention

### Narrative Framing A/B
| A: Scientific ("Psychometric Profile") | B: Mystical ("Birth Chart") |
|----------------------------------------|------------------------------|
| HEXACO, SDT language | Constellation, North Star language |
| Appeals to rationalists | Appeals to seekers |
| Risk: Too clinical | Risk: Too woo |

**Test:** Landing page variants, measure sign-up rate

---

## Research Already Completed

| Document | Location | Summary |
|----------|----------|---------|
| **Psychometric Frameworks** | `_deep_research/psychometric_frameworks.md` | HEXACO > Big Five, SDT for motivation, Loevinger for stages |
| **Competitive Landscape** | `_deep_research/competitive_landscape.md` | No one does living profile, gap is clear |
| **Behavior Change Science** | `_deep_research/behaviour_change_science.md` | Atomic Habits, Fogg model, implementation intentions |
| **Visual Design Architecture** | `_deep_research/visual_design_architecture.md` | Full color system, animation specs, constellation concept |
| **Visual Design Research** | `_deep_research/visual_design_research.md` | Trust-building UI, Headspace/Duolingo case studies |
| **Unfuck Your Life Journey** | `_deep_research/unfuck_your_life.md` | 9 ego stages mapped, user journey Week 1 → Month 3+ |
| **7-Day Trial Design** | `_deep_research/7-day-trial.md` | Day-by-day excavation protocol |
| **Technical Architecture** | `_deep_research/technical_architecture.md` | Convex, Temporal KG, MCP integrations |
| **Opportunity Space** | `research/opportunity-space.md` | $70B TAM, AI coaching 35% CAGR |
| **Similar Apps Research** | `research/similar-apps-research.md` | Habitica, Headspace, 16Personalities gaps |
| **Possibility Space** | `architecture/possibility-space-brainstorm.md` | All framework options mapped |
| **Thought Experiments** | `architecture/thought-experiments.md` | 7 dimensions to explore |
| **Discovery Session** | `discovery-session-2026-01-14.md` | Today's exploration (math, star map, story, mechanics) |
| **Midjourney Prompts** | `visual/midjourney-prompts.md` | 40+ prompts for visual exploration |
| **Artist Brief** | `visual/artist-brief.md` | Commissioning doc for style samples |

---

## Recommended Next Steps

### To Narrow Visual Direction (1-2 days)
1. Run Midjourney prompts (Section 1 + 7)
2. Create mood board from favorites
3. Make style temperature decision (cool vs warm vs balanced)
4. Either commission artist OR train Layer directly

### To Narrow Platform (1 day)
1. Prototype polar Canvas in React Native (react-native-skia)
2. Test performance with 50+ stars
3. If works: proceed with RN
4. If fails: evaluate web-first alternative

### To Narrow Psychometric Model (1 week)
1. Design 7-day question flow
2. Map questions to HEXACO facets + SDT needs + Loevinger indicators
3. Create scoring rubric
4. Test with 5 users manually before building

### To Narrow Business Model (Ongoing)
1. Build the Mirror (7-day) first
2. Measure 40% retention at Day 7
3. If yes: proceed to Walk
4. If no: iterate on Mirror experience

---

## The Lineage (Decision Tree Summary)

```
VISION
├── "Living psychometric profile" ✅
├── "Coach in your pocket" ✅
└── "GPS for the Soul" ✅

ENTRY EXPERIENCE
├── Dan Koe's excavation protocol ✅
├── 7-day "Mirror" ✅
└── "Birth Chart" reveal ✅

VISUALIZATION
├── Polar coordinate star map ✅
├── Constellation metaphor ✅
├── Time as radius ✅
└── Life domains as angles ❓ (need to define)

ARCHETYPES
├── Phase × Star Quality ✅
├── 4 phases (Scattered → Luminous) ✅
├── 4 star types (Bright/Dim/Flickering/Dark) ✅
└── Story framework = Constellation ✅

PROGRESSION
├── Behavioral change (not streaks) ✅
├── Decay math (non-linear, personalized) ✅
└── Phase transitions ❓ (need triggers)

COMPANION
├── TARS (Interstellar-style) ✅
├── Evolving personality ✅
└── Negotiator role ✅

PLATFORM
├── Mobile required ✅
└── React Native vs KMP vs Web ❓

VISUAL DESIGN
├── Twilight/Sage/Coral palette ✅
├── Dark mode primary ✅
├── AI-generated assets ✅
└── Layer/Scenario training ✅

BUSINESS
├── V1 = Mirror + Walk ✅
├── V2 = Champion Marketplace ✅
└── Freemium with gradual unveil ✅
```

---

## What Needs Narrowing NOW

| Question | Priority | Method |
|----------|----------|--------|
| Life domain labels (θ axes) | HIGH | Workshop / user interviews |
| Phase transition triggers | HIGH | Define criteria |
| Platform choice | HIGH | Technical prototype |
| Style temperature | MEDIUM | Midjourney A/B |
| Initial style samples | MEDIUM | Commission or DIY |
| Psychometric integration | LOW | Design after platform |

---

## Ideation Patterns (Meta-Observations)

These patterns describe HOW the ideation was done, not WHAT was decided. Understanding them preserves the logic.

### 1. Research-First Approach
Deep research (797KB, 80k+ words) was completed BEFORE architectural decisions. This was thorough, not rushed. Don't skip this pattern for future features.

### 2. Multiple Framings of Same Concept
The same idea was explored through different lenses:
- **Psychological**: Dan Koe framework, ego stages
- **Mathematical**: Control theory, state vectors, decay functions
- **Visual**: Constellation metaphor, polar coordinates
- **Game-theoretic**: Win/lose conditions, boss fights

This redundancy isn't waste — it tests whether the concept holds across perspectives.

### 3. Explicit Uncertainty
Many docs include "Open Questions" sections. This is intellectually honest ideation, not premature certainty. Maintain this pattern.

### 4. Anti-Patterns Documented
Not just "what to build" but "what NOT to build":
- ❌ MBTI/Enneagram (pseudoscience)
- ❌ Heavy gamification (XP, leaderboards, loot boxes)
- ❌ Therapy positioning (liability)
- ❌ Generic wellness app (no differentiation)
- ❌ Quick start before depth (sacrifices quality)

### 5. Decision Tracking
This file (SYNTHESIS.md) acts as living decision log. Update it when decisions are made.

---

## Risks to Watch

### 1. Scope Creep
173k words of ideation = many possible features. **Discipline required to build ONLY Mirror + Walk for V1.** Features are seductive; resist.

### 2. Over-Engineering
The math is sophisticated (stochastic control, Bayesian updates, decay functions). **MVP must prove value BEFORE optimizing these.** Ship simple, iterate to complex.

### 3. Platform Temptation
Strong pull toward "psychometric API" / "portable profile" vision. **This is Phase 2+.** Must resist building infrastructure before proving product.

### 4. Visual Perfectionism
Extensive design system documented. Easy to spend months on assets. **Ship with "good enough" visuals first, polish later.**

### 5. Multiple Names/Framings
"Life OS" vs "S.T.A.R.S." vs "Unfuck Your Life" — still not fully settled. **Pick ONE for MVP launch.** Branding confusion kills products.

### 6. Therapy Boundary Blur
The excavation goes deep. Easy to drift into clinical territory. **Stay in "coaching" lane.** Have clear referral paths to human therapists.

---

## Key Tensions (Mapped)

These tensions are the logic gates of past decisions. Understand them before reversing anything.

| Tension | Pull A | Pull B | Resolution |
|---------|--------|--------|------------|
| **Scientific vs Popular** | HEXACO (valid) | MBTI (known) | Scientific backend, mystical frontend |
| **Depth vs Activation** | 7-day excavation | Quick start | Deep first — bet on quality over activation |
| **Coach vs Therapy** | Address blockers | Avoid liability | "AI coach" framing with disclaimers |
| **Product vs Platform** | Focused app | API for others | Start product, build to platform |
| **Game Mechanics** | XP/streaks | Real change | Game *metaphor*, not mechanics |
| **Math vs Magic** | Control theory | Constellation | Math powers it, magic sells it |

### Why This Matters

If you consider reversing a decision (e.g., "maybe we should add XP points"), check this table first. The resolution wasn't arbitrary — it balanced competing forces.

---

## File Index by Purpose

### For Understanding Vision
1. `/vision/life-os-pitch.md` — Complete product vision, business case
2. `/SYNTHESIS.md` — All decisions made, still open, variants
3. `/discovery-session-2026-01-14.md` — Latest thinking (math, mechanics, story)

### For Understanding Research
4. `/_deep_research/psychometric_frameworks.md` — Scientific foundation
5. `/_deep_research/unfuck_your_life.md` — User journey mapping
6. `/_deep_research/competitive_landscape.md` — Market positioning

### For Understanding Architecture
7. `/architecture/life-os-unified-architecture.md` — Technical design
8. `/architecture/possibility-space-brainstorm.md` — Everything we could build
9. `/architecture/strategic-direction.md` — Which direction to take

### For Understanding Implementation
10. `/_deep_research/7-day-trial.md` — Day-by-day MVP flow
11. `/architecture/mvp-plan.md` — Implementation roadmap
12. `/_deep_research/technical_architecture.md` — Stack decisions

### For Understanding Visual Design
13. `/_deep_research/visual_design_architecture.md` — Complete design system
14. `/visual/artist-brief.md` — Asset commissioning spec
15. `/visual/midjourney-prompts.md` — 40+ prompts for exploration

---

## The Core Bet (Restated)

That a **living, evolving profile** which **generates personalized pathways** from **continuous conversation** is more valuable than:
- Static personality tests
- Generic habit trackers
- Pre-scripted courses
- Expensive human coaches

**If this bet is right, the moat is TIME** — the longer someone uses it, the more irreplaceable it becomes.

---

## Immediate Next Actions

| Action | Priority | Method |
|--------|----------|--------|
| Decide life domain labels (θ axes) | HIGH | Workshop / user interviews |
| Prototype polar Canvas | HIGH | react-native-skia test with 50+ stars |
| Design 7-day question flow | HIGH | Map to HEXACO + SDT + Loevinger |
| Define phase transitions | MEDIUM | Document trigger criteria |
| Visual style temperature | MEDIUM | Midjourney A/B test |

---

*This synthesis is a living document. Update as decisions are made.*

*Last comprehensive exploration: 2026-01-14 (scout agent)*
