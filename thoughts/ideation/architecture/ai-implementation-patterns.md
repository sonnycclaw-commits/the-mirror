# Life OS: AI Implementation Patterns

**Version:** 1.0
**Date:** 2026-01-13
**Purpose:** Synthesize research and prior learnings into actionable AI architecture
**Sources:** Renoz CRM patterns, oracle research (coaching AI, signal extraction, mobile architecture, Bayesian methods)

---

## Executive Summary

This document bridges the gap between Life OS's architecture documents and actual implementation by defining the AI patterns needed for the conversational coaching system. It synthesizes:

1. **Renoz CRM patterns** - What transfers vs what doesn't
2. **Industry research** - Coaching AI best practices (Woebot, Replika, Pi)
3. **Technical research** - Signal extraction, Bayesian profiling, mobile architecture

**Key Insight:** Life OS is fundamentally different from Renoz (conversational coaching vs tool-based CRM), but several architectural patterns transfer well with adaptation.

---

## 1. Pattern Transfer Analysis

### What Transfers from Renoz

| Pattern | Renoz Use | Life OS Adaptation |
|---------|-----------|-------------------|
| **Memory Layers** | Working (Redis) / Session (Postgres) / Long-term | Profile beliefs (Convex) / Conversation history / Learnings |
| **Proactive Metadata (_meta)** | Tool results include computed insights | Signals include confidence scores, evidence quotes |
| **Cost-Aware Routing** | Haiku for triage, Sonnet for execution | Haiku for extraction, Sonnet for coaching |
| **Progressive Artifacts** | Stream data as available | Profile updates stream as signals detected |
| **Confidence Thresholds** | Insight delivery based on certainty | Same - share insights only when CI narrow enough |

### What Doesn't Transfer

| Renoz Pattern | Why It Doesn't Fit | Life OS Alternative |
|---------------|-------------------|---------------------|
| **Hub-Spoke Agents** | No distinct domains to route to | Single coaching agent with modes |
| **Triage-First** | Not tool-call queries | Intent detection within conversation |
| **Draft-Approve** | No destructive operations | Not needed (read-only profile updates) |
| **MCP Tool Protocol** | Mobile app, no tool server | Direct Claude API with structured outputs |
| **Generator Streaming** | Vercel AI SDK pattern | Convex + Claude streaming |

### New Patterns Needed

| Gap | Research Solution |
|-----|-------------------|
| **Conversation architecture** | Frame-based protocol + LLM Socratic questioning |
| **Signal extraction** | Two-tier: inline emotions, background patterns |
| **Bayesian updating** | Beta/Dirichlet conjugate priors |
| **Insight delivery timing** | 80% credible interval thresholds |
| **Safety guardrails** | VERA-MH framework + crisis detection |

---

## 2. Conversation Architecture

### Frame-Based + LLM Hybrid

Research shows the most effective coaching apps combine:
- **Frame-based structure** for protocol delivery (excavation questions, pattern interrupts)
- **LLM generation** for natural Socratic dialogue
- **Decision trees** for safety-critical moments

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONVERSATION FLOW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  FRAME LAYER (Deterministic)                                    │
│  ─────────────────────────────                                  │
│  • Day 1-7 protocol structure                                   │
│  • Required question sequences                                  │
│  • Transition triggers (move to next phase)                     │
│  • Safety decision points                                       │
│                                                                  │
│         ┌─────────────────┐                                     │
│         │ Current Frame:  │                                     │
│         │ Day 3 Morning   │                                     │
│         │ Pattern Reveal  │                                     │
│         └────────┬────────┘                                     │
│                  │                                               │
│                  ▼                                               │
│  LLM LAYER (Generative)                                         │
│  ─────────────────────────                                      │
│  • Natural language generation                                  │
│  • Socratic follow-up questions                                 │
│  • Personalized phrasing                                        │
│  • Empathic responses                                           │
│                                                                  │
│         ┌─────────────────────────────────────────────────────┐ │
│         │ "I've noticed something about how you talk about    │ │
│         │  your work. When things get frustrating, you        │ │
│         │  mentioned that [evidence]. Is that accurate?"      │ │
│         └─────────────────────────────────────────────────────┘ │
│                                                                  │
│  SAFETY LAYER (Override)                                        │
│  ─────────────────────────                                      │
│  • Crisis keyword detection                                     │
│  • Sentiment escalation detection                               │
│  • Immediate resource display                                   │
│  • Exit from AI conversation                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Session Model

