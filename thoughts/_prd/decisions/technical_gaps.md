# Technical Gap Analysis: The Missing Full-Stack Elements

> **Context**: The Right Questions MVP
> **Objective**: Identify vague areas in the PRD regarding Routing, API, and SSR.
> **Status**: VERIFIED & RESOLVED

---

## 1. The SSR Strategy (TanStack Start + Convex)

**The Gap**: Convex is primarily a client-side subscription engine (`useQuery`). TanStack Start is a full-stack SSR framework.
**The Risk**: If we try to "SSR everything" with Convex, we lose the real-time reactivity or over-complicate hydration.

### The Solution: Hybrid SSR

| Route | Strategy | Rationale |
|:---|:---|:---|
| `/` (Landing) | **SSR** | SEO is critical. Content is static. |
| `/chat` (The App) | **Client-Side** | Heavily dynamic. Auth walled. "Skeleton" is SSR, content is WebSocket. |
| `/contract/:id` | **SSR** | Must be indexable and shareable (OpenGraph tags). |

**Verified Pattern**:
*   For `/contract/:id`: Use `createServerFn` to fetch the Contract JSON via `fetchMutation` (Convex HTTP Client) and render `<meta>` tags.

---

## 2. Authentication Handshake (Clerk -> Convex)

**The Gap**: Integrating Clerk with Convex in a React/SSR environment requires specific token passing.
**The Risk**: Auth failure on WebSocket connection.

### The Solution: "ConvexProviderWithClerk"
**Prerequisite**:
1.  Go to Clerk Dashboard -> JWT Templates.
2.  Create New Template -> Select "Convex".
3.  Name it `convex` (Lowercase). This is CRITICAL.

**Client Pattern (`__root.tsx`)**:
```typescript
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/clerk-react";

function Root() {
  return (
    <ClerkProvider publishableKey={...}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <Outlet />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}
```

**Server Pattern (`createServerFn`)**:
Use `getAuth` to validate identity before fetching data from Convex on the server.
```typescript
const { userId } = getAuth(request);
const token = await getToken({ template: 'convex' });
// Pass token to Convex HTTP Client
```

---

## 3. Route Architecture

**The Gap**: The PRD doesn't define the URL structure.

### The Sitemap
*   `/` -> `src/routes/index.tsx` (Marketing)
*   `/sign-in` -> `src/routes/sign-in.tsx` (Clerk Auth)
*   `/chat` -> `src/routes/chat.tsx` (The App - Protected)
    *   `src/routes/chat/_layout.tsx` (Auth Guard)
*   `/contract/$id` -> `src/routes/contract.$id.tsx` (Public/Read-Only)

---

## 4. Middleware & Edge

**The Gap**: Where do we handle redirects (e.g., Unauth user hitting `/chat`)?

### The Solution: Route Guards
We use **TanStack Router `beforeLoad`**:
```typescript
// src/routes/chat/_layout.tsx
export const Route = createFileRoute('/chat/_layout')({
  beforeLoad: async ({ context }) => {
    // Check local auth state or wait for Clerk load
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/sign-in' })
    }
  }
})
```

---

## 5. Deployment target

**The Gap**: Are we deploying Node or Edge?
**The Solution**: **Node.js (Vercel)**.
*   *Why?* Convex HTTP Actions are V8, but TanStack Start is happiest on Node for now (ecosystem compatibility). We don't need Edge for the frontend shell.

---

## Action Plan
1.  **Configure Clerk Template**: Create `convex` JWT template immediately.
2.  **Install `convex/react-clerk`**: Ensure this package is identifying in Sprint 0 tasks.
