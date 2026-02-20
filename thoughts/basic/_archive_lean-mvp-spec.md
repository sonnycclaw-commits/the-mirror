# Lean MVP Specification

**Codename:** The Right Questions
**Hook:** "Most people secretly know what they're avoiding. They just haven't been asked the right questions."

---

## What This Is

An AI-powered discovery session that:
1. Asks adaptive questions to understand who you are
2. Builds a psychological profile from your responses
3. Maps your stated goal to a personalized vision
4. Breaks it down into OKR-style milestones and tasks

**One session. Clear output.**

---

## The Flow

```
┌────────────────────────────────────────────────────────────────┐
│                    THE RIGHT QUESTIONS                          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Phase 1: DISCOVERY (15-20 min)                                │
│  ─────────────────────────────────                             │
│  Agent asks adaptive questions                                 │
│  Responses build profile signals                               │
│  Categories: Values, Fears, Energy, Patterns, Relationships   │
│                                                                │
│                         ↓                                      │
│                                                                │
│  Phase 2: PROFILE REFLECTION (5 min)                           │
│  ───────────────────────────────────                           │
│  Present synthesized profile to user                           │
│  "Here's what I see. Does this resonate?"                     │
│  "What feels wrong or incomplete?"                            │
│  "What do you wish you could change about yourself?"          │
│  → Corrections refine profile                                  │
│  → "Wish to change" reveals aspiration gap                    │
│                                                                │
│                         ↓                                      │
│                                                                │
│  Phase 3: GOAL CAPTURE (5 min)                                 │
│  ─────────────────────────────                                 │
│  "What do you want to achieve?"                               │
│  Clarifying questions on timeline, constraints, motivation    │
│                                                                │
│                         ↓                                      │
│                                                                │
│  Phase 4: SYNTHESIS (Agent processing)                         │
│  ─────────────────────────────────────                         │
│  Consolidate profile (current + aspirational)                 │
│  Align psyche with goal                                        │
│  Identify conflicts, leverage points                          │
│                                                                │
│                         ↓                                      │
│                                                                │
│  Phase 5: OUTPUT (Document generation)                         │
│  ─────────────────────────────────────                         │
│  Profile summary: "Here's who you are"                        │
│  Vision: "Here's where you're going"                          │
│  OKRs: Objectives + Key Results + Tasks                       │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Why Profile Reflection Matters

| User Response | What It Reveals | How It's Used |
|---------------|-----------------|---------------|
| "Yes, this is me" | Profile accurate | Proceed with confidence |
| "This part is wrong" | Misread signal | Correct before goal mapping |
| "I wish I could change X" | Aspiration gap | Factor into OKRs as transformation goal |
| "I didn't realize that" | Insight landed | This is the "felt seen" moment |

---

## The Output Document

```markdown
# Your Clarity Plan

Generated: [date]
Session duration: [time]

---

## Who You Are (Profile)

### Core Values
- [Value 1]: Evidence from responses
- [Value 2]: Evidence from responses

### Energy Patterns
- What energizes you: [patterns]
- What drains you: [patterns]

### Growth Edges
- Strength to leverage: [strength]
- Pattern to watch: [pattern]

### Key Insight
> "[One non-obvious observation about the user based on synthesis]"

---

## Where You're Going (Vision)

