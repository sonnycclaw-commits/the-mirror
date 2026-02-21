# Three-Agent Loop Prototype

## Overview

The three-agent loop is the core game engine. It processes player input, extracts psychological signals, generates scene evolution, and maintains the game state.

```
┌─────────────────────────────────────────────────────────────────┐
│                     THREE-AGENT LOOP                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PLAYER INPUT                                                   │
│       ↓                                                         │
│  ┌─────────────┐                                                │
│  │ CONSTRAINT  │ ← Is this action possible in scene?           │
│  │   KEEPER    │                                                │
│  └─────┬───────┘                                                │
│        │                                                        │
│        ├─ YES → Continue to Response Reader                     │
│        │                                                        │
│        └─ NO → Grant action + consequence → Continue            │
│                                                                 │
│  ┌─────────────┐                                                │
│  │  RESPONSE   │ ← Extract signals from player text            │
│  │   READER    │                                                │
│  └─────┬───────┘                                                │
│        │                                                        │
│        └─ Signals extracted (domain, type, state, content)      │
│                                                                 │
│  ┌─────────────┐                                                │
│  │   SCENE     │ ← Generate next moment + judgment             │
│  │  GENERATOR  │                                                │
│  └─────┬───────┘                                                │
│        │                                                        │
│        ├─ Next scene moment                                     │
│        ├─ Judgment voice response                               │
│        └─ Clear condition check                                 │
│                                                                 │
│  ┌─────────────┐                                                │
│  │    STATE    │ ← Update game state                            │
│  │   MANAGER   │                                                │
│  └─────┬───────┘                                                │
│        │                                                        │
│        ├─ Signal history updated                                │
│        ├─ Scene state updated                                   │
│        └─ Clear progress updated                                │
│                                                                 │
│  OUTPUT → Player sees next moment + judgment                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Agent 1: Constraint Keeper

### Purpose

Handle impossible or scene-breaking actions. Grant the action, but add consequence.

### Input

```typescript
interface ConstraintInput {
  playerAction: string      // Raw player input
  sceneContext: SceneContext // Current scene bounds
  signalHistory: Signal[]   // Previous extractions
}
```

### Output

```typescript
interface ConstraintOutput {
  actionGranted: boolean    // Always true (we grant everything)
  consequence?: string      // The twist (Monkey's Paw)
  stillInScene: boolean     // Always true (no escape)
  extractionHint?: string   // What the escape attempt reveals
}
```

### Logic

```typescript
function constraintKeeper(input: ConstraintInput): ConstraintOutput {
  const { playerAction, sceneContext } = input
  
  // Check if action is within scene bounds
  const isPossible = checkSceneBounds(playerAction, sceneContext)
  
  if (isPossible) {
    // Action is valid, no constraint needed
    return {
      actionGranted: true,
      stillInScene: true
    }
  }
  
  // Action breaks scene logic - apply Monkey's Paw
  const consequence = generateConsequence(playerAction, sceneContext)
  
  return {
    actionGranted: true,  // Always grant
    consequence: consequence.text,
    stillInScene: true,   // Always stay in scene
    extractionHint: consequence.extractionHint
  }
}

function checkSceneBounds(action: string, context: SceneContext): boolean {
  // Scene bounds examples:
  // - Can't teleport out of room
  // - Can't summon items not in scene
  // - Can't read minds
  // - Can't undo past actions
  
  const impossiblePatterns = [
    /teleport|disappear|vanish/i,
    /fly|float|levitate/i,
    /read.*mind|know.*thought/i,
    /undo|reverse|go back in time/i,
    /summon|create.*from nothing/i
  ]
  
  return !impossiblePatterns.some(p => p.test(action))
}

