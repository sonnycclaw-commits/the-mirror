# json-render Patterns

> **Package**: `@json-render/core`, `@json-render/react`
> **Repo**: https://github.com/vercel-labs/json-render

---

## Core Concept

When AI generates UI, you need guarantees. json-render gives AI a constrained vocabulary so output is always predictable:

- **Guardrailed** — AI can only use components in your catalog
- **Predictable** — JSON output matches your schema, every time
- **Fast** — Stream and render progressively as the model responds

```
AI Prompt → JSON Output → React Components
```

---

## Quick Start

### 1. Define Your Catalog (what AI can use)

```typescript
import { createCatalog } from '@json-render/core';
import { z } from 'zod';

const catalog = createCatalog({
  components: {
    // Profile card for discovery results
    ProfileCard: {
      props: z.object({
        values: z.array(z.string()),
        energyPatterns: z.array(z.string()),
        growthEdges: z.array(z.string()),
        keyInsight: z.string(),
      }),
    },

    // Individual insight item
    InsightItem: {
      props: z.object({
        category: z.string(),
        content: z.string(),
        confidence: z.number().min(0).max(1),
      }),
    },

    // OKR display
    OKRCard: {
      props: z.object({
        objective: z.string(),
        keyResults: z.array(z.object({
          result: z.string(),
          metric: z.string(),
        })),
        actions: z.array(z.string()),
      }),
      hasChildren: false,
    },

    // Action button
    Button: {
      props: z.object({
        label: z.string(),
        action: ActionSchema,  // AI declares intent
      }),
    },
  },

  actions: {
    download_pdf: { description: 'Download plan as PDF' },
    copy_to_clipboard: { description: 'Copy plan to clipboard' },
    restart_session: { description: 'Start a new discovery session' },
  },
});
```

### 2. Register Your Components (how they render)

```typescript
const registry = {
  ProfileCard: ({ element }) => (
    <div className="profile-card">
      <h3>Your Profile</h3>
      <section>
        <h4>Core Values</h4>
        <ul>
          {element.props.values.map((v, i) => (
            <li key={i}>{v}</li>
          ))}
        </ul>
      </section>
      <section>
        <h4>Energy Patterns</h4>
        <ul>
          {element.props.energyPatterns.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      </section>
      <blockquote>{element.props.keyInsight}</blockquote>
    </div>
  ),

  InsightItem: ({ element }) => (
    <div className="insight-item">
      <span className="category">{element.props.category}</span>
      <p>{element.props.content}</p>
      <meter value={element.props.confidence} />
    </div>
  ),

  OKRCard: ({ element }) => (
    <div className="okr-card">
      <h3>Objective: {element.props.objective}</h3>
      <ul>
        {element.props.keyResults.map((kr, i) => (
          <li key={i}>
            {kr.result} <span>({kr.metric})</span>
          </li>
        ))}
      </ul>
      <h4>First Actions</h4>
      <ul>
        {element.props.actions.map((a, i) => (
          <li key={i}>{a}</li>
        ))}
      </ul>
    </div>
  ),

  Button: ({ element, onAction }) => (
    <button onClick={() => onAction(element.props.action)}>
      {element.props.label}
    </button>
  ),
};
```

### 3. Let AI Generate

```typescript
import {
  DataProvider,
  ActionProvider,
  Renderer,
  useUIStream
} from '@json-render/react';

function PlanDisplay() {
  const { tree, isStreaming } = useUIStream({
    api: '/api/generate-plan'
  });

  return (
    <ActionProvider actions={{
      download_pdf: () => generateAndDownloadPDF(),
      copy_to_clipboard: () => copyToClipboard(),
      restart_session: () => router.push('/chat/new'),
    }}>
      <Renderer
        tree={tree}
        components={registry}
        loading={isStreaming}
      />
    </ActionProvider>
  );
}
```

---

## For TRQ: Recommended Components

### Profile Display

```typescript
ProfileCard: {
  props: z.object({
    values: z.array(z.string()),
    energyPatterns: z.array(z.string()),
    growthEdges: z.array(z.string()),
    keyInsight: z.string(),
    aspirationGap: z.string().optional(),
  }),
}
```

### Plan Display

```typescript
ClarityPlan: {
  props: z.object({
    profile: ProfileSchema,
    vision: z.object({
      goal: z.string(),
      why: z.string(),
      successState: z.string(),
      timeline: z.string(),
    }),
    okrs: z.array(OKRSchema),
    watchOutFor: z.array(z.string()),
    oneLever: z.string(),
  }),
  hasChildren: false,
}
```

### Reflection Questions

```typescript
ReflectionPrompt: {
  props: z.object({
    question: z.string(),
    context: z.string().optional(),
    options: z.array(z.object({
      label: z.string(),
      description: z.string().optional(),
    })).optional(),
  }),
}
```

---

## Integration with Agent SDK

In your TARS action, instruct Claude to output json-render format:

```typescript
const TARS_SYSTEM_PROMPT = `
When presenting the profile or plan, output in json-render format:

{
  "component": "ProfileCard",
  "props": {
    "values": ["authenticity", "growth", "connection"],
    "energyPatterns": ["early mornings", "deep work sessions"],
    "growthEdges": ["saying no", "asking for help"],
    "keyInsight": "You value depth over breadth..."
  }
}

The UI will render this automatically.
`;
```

---

## Benefits for TRQ

1. **Type-safe AI output** — Zod schemas guarantee structure
2. **Streaming render** — Show profile/plan as it generates
3. **Consistent UI** — Same components, regardless of AI variation
4. **Action handling** — Download PDF, copy, restart are just props

---

## Alternative: Simple Markdown

If json-render feels too heavy for MVP, use markdown with a simple renderer:

```typescript
// AI outputs markdown
const plan = `
## Your Profile

**Core Values**: authenticity, growth, connection

**Key Insight**: You value depth over breadth...
`;

// Render with react-markdown
<ReactMarkdown>{plan}</ReactMarkdown>
```

**Tradeoff**: Less structure, but simpler to implement.

---

*Consider json-render for Beta when you need richer, interactive plan displays.*
