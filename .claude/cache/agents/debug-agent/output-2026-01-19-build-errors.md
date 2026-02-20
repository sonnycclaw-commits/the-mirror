# Debug Report: Build Errors in the-mirror Project
Generated: 2026-01-19

## Symptom
- `bun run dev` and `bun run build` reportedly not working
- 81 TypeScript errors from `npx tsc --noEmit`
- Recently added json-render integration with new files in `src/lib/json-render/`

## Investigation Steps

1. Ran `npx tsc --noEmit` to capture all TypeScript errors
2. Categorized errors by file
3. Analyzed json-render files for specific issues
4. Checked package.json and node_modules for json-render package
5. Reviewed tsconfig.json for strictness settings

## Evidence

### Error Categorization by File

| File | Error Count | Category |
|------|-------------|----------|
| `convex/discovery.ts` | 15 | Pre-existing |
| `src/lib/json-render/catalog.ts` | 6 | **New (json-render)** |
| `src/lib/ai/tools/index.ts` | 6 | Pre-existing (missing exports) |
| `src/lib/json-render/registry.tsx` | 5 | **New (json-render)** |
| `src/lib/discovery/prompt-builder.ts` | 3 | Pre-existing |
| `src/lib/discovery/density-monitor.ts` | 3 | Pre-existing |
| `e2e/session-recovery.spec.ts` | 3 | Pre-existing |
| `convex/signals.ts` | 3 | Pre-existing |
| `convex/profiles.ts` | 3 | Pre-existing |
| `convex/memoryGraph.ts` | 3 | Pre-existing |
| `convex/extraction.ts` | 3 | Pre-existing |
| Other files | ~28 | Mixed |

**Total: 81 errors**

### Error Breakdown

| Category | Count | % of Total |
|----------|-------|------------|
| **json-render integration** | 11 | 13.6% |
| **Pre-existing TypeScript strictness** | ~64 | 79% |
| **Missing exports (index.ts)** | 6 | 7.4% |

---

## Finding 1: json-render Import Error (CRITICAL)

- **Location:** `/Users/joelchan/Documents/Coding/App-Dev/live/unfuck-your-life/the-mirror/src/lib/json-render/registry.tsx:9`
- **Error:** `Module '"@json-render/react"' has no exported member named 'createRegistry'`
- **Observation:** The code imports `createRegistry` but the package exports `createRendererFromCatalog`

**Actual package exports (from `node_modules/@json-render/react/dist/index.d.ts`):**
```typescript
// Available exports (NO createRegistry):
export { createRendererFromCatalog, Renderer, ... }
```

**Current code:**
```typescript
import { createRegistry, Renderer as BaseRenderer } from '@json-render/react'
```

---

## Finding 2: Circular Type Reference in catalog.ts

- **Location:** `/Users/joelchan/Documents/Coding/App-Dev/live/unfuck-your-life/the-mirror/src/lib/json-render/catalog.ts:157-196`
- **Errors:**
  - Line 157: `'sectionSchema' implicitly has type 'any'`
  - Line 162: `Type alias 'SectionProps' circularly references itself`
  - Line 181: `'componentSchema' is referenced directly or indirectly in its own type annotation`
  - Line 196: `Type alias 'UIComponent' circularly references itself`

**Root cause:** The `sectionSchema` uses `z.lazy(() => componentSchema)` for nested children, but `componentSchema` includes `sectionSchema`, creating a circular reference that TypeScript cannot resolve without explicit type annotations.

**Current code:**
```typescript
// Line 157-162
export const sectionSchema = z.object({
  type: z.literal('Section'),
  title: z.string().optional(),
  children: z.array(z.lazy(() => componentSchema)),  // Circular!
})
export type SectionProps = z.infer<typeof sectionSchema>  // Circular type!

// Line 181-191
export const componentSchema: z.ZodType<UIComponent> = z.discriminatedUnion('type', [
  ...
  sectionSchema,  // References sectionSchema which references componentSchema
])

// Line 196-205
export type UIComponent = ... | SectionProps | ...  // Circular!
```

---

## Finding 3: Missing Exports in extract-signal.ts

- **Location:** `/Users/joelchan/Documents/Coding/App-Dev/live/unfuck-your-life/the-mirror/src/lib/ai/tools/index.ts:20-26`
- **Errors:**
  - `signalTypeSchema` not exported (Did you mean `signalStateSchema`?)
  - `signalSubtypeSchema` not exported
  - `SignalType` not exported
  - `SignalSubtype` not exported
  - `EmotionalContext` not exported
  - `NeedsAssessment` not exported (from synthesize-profile)

**Observation:** The `extract-signal.ts` file exports:
- `signalDomainSchema` (not `signalTypeSchema`)
- `signalStateSchema`
- `emotionalContextSchema`
- No `SignalType`, `SignalSubtype`, `EmotionalContext` types exported

