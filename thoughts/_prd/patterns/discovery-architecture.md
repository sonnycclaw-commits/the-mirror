# Discovery Interview: Deep Technical Architecture

> **Level**: Tier-1 SWE
> **Goal**: Build a production-grade signal extraction & synthesis system

---

## 1. The Core Problem

Traditional chatbots are "amnesiac advice givers." They:
1. Don't know who you are (no deep signal extraction)
2. Don't remember what you did (no cross-scenario memory)
3. Give generic advice (no evidence-backed synthesis)

We are building a **signal-extraction engine** disguised as a conversation.

---

## 2. The New Flow (4 Phases)

Instead of a long 7-phase interview, we use a high-signal 4-phase loop:

1.  **SCENARIOS** (Input): User picks from 4-6 recognizable life situations.
2.  **FOLLOW-UPS** (Extraction): Claude probes *why* (`askFollowUp`), extracts signals in real-time (`extractSignal`), and detects patterns.
3.  **REFLECTION** (Synthesis): Claude mirrors back the pattern across scenarios (`synthesizeProfile`).
4.  **CONTRACT** (Action): A "Momentum Contract" built from their own data (`outputContract`).

---

## 3. The Tool Ecosystem

### 3.1 `askFollowUp` (Conversational Probe)

**Purpose**: To dig deeper into a specific scenario choice.
**Execution**: NO execute function (returns to UI).

```typescript
const askFollowUp = tool({
  description: "Ask a curious, direct follow-up question. NOT an interview. A probe.",
  parameters: z.object({
    question: z.string(),
    intent: z.string().describe("What you are trying to uncover (e.g., 'root_cause_of_fear')"),
  })
});
```

### 3.2 `extractSignal` (Real-Time Extraction)

**Purpose**: To capture psychological data *while* the user speaks.
**Execution**: Auto-executes after user response.

```typescript
const extractSignal = tool({
  description: "Extract a psychological signal from user text.",
  parameters: z.object({
    type: z.enum(['VALUE', 'CONSTRAINT', 'FEAR', 'PATTERN', 'GOAL', 'DEFENSE_MECHANISM']),
    content: z.string().describe("The extracted signal (e.g., 'Avoids conflict at cost of self')"),
    source: z.string().describe("The EXACT words/choice that evidenced this"),
    confidence: z.number()
  })
});
```

### 3.3 `synthesizeProfile` (Pattern Recognition)

**Purpose**: To find contradictions and themes across the whole session.
**Execution**: Runs at the end of discovery.

```typescript
const synthesizeProfile = tool({
  description: "Synthesize extracted signals into a cohesive profile.",
  parameters: z.object({
    pattern: z.string().describe("The dominant behavioral pattern"),
    antiPattern: z.string().describe("The healthy alternative"),
    evidence: z.array(z.string()).describe("List of quotes/choices supporting this")
  })
});
```

### 3.4 `outputContract` (The Artifact)

**Purpose**: To generate the final Momentum Contract.
**Execution**: Saves to database and renders UI.

```typescript
const outputContract = tool({
  description: "Generate the final Momentum Contract.",
  parameters: z.object({
    refusal: z.string().describe("The Anti-Vision ('I refuse to...')"),
    becoming: z.string().describe("The Identity ('I am the type of person who...')"),
    proof: z.string().describe("1-Year Goal"),
    test: z.string().describe("1-Month Goal"),
    vote: z.string().describe("Today's Action"),
    rule: z.string().describe("The Non-Negotiable Constraint")
  })
});
```

---

// [Tool Execution Flow remains similar, but using the new tools]

### 3.3 The Core Loop

```typescript
// src/lib/ai/discovery-agent.ts

export async function runDiscoveryStep(
  state: DiscoveryState,
  userInput: string | ToolResult
): Promise<DiscoveryStepResult> {

  // 1. Build context with signals and last 10 messages
  const messages = buildMessages(state, userInput);
  const systemPrompt = buildSystemPrompt(state);

  // 2. Call Model
  const result = await generateText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: systemPrompt,
    messages,
    tools: {
      askFollowUp,     // No execute -> Returns to UI
      extractSignal,   // Execute -> Saves to DB pattern list
      transitionToScenario, // Execute -> Moves to next scenario
      outputContract,  // Execute -> Finalizes
    },
    maxSteps: 5,
  });

  // 3. Handle 'askFollowUp' (UI Question)
  const questionCall = result.toolCalls?.find(tc => tc.toolName === 'askFollowUp');
  if (questionCall) {
    return {
      type: 'QUESTION',
      question: questionCall.args,
      toolCallId: questionCall.toolCallId
    };
  }

  // 4. Default: Message or Transition
  return {
    type: 'MESSAGE',
    content: result.text
  };
}
```

