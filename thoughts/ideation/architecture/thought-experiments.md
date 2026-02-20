# Development Architecture — Thought Experiments

Seven dimensions to explore before building.

---

## Dimension 1: The Psychometric Engine

What frameworks do we build on? What do we measure? How do we measure it?

### Potential Framework Layers

```
PERSONALITY (Stable Traits)
├── Big Five (OCEAN) — Most empirically validated
├── MBTI — Popular but contested, useful for language
├── Enneagram — Motivation-focused, cult following
├── HEXACO — Big Five + Honesty/Humility
└── Question: Do we use established frameworks or build our own?

MOTIVATION (What Drives You)
├── Self-Determination Theory — Autonomy, competence, relatedness
├── McClelland's Needs — Achievement, affiliation, power
├── Reiss Motivation Profile — 16 basic desires
└── Question: How do we surface unconscious drivers?

DEVELOPMENT (Where You Are)
├── Kegan's Adult Development — 5 stages of meaning-making
├── Loevinger's Ego Development — 9 stages (Koe references this)
├── Spiral Dynamics — Value systems evolution
├── Maslow's Hierarchy — Needs-based progression
└── Question: Can we reliably assess developmental stage from conversation?

COGNITIVE STYLE (How You Think)
├── Dual Process Theory — System 1 vs System 2 dominance
├── Learning Styles — Visual, auditory, kinesthetic (contested)
├── Decision-Making Patterns — Analytical vs intuitive
└── Question: How does cognitive style affect intervention design?

BEHAVIORAL PATTERNS (What You Actually Do)
├── Habit loops — Cue, routine, reward
├── Procrastination patterns — What triggers avoidance?
├── Energy patterns — When do you peak/crash?
├── Self-sabotage patterns — How do you get in your own way?
└── Question: How do we observe behavior through conversation alone?

SHADOW/BLOCKERS (What's Holding You Back)
├── Defense mechanisms — Freudian framework
├── Limiting beliefs — Cognitive behavioral lens
├── Attachment styles — Relational patterns
├── Trauma responses — Fight/flight/freeze/fawn
└── Question: How deep do we go? Where's the line with therapy?
```

### Key Questions

1. Which frameworks have the strongest empirical backing?
2. Which frameworks translate best to conversational assessment?
3. How do we synthesize multiple frameworks into a coherent profile?
4. What's the minimum viable psychometric model for v1?

---

## Dimension 2: The Interaction Model

How does the system actually engage with users?

### Interaction Modalities

```
VOICE-FIRST
├── Pros: Frictionless, captures tone/emotion, feels human
├── Cons: Privacy concerns, not always convenient
├── Tech: Whisper, Deepgram, real-time transcription
└── Question: How do we analyze voice for emotional signals?

TEXT-BASED
├── Pros: Async-friendly, private, searchable
├── Cons: Loses emotional nuance, easier to be inauthentic
├── Tech: Standard chat interface
└── Question: How do we encourage depth over brevity?

HYBRID
├── Voice input, text output?
├── User chooses per interaction?
└── Question: What's the optimal mix?
```

### Timing Patterns

```
SCHEDULED PROMPTS
├── Morning excavation (7-9am)
├── Midday interrupts (12-2pm)
├── Evening reflection (8-10pm)
└── Question: How do we learn individual optimal timing?

TRIGGERED PROMPTS
├── Based on detected patterns
├── Based on calendar/context
├── Based on behavioral signals
└── Question: How do we avoid being annoying?

USER-INITIATED
├── "I need to process something"
├── "I'm stuck"
├── "I had a breakthrough"
└── Question: How do we balance push vs pull?
```

### Conversation Depth

```
MICRO (30 seconds)
├── Single question, single response
├── Pattern interrupt style
└── "What are you avoiding right now?"

MIDI (5 minutes)
├── Short exploration
├── 3-5 exchange dialogue
└── "Let's unpack that feeling"

MACRO (20+ minutes)
├── Deep dive session
├── Therapeutic depth
└── "Let's explore your relationship with failure"
```

