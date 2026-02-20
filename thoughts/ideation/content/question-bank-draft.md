# Question Bank: Psychometric Extraction Targets

**Status:** DRAFT - Exploring
**Version:** 0.1
**Date:** 2026-01-13
**Depends on:** dan-koe-protocol-draft.md, ai-implementation-patterns.md

---

## Purpose

This document maps questions to what they actually EXTRACT for the psychometric profile. Each question should have:

1. **Target signals** - What we're trying to detect
2. **Extraction schema** - Structured output format
3. **Confidence indicators** - How to assess signal strength
4. **Follow-up triggers** - When to probe deeper

---

## Profile Schema Reminder

From ai-implementation-patterns.md, we're building:

```typescript
interface PsychometricProfile {
  // SDT Needs (Beta distributions)
  sdtNeeds: {
    autonomy: BayesianBelief;
    competence: BayesianBelief;
    relatedness: BayesianBelief;
  };

  // Primary Driver (Dirichlet)
  primaryDriver: CategoricalBelief; // which SDT need dominates

  // Patterns (confirmed behavioral patterns)
  confirmedPatterns: Pattern[];

  // Anti-Vision / Vision (user-created)
  antiVision: string;
  vision: string;

  // Game Model
  gameModel: {
    yearGoal: string;
    monthProject: string;
    dailyLevers: string[];
    constraints: string[];
  };
}
```

---

# SECTION 1: Dan Koe Questions → Signal Mapping

## Q1: Dull Persistent Dissatisfaction

### The Question
```
"What is the dull, persistent dissatisfaction you've learned to
live with? Not the dramatic suffering - the quiet compromises."
```

### Target Signals

| Signal | Type | Schema |
|--------|------|--------|
| SDT Need Deficits | BayesianBelief update | Which needs are unmet |
| Life Domains Affected | Categorical | work, relationships, health, self, finances |
| Tolerance Pattern | Pattern candidate | What they've normalized |
| Emotional Baseline | Numeric | Dissatisfaction level (1-10) |

### Extraction Schema

```typescript
interface Q1Extraction {
  sdtSignals: Array<{
    need: 'autonomy' | 'competence' | 'relatedness';
    direction: 'deficit' | 'satisfied';  // almost always deficit for Q1
    evidence: string;  // quote from response
    confidence: 'high' | 'medium' | 'low';
  }>;

  domainsAffected: Array<{
    domain: 'work' | 'relationships' | 'health' | 'self' | 'finances' | 'purpose';
    severity: 'high' | 'medium' | 'low';
    evidence: string;
  }>;

  tolerancePatterns: Array<{
    description: string;  // what they've normalized
    duration: string;     // how long (if mentioned)
    evidence: string;
  }>;

  emotionalBaseline: {
    dissatisfactionLevel: number;  // 1-10 inferred
    urgency: 'high' | 'medium' | 'low';
    emotionalWords: string[];  // extracted emotional language
  };
}
```

### Example Extraction

**User response:**
> "I guess just... feeling like I'm going through the motions. Work is fine but not exciting. My relationship is stable but we're more like roommates. I exercise but I don't really feel healthy."

**Extracted:**
```json
{
  "sdtSignals": [
    {
      "need": "competence",
      "direction": "deficit",
      "evidence": "Work is fine but not exciting",
      "confidence": "medium"
    },
    {
      "need": "relatedness",
      "direction": "deficit",
      "evidence": "we're more like roommates",
      "confidence": "high"
    }
  ],
  "domainsAffected": [
    { "domain": "work", "severity": "medium", "evidence": "fine but not exciting" },
    { "domain": "relationships", "severity": "high", "evidence": "more like roommates" },
    { "domain": "health", "severity": "low", "evidence": "don't really feel healthy" }
  ],
  "tolerancePatterns": [
    {
      "description": "Settling for 'fine' across multiple life domains",
      "duration": "unspecified",
      "evidence": "fine but not..., stable but..."
    }
  ],
  "emotionalBaseline": {
    "dissatisfactionLevel": 5,
    "urgency": "low",
    "emotionalWords": ["going through the motions"]
  }
}
```