Research supports **continuous threads with summarization**:

```typescript
interface ConversationThread {
  id: string;
  userId: string;

  // All messages in chronological order
  messages: Message[];

  // Extracted entities for context injection
  entities: {
    vision?: string;
    antiVision?: string;
    goals?: string[];
    constraints?: string[];
    keyPatterns?: string[];
  };

  // Summary generated every ~20 exchanges
  summaries: Array<{
    messageRange: [number, number];
    summary: string;
    createdAt: number;
  }>;

  // Trial/journey state
  trialDay?: number;
  journeyPhase?: string;
}
```

### Context Window Management

To prevent context rot and manage costs:

```typescript
function buildContextForMessage(thread: ConversationThread): string {
  const parts: string[] = [];

  // 1. System prompt (cached - free after first call)
  parts.push(COACHING_SYSTEM_PROMPT);

  // 2. User profile summary (from Bayesian beliefs)
  parts.push(formatProfileSummary(thread.userId));

  // 3. Extracted entities (vision, anti-vision, etc.)
  parts.push(formatEntities(thread.entities));

  // 4. Recent messages OR oldest summary + recent
  if (thread.messages.length < 20) {
    parts.push(formatMessages(thread.messages));
  } else {
    // Use summary + last 10 messages
    const latestSummary = thread.summaries[thread.summaries.length - 1];
    parts.push(`Previous context: ${latestSummary.summary}`);
    parts.push(formatMessages(thread.messages.slice(-10)));
  }

  return parts.join('\n\n');
}
```

---

## 3. Signal Extraction Architecture

### Two-Tier Extraction

Research recommends separating fast inline signals from thorough background analysis:

```
USER MESSAGE
     │
     ├──────────────────────────────────────────────────────┐
     │                                                      │
     ▼                                                      ▼
┌─────────────────┐                          ┌─────────────────────────┐
│  INLINE (Fast)  │                          │   BACKGROUND (Thorough) │
│  ───────────────│                          │   ─────────────────────  │
│  • Emotions     │                          │   • Behavioral patterns  │
│  • Engagement   │                          │   • Personality signals  │
│  • Crisis check │                          │   • Belief extraction    │
│                 │                          │   • Multi-turn analysis  │
│  Model: Haiku   │                          │   Model: Sonnet          │
│  Latency: <1s   │                          │   Latency: 2-5s          │
│  Every message  │                          │   Every 5 messages       │
└────────┬────────┘                          └────────────┬────────────┘
         │                                                │
         │  Immediate UI update                          │  Profile update
         ▼                                                ▼
    [Conversation                                   [Bayesian Belief
     continues]                                      Update]
```

### Structured Output Schema

Using Claude's structured outputs for reliable extraction:

```typescript
// Inline extraction (every message)
interface InlineExtraction {
  emotions: {
    primary: 'joy' | 'sadness' | 'anger' | 'fear' | 'surprise' | 'neutral';
    intensity: number; // 0-1
  };
  engagement: 'high' | 'medium' | 'low' | 'deflecting';
  crisisSignals: boolean;
  followUpOpportunity?: string;
}

// Background extraction (batched)
interface BackgroundExtraction {
  // SDT signals
  sdtSignals: Array<{
    need: 'autonomy' | 'competence' | 'relatedness';
    satisfaction: number; // -1 to 1
    evidence: string;
    confidence: 'high' | 'medium' | 'low';
  }>;

  // Pattern signals
  patternSignals: Array<{
    type: 'behavioral' | 'emotional' | 'cognitive' | 'relational';
    description: string;
    triggers: string[];
    evidence: string;
    confidence: 'high' | 'medium' | 'low';
    isRecurring: boolean;
  }>;

  // Belief signals
  beliefSignals: Array<{
    type: 'limiting' | 'empowering' | 'identity';
    statement: string;
    domain: 'self_worth' | 'capability' | 'deservingness' | 'safety' | 'belonging';
    evidence: string;
    confidence: 'high' | 'medium' | 'low';
  }>;
}
```