**Question:** How does the system decide which depth is appropriate?

### Key Questions

1. What interaction patterns drive the deepest insight?
2. How do we maintain engagement without becoming noise?
3. What's the right balance of structure vs flexibility?
4. How do other successful apps handle notification fatigue?

---

## Dimension 3: The Skill Tree Architecture

How do we represent and evolve the skill tree?

### Skill Taxonomy Options

```
OPTION A: UNIVERSAL FRAMEWORK
├── Predefined skill categories
├── Everyone maps to same tree
├── Pros: Comparable, structured
├── Cons: May not fit everyone
└── Example: "Leadership" means same thing for everyone

OPTION B: EMERGENT/PERSONALIZED
├── Skills emerge from conversation
├── Unique tree per person
├── Pros: Truly personalized
├── Cons: Hard to compare, less structured
└── Example: "Leadership" defined by user's context

OPTION C: HYBRID
├── Core universal skills
├── Personalized sub-skills and definitions
├── Pros: Balance of structure and personalization
└── Example: Universal "Leadership" with personalized blockers
```

### Skill Attributes

```
LEVEL (0-100%)
├── How developed is this skill?
├── Based on: Self-report, behavioral evidence, demonstrated outcomes
└── Question: How do we validate skill levels?

BLOCKERS
├── What's preventing development?
├── Internal: Beliefs, fears, patterns
├── External: Resources, environment, relationships
└── Question: How do we identify root blockers vs symptoms?

UNLOCK CONDITIONS
├── What needs to shift for growth?
├── Prerequisite skills
├── Psychological shifts required
└── Question: How do we sequence development?

GROWTH EDGES
├── What's ready to develop now?
├── Based on: Current level, resolved blockers, user readiness
└── Question: How do we identify optimal challenge level?

CONNECTIONS
├── How do skills relate to each other?
├── Skill A unlocks Skill B
├── Skill C blocks Skill D
└── Question: How do we map the skill graph?
```

### Key Questions

1. What skill taxonomies exist in career development, education, psychology?
2. How do competency frameworks in enterprise map to personal development?
3. What's the right granularity—10 skills? 50? 200?
4. How do we handle skills that are context-dependent?

---

## Dimension 4: The Agent Architecture

How do the AI agents coordinate?

### Agent Roles

```
ORCHESTRATOR
├── Decides what to ask, when
├── Manages conversation state
├── Routes to specialist agents
└── Question: What's the decision logic?

EXCAVATION AGENT
├── Deep psychological questions
├── Surfaces fears, desires, patterns
├── Koe's protocol questions
└── Question: How do we go deep without being intrusive?

PROFILE AGENT
├── Maintains psychometric model
├── Updates based on new data
├── Identifies patterns and contradictions
└── Question: How do we handle conflicting signals?

SKILL TREE AGENT
├── Maps capabilities and blockers
├── Suggests development paths
├── Tracks progress over time
└── Question: How do we validate skill assessments?

REFLECTION AGENT
├── Synthesizes insights
├── Mirrors back to user
├── Celebrates progress
└── Question: How do we make reflection feel valuable, not repetitive?

ACCOUNTABILITY AGENT
├── Tracks commitments
├── Follows up on stated intentions
├── Calls out incongruence
└── Question: How do we hold accountable without being annoying?
```

### Agent Coordination Models

```
SEQUENTIAL
├── One agent at a time
├── Clear handoffs
└── Simpler but less dynamic

PARALLEL
├── Multiple agents contribute
├── Orchestrator synthesizes
└── More complex but richer

EMERGENT
├── Agents negotiate
├── Best response wins
└── Most complex, potentially most powerful
```

**Question:** What's the right architecture for v1 vs v2?

---