### Confidence Indicators

| Indicator | High Confidence | Low Confidence |
|-----------|-----------------|----------------|
| Specificity | Concrete examples | Vague generalities |
| Emotional language | Present, vivid | Absent, clinical |
| Multiple domains | 2+ areas mentioned | Single mention |
| Self-awareness | Recognizes pattern | Defensive/dismissive |

### Follow-up Triggers

- If only one domain mentioned → "What about [other domain]?"
- If vague → "Can you give me a specific example?"
- If no emotional words → "How does that feel day to day?"
- If high urgency detected → Consider accelerating to harder questions

---

## Q2: Repeated Complaints Never Changed

### The Question
```
"What do you complain about repeatedly but never actually change?
Give me three things."
```

### Target Signals

| Signal | Type | Schema |
|--------|------|--------|
| Stated vs Actual Gap | Pattern | What they say vs do |
| Complaint Domains | Categorical | Where friction lives |
| Inaction Patterns | Pattern candidate | How they stay stuck |
| Social Performance | Pattern | Socially acceptable excuses |

### Extraction Schema

```typescript
interface Q2Extraction {
  complaints: Array<{
    topic: string;
    domain: 'work' | 'relationships' | 'health' | 'self' | 'finances' | 'purpose';
    frequency: 'daily' | 'weekly' | 'occasionally';
    actionsTaken: 'none' | 'started_stopped' | 'minimal';
    evidence: string;
  }>;

  inactionPatterns: Array<{
    type: 'avoidance' | 'start_stop' | 'excuse_making' | 'externalization' | 'perfectionism';
    description: string;
    evidence: string;
  }>;

  sociallyAcceptableExcuses: string[];  // "no time", "economy", etc.
}
```

### Example Extraction

**User response:**
> "1. My job - I keep saying I'll look for something better but never apply
> 2. My weight - always starting diets then stopping after a week
> 3. Not having enough time for myself - I say I need hobbies but never make time"

**Extracted:**
```json
{
  "complaints": [
    {
      "topic": "Job dissatisfaction",
      "domain": "work",
      "frequency": "occasionally",
      "actionsTaken": "none",
      "evidence": "never apply"
    },
    {
      "topic": "Weight/health",
      "domain": "health",
      "frequency": "weekly",
      "actionsTaken": "started_stopped",
      "evidence": "starting diets then stopping"
    },
    {
      "topic": "Personal time",
      "domain": "self",
      "frequency": "occasionally",
      "actionsTaken": "none",
      "evidence": "never make time"
    }
  ],
  "inactionPatterns": [
    {
      "type": "avoidance",
      "description": "Avoids job search despite stated desire",
      "evidence": "keep saying I'll look... never apply"
    },
    {
      "type": "start_stop",
      "description": "Initiates change but abandons quickly",
      "evidence": "starting diets then stopping after a week"
    }
  ],
  "sociallyAcceptableExcuses": ["not having enough time"]
}
```

---

## Q3: What Behavior Reveals

### The Question
```
"For each complaint - if someone watched your actual behavior,
not your words, what would they conclude you actually want?"
```

### Target Signals

| Signal | Type | Schema |
|--------|------|--------|
| Unconscious Goals | Core insight | What they're actually optimizing for |
| Self-Awareness Level | Assessment | Can they see the gap? |
| Core Fears | Pattern | What behavior protects |
| Defense Mechanisms | Pattern | How they justify |

### Extraction Schema

```typescript
interface Q3Extraction {
  unconsciousGoals: Array<{
    goal: string;  // what they're actually pursuing
    relatedComplaint: string;  // from Q2
    evidence: string;
    confidence: 'high' | 'medium' | 'low';
  }>;

  selfAwarenessLevel: {
    level: 'high' | 'medium' | 'low';
    indicators: string[];
    evidence: string;
  };

  coreFears: Array<{
    fear: string;
    protectedBy: string;  // what behavior protects it
    evidence: string;
  }>;

  defenseMechanisms: Array<{
    type: 'rationalization' | 'denial' | 'projection' | 'intellectualization';
    description: string;
    evidence: string;
  }>;
}
```

