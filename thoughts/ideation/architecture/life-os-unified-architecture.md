# Life OS: Unified Architecture

**Version:** 2.0
**Date:** 2026-01-13
**Status:** Definitive Source of Truth
**Supersedes:** technical-architecture.md, mvp-plan.md, research-synthesis.md

---

## Executive Summary

Life OS is a psychometric coaching application that builds a living, evolving profile of users through natural conversation. The app has two distinct phases:

1. **Trial Phase (7 days):** Build profile + create "aha moment" for conversion
2. **Journey Phase (post-conversion):** Transform understanding into action

**Core Insight:** People don't pay for self-help content—they pay for the rare experience of feeling truly understood. The trial demonstrates understanding; the journey delivers transformation.

**North Star Metric:** "This is me" moment achievement rate (>80% of Day 7 users)

---

## 1. Product Philosophy

### 1.1 The Two-Phase Model

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         LIFE OS USER JOURNEY                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   TRIAL PHASE (7 Days - Free)                                          │
│   ═══════════════════════════                                          │
│   Purpose: Demonstrate understanding → Drive conversion                 │
│   Output: Baseline psychometric profile + "aha moment"                  │
│                                                                         │
│   Day 1: First Contact ────► Plant seeds, show we're different         │
│   Day 2: Building Rapport ─► Establish rhythm, deepen capture          │
│   Day 3: Pattern Recognition► First "we noticed..." moment             │
│   Day 4: Going Deeper ─────► Emotional territory, anticipation         │
│   Day 5: First Reveal ─────► MAJOR AHA MOMENT + soft conversion        │
│   Day 6: Anticipation ─────► Blocker hypothesis, urgency               │
│   Day 7: Conversion ───────► Profile reveal + subscription             │
│                                                                         │
│   ════════════════════════════════════════════════════════════════════ │
│                              CONVERSION                                 │
│   ════════════════════════════════════════════════════════════════════ │
│                                                                         │
│   JOURNEY PHASE (Ongoing - Paid)                                       │
│   ════════════════════════════                                         │
│   Purpose: Transform understanding into action                          │
│   Output: Skill development, pattern breaking, growth                   │
│                                                                         │
│   Week 1: Excavation ──────► Deep anti-vision, identity work           │
│   Week 2-4: Calibration ───► Build habits, test patterns               │
│   Month 2+: Evolution ─────► Skill tree growth, boss fights            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.2 What Trial IS vs IS NOT

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                        TRIAL PURPOSE STATEMENT                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   The trial is NOT about:                                                 ║
║   ✗ Teaching transformation frameworks                                    ║
║   ✗ Running users through the "Unfuck Your Life" journey                  ║
║   ✗ Delivering comprehensive self-development content                     ║
║   ✗ Solving their problems                                                ║
║                                                                           ║
║   The trial IS about:                                                     ║
║   ✓ Building a rich psychometric profile through conversation             ║
║   ✓ Creating the "holy shit, this app GETS me" moment                     ║
║   ✓ Teasing insights that make users hungry for more                      ║
║   ✓ Converting curious downloaders into paying subscribers                ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

### 1.3 Conversion Psychology

The trial leverages five psychological principles:

| Principle | Mechanism | Implementation |
|-----------|-----------|----------------|
| **Zeigarnik Effect** | Incomplete patterns demand resolution | Reveal some insights, tease others |
| **Reciprocity** | Genuine value creates obligation | Thoughtful questions + real insights |
| **Investment Escalation** | Sunk cost of self-disclosure | Each day invests more of themselves |
| **Social Proof via Self-Recognition** | Accuracy validates competence | "If it got THAT right, what else?" |
| **Curiosity Gap** | Gap between known and unknown | Show enough to prove, hold enough to desire |

---

## 2. Psychometric Framework Stack

### 2.1 Assessment Dimensions

