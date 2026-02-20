# Pseudo-Analysis: The Right Questions Loop

> **Objective**: Demonstrate how the Discovery Interview (Input) powers the Psychometric Profile (State) to generate The Right Question (Output).

---

## Scenario: "The Stalled Founder"
**User**: Alex (32, PM at Tech Co)
**Stated Goal**: "I want to launch my own SaaS product."
**Current State**: Has had the idea for 2 years. Zero code written.

---

## Step 1: Discovery Interview (Excavation)
*Detailed in `discovery-interview.md`*

**TARS (Intensive Mode - Q1):**
"Alex, let's be honest. You've had this idea for 2 years. What is the **unbearable truth** about why you haven't started? Ideally, the reason that makes you look weak, not busy."

**Alex:**
"Honestly? I'm exhausted. My boss is a micromanager. By the time I get to the weekend, I just want to play video games and zone out. I tell myself I'm 'recharging' for the startup work, but I never get to it."

---

## Step 2: Signal Extraction (The Listen)
*Detailed in `psychometric-profiling.md`*

TARS analyzes the response using the 5 Signal Types:

| Layer | Extracted Signal | Classification |
|-------|------------------|----------------|
| **STATED** | "Job is exhausting," "Boss is micromanager" | **Constraint** |
| **BEHAVIORAL** | "Play video games," "Zone out" (instead of coding) | **Avoidance / Numbing** |
| **EMOTIONAL** | "Exhausted," "Weak" (implicit admissions) | **Low Energy / Shame** |
| **TEMPORAL** | Pattern: Weekdays -> Drain -> Weekend -> Numb | **Cyclic Blocker** |
| **RELATIONAL** | Entity: Boss. Sentiment: Negative. | **External Locus** |

---

## Step 3: Profile Synthesis (The Graph)
*Detailed in `psychometric-profiling.md` (Context Graph)*

TARS updates the **Context Graph** in real-time.

### Nodes Added
- `[Node: GOAL]` Launch SaaS
- `[Node: REALITY]` Numbing on weekends
- `[Node: RELATIONAL]` Boss (Antagonist)

### Edges Formed
1.  **CONTRADICTION**: `[GOAL: SaaS]` <---> `[BEHAVIOR: Video Games]`
    *   *Insight*: Stated value does not match lived reality.
2.  **CAUSATION**: `[RELATIONAL: Boss]` --(causes)--> `[STATE: Exhaustion]`
3.  **ENABLES**: `[STATE: Exhaustion]` --(enables)--> `[BEHAVIOR: Video Games]`
    *   *Insight*: The exhaustion is the *excuse* for the avoidance.

### Psychometric Inference (Hidden Layer)
- **SDT Profile**: **Autonomy** is critically low (Boss).
- **Developmental Stage**: **Stage 3 (Socialized)**. He is blaming the external "Other" (Boss) for his internal inaction. He hasn't taken self-authorship of his energy yet.

---

## Step 4: The Right Question (The Output)
*Detailed in `the-right-questions.prd.json`*

TARS needs to generate a question that:
1.  Validation: Acknowledges the exhaustion (builds trust).
2.  Challenge: Targets the **Contradiction Edge**.
3.  Aim: Push him from Stage 3 -> Stage 4 (Taking responsibility).

**Naive AI Response (Bad):**
"Have you tried time-blocking your Saturday mornings before you get tired?"
*(Fixing mode - rejected)*

**Therapeutic AI Response (Better):**
"It sounds like your job is really draining you. That's hard."
*(Validating mode - rejected, too passive)*

**TARS "The Right Question" (Optimal):**
"Let's run a simulation. If your boss vanished tomorrow, and you had $10M in the bank—so no exhaustion, no pressure—what would you **actually** do this Saturday? Would you open your code editor, or would you still play video games?"

---

## Why This Works (The "Pad Out" Effect)

1.  **It uses the Graph**: It isolates the **Blocker** (Boss/Exhaustion) and removes it from the equation to test the **Goal** strength.
2.  **It updates the Schema**:
    *   **If Alex says "I'd code":** Then the problem is indeed **Energy Management**. We build a plan to protect energy.
    *   **If Alex says "I'd probably still play games":** Then the problem is **The Goal Itself**. He doesn't actually want to build a SaaS; he just wants to escape his job. The profile updates: `[GOAL: SaaS]` -> `[FANTASY: Escape]`.

This acts as a ratchet. Every question tightens the profile. The schema isn't just "padded out"—it becomes **higher resolution**.

**Result**: We move from "Productivity Issue" (Surface) to "Existential Misalignment" (Deep), saving Alex 2 more years of fake struggle.