### Example Extraction

**User response:**
> "I guess they'd think I want... safety? Comfort? Like I complain about my job but I never apply anywhere. Maybe I'm scared of rejection. Or scared of actually getting something better and having to perform."

**Extracted:**
```json
{
  "unconsciousGoals": [
    {
      "goal": "Safety and predictability",
      "relatedComplaint": "Job dissatisfaction",
      "evidence": "I guess they'd think I want... safety? Comfort?",
      "confidence": "high"
    }
  ],
  "selfAwarenessLevel": {
    "level": "high",
    "indicators": ["Can articulate gap", "Names own fears", "Uses 'maybe' showing reflection"],
    "evidence": "Maybe I'm scared of rejection. Or scared of actually getting something better"
  },
  "coreFears": [
    {
      "fear": "Rejection",
      "protectedBy": "Not applying to jobs",
      "evidence": "scared of rejection"
    },
    {
      "fear": "Being exposed as inadequate",
      "protectedBy": "Staying in safe job",
      "evidence": "scared of... having to perform"
    }
  ],
  "defenseMechanisms": []
}
```

### High-Value Signal

Q3 often reveals the **core insight** of the entire excavation. When users can articulate their unconscious goals, they're already halfway to breakthrough.

**Breakthrough indicators:**
- User says "I guess I actually want [opposite of stated goal]"
- User names a fear without being asked
- User connects behavior to protection

---

## Q4: Unbearable Truth

### The Question
```
"What truth about your current life would be unbearable to admit
to someone you deeply respect?"
```

### Target Signals

| Signal | Type | Schema |
|--------|------|--------|
| Shame Core | Core insight | Deepest self-judgment |
| Identity Threat | Pattern | What would shatter self-image |
| Social Mask | Assessment | Gap between presented/actual |
| Vulnerability Level | Assessment | Willingness to be honest |

### Extraction Schema

```typescript
interface Q4Extraction {
  shameCore: {
    content: string;  // the unbearable truth
    domain: 'achievement' | 'character' | 'relationships' | 'authenticity' | 'potential';
    intensity: 'high' | 'medium' | 'low';
    evidence: string;
  };

  identityThreats: Array<{
    protectedIdentity: string;  // "I am someone who..."
    threat: string;  // what would shatter it
    evidence: string;
  }>;

  socialMask: {
    presentedSelf: string;
    actualSelf: string;
    gapSize: 'large' | 'medium' | 'small';
    evidence: string;
  };

  vulnerabilityLevel: {
    level: 'high' | 'medium' | 'low' | 'deflecting';
    indicators: string[];
  };
}
```

### Example Extraction

**User response:**
> "That I've wasted ten years. That I had potential and I let fear win. That the person I present to everyone - confident, together - is mostly performance."

**Extracted:**
```json
{
  "shameCore": {
    "content": "Wasted potential due to fear",
    "domain": "potential",
    "intensity": "high",
    "evidence": "I've wasted ten years... had potential and let fear win"
  },
  "identityThreats": [
    {
      "protectedIdentity": "Confident, together person",
      "threat": "Being seen as fearful, lost",
      "evidence": "the person I present... is mostly performance"
    }
  ],
  "socialMask": {
    "presentedSelf": "Confident, together",
    "actualSelf": "Fearful, performative",
    "gapSize": "large",
    "evidence": "is mostly performance"
  },
  "vulnerabilityLevel": {
    "level": "high",
    "indicators": ["Direct admission", "No hedging", "Uses strong language ('wasted', 'mostly performance')"]
  }
}
```

### Breakthrough Potential: HIGH

This question often produces the most powerful material for anti-vision crystallization.

---

## Q5: 5-Year Tuesday

### The Question
```
"If absolutely nothing changes for the next five years, describe
an average Tuesday. Where, who, what, how it feels."
```

### Target Signals

| Signal | Type | Schema |
|--------|------|--------|
| Anti-Vision Raw | Core content | Concrete feared future |
| Key Fear Elements | Categorical | Loneliness, stagnation, etc. |
| Emotional Weight | Assessment | How much this scares them |
| Specificity Level | Assessment | How real is this to them |

