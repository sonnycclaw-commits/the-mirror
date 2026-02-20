# Synthesis Mechanics: From Signals to Momentum

> **Goal**: Turn raw signals into a "Momentum Contract" that feels like a psychic reading.
> **Method**: Pattern Matching, Contradiction Detection, and Evidence Linking.

---

## 1. The Data Structure

Everything flows into the **Memory Graph**.

```typescript
interface MemoryGraph {
  signals: Signal[];
  choices: Choice[];
  patterns: Pattern[];
}

type Signal = {
  id: string;
  type: 'VALUE' | 'FEAR' | 'DEFENSE' | 'DESIRE';
  content: string; // e.g., "Avoids conflict at cost of truth"
  source: string; // "Scenario 2 Choice" or "Follow-up Answer 3"
  confidence: number;
};

type Choice = {
  scenarioId: string;
  optionId: string; // "safe_route"
  implication: string; // "Prioritizes short-term comfort"
};
```

---

## 2. The Synthesis Process

This runs during **Phase 3: REFLECTION**.

### Step 1: Pattern Recognition
Claude looks for repetition across scenarios.

*   **Logic**: If `type: FEAR` appears in >2 scenarios with similar content.
*   **Example**:
    *   Scenario 1: "Stay quiet" (Fear of conflict)
    *   Scenario 3: "Apologize" (Fear of conflict)
    *   **Pattern**: "Chronic Conflict Avoidance"

### Step 2: Contradiction Detection
Claude compares *Stated Values* (what they say) vs. *Revealed Behaviors* (what they do).

*   **Logic**: If `signal.type === 'VALUE'` contradicts `choice.implication`.
*   **Example**:
    *   User says: "I want to be a bold leader."
    *   User chooses: "Wait for permission" in Scenario 4.
    *   **Contradiction**: "Identity Gap: Aspirational Leader vs. Behavioral Follower."

---

## 3. The Contract Generation Prompt

When calling `outputContract`, the system prompt must enforce **Evidence Citation**.

```markdown
# Goal: Generate the Momentum Contract

## Input Data
- Patterns: {patterns}
- Contradictions: {contradictions}
- Top Signals: {signals}

## Instructions for Each Section

1. **THE REFUSAL** (The Anti-Vision)
   - Identify the dominant negative pattern.
   - Write: "I refuse to continue [Pattern Name]."
   - Add Evidence: "This showed up when you chose [Option A] in the Career Scenario and [Option B] in the Relationship Scenario."

2. **THE BECOMING** (The Identity)
   - Invert the refusal.
   - Write: "I am the type of person who [Positive Behavior]."
   - Connect to a Value Signal: "Because deep down, you value [Value Name]."

3. **THE PROOF** (1 Year Goal)
   - Make it concrete. The undeniable evidence that the Identity is real.

4. **THE TEST** (1 Month Project)
   - A short-term sprint to validate the proof.

5. **THE VOTE** (Today's Action)
   - The smallest unit of execution. "Today, I..."

6. **THE RULE** (The Constraint)
   - A bright-line rule to prevent the negative pattern.
   - Example: "I do not say 'yes' immediately. I say 'let me check'."
```

---

## 4. Example Output

**User Profile**:
- Identified as "People Pleaser"
- Value: "Harmony"
- Fear: "Rejection"

**Generated Contract**:

*   **THE REFUSAL**: "I refuse to set myself on fire to keep others warm. (You did this in the 'Dinner' scenario when you paid for everyone, and in 'Work' when you took the extra shift)."
*   **THE BECOMING**: "I am the type of person who protects my energy so I can serve from overflow, not depletion."
*   **THE PROOF**: "In 1 year, I have $10k in savings and a calm nervous system."
*   **THE TEST**: "This month, I say 'No' to 3 social obligations."
*   **THE VOTE**: "Today, I cancel the dinner I don't want to attend."
*   **THE RULE**: "I do not apologize for having needs."