---

## 4. Signal-Driven Logic

We follow a pattern of **"Probe -> Extract -> Reflect"**.

### 4.1 System Prompt Logic

```markdown
# Role: TRQ Discovery Agent
You are an expert interviewer using the "Momentum Method."
Your goal is to extract the user's hidden patterns and contradictions.

## Context
User just selected Scenario Option: "{option_text}"
Current Signals: {signals_summary}

## Instructions
1. **Probe**: Ask ONE deep follow-up question (`askFollowUp`).
   - Do NOT ask generic "why".
   - Ask about the FEELING or the TRADE-OFF.
   - Example: "You chose safety. What did that cost you?"

2. **Extract**: If the user just spoke, run `extractSignal` immediately.
   - Look for conflicts between what they SAY and what they DO.
   - Look for defense mechanisms (rationalization, projection).

3. **Advance**: If you have 3+ solid signals for this scenario, `transitionToScenario`.
```

### 4.2 Phase-Aware System Prompts

```typescript
// src/lib/prompts/discovery-system.ts
// src/lib/prompts/discovery-system.ts

const PHASE_PROMPTS = {
  SCENARIO_SELECTION: (context: string) => `
## Phase 1: THE SCENARIO (Context)
**Context**: User Input: "${context}"
**Goal**: Understand the user's current reality.
**Voice**: TARS (Warm, curious, uses gravity/orbit metaphors).

1. Present 4-6 archetypal scenarios based on their input.
2. Use 'askFollowUp' to probe the *feeling* of the choice.
`,

  FOLLOW_UP: (signals: string) => `
## Phase 2: THE EXCAVATION (Signals)
**Accumulated Signals**:
${signals}

**Goal**: Uncover the hidden drivers (Values, Fears, Defenses).
**Voice**: The Mirror (Neutral, observant, compassionate).

1. Reflect their words back. "You mentioned [Quote]..."
2. If they say "I want freedom", ask "What are you running from?"
3. Use 'extractSignal' for every meaningful insight.
`,

  REFLECTION: (pattern: string) => `
## Phase 3: THE SYNTHESIS (Pattern)
**Detected Pattern**: ${pattern}

**Goal**: Show them their loop.
**Voice**: The Architect (Structural, clear, "I see the code").

1. "You say you want X, but you choose Y because of Z."
2. Use 'synthesizeProfile' to formalize this pattern.
3. Ask for confirmation: "Does this sound true?"
`,

  DECOMPOSITION: (goal: string) => `
## Phase 4: THE STRATEGY (The Walk)
**Target Goal**: "${goal}"

**Goal**: Turn the "Ambition" into a concrete "Campaign Plan".
**Voice**: The General (Protective, strategic, "We must secure the perimeter").

**0. The Bridge**:
"I hear your fear. The only way to silence it is with a plan. Let's build your defense."

**1. The Drill Down Rubric** (Mental Model):
- **Resources**: Do they have < 5hrs/week? < $500?
- **Skills**: Can they build it? Can they sell it?
- **Market**: Who is the FIRST customer?

**2. The Output**:
- **The North Star**: 1 year vision.
- **The Proof**: 1 month outcome.
- **The Test**: 1 week experiment.
- **The Spark**: 15 min task.
`,

  CONTRACT: (draft: string) => `
## Phase 5: THE CONTRACT (Artifact)
**Goal**: Seal the commitment.
**Draft**: ${draft}

1. Present the draft.
2. Ask for the "Signature" (Confirmation).
3. Generate the final artifact using 'outputContract'.
`
};

  HANDOFF: `
## Current Phase: HANDOFF (7 of 7)

