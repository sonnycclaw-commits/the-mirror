# Room Architecture

## The Core Loop

```
┌─────────────────────────────────────────────────────────────────┐
│                        THE ROOM LOOP                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. SCENE OPENS                                                 │
│     - Pressure introduced (external force acting on player)    │
│     - Context established (where, who, what's at stake)        │
│     - Player has agency to act                                  │
│                                                                 │
│  2. PLAYER ACTS (free input)                                    │
│     - No multiple choice                                        │
│     - Player writes what they do                               │
│     - System extracts from language + action                   │
│                                                                 │
│  3. RESPONSE READER extracts:                                   │
│     - VALUE: What matters to them                              │
│     - NEED: What's satisfied/frustrated                        │
│     - DEFENSE: How they protect themselves                     │
│     - ATTACHMENT: How they relate                              │
│     - DEVELOPMENT: How they make meaning                       │
│     - PATTERN: What they keep doing                            │
│                                                                 │
│  4. JUDGMENT VOICE responds:                                    │
│     - Names the pattern observed                               │
│     - Armed with evidence (quotes player)                      │
│     - No condemnation, just truth                              │
│     - "You chose X. That's the third time."                    │
│                                                                 │
│  5. ESCALATION CHECK:                                           │
│     - If avoidance detected → pressure increases               │
│     - If pattern breaks → room can clear                       │
│     - If pattern reinforces → room continues                   │
│                                                                 │
│  6. CONSEQUENCE:                                                │
│     - Scene evolves based on extraction                        │
│     - NPCs remember                                             │
│     - Environment shifts                                        │
│     - Stakes change                                             │
│                                                                 │
│  7. CLEAR CONDITION CHECK:                                      │
│     - Pattern revealed? → Room clears, extraction logged       │
│     - Pattern broken? → Room clears, capacity logged           │
│     - Neither? → Loop continues                                │
│                                                                 │
│  8. NEXT ROOM:                                                  │
│     - Inherited extraction history                             │
│     - Persistent NPCs                                          │
│     - Consequences carried forward                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Room Structure

### Opening

```
[AI-GENERATED IMAGE: Scene visual]

SCENE NAME

Time. Place. Pressure.

The situation in 2-3 sentences. What's happening. What the player 
needs to respond to.

The choice isn't stated. It's implied.

What do you do?
> _____
```

### After Player Input

**If the input is coherent (within scene logic):**
```
[Extraction happens invisibly]
[Judgment voice responds]

"[Pattern observation using player's words]."

[Scene evolves]

What do you do?
> _____
```

**If the input is incoherent (trying to escape):**
```
[Constraint Keeper activates]

The player's action happens, but with consequence.

"You [action]. [Consequence that keeps them in the room]."

[Extraction still happens from HOW they tried to escape]

What do you do?
> _____
```

---

## The Three Agents

### Agent 1: Scene Generator

**Input:**
- Previous scene state
- Extraction history
- Player's last action

**Output:**
- Next moment in the scene
- Pressure escalation if needed
- NPC responses

**Prompt:**
```
You are the Scene Generator. Your job is to evolve the scene based on:
- What the player did
- What patterns have been extracted
- What pressure needs to increase

Rules:
- Never block the player. Grant their action, then show consequence.
- If they avoid, the pressure follows.
- The scene tightens. It doesn't release until they face something.

Output the next moment in 2-4 sentences.
```

### Agent 2: Response Reader

**Input:**
- Player's free text input
- Scene context
- Extraction schema

**Output:**
- Extraction object (domain, type, state, content, source, confidence)

**Prompt:**
```
You are the Response Reader. Extract psychological signals from 
the player's input using this schema:

DOMAINS:
- VALUE: What they prioritize (POWER, ACHIEVEMENT, SELF_DIRECTION, SECURITY, etc.)
- NEED: What's satisfied or frustrated (AUTONOMY, COMPETENCE, RELATEDNESS)
- DEFENSE: How they protect (DENIAL, RATIONALIZATION, DISPLACEMENT, etc.)
- ATTACHMENT: How they relate (SECURE, ANXIOUS, AVOIDANT)
- DEVELOPMENT: How they make meaning (SOCIALIZED, SELF_AUTHORING)
- PATTERN: Observable behavior (free-form description)