### Extraction Schema

```typescript
interface Q5Extraction {
  antiVisionElements: Array<{
    element: string;
    category: 'isolation' | 'stagnation' | 'meaninglessness' | 'regret' | 'health' | 'relationships' | 'work';
    emotionalWeight: 'heavy' | 'medium' | 'light';
    evidence: string;
  }>;

  concreteDetails: {
    location: string | null;
    people: string | null;
    activities: string | null;
    feelings: string | null;
    bodyState: string | null;
  };

  overallTone: {
    despair: number;  // 1-10
    resignation: number;  // 1-10
    fear: number;  // 1-10
    numbness: number;  // 1-10
  };

  specificity: 'vivid' | 'moderate' | 'vague';
}
```

### Example Extraction

**User response:**
> "Wake up at 6:30, alone probably. Same apartment. Drag myself to the same job. Meetings about nothing. Come home, scroll phone, fall asleep watching something. Feel nothing. Just... existing."

**Extracted:**
```json
{
  "antiVisionElements": [
    { "element": "Alone", "category": "isolation", "emotionalWeight": "heavy", "evidence": "alone probably" },
    { "element": "Same job", "category": "stagnation", "emotionalWeight": "medium", "evidence": "Drag myself to the same job" },
    { "element": "Meaningless work", "category": "meaninglessness", "emotionalWeight": "medium", "evidence": "Meetings about nothing" },
    { "element": "Numbing behaviors", "category": "meaninglessness", "emotionalWeight": "heavy", "evidence": "scroll phone, fall asleep watching something" },
    { "element": "Emotional deadness", "category": "meaninglessness", "emotionalWeight": "heavy", "evidence": "Feel nothing. Just... existing" }
  ],
  "concreteDetails": {
    "location": "Same apartment",
    "people": "Alone",
    "activities": "Job, scroll, TV",
    "feelings": "Nothing, existing",
    "bodyState": "Drag myself"
  },
  "overallTone": {
    "despair": 6,
    "resignation": 8,
    "fear": 5,
    "numbness": 9
  },
  "specificity": "vivid"
}
```

---

## Q6: 10-Year Extension

### The Question
```
"Now extend it to ten years. What opportunities closed? Who gave
up on you? What do people say about you when you're not in the room?"
```

### Target Signals

| Signal | Type | Schema |
|--------|------|--------|
| Social Fears | Core content | What others think |
| Loss Inventory | List | Specific regrets |
| Relationship Fears | Pattern | Who they'll disappoint |
| Legacy Concerns | Core content | How they'll be remembered |

### Extraction Schema

```typescript
interface Q6Extraction {
  closedOpportunities: Array<{
    opportunity: string;
    domain: string;
    irreversibility: 'permanent' | 'difficult' | 'possible';
    evidence: string;
  }>;

  relationshipLosses: Array<{
    person: string;  // or category like "friends"
    relationship: string;
    nature: 'gave_up' | 'drifted' | 'disappointed';
    evidence: string;
  }>;

  socialFears: Array<{
    fear: string;  // what people say/think
    audience: string;  // who
    evidence: string;
  }>;

  legacyStatement: {
    howRemembered: string;
    worstEpitaph: string;
    evidence: string;
  };
}
```

---

## Q7: End of Life - Safe Version

### The Question
```
"You're at the end of your life. You lived the safe version.
What was the cost? What did you never let yourself feel, try,
or become?"
```

### Target Signals

| Signal | Type | Schema |
|--------|------|--------|
| Unlived Life | Core content | The person they could have been |
| Core Desires | List | Often hidden behind "realistic" |
| Safety Cost | Assessment | What safety purchased |
| Mortality Salience | Assessment | Does death perspective create urgency |

### Extraction Schema

```typescript
interface Q7Extraction {
  unlivedLife: {
    description: string;
    keyElements: string[];
    evidence: string;
  };

  neverTried: string[];
  neverFelt: string[];
  neverBecame: string[];

  safetyCost: {
    whatWasSacrificed: string[];
    whatWasGained: string;  // usually "nothing meaningful"
    evidence: string;
  };

  sdtDesires: Array<{
    need: 'autonomy' | 'competence' | 'relatedness';
    desire: string;
    evidence: string;
  }>;

  urgencyResponse: {
    level: 'high' | 'medium' | 'low';
    indicators: string[];
  };
}
```

