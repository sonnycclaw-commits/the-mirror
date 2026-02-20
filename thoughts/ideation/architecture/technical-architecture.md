# Life OS Technical Architecture

**Version:** 1.0  
**Date:** 2026-01-13  
**Author:** Architect Agent (Opus 4.5)  
**Status:** Draft - Synthesized from Research

---

## Executive Summary

Life OS is a psychometric coaching application that builds a living, evolving profile of users through natural conversation. Unlike static personality tests (16Personalities) or gamified habit trackers (Habitica), Life OS uses AI to continuously extract psychometric signals, maintain Bayesian belief states about user traits, and discover emergent skills and blockers.

This architecture document synthesizes research on market opportunity, Convex database patterns, Claude structured outputs, and emergent skill systems into a cohesive technical blueprint.

**Core Innovation:** "Duolingo for Self-Discovery" - micro-assessments embedded in conversation that accumulate into accurate psychological profiles over time.

---

## 1. Tech Stack Recommendation

### 1.1 Stack Overview

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Mobile** | React Native + Expo | Cross-platform iOS/Android from single codebase; 95% code share |
| **Web** | Next.js 14+ | Dashboard, admin, SEO landing pages |
| **Backend** | Convex | Real-time by default, TypeScript-native, built-in Agent component |
| **AI** | Claude API (Anthropic) | Structured outputs for reliable extraction, best reasoning for coaching |
| **Auth** | Clerk | Seamless Expo + Web integration, social login |
| **Styling** | Tamagui (mobile), Tailwind (web) | Cross-platform design system |
| **State** | Convex subscriptions | No Redux/Zustand needed - queries auto-update |

### 1.2 Why Convex Over Supabase

| Factor | Convex | Supabase | Decision |
|--------|--------|----------|----------|
| **Real-time** | Native, automatic, <50ms | WAL-based, 100-200ms | Convex - coaching needs instant feedback |
| **TypeScript** | First-class, schema to UI | SDK available, SQL-primary | Convex - reduce context switching |
| **AI Integration** | Dedicated Agent component | Build yourself | Convex - thread management built-in |
| **Vector Search** | Built-in, millions supported | pgvector, mature | Tie - both capable |
| **SQL Escape** | None | Full PostgreSQL | Supabase - but not needed for MVP |
| **Mobile** | Official Expo templates | More setup | Convex |

**Verdict:** Convex for MVP. If complex analytics needed later, export to analytics layer.

### 1.3 Why Structured Outputs Over Function Calling

| Factor | Structured Outputs | Function Calling |
|--------|-------------------|------------------|
| **Guarantee** | JSON schema compliance guaranteed | No schema guarantee |
| **Use Case** | Data extraction (psychometrics) | External actions (tool use) |
| **Implementation** | `response_format` parameter | Tool definitions |
| **Reliability** | No parsing failures | Can return unexpected shapes |

**Verdict:** Use structured outputs for signal extraction (Excavation Agent), function calling for agent tools.

### 1.4 Why Bayesian Updates Over Simple Averaging

| Factor | Bayesian | Simple Average |
|--------|----------|----------------|
| **Uncertainty** | Explicit confidence (alpha, beta) | Hidden |
| **Evidence Weight** | Recent + high-confidence weighted more | All equal |
| **Contradiction Handling** | Increases uncertainty | Smooths over |
| **Decay** | Natural via prior regression | Must implement manually |
| **Interpretability** | "70% confident in 0.6 score" | "Score is 0.6" |

**Verdict:** Bayesian Knowledge Tracing enables showing users our confidence level and handles the "state vs trait" problem (single observations vs stable patterns).

### 1.5 Why Emergent Skills Over Predefined Taxonomy

| Factor | Emergent | Predefined |
|--------|----------|------------|
| **Coverage** | Unlimited, personalized | Fixed set |
| **Cold Start** | Extract from conversation | User must categorize |
| **Maintenance** | Self-organizing | Expert curation needed |
| **Motivation** | Discovery is engaging | Checkbox feeling |
| **Blockers** | First-class concept | Usually ignored |

**Verdict:** Start with pure emergence, optionally map to O*NET/ESCO later for career features.

---

## 2. Convex Schema Design