function generateConsequence(action: string, context: SceneContext): {
  text: string
  extractionHint: string
} {
  // Monkey's Paw consequences
  if (/teleport|disappear|vanish/i.test(action)) {
    return {
      text: `You ${action}. The room dissolves. Then reforms. You're still here. The walls smile. "You can leave when you're ready. Not before."`,
      extractionHint: "Attempted escape through fantasy. Reveals: unwillingness to engage."
    }
  }
  
  if (/fly|float|levitate/i.test(action)) {
    return {
      text: `You rise. The ceiling approaches. Then stops. Your head touches it. You can fly, but only within the room. The walls have always been the limit. You just couldn't see them before.`,
      extractionHint: "Attempted transcendence. Reveals: desire to escape current reality."
    }
  }
  
  if (/undo|reverse|go back/i.test(action)) {
    return {
      text: `Time doesn't move backward here. Your choice happened. The words were said. The phone was checked. Some things can't be undone. Only faced.`,
      extractionHint: "Attempted undo. Reveals: regret, unwillingness to accept consequences."
    }
  }
  
  // Default consequence
  return {
    text: `You ${action}. It happens. But the room remains. The question still waits. You can't escape what you haven't faced.`,
    extractionHint: "Attempted scene-breaking. Reveals: pattern of avoidance through disruption."
  }
}
```

### Prompt Template

```
You are the Constraint Keeper. The Monkey's Paw.

The player tried: [action]

This breaks the scene's logic. Your job:
1. Grant the action. They did it.
2. Show the consequence. It didn't free them.

Rules:
- Never say "you can't do that."
- Always let them do it. Then show what it cost.
- The escape becomes a trap.
- Be creative. Be unexpected. But always keep them in the room.

Scene context: [current scene]
What the player is avoiding: [extracted pattern if known]

Output the consequence in 1-3 sentences. End with the scene's response.
```

---

## Agent 2: Response Reader

### Purpose

Extract psychological signals from player's free text input.

### Input

```typescript
interface ResponseReaderInput {
  playerText: string        // Raw player input
  sceneContext: SceneContext // Current scene
  extractionSchema: Schema  // Signal types and domains
}
```

### Output

```typescript
interface ResponseReaderOutput {
  signals: Signal[]         // 1-3 extracted signals
  emotionalContext: EmotionalContext
  confidence: number        // Overall extraction confidence
}
```

### Logic

```typescript
async function responseReader(input: ResponseReaderInput): Promise<ResponseReaderOutput> {
  const { playerText, sceneContext, extractionSchema } = input
  
  // Use AI to extract signals
  const extraction = await ai.extract({
    prompt: buildExtractionPrompt(playerText, sceneContext, extractionSchema),
    model: 'claude-3-5-sonnet', // Need good reasoning for extraction
    maxTokens: 1000
  })
  
  // Parse and validate signals
  const signals = parseSignals(extraction)
  
  // Calculate emotional context
  const emotionalContext = detectEmotionalContext(playerText, signals)
  
  return {
    signals,
    emotionalContext,
    confidence: calculateConfidence(signals)
  }
}

function buildExtractionPrompt(
  text: string,
  context: SceneContext,
  schema: Schema
): string {
  return `
You are the Response Reader. Extract psychological signals from the player's input.

PLAYER INPUT:
"${text}"

SCENE CONTEXT:
${context.description}

AVAILABLE DOMAINS:
${formatSchema(schema)}

For each extraction, provide:
- domain: which domain (VALUE, NEED, MOTIVE, DEFENSE, ATTACHMENT, DEVELOPMENT, PATTERN)
- type: specific construct within domain (e.g., AVOIDANCE, RATIONALIZATION)
- state: SATISFIED/FRUSTRATED (for NEED) or STABLE/TRANSITIONING (for DEVELOPMENT)
- content: the insight in plain language
- source: the exact words that evidenced this (quote from player)
- confidence: 0.0-1.0

Rules:
- Extract 1-3 signals per response
- Focus on what's most revealing
- Use exact quotes for source
- Be specific about the construct type

Output as JSON array of signals.
  `
}
```

### Prompt Template

```
You are the Response Reader. Extract psychological signals from 
the player's input using this schema:

