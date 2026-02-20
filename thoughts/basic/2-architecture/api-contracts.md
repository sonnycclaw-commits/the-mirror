# API Contracts

**Section:** 2-architecture
**Status:** Draft
**Technology:** Convex (queries, mutations, actions)

---

## Overview

All API operations are Convex functions. Three types:
- **Queries:** Read-only, reactive, cached
- **Mutations:** Write operations, transactional
- **Actions:** External API calls (Claude, etc.)

---

## Authentication

All functions require authentication via Clerk.

```typescript
// Pattern for all authenticated functions
export const myFunction = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) throw new Error("User not found");

    // ... function logic
  },
});
```

---

## Queries

### users.getCurrent

**Purpose:** Get current authenticated user

**Arguments:** None

**Returns:**
```typescript
{
  _id: Id<"users">;
  email: string;
  currentPhase: "onboarding" | "mirror" | "birth_chart" | "walk";
  mirrorDay: number;
  tier: "free" | "pro";
} | null
```

**Authorization:** Authenticated

---

### stars.getAll

**Purpose:** Get all stars for current user

**Arguments:** None

**Returns:**
```typescript
Array<{
  _id: Id<"stars">;
  label: string;
  description: string;
  domain: Domain;
  theta: number;
  radius: number;
  type: StarType;
  brightness: number;
}>
```

**Authorization:** User can only access own stars

---

### stars.getByDomain

**Purpose:** Get stars filtered by domain

**Arguments:**
```typescript
{ domain: "health" | "wealth" | "relationships" | "purpose" | "soul" }
```

**Returns:** Array of stars (same shape as getAll)

**Authorization:** User can only access own stars

---

### connections.getAll

**Purpose:** Get all connections for current user

**Arguments:** None

**Returns:**
```typescript
Array<{
  _id: Id<"connections">;
  starA: Id<"stars">;
  starB: Id<"stars">;
  connectionType: ConnectionType;
  strength: number;
}>
```

**Authorization:** User can only access own connections

---

### conversations.getActive

**Purpose:** Get the currently active conversation

**Arguments:** None

**Returns:**
```typescript
{
  _id: Id<"conversations">;
  phase: ConversationPhase;
  mirrorDay?: number;
  startedAt: number;
} | null
```

**Authorization:** User can only access own conversations

---

### messages.getByConversation

**Purpose:** Get messages for a conversation

**Arguments:**
```typescript
{
  conversationId: Id<"conversations">;
  limit?: number;  // Default 50
}
```

**Returns:**
```typescript
Array<{
  _id: Id<"messages">;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}>
```

**Authorization:** User can only access own conversations

---

### constellation.getSummary

**Purpose:** Get computed constellation state (for TARS context)

**Arguments:** None

**Returns:**
```typescript
{
  phase: "scattered" | "connecting" | "emerging" | "luminous";
  starCount: number;
  brightStars: number;
  darkStars: number;
  connectionCount: number;
  dominantDomain: Domain | null;
  summary: string;  // AI-generated summary of constellation
}
```

---

## Mutations

### users.create

**Purpose:** Create user record after Clerk auth

**Arguments:**
```typescript
{
  clerkId: string;
  email: string;
}
```

**Returns:** `Id<"users">`

**Side Effects:**
- Creates user document
- Sets `currentPhase: "onboarding"`
- Sets `mirrorDay: 0`

**Authorization:** Called by Clerk webhook

---

### users.updatePhase

**Purpose:** Update user's current phase

**Arguments:**
```typescript
{
  phase: "onboarding" | "mirror" | "birth_chart" | "walk";
  mirrorDay?: number;
}
```

**Returns:** void

**Authorization:** User can only update own record

---

### conversations.create

**Purpose:** Start a new conversation session

**Arguments:**
```typescript
{
  phase: ConversationPhase;
  mirrorDay?: number;
}
```

**Returns:** `Id<"conversations">`

**Side Effects:**
- Creates conversation document
- Sets `status: "active"`

---

### conversations.complete

**Purpose:** Mark conversation as completed

**Arguments:**
```typescript
{ conversationId: Id<"conversations"> }
```

**Returns:** void

**Side Effects:**
- Sets `status: "completed"`
- Sets `completedAt: now`

---

### messages.send

**Purpose:** Send a user message (triggers TARS response)

**Arguments:**
```typescript
{
  conversationId: Id<"conversations">;
  content: string;
}
```

