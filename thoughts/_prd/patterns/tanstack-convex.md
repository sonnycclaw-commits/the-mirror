# TanStack Start + Convex Patterns

> **Framework**: TanStack Start (React)
> **Database**: Convex
> **Docs**: https://docs.convex.dev/quickstart/tanstack-start

---

## Project Setup

### Quick Start

```bash
# Create new TanStack Start + Convex project
bun create convex@latest -- -t tanstack-start

# Or manual setup:
bunx create-start-app@latest
bun add convex @convex-dev/react-query @tanstack/react-router-with-query @tanstack/react-query
bunx convex dev
```

---

## File Structure

```
the-right-questions/
├── app/
│   ├── router.tsx          # Router + Convex provider setup
│   ├── routeTree.gen.ts    # Auto-generated route tree
│   └── routes/
│       ├── __root.tsx      # Root layout
│       ├── index.tsx       # Landing page
│       ├── chat.tsx        # Chat interface
│       └── sign-in.tsx     # Auth page
├── convex/
│   ├── _generated/         # Auto-generated types
│   ├── schema.ts           # Database schema
│   ├── sessions.ts         # Session mutations/queries
│   ├── messages.ts         # Message mutations/queries
│   └── actions/
│       └── tars.ts         # AI agent actions
└── .env.local              # VITE_CONVEX_URL
```

---

## Router Setup

**app/router.tsx** — Convex + React Query integration:

```typescript
import { createRouter } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { ConvexProvider } from "convex/react";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;

  const convexQueryClient = new ConvexQueryClient(CONVEX_URL);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
      },
    },
  });

  convexQueryClient.connect(queryClient);

  return routerWithQueryClient(
    createRouter({
      routeTree,
      defaultPreload: "intent",
      context: { queryClient },
      scrollRestoration: true,
      Wrap: ({ children }) => (
        <ConvexProvider client={convexQueryClient.convexClient}>
          {children}
        </ConvexProvider>
      ),
    }),
    queryClient
  );
}
```

---

## Root Layout

**app/routes/__root.tsx**:

```typescript
import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet, Scripts, HeadContent } from "@tanstack/react-router";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "The Right Questions" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
```

---

## Convex Schema

**convex/schema.ts**:

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  sessions: defineTable({
    userId: v.optional(v.string()),
    startedAt: v.number(),
    phase: v.string(),  // "discovery" | "reflection" | "goal" | "synthesis" | "complete"
    messages: v.array(v.object({
      id: v.string(),
      role: v.string(),  // "user" | "assistant"
      content: v.string(),
      timestamp: v.number(),
    })),
    signals: v.array(v.object({
      category: v.string(),
      content: v.string(),
      confidence: v.number(),
      source: v.string(),  // message ID that generated this
    })),
    profile: v.optional(v.object({
      values: v.array(v.string()),
      energyPatterns: v.array(v.string()),
      growthEdges: v.array(v.string()),
      keyInsight: v.string(),
    })),
    goal: v.optional(v.object({
      statement: v.string(),
      timeline: v.string(),
      motivation: v.string(),
      constraints: v.array(v.string()),
    })),
    output: v.optional(v.string()),  // Markdown plan
  }).index("by_user", ["userId"]),
});
```

---

## Queries

**convex/sessions.ts**:

```typescript
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.sessionId);
  },
});

export const create = mutation({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sessions", {
      userId: args.userId,
      startedAt: Date.now(),
      phase: "discovery",
      messages: [],
      signals: [],
    });
  },
});

export const addMessage = mutation({
  args: {
    sessionId: v.id("sessions"),
    role: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");

    const message = {
      id: crypto.randomUUID(),
      role: args.role,
      content: args.content,
      timestamp: Date.now(),
    };

    await ctx.db.patch(args.sessionId, {
      messages: [...session.messages, message],
    });

    return message;
  },
});
```

---

## Using in Routes

**app/routes/chat.tsx**:

```typescript
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useConvexMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export const Route = createFileRoute("/chat")({
  component: Chat,
});

function Chat() {
  const sessionId = Route.useParams().sessionId;

  // Live-updating query
  const { data: session } = useSuspenseQuery(
    convexQuery(api.sessions.get, { sessionId })
  );

  // Mutation
  const addMessage = useConvexMutation(api.sessions.addMessage);

  const handleSend = async (content: string) => {
    await addMessage({ sessionId, role: "user", content });
    // Trigger TARS response...
  };

  return (
    <div>
      {session?.messages.map((msg) => (
        <div key={msg.id}>{msg.content}</div>
      ))}
    </div>
  );
}
```

---

## Convex Actions (for AI)

**convex/actions/tars.ts**:

```typescript
import { action } from "../_generated/server";
import { v } from "convex/values";
import { query } from "@anthropic-ai/agent-sdk";

export const respond = action({
  args: {
    sessionId: v.id("sessions"),
    userMessage: v.string(),
  },
  handler: async (ctx, args) => {
    // Get session context
    const session = await ctx.runQuery(api.sessions.get, {
      sessionId: args.sessionId
    });

    // Call Agent SDK
    const messages = [];
    for await (const message of query({
      prompt: userMessage,
      options: {
        systemPrompt: TARS_SYSTEM_PROMPT,
        // ...
      }
    })) {
      messages.push(message);
    }

    // Save response
    const response = messages.filter(m => m.type === 'assistant')
      .map(m => m.content)
      .join('');

    await ctx.runMutation(api.sessions.addMessage, {
      sessionId: args.sessionId,
      role: "assistant",
      content: response,
    });

    return response;
  },
});
```

---

## Environment Variables

**.env.local**:

```
VITE_CONVEX_URL=https://your-project.convex.cloud
ANTHROPIC_API_KEY=sk-ant-...
CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

---

## Best Practices

### Queries

- Use `useSuspenseQuery` for data that must exist
- Queries are **live** — they update automatically when data changes
- Use indexes for filtered queries

### Mutations

- Keep mutations atomic
- Use `ctx.runMutation` for chaining in actions
- Return IDs from mutations for optimistic UI

### Actions

- Actions run on the server, have Node.js environment
- Use for external API calls (like Claude)
- Can call other queries/mutations via `ctx.run*`

### Performance

- Schema indexes for common queries
- Avoid large arrays in documents (signals, messages)
- Consider pagination for long conversations

---

*See: https://docs.convex.dev/client/tanstack/tanstack-start*
