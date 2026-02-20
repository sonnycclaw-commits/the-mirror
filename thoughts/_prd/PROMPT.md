# Ralph Loop: The Mirror MVP

> **PRD**: `thoughts/_prd/the-right-questions.prd.json` (v7.0)
> **Architecture**: `thoughts/_prd/patterns/discovery-architecture.md`
> **SDK Patterns**: `thoughts/_prd/patterns/vercel-ai-sdk-patterns.md`
> **UI Skill**: `thoughts/_prd/patterns/ui-skill.md`
> **Progress**: `thoughts/_prd/progress.txt`
> **Completion Promise**: `MIRROR_MVP_COMPLETE`

---

## The Paradigm Shift

```
Traditional: Ask Question → Get Answer → Next Question
This System: Scenario → Probe (askFollowUp) → Extract (extractSignal) → Mirror
```

The goal is NOT to complete a checklist.
The goal is to **extract the user's hidden patterns** and **mirror them back**.

---

## The 4-Phase Architecture

| Phase | Goal | Key Tool |
|-------|------|----------|
| **1. SCENARIOS** | User selects a relatable situation (The Trap) | `transitionToScenario` |
| **2. FOLLOW_UP** | Probe *why* they chose it (The Excavation) | `askFollowUp` (to UI), `extractSignal` (to DB) |
| **3. REFLECTION** | Synthesis of patterns & contradictions (The Mirror) | `synthesizeProfile` |
| **4. CONTRACT** | The "Momentum Contract" (The Action) | `outputContract` |

---

## Sprint Overview

| Sprint | Goal | Stories |
|--------|------|---------|
| **S0** | Foundation + Streaming Component + Recovery | 9 |
| **S1** | Chat UI + QuestionCard | 10 |
| **S2** | AI Tools Framework + Validation | 10 |
| **S3** | **Phase Machine & Mechanics** + Hard Triggers | 5 |
| **S4** | **Signals & Synthesis** + Density Monitoring | 5 |
| **S5** | **Momentum Contract** | 3 |
| **S6** | E2E + Hardening | 6 |

**Total: 48 stories** (includes 4 from pre-mortem analysis)

> [!NOTE]
> Pre-mortem stories: S0-T09 (Tiger T1), S2-T10 (Tiger T2), S3-T06 (Elephant E3), S4-T05 (Elephant E2)

---

## Critical Path

```
S0-T03: Install Convex Streaming
    ↓
S1-T04: QuestionCard Component
    ↓
S3-T01: 4-Phase State Machine
    ↓
S3-T05: Discovery Loop (Probe -> Extract)
    ↓
S4-T02: Real-Time Extraction Action
    ↓
S5-T01: Output Contract Tool
```

---

## Key Implementation Patterns

### 1. The "Probe & Extract" Loop (S3-T05)

The agent must handle two types of actions in one turn:
1. **Extraction** (Backend): Analyzing what the user JUST said (`extractSignal`).
2. **Probing** (Frontend): Asking the next question (`askFollowUp`).

This requires **parallel tool calling** capability or a strict sequential prompt.

### 2. `askFollowUp` (No Execute)

```typescript
// src/lib/ai/tools/ask-follow-up.ts
export const askFollowUp = tool({
  description: "Ask a deep, probing follow-up question.",
  parameters: z.object({
    question: z.string(),
    intent: z.string(), // "Uncover root fear"
  })
  // NO EXECUTE -> Returns to UI for rendering
});
```

### 3. `extractSignal` (Auto-Execute)

```typescript
// src/lib/ai/tools/extract-signal.ts
export const extractSignal = tool({
  description: "Save a psychological signal.",
  parameters: z.object({
    type: z.enum(['VALUE', 'FEAR', 'PATTERN']),
    content: z.string(),
    confidence: z.number()
  }),
  execute: async ({ type, content }) => {
    // Saves to Convex 'signals' table
    return { success: true, id: "sig_123" };
  }
});
```

### 4. `outputContract` (The Artifact)

```typescript
// src/lib/ai/tools/output-contract.ts
export const outputContract = tool({
  parameters: z.object({
    refusal: z.string(), // "I refuse to..."
    becoming: z.string(), // "I am the person who..."
    proof: z.string(), // 1 Year Goal
    test: z.string(), // 1 Month Goal
    vote: z.string(), // Today's Action
    rule: z.string() // Non-negotiable
  }),
  execute: async (contract) => {
    // Saves and triggers confetti UI
  }
});
```

---

## Rules of Engagement

1. **No "Why" Questions**: "Why did you do that?" is accusatory. Use "What did that get you?"
### 4.4. Security & Privacy
1.  **No Trapped Data**: All data must be exportable.
2.  **Local-First Feel**: Verify actions optimistically.
3.  **Tier 2 Ethics**: We do not manipulate users. The "Active Listener" is a neutral mirror, not a judge.

## 5. Design Standards ("God Tier")
We are building a **Digital Renaissance** artifact. Standard "Bootstrap/Material" design is strictly forbidden.

### 5.1. The Physics Engine
*   **Springs Only**: Never use `ease-in-out` or linear duration. Every interaction must use spring physics (e.g., `react-spring` or `framer-motion` springs).
*   **Mass & Friction**: Elements have weight.
    *   *Inputs*: High stiffness (400), low damping (snappy).
    *   *Cards*: Medium stiffness (250), medium damping (float).
    *   *Reveals*: Low stiffness (120), high damping (majestic).

### 5.2. The Light Engine
*   **No Shadows**: Do not use standard drop shadows (`box-shadow`).
*   **Glows**: Use colored blooms and glows to indicate depth and active states.
*   **Glass**: Use `backdrop-blur-xl` + noise textures. Dark mode is **Obsidian**, not grey.

### 5.3. Micro-Interaction Choreography
*   **Elasticity**: Lists stagger in. Scroll boundaries stretch.
*   **Morphing**: Elements transform (LayoutId), they don't just appear/disappear.
*   **Tactility**: Use haptic feedback patterns for every key interaction (Impact, Success, Error).
2. **Extract First**: Always run `extractSignal` if the user gave a meaningful answer.
3. ** Cite Evidence**: The Contract MUST reference specific scenarios. "You chose safety in Scenario 3."

---

## Ralph Success Criteria

- **Time to Epiphany**: User pauses for >5s before answering a follow-up.
- **Extraction Density**: >3 high-confidence signals per scenario.
- **Contract Clarity**: The user screenshots their contract.
