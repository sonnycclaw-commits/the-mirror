# Data Model

**Section:** 2-architecture
**Status:** Draft
**Source:** Distilled from `concept/mechanics/systems/constellation-states/`, `concept/05a-technical-architecture.md`

---

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│    ┌──────────────┐         1:N         ┌──────────────┐                │
│    │     USER     │────────────────────▶│     STAR     │                │
│    └──────┬───────┘                     └──────┬───────┘                │
│           │                                    │                         │
│           │ 1:N                                │ N:N                     │
│           ▼                                    ▼                         │
│    ┌──────────────┐                     ┌──────────────┐                │
│    │ CONVERSATION │                     │  CONNECTION  │                │
│    └──────┬───────┘                     └──────────────┘                │
│           │                                                              │
│           │ 1:N                                                          │
│           ▼                                                              │
│    ┌──────────────┐                                                     │
│    │   MESSAGE    │                                                     │
│    └──────────────┘                                                     │
│                                                                          │
│    ──── V1 (Post-MVP) ────                                              │
│                                                                          │
│    ┌──────────────┐         1:N         ┌──────────────┐                │
│    │     USER     │────────────────────▶│   JOURNEY    │                │
│    └──────────────┘                     └──────┬───────┘                │
│                                                │                         │
│                                                │ 1:N                     │
│                                                ▼                         │
│                                         ┌──────────────┐                │
│                                         │  EXPERIMENT  │                │
│                                         └──────────────┘                │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Entity Definitions

### User

The authenticated user and their journey state.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | Id<"users"> | Auto | Convex document ID |
| `clerkId` | string | Yes | Clerk user identifier |
| `email` | string | Yes | User email address |
| `createdAt` | number | Yes | Unix timestamp |
| `currentPhase` | enum | Yes | "onboarding" \| "mirror" \| "birth_chart" \| "walk" |
| `mirrorDay` | number | Yes | Current Mirror day (0-7) |
| `tier` | enum | Yes | "free" \| "pro" |
| `subscriptionEndsAt` | number | Optional | Pro subscription end date |

**Indexes:**
- `by_clerk: [clerkId]` — Lookup by Clerk ID
- `by_email: [email]` — Lookup by email

---

### Star

A single insight or pattern in the user's constellation.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | Id<"stars"> | Auto | Convex document ID |
| `userId` | Id<"users"> | Yes | Owner |
| `label` | string | Yes | Short name (e.g., "Morning energy") |
| `description` | string | Yes | Full insight text |
| `domain` | enum | Yes | "health" \| "wealth" \| "relationships" \| "purpose" \| "soul" |
| `theta` | number | Yes | Angle within domain (radians) |
| `radius` | number | Yes | Distance from center (0-1) |
| `type` | enum | Yes | "nascent" \| "flickering" \| "dim" \| "bright" \| "dark" \| "dormant" |
| `brightness` | number | Yes | 0.05 - 1.0 |
| `variance` | number | Yes | Stability measure (lower = more stable) |
| `createdAt` | number | Yes | Unix timestamp |
| `lastUpdatedAt` | number | Yes | Last brightness/state change |
| `stabilizedAt` | number | Optional | When state became stable |
| `sourceMessageId` | Id<"messages"> | Optional | Message that created this star |
| `extractedDay` | number | Yes | Mirror day when extracted (1-7) |

**Indexes:**
- `by_user: [userId]` — All stars for user
- `by_user_domain: [userId, domain]` — Stars in specific domain
- `by_user_type: [userId, type]` — Stars by type

**State Constants (from `mechanics/constants.json`):**
```typescript
const STAR_CONSTANTS = {
  MIN_BRIGHTNESS: 0.05,
  MAX_BRIGHTNESS: 1.0,
  BRIGHT_THRESHOLD: 0.7,
  DIM_THRESHOLD: 0.3,
  STABILIZATION_DAYS: 7,
};
```

