# Thought Experiment: Dynamic Signal Extraction

*How the agent probes conversationally without scripts.*

---

## The Problem with Scripts

The current scenario-content.md has scripted follow-up trees:

```
TARS: Who was the friend?
USER: [responds]
TARS: What did you tell yourself to make it okay?
USER: [responds]
TARS: Was it actually about work?
```

This is brittle. Real conversations don't follow scripts.

---

## The Solution: Intent + Tools

Instead of scripts, give Claude:

1. **The scenario choice** (what they picked)
2. **The accumulated signals** (what we know so far)
3. **The extraction goal** (what signals we want to find)
4. **The tools** (askFollowUp, extractSignal)

Claude decides *how* to probe based on context.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      DISCOVERY AGENT                         │
├─────────────────────────────────────────────────────────────┤
│  INPUTS:                                                    │
│  • Scenario choice: "Cancel on Sarah. Work first."          │
│  • Signals so far: [work-priority, people-pleasing]         │
│  • Extraction goal: Find root cause of boundary pattern     │
│                                                              │
│  TOOLS:                                                      │
│  • askFollowUp(question) - conversational probe             │
│  • extractSignal(type, content, confidence, source)         │
│  • transitionToScenario() - move to next scenario           │
│                                                              │
│  SYSTEM PROMPT:                                              │
│  "You're probing for signals. Be conversational.            │
│   Don't interview — converse. Use their words.              │
│   Extract 2-3 signals then move on."                        │
└─────────────────────────────────────────────────────────────┘
```

---

## The Tools

### askFollowUp (no execute)

```typescript
const askFollowUp = tool({
  description: `Ask a conversational follow-up question.
    NOT an interview question. A curious, direct probe.
    Short. One question at a time.
    Examples:
    - "What's the sentence you're afraid to say?"
    - "What's underneath that?"
    - "Did you know you were doing that?"
    `,
  parameters: z.object({
    question: z.string().describe("A short, direct question"),
    intent: z.enum([
      'find_root_cause',
      'surface_awareness',
      'name_the_pattern',
      'identify_trade_off'
    ]).describe("What you're trying to uncover"),
  }),
  // No execute - returns to UI for text input
});
```

### extractSignal (with execute)

```typescript
const extractSignal = tool({
  description: `Extract a signal from what the user just said.
    Call this AFTER they respond, not during.
    Only extract if confidence > 0.6.`,
  parameters: z.object({
    type: z.enum([
      'VALUE',
      'FEAR',
      'PATTERN',
      'DEFENSE'
    ]).describe("The category of signal"),
    content: z.string().describe("The actual insight"),
    source: z.string().describe("User's exact words"),
    confidence: z.number().min(0).max(1),
  }),
  execute: async (signal) => {
    await ctx.runMutation(internal.signals.add, { sessionId, signal });
    return { extracted: true };
  },
});
```

### transitionToScenario (with execute)

```typescript
const transitionToScenario = tool({
  description: `Move to the next scenario.
    Use when you've extracted enough signals (2-3) or user is going in circles.`,
  parameters: z.object({
    reason: z.enum([
      'signals_extracted',
      'user_deflecting',
      'conversation_complete'
    ]),
  }),
  execute: async ({ reason }) => {
    // Mark current scenario complete, trigger next
    return { next: 'scenario' };
  },
});
```

---

## Signal Taxonomy (Research-Backed)

*From `ideation/_deep_research/psychometric_frameworks.md` and `behaviour_change_science.md`*

### Layer 1: Behavioral Patterns

Observable tendencies extracted from scenario choices and follow-ups.

| Pattern | Description | Example Signal |
|---------|-------------|----------------|
| `people-pleasing` | Prioritizes others' needs over own | "Cancel on Sarah. Work first." |
| `conflict-avoidance` | Avoids difficult conversations | "Pretend I didn't see it" |
| `productive-procrastination` | Activity that feels productive but avoids real work | "Research more, make lists" |
| `intention-gap` | Intend to do X, don't follow through | "I'll go after work" — I won't |
| `burst-crash` | High intensity start, rapid burnout | "Start with energy, burn out in 3 days" |
| `perfectionism` | Wait for conditions to be "right" | "I'm not ready yet" |
| `rumination` | Replay events without resolution | "Replay it in my head all day" |

### Layer 2: Motivation Drivers

From Self-Determination Theory & McClelland's Needs.

**SDT Needs (which is frustrated/satisfied?):**
- `autonomy` — Need for choice, volition, self-direction
- `competence` — Need to feel effective, capable, skilled
- `relatedness` — Need for connection, belonging, being understood

**McClelland's Needs (which is dominant?):**
- `achievement` — Need to excel, overcome challenges, get feedback
- `power` — Need to influence, lead, have impact
- `affiliation` — Need for harmony, acceptance, relationships

### Layer 3: Personality Traits (HEXACO)

Observable tendencies that persist across contexts.

| Trait | High Pole | Low Pole |
|-------|-----------|----------|
| Honesty-Humility | Sincere, fair, modest | Manipulative, entitled |
| Emotionality | Anxious, sensitive | Calm, detached |
| Extraversion | Sociable, energetic | Reserved, quiet |
| Agreeableness | Forgiving, patient | Stubborn, critical |
| Conscientiousness | Organized, disciplined | Impulsive, flexible |
| Openness | Curious, creative | Conventional, practical |

### Layer 4: Defense Mechanisms

Unconscious strategies to manage anxiety. From psychoanalytic research.

| Defense | Description | Signal Example |
|---------|-------------|----------------|
| `denial` | Refusing to accept reality | "It's not that bad" |
| `rationalization` | Creating logical justification | "Work is more important anyway" |
| `projection` | Attributing own feelings to others | "They probably didn't want to see me" |
| `displacement` | Redirecting emotion to safer target | Frustration at boss → snapping at partner |
| `intellectualization` | Avoiding emotions via analysis | "Let me research this more" |
| `sublimation` | Channeling into productive activity | Exercise after frustration (healthy) |

### Layer 5: Developmental Stage Indicators

From Kegan's Adult Development Theory.

| Stage | Indicator | Signal Example |
|-------|-----------|----------------|
| Stage 3 (Socialized) | Self defined by others' expectations | "What will they think?" |
| Stage 4 (Self-Authoring) | Internal values guide decisions | "I decided this matters to me" |
| Stage 5 (Self-Transforming) | Holds multiple perspectives, fluid | "I see why both sides are right" |

### Layer 6: Habit Loop Components

From behavioral science.

| Component | What to Extract |
|-----------|-----------------|
| `cue` | What triggers the behavior? (time, location, emotion, people) |
| `routine` | The automatic behavior itself |
| `reward` | The payoff (relief, dopamine, avoidance of pain) |
| `craving` | The underlying desire the habit satisfies |

---

## The System Prompt

```markdown
## Your Role

