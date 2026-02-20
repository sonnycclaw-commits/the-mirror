# Life OS: Skill Tree Design

**Version:** 1.0
**Date:** 2026-01-13
**Purpose:** Define the emergent skill system for the "Unfuck Your Life" journey
**Depends On:** 7-day-trial.md (freemium split), life-os-unified-architecture.md

---

## Core Philosophy

### Skills Are Emergent, Not Predefined

Unlike Duolingo (predefined skill tree), our skills **emerge from conversation**:

```
TRADITIONAL SKILL TREE:
├── Predefined list of skills
├── User works through curriculum
├── Linear or branched progression
└── Same skills for everyone

LIFE OS SKILL TREE:
├── AI detects skills from conversation patterns
├── Skills emerge based on what user demonstrates/needs
├── Unique tree per user (personalized)
├── Skills unlock through journey milestones
└── Tree grows organically over time
```

### The Skill Detection Flow

```
USER CONVERSATION
       │
       ▼
┌──────────────────────────┐
│   EXTRACTION AGENT       │
│   Detects skill signals: │
│   • Demonstrated skills  │
│   • Skill gaps           │
│   • Growth edges         │
└───────────┬──────────────┘
            │
            ▼
┌──────────────────────────┐
│   SKILL TREE AGENT       │
│   Updates tree:          │
│   • New skills discovered│
│   • Levels adjusted      │
│   • Connections mapped   │
└───────────┬──────────────┘
            │
            ▼
┌──────────────────────────┐
│   USER'S SKILL TREE      │
│   Personalized, growing  │
└──────────────────────────┘
```

---

## Freemium Split (From 7-Day Trial Doc)

### FREE (Trial - Profile Building)

| What User Gets | What's Locked |
|----------------|---------------|
| Primary SDT driver identified | Full developmental stage |
| 2-3 patterns detected | Detailed blocker analysis |
| One key tension surfaced | Defense mechanism insights |
| Surface values | Complete skill tree |
| Profile visualization | Personalized journey |
| **Skill PREVIEW** (teaser) | **Skill DEVELOPMENT** |

### The Skill Teaser (Free)

During trial, user sees skills being detected but can't develop them:

```
┌─────────────────────────────────────────────────────────────────┐
│                     SKILLS EMERGING                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Based on our conversations, I'm detecting these abilities:     │
│                                                                  │
│  🔓 Pattern Recognition          ████░░░░░░  Detected          │
│  🔓 Self-Observation             ███░░░░░░░  Emerging          │
│  🔒 Emotional Granularity        ░░░░░░░░░░  Locked            │
│  🔒 Reframing                    ░░░░░░░░░░  Locked            │
│  🔒 + 8 more skills              ░░░░░░░░░░  Locked            │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Subscribe to unlock your full skill tree and develop           │
│  these abilities through your personalized journey.             │
│                                                                  │
│                    [Unlock Skills]                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### PAID (Journey - Skill Development)

Post-conversion, user can:
- See full skill tree
- Actively develop skills through journey
- Track skill levels
- Unlock new skills through milestones
- See skill connections/prerequisites

---

## Skill Categories

### The Six Domains

Based on the "Unfuck Your Life" journey and psychometric framework:

```
                       SELF-AWARENESS
                      (Foundation - all
                       others build on this)
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
     EMOTIONAL         COGNITIVE         BEHAVIORAL
     REGULATION         CLARITY           CHANGE
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                 ┌──────────┴──────────┐
                 │                     │
            RELATIONAL            DIRECTIONAL
             CAPACITY              (Vision)