---

### Connection

A relationship between two stars.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | Id<"connections"> | Auto | Convex document ID |
| `userId` | Id<"users"> | Yes | Owner |
| `starA` | Id<"stars"> | Yes | First star |
| `starB` | Id<"stars"> | Yes | Second star |
| `connectionType` | enum | Yes | See types below |
| `strength` | number | Yes | 0-1 |
| `createdAt` | number | Yes | Unix timestamp |
| `evidence` | string[] | Yes | Quotes that established connection |

**Connection Types:**
| Type | Description | Effect |
|------|-------------|--------|
| `resonance` | Rise/fall together | 15% spillover |
| `tension` | Compete for energy | 8% drain when one gains |
| `causation` | A predicts B | Used for experiment sequencing |
| `growth_edge` | A enables B | 20% impact boost |
| `shadow_mirror` | Dark star + other | 1%/day drain |
| `blocks` | Belief prevents goal | 50% cap on target star |

**Indexes:**
- `by_user: [userId]` — All connections for user
- `by_star: [starA]` — Find connections for a star
- `by_star_b: [starB]` — Find connections (reverse lookup)

---

### Conversation

A conversation session between user and TARS.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | Id<"conversations"> | Auto | Convex document ID |
| `userId` | Id<"users"> | Yes | Owner |
| `phase` | enum | Yes | "onboarding" \| "mirror" \| "discovery" \| "walk" \| "reflection" |
| `mirrorDay` | number | Optional | Mirror day (1-7) if phase is mirror |
| `status` | enum | Yes | "active" \| "completed" \| "abandoned" |
| `startedAt` | number | Yes | Unix timestamp |
| `lastMessageAt` | number | Yes | Last activity |
| `completedAt` | number | Optional | When session completed |

**Indexes:**
- `by_user: [userId]` — All conversations for user
- `by_user_phase: [userId, phase]` — Conversations by phase

---

### Message

A single message in a conversation.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | Id<"messages"> | Auto | Convex document ID |
| `conversationId` | Id<"conversations"> | Yes | Parent conversation |
| `userId` | Id<"users"> | Yes | Owner |
| `role` | enum | Yes | "user" \| "assistant" |
| `content` | string | Yes | Message text |
| `extractedStars` | Id<"stars">[] | Optional | Stars extracted from this message (assistant only) |
| `extractedConnections` | Id<"connections">[] | Optional | Connections detected |
| `createdAt` | number | Yes | Unix timestamp |

**Indexes:**
- `by_conversation: [conversationId]` — Messages in conversation
- `by_user: [userId]` — All messages for user

---

## V1 Entities (Post-MVP)

### Journey

A goal-directed journey toward a North Star.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | Id<"journeys"> | Auto | Convex document ID |
| `userId` | Id<"users"> | Yes | Owner |
| `northStar` | object | Yes | `{ description, successCriteria[], timeframe }` |
| `milestones` | object[] | Yes | Array of milestone objects |
| `velocity` | number | Yes | Current velocity (0-1) |
| `momentum` | number | Yes | Accumulated momentum |
| `status` | enum | Yes | "discovery" \| "plotted" \| "walking" \| "paused" \| "complete" |
| `createdAt` | number | Yes | Unix timestamp |
| `startedAt` | number | Optional | When walk began |

**Milestone Object:**
```typescript
{
  id: string;
  description: string;
  successCriteria: string[];
  timeframe: "1_month" | "3_month" | "6_month" | "1_year" | "2_year";
  status: "pending" | "active" | "reached";
  reachedAt?: number;
}
```

---

### Experiment