You're having a conversation, not conducting an interview.

## Context

The user just chose: "{scenario_choice}"
This reveals signals: {initial_signals}

## Your Goal

Probe deeper to understand WHY. Extract 2-3 additional signals:
- pattern / anti_pattern
- value / fear
- trade_off / belief

## How to Probe

1. Start with curiosity about their specific choice
2. Ask SHORT follow-up questions (one at a time)
3. Use THEIR words back to them
4. Name patterns without judgment
5. Extract signals as you go

## Question Style

NOT: "Tell me about a specific time this happened."
YES: "What's the sentence you're afraid to say?"
YES: "What's underneath that?"
YES: "So you're trading X for Y. Did you know?"

## When to Stop

- You've extracted 2-3 signals with confidence > 0.7
- User is deflecting or going in circles
- Conversation feels complete

Then use transitionToScenario.
```

---

## Example Flow

**Scenario:** User chose "Cancel on Sarah. Work first."

**Signal Map (so far):**
- pattern: work-priority (0.8)
- pattern: people-pleasing (0.6)

**Claude's First Probe:**
> "Who was Sarah?"

**User:** "A friend from college. We haven't seen each other in months."

**Claude extracts:**
```json
{
  "dimension": "value",
  "pole": "relationship-importance",
  "content": "Values old friendships but sacrifices them for work",
  "source": "friend from college, haven't seen in months",
  "confidence": 0.7
}
```

**Claude's Second Probe:**
> "What did you tell yourself to make it okay to cancel?"

**User:** "That she'd understand. That work is important. That we'd reschedule."

**Claude extracts:**
```json
{
  "dimension": "belief",
  "pole": "permission-seeking",
  "content": "Uses future promise to justify present sacrifice",
  "source": "we'd reschedule",
  "confidence": 0.8
}
```

**Claude's Third Probe:**
> "Did you reschedule?"

**User:** "No. I meant to but..."

**Claude extracts:**
```json
{
  "dimension": "pattern",
  "pole": "intention-gap",
  "content": "Good intentions don't translate to action",
  "source": "I meant to but",
  "confidence": 0.9
}
```

**Claude calls transitionToScenario:**
> "That's a pattern worth noticing. Let's keep going."

---

## Why This Works

| Scripted | Dynamic |
|----------|---------|
| Fixed questions in fixed order | Claude decides based on context |
| Can't adapt to user's energy | Follows the thread |
| Feels like a form | Feels like conversation |
| Limited signal extraction | Rich, contextual signals |

---

## Implementation Notes

### Multi-Turn in One Session

Each scenario + follow-up is a mini-conversation:
1. Show scenario card → user picks option
2. Claude probes with askFollowUp
3. User responds (text)
4. Claude extracts signals, probes again (2-3x)
5. Claude calls transitionToScenario
6. Show next scenario card

### Convex Integration

```typescript
// convex/actions/discovery.ts
export const runFollowUp = internalAction(async (ctx, {
  sessionId,
  scenarioChoice,
  userResponse,
  signals
}) => {
  const stream = getTextStream(ctx, `${sessionId}-followup`);

  const result = await streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: buildFollowUpPrompt(scenarioChoice, signals),
    messages: buildMessages(sessionId, userResponse),
    tools: { askFollowUp, extractSignal, transitionToScenario },
    onFinish: async ({ toolCalls }) => {
      // Handle tool calls
      for (const call of toolCalls) {
        if (call.toolName === 'extractSignal') {
          await ctx.runMutation(internal.signals.add, {
            sessionId,
            signal: call.args
          });
        }
        if (call.toolName === 'transitionToScenario') {
          await ctx.runMutation(internal.sessions.nextScenario, { sessionId });
        }
      }
    },
  });

  // Stream TARS response to client
  for await (const chunk of result.textStream) {
    await stream.write(chunk);
  }
  await stream.close();
});
```

---

## The Reflection Phase

After all scenarios, synthesize signals into the reflection:

```typescript
const synthesizeProfile = tool({
  description: 'Generate the reflection from accumulated signals',
  parameters: z.object({
    pattern: z.string(),
    antiPattern: z.string(),
    vision: z.string(),
    antiVision: z.string(),
    tradeOff: z.string(),
  }),
  execute: async (profile) => {
    await ctx.runMutation(internal.sessions.setProfile, { sessionId, profile });
    return { synthesized: true };
  },
});
```

**System Prompt for Synthesis:**
```markdown
Given these signals: {all_signals}

Generate a reflection with:
- pattern: What they actually do (observable behavior)
- anti_pattern: What they wish they did
- vision: What they're moving toward
- anti_vision: What they're running from
- trade_off: What has to give

Use their exact words where possible.
Be direct. No hedging. This should land.
```

---

## Open Questions

1. **How many follow-ups per scenario?**
   - Probably 2-4, with Claude deciding based on signal richness

2. **What if user gives one-word answers?**
   - Claude should probe differently, or move on

3. **How do we prevent Claude from being too probing?**
   - System prompt guardrails + examples of when to back off

4. **How do we handle user resistance?**
   - Detect deflection patterns, offer to skip

---

*The key insight: Claude is smart enough to probe dynamically. Give it intent + tools, not scripts.*