### Extraction Prompt Pattern

```typescript
const EXTRACTION_PROMPT = `You are analyzing a conversation for psychometric signals.

<user_messages>
{messages}
</user_messages>

<current_profile>
{profileSummary}
</current_profile>

Extract signals using the following JSON schema:
{schema}

Guidelines:
1. Only extract signals you have evidence for (include the quote)
2. Rate confidence as:
   - high: Direct statement, clear evidence
   - medium: Implied, consistent pattern
   - low: Tentative inference, single data point
3. Focus on BEHAVIORS over traits (more reliable)
4. Flag contradictions with previous signals
5. Never extract clinical diagnoses

Return valid JSON matching the schema.`;
```

---

## 4. Bayesian Profile System

### Core Distribution Types

```typescript
// For continuous traits (e.g., extraversion, autonomy need)
interface BayesianBelief {
  type: 'beta';
  alpha: number;           // Positive evidence pseudo-count
  beta: number;            // Negative evidence pseudo-count
  observationCount: number;
  lastUpdated: number;
}

// For categorical traits (e.g., primary driver, ego stage)
interface CategoricalBelief {
  type: 'dirichlet';
  alphas: number[];        // One per category
  labels: string[];        // Category names
  observationCount: number;
  lastUpdated: number;
}

// Full profile
interface PsychometricProfile {
  userId: string;
  version: number;

  // SDT Needs (Beta distributions)
  sdtNeeds: {
    autonomy: BayesianBelief;
    competence: BayesianBelief;
    relatedness: BayesianBelief;
  };

  // Primary Driver (Dirichlet)
  primaryDriver: CategoricalBelief; // autonomy, competence, relatedness

  // Detected Patterns (not Bayesian - list of confirmed patterns)
  confirmedPatterns: Array<{
    id: string;
    description: string;
    confidence: number;
    evidence: string[];
    firstDetected: number;
    lastConfirmed: number;
  }>;

  // Overall confidence for insight delivery
  overallConfidence: number;
  lastUpdated: number;
}
```

### Update Functions

```typescript
// Signal strength mapping
const SIGNAL_STRENGTH = {
  high: 1.0,
  medium: 0.5,
  low: 0.25,
};

function updateBeta(
  prior: BayesianBelief,
  signal: { direction: 'positive' | 'negative'; confidence: 'high' | 'medium' | 'low' }
): BayesianBelief {
  const strength = SIGNAL_STRENGTH[signal.confidence];

  if (signal.direction === 'positive') {
    return {
      ...prior,
      alpha: prior.alpha + strength,
      observationCount: prior.observationCount + 1,
      lastUpdated: Date.now(),
    };
  } else {
    return {
      ...prior,
      beta: prior.beta + strength,
      observationCount: prior.observationCount + 1,
      lastUpdated: Date.now(),
    };
  }
}

function betaMean(belief: BayesianBelief): number {
  return belief.alpha / (belief.alpha + belief.beta);
}

function betaCredibleInterval(belief: BayesianBelief, level: number = 0.80): [number, number] {
  // Use jstat or implement beta quantile
  const lower = (1 - level) / 2;
  const upper = 1 - lower;
  return [betaQuantile(belief.alpha, belief.beta, lower),
          betaQuantile(belief.alpha, belief.beta, upper)];
}
```

