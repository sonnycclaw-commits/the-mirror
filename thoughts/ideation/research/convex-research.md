# Research Report: Convex Database for Life OS

Generated: 2026-01-13

## Summary

Convex is a TypeScript-native, real-time reactive database platform that excels at building collaborative, AI-powered applications. For Life OS - a psychometric app requiring real-time sync, AI integration, and evolving user profiles - Convex offers compelling advantages: automatic real-time subscriptions, end-to-end TypeScript type safety, built-in vector search for embeddings, and a dedicated AI Agent component with conversation history management. The primary tradeoffs are vendor lock-in concerns (though now open-source) and some scaling edge cases around bandwidth and caching.

---

## 1. Convex Architecture Overview

### Core Concepts

**Document-Relational Database**: Convex uses tables with JSON-like documents. All documents have an auto-generated `_id` for creating relations between documents.

**Reactive Query Model**: Unlike traditional databases, Convex queries are TypeScript functions that run *inside* the database. When any dependency changes, queries automatically re-run and push updates to subscribed clients.

**Function Types**:
- **Queries**: Read-only, automatically subscribe clients to changes
- **Mutations**: Transactional writes, ACID-compliant
- **Actions**: Side effects (API calls, AI inference), can call queries/mutations

**Real-Time by Default**: No WebSocket setup, no state managers, no cache invalidation. Convex tracks all dependencies and pushes changes automatically.

### TypeScript Integration

```typescript
// Schema definition with full type safety
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    profile: v.object({
      bio: v.optional(v.string()),
      avatar: v.optional(v.string()),
    }),
  }).index("by_email", ["email"]),
});
```

Types are automatically generated and propagate from schema to queries to frontend components.

### Self-Hosting (2025+)

Convex backend is now open-source. Self-hosted version works with Neon, Fly.io, Vercel, Netlify, RDS, SQLite, Postgres. Docker deployment recommended.

---

## 2. Recommended Schema for Life OS

