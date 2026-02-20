# System Overview

**Section:** 2-architecture
**Status:** Draft
**Source:** Distilled from `concept/05a-technical-architecture.md`

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT                                      │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                         Next.js App                              │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │   │
│  │  │   Pages     │  │ Components  │  │   Constellation Canvas  │  │   │
│  │  │  (Routes)   │  │    (UI)     │  │     (Star Rendering)    │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────────────┘  │   │
│  │                          │                                       │   │
│  │                    Convex Client                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ Real-time sync
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              BACKEND                                     │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                         Convex                                   │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │   │
│  │  │  Queries    │  │  Mutations  │  │        Actions          │  │   │
│  │  │ (Read data) │  │(Write data) │  │  (External API calls)   │  │   │
│  │  └─────────────┘  └─────────────┘  └───────────┬─────────────┘  │   │
│  │                          │                      │                │   │
│  │                    ┌─────┴─────┐                │                │   │
│  │                    │  Database │                │                │   │
│  │                    └───────────┘                │                │   │
│  └─────────────────────────────────────────────────│────────────────┘   │
└────────────────────────────────────────────────────│────────────────────┘
                                                     │
                    ┌────────────────────────────────┼───────────────────┐
                    │                                │                   │
                    ▼                                ▼                   ▼
            ┌──────────────┐              ┌──────────────┐      ┌──────────────┐
            │  Claude API  │              │    Clerk     │      │    Vercel    │
            │    (AI)      │              │   (Auth)     │      │  (Hosting)   │
            └──────────────┘              └──────────────┘      └──────────────┘
```

---

## Component Breakdown

### Client Layer

| Component | Technology | Responsibility |
|-----------|------------|----------------|
| **Pages** | Next.js App Router | Routing, page layout, SSR |
| **Components** | React + CSS | UI elements, interactions |
| **Constellation Canvas** | Canvas 2D API | Star rendering, animations |
| **Convex Client** | @convex/react | Real-time data sync, queries, mutations |

### Backend Layer

| Component | Technology | Responsibility |
|-----------|------------|----------------|
| **Queries** | Convex functions | Read operations, data fetching |
| **Mutations** | Convex functions | Write operations, data updates |
| **Actions** | Convex functions | External API calls (Claude, etc.) |
| **Database** | Convex (built-in) | Document storage, indexing |

### External Services

| Service | Purpose | Integration Point |
|---------|---------|-------------------|
| **Claude API** | TARS conversation, star extraction | Convex Action |
| **Clerk** | Authentication, user management | Middleware + Convex |
| **Vercel** | Hosting, CDN, deployment | Build + Deploy |

---

## Technology Stack Decision Matrix

### Frontend: Next.js 14

| Considered | Pros | Cons | Decision |
|------------|------|------|----------|
| **Next.js 14** | SSR, App Router, React ecosystem, Vercel optimized | Complexity for simple apps | **SELECTED** |
| Remix | Good routing, SSR | Less ecosystem momentum | Rejected |
| Vite + React | Simple, fast | No SSR by default | Rejected |
| SvelteKit | Performance | Smaller ecosystem, team unfamiliarity | Rejected |

**Rationale:** Next.js 14 provides SSR for SEO, App Router for clean structure, and excellent Vercel integration. Team already has React experience.

### Visualization: Canvas 2D

| Considered | Pros | Cons | Decision |
|------------|------|------|----------|
| **Canvas 2D** | Performant, flexible, good for animations | More manual work | **SELECTED** |
| SVG | Easy to style, DOM-integrated | Performance issues at scale | Fallback option |
| WebGL (Three.js) | 3D, very performant | Over-engineered for 2D stars | Rejected |
| Pixi.js | 2D optimized, WebGL | Additional dependency | Future option |

**Rationale:** Canvas 2D provides good performance for 50+ animated stars without the complexity of WebGL. Can upgrade to Pixi.js if needed.

### Backend: Convex

| Considered | Pros | Cons | Decision |
|------------|------|------|----------|
| **Convex** | Real-time sync, TypeScript, serverless, built-in DB | Vendor lock-in, newer | **SELECTED** |
| Supabase | Postgres, real-time, mature | More setup, less integrated | Strong alternative |
| Firebase | Real-time, mature | Verbose, Google dependency | Rejected |
| tRPC + Prisma | Type-safe, flexible | Self-hosted, more setup | Rejected |

**Rationale:** Convex provides real-time sync out of the box, which is valuable for constellation updates. TypeScript-first design reduces impedance mismatch. Simpler mental model than SQL for document-oriented data.

### AI: Claude API

| Considered | Pros | Cons | Decision |
|------------|------|------|----------|
| **Claude** | Better at nuance, longer context, structured output | Newer, less ecosystem | **SELECTED** |
| OpenAI GPT-4 | Mature, good ecosystem | Less nuanced, shorter context | Strong alternative |
| Gemini | Good context length | Less tested | Rejected |

**Rationale:** TARS requires nuanced conversation about personal topics. Claude excels at this. Structured output support enables reliable star extraction.

### Auth: Clerk

| Considered | Pros | Cons | Decision |
|------------|------|------|----------|
| **Clerk** | Magic links, easy setup, good UX | Cost at scale | **SELECTED** |
| Auth.js | Free, flexible | More setup | Alternative |
| Supabase Auth | Good if using Supabase | Not using Supabase | N/A |

**Rationale:** Magic link auth is core to the experience (no passwords for sensitive data). Clerk makes this trivial.

---

## Data Flow

### Conversation Flow

```
User types message
       │
       ▼
