# Architectural Decision: Database & Agent Runtime

> **Context**: The Right Questions MVP (Agentic App)
> **Requirement**: "Shadow Loop" (Instant Tool -> UI Updates) + Agent Orchestration (Server Logic).
> **Status**: DECIDED (Convex)

---

## 1. The Landscape (2025)

We evaluated 5 architectures for building Real-time Agents.

| Option | Type | Real-time | Agent Suitability | Complexity |
|:---|:---|:---|:---|:---|
| **Convex** | BaaS (Graph-Relational) | Native (WebSocket) | **High** (Actions + Queues) | Low |
| **Supabase** | Postgres (SQL) | Add-on (Realtime) | Med (Edge Functions) | High |
| **InstantDB** | Client-First (Graph) | Native (Optimistic) | Low (Client-side heavy) | Low |
| **PartyKit** | Durable Objects | Native (Stateful) | **High** (Long-running) | Med |
| **ElectricSQL**| Local-First Postgres | Native (CRDT) | Med (Sync-based) | High |

---

## 2. Deep Dive: The Alternatives

### Option C: InstantDB (The "Firebase Killer")
*   **Pros**: Incredible optimistic UI. You write to the DB on the client, and it syncs magic.
*   **Cons for Agents**: It lacks a mature "Server-Side" environment.
    *   *The Problem*: TARS is a **Server Agent**. He needs to run `anthropic.streamText` on a secure server, keeping secrets safe. InstantDB forces too much logic into the client or requires a separate backend (e.g. Next.js API Routes) to talk to it, re-introducing the "Sync Tax".

### Option D: PartyKit (The "Stateful Agent")
*   **Pros**: Perfect for "Long-running Agents" (e.g., a Game Master that lives in memory for 24 hours).
*   **Cons**: Overkill. TARS is an "Episodic Agent" (Request/Response). We don't need a durable object keeping state in RAM. We just need a fast DB.
*   **Risk**: Smaller ecosystem than Convex.

### Option E: ElectricSQL (The "Local First")
*   **Pros**: True offline support.
*   **Cons**: Complexity. Setting up CRDTs and the Sync Service is a heavy lift for Sprint 0.

---

## 3. The Re-Affirmed Verdict: Convex

Why Convex beats the others for **this specific app**:

1.  **integrated Actions**: Convex allows us to run the Agent Logic (Vercel AI SDK) *right next to the data*.
    *   No separate "API Route" server needed.
    *   No separate "WebSocket Server" needed.
2.  **The "Mid-Stream Write"**:
    *   In Convex, the Agent can call `await ctx.runMutation(...)` *while* streaming the text.
    *   In Supabase/InstantDB, you'd have to make an external API call to the DB, adding latency.

### The Trade-off
We accept **Vendor Lock-in** to gain **Development Velocity**.
Scaling Strategy: If we outgrow Convex, we export the data to Postgres and build a custom sync layer (essentially re-building ElectricSQL).

**Decision**: **Convex** is the architecture.