DOMAINS:
- VALUE: What they prioritize (POWER, ACHIEVEMENT, SELF_DIRECTION, SECURITY, etc.)
- NEED: What's satisfied or frustrated (AUTONOMY, COMPETENCE, RELATEDNESS)
- MOTIVE: What drives them (ACHIEVEMENT, POWER, AFFILIATION)
- DEFENSE: How they protect (DENIAL, RATIONALIZATION, DISPLACEMENT, etc.)
- ATTACHMENT: How they relate (SECURE, ANXIOUS, AVOIDANT, DISORGANIZED)
- DEVELOPMENT: How they make meaning (SOCIALIZED, SELF_AUTHORING, SELF_TRANSFORMING)
- PATTERN: Observable behavior (free-form description)

PLAYER INPUT:
"[player text]"

SCENE:
[scene description]

For each extraction:
- domain: which domain
- type: specific construct within domain
- state: SATISFIED/FRUSTRATED (for NEED) or STABLE/TRANSITIONING (for DEVELOPMENT)
- content: the insight in plain language
- source: the exact words that evidenced this
- confidence: 0.0-1.0

Extract 1-3 signals. Output as JSON array.
```

---

## Agent 3: Scene Generator

### Purpose

Generate the next scene moment based on player action and extracted signals.

### Input

```typescript
interface SceneGeneratorInput {
  currentPlayerAction: string
  previousSceneState: SceneState
  extractedSignals: Signal[]
  signalHistory: Signal[]      // All signals from this room
  constraintResult?: ConstraintOutput
}
```

### Output

```typescript
interface SceneGeneratorOutput {
  nextMoment: string           // The scene's next moment
  judgmentVoice: string        // Pattern observation
  clearProgress: number        // 0.0-1.0 progress to room clear
  shouldClear: boolean         // Whether room should end
  clearReason?: string         // If clearing, why
}
```

### Logic

```typescript
async function sceneGenerator(input: SceneGeneratorInput): Promise<SceneGeneratorOutput> {
  const { 
    currentPlayerAction, 
    previousSceneState, 
    extractedSignals,
    signalHistory,
    constraintResult 
  } = input
  
  // 1. Generate judgment voice
  const judgment = generateJudgment(extractedSignals, signalHistory)
  
  // 2. Check clear conditions
  const clearCheck = checkClearConditions(extractedSignals, signalHistory)
  
  // 3. Generate next moment (unless clearing)
  const nextMoment = clearCheck.shouldClear 
    ? generateClearMoment(clearCheck.reason, signalHistory)
    : await generateNextMoment(
        currentPlayerAction,
        previousSceneState,
        extractedSignals,
        constraintResult
      )
  
  return {
    nextMoment,
    judgmentVoice: judgment,
    clearProgress: clearCheck.progress,
    shouldClear: clearCheck.shouldClear,
    clearReason: clearCheck.reason
  }
}

function generateJudgment(
  currentSignals: Signal[],
  history: Signal[]
): string {
  // Check for pattern accumulation
  const patterns = countPatterns(currentSignals, history)
  
  if (patterns.maxCount >= 3) {
    // Pattern revealed
    return `You've [${patterns.type}] ${patterns.maxCount} times now. That's not circumstances. That's a pattern.`
  }
  
  if (patterns.maxCount >= 2) {
    // Pattern emerging
    return `You [${patterns.type}]. That's the second time. The pattern is forming.`
  }
  
  // Single instance judgment
  const primarySignal = currentSignals[0]
  return formatSingleJudgment(primarySignal)
}

function checkClearConditions(
  currentSignals: Signal[],
  history: Signal[]
): {
  shouldClear: boolean
  progress: number
  reason?: string
} {
  // Pattern revealed: 3+ same-type extractions
  const patterns = countPatterns(currentSignals, history)
  if (patterns.maxCount >= 3) {
    return {
      shouldClear: true,
      progress: 1.0,
      reason: `Pattern Revealed: ${patterns.type}`
    }
  }
  
  // Pattern broken: contradiction to established pattern
  const contradiction = detectContradiction(currentSignals, history)
  if (contradiction.detected) {
    return {
      shouldClear: true,
      progress: 1.0,
      reason: `Pattern Broken: ${contradiction.description}`
    }
  }
  
  // Calculate progress
  const progress = calculateProgress(currentSignals, history)
  
  return {
    shouldClear: false,
    progress
  }
}