```
┌─────────────────────────────────────────────────────────────────┐
│                PSYCHOMETRIC FRAMEWORK STACK                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   LAYER 1: PERSONALITY (Foundation)                             │
│   ─────────────────────────────────                             │
│   Framework: HEXACO (not Big Five)                              │
│   Dimensions:                                                    │
│   • Honesty-Humility (unique to HEXACO - aligns with character) │
│   • Emotionality                                                 │
│   • Extraversion                                                 │
│   • Agreeableness                                                │
│   • Conscientiousness                                            │
│   • Openness to Experience                                       │
│                                                                  │
│   LAYER 2: MOTIVATION (What Drives)                             │
│   ─────────────────────────────────                             │
│   Framework: Self-Determination Theory (SDT)                     │
│   Dimensions:                                                    │
│   • Autonomy (need for self-direction)                          │
│   • Competence (need for mastery)                               │
│   • Relatedness (need for connection)                           │
│   + McClelland's Needs: Achievement / Power / Affiliation       │
│                                                                  │
│   LAYER 3: DEVELOPMENT (Where They Are)                         │
│   ─────────────────────────────────────                         │
│   Framework: Kegan/Loevinger Ego Development                     │
│   Stages: Impulsive → Self-Protective → Conformist →            │
│           Self-Aware → Conscientious → Individualist →          │
│           Strategist → Construct-Aware → Unitive                │
│                                                                  │
│   LAYER 4: POSITIVE (Strengths)                                 │
│   ─────────────────────────────                                 │
│   Framework: VIA Character Strengths + PERMA Well-being         │
│   (Post-conversion depth)                                        │
│                                                                  │
│   LAYER 5: BEHAVIORAL (Patterns)                                │
│   ──────────────────────────────                                │
│   Elements:                                                      │
│   • Defense mechanisms                                           │
│   • Limiting beliefs                                             │
│   • Self-sabotage patterns                                       │
│   • Attribution style (internal/external/luck)                   │
│   • Habit loops                                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Assessment Priority Tiers

| Tier | When to Assess | Dimensions | Why |
|------|----------------|------------|-----|
| **Tier 1: Must Have** | Trial Days 1-7 | SDT needs, Motivational drivers, Key patterns, Life satisfaction | Creates aha moments, reliable to extract |
| **Tier 2: Desired** | Trial Days 3-7 | HEXACO signals, Values, Self-sabotage hints, Attribution style | Deepens profile, useful for journey |
| **Tier 3: Post-Conversion** | Journey Phase | Full developmental stage, Attachment style, Defense mechanisms, VIA strengths | Requires trust, complex to assess |

### 2.3 Reveal vs Holdback Framework

```
┌─────────────────────────────────────────────────────────────────┐
│              REVEAL vs HOLD BACK FRAMEWORK                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   REVEAL DURING TRIAL:                                          │
│   ✓ Primary motivational driver (Autonomy/Competence/Relatedness)│
│   ✓ 2-3 specific patterns you're confident about                │
│   ✓ One key tension/contradiction                               │
│   ✓ Surface values                                              │
│   ✓ General direction of development                            │
│                                                                  │
│   HOLD BACK FOR POST-CONVERSION:                                │
│   ⊘ Full developmental stage assessment                         │
│   ⊘ Detailed blocker analysis                                   │
│   ⊘ Defense mechanism interpretations                           │
│   ⊘ Attachment style analysis                                   │
│   ⊘ Complete skill tree recommendations                         │
│   ⊘ Specific journey design                                     │
│   ⊘ Deeper pattern connections                                  │
│                                                                  │
│   NEVER REVEAL:                                                  │
│   ✗ Anything you're not confident about                         │
│   ✗ Potentially damaging interpretations without trust          │
│   ✗ Clinical-sounding assessments                               │
│   ✗ Anything that could feel like labeling                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Architecture

### 3.1 Core Data Model