### Core Tables

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ============ USER & PROFILE ============
  users: defineTable({
    // Auth provider ID (Clerk, Auth.js, etc.)
    externalId: v.string(),
    email: v.string(),
    name: v.string(),
    createdAt: v.number(),
    lastActiveAt: v.number(),
    // Onboarding state
    onboardingComplete: v.boolean(),
    onboardingStep: v.optional(v.string()),
  })
    .index("by_external_id", ["externalId"])
    .index("by_email", ["email"]),

  // Living psychometric profile (evolves over time)
  psychometricProfiles: defineTable({
    userId: v.id("users"),
    // Current scores (updated by AI)
    scores: v.object({
      // Big Five or custom dimensions
      openness: v.optional(v.number()),
      conscientiousness: v.optional(v.number()),
      extraversion: v.optional(v.number()),
      agreeableness: v.optional(v.number()),
      neuroticism: v.optional(v.number()),
      // Custom Life OS dimensions
      selfAwareness: v.optional(v.number()),
      growthMindset: v.optional(v.number()),
      emotionalResilience: v.optional(v.number()),
    }),
    // Confidence per dimension (0-1)
    confidence: v.object({
      openness: v.optional(v.number()),
      conscientiousness: v.optional(v.number()),
      // ... etc
    }),
    lastUpdated: v.number(),
    updateCount: v.number(), // Track how many times profile has evolved
  }).index("by_user", ["userId"]),

  // Historical snapshots for trend analysis
  profileSnapshots: defineTable({
    userId: v.id("users"),
    profileId: v.id("psychometricProfiles"),
    scores: v.any(), // Copy of scores at this point
    snapshotAt: v.number(),
    trigger: v.string(), // "weekly", "milestone", "significant_change"
  })
    .index("by_user", ["userId"])
    .index("by_user_time", ["userId", "snapshotAt"]),

  // ============ CONVERSATIONS ============
  // Use Convex Agent component for thread management
  // This is for additional metadata/indexing
  conversationSessions: defineTable({
    userId: v.id("users"),
    threadId: v.string(), // Convex Agent thread ID
    sessionType: v.string(), // "daily_checkin", "coaching", "exploration"
    coachType: v.optional(v.string()), // Which specialist coach
    startedAt: v.number(),
    endedAt: v.optional(v.number()),
    // AI-extracted summary
    summary: v.optional(v.string()),
    // Key insights extracted
    insights: v.optional(v.array(v.string())),
    // Sentiment/emotional state
    overallSentiment: v.optional(v.number()),
    // Tags for filtering
    tags: v.optional(v.array(v.string())),
  })
    .index("by_user", ["userId"])
    .index("by_user_type", ["userId", "sessionType"])
    .index("by_user_time", ["userId", "startedAt"]),

  // Conversation messages with embeddings for RAG
  // (Supplement to Agent component's built-in storage)
  messageEmbeddings: defineTable({
    userId: v.id("users"),
    sessionId: v.id("conversationSessions"),
    messageId: v.string(), // Reference to Agent message
    content: v.string(), // Text content
    role: v.string(), // "user" | "assistant"
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

  // ============ SKILL TREE ============
  // AI-emergent skills, not predefined
  skills: defineTable({
    userId: v.id("users"),
    // AI-generated skill name
    name: v.string(),
    // AI-generated description
    description: v.string(),
    // Category (may be AI-assigned)
    category: v.optional(v.string()),
    // Current level (1-5 or continuous 0-100)
    level: v.number(),
    // Experience/progress within level
    experience: v.number(),
    // When skill was discovered/emerged
    discoveredAt: v.number(),
    // Last activity related to this skill
    lastActivityAt: v.number(),
    // Evidence supporting this skill
    evidenceCount: v.number(),
    // Embedding for semantic similarity
    embedding: v.optional(v.array(v.float64())),
  })
    .index("by_user", ["userId"])
    .index("by_user_category", ["userId", "category"])
    .index("by_user_level", ["userId", "level"])
    .vectorIndex("by_skill_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["userId"],
    }),

  // Skill relationships (edges in the tree)
  skillEdges: defineTable({
    userId: v.id("users"),
    fromSkillId: v.id("skills"),
    toSkillId: v.id("skills"),
    // Relationship type
    edgeType: v.string(), // "prerequisite", "synergy", "enables", "related"
    // AI confidence in this relationship
    confidence: v.number(),
    // Evidence for the relationship
    evidence: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_from", ["fromSkillId"])
    .index("by_to", ["toSkillId"])
    .index("by_user", ["userId"]),

  // Skill progress evidence (what triggered level-ups)
  skillEvidence: defineTable({
    skillId: v.id("skills"),
    userId: v.id("users"),
    // Source of evidence
    sourceType: v.string(), // "conversation", "reflection", "action", "assessment"
    sourceId: v.optional(v.string()), // Reference to source
    // What the user said/did
    content: v.string(),
    // AI assessment of skill demonstration
    assessment: v.string(),
    // Points awarded
    pointsAwarded: v.number(),
    createdAt: v.number(),
  })
    .index("by_skill", ["skillId"])
    .index("by_user", ["userId"]),

  // ============ GOALS & INTENTIONS ============
  goals: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    // Goal type
    goalType: v.string(), // "outcome", "process", "identity"
    // Status
    status: v.string(), // "active", "completed", "paused", "abandoned"
    // AI-extracted motivation
    whyItMatters: v.optional(v.string()),
    // Related skills
    relatedSkillIds: v.optional(v.array(v.id("skills"))),
    // Milestones
    milestones: v.optional(v.array(v.object({
      title: v.string(),
      completed: v.boolean(),
      completedAt: v.optional(v.number()),
    }))),
    // Progress tracking
    progressPercent: v.optional(v.number()),
    createdAt: v.number(),
    targetDate: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_status", ["userId", "status"]),

  // ============ AI PROCESSING STATE ============
  // Track AI background jobs
  aiJobs: defineTable({
    userId: v.id("users"),
    jobType: v.string(), // "profile_update", "skill_extraction", "summary"
    status: v.string(), // "pending", "running", "completed", "failed"
    input: v.optional(v.any()),
    output: v.optional(v.any()),
    error: v.optional(v.string()),
    createdAt: v.number(),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_user_type", ["userId", "jobType"]),
});
```

### Design Rationale

1. **Separate tables for evolving data**: `psychometricProfiles` vs `profileSnapshots` allows tracking evolution without document bloat

2. **Flat structure with relations**: Skills have separate `skillEdges` table rather than nested arrays (arrays limited to 8192 items, can't be indexed)

3. **Vector indexes for RAG**: `messageEmbeddings` and `skills` tables have vector indexes for semantic search

4. **User-scoped vector search**: `filterFields: ["userId"]` ensures vector searches are per-user

5. **Evidence trail**: `skillEvidence` table creates auditable history of how skills emerged

---

## 3. AI Integration Patterns

### Pattern 1: Real-Time Streaming with Agent Component

```typescript
// convex/agents.ts
import { Agent } from "@convex-dev/agents";
import { anthropic } from "@ai-sdk/anthropic";

export const lifeCoach = new Agent(components.agent, {
  name: "Life Coach",
  chat: anthropic.chat("claude-sonnet-4-20250514"),
  instructions: `You are a supportive life coach helping users develop self-awareness 
  and build meaningful skills. Extract psychometric insights from conversations.
  When you notice skill demonstrations, acknowledge them specifically.`,
  tools: {
    extractInsight,
    updateSkillProgress,
    logPsychometricObservation,
  },
});

// Start conversation with streaming
export const startCoachingSession = action({
  args: { 
    userId: v.id("users"),
    sessionType: v.string(),
    prompt: v.string(),
  },
  handler: async (ctx, { userId, sessionType, prompt }) => {
    // Create session record
    const sessionId = await ctx.runMutation(internal.sessions.create, {
      userId,
      sessionType,
    });

    // Create thread with user context
    const { threadId, thread } = await lifeCoach.createThread(ctx, {
      userId: userId, // For vector search filtering
    });

    // Stream response
    const result = await thread.generateText({
      prompt,
      onStepFinish: async (step) => {
        // Tool calls trigger background processing
        if (step.toolCalls) {
          for (const call of step.toolCalls) {
            await ctx.runMutation(internal.ai.logToolCall, {
              sessionId,
              toolName: call.toolName,
              args: call.args,
            });
          }
        }
      },
    });

    return { threadId, sessionId, text: result.text };
  },
});
```

### Pattern 2: Background AI Processing with Workflows

```typescript
// convex/workflows/profileUpdate.ts
import { workflow } from "@convex-dev/workflow";
import { v } from "convex/values";

export const updatePsychometricProfile = workflow.define({
  args: {
    userId: v.id("users"),
    sessionId: v.id("conversationSessions"),
  },
  handler: async (ctx, { userId, sessionId }) => {
    // Step 1: Get recent conversations
    const recentMessages = await ctx.runQuery(
      internal.messages.getRecent,
      { userId, limit: 50 }
    );

    // Step 2: Get current profile
    const currentProfile = await ctx.runQuery(
      internal.profiles.get,
      { userId }
    );

    // Step 3: AI analysis (action - can call external APIs)
    const analysis = await ctx.runAction(
      internal.ai.analyzeForPsychometrics,
      { messages: recentMessages, currentProfile }
    );

    // Step 4: Update profile if significant changes
    if (analysis.significantChange) {
      // Take snapshot first
      await ctx.runMutation(internal.profiles.snapshot, { userId });
      
      // Update profile
      await ctx.runMutation(internal.profiles.update, {
        userId,
        scores: analysis.newScores,
        confidence: analysis.confidence,
      });
    }

    // Step 5: Extract any new skills
    if (analysis.newSkills.length > 0) {
      await ctx.runMutation(internal.skills.createBatch, {
        userId,
        skills: analysis.newSkills,
      });
    }

    return { updated: analysis.significantChange };
  },
});
```

### Pattern 3: Structured Output Storage

```typescript
// convex/ai/extractInsights.ts
import Anthropic from "@anthropic-ai/sdk";

export const extractInsights = action({
  args: {
    sessionId: v.id("conversationSessions"),
    messages: v.array(v.object({
      role: v.string(),
      content: v.string(),
    })),
  },
  handler: async (ctx, { sessionId, messages }) => {
    const client = new Anthropic();

    // Use Claude's structured output
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Analyze this conversation and extract structured insights:
          
          ${JSON.stringify(messages)}
          
          Return JSON with:
          - summary: string (2-3 sentences)
          - insights: string[] (key realizations)
          - skillDemonstrations: { skillName: string, evidence: string, confidence: number }[]
          - psychometricObservations: { dimension: string, observation: string, direction: "increase" | "decrease" | "stable" }[]
          - suggestedFollowups: string[]`
        }
      ],
    });

    const insights = JSON.parse(response.content[0].text);

    // Store structured output
    await ctx.runMutation(internal.sessions.updateInsights, {
      sessionId,
      summary: insights.summary,
      insights: insights.insights,
    });

    // Process skill demonstrations
    for (const skill of insights.skillDemonstrations) {
      await ctx.runMutation(internal.skills.recordEvidence, {
        sessionId,
        ...skill,
      });
    }

    return insights;
  },
});
```

### Pattern 4: Vector Search for Context

```typescript
// convex/search.ts
export const searchUserMemories = action({
  args: {
    userId: v.id("users"),
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { userId, query, limit = 10 }) => {
    // Generate embedding for query
    const embedding = await generateEmbedding(query);

    // Vector search with user filter
    const results = await ctx.vectorSearch("messageEmbeddings", "by_embedding", {
      vector: embedding,
      limit,
      filter: (q) => q.eq("userId", userId),
    });

    // Fetch full documents
    const messages = await Promise.all(
      results.map((r) => ctx.runQuery(internal.messages.get, { id: r._id }))
    );

    return messages;
  },
});
```

---

## 4. Convex vs Supabase Decision Matrix

| Dimension | Convex | Supabase | Winner for Life OS |
|-----------|--------|----------|-------------------|
| **Real-Time** | Native, automatic subscriptions. Sub-50ms latency at 5K connections. No setup required. | Postgres Changes (WAL-based). 100-200ms p99 under load. Requires configuration. | **Convex** |
| **TypeScript** | First-class. Schema to query to frontend type-safe. AI generates accurate code. | SDK available but SQL-primary. Types via code generation. | **Convex** |
| **Vector Search** | Built-in vector indexes. Millions of vectors. Consistent reads. Actions-only. | pgvector extension. Mature, 1.6M+ embeddings proven. RLS for permissions. | **Tie** (both capable) |
| **Pricing** | Free: 1M function calls/mo, 6 team members. Starter: pay-as-you-go. Pro: $25/mo. | Free: 500MB storage, 2 projects. Pro: $25/mo. | **Tie** |
| **Maturity** | Newer (2022+). Growing ecosystem. Recently open-sourced. | Established (2020+). Large community. Fully open-source. | **Supabase** |
| **SQL Access** | No SQL - TypeScript only. Document queries. | Full PostgreSQL with SQL. Complex analytics. | **Supabase** |
| **AI Agent Support** | Dedicated Agent component with threads, tools, streaming. | Generic - build yourself or use third-party. | **Convex** |
| **Mobile** | React Native + Expo well-supported. Official templates. | React Native supported. More setup required. | **Convex** |
| **Vendor Lock-in** | Backend now open-source. Self-host option. Document model. | PostgreSQL standard. Easy migration. No lock-in. | **Supabase** |
| **Background Jobs** | Built-in scheduler, workflows, cron. Durable execution. | pg_cron, Edge Functions. Less integrated. | **Convex** |
| **Auth** | Integrates Clerk, Auth.js, Better Auth. | Built-in Supabase Auth. GoTrue-based. | **Tie** |

### Summary

| Use Case | Recommendation |
|----------|----------------|
| Real-time coaching conversations | Convex (Agent component) |
| Complex psychometric analytics | Supabase (SQL power) |
| Mobile-first with live sync | Convex |
| Large-scale vector search (billions) | Supabase + pgvector (or Pinecone) |
| Fast iteration, TypeScript team | Convex |
| Need SQL escape hatch | Supabase |

**For Life OS specifically**: Convex is the better fit because:
1. Real-time is core to coaching conversations
2. Agent component handles conversation history natively
3. TypeScript-native aligns with React Native development
4. Built-in workflows handle AI processing pipelines

---

## 5. Limitations and Workarounds

### Hard Limits

| Limit | Value | Impact on Life OS | Workaround |
|-------|-------|-------------------|------------|
| Document size | 1 MB | Conversation summaries OK, not raw transcripts | Store long content in file storage |
| Array elements | 8,192 | Skill lists OK, not all messages | Use separate tables with references |
| Object entries | 1,024 | Profile dimensions OK | Flatten or use multiple documents |
| Nesting depth | 16 levels | Should be fine | Keep schemas flatter |
| Vector dimensions | Configurable | Match your embedding model | Use 1536 (OpenAI) or 1024 (others) |

### Known Issues

1. **Bandwidth under heavy real-time**
   - Issue: Listing elements with pagination can send full lists on any update
   - Workaround: Use denormalized counts, implement client-side caching
   - Impact: Monitor bandwidth on dashboard pages showing many items

2. **Vector search in actions only**
   - Issue: Can't do vector search in queries (only actions)
   - Workaround: Use actions for search, cache results if needed
   - Impact: Slightly more complex patterns for RAG

3. **No SQL escape hatch**
   - Issue: Complex analytics queries (correlations, aggregations) harder
   - Workaround: Export to analytics DB, use scheduled jobs for pre-computation
   - Impact: May need separate analytics pipeline for psychometric trends

4. **Optimistic concurrency conflicts**
   - Issue: High-frequency updates to same document can conflict
   - Workaround: Use Convex counter components, batch updates
   - Impact: Design skill XP updates to batch, not increment per-message

### When NOT to Use Convex

- **Heavy analytics/SQL needs**: If you need complex JOINs, GROUP BY, window functions
- **Billions of vectors**: Convex supports millions; for billions, use dedicated vector DB
- **PostgreSQL requirements**: If you need specific Postgres features (PostGIS, full-text search with ranking)
- **Zero vendor lock-in priority**: Despite open-source, still different data model than Postgres

### Migration Path If You Outgrow

1. **Export data**: Convex supports data export
2. **Schema conversion**: Document model maps to normalized tables
3. **Move to**: Supabase (for Postgres), PlanetScale (for MySQL), custom solution
4. **Keep Convex for**: Real-time features while moving analytics elsewhere

---

## 6. Code Snippets / Examples

### React Hook for Real-Time Profile

```typescript
// hooks/useProfile.ts
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useProfile(userId: Id<"users">) {
  const profile = useQuery(api.profiles.get, { userId });
  const skills = useQuery(api.skills.listByUser, { userId, limit: 20 });
  const recentSessions = useQuery(api.sessions.recent, { userId, limit: 5 });

  return {
    profile,
    skills,
    recentSessions,
    isLoading: profile === undefined,
  };
}

// Automatically updates when AI processes new insights
```

### Expo + Convex Setup

```typescript
// app/_layout.tsx (Expo)
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(
  process.env.EXPO_PUBLIC_CONVEX_URL!,
  { unsavedChangesWarning: false }
);

export default function RootLayout() {
  return (
    <ConvexProvider client={convex}>
      <Stack />
    </ConvexProvider>
  );
}
```

### Streaming Chat Component

```typescript
// components/CoachChat.tsx
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

export function CoachChat({ userId, threadId }) {
  const sendMessage = useAction(api.agents.sendMessage);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  const handleSend = async () => {
    setStreaming(true);
    try {
      await sendMessage({
        userId,
        threadId,
        message: input,
        // Convex Agent handles streaming via websocket
      });
    } finally {
      setStreaming(false);
      setInput("");
    }
  };

  // Messages auto-update via useQuery subscription
  const messages = useQuery(api.threads.messages, { threadId });

  return (
    <View>
      <MessageList messages={messages} />
      <Input value={input} onChangeText={setInput} />
      <Button onPress={handleSend} disabled={streaming}>
        Send
      </Button>
    </View>
  );
}
```

---

## 7. Recommendation

### Verdict: Use Convex for Life OS

**Confidence: High**

### Rationale

1. **Real-time is essential**: Life OS is a coaching app where users expect immediate feedback. Convex's automatic subscriptions eliminate the infrastructure complexity of WebSockets.

2. **AI Agent component is purpose-built**: The Convex Agent handles exactly what Life OS needs:
   - Persistent conversation threads
   - Automatic context injection
   - Tool calling for skill extraction
   - Streaming over websockets

3. **TypeScript-native development**: With React Native + Expo, staying in TypeScript from schema to UI reduces context switching and catches type errors early.

4. **Sufficient for psychometrics**: While not SQL, Convex can handle:
   - Multi-dimensional scores (nested objects)
   - Time-series snapshots (indexed by user + time)
   - Skill tree relationships (edge tables)

5. **Vector search built-in**: No need for a separate Pinecone setup. Millions of embeddings per user is feasible.

6. **Mobile-first support**: Official Expo templates, secure storage for auth, proven patterns.

### Suggested Architecture

```
Life OS Architecture with Convex
================================

Mobile App (Expo)          Web Dashboard (Next.js)
        |                           |
        +---------> Convex <--------+
                      |
    +--------+--------+--------+--------+
    |        |        |        |        |
 Queries  Mutations Actions  Workflows  Agent
    |        |        |        |        |
    +--------+--------+--------+--------+
                      |
              Convex Database
              (Documents + Vector Indexes)
                      |
              +-------+-------+
              |               |
         User Data      AI Processing
         - Profiles     - Claude API
         - Skills       - Embeddings
         - Sessions     - Workflows
```

### Risk Mitigations

1. **Analytics limitation**: Plan for a separate analytics layer (export to BigQuery/Databricks) if complex psychometric correlations needed

2. **Vector scale**: If approaching millions of embeddings, evaluate Pinecone integration or Supabase pgvector for overflow

3. **Vendor risk**: Convex is now open-source. Document schema patterns to enable migration if needed.

### Next Steps

1. Set up Convex project with schema above
2. Implement Agent component for coaching
3. Build skill extraction pipeline with Claude structured output
4. Create React Native screens with real-time hooks
5. Add vector search for RAG context

---

## Sources

### Convex Documentation & Official Resources
- [Convex Overview](https://docs.convex.dev/understanding/)
- [Convex Database](https://docs.convex.dev/database)
- [Convex Schemas](https://docs.convex.dev/database/schemas)
- [Convex Data Types](https://docs.convex.dev/database/types)
- [Convex Limits](https://docs.convex.dev/production/state/limits)
- [Convex Vector Search](https://docs.convex.dev/search/vector-search)
- [Convex AI Agents](https://docs.convex.dev/agents)
- [Convex React Native Quickstart](https://docs.convex.dev/quickstart/react-native)
- [Convex Pricing](https://www.convex.dev/pricing)
- [Convex FAQ](https://www.convex.dev/faq)
- [Convex vs Supabase (Official)](https://www.convex.dev/compare/supabase)

### Convex Technical Blog (Stack)
- [AI Chat with Convex Vector Search](https://stack.convex.dev/ai-chat-with-convex-vector-search)
- [AI Agents with Built-in Memory](https://stack.convex.dev/ai-agents)
- [Background Job Management](https://stack.convex.dev/background-job-management)
- [Queries that Scale](https://stack.convex.dev/queries-that-scale)
- [Relationship Structures](https://stack.convex.dev/relationship-structures-let-s-talk-about-schemas)
- [Convex Ents for Relationships](https://stack.convex.dev/ents)
- [React Native Realtime Chat](https://stack.convex.dev/react-native-realtime-chat-expo)
- [How We Horizontally Scaled Function Execution](https://stack.convex.dev/horizontally-scaling-functions)
- [Why Choose Convex Database](https://stack.convex.dev/why-choose-convex-database-for-backend)

### GitHub Resources
- [Convex Backend (Open Source)](https://github.com/get-convex/convex-backend)
- [Convex Agent Component](https://github.com/get-convex/agent)
- [Embeddings in Convex Example](https://github.com/ianmacartney/embeddings-in-convex)
- [Turbo Expo Next.js Clerk Convex Monorepo](https://github.com/get-convex/turbo-expo-nextjs-clerk-convex-monorepo)
- [React Native Chat Convex Example](https://github.com/Galaxies-dev/react-native-chat-convex)

### Comparison Articles
- [Convex vs Supabase 2025 - Makers' Den](https://makersden.io/blog/convex-vs-supabase-2025)
- [Convex vs Supabase Definitive Comparison 2026 - ScratchDB](https://scratchdb.com/compare/convex-vs-supabase/)
- [Convex DB Deep Technical Dive - JavaScript Plain English](https://javascript.plainenglish.io/convex-db-a-deep-technical-dive-into-its-core-and-how-it-outpaces-supabase-a01b3d56796f)
- [Convex vs Supabase - UI Bakery](https://uibakery.io/blog/convex-vs-supabase)
- [Backend-As-A-Service Enterprise Ready - Senacor Blog](https://senacor.blog/is-backend-as-a-service-baas-enterprise-ready-a-hands-on-review-of-convex-and-supabase/)
- [Supabase vs Convex Comparison - Newline](https://www.newline.co/@malithmcr/supabase-vs-convex-a-comprehensive-comparison-of-backend-as-a-service-providers--2a518d03)

### Supabase (for comparison)
- [Supabase AI & Vectors](https://supabase.com/docs/guides/ai)
- [pgvector Extension](https://supabase.com/docs/guides/database/extensions/pgvector)
- [RAG with Permissions](https://supabase.com/docs/guides/ai/rag-with-permissions)

### Pricing Resources
- [ConvexDB Pricing Guide - Airbyte](https://airbyte.com/data-engineering-resources/convexdb-pricing)
- [Convex Starter Plan Announcement](https://news.convex.dev/introducing-the-new-convex-starter-plan-pay-for-only-what-you-need/)
- [Making Convex Plans More Friendly](https://news.convex.dev/making-convex-plans-more-friendly/)

### LangChain Integration
- [Convex Vector Store - LangChain JS](https://js.langchain.com/docs/integrations/vectorstores/convex/)

### Mobile Development
- [Build Workout Tracker with Clerk Convex Expo - Expo Blog](https://expo.dev/blog/build-a-daily-workout-tracker-with-clerk-convex-and-expo)
- [Convex Better Auth Expo Guide](https://labs.convex.dev/better-auth/framework-guides/expo)
- [React Native Chat Convex Tutorial - Galaxies.dev](https://galaxies.dev/react-native-chat-convex)