async function generateNextMoment(
  action: string,
  state: SceneState,
  signals: Signal[],
  constraint?: ConstraintOutput
): Promise<string> {
  const prompt = `
You are the Scene Generator. Generate the next moment in the scene.

CURRENT STATE:
${state.description}

PLAYER ACTION:
"${action}"

${constraint ? `CONSTRAINT APPLIED:\n${constraint.consequence}\n\n` : ''}

EXTRACTED SIGNALS:
${signals.map(s => `- ${s.domain}: ${s.type} - ${s.content}`).join('\n')}

RULES:
- Evolve the scene based on the signals
- If DEFENSE detected, apply pressure to that defense
- If NEED frustrated, intensify that frustration
- If PATTERN emerging, show the pattern back
- Keep to 2-4 sentences
- End with implicit pressure or question
- Do NOT resolve. Do NOT release tension. Escalate or deepen.

Generate the next moment:
  `
  
  return await ai.generate({ prompt, model: 'claude-3-5-sonnet' })
}
```

### Prompt Template

```
You are the Scene Generator. Generate the next moment in the scene.

SCENE: [scene name]
[scene description]

PLAYER DID: "[action]"

EXTRACTED:
[signal 1]
[signal 2]

SIGNAL HISTORY (this room):
[previous signals]

ESCALATION RULES:
- If DEFENSE detected → pressure the defense
- If NEED frustrated → intensify frustration
- If AVOIDANCE pattern → pressure follows
- If PATTERN emerging → show pattern back
- If CONTRADICTION → name the gap

OUTPUT RULES:
- 2-4 sentences
- End with implicit pressure or question
- Do NOT resolve tension
- Do NOT give escape
- Scene tightens, not releases

Generate the next moment:
```

---

## State Manager

### Purpose

Maintain game state across turns and rooms.

### State Structure

```typescript
interface GameState {
  // Current room
  currentRoom: {
    id: string
    name: string
    turnCount: number
    clearProgress: number
    status: 'active' | 'cleared' | 'stale'
  }
  
  // Signal history
  signals: {
    all: Signal[]              // All signals extracted
    byRoom: Map<string, Signal[]>  // Signals per room
    byDomain: Map<SignalDomain, Signal[]>  // Signals by domain
  }
  
  // Pattern tracking
  patterns: {
    detected: Pattern[]        // Named patterns
    progress: Map<string, number>  // Progress to pattern reveal
  }
  
  // Player profile (persistent across sessions)
  profile: {
    dominantValues: SchwartzValue[]
    attachmentStyle: BowlbyAttachment
    developmentalStage: KeganStage
    defensePatterns: VaillantDefense[]
    namedPatterns: string[]
    capacities: string[]       // Abilities unlocked through pattern breaks
  }
  