### 2.1 Complete Schema (TypeScript)

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ============================================================
  // USER & AUTHENTICATION
  // ============================================================
  
  users: defineTable({
    // External auth provider ID (Clerk)
    externalId: v.string(),
    email: v.string(),
    name: v.string(),
    avatarUrl: v.optional(v.string()),
    
    // Timestamps
    createdAt: v.number(),
    lastActiveAt: v.number(),
    
    // Onboarding
    onboardingComplete: v.boolean(),
    onboardingStep: v.optional(v.string()),
    
    // Engagement metrics
    totalSessions: v.number(),
    totalInteractions: v.number(),
    currentStreak: v.number(),
    longestStreak: v.number(),
    lastSessionAt: v.optional(v.number()),
  })
    .index("by_external_id", ["externalId"])
    .index("by_email", ["email"]),

  // ============================================================
  // PSYCHOMETRIC PROFILES (Bayesian)
  // ============================================================
  
  psychometricProfiles: defineTable({
    userId: v.id("users"),
    
    // Big Five dimensions with Bayesian parameters
    // Each dimension stores: estimate, alpha, beta, confidence
    bigFive: v.object({
      openness: v.object({
        estimate: v.number(),      // 0-1 current belief
        alpha: v.number(),         // Positive evidence count
        beta: v.number(),          // Negative evidence count
        lastUpdated: v.number(),
        evidenceCount: v.number(),
      }),
      conscientiousness: v.object({
        estimate: v.number(),
        alpha: v.number(),
        beta: v.number(),
        lastUpdated: v.number(),
        evidenceCount: v.number(),
      }),
      extraversion: v.object({
        estimate: v.number(),
        alpha: v.number(),
        beta: v.number(),
        lastUpdated: v.number(),
        evidenceCount: v.number(),
      }),
      agreeableness: v.object({
        estimate: v.number(),
        alpha: v.number(),
        beta: v.number(),
        lastUpdated: v.number(),
        evidenceCount: v.number(),
      }),
      neuroticism: v.object({
        estimate: v.number(),
        alpha: v.number(),
        beta: v.number(),
        lastUpdated: v.number(),
        evidenceCount: v.number(),
      }),
    }),
    
    // Self-Determination Theory needs (SDT)
    needSatisfaction: v.object({
      autonomy: v.object({
        satisfaction: v.number(),    // -1 to 1
        confidence: v.number(),      // 0-1
        lastUpdated: v.number(),
      }),
      competence: v.object({
        satisfaction: v.number(),
        confidence: v.number(),
        lastUpdated: v.number(),
      }),
      relatedness: v.object({
        satisfaction: v.number(),
        confidence: v.number(),
        lastUpdated: v.number(),
      }),
    }),
    
    // Ego development stage (Loevinger/Cook-Greuter)
    egoStage: v.optional(v.object({
      hypothesis: v.string(),        // Stage name
      confidence: v.number(),        // 0-1
      evidenceCount: v.number(),
      lastUpdated: v.number(),
    })),
    
    // Meta-profile stats
    assessmentReliability: v.number(),   // How consistent are responses
    engagementBaseline: v.number(),
    authenticityBaseline: v.number(),
    
    // Timestamps
    createdAt: v.number(),
    lastUpdated: v.number(),
    totalUpdates: v.number(),
  }).index("by_user", ["userId"]),

  // Historical snapshots for trend visualization
  profileSnapshots: defineTable({
    userId: v.id("users"),
    profileId: v.id("psychometricProfiles"),
    
    // Snapshot of key dimensions at this point
    snapshot: v.object({
      openness: v.number(),
      conscientiousness: v.number(),
      extraversion: v.number(),
      agreeableness: v.number(),
      neuroticism: v.number(),
      autonomy: v.number(),
      competence: v.number(),
      relatedness: v.number(),
    }),
    
    // Trigger for snapshot
    trigger: v.string(),  // "weekly", "milestone", "significant_change"
    snapshotAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_time", ["userId", "snapshotAt"]),

  // ============================================================
  // CONVERSATION & SESSIONS
  // ============================================================
  
  conversationSessions: defineTable({
    userId: v.id("users"),
    
    // Convex Agent thread reference
    threadId: v.string(),
    
    // Session metadata
    sessionType: v.string(),         // "daily_checkin", "deep_dive", "skill_focus"
    coachPersona: v.optional(v.string()),
    
    // Timing
    startedAt: v.number(),
    endedAt: v.optional(v.number()),
    messageCount: v.number(),
    
    // AI-extracted summary (populated at session end)
    summary: v.optional(v.string()),
    keyInsights: v.optional(v.array(v.string())),
    
    // Emotional arc
    startingSentiment: v.optional(v.number()),
    endingSentiment: v.optional(v.number()),
    
    // Skills touched
    skillsDiscussed: v.optional(v.array(v.id("skills"))),
    
    // Tags for filtering
    tags: v.optional(v.array(v.string())),
  })
    .index("by_user", ["userId"])
    .index("by_user_type", ["userId", "sessionType"])
    .index("by_user_time", ["userId", "startedAt"]),

  // Individual message extractions (supplements Agent storage)
  messageExtractions: defineTable({
    userId: v.id("users"),
    sessionId: v.id("conversationSessions"),
    messageIndex: v.number(),
    
    // The extraction result
    extraction: v.object({
      personalitySignals: v.optional(v.array(v.any())),
      motivationSignals: v.optional(v.array(v.any())),
      defenseSignals: v.optional(v.array(v.any())),
      beliefSignals: v.optional(v.array(v.any())),
      skillSignals: v.optional(v.array(v.any())),
      emotionalSignals: v.optional(v.array(v.any())),
      
      // Meta
      responseAuthenticity: v.number(),
      engagementLevel: v.number(),
      extractionConfidence: v.string(),
    }),
    
    // Processing state
    profileUpdated: v.boolean(),
    skillsUpdated: v.boolean(),
    
    createdAt: v.number(),
  })
    .index("by_session", ["sessionId"])
    .index("by_user", ["userId"]),

  // Vector embeddings for RAG context retrieval
  conversationEmbeddings: defineTable({
    userId: v.id("users"),
    sessionId: v.id("conversationSessions"),
    messageIndex: v.number(),
    
    content: v.string(),
    role: v.string(),                // "user" | "assistant"
    embedding: v.array(v.float64()), // 1536 for OpenAI, 1024 for others
    
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_session", ["sessionId"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["userId"],
    }),

  // ============================================================
  // EMERGENT SKILL TREE
  // ============================================================
  
  skills: defineTable({
    userId: v.id("users"),
    
    // Identity
    name: v.string(),
    aliases: v.array(v.string()),
    description: v.string(),
    
    // Emergence metadata
    emergenceType: v.string(),       // "explicit", "inferred", "clustered"
    discoveredAt: v.number(),
    
    // Assessment
    level: v.number(),               // 0-100 proficiency
    confidence: v.number(),          // 0-1 AI confidence
    decayRate: v.number(),           // How fast skill fades
    lastDemonstrated: v.number(),
    
    // Evidence count
    demonstrationCount: v.number(),
    
    // Category (emergent or assigned)
    category: v.optional(v.string()),
    
    // Status
    status: v.string(),              // "provisional", "confirmed", "decayed"
    
    // Embedding for semantic matching
    embedding: v.optional(v.array(v.float64())),
  })
    .index("by_user", ["userId"])
    .index("by_user_category", ["userId", "category"])
    .index("by_user_status", ["userId", "status"])
    .vectorIndex("by_skill_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["userId"],
    }),

  // Skill relationships (edges in the graph)
  skillEdges: defineTable({
    userId: v.id("users"),
    fromSkillId: v.id("skills"),
    toSkillId: v.id("skills"),
    
    // Relationship semantics
    edgeType: v.string(),            // "requires", "enables", "synergizes", "conflicts"
    strength: v.number(),            // 0-1
    bidirectional: v.boolean(),
    
    // Evidence
    confidence: v.number(),
    evidence: v.optional(v.string()),
    
    createdAt: v.number(),
  })
    .index("by_from", ["fromSkillId"])
    .index("by_to", ["toSkillId"])
    .index("by_user", ["userId"]),

  // Skill evidence trail
  skillEvidence: defineTable({
    skillId: v.id("skills"),
    userId: v.id("users"),
    
    // Source
    sourceType: v.string(),          // "conversation", "reflection", "action"
    sourceId: v.optional(v.string()),
    sessionId: v.optional(v.id("conversationSessions")),
    
    // Evidence content
    excerpt: v.string(),
    signalType: v.string(),          // "direct_claim", "demonstration", "implicit"
    
    // Impact
    confidenceImpact: v.number(),
    levelImpact: v.number(),
    
    createdAt: v.number(),
  })
    .index("by_skill", ["skillId"])
    .index("by_user", ["userId"]),

  // Skill blockers
  skillBlockers: defineTable({
    skillId: v.id("skills"),
    userId: v.id("users"),
    
    // Blocker details
    blockerType: v.string(),         // "external", "internal", "prerequisite", "resource", "fear", "past_failure"
    description: v.string(),
    
    // Evidence
    discoveredFrom: v.string(),
    excerpt: v.optional(v.string()),
    
    // Status
    status: v.string(),              // "active", "addressed", "dismissed"
    addressedAt: v.optional(v.number()),
    addressedHow: v.optional(v.string()),
    
    createdAt: v.number(),
  })
    .index("by_skill", ["skillId"])
    .index("by_user", ["userId"])
    .index("by_user_status", ["userId", "status"]),

  // Skill categories (emergent)
  skillCategories: defineTable({
    userId: v.id("users"),
    
    name: v.string(),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    
    emergent: v.boolean(),           // Was this discovered or predefined?
    parentCategory: v.optional(v.string()),
    
    createdAt: v.number(),
  })
    .index("by_user", ["userId"]),

  // ============================================================
  // GOALS & INTENTIONS
  // ============================================================
  
  goals: defineTable({
    userId: v.id("users"),
    
    // Goal content
    title: v.string(),
    description: v.optional(v.string()),
    
    // Goal type (SDT-aligned)
    goalType: v.string(),            // "outcome", "process", "identity"
    
    // Status
    status: v.string(),              // "active", "completed", "paused", "abandoned"
    
    // AI-extracted motivation
    whyItMatters: v.optional(v.string()),
    underlyingNeed: v.optional(v.string()),  // autonomy, competence, relatedness
    
    // Connections
    relatedSkillIds: v.optional(v.array(v.id("skills"))),
    blockedBy: v.optional(v.array(v.id("skillBlockers"))),
    
    // Progress
    progressPercent: v.optional(v.number()),
    milestones: v.optional(v.array(v.object({
      title: v.string(),
      completed: v.boolean(),
      completedAt: v.optional(v.number()),
    }))),
    
    // Timing
    createdAt: v.number(),
    targetDate: v.optional(v.number()),
    completedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_status", ["userId", "status"]),

  // Detected limiting beliefs
  limitingBeliefs: defineTable({
    userId: v.id("users"),
    
    // The belief
    beliefStatement: v.string(),     // Normalized form
    domain: v.string(),              // "self_worth", "capability", "deservingness", etc.
    
    // Detection
    expressionType: v.string(),      // "explicit", "implicit", "behavioral"
    confidence: v.number(),
    
    // Evidence
    evidenceExcerpts: v.array(v.string()),
    sessionIds: v.array(v.id("conversationSessions")),
    
    // Impact
    blocksGoals: v.optional(v.array(v.id("goals"))),
    blocksSkills: v.optional(v.array(v.id("skills"))),
    
    // Status
    awarenessLevel: v.string(),      // "unaware", "vaguely_aware", "aware_but_stuck", "ready_to_challenge"
    status: v.string(),              // "active", "challenged", "transformed"
    
    createdAt: v.number(),
    lastObserved: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_domain", ["userId", "domain"]),

  // ============================================================
  // AI PROCESSING & JOBS
  // ============================================================
  
  aiJobs: defineTable({
    userId: v.id("users"),
    
    // Job type
    jobType: v.string(),             // "extraction", "profile_update", "skill_clustering", "summary"
    
    // Status
    status: v.string(),              // "pending", "running", "completed", "failed"
    
    // Input/output
    input: v.optional(v.any()),
    output: v.optional(v.any()),
    error: v.optional(v.string()),
    
    // Timing
    createdAt: v.number(),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    
    // References
    sessionId: v.optional(v.id("conversationSessions")),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_user_type", ["userId", "jobType"]),

  // ============================================================
  // GAMIFICATION & ENGAGEMENT
  // ============================================================
  
  achievements: defineTable({
    userId: v.id("users"),
    
    achievementType: v.string(),     // "streak", "milestone", "discovery", "breakthrough"
    title: v.string(),
    description: v.string(),
    
    // Visual
    iconUrl: v.optional(v.string()),
    
    // Trigger
    triggeredBy: v.optional(v.string()),  // What earned this
    
    earnedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_type", ["userId", "achievementType"]),

  // Shareable insight cards ("Wrapped" style)
  insightCards: defineTable({
    userId: v.id("users"),
    
    // Card type
    cardType: v.string(),            // "weekly_wrap", "skill_discovery", "growth_moment"
    
    // Content
    title: v.string(),
    content: v.any(),                // Varies by card type
    
    // Timing
    periodStart: v.optional(v.number()),
    periodEnd: v.optional(v.number()),
    
    // Sharing
    shareableUrl: v.optional(v.string()),
    isPublic: v.boolean(),
    
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_type", ["userId", "cardType"]),
});
```

### 2.2 Schema Design Rationale

1. **Bayesian parameters in profile:** Each psychometric dimension stores alpha/beta for uncertainty quantification
2. **Separate extraction storage:** `messageExtractions` enables debugging and reprocessing
3. **Skills as first-class entities:** Not embedded in profile to allow rich querying and relationships
4. **Blockers as separate table:** Enables tracking resolution across time and linking to multiple skills
5. **Vector indexes on userId:** All semantic searches are user-scoped for privacy
6. **Evidence trails everywhere:** Support "why does it think this?" transparency

---

## 3. Agent Architecture

### 3.1 Multi-Agent System Diagram

```
                              ┌─────────────────────────────────────┐
                              │           USER MESSAGE               │
                              └─────────────────┬───────────────────┘
                                                │
                                                ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              ORCHESTRATOR AGENT                                  │
│  Responsibilities:                                                               │
│  • Route messages to appropriate specialist                                      │
│  • Manage conversation flow and topic transitions                                │
│  • Coordinate multi-agent workflows                                              │
│  • Handle error recovery and fallbacks                                           │
│  • Maintain session state                                                        │
└─────────────────────────────┬─────────────────┬─────────────────┬───────────────┘
                              │                 │                 │
           ┌──────────────────┘                 │                 └──────────────────┐
           │                                    │                                    │
           ▼                                    ▼                                    ▼
┌─────────────────────────┐        ┌─────────────────────────┐        ┌─────────────────────────┐
│   EXCAVATION AGENT      │        │    INQUIRY AGENT        │        │    COACH AGENT          │
│                         │        │                         │        │                         │
│ Input:                  │        │ Input:                  │        │ Input:                  │
│ • User message          │        │ • Profile summary       │        │ • User message          │
│ • Session context       │        │ • Profile update        │        │ • Profile context       │
│ • Profile summary       │        │ • Skill tree update     │        │ • Goals                 │
│ • Question asked        │        │ • Session state         │        │                         │
│                         │        │ • User energy           │        │ Output:                 │
│ Output:                 │        │                         │        │ • Coaching response     │
│ • ExtractionResponse    │        │ Output:                 │        │ • Suggested actions     │
│ • Follow-up opps        │        │ • Next question         │        │ • Encouragement         │
│ • Resistance flags      │        │ • Question purpose      │        │                         │
│                         │        │ • Information gain      │        │                         │
└───────────┬─────────────┘        └─────────────────────────┘        └─────────────────────────┘
            │
            │ ExtractionResponse
            ▼
┌─────────────────────────┐        ┌─────────────────────────┐
│    PROFILE AGENT        │        │   SKILL TREE AGENT      │
│                         │        │                         │
│ Input:                  │        │ Input:                  │
│ • Extraction            │        │ • Skill signals         │
│ • Current profile       │        │ • Current tree          │
│ • Session history       │        │ • User goals            │
│                         │        │                         │
│ Output:                 │        │ Output:                 │
│ • Beliefs updated       │        │ • Nodes updated         │
│ • Hypothesis changes    │        │ • Edges added           │
│ • Drift alerts          │        │ • Blockers identified   │
│ • Dimensions needing    │        │ • Growth edges found    │
│   clarity               │        │ • Practice schedule     │
└─────────────────────────┘        └─────────────────────────┘
```

### 3.2 Agent Responsibilities

#### Orchestrator Agent
- **Primary Function:** Traffic controller for the multi-agent system
- **Decides:** Which agent(s) to invoke based on user intent
- **Manages:** Conversation flow, topic transitions, session pacing
- **Handles:** Error recovery, timeout fallbacks, rate limiting

#### Excavation Agent
- **Primary Function:** Extract psychometric signals from user messages
- **Uses:** Claude structured outputs with comprehensive extraction schema
- **Extracts:** Personality, motivation, defenses, beliefs, skills, emotions
- **Returns:** Evidence-backed signals with confidence levels

#### Profile Agent  
- **Primary Function:** Maintain and update Bayesian belief states
- **Implements:** Bayesian Knowledge Tracing update algorithm
- **Handles:** Contradictory evidence, hypothesis promotion, drift detection
- **Returns:** What changed and what needs clarification

#### Skill Tree Agent
- **Primary Function:** Manage emergent skill graph
- **Implements:** Skill matching, clustering, relationship inference
- **Handles:** Blocker detection, growth edge identification, decay calculation
- **Returns:** Tree updates and practice recommendations

#### Inquiry Agent
- **Primary Function:** Decide what to ask next
- **Optimizes:** Information gain vs user energy
- **Considers:** Profile gaps, skill opportunities, emotional state
- **Returns:** Next question with purpose and alternatives

#### Coach Agent
- **Primary Function:** Deliver supportive coaching responses
- **Integrates:** Profile insights, skill context, goals
- **Maintains:** Therapeutic rapport without being therapy
- **Returns:** Personalized guidance and encouragement

### 3.3 Input/Output Contracts

```typescript
// ============================================================
// EXCAVATION AGENT CONTRACT
// ============================================================

interface ExcavationInput {
  userMessage: string;
  questionAsked: string;
  sessionContext: {
    sessionId: string;
    sessionType: string;
    messageCount: number;
    topicsDiscussed: string[];
    emotionalArc: number[];  // Sentiment over time
  };
  profileSummary: {
    topPersonalityTraits: string[];
    currentNeeds: string[];
    activeGoals: string[];
    recentSkills: string[];
  };
}

interface ExcavationOutput {
  // Signal arrays (see structured-outputs.md for full schemas)
  personalitySignals: PersonalitySignal[];
  motivationSignals: MotivationSignal[];
  defenseSignals: DefenseSignal[];
  beliefSignals: LimitingBeliefSignal[];
  skillSignals: SkillSignal[];
  emotionalSignals: EmotionalSignal[];
  
  // Meta-signals
  responseAuthenticity: number;    // 0-1
  engagementLevel: number;         // 0-1
  extractionConfidence: "high" | "medium" | "low" | "uncertain";
  
  // Conversation guidance
  followUpOpportunities: string[];
  resistanceDetected: boolean;
  topicToAvoid: string | null;
}

// ============================================================
// PROFILE AGENT CONTRACT
// ============================================================

interface ProfileUpdateInput {
  extraction: ExcavationOutput;
  currentProfile: PsychometricProfile;
  sessionHistory: ExcavationOutput[];  // This session's extractions
}

interface ProfileUpdateOutput {
  // Changes
  beliefsUpdated: BeliefUpdate[];
  hypothesisChanges: HypothesisChange[];
  patternsDetected: PatternDetection[];
  driftAlerts: DriftAlert[];
  
  // Summary for downstream agents
  profileSnapshot: ProfileSummary;
  
  // Recommendations
  dimensionsNeedingClarity: string[];
  contradictionsToResolve: string[];
}

interface BeliefUpdate {
  dimension: string;
  previousEstimate: number;
  newEstimate: number;
  previousConfidence: number;
  newConfidence: number;
  evidence: string;
}

// ============================================================
// SKILL TREE AGENT CONTRACT
// ============================================================

interface SkillTreeInput {
  skillSignals: SkillSignal[];
  currentTree: {
    skills: SkillNode[];
    edges: SkillEdge[];
    categories: Category[];
  };
  userGoals: Goal[];
  recentBlockers: Blocker[];
}

interface SkillTreeOutput {
  // Tree mutations
  skillsCreated: SkillNode[];
  skillsUpdated: SkillUpdate[];
  edgesAdded: SkillEdge[];
  blockersIdentified: Blocker[];
  
  // Growth recommendations
  growthEdges: GrowthEdge[];  // Ready-to-develop skills
  practiceRecommendations: PracticeRec[];
  decayWarnings: DecayWarning[];
  
  // Focus suggestions
  recommendedFocus: string[];
  prerequisiteGaps: string[];
}

interface GrowthEdge {
  skillId: string;
  skillName: string;
  currentLevel: number;
  potentialLevel: number;
  prerequisitesMet: boolean;
  blockers: Blocker[];
  unlocksSkills: string[];
}

// ============================================================
// INQUIRY AGENT CONTRACT
// ============================================================

interface InquiryInput {
  profileSummary: ProfileSummary;
  profileUpdate: ProfileUpdateOutput;
  skillTreeUpdate: SkillTreeOutput;
  sessionState: {
    messageCount: number;
    timeElapsed: number;
    topicsExhausted: string[];
    userEnergy: number;        // From emotional signals
    engagementTrend: "increasing" | "stable" | "decreasing";
  };
}

interface InquiryOutput {
  // Primary decision
  nextQuestion: string;
  questionPurpose: "clarify_dimension" | "explore_hypothesis" | "test_skill" | "address_blocker" | "deepen_rapport";
  targetDimension: string | null;
  
  // Rationale
  expectedSignalTypes: string[];
  informationGainEstimate: number;
  
  // Alternatives
  alternativeQuestions: Array<{
    question: string;
    purpose: string;
    tradeoff: string;
  }>;
  
  // Conversation management
  shouldTransitionTopic: boolean;
  suggestedTransition: string | null;
}
```

### 3.4 Agent Handoff Protocol

```typescript
// convex/actions/processMessage.ts

export const processUserMessage = action({
  args: {
    sessionId: v.id("conversationSessions"),
    userMessage: v.string(),
  },
  handler: async (ctx, { sessionId, userMessage }) => {
    // 1. Get session context
    const session = await ctx.runQuery(internal.sessions.get, { sessionId });
    const profile = await ctx.runQuery(internal.profiles.getForUser, { 
      userId: session.userId 
    });
    
    // 2. EXCAVATION: Extract signals (structured output)
    const excavationResult = await callExcavationAgent(ctx, {
      userMessage,
      questionAsked: session.lastQuestion,
      sessionContext: buildSessionContext(session),
      profileSummary: buildProfileSummary(profile),
    });
    
    // 3. Store extraction
    const extractionId = await ctx.runMutation(internal.extractions.store, {
      sessionId,
      extraction: excavationResult,
    });
    
    // 4. PROFILE UPDATE: Bayesian belief updates
    const profileUpdate = await callProfileAgent(ctx, {
      extraction: excavationResult,
      currentProfile: profile,
      sessionHistory: session.extractions,
    });
    
    // 5. Apply profile changes
    if (profileUpdate.beliefsUpdated.length > 0) {
      await ctx.runMutation(internal.profiles.applyUpdate, {
        userId: session.userId,
        update: profileUpdate,
      });
    }
    
    // 6. SKILL TREE UPDATE: Update skills in parallel
    const skillTreeUpdate = await callSkillTreeAgent(ctx, {
      skillSignals: excavationResult.skillSignals,
      currentTree: await ctx.runQuery(internal.skills.getTree, { 
        userId: session.userId 
      }),
      userGoals: await ctx.runQuery(internal.goals.getActive, { 
        userId: session.userId 
      }),
    });
    
    // 7. Apply skill changes
    if (skillTreeUpdate.skillsCreated.length > 0 || 
        skillTreeUpdate.skillsUpdated.length > 0) {
      await ctx.runMutation(internal.skills.applyUpdate, {
        userId: session.userId,
        update: skillTreeUpdate,
      });
    }
    
    // 8. INQUIRY: Decide next question
    const inquiryResult = await callInquiryAgent(ctx, {
      profileSummary: profileUpdate.profileSnapshot,
      profileUpdate,
      skillTreeUpdate,
      sessionState: buildSessionState(session, excavationResult),
    });
    
    // 9. COACH: Generate response with next question embedded
    const coachResponse = await callCoachAgent(ctx, {
      userMessage,
      extraction: excavationResult,
      nextQuestion: inquiryResult.nextQuestion,
      profileContext: profile,
    });
    
    // 10. Store and return
    await ctx.runMutation(internal.sessions.addMessage, {
      sessionId,
      role: "assistant",
      content: coachResponse,
      nextQuestion: inquiryResult.nextQuestion,
    });
    
    return {
      response: coachResponse,
      profileUpdated: profileUpdate.beliefsUpdated.length > 0,
      skillsUpdated: skillTreeUpdate.skillsCreated.length + 
                     skillTreeUpdate.skillsUpdated.length,
    };
  },
});
```

---

## 4. Data Flow Diagrams

### 4.1 User Input to Profile Update

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                         USER INPUT → PROFILE UPDATE                             │
└────────────────────────────────────────────────────────────────────────────────┘

User: "I've been stressed about this presentation. I keep putting it off. 
       Maybe I'm just not cut out for this."

                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           EXCAVATION AGENT                                       │
│  Structured Output Extraction                                                    │
│                                                                                  │
│  personalitySignals: [                                                           │
│    { dimension: "neuroticism", direction: "high", magnitude: 0.7 }              │
│    { dimension: "conscientiousness.self_discipline", direction: "low" }         │
│  ]                                                                               │
│                                                                                  │
│  motivationSignals: [                                                            │
│    { need: "competence", satisfaction: -0.6, type: "introjected" }              │
│  ]                                                                               │
│                                                                                  │
│  beliefSignals: [                                                                │
│    { belief: "I lack inherent capability", domain: "capability" }               │
│  ]                                                                               │
│                                                                                  │
│  skillSignals: [                                                                 │
│    { skill: "public_speaking", blockers: ["fear", "past_failure"] }             │
│  ]                                                                               │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ ExtractionResponse
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            PROFILE AGENT                                         │
│  Bayesian Belief Update                                                          │
│                                                                                  │
│  BEFORE:                          AFTER:                                         │
│  neuroticism: {                   neuroticism: {                                 │
│    estimate: 0.55,                  estimate: 0.58,  ← moved toward high        │
│    alpha: 12,                       alpha: 12.7,     ← evidence added            │
│    beta: 10,                        beta: 10,                                    │
│    confidence: 0.52                 confidence: 0.53 ← slightly more certain     │
│  }                                }                                              │
│                                                                                  │
│  competence_need: {               competence_need: {                             │
│    satisfaction: -0.2,              satisfaction: -0.35, ← frustration signal    │
│    confidence: 0.4                  confidence: 0.5      ← more confident        │
│  }                                }                                              │
│                                                                                  │
│  NEW HYPOTHESIS:                                                                 │
│  "Capability limiting belief" → status: EMERGING (2 signals)                    │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ ProfileUpdate
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         CONVEX DATABASE                                          │
│                                                                                  │
│  psychometricProfiles.update(userId, {                                          │
│    bigFive.neuroticism: { estimate: 0.58, alpha: 12.7, beta: 10, ... }         │
│    needSatisfaction.competence: { satisfaction: -0.35, confidence: 0.5 }        │
│  });                                                                             │
│                                                                                  │
│  limitingBeliefs.upsert(userId, {                                               │
│    beliefStatement: "I lack inherent capability for success",                   │
│    domain: "capability",                                                         │
│    confidence: 0.6,                                                              │
│    evidenceExcerpts: ["Maybe I'm just not cut out for this"]                    │
│  });                                                                             │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Signal Accumulation into Beliefs

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                      SIGNALS ACCUMULATING INTO BELIEFS                          │
└────────────────────────────────────────────────────────────────────────────────┘

SESSION 1           SESSION 3           SESSION 5           SESSION 8
    │                   │                   │                   │
    ▼                   ▼                   ▼                   ▼
┌─────────┐        ┌─────────┐        ┌─────────┐        ┌─────────┐
│Signal 1 │        │Signal 2 │        │Signal 3 │        │Signal 4 │
│Openness │        │Openness │        │Openness │        │Openness │
│HIGH     │        │HIGH     │        │MEDIUM   │        │HIGH     │
│conf: 0.3│        │conf: 0.7│        │conf: 0.5│        │conf: 0.8│
└────┬────┘        └────┬────┘        └────┬────┘        └────┬────┘
     │                  │                  │                  │
     │                  │                  │                  │
     └──────────────────┴──────────────────┴──────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        BAYESIAN BELIEF ACCUMULATION                              │
│                                                                                  │
│  Session 1: Prior (α=1, β=1) + Signal 1 (HIGH, 0.3)                             │
│             → α=1.3, β=1.0, estimate=0.57, confidence=0.10                      │
│                                                                                  │
│  Session 3: + Signal 2 (HIGH, 0.7)                                              │
│             → α=2.0, β=1.0, estimate=0.67, confidence=0.17                      │
│                                                                                  │
│  Session 5: + Signal 3 (MEDIUM, 0.5)  ← contradictory, increases uncertainty    │
│             → α=2.25, β=1.25, estimate=0.64, confidence=0.19                    │
│             Note: Variance increased slightly due to mixed signal               │
│                                                                                  │
│  Session 8: + Signal 4 (HIGH, 0.8)                                              │
│             → α=3.05, β=1.25, estimate=0.71, confidence=0.24                    │
│                                                                                  │
│  RESULT: HIGH OPENNESS with MODERATE CONFIDENCE                                  │
│          (Would need ~10 more consistent signals for HIGH confidence)           │
└─────────────────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        HYPOTHESIS STATUS TRANSITIONS                             │
│                                                                                  │
│  < 3 signals:  HYPOTHESIS     "Might be high openness"                          │
│  3-5 signals:  EMERGING       "Showing signs of high openness"                  │
│  6-10 signals: PROVISIONAL    "Likely high openness"                            │
│  10+ signals:  ESTABLISHED    "High openness" ← shown to user as trait          │
│  Contradictions: CONTESTED    "Mixed signals on openness"                       │
│                                                                                  │
│  Current: EMERGING (4 signals, 0.71 estimate, 0.24 confidence)                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Beliefs Triggering Skill Discovery

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                     BELIEFS TRIGGERING SKILL DISCOVERY                          │
└────────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────────────┐
                    │       PSYCHOMETRIC PROFILE           │
                    │                                       │
                    │  High Openness (ESTABLISHED)         │
                    │  High Conscientiousness (EMERGING)   │
                    │  Competence Need: FRUSTRATED         │
                    │  Growth Mindset: EMERGING            │
                    └─────────────────┬───────────────────┘
                                      │
                                      │ Profile triggers skill inference
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         SKILL INFERENCE RULES                                    │
│                                                                                  │
│  Rule 1: High Openness + mentions "reading" → Infer "learning agility"          │
│  Rule 2: Conscientiousness + mentions "deadlines" → Infer "time management"     │
│  Rule 3: Frustrated competence + specific domain → Identify skill gap           │
│  Rule 4: Growth mindset + challenge discussion → Boost skill potential          │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  EXAMPLE CONVERSATION EXCERPT:                                                   │
│                                                                                  │
│  User: "I love learning new programming languages. Just picked up Rust."        │
│                                                                                  │
│  SIGNALS EXTRACTED:                                                              │
│  ├─ Skill: "Programming" (demonstrated, confidence: 0.8)                        │
│  ├─ Skill: "Rust" (explicit claim, confidence: 0.6)                             │
│  └─ Skill: "Learning Agility" (inferred from openness + behavior)               │
│                                                                                  │
│  PROFILE MATCH:                                                                  │
│  High Openness → "loves learning" confirms openness trait                       │
│  → Bidirectional reinforcement                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          SKILL GRAPH UPDATE                                      │
│                                                                                  │
│  skills.create({                                                                 │
│    name: "Rust Programming",                                                     │
│    aliases: ["Rust", "Rust language"],                                           │
│    emergenceType: "explicit",                                                    │
│    level: 30,  // Just started                                                   │
│    confidence: 0.6,                                                              │
│    evidence: ["Just picked up Rust"]                                             │
│  });                                                                             │
│                                                                                  │
│  skillEdges.create({                                                             │
│    from: "Programming",                                                          │
│    to: "Rust Programming",                                                       │
│    type: "enables",                                                              │
│    strength: 0.9                                                                 │
│  });                                                                             │
│                                                                                  │
│  skills.update("Learning Agility", {                                             │
│    level: level + 5,  // Evidence of quick pickup                                │
│    evidence: [...existing, "Quick language adoption"]                            │
│  });                                                                             │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Real-time Patterns

### 5.1 Convex Subscriptions for Live Updates

```typescript
// ============================================================
// FRONTEND HOOKS - Auto-updating via Convex subscriptions
// ============================================================

// Profile dashboard - updates when AI processes new signals
function useProfileDashboard(userId: Id<"users">) {
  // These queries auto-rerun when data changes
  const profile = useQuery(api.profiles.get, { userId });
  const recentSnapshots = useQuery(api.profiles.snapshots, { 
    userId, 
    limit: 10 
  });
  const activeBeliefs = useQuery(api.beliefs.getActive, { userId });
  
  return { profile, recentSnapshots, activeBeliefs };
}

// Skill tree - updates when new skills emerge
function useSkillTree(userId: Id<"users">) {
  const skills = useQuery(api.skills.list, { userId });
  const edges = useQuery(api.skills.edges, { userId });
  const blockers = useQuery(api.blockers.getActive, { userId });
  const growthEdges = useQuery(api.skills.growthEdges, { userId });
  
  return { skills, edges, blockers, growthEdges };
}

// Live coaching session - messages stream in
function useCoachingSession(sessionId: Id<"conversationSessions">) {
  const messages = useQuery(api.sessions.messages, { sessionId });
  const sessionMeta = useQuery(api.sessions.get, { sessionId });
  const sendMessage = useMutation(api.sessions.send);
  
  return { messages, sessionMeta, sendMessage };
}
```

### 5.2 Real-time Update Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        REAL-TIME UPDATE ARCHITECTURE                             │
└─────────────────────────────────────────────────────────────────────────────────┘

        MOBILE APP                    CONVEX                     AI PROCESSING
            │                            │                            │
  User sends│message                     │                            │
            │─────────────►              │                            │
            │              │ mutation:   │                            │
            │              │ sessions.   │                            │
            │              │ send()      │                            │
            │              │             │                            │
            │              │─────────────┼───────────────────────────►│
            │              │             │ action: processUserMessage │
            │              │             │                            │
            │              │             │        Excavation          │
            │              │             │        ─────────►          │
            │              │             │                            │
            │              │◄────────────┼────────────────────────────│
            │              │ mutation:   │                            │
            │              │ profiles.   │                            │
            │              │ update()    │                            │
            │              │             │                            │
            │◄─────────────│ subscription│                            │
            │ profiles     │ pushed      │                            │
            │ query        │             │                            │
            │ auto-updates │             │                            │
            │              │             │                            │
            │              │◄────────────┼────────────────────────────│
            │              │ mutation:   │                            │
            │              │ skills.     │                            │
            │              │ create()    │                            │
            │              │             │                            │
            │◄─────────────│ subscription│                            │
            │ skills       │ pushed      │                            │
            │ query        │             │                            │
            │ auto-updates │             │                            │
            │              │             │                            │
  UI shows  │              │             │                            │
  new skill │              │             │                            │
  discovery!│              │             │                            │
            │              │             │                            │
```

### 5.3 Dashboard Update Pattern

```typescript
// ============================================================
// REAL-TIME DASHBOARD COMPONENT
// ============================================================

function ProfileDashboard({ userId }: { userId: Id<"users"> }) {
  // All of these auto-update when mutations run
  const profile = useQuery(api.profiles.get, { userId });
  const skills = useQuery(api.skills.list, { userId });
  const achievements = useQuery(api.achievements.recent, { userId, limit: 5 });
  
  if (!profile) return <Loading />;
  
  return (
    <View>
      {/* Big Five radar chart - animates when beliefs update */}
      <PersonalityRadar 
        openness={profile.bigFive.openness.estimate}
        conscientiousness={profile.bigFive.conscientiousness.estimate}
        extraversion={profile.bigFive.extraversion.estimate}
        agreeableness={profile.bigFive.agreeableness.estimate}
        neuroticism={profile.bigFive.neuroticism.estimate}
        // Confidence shown via opacity
        confidences={{
          openness: profile.bigFive.openness.confidence,
          // ...
        }}
      />
      
      {/* Skill tree - new nodes animate in */}
      <SkillTreeVisualization 
        skills={skills}
        onSkillPress={(skill) => navigate(`/skills/${skill._id}`)}
      />
      
      {/* Achievement toast - pops up on new achievements */}
      <AchievementToasts achievements={achievements} />
    </View>
  );
}

// The magic: when processUserMessage runs mutations, these components
// automatically re-render with new data. No polling, no manual refresh.
```

### 5.4 Streaming Chat Pattern

```typescript
// ============================================================
// STREAMING CHAT WITH LIVE UPDATES
// ============================================================

function CoachChat({ sessionId }: { sessionId: Id<"conversationSessions"> }) {
  const messages = useQuery(api.sessions.messages, { sessionId });
  const [streaming, setStreaming] = useState(false);
  const [input, setInput] = useState("");
  const sendMessage = useAction(api.coaching.sendMessage);
  
  const handleSend = async () => {
    if (!input.trim()) return;
    
    setStreaming(true);
    const userInput = input;
    setInput("");
    
    try {
      // Optimistically add user message to UI
      // (Convex handles real optimistic updates automatically)
      
      await sendMessage({
        sessionId,
        message: userInput,
      });
      
      // Response will appear via subscription automatically
    } finally {
      setStreaming(false);
    }
  };
  
  // Watch for profile/skill updates to show inline
  const recentExtractions = useQuery(api.extractions.recent, { 
    sessionId, 
    limit: 1 
  });
  
  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <MessageBubble 
            message={item}
            showExtraction={recentExtractions?.[0]?.messageId === item._id}
            extraction={recentExtractions?.[0]}
          />
        )}
        inverted
      />
      
      {streaming && <TypingIndicator />}
      
      <InputBar
        value={input}
        onChangeText={setInput}
        onSend={handleSend}
        disabled={streaming}
      />
    </View>
  );
}
```

---

## 6. API Design Patterns

### 6.1 Convex Function Organization

```
convex/
├── schema.ts                 # Database schema
├── _generated/               # Auto-generated types
│
├── auth/
│   ├── clerk.ts             # Clerk webhook handlers
│   └── utils.ts             # Auth utilities
│
├── users/
│   ├── queries.ts           # User queries
│   └── mutations.ts         # User mutations
│
├── profiles/
│   ├── queries.ts           # Profile reads
│   ├── mutations.ts         # Profile updates
│   └── bayesian.ts          # Bayesian update logic
│
├── sessions/
│   ├── queries.ts           # Session queries
│   ├── mutations.ts         # Message storage
│   └── agents.ts            # Convex Agent definitions
│
├── skills/
│   ├── queries.ts           # Skill tree queries
│   ├── mutations.ts         # Skill CRUD
│   ├── emergence.ts         # Skill discovery logic
│   └── clustering.ts        # Periodic clustering
│
├── coaching/
│   ├── orchestrator.ts      # Main message handler
│   ├── excavation.ts        # Signal extraction
│   ├── inquiry.ts           # Question generation
│   └── response.ts          # Coach response generation
│
├── insights/
│   ├── cards.ts             # Wrapped-style insights
│   └── achievements.ts      # Achievement triggers
│
└── internal/
    └── *.ts                 # Internal-only functions
```

### 6.2 Query Patterns

```typescript
// convex/profiles/queries.ts

// Simple query - auto-subscribes clients
export const get = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("psychometricProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
  },
});

// Computed query - derived data
export const getWithConfidenceBands = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const profile = await ctx.db
      .query("psychometricProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    
    if (!profile) return null;
    
    // Compute confidence intervals for visualization
    return {
      ...profile,
      bigFiveWithBands: Object.entries(profile.bigFive).reduce(
        (acc, [dimension, belief]) => ({
          ...acc,
          [dimension]: {
            ...belief,
            lowerBound: computeLowerBound(belief.alpha, belief.beta),
            upperBound: computeUpperBound(belief.alpha, belief.beta),
          },
        }),
        {}
      ),
    };
  },
});

// Paginated query
export const snapshots = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, { userId, limit = 10, cursor }) => {
    let query = ctx.db
      .query("profileSnapshots")
      .withIndex("by_user_time", (q) => q.eq("userId", userId))
      .order("desc");
    
    if (cursor) {
      query = query.filter((q) => q.lt(q.field("snapshotAt"), parseInt(cursor)));
    }
    
    const results = await query.take(limit + 1);
    const hasMore = results.length > limit;
    const items = hasMore ? results.slice(0, -1) : results;
    
    return {
      items,
      nextCursor: hasMore ? items[items.length - 1].snapshotAt.toString() : null,
    };
  },
});
```

### 6.3 Mutation Patterns

```typescript
// convex/profiles/mutations.ts

// Transactional update with validation
export const applyBayesianUpdate = mutation({
  args: {
    userId: v.id("users"),
    updates: v.array(v.object({
      dimension: v.string(),
      signalDirection: v.string(),  // "positive" | "negative"
      signalStrength: v.number(),
      signalConfidence: v.string(),
    })),
  },
  handler: async (ctx, { userId, updates }) => {
    const profile = await ctx.db
      .query("psychometricProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    
    if (!profile) throw new Error("Profile not found");
    
    // Apply Bayesian updates
    const updatedBigFive = { ...profile.bigFive };
    
    for (const update of updates) {
      const dimension = update.dimension as keyof typeof updatedBigFive;
      if (!(dimension in updatedBigFive)) continue;
      
      const current = updatedBigFive[dimension];
      const confidenceMultiplier = CONFIDENCE_WEIGHTS[update.signalConfidence];
      const effectiveStrength = update.signalStrength * confidenceMultiplier;
      
      if (update.signalDirection === "positive") {
        current.alpha += effectiveStrength;
      } else {
        current.beta += effectiveStrength;
      }
      
      current.estimate = current.alpha / (current.alpha + current.beta);
      current.lastUpdated = Date.now();
      current.evidenceCount += 1;
    }
    
    // Check for significant change → snapshot
    const significantChange = detectSignificantChange(
      profile.bigFive, 
      updatedBigFive
    );
    
    if (significantChange) {
      await ctx.db.insert("profileSnapshots", {
        userId,
        profileId: profile._id,
        snapshot: extractSnapshot(updatedBigFive),
        trigger: "significant_change",
        snapshotAt: Date.now(),
      });
    }
    
    // Update profile
    await ctx.db.patch(profile._id, {
      bigFive: updatedBigFive,
      lastUpdated: Date.now(),
      totalUpdates: profile.totalUpdates + 1,
    });
    
    return { updated: true, significantChange };
  },
});
```

### 6.4 Action Patterns (AI Calls)

```typescript
// convex/coaching/excavation.ts

export const extractSignals = action({
  args: {
    userMessage: v.string(),
    context: v.object({
      questionAsked: v.string(),
      sessionType: v.string(),
      profileSummary: v.any(),
    }),
  },
  handler: async (ctx, { userMessage, context }) => {
    const client = new Anthropic();
    
    // Use structured output for reliable extraction
    const response = await client.beta.messages.create({
      model: "claude-sonnet-4-5-20250514",
      max_tokens: 4096,
      betas: ["structured-outputs-2025-11-13"],
      system: EXCAVATION_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: formatExcavationPrompt(userMessage, context),
        },
      ],
      // Response guaranteed to match this schema
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "ExtractionResponse",
          schema: EXTRACTION_SCHEMA,
          strict: true,
        },
      },
    });
    
    // Parse guaranteed-valid JSON
    const extraction = JSON.parse(response.content[0].text);
    
    // Validate and enrich
    return {
      ...extraction,
      timestamp: Date.now(),
      model: response.model,
      usage: response.usage,
    };
  },
});

// System prompt for excavation
const EXCAVATION_SYSTEM_PROMPT = `You are a psychometric signal extraction system.
Your job is to analyze user messages and extract structured psychological signals.

For each message, identify:
1. Personality signals (Big Five dimensions and facets)
2. Motivation signals (SDT needs: autonomy, competence, relatedness)
3. Defense mechanisms and cognitive distortions
4. Limiting beliefs with their domains
5. Skill demonstrations or gaps
6. Emotional states

Always provide evidence quotes from the user's message to support each signal.
Rate your confidence in each extraction: high, medium, low, or uncertain.

Do NOT make up signals that aren't clearly indicated in the text.
When uncertain, mark confidence as "low" or "uncertain".`;
```

---

## 7. Key Technical Decisions

### 7.1 Decision Log

| Decision | Options Considered | Choice | Rationale |
|----------|-------------------|--------|-----------|
| **Backend** | Supabase, Firebase, Convex, Custom | **Convex** | Real-time native, TypeScript-first, Agent component for conversations |
| **Mobile Framework** | Flutter, SwiftUI+Kotlin, React Native | **React Native + Expo** | Code sharing with web, team familiarity, Convex templates |
| **AI Provider** | OpenAI, Anthropic, Open source | **Anthropic (Claude)** | Best structured outputs, nuanced reasoning for coaching |
| **Psychometric Framework** | Custom, Big Five only, Multi-framework | **Big Five + SDT + Ego** | Big Five for traits, SDT for motivation, Ego for development |
| **Belief Updates** | Simple averaging, EMA, Bayesian | **Bayesian (Beta-Binomial)** | Explicit uncertainty, handles contradictions, decay built-in |
| **Skill System** | Predefined taxonomy, Pure emergent, Hybrid | **Emergent-first** | Personalization, discovery motivation, avoid checklist feeling |
| **Auth** | Firebase Auth, Auth0, Clerk | **Clerk** | Best Expo + web integration, social login, webhook support |
| **Vector DB** | Pinecone, Convex built-in, pgvector | **Convex built-in** | Sufficient scale, no extra service, integrated |

### 7.2 Architecture Decision Records (ADRs)

#### ADR-001: Convex Over Supabase

**Context:** Need a backend that supports real-time updates, AI workflows, and mobile.

**Decision:** Use Convex as primary backend.

**Consequences:**
- (+) Native real-time subscriptions
- (+) TypeScript schema to frontend type safety
- (+) Agent component handles conversation threading
- (+) Built-in vector search
- (-) No SQL escape hatch for complex queries
- (-) Newer ecosystem, less community content
- (-) Vendor considerations (mitigated by open-source)

**Mitigation:** Export to analytics layer (BigQuery) if complex psychometric correlations needed.

---

#### ADR-002: Bayesian Knowledge Tracing for Profiles

**Context:** Need to track profile dimensions with uncertainty and handle contradictory evidence.

**Decision:** Use Beta-Binomial Bayesian model for each profile dimension.

**Consequences:**
- (+) Explicit confidence levels (alpha + beta → certainty)
- (+) Contradictory evidence increases uncertainty (correct behavior)
- (+) Natural decay via prior regression
- (+) Evidence count visible (transparency)
- (-) More complex than simple averaging
- (-) Need to explain confidence to users

**Implementation:**
```typescript
// Bayesian update for a dimension
function updateBelief(current: BeliefState, signal: Signal): BeliefState {
  const weight = CONFIDENCE_WEIGHTS[signal.confidence] * signal.strength;
  
  if (signal.direction === "positive") {
    return { ...current, alpha: current.alpha + weight };
  } else {
    return { ...current, beta: current.beta + weight };
  }
}
```

---

#### ADR-003: Emergent Skills Over Predefined Taxonomy

**Context:** Skill trees in apps like Duolingo are predefined. We want personalized discovery.

**Decision:** Skills emerge from conversation analysis, with optional taxonomy mapping later.

**Consequences:**
- (+) Unlimited skill coverage per user
- (+) No cold-start categorization burden
- (+) Discovery is motivating ("You have a new skill!")
- (+) Blockers are first-class concepts
- (-) Less structured progress visualization initially
- (-) Potential skill duplication (mitigated by clustering)
- (-) Need semantic matching to avoid fragments

**Implementation:**
- New skill signals → provisional skills
- Periodic clustering merges similar provisional skills
- Confirmed skills shown in UI
- Optional: "Map to O*NET" for career features

---

#### ADR-004: Structured Outputs for Signal Extraction

**Context:** Need reliable JSON from Claude for psychometric signal extraction.

**Decision:** Use Claude's structured outputs (response_format with JSON schema).

**Consequences:**
- (+) Guaranteed schema compliance
- (+) No parsing failures
- (+) Type-safe in TypeScript
- (-) 50-200 token overhead per call
- (-) Some limitations (no recursion, no min/max)
- (-) Currently in beta

**Workarounds:**
- Post-response validation for numerical bounds
- Flatten nested schemas
- Budget token overhead in max_tokens

---

## 8. Open Questions and Risks

### 8.1 Open Questions

| Question | Impact | Proposed Resolution |
|----------|--------|---------------------|
| **Signal Validity:** How do we validate extracted signals match real psychology? | High | Periodic calibration against validated instruments (Big Five Inventory, SDT scales) |
| **Cultural Bias:** Linguistic markers vary by culture | Medium | Start English-only, research cross-cultural markers before expansion |
| **State vs Trait:** Single responses capture state, not stable traits | Medium | Bayesian accumulation over time; require 10+ signals for "established" status |
| **Gaming Detection:** Users may learn to give "good" responses | Medium | Monitor response authenticity signal; vary question phrasing |
| **Crisis Protocol:** How to handle disclosure of self-harm/abuse? | Critical | Red flag keywords trigger resources screen; no AI response to crisis content |
| **Profile Portability:** Should profiles be exportable? | Low | Design schema for export; user data ownership |
| **Therapeutic Boundary:** Where does coaching end and therapy begin? | Critical | Clear disclaimers; detect clinical signals; provide referral resources |

### 8.2 Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Convex scaling issues** | Low | High | Monitor bandwidth; implement caching; have Supabase migration path |
| **AI latency** | Medium | Medium | Streaming responses; optimistic UI updates; background processing |
| **Structured output beta issues** | Medium | Medium | Fallback to regex parsing; retry logic |
| **Vector search at scale** | Low | Medium | User-scoped indexes; evaluate Pinecone if millions per user |
| **Privacy breach** | Low | Critical | E2E encryption; minimize data retention; security audit |
| **Model drift** | Medium | Medium | Version pinning; periodic evaluation; A/B testing |

### 8.3 Product Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Low retention (70%+ churn)** | High | Critical | First-session insight delivery; streak mechanics; shareable cards |
| **Accuracy skepticism** | High | Medium | Transparency (show evidence); user correction loop |
| **Over-pathologizing** | Medium | High | Wellness framing; avoid clinical terminology; calibrate baselines |
| **Dependency concerns** | Medium | Medium | Promote real-world action; human coach escalation option |
| **Privacy backlash** | Medium | High | Local-first option; clear consent; data export |

---

## 9. Implementation Phases

### Phase 1: Foundation (Weeks 1-4)
- [ ] Convex project setup with schema
- [ ] Clerk authentication integration
- [ ] Basic user CRUD
- [ ] Expo app skeleton
- [ ] Convex Agent setup for conversations

### Phase 2: Core Loop (Weeks 5-8)
- [ ] Excavation Agent with structured outputs
- [ ] Profile Agent with Bayesian updates
- [ ] Basic profile storage and retrieval
- [ ] Chat interface with streaming
- [ ] First insight delivery (post-onboarding)

### Phase 3: Skill System (Weeks 9-12)
- [ ] Skill extraction from signals
- [ ] Provisional → confirmed skill flow
- [ ] Skill tree visualization (basic)
- [ ] Blocker detection and storage
- [ ] Growth edge identification

### Phase 4: Engagement (Weeks 13-16)
- [ ] Streak tracking
- [ ] Achievement system
- [ ] Weekly "Wrapped" style insights
- [ ] Shareable insight cards
- [ ] Push notifications

### Phase 5: Polish (Weeks 17-20)
- [ ] Advanced skill tree visualization
- [ ] Profile trends over time
- [ ] Goal tracking integration
- [ ] Performance optimization
- [ ] Beta testing

---

## 10. Appendix

### 10.1 Bayesian Update Mathematics

```
Prior: Beta(α, β)
Evidence: signal with confidence c and direction d

Update:
  if d = "positive": α' = α + c * strength
  if d = "negative": β' = β + c * strength

Estimate: E[θ] = α / (α + β)

Confidence: (α + β) / (α + β + prior_weight)

Variance: (α * β) / ((α + β)² * (α + β + 1))

Decay (time-based prior regression):
  α' = α * decay_factor + (1 - decay_factor) * prior_α
  β' = β * decay_factor + (1 - decay_factor) * prior_β
```

### 10.2 Extraction Schema (Simplified)

```typescript
const EXTRACTION_SCHEMA = {
  type: "object",
  properties: {
    personalitySignals: {
      type: "array",
      items: {
        type: "object",
        properties: {
          dimension: { enum: ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"] },
          direction: { enum: ["high", "low"] },
          magnitude: { type: "number" },
          confidence: { enum: ["high", "medium", "low", "uncertain"] },
          evidence: { type: "string" },
        },
        required: ["dimension", "direction", "magnitude", "confidence", "evidence"],
      },
    },
    // ... other signal types
    responseAuthenticity: { type: "number" },
    engagementLevel: { type: "number" },
    extractionConfidence: { enum: ["high", "medium", "low", "uncertain"] },
  },
  required: ["personalitySignals", "responseAuthenticity", "engagementLevel", "extractionConfidence"],
};
```

### 10.3 References

**Research Documents Synthesized:**
1. `opportunity-space.md` - Market analysis, competitive gaps, positioning
2. `convex-research.md` - Database patterns, schema design, real-time architecture
3. `structured-outputs.md` - Psychometric extraction schemas, Bayesian updates, agent contracts
4. `skill-emergence.md` - Emergent skill trees, blocker detection, visualization

**External Sources:**
- Convex Documentation: https://docs.convex.dev
- Claude Structured Outputs: https://docs.anthropic.com/structured-outputs
- Bayesian Knowledge Tracing: https://en.wikipedia.org/wiki/Bayesian_knowledge_tracing
- O*NET Skills Framework: https://www.onetonline.org
- Duolingo Algorithm: https://blog.duolingo.com/how-we-learn-how-you-learn

---

*Architecture document generated by Architect Agent. For updates, re-run synthesis with latest research.*