```typescript
// ════════════════════════════════════════════════════════════════
// CORE ENTITIES
// ════════════════════════════════════════════════════════════════

interface User {
  id: string;
  externalId: string;          // Clerk auth ID
  email: string;

  // Trial state
  trialDay: number;            // 1-7, or null if converted
  trialStartedAt: number;
  trialEndsAt: number;

  // Subscription state
  subscriptionStatus: 'trial' | 'active' | 'churned' | 'expired';
  convertedAt?: number;

  // Engagement
  totalSessions: number;
  currentStreak: number;
  lastActiveAt: number;
}

interface PsychometricProfile {
  userId: string;
  version: number;             // Increments with significant updates

  // ════════════════════════════════════════════════════════════
  // BAYESIAN BELIEF STATES
  // Each dimension stores: estimate, alpha, beta, confidence
  // ════════════════════════════════════════════════════════════

  // SDT Needs (Layer 2 - Priority for Trial)
  sdtNeeds: {
    autonomy: BayesianBelief;
    competence: BayesianBelief;
    relatedness: BayesianBelief;
  };

  // Motivational Drivers
  motivationalDrivers: {
    achievement: BayesianBelief;
    power: BayesianBelief;
    affiliation: BayesianBelief;
  };

  // HEXACO Personality (Layer 1)
  hexaco: {
    honestyHumility: BayesianBelief;
    emotionality: BayesianBelief;
    extraversion: BayesianBelief;
    agreeableness: BayesianBelief;
    conscientiousness: BayesianBelief;
    openness: BayesianBelief;
  };

  // Developmental Stage (Layer 3)
  developmentalStage: {
    hypothesis: EgoStage;
    confidence: number;
    evidenceCount: number;
  };

  // Meta
  overallConfidence: number;   // Weighted average of all dimensions
  lastUpdated: number;
  totalSignalsProcessed: number;
}

interface BayesianBelief {
  estimate: number;            // 0-1, current belief
  alpha: number;               // Positive evidence count
  beta: number;                // Negative evidence count
  confidence: number;          // Derived from alpha + beta
  lastUpdated: number;
  evidenceCount: number;
}

type EgoStage =
  | 'impulsive'
  | 'self_protective'
  | 'conformist'
  | 'self_aware'
  | 'conscientious'
  | 'individualist'
  | 'strategist'
  | 'construct_aware'
  | 'unitive';
```

### 3.2 Signal & Extraction Model

```typescript
// ════════════════════════════════════════════════════════════════
// SIGNAL EXTRACTION
// ════════════════════════════════════════════════════════════════

interface ConversationSession {
  id: string;
  userId: string;

  // Session metadata
  sessionType: 'trial_onboarding' | 'trial_daily' | 'journey_excavation' | 'journey_daily';
  trialDay?: number;           // 1-7 if trial session
  journeyDay?: number;         // If journey session

  // Timing
  startedAt: number;
  endedAt?: number;

  // AI thread reference
  threadId: string;

  // Session summary (populated at end)
  summary?: string;
  keyInsights?: string[];
  ahaMonentAchieved?: boolean;
}

interface MessageExtraction {
  sessionId: string;
  userId: string;
  messageIndex: number;

  // The extraction result
  signals: {
    // SDT signals
    sdtSignals?: SDTSignal[];

    // Personality signals
    personalitySignals?: PersonalitySignal[];

    // Pattern signals
    patternSignals?: PatternSignal[];

    // Belief signals
    beliefSignals?: BeliefSignal[];

    // Emotional signals
    emotionalSignals?: EmotionalSignal[];
  };

  // Meta-signals
  responseAuthenticity: number;     // 0-1
  engagementLevel: number;          // 0-1
  extractionConfidence: 'high' | 'medium' | 'low' | 'uncertain';

  // Processing state
  profileUpdated: boolean;
  createdAt: number;
}

interface SDTSignal {
  need: 'autonomy' | 'competence' | 'relatedness';
  satisfaction: number;             // -1 to 1
  direction: 'satisfied' | 'frustrated';
  evidence: string;                 // Quote from user
  confidence: 'high' | 'medium' | 'low';
}

interface PatternSignal {
  patternType: 'behavioral' | 'emotional' | 'relational' | 'cognitive';
  description: string;
  triggers?: string[];
  evidence: string;
  confidence: 'high' | 'medium' | 'low';
  isRecurring: boolean;
}

interface BeliefSignal {
  beliefType: 'limiting' | 'empowering' | 'identity';
  statement: string;                // Normalized form
  domain: 'self_worth' | 'capability' | 'deservingness' | 'safety' | 'belonging';
  evidence: string;
  confidence: 'high' | 'medium' | 'low';
}
```

### 3.3 Profile Insights (What Users See)