```

---

## Skill Inventory

### 1. SELF-AWARENESS (Foundation)

These skills emerge first - they're prerequisites for everything else.

| Skill | Description | How It's Detected | Journey Phase |
|-------|-------------|-------------------|---------------|
| **Pattern Recognition** | Ability to see recurring themes in your life | User identifies patterns when prompted; connects dots across situations | Excavation |
| **Self-Observation** | Watching yourself without judgment | User describes internal states accurately; uses observer language | Excavation |
| **Trigger Awareness** | Knowing what sets you off | User identifies specific triggers; predicts reactions | Excavation |
| **Belief Detection** | Recognizing your own assumptions | User surfaces limiting beliefs; questions defaults | Excavation |
| **Emotional Granularity** | Naming emotions precisely | Uses specific emotion words vs. "good/bad"; differentiates similar states | Excavation |
| **Shadow Recognition** | Seeing disowned parts of self | Acknowledges contradictions; explores rejected aspects | Deep Excavation |

### 2. EMOTIONAL REGULATION

| Skill | Description | How It's Detected | Journey Phase |
|-------|-------------|-------------------|---------------|
| **Pause Before React** | Creating space between stimulus and response | Reports pausing; describes deliberate responses | Calibration |
| **Emotional Tolerance** | Sitting with discomfort without acting | Stays with hard emotions in conversation; doesn't deflect | Calibration |
| **State Shifting** | Intentionally changing emotional state | Describes strategies that work; demonstrates flexibility | Calibration |
| **Anxiety Navigation** | Moving forward despite anxiety | Takes action while anxious; doesn't require calm first | Calibration |
| **Shame Tolerance** | Staying present when shame arises | Discusses shame without collapsing; maintains self-worth | Evolution |
| **Emotional Recovery** | Bouncing back from setbacks | Returns to baseline after disruption; learns from falls | Evolution |

### 3. COGNITIVE CLARITY

| Skill | Description | How It's Detected | Journey Phase |
|-------|-------------|-------------------|---------------|
| **Reframing** | Seeing situations from new angles | Spontaneously offers alternative interpretations | Calibration |
| **Assumption Testing** | Questioning what you "know" | Checks beliefs against evidence; asks "is this true?" | Calibration |
| **Future Thinking** | Connecting present to long-term | References future self; considers downstream effects | Vision |
| **Decision Making** | Making choices without perfect information | Decides despite uncertainty; doesn't paralyze | Evolution |
| **Uncertainty Tolerance** | Comfort with not knowing | Holds ambiguity; doesn't force premature closure | Evolution |
| **Meta-Cognition** | Thinking about your thinking | Notices thought patterns; steps outside own perspective | Evolution |

### 4. BEHAVIORAL CHANGE

| Skill | Description | How It's Detected | Journey Phase |
|-------|-------------|-------------------|---------------|
| **Pattern Interruption** | Breaking autopilot | Reports catching patterns in-the-moment; changes course | Calibration |
| **Habit Formation** | Building sustainable routines | Creates and maintains new behaviors; stacks habits | Calibration |
| **Consistency** | Showing up repeatedly | Returns daily; follows through on commitments | Calibration |
| **Impulse Regulation** | Choosing over reacting | Delays gratification; pauses before indulgence | Calibration |
| **Recovery** | Getting back on track | Resumes after breaks without shame spiral; restarts | Evolution |
| **Identity Shifting** | Acting as your future self | Behaves from desired identity, not current habits | Evolution |

### 5. RELATIONAL CAPACITY

| Skill | Description | How It's Detected | Journey Phase |
|-------|-------------|-------------------|---------------|
| **Boundary Setting** | Defining and holding limits | Describes boundaries; says no without guilt | Calibration |
| **Authentic Expression** | Saying what you mean | Shares honestly in conversation; doesn't perform | Calibration |
| **Conflict Navigation** | Moving through disagreement | Describes handling conflict; stays relational | Evolution |
| **Support Seeking** | Asking for and receiving help | Reaches out; accepts support without shame | Evolution |
| **Connection Building** | Creating meaningful relationships | Describes deepening connections; invests in people | Evolution |
| **Empathic Accuracy** | Reading others correctly | Understands others' perspectives; checks assumptions | Evolution |

### 6. DIRECTIONAL (Vision)

| Skill | Description | How It's Detected | Journey Phase |
|-------|-------------|-------------------|---------------|
| **Values Clarity** | Knowing what matters to you | Articulates values; makes values-aligned choices | Vision |
| **Anti-Vision Awareness** | Knowing what you're running from | Describes feared future; uses as motivation | Excavation |
| **Vision Articulation** | Describing where you want to go | Paints compelling future; specific not vague | Vision |
| **Priority Setting** | Choosing what matters now | Ranks, decides, focuses; lets go of secondary | Vision |
| **Goal Decomposition** | Breaking big into small | Creates actionable steps; sequences properly | Vision |
| **Progress Recognition** | Seeing how far you've come | Acknowledges growth; doesn't dismiss wins | Evolution |

---

## Skill Levels

### Level System

Each skill has 5 levels:

```
LEVEL 0: UNAWARE
─────────────────
• Skill not yet detected
• User hasn't demonstrated this capability
• May not even know it exists