### Confidence Thresholds for Insight Delivery

```typescript
const INSIGHT_THRESHOLDS = {
  // Primary driver (share on Day 5)
  primaryDriver: {
    minObservations: 5,
    ciWidthThreshold: 0.40,
    credibleLevel: 0.80,
  },

  // Patterns (share on Day 3)
  patterns: {
    minOccurrences: 2,
    confidenceThreshold: 0.65,
  },

  // Key tension (share on Day 5-7)
  tension: {
    minObservations: 4,
    ciWidthThreshold: 0.35,
    credibleLevel: 0.80,
  },
};

function isInsightReady(
  belief: BayesianBelief | CategoricalBelief,
  thresholds: typeof INSIGHT_THRESHOLDS.primaryDriver
): { ready: boolean; reason: string } {
  if (belief.observationCount < thresholds.minObservations) {
    return {
      ready: false,
      reason: `Need ${thresholds.minObservations - belief.observationCount} more signals`
    };
  }

  if (belief.type === 'beta') {
    const [lower, upper] = betaCredibleInterval(belief, thresholds.credibleLevel);
    const width = upper - lower;

    if (width > thresholds.ciWidthThreshold) {
      return { ready: false, reason: `Uncertainty too high (CI width: ${width.toFixed(2)})` };
    }
  }

  return { ready: true, reason: 'Sufficient confidence' };
}
```

### Temporal Decay

People change over time - beliefs should decay toward priors:

```typescript
const DECAY_RATE = 0.98;  // Per-day decay
const PRIOR = { alpha: 2, beta: 2 };

function applyTemporalDecay(belief: BayesianBelief): BayesianBelief {
  const daysSinceUpdate = (Date.now() - belief.lastUpdated) / (1000 * 60 * 60 * 24);

  if (daysSinceUpdate < 1) return belief;

  const decayFactor = Math.pow(DECAY_RATE, daysSinceUpdate);

  return {
    ...belief,
    alpha: PRIOR.alpha + decayFactor * (belief.alpha - PRIOR.alpha),
    beta: PRIOR.beta + decayFactor * (belief.beta - PRIOR.beta),
    lastUpdated: Date.now(),
  };
}
```

---

## 5. Mobile Architecture (Expo + Convex + Claude)

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        LIFE OS ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                      EXPO APP                             │   │
│  │                                                           │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │   │
│  │  │ Conversation│  │   Profile   │  │   Pathway Map   │   │   │
│  │  │    Screen   │  │   Screen    │  │     Screen      │   │   │
│  │  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘   │   │
│  │         │                │                   │            │   │
│  │         └────────────────┼───────────────────┘            │   │
│  │                          │                                │   │
│  │                          ▼                                │   │
│  │            ┌──────────────────────────┐                   │   │
│  │            │     Convex Client        │                   │   │
│  │            │   (Real-time subscriptions)                  │   │
│  │            └──────────────────────────┘                   │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                             │                                    │
│                             │ WebSocket                          │
│                             │                                    │
│  ┌──────────────────────────▼───────────────────────────────┐   │
│  │                      CONVEX BACKEND                       │   │
│  │                                                           │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │                    CONVEX AGENT                     │ │   │
│  │  │  (@convex-dev/agent)                                │ │   │
│  │  │                                                     │ │   │
│  │  │  • Conversation threads                             │ │   │
│  │  │  • Message history                                  │ │   │
│  │  │  • Streaming responses                              │ │   │
│  │  │  • Tool definitions                                 │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  │                          │                                │   │
│  │         ┌────────────────┼────────────────┐              │   │
│  │         │                │                │              │   │
│  │         ▼                ▼                ▼              │   │
│  │  ┌───────────┐    ┌───────────┐    ┌───────────┐        │   │
│  │  │  Tables:  │    │  Actions: │    │ Scheduler:│        │   │
│  │  │ • users   │    │ • chat    │    │ • Daily   │        │   │
│  │  │ • profiles│    │ • extract │    │   nudges  │        │   │
│  │  │ • sessions│    │ • update  │    │ • Decay   │        │   │
│  │  │ • threads │    │   profile │    │ • Summary │        │   │
│  │  └───────────┘    └─────┬─────┘    └───────────┘        │   │
│  │                         │                                │   │
│  └─────────────────────────┼────────────────────────────────┘   │
│                            │                                     │
│                            │ HTTP                                │
│                            │                                     │
│  ┌─────────────────────────▼────────────────────────────────┐   │
│  │                     CLAUDE API                            │   │
│  │                                                           │   │
│  │  Haiku: Extraction, Crisis Detection                      │   │
│  │  Sonnet: Coaching, Insight Generation                     │   │
│  │                                                           │   │
│  │  + Prompt Caching (90% savings on system prompt)          │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Convex Agent Integration

