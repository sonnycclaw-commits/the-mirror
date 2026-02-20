# Vercel AI SDK + Convex Integration Patterns

> **Packages**: `ai`, `@ai-sdk/anthropic`, `@ai-sdk-tools/agents`, `@convex-dev/persistent-text-streaming`

---

## 1. Core AI SDK Functions

### generateText (Non-Streaming)

```typescript
import { generateText, tool } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

const result = await generateText({
  model: anthropic('claude-sonnet-4-20250514'),
  tools: {
    weather: tool({
      description: 'Get weather for a location',
      inputSchema: z.object({ location: z.string() }),
      execute: async ({ location }) => ({ location, temp: 72 }),
    }),
  },
  stopWhen: stepCountIs(5), // Multi-step limit
  prompt: 'What is the weather in SF?',
});

console.log(result.text);
console.log(result.toolCalls);  // Tool calls made
console.log(result.toolResults); // Tool execution results
```

### streamText (Streaming)

```typescript
import { streamText } from 'ai';

const result = streamText({
  model: anthropic('claude-sonnet-4-20250514'),
  prompt: 'Describe a holiday.',
});

// Async iterable for streaming
for await (const textPart of result.textStream) {
  console.log(textPart);
}

// Promises for final values
const text = await result.text;
const toolCalls = await result.toolCalls;
```

---

## 2. Tool Definitions

### Execute vs No-Execute

**With Execute** (auto-runs):
```typescript
const recordDecision = tool({
  description: 'Record a user decision',
  inputSchema: z.object({
    question: z.string(),
    selectedOption: z.string(),
  }),
  execute: async ({ question, selectedOption }) => {
    // Runs automatically when model calls this tool
    await saveToConvex(question, selectedOption);
    return { success: true };
  },
});
```

**Without Execute** (returns to UI):
```typescript
const askUserQuestion = tool({
  description: 'Ask user a question with structured options',
  inputSchema: z.object({
    question: z.string(),
    options: z.array(z.object({
      label: z.string(),
      description: z.string(),
    })),
  }),
  // NO execute - handled by UI
});
```

### Handling No-Execute Tools

```typescript
const result = await generateText({ model, tools: { askUserQuestion }, messages });

// Check for tool calls without execution
for (const toolCall of result.toolCalls) {
  if (toolCall.toolName === 'askUserQuestion') {
    // Return to UI
    return {
      type: 'QUESTION',
      question: toolCall.args,
      toolCallId: toolCall.toolCallId,
    };
  }
}
```

### Submitting Tool Results

```typescript
// User selected options in UI, now continue the conversation
const messages = [
  ...previousMessages,
  { role: 'assistant', content: [{ type: 'tool-call', toolCallId, toolName: 'askUserQuestion', args }] },
  { role: 'tool', content: [{ type: 'tool-result', toolCallId, result: { selectedOptions } }] },
];

const result = await generateText({ model, tools, messages });
```

---

## 3. Convex Streaming Integration

### Option A: Persistent Text Streaming (Recommended)

```typescript
// convex/convex.config.ts
import { defineApp } from 'convex/server';
import persistentTextStreaming from '@convex-dev/persistent-text-streaming/convex.config';

export default defineApp().use(persistentTextStreaming);
```

```typescript
// convex/actions/chat.ts
import { internalAction } from './_generated/server';
import { streamText } from 'ai';
import { getTextStream } from '@convex-dev/persistent-text-streaming';

export const sendMessage = internalAction(async (ctx, { sessionId, message }) => {
  const stream = getTextStream(ctx, sessionId);

  const result = streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    prompt: message,
  });

  for await (const chunk of result.textStream) {
    await stream.write(chunk);
  }

  await stream.close();
});
```

```tsx
// Client-side
import { useTextStream } from '@convex-dev/persistent-text-streaming/react';

function Chat({ sessionId }) {
  const { text, isStreaming } = useTextStream(sessionId);

  return <div>{text}{isStreaming && <TypingIndicator />}</div>;
}
```

### Option B: Manual Chunking

```typescript
// convex/actions/chat.ts
export const sendMessage = action(async (ctx, { sessionId, message }) => {
  const result = streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    prompt: message,
  });

  for await (const chunk of result.textStream) {
    // Save each chunk to Convex
    await ctx.runMutation(internal.messages.appendChunk, {
      sessionId,
      chunk,
    });
  }

  // Mark complete
  await ctx.runMutation(internal.messages.markComplete, { sessionId });
});
```

