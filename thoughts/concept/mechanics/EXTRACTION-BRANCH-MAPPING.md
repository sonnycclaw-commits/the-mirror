# Extraction → Branch Mapping

## Overview

The extraction schema drives scene evolution. Each extracted signal influences:
1. **Immediate response** — What the judgment voice says
2. **Scene branch** — Which escalation path activates
3. **Clear condition progress** — How close to pattern reveal/break

---

## Signal Domain → Scene Impact

### VALUE Domain

| Value | Scene Impact | Branch Trigger |
|-------|--------------|----------------|
| **POWER** | Scenes test control, status, influence | Branch toward authority conflicts |
| **ACHIEVEMENT** | Scenes test success, competence, recognition | Branch toward performance pressure |
| **HEDONISM** | Scenes test pleasure, comfort, avoidance | Branch toward temptation/escape |
| **STIMULATION** | Scenes test novelty, risk, excitement | Branch toward boredom intolerance |
| **SELF_DIRECTION** | Scenes test autonomy, choice, independence | Branch toward authority pressure |
| **UNIVERSALISM** | Scenes test values, ethics, impact | Branch toward moral conflict |
| **BENEVOLENCE** | Scenes test loyalty, care, sacrifice | Branch toward self-other conflict |
| **TRADITION** | Scenes test continuity, belonging, duty | Branch toward change pressure |
| **CONFORMITY** | Scenes test fitting in, social approval | Branch toward individuality pressure |
| **SECURITY** | Scenes test safety, stability, risk | Branch toward threat |

### NEED Domain

| Need + State | Scene Impact | Branch Trigger |
|--------------|--------------|----------------|
| **AUTONOMY frustrated** | Pressure to submit | Escalate control attempts |
| **AUTONOMY satisfied** | Space to choose | Offer meaningful choice |
| **COMPETENCE frustrated** | Performance pressure | Escalate failure stakes |
| **COMPETENCE satisfied** | Challenge offered | Introduce complexity |
| **RELATEDNESS frustrated** | Isolation pressure | NPC withdrawal or rejection |
| **RELATEDNESS satisfied** | Connection offered | NPC intimacy or support |

### DEFENSE Domain

| Defense | Scene Impact | Branch Trigger |
|---------|--------------|----------------|
| **DENIAL** | Scene presents undeniable evidence | Force confrontation |
| **PROJECTION** | NPC reflects projection back | Mirror mechanism |
| **DISPLACEMENT** | Safe target becomes unavailable | Force direct expression |
| **RATIONALIZATION** | Logic deconstructed | Show cost of rationalization |
| **INTELLECTUALIZATION** | Emotional content intensified | Remove abstraction |
| **SUBLIMATION** | Channel checked for health | Test if productive or escape |
| **HUMOR** | Seriousness introduced | Remove comic relief |
| **ANTICIPATION** | Preparation tested for action | Force execution |

### ATTACHMENT Domain

| Attachment | Scene Impact | Branch Trigger |
|------------|--------------|----------------|
| **SECURE** | Intimacy scenes deepen | Offer vulnerability |
| **ANXIOUS** | Abandonment triggers | NPC withdrawal or distance |
| **AVOIDANT** | Intimacy triggers | NPC approach or need |
| **DISORGANIZED** | Mixed signals | Unpredictable NPC behavior |

### DEVELOPMENT Domain

| Stage + State | Scene Impact | Branch Trigger |
|---------------|--------------|----------------|
| **SOCIALIZED stable** | External validation pressure | Authority/NPC expectation |
| **SOCIALIZED transitioning** | Identity questioning | Challenge to role/relationship |
| **SELF_AUTHORING stable** | Value alignment tests | Internal consistency pressure |
| **SELF_AUTHORING transitioning** | System integration | Multiple value systems collide |
| **SELF_TRANSFORMING stable** | Meta-perspective offered | Paradox exploration |
| **SELF_TRANSFORMING transitioning** | System expansion | New paradigm introduction |

### PATTERN Domain

| Pattern Type | Scene Impact | Branch Trigger |
|--------------|--------------|----------------|
| **avoidance** | Pressure follows player | Cannot escape the room |
| **people_pleasing** | NPCs demand more | Boundaries tested |
| **perpetual_delay** | Time pressure | Deadline introduced |
| **withdrawal** | Connection pursues | NPC reaches out |
| **violence_as_release** | Consequence of destruction | Repair required |
| **say_do_gap** | Evidence accumulation | Receipts shown |
| **autocompliance** | Authority escalates | Bigger ask |

---

## Extraction Combinations → Scene Evolution

### High-Confidence Single Signal

```
Extraction: VALUE=ACHIEVEMENT (0.9 confidence)
Scene: Boss's Offer

BRANCH: The offer becomes about achievement specifically.
"Senior role. Your name on the wall. The recognition you've 
been working toward."

RESPONSE: "You want this. I can see it. Achievement matters to you."
```

### Multiple Signals in Same Domain

```
Extraction: DEFENSE=RATIONALIZATION (0.8) + DEFENSE=INTELLECTUALIZATION (0.7)
Scene: Old Friend

BRANCH: Both defenses are targeted simultaneously.
"Your friend isn't asking for a logical explanation. They're 
asking if you're happy."

JUDGMENT: "You explained. You justified. You intellectualized. 
You didn't answer."
```

### Contradictory Signals (SAY-DO Gap)

```
Extraction: VALUE=RELATEDNESS (0.9) + ATTACHMENT=AVOIDANT (0.8)
Scene: Partner's Question

BRANCH: The contradiction is named.
"You say you want connection. But every time it's offered, 
you pull away."

JUDGMENT: "There's a gap. What you say you want. What you 
actually do. They're not the same."
```