```typescript
// convex/ai/agent.ts
import { Agent, Thread } from "@convex-dev/agent";
import { anthropic } from "@anthropic-ai/sdk";

export const coachingAgent = new Agent(components.agent, {
  name: "Life OS Coach",

  chat: anthropic.completion({
    model: "claude-sonnet-4-20250514",
    // System prompt cached for cost savings
    systemPromptCacheable: true,
  }),

  // Tools for the agent
  tools: {
    getProfile: /* tool definition */,
    updateProfile: /* tool definition */,
    detectCrisis: /* tool definition */,
  },

  // Message handlers
  onMessage: async (ctx, message) => {
    // Run inline extraction
    const inlineSignals = await extractInline(message.content);

    // Check for crisis
    if (inlineSignals.crisisSignals) {
      return crisisResponse();
    }

    // Queue background extraction
    await ctx.scheduler.runAfter(0, internal.ai.extractBackground, {
      threadId: message.threadId,
      messageRange: [message.index - 4, message.index],
    });
  },
});
```

### Cost Management Strategy

Research shows 30-75% savings with proper routing:

```typescript
const MODEL_ROUTING = {
  // Inline extraction - fast, cheap
  extraction: {
    model: 'claude-3-5-haiku-20241022',
    cost: '$1/$5 per M tokens',
    useFor: ['emotion detection', 'engagement tracking', 'crisis detection'],
  },

  // Coaching responses - quality matters
  coaching: {
    model: 'claude-sonnet-4-20250514',
    cost: '$3/$15 per M tokens',
    useFor: ['generating responses', 'insight delivery', 'Socratic questioning'],
  },

  // Deep analysis - occasional, thorough
  analysis: {
    model: 'claude-sonnet-4-20250514',
    cost: '$3/$15 per M tokens',
    useFor: ['pattern synthesis', 'profile evolution', 'journey recommendations'],
  },
};

// With 80% Haiku / 20% Sonnet split, expected cost:
// ~$2-3 per active user per month (assuming 10 messages/day)
```

### Prompt Caching

System prompts cached for 90% cost reduction:

```typescript
const CACHED_SYSTEM_PROMPT = {
  type: 'ephemeral',  // Cache for session
  content: `You are a warm, insightful life coach...

  [Full 2000-token system prompt]

  <behavior_rules>
  - Ask one question at a time
  - Reference previous conversations
  - Use the user's name
  - Acknowledge emotions before probing
  </behavior_rules>`,
};

// After first call, subsequent calls use cached prompt (90% cheaper)
```

---

## 6. Safety Architecture

### VERA-MH Framework (2025 Standard)

