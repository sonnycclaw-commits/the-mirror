# Test Strategy

**Section:** 5-validation
**Status:** Draft

---

## Testing Philosophy

> Test what matters. Skip what doesn't.

For MVP, focus on:
1. **Core user journeys** (conversation, constellation, reveal)
2. **Data integrity** (stars saved correctly)
3. **External integrations** (Claude, Clerk)

---

## Testing Levels

### Unit Tests

**Coverage Target:** 70% of business logic
**Framework:** Vitest
**Focus:**

| Area | What to Test |
|------|-------------|
| Star calculations | Brightness updates, state transitions |
| Position math | Polar coordinate conversion |
| Phase calculation | Correct phase from star states |
| Validation | Input validation functions |

**What NOT to unit test:**
- UI components (covered by E2E)
- Convex functions (covered by integration)
- Third-party libraries

---

### Integration Tests

**Coverage Target:** All Convex functions
**Framework:** Convex test utilities
**Focus:**

| Test | What It Verifies |
|------|-----------------|
| `users.create` | User creation with correct defaults |
| `messages.send` + `tars.respond` | Full message flow, Claude response saved |
| `stars.create` + `getAll` | Star creation and retrieval |
| Auth flow | Clerk user → Convex user sync |

**Pattern:**
```typescript
import { convexTest } from "convex-test";
import { test, expect } from "vitest";
import schema from "./schema";

test("create user with correct defaults", async () => {
  const t = convexTest(schema);
  const userId = await t.mutation(api.users.create, {
    clerkId: "test_clerk_123",
    email: "test@example.com",
  });
  const user = await t.query(api.users.get, { userId });
  expect(user.currentPhase).toBe("onboarding");
  expect(user.mirrorDay).toBe(0);
});
```

---

### E2E Tests

**Framework:** Playwright
**Coverage:** Critical paths only

| Test | Steps | Expected |
|------|-------|----------|
| Sign up flow | Visit → Enter email → Click link → Welcome | User on welcome screen |
| First conversation | Send message → See response | TARS responds <5s |
| Star appears | Complete questions → Star triggers | Star visible on constellation |
| Birth Chart | Complete Day 7 → Reveal | Animation plays, narration shown |

**Not in E2E (manual instead):**
- Birth Chart animation quality
- Star visual appearance
- Emotional resonance

---

### Manual Testing

| What | How | Who |
|------|-----|-----|
| TARS conversation quality | Test conversations, review responses | Developer |
| Star extraction accuracy | Review extracted stars vs. conversation | Developer |
| Constellation visual | Visual inspection | Developer + Design |
| Mobile experience | Test on real devices | Developer |
| Birth Chart reveal | Watch full reveal | Developer + Pilot users |

**Checklist before each deployment:**
- [ ] Complete Day 1 conversation on mobile
- [ ] Check star appears correctly
- [ ] View constellation, tap star
- [ ] Test sign-out/sign-in

---

## Quality Gates

### Before Merge to Main

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] No TypeScript errors
- [ ] Lint passes
- [ ] Preview deployment works

### Before Pilot Launch

- [ ] All E2E tests pass
- [ ] Full 7-day journey tested manually
- [ ] Mobile tested on iOS + Android
- [ ] Birth Chart reveal reviewed
- [ ] Error handling tested (network off, API errors)

---

## Test Data

### Seed Data for Testing

```typescript
// Fixture: User with 5 stars
const testUser = {
  clerkId: "test_123",
  email: "test@example.com",
  currentPhase: "mirror",
  mirrorDay: 3,
  stars: [
    { label: "Morning energy", domain: "health", type: "flickering" },
    { label: "Creative output", domain: "purpose", type: "nascent" },
    // ...
  ],
};
```

### Mock Claude Responses

For integration tests:
```typescript
vi.mock("@anthropic-ai/sdk", () => ({
  default: class {
    messages = {
      create: vi.fn().mockResolvedValue({
        content: [{ text: "TARS mock response" }],
      }),
    };
  },
}));
```

---

## Regression Testing

**When to run full suite:**
- Before pilot launch
- After major refactors
- After updating dependencies

**Automated via CI:**
- Unit + Integration on every PR
- E2E on merge to main