**Returns:**
```typescript
{
  userMessageId: Id<"messages">;
  assistantMessageId: Id<"messages">;  // Populated after action
}
```

**Side Effects:**
- Creates user message
- Triggers `tars.respond` action
- Creates assistant message with response
- May create stars via extraction

---

### stars.create

**Purpose:** Create a new star (called by extraction action)

**Arguments:**
```typescript
{
  label: string;
  description: string;
  domain: Domain;
  theta: number;
  radius: number;
  sourceMessageId?: Id<"messages">;
  extractedDay: number;
}
```

**Returns:** `Id<"stars">`

**Side Effects:**
- Creates star with `type: "nascent"`
- Sets `brightness: 0.3`
- Sets `variance: 0.5`

**Authorization:** Internal (called by actions)

---

### stars.update

**Purpose:** Update star brightness/type

**Arguments:**
```typescript
{
  starId: Id<"stars">;
  brightness?: number;
  type?: StarType;
  variance?: number;
}
```

**Returns:** void

**Validation:**
- `brightness` must be 0.05-1.0
- `type` must be valid StarType

---

### connections.create

**Purpose:** Create a connection between stars

**Arguments:**
```typescript
{
  starA: Id<"stars">;
  starB: Id<"stars">;
  connectionType: ConnectionType;
  evidence: string[];
}
```

**Returns:** `Id<"connections">`

**Validation:**
- Both stars must belong to current user
- No duplicate connections (A-B same as B-A)

---

## Actions

### tars.respond

**Purpose:** Generate TARS response using Claude

**Arguments:**
```typescript
{
  conversationId: Id<"conversations">;
  userMessage: string;
}
```

**Returns:**
```typescript
{
  response: string;
  extractedStars: Array<{
    label: string;
    description: string;
    domain: Domain;
  }>;
  detectedConnections: Array<{
    starALabel: string;
    starBLabel: string;
    connectionType: ConnectionType;
    evidence: string;
  }>;
  shouldCompleteMirrorDay: boolean;
}
```

**External Calls:**
- Claude API (messages endpoint)

**Claude Request Format:**
```typescript
{
  model: "claude-sonnet-4-20250514",
  max_tokens: 2048,
  system: TARS_SYSTEM_PROMPT,
  messages: [
    // Last 50 messages from conversation
    // Constellation summary
    { role: "user", content: userMessage }
  ],
  tools: [{
    name: "extract_star",
    description: "Extract a pattern or insight as a star",
    input_schema: { /* star schema */ }
  }, {
    name: "detect_connection",
    description: "Detect a relationship between patterns",
    input_schema: { /* connection schema */ }
  }]
}
```

---

### tars.generateMicroRevelation

**Purpose:** Generate daily micro-revelation

**Arguments:**
```typescript
{
  conversationId: Id<"conversations">;
  mirrorDay: number;
}
```

**Returns:**
```typescript
{ revelation: string }
```

**Logic:**
- Analyzes all messages from current day
- Finds 2+ patterns to connect
- Generates observation (not advice)

---

### tars.generateBirthChartNarration

**Purpose:** Generate Birth Chart reveal narration

**Arguments:**
```typescript
{ userId: Id<"users"> }
```

**Returns:**
```typescript
{
  narration: string;
  highlights: Array<{
    type: "bright_cluster" | "dark_star" | "connection" | "pattern";
    description: string;
    starIds: Id<"stars">[];
  }>;
}
```

---

## Response Formats

### Success Response

All queries and mutations return data directly. Convex handles errors.

### Error Handling

```typescript
// Thrown errors become client-side errors
throw new Error("Star not found");

// Or with specific error type
throw new ConvexError("Unauthorized");
```

### Rate Limiting

Handled at Convex level:
- Default: 1000 function calls per minute per deployment
- Additional: Claude API rate limits apply to actions

---

## Pagination

For large result sets:

```typescript
// Query with pagination
export const getMessages = query({
  args: {
    conversationId: v.id("conversations"),
    cursor: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { conversationId, cursor, limit = 50 }) => {
    let query = ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", conversationId))
      .order("desc");

    if (cursor) {
      query = query.filter((q) => q.lt(q.field("_creationTime"), cursor));
    }

    const messages = await query.take(limit + 1);
    const hasMore = messages.length > limit;

    return {
      messages: messages.slice(0, limit),
      nextCursor: hasMore ? messages[limit - 1]._creationTime.toString() : null,
    };
  },
});
```