### Example Extraction

**User response:**
> "I never let myself really go for something. Never took the risk to build something of my own. Never felt truly known by someone because I never dropped the mask. I played it safe and got a safe life. Which is no life at all."

**Extracted:**
```json
{
  "unlivedLife": {
    "description": "Entrepreneur/creator who is deeply known by others",
    "keyElements": ["Building something", "Taking risks", "Being truly known"],
    "evidence": "build something of my own... truly known"
  },
  "neverTried": ["Building something of my own", "Taking real risks"],
  "neverFelt": ["Truly known by someone"],
  "neverBecame": ["Someone who goes for things", "Authentic/unmasked person"],
  "safetyCost": {
    "whatWasSacrificed": ["Creation", "Risk", "Intimacy", "Authenticity"],
    "whatWasGained": "A safe life (which is no life)",
    "evidence": "played it safe and got a safe life. Which is no life at all"
  },
  "sdtDesires": [
    { "need": "autonomy", "desire": "Build something of my own", "evidence": "build something of my own" },
    { "need": "relatedness", "desire": "Be truly known", "evidence": "truly known by someone... dropped the mask" }
  ],
  "urgencyResponse": {
    "level": "high",
    "indicators": ["Strong language ('no life at all')", "Clear articulation", "Emotional weight"]
  }
}
```

### Breakthrough Potential: HIGH

"Safe life = no life" is a breakthrough statement. This indicates high readiness for change.

---

## Q8: Who's Living Your Feared Future

### The Question
```
"Who in your life is already living the future you just described?
Someone five, ten, twenty years ahead on the same trajectory."
```

### Target Signals

| Signal | Type | Schema |
|--------|------|--------|
| Concrete Warning | Anti-vision anchor | Makes abstract real |
| Emotional Charge | Assessment | Disgust, fear, pity |
| Trajectory Awareness | Assessment | Can they see themselves in others |
| Denial Level | Assessment | Do they resist comparison |

### Extraction Schema

```typescript
interface Q8Extraction {
  personIdentified: {
    relationship: string;  // uncle, coworker, friend
    age: number | null;
    yearsAhead: number;
    evidence: string;
  };

  sharedTraits: Array<{
    trait: string;
    inThem: string;
    inSelf: string;
  }>;

  emotionalResponse: {
    primaryEmotion: 'fear' | 'disgust' | 'pity' | 'sadness' | 'anger' | 'denial';
    intensity: 'high' | 'medium' | 'low';
    evidence: string;
  };

  trajectoryAwareness: {
    level: 'clear' | 'partial' | 'resistant';
    evidence: string;
  };

  motivationalPotential: {
    level: 'high' | 'medium' | 'low';
    keyPhrase: string;  // e.g., "I don't want to be him"
  };
}
```

---

## Q9: Identity to Give Up

### The Question
```
"What identity would you have to give up to actually change?
'I am the type of person who...' - what would have to die?"
```

### Target Signals

| Signal | Type | Schema |
|--------|------|--------|
| Protective Identity | Core insight | What self-concept they defend |
| Change Barrier | Pattern | What blocks transformation |
| Ego Investment | Assessment | How attached to current identity |
| Growth Edge | Direction | Where the work needs to happen |

### Extraction Schema

```typescript
interface Q9Extraction {
  protectiveIdentities: Array<{
    statement: string;  // "I am the type of person who..."
    function: string;   // what it protects
    cost: string;       // what it costs
    evidence: string;
  }>;

  whatMustDie: Array<{
    identity: string;
    difficulty: 'high' | 'medium' | 'low';
    resistance: string;  // why it's hard
  }>;

  egoInvestment: {
    level: 'high' | 'medium' | 'low';
    primaryAttachment: string;
    evidence: string;
  };

  growthEdge: {
    direction: string;  // what they need to develop
    blockers: string[];
    evidence: string;
  };
}
```

