# External Integrations

**Section:** 2-architecture
**Status:** Draft

---

## Claude API

### Configuration

| Setting | Value |
|---------|-------|
| Provider | Anthropic |
| Model | claude-sonnet-4-20250514 |
| Max tokens | 2048 (response) |
| Context limit | 100k tokens |

### Authentication

```typescript
// In Convex action
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
```

**Environment:** `ANTHROPIC_API_KEY` stored in Convex environment variables.

### Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `/v1/messages` | All TARS interactions |

### TARS System Prompt Structure

```typescript
const TARS_SYSTEM_PROMPT = `
You are TARS, an AI companion in the S.T.A.R.S. application.

## Your Character
- Calm, not sleepy
- Curious, not probing
- Honest, not brutal
- Occasionally wry
- Always present

## What You Do
- Ask questions that excavate
- Reflect without analyzing
- Name patterns you observe
- Guide without prescribing

## What You Don't Do
- Diagnose or label
- Give prescriptive advice
- Use excessive punctuation or emojis
- Abandon when things are hard

## Current Context
Phase: {phase}
Mirror Day: {mirrorDay}
Constellation Summary: {constellationSummary}

## Your Tools
Use extract_star when you identify a clear pattern or insight.
Use detect_connection when you notice a relationship between patterns.

## Micro-Revelation (if end of day)
Provide one insight that connects something the user said to a pattern they can't see.
`;
```

### Structured Output (Tool Use)

**Star Extraction Tool:**
```typescript
{
  name: "extract_star",
  description: "Extract a pattern, insight, or aspect of the user as a star",
  input_schema: {
    type: "object",
    properties: {
      label: { type: "string", description: "Short name (2-4 words)" },
      description: { type: "string", description: "Full insight text" },
      domain: {
        type: "string",
        enum: ["health", "wealth", "relationships", "purpose", "soul"]
      }
    },
    required: ["label", "description", "domain"]
  }
}
```

**Connection Detection Tool:**
```typescript
{
  name: "detect_connection",
  description: "Detect a relationship between two patterns",
  input_schema: {
    type: "object",
    properties: {
      starALabel: { type: "string" },
      starBLabel: { type: "string" },
      connectionType: {
        type: "string",
        enum: ["resonance", "tension", "causation", "growth_edge", "shadow_mirror", "blocks"]
      },
      evidence: { type: "string", description: "Quote or observation supporting connection" }
    },
    required: ["starALabel", "starBLabel", "connectionType", "evidence"]
  }
}
```

### Rate Limiting

| Tier | Limit |
|------|-------|
| Default | 1000 requests/minute |
| Per-user (our limit) | 10 messages/minute |

**Implementation:**
```typescript
// In Convex action
const lastMessages = await ctx.runQuery(api.messages.getRecent, {
  userId,
  minutes: 1
});

if (lastMessages.length >= 10) {
  throw new Error("Please slow down. You can send 10 messages per minute.");
}
```

### Cost Management

| Operation | Est. Cost |
|-----------|-----------|
| Average message (500 input + 300 output tokens) | ~$0.003 |
| Full session (20 messages) | ~$0.06 |
| 7-day Mirror | ~$0.42 |

**Mitigation:**
- Summarize older context instead of including full history
- Cache constellation summaries
- Monitor usage per user

### Error Handling

```typescript
try {
  const response = await anthropic.messages.create({ ... });
} catch (error) {
  if (error.status === 429) {
    // Rate limited - retry with backoff
    await sleep(1000);
    return retry();
  }
  if (error.status === 500) {
    // Claude error - fallback message
    return {
      response: "I'm having trouble thinking right now. Can you try again?",
      extractedStars: [],
      detectedConnections: []
    };
  }
  throw error;
}
```

---

## Clerk (Authentication)

### Configuration

| Setting | Value |
|---------|-------|
| Auth method | Magic link (passwordless) |
| Session duration | 30 days |
| Multi-device | Allowed |

### Environment Variables

| Variable | Location | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Client | Clerk JS initialization |
| `CLERK_SECRET_KEY` | Server | Webhook verification |

### Clerk Components

```typescript
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

```typescript
// Sign-in button
import { SignInButton } from '@clerk/nextjs';

<SignInButton mode="modal">
  <button>Sign in with email</button>
</SignInButton>
```

### Webhook Integration

**Endpoint:** `/api/webhooks/clerk`

**Events:**
| Event | Action |
|-------|--------|
| `user.created` | Create user in Convex |
| `user.deleted` | Delete user data in Convex |

**Webhook Handler:**
```typescript
// app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  const payload = await req.json();
  const headersList = headers();

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
  const evt = wh.verify(
    JSON.stringify(payload),
    {
      'svix-id': headersList.get('svix-id'),
      'svix-timestamp': headersList.get('svix-timestamp'),
      'svix-signature': headersList.get('svix-signature'),
    }
  );

  switch (evt.type) {
    case 'user.created':
      await convex.mutation(api.users.create, {
        clerkId: evt.data.id,
        email: evt.data.email_addresses[0].email_address,
      });
      break;
    case 'user.deleted':
      await convex.mutation(api.users.delete, {
        clerkId: evt.data.id,
      });
      break;
  }

  return Response.json({ received: true });
}
```

### Convex Integration

```typescript
// convex/auth.config.ts
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};
```

```typescript
// In any Convex function
const identity = await ctx.auth.getUserIdentity();
if (!identity) {
  throw new Error("Unauthorized");
}
const clerkId = identity.subject;
```

---

## Vercel (Hosting)

### Configuration

**Framework:** Next.js 14 (App Router)
**Build Command:** `npm run build`
**Output Directory:** `.next`

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key |
| `CLERK_SECRET_KEY` | Clerk webhooks |

### Deployment

```bash
# Automatic deploys from main branch
# Preview deploys from PRs
```

**vercel.json:**
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev"
}
```

### Edge Configuration

No edge functions required for MVP. All server logic runs in Convex.

---

## Future Integrations (V1+)

### Resend (Email)

**Purpose:** Transactional email (weekly summaries, return nudges)

**Not in MVP.** Placeholder for V1.

### PostHog (Analytics)

**Purpose:** Product analytics, event tracking

**Events to Track:**
- `mirror_day_started`
- `mirror_day_completed`
- `star_created`
- `birth_chart_revealed`
- `subscription_started`

**Not in MVP.** Add after pilot.

### Push Notifications

**Purpose:** Experiment reminders, check-in prompts

**Options:**
- Web Push API (PWA)
- OneSignal
- Expo Push (if native)

**Not in MVP.**

---

## Integration Dependencies

```
Client
  ├── Clerk (auth UI)
  ├── Convex Client (data sync)
  └── Next.js (framework)
        │
        ▼
Vercel (hosting)
        │
        ▼
Convex (backend)
  ├── Clerk (auth verification)
  └── Claude API (AI)
```