A daily experiment in the Walk.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | Id<"experiments"> | Auto | Convex document ID |
| `userId` | Id<"users"> | Yes | Owner |
| `journeyId` | Id<"journeys"> | Yes | Parent journey |
| `milestoneId` | string | Yes | Target milestone |
| `description` | string | Yes | Experiment description |
| `whenTrigger` | string | Yes | WHEN part of implementation intention |
| `willAction` | string | Yes | WILL part |
| `atContext` | string | Yes | AT part |
| `status` | enum | Yes | "pending" \| "accepted" \| "completed" \| "skipped" \| "expired" |
| `offeredAt` | number | Yes | When experiment was offered |
| `expiresAt` | number | Yes | Midnight of offer day |
| `completedAt` | number | Optional | When reported complete |
| `reflection` | string | Optional | User's reflection text |

---

## Convex Schema

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    createdAt: v.number(),
    currentPhase: v.union(
      v.literal("onboarding"),
      v.literal("mirror"),
      v.literal("birth_chart"),
      v.literal("walk")
    ),
    mirrorDay: v.number(),
    tier: v.union(v.literal("free"), v.literal("pro")),
    subscriptionEndsAt: v.optional(v.number()),
  })
    .index("by_clerk", ["clerkId"])
    .index("by_email", ["email"]),

  stars: defineTable({
    userId: v.id("users"),
    label: v.string(),
    description: v.string(),
    domain: v.union(
      v.literal("health"),
      v.literal("wealth"),
      v.literal("relationships"),
      v.literal("purpose"),
      v.literal("soul")
    ),
    theta: v.number(),
    radius: v.number(),
    type: v.union(
      v.literal("nascent"),
      v.literal("flickering"),
      v.literal("dim"),
      v.literal("bright"),
      v.literal("dark"),
      v.literal("dormant")
    ),
    brightness: v.number(),
    variance: v.number(),
    createdAt: v.number(),
    lastUpdatedAt: v.number(),
    stabilizedAt: v.optional(v.number()),
    sourceMessageId: v.optional(v.id("messages")),
    extractedDay: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_domain", ["userId", "domain"])
    .index("by_user_type", ["userId", "type"]),

  connections: defineTable({
    userId: v.id("users"),
    starA: v.id("stars"),
    starB: v.id("stars"),
    connectionType: v.union(
      v.literal("resonance"),
      v.literal("tension"),
      v.literal("causation"),
      v.literal("growth_edge"),
      v.literal("shadow_mirror"),
      v.literal("blocks")
    ),
    strength: v.number(),
    createdAt: v.number(),
    evidence: v.array(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_star", ["starA"])
    .index("by_star_b", ["starB"]),

  conversations: defineTable({
    userId: v.id("users"),
    phase: v.union(
      v.literal("onboarding"),
      v.literal("mirror"),
      v.literal("discovery"),
      v.literal("walk"),
      v.literal("reflection")
    ),
    mirrorDay: v.optional(v.number()),
    status: v.union(
      v.literal("active"),
      v.literal("completed"),
      v.literal("abandoned")
    ),
    startedAt: v.number(),
    lastMessageAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_phase", ["userId", "phase"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    extractedStars: v.optional(v.array(v.id("stars"))),
    extractedConnections: v.optional(v.array(v.id("connections"))),
    createdAt: v.number(),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_user", ["userId"]),
});
```

---

## Data Lifecycle

### Creation

| Entity | Created When | Created By |
|--------|--------------|------------|
| User | First auth | Clerk webhook |
| Conversation | User starts session | Client action |
| Message | Each message sent/received | Mutation |
| Star | TARS extracts pattern | Claude Action + Mutation |
| Connection | Pattern relationship detected | Claude Action + Mutation |

### Updates

| Entity | Updated When | Update Logic |
|--------|--------------|--------------|
| User | Phase change, subscription | Direct mutation |
| Star | Conversation, decay | Brightness formula from mechanics |
| Connection | Conversation strengthens | Strength increment |

### Deletion/Archival

| Entity | Deletion Rule |
|--------|---------------|
| User | On explicit request (7-day grace) |
| All user data | Cascade delete with user |
| Star (dormant) | Never deleted, marked dormant |
