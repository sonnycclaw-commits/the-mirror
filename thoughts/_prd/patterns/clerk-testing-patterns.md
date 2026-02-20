# Pattern: Clerk Authentication & Testing mechanics
> **Status**: VERIFIED
> **Context**: E2E Testing Strategy (Playwright)
> **Source**: User Provided Skill

---

## 1. The Critical Challenge: Testing Auth
Automated browsers (Playwright) are often blocked by:
1.  **Bot Detection**: Clerk blocks headless browsers.
2.  **Email Verification**: CI runners cannot check Gmail.
3.  **2FA**: OTP codes change every time.

## 2. The Solution: "Magic Test Users"

### 2.1 The Magic Email (`+clerk_test`)
Use this suffix for ALL test accounts.
*   **Format**: `anyname+clerk_test@anydomain.com`
*   **Behavior**: Clerk treats these as "Test Users".
*   **Magic Code**: The verification code is ALWAYS the same (defined in your Clerk Instance settings, typically `424242`).

**Action**: Create these users in Production/Dev instances immediately.
*   `e2e+clerk_test_admin@trq.app`
*   `e2e+clerk_test_user@trq.app`

### 2.2 The Testing Token (Bypassing Bot Defense)
You cannot just `page.click('Sign In')`. You must inject a token.

```typescript
// tests/e2e/auth.setup.ts
import { createClerkClient } from '@clerk/backend';

// 1. Generate Token
const client = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
const { token } = await client.testingTokens.createTestingToken();

// 2. Bypass
await page.goto(`/sign-in?__clerk_testing_token=${token}`);
```

## 3. SSR Authentication Flow

### Browser (Client)
*   **SDK**: `@clerk/clerk-react`
*   **Storage**: Sets `__session` cookie.

### Server (TanStack Start)
*   **Middleware**: `beforeLoad` in Router.
*   **Validation**:
    ```typescript
    // src/routes/_layout.tsx
    beforeLoad: async ({ context }) => {
        const { userId } = getAuth(context.request);
        if (!userId) throw redirect({ to: '/sign-in' });
    }
    ```

## 4. CI/CD Pipeline Config
To make this work in GitHub Actions:

```yaml
env:
  # The Magic Email
  TEST_USER_EMAIL: e2e+clerk_test_user@trq.app
  TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}
  # The Magic Code (Fixed)
  CLERK_TEST_CODE: 424242
```