The contract is generated. Your final job:
1. Display the spark prominently
2. Ask if they can do it RIGHT NOW
3. Offer to add to calendar

This is the end. The user leaves with an action, not just a plan.
`
};
```

---

## 5. Memory & Context Management

### 5.1 The Problem

Long discovery sessions can exceed context limits. We need:
- **Short-term memory**: Current phase context
- **Long-term memory**: Decisions, signals, profile

### 5.2 The Solution: Hierarchical Context

```typescript
// src/lib/discovery/context-manager.ts

interface ContextWindow {
  // Always included (small)
  systemPrompt: string;
  currentPhase: Phase;
  recentDecisions: Decision[]; // Last 5 only

  // Summarized (medium)
  profileSummary: string; // Compressed signals
  progressSummary: string; // "Completed: PROBLEM, USER_EXPERIENCE"

  // Full (only when needed)
  fullHistory?: Message[]; // Only last 10 messages
}

export function buildContextWindow(state: DiscoveryState): ContextWindow {
  return {
    systemPrompt: PHASE_PROMPTS[state.currentPhase],
    currentPhase: state.currentPhase,
    recentDecisions: state.decisions.slice(-5),
    profileSummary: summarizeProfile(state.signals),
    progressSummary: summarizeProgress(state),
  };
}

function summarizeProfile(signals: Signal[]): string {
  // Compress signals into a paragraph
  const values = signals.filter(s => s.type === 'VALUE').map(s => s.content);
  const constraints = signals.filter(s => s.type === 'CONSTRAINT').map(s => s.content);
  const fears = signals.filter(s => s.type === 'FEAR').map(s => s.content);

  return `
User Profile:
- Values: ${values.join(', ')}
- Constraints: ${constraints.join(', ')}
- Fears/Blockers: ${fears.join(', ')}
`.trim();
}

function summarizeProgress(state: DiscoveryState): string {
  const completed = state.completedCategories.join(', ');
  const decisionCount = state.decisions.length;

  return `Progress: Completed categories: ${completed}. ${decisionCount} decisions made.`;
}
```

### 5.3 Sliding Window for Messages

```typescript
// Keep last N messages, summarize older messages
function buildMessages(state: DiscoveryState): Message[] {
  const { messages } = state;

  if (messages.length <= 10) {
    return messages;
  }

  // Summarize older messages
  const oldMessages = messages.slice(0, -10);
  const recentMessages = messages.slice(-10);

  const summary: Message = {
    role: 'system',
    content: `[Previous conversation summary: ${summarizeMessages(oldMessages)}]`,
  };

  return [summary, ...recentMessages];
}
```

---

// [Memory section updated to focus on Signal Extraction first]

## 6. Memory & Synthesis

### 6.1 The Memory Graph

We need to store data in a way that allows cross-referencing:

```typescript
// convex/schema.ts
// Signals are the "atoms" of the profile
signals: v.array(v.object({
  id: v.string(),
  type: v.string(), // VALUE, FEAR, PATTERN
  content: v.string(), // "People Pleasing"
  evidence: v.string(), // "Selected 'Say Yes' in Scenario 3"
  source_id: v.string(), // Message ID or Scenario ID
  confidence: v.number()
}))

// Contradictions are the "insights"
contradictions: v.array(v.object({
  stated: v.string(), // "I want autonomy"
  behavior: v.string(), // "Chose dependency in 4/6 scenarios"
  insight: v.string() // "Safety is valued higher than freedom"
}))
```

### 6.2 Synthesis Prompting

When we generate the contract, we don't just dump the log. We ask for **evidence**:

```
Generate the 'Refusal' statement.
Base it on the {fears} signals.
Quote the specific scenario choices where this fear manifested.
Format:
"I refuse to [Anti-Vision]...
(As seen when you chose [Option] in [Scenario])"
```

---

## 7. Decision Logging (ADR Pattern)

Every choice the user makes is logged as an Architecture Decision Record:

```typescript
// convex/schema.ts
decisions: v.array(v.object({
  id: v.string(),
  timestamp: v.number(),
  phase: PhaseEnum,
  category: v.optional(CategoryEnum),

  // The question
  question: v.string(),
  context: v.string(),
  options: v.array(v.object({
    label: v.string(),
    description: v.string(),
    wasSelected: v.boolean(),
  })),

  // The decision
  selectedOption: v.string(),
  reasoning: v.optional(v.string()),

  // Consequences (filled by model)
  implications: v.array(v.string()),
  tradeoffs: v.array(v.string()),
}));
```