```typescript
// ════════════════════════════════════════════════════════════════
// USER-FACING INSIGHTS
// Separate from raw profile data - curated for display
// ════════════════════════════════════════════════════════════════

interface ProfileInsights {
  userId: string;

  // What to reveal (based on confidence thresholds)
  revealedInsights: {
    // Primary driver (always show if confidence > 70%)
    primaryDriver?: {
      driver: 'autonomy' | 'competence' | 'relatedness';
      description: string;
      confidence: number;
    };

    // Patterns (show up to 3 with confidence > 60%)
    patterns: Array<{
      name: string;
      description: string;
      evidence: string;
      confidence: number;
    }>;

    // Key tension (show 1 if confidence > 65%)
    keyTension?: {
      tensionA: string;
      tensionB: string;
      description: string;
      confidence: number;
    };
  };

  // What to tease (shown as locked)
  teasedInsights: {
    developmentalStage: boolean;
    deepBlockers: boolean;
    skillTree: boolean;
    personalizedJourney: boolean;
  };

  // Profile completion visualization
  completionMetrics: {
    overall: number;              // 0-100%
    motivationalDrivers: number;
    behavioralPatterns: number;
    emotionalPatterns: number;
  };

  // For Day 7 shareable card
  shareableCard?: {
    headline: string;             // e.g., "The Reluctant Visionary"
    traits: string[];
    quote: string;
  };

  lastUpdated: number;
}
```

### 3.4 Confidence-Based Delivery

```typescript
// ════════════════════════════════════════════════════════════════
// INSIGHT DELIVERY RULES
// ════════════════════════════════════════════════════════════════

const CONFIDENCE_THRESHOLDS = {
  // When to reveal as direct statement
  HIGH_CONFIDENCE: 0.80,          // "You seem to have a strong need for..."

  // When to reveal as hypothesis
  MEDIUM_CONFIDENCE: 0.50,        // "Here's a hypothesis: There might be..."

  // When to probe further (don't reveal)
  LOW_CONFIDENCE: 0.50,           // Ask exploratory question instead

  // Minimum to show in profile
  DISPLAY_THRESHOLD: 0.60,

  // Minimum to include in shareable card
  CARD_THRESHOLD: 0.75,
};

type InsightDeliveryMode =
  | 'direct_statement'    // High confidence: "You are..."
  | 'hypothesis'          // Medium confidence: "I'm noticing..."
  | 'exploratory'         // Low confidence: "I'm curious if..."
  | 'withheld';           // Too uncertain to mention
```

---

## 4. Agent Architecture

### 4.1 Multi-Agent System

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER MESSAGE                                    │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ORCHESTRATOR AGENT                                 │
│  Responsibilities:                                                           │
│  • Route messages to appropriate specialist                                  │
│  • Manage trial vs journey context                                          │
│  • Track conversion triggers                                                │
│  • Coordinate insight reveals                                               │
└─────────────────────────────┬─────────────────┬─────────────────────────────┘
                              │                 │
         ┌────────────────────┘                 └────────────────────┐
         │                                                          │
         ▼                                                          ▼
┌─────────────────────────┐                          ┌─────────────────────────┐
│   EXCAVATION AGENT      │                          │    INQUIRY AGENT        │
│                         │                          │                         │
│ • Extract signals from  │                          │ • Decide next question  │
│   user messages         │                          │ • Optimize info gain    │
│ • Structured outputs    │                          │ • Manage conversation   │
│ • Confidence scoring    │                          │   flow                  │
└───────────┬─────────────┘                          └─────────────────────────┘
            │
            │ Signals
            ▼
┌─────────────────────────┐                          ┌─────────────────────────┐
│    PROFILE AGENT        │                          │   INSIGHT AGENT         │
│                         │                          │                         │
│ • Bayesian updates      │                          │ • Generate insights     │
│ • Confidence tracking   │                          │ • Confidence-based      │
│ • Pattern accumulation  │                          │   delivery mode         │
│ • Drift detection       │                          │ • Aha moment creation   │
└─────────────────────────┘                          └─────────────────────────┘