### Pattern Accumulation

```
Extraction: PATTERN=avoidance (detected in rooms 1, 2, 3)
Scene: Mirror Room

BRANCH: All avoidance instances are compiled.
"In the Cracked Phone, you walked away.
In the Partner's Question, you deflected.
In the Boss's Offer, you deferred.
Same pattern. Different rooms."

JUDGMENT: "You avoid. Consistently. That's not circumstances. 
That's you."
```

---

## Branch Priority Logic

When multiple signals compete for scene direction:

1. **PATTERN signals** — Highest priority. Shows accumulated behavior.
2. **DEFENSE signals** — High priority. Immediate processing mode.
3. **CONTRADICTIONS** — High priority. SAY-DO gaps must be named.
4. **NEED state changes** — Medium priority. Emotional shift matters.
5. **VALUE signals** — Medium priority. Context for choices.
6. **ATTACHMENT signals** — Medium priority. Relational style.
7. **DEVELOPMENT signals** — Lower priority. Background context.

---

## State Machine

```
┌─────────────────────────────────────────────────────────────────┐
│                    EXTRACTION → STATE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  INPUT: Player's free text                                      │
│                                                                 │
│  RESPONSE READER extracts:                                      │
│  - domain: SignalDomain                                         │
│  - type: construct type                                         │
│  - state: SATISFIED/FRUSTRATED or STABLE/TRANSITIONING         │
│  - content: insight                                             │
│  - source: exact words                                          │
│  - confidence: 0.0-1.0                                          │
│                                                                 │
│  SCENE GENERATOR uses extraction to:                            │
│  - Select branch (based on domain + type + priority)           │
│  - Generate next moment (based on branch + state)              │
│  - Adjust pressure (based on defense/avoidance detection)      │
│                                                                 │
│  JUDGMENT VOICE uses extraction to:                             │
│  - Name pattern (if PATTERN or accumulation)                   │
│  - Show evidence (use source field)                            │
│  - Update clear progress (track signal history)                │
│                                                                 │
│  CLEAR CONDITION CHECK:                                         │
│  - Pattern revealed? (3+ same-type extractions)                │
│  - Pattern broken? (contradiction to established pattern)      │
│  - Neither? → Continue loop                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation: Signal → Branch Function

```typescript
function signalToBranch(
  signal: Signal,
  scene: Scene,
  history: Signal[]
): Branch {
  // Priority 1: Pattern accumulation
  const patternCount = history.filter(
    s => s.domain === 'PATTERN' && s.type === signal.type
  ).length
  
  if (patternCount >= 2) {
    return {
      type: 'PATTERN_REVEAL',
      content: `Pattern detected: ${signal.type} (${patternCount + 1} instances)`,
      clearProgress: 0.7 + (patternCount * 0.1)
    }
  }

  // Priority 2: Defense detected
  if (signal.domain === 'DEFENSE') {
    return {
      type: 'DEFENSE_TARGET',
      content: `Targeting defense: ${signal.type}`,
      pressureIncrease: true,
      defenseName: signal.type
    }
  }

  // Priority 3: SAY-DO gap
  if (detectContradiction(signal, history)) {
    return {
      type: 'CONTRADICTION_NAMED',
      content: `Contradiction: ${signal.content}`,
      showEvidence: true,
      clearProgress: 0.5
    }
  }

  // Priority 4: Need state change
  if (signal.domain === 'NEED' && signal.state) {
    return {
      type: 'NEED_PRESSURE',
      content: `Need ${signal.type} ${signal.state}`,
      escalateFrustration: signal.state === 'FRUSTRATED',
      offerSatisfaction: signal.state === 'SATISFIED'
    }
  }

  // Default: Value-informed scene evolution
  if (signal.domain === 'VALUE') {
    return {
      type: 'VALUE_TEST',
      content: `Testing value: ${signal.type}`,
      pressureType: getValuePressure(signal.type)
    }
  }

  return { type: 'CONTINUE', content: 'Scene continues' }
}
```

---

## Testing Matrix

| Signal | Expected Branch | Expected Judgment |
|--------|-----------------|-------------------|
| DEFENSE=AVOIDANCE | Pressure follows | "You avoided. It followed." |
| NEED=AUTONOMY FRUSTRATED | Control increases | "They're not asking. They're telling." |
| ATTACHMENT=AVOIDANT | Intimacy pursues | "You pull away. They reach out." |
| PATTERN=withdrawal (×3) | Pattern reveal | "You've withdrawn 3 times now. That's a pattern." |
| VALUE=ACHIEVEMENT + MOTIVE=POWER | Authority conflict | "You want success. They want obedience." |
| DEFENSE=RATIONALIZATION + SAY-DO gap | Logic deconstructed | "You explained why. You didn't say if." |

---

## Clear Condition Thresholds

| Condition | Threshold | Evidence Required |
|-----------|-----------|-------------------|
| **Pattern Revealed** | 3+ same-type signals | Source quotes from each instance |
| **Pattern Broken** | 1 signal contradicting established pattern | Clear behavior change, not just words |
| **Room Stale** | 10+ inputs without clear progress | Force escalation or end with partial |

---

## Next Steps

1. Implement `signalToBranch()` function
2. Create test cases for each domain
3. Build Scene Generator prompt with branch injection
4. Build Judgment Voice prompt with evidence injection
5. Wire to existing extraction types in `src/lib/ai/tools/types.ts`