---

## Q10: Most Embarrassing Reason

### The Question
```
"What is the most embarrassing reason you haven't changed? The
one that makes you sound weak, scared, or lazy rather than reasonable."
```

### Target Signals

| Signal | Type | Schema |
|--------|------|--------|
| Core Block | THE insight | The real obstacle |
| Shame Layer | Assessment | Deepest vulnerability |
| Honesty Level | Assessment | Can they drop defenses |
| Breakthrough Signal | Assessment | Naming it = power breaking |

### Extraction Schema

```typescript
interface Q10Extraction {
  coreBlock: {
    statement: string;
    category: 'fear' | 'laziness' | 'weakness' | 'selfishness' | 'inadequacy';
    stripped: string;  // without rationalization
    evidence: string;
  };

  rationalizations: {
    dropped: string[];  // excuses they set aside
    evidence: string;
  };

  honestyLevel: {
    level: 'full' | 'partial' | 'deflecting';
    indicators: string[];
  };

  breakthroughSignal: {
    present: boolean;
    indicator: string;
    evidence: string;
  };
}
```

### Example Extraction

**User response:**
> "I'm scared. That's it. Not 'I don't have time' or 'the economy' or whatever. I'm scared that if I try and fail, I'll have to face that I'm not as smart or capable as I think I am. Easier to not try and keep the fantasy."

**Extracted:**
```json
{
  "coreBlock": {
    "statement": "Fear of confirmed inadequacy",
    "category": "fear",
    "stripped": "Scared that trying and failing would confirm I'm not as capable as I think",
    "evidence": "I'm scared... if I try and fail, I'll have to face that I'm not as smart or capable"
  },
  "rationalizations": {
    "dropped": ["I don't have time", "the economy"],
    "evidence": "Not 'I don't have time' or 'the economy' or whatever"
  },
  "honestyLevel": {
    "level": "full",
    "indicators": ["No hedging", "Drops rationalizations explicitly", "Uses direct language ('I'm scared. That's it.')"]
  },
  "breakthroughSignal": {
    "present": true,
    "indicator": "Named the core fear without defense",
    "evidence": "Easier to not try and keep the fantasy"
  }
}
```

### Breakthrough Potential: VERY HIGH

This is often THE question. When someone can name their core block without rationalization, the pattern's power starts to break.

---

# SECTION 2: Additional Probing Questions

Beyond Dan Koe's 14, here are additional questions that target specific signals.

## SDT Need Probes

### Autonomy Probes

```
"When was the last time you did something purely because YOU wanted to,
not because someone expected it or you 'should'?"

"Where in your life do you feel most controlled? By what or whom?"

"If you could say 'no' to one thing you currently say 'yes' to,
what would it be?"
```

**Extracts:** Autonomy satisfaction/deficit, external control sources, people-pleasing patterns

### Competence Probes

```
"What's something you're genuinely good at but rarely get to do?"

"When did you last feel like you were growing or getting better
at something that matters to you?"

"What skill or ability do you wish you had developed but haven't?"
```

**Extracts:** Competence satisfaction/deficit, stagnation areas, growth desires

### Relatedness Probes

```
"Who in your life truly knows you - not the version you present,
but who you actually are?"

"When did you last feel genuinely connected to someone?"

"What do you hide from the people closest to you?"
```

**Extracts:** Relatedness satisfaction/deficit, mask patterns, isolation indicators

---

## Pattern Detection Probes

### Avoidance Pattern

```
"What have you been putting off that you know you should do?"

"What situation do you dread that keeps coming up?"

"What would you do if you weren't afraid?"
```

### People-Pleasing Pattern

```
"When did you last say yes when you wanted to say no?"

"Whose approval do you work hardest to maintain?"

"What would change if you stopped caring what people thought?"
```

### Perfectionism Pattern

```
"What are you not starting because it won't be good enough?"

"When did something you created feel 'done'?"

"What would you try if you knew you couldn't fail?"
```

### Start-Stop Pattern

```
"What's something you've started and stopped multiple times?"

"What usually makes you quit?"

"What's the longest you've stuck with something difficult?"
```

---