┌──────────────┐
│ Send mutation│
│ (saveMessage)│
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐
│ Convex DB    │────▶│ Claude Action│
│ (store msg)  │     │ (generate)   │
└──────────────┘     └──────┬───────┘
                            │
       ┌────────────────────┼────────────────────┐
       │                    │                    │
       ▼                    ▼                    ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Save response│     │ Extract stars│     │ Save stars   │
│  (mutation)  │     │   (Claude)   │     │  (mutation)  │
└──────────────┘     └──────────────┘     └──────────────┘
       │
       ▼
  Real-time sync to client
```

### Constellation Update Flow

```
Star created/updated
       │
       ▼
┌──────────────┐
│ Mutation     │
│ (saveStar)   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Convex DB    │
│ (write)      │
└──────┬───────┘
       │
       ▼
  Convex subscription triggers
       │
       ▼
┌──────────────┐
│ Client query │
│ (getStars)   │
└──────┬───────┘
       │
       ▼
  Canvas re-renders constellation
```

---

## Security Architecture

### Authentication Flow

```
User clicks "Sign In"
       │
       ▼
┌──────────────┐
│ Clerk UI     │
│ (email input)│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Clerk sends  │
│ magic link   │
└──────────────┘
       │
  User clicks email link
       │
       ▼
┌──────────────┐
│ Clerk verifies│
│ token        │
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐
│ Session      │────▶│ Convex auth  │
│ established  │     │ (user sync)  │
└──────────────┘     └──────────────┘
```

### Authorization

| Resource | Access Rule |
|----------|-------------|
| Stars | User can only access own stars |
| Connections | User can only access own connections |
| Messages | User can only access own messages |
| Journeys | User can only access own journeys |

Enforced in every Convex query/mutation via `ctx.auth.getUserIdentity()`.

---

## Key Design Decisions

### 1. Real-Time Constellation Updates

**Decision:** Stars appear in real-time during conversation, not after session.

**Rationale:** Creates emotional impact of watching constellation form. Requires real-time sync (Convex).

### 2. Server-Side Claude Calls

**Decision:** All Claude API calls happen server-side via Convex Actions.

**Rationale:** Protects API keys, enables response caching, allows for context management.

### 3. Canvas for Visualization

**Decision:** Use Canvas 2D API, not SVG or DOM elements.

**Rationale:** Performance at 50+ animated stars. DOM manipulation would be too slow.

### 4. Session-Based Context

**Decision:** TARS context includes last 50 messages + constellation summary, not full history.

**Rationale:** Claude context limits. Summarization preserves meaning while fitting limits.

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                           Vercel                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Edge Network                          │   │
│  │  ┌─────────────┐                    ┌─────────────────┐  │   │
│  │  │   CDN       │                    │   Edge Config   │  │   │
│  │  │ (static)    │                    │  (env vars)     │  │   │
│  │  └─────────────┘                    └─────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Serverless Functions                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │   │
│  │  │   SSR       │  │   API       │  │   Webhooks      │  │   │
│  │  │  (pages)    │  │  (routes)   │  │   (Clerk)       │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │     Convex      │
                    │   (Database +   │
                    │    Functions)   │
                    └─────────────────┘
```

---

## Environment Configuration

| Variable | Purpose | Location |
|----------|---------|----------|
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL | Vercel + local |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | Vercel + local |
| `CLERK_SECRET_KEY` | Clerk secret key | Vercel only |
| `ANTHROPIC_API_KEY` | Claude API key | Convex env |
