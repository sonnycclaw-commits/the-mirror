# Agent SDK Patterns

> **Package**: `claude-agent-sdk` (Python) / `@anthropic-ai/agent-sdk` (TypeScript)
> **Docs**: https://platform.claude.com/docs/en/agent-sdk/overview

---

## Core Concept

The Agent SDK gives you the same tools, agent loop, and context management that power Claude Code — as a library. Claude executes tools directly instead of asking you to implement them.

```typescript
import { query, ClaudeAgentOptions, AssistantMessage, ResultMessage } from '@anthropic-ai/agent-sdk';

// Agentic loop: streams messages as Claude works
for await (const message of query({
  prompt: "Interview this user about their goals",
  options: {
    allowedTools: ["Read", "Edit", "Bash", "WebSearch"],
    permissionMode: "acceptEdits",
    systemPrompt: "You are TARS, a discovery interviewer..."
  }
})) {
  // Handle streaming responses
  if (message.type === 'assistant') {
    console.log(message.content);
  }
}
```

---

## Key Concepts

### Tools

Tools control what your agent can do:

| Tool | Purpose |
|------|---------|
| `Read` | Read files from filesystem |
| `Edit` | Modify files |
| `Glob` | Find files by pattern |
| `Grep` | Search file contents |
| `Bash` | Run terminal commands |
| `WebSearch` | Search the web |
| `WebFetch` | Fetch URL content |
| `Skill` | Invoke agent skills |

### Permission Modes

| Mode | Behavior |
|------|----------|
| `default` | Requires user approval for tools |
| `acceptEdits` | Auto-approve file operations |
| `bypassPermissions` | Auto-approve everything (use carefully) |

For user-facing apps, use `default` mode with a `canUseTool` callback.

### System Prompt

Customize Claude's behavior:

```typescript
options: {
  systemPrompt: `You are TARS, a discovery interviewer.

Voice: Calm, curious, honest, occasionally wry.
Goal: Help users discover what they truly want.
Method: Ask questions that excavate, reflect without analyzing.

DO: Ask one question at a time. Wait for answers.
DON'T: Diagnose or label. Give prescriptive advice.`
}
```

---

## Skills

Skills are SKILL.md files that extend Claude with specialized capabilities. Claude invokes them automatically when relevant.

### Creating a Skill

```
.claude/skills/discovery-interview/
└── SKILL.md
```

```markdown
---
description: Deep interview process to transform vague ideas into specs
user-invocable: true
model: claude-opus-4-5-20251101
---

# Discovery Interview

You are a product discovery expert...
```

### Using Skills in SDK

```typescript
for await (const message of query({
  prompt: "Help me clarify my goals",
  options: {
    allowedTools: ["Skill"],  // Enable skills
    settingSources: ["project"]  // Load from .claude/skills/
  }
})) {
  // Claude will invoke the discovery-interview skill
}
```

---

## Message Types

```typescript
for await (const message of query({ prompt, options })) {
  switch (message.type) {
    case 'assistant':
      // Claude's reasoning or response
      for (const block of message.content) {
        if (block.type === 'text') {
          console.log(block.text);
        } else if (block.type === 'tool_use') {
          console.log(`Tool: ${block.name}`);
        }
      }
      break;

    case 'result':
      // Final outcome
      console.log(`Done: ${message.subtype}`);
      break;
  }
}
```

---

## Hooks

Run custom code before or after tool calls:

```typescript
options: {
  hooks: {
    beforeToolUse: async (tool, input) => {
      console.log(`About to use ${tool} with`, input);
      return true; // Allow the tool
    },
    afterToolUse: async (tool, input, output) => {
      console.log(`${tool} returned`, output);
    }
  }
}
```

---

## Sessions

Build multi-turn agents that maintain context:

```typescript
import { createSession, continueSession } from '@anthropic-ai/agent-sdk';

// Start a session
const session = await createSession({
  prompt: "Let's explore your goals",
  options: { allowedTools: ["Skill"] }
});

// Continue later
const messages = await continueSession({
  sessionId: session.id,
  prompt: "I want to focus on my career"
});
```

---

## Best Practices

### For Discovery Interviews

1. **Use a discovery skill** — Define the interview methodology in SKILL.md
2. **Stream responses** — Show Claude's questions as they come
3. **Capture structured output** — Use JSON mode for profiles/signals
4. **Handle interruptions** — Save state so users can resume

### For Multi-Turn Conversations

1. **Manage context** — Long conversations hit limits; summarize periodically
2. **Use sessions** — Built-in context management across turns
3. **Set clear exit conditions** — Know when the agent should stop

### For Production

1. **Set explicit tool constraints** — Only enable what you need
2. **Use `default` permission mode** — Let users approve actions
3. **Implement timeouts** — Agents can run indefinitely
4. **Log everything** — Debug agentic behavior is hard

---

## For TRQ: Recommended Pattern

```typescript
// TARS Discovery Agent
const tarsAgent = async (sessionId: string, userMessage: string) => {
  for await (const message of query({
    prompt: userMessage,
    options: {
      allowedTools: ["Skill"],
      settingSources: ["project"],
      systemPrompt: TARS_SYSTEM_PROMPT,
      // Custom hook to save signals
      hooks: {
        afterToolUse: async (tool, input, output) => {
          if (tool === 'ExtractSignal') {
            await saveSignalToConvex(sessionId, output);
          }
        }
      }
    }
  })) {
    yield message; // Stream to UI
  }
};
```

---

*See: https://platform.claude.com/docs/en/agent-sdk/quickstart*
