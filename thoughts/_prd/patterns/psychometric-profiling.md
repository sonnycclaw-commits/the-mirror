# Psychometric Profiling Patterns

> **Source**: _deep_research/psychometric_frameworks.md
> **Purpose**: Extracting deep psychological signals from conversation
> **Status**: CANONICAL - This is the reference schema for signal extraction
> **Decision**: See `decisions/DECISION-001-validated-extraction.md` for implementation details

---

## Core Frameworks

We layer four empirically validated frameworks to build a "living profile":

| Layer | Framework | Purpose | What to Look For |
|-------|-----------|---------|------------------|
| **Traits** | **HEXACO** | Stable personality disposition | Honesty-Humility, Openness, Emotionality markers |
| **Motivation** | **SDT** | Dynamic well-being needs | Autonomy (choice), Competence (mastery), Relatedness (connection) |
| **Development** | **Kegan/Loevinger** | Meaning-making structure | "Subject-Object" shifts, self-authorship, complexity of perspective |
| **Patterns** | **Attachment** | Relational dynamics | Narrative coherence, anxiety vs avoidance in relationships |

---

## Analysis Techniques

TARS uses three distinct modes of listening to extract these signals.

### 1. Lexical Analysis (Trais & States)
*Listening to word choice and frequency.*

- **HEXACO Honesty-Humility**: Look for fairness, lack of greed, sincerity markers.
- **Emotionality**: Frequency of anxiety/fear words vs resilience words.
- **Openness**: Complexity of language, aesthetic metaphors, curiosity indicators.

### 2. Narrative Analysis (Needs & Attachment)
*Listening to the stories told.*

- **SDT Deficits**:
  - *Autonomy*: "I had to," "They made me," "I felt trapped."
  - *Competence*: "I'm stuck," "I don't know how," "It's too hard."
  - *Relatedness*: "I feel alone," "No one understands," "I'm distinct/separate."

- **Attachment (Coherence)**:
  - *Secure*: Clear, balanced stories about past/relationships. Acknowledges bad satisfyingly.
  - *Anxious*: Rambling, caught up in past anger, overwhelming detail.
  - *Avoidant*: Short, dismissive, idealized ("It was fine"), lack of specific memories.

### 3. Structural Analysis (Developmental Stage)
*Listening to HOW they make meaning (not what).*

- **Stage 3 (Socialized)**: Identity defined by others.
  - "I want to be a good X."
  - Conflict perceived as "Me vs Them" or internalized guilt.
  - Cannot separate self from relationships/expectations.

- **Stage 4 (Self-Authoring)**: Identity defined by self.
  - "I decided that doesn't work for me."
  - Conflict perceived as "My values vs Their values."
  - Can take perspective on relationships.

- **Stage 5 (Self-Transforming)**: Identity is fluid/multi-system.
  - "I can see how my view created this conflict."
  - Holds paradoxes easily.
  - Sees self as an evolving process, not a fixed thing.

---

## Signal Extraction Mechanics

We capture 5 distinct signal types to build the profile.

| Signal Type | Source | Example |
|-------------|--------|---------|
| **STATED** | Discursive content | "I want to start a business" |
| **EMOTIONAL** | Sentiment & markers | Resistance words ("but", "I can't"), negative sentiment spikes |
| **TEMPORAL** | Latency & Timing | Long pauses on specific topics, hesitation, time of day |
| **RELATIONAL** | Entity extraction | People mentioned, frequency, and associated sentiment |
| **BEHAVIORAL** | Interaction patterns | Topics skipped, deflections, shortness of answers |

### Pattern Detection (Granger Causality)
TARS looks for causal links between signals over time (3+ observations).

> *Example:* "Every time you mention [Father], your response time on [Career] questions increases."

---

## Profile Synthesis: The Context Graph

We do not just store a flat list of traits. We build a **Context Graph** that connects these signals to guide future interactions.

> **Source**: `ideation/visual/context-graph-model.md`

### 1. Graph Structure
The profile is stored as a graph of **Nodes** (Signals) and **Edges** (Relationships).

**Nodes**
- **STATED**: Goals, values, fears (from content)
- **BEHAVIORAL**: Actions taken/skipped, latency (from usage)
- **EMOTIONAL**: Sentiment, resistance markers
- **TEMPORAL**: Time patterns (e.g., "Monday mornings")
- **RELATIONAL**: Key entities (Partner, Boss)

**Edges**
- **CONTRADICTION**: Gap between Stated Goal ("health") and Behavioral Node ("skipped gym").
- **CAUSATION**: Event A (Conflict) -> Probability B (Relapse).
- **CORRELATION**: Temporal Node (Monday) -> Emotional Node (Low Energy).
- **BLOCKERS**: Belief Node ("I can't") -> Action Node (Inaction).

### 2. Guidance Logic (Context Injection)
The Graph actively shapes the conversation context (System Prompt).

| Graph Pattern | Context Injection |
|---------------|-------------------|
| **Contradiction Edge** | *Prompt:* "User stated X but behavior shows Y. Gently surface this gap." |
| **Causation Edge** | *Prompt:* "User reported [Trigger Event]. Risk of [Negative Outcome] is 80%. Preemptively suggest coping strategy." |
| **Blocker Edge** | *Prompt:* "User is stuck on [Goal]. Graph shows [Belief] is the blocker. Target questions to deconstruct [Belief]." |
| **Relational Node** | *Prompt:* "User is mentioning [Partner]. History shows this is a high-conflict topic. Adopt 'supportive' tone." |

---

## Profiling Schema

The extraction result from any session should map to this living structure.

```typescript
interface PsychometricProfile {
  // Stable Traits (HEXACO)
  traits: {
    honestyHumility: { score: number; confidence: number; evidence: string[] };
    emotionality: { score: number; confidence: number; evidence: string[] };
    extraversion: { score: number; confidence: number; evidence: string[] };
    agreeableness: { score: number; confidence: number; evidence: string[] };
    conscientiousness: { score: number; confidence: number; evidence: string[] };
    openness: { score: number; confidence: number; evidence: string[] };
  };

  // Dynamic Needs (SDT) - Updates frequently
  needs: {
    autonomy: { status: 'satisfied' | 'frustrated'; intensity: number; context: string };
    competence: { status: 'satisfied' | 'frustrated'; intensity: number; context: string };
    relatedness: { status: 'satisfied' | 'frustrated'; intensity: number; context: string };
  };

  // Developmental Center of Gravity
  development: {
    stage: 'Socialized' | 'Self-Authoring' | 'Self-Transforming';
    transitioning: boolean; // Indicators of being "in between"
    evidence: string[];
  };

  // Relational/Behavioral Patterns
  patterns: {
    attachmentStyle: 'Secure' | 'Anxious' | 'Avoidant' | 'Disorganized';
    defenseMechanisms: string[]; // e.g., "Intellectualization", "Projection"
    habitLoops: Array<{
      cue: string;
      routine: string;
      reward: string;
    }>;
  };
}
```

---

## Best Practices for TARS

1. **Don't Over-Infer**: Only update the profile when confidence is high. Use "low confidence" flags for initial hunches.
2. **Context Matters**: A user might be Stage 4 at work but Stage 3 in relationships. Note the domain.
3. **Reflect Back**: Use the profile to generate reflection questions.
   - *If high Autonomy frustration:* "It sounds like you feel you're lacking choice in this."
   - *If intellectualizing:* "I hear the logic, but what is the feeling underneath that?"
4. **Trend over Point**: Developing a profile takes time. Look for patterns across multiple conversations.

---

*See `_deep_research/psychometric_frameworks.md` for full academic backing.*