---

## 4. Multi-Agent with @ai-sdk-tools/agents

```typescript
import { Agent } from '@ai-sdk-tools/agents';
import { anthropic } from '@ai-sdk/anthropic';

// Specialized agents
const orientationAgent = new Agent({
  name: 'Orientation',
  model: anthropic('claude-sonnet-4-20250514'),
  instructions: `You help users identify the shape of their goal.
    Ask 2-3 questions using askUserQuestion tool.`,
  tools: { askUserQuestion },
});

const deepDiveAgent = new Agent({
  name: 'DeepDive',
  model: anthropic('claude-sonnet-4-20250514'),
  instructions: `You dig deep into one category at a time.`,
  tools: { askUserQuestion, recordDecision },
});

// Orchestrator with handoffs
const discoveryOrchestrator = new Agent({
  name: 'Discovery',
  model: anthropic('claude-sonnet-4-20250514'),
  instructions: 'Route to the appropriate specialist based on phase.',
  handoffs: [orientationAgent, deepDiveAgent],
});
```

---

## 5. Structured Artifacts with @ai-sdk-tools/artifacts

```typescript
import { artifact } from '@ai-sdk-tools/artifacts';
import { z } from 'zod';

// Define typed artifact
const contractArtifact = artifact('momentum-contract', z.object({
  objective: z.string(),
  milestones: z.array(z.object({
    name: z.string(),
    deadline: z.string(),
  })),
  spark: z.string(),
  stage: z.enum(['generating', 'complete']).default('generating'),
}));
```

```tsx
// Use in component
import { useArtifact } from '@ai-sdk-tools/artifacts/client';

function ContractDisplay() {
  const { data, status, progress } = useArtifact(contractArtifact);

  if (status === 'loading') return <Skeleton />;
  if (status === 'error') return <Error />;

  return (
    <div>
      <h2>{data.objective}</h2>
      {data.milestones.map(m => <MilestoneCard key={m.name} {...m} />)}
      <SparkCard spark={data.spark} />
    </div>
  );
}
```

---

## 6. Our Pattern: AskUserQuestion Flow

```
User Message
    ↓
generateText({ tools: { askUserQuestion, recordDecision } })
    ↓
Model calls askUserQuestion (no execute)
    ↓
Return { type: 'QUESTION', question, toolCallId }
    ↓
UI renders QuestionCard
    ↓
User clicks option
    ↓
Submit tool-result with { selectedOptions }
    ↓
generateText with updated messages
    ↓
Model calls recordDecision (with execute)
    ↓
Decision saved to Convex
    ↓
Continue conversation
```

---

## 7. Key Callbacks

```typescript
const result = streamText({
  model,
  messages,
  tools,

  // Error handling (streaming suppresses errors by default)
  onError: (error) => {
    console.error('Stream error:', error);
    // Save error to Convex
  },

  // Per-chunk callback
  onChunk: (chunk) => {
    if (chunk.type === 'tool-call') {
      console.log('Tool being called:', chunk.toolName);
    }
  },

  // Completion callback
  onFinish: async ({ text, toolCalls, usage }) => {
    // Save final message to Convex
    await ctx.runMutation(internal.messages.save, {
      sessionId,
      role: 'assistant',
      content: text,
      toolCalls,
    });
  },
});
```

---

## 8. Error Handling

```typescript
import { ToolExecutionError, InvalidToolArgumentsError } from 'ai';

try {
  const result = await generateText({ model, tools, messages });
} catch (error) {
  if (error instanceof ToolExecutionError) {
    // Tool threw an error during execute()
    console.error('Tool failed:', error.toolName, error.cause);
  } else if (error instanceof InvalidToolArgumentsError) {
    // Model provided invalid arguments
    console.error('Invalid args for:', error.toolName);
  }
}
```

---

## 9. Dependencies

```json
{
  "dependencies": {
    "ai": "^5.0.0",
    "@ai-sdk/anthropic": "^2.0.0",
    "@ai-sdk-tools/agents": "^0.1.0",
    "@ai-sdk-tools/artifacts": "^0.1.0",
    "@convex-dev/persistent-text-streaming": "^0.1.0",
    "convex": "^1.18.0",
    "zod": "^3.24.0"
  }
}
```

---

*This pattern document fills the blind spots for streaming, tool handling, and Convex integration.*
