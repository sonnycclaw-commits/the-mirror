# Sprint 7: Review & Debt Findings

## S7-T01: Implementation Review ✓

**Status: PASS**

| Area | Status | Notes |
|------|--------|-------|
| Tool definitions | ✓ | 4/4 match PRD specs |
| Convex schema | ✓ | All 9 tables present with proper indexes |
| Phase machine | ✓ | 4 phases, hard triggers, validation |
| Streaming | ✓ | useDiscovery integrates with Convex |

**Minor note**: Phase names evolved (FOLLOW_UP→EXCAVATION, REFLECTION→SYNTHESIS)

---

## S7-T02: Code Quality Review

**Status: NEEDS ATTENTION**

### TypeScript Errors: 40 total

**By Category:**
- `exactOptionalPropertyTypes` issues: ~15 (Convex strict mode)
- Unused variables: ~8
- Implicit `any` types: ~7
- Route type mismatches: ~5 (TanStack Router regeneration needed)
- Other: ~5

**Critical files with issues:**
- `convex/discovery.ts` - Multiple `any` types in signal filtering
- `convex/extraction.ts` - Optional property handling
- `convex/contracts.ts` - Optional evidence field
- `src/lib/discovery/prompt-builder.ts` - Undefined handling

**Recommendation**: Run dev server to regenerate routes, then fix `any` types

### Error Handling
- ✓ useDiscovery has try/catch
- ✓ Convex actions have error handling
- ⚠️ Some background extraction errors silently logged

### Test Coverage
- E2E tests: 6 spec files covering functional, performance, accessibility, mobile
- Unit tests: Limited (tool schemas have inline tests)
- **Gap**: No unit tests for phase machine, density monitor

---

## S7-T03: Performance Review

**Status: DOCUMENTED (needs runtime verification)**

| Metric | Target | Implementation |
|--------|--------|----------------|
| Initial load | <2s | ✓ Vite dev, code splitting |
| First token | <500ms | Depends on Anthropic API |
| Bundle size | <200KB gzipped | Needs measurement |
| Memory leaks | None | ✓ No obvious leaks in MessageList |
| Convex indexes | All queries | ✓ All tables indexed |

**Re-render optimization:**
- MessageList maps over messages - could memoize individual bubbles
- PhaseProgress re-renders on phase change only

---

## S7-T04: UI Review

**Status: PASS**

| Constraint | Status |
|------------|--------|
| Touch targets ≥44px | ✓ All buttons use min-h-[44px] |
| Focus rings | ✓ focus-visible:ring-2 on all interactive |
| ARIA attributes | ✓ Roles, labels, live regions |
| Motion <200ms | ✓ Framer motion defaults |
| prefers-reduced-motion | ✓ motion-reduce: classes |
| Responsive 375-1920px | ✓ Tested in E2E |

---

## S7-T05: User Debt Review

**Status: DOCUMENTED**

### Critical Debt
1. **No signal visualization** - Users can't see extracted patterns
2. **No contract editing** - Once generated, can't modify
3. **No session history** - Can't revisit past discoveries

### Medium Debt
4. **Hard-coded limits** - 12 signal threshold, no config
5. **No export** - Can't download contract
6. **No data deletion** - GDPR concern

### Low Debt
7. **Demo routes** - Unused TanStack demo files
8. **No onboarding** - First-time UX unclear

---

## S7-T06: UX Review

**Status: REQUIRES USER TESTING**

### Documented Concerns
1. **Cognitive load** - Multiple options per question, no "back" button
2. **Pacing** - AI response time varies, no progress indicator during thinking
3. **Trust** - No explanation of what signals are being extracted
4. **Value timing** - Contract at end, no intermediate insights
5. **Emotional arc** - Phases don't have distinct "feel"

### Recommendations
- Add "thinking" animation with phase-appropriate messaging
- Show signal count or progress toward synthesis
- Allow contract preview before final generation

---

## Summary

| Review | Status | Critical Issues |
|--------|--------|-----------------|
| S7-T01 Implementation | ✓ PASS | None |
| S7-T02 Code Quality | ⚠️ NEEDS FIX | 40 TS errors, no unit tests |
| S7-T03 Performance | ⏳ VERIFY | Needs runtime measurement |
| S7-T04 UI | ✓ PASS | Minor: memoization opportunity |
| S7-T05 User Debt | 📝 DOCUMENTED | 8 items logged |
| S7-T06 UX | 👥 NEEDS TESTING | 5 concerns documented |