### Your Goal
[User's stated goal, refined]

### Why This Matters to You
[Connection between profile and goal]

### What Success Looks Like
[Vivid description of achieved goal state]

### Timeline
[Realistic timeline based on goal + patterns]

---

## How You Get There (OKRs)

### Objective 1: [First milestone]
**Timeline:** [Q1/Q2/etc]

Key Results:
- [ ] KR1: [Measurable outcome]
- [ ] KR2: [Measurable outcome]
- [ ] KR3: [Measurable outcome]

First Actions:
- [ ] Task 1 (this week)
- [ ] Task 2 (this week)
- [ ] Task 3 (next week)

### Objective 2: [Second milestone]
[Same structure]

### Objective 3: [Third milestone]
[Same structure]

---

## Watch Out For

Based on your patterns, these might derail you:
- [Risk 1]: Mitigation strategy
- [Risk 2]: Mitigation strategy

---

## Your One Lever

If you do nothing else, do this:
> "[Single most impactful action based on profile + goal alignment]"
```

---

## Technical Architecture

### Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Frontend | Next.js | Conversation UI |
| Backend | Vercel/Convex | Session storage |
| AI | Claude API (Agent SDK) | Question generation, synthesis |
| Output | Markdown → PDF | Downloadable plan |

### Agent Design

```typescript
// Pseudo-structure
const discoveryAgent = {
  phases: [
    {
      name: "discovery",
      questionCategories: ["values", "fears", "energy", "patterns", "relationships"],
      minQuestions: 10,
      maxQuestions: 20,
      adaptiveLogic: "Based on signals, dive deeper or move on"
    },
    {
      name: "goal_capture",
      questions: ["What do you want?", "By when?", "Why does it matter?"]
    },
    {
      name: "synthesis",
      inputs: ["all question responses", "detected signals"],
      outputs: ["profile", "goal_alignment", "conflicts", "leverage_points"]
    },
    {
      name: "output",
      template: "clarity_plan.md",
      format: ["markdown", "pdf"]
    }
  ]
};
```

### Data Model (Minimal)

```typescript
sessions: defineTable({
  id: v.string(),
  userId: v.optional(v.string()), // Anonymous allowed for MVP
  startedAt: v.number(),
  completedAt: v.optional(v.number()),

  // Conversation
  messages: v.array(v.object({
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    timestamp: v.number(),
    phase: v.string(),
    signals: v.optional(v.array(v.string())), // Extracted during conversation
  })),

  // Profile (built during synthesis)
  profile: v.optional(v.object({
    values: v.array(v.string()),
    energizers: v.array(v.string()),
    drainers: v.array(v.string()),
    patterns: v.array(v.string()),
    growthEdges: v.array(v.string()),
  })),

  // Goal
  goal: v.optional(v.object({
    statement: v.string(),
    timeline: v.string(),
    motivation: v.string(),
  })),

  // Output
  outputDocument: v.optional(v.string()), // Markdown content
})
```

---

## Question Framework

Not strictly Dan Koe — adaptive based on signals.

### Category: Values
- "What would you never compromise on, even for money?"
- "When you're proud of yourself, what did you do?"
- "What makes you angry when you see others doing it wrong?"

### Category: Fears
- "What's the life you're terrified of living in 10 years?"
- "What have you been avoiding that you know you need to face?"
- "What would your family say is holding you back?"

### Category: Energy
- "When do you feel most alive?"
- "What activities make time disappear?"
- "What drains you even when you're good at it?"

### Category: Patterns
- "What have you tried before that didn't work? Why?"
- "When you give up on things, what's usually happening?"
- "What's something you keep saying you'll do but never do?"

### Category: Relationships
- "Who do you compare yourself to?"
- "Whose opinion matters most to you right now?"
- "Who would be most surprised if you succeeded?"

### Adaptive Logic
```
If user mentions [career dissatisfaction] → ask more about work patterns
If user mentions [relationship tension] → ask about support systems
If user mentions [financial stress] → ask about security values
If user seems [uncertain/vague] → ask for specific examples
If user seems [avoiding] → gently probe the avoidance
```

---

## MVP Scope

### ✅ In Scope

- Single conversation session (no auth required for MVP)
- 10-20 adaptive questions
- Real-time synthesis during conversation
- Downloadable Markdown plan
- Basic PDF export

### ❌ Out of Scope (Beta)

- User accounts / saved sessions
- 7-day paced interview
- Email delivery
- Progress tracking
- Follow-up sessions

---

## Success Metrics

| Metric | Kill | Target |
|--------|------|--------|
| Session completion (started → finished) | <30% | >50% |
| Plan "useful" rating (1-5) | <3.0 | >3.5 |
| Would recommend | <30% | >50% |
| Time to complete | >60 min avg | 30-45 min |

---

## Build Timeline

| Week | Deliverable |
|------|-------------|
| 1 | Conversation UI + Claude integration |
| 2 | Question flow + signal extraction |
| 3 | Synthesis logic + output generation |
| 4 | Polish + pilot testing |

**Total: 4 weeks to testable MVP**

---

## Why This Works

**Simpler than full S.T.A.R.S.:**
- No constellation visualization
- No star extraction engine
- No real-time canvas
- No complex data model
- No 7-day commitment

**Still tests core hypothesis:**
- Does AI-driven questioning create clarity?
- Does structured output feel valuable?
- Will users pay for personalized planning?

**Clear upgrade path:**
- MVP → Add accounts, saved sessions
- Beta → 7-day paced interview
- V1 → Progress tracking, follow-ups
- V2 → Full constellation visualization (if validated)