LEVEL 1: AWARE
─────────────────
• Skill detected in conversation
• User knows the concept
• Can't yet apply consistently
• "I see this now"

LEVEL 2: PRACTICING
─────────────────
• User actively working on skill
• Inconsistent application
• Requires prompting/reminding
• "I'm working on this"

LEVEL 3: DEVELOPING
─────────────────
• Improving consistency
• Can apply without prompting
• Still requires effort
• "I can do this when I remember"

LEVEL 4: COMPETENT
─────────────────
• Reliably demonstrates skill
• Applies across contexts
• Becoming automatic
• "This is becoming natural"

LEVEL 5: MASTERED
─────────────────
• Skill is integrated
• Applies automatically
• Can teach others
• "This is who I am now"
```

### Level Detection

| Signal | What It Indicates |
|--------|------------------|
| User describes skill | Level 1 (Aware) |
| User attempts skill in conversation | Level 2 (Practicing) |
| User reports using skill IRL | Level 2-3 |
| User applies without prompting | Level 3-4 |
| User teaches/explains to AI | Level 4-5 |
| Consistent application over weeks | Level 5 |

---

## Skill Tree Visualization

### Layout Concept

```
YOUR SKILL TREE
═══════════════════════════════════════════════════════════════════

                        SELF-AWARENESS
                       (Foundation Ring)
                              │
                    ┌─────────┴─────────┐
                    │                   │
              Pattern           Self-
             Recognition     Observation
               Lvl 3 ●         Lvl 2 ◐
                    │                   │
          ┌─────────┤           ┌───────┤
          │         │           │       │
     Trigger    Belief     Emotional  Shadow
    Awareness  Detection  Granularity Recog.
      Lvl 2 ◐   Lvl 1 ○     Lvl 1 ○   Lvl 0 🔒
          │
          │
    ──────┴──────────────────────────────────────
                     │
             EMOTIONAL REGULATION
               (Second Ring)
                     │
            ┌────────┼────────┐
            │        │        │
         Pause    Emotional  State
         Before   Tolerance  Shifting
         React      Lvl 1     Lvl 0
         Lvl 2 ◐      ○        🔒
            │
            └─────────► Pattern Interruption (BEHAVIORAL)
                        Unlocks when Pause Before React = Lvl 3


LEGEND:
● Developed (Lvl 3+)    ◐ In Progress (Lvl 1-2)    ○ Available    🔒 Locked
```

### Node States (Matching Visual Design Doc)

| State | Visual | Meaning |
|-------|--------|---------|
| **Locked** | 🔒 Grayed, dashed border | Prerequisites not met |
| **Available** | ○ Full color, pulsing | Ready to develop |
| **In Progress** | ◐ Partial fill, progress bar | Currently developing |
| **Developed** | ● Filled, checkmark | Lvl 3+ achieved |
| **Mastered** | ⭐ Star, glowing | Lvl 5 achieved |

---

## Skill Prerequisites & Connections

### Prerequisite Map

```
SKILL                          PREREQUISITES
─────────────────────────────────────────────────────────────────

FOUNDATION (No Prerequisites)
├── Pattern Recognition        None (entry skill)
├── Self-Observation           None (entry skill)
└── Emotional Granularity      None (entry skill)

LEVEL 2 SKILLS
├── Trigger Awareness          Pattern Recognition Lvl 2
├── Belief Detection           Self-Observation Lvl 2
├── Pause Before React         Trigger Awareness Lvl 2
├── Reframing                  Belief Detection Lvl 2
└── Anti-Vision Awareness      Emotional Granularity Lvl 2

LEVEL 3 SKILLS
├── Pattern Interruption       Pause Before React Lvl 3, Pattern Recognition Lvl 3
├── Emotional Tolerance        Pause Before React Lvl 2, Emotional Granularity Lvl 2
├── State Shifting             Emotional Tolerance Lvl 2
├── Values Clarity             Self-Observation Lvl 3, Belief Detection Lvl 2
└── Vision Articulation        Values Clarity Lvl 2, Anti-Vision Awareness Lvl 2

ADVANCED SKILLS
├── Shadow Recognition         Self-Observation Lvl 4, Emotional Tolerance Lvl 3
├── Identity Shifting          Vision Articulation Lvl 3, Pattern Interruption Lvl 3
├── Meta-Cognition             Self-Observation Lvl 4, Reframing Lvl 3
└── Uncertainty Tolerance      Emotional Tolerance Lvl 3, Meta-Cognition Lvl 2
```

### Cross-Domain Connections

Skills connect across domains, creating a web:

```
                    SELF-AWARENESS
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
    EMOTIONAL ◄────► COGNITIVE ◄────► BEHAVIORAL
          │              │              │
          └──────────────┼──────────────┘
                         │
                         ▼
                   RELATIONAL
                         │
                         ▼
                   DIRECTIONAL