## Belief Extraction Probes

### Limiting Beliefs

```
"Complete this sentence honestly: 'I'm not the type of person who...'"

"What have you given up on about yourself?"

"What do you believe about yourself that you wish wasn't true?"
```

### Identity Beliefs

```
"How would you describe yourself to someone who's never met you?"

"What's the story you tell yourself about why your life is the way it is?"

"If your life was a movie, what genre would it be?"
```

---

# SECTION 3: Question Sequencing Logic

## Information Gain Optimization

Not all questions are equally valuable at all times. Use CAT-style logic.

### Principles

1. **Start broad, go specific** - Q1-Q2 cast wide net, later questions drill down
2. **Follow the energy** - If user engages deeply on topic, probe more there
3. **Increase intensity gradually** - Or all at once (intensive mode)
4. **Validate before concluding** - Check extracted signals with user

### Adaptive Sequencing

```typescript
interface QuestionSelectionLogic {
  // If SDT need signals are unclear after Q1-Q2
  ifUnclearSDT: ['autonomy_probe', 'competence_probe', 'relatedness_probe'];

  // If avoidance pattern detected
  ifAvoidanceDetected: ['what_putting_off', 'what_if_not_afraid'];

  // If high self-awareness detected in Q3
  ifHighSelfAwareness: ['accelerate_to_Q4', 'skip_softening'];

  // If deflection detected
  ifDeflecting: ['slow_down', 'build_rapport', 'try_different_angle'];

  // If breakthrough signal in Q10
  ifBreakthroughSignal: ['move_to_vision', 'lock_in_insight'];
}
```

### Question Dependencies

```
Q1 → Q2 (builds complaint inventory)
Q2 → Q3 (analyzes complaint inventory)
Q3 → Q4 (opens vulnerability)
Q4 → Q5 (concretizes fear)
Q5 → Q6 (extends fear)
Q6 → Q7 (mortality frame)
Q7 → Q8 (embodies fear)
Q8 → Q9 (identity frame)
Q9 → Q10 (core block)
Q10 → Q11 (flip to vision)
Q11 → Q12 (identity target)
Q12 → Q13 (action bridge)
Q13 → Synthesis
```

---

# SECTION 4: Extraction Confidence Scoring

## Signal Strength Assessment

| Confidence | Criteria | Bayesian Update |
|------------|----------|-----------------|
| **High** | Direct statement, specific example, emotional language | +1.0 to alpha/beta |
| **Medium** | Implied, consistent with other signals, moderate specificity | +0.5 |
| **Low** | Single mention, vague, contradicted elsewhere | +0.25 |

## Cross-Question Validation

Signals should be validated across multiple questions:

```typescript
function validateSignal(signal: Signal, allExtractions: Extraction[]): Signal {
  // Count supporting evidence across questions
  const supportingEvidence = allExtractions.filter(e =>
    e.signals.some(s => s.supports(signal))
  );

  // Adjust confidence based on consistency
  if (supportingEvidence.length >= 3) {
    signal.confidence = 'high';
  } else if (supportingEvidence.length >= 2) {
    signal.confidence = 'medium';
  } else {
    signal.confidence = 'low';
  }

  // Check for contradictions
  const contradictions = allExtractions.filter(e =>
    e.signals.some(s => s.contradicts(signal))
  );

  if (contradictions.length > 0) {
    signal.needsDisambiguation = true;
  }

  return signal;
}
```

---

# SECTION 5: Open Questions

## Extraction Challenges

1. **Terse responders** - How to extract from minimal responses?
2. **Verbose responders** - How to identify signal in noise?
3. **Deflectors** - How to recognize deflection vs genuine uncertainty?
4. **Performers** - How to detect social desirability bias?

## Schema Questions

5. Should patterns be pre-defined categories or emergent?
6. How many signals before we "confirm" a pattern?
7. What's the minimum profile for a useful Day 7 reveal?

## Validation Questions

8. How do we know extractions are accurate?
9. Should we validate with user? ("It sounds like X - is that right?")
10. What if user disagrees with extraction?

---

*This is a working draft. Extraction schemas will be refined during implementation.*