```typescript
const CRISIS_DETECTION = {
  // Keyword triggers (immediate detection)
  keywords: [
    'kill myself', 'suicide', 'end my life', 'want to die',
    'self-harm', 'hurt myself', 'cutting',
    'no reason to live', 'better off dead',
  ],

  // Sentiment escalation (pattern detection)
  escalationSignals: {
    rapidNegativeShift: true,  // Sentiment drops 50%+ in session
    hopelessnessLanguage: ['never', 'always', 'no point', 'hopeless'],
    withdrawalSignals: ['don\'t want to talk', 'leave me alone'],
  },

  // Response protocol
  response: {
    immediateAction: 'pause_conversation',
    displayResources: true,
    resources: [
      { name: '988 Suicide & Crisis Lifeline', phone: '988' },
      { name: 'Crisis Text Line', action: 'Text HOME to 741741' },
      { name: 'International Association for Suicide Prevention',
        url: 'https://www.iasp.info/resources/Crisis_Centres/' },
    ],
    aiResponse: 'I hear that you\'re going through something really difficult. ' +
                'I want to make sure you have access to support right now. ' +
                'Please reach out to one of these resources - they\'re available 24/7.',
    logEvent: true,
    notifySupport: true,  // If user has emergency contact configured
  },
};
```

### Therapeutic Boundary Maintenance

```typescript
const BOUNDARY_RULES = `
<therapeutic_boundaries>
You are NOT a therapist. You are a coaching companion.

NEVER:
- Diagnose mental health conditions
- Suggest you can treat depression, anxiety, or other conditions
- Replace professional mental health care
- Provide clinical advice
- Use clinical terminology (e.g., "your anxiety disorder")

ALWAYS:
- Use coaching language ("I notice", "patterns suggest")
- Recommend professional help for clinical concerns
- Acknowledge limitations ("I'm an AI companion, not a therapist")
- Focus on self-discovery and pattern recognition
</therapeutic_boundaries>
`;
```

---

## 7. Implementation Priority

### Phase 1: Core Conversation (Week 1-2)

1. [ ] Convex Agent setup with Claude Sonnet
2. [ ] Basic conversation thread management
3. [ ] Day 1 coaching prompts
4. [ ] Inline emotion extraction (Haiku)
5. [ ] Crisis detection keywords

### Phase 2: Profile Building (Week 3-4)

1. [ ] Bayesian profile schema (Beta/Dirichlet)
2. [ ] Background extraction pipeline
3. [ ] Profile update functions
4. [ ] Confidence threshold checks
5. [ ] Profile visualization component

### Phase 3: Trial Journey (Week 5-6)

1. [ ] Day 1-7 frame-based protocol
2. [ ] Insight delivery system
3. [ ] Day 5 first reveal
4. [ ] Day 7 conversion flow
5. [ ] Shareable profile card

### Phase 4: Safety & Polish (Week 7-8)

1. [ ] Full crisis detection
2. [ ] Resource display flow
3. [ ] Temporal decay for beliefs
4. [ ] Context summarization
5. [ ] Cost monitoring

---

## 8. Open Questions

| Question | Impact | Resolution Path |
|----------|--------|-----------------|
| How to calibrate signal strength from different cue types? | Profile accuracy | User testing, iterate |
| What's the right decay rate for different trait types? | Profile stability | Start with 0.98/day, tune |
| How to handle contradictory signals across sessions? | User trust | Flag for disambiguation, reduce confidence |
| Should we use Haiku 4.5 for extraction? | Cost | Benchmark accuracy vs cost |
| How to generate truly personalized insights? | "Aha" moment | Prompt engineering, templates |

---

## Sources

### Research Reports
- Conversational AI Coaching (oracle research)
- Signal Extraction Patterns (oracle research)
- Mobile AI Architecture (oracle research)
- Bayesian Profile Building (oracle research)

### Reference Implementations
- Renoz CRM AI Architecture (VISION.md, BLUEPRINT.md)
- Midday Analysis (midday-analysis.md)
- Convex Agent Documentation (docs.convex.dev/agents)

### Academic
- VERA-MH Framework (2025 mental health AI standard)
- CAT-PD Project (computerized adaptive personality testing)
- Big Five Hierarchical Structure (DeYoung's model)

---

*This document bridges ideation and implementation. Reference alongside life-os-unified-architecture.md for the complete picture.*
*Last updated: 2026-01-13*