┌─────────────────────────┐                          ┌─────────────────────────┐
│   SKILL TREE AGENT      │                          │    COACH AGENT          │
│   (Post-Conversion)     │                          │                         │
│                         │                          │ • Generate responses    │
│ • Emergent skills       │                          │ • Embed next question   │
│ • Blocker detection     │                          │ • Maintain rapport      │
│ • Growth edges          │                          │ • Conversion triggers   │
└─────────────────────────┘                          └─────────────────────────┘
```

### 4.2 Trial vs Journey Agent Behavior

| Agent | Trial Behavior | Journey Behavior |
|-------|----------------|------------------|
| **Orchestrator** | Track conversion triggers, manage reveal timing | Manage journey progression, skill unlocking |
| **Excavation** | Extract Tier 1-2 dimensions, light touch | Extract all tiers, deeper probing |
| **Profile** | Build baseline, flag high-confidence insights | Full updates, pattern connections |
| **Inquiry** | Optimize for aha moment, avoid overwhelming | Optimize for growth, challenge appropriately |
| **Insight** | Reveal/holdback based on framework | Full disclosure, developmental feedback |
| **Coach** | Warm, curious, demonstrate understanding | Challenging, supportive, action-oriented |
| **Skill Tree** | INACTIVE (tease only) | Full operation |

### 4.3 Agent Contracts (Simplified)

```typescript
// ════════════════════════════════════════════════════════════════
// EXCAVATION AGENT
// ════════════════════════════════════════════════════════════════

interface ExcavationInput {
  userMessage: string;
  questionAsked: string;
  sessionContext: {
    sessionType: string;
    trialDay?: number;
    messageCount: number;
  };
  profileSummary: {
    currentConfidences: Record<string, number>;
    knownPatterns: string[];
    gapsToFill: string[];
  };
}

interface ExcavationOutput {
  signals: {
    sdtSignals: SDTSignal[];
    personalitySignals: PersonalitySignal[];
    patternSignals: PatternSignal[];
    beliefSignals: BeliefSignal[];
    emotionalSignals: EmotionalSignal[];
  };

  meta: {
    responseAuthenticity: number;
    engagementLevel: number;
    extractionConfidence: 'high' | 'medium' | 'low';
  };

  conversationGuidance: {
    followUpOpportunities: string[];
    resistanceDetected: boolean;
    topicsToAvoid: string[];
  };
}

// ════════════════════════════════════════════════════════════════
// INSIGHT AGENT
// ════════════════════════════════════════════════════════════════

interface InsightInput {
  profile: PsychometricProfile;
  sessionHistory: ExcavationOutput[];
  trialDay: number;
  previousInsightsDelivered: string[];
}

interface InsightOutput {
  // What to reveal now
  insightToDeliver?: {
    type: 'pattern' | 'driver' | 'tension' | 'blocker';
    content: string;
    deliveryMode: 'direct_statement' | 'hypothesis' | 'exploratory';
    confidence: number;
    validationQuestion: string;
  };

  // Profile display update
  profileDisplayUpdate?: {
    newRevealedInsights: string[];
    completionDelta: number;
  };

  // Conversion trigger
  conversionTrigger?: {
    shouldPrompt: boolean;
    promptType: 'soft_tease' | 'value_prop' | 'urgency' | 'full_conversion';
    message: string;
  };
}
```

---

## 5. User Journey Maps

### 5.1 Trial Journey (Days 1-7)

```
DAY 1: FIRST CONTACT
══════════════════════════════════════════════════════════════════
Duration: 10-15 minutes
Tone: Warm, curious, not clinical

┌─────────────────────────────────────────────────────────────────┐
│ OPENING                                                         │
│ "Hey. I'm glad you're here.                                     │
│ I'm not going to give you a personality type in 5 minutes.      │
│ What I will do is actually listen. Sound interesting?"          │
├─────────────────────────────────────────────────────────────────┤
│ QUESTIONS (Light Layer)                                         │
│ • "What's one thing you did today you actually wanted to do?"   │
│ • "When you meet someone new, are you more curious about them   │
│    or more concerned about what they think of you?"             │
│ • "When something goes wrong, where does your mind go first?"   │
│ • "What's something about yourself people often get wrong?"     │
│ • "If you could change one thing about your days, what?"        │
├─────────────────────────────────────────────────────────────────┤
│ CLOSING TEASE                                                   │
│ "One thing I noticed: [specific observation based on responses] │
│  That tells me something. We'll explore it tomorrow."           │
├─────────────────────────────────────────────────────────────────┤
│ SYSTEM CAPTURES                                                 │
│ • SDT need signals (autonomy frustration, etc.)                │
│ • Attribution style (internal/external)                         │
│ • Self-awareness level                                          │
│ • Engagement style (brief vs expansive)                         │
│ • Response latency patterns                                     │
└─────────────────────────────────────────────────────────────────┘