## Dimension 5: The Social Layer

How do we make growth visible and communal?

### Social Features

```
VISIBILITY
├── What's public vs private?
├── Opt-in sharing
├── Anonymized aggregates
└── Question: How do we enable connection without compromising intimacy?

COMPARISON
├── Skill tree comparisons
├── Path comparisons
├── Progress comparisons
└── Question: How do we make comparison inspiring, not demoralizing?

COMMUNITY
├── Accountability groups
├── Stage-based cohorts
├── Interest-based clusters
└── Question: What's the right group size and structure?

ACHIEVEMENTS
├── What's worth celebrating?
├── Psychological milestones vs vanity metrics
├── How do we verify genuine progress?
└── Question: How do we avoid gamification that corrupts motivation?
```

### Strava Parallels

```
├── Activity feed — "Sarah unlocked 'difficult conversations'"
├── Segments — Common challenges others have completed
├── Clubs — Groups pursuing similar paths
├── Kudos — Celebrating others' progress
└── Question: What translates and what doesn't?
```

---

## Dimension 6: Technical Architecture

How do we build this?

### Core Components

```
USER PROFILE STORE
├── Psychometric data
├── Conversation history
├── Skill tree state
├── Privacy: This is the most sensitive data imaginable
└── Question: How do we handle data sovereignty?

CONVERSATION ENGINE
├── Multi-agent orchestration
├── Context management
├── State persistence
└── Question: Agent-SDK vs custom vs existing platforms?

PROMPT LIBRARY
├── Question bank by stage, context, goal
├── Dynamic prompt generation
├── A/B testing infrastructure
└── Question: How do we systematize prompt development?

ANALYTICS ENGINE
├── Pattern detection
├── Progress tracking
├── Insight generation
└── Question: What signals matter most?

NOTIFICATION SYSTEM
├── Timing optimization
├── Channel management (push, SMS, email)
├── Fatigue prevention
└── Question: How do we stay present without being annoying?
```

### Platform Strategy

```
MOBILE-FIRST
├── iOS and Android
├── Voice integration
├── Notification-driven
└── Primary experience

WEB COMPANION
├── Dashboard
├── Skill tree visualization
├── Deep history access
└── Secondary experience

WEARABLE INTEGRATION (Future)
├── Biometric data
├── Context awareness
├── Micro-prompts
└── Enhanced signal
```

---

## Dimension 7: Ethical Considerations

What are the risks and how do we mitigate them?

### Risks

```
PSYCHOLOGICAL HARM
├── Going too deep without support
├── Surfacing trauma without resources
├── Creating dependency
└── Mitigation: Clear boundaries, therapist referrals, user control

DATA PRIVACY
├── Most intimate data possible
├── Breach would be catastrophic
├── Regulatory complexity (HIPAA? GDPR?)
└── Mitigation: Encryption, data minimization, user ownership

MANIPULATION POTENTIAL
├── System knows your vulnerabilities
├── Could be used to exploit
├── Dark patterns in engagement
└── Mitigation: Ethical guidelines, transparency, user control

ACCURACY/VALIDITY
├── What if the profile is wrong?
├── What if we reinforce false beliefs?
├── Confirmation bias in the system
└── Mitigation: User correction, uncertainty acknowledgment, validation studies

ACCESSIBILITY
├── Who gets access?
├── Does this widen or narrow inequality?
├── Cultural bias in frameworks
└── Mitigation: Freemium model, cultural adaptation, diverse training
```

---

## Summary: Key Decisions to Make

| Dimension | Core Question |
|-----------|---------------|
| Psychometrics | Which frameworks? Build vs buy? |
| Interaction | Voice vs text? Push vs pull? |
| Skill Tree | Universal vs emergent? |
| Agents | Sequential vs parallel? |
| Social | What's visible? What's private? |
| Technical | Agent-SDK vs custom? |
| Ethics | Where's the therapy line? |
