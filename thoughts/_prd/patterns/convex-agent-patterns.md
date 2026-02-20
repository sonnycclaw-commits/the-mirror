# Pattern: Convex Agent Architecture
> **Status**: APPROVED
> **Context**: The Right Questions MVP
> **Reference**: [Convex Agents Docs](https://docs.convex.dev/agents)

---

## 1. The Decision: Abstraction vs. Control

Convex offers two paths for agents:

### Option A: The "Agent Component" (`@convex-dev/agents`)
*   **What**: A high-level wrapper.
*   **Props**: Handles thread persistence, history loading, and tool execution automatically.
*   **Cons**: Opacity. Hard to inject "Mid-Stream Side Effects" (like optimistic UI updates *during* generation).

### Option B: The "Custom HTTP Action" (`ai-sdk` + Manual Actions)
*   **What**: Running `streamText` inside a Convex **HTTP Action**.
*   **Props**: Total control over the definition of the "Shadow Loop".
*   **Pros**: We can trigger DB mutations *instantly* when a tool is called, updating the UI before the prose finishes.

**DECISION**: **Option B (Custom HTTP Action)**.
*Why?* Standard RPC Actions cannot stream `Response` objects to `ai-sdk` clients. We need an HTTP endpoint.

---

## 2. The Implementation Pattern (Option B)

### 2.1 The Action (Must be HTTP for `ai-sdk`)

Standard Convex Actions (RPC) cannot stream text response objects. We must use `httpAction`.

```typescript
// convex/http.ts
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { streamText, tool } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

const http = httpRouter();

http.route({
  path: "/chat",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const { messages, sessionId } = await request.json();

    // 1. Persistence: Save USER message immediately
    await ctx.runMutation(internal.messages.saveUserMessage, {
        sessionId,
        content: messages[messages.length - 1].content
    });

    // 2. Hydrate Context
    const signals = await ctx.runQuery(internal.signals.getBySession, { sessionId });

    // 3. Stream
    const result = streamText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      messages,
      system: buildSystemSoul(signals),
      tools: {
        extractSignal: tool({
            parameters: SignalSchema,
            execute: async (signal) => {
                // SIDE EFFECT: Instant DB Write
                await ctx.runMutation(internal.signals.add, { sessionId, signal });
                return "Signal Recorded";
            }
        })
      },
      // 4. Persistence: Save ASSISTANT message on finish
      onFinish: async ({ text }) => {
        await ctx.runMutation(internal.messages.saveAssistantMessage, {
            sessionId,
            content: text
        });
      }
    });

    return result.toDataStreamResponse();
  }),
});

export default http;
```

### 2.2 The Persistence Lifecycle

Because `httpAction` is ephemeral, we manually persist:
1.  **User Message**: Saved *before* generation.
2.  **Signals**: Saved *during* generation (via Tool).
3.  **Assistant Message**: Saved *after* generation (`onFinish`).

This gives us both **Streaming Speed** (HTTP) and **State Permanence** (DB).

### 2.3 The Client Subscription (Optmisitic UI)
This is why we chose Convex. The UI listens to the *DB*, not the Stream.

```typescript
// src/routes/chat.tsx

// 1. Listen to the TEXT stream (HTTP)
const { messages, input, handleSubmit } = useChat({
    api: "/api/chat", // calls the convex HTTP action
});

// 2. Listen to the DATA stream (The Shadow Loop - WebSocket)
const signals = useQuery(api.signals.getBySession, { sessionId });

return (
    <div className="flex">
        <ChatInterface messages={messages} />

        {/* This drawer updates INSTANTLY when tool is called */}
        <SignalDrawer signals={signals} />
    </div>
)
```

## 3. Tool Pattern: Mutations, Not Returns

In standard Agents, tools return data to the LLM.
In TARS, tools primarily **mutate state**.

| Standard Tool | TARS Tool |
|Data Fetching|**State Mutation**|
|`getWeather() -> "Sunny"`|`extractSignal() -> void (DB Write)`|
|LLM reads return value|LLM assumes success, UI updates automatically|

## 4. State Management (No XState)

Use the database as the State Machine.

*   **Table**: `sessions`
*   **Field**: `phase` (Enum: SCENARIO, EXCAVATION, SYNTHESIS, CONTRACT)
*   **Transition**: `transitionPhase` tool (mutates the DB field).

The UI component just renders based on `useQuery(api.sessions.get)`. No complex client-side reducers.