DAY 2: BUILDING RAPPORT
══════════════════════════════════════════════════════════════════
Sessions: Morning (5-8 min) + Evening (5-8 min)

Morning:
• Check-in: "How did yesterday's conversation leave you feeling?"
• Pattern intro: "Think about last 3 times you felt frustrated. Common thread?"
• Motivation probe: "Would you rather be great unnoticed, mediocre admired, or loving regardless?"

Evening:
• Reference morning: "You mentioned [pattern]. Did you notice it today?"
• Closing tease: "I'm starting to see something. Too early to say what..."

DAY 3: PATTERN RECOGNITION
══════════════════════════════════════════════════════════════════
Sessions: Morning (8-10 min) + Midday micro + Evening (8-10 min)

Morning - FIRST PATTERN OBSERVATION:
"I want to share something I've noticed..."
[System selects most confident observation from Days 1-2]
Example: "You seem to have a strong need for freedom and choice.
         When that gets constrained, something in you pushes back.
         Am I in the ballpark?"

Profile visualization appears showing progress bars.

Evening - CONTRADICTION DETECTION:
"I'm going to name two things that both seem true about you.
 When they conflict, which one usually wins?"

DAY 4: GOING DEEPER
══════════════════════════════════════════════════════════════════
Sessions: Morning (10-12 min) + Evening (8-10 min)

Morning - EMOTIONAL EXCAVATION:
• "When was the last time you felt genuinely proud of yourself?"
• "When was the last time you felt disappointed in yourself?"
• "When going through something hard, what's your instinct?"