### 7.1 Why This Matters

When users return later and say "Why did I choose this?", we can show:

```
Decision #5: Diet Protocol Selection

Question: "Which approach fits your lifestyle?"
Context: You mentioned limited time and inconsistent schedule.

Options:
- ✓ Intermittent Fasting - "Simple rules, no tracking"
- ○ Calorie Counting - "Maximum control, requires logging"
- ○ Meal Prep - "Batch cooking on Sundays"

Your Choice: Intermittent Fasting
Reasoning: "Simplest to maintain with travel schedule"

Trade-offs Accepted:
- Less precise control over macros
- May need adjustment during intense training phases
```

---

## 8. UI Components

### 8.1 ChatInterface (DiscoveryInterface)

The primary interface is now a stream of text and "thought bubbles" (patterns/signals):

```typescript
// src/components/discovery/ChatInterface.tsx
export function ChatInterface() {
  const { messages, phase, isExtracting } = useDiscovery();

  return (
    <div className="flex flex-col h-full">
      <PhaseIndicator currentPhase={phase} />
      <MessageList messages={messages} />
      {isExtracting && <SignalPulse />}
      <InputArea />
    </div>
  );
}
```

### 8.2 ScenarioSelector (Phase 1)

Instead of a generic `QuestionCard`, we use a dedicated `ScenarioSelector` for the initial "Trap":

```typescript
// src/components/discovery/ScenarioSelector.tsx
export function ScenarioSelector({ onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {SCENARIOS.map(s => (
        <Card key={s.id} onClick={() => onSelect(s.id)}>
          <CardHeader>{s.title}</CardHeader>
          <CardContent>{s.hook}</CardContent>
        </Card>
      ))}
    </div>
  );
}
```

---

## 9. The Pulse Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (React)                        │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────────┐  ┌────────────────┐ │
│  │ ChatInterface │  │ ScenarioSelector │  │ ContractView   │ │
│  └──────┬───────┘  └────────┬─────────┘  └───────┬────────┘ │
│         │                 │                    │            │
│         └─────────────────┼────────────────────┘            │
│                           │                                 │
│                  ┌────────▼────────┐                       │
│                  │  useDiscovery   │                       │
│                  └────────┬────────┘                       │
└───────────────────────────┼─────────────────────────────────┘
                            │
                   HTTP/WebSocket (Convex)
                            │
┌───────────────────────────┼─────────────────────────────────┐
│                    Convex Backend                           │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐   ┌─────────────────┐   ┌────────────┐ │
│  │  Actions: chat  │   │  mutations:     │   │  Tables:   │ │
│  │  (Streaming)    │   │  addSignal      │   │  signals   │ │
│  └──────┬──────────┘   │  setPhase       │   │  contract  │ │
│         │              └─────────────────┘   │  sessions  │ │
│  ┌──────▼────────┐                           └────────────┘ │
│  │    Claude 3.5 │                                          │
│  │    Sonnet     │                                          │
│  └──────┬────────┘                                          │
│         │                                                   │
│  ┌──────▼────────┐                                          │
│  │  Tool Calls   │                                          │
│  │  - askFollowUp│                                          │
│  │  - extractSig │                                          │
│  └───────────────┘                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 10. Key Insights

### 10.1 The Paradigm Shift
Traditional chatbots: **Model generates text → User reads.**
TRQ Agent: **User speaks → Model extracts → Model mirrors.**

### 10.2 Why "No Execute" on Follow-Ups?
We define `askFollowUp` as a tool but *don't* execute it on the server.
Why? Because it forces the model to structure its probing intent *before* generating text.
The tool definition acts as a "thought constraint" for the LLM.

### 10.3 The Momentum Contract
The final output isn't just a summary—it's a **generated artifact** stored structurally.
This allows us to:
1. Render it as a beautiful React component
2. Export it to PDF/ICS
3. Track "compliance" over time (Did they do 'The Vote'?)

---