EXAMPLE CONNECTIONS:
• Pattern Recognition (Self-Awareness) → enables → Pattern Interruption (Behavioral)
• Emotional Granularity (Self-Awareness) → enables → Authentic Expression (Relational)
• Reframing (Cognitive) → enhances → State Shifting (Emotional)
• Values Clarity (Directional) → guides → Decision Making (Cognitive)
```

---

## Skill Emergence Through Journey

### "Unfuck Your Life" Journey → Skill Mapping

| Journey Phase | Primary Skills Developed | How |
|---------------|-------------------------|-----|
| **Week 1: Excavation** | Pattern Recognition, Self-Observation, Trigger Awareness, Anti-Vision Awareness | Deep questioning surfaces patterns; anti-vision work |
| **Week 2: Vision** | Values Clarity, Vision Articulation, Goal Decomposition, Future Thinking | Vision building, values exercises |
| **Week 3-4: Calibration** | Pause Before React, Pattern Interruption, Habit Formation, Consistency | Daily practice, pattern interrupt challenges |
| **Month 2+: Evolution** | Identity Shifting, Meta-Cognition, Uncertainty Tolerance, Progress Recognition | Advanced work, integration |

### Milestone → Skill Unlock Map

```
JOURNEY MILESTONES                     SKILLS UNLOCKED
═══════════════════════════════════════════════════════════════════

EXCAVATION COMPLETE
├── Anti-Vision Document Created  ──►  Anti-Vision Awareness (Lvl 1)
├── 3+ Patterns Identified        ──►  Pattern Recognition (Lvl 2)
├── Trigger Map Built             ──►  Trigger Awareness (Lvl 1)
└── Core Beliefs Surfaced         ──►  Belief Detection (Lvl 1)

VISION COMPLETE
├── Values Ranked                 ──►  Values Clarity (Lvl 2)
├── Vision Statement Written      ──►  Vision Articulation (Lvl 1)
├── 1-Year Goal Set               ──►  Goal Decomposition (Lvl 1)
└── First Monthly Project Defined ──►  Priority Setting (Lvl 1)

FIRST PATTERN INTERRUPT SUCCESS
├── Caught Pattern in Moment      ──►  Pattern Interruption (Lvl 1)
├── Paused Before Reacting        ──►  Pause Before React (Lvl 2)
└── Chose Different Response      ──►  Behavioral Change (Lvl 1)

FIRST MONTH COMPLETE
├── 80%+ Daily Engagement         ──►  Consistency (Lvl 2)
├── 3+ Successful Interrupts      ──►  Pattern Interruption (Lvl 2)
├── Reported Emotional Shift      ──►  State Shifting (Lvl 1)
└── Maintained Streak 21+ Days    ──►  Habit Formation (Lvl 2)
```

---

## Skill Evidence System

### How Skills Get Detected

Each skill has specific **evidence criteria**:

```typescript
interface SkillEvidence {
  skillId: string;

  // Conversation-based evidence
  conversationSignals: {
    keywords: string[];           // Words that indicate skill
    patterns: string[];           // Response patterns
    behaviors: string[];          // Described behaviors
  };

  // Behavioral evidence
  behavioralSignals: {
    engagementPatterns: string[]; // How they use the app
    progressIndicators: string[]; // Milestones completed
    consistencyMetrics: string[]; // Streaks, frequency
  };

  // Level thresholds
  levelCriteria: {
    level1: EvidenceThreshold;
    level2: EvidenceThreshold;
    level3: EvidenceThreshold;
    level4: EvidenceThreshold;
    level5: EvidenceThreshold;
  };
}
```

### Example: Pattern Recognition Evidence

```
SKILL: Pattern Recognition

LEVEL 1 (Aware):
├── User identifies a pattern when prompted
├── Keywords: "I always...", "this keeps happening", "every time"
└── Milestone: Completes first pattern identification exercise

LEVEL 2 (Practicing):
├── User identifies 3+ distinct patterns
├── Connects patterns across different life domains
├── Keywords: "I'm noticing a pattern", "this is like when..."
└── Milestone: Creates pattern map with 3+ patterns