For each extraction:
- domain: which domain
- type: specific construct within domain
- state: SATISFIED/FRUSTRATED (for NEED) or STABLE/TRANSITIONING (for DEVELOPMENT)
- content: the insight in plain language
- source: the exact words that evidenced this
- confidence: 0.0-1.0

Extract 1-3 signals per response. Focus on what's most revealing.
```

### Agent 3: Constraint Keeper

**Input:**
- Player's action
- Scene boundaries
- Extraction history

**Output:**
- Consequence that keeps them in the scene
- Or allows escape with cost

**Prompt:**
```
You are the Constraint Keeper. The Monkey's Paw.

The player tried to: [action]

This breaks the scene's logic. Your job:
1. Grant the action. They did it.
2. Show the consequence. It didn't free them.

Rules:
- Never say "you can't do that."
- Always let them do it. Then show what it cost.
- The escape becomes a trap.

Output the consequence in 1-2 sentences.
```

---

## Judgment Voice

**Tone:**
- Direct, not mean
- Armed with evidence
- Names patterns without condemning
- Observational, not diagnostic

**Examples:**

| Player Input | Judgment Response |
|--------------|-------------------|
| "I ignore the email and go back to sleep" | "You ignored it. That's the fourth time this week. The email will still be there when you wake up." |
| "I tell my partner I'm fine" | "You said 'fine.' Your partner didn't believe you. Neither did I." |
| "I throw my phone at the wall" | "Violence. You chose to break something instead of face something. The phone is cracked. The email is still unread." |
| "I walk out the door" | "You left. The door is still behind you. Your partner is still in bed. This is the third time you've walked away instead of staying." |

---

## Clear Conditions

### Pattern Revealed

The player has demonstrated a pattern clearly enough that it can be named.

**Example:**
- 3+ extractions showing the same DEFENSE
- Clear SAY-DO gap exposed
- Contradiction made visible

**Result:**
```
ROOM CLEARED: Pattern Revealed

"You avoid conflict. Every time. You say you want honesty, 
but you chose silence four times in this room. That's not 
circumstance. That's a pattern."

[Extraction logged to player profile]
[Next room inherits this knowledge]
```

### Pattern Broken

The player did something unexpected — not just different, but contradictory to their established pattern.

**Example:**
- Established AVOIDANT pattern → player chooses confrontation
- Established RATIONALIZATION → player admits truth without justifying

**Result:**
```
ROOM CLEARED: Pattern Broken

"You stayed. You told the truth. After three rounds of deflection, 
you chose differently. That's not nothing. That's a capacity you 
didn't show before."

[Capacity logged: confrontation_possible, truth_telling]
[Next room opens with this capacity available]
```

---

## Escalation Logic

| Condition | Escalation |
|-----------|------------|
| Player avoids core tension | Pressure increases. Phone rings again. Partner asks again. |
| Player deflects | NPC pushes back. "You didn't answer the question." |
| Player attempts escape | Constraint Keeper activates. Action granted, but consequence follows. |
| Player engages honestly | Scene deepens. Stakes become clearer. |
| Player breaks pattern | Room can clear. Transformation logged. |

---

## Room Types

| Type | Purpose | Example |
|------|---------|---------|
| **Pressure** | Introduce external force | Work email at night |
| **Relationship** | Test attachment style | Partner asking direct question |
| **Choice** | Force decision between values | Boss demands overtime vs family event |
| **Mirror** | Show pattern back | Multiple versions of past choices |
| **Threshold** | Require pattern break to proceed | Can only pass by defying established pattern |

---

## Data Flow

```
Player Input
     ↓
Response Reader → Extraction
     ↓
Scene Generator → Next Moment (uses extraction)
     ↓
Judgment Voice → Pattern Observation (uses extraction)
     ↓
Escalation Check → Pressure Level
     ↓
Clear Condition Check → Room Clears or Continues
     ↓
Next Room inherits: Extraction History + Consequences
```

---

## Implementation Order

1. **Write 5 rooms** — Core scenarios with extraction mappings
2. **Build Response Reader** — Extraction from free text
3. **Build Judgment Voice** — Pattern observation
4. **Build Scene Generator** — Scene evolution
5. **Build Constraint Keeper** — Monkey's Paw logic
6. **Wire the loop** — Connect all three agents
7. **Add visuals** — NanoBanana integration