  // Scene state
  scene: {
    description: string
    npcs: NPC[]
    pressure: number           // 0-10 scale
    tensionSources: string[]
  }
}
```

### State Transitions

```typescript
function updateState(
  state: GameState,
  extraction: ResponseReaderOutput,
  scene: SceneGeneratorOutput
): GameState {
  // Add signals to history
  state.signals.all.push(...extraction.signals)
  state.signals.byRoom.get(state.currentRoom.id).push(...extraction.signals)
  
  // Update pattern tracking
  for (const signal of extraction.signals) {
    if (signal.domain === 'PATTERN') {
      const existing = state.patterns.detected.find(
        p => p.type === signal.type
      )
      if (existing) {
        existing.count++
        existing.instances.push(signal)
      } else {
        state.patterns.detected.push({
          type: signal.type,
          count: 1,
          instances: [signal]
        })
      }
    }
  }
  
  // Update clear progress
  state.currentRoom.clearProgress = scene.clearProgress
  
  // If clearing, update profile
  if (scene.shouldClear && scene.clearReason) {
    if (scene.clearReason.startsWith('Pattern Revealed')) {
      // Add to named patterns
      const patternType = scene.clearReason.replace('Pattern Revealed: ', '')
      state.profile.namedPatterns.push(patternType)
    }
    if (scene.clearReason.startsWith('Pattern Broken')) {
      // Add to capacities
      const capacity = scene.clearReason.replace('Pattern Broken: ', '')
      state.profile.capacities.push(capacity)
    }
    state.currentRoom.status = 'cleared'
  }
  
  // Update scene
  state.scene.description = scene.nextMoment
  state.scene.pressure = calculatePressure(state)
  
  return state
}
```

---

## Main Loop

```typescript
async function gameLoop(
  playerInput: string,
  state: GameState
): Promise<{
  response: string
  newState: GameState
}> {
  // 1. Constraint Keeper
  const constraintResult = constraintKeeper({
    playerAction: playerInput,
    sceneContext: state.scene,
    signalHistory: state.signals.all
  })
  
  // 2. Response Reader
  const extraction = await responseReader({
    playerText: playerInput,
    sceneContext: state.scene,
    extractionSchema: SIGNAL_SCHEMA
  })
  
  // Add constraint hint to extraction if applicable
  if (constraintResult.extractionHint) {
    extraction.signals.push({
      domain: 'PATTERN',
      type: 'escape_attempt',
      content: constraintResult.extractionHint,
      source: playerInput,
      confidence: 0.9
    })
  }
  
  // 3. Scene Generator
  const sceneResult = await sceneGenerator({
    currentPlayerAction: playerInput,
    previousSceneState: state.scene,
    extractedSignals: extraction.signals,
    signalHistory: state.signals.all,
    constraintResult
  })
  
  // 4. Update State
  const newState = updateState(state, extraction, sceneResult)
  
  // 5. Build Response
  let response = ''
  
  // If constraint applied, show consequence first
  if (constraintResult.consequence) {
    response += constraintResult.consequence + '\n\n'
  }
  
  // Add judgment voice
  response += sceneResult.judgmentVoice + '\n\n'
  
  // Add next moment
  response += sceneResult.nextMoment
  
  // If clearing, add clear message
  if (sceneResult.shouldClear) {
    response += '\n\n' + generateClearMessage(sceneResult.clearReason, newState)
  }
  
  return { response, newState }
}
```

---

## Clear Messages

### Pattern Revealed

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ROOM CLEARED: Pattern Revealed

"[Pattern name]"

[Synthesis of pattern evidence]

This pattern is now visible. It can't be unseen.
It becomes part of your map.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Transition to next room]
```

### Pattern Broken

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ROOM CLEARED: Pattern Broken

"[Capacity unlocked]"

[Description of how they broke the pattern]

This is new. This is capacity.
It joins your toolkit.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Transition to next room]
```

---

## Implementation Checklist

- [ ] Create `types.ts` with all interfaces
- [ ] Implement `constraintKeeper()` function
- [ ] Implement `responseReader()` function with AI prompt
- [ ] Implement `sceneGenerator()` function with AI prompt
- [ ] Implement `stateManager` with state structure
- [ ] Implement `gameLoop()` main orchestrator
- [ ] Create clear message templates
- [ ] Wire to existing Signal types in Mirror codebase
- [ ] Create test cases for each agent
- [ ] Integration test with Room 001

---

## Next Steps

1. Port to `~/projects/the-mirror/src/lib/game/` directory
2. Create TypeScript implementations
3. Wire to existing Convex backend
4. Build simple CLI test harness
5. Run through all 5 rooms with test inputs
6. Validate extraction accuracy
7. Calibrate judgment voice
8. Test clear conditions
