# Implementation Patterns

Reference documentation for the key libraries and patterns used in The Right Questions MVP.

---

## Pattern Files

| File | Purpose |
|------|---------|
| [agent-sdk.md](./agent-sdk.md) | Claude Agent SDK for agentic AI interactions |
| [tanstack-convex.md](./tanstack-convex.md) | TanStack Start + Convex integration |
| [json-render.md](./json-render.md) | AI → JSON → UI structured output |
| [discovery-interview.md](./discovery-interview.md) | Interview methodology for goal discovery |
| [psychometric-profiling.md](./psychometric-profiling.md) | Signal extraction (HEXACO, SDT, Kegan) |

---

## Tech Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | TanStack Start | React metaframework with file-router |
| **Runtime** | Bun | Fast JS runtime |
| **Database** | Convex | Real-time backend with live queries |
| **AI** | Agent SDK | Agentic Claude with tools |
| **Auth** | Clerk | Magic link authentication |
| **UI** | React + Tailwind | Component library |
| **Output** | json-render / Markdown | Structured AI output → UI |

---

## Quick Reference

### Start a TanStack Start + Convex project

```bash
bun create convex@latest -- -t tanstack-start
bunx convex dev
bun run dev
```

### Call Agent SDK

```typescript
import { query } from '@anthropic-ai/agent-sdk';

for await (const message of query({
  prompt: "Interview the user about their goals",
  options: {
    allowedTools: ["Skill"],
    systemPrompt: TARS_SYSTEM_PROMPT
  }
})) {
  yield message;
}
```

### Define Convex schema

```typescript
// convex/schema.ts
export default defineSchema({
  sessions: defineTable({
    phase: v.string(),
    messages: v.array(MessageSchema),
    signals: v.array(SignalSchema),
    profile: v.optional(ProfileSchema),
    goal: v.optional(GoalSchema),
    output: v.optional(v.string()),
  }),
});
```

### Use live query in route

```typescript
// app/routes/chat.tsx
const { data: session } = useSuspenseQuery(
  convexQuery(api.sessions.get, { sessionId })
);
```

---

## When to Use Each Pattern

| Situation | Pattern |
|-----------|---------|
| Need live-updating data | Convex queries + useSuspenseQuery |
| Need to call Claude | Agent SDK in Convex action |
| Need structured AI output | json-render catalog |
| Building interview flow | discovery-interview methodology |
| Analyzing user responses | psychometric-profiling analysis |
| Simple text output | Markdown + react-markdown |

---

*Read the individual pattern files for detailed usage and examples.*
