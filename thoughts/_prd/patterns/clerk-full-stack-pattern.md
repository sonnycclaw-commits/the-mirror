# Pattern: Clerk Full-Stack Architecture (TanStack Start)
> **Status**: APPROVED
> **Context**: The Right Questions MVP
> **Source**: User Skill + Verification

---

## 1. The Core Philosophy
1.  **Fail Fast (Server)**: The `clerkMiddleware` runs *before* any request handler. Validation happens at the edge/entry.
2.  **Sync State (Client)**: The `ConvexProviderWithClerk` keeps the WebSocket authenticated.
3.  **Bypass Bot Defense (Test)**: E2E uses testing tokens.

---

## 2. Server-Side Protection (The "Gatekeeper")

**Requirement**: "You cannot bypass authentication inside the middleware callback."

### 2.1 Configuration (`src/app.tsx` or `src/start.ts`)
We use `@clerk/tanstack-start` to wrap the entire request validation.

```typescript
// src/entry-server.tsx
import { createStartHandler } from '@tanstack/start/server'
import { clerkMiddleware } from '@clerk/tanstack-start/server'

export default createStartHandler({
  createRouter,
  getRouterManifest,
  // CRITICAL: Middleware runs BEFORE custom handlers
  middleware: [
    clerkMiddleware((auth, event) => {
      // 1. Check Public Routes
      if (isPublic(event.request.url)) return;

      // 2. Fail Fast
      if (!auth().userId) {
        throw auth().redirectToSignIn();
      }
    })
  ]
})
```

### 2.2 Server Functions (`createServerFn`)
Even with middleware, explicit checks in handlers are good defense-in-depth.

```typescript
import { getAuth } from '@clerk/tanstack-start/server'

export const submitContract = createServerFn('POST', async (payload) => {
    // This reads the validated state from middleware
    const { userId } = await getAuth(getRequest());
    if (!userId) throw new Error("Unauthorized");
    // ...
})
```

---

## 3. Client-Side Integration (The "Bridge")

**Requirement**: "Frontend SDK manages client state."

### 3.1 The Handshake
```typescript
// src/routes/__root.tsx
import { ClerkProvider } from "@clerk/tanstack-start";
import { ConvexProviderWithClerk } from "convex/react-clerk";

function Root() {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <Outlet />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}
```

### 3.2 JWT Template (CRITICAL)
*   **Location**: Clerk Dashboard -> JWT Templates
*   **Name**: `convex` (lowercase)
*   **Claims**: Standard Clerk claims.

---

## 4. Testing Strategy (The "Magic Users")

**Requirement**: "Bot traffic detected" fix.

### 4.1 The Magic Email (`+clerk_test`)
*   **Pattern**: `anyname+clerk_test@trq.app`
*   **Reason**: Bypasses email verification. Code is always `424242`.

### 4.2 The Testing Token
*   **Reason**: Bypasses bot detection in CI/Headless.
*   **Code**: `await page.goto('/sign-in?__clerk_testing_token=' + token)`

---

## 5. Deployment Checklist
1.  [ ] Install `@clerk/tanstack-start`
2.  [ ] Install `convex/react-clerk`
3.  [ ] Create `convex` JWT Template
4.  [ ] Create `e2e+clerk_test_admin@trq.app` user