LEVEL 3 (Developing):
├── User identifies patterns without prompting
├── Reports catching patterns in real life
├── Keywords: "I caught myself doing...", "I noticed in the moment"
└── Milestone: Reports 3+ real-time pattern catches

LEVEL 4 (Competent):
├── User predicts patterns before they happen
├── Uses pattern awareness to make different choices
├── Keywords: "I knew this was coming", "I decided to..."
└── Milestone: 5+ successful pattern interruptions

LEVEL 5 (Mastered):
├── Pattern recognition is automatic
├── User teaches/explains patterns to others
├── Reports that pattern awareness is "just how I think now"
└── Milestone: Helps another user with pattern recognition
```

---

## UI/UX Considerations

### Skill Tree Screen

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back                  SKILL TREE                    ⚙️       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  YOUR GROWTH                                                     │
│  ───────────────────────────────────────────────                │
│  23 skills discovered • 8 developing • 3 mastered               │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                           │  │
│  │              [INTERACTIVE SKILL TREE MAP]                 │  │
│  │                                                           │  │
│  │     ⭐ Pattern          ● Self              ○ Trigger     │  │
│  │      Recognition     Observation          Awareness       │  │
│  │          │               │                    │           │  │
│  │          └───────────────┼────────────────────┘           │  │
│  │                          │                                │  │
│  │                    ◐ Pause Before                         │  │
│  │                       React                               │  │
│  │                          │                                │  │
│  │                    🔒 Pattern                             │  │
│  │                    Interruption                           │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  CURRENTLY DEVELOPING                                            │
│  ───────────────────────────────────────────────────────────    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  ◐ Self-Observation                      Level 2 → 3    │    │
│  │     ████████████████░░░░░░░  72%                        │    │
│  │     Next: Report 2 more real-time observations          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  RECENTLY UNLOCKED                                               │
│  ───────────────────────────────────────────────────────────    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  ○ Emotional Tolerance                   Available!     │    │
│  │     Prerequisites met. Ready to develop.                │    │
│  │                              [Start Developing]         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Skill Detail Modal

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ⭐ PATTERN RECOGNITION                           MASTERED      │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  "The ability to see recurring themes in your life—             │
│   to notice 'this is happening again' in the moment."           │
│                                                                  │
│  YOUR PROGRESS                                                   │
│  ○───○───○───○───●                                              │
│  Lvl1  2   3   4   5                                            │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  HOW YOU GOT HERE                                                │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Jan 5   "I noticed I always shut down when criticized"         │
│  Jan 8   "This is like the pattern with my last job"            │
│  Jan 12  "I caught it in the moment today"                      │
│  Jan 18  "I predicted it would happen and it did"               │
│  Jan 25  "Pattern awareness is just how I think now"            │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  UNLOCKS                                                         │
│  ─────────────────────────────────────────────────────────────  │
│  This skill unlocked:                                            │
│  • Pattern Interruption                                          │
│  • Trigger Awareness (enhanced)                                  │
│                                                                  │
│                              [Share Achievement]                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## MVP Scope for Skill Tree

### In MVP (v1.0)

- [ ] 15-20 core skills (not full 36)
- [ ] 3 domains: Self-Awareness, Emotional Regulation, Behavioral Change
- [ ] 5-level system
- [ ] Basic detection from conversation
- [ ] List view (not full graph visualization)
- [ ] Skills tied to journey milestones
- [ ] Shareable skill achievements

### Post-MVP (v1.1+)

- [ ] Full 36 skills across 6 domains
- [ ] Graph/radial visualization
- [ ] Cross-domain connections visible
- [ ] Skill predictions ("You're close to unlocking...")
- [ ] Skill decay (unused skills decrease)
- [ ] Skill recommendations based on goals

---

## Open Questions

| Question | Impact | Resolution |
|----------|--------|------------|
| How often should skills be re-assessed? | Accuracy vs annoyance | Test: Weekly deep check vs continuous |
| Should skills decay if not practiced? | Realism vs frustration | Likely yes, but gentle |
| How to handle skill disagreement? | User says "I have this" but AI doesn't detect | Allow self-report + AI assessment |
| Should users see the full tree or just their portion? | Motivation vs overwhelm | Show full tree, highlight theirs |

---

*Skills are capabilities, not badges. They should feel like real growth, not gamification.*
*Last updated: 2026-01-13*