These appear to be stale exports from a previous API design.

---

## Finding 4: exactOptionalPropertyTypes Strictness (PRE-EXISTING)

- **Location:** `/Users/joelchan/Documents/Coding/App-Dev/live/unfuck-your-life/the-mirror/tsconfig.json:30`
- **Setting:** `"exactOptionalPropertyTypes": true`
- **Impact:** ~50+ errors across the codebase

**Pattern:** Many errors follow this pattern:
```
Type 'X | undefined' is not assignable to type 'X'
```

These are caused by optional properties being assigned `undefined` instead of being omitted entirely. This is a strict TypeScript setting that was already in place.

**Example locations:**
- `convex/contracts.ts:76` - evidence property
- `convex/discovery.ts:109` - userRequestedAdvance property
- `convex/extraction.ts:35` - messageId property
- `src/components/discovery/DiscoveryInterface.tsx:57` - onAction property
- Many more...

---

## Finding 5: Unused Variable Warnings (PRE-EXISTING)

- **Locations:** Multiple files
- **Count:** ~10 errors
- **Examples:**
  - `convex/discovery.ts:36` - `getSlidingWindow` declared but never read
  - `convex/privacy.ts:8` - `Id` imported but never used
  - `src/lib/ai/tools/extract-signal.ts:20` - `EMOTIONAL_CONTEXTS` never read
  - Various e2e test files with unused variables

---

## Root Cause Analysis

### Primary Issue: json-render API Mismatch
The json-render integration uses `createRegistry` which does not exist in `@json-render/react@0.2.0`. The package exports `createRendererFromCatalog` instead.

**Confidence:** HIGH (verified by reading `node_modules/@json-render/react/dist/index.d.ts`)

### Secondary Issue: Circular Type References
The catalog.ts file has circular type references between `sectionSchema`, `componentSchema`, and `UIComponent` that TypeScript cannot resolve.

**Confidence:** HIGH (verified by reading the TypeScript errors)

### Pre-existing Issues
The majority of errors (~70) are pre-existing TypeScript strictness issues, primarily from `exactOptionalPropertyTypes: true` and unused imports/variables.

**Confidence:** HIGH (these errors are in files not related to json-render)

---

## Recommended Fixes

### Fix 1: Update json-render/registry.tsx Import

**File:** `/Users/joelchan/Documents/Coding/App-Dev/live/unfuck-your-life/the-mirror/src/lib/json-render/registry.tsx`

Change line 9 from:
```typescript
import { createRegistry, Renderer as BaseRenderer } from '@json-render/react'
```

To use the correct API from `@json-render/react`. Check the package documentation for `createRendererFromCatalog` usage pattern.

### Fix 2: Resolve Circular Types in catalog.ts

**File:** `/Users/joelchan/Documents/Coding/App-Dev/live/unfuck-your-life/the-mirror/src/lib/json-render/catalog.ts`

Options:
1. Define `UIComponent` type manually BEFORE the schemas
2. Use explicit type annotations on `sectionSchema` and `componentSchema`
3. Restructure to avoid the `z.lazy()` circular reference

### Fix 3: Update index.ts Exports

**File:** `/Users/joelchan/Documents/Coding/App-Dev/live/unfuck-your-life/the-mirror/src/lib/ai/tools/index.ts`

Remove non-existent exports or add them to extract-signal.ts:
- Remove: `signalTypeSchema`, `signalSubtypeSchema`, `SignalType`, `SignalSubtype`, `EmotionalContext`
- Or: Add these exports to `extract-signal.ts` if they're needed

### Fix 4: Address exactOptionalPropertyTypes Errors (Lower Priority)

These are pre-existing and not blocking the build necessarily. Options:
1. Fix each assignment to not include `undefined` for optional properties
2. Temporarily set `exactOptionalPropertyTypes: false` in tsconfig.json (not recommended)

---

## Summary

| Issue | Impact | Effort | Priority |
|-------|--------|--------|----------|
| json-render API mismatch | Blocks build | Medium | P0 |
| Circular types in catalog.ts | Blocks build | Medium | P0 |
| Missing exports in index.ts | Blocks build | Low | P1 |
| exactOptionalPropertyTypes errors | Type errors | High | P2 |
| Unused variables | Warnings | Low | P3 |

**json-render changes account for ~11 of 81 errors (13.6%).**
The remaining ~70 errors (86.4%) are pre-existing TypeScript strictness issues.

---

## Prevention

1. Run `npx tsc --noEmit` before committing new integrations
2. Check package exports with `grep export node_modules/@package/dist/index.d.ts` before using APIs
3. Consider adding a pre-commit hook for TypeScript checking