Defense mechanism soft detection (observe, don't confront).

Evening - FUTURE SELF:
"Imagine you in 3 years. The version that figured some things out.
 What's different about that person?"

Closing: "Tomorrow, I'm going to share something with you.
         Something I've been piecing together. Sleep well."

DAY 5: THE FIRST REVEAL ← CONVERSION DRIVER
══════════════════════════════════════════════════════════════════
Session: Morning (12-15 min)

MAJOR INSIGHT DELIVERY:
"I've been listening. Not just to what you said—
 but to how you said it. What you came back to. What you skipped.

 Here's what I'm seeing:
 [Personalized insight based on accumulated data]

 Take a moment with that. Does it land?"

PARTIAL PROFILE REVEAL:
Show discovered insights + locked sections.

SOFT CONVERSION OPPORTUNITY:
"This is just the surface. Your full profile reveals your
 developmental stage—where you are and where you're heading.
 [See What Else We've Found] [Continue Trial]
 No pressure. You still have 2 days left."

DAY 6: BUILDING ANTICIPATION
══════════════════════════════════════════════════════════════════
Sessions: Morning (10 min) + Evening (10 min)

Morning - BLOCKER HYPOTHESIS:
"Based on everything you've shared, I have a hypothesis
 about something that gets in your way. Can I share it?"

Journey preview shown: "If we keep working together..."

Evening - URGENCY INTRODUCTION:
"Tomorrow is Day 7. The last day of your trial.
 There are things I've been holding back—not to be mysterious,
 but because they make more sense once the full picture is clear."

DAY 7: THE CONVERSION MOMENT
══════════════════════════════════════════════════════════════════
Session: 15-20 min

PROFILE REVEAL (curated, not complete):
• Primary driver + description
• Secondary driver
• Core pattern
• Key tension
• LOCKED: Developmental stage, deep blockers, journey, skill tree

VALUE PROPOSITION:
"Here's what happens if you continue:
 ✓ Complete profile (what we haven't shown you yet)
 ✓ Developmental stage assessment
 ✓ Personalized journey designed for YOUR patterns
 ✓ Skill tree based on YOUR specific blockers
 ✓ An AI companion that actually knows you"

CONVERSION CTA:
[Subscribe Now] or [I Need More Time]
```

### 5.2 Conversion Trigger Map

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONVERSION TRIGGER MAP                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Day 1-2: NO conversion prompts                                │
│   • Focus: Building trust, showing we're different              │
│   • Risk of early prompt: Feels salesy, breaks trust            │
│                                                                  │
│   Day 3: Soft tease                                             │
│   • "Your profile is starting to reveal interesting patterns.   │
│     We'll have more to show you by the end of the week."        │
│   • NO conversion prompt yet                                    │
│                                                                  │
│   Day 5: First major insight reveal + soft conversion offer     │
│   • After delivering a powerful insight:                        │
│   • "This is just the beginning. With a full subscription,      │
│     you'll unlock your complete profile and personalized        │
│     pathway. [Learn More] [Continue Trial]"                     │
│                                                                  │
│   Day 6: Urgency introduction                                   │
│   • "Tomorrow is your last day of the trial. Your profile       │
│     has revealed some fascinating patterns we're excited        │
│     to explore with you."                                       │
│                                                                  │
│   Day 7: Full conversion moment                                 │
│   • Major profile reveal (but not everything)                   │
│   • Clear value proposition                                     │
│   • Journey/pathway preview                                     │
│   • Subscription offer                                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 Post-Conversion Journey

```
JOURNEY PHASE: UNFUCK YOUR LIFE
══════════════════════════════════════════════════════════════════

WEEK 1: DEEP EXCAVATION
─────────────────────────
Day 1 Post-Conversion:
• Full profile unlock
• Journey selection (recommended based on profile)
• Skill tree reveal
• "Today is Day 1 of your actual journey. Not trial. The real thing."

Days 2-7:
• Morning excavation (full Dan Koe framework)
• Anti-vision deep dive ("Describe the life you're terrified of")
• Vision excavation ("What do you actually want?")
• Pattern interrupts throughout day

WEEKS 2-4: CALIBRATION
─────────────────────────
• Daily micro-sessions (2-5 min)
• Pattern tracking ("Did you notice [pattern] today?")
• Habit formation (tiny habits approach)
• First skill unlocks
• Weekly "wrapped" style insights

MONTH 2+: EVOLUTION
─────────────────────────
• Boss fights (monthly projects)
• Skill tree growth
• Developmental stage tracking
• Deeper blocker work
• Periodic profile evolution summaries
```

---

## 6. Technical Stack

### 6.1 Stack Overview

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Mobile** | React Native + Expo | Cross-platform, 95% code share |
| **Backend** | Convex | Real-time native, TypeScript-first, Agent component |
| **AI** | Claude API (Anthropic) | Structured outputs, best reasoning for coaching |
| **Auth** | Clerk | Seamless Expo integration, social login |
| **Payments** | Stripe | Industry standard |
| **Notifications** | Expo Push + JITAI logic | Pattern interrupts, conversion triggers |

### 6.2 Convex Schema (Simplified)

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users
  users: defineTable({
    externalId: v.string(),
    email: v.string(),
    trialDay: v.optional(v.number()),
    trialStartedAt: v.optional(v.number()),
    subscriptionStatus: v.string(),
    convertedAt: v.optional(v.number()),
    totalSessions: v.number(),
    lastActiveAt: v.number(),
  }).index("by_external_id", ["externalId"]),

  // Psychometric Profiles (Bayesian)
  profiles: defineTable({
    userId: v.id("users"),
    version: v.number(),

    // SDT Needs
    sdtNeeds: v.object({
      autonomy: v.object({ estimate: v.number(), alpha: v.number(), beta: v.number(), confidence: v.number() }),
      competence: v.object({ estimate: v.number(), alpha: v.number(), beta: v.number(), confidence: v.number() }),
      relatedness: v.object({ estimate: v.number(), alpha: v.number(), beta: v.number(), confidence: v.number() }),
    }),

    // HEXACO (simplified for MVP)
    hexaco: v.optional(v.any()),

    // Developmental stage
    developmentalStage: v.optional(v.object({
      hypothesis: v.string(),
      confidence: v.number(),
    })),

    overallConfidence: v.number(),
    lastUpdated: v.number(),
  }).index("by_user", ["userId"]),

  // User-Facing Insights (what to show)
  profileInsights: defineTable({
    userId: v.id("users"),

    primaryDriver: v.optional(v.object({
      driver: v.string(),
      description: v.string(),
      confidence: v.number(),
    })),

    patterns: v.array(v.object({
      name: v.string(),
      description: v.string(),
      confidence: v.number(),
    })),

    keyTension: v.optional(v.object({
      description: v.string(),
      confidence: v.number(),
    })),

    completionPercent: v.number(),
    shareableCard: v.optional(v.any()),
    lastUpdated: v.number(),
  }).index("by_user", ["userId"]),

  // Conversation Sessions
  sessions: defineTable({
    userId: v.id("users"),
    sessionType: v.string(),
    trialDay: v.optional(v.number()),
    threadId: v.string(),
    startedAt: v.number(),
    endedAt: v.optional(v.number()),
    ahaAchieved: v.optional(v.boolean()),
  }).index("by_user", ["userId"]),

  // Message Extractions
  extractions: defineTable({
    sessionId: v.id("sessions"),
    userId: v.id("users"),
    messageIndex: v.number(),
    signals: v.any(),
    confidence: v.string(),
    profileUpdated: v.boolean(),
    createdAt: v.number(),
  }).index("by_session", ["sessionId"]),

  // Skills (Post-Conversion)
  skills: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.string(),
    level: v.number(),
    confidence: v.number(),
    status: v.string(),
    discoveredAt: v.number(),
  }).index("by_user", ["userId"]),

  // Subscriptions
  subscriptions: defineTable({
    userId: v.id("users"),
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.string(),
    status: v.string(),
    currentPeriodEnd: v.number(),
  }).index("by_user", ["userId"]),
});
```

---

## 7. Success Metrics

### 7.1 Trial Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Day 7 Conversion Rate** | >25% | % of Day 7 completers who subscribe |
| **"Felt Understood" Rating** | >8/10 | Exit survey |
| **Profile Confidence Score** | >70% | System metric on Day 7 |
| **Aha Moment Achievement** | >80% | User confirmation of insight accuracy |
| **Day 3 Retention** | >40% | Return rate |
| **Day 7 Completion** | >25% | Finish 7-day journey |

### 7.2 North Star

**"This Is Me" Rate:** Percentage of Day 7 users who rate their profile as "accurate" or "very accurate"

**Target:** >80%

---

## 8. Implementation Phases

### Phase 1: Trial Foundation (Weeks 1-2)
- [ ] Expo project with Convex
- [ ] Clerk auth integration
- [ ] Core schema deployment
- [ ] Day 1 conversation flow
- [ ] Basic extraction agent

### Phase 2: Trial Complete (Weeks 3-4)
- [ ] Days 2-7 flows
- [ ] Profile building with Bayesian updates
- [ ] Insight delivery system
- [ ] Conversion triggers
- [ ] Push notifications

### Phase 3: Conversion + Day 7 (Weeks 5-6)
- [ ] Full profile reveal UX
- [ ] Shareable card generation
- [ ] Stripe integration
- [ ] Paywall flow
- [ ] Journey preview

### Phase 4: Journey MVP (Weeks 7-8)
- [ ] Post-conversion onboarding
- [ ] Deep excavation flows
- [ ] Skill tree (basic)
- [ ] Beta launch

---

## 9. Open Questions

| Question | Impact | Resolution Path |
|----------|--------|-----------------|
| Pricing ($9.99 vs $14.99 vs $19.99/mo) | Conversion rate | A/B test in beta |
| App name (Life OS vs Unfuck Your Life) | Branding, App Store | User research |
| HEXACO vs Big Five for MVP | Development speed | Start HEXACO, fallback Big Five if needed |
| Journey length (30-day vs 90-day) | Retention, content | Test with beta users |

---

*This document is the definitive source of truth for Life OS architecture.*
*Last updated: 2026-01-13*
